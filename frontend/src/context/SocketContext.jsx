import React, { createContext, useEffect } from "react";
import socket, { connectSocket } from "../socket";

/**
 * IMPORTANT:
 * - Socket must be SINGLETON
 * - Must NOT be tied to React re-render or route change
 * - Must NOT disconnect on unmount
 */

export const SocketDataContext = createContext(null);

/* ================= CONTEXT PROVIDER ================= */
const SocketContext = ({ children }) => {
    useEffect(() => {
        const token = localStorage.getItem("captainToken") || localStorage.getItem("userToken");
        if (token) {
            connectSocket();
        }

        return () => {
            // ⚠️ DO NOT socket.disconnect() here
        };
    }, []);

    return (
        <SocketDataContext.Provider value={{ socket }}>
            {children}
        </SocketDataContext.Provider>
    );
};

export default SocketContext;
