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

// CRUCIAL FOR DEPLOYMENT: Tell Express to trust Render's reverse proxy load balancers.
// This ensures that 'secure: true' cookies are allowed to pass through over HTTPS.
app.set("trust proxy", 1);

// Middleware Configuration

// Dynamic CORS Middleware Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://texify-nine.vercel.app", // Your live Vercel production frontend
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
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

app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "Server is awake and responding!" });
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
