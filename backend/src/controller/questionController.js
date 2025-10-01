const User = require("../models/User");
const Question = require("../models/Question");

// ------------------- GENERATE PROBLEM -------------------
exports.generateProblem = async (req, res) => {
  try {
    // Fetch all questions or filter by topic/difficulty if needed
    const questions = await Question.find().select("-__v");

    if (!questions || questions.length === 0)
      return res.status(404).json({ message: "No questions found" });

    // Pick a random question
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];

    res.status(200).json({
      _id: question._id,
      question: question.question,
      difficulty: question.difficulty,
      topic: question.topic,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------- SUBMIT ANSWER -------------------
exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const correct = question.answer === userAnswer;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Add answer to history
    user.history.push({
      problem: question.question,
      userAnswer,
      correct,
      topic: question.topic,
    });

    // Update score per topic
    const currentScore = user.scores.get(question.topic) || 0;
    if (correct) user.scores.set(question.topic, currentScore + 1);

    await user.save();

    res.status(200).json({
      message: "Answer submitted",
      correct,
      history: user.history,
      scores: Object.fromEntries(user.scores),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------- GET USER HISTORY -------------------
exports.getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      history: user.history,
      scores: Object.fromEntries(user.scores),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
