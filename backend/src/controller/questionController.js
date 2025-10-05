const User = require("../models/User");
const Question = require("../models/Question");

// ------------------- GENERATE PROBLEM -------------------
exports.generateProblem = async (req, res) => {
  try {
    const { mode = 'random', topic, difficulty } = req.query;
    const filter = {};
    if (mode === 'topic' && topic) filter.topic = topic;
    if (mode === 'difficulty' && difficulty) filter.difficulty = Number(difficulty);

    const questions = await Question.find(filter).select("-__v");
    if (!questions || questions.length === 0)
      return res.status(404).json({ message: "No questions found" });

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

    // Add answer to history (ensure string type for problem field)
    user.history.push({
      problem: String(question.question),
      userAnswer,
      correct,
      topic: question.topic,
    });

    // Update score per topic
    const currentScore = user.scores.get(question.topic) || 0;
    if (correct) user.scores.set(question.topic, currentScore + 1);

    // Track streaks and totals
    user.totalAnswered = (user.totalAnswered || 0) + 1;
    user.correctCount = (user.correctCount || 0) + (correct ? 1 : 0);
    const prevStreak = user.currentStreak || 0;
    user.currentStreak = correct ? prevStreak + 1 : 0;
    user.maxStreak = Math.max(user.maxStreak || 0, user.currentStreak);

    await user.save();

    const scoresObj = user.scores instanceof Map ? Object.fromEntries(user.scores) : user.scores;
    res.status(200).json({
      message: "Answer submitted",
      correct,
      history: user.history,
      scores: scoresObj,
      currentStreak: user.currentStreak,
      maxStreak: user.maxStreak,
      totalAnswered: user.totalAnswered,
      correctCount: user.correctCount,
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

// ------------------- GET TOPICS -------------------
exports.getTopics = async (_req, res) => {
  try {
    const topics = await Question.distinct('topic');
    res.status(200).json({ topics });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
