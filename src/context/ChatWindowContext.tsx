import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from 'react';

import { BaseUser } from '../interfaces/chat/chatUser';
import api from '../services/api';

interface ChatWindow {
    user: BaseUser;
    minimized: boolean;
    initialMessage?: string;
}

interface ChatWindowContextType {
    chats: ChatWindow[];
    openChat: (user: BaseUser, initialMessage?: string) => void;
    minimizeChat: (id: string) => void;
    closeChat: (id: string) => void;
    getInitialMessage: (userId: string) => string | undefined;
    clearInitialMessage: (userId: string) => void;
    clearChats: () => void;
}

const ChatWindowContext = createContext<ChatWindowContextType | null>(null);

export const ChatWindowProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [chats, setChats] = useState<ChatWindow[]>([]);

    const openChat = useCallback(
        (user: BaseUser, initialMessage?: string) => {
            const userId = user._id;

            if (!userId) {
                console.warn('Cannot open chat: user ID is missing');
                return;
            }

            setChats((prev) => {
                const exists = prev.find(
                    (chat) => chat.user._id === userId,
                );

                if (exists) {
                    return prev.map((chat) =>
                        chat.user._id === userId
                            ? {
                                  ...chat,
                                  user: {
                                      ...chat.user,
                                      ...user,
                                  },
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
        },
        [],
    );

    useEffect(() => {
        const handleOpenFloatingChat = (async (event: CustomEvent) => {
            const { userId } = event.detail;

            if (!userId) return;

            const existing = chats.find(
                (chat) => chat.user._id === userId,
            );

            if (existing) {
                openChat(existing.user);
                return;
            }

            try {
                const { data } = await api.get(`/users/${userId}`);

                // API returns a user, not a UserMessage.
                openChat(data);
            } catch (error) {
                console.error(
                    '❌ Failed to load user for floating chat:',
                    error,
                );
            }
        }) as unknown as EventListener;

        window.addEventListener(
            'open-floating-chat',
            handleOpenFloatingChat,
        );

        return () => {
            window.removeEventListener(
                'open-floating-chat',
                handleOpenFloatingChat,
            );
        };
    }, [chats, openChat]);

    const clearChats = useCallback(() => {
        setChats([]);
    }, []);

    const minimizeChat = useCallback((id: string) => {
        setChats((prev) =>
            prev.map((chat) =>
                chat.user._id === id
                    ? { ...chat, minimized: true }
                    : chat,
            ),
        );
    }, []);

    const closeChat = useCallback((id: string) => {
        setChats((prev) =>
            prev.filter((chat) => chat.user._id !== id),
        );
    }, []);

    const getInitialMessage = useCallback(
        (userId: string) => {
            const chat = chats.find(
                (chat) => chat.user._id === userId,
            );

            return chat?.initialMessage;
        },
        [chats],
    );

    const clearInitialMessage = useCallback((userId: string) => {
        setChats((prev) =>
            prev.map((chat) =>
                chat.user._id === userId
                    ? {
                          ...chat,
                          initialMessage: undefined,
                      }
                    : chat,
            ),
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
                clearChats,
            }}
        >
            {children}
        </ChatWindowContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChatWindow = () => {
    const ctx = useContext(ChatWindowContext);

    if (!ctx) {
        throw new Error('useChatWindow must be inside provider');
    }

    return ctx;
};