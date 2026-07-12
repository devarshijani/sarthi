import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";
import logo from "../assets/logo.png";
import { SocketDataContext } from "../context/SocketContext";
import RatingModal from "../components/RatingModal";

const Riding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useContext(SocketDataContext);
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [coords, setCoords] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingRideId, setRatingRideId] = useState(null);

  // Fallback data for testing/refresh
  const fallbackRide = {
    captain: {
      fullname: { firstname: "Sarthak" },
      vehicle: { plate: "MP04 AB 1234", vehicleType: "Maruti Suzuki Alto" },
    },
    pickup: "562/11-A, Kankariya Talab, Bhopal",
    destination: "City Mall, Main Road, Bhopal",
    fare: "193.20",
    otp: "1234",
    _id: "dummy_ride_id"
  };

  // Retrieve ride from location state or local storage, OR fallback
  const ride = location.state?.ride || JSON.parse(localStorage.getItem("activeRide")) || fallbackRide;

  /* ================= RESOLVE COORDINATES ================= */
  useEffect(() => {
    if (!ride) return;

    if (ride.pickupCoords && ride.pickupCoords.lat && ride.pickupCoords.lng) {
      setCoords(ride.pickupCoords);
    } else if (ride.pickup) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/api/maps/get-coordinates`, {
          params: { address: ride.pickup },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data && res.data.lat && res.data.lng) {
            setCoords({ lat: Number(res.data.lat), lng: Number(res.data.lng) });
          } else {
            setCoords({ lat: 21.1702, lng: 72.8311 });
          }
        })
        .catch((err) => {
          console.error("Failed to geocode pickup address:", err);
          setCoords({ lat: 21.1702, lng: 72.8311 });
        });
    } else {
      setCoords({ lat: 21.1702, lng: 72.8311 });
    }
  }, [ride]);

  /* ================= SOCKET EVENT FOR RIDE COMPLETION ================= */
  useEffect(() => {
    if (!socket) return;

    const onRideCompleted = (completedRide) => {
      if (completedRide && (completedRide._id === ride?._id || ride?._id === "dummy_ride_id")) {
        setRatingRideId(completedRide._id);
        setShowRatingModal(true);
      }
    };

    socket.on("ride-completed", onRideCompleted);

    return () => {
      socket.off("ride-completed", onRideCompleted);
    };
  }, [socket, ride]);

  const handlePayment = () => {
    alert("Payment successful!");
    setRatingRideId(ride?._id);
    setShowRatingModal(true);
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* HOME BUTTON */}
      <Link
        to="/home"
        className="fixed right-5 top-14 h-12 w-12 bg-white flex items-center justify-center rounded-full shadow-lg z-50"
      >
        <i className="ri-home-4-fill"></i>
      </Link>

      {/* MAP */}
      <div className="fixed w-full h-full top-0 left-0 z-0">
        {coords ? (
          <LiveTracking pickup={coords} />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <i className="ri-loader-4-line text-4xl text-blue-500 animate-spin mb-2 block"></i>
              <p className="text-sm text-gray-500 font-semibold">Loading map coordinates...</p>
            </div>
          </div>
        )}
      </div>

      {/* LOGO */}
      <img
        src={logo}
        alt="logo"
        className="w-14 absolute left-5 top-5 z-20"
      />

      {/* ARRIVAL */}
      <div className="absolute top-5 right-5 bg-white rounded-full px-5 py-2 shadow-lg z-20">
        <p className="text-sm font-semibold flex items-center gap-2">
          <i className="ri-time-line"></i>
          Arrival 10 min
        </p>
      </div>

      {/* BOTTOM PANEL */}
      <div className="fixed bottom-0 w-full bg-white rounded-t-3xl shadow-2xl z-[500]">
        <div className="w-full h-1 bg-gray-200">
          <div className="h-full bg-green-500 w-2/3"></div>
        </div>

        <div className="p-5">
          {/* DRIVER */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center gap-3">
              {/* Initials Avatar */}
              <div className="h-16 w-16 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-2xl uppercase">
                {(() => {
                  const driverFirstName = ride?.captain?.fullName?.firstName || ride?.captain?.fullname?.firstname || (ride?.captain?.name ? ride.captain.name.split(" ")[0] : "") || "Driver";
                  return driverFirstName.charAt(0).toUpperCase();
                })()}
              </div>
              <div>
                <h3 className="font-semibold text-lg capitalize">
                  {ride?.captain?.name || 
                    (ride?.captain?.fullName?.firstName || ride?.captain?.fullname?.firstname
                      ? `${ride?.captain?.fullName?.firstName || ride?.captain?.fullname?.firstname} ${ride?.captain?.fullName?.lastName || ride?.captain?.fullname?.lastname || ""}`.trim()
                      : "Driver")
                  }
                </h3>
                <p className="text-sm text-gray-600 font-semibold capitalize">
                  {ride?.captain?.vehicle?.plate || "—"}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {ride?.vehicleType || ride?.captain?.vehicleType || ride?.captain?.vehicle?.vehicleType || "—"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <h3 className="text-lg font-bold">4.9 ⭐</h3>
              <p className="text-xs text-gray-500">2.2 KM away</p>
            </div>

          </div>

          {/* LOCATIONS */}
          <div className="space-y-4 mb-4">
            <div className="flex items-center gap-3">
              <i className="ri-map-pin-user-fill text-lg text-yellow-500"></i>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Pickup</h3>
                <p className="font-semibold text-base">{ride?.pickup || "Current Location"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="ri-map-pin-2-fill text-lg text-green-500"></i>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Destination</h3>
                <p className="font-semibold text-base">{ride?.destination || "Destination"}</p>
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-gray-100 p-4 rounded-xl mb-4 flex justify-between items-center shadow-inner">
            <div className="flex items-center gap-3">
              <i className="ri-wallet-3-fill text-2xl text-gray-600"></i>
              <div>
                <h3 className="font-bold text-xl">₹{ride?.fare || "0.00"}</h3>
                <p className="text-sm text-gray-600">Cash Payment</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowPaymentPanel(true)}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition-colors"
          >
            Make a Payment
          </button>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md relative">
            <i onClick={() => setShowPaymentPanel(false)} className="absolute top-3 right-3 ri-close-line text-2xl text-gray-500 cursor-pointer"></i>

            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
              Payment Details
            </h3>

            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="flex justify-between font-semibold text-gray-600 mb-2">Total Fare <span className="text-black">₹{ride?.fare}</span> </p>
              <p className="text-xs text-gray-500">Includes all taxes and booking fees</p>
            </div>


            <button
              onClick={handlePayment}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-700 transition"
            >
              Pay Cash
            </button>
          </div>
        </div>
      )}

      {showRatingModal && (
        <RatingModal
          rideId={ratingRideId === "dummy_ride_id" ? ride?._id : ratingRideId}
          onClose={() => navigate("/home")}
          onSuccess={() => console.log("Ride rated successfully")}
        />
      )}
    </div>
  );
};

export default Riding;
