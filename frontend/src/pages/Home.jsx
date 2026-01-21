import React, { useContext, useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";

import logo from "../assets/logo.png";
import map from "../assets/map.png";

import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";

import { SocketDataContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const { sendMessage, receiveMessage } = useContext(SocketDataContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    console.log(user)
    sendMessage("join", { userType: "user", userId: user?.id })
  }, [user])

  /* ---------------- FETCH FARE ---------------- */
  async function findTrip() {
    setVehiclePanelOpen(true);
    setLocationPanelOpen(false);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/fare`,
        {
          params: { pickup, destination },
          withCredentials: true,
        }
      );
      console.log("Fare API Response:", response.data);
      setFare(response.data.fare);
    } catch (error) {
      console.error("Error fetching fare:", error);
    }
  }

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [locationPanelOpen, setLocationPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRideOpen, setConfirmRideOpen] = useState(false);
  const [lookingForDriverOpen, setLookingForDriverOpen] = useState(false);
  const [waitingForDriverOpen, setWaitingForDriverOpen] = useState(false);

  const locationPanelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRideRef = useRef(null);
  const lookingForDriverRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const findTripCardRef = useRef(null);
  const panelCloseRef = useRef(null);

  /* ---------------- FETCH SUGGESTIONS ---------------- */

  const fetchSuggestions = async (value, type) => {
    if (!value) {
      if (type === "pickup") setPickupSuggestions([]);
      if (type === "destination") setDestinationSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`,
        {
          params: { input: value },
          withCredentials: true,
        }
      );

      if (type === "pickup") {
        setPickupSuggestions(res.data);
      } else {
        setDestinationSuggestions(res.data);
      }
    } catch (err) {
      console.error("Suggestion fetch failed", err);
    }
  };


  /* ---------------- LOCATION PANEL ANIMATION ---------------- */

  useGSAP(() => {
    gsap.to(locationPanelRef.current, {
      height: locationPanelOpen ? "70%" : "0%",
      duration: 0.35,
      ease: "power2.out",
    });

    gsap.to(findTripCardRef.current, {
      opacity: locationPanelOpen || vehiclePanelOpen || confirmRideOpen || lookingForDriverOpen || waitingForDriverOpen ? 0 : 1,
      pointerEvents: locationPanelOpen || vehiclePanelOpen || confirmRideOpen || lookingForDriverOpen || waitingForDriverOpen ? "none" : "auto",
      duration: 0.2,
    });

    if (panelCloseRef.current) {
      gsap.to(panelCloseRef.current, {
        opacity: locationPanelOpen ? 1 : 0,
        pointerEvents: locationPanelOpen ? "auto" : "none",
      });
    }
  }, [locationPanelOpen, vehiclePanelOpen, confirmRideOpen, lookingForDriverOpen, waitingForDriverOpen]);

  /* ---------------- VEHICLE PANEL ---------------- */

  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      transform: vehiclePanelOpen ? "translateY(0%)" : "translateY(100%)",
      duration: 0.35,
    });
  }, [vehiclePanelOpen]);

  /* ---------------- CONFIRM PANEL ---------------- */

  useGSAP(() => {
    gsap.to(confirmRideRef.current, {
      transform: confirmRideOpen ? "translateY(0%)" : "translateY(100%)",
      duration: 0.35,
    });
  }, [confirmRideOpen]);

  /* ---------------- DRIVER PANELS ---------------- */

  useGSAP(() => {
    gsap.to(lookingForDriverRef.current, {
      transform: lookingForDriverOpen ? "translateY(0%)" : "translateY(100%)",
    });
  }, [lookingForDriverOpen]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriverOpen ? "translateY(0%)" : "translateY(100%)",
    });
  }, [waitingForDriverOpen]);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <img src={map} className="h-full w-full object-cover" />
      <img src={logo} className="w-14 absolute left-5 top-5 z-20" />

      {/* FIND TRIP CARD */}
      <div ref={findTripCardRef} className="absolute bottom-0 w-full z-20">
        <div className="bg-white p-6 rounded-t-3xl">
          <h4 className="text-2xl font-semibold mb-4">Find a trip</h4>

          <div
            onClick={() => {
              setActiveField("pickup");
              setLocationPanelOpen(true);
            }}
            className="bg-gray-100 p-3 rounded-xl mb-3 cursor-pointer"
          >
            {pickup || "Add a pick-up location"}
          </div>

          <div
            onClick={() => {
              setActiveField("destination");
              setLocationPanelOpen(true);
            }}
            className="bg-gray-100 p-3 rounded-xl cursor-pointer"
          >
            {destination || "Enter your destination"}
          </div>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
          >
            Find Trip
          </button>
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
        className="fixed bottom-0 left-0 w-full h-0 bg-white z-30 rounded-t-3xl overflow-y-auto"
      >
        <LocationSearchPanel
          activeField={activeField}
          pickup={pickup}
          destination={destination}
          setPickup={setPickup}
          setDestination={setDestination}
          pickupSuggestions={pickupSuggestions}
          destinationSuggestions={destinationSuggestions}
          fetchSuggestions={fetchSuggestions}
          setPanelOpen={setLocationPanelOpen}
          setVehiclePanel={setVehiclePanelOpen}
          setActiveField={setActiveField}
        />

      </div>

      {/* VEHICLE PANEL */}
      <div ref={vehiclePanelRef} className="fixed bottom-0 w-full z-40 bg-white px-3 py-10 pt-12 translate-y-full">
        <VehiclePanel
          setVehiclePanel={setVehiclePanelOpen}
          setConfirmRideOpen={setConfirmRideOpen}
          setSelectedVehicle={setSelectedVehicle}
          fare={fare}
        />
      </div>

      {/* CONFIRM RIDE */}
      <div ref={confirmRideRef} className="fixed bottom-0 w-full z-50 bg-white px-3 py-6 pt-12 translate-y-full">
        <ConfirmedRide
          pickup={pickup}
          destination={destination}
          selectedVehicle={selectedVehicle}
          setLookingForDriverOpen={setLookingForDriverOpen}
          setConfirmRideOpen={setConfirmRideOpen}
          setVehiclePanelOpen={setVehiclePanelOpen}
        />
      </div>

      <div ref={lookingForDriverRef} className="fixed bottom-0 w-full z-60 bg-white px-3 py-6 pt-12 translate-y-full">
        <LookingForDriver
          setWaitingForDriverOpen={setWaitingForDriverOpen}
          setLookingForDriverOpen={setLookingForDriverOpen}
          pickup={pickup}
          destination={destination}
          selectedVehicle={selectedVehicle}
        />
      </div>

      <div ref={waitingForDriverRef} className="fixed bottom-0 w-full z-70 bg-white px-3 py-6 pt-12 translate-y-full">
        <WaitingForDriver />
      </div>
    </div>
  );
};

export default Home;
