import React from "react";

const WaitingForDriver = ({
  setWaitingForDriverOpen,
  pickup,
  destination,
  selectedVehicle,
}) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h5
          className="p-1 text-center w-[93%] absolute top-0"
          onClick={() => {
            setWaitingForDriverOpen(false);
          }}
        >
          <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
        </h5>
      </div>

      {/* Driver Card */}
      <div className="flex items-center justify-between bg-yellow-400 rounded-lg p-3 mt-5">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjzE6procPzT4lGu4C32IqWcwBtKbQi2GK_g&s"
            alt="Driver"
          />
          <h2 className="text-lg font-medium">Santh</h2>
        </div>
        <h4 className="text-xl font-semibold">2.2 KM</h4>
      </div>

      {/* Vehicle Details */}
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          {/* Car Info */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-3xl ri-car-fill"></i>
            <div className="flex-1">
              <h3 className="text-lg font-medium">
                {selectedVehicle?.name || "UberGo"}
              </h3>
              <p className="text-sm text-gray-600">
                White Suzuki S-Presso LXI
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold">KA15AK00-0</h3>
              <div className="flex items-center gap-1">
                <i className="ri-star-fill text-yellow-500 text-sm"></i>
                <span className="text-sm font-medium">4.9</span>
              </div>
            </div>
          </div>

          {/* OTP/Message */}
          <div className="flex items-center gap-5 p-3 border-b-2 bg-gray-50">
            <i className="text-3xl ri-message-2-fill"></i>
            <div className="flex-1">
              <h3 className="text-lg font-medium">Send a message...</h3>
            </div>
            <i className="text-2xl ri-send-plane-fill text-gray-400"></i>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-around py-4 border-b-2">
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-shield-check-fill text-2xl text-blue-600"></i>
              </div>
              <span className="text-sm font-medium">Safety</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-share-fill text-2xl text-blue-600"></i>
              </div>
              <span className="text-sm font-medium">Share my trip</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-phone-fill text-2xl text-blue-600"></i>
              </div>
              <span className="text-sm font-medium">Call driver</span>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {pickup || "Kaikondrahalli, Bengaluru, Karnataka"}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {destination || "Kaikondrahalli, Bengaluru, Karnataka"}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">
                {selectedVehicle?.price || "₹193.20"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;