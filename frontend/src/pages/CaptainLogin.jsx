import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CaptainLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captainData, setCaptainData] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    setCaptainData(data);
    console.log("Captain Data:", data);

    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Captain Login
        </h2>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter captain email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-black text-white py-2 rounded-lg text-lg hover:bg-gray-900 transition"
          >
            Login as Captain
          </button>
        </form>

        {/* Signup link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          New Captain?{" "}
          <Link
            to="/captain-signup"
            className="text-black font-medium hover:underline"
          >
            Create Captain Account
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* User Login */}
        <button
          onClick={() => navigate("/login")}
          className="w-full border border-black py-2 rounded-lg text-lg hover:bg-gray-100 transition"
        >
          Sign in as User
        </button>

      </div>
    </div>
  );
};

export default CaptainLogin;
