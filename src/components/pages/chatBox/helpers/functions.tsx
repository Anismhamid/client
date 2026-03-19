import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import {Dispatch, RefObject, SetStateAction} from "react";
import {LocalMessage} from "../../../../interfaces/chat/localMessage";
import {ChatUser} from "../../../../interfaces/chat/chatUser";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // אופציונלי להודעה בשליחה
import socket from "../../../../socket/globalSocket";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export const getStatusIcon = (status: string) => {
	switch (status) {
		case "seen":
			return <DoneAllIcon sx={{fontSize: 14, color: "#2196f3"}} />; // כחול (נקרא)
		case "delivered":
			return <DoneAllIcon sx={{fontSize: 14, color: "#9e9e9e"}} />; // אפור כפול (הגיע ליעד)
		case "sent":
			return <CheckIcon sx={{fontSize: 14, color: "#9e9e9e"}} />; // אפור יחיד (נשלח מהטלפון)
		case "pending":
			return <AccessTimeIcon sx={{fontSize: 12, color: "#9e9e9e"}} />; // שעון (בטעינה)
		default:
			return <CheckIcon sx={{fontSize: 14, color: "#9e9e9e"}} />;
	}
};

export const scrollToBottom = (
	behavior: ScrollBehavior = "smooth",
	chatContainerRef: RefObject<HTMLDivElement | null>,
) => {
	if (chatContainerRef.current) {
		chatContainerRef.current.scrollTo({
			top: chatContainerRef.current.scrollHeight,
			behavior,
		});
	}
};

export const sendMessage = async (
	text: string,
	currentUser: {_id: string; name: string; email: string; role: string; image?: string},
	otherUser: ChatUser,
	setInput: Dispatch<SetStateAction<string>>,
	chatContainerRef: RefObject<HTMLDivElement | null>,
	addMessageForUser: (userId: string, msg: LocalMessage) => void,
) => {
	if (!text.trim()) return;
	const messageText = text.trim();
	const tempId = `temp-${Date.now()}`;

	const tempMessage: LocalMessage = {
		_id: tempId,
		from: currentUser,
		to: otherUser,
		message: messageText,
		status: "sent",
		createdAt: new Date().toISOString(),
	} as any;

	addMessageForUser(otherUser._id, tempMessage);
	setInput("");
	socket.emit("user:stopTyping", {to: otherUser._id, from: currentUser._id});
	setTimeout(() => scrollToBottom("smooth", chatContainerRef), 50);

	try {
		await axios.post(
			`${api}/messages`,
			{toUserId: otherUser._id, message: messageText},
			{headers: {Authorization: localStorage.getItem("token")}},
		);
	} catch (err) {
		console.error("Failed to send:", err);
	}
};

export const handleScroll = (
	e: React.UIEvent<HTMLDivElement>,
	loadConversation: (isInitial?: boolean) => Promise<void>,
	hasMore: boolean,
	isFetchingMore: boolean,
	setShowScrollBtn: (value: SetStateAction<boolean>) => void,
) => {
	const {scrollTop, scrollHeight, clientHeight} = e.currentTarget;

	// 1. Pagination logic (Top of chat)
	if (scrollTop === 0 && hasMore && !isFetchingMore) {
		loadConversation(false);
	}

	// 2. Scroll Button logic (Bottom of chat)
	// Show button if we are more than 400px away from the bottom
	const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
	setShowScrollBtn(distanceFromBottom > 400);
};

export const formatMessageTime = (dateString: string) => {
	try {
		return new Date(dateString).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch (e) {
		return "";
	}
};