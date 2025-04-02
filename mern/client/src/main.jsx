// CONTROLS THE ENTRY POINT OF THE REACT APPLICATION
// This file is responsible for rendering the main application and setting up routing

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";

// Import custom components for routing
import App from "./App";
import Login from "./components/Login"; // Login page
import UserStats from "./components/UserStats"; // User stats page
import Leaderboard from "./components/Leaderboard"; // Leaderboard page
import About from "./components/About"; // About page
import Pricing from "./components/Pricing"; // Pricing page
import Home from "./components/Home"; // Home page

// Create a browser router
const router = createBrowserRouter([
  {
    path: "/*", // Add the trailing "*" to allow deeper matching
    element: <App />, // Main app component
    children: [
      {
        index: true, // Default child route (Login page)
        element: <Login />, // Set Login as the default page
      },
      {
        path: "login", // Login page
        element: <Login />,
      },
      {
        path: "stats/:id", // Dynamic route for specific S_ID
        element: <UserStats />,
      },
      {
        path: "leaderboard", // Leaderboard page
        element: <Leaderboard />,
      },
      {
        path: "about", // About page
        element: <About />,
      },
      {
        path: "pricing", // Pricing page
        element: <Pricing />,
      },
      {
        path: "*", // Fallback route for undefined paths
        element: (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-lg mb-8">The page you are looking for does not exist.</p>
            <a
              href="/"
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
            >
              Go Back to Home
            </a>
          </div>
        ),
      },
    ],
  },
]);

// Render the React application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
