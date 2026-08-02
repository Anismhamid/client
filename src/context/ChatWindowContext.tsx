import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useEffect,
} from 'react';

import { UserMessage } from '../interfaces/chat/usersMessages';

interface ChatWindow {
    user: UserMessage;
    minimized: boolean;
    initialMessage?: string;
}

interface ChatWindowContextType {
    chats: ChatWindow[];
    openChat: (user: UserMessage, initialMessage?: string) => void;
    minimizeChat: (id: string) => void;
    closeChat: (id: string) => void;
    getInitialMessage: (userId: string) => string | undefined;
    clearInitialMessage: (userId: string) => void;
}

const ChatWindowContext = createContext<ChatWindowContextType | null>(null);

export const ChatWindowProvider = ({ children }: { children: ReactNode }) => {
    const [chats, setChats] = useState<ChatWindow[]>([]);
useEffect(() => {
    console.log(chats);
}, [chats]);
    const openChat = (user: UserMessage, initialMessage?: string) => {
        const userId = user._id || user.from?._id;
        console.log('openChat', initialMessage);
        if (!userId) {
            console.warn('Cannot open chat: user ID is missing');
            return;
        }

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
                              initialMessage:
                                  chat.initialMessage || initialMessage,
                          }
                        : chat,
                );
            }

            return [
                ...prev,
                {
                    user,
                    minimized: false,
                    initialMessage,
                },
            ];
        });
    };

    const minimizeChat = useCallback((id: string) => {
        setChats((prev) =>
            prev.map((x) => {
                const chatId = x.user._id || x.user.from?._id;
                return chatId === id
                    ? {
                          ...x,
                          minimized: true,
                      }
                    : x;
            }),
        );
    }, []);

    const closeChat = useCallback((id: string) => {
        setChats((prev) =>
            prev.filter((x) => {
                const chatId = x.user._id || x.user.from?._id;
                return chatId !== id;
            }),
        );
    }, []);

    const getInitialMessage = useCallback(
        (userId: string) => {
            const chat = chats.find((x) => {
                const chatId = x.user._id || x.user.from?._id;
                return chatId === userId;
            });
            return chat?.initialMessage;
        },
        [chats],
    );

    const clearInitialMessage = useCallback((userId: string) => {
        setChats((prev) =>
            prev.map((x) => {
                const chatId = x.user._id || x.user.from?._id;
                return chatId === userId
                    ? {
                          ...x,
                          initialMessage: undefined,
                      }
                    : x;
            }),
        );
    }, []);

    return (
        <ChatWindowContext.Provider
            value={{
                chats,
                openChat,
                minimizeChat,
                closeChat,
                getInitialMessage,
                clearInitialMessage,
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
