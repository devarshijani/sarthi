import React, { useState } from "react";

const locations = [
  "City Mall",
  "Railway Station",
  "Kempegowda Airport",
  "Bus Stand",
  "MG Road",
];

const LocationSearchPanel = ({
  setPickup,
  setDestination,
  activeField,
  setPanelOpen,
  setVehiclePanel,
  pickup,
  destination,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (place) => {
    if (activeField === "pickup") {
      setPickup(place);
    } else {
      setDestination(place);
    }

    // If both are selected → open vehicle panel
    if (
      (activeField === "pickup" && destination) ||
      (activeField === "destination" && pickup)
    ) {
      setPanelOpen(false);
      setVehiclePanel(true);
    }
  };

  // Handle custom location from search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSelect(searchQuery.trim());
      setSearchQuery(""); // Clear search after selection
    }
  };

  // Filter locations based on search query
  const filteredLocations = locations.filter((place) =>
    place.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="p-5 pb-3 sticky top-0 bg-white z-10">
        <form onSubmit={handleSearchSubmit}>
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-xl">
            <i className="ri-search-line text-xl text-gray-500"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeField === "pickup"
                  ? "Search pickup location..."
                  : "Search destination..."
              }
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-circle-fill text-xl"></i>
              </button>
            )}
          </div>
        </form>

        {/* Show "Use this address" button when user types */}
        {searchQuery.trim() && !filteredLocations.length && (
          <button
            onClick={() => {
              handleSelect(searchQuery.trim());
              setSearchQuery("");
            }}
            className="w-full mt-3 flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <i className="ri-map-pin-add-line text-xl text-blue-600"></i>
            <div className="text-left flex-1">
              <p className="font-semibold text-blue-900">Use this address</p>
              <p className="text-sm text-blue-700">"{searchQuery}"</p>
            </div>
            <i className="ri-arrow-right-line text-blue-600"></i>
          </button>
        )}
      </div>

      {/* Current Location Option */}
      <div className="px-5 pb-3">
        <div
          onClick={() => handleSelect("Current Location")}
          className="flex items-center gap-3 p-4 border-2 border-blue-500 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors"
        >
          <i className="ri-navigation-fill text-2xl text-blue-600"></i>
          <div>
            <p className="font-semibold text-blue-900">Use Current Location</p>
            <p className="text-sm text-blue-700">Enable location services</p>
          </div>
        </div>
      </div>

      {/* Saved/Recent Locations */}
      {!searchQuery && (
        <div className="px-5 pb-2">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">RECENT LOCATIONS</h4>
        </div>
      )}

      {/* Location List */}
      <div className="px-5">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((place, i) => (
            <div
              key={i}
              onClick={() => handleSelect(place)}
              className="flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <i className="ri-map-pin-fill text-lg text-gray-400"></i>
              <div className="flex-1">
                <p className="font-semibold">{place}</p>
                <p className="text-sm text-gray-500">Popular location</p>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </div>
          ))
        ) : searchQuery ? (
          <div className="text-center py-8 text-gray-500">
            <i className="ri-search-line text-4xl mb-2"></i>
            <p>No matching locations found</p>
            <p className="text-sm">Try searching with different keywords</p>
          </div>
        ) : null}
      </div>

      {/* Suggestions when typing */}
      {searchQuery && filteredLocations.length > 0 && (
        <div className="px-5 pb-2 pt-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">SUGGESTIONS</h4>
        </div>
      )}
    </div>
  );
};

export default LocationSearchPanel;