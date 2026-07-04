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

        socket.on("connect", () => {
            console.log("Connected to socket server:", socket.id);
        });

        socket.on("disconnect", (reason) => {
            console.log("Disconnected from socket server:", reason);
        });

        return () => {
            // ⚠️ DO NOT socket.disconnect() here
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    return (
        <SocketDataContext.Provider value={{ socket }}>
            {children}
        </SocketDataContext.Provider>
    );
};

export default SocketContext;
