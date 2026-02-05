import React, { useRef, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import FinishRide from "./FinishRide";
import LiveTracking from "../components/LiveTracking";
import logo from "../assets/logo.png";
import { SocketDataContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainRiding = () => {
  const panelRef = useRef(null);
  const [panelOpen, setPanelOpen] = useState(true);

  const { socket } = useContext(SocketDataContext);
  const { activeRide } = useContext(CaptainDataContext);

  const location = useLocation();
  const navigate = useNavigate();

  /* ================= RECOVER RIDE SAFELY ================= */
  const ride =
    location.state?.ride ||
    JSON.parse(localStorage.getItem("activeRideData")) ||
    null;

  const captain = JSON.parse(localStorage.getItem("captain"));

  /* ================= PERSIST RIDE ================= */
  useEffect(() => {
    if (ride) {
      localStorage.setItem("activeRideData", JSON.stringify(ride));
    }
  }, [ride]);

  /* ================= SAFE REDIRECT ================= */
  useEffect(() => {
    if (!captain) {
      navigate("/captain-login");
      return;
    }

    if (!ride && !activeRide) {
      navigate("/captain-dashboard");
    }
  }, [ride, captain, activeRide, navigate]);

  /* ================= PANEL ANIMATION ================= */
  useEffect(() => {
    if (!panelRef.current) return;

    gsap.to(panelRef.current, {
      y: panelOpen ? "0%" : "75%",
      duration: 0.4,
      ease: "power3.out",
    });
  }, [panelOpen]);

  /* ================= LIVE GPS (ONGOING ONLY) ================= */
  useEffect(() => {
    if (!socket) return;
    if (!ride || ride.status !== "ongoing") return;
    if (!captain?._id) return;
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        socket.emit("update-location-captain", {
          captainId: captain._id,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        });
      },
      (err) => console.error("GPS error:", err),
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [socket, ride, captain]);

  /* ================= RENDER ================= */
  if (!ride) return null;

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* LOGO */}
      <img
        src={logo}
        alt="logo"
        className="w-14 absolute top-5 left-5 z-20"
      />

      {/* MAP */}
      <LiveTracking pickup={ride.pickupCoords} />

      {/* SLIDING PANEL */}
      <div
        ref={panelRef}
        className="fixed bottom-0 left-0 w-full bg-white rounded-t-3xl p-5 z-30"
      >
        <div
          className="w-full flex justify-center mb-3 cursor-pointer"
          onClick={() => setPanelOpen(!panelOpen)}
        >
          <i className="ri-arrow-up-s-line text-3xl text-gray-400"></i>
        </div>

        <FinishRide ride={ride} />
      </div>
    </div>
  );
};

export default CaptainRiding;
