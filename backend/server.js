require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const db = require("./config/db");
const { initDatabase } = require("./models/Resume");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

// Middleware Configuration

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.text());

// Initialize Passport Context
app.use(passport.initialize());

// Base API Routes Mounting
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);

// Check Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Texify API! Kitchen is open and ready." });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`Server successfully launched on: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "Critical System Boot Failure: Could not build backend environment.",
      error,
    );
    process.exit(1);
  }
};

startServer();
