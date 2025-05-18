import {io} from "socket.io-client";

const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
	withCredentials: true,
	autoConnect: false,
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 2000,
});

export default socket;
