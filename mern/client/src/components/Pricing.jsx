// filepath: c:\Users\kokic\mern-stack-example\mern\client\src\components\Pricing.jsx
import React from "react";

export default function Pricing() {
  return (
    <div
      className="min-w-[1024px] overflow-x-auto"
      style={{
        backgroundImage: `url(/src/assets/background.png)`, // Replace with your background image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{
          marginTop: "50px", // Add margin to move the content further down
        }}
      >
        {/* Opaque Rectangle */}
        <div
          className="bg-[#333333] bg-opacity-30 p-12 w-[80%] rounded-2xl shadow-lg text-center"
          style={{
            maxWidth: "800px", // Optional: Limit the width of the rectangle
          }}
        >
          <h1 className="text-4xl font-bold text-white mb-6">Pricing Plans</h1>
          <p className="text-lg text-gray-300 mb-6">
            Choose the plan that best fits your needs. We offer flexible pricing to help you stay connected and powered up.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic</h2>
              <p className="text-gray-600 mb-4">Perfect for individuals.</p>
              <p className="text-3xl font-bold text-gray-800 mb-4">$9.99/month</p>
              <button className="bg-[#a0bf73] text-white px-6 py-2 rounded-full hover:bg-[#8fae63] transition">
                Choose Plan
              </button>
            </div>

            {/* Standard Plan */}
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Standard</h2>
              <p className="text-gray-600 mb-4">Great for small teams.</p>
              <p className="text-3xl font-bold text-gray-800 mb-4">$19.99/month</p>
              <button className="bg-[#a0bf73] text-white px-6 py-2 rounded-full hover:bg-[#8fae63] transition">
                Choose Plan
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Premium</h2>
              <p className="text-gray-600 mb-4">Ideal for enterprises.</p>
              <p className="text-3xl font-bold text-gray-800 mb-4">$29.99/month</p>
              <button className="bg-[#a0bf73] text-white px-6 py-2 rounded-full hover:bg-[#8fae63] transition">
                Choose Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}