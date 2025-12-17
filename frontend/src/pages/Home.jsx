import React from "react";
import homepage from "../assets/homepage.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="flex flex-col items-center text-center px-6 max-w-sm space-y-5">
        {/* Logo / Image */}
        <img
          src={homepage}
          alt="Homepage"
          className="w-44 h-auto drop-shadow-md"
        />

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-gray-800">Welcome to</h1>

        <h2 className="text-5xl font-extrabold text-black tracking-tight">
          Sarthi<span className="text-gray-600">.</span>
        </h2>

        {/* Tagline */}
        <p className="text-base text-gray-600 tracking-wide">
          More than just a ride
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full py-3 bg-black text-white rounded-full text-lg font-medium 
                    hover:bg-gray-900 active:scale-95 transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Home;
