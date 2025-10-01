const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// ------------------- SIGNUP -------------------
exports.signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------- LOGIN -------------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------- GET PROFILE -------------------
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------- GET HISTORY -------------------
exports.getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("history scores");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ history: user.history, scores: Object.fromEntries(user.scores) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
