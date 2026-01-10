import React from "react";
import {navigate} from "react-router-dom";

const FinishRide = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Confirm this ride to Start</h3>

      <div className="flex items-center justify-between bg-yellow-400 px-4 py-3 rounded-xl mb-4">
        <div className="flex items-center gap-3">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="user"
            className="h-10 w-10 rounded-full"
          />
          <p className="font-semibold">Harshi Pateliya</p>
        </div>
        <p className="font-semibold">2.2 KM</p>
      </div>

      <div className="space-y-3 mb-6 text-sm">
        <p>📍 562/11-A, Kankariya Talab</p>
        <p>🏁 City Mall, Bhopal</p>
        <p>₹193.20 • Cash</p>
      </div>

      <button onClick={() => navigate("/captain-home")} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold mb-3">
        Finish ride!
      </button>

      <button className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold">
        Cancel
      </button>

    </div>
  );
};

export default FinishRide;
