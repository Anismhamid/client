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

interface ConversationResponse {
    user?: BaseUser;
}

const ChatWindowContext = createContext<ChatWindowContextType | null>(null);

export const ChatWindowProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [chats, setChats] = useState<ChatWindow[]>([]);

    // ======================================================
    // OPEN CHAT
    // ======================================================

    const openChat = useCallback(
        (user: BaseUser, initialMessage?: string) => {
            const userId = user?._id;

            if (!userId) {
                console.warn('Cannot open chat: user ID is missing');
                return;
            }

            setChats((prev) => {
                const existingChat = prev.find(
                    (chat) => chat.user._id === userId,
                );

                if (existingChat) {
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

    // ======================================================
    // OPEN CHAT FROM NOTIFICATION
    // ======================================================

    useEffect(() => {
        const handleOpenFloatingChat = async (event: Event) => {
            const customEvent = event as CustomEvent<{
                userId?: string;
            }>;

            const userId = customEvent.detail?.userId;

            if (!userId || typeof userId !== 'string') {
                console.warn(
                    'Cannot open notification chat: invalid user ID',
                );
                return;
            }

            try {
                // Get conversations accessible to the current user.
                // Do not use GET /users/:userId here because that route
                // intentionally restricts access to other user profiles.

                const { data } = await api.get('/messages/conversations');

                const conversations: ConversationResponse[] =
                    Array.isArray(data?.conversations)
                        ? data.conversations
                        : [];

                const conversation = conversations.find(
                    (item) => item.user?._id === userId,
                );

                if (!conversation?.user?._id) {
                    console.warn(
                        'Notification chat not found in conversations:',
                        userId,
                    );
                    return;
                }

                openChat(conversation.user);
            } catch (error) {
                console.error(
                    'Failed to open chat from notification:',
                    error,
                );
            }
        };

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
    }, [openChat]);

    // ======================================================
    // CLEAR CHATS
    // ======================================================

    const clearChats = useCallback(() => {
        setChats([]);
    }, []);

    // ======================================================
    // MINIMIZE CHAT
    // ======================================================

    const minimizeChat = useCallback((id: string) => {
        setChats((prev) =>
            prev.map((chat) =>
                chat.user._id === id
                    ? { ...chat, minimized: true }
                    : chat,
            ),
        );
    }, []);

    // ======================================================
    // CLOSE CHAT
    // ======================================================

    const closeChat = useCallback((id: string) => {
        setChats((prev) =>
            prev.filter((chat) => chat.user._id !== id),
        );
    }, []);

    // ======================================================
    // GET INITIAL MESSAGE
    // ======================================================

    const getInitialMessage = useCallback(
        (userId: string) => {
            const chat = chats.find(
                (chat) => chat.user._id === userId,
            );

            return chat?.initialMessage;
        },
        [chats],
    );

    // ======================================================
    // CLEAR INITIAL MESSAGE
    // ======================================================

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

    // ======================================================
    // PROVIDER
    // ======================================================

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