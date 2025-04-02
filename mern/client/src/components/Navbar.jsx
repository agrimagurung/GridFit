import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import the useUser hook
import logo from "../assets/gridfitlogoREDO.png"; // Import the logo image

export default function Navbar() {
  const { user, setUser } = useUser(); // Access the logged-in user's S_ID and the logout function
  const isLoggedIn = !!user; // Check if a valid Student ID exists
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      const response = await fetch("http://localhost:5050/api/login/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      // Clear the user state
      setUser(null);

      // Redirect to the login page
      navigate("/login");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center h-[80px] px-6 bg-[#333333] bg-opacity-30 shadow-lg z-50">
      {/* Logo */}
      <NavLink to="/">
        <img src={logo} alt="GridFit Logo" className="h-10" /> {/* Adjust height as needed */}
      </NavLink>

      {/* Navigation Links */}
      <div className="flex space-x-4">
        <NavLink to="/" className="text-white hover:text-green-500">
          Home
        </NavLink>
        <NavLink to="/about" className="text-white hover:text-green-500">
          About
        </NavLink>
        {isLoggedIn && (
          <NavLink
            to={`/stats/${user.S_ID}`} // Dynamically include the logged-in user's S_ID
            className="text-white hover:text-green-500"
          >
            User Stats
          </NavLink>
        )}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-white hover:text-red-500"
          >
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="text-white hover:text-green-500">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
