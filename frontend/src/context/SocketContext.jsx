import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketDataContext = createContext();

const SocketContext = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BACKEND_URL);

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const sendMessage = (eventName, message) => {
        if (socket) {
            socket.emit(eventName, message);
        }
    };

    const receiveMessage = (eventName, callback) => {
        if (socket) {
            socket.on(eventName, callback);
        }
    };

    return (
        <SocketDataContext.Provider value={{ socket, sendMessage, receiveMessage }}>
            {children}
        </SocketDataContext.Provider>
    );
};

export default SocketContext;
