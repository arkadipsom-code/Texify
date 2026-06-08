const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

const protectRoute = (req, res, next) => {
  let token = null;

  // 1. Primary Check: Extract the token from secure HttpOnly cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback Check: Check the Authorization header (Format: Bearer <token>)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Data Guard: If token is missing or a literal leak string like "null" / "undefined"
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({
      error: "Access denied. No authentication session found. Please sign in.",
    });
  }

  // uncomment for local testing if needed:
  // console.log("DEBUG -> Token received by middleware:", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attaches { id: userId } to the request object for use down the line
    next();
  } catch (err) {
    console.error("JWT Middleware Verification Error:", err.message);

    // Cold Boot Clean up: Evict the broken cookie so the browser stops spamming it
    if (req.cookies && req.cookies.token) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return res.status(403).json({
      error:
        "Invalid or expired session token. Workspace authentication state reset.",
    });
  }
};

module.exports = protectRoute;
