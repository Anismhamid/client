// context/ChatContext.tsx
import {createContext, useContext, useState, ReactNode} from "react";
import { LocalMessage } from "../interfaces/chat/localMessage";

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
  count: number | ((prev: number) => number)
) => {
  setUnreadCounts((prev) => ({
    ...prev,
    [userId]:
      typeof count === "function"
        ? count(prev[userId] || 0)
        : count,
  }));
};

	return (
		<ChatContext.Provider
			value={{
				messages,
				setMessagesForUser,
				addMessageForUser,
				unreadCounts,
				setUnreadForUser,
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
