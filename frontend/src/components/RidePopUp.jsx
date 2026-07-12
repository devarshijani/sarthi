import React from "react";

const RidePopUp = ({ ride, onAccept, onIgnore }) => {
  return (
    <div className="bg-white p-5 rounded-t-3xl">
      <h3 className="text-xl font-semibold mb-4">
        New Ride Available!
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
        <p className="font-semibold text-black">2.2 KM</p>
      </div>

      <div className="space-y-3 mb-5">
        <p>📍 {ride?.pickup}</p>
        <p>🏁 {ride?.destination}</p>
        <p>₹{ride?.fare} • Cash</p>
      </div>

      <button
        onClick={() => onAccept(ride)}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold mb-3"
      >
        Accept
      </button>


      <button
        onClick={onIgnore}
        className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
      >
        Ignore
      </button>
    </div>
  );
};

export default RidePopUp;
