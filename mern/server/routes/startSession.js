import express from "express";
import { exec } from "child_process";
import path from "path";

const router = express.Router();

// POST /api/start-session - Trigger Python script
router.post("/start-session", (req, res) => {
  const { S_ID } = req.body;

  // Validate the Student ID
  if (!S_ID) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  if (!/^[0-9]{7}$/.test(S_ID)) {
    return res.status(400).json({ error: "Invalid Student ID. It must be exactly 7 digits." });
  }

  // Construct the absolute path to the Python script
  const scriptPath = path.resolve(__dirname, "../scripts/data.py");

  console.log("Resolved script path:", scriptPath);

  // Command to execute the Python script with the S_ID as an argument
  const command = `python ${scriptPath} ${S_ID}`;

  // Log the command being executed
  console.log("Executing command:", command);

  // Check if Python is installed and accessible
  exec("python --version", (error) => {
    if (error) {
      console.error("Python is not installed or not accessible from the command line.");
      return res.status(500).json({ error: "Python is not installed or not accessible." });
    }

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
});

export default router;