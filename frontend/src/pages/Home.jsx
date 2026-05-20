import React, { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";

import logo from "../assets/logo.png";
import LiveTracking from "../components/LiveTracking";

import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";

import { SocketDataContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";

const Home = () => {
  const navigate = useNavigate();

  const { socket } = useContext(SocketDataContext);
  const { user } = useContext(UserDataContext);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [ride, setRide] = useState(null);

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [userCoords, setUserCoords] = useState(null);

  /* ================= GET USER INITIAL LOCATION ================= */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user initial location:", error);
        }
      );
    }
  }, []);

  const [locationPanelOpen, setLocationPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRideOpen, setConfirmRideOpen] = useState(false);
  const [lookingForDriverOpen, setLookingForDriverOpen] = useState(false);
  const [waitingForDriverOpen, setWaitingForDriverOpen] = useState(false);

  /* ================= JOIN SOCKET ================= */
  useEffect(() => {
    if (!socket || !user?._id) return;

    const join = () => {
      socket.emit("join", {
        userType: "user",
        userId: user._id,
      });
    };

    join();
    socket.on("connect", join);

    return () => {
      socket.off("connect", join);
    };
  }, [socket, user?._id]);

  /* ================= SOCKET EVENTS ================= */
  useEffect(() => {
    if (!socket) return;

    const onRideAccepted = ({ ride, captain }) => {
      setRide({ ...ride, captain });
      setLookingForDriverOpen(false);
      setWaitingForDriverOpen(true);
    };

    const onRideStarted = (ride) => {
      localStorage.setItem("activeRide", JSON.stringify(ride));
      navigate("/riding", { state: { ride } });
    };

    socket.on("ride-accepted", onRideAccepted);
    socket.on("ride-started", onRideStarted);

    return () => {
      socket.off("ride-accepted", onRideAccepted);
      socket.off("ride-started", onRideStarted);
    };
  }, [socket, navigate]);

  /* ================= FETCH FARE ================= */
  const findTrip = async () => {
    setVehiclePanelOpen(true);
    setLocationPanelOpen(false);

    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/fare`,
      { params: { pickup, destination }, withCredentials: true }
    );

    setFare(res.data.fare);
  };

  /* ================= FETCH SUGGESTIONS ================= */
  const fetchSuggestions = async (value, type) => {
    if (!value || value.trim().length < 3) {
      type === "pickup"
        ? setPickupSuggestions([])
        : setDestinationSuggestions([]);
      return;
    }

    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`,
      { params: { input: value }, withCredentials: true }
    );

    type === "pickup"
      ? setPickupSuggestions(res.data)
      : setDestinationSuggestions(res.data);
  };

  /* ================= GSAP ================= */
  const locationPanelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRideRef = useRef(null);
  const lookingForDriverRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const findTripCardRef = useRef(null);

  useGSAP(() => {
    const anyOpen =
      locationPanelOpen ||
      vehiclePanelOpen ||
      confirmRideOpen ||
      lookingForDriverOpen ||
      waitingForDriverOpen;

    gsap.to(findTripCardRef.current, {
      opacity: anyOpen ? 0 : 1,
      pointerEvents: anyOpen ? "none" : "auto",
    });

    gsap.to(locationPanelRef.current, {
      height: locationPanelOpen ? "70%" : "0%",
    });

    gsap.to(vehiclePanelRef.current, {
      y: vehiclePanelOpen ? 0 : "100%",
    });

    gsap.to(confirmRideRef.current, {
      y: confirmRideOpen ? 0 : "100%",
    });

    gsap.to(lookingForDriverRef.current, {
      y: lookingForDriverOpen ? 0 : "100%",
    });

    gsap.to(waitingForDriverRef.current, {
      y: waitingForDriverOpen ? 0 : "100%",
    });
  }, [
    locationPanelOpen,
    vehiclePanelOpen,
    confirmRideOpen,
    lookingForDriverOpen,
    waitingForDriverOpen,
  ]);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <div className="fixed w-full h-full top-0 left-0 z-0">
        <LiveTracking pickup={ride?.pickupCoords || pickupCoords || userCoords || { lat: 21.1702, lng: 72.8311 }} />


      </div>

      <img src={logo} className="w-14 absolute left-5 top-5 z-20" />

      {/* FIND TRIP */}
      <div ref={findTripCardRef} className="absolute bottom-0 w-full z-20">
        <div className="bg-white p-6 rounded-t-3xl">
          <div
            onClick={() => {
              setActiveField("pickup");
              setLocationPanelOpen(true);
            }}
            className="bg-gray-100 p-3 rounded-xl mb-3"
          >
            {pickup || "Add a pick-up location"}
          </div>

          <div
            onClick={() => {
              setActiveField("destination");
              setLocationPanelOpen(true);
            }}
            className="bg-gray-100 p-3 rounded-xl"
          >
            {destination || "Enter your destination"}
          </div>

          <button
            onClick={findTrip}
            className="bg-black text-white w-full py-2 mt-3 rounded"
          >
            Find Trip
          </button>
        </div>
      </div>

      <div
        ref={locationPanelRef}
        className="fixed bottom-0 w-full bg-white z-30 rounded-t-3xl"
      >
        <LocationSearchPanel
          activeField={activeField}
          setActiveField={setActiveField}
          pickup={pickup}
          destination={destination}
          setPickup={setPickup}
          setDestination={setDestination}
          pickupSuggestions={pickupSuggestions}
          destinationSuggestions={destinationSuggestions}
          fetchSuggestions={fetchSuggestions}
          setPanelOpen={setLocationPanelOpen}
          setPickupCoords={setPickupCoords}
          setDestinationCoords={setDestinationCoords}
        />
      </div>

      <div
        ref={vehiclePanelRef}
        className="fixed bottom-0 w-full z-40 bg-white translate-y-full"
      >
        <VehiclePanel
          fare={fare}
          setConfirmRideOpen={setConfirmRideOpen}
          setVehiclePanel={setVehiclePanelOpen}
          setSelectedVehicle={setSelectedVehicle}
        />
      </div>

      <div
        ref={confirmRideRef}
        className="fixed bottom-0 w-full z-50 bg-white translate-y-full"
      >
        <ConfirmedRide
          pickup={pickup}
          destination={destination}
          selectedVehicle={selectedVehicle}
          setConfirmRideOpen={setConfirmRideOpen}
          setVehiclePanelOpen={setVehiclePanelOpen}
          setLookingForDriverOpen={setLookingForDriverOpen}
        />

      </div>

      <div
        ref={lookingForDriverRef}
        className="fixed bottom-0 w-full z-60 bg-white translate-y-full"
      >
        <LookingForDriver
          pickup={pickup}
          destination={destination}
          selectedVehicle={selectedVehicle}
          onCancel={() => setLookingForDriverOpen(false)}
        />
      </div>


      <div
        ref={waitingForDriverRef}
        className="fixed bottom-0 w-full z-70 bg-white translate-y-full"
      >
        <WaitingForDriver
          ride={ride}
          setWaitingForDriverOpen={setWaitingForDriverOpen}
          waitingForDriverOpen={waitingForDriverOpen}
        />
      </div>
    </div>
  );
};

export default Home;
