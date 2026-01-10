import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import UserContext from "./context/UserContext.jsx";
import CaptainContext from "./context/CaptainContext.jsx";

createRoot(document.getElementById("root")).render(
  <CaptainContext>
    <UserContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserContext>
  </CaptainContext>
);
