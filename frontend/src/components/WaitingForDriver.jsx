import React from "react";

const WaitingForDriver = ({
  setWaitingForDriverOpen,
  ride
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
          {/* Initials Avatar */}
          <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl uppercase">
            {(() => {
              const driverFirstName = ride?.captain?.fullName?.firstName || ride?.captain?.fullname?.firstname || (ride?.captain?.name ? ride.captain.name.split(" ")[0] : "") || "Driver";
              return driverFirstName.charAt(0).toUpperCase();
            })()}
          </div>
          <h2 className="text-lg font-medium capitalize text-black">
            {ride?.captain?.name || 
              (ride?.captain?.fullName?.firstName || ride?.captain?.fullname?.firstname
                ? `${ride?.captain?.fullName?.firstName || ride?.captain?.fullname?.firstname} ${ride?.captain?.fullName?.lastName || ride?.captain?.fullname?.lastname || ""}`.trim()
                : "Driver")
            }
          </h2>
        </div>
        <h4 className="text-xl font-semibold text-black">-2.2 KM</h4>
      </div>

      {/* Vehicle Details */}
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          {/* Car Info */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-3xl ri-car-fill"></i>
            <div className="flex-1">
              <h3 className="text-lg font-medium capitalize">
                {ride?.vehicleType || ride?.captain?.vehicleType || ride?.captain?.vehicle?.vehicleType || "—"}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {ride?.captain?.vehicle?.color || "—"}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold capitalize">{ride?.captain?.vehicle?.plate}</h3>
              <div className="flex items-center gap-1">
                <i className="ri-star-fill text-yellow-500 text-sm"></i>
                <span className="text-sm font-medium">4.9</span>
              </div>
            </div>
          </div>

          {/* OTP/Message */}
          <div className="flex items-center gap-5 p-3 border-b-2 bg-gray-50">
            <i className="text-3xl ri-lock-password-fill"></i>
            <div className="flex-1">
              <h3 className="text-lg font-medium">OTP: {ride?.otp}</h3>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {ride?.pickup}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {ride?.destination}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">
                ₹{ride?.fare}
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