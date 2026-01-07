import { Routes, Route } from "react-router-dom";

import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainDashboard from "./pages/CaptainDashboard";
import CaptainProtectedWrapper from "./pages/CaptainProtectedWrapper";

const App = () => {
  
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/captain-login" element={<CaptainLogin />} />
      <Route path="/captain-signup" element={<CaptainSignup />} />
      <Route path= "/home" element={
        <UserProtectedWrapper>
          <Home />
        </UserProtectedWrapper>
      } />

      <Route path = "UserLogout" element={
        <UserProtectedWrapper>
          <UserLogout />
        </UserProtectedWrapper>
      } />

      <Route path = '/captain-dashboard' element ={
        <CaptainProtectedWrapper>
          <div>Captain Dashboard</div>
        </CaptainProtectedWrapper>
      } />

    </Routes>
  );
};

export default App;
