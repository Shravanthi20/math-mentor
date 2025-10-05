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
  { question: "A shop sells 120 apples in a day. If each apple costs $2, what is the total revenue for the day?", answer: "240", difficulty: 2, topic: "Arithmetic" },
  { question: "A train travels 60 km in 1 hour and then 90 km in 1.5 hours. What is the total distance covered?", answer: "150", difficulty: 2, topic: "Arithmetic" },
  { question: "A basket has 45 oranges. If 3 oranges are eaten every day, how many days will it take to finish the basket?", answer: "15", difficulty: 2, topic: "Arithmetic" },
  { question: "A man buys 3 pens at $5 each and 2 notebooks at $8 each. How much did he spend in total?", answer: "31", difficulty: 1, topic: "Arithmetic" },
  { question: "A car covers 180 km in 3 hours. What is its average speed in km/h?", answer: "60", difficulty: 1, topic: "Arithmetic" },

  // ------------------- Algebra -------------------
  { question: "If twice a number increased by 5 equals 17, what is the number?", answer: "6", difficulty: 2, topic: "Algebra" },
  { question: "Solve for x: 3x + 7 = 22", answer: "5", difficulty: 2, topic: "Algebra" },
  { question: "The sum of three consecutive numbers is 72. Find the numbers.", answer: "23,24,25", difficulty: 3, topic: "Algebra" },
  { question: "If 5 times a number minus 8 equals 27, find the number.", answer: "7", difficulty: 2, topic: "Algebra" },
  { question: "A rectangle’s length is 3 more than twice its width. If the perimeter is 36, find the length and width.", answer: "Length=12, Width=6", difficulty: 3, topic: "Algebra" },

  // ------------------- Geometry -------------------
  { question: "A triangular garden has a base of 10 m and height of 8 m. Find its area.", answer: "40", difficulty: 2, topic: "Geometry" },
  { question: "The radius of a circle is 7 cm. Find its circumference. (Use π=22/7)", answer: "44", difficulty: 2, topic: "Geometry" },
  { question: "A rectangular plot has length 15 m and width 10 m. Find its perimeter.", answer: "50", difficulty: 1, topic: "Geometry" },
  { question: "A square has an area of 64 m². Find the length of its side.", answer: "8", difficulty: 1, topic: "Geometry" },
  { question: "A right triangle has legs 6 m and 8 m. Find the hypotenuse.", answer: "10", difficulty: 2, topic: "Geometry" },

  // ------------------- Trigonometry -------------------
  { question: "A ladder leans against a wall. The top of the ladder reaches 12 m high, and the ladder is 13 m long. Find the distance of the base from the wall.", answer: "5", difficulty: 3, topic: "Trigonometry" },
  { question: "An angle of elevation of the top of a tower from a point on the ground is 45°. If the distance to the tower is 50 m, find its height.", answer: "50", difficulty: 3, topic: "Trigonometry" },
  { question: "A tree casts a shadow 15 m long. If the angle of elevation of the sun is 30°, find the height of the tree.", answer: "8.66", difficulty: 3, topic: "Trigonometry" },
  { question: "A right triangle has one angle 60° and hypotenuse 10 m. Find the length of the side opposite the 60° angle.", answer: "8.66", difficulty: 3, topic: "Trigonometry" },
  { question: "A building is 40 m tall. From a point 30 m away, find the angle of elevation to the top of the building.", answer: "53.13", difficulty: 3, topic: "Trigonometry" },

  // ------------------- Probability -------------------
  { question: "A bag contains 5 red balls and 3 blue balls. What is the probability of picking a red ball?", answer: "5/8", difficulty: 2, topic: "Probability" },
  { question: "Two dice are rolled. What is the probability of getting a sum of 8?", answer: "5/36", difficulty: 3, topic: "Probability" },
  { question: "A coin is tossed 3 times. What is the probability of getting exactly 2 heads?", answer: "3/8", difficulty: 2, topic: "Probability" },
  { question: "A card is drawn from a deck of 52 cards. Find the probability of drawing a heart.", answer: "1/4", difficulty: 1, topic: "Probability" },
  { question: "A box contains 10 balls numbered 1 to 10. What is the probability of drawing a number less than 4?", answer: "3/10", difficulty: 1, topic: "Probability" },

  // ------------------- Statistics -------------------
  { question: "The marks of 5 students are 12, 15, 18, 20, 25. Find the mean.", answer: "18", difficulty: 1, topic: "Statistics" },
  { question: "The marks of 6 students are 5,7,9,10,12,15. Find the median.", answer: "9.5", difficulty: 2, topic: "Statistics" },
  { question: "Find the mode of the dataset: 4,4,5,6,6,6,7.", answer: "6", difficulty: 1, topic: "Statistics" },
  { question: "Find the range of the numbers: 3,7,12,15,20.", answer: "17", difficulty: 1, topic: "Statistics" },
  { question: "Find the variance of 2,4,6,8.", answer: "5", difficulty: 3, topic: "Statistics" },

  // ------------------- Calculus -------------------
  { question: "Differentiate f(x) = 3x² + 5x - 7.", answer: "6x + 5", difficulty: 3, topic: "Calculus" },
  { question: "Differentiate f(x) = sin(x) + x².", answer: "cos(x) + 2x", difficulty: 3, topic: "Calculus" },
  { question: "Find ∫(2x + 3) dx.", answer: "x² + 3x + C", difficulty: 3, topic: "Calculus" },
  { question: "Find ∫(x² - 4x + 5) dx.", answer: "x³/3 - 2x² + 5x + C", difficulty: 3, topic: "Calculus" },
  { question: "Differentiate f(x) = e^(3x).", answer: "3e^(3x)", difficulty: 3, topic: "Calculus" },

  // ------------------- Number Theory -------------------
  { question: "Find the GCD of 36 and 48.", answer: "12", difficulty: 2, topic: "Number Theory" },
  { question: "Find the LCM of 9 and 12.", answer: "36", difficulty: 2, topic: "Number Theory" },
  { question: "Check if 37 is prime.", answer: "Yes", difficulty: 2, topic: "Number Theory" },
  { question: "Find the next prime after 23.", answer: "29", difficulty: 2, topic: "Number Theory" },
  { question: "List all factors of 18.", answer: "1,2,3,6,9,18", difficulty: 2, topic: "Number Theory" },

  // ------------------- Linear Equations -------------------
  { question: "Solve for y: 2x + 3y = 12, if x = 2.", answer: "8/3", difficulty: 2, topic: "Linear Equations" },
  { question: "Solve for x: 5x - 2y = 10, if y = 3.", answer: "4", difficulty: 2, topic: "Linear Equations" },
  { question: "Solve for y: x - y = 7, if x = 10.", answer: "3", difficulty: 1, topic: "Linear Equations" },
  { question: "Solve for x: 3x + 4y = 20, if y = 2.", answer: "4", difficulty: 2, topic: "Linear Equations" },
  { question: "Solve for y: 7x + 2y = 18, if x = 2.", answer: "2", difficulty: 2, topic: "Linear Equations" },

  // ------------------- Fractions -------------------
  { question: "A recipe requires 3/4 cup of sugar. If you double the recipe, how much sugar is needed?", answer: "3/2", difficulty: 1, topic: "Fractions" },
  { question: "Subtract 5/6 - 1/3.", answer: "1/2", difficulty: 1, topic: "Fractions" },
  { question: "Multiply 7/8 by 2/3.", answer: "7/12", difficulty: 2, topic: "Fractions" },
  { question: "Divide 9/10 by 3/5.", answer: "3/2", difficulty: 2, topic: "Fractions" },
  { question: "Add 4/5 + 2/3.", answer: "22/15", difficulty: 2, topic: "Fractions" },
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
