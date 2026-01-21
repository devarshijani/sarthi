import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const UserProtectedWrapper = () => {
  const { setUser } = useContext(UserDataContext);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("userToken"))
      .finally(() => setLoading(false));
  }, [token, setUser]);

  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default UserProtectedWrapper;
