const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("./models/Question"); // adjust path
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Sample questions
const questions = [
  // ------------------- Arithmetic -------------------
  { question: "2+2", answer: "4", difficulty: 1, topic: "Arithmetic" },
  { question: "5-3", answer: "2", difficulty: 1, topic: "Arithmetic" },
  { question: "6*7", answer: "42", difficulty: 2, topic: "Arithmetic" },
  { question: "12/4", answer: "3", difficulty: 1, topic: "Arithmetic" },
  { question: "15+27", answer: "42", difficulty: 2, topic: "Arithmetic" },
  { question: "9*8", answer: "72", difficulty: 2, topic: "Arithmetic" },
  { question: "50-17", answer: "33", difficulty: 2, topic: "Arithmetic" },
  { question: "81/9", answer: "9", difficulty: 1, topic: "Arithmetic" },
  { question: "7+6", answer: "13", difficulty: 1, topic: "Arithmetic" },
  { question: "14-8", answer: "6", difficulty: 1, topic: "Arithmetic" },

  // ------------------- Algebra -------------------
  { question: "x + 3 = 5, x=?", answer: "2", difficulty: 2, topic: "Algebra" },
  { question: "2x = 8, x=?", answer: "4", difficulty: 2, topic: "Algebra" },
  { question: "3x+5=11, x=?", answer: "2", difficulty: 3, topic: "Algebra" },
  { question: "5x-10=0, x=?", answer: "2", difficulty: 2, topic: "Algebra" },
  { question: "x/2=7, x=?", answer: "14", difficulty: 3, topic: "Algebra" },
  { question: "4x+1=13, x=?", answer: "3", difficulty: 3, topic: "Algebra" },
  { question: "x-5=0, x=?", answer: "5", difficulty: 2, topic: "Algebra" },
  { question: "2x+7=15, x=?", answer: "4", difficulty: 2, topic: "Algebra" },
  { question: "x/5=3, x=?", answer: "15", difficulty: 3, topic: "Algebra" },
  { question: "3x-4=11, x=?", answer: "5", difficulty: 3, topic: "Algebra" },

  // ------------------- Geometry -------------------
  { question: "Triangle sum of angles?", answer: "180", difficulty: 1, topic: "Geometry" },
  { question: "Square area with side 4?", answer: "16", difficulty: 1, topic: "Geometry" },
  { question: "Circle circumference radius 7?", answer: "44", difficulty: 2, topic: "Geometry" },
  { question: "Rectangle area 5x6?", answer: "30", difficulty: 1, topic: "Geometry" },
  { question: "Perimeter of square 5?", answer: "20", difficulty: 1, topic: "Geometry" },
  { question: "Right triangle sides 3,4,?", answer: "5", difficulty: 2, topic: "Geometry" },
  { question: "Circle area radius 3?", answer: "28", difficulty: 2, topic: "Geometry" },
  { question: "Square perimeter side 6?", answer: "24", difficulty: 1, topic: "Geometry" },
  { question: "Rectangle perimeter 4x7?", answer: "22", difficulty: 1, topic: "Geometry" },
  { question: "Triangle area base 5 height 6?", answer: "15", difficulty: 2, topic: "Geometry" },

  // ------------------- Trigonometry -------------------
  { question: "sin(30°)?", answer: "0.5", difficulty: 2, topic: "Trigonometry" },
  { question: "cos(60°)?", answer: "0.5", difficulty: 2, topic: "Trigonometry" },
  { question: "tan(45°)?", answer: "1", difficulty: 2, topic: "Trigonometry" },
  { question: "sin(90°)?", answer: "1", difficulty: 2, topic: "Trigonometry" },
  { question: "cos(0°)?", answer: "1", difficulty: 2, topic: "Trigonometry" },
  { question: "tan(0°)?", answer: "0", difficulty: 2, topic: "Trigonometry" },
  { question: "sin(60°)?", answer: "0.866", difficulty: 3, topic: "Trigonometry" },
  { question: "cos(30°)?", answer: "0.866", difficulty: 3, topic: "Trigonometry" },
  { question: "tan(30°)?", answer: "0.577", difficulty: 3, topic: "Trigonometry" },
  { question: "sin²(30°)+cos²(30°)?", answer: "1", difficulty: 3, topic: "Trigonometry" },

  // ------------------- Probability -------------------
  { question: "Probability of head in 1 coin toss?", answer: "0.5", difficulty: 1, topic: "Probability" },
  { question: "Probability of 6 in 1 dice roll?", answer: "1/6", difficulty: 1, topic: "Probability" },
  { question: "Probability of even number in dice?", answer: "1/2", difficulty: 2, topic: "Probability" },
  { question: "Probability of drawing red card in deck?", answer: "1/2", difficulty: 2, topic: "Probability" },
  { question: "Probability of 2 tails in 2 coin tosses?", answer: "0.25", difficulty: 2, topic: "Probability" },
  { question: "Probability of not getting 6 in dice?", answer: "5/6", difficulty: 2, topic: "Probability" },
  { question: "Probability of 1 or 2 in dice?", answer: "1/3", difficulty: 2, topic: "Probability" },
  { question: "Probability of at least 1 head in 2 tosses?", answer: "0.75", difficulty: 2, topic: "Probability" },
  { question: "Probability of even in 1 dice roll?", answer: "1/2", difficulty: 1, topic: "Probability" },
  { question: "Probability of drawing Ace?", answer: "1/13", difficulty: 3, topic: "Probability" },

  // ------------------- Statistics -------------------
  { question: "Mean of 2,4,6?", answer: "4", difficulty: 1, topic: "Statistics" },
  { question: "Median of 3,5,7?", answer: "5", difficulty: 1, topic: "Statistics" },
  { question: "Mode of 2,2,3?", answer: "2", difficulty: 1, topic: "Statistics" },
  { question: "Range of 1,4,7?", answer: "6", difficulty: 1, topic: "Statistics" },
  { question: "Mean of 1,2,3,4?", answer: "2.5", difficulty: 1, topic: "Statistics" },
  { question: "Median of 5,6,7,8?", answer: "6.5", difficulty: 2, topic: "Statistics" },
  { question: "Mode of 1,1,2,3?", answer: "1", difficulty: 2, topic: "Statistics" },
  { question: "Variance of 2,4,6?", answer: "2.6667", difficulty: 3, topic: "Statistics" },
  { question: "Std deviation of 2,4,6?", answer: "1.632", difficulty: 3, topic: "Statistics" },
  { question: "Sum of 3,4,5?", answer: "12", difficulty: 1, topic: "Statistics" },

  // ------------------- Calculus -------------------
  { question: "d/dx of x²?", answer: "2x", difficulty: 3, topic: "Calculus" },
  { question: "d/dx of x³?", answer: "3x²", difficulty: 3, topic: "Calculus" },
  { question: "d/dx of sin(x)?", answer: "cos(x)", difficulty: 3, topic: "Calculus" },
  { question: "d/dx of cos(x)?", answer: "-sin(x)", difficulty: 3, topic: "Calculus" },
  { question: "∫1 dx?", answer: "x", difficulty: 3, topic: "Calculus" },
  { question: "∫x dx?", answer: "x²/2", difficulty: 3, topic: "Calculus" },
  { question: "∫x² dx?", answer: "x³/3", difficulty: 3, topic: "Calculus" },
  { question: "∫cos(x) dx?", answer: "sin(x)", difficulty: 3, topic: "Calculus" },
  { question: "∫sin(x) dx?", answer: "-cos(x)", difficulty: 3, topic: "Calculus" },
  { question: "d/dx of e^x?", answer: "e^x", difficulty: 3, topic: "Calculus" },

  // ------------------- Number Theory -------------------
  { question: "GCD of 12 and 18?", answer: "6", difficulty: 2, topic: "Number Theory" },
  { question: "LCM of 4 and 5?", answer: "20", difficulty: 2, topic: "Number Theory" },
  { question: "Prime numbers <10?", answer: "2,3,5,7", difficulty: 2, topic: "Number Theory" },
  { question: "Is 29 prime?", answer: "Yes", difficulty: 2, topic: "Number Theory" },
  { question: "Next prime after 7?", answer: "11", difficulty: 2, topic: "Number Theory" },
  { question: "Factors of 12?", answer: "1,2,3,4,6,12", difficulty: 2, topic: "Number Theory" },
  { question: "Divisible by 3? 21?", answer: "Yes", difficulty: 1, topic: "Number Theory" },
  { question: "Divisible by 5? 20?", answer: "Yes", difficulty: 1, topic: "Number Theory" },
  { question: "Is 15 composite?", answer: "Yes", difficulty: 2, topic: "Number Theory" },
  { question: "Next prime after 19?", answer: "23", difficulty: 2, topic: "Number Theory" },

  // ------------------- Linear Equations -------------------
  { question: "x+2y=5, x=1, y=?", answer: "2", difficulty: 2, topic: "Linear Equations" },
  { question: "2x+3y=12, x=3, y=?", answer: "2", difficulty: 3, topic: "Linear Equations" },
  { question: "x-3y=0, x=3, y=?", answer: "1", difficulty: 2, topic: "Linear Equations" },
  { question: "5x+2y=20, x=2, y=?", answer: "5", difficulty: 3, topic: "Linear Equations" },
  { question: "x+4y=12, x=4, y=?", answer: "2", difficulty: 3, topic: "Linear Equations" },
  { question: "3x-2y=0, x=2, y=?", answer: "3", difficulty: 3, topic: "Linear Equations" },
  { question: "x+5y=10, x=0, y=?", answer: "2", difficulty: 2, topic: "Linear Equations" },
  { question: "2x+y=5, x=2, y=?", answer: "1", difficulty: 2, topic: "Linear Equations" },
  { question: "4x-3y=7, x=2, y=?", answer: "1", difficulty: 3, topic: "Linear Equations" },
  { question: "x-2y=4, x=6, y=?", answer: "1", difficulty: 2, topic: "Linear Equations" },

  // ------------------- Fractions -------------------
  { question: "1/2 + 1/3?", answer: "5/6", difficulty: 2, topic: "Fractions" },
  { question: "3/4 - 1/2?", answer: "1/4", difficulty: 2, topic: "Fractions" },
  { question: "2/3 * 3/4?", answer: "1/2", difficulty: 2, topic: "Fractions" },
  { question: "4/5 ÷ 2/3?", answer: "6/5", difficulty: 3, topic: "Fractions" },
  { question: "5/6 + 1/6?", answer: "1", difficulty: 1, topic: "Fractions" },
  { question: "7/8 - 3/8?", answer: "4/8", difficulty: 2, topic: "Fractions" },
  { question: "2/5 + 3/5?", answer: "1", difficulty: 1, topic: "Fractions" },
  { question: "3/7 * 7/3?", answer: "1", difficulty: 2, topic: "Fractions" },
  { question: "4/9 ÷ 2/3?", answer: "2/3", difficulty: 3, topic: "Fractions" },
  { question: "1/3 + 2/3?", answer: "1", difficulty: 1, topic: "Fractions" },
];

// ==================== SEED FUNCTION ====================
const importData = async () => {
  try {
    await connectDB();
    await Question.deleteMany(); // optional: clear previous data
    await Question.insertMany(questions);
    console.log("Questions imported successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
