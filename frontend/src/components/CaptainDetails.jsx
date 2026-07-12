import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketDataContext } from "../context/SocketContext";

const CaptainDetails = ({ activeRide = false }) => {
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketDataContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const onAvailabilityUpdated = ({ status }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setCaptain((prev) => ({ ...prev, status }));
    };

    socket.on("availability-updated", onAvailabilityUpdated);

    return () => {
      socket.off("availability-updated", onAvailabilityUpdated);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [socket, setCaptain]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("captainToken");
        if (!token) return;

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/rides/captain-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch captain stats:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const isToggleDisabled = activeRide || captain?.status === "on-trip";

  const handleToggle = () => {
    if (isToggleDisabled) return;

    const currentAvailable = captain?.status === "available";
    const nextAvailable = !currentAvailable;
    const optimisticStatus = nextAvailable ? "available" : "unavailable";

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setCaptain((prev) => ({ ...prev, status: optimisticStatus }));

    if (socket) {
      socket.emit("toggle-availability", { available: nextAvailable });
    }

    timeoutRef.current = setTimeout(() => {
      setCaptain((prev) => {
        alert("Connection timed out. Status could not be updated.");
        return { ...prev, status: currentAvailable ? "available" : "unavailable" };
      });
    }, 3000);
  };

  const firstName = captain?.fullName?.firstName || captain?.fullname?.firstname;
  const lastName = captain?.fullName?.lastName || captain?.fullname?.lastname;
  
  const hasName = firstName || lastName;
  const captainName = hasName 
    ? `${firstName || ""} ${lastName || ""}`.trim() 
    : "Captain";

  const vehicleType = captain?.vehicleType || captain?.vehicle?.type || "";
  const plate = captain?.vehicle?.plate || "";
  const vehicleName = (vehicleType && plate)
    ? `${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} - ${plate}`
    : "—";

  const initial = firstName ? firstName.charAt(0).toUpperCase() : "C";

  return (
    <div className="h-1/2 p-4 bg-gray-50 flex flex-col justify-between">
      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between flex-1">
        {/* Captain Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Initials Avatar */}
            <div className="h-14 w-14 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xl uppercase">
              {initial}
            </div>
            <div>
              <h4 className="text-lg font-semibold capitalize flex items-center gap-2">
                {captainName}
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 normal-case">
                  {loading ? (
                    <span className="animate-pulse bg-amber-200 h-3 w-8 rounded"></span>
                  ) : error ? (
                    "New"
                  ) : stats?.ratingCount > 0 ? (
                    <>
                      <i className="ri-star-fill text-amber-500"></i>
                      {stats?.averageRating} ({stats?.ratingCount})
                    </>
                  ) : (
                    "New"
                  )}
                </span>
              </h4>
              <p className="text-sm text-gray-500">{vehicleName}</p>
            </div>
          </div>

          <div className="text-right">
            <h4 className="text-xl font-bold">
              {loading ? (
                <span className="animate-pulse bg-gray-200 h-6 w-16 rounded inline-block"></span>
              ) : error ? (
                "—"
              ) : (
                `₹${stats?.totalEarnings?.toLocaleString()}`
              )}
            </h4>
            <p className="text-sm text-gray-500">Earned</p>
          </div>
        </div>

        {/* Real stats row replacing the static online box */}
        <div className="mt-6 grid grid-cols-4 gap-2 text-center bg-gray-50 p-4 rounded-xl">
          <div className="flex flex-col items-center border-r border-gray-200">
            <span className="text-xs text-gray-500 font-medium">Today's ₹</span>
            <span className="text-sm font-bold text-gray-800 mt-1">
              {loading ? (
                <span className="animate-pulse bg-gray-200 h-4 w-10 rounded inline-block"></span>
              ) : error ? (
                "—"
              ) : (
                `₹${stats?.todayEarnings?.toLocaleString()}`
              )}
            </span>
          </div>
          <div className="flex flex-col items-center border-r border-gray-200">
            <span className="text-xs text-gray-500 font-medium">Today's Trips</span>
            <span className="text-sm font-bold text-gray-800 mt-1">
              {loading ? (
                <span className="animate-pulse bg-gray-200 h-4 w-8 rounded inline-block"></span>
              ) : error ? (
                "—"
              ) : (
                stats?.todayTrips
              )}
            </span>
          </div>
          <div className="flex flex-col items-center border-r border-gray-200">
            <span className="text-xs text-gray-500 font-medium">Total Earned</span>
            <span className="text-sm font-bold text-gray-800 mt-1">
              {loading ? (
                <span className="animate-pulse bg-gray-200 h-4 w-12 rounded inline-block"></span>
              ) : error ? (
                "—"
              ) : (
                `₹${stats?.totalEarnings?.toLocaleString()}`
              )}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 font-medium">Total Trips</span>
            <span className="text-sm font-bold text-gray-800 mt-1">
              {loading ? (
                <span className="animate-pulse bg-gray-200 h-4 w-8 rounded inline-block"></span>
              ) : error ? (
                "—"
              ) : (
                stats?.totalTrips
              )}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gray-200 my-4"></div>

        {/* Status Toggle Switch */}
        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl mt-4 border border-gray-100">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              {captain?.status === "available" ? "Online" : "Offline"}
            </span>
            <span className="text-xs text-gray-500">
              {captain?.status === "available"
                ? "Receiving ride requests"
                : "Not receiving requests"}
            </span>
          </div>

          <div className="relative flex items-center">
            {isToggleDisabled && (
              <span className="text-xs text-red-500 font-semibold mr-3">
                Finish your ride first
              </span>
            )}
            <button
              disabled={isToggleDisabled}
              onClick={handleToggle}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                isToggleDisabled
                  ? "bg-gray-200 cursor-not-allowed"
                  : captain?.status === "available"
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
              title={isToggleDisabled ? "Finish your ride first" : ""}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  captain?.status === "available" ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
