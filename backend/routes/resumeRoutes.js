const express = require("express");
const router = express.Router();
const {
  getUserResumes,
  createResume,
  updateResume,
  getResumeById,
  compileLatex,
  deleteResume,
} = require("../controllers/resumeController");
const protectRoute = require("../middleware/authMiddleware");

// All resume routes run through our token protector first
router.get("/", protectRoute, getUserResumes);
router.post("/", protectRoute, createResume);
router.put("/:id", protectRoute, updateResume);
router.get("/:id", protectRoute, getResumeById);
router.post("/compile", protectRoute, compileLatex);
router.delete("/:id", protectRoute, deleteResume);
module.exports = router;
