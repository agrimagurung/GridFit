import React, { useState, useRef } from "react";

export default function About() {
  const [tooltip, setTooltip] = useState({ text: "", top: 0, left: 0, visible: false });
  const imageRef = useRef(null); // Reference to the image container

  // Team members with approximate positions (adjust values for better accuracy)
  const teamMembers = [
    { name: "Agrima", position: { top: "52%", left: "7%" }, size: { width: "2.5rem", height: "5rem" } },
    { name: "Adrienne", position: { top: "48%", left: "18%" }, size: { width: "2.3rem", height: "5rem" } },
    { name: "Kyle", position: { top: "46%", left: "29%" }, size: { width: "2.6rem", height: "5.8rem" } },
    { name: "Dillon", position: { top: "42%", left: "65.6%" }, size: { width: "2.3rem", height: "6rem" } },
    { name: "Ryan", position: { top: "41%", left: "77%" }, size: { width: "2.7rem", height: "5.5rem" } },
    { name: "Colin", position: { top: "41%", left: "91%" }, size: { width: "3.6rem", height: "6rem" } },
  ];

  const handleHover = (name, event) => {
    if (imageRef.current) {
      const containerRect = imageRef.current.getBoundingClientRect();
      const elementRect = event.target.getBoundingClientRect();

      setTooltip({
        text: name,
        top: elementRect.top - containerRect.top - 30, // Position above the hovered element
        left: elementRect.left - containerRect.left + elementRect.width / 2, // Center horizontally
        visible: true,
      });
    }
  };

  const handleLeave = () => {
    setTooltip({ text: "", top: 0, left: 0, visible: false });
  };

  return (
    <div
      className="min-w-[1024px] overflow-x-auto"
      style={{
        backgroundImage: `url(/src/assets/background.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* First Row */}
      <div className="flex flex-row items-center justify-center min-h-screen" style={{ marginTop: "100px" }}>
        {/* Left Image */}
        <div className="w-[50%] h-[800px]">
          <img
            src="/src/assets/about-page-filler-img-1.jpg"
            alt="About Page Filler"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Opaque Rectangle */}
        <div className="bg-[#333333] bg-opacity-30 p-12 w-[50%] h-[800px] shadow-lg text-left">
          <h1 className="text-5xl font-bold text-white mb-6">About GridFit</h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            GridFit is a platform designed to help students track their energy usage and optimize their device charging habits.
            Our mission is to provide tools and insights that empower users to make smarter energy decisions.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mt-6">
            Whether you're on campus or on the go, GridFit ensures you stay connected and powered up. Join us in creating a more
            sustainable future by making informed energy choices.
          </p>

          {/* Team Photo with Interactive Tooltip */}
          <div ref={imageRef} className="relative mx-auto w-full">
            {/* Header Above the Image */}
            <h2 className="text-3xl font-bold text-white text-center mb-4">Meet Our Team</h2>

            {/* Team Photo */}
            <img
              src="/src/assets/team-photo.jpg"
              alt="Team Photo"
              className="w-full h-auto mt-4 rounded-lg shadow-md"
            />

            {/* Hotspots for Team Members */}
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="absolute cursor-pointer"
                style={{
                  top: member.position.top,
                  left: member.position.left,
                  width: member.size.width, // Apply custom width
                  height: member.size.height, // Apply custom height
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  border: "2px solid transparent",
                }}
                onMouseEnter={(e) => handleHover(member.name, e)}
                onMouseLeave={handleLeave}
              />
            ))}

            {/* Tooltip */}
            {tooltip.visible && (
              <div
                className="absolute bg-black text-white text-sm px-4 py-2 rounded shadow-lg transition-opacity opacity-100"
                style={{
                  top: `${tooltip.top}px`,
                  left: `${tooltip.left}px`,
                  transform: "translate(-50%, -100%)",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                }}
              >
                {tooltip.text}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-row items-center justify-center min-h-screen">
        {/* Left Opaque Rectangle */}
        <div className="bg-[#333333] bg-opacity-30 p-12 w-[50%] h-[800px] shadow-lg text-left">
          <h1 className="text-4xl font-bold text-white mb-6">Our Mission</h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            At GridFit, we aim to revolutionize energy tracking and device charging habits. Our goal is to empower users with
            tools and insights to make smarter energy decisions.
          </p>
        </div>

        {/* Right Image */}
        <div className="w-[50%] h-[800px]">
          <img
            src="/src/assets/about-page-filler-img-2.png"
            alt="About Page Filler 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
