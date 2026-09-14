import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_API_SOCKET_URL;

const socket = io(socketUrl, {
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
});

export default socket;