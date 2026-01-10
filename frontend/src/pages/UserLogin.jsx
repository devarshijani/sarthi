import React, { useState, useContext} from "react";
import { Link, useNavigate  } from "react-router-dom";
import {UserDataContext} from "../context/UserContext";
// import { Navigate } from "react-router-dom";
import axios from "axios";

const UserLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});

  const {user, setUser} = useContext(UserDataContext);

  const submitHandler = async(e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    }

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, userData);

    if(response.status === 200){
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("userToken", data.token);
      navigate("/home");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-3xl font-bold text-center mb-6">User Login</h2>

        <form onSubmit={submitHandler} className="space-y-4">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          New here? <Link to="/signup">Create account</Link>
        </p>

        <button
          onClick={() => navigate("/captain-login")}
          className="w-full mt-4 border border-black py-2 rounded-lg"
        >
          Sign in as Captain
        </button>

      </div>
    </div>
  );
};

export default UserLogin;
