import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainProtectedWrapper = () => {
  const { setCaptain, activeRide } = useContext(CaptainDataContext);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const token = localStorage.getItem("captainToken");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/captains/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCaptain(res.data.captain))
      .catch(() => localStorage.removeItem("captainToken"))
      .finally(() => setLoading(false));
  }, [token, setCaptain]);

  if (loading) return <div>Loading...</div>;

  /* ❌ NOT LOGGED IN */
  if (!token) return <Navigate to="/captain-login" replace />;

  /* ✅ ALLOW ACTIVE RIDE PAGE */
  if (activeRide && location.pathname === "/captain-dashboard") {
    return <Navigate to="/captain-riding" replace />;
  }

  return <Outlet />;
};

export default CaptainProtectedWrapper;
