import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const ConfirmRidePopUp = ({ open, onConfirm, onCancel }) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [otp, setOtp] = useState("");

  // GSAP animation
  useEffect(() => {
    if (open) {
      gsap.to(panelRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      gsap.to(panelRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power3.in",
      });
    }
  }, [open]);

  return (
    <div
      ref={panelRef}
      className="fixed bottom-0 left-0 w-full bg-white rounded-t-3xl p-5 z-50"
      style={{ transform: "translateY(100%)" }}
    >
      {/* Drag Arrow */}
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
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="user"
            className="h-10 w-10 rounded-full"
          />
          <p className="font-semibold">Harshi Pateliya</p>
        </div>
        <p className="font-semibold">2.2 KM</p>
      </div>

      {/* Ride Info */}
      <div className="space-y-2 mb-4 text-sm">
        <p>📍 562/11-A, Kankariya Talab</p>
        <p>🏁 City Mall, Bhopal</p>
        <p>₹193.20 • Cash</p>
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
          onConfirm();
          navigate("/captain-riding");
        }}
        className={`w-full py-3 rounded-xl font-semibold mb-3 transition ${
          otp.length === 4
            ? "bg-green-600 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
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
