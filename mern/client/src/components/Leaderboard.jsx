import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Leaderboard() {
  const { id } = useParams(); // Extract the user ID from the URL
  const [dailyLeaderboard, setDailyLeaderboard] = useState([]);
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState([]);

  useEffect(() => {
    async function fetchLeaderboards() {
      try {
        // Fetch daily leaderboard
        const dailyResponse = await fetch("http://localhost:5050/leaderboard/daily");
        if (!dailyResponse.ok) throw new Error("Failed to fetch daily leaderboard");
        const dailyData = await dailyResponse.json();
        setDailyLeaderboard(dailyData);

        // Fetch all-time leaderboard
        const allTimeResponse = await fetch("http://localhost:5050/leaderboard/all-time");
        if (!allTimeResponse.ok) throw new Error("Failed to fetch all-time leaderboard");
        const allTimeData = await allTimeResponse.json();
        setAllTimeLeaderboard(allTimeData);
      } catch (error) {
        console.error("Error fetching leaderboards:", error);
      }
    }

    fetchLeaderboards();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(/src/assets/background.png)`, // Replace with your background image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="bg-[#333333] bg-opacity-30 p-10 w-[80%] rounded-2xl shadow-lg text-center"
        style={{
          marginTop: "50px",
          maxWidth: "800px",
        }}
      >
        <h1 className="text-4xl font-bold text-white mb-6">Leaderboard</h1>
        <p className="text-lg text-gray-300 mb-6">
          See how you rank among other users based on energy usage!
        </p>

        {/* Daily Best Users */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Daily Best Users</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left text-gray-300">
              <thead>
                <tr className="bg-[#444444]">
                  <th className="px-4 py-2">Rank</th>
                  <th className="px-4 py-2">Student ID</th>
                  <th className="px-4 py-2">Watts</th>
                </tr>
              </thead>
              <tbody>
                {dailyLeaderboard.map((user, index) => (
                  <tr
                    key={user.S_ID}
                    className={`${
                      user.S_ID === id
                        ? "bg-green-500 text-white" // Highlight the user's row
                        : index % 2 === 0
                        ? "bg-[#555555]"
                        : "bg-[#444444]"
                    }`}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.S_ID}</td>
                    <td className="px-4 py-2">{user.watts} Watts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* All-Time Top Users */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">All-Time Top Users</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left text-gray-300">
              <thead>
                <tr className="bg-[#444444]">
                  <th className="px-4 py-2">Rank</th>
                  <th className="px-4 py-2">Student ID</th>
                  <th className="px-4 py-2">Watts</th>
                </tr>
              </thead>
              <tbody>
                {allTimeLeaderboard.map((user, index) => (
                  <tr
                    key={user.S_ID}
                    className={`${
                      user.S_ID === id
                        ? "bg-green-500 text-white" // Highlight the user's row
                        : index % 2 === 0
                        ? "bg-[#555555]"
                        : "bg-[#444444]"
                    }`}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.S_ID}</td>
                    <td className="px-4 py-2">{user.watts} Watts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}