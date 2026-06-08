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

// Dynamic CORS Middleware Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://texify-nine.vercel.app", // Keeps your old link safe just in case
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
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
