import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    const captainData = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
    };

    console.log("Captain Signup Data:", captainData);

    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-6">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">Sarthi</h1>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-4">

          {/* Name */}
          <div className="flex gap-3">
            <input
              required
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="First name"
              className="w-1/2 px-4 py-3 bg-gray-100 rounded-md outline-none focus:bg-white border"
            />
            <input
              required
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Last name"
              className="w-1/2 px-4 py-3 bg-gray-100 rounded-md outline-none focus:bg-white border"
            />
          </div>

          {/* Email */}
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full px-4 py-3 bg-gray-100 rounded-md outline-none focus:bg-white border"
          />

          {/* Password */}
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password"
            className="w-full px-4 py-3 bg-gray-100 rounded-md outline-none focus:bg-white border"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md text-lg font-medium mt-4"
          >
            Signup as Captain
          </button>
        </form>

        {/* Login switch */}
        <p className="text-sm text-center mt-4">
          Already a captain?{" "}
          <Link to="/captain-login" className="text-blue-600 font-medium">
            Login here
          </Link>
        </p>

        {/* Switch to User */}
        <button
          onClick={() => navigate("/signup")}
          className="w-full mt-4 border border-black py-2 rounded-md"
        >
          Signup as User
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-500 mt-6 leading-relaxed">
          By proceeding, you consent to get calls, WhatsApp or SMS messages,
          including by automated means, from Sarthi and its affiliates to the
          number provided.
        </p>

      </div>
    </div>
  );
};

export default CaptainSignup;
