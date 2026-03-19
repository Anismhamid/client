// context/ChatContext.tsx
import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
	useCallback,
} from "react";
import {LocalMessage} from "../interfaces/chat/localMessage";
import socket from "../socket/globalSocket";
import {useUser} from "../context/useUSer";

interface ChatContextType {
	messages: Record<string, LocalMessage[]>;
	setMessagesForUser: (
		userId: string,
		msgs: LocalMessage[] | ((prev: LocalMessage[]) => LocalMessage[]),
	) => void;

	currentChatId: string | null;
	setCurrentChatId: (id: string | null) => void;

	addMessageForUser: (userId: string, msg: LocalMessage) => void;
	unreadCounts: Record<string, number>;
	setUnreadForUser: (
		userId: string,
		count: number | ((prev: number) => number),
	) => void;

	updateMessageStatus: (
		userId: string,
		messageId: string,
		status: "delivered" | "seen",
	) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({children}: {children: ReactNode}) => {
	const [messages, setMessages] = useState<Record<string, LocalMessage[]>>({});
	const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
	const [currentChatId, setCurrentChatId] = useState<string | null>(null);
	const {auth} = useUser();

	const setMessagesForUser = useCallback(
		(
			userId: string,
			msgs: LocalMessage[] | ((prev: LocalMessage[]) => LocalMessage[]),
		) => {
			setMessages((prev) => ({
				...prev,
				[userId]: typeof msgs === "function" ? msgs(prev[userId] || []) : msgs,
			}));
		},
		[],
	);

	const addMessageForUser = useCallback((userId: string, msg: LocalMessage) => {
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
	}, []);

	const setUnreadForUser = useCallback(
		(userId: string, count: number | ((prev: number) => number)) => {
			setUnreadCounts((prev) => ({
				...prev,
				[userId]: typeof count === "function" ? count(prev[userId] || 0) : count,
			}));
		},
		[],
	);

	const updateMessageStatus = useCallback(
		(userId: string, messageId: string, status: "delivered" | "seen") => {
			setMessages((prev) => {
				const userMessages = prev[userId] || [];
				const updatedMessages = userMessages.map((msg) =>
					msg._id === messageId ? {...msg, status} : msg,
				);
				return {...prev, [userId]: updatedMessages};
			});
		},
		[],
	);

	useEffect(() => {
		const handleUnread = ({userId, count}: {userId: string; count: number}) => {
			setUnreadForUser(userId, count);
		};

		const handleIncomingMessage = (msg: LocalMessage) => {
			const otherUserId = msg.from._id === auth._id ? msg.to._id : msg.from._id;
			addMessageForUser(otherUserId, msg);
		};

		socket.on("message:unreadCount", handleUnread);
		socket.on("message:received", handleIncomingMessage);

		return () => {
			socket.off("message:unreadCount", handleUnread);
			socket.off("message:received", handleIncomingMessage);
		};
	}, [addMessageForUser, setUnreadForUser]);

	return (
		<ChatContext.Provider
			value={{
				messages,
				setMessagesForUser,
				addMessageForUser,
				setUnreadForUser,
				currentChatId,
				setCurrentChatId,
				updateMessageStatus,
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
