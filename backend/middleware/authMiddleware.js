const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

const protectRoute = (req, res, next) => {
  let token = null;

  // 1. Primary Check for Production: Check the Authorization header first (Format: Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2. Fallback Check: Extract the token from cookies (great for local testing)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Data Guard: If token is missing or a literal leak string like "null" / "undefined"
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({
      error: "Access denied. No authentication session found. Please sign in.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attaches { id: userId } to the request object for use down the line
    next();
  } catch (err) {
    console.error("JWT Middleware Verification Error:", err.message);

    // Cold Boot Clean up: Evict the broken cookie if it exists so the browser stops spamming it
    if (req.cookies && req.cookies.token) {
      const isProduction = process.env.NODE_ENV === "production";
      res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });
    }

    return res.status(403).json({
      error:
        "Invalid or expired session token. Workspace authentication state reset.",
    });
  }
};

module.exports = protectRoute;
