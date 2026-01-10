import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainProtectedWrapper = () => {
  const { setCaptain } = useContext(CaptainDataContext);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("captainToken");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/captains/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCaptain(res.data.captain))
      .catch(() => localStorage.removeItem("captainToken"))
      .finally(() => setLoading(false));
  }, [token, setCaptain]);

  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/captain-login" replace />;

  return <Outlet />;
};

export default CaptainProtectedWrapper;
