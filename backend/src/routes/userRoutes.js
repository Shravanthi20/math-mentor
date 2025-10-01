const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  getProfile,
  getHistory,
} = require("../controllers/userController");
const protect = require("../middleware/auth");

router.post("/register", signupUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/history", protect, getHistory);

module.exports = router;
