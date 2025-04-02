import express from "express";
import cors from "cors";
import { connectToDatabase } from "./db/connection.js"; // Import the database connection
import records from "./routes/record.js";
import login from "./routes/login.js";
import leaderboard from "./routes/leaderboard.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Global database instance
let db;

// Middleware to check database connection
const checkDbConnection = (req, res, next) => {
  if (!db) {
    return res.status(500).json({ error: "Database connection is not initialized." });
  }
  next();
};

// Connect to MongoDB once and reuse the connection
connectToDatabase()
  .then((database) => {
    db = database; // Save the database instance for reuse
    console.log("Connected to MongoDB successfully!");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

// Define the /api/student/wattage route
app.get("/api/student/wattage", checkDbConnection, async (req, res) => {
  const studentId = req.query.studentId;
  if (!studentId) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  if (!/^[0-9]{7}$/.test(studentId)) {
    return res.status(400).json({ error: "Invalid Student ID. It must be exactly 7 digits." });
  }

  try {
    const students = db.collection("Users");
    const student = await students.findOne({ S_ID: studentId.toString() });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      S_ID: student.S_ID,
      weeklyWattage: student.weeklyWattage,
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "An error occurred while fetching student data." });
  }
});

// Define the /api/student/stats route
app.get("/api/student/stats", checkDbConnection, async (req, res) => {
  const s_id = req.query.s_id;
  if (!s_id) {
    return res.status(400).json({ error: "S_ID is required" });
  }

  if (!/^[0-9]{7}$/.test(s_id)) {
    return res.status(400).json({ error: "Invalid S_ID. It must be exactly 7 digits." });
  }

  try {
    const students = db.collection("Users");
    const studentStats = await students.findOne({ S_ID: s_id });

    if (!studentStats) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(studentStats);
  } catch (error) {
    console.error("Error fetching student stats:", error);
    res.status(500).json({ error: "An error occurred while fetching student stats." });
  }
});

// Define the /api/userstats/:id route
app.get("/api/userstats/:id", checkDbConnection, async (req, res) => {
  const { id } = req.params;

  try {
    // Validate S_ID: Must be 7 digits
    if (!/^[0-9]{7}$/.test(id)) {
      return res.status(400).json({ error: "Invalid Student ID. It must be exactly 7 digits." });
    }

    const students = db.collection("Users");
    const student = await students.findOne({ S_ID: id });

    if (!student) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "An error occurred while fetching user stats." });
  }
});

// Existing routes
app.use("/record", records);
app.use("/api/login", login); // Updated to use /api/login
app.use("/leaderboard", leaderboard);

