import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import logo from "../assets/logo.png";
import map from "../assets/map.png";

import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [activeField, setActiveField] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [locationPanelOpen, setLocationPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRideOpen, setConfirmRideOpen] = useState(false);
  const [lookingForDriverOpen, setLookingForDriverOpen] = useState(false);
  const [waitingForDriverOpen, setWaitingForDriverOpen] = useState(false); // NEW

  const locationPanelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRideRef = useRef(null);
  const lookingForDriverRef = useRef(null);
  const waitingForDriverRef = useRef(null); // NEW
  const findTripCardRef = useRef(null);
  const panelCloseRef = useRef(null);

  /* ---------------- AUTO SWITCH TO DESTINATION AFTER PICKUP ---------------- */
  useEffect(() => {
    if (pickup && activeField === "pickup" && locationPanelOpen) {
      setTimeout(() => {
        setActiveField("destination");
      }, 300);
    }
  }, [pickup, activeField, locationPanelOpen]);

  /* ---------------- LOCATION PANEL ---------------- */
  useGSAP(() => {
    gsap.to(locationPanelRef.current, {
      height: locationPanelOpen ? "70%" : "0%",
      duration: 0.35,
      ease: "power2.out",
    });
    
    // Hide find trip card when location panel, waiting for driver, or looking for driver is open
    const shouldHide = locationPanelOpen || waitingForDriverOpen || lookingForDriverOpen;
    
    gsap.to(findTripCardRef.current, {
      opacity: shouldHide ? 0 : 1,
      pointerEvents: shouldHide ? "none" : "auto",
      duration: 0.2,
    });

    if (panelCloseRef.current) {
      gsap.to(panelCloseRef.current, {
        opacity: locationPanelOpen ? 1 : 0,
        pointerEvents: locationPanelOpen ? "auto" : "none",
        duration: 0.2,
      });
    }
  }, [locationPanelOpen, waitingForDriverOpen, lookingForDriverOpen]);

  /* ---------------- VEHICLE PANEL ---------------- */
  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      transform: vehiclePanelOpen ? "translateY(0%)" : "translateY(100%)",
      duration: 0.35,
      ease: "power2.out",
    });
  }, [vehiclePanelOpen]);

  /* ---------------- CONFIRM PANEL ---------------- */
  useGSAP(() => {
    gsap.to(confirmRideRef.current, {
      transform: confirmRideOpen ? "translateY(0%)" : "translateY(100%)",
      duration: 0.35,
      ease: "power2.out",
    });
  }, [confirmRideOpen]);

  /* ---------------- LOOKING FOR DRIVER PANEL ---------------- */
  useGSAP(() => {
    gsap.to(lookingForDriverRef.current, {
      transform: lookingForDriverOpen ? "translateY(0%)" : "translateY(100%)",
      duration: 0.35,
      ease: "power2.out",
    });
  }, [lookingForDriverOpen]);

  /* ---------------- WAITING FOR DRIVER PANEL ---------------- */
  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriverOpen ? "translateY(0%)" : "translateY(100%)",
      duration: 0.35,
      ease: "power2.out",
    });
  }, [waitingForDriverOpen]);

  const handlePickupClick = () => {
    setActiveField("pickup");
    setLocationPanelOpen(true);
  };

  const handleDestinationClick = () => {
    setActiveField("destination");
    setLocationPanelOpen(true);
  };

  const handleClearPickup = () => {
    setPickup("");
    setActiveField("pickup");
  };

  const handleClearDestination = () => {
    setDestination("");
    setActiveField("destination");
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* MAP */}
      <img src={map} alt="map" className="h-full w-full object-cover" />

      {/* LOGO */}
      <img
        src={logo}
        alt="logo"
        className="w-14 absolute left-5 top-5 z-20"
      />

      {/* FIND TRIP CARD */}
      <div 
        ref={findTripCardRef}
        className="absolute bottom-0 w-full z-20"
      >
        <div className="bg-white p-6 rounded-t-3xl shadow-xl">
          <h4 className="text-2xl font-semibold mb-4">Find a trip</h4>

          <div className="relative">
            <div
              onClick={handlePickupClick}
              className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl mb-3 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <i className="ri-map-pin-line text-lg"></i>
              <span className="text-gray-700 flex-1">{pickup || "Add a pick-up location"}</span>
              {pickup && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearPickup();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="ri-close-circle-fill text-xl"></i>
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <div
              onClick={handleDestinationClick}
              className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <i className="ri-flag-line text-lg"></i>
              <span className="text-gray-700 flex-1">{destination || "Enter your destination"}</span>
              {destination && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearDestination();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="ri-close-circle-fill text-xl"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      <div
        ref={panelCloseRef}
        onClick={() => setLocationPanelOpen(false)}
        className="fixed inset-0 bg-black bg-opacity-30 z-25 opacity-0 pointer-events-none"
      />

      {/* LOCATION SEARCH PANEL */}
      <div
        ref={locationPanelRef}
        className="fixed bottom-0 left-0 w-full h-0 bg-white z-30 rounded-t-3xl overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between z-10">
          <button 
            onClick={() => {
              if (activeField === "destination" && pickup) {
                setActiveField("pickup");
              } else {
                setLocationPanelOpen(false);
              }
            }}
            className="text-2xl text-gray-600 hover:text-gray-800"
          >
            <i className="ri-arrow-left-line"></i>
          </button>
          <h3 className="text-xl font-semibold">
            {activeField === "pickup" ? "Select Pickup Location" : "Select Destination"}
          </h3>
          <button 
            onClick={() => setLocationPanelOpen(false)}
            className="text-2xl text-gray-600 hover:text-gray-800"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        {activeField === "destination" && pickup && (
          <div className="p-4 bg-gray-50 border-b">
            <p className="text-sm text-gray-500 mb-1">Pickup Location</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="ri-map-pin-fill text-green-600"></i>
                <span className="font-semibold">{pickup}</span>
              </div>
              <button
                onClick={handleClearPickup}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {activeField === "pickup" && destination && (
          <div className="p-4 bg-gray-50 border-b">
            <p className="text-sm text-gray-500 mb-1">Destination</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="ri-flag-fill text-red-600"></i>
                <span className="font-semibold">{destination}</span>
              </div>
              <button
                onClick={handleClearDestination}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Change
              </button>
            </div>
          </div>
        )}
        
        <LocationSearchPanel
          setPickup={setPickup}
          setDestination={setDestination}
          activeField={activeField}
          setPanelOpen={setLocationPanelOpen}
          setVehiclePanel={setVehiclePanelOpen}
          pickup={pickup}
          destination={destination}
        />
      </div>

      {/* VEHICLE PANEL */}
      <div
        ref={vehiclePanelRef}
        className="fixed bottom-0 left-0 w-full z-40 translate-y-full bg-white rounded-t-3xl px-3 py-6 shadow-2xl overflow-y-auto"
        style={{ maxHeight: '80vh' }}
      >
        <VehiclePanel
          setVehiclePanel={setVehiclePanelOpen}
          setConfirmRideOpen={setConfirmRideOpen}
          setSelectedVehicle={setSelectedVehicle}
        />
      </div>

      {/* CONFIRM RIDE PANEL */}
      <div
        ref={confirmRideRef}
        className="fixed bottom-0 left-0 w-full z-50 translate-y-full bg-white rounded-t-3xl px-3 py-6 shadow-2xl overflow-y-auto"
        style={{ maxHeight: '85vh' }}
      >
        <ConfirmedRide
          setConfirmRideOpen={setConfirmRideOpen}
          setVehiclePanelOpen={setVehiclePanelOpen}
          setLookingForDriverOpen={setLookingForDriverOpen}
          pickup={pickup}
          destination={destination}
          selectedVehicle={selectedVehicle}
        />
      </div>

      {/* LOOKING FOR DRIVER PANEL */}
      <div
        ref={lookingForDriverRef}
        className="fixed bottom-0 left-0 w-full z-60 translate-y-full bg-white rounded-t-3xl px-3 py-6 shadow-2xl overflow-y-auto"
        style={{ maxHeight: '85vh' }}
      >
        <LookingForDriver
          setLookingForDriverOpen={setLookingForDriverOpen}
          setWaitingForDriverOpen={setWaitingForDriverOpen}
          pickup={pickup}
          destination={destination}
          selectedVehicle={selectedVehicle}
        />
      </div>

      {/* WAITING FOR DRIVER PANEL */}
      <div
        ref={waitingForDriverRef}
        className="fixed bottom-0 left-0 w-full z-70 translate-y-full bg-white rounded-t-3xl px-3 py-6 shadow-2xl overflow-y-auto"
        style={{ maxHeight: '90vh' }}
      >
        <WaitingForDriver
          setWaitingForDriverOpen={setWaitingForDriverOpen}
          pickup={pickup}
          destination={destination}
          selectedVehicle={selectedVehicle}
        />
      </div>
    </div>
  );
};

export default Home;