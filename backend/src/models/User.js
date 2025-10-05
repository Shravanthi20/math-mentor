const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    history: [
      {
        problem: { type: String, required: true },
        userAnswer: { type: String, required: true },
        correct: { type: Boolean, required: true },
        topic: {type: String, required: true},
      },
    ],
    scores: {
      type: Map,
      of: Number,
      default: {},
    },
    currentStreak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    totalAnswered: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
