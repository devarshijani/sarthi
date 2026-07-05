import React from "react";
import axios from "axios";

const ConfirmedRide = ({
  setConfirmRideOpen,
  setVehiclePanelOpen,
  setLookingForDriverOpen,
  pickup,
  destination,
  selectedVehicle,
}) => {

  const handleConfirmRide = async () => {
    if (!selectedVehicle) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup,
          destination,
          vehicleType:
            selectedVehicle.name === "Moto"
              ? "bike"
              : selectedVehicle.name === "UberGo"
                ? "car"
                : "auto",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // ✅ CRITICAL UI FLOW
      setConfirmRideOpen(false);
      setLookingForDriverOpen(true);

    } catch (err) {
      console.error("Ride creation failed:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <i
          onClick={() => {
            setConfirmRideOpen(false);
            setVehiclePanelOpen(true);
          }}
          className="ri-arrow-down-wide-line text-3xl text-gray-400 cursor-pointer"
        />
        <h3 className="text-xl font-semibold">Confirm your Ride</h3>
        <div className="w-8" />
      </div>

      {selectedVehicle && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-5">
          <span className="text-5xl">{selectedVehicle.image}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{selectedVehicle.name}</h4>
            <p className="text-sm text-gray-600">
              {selectedVehicle.time} • {selectedVehicle.capacity}
            </p>
          </div>
          <p className="font-bold text-xl">{selectedVehicle.price}</p>
        </div>
      )}

      <button
        onClick={handleConfirmRide}
        className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg"
      >
        Confirm Ride
      </button>
    </div>
  );
};

export default ConfirmedRide;
