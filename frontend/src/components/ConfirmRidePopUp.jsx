import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmRidePopUp = ({ ride, onConfirm, onCancel }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  if (!ride) return null;

  return (
    <div className="bg-white p-5">
      {/* Drag handle */}
      <div className="flex justify-center mb-3">
        <div
          onClick={onCancel}
          className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer"
        />
      </div>

      <h3 className="text-xl font-semibold mb-4">
        Confirm this ride to Start
      </h3>

      {/* Rider Card */}
      <div className="flex items-center justify-between bg-yellow-400 px-4 py-3 rounded-xl mb-4">
        <div className="flex items-center gap-3">
          {/* Initials Avatar */}
          <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg uppercase">
            {(() => {
              const passengerFirstName = ride.user?.fullname?.firstname || ride.user?.fullName?.firstName || "Passenger";
              return passengerFirstName.charAt(0).toUpperCase();
            })()}
          </div>
          <p className="font-semibold text-black">
            {(() => {
              const passengerFirstName = ride.user?.fullname?.firstname || ride.user?.fullName?.firstName;
              const passengerLastName = ride.user?.fullname?.lastname || ride.user?.fullName?.lastName;
              return passengerFirstName 
                ? `${passengerFirstName} ${passengerLastName || ""}`.trim()
                : "Passenger";
            })()}
          </p>
        </div>
        <p className="font-semibold text-black">
          {(ride.distance / 1000).toFixed(1)} KM
        </p>
      </div>

      {/* Ride Info */}
      <div className="space-y-2 mb-4 text-sm">
        <p>📍 {ride.pickup}</p>
        <p>🏁 {ride.destination}</p>
        <p>₹{ride.fare} • Cash</p>
      </div>

      {/* OTP INPUT */}
      <input
        type="text"
        maxLength={4}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 4-digit OTP"
        className="w-full px-4 py-3 rounded-xl border mb-4 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Confirm Button */}
      <button
        disabled={otp.length !== 4}
        onClick={() => {
          onConfirm(otp);
          // navigate("/captain-riding");
        }}
        className={`w-full py-3 rounded-xl font-semibold mb-3 ${otp.length === 4
          ? "bg-green-600 text-white"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        Confirm
      </button>

      {/* Cancel */}
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
