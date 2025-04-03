import express from "express";
import { getDb } from "../db/connection.js"; // Import the database connection
import { exec } from "child_process";
import path from "path"; // Import the path module

const router = express.Router();

// POST /login - Check if student exists or create a new one
router.post("/", async (req, res) => {
  const { S_ID } = req.body;

  try {
    // Validate S_ID: Must be 7 digits and all numbers
    const isValidS_ID = /^[0-9]{7}$/.test(S_ID);
    if (!isValidS_ID) {
      return res.status(400).json({ error: "Invalid Student ID. It must be exactly 7 digits and contain only numbers." });
    }

    const db = getDb(); // Get the GridFit database
    const collection = db.collection("Users"); // Use the Users collection

    // Check if the student already exists
    let student = await collection.findOne({ S_ID });

    if (!student) {
      // If the student doesn't exist, create a new record
      const newStudent = {
        S_ID,
        watts: 0,
        weeklyWattage: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 },
      };
      const result = await collection.insertOne(newStudent);

      // Use the insertedId to fetch the newly created student
      student = {
        _id: result.insertedId,
        ...newStudent,
      };
    }

    res.status(200).json(student);
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "An error occurred while processing the login request." });
  }
});

// POST /logout - Clear session or token
router.post("/logout", (req, res) => {
  try {
    // For simplicity, just send a success response
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).json({ error: "An error occurred while processing the logout request." });
  }
});

// POST /api/start-session - Trigger Python script
router.post("/start-session", (req, res) => {
  const { S_ID } = req.body;

  if (!S_ID) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  // Dynamically resolve the path to the Python script
  const scriptPath = path.resolve(__dirname, "../scripts/data.py");

  // Log the resolved script path for debugging
  console.log("Resolved script path:", scriptPath);

  // Command to execute the Python script with the S_ID as an argument
  const command = `python ${scriptPath} ${S_ID}`;

  // Log the command being executed
  console.log("Executing command:", command);

  // Execute the Python script
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing Python script:", error);
      return res.status(500).json({ error: "Failed to start session", details: error.message });
    }

    if (stderr) {
      console.error("Python script error:", stderr);
      return res.status(500).json({ error: "Python script error", details: stderr });
    }

    console.log("Python script output:", stdout);
    res.status(200).json({ message: "Session started successfully", output: stdout });
  });
});

export default router;

const handleLogin = async (e) => {
  e.preventDefault();

  if (!/^[0-9]{7}$/.test(studentID)) {
    setError("Invalid Student ID. It must be exactly 7 digits.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5050/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ S_ID: studentID }),
    });

    if (!response.ok) {
      throw new Error("Failed to log in.");
    }

    const userData = await response.json();
    setUser(userData);

    // Trigger the Python script
    await fetch("http://localhost:5050/api/start-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ S_ID: studentID }),
    });

    navigate(`/stats/${studentID}`);
  } catch (error) {
    console.error("Error during login:", error);
    setError("Failed to log in. Please try again.");
  }
};