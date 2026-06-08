const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";
const TARGET_DOMAIN = "@students.iiests.ac.in";

const sendTokenCookie = (userId, res, statusCode, message, userPayload) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "24h" });

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // Must be true if sameSite is "none"
    sameSite: isProduction ? "none" : "lax", // "none" allows Vercel -> Render communication
    maxAge: 24 * 60 * 60 * 1000,
  };

  res.cookie("token", token, cookieOptions);

  return res.status(statusCode).json({
    message,
    user: userPayload,
  });
};
return res.status(statusCode).json({
  message,
  user: userPayload,
});

// PASSPORT GOOGLE STRATEGY INITIALIZATION

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER_CLIENT_ID",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER_CLIENT_SECRET",
      callbackURL: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false, {
            message: "No email returned from Google profile.",
          });
        }

        // 🚀 ENFORCED INSTITUTIONAL DOMAIN BOUNDARY CHECK
        if (!email.toLowerCase().endsWith(TARGET_DOMAIN)) {
          return done(null, false, {
            message: `Access denied. System validation requires an official ${TARGET_DOMAIN} ID.`,
          });
        }

        // Search for an existing record matching this verified address
        let userCheck = await db.query("SELECT * FROM users WHERE email = $1", [
          email.toLowerCase(),
        ]);
        let user;

        if (userCheck.rows.length === 0) {
          // Provision a secure row profile seamlessly if it is their first time signing in
          const insertQuery = `
            INSERT INTO users (email, password_hash) 
            VALUES ($1, $2) 
            RETURNING id, email, created_at;
          `;
          // Explicitly mark password hash fields as null or randomized strings for federated external OAuth records
          const result = await db.query(insertQuery, [
            email.toLowerCase(),
            "OAUTH_FEDERATED_ACCOUNT",
          ]);
          user = result.rows[0];
        } else {
          user = userCheck.rows[0];
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

// 1. USER REGISTRATION (SIGN UP)

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password." });
    }

    if (!email.toLowerCase().endsWith(TARGET_DOMAIN)) {
      return res.status(403).json({
        error: `Access denied. You must register using your official student G-Suite ID (${TARGET_DOMAIN}).`,
      });
    }

    const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        error: "This email is already registered. Please login instead.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const insertQuery = `
      INSERT INTO users (email, password_hash) 
      VALUES ($1, $2) 
      RETURNING id, email, created_at;
    `;
    const result = await db.query(insertQuery, [
      email.toLowerCase(),
      hashedPassword,
    ]);
    const newUser = result.rows[0];

    // Deliver authentication validation down through secure cookies instead of open json parameters
    return sendTokenCookie(
      newUser.id,
      res,
      201,
      "User registered successfully!",
      {
        id: newUser.id,
        email: newUser.email,
        created_at: newUser.created_at,
      },
    );
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 2. USER LOGIN (SIGN IN)

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password." });
    }

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = result.rows[0];

    // Catch situations where federated OAuth profile users attempt legacy manual text password forms
    if (user.password_hash === "OAUTH_FEDERATED_ACCOUNT") {
      return res.status(401).json({
        error: "Please sign in using your official Student Google ID button.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    return sendTokenCookie(user.id, res, 200, "Login successful!", {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 3. SUCCESSFUL GOOGLE OAUTH REDIRECT CALLBACK RESOLVER

const handleGoogleSuccess = (req, res) => {
  // Passport passes verified profile database user configurations inside req.user automatically
  const user = req.user;

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Redirect the main viewport safely straight back into the live frontend app ecosystem dashboard
  res.redirect(
    `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard`,
  );
};

// 4. VERIFY SESSION USER PROFILE

const verifyMe = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, email, created_at FROM users WHERE id = $1",
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User no longer exists." });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error("Verify Me Error:", err);
    res
      .status(500)
      .json({ error: "Internal server error during session recovery." });
  }
};

// 5. SECURE SESSION TERMINATION (LOGOUT)

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully." });
};

module.exports = {
  registerUser,
  loginUser,
  verifyMe,
  logoutUser,
  handleGoogleSuccess,
};
