import express from "express";
import { getDb } from "../db/connection.js"; // Import the database connection

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

export default router;