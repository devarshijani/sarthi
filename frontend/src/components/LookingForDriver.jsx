import React from "react";

const LookingForDriver = ({
  pickup,
  destination,
  selectedVehicle,
  onCancel,        // ✅ CALLBACK, NOT STATE
}) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-center mb-5">
        <h3 className="text-2xl font-semibold">Looking for a Driver</h3>
      </div>

      {/* Loader */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
          <div className="w-24 h-24 border-4 border-t-black rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>

      {/* Trip Info */}
      {selectedVehicle && (
        <div className="space-y-4">
          <p><strong>Pickup:</strong> {pickup}</p>
          <p><strong>Destination:</strong> {destination}</p>
          <p><strong>Fare:</strong> {selectedVehicle.price} • Cash</p>
        </div>
      )}

      {/* Cancel */}
      <button
        onClick={onCancel}
        className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-semibold"
      >
        Cancel
      </button>
    </div>
  );
};

export default LookingForDriver;
