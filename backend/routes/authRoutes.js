const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  registerUser,
  loginUser,
  verifyMe,
  logoutUser,
  handleGoogleSuccess,
} = require("../controllers/authController");
const protectRoute = require("../middleware/authMiddleware");

// Standard Email/Password endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protectRoute, verifyMe);
router.post("/logout", logoutUser);

// GOOGLE OAUTH PIPELINE ENDPOINTS

// 1. Kick off the authorization redirection flow to Google's sign-in servers
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// 2. Target redirect hook for incoming token exchanges from Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=oauth_failed`,
  }),
  handleGoogleSuccess,
);

module.exports = router;
