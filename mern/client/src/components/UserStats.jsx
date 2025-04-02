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
import backgroundImage from "../assets/background.png"; // Import the background image
import lowEnergyIcon from "../assets/icons/low-energy-icon.png"; // Import low energy icon
import highEnergyIcon from "../assets/icons/high-energy-icon.png"; // Import high energy icon
import comparisonMetricsIcon from "../assets/icons/comparison-metrics-icon.png"; // Import comparison metrics icon

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function UserStats() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the S_ID from the URL
  const [weeklyData, setWeeklyData] = useState([]); // State to store wattage data
  const [studentId, setStudentId] = useState(""); // State to store S_ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    if (!id) {
      setError("No S_ID provided in the URL.");
      setLoading(false);
      return;
    }

    // Fetch the student's weekly wattage data from the backend
    async function fetchWeeklyData() {
      try {
        const response = await fetch(`http://localhost:5050/api/userstats/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user stats.");
        }
        const data = await response.json();

        // Convert weeklyWattage values to numbers
        const wattageData = Object.values(data.weeklyWattage).map(Number);

        setWeeklyData(wattageData); // Set the converted data
        setStudentId(data.S_ID); // Set the student's S_ID
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weekly wattage data:", error);
        setError(error.message);
        setLoading(false);
      }
    }

    fetchWeeklyData();
  }, [id]);

  // Calculate total wattage for the week
  const totalWattage = weeklyData.reduce((sum, wattage) => sum + wattage, 0);

  // Calculate whether the user has generated enough watts for a full charge
  const dailyGoal = 200; // Example: 200 watts needed for a full charge
  const today = new Date().getDay(); // Get the current day (0 = Sunday, 1 = Monday, etc.)
  const todayWattage = weeklyData[today - 1] || 0; // Get today's wattage (adjust for array index)

  const hasMetDailyGoal = todayWattage >= dailyGoal;

  // Determine energy output level
  const energyOutput =
    todayWattage < 100
      ? "Low"
      : todayWattage < 300
      ? "Moderate"
      : "High";

  // Efficiency concerns or challenges
  const efficiencyMessage =
    todayWattage < dailyGoal
      ? "Consider optimizing your energy generation process to meet your daily goals."
      : "Great job! You're meeting your daily energy goals.";

  // Comparison with weekly average
  const weeklyAverage = totalWattage / 7;
  const comparisonMessage =
    todayWattage > weeklyAverage
      ? "Your energy output today is above the weekly average."
      : "Your energy output today is below the weekly average.";

  // Prepare data for the graph
  const graphData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], // Days of the week
    datasets: [
      {
        label: "Wattage Generated (Watts)",
        data: weeklyData, // Data from the backend
        backgroundColor: "rgba(48, 203, 15, 0.7)", // Green color with transparency
        borderColor: "rgba(48, 203, 15, 1)", // Green border
        borderWidth: 1,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to stretch vertically
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // White text for the legend
        },
      },
      title: {
        display: true,
        text: "Weekly Wattage Generation",
        color: "white", // White text for the title
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white", // White text for x-axis labels
          font: {
            size: 10, // Smaller font size for the labels
            weight: "bold", // Font weight for the labels
          },
          maxRotation: 45, // Maximum rotation angle for the labels
          minRotation: 0, // Minimum rotation angle for the labels
          align: "center", // Align the labels (can be "start", "center", or "end")
        },
      },
      y: {
        ticks: {
          color: "white", // White text for y-axis labels
          font: {
            size: 10, // Smaller font size for the labels
          },
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
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{
          marginTop: "100px",
        }}
      >
        {/* Centered Heading */}
        <h1 className="text-4xl font-bold text-white mb-20 text-center">
          Check your energy generation stats
        </h1>

        {/* Two Opaque Rectangles */}
        <div className="flex flex-row justify-center items-center w-full space-x-8">
          {/* Left Opaque Rectangle */}
          <div
            className="bg-[#333333] bg-opacity-30 p-12 rounded-2xl shadow-lg text-left"
            style={{
              height: "450px", // Rectangle height
              width: "40%", // Adjusted width
              marginLeft: "-10px", // Move slightly to the left
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Welcome back, {studentId}
            </h2>
            {/* Chart Container */}
            <div
              style={{
                marginTop: "20px", // Move slightly to the left
                height: "330px", // Adjust chart height
              }}
            >
              <Bar data={graphData} options={graphOptions} />
            </div>
          </div>

          {/* Right Opaque Rectangle */}
          <div
            className="bg-[#333333] bg-opacity-30 p-12 rounded-2xl shadow-lg text-left"
            style={{
              height: "450px", // Rectangle height
              width: "50%", // Increased width
              marginLeft: "40px", // Move slightly to the left
            }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              Your Energy Consumption Overview
            </h1>

            {/* Icons Row */}
            <div className="flex justify-between items-center mb-6">
              {/* Icon 1: Energy Output */}
              <div className="flex flex-col items-center">
                <img
                  src={energyOutput === "Low" ? lowEnergyIcon : highEnergyIcon}
                  alt="Energy Output Icon"
                  className="w-12 h-12 mb-2"
                />
                <p className="text-white text-sm">Energy Output</p>
              </div>

              {/* Icon 2: Efficiency */}
              <div className="flex flex-col items-center">
                <img
                  src={
                    efficiencyMessage.includes("optimizing")
                      ? "/path/to/efficiency-concern-icon.png"
                      : "/path/to/efficient-icon.png"
                  }
                  alt="Efficiency Icon"
                  className="w-12 h-12 mb-2"
                />
                <p className="text-white text-sm">Efficiency</p>
              </div>

              {/* Icon 3: Optimization */}
              <div className="flex flex-col items-center">
                <img
                  src={
                    hasMetDailyGoal
                      ? "/path/to/goal-met-icon.png"
                      : "/path/to/optimization-needed-icon.png"
                  }
                  alt="Optimization Icon"
                  className="w-12 h-12 mb-2"
                />
                <p className="text-white text-sm">Optimization</p>
              </div>

              {/* Icon 4: Comparison */}
              <div className="flex flex-col items-center">
                <Link to="/comparison-metrics">
                  <img
                    src={comparisonMetricsIcon}
                    alt="Comparison Icon"
                    className="w-12 h-12 mb-2 cursor-pointer"
                  />
                </Link>
                <p className="text-white text-sm">Comparison</p>
              </div>
            </div>

            {/* Status Messages */}
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
    </div>
  );
}