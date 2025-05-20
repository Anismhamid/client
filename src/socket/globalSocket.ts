import {io} from "socket.io-client";

const SocketUrl = import.meta.env.VITE_API_SOCKET_URL;

const socket = io(SocketUrl, {
	withCredentials: true,
	autoConnect: false,
	transports: ["websocket"],
});

export default socket;
