import express from "express";
import cors from "cors";
import { connectToDatabase } from "./db/connection.js"; // Import the database connection
import records from "./routes/record.js";
import login from "./routes/login.js";
import leaderboard from "./routes/leaderboard.js";

// Import the MongoDB client
import { MongoClient } from "mongodb";

// MongoDB connection URI
const uri = "mongodb://localhost:5173"; // MongoDB connection string
const client = new MongoClient(uri);

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Define the /api/student/wattage route
app.get("/api/student/wattage", async (req, res) => {
  try {
    const studentId = req.query.studentId; // Get student ID from query params
    console.log("Student ID from query:", studentId); // Debugging

    await client.connect();
    const database = client.db("GridFit"); // Use the correct database name
    const students = database.collection("Users"); // Use the correct collection name

    // Fetch the student's data
    console.log("Querying database with:", { S_ID: studentId.toString() }); // Debugging
    const student = await students.findOne({ S_ID: studentId.toString() }); // Convert studentId to string
    console.log("Query Result:", student); // Debugging

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      S_ID: student.S_ID,
      weeklyWattage: student.weeklyWattage,
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Existing routes
app.use("/record", records);
app.use("/login", login);
app.use("/leaderboard", leaderboard);

// Start the server after connecting to the database
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
