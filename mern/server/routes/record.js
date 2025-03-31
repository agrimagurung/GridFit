import express from "express";
import { getDb } from "../db/connection.js"; // Use named import for getDb
import { ObjectId } from "mongodb";

const router = express.Router();

// GET /record - Fetch all student records
router.get("/", async (req, res) => {
  try {
    const db = getDb(); // Get the initialized database
    const collection = db.collection("students");
    const results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching student records");
  }
});

// GET /record/:id - Fetch a single student record by ID
router.get("/:id", async (req, res) => {
  try {
    const db = getDb(); // Get the initialized database
    const collection = db.collection("students");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) res.status(404).send("Student not found");
    else res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching student record");
  }
});

// PATCH /record/:id - Update a student's stats by ID
router.patch("/:id", async (req, res) => {
  try {
    const db = getDb(); // Get the initialized database
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        watts: req.body.watts, // Update the watts value
      },
    };

    const collection = db.collection("students");
    const result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      res.status(404).send("Student not found");
    } else {
      res.status(200).send("Student stats updated successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating student stats");
  }
});

// DELETE /record/:id - Delete a student record by ID
router.delete("/:id", async (req, res) => {
  try {
    const db = getDb(); // Get the initialized database
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("students");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      res.status(404).send("Student not found");
    } else {
      res.status(200).send("Student record deleted successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting student record");
  }
});

export default router;
