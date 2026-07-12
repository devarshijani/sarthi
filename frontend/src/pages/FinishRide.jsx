import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketDataContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

const FinishRide = ({ ride }) => {
  const navigate = useNavigate();
  const { socket } = useContext(SocketDataContext);
  const { setActiveRide } = useContext(CaptainDataContext);

  /* ================= FINISH RIDE HANDLER ================= */
  const handleFinishRide = () => {
    if (!ride?._id) return;

    // 1️⃣ Notify backend that ride is completed
    socket.emit("complete-ride", {
      rideId: ride._id,
    });

    // 2️⃣ Clear captain active ride state (context)
    setActiveRide(false);

    // 3️⃣ Clear persisted ride recovery data
    localStorage.removeItem("activeRideData");

    // 4️⃣ Navigate back to captain dashboard
    navigate("/captain-dashboard");
  };

  /* ================= CANCEL HANDLER ================= */
  const handleCancel = () => {
    navigate("/captain-dashboard");
  };

  /* ================= RENDER ================= */
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Finish this ride
      </h3>

      <div className="flex items-center justify-between bg-yellow-400 px-4 py-3 rounded-xl mb-4">
        <div className="flex items-center gap-3">
          {/* Initials Avatar */}
          <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg uppercase">
            {(() => {
              const passengerFirstName = ride?.user?.fullname?.firstname || ride?.user?.fullName?.firstName || "Passenger";
              return passengerFirstName.charAt(0).toUpperCase();
            })()}
          </div>
          <p className="font-semibold text-black">
            {(() => {
              const passengerFirstName = ride?.user?.fullname?.firstname || ride?.user?.fullName?.firstName;
              const passengerLastName = ride?.user?.fullname?.lastname || ride?.user?.fullName?.lastName;
              return passengerFirstName 
                ? `${passengerFirstName} ${passengerLastName || ""}`.trim()
                : "Passenger";
            })()}
          </p>
        </div>
        <p className="font-semibold text-black">—</p>
      </div>

      <div className="space-y-3 mb-6 text-sm">
        <p>📍 {ride?.pickup || "Pickup location"}</p>
        <p>🏁 {ride?.destination || "Destination"}</p>
        <p>₹{ride?.fare || "--"} • Cash</p>
      </div>

      <button
        onClick={handleFinishRide}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold mb-3"
      >
        Finish ride
      </button>

      <button
        onClick={handleCancel}
        className="w-full bg-gray-300 text-black py-3 rounded-xl font-semibold"
      >
        Cancel
      </button>
    </div>
  );
};

export default FinishRide;
