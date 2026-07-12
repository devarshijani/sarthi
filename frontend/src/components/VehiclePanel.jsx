import React from "react";

const VehiclePanel = ({
  setVehiclePanel,
  setConfirmRideOpen,
  setSelectedVehicle,
  fare,
  fareLoading,
  fareError,
}) => {
  const f = fare || {};

  const handleVehicleSelect = (vehicle) => {
    if (fareLoading || fareError || !vehicle.price || vehicle.price === "—") return;
    setSelectedVehicle(vehicle);
    setVehiclePanel(false);
    setTimeout(() => {
      setConfirmRideOpen(true);
    }, 400);
  };

  const getPriceDisplay = (value) => {
    if (fareLoading) {
      return (
        <span className="animate-pulse bg-gray-200 h-6 w-16 rounded inline-block" />
      );
    }
    if (value === undefined || value === null) {
      return "—";
    }
    return `₹${value}`;
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

      {fareError ? (
        <div className="text-center py-8 text-red-500 font-medium">
          {fareError}
        </div>
      ) : (
        <>
          <div
            onClick={() =>
              handleVehicleSelect({
                name: "Sarthi Go",
                price: f.car !== undefined && f.car !== null ? `₹${f.car}` : "—",
                image: "🚗",
                capacity: "4 seats",
                time: "2 mins away",
              })
            }
            className="flex justify-between items-center p-4 border-2 rounded-xl mb-3 cursor-pointer hover:border-black transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🚗</span>
              <div>
                <h4 className="font-semibold text-lg">Sarthi Go</h4>
                <p className="text-sm text-gray-600">2 mins away • 4 seats</p>
              </div>
            </div>
            <span className="font-bold text-lg">{getPriceDisplay(f.car)}</span>
          </div>

          <div
            onClick={() =>
              handleVehicleSelect({
                name: "Moto",
                price: f.bike !== undefined && f.bike !== null ? `₹${f.bike}` : "—",
                image: "🏍️",
                capacity: "1 seat",
                time: "3 mins away",
              })
            }
            className="flex justify-between items-center p-4 border-2 rounded-xl mb-3 cursor-pointer hover:border-black transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🏍️</span>
              <div>
                <h4 className="font-semibold text-lg">Moto</h4>
                <p className="text-sm text-gray-600">3 mins away • 1 seat</p>
              </div>
            </div>
            <span className="font-bold text-lg">{getPriceDisplay(f.bike)}</span>
          </div>

          <div
            onClick={() =>
              handleVehicleSelect({
                name: "Auto",
                price: f.auto !== undefined && f.auto !== null ? `₹${f.auto}` : "—",
                image: "🛺",
                capacity: "3 seats",
                time: "2 mins away",
              })
            }
            className="flex justify-between items-center p-4 border-2 rounded-xl mb-3 cursor-pointer hover:border-black transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🛺</span>
              <div>
                <h4 className="font-semibold text-lg">Auto</h4>
                <p className="text-sm text-gray-600">2 mins away • 3 seats</p>
              </div>
            </div>
            <span className="font-bold text-lg">{getPriceDisplay(f.auto)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default VehiclePanel;