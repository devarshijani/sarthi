import React, { useEffect, useRef, useState, useContext } from "react";
import map from "../assets/map.png";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { SocketDataContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import gsap from "gsap";

const CaptainDashboard = () => {
  const ridePopupRef = useRef(null);
  const confirmPanelRef = useRef(null);

  const { socket } = useContext(SocketDataContext);
  const { captain } = useContext(CaptainDataContext);

  const [ride, setRide] = useState(null);
  const [showRidePopup, setShowRidePopup] = useState(false);
  const [showConfirmPanel, setShowConfirmPanel] = useState(false);

  /* ================================
     SOCKET JOIN + LOCATION UPDATES
  ================================= */
  useEffect(() => {
    if (!socket || !captain?._id) return;

    socket.emit("join", {
      userType: "captain",
      userId: captain._id,
    });

    const updateLocation = () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    };

    updateLocation(); // first hit
    const intervalId = setInterval(updateLocation, 10000);

    return () => clearInterval(intervalId);
  }, [socket, captain?._id]);

  /* ================================
     RECEIVE NEW RIDE (IMPORTANT)
  ================================= */
  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (rideData) => {
      console.log("🚕 New ride received on captain:", rideData);
      setRide(rideData);
      setShowRidePopup(true);
    };

    socket.on("new-ride", handleNewRide);

    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [socket]);

  /* ================================
     GSAP ANIMATIONS
  ================================= */

  // Ensure panels start hidden (IMPORTANT)
  useEffect(() => {
    gsap.set(ridePopupRef.current, { y: "100%" });
    gsap.set(confirmPanelRef.current, { y: "100%" });
  }, []);

  useEffect(() => {
    gsap.to(ridePopupRef.current, {
      y: showRidePopup ? 0 : "100%",
      duration: 0.5,
      ease: "power3.out",
    });
  }, [showRidePopup]);

  useEffect(() => {
    gsap.to(confirmPanelRef.current, {
      y: showConfirmPanel ? 0 : "100%",
      duration: 0.5,
      ease: "power3.out",
    });
  }, [showConfirmPanel]);

  /* ================================
     HANDLERS
  ================================= */
  const handleAcceptRide = (rideData) => {
    socket.emit("accept-ride", {
      rideId: rideData._id,
      captainId: captain._id,
    });

    setRide(rideData);
    setShowRidePopup(false);
    setShowConfirmPanel(true);
  };


  const handleIgnoreRide = () => {
    setShowRidePopup(false);
  };

  const handleCancelRide = () => {
    setShowConfirmPanel(false);
    setShowRidePopup(false);
  };

  const handleConfirmRide = () => {
    console.log("Ride Started");
    setShowConfirmPanel(false);
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-white">
      {/* MAP */}
      <div className="h-1/2 w-full">
        <img src={map} alt="map" className="h-full w-full object-cover" />
      </div>

      {/* CAPTAIN INFO */}
      <CaptainDetails />

      {/* RIDE REQUEST POPUP */}
      <div
        ref={ridePopupRef}
        className="fixed bottom-0 left-0 w-full bg-white px-4 py-6 rounded-t-3xl shadow-2xl z-20"
      >
        <RidePopUp
          ride={ride}
          onAccept={handleAcceptRide}
          onIgnore={handleIgnoreRide}
        />
      </div>

      {/* CONFIRM RIDE PANEL */}
      <div
        ref={confirmPanelRef}
        className="fixed bottom-0 left-0 w-full bg-white px-4 py-6 rounded-t-3xl shadow-2xl z-30"
      >
        <ConfirmRidePopUp
          onConfirm={handleConfirmRide}
          onCancel={handleCancelRide}
        />
      </div>
    </div>
  );
};

export default CaptainDashboard;
