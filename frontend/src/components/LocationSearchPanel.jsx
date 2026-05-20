import React, { useEffect, useState } from "react";
import axios from "axios";

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
  setPickupCoords,
  setDestinationCoords,
}) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse search history:", e);
      }
    }
  }, []);

  const saveToHistory = (place) => {
    if (!place || !place.displayName) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.displayName !== place.displayName);
      const updated = [place, ...filtered].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  const removeHistoryItem = (idx) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/maps/reverse-geocode`,
            {
              params: { lat: latitude, lng: longitude },
              withCredentials: true,
            }
          );

          if (res.data && res.data.displayName) {
            const place = {
              displayName: res.data.displayName,
              lat: latitude,
              lng: longitude,
            };
            saveToHistory(place);
            if (activeField === "pickup") {
              setPickup(res.data.displayName);
              if (setPickupCoords) {
                setPickupCoords({ lat: latitude, lng: longitude });
              }
              setActiveField("destination");
            } else {
              setDestination(res.data.displayName);
              if (setDestinationCoords) {
                setDestinationCoords({ lat: latitude, lng: longitude });
              }
              setActiveField(null);
              setPanelOpen(false);
            }
          }
        } catch (error) {
          console.error("Error reverse-geocoding coordinates:", error);
          alert("Failed to get address for your location. Please type manually.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error getting user location:", error);
        alert("Unable to retrieve your location. Please check browser permissions.");
        setIsLoading(false);
      }
    );
  };

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
    saveToHistory(place);
    if (activeField === "pickup") {
      setPickup(place.displayName);
      if (setPickupCoords) {
        setPickupCoords({ lat: place.lat, lng: place.lng });
      }
      setActiveField("destination");
    } else {
      setDestination(place.displayName);
      if (setDestinationCoords) {
        setDestinationCoords({ lat: place.lat, lng: place.lng });
      }
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
        className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
      />

      {/* "Use Current Location" Premium Button */}
      <div
        onClick={!isLoading ? handleUseCurrentLocation : null}
        className={`flex items-center p-3 rounded-xl border border-blue-100 bg-blue-50/20 mb-4 transition-all duration-200 cursor-pointer ${
          isLoading ? "opacity-70 cursor-not-allowed bg-blue-50/10" : "hover:bg-blue-50/60 hover:border-blue-200 active:scale-[0.98]"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <i
              className={`ri-focus-3-line text-xl text-blue-600 mr-3 ${
                isLoading ? "animate-spin" : "animate-pulse"
              }`}
            ></i>
            <div>
              <span className="font-semibold text-gray-800 text-sm block">
                {isLoading ? "Getting current location..." : "Use current location"}
              </span>
              <span className="text-xs text-gray-500 block">
                {isLoading ? "Fetching address from GPS" : "Locate using device GPS"}
              </span>
            </div>
          </div>
          {!isLoading && <i className="ri-arrow-right-s-line text-blue-500 text-lg"></i>}
        </div>
      </div>

      {/* Recent Searches Section */}
      {(!query || query.trim() === "") && recentSearches.length > 0 && (
        <div className="mt-2 mb-4">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center">
              <i className="ri-history-line text-sm mr-1"></i> Recent Searches
            </span>
            <button
              onClick={clearAllHistory}
              className="text-xs text-red-500 hover:text-red-600 transition-colors font-medium active:scale-95 flex items-center"
            >
              <i className="ri-delete-bin-line mr-1"></i> Clear all
            </button>
          </div>
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {recentSearches.map((place, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/30 hover:bg-gray-50/70 transition-all duration-200 group cursor-pointer"
              >
                <div
                  className="flex items-center flex-1 min-w-0"
                  onClick={() => handleSelect(place)}
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-200">
                    <i className="ri-map-pin-line text-base"></i>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900">
                      {place.displayName}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {Number(place.lat).toFixed(4)}, {Number(place.lng).toFixed(4)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeHistoryItem(idx);
                  }}
                  className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all duration-200"
                  title="Remove from history"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Autocomplete Search Results */}
      {query && query.trim().length >= 3 && Array.isArray(suggestions) && suggestions.length > 0 && (
        <div className="mt-2 space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-1 block mb-2">
            Search Results
          </span>
          {suggestions.map((place, i) => (
            <div
              key={i}
              onClick={() => handleSelect(place)}
              className="flex items-center p-2.5 rounded-xl border border-gray-100 hover:border-blue-100 bg-white hover:bg-blue-50/10 transition-all duration-200 group cursor-pointer active:scale-[0.99]"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors duration-200">
                <i className="ri-map-pin-2-line text-base"></i>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900">
                  {place.displayName}
                </p>
                {place.lat && place.lng && (
                  <p className="text-[10px] text-gray-400 truncate">
                    {Number(place.lat).toFixed(4)}, {Number(place.lng).toFixed(4)}
                  </p>
                )}
              </div>
              <i className="ri-arrow-right-up-line text-gray-300 group-hover:text-blue-500 text-lg transition-colors duration-200 animate-pulse"></i>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchPanel;
