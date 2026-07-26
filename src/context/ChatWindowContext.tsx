import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from 'react';

import { UserMessage } from '../interfaces/chat/usersMessages';

interface ChatWindow {
    user: UserMessage;
    minimized: boolean;
}

interface ChatWindowContextType {
    chats: ChatWindow[];
    openChat: (user: UserMessage) => void;
    minimizeChat: (id: string) => void;
    closeChat: (id: string) => void;
}

const ChatWindowContext = createContext<ChatWindowContextType | null>(null);

export const ChatWindowProvider = ({ children }: { children: ReactNode }) => {
    const [chats, setChats] = useState<ChatWindow[]>([]);

    const openChat = (user: UserMessage) => {
        const userId = user._id || user.from?._id;

        setChats((prev) => {
            const exists = prev.find(
                (chat) => (chat.user._id || chat.user.from?._id) === userId,
            );

            if (exists) {
                return prev.map((chat) =>
                    (chat.user._id || chat.user.from?._id) === userId
                        ? {
                              ...chat,
                              minimized: false,
                          }
                        : chat,
                );
            }

            return [
                ...prev,
                {
                    user,
                    minimized: false,
                },
            ];
        });
    };

    const minimizeChat = useCallback((id: string) => {
        setChats((prev) =>
            prev.map((x) =>
                x.user._id === id
                    ? {
                          ...x,
                          minimized: true,
                      }
                    : x,
            ),
        );
    }, []);

    const closeChat = useCallback((id: string) => {
        setChats((prev) => prev.filter((x) => x.user._id !== id));
    }, []);

    return (
        <ChatWindowContext.Provider
            value={{
                chats,
                openChat,
                minimizeChat,
                closeChat,
            }}
        >
            {children}
        </ChatWindowContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChatWindow = () => {
    const ctx = useContext(ChatWindowContext);

    if (!ctx) throw new Error('useChatWindow must be inside provider');

    return ctx;
};
