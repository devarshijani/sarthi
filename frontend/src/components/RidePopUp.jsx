import React from "react";

const RidePopUp = ({ onAccept, onIgnore }) => {
  return (
    <div>
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
          <p className="font-semibold">Harsh Patel</p>
        </div>
        <p className="font-semibold">2.2 KM</p>
      </div>

      <div className="space-y-3 mb-5">
        <p>📍 562/11-A, Kankariya Talab</p>
        <p>🏁 City Mall, Bhopal</p>
        <p>₹193.20 • Cash</p>
      </div>

      <button
        onClick={onAccept}
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
