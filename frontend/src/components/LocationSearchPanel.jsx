import React, { useEffect, useState } from "react";

const LocationSearchPanel = ({
  activeField,
  setActiveField,
  pickup,
  destination,
  setPickup,
  setDestination,
  pickupSuggestions,
  destinationSuggestions,
  fetchSuggestions,
  setPanelOpen,
  setVehiclePanel,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (activeField === "pickup") {
      setQuery(pickup);
    } else if (activeField === "destination") {
      setQuery(destination);
    }
  }, [activeField, pickup, destination]);

  useEffect(() => {
    fetchSuggestions(query, activeField);
  }, [query, activeField]);

  const suggestions =
    activeField === "pickup" ? pickupSuggestions : destinationSuggestions;

  const handleSelect = (place) => {
    if (activeField === "pickup") {
      setPickup(place.displayName);
      setActiveField("destination");
    } else {
      setDestination(place.displayName);
      setActiveField(null);
      setPanelOpen(false);
    }
  };

  return (
    <div className="p-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${activeField}`}
        className="w-full p-3 border rounded-lg mb-3"
      />

      {Array.isArray(suggestions) &&
        suggestions.map((place, i) => (
          <div
            key={i}
            onClick={() => handleSelect(place)}
            className="p-3 border-b cursor-pointer hover:bg-gray-100"
          >
            {place.displayName}
          </div>
        ))}
    </div>
  );
};

export default LocationSearchPanel;
