import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import {Dispatch, RefObject, SetStateAction} from "react";
import {LocalMessage} from "../../../../interfaces/chat/localMessage";
import {ChatUser} from "../../../../interfaces/chat/chatUser";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // אופציונלי להודעה בשליחה
import socket from "../../../../socket/globalSocket";
import axios from "axios";
import {Typography} from "@mui/material";

const api = import.meta.env.VITE_API_URL;

export const getStatusIcon = (
	status: "seen" | "delivered" | "sent" | "pending" | "error",
) => {
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
		case "error":
			return <Typography sx={{color: "error.main", fontSize: 12}}>⚠</Typography>;
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
	token: string,
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
		fileType: null,
		fileUrl: null,
		warning: false,
		isImportant: false,
	};

	addMessageForUser(otherUser._id, tempMessage);
	setInput("");
	socket.emit("user:stopTyping", {to: otherUser._id, from: currentUser._id});
	setTimeout(() => scrollToBottom("smooth", chatContainerRef), 50);

	try {
		await axios.post(
			`${api}/messages`,
			{toUserId: otherUser._id, message: messageText},
			{headers: {Authorization: token}},
		);
	} catch (err) {
		console.error("Failed to send:", err);
	}
};

// export const handleScroll = (
// 	e: React.UIEvent<HTMLDivElement>,
// 	loadConversation: (isInitial?: boolean) => Promise<void>,
// 	hasMore: boolean,
// 	isFetchingMore: boolean,
// 	setShowScrollBtn: (value: SetStateAction<boolean>) => void,
// 	markAsSeen: () => void,
// ) => {
// 	const container = e.currentTarget;
//     const {scrollTop, scrollHeight, clientHeight} = container;

// 	// جلب الرسائل عند الوصول للأعلى
//     if (scrollTop < 5 && hasMore && !isFetchingMore) {
//         loadConversation(false);
//     }

// 	const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
//     setShowScrollBtn(distanceFromBottom > 200);
//     if (distanceFromBottom < 100) {
//         markAsSeen();
//     }
// };

export const formatMessageTime = (dateString: string) => {
	try {
		return new Date(dateString).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch (error) {
		return error;
	}
};
