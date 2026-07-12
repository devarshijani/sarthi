import React, { useState, useEffect } from "react";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainDetails = () => {
  const { captain } = React.useContext(CaptainDataContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
              <h4 className="text-lg font-semibold capitalize">{captainName}</h4>
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

        {/* Status */}
        <div className="text-center py-2 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-xs font-medium">
            You are online and ready to accept rides
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
