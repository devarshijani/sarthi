import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainSignup = () => {
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      fullname: { firstname, lastname },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        type: vehicleType,
      },
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/captains/signup`,
        captainData
      );
      navigate("/captain-login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }

    console.log("Captain Signup Data:", captainData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6">Sarthi</h1>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* PERSONAL DETAILS */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Personal Details</h2>

            <div className="flex gap-3">
              <input
                required
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="First name"
                className="w-1/2 input"
              />
              <input
                required
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Last name"
                className="w-1/2 input"
              />
            </div>

            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full input mt-3"
            />

            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="w-full input mt-3"
            />
          </div>

          {/* VEHICLE DETAILS */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Vehicle Details</h2>

            <div className="flex gap-3">
              <input
                required
                type="text"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                placeholder="Vehicle color"
                className="w-1/2 input"
              />
              <input
                required
                type="text"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="Vehicle number"
                className="w-1/2 input"
              />
            </div>

            <div className="flex gap-3 mt-3">
              <input
                required
                type="number"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                placeholder="Capacity"
                className="w-1/2 input"
              />

              <select
                required
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-1/2 input bg-white"
              >
                <option value="">Vehicle type</option>
                <option value="bike">Bike</option>
                <option value="auto">Auto</option>
                <option value="car">Car</option>
              </select>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md text-lg font-medium"
          >
            Signup as Captain
          </button>
        </form>

        {/* LOGIN SWITCH */}
        <p className="text-sm text-center mt-4">
          Already a captain?{" "}
          <Link to="/captain-login" className="text-blue-600 font-medium">
            Login here
          </Link>
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="w-full mt-3 border border-black py-2 rounded-md"
        >
          Signup as User
        </button>

        <p className="text-xs text-gray-500 mt-8 leading-relaxed text-center">
          By proceeding, you consent to receive calls, WhatsApp, or SMS messages
          from Sarthi.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
