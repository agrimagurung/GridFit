import { NavLink } from "react-router-dom";
import GridFitLogo from "../assets/gridfitlogoREDO.png"; // Import the logo

export default function Navbar({ studentID }) {
  const isLoggedIn = !!studentID; // Check if a valid Student ID exists

  return (
    <div>
      <nav
        className="flex justify-between items-center h-[80px] px-6 rounded-lg"
        style={{
          position: "fixed", // Make the navbar fixed
          top: 0, // Stick it to the top of the viewport
          left: 0, // Align it to the left
          width: "100%", // Make it span the full width
          zIndex: 1000, // Ensure it stays on top of other elements
          backgroundColor: "rgba(51, 51, 51, 0.3)", // Slightly more opaque background
          backdropFilter: "blur(10px)", // Optional: Adds a blur effect to the background
        }}
      >
        {/* Clicking on the logo navigates back to the home page */}
        <NavLink to="/">
          <img
            alt="GridFit Logo"
            className="h-[60px] w-auto inline" // Increased height for a larger logo
            src={GridFitLogo}
          />
        </NavLink>

        {/* Navbar Links */}
        <div className="flex space-x-8">
          <NavLink
            className="text-lg font-medium text-white transition"
            to="/"
            style={{ hover: { color: "#30cb0f" } }}
          >
            Home
          </NavLink>
          <NavLink
            className="text-lg font-medium text-white hover:text-[#30cb0f] transition"
            to="/about"
          >
            About
          </NavLink>
          <NavLink
            className="text-lg font-medium text-white hover:text-[#30cb0f] transition"
            to="/stats"
          >
            User Stats
          </NavLink>
          {isLoggedIn ? (
            <>
              {/* Logged-in Navbar */}
              <NavLink
                className="text-lg font-medium text-white hover:text-[#30cb0f] transition"
                to="/leaderboard"
              >
                Leaderboard
              </NavLink>
            </>
          ) : (
            <>
              {/* Logged-out Navbar */}
              <NavLink
                className="text-lg font-medium text-white hover:text-[#30cb0f] transition"
                to="/pricing"
              >
                Pricing
              </NavLink>
              <NavLink
                className="text-lg font-medium text-white hover:text-[#30cb0f] transition"
                to="/leaderboard"
              >
                Leaderboard
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
