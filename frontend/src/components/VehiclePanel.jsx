import React from "react";

const vehicles = [
  { name: "UberGo", price: "₹193.20", image: "🚗", capacity: "4 seats", time: "2 mins away" },
  { name: "Moto", price: "₹65.17", image: "🏍️", capacity: "1 seat", time: "3 mins away" },
  { name: "Auto", price: "₹118.21", image: "🛺", capacity: "3 seats", time: "2 mins away" },
];

const VehiclePanel = ({ setVehiclePanel, setConfirmRideOpen, setSelectedVehicle }) => {
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle); // Store the selected vehicle
    setVehiclePanel(false);
    setTimeout(() => {
      setConfirmRideOpen(true);
    }, 400);
  };

  return (
    <div>
      {/* Arrow */}
      <div className="flex justify-center mb-4">
        <i
          onClick={() => setVehiclePanel(false)}
          className="ri-arrow-down-wide-line text-3xl text-gray-400 cursor-pointer"
        />
      </div>

      <h3 className="text-xl font-semibold mb-4">Choose a Vehicle</h3>

      {vehicles.map((v, i) => (
        <div
          key={i}
          onClick={() => handleVehicleSelect(v)}
          className="flex justify-between items-center p-4 border-2 rounded-xl mb-3 cursor-pointer hover:border-black transition-all"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{v.image}</span>
            <div>
              <h4 className="font-semibold text-lg">{v.name}</h4>
              <p className="text-sm text-gray-600">{v.time} • {v.capacity}</p>
            </div>
          </div>
          <span className="font-bold text-lg">{v.price}</span>
        </div>
      ))}
    </div>
  );
};

export default VehiclePanel;