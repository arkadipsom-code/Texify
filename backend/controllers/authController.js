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

  const isRenderProduction =
    process.env.BACKEND_URL && process.env.BACKEND_URL.includes("onrender.com");

  const cookieOptions = {
    httpOnly: true,
    secure: isRenderProduction ? true : false,
    sameSite: isRenderProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  };

  res.cookie("token", token, cookieOptions);

  // Added token directly to the JSON response body
  return res.status(statusCode).json({
    message,
    token,
    user: userPayload,
  });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER_CLIENT_ID",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER_CLIENT_SECRET",
      callbackURL: "/api/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false, {
            message: "No email returned from Google profile.",
          });
        }

        if (!email.toLowerCase().endsWith(TARGET_DOMAIN)) {
          return done(null, false, {
            message: `Access denied. System validation requires an official ${TARGET_DOMAIN} ID.`,
          });
        }

        let userCheck = await db.query("SELECT * FROM users WHERE email = $1", [
          email.toLowerCase(),
        ]);
        let user;

        if (userCheck.rows.length === 0) {
          const insertQuery = `
            INSERT INTO users (email, password_hash) 
            VALUES ($1, $2) 
            RETURNING id, email, created_at;
          `;
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

const handleGoogleSuccess = (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });

  const isRenderProduction =
    process.env.BACKEND_URL && process.env.BACKEND_URL.includes("onrender.com");

  res.cookie("token", token, {
    httpOnly: true,
    secure: isRenderProduction ? true : false,
    sameSite: isRenderProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Appends token as query parameter so frontend dashboard can catch it on cross-domain callback redirects
  const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  res.redirect(`${frontendBaseUrl}/dashboard?token=${token}`);
};

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

const logoutUser = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
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
