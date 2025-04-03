import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import About from "./components/About";
import Pricing from "./components/Pricing";
import UserStats from "./components/UserStats";
import Leaderboard from "./components/Leaderboard";
import ComparisonMetrics from "./components/ComparisonMetrics"; // Import the new component
import { UserProvider } from "./context/UserContext";
import backgroundImage from "./assets/background.png"; // Import the background image

const App = () => {
  return (
    <UserProvider>
      <div
        className="min-h-screen"
        style={{
          backgroundImage: `url(${backgroundImage})`, // Use imported background image
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/leaderboard/:id" element={<Leaderboard />} /> {/* Dynamic leaderboard route */}
          <Route path="/comparison-metrics" element={<ComparisonMetrics />} />

          {/* Dynamic Route for User Stats */}
          <Route path="/stats/:id" element={<UserStats />} />

          {/* Fallback Route */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </UserProvider>
  );
};

export default App;
