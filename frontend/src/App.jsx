import { Routes, Route } from "react-router-dom";

import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import 'leaflet/dist/leaflet.css';

import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import UserLogout from "./pages/UserLogout";

import CaptainDashboard from "./pages/CaptainDashboard";
import CaptainProtectedWrapper from "./pages/CaptainProtectedWrapper";

const App = () => {
  return (
    <Routes>
      {/* -------- PUBLIC ROUTES -------- */}
      <Route path="/" element={<Start />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/captain-login" element={<CaptainLogin />} />
      <Route path="/captain-signup" element={<CaptainSignup />} />
      <Route path="/riding" element={<Riding />} />
      <Route path="/captain-riding" element={<CaptainRiding />} />

      {/* -------- USER PROTECTED ROUTES -------- */}
      <Route element={<UserProtectedWrapper />}>
        <Route path="/home" element={<Home />} />
        <Route path="/home/logout" element={<UserLogout />} />
      </Route>

      {/* -------- CAPTAIN PROTECTED ROUTES -------- */}
      <Route element={<CaptainProtectedWrapper />}>
        <Route
          path="/captain-dashboard"
          element={<CaptainDashboard />}
        />
      </Route>
      {/* -------- CATCH-ALL 404 ROUTE -------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
