import React, { useEffect, useRef, useState } from "react";
import map from "../assets/map.png";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { SocketDataContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import { useContext } from "react";
import gsap from "gsap";

const CaptainDashboard = () => {
  const ridePopupRef = useRef(null);
  const confirmPanelRef = useRef(null);

  const { socket } = useContext(SocketDataContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    console.log(captain)
    socket.emit("join", { userType: "captain", userId: captain?.id })
  }, [captain])

  const [showRidePopup, setShowRidePopup] = useState(true);
  const [showConfirmPanel, setShowConfirmPanel] = useState(false);

  /* Ride popup animation */
  useEffect(() => {
    gsap.to(ridePopupRef.current, {
      y: showRidePopup ? 0 : "100%",
      duration: 0.5,
      ease: "power3.out",
    });
  }, [showRidePopup]);

  /* Confirm panel animation */
  useEffect(() => {
    gsap.to(confirmPanelRef.current, {
      y: showConfirmPanel ? 0 : "100%",
      duration: 0.5,
      ease: "power3.out",
    });
  }, [showConfirmPanel]);

  /* Handlers */
  const handleAcceptRide = () => {
    setShowRidePopup(false);
    setShowConfirmPanel(true);
  };

  const handleIgnoreRide = () => {
    setShowRidePopup(false);
  };

  const handleCancelRide = () => {
    setShowRidePopup(false);
    setShowConfirmPanel(false);
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

      {/* RIDE POPUP */}
      <div
        ref={ridePopupRef}
        className="fixed bottom-0 left-0 w-full bg-white px-4 py-6 rounded-t-3xl shadow-2xl translate-y-full z-20"
      >
        <RidePopUp
          onAccept={handleAcceptRide}
          onIgnore={handleIgnoreRide}
        />
      </div>

      {/* CONFIRM RIDE PANEL */}
      <div
        ref={confirmPanelRef}
        className="fixed bottom-0 left-0 w-full bg-white px-4 py-6 rounded-t-3xl shadow-2xl translate-y-full z-30"
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
