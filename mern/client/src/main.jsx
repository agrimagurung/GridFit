import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import custom components for routing
import App from "./App";
import Login from "./components/Login"; // Login page
import UserStats from "./components/UserStats"; // User stats page
import Leaderboard from "./components/Leaderboard"; // Leaderboard page
import About from "./components/About"; // About page
import Pricing from "./components/Pricing"; // Pricing page
import "./index.css";

// Create a browser router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Main app component
    children: [
      {
        path: "/", // Login page
        element: <Login />,
      },
      {
        path: "/stats", // User stats page
        element: <UserStats />,
      },
      {
        path: "/leaderboard", // Leaderboard page
        element: <Leaderboard />,
      },
      {
        path: "/about", // About page
        element: <About />,
      },
      {
        path: "/pricing", // Pricing page
        element: <Pricing />, // Add the Pricing route here
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
