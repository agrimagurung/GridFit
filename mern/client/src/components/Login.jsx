import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import the useUser hook

export default function Login() {
  const [studentID, setStudentID] = useState(""); // State for the input field
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading
  const { setUser } = useUser(); // Access the setUser function from UserContext
  const navigate = useNavigate(); // React Router's navigation function

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate the Student ID (must be 7 digits)
    if (!/^[0-9]{7}$/.test(studentID)) {
      setError("Invalid Student ID. It must be exactly 7 digits.");
      return;
    }

    setLoading(true); // Start loading

    try {
      // Make an API call to the backend to validate or create the user
      const response = await fetch("http://localhost:5050/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ S_ID: studentID }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response Error:", errorText);
        throw new Error("Failed to log in. Please try again.");
      }

      const userData = await response.json();
      console.log("User Data:", userData);

      // Update the user state in UserContext
      setUser(userData);

      // Trigger the Python script for the DAQ system
      const sessionResponse = await fetch("http://localhost:5050/api/start-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ S_ID: studentID }),
      });

      if (!sessionResponse.ok) {
        const sessionErrorText = await sessionResponse.text();
        console.error("Session Error:", sessionErrorText);
        throw new Error("Failed to start the session. Please try again.");
      }

      console.log("Session started successfully.");

      // Redirect to the UserStats page
      navigate(`/stats/${studentID}`);
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to log in or start the session. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-[#333333] bg-opacity-30 p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold text-white mb-4">Login</h1>
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentID}
          onChange={(e) => setStudentID(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          disabled={loading} // Disable input while loading
        />
        <button
          type="submit"
          className={`bg-green-500 px-4 py-2 rounded text-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
