import React from "react";

const ConfirmedRide = ({ 
  setConfirmRideOpen, 
  setVehiclePanelOpen, 
  setLookingForDriverOpen, // NEW
  pickup, 
  destination, 
  selectedVehicle 
}) => {
  
  const handleConfirmRide = () => {
    setConfirmRideOpen(false);
    setTimeout(() => {
      setLookingForDriverOpen(true);
    }, 400);
  };

  return (
    <div>
      {/* Header with back arrow */}
      <div className="flex items-center justify-between mb-5">
        <i
          onClick={() => {
            setConfirmRideOpen(false);
            setVehiclePanelOpen(true);
          }}
          className="ri-arrow-down-wide-line text-3xl text-gray-400 cursor-pointer"
        />
        <h3 className="text-xl font-semibold">Confirm your Ride</h3>
        <div className="w-8"></div>
      </div>

      {/* Vehicle Card */}
      {selectedVehicle && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-5">
          <span className="text-5xl">{selectedVehicle.image}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{selectedVehicle.name}</h4>
            <p className="text-sm text-gray-600">{selectedVehicle.time} • {selectedVehicle.capacity}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl">{selectedVehicle.price}</p>
          </div>
        </div>
      )}

      {/* Trip Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <i className="ri-map-pin-fill text-xl text-green-600"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pickup Location</p>
            <p className="font-semibold">{pickup || "562/11-A"}</p>
            <p className="text-sm text-gray-600">Kankariya Talab, Bhopal</p>
          </div>
        </div>

        <div className="border-l-2 border-dashed border-gray-300 h-8 ml-2"></div>

        <div className="flex items-start gap-3">
          <div className="mt-1">
            <i className="ri-map-pin-fill text-xl text-red-600"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">Destination</p>
            <p className="font-semibold">{destination || "562/11-A"}</p>
            <p className="text-sm text-gray-600">Kankariya Talab, Bhopal</p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
        <div className="flex items-center gap-3">
          <i className="ri-wallet-3-line text-2xl"></i>
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="font-semibold">Cash</p>
          </div>
        </div>
        <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
      </div>

      {/* Confirm Button */}
      <button 
        onClick={handleConfirmRide}
        className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors"
      >
        Confirm Ride
      </button>
    </div>
  );
};

export default ConfirmedRide;