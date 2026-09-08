import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
} from 'react';

import { LocalMessage } from '../interfaces/chat/localMessage';

import socket from '../socket/globalSocket';

interface ChatContextType {
    authId: string;

    messages: Record<
        string,
        LocalMessage[]
    >;

    setMessagesForUser: (
        userId: string,
        msgs:
            | LocalMessage[]
            | ((
                  prev: LocalMessage[],
              ) => LocalMessage[]),
    ) => void;

    addMessageForUser: (
        userId: string,
        msg: LocalMessage,
    ) => void;

    updateMessage: (
        userId: string,
        messageId: string,
        data: Partial<LocalMessage>,
    ) => void;

    removeMessage: (
        userId: string,
        messageId: string,
    ) => void;

    currentChatId: string | null;

    setCurrentChatId: (
        id: string | null,
    ) => void;

    unreadCounts: Record<
        string,
        number
    >;

    setUnreadForUser: (
        userId: string,
        count:
            | number
            | ((
                  prev: number,
              ) => number),
    ) => void;

    updateMessageStatus: (
        userId: string,
        messageId: string,
        status:
            | 'sent'
            | 'delivered'
            | 'seen',
    ) => void;
}

const ChatContext =
    createContext<ChatContextType | null>(
        null,
    );

export const ChatProvider = ({
    children,
    authId,
}: {
    children: ReactNode;
    authId: string;
}) => {
    // ======================================================
    // STATE
    // ======================================================

    const [messages, setMessages] =
        useState<
            Record<
                string,
                LocalMessage[]
            >
        >({});

    const [unreadCounts, setUnreadCounts] =
        useState<
            Record<string, number>
        >({});

    const [currentChatId, setCurrentChatId] =
        useState<string | null>(
            null,
        );

    // ======================================================
    // SET MESSAGES
    // ======================================================

    const setMessagesForUser =
        useCallback(
            (
                userId: string,
                msgs:
                    | LocalMessage[]
                    | ((
                          prev: LocalMessage[],
                      ) => LocalMessage[]),
            ) => {
                setMessages((prev) => ({
                    ...prev,

                    [userId]:
                        typeof msgs ===
                        'function'
                            ? msgs(
                                  prev[
                                      userId
                                  ] || [],
                              )
                            : msgs,
                }));
            },
            [],
        );

    // ======================================================
    // ADD MESSAGE
    // ======================================================

    const addMessageForUser =
        useCallback(
            (
                userId: string,
                msg: LocalMessage,
            ) => {
                setMessages((prev) => {
                    const existing =
                        prev[userId] || [];

                    if (
                        existing.some(
                            (message) =>
                                message._id ===
                                msg._id,
                        )
                    ) {
                        return prev;
                    }

                    return {
                        ...prev,

                        [userId]: [
                            ...existing,
                            msg,
                        ],
                    };
                });
            },
            [],
        );

    // ======================================================
    // UNREAD
    // ======================================================

    const setUnreadForUser =
        useCallback(
            (
                userId: string,
                count:
                    | number
                    | ((
                          prev: number,
                      ) => number),
            ) => {
                setUnreadCounts(
                    (prev) => ({
                        ...prev,

                        [userId]:
                            typeof count ===
                            'function'
                                ? count(
                                      prev[
                                          userId
                                      ] || 0,
                                  )
                                : count,
                    }),
                );
            },
            [],
        );

    // ======================================================
    // UPDATE MESSAGE STATUS
    // ======================================================

    const updateMessageStatus =
        useCallback(
            (
                userId: string,
                messageId: string,
                status:
                    | 'sent'
                    | 'delivered'
                    | 'seen',
            ) => {
                setMessages(
                    (prev) => {
                        const userMessages =
                            prev[
                                userId
                            ] || [];

                        return {
                            ...prev,

                            [userId]:
                                userMessages.map(
                                    (
                                        message,
                                    ) =>
                                        message._id ===
                                        messageId
                                            ? {
                                                  ...message,
                                                  status,
                                              }
                                            : message,
                                ),
                        };
                    },
                );
            },
            [],
        );

    // ======================================================
    // UPDATE MESSAGE
    // ======================================================

    const updateMessage =
        useCallback(
            (
                userId: string,
                messageId: string,
                data: Partial<LocalMessage>,
            ) => {
                setMessages(
                    (prev) => ({
                        ...prev,

                        [userId]:
                            (
                                prev[
                                    userId
                                ] || []
                            ).map(
                                (
                                    message,
                                ) =>
                                    message._id ===
                                    messageId
                                        ? {
                                              ...message,
                                              ...data,
                                          }
                                        : message,
                            ),
                    }),
                );
            },
            [],
        );

    // ======================================================
    // REMOVE MESSAGE
    // ======================================================

    const removeMessage =
        useCallback(
            (
                userId: string,
                messageId: string,
            ) => {
                setMessages(
                    (prev) => ({
                        ...prev,

                        [userId]:
                            (
                                prev[
                                    userId
                                ] || []
                            ).filter(
                                (
                                    message,
                                ) =>
                                    message._id !==
                                    messageId,
                            ),
                    }),
                );
            },
            [],
        );

    // ======================================================
    // SOCKET EVENTS
    // ======================================================

    useEffect(() => {
        // ==================================================
        // UNREAD COUNT
        // ==================================================

        const handleUnread = ({
            userId,
            count,
        }: {
            userId: string;
            count: number;
        }) => {
            setUnreadForUser(
                userId,
                count,
            );
        };

        // ==================================================
        // INCOMING MESSAGE
        // ==================================================

        const handleIncomingMessage = (
            msg: LocalMessage,
        ) => {
            if (
                !msg?.from?._id ||
                !msg?.to?._id
            ) {
                return;
            }

            const otherUserId =
                msg.from._id === authId
                    ? msg.to._id
                    : msg.from._id;

            if (
                !otherUserId ||
                otherUserId ===
                    'unknown'
            ) {
                return;
            }

            addMessageForUser(
                otherUserId,
                msg,
            );

            if (
                otherUserId !==
                currentChatId
            ) {
                setUnreadForUser(
                    otherUserId,
                    (prev) =>
                        prev + 1,
                );
            }
        };

        // ==================================================
        // MESSAGE EDITED
        // ==================================================

        const handleMessageEdited = (
            payload: {
                messageId: string;

                message?:
                    | LocalMessage
                    | string;

                from?: string;

                to?: string;
            },
        ) => {
            if (
                !payload?.messageId
            ) {
                return;
            }

            const messageData =
                payload.message;

            // ==============================================
            // BACKEND SENDS FULL MESSAGE OBJECT
            // ==============================================

            if (
                messageData &&
                typeof messageData ===
                    'object'
            ) {
                const fromId =
                    messageData
                        .from?._id ??
                    payload.from;

                const toId =
                    messageData
                        .to?._id ??
                    payload.to;

                if (
                    !fromId ||
                    !toId
                ) {
                    return;
                }

                const otherUserId =
                    fromId === authId
                        ? toId
                        : fromId;

                updateMessage(
                    otherUserId,
                    payload.messageId,
                    {
                        ...messageData,

                        message:
                            messageData.message ??
                            messageData.text,

                        text:
                            messageData.message ??
                            messageData.text,

                        edited: true,

                        editedAt:
                            messageData.editedAt ??
                            new Date().toISOString(),
                    },
                );

                return;
            }

            // ==============================================
            // BACKEND SENDS MESSAGE AS STRING
            // ==============================================

            if (
                typeof messageData ===
                    'string' &&
                payload.from &&
                payload.to
            ) {
                const otherUserId =
                    payload.from ===
                    authId
                        ? payload.to
                        : payload.from;

                updateMessage(
                    otherUserId,
                    payload.messageId,
                    {
                        message:
                            messageData,

                        text:
                            messageData,

                        edited: true,

                    },
                );
            }
        };

        // ==================================================
        // MESSAGE DELETED
        // ==================================================

        const handleMessageDeleted = (
            payload: {
                messageId: string;

                from?: string;

                to?: string;
            },
        ) => {
            if (
                !payload?.messageId ||
                !payload.from ||
                !payload.to
            ) {
                return;
            }

            const otherUserId =
                payload.from === authId
                    ? payload.to
                    : payload.from;

            removeMessage(
                otherUserId,
                payload.messageId,
            );
        };

        // ==================================================
        // REGISTER
        // ==================================================

        socket.on(
            'message:unreadCount',
            handleUnread,
        );

        socket.on(
            'message:received',
            handleIncomingMessage,
        );

        socket.on(
            'message:edited',
            handleMessageEdited,
        );

        socket.on(
            'message:deleted',
            handleMessageDeleted,
        );

        // ==================================================
        // CLEANUP
        // ==================================================

        return () => {
            socket.off(
                'message:unreadCount',
                handleUnread,
            );

            socket.off(
                'message:received',
                handleIncomingMessage,
            );

            socket.off(
                'message:edited',
                handleMessageEdited,
            );

            socket.off(
                'message:deleted',
                handleMessageDeleted,
            );
        };
    }, [
        addMessageForUser,
        setUnreadForUser,
        authId,
        currentChatId,
        updateMessage,
        removeMessage,
    ]);

    // ======================================================
    // PROVIDER
    // ======================================================

    return (
        <ChatContext.Provider
            value={{
                authId,

                messages,

                setMessagesForUser,

                addMessageForUser,

                updateMessage,

                removeMessage,

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

// ======================================================
// HOOK
// ======================================================

// eslint-disable-next-line react-refresh/only-export-components
export const useChat =
    () => {
        const ctx =
            useContext(
                ChatContext,
            );

        if (!ctx) {
            throw new Error(
                'useChat must be used inside ChatProvider',
            );
        }

        return ctx;
    };