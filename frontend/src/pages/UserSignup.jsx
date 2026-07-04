import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

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

const UserSignup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = { fullname: { firstname, lastname }, email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        newUser
      );

      if (response.status === 201) {
        navigate("/login"); // ✅ redirect to login, not /home
      }
    } catch (err) {
      // Show error to user
      const message = err.response?.data?.message || "Signup failed. Please try again.";
      alert(message);
    }

    setFirstname(""); setLastname(""); setEmail(""); setPassword("");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-6">
        <h1 className="text-3xl font-bold mb-6">Sarthi</h1>

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="flex gap-3">
            <input required type="text" value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="First name"
              className="w-1/2 px-4 py-3 bg-gray-100 rounded-md outline-none focus:bg-white border"
            />
            <input required type="text" value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Last name"
              className="w-1/2 px-4 py-3 bg-gray-100 rounded-md outline-none focus:bg-white border"
            />
          </div>

          <input required type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full px-4 py-3 bg-gray-100 rounded-md outline-none focus:bg-white border"
          />

          {/* Password with eye icon */}
          <div className="relative">
            <input required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-3 bg-gray-100 rounded-md outline-none focus:bg-white border pr-10"
            />
            <button type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <button type="submit"
            className="w-full bg-black text-white py-3 rounded-md text-lg font-medium mt-4"
          >
            Signup
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">Login here</Link>
        </p>

        <p className="text-xs text-gray-500 mt-6 leading-relaxed">
          By proceeding, you consent to get calls, WhatsApp or SMS messages,
          including by automated means, from Sarthi and its affiliates to the number provided.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;