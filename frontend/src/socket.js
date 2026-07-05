import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket"],
    autoConnect: false,
});

export const connectSocket = () => {
    const token = localStorage.getItem("captainToken") || localStorage.getItem("userToken");
    
    // Only connect if not connected OR if the token has changed
    if (!socket.connected || socket.auth?.token !== token) {
        socket.auth = { token };
        if (socket.connected) {
            socket.disconnect();
        }
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

export default socket;
