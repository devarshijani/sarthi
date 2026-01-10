import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import FinishRide from "./FinishRide";
import map from "../assets/map.png";
import logo from "../assets/logo.png";

const CaptainRiding = () => {
  const panelRef = useRef(null);
  const [panelOpen, setPanelOpen] = useState(true);

  useEffect(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        y: "0%",
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(panelRef.current, {
        y: "75%",
        duration: 0.4,
        ease: "power3.out",
      });
    }
  }, [panelOpen]);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* LOGO */}
      <img
        src={logo}
        alt="logo"
        className="w-14 absolute top-5 left-5 z-20"
      />

      {/* MAP */}
      <img src={map} alt="map" className="h-full w-full object-cover" />

      {/* SLIDING PANEL */}
      <div
        ref={panelRef}
        className="fixed bottom-0 left-0 w-full bg-white rounded-t-3xl p-5 z-30 translate-y-0"
      >
        {/* ARROW */}
        <div
          className="w-full flex justify-center mb-3 cursor-pointer"
          onClick={() => setPanelOpen(!panelOpen)}
        >
          <i className="ri-arrow-up-s-line text-3xl text-gray-400"></i>
        </div>

        <FinishRide />
      </div>
    </div>
  );
};

export default CaptainRiding;
