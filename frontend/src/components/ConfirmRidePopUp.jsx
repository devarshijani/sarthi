import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopUp = ({ onConfirm, onCancel }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Confirm this ride to Start
      </h3>

      {/* Rider Card */}
      <div className="flex items-center justify-between bg-yellow-400 px-4 py-3 rounded-xl mb-4">
        <div className="flex items-center gap-3">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="user"
            className="h-10 w-10 rounded-full"
          />
          <p className="font-semibold">Harshi Pateliya</p>
        </div>
        <p className="font-semibold">2.2 KM</p>
      </div>

      {/* Ride Details */}
      <div className="space-y-3 mb-4">
        <p>📍 562/11-A, Kankariya Talab</p>
        <p>🏁 City Mall, Bhopal</p>
        <p>₹193.20 • Cash</p>
      </div>

      {/* ✅ OTP SECTION (THIS WAS MISSING) */}
      <div className="mb-4">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Confirm Button */}
      <button
        onClick={() => {
          if (!otp) {
            alert("Please enter OTP");
            return;
          }
          onConfirm();
          navigate("/captain-riding");
        }}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold mb-3"
      >
        Confirm
      </button>

      {/* Cancel Button */}
      <button
        onClick={onCancel}
        className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold"
      >
        Cancel
      </button>
    </div>
  );
};

export default ConfirmRidePopUp;
