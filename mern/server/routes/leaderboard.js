// filepath: c:\Users\kokic\mern-stack-example\mern\server\routes\leaderboard.js
import express from "express";
import { getDb } from "../db/connection.js"; // Import the database connection

const router = express.Router();

// GET /leaderboard - Fetch top 10 users (all-time leaderboard)
router.get("/", async (req, res) => {
  try {
    const db = getDb(); // Get the initialized database
    const collection = db.collection("Users");

    // Fetch top 10 users sorted by watts in descending order
    const leaderboard = await collection
      .find({})
      .sort({ watts: -1 }) // Sort by watts (highest first)
      .limit(10) // Limit to top 10 users
      .project({ S_ID: 1, watts: 1, _id: 0 }) // Include only S_ID and watts
      .toArray();

    res.status(200).send(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching leaderboard data");
  }
});

// GET /leaderboard/daily - Fetch daily best users
router.get("/daily", async (req, res) => {
  try {
    const db = getDb(); // Get the initialized database
    const collection = db.collection("Users");

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day

    // Fetch top 10 users for today sorted by watts in descending order
    const dailyLeaderboard = await collection
      .find({ lastUpdated: { $gte: today } }) // Filter by today's date
      .sort({ watts: -1 }) // Sort by watts (highest first)
      .limit(10) // Limit to top 10 users
      .project({ S_ID: 1, watts: 1, _id: 0 }) // Include only S_ID and watts
      .toArray();

    res.status(200).send(dailyLeaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching daily leaderboard data");
  }
});

// GET /leaderboard/all-time - Fetch all-time top users
router.get("/all-time", async (req, res) => {
  try {
    const db = getDb(); // Get the initialized database
    const collection = db.collection("Users");

    // Fetch top 10 users sorted by watts in descending order
    const allTimeLeaderboard = await collection
      .find({})
      .sort({ watts: -1 }) // Sort by watts (highest first)
      .limit(10) // Limit to top 10 users
      .project({ S_ID: 1, watts: 1, _id: 0 }) // Include only S_ID and watts
      .toArray();

    res.status(200).send(allTimeLeaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching all-time leaderboard data");
  }
});

export default router;