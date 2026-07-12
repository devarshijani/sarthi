import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import RatingStars from "../components/RatingStars";
import RatingModal from "../components/RatingModal";

const RideHistory = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [activeRideId, setActiveRideId] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const fetchRides = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      setError(false);

      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/rides/my-rides`, {
        params: { page: pageNum, limit: 10 },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data) {
        if (append) {
          setRides((prev) => [...prev, ...res.data.rides]);
        } else {
          setRides(res.data.rides);
        }
        setHasMore(res.data.hasMore);
        setPage(res.data.page);
      }
    } catch (err) {
      console.error("Fetch rides error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides(1, false);
  }, []);

  const handleLoadMore = () => {
    if (hasMore) {
      fetchRides(page + 1, true);
    }
  };

  const handleRatingSuccess = (newRating) => {
    setRides((prev) =>
      prev.map((r) =>
        r._id === activeRideId ? { ...r, rating: newRating } : r
      )
    );
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4 fixed top-0 w-full z-10 shadow-sm">
        <Link to="/home" className="text-gray-700 hover:text-black">
          <i className="ri-arrow-left-line text-2xl"></i>
        </Link>
        <h2 className="text-xl font-bold text-gray-900">Your Rides</h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-24 pb-8 max-w-2xl w-full mx-auto">
        {loading && rides.length === 0 ? (
          /* Loading Skeletons */
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white p-5 rounded-2xl shadow-sm border animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-2xl border shadow-sm p-8">
            <i className="ri-error-warning-line text-5xl text-red-500 mb-4 block"></i>
            <p className="text-red-600 font-semibold mb-4">Failed to load rides. Please try again.</p>
            <button
              onClick={() => fetchRides(1, false)}
              className="px-6 py-2 bg-black text-white rounded-lg font-semibold"
            >
              Retry
            </button>
          </div>
        ) : rides.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl border shadow-sm p-8">
            <i className="ri-roadster-line text-5xl text-gray-400 mb-4 block"></i>
            <p className="text-gray-600 font-medium mb-6">No rides yet — book your first ride!</p>
            <Link
              to="/home"
              className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Book Now
            </Link>
          </div>
        ) : (
          /* Rides List */
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-yellow-500">●</span> {ride.pickup}
                    </p>
                    <p className="text-sm font-semibold text-gray-700 mt-2 flex items-center gap-2">
                      <span className="text-green-500">■</span> {ride.destination}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getStatusBadgeClass(ride.status)} uppercase`}>
                    {ride.status}
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between items-center text-sm text-gray-500">
                  <div>
                    <span className="capitalize font-medium text-gray-700">{ride.vehicleType}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(ride.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-gray-900">₹{ride.fare}</span>
                  </div>
                </div>

                {ride.captain && (
                  <div className="bg-gray-50 p-2.5 rounded-lg mt-3 flex justify-between items-center text-xs text-gray-600 border border-gray-100">
                    <span>Captain: <span className="font-semibold text-gray-800 capitalize">{ride.captain.fullName?.firstName} {ride.captain.fullName?.lastName}</span></span>
                    {ride.captain.vehicle && (
                      <span className="text-gray-500 uppercase">{ride.captain.vehicle.plate}</span>
                    )}
                  </div>
                )}

                {ride.status === "completed" && (
                  <div className="mt-3 flex justify-between items-center text-xs border-t border-dashed pt-2">
                    <span className="text-gray-500 font-medium">Rating:</span>
                    {ride.rating ? (
                      <RatingStars rating={ride.rating} size="text-sm" />
                    ) : (
                      <button
                        onClick={() => {
                          setActiveRideId(ride._id);
                          setShowRatingModal(true);
                        }}
                        className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-amber-600 transition"
                      >
                        Rate Captain
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-white text-black border border-black rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showRatingModal && (
        <RatingModal
          rideId={activeRideId}
          onClose={() => setShowRatingModal(false)}
          onSuccess={handleRatingSuccess}
        />
      )}
    </div>
  );
};

export default RideHistory;
