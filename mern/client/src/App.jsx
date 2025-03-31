import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import About from "./components/About";
import Pricing from "./components/Pricing";
import UserStats from "./components/UserStats";
import Leaderboard from "./components/Leaderboard";
import { useState } from "react";

const App = () => {
  const [studentID, setStudentID] = useState(null);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(/src/assets/background.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar studentID={studentID} />
      <Routes>
        <Route path="/" element={<Login setStudentID={setStudentID} />} />
        <Route path="/About" element={<About />} />
        <Route path="/Pricing" element={<Pricing />} />
        <Route path="/stats" element={<UserStats />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  );
};

export default App;
