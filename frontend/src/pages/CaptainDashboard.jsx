import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

import LiveTracking from "../components/LiveTracking";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";

import { SocketDataContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import { connectSocket } from "../socket";

const CaptainDashboard = () => {
  const ridePopupRef = useRef(null);
  const confirmPanelRef = useRef(null);

  const navigate = useNavigate(); // ✅ FIX
  const { socket } = useContext(SocketDataContext);
  const { captain } = useContext(CaptainDataContext);

  // IDLE → REQUEST → CONFIRM
  const [rideStage, setRideStage] = useState("IDLE");
  const [ride, setRide] = useState(null);

  /* ================= JOIN SOCKET ================= */
  useEffect(() => {
    if (!socket || !captain?._id) return;

    connectSocket();

    const join = () => {
      socket.emit("join", {
        userType: "captain",
        userId: captain._id,
      });
    };

    if (socket.connected) {
      join();
    } else {
      socket.on("connect", join);
    }

    return () => socket.off("connect", join);
  }, [socket, captain?._id]);

  /* ================= GPS (IDLE MODE) ================= */
  useEffect(() => {
    if (!socket || !captain?._id || !navigator.geolocation) return;

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          socket.emit("update-location-captain", {
            captainId: captain._id,
            location: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
          });
        },
        (err) => {
          console.error("GPS error:", err);
          // Fallback location for testing if GPS is denied
          socket.emit("update-location-captain", {
            captainId: captain._id,
            location: {
              lat: 21.1702,
              lng: 72.8311,
            },
          });
        },
        { enableHighAccuracy: true }
      );
    };

    updateLocation();
    const interval = setInterval(updateLocation, 10000);

    return () => clearInterval(interval);
  }, [socket, captain?._id]);

  /* ================= NEW RIDE ================= */
  useEffect(() => {
    if (!socket) return;

    const onNewRide = (rideData) => {
      if (rideStage !== "IDLE") return;
      setRide(rideData);
      setRideStage("REQUEST");
    };

    socket.on("new-ride", onNewRide);
    return () => socket.off("new-ride", onNewRide);
  }, [socket, rideStage]);

  /* ================= GSAP ================= */
  useEffect(() => {
    gsap.set(ridePopupRef.current, { y: "100%" });
    gsap.set(confirmPanelRef.current, { y: "100%" });
  }, []);

  useEffect(() => {
    gsap.to(ridePopupRef.current, {
      y: rideStage === "REQUEST" ? 0 : "100%",
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(confirmPanelRef.current, {
      y: rideStage === "CONFIRM" ? 0 : "100%",
      duration: 0.4,
      ease: "power3.out",
    });
  }, [rideStage]);

  /* ================= SOCKET EVENTS ================= */
  useEffect(() => {
    if (!socket) return;

    const onRideStarted = (rideData) => {
      setRideStage("IDLE");
      setRide(null);

      // ✅ CORRECT NAVIGATION
      navigate("/captain-riding", { state: { ride: rideData } });
    };

    socket.on("ride-started-success", onRideStarted);
    socket.on("otp-invalid", () => alert("❌ Invalid OTP"));
    socket.on("otp-expired", () => alert("❌ OTP expired — ask the rider to request again"));
    socket.on("otp-locked", () => alert("❌ Too many wrong attempts — ride locked"));

    return () => {
      socket.off("ride-started-success", onRideStarted);
      socket.off("otp-invalid");
      socket.off("otp-expired");
      socket.off("otp-locked");
    };
  }, [socket, navigate]);

  /* ================= HANDLERS ================= */
  const handleAcceptRide = () => {
    socket.emit("accept-ride", {
      rideId: ride._id,
      captainId: captain._id,
    });
    setRideStage("CONFIRM");
  };

  const handleConfirmRide = (otp) => {
    socket.emit("ride-start", {
      rideId: ride._id,
      otp,
    });
  };

  /* ================= RENDER ================= */
  return (
    <div className="h-screen w-full relative overflow-hidden bg-white">
      {/* MAP */}
      <div className="h-1/2 w-full relative z-0">
        <LiveTracking pickup={ride?.pickupCoords || { lat: 21.1702, lng: 72.8311 }} />
      </div>

      {/* CAPTAIN INFO */}
      <CaptainDetails />

      {/* REQUEST PANEL */}
      <div
        ref={ridePopupRef}
        className="fixed bottom-0 w-full bg-white rounded-t-3xl z-20"
      >
        <RidePopUp
          ride={ride}
          onAccept={handleAcceptRide}
          onIgnore={() => setRideStage("IDLE")}
        />
      </div>

      {/* OTP PANEL */}
      <div
        ref={confirmPanelRef}
        className="fixed bottom-0 w-full bg-white rounded-t-3xl z-30"
      >
        <ConfirmRidePopUp
          ride={ride}
          onConfirm={handleConfirmRide}
          onCancel={() => setRideStage("IDLE")}
        />
      </div>
    </div>
  );
};

export default CaptainDashboard;
