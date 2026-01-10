import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainLogin = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = { email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/captains/login`,
        data
      );

      setCaptain(response.data.captain);
      localStorage.setItem("captainToken", response.data.token);
      navigate("/captain-dashboard");

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-3xl font-bold text-center mb-6">
          Captain Login
        </h2>

        <form onSubmit={submitHandler} className="space-y-4">

          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter captain email"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg"
          >
            Login as Captain
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          New Captain? <Link to="/captain-signup">Create Captain Account</Link>
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 border border-black py-2 rounded-lg"
        >
          Sign in as User
        </button>
      </div>
    </div>
  );
};

export default CaptainLogin;
