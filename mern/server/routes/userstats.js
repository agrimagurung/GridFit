import express from "express";
import { getDb } from "../db/connection.js"; // Import the database connection

const router = express.Router();

// GET /api/userstats/:id - Fetch user stats by S_ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Validate S_ID: Must be 7 digits
    if (!/^[0-9]{7}$/.test(id)) {
      return res.status(400).json({ error: "Invalid Student ID. It must be exactly 7 digits." });
    }

    const db = getDb(); // Get the database instance
    const collection = db.collection("Users"); // Use the Users collection

    // Fetch the user data by S_ID
    const user = await collection.findOne({ S_ID: id });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user); // Return the user data
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "An error occurred while fetching user stats." });
  }
});

export default router;