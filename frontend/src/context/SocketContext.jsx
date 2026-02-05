import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";

/**
 * IMPORTANT:
 * - Socket must be SINGLETON
 * - Must NOT be tied to React re-render or route change
 * - Must NOT disconnect on unmount
 */

export const SocketDataContext = createContext(null);

/* ================= SOCKET INSTANCE (SINGLETON) ================= */
const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket"],
    autoConnect: true,
});

/* ================= CONTEXT PROVIDER ================= */
const SocketContext = ({ children }) => {
    useEffect(() => {
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
