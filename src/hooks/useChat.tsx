// context/ChatContext.tsx
import {createContext, useContext, useState, ReactNode, useEffect} from "react";
import {LocalMessage} from "../interfaces/chat/localMessage";
import socket from "../socket/globalSocket";

interface ChatContextType {
	messages: Record<string, LocalMessage[]>;
	setMessagesForUser: (
		userId: string,
		msgs: LocalMessage[] | ((prev: LocalMessage[]) => LocalMessage[]),
	) => void;

	addMessageForUser: (userId: string, msg: LocalMessage) => void;
	unreadCounts: Record<string, number>;
	setUnreadForUser: (
		userId: string,
		count: number | ((prev: number) => number),
	) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({children}: {children: ReactNode}) => {
	const [messages, setMessages] = useState<Record<string, LocalMessage[]>>({});
	const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

	useEffect(() => {
		const handleUnread = ({userId, count}: {userId: string; count: number}) => {
			setUnreadForUser(userId, count);
		};

		const handleIncomingMessage = (msg: LocalMessage) => {
			const otherUserId = msg.from._id === msg.to._id ? msg.to._id : msg.from._id;

			addMessageForUser(otherUserId, msg);
		};

		socket.on("message:unreadCount", handleUnread);
		socket.on("message:received", handleIncomingMessage);

		return () => {
			socket.off("message:unreadCount", handleUnread);
			socket.off("message:received", handleIncomingMessage);
		};
	}, []);

	const setMessagesForUser = (
		userId: string,
		msgs: LocalMessage[] | ((prev: LocalMessage[]) => LocalMessage[]),
	) => {
		setMessages((prev) => ({
			...prev,
			[userId]: typeof msgs === "function" ? msgs(prev[userId] || []) : msgs,
		}));
	};

	const addMessageForUser = (userId: string, msg: LocalMessage) => {
		setMessages((prev) => {
			const existing = prev[userId] || [];

			if (existing.some((m) => m._id === msg._id)) {
				return prev;
			}

			return {
				...prev,
				[userId]: [...existing, msg],
			};
		});
	};

	const setUnreadForUser = (
		userId: string,
		count: number | ((prev: number) => number),
	) => {
		setUnreadCounts((prev) => ({
			...prev,
			[userId]: typeof count === "function" ? count(prev[userId] || 0) : count,
		}));
	};

	return (
		<ChatContext.Provider
			value={{
				messages,
				setMessagesForUser,
				addMessageForUser,
				setUnreadForUser,
				unreadCounts,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => {
	const ctx = useContext(ChatContext);
	if (!ctx) throw new Error("useChat must be used inside ChatProvider");
	return ctx;
};
