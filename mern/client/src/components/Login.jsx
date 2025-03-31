import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background.png"; // Import the background image
import PalmOfHand from "../assets/palm-of-hand.png"; // Import the palm-of-hand.png image
import SNHUCampus from "../assets/snhu-campus.png"; // Import the snhu-campus.png image

export default function Login() {
  const [studentID, setStudentID] = useState("");
  const [error, setError] = useState(""); // State to store validation errors
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    // Validate studentID: Must be 7 digits and all numbers
    if (!/^[0-9]{7}$/.test(studentID)) {
      setError("Invalid Student ID. It must be exactly 7 digits and contain only numbers.");
      return;
    }

    setError(""); // Clear any previous errors

    try {
      const response = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ S_ID: studentID }),
      });

      if (!response.ok) throw new Error("Failed to log in");

      const data = await response.json();
      navigate("/stats", { state: { user: data } });
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred while logging in. Please try again.");
    }
  }

  return (
    <div
      className="min-w-[1024px] overflow-x-auto" // Set a minimum width and enable horizontal scrolling
      style={{
        backgroundImage: `url(${backgroundImage})`, // Set the background image
        backgroundSize: "cover", // Cover the entire screen
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat", // Prevent repeating
      }}
    >
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{
          marginTop: "100px", // Add margin to move the content further down
        }}
      >
        {/* First Rectangle */}
        <div
          className="bg-[#333333] bg-opacity-30 p-12 w-[80%] rounded-2xl shadow-lg text-left mt-10 flex flex-col justify-between"
          style={{
            height: "600px", // Set the height to 600px
          }}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-bold text-white mb-4 leading-relaxed">
              Track your <span className="glow-text">energy</span> and <br />
              <span className="glow-text">charge</span> your{" "}
              <span className="glow-text">devices</span> on <br />
              the <span className="glow-text">go!</span>
            </h1>
            <img
              src={PalmOfHand}
              alt="Palm of Hand"
              className="w-72 h-72 -ml-20 mt-4 aura-effect" // Added margin-top to lower the image
            />
          </div>
          <form onSubmit={handleLogin} className="mt-auto">
            <input
              type="text"
              id="studentId"
              name="studentId"
              placeholder="Enter Student ID"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              className="w-64 p-3 text-lg border-2 border-[#30cb0f] rounded-full focus:outline-none focus:ring-2 mr-4" // Added margin-right
              style={{
                "--tw-ring-color": "#30cb0f", // Custom focus ring color
              }}
            />
            <button
              type="submit"
              className="w-64 p-3 text-lg text-white rounded-full transition"
              style={{
                backgroundColor: "#30cb0f", // Set the button background color to the custom green
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#8fae63")} // Slightly darker green on hover
              onMouseOut={(e) => (e.target.style.backgroundColor = "#30cb0f")} // Reset to original green
            >
              Begin Session
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </form>
        </div>

        {/* Second Rectangle */}
        <div
          className="bg-[#333333] bg-opacity-30 p-12 w-full rounded-lg shadow-lg text-center mt-40 flex items-start justify-start"
          style={{
            height: "400px", // Reduced height from 600px to 400px
          }}
        >
          <div className="flex flex-col items-start mr-12">
            <p className="text-3xl font-bold text-white mb-4">Join us at :</p>
            <img
              src={SNHUCampus}
              alt="SNHU Campus"
              className="w-80 h-auto rounded-2xl"
            />
          </div>
          <div className="text-left flex-1 mt-10">
            <h1 className="text-2xl font-bold text-white mb-4">
              2500 N River Rd, Manchester, NH 03106
            </h1>
            <p className="text-gray-300">
              Operating Hours: 08:00 - 18:00. . . . Monday - Friday. <br />
              Contact us at: (603) 645-9643
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
