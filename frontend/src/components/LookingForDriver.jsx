import React, { useEffect } from "react";

const LookingForDriver = ({
  setLookingForDriverOpen,
  setWaitingForDriverOpen,
  pickup,
  destination,
  selectedVehicle,
}) => {
  // Simulate finding a driver after 3 seconds
  useEffect(() => {
    if (
      typeof setLookingForDriverOpen !== "function" ||
      typeof setWaitingForDriverOpen !== "function"
    ) {
      console.error("LookingForDriver: setter props missing");
      return;
    }

    const timer = setTimeout(() => {
      setLookingForDriverOpen(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLookingForDriverOpen, setWaitingForDriverOpen]);


  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h5
          className="p-1 text-center w-[93%] absolute top-0"
          onClick={() => {
            setLookingForDriverOpen(false);
          }}
        >
          <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
        </h5>
        <h3 className="text-2xl font-semibold mb-5">Looking for a Driver</h3>
      </div>

      {/* Loading Animation */}
      <div className="flex justify-center mb-5">
        <div className="relative">
          {/* Animated circles */}
          <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
          <div className="w-24 h-24 border-4 border-t-black rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>

      {/* Vehicle Info */}
      {selectedVehicle && (
        <div className="flex gap-2 justify-between flex-col items-center">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <span className="text-5xl">{selectedVehicle.image}</span>
            <div className="w-full mt-5">
              <div className="flex items-center gap-3 p-3 border-b-2">
                <i className="ri-map-pin-user-fill"></i>
                <div>
                  <h3 className="text-lg font-medium">{pickup}</h3>
                  <p className="text-sm -mt-1 text-gray-600">Kankariya Talab, Bhopal</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border-b-2">
                <i className="text-lg ri-map-pin-2-fill"></i>
                <div>
                  <h3 className="text-lg font-medium">{destination}</h3>
                  <p className="text-sm -mt-1 text-gray-600">Kankariya Talab, Bhopal</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3">
                <i className="ri-currency-line"></i>
                <div>
                  <h3 className="text-lg font-medium">{selectedVehicle.price}</h3>
                  <p className="text-sm -mt-1 text-gray-600">Cash</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Text */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Finding a driver nearby...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          This usually takes a few moments
        </p>
      </div>

      {/* Cancel Button */}
      <button
        onClick={() => setLookingForDriverOpen(false)}
        className="w-full mt-5 bg-red-600 text-white font-semibold p-3 rounded-lg hover:bg-red-700 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
};

export default LookingForDriver;