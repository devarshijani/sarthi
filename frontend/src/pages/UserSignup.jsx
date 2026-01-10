import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const UserSignup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
      newUser
    );

    if (response.status === 201) {
      const data = response.data;

      setUserData(data);
      localStorage.setItem("userToken", data.token);
      navigate("/home");
    }

    console.log("User Signup Data:", userData);

    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-6">
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold mb-6">Sarthi</h1>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-4">
          {/* Name fields */}
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
            placeholder="Enter Password"
            className="w-full px-4 py-3 bg-gray-100 rounded-md outline-none focus:bg-white border"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md text-lg font-medium mt-4"
          >
            Signup
          </button>
        </form>

        {/* Login link */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login here
          </Link>
        </p>

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

export default UserSignup;
