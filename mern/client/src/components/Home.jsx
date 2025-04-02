import React from "react";
import backgroundImage from "../assets/background.png"; // Import the background image
import PalmOfHand from "../assets/palm-of-hand.png"; // Import the palm-of-hand.png image
import SNHUCampus from "../assets/snhu-campus.png"; // Import the snhu-campus.png image

export default function Home() {
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
        {/* First Rectangle */}
        <div
          className="bg-[#333333] bg-opacity-30 p-12 w-[80%] rounded-2xl shadow-lg text-left mt-10 flex flex-col justify-between"
          style={{
            height: "600px",
          }}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-bold text-white mb-4 leading-relaxed">
              Track your <span className="glow-text">energy</span> and <br />
              <span className="glow-text">charge</span> your{" "}
              <span className="glow-text">devices</span> on <br />
              the <span className="glow-text">go!</span>
            </h1>
            <img
              src={PalmOfHand}
              alt="Palm of Hand illustration"
              className="w-72 h-72 -ml-20 mt-4 aura-effect"
            />
          </div>
        </div>

        {/* Second Rectangle */}
        <div
          className="bg-[#333333] bg-opacity-30 p-12 w-full rounded-lg shadow-lg text-center mt-40 flex items-start justify-start"
          style={{
            height: "400px",
          }}
        >
          <div className="flex flex-col items-start mr-12">
            <p className="text-3xl font-bold text-white mb-4">Join us at :</p>
            <img
              src={SNHUCampus}
              alt="SNHU Campus building"
              className="w-80 h-auto rounded-2xl"
            />
          </div>
          <div className="text-left flex-1 mt-10">
            <h1 className="text-2xl font-bold text-white mb-4">
              2500 N River Rd, Manchester, NH 03106
            </h1>
            <p className="text-gray-300">
              Operating Hours: 08:00 - 18:00, Monday - Friday. <br />
              Contact us at: (603) 645-9643
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}