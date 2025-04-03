import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import backgroundImage from "../assets/background.png";
import lowEnergyIcon from "../assets/icons/low-energy-icon.png";
import highEnergyIcon from "../assets/icons/high-energy-icon.png";
import comparisonMetricsIcon from "../assets/icons/comparison-metrics-icon.png";
import goalMetIcon from "../assets/icons/goal-met-icon.png";
import efficientIcon from "../assets/icons/efficient-icon.png";
import efficiencyConcernIcon from "../assets/icons/efficiency-concern-icon.png";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function UserStats() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [weeklyData, setWeeklyData] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live stats
  const [co2Saved, setCo2Saved] = useState(0);
  const [powerGenerated, setPowerGenerated] = useState(0);
  const [generationRate, setGenerationRate] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    if (!id) {
      setError("No S_ID provided in the URL.");
      setLoading(false);
      return;
    }

    async function fetchWeeklyData() {
      try {
        const response = await fetch(`http://localhost:5050/api/userstats/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user stats.");
        }
        const data = await response.json();
        const wattageData = Object.values(data.weeklyWattage).map(Number);

        setWeeklyData(wattageData);
        setStudentId(data.S_ID);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weekly wattage data:", error);
        setError(error.message);
        setLoading(false);
      }
    }

    fetchWeeklyData();
  }, [id]);

  // Simulate live stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCo2Saved((prev) => prev + Math.random() * 0.5); // Increment CO2 saved
      setPowerGenerated((prev) => prev + Math.random() * 10); // Increment power generated
      setGenerationRate((prev) => 50 + Math.random() * 10); // Random generation rate
      setSessionDuration((prev) => prev + 1); // Increment session duration (in seconds)
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const totalWattage = weeklyData.reduce((sum, wattage) => sum + wattage, 0);
  const dailyGoal = 200;
  const today = new Date().getDay();
  const todayWattage = weeklyData[today - 1] || 0;
  const hasMetDailyGoal = todayWattage >= dailyGoal;

  const energyOutput =
    todayWattage < 100 ? "Low" : todayWattage < 300 ? "Moderate" : "High";

  const efficiencyMessage =
    todayWattage < dailyGoal
      ? "Consider optimizing your energy generation process to meet your daily goals."
      : "Great job! You're meeting your daily energy goals.";

  const weeklyAverage = totalWattage / 7;
  const comparisonMessage =
    todayWattage > weeklyAverage
      ? "Your energy output today is above the weekly average."
      : "Your energy output today is below the weekly average.";

  const graphData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Wattage Generated (Watts)",
        data: weeklyData,
        backgroundColor: "rgba(48, 203, 15, 0.7)",
        borderColor: "rgba(48, 203, 15, 1)",
        borderWidth: 1,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Weekly Wattage Generation",
        color: "white",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
          beginAtZero: true,
        },
      },
    },
  };

  if (loading) {
    return <p className="text-white text-center">Loading...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-lg mb-8">{error}</p>
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
          onClick={() => navigate("/login")}
        >
          Go Back to Login
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-w-[1024px] overflow-x-auto"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-white mb-20 text-center mt-28">
          Check your energy generation stats
        </h1>

        {/* Row 1: Weekly Wattage Chart and Live Stats */}
        <div className="flex flex-row justify-center items-center w-full space-x-8">
          {/* Weekly Wattage Chart */}
          <div
            className="bg-[#333333] bg-opacity-30 p-12 rounded-2xl shadow-lg text-left"
            style={{
              height: "450px",
              width: "40%",
              marginLeft: "-10px",
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Welcome back, {studentId}
            </h2>
            <div style={{ marginTop: "20px", height: "330px" }}>
              <Bar data={graphData} options={graphOptions} />
            </div>
          </div>

          {/* Live Stats */}
          <div
            className="bg-[#333333] bg-opacity-30 p-12 rounded-2xl shadow-lg text-left"
            style={{
              height: "450px",
              width: "40%",
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Live Stats
            </h2>
            <div className="text-white text-lg space-y-4">
              <p>CO2 Saved: {co2Saved.toFixed(2)} kg</p>
              <p>Power Generated: {powerGenerated.toFixed(2)} W</p>
              <p>Generation Rate: {generationRate.toFixed(2)} W/min</p>
              <p>Session Duration: {sessionDuration} seconds</p>
            </div>
          </div>
        </div>

        {/* Row 2: Energy Consumption Overview */}
        <div
          className="bg-[#333333] bg-opacity-30 p-16 rounded-2xl shadow-lg text-left mt-16"
          style={{
            height: "500px", // Adjust height automatically based on content
            width: "83%", // Make the rectangle slightly smaller in width
            paddingTop: "50px", // Add extra padding to the top
            paddingBottom: "40px", // Add extra padding to the bottom
            marginBottom: "200px", // Add space between the rectangle and the bottom of the page
          }}
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            Your Energy Consumption Overview
          </h1>

          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col items-center">
              <img
                src={energyOutput === "Low" ? lowEnergyIcon : highEnergyIcon}
                alt="Energy Output Icon"
                className="w-12 h-12 mb-2"
              />
              <p className="text-white text-sm">Energy Output</p>
            </div>

            <div className="flex flex-col items-center">
              <img
                src={
                  efficiencyMessage.includes("optimizing")
                    ? efficiencyConcernIcon
                    : efficientIcon
                }
                alt="Efficiency Icon"
                className="w-12 h-12 mb-2"
              />
              <p className="text-white text-sm">Efficiency</p>
            </div>

            <div className="flex flex-col items-center">
              <img
                src={hasMetDailyGoal ? goalMetIcon : efficiencyConcernIcon}
                alt="Optimization Icon"
                className="w-12 h-12 mb-2"
              />
              <p className="text-white text-sm">Optimization</p>
            </div>

            <div className="flex flex-col items-center">
              <Link to={`/leaderboard/${studentId}`}>
                <img
                  src={comparisonMetricsIcon}
                  alt="Comparison Icon"
                  className="w-12 h-12 mb-2 cursor-pointer"
                />
              </Link>
              <p className="text-white text-sm">Comparison</p>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">
            {`Your energy generation is ${energyOutput.toLowerCase()}, indicating ${
              efficiencyMessage.includes("optimizing")
                ? "potential efficiency improvements."
                : "great efficiency."
            } ${
              hasMetDailyGoal
                ? "You have met your daily energy goal."
                : "Consider optimizing your energy generation to meet your daily goal."
            } ${
              comparisonMessage.includes("above")
                ? "Your energy output today is above the weekly average."
                : "Your energy output today is below the weekly average."
            }`}
          </p>
        </div>
      </div>
    </div>
  );
}