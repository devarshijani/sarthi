import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
  </svg>
);

const CaptainSignup = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 added

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
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
      setErrorMsg(err.response?.data?.message || "Signup failed. Please try again.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Sarthi</h1>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* PERSONAL DETAILS */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Personal Details</h2>

            <div className="flex gap-3">
              <input required type="text" value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="First name" className="w-1/2 input"
              />
              <input required type="text" value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Last name" className="w-1/2 input"
              />
            </div>

            <input required type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full input mt-3"
            />

            {/* Password with eye icon */}
            <div className="relative mt-3">
              <input required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full input pr-10"
              />
              <button type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* VEHICLE DETAILS */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Vehicle Details</h2>

            <div className="flex gap-3">
              <input required type="text" value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                placeholder="Vehicle color" className="w-1/2 input"
              />
              <input required type="text" value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="Vehicle number" className="w-1/2 input"
              />
            </div>

            <div className="flex gap-3 mt-3">
              <input required type="number" value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                placeholder="Capacity" className="w-1/2 input"
              />
              <select required value={vehicleType}
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

          {errorMsg && (
            <p className="text-red-500 text-sm font-semibold mb-2 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md text-lg font-medium disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Signup as Captain"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already a captain?{" "}
          <Link to="/captain-login" className="text-blue-600 font-medium">Login here</Link>
        </p>

        <button onClick={() => navigate("/signup")}
          className="w-full mt-3 border border-black py-2 rounded-md"
        >
          Signup as User
        </button>

        <p className="text-xs text-gray-500 mt-8 leading-relaxed text-center">
          By proceeding, you consent to receive calls, WhatsApp, or SMS messages from Sarthi.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;