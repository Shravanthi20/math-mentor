const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

const requireTeacher = async (req, res, next) => {
  // req.user should contain userId/email from token
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.userId).select("role");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "teacher" && user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: teacher access required" });
    }
    next();
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = Object.assign(protect, { requireTeacher });
