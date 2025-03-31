import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function UserStats() {
  const navigate = useNavigate();
  const [weeklyData, setWeeklyData] = useState([]); // State to store wattage data
  const [studentId, setStudentId] = useState(""); // State to store S_ID
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the student's weekly wattage data from the backend
    async function fetchWeeklyData() {
      try {
        const response = await fetch("http://localhost:5050/api/student/wattage"); // Replace with your API endpoint
        const data = await response.json();
        setWeeklyData(data.weeklyWattage); // Assuming the API returns an array of daily wattage
        setStudentId(data.S_ID); // Assuming the API returns the student's S_ID
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weekly wattage data:", error);
        setLoading(false);
      }
    }

    fetchWeeklyData();
  }, []);

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
        },
      },
      y: {
        ticks: {
          color: "white", // White text for y-axis labels
        },
        beginAtZero: true,
      },
    },
  };

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
            className="bg-[#333333] bg-opacity-30 p-12 w-[40%] rounded-2xl shadow-lg text-left"
            style={{
              height: "400px",
            }}
          >
            {loading ? (
              <p className="text-white text-center">Loading...</p>
            ) : (
              <>
                {/* Display S_ID */}
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                  Welcome back, {studentId}
                </h2>
                <Bar data={graphData} options={graphOptions} />
              </>
            )}
          </div>

          {/* Right Opaque Rectangle */}
          <div
            className="bg-[#333333] bg-opacity-30 p-12 w-[40%] rounded-2xl shadow-lg text-left"
            style={{
              height: "400px",
            }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              Additional Info
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              This is where you can display more stats or other relevant
              information.
            </p>
            <button
              className="bg-[#30cb0f] text-white px-6 py-2 rounded-full hover:bg-[#28a90d] transition"
              onClick={() => navigate("/about")}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}