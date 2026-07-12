import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";

import UserContext from "./context/UserContext.jsx";
import CaptainContext from "./context/CaptainContext.jsx";
import SocketContext from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <CaptainContext>
      <UserContext>
        <SocketContext>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SocketContext>
      </UserContext>
    </CaptainContext>
  </ErrorBoundary>
);
