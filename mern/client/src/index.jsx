import React from "react";
import ReactDOM from "react-dom";
import { UserProvider } from "./context/UserContext"; // Import UserProvider
import router from "./main.jsx"; // Import the router from main.jsx
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider> {/* Wrap the app with UserProvider */}
      <RouterProvider router={router} /> {/* Provide the router */}
    </UserProvider>
  </React.StrictMode>
);