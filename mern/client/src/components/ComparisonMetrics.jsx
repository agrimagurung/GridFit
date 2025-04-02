// filepath: c:\Users\kokic\GRIDFIT\mern\client\src\components\ComparisonMetrics.jsx
import React, { useEffect, useState, useRef } from "react";
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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ComparisonMetrics() {
  const [weeklyData, setWeeklyData] = useState({});
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null); // Reference to the chart instance

  useEffect(() => {
    // Fetch user stats from the backend
    async function fetchWeeklyData() {
      try {
        const response = await fetch("http://localhost:5050/api/userstats/2222222"); // Replace with dynamic S_ID
        if (!response.ok) {
          throw new Error("Failed to fetch weekly data");
        }
        const data = await response.json();
        setWeeklyData(data.weeklyData || {});
        setWeeklyAverage(
          Object.values(data.weeklyData || {}).reduce((sum, wattage) => sum + Number(wattage), 0) / 7
        );
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchWeeklyData();

    // Cleanup function to destroy the chart instance
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (loading) {
    return <p className="text-white text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  // Prepare data for the chart
  const chartData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Daily Wattage (Watts)",
        data: Object.values(weeklyData),
        backgroundColor: "rgba(48, 203, 15, 0.7)", // Green color with transparency
        borderColor: "rgba(48, 203, 15, 1)", // Green border
        borderWidth: 1,
      },
      {
        label: "Weekly Average (Watts)",
        data: Array(7).fill(weeklyAverage), // Fill the array with the weekly average
        backgroundColor: "rgba(255, 99, 132, 0.5)", // Red color with transparency
        borderColor: "rgba(255, 99, 132, 1)", // Red border
        borderWidth: 1,
        type: "line", // Display as a line
      },
    ],
  };

  const chartOptions = {
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
        text: "Weekly Energy Comparison",
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Comparison Metrics</h1>
      <p className="text-lg mb-8">
        Explore how your energy generation compares to averages and other users.
      </p>

      {/* Chart */}
      <div className="bg-[#333333] bg-opacity-30 p-8 rounded-lg shadow-lg w-3/4">
        <h2 className="text-2xl font-bold text-white mb-4">Weekly Comparison</h2>
        <Bar
          ref={chartRef} // Attach the chart instance to the ref
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
}