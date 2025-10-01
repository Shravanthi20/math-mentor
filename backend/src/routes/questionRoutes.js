const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  generateProblem,
  submitAnswer,
  getHistory,
} = require("../controllers/problemController");

router.get("/", protect, generateProblem);      // fetch a random problem
router.put("/history", protect, submitAnswer);  // submit answer
router.get("/history", protect, getHistory);    // get user history

module.exports = router;
