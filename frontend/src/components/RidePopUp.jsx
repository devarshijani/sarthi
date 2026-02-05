import React from "react";

const RidePopUp = ({ ride, onAccept, onIgnore }) => {
  return (
    <div className="bg-white p-5 rounded-t-3xl">
      <h3 className="text-xl font-semibold mb-4">
        New Ride Available!
      </h3>

      <div className="flex items-center justify-between bg-yellow-400 px-4 py-3 rounded-xl mb-4">
        <div className="flex items-center gap-3">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="user"
            className="h-10 w-10 rounded-full"
          />
          <p className="font-semibold">{ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}</p>
        </div>
        <p className="font-semibold">2.2 KM</p>
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
