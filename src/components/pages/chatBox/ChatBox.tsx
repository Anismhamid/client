/* eslint-disable react-hooks/exhaustive-deps */
import {
    useEffect,
    useState,
    useRef,
    FunctionComponent,
    useLayoutEffect,
    useCallback,
    useMemo,
} from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Paper,
    CircularProgress,
    InputAdornment,
    Fade,
    Zoom,
    Fab,
    Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from '@mui/material';

import socket from '../../../socket/globalSocket';
import { useChat } from '../../../hooks/useChat';
import { BaseUser } from '../../../interfaces/chat/chatUser';
import { LocalMessage } from '../../../interfaces/chat/localMessage';
import Linkify from './Linkify';
import handleRTL from '../../../locales/handleRTL';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useTranslation } from 'react-i18next';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
    formatMessageTime,
    getStatusIcon,
    reconcileMessage,
    scrollToBottom,
    sendMessage,
} from './helpers/functions';
import { Navigate } from 'react-router-dom';
import { path } from '../../../routes/routes';
import { deleteMessage } from '../../../services/messages';
import { showSuccess, showError } from '../../../atoms/toasts/ReactToast';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUser } from '../../../hooks/useUSer';

const api = import.meta.env.VITE_API_URL;

interface ChatBoxProps {
    currentUser: BaseUser;
    otherUser: BaseUser;
    token: string;
    initialMessage?: string;
}

const ChatBox: FunctionComponent<ChatBoxProps> = ({
    currentUser,
    otherUser,
    token,
    initialMessage,
}) => {
    const {
        messages,
        addMessageForUser,
        setMessagesForUser,
        setUnreadForUser,
    } = useChat();
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [initialMessageSent, setInitialMessageSent] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
        null,
    );
    const open = Boolean(anchorEl);

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedMessageId(null);
    };

    const handleDeleteClick = async (messageId: string) => {
        handleMenuClose();
        try {
            const res = await deleteMessage(messageId);
            if (res) {
                showSuccess(t('messages.deleteSuccess'));
                setMessagesForUser(
                    otherUser._id as string,
                    (prev: LocalMessage[]) =>
                        prev.filter((m) => m._id !== messageId),
                );
            }
        } catch (err) {
            console.log(err);
            showError(t('messages.deleteFailed'));
        }
    };

    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTypingRef = useRef(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    // استخدام useMemo للتأكد من تحديث userMessages
    const userMessages = useMemo(() => {
        return messages[otherUser?._id ?? ''] || [];
    }, [messages, otherUser?._id]);

    const dir = handleRTL();
    const { t } = useTranslation();

    const lastScrollHeightRef = useRef<number>(0);
    const lastSeenRef = useRef<string | null>(null);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const { auth } = useUser();

    const initialScrollDone = useRef(false);

    // إرسال الرسالة الأولية تلقائياً
    useEffect(() => {
        if (initialMessage && !initialMessageSent && !isLoading && socket) {
            const newMessage: LocalMessage = {
                _id: `initial-${Date.now()}`,
                text: initialMessage,
                from: currentUser,
                to: otherUser,
                status: 'sent',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            addMessageForUser(otherUser._id as string, newMessage);

            socket.emit('message:send', {
                from: currentUser._id,
                to: otherUser._id,
                message: initialMessage,
                roomId: [otherUser._id, currentUser._id].sort().join('_'),
            });

            axios
                .post(
                    `${api}/messages`,
                    {
                        toUserId: otherUser._id,
                        message: initialMessage,
                    },
                    {
                        headers: { Authorization: token },
                    },
                )
                .then((res) => {
                    if (res.data._id) {
                        setMessagesForUser(
                            otherUser._id as string,
                            (prev: LocalMessage[]) =>
                                prev.map((m) =>
                                    m._id === newMessage._id
                                        ? { ...m, _id: res.data._id }
                                        : m,
                                ),
                        );
                    }
                })
                .catch((err) => {
                    console.error('Failed to send initial message:', err);
                    showError('فشل إرسال الرسالة الأولية');
                });

            requestAnimationFrame(() => {
                scrollToBottom('smooth', chatContainerRef);
            });

            setInitialMessageSent(true);
        }
    }, [initialMessage, initialMessageSent, isLoading]);

    useLayoutEffect(() => {
        if (isLoading) return;
        if (initialScrollDone.current) return;

        requestAnimationFrame(() => {
            scrollToBottom('auto', chatContainerRef);
            initialScrollDone.current = true;
        });
    }, [isLoading, userMessages.length]);

    // دالة تحديث حالة الرسائل إلى مقروءة
    // دالة تحديث حالة الرسائل إلى مقروءة
    const markMessagesAsSeen = useCallback(() => {
        if (!otherUser?._id || !socket) {
            console.log('Cannot mark as seen: missing user or socket');
            return;
        }

        console.log('Marking messages as seen for user:', otherUser._id);

        // جمع معرفات الرسائل غير المقروءة من المستخدم الآخر
        const unseenMessages = userMessages.filter(
            (m) => m?.from?._id === otherUser._id && m.status !== 'seen',
        );

        if (unseenMessages.length === 0) {
            console.log('No unseen messages to mark');
            return;
        }

        console.log('Unseen messages count:', unseenMessages.length);

        // تحديث الحالة محلياً أولاً
        setMessagesForUser(
            otherUser._id,
            (prev: LocalMessage[]): LocalMessage[] => {
                return prev.map((m): LocalMessage => {
                    if (m?.from?._id === otherUser._id && m.status !== 'seen') {
                        console.log('Updating message to seen locally:', m._id);
                        return { ...m, status: 'seen' as const };
                    }
                    return m;
                });
            },
        );

        // ✅ إرسال عبر Socket مع from و to بشكل صحيح
        const roomId = [otherUser._id, currentUser._id].sort().join('_');
        const seenData = {
            from: currentUser._id, // من قرأ الرسائل
            to: otherUser._id, // من أرسل الرسائل
            roomId: roomId,
        };

        console.log('Emitting message:seen from frontend:', seenData);
        socket.emit('message:seen', seenData);

        // تصفير العداد
        setUnreadForUser(otherUser._id, 0);
    }, [
        otherUser?._id,
        currentUser._id,
        userMessages,
        setMessagesForUser,
        setUnreadForUser,
        socket,
    ]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);
        if (!socket) return;

        if (!value.trim()) {
            socket.emit('user:stopTyping', {
                to: otherUser._id,
                from: currentUser._id,
            });
            isTypingRef.current = false;
            return;
        }

        if (!isTypingRef.current) {
            socket.emit('user:typing', {
                to: otherUser._id,
                from: currentUser._id,
            });
            isTypingRef.current = true;
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('user:stopTyping', {
                to: otherUser._id,
                from: currentUser._id,
            });
            isTypingRef.current = false;
        }, 1500);
    };

    const loadConversation = async (isInitial = true) => {
        if (isInitial) {
            setIsLoading(true);
        } else {
            setIsFetchingMore(true);
            if (chatContainerRef.current) {
                const container = chatContainerRef.current;
                lastScrollHeightRef.current = container.scrollHeight;
                lastSeenRef.current = String(container.scrollTop);
            }
        }

        try {
            const skip = isInitial ? 0 : userMessages.length;
            const res = await axios.get(
                `${api}/messages/conversation/${otherUser._id}?limit=20&skip=${skip}`,
                { headers: { Authorization: token } },
            );

            const fetchedMessages = res.data.messages;

            if (isInitial) {
                setMessagesForUser(otherUser._id ?? '', fetchedMessages);
                requestAnimationFrame(() => {
                    scrollToBottom('smooth', chatContainerRef);
                });
            } else {
                setMessagesForUser(
                    otherUser._id ?? '',
                    (prev: LocalMessage[]) => [...fetchedMessages, ...prev],
                );
            }
            setHasMore(res.data.hasMore);
        } catch (err) {
            console.error('Pagination error:', err);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    };

    useLayoutEffect(() => {
        if (!isFetchingMore) return;
        if (!chatContainerRef.current) return;

        const container = chatContainerRef.current;

        if (lastScrollHeightRef.current > 0) {
            const diff = container.scrollHeight - lastScrollHeightRef.current;
            container.scrollTop = diff;
            lastScrollHeightRef.current = 0;
        }
    }, [isFetchingMore, userMessages.length]);

    const isNearBottom = useCallback(() => {
        if (!chatContainerRef.current) return false;
        const { scrollTop, scrollHeight, clientHeight } =
            chatContainerRef.current;
        return scrollHeight - scrollTop - clientHeight < 200;
    }, []);

    // تحديث حالة الرسائل إلى مقروءة عند استلام رسائل جديدة
    useEffect(() => {
        if (userMessages.length === 0) return;
        if (!otherUser?._id) return;

        const lastMessage = userMessages[userMessages.length - 1];

        console.log('Checking last message:', {
            from: lastMessage?.from?._id,
            status: lastMessage?.status,
            isNearBottom: isNearBottom(),
        });

        if (
            lastMessage?.from?._id === otherUser._id &&
            lastMessage.status !== 'seen'
        ) {
            const nearBottom = isNearBottom();

            if (nearBottom) {
                console.log('User is near bottom, marking as seen');
                lastSeenRef.current = lastMessage._id;

                // تحديث عبر API
                axios
                    .patch(
                        `${api}/messages/mark-as-seen/${otherUser._id}`,
                        {},
                        {
                            headers: { Authorization: token },
                        },
                    )
                    .then(() => {
                        console.log('API mark as seen success');
                        // تحديث الحالة محلياً
                        setMessagesForUser(
                            otherUser._id ?? '',
                            (prev: LocalMessage[]): LocalMessage[] => {
                                return prev.map((m): LocalMessage => {
                                    if (
                                        m?.from?._id === otherUser._id &&
                                        m.status !== 'seen'
                                    ) {
                                        return {
                                            ...m,
                                            status: 'seen' as const,
                                        };
                                    }
                                    return m;
                                });
                            },
                        );

                        // إرسال عبر Socket
                        const roomId = [otherUser._id, currentUser._id]
                            .sort()
                            .join('_');
                        socket.emit('message:seen', {
                            from: currentUser._id,
                            to: otherUser._id,
                            roomId: roomId,
                        });
                    })
                    .catch((err) => {
                        console.error('Failed to mark as seen:', err);
                    });
            }
        }
    }, [
        userMessages,
        otherUser._id,
        token,
        currentUser._id,
        setMessagesForUser,
        socket,
        isNearBottom,
    ]);

    // عند فتح المحادثة، قم بتحديث الحالة
    useEffect(() => {
        if (!otherUser?._id) return;
        if (isLoading) return;

        console.log('Chat opened, checking for unseen messages');

        const timeoutId = setTimeout(() => {
            const unseenMessages = userMessages.filter(
                (m) => m?.from?._id === otherUser._id && m.status !== 'seen',
            );

            console.log('Unseen messages on open:', unseenMessages.length);

            if (unseenMessages.length > 0 && isNearBottom()) {
                console.log('Marking as seen on chat open');

                axios
                    .patch(
                        `${api}/messages/mark-as-seen/${otherUser._id}`,
                        {},
                        {
                            headers: { Authorization: token },
                        },
                    )
                    .then(() => {
                        setMessagesForUser(
                            otherUser._id ?? '',
                            (prev: LocalMessage[]): LocalMessage[] => {
                                return prev.map((m): LocalMessage => {
                                    if (
                                        m?.from?._id === otherUser._id &&
                                        m.status !== 'seen'
                                    ) {
                                        return {
                                            ...m,
                                            status: 'seen' as const,
                                        };
                                    }
                                    return m;
                                });
                            },
                        );

                        const roomId = [otherUser._id, currentUser._id]
                            .sort()
                            .join('_');
                        socket.emit('message:seen', {
                            from: currentUser._id,
                            to: otherUser._id,
                            roomId: roomId,
                        });
                    })
                    .catch((err) => {
                        console.error('Failed to mark as seen on open:', err);
                    });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [otherUser._id, isLoading]);

    // Socket events
    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        loadConversation();

        socket.on('message:received', (message: LocalMessage) => {
            if (message?.from?._id === otherUser?._id) {
                const shouldScroll = isNearBottom();
                addMessageForUser(otherUser?._id as string, message);
                if (shouldScroll) {
                    requestAnimationFrame(() => {
                        scrollToBottom('smooth', chatContainerRef);
                    });
                }
            }
        });

        socket.on('message:sent', (message: LocalMessage) => {
            if (message?.to?._id === otherUser?._id) {
                setMessagesForUser(
                    otherUser?._id ?? '',
                    (prev: LocalMessage[]) => reconcileMessage(prev, message),
                );
            }
        });

        socket.on('user:typing', ({ from }: { from: string }) => {
            if (from === otherUser._id) {
                setTyping(true);
            }
        });

        socket.on('user:stopTyping', ({ from }: { from: string }) => {
            if (from === otherUser._id) setTyping(false);
        });

        socket.on('message:delivered', (message: LocalMessage) => {
            if (message?.to?._id === otherUser?._id) {
                setMessagesForUser(
                    otherUser?._id ?? '',
                    (prev: LocalMessage[]) => reconcileMessage(prev, message),
                );
            }
        });

        socket.on(
            'message:seen',
            ({ from, to }: { from: string; to: string }) => {
                console.log('Message seen event received:', { from, to });

                // التحقق من وجود from و to
                if (!from || !to) {
                    console.warn('Message seen event missing from or to');
                    return;
                }

                // إذا كان المستخدم الحالي هو من رأى الرسائل (أي المستخدم الآخر يرى رسائله)
                if (from === currentUser._id && to === otherUser._id) {
                    console.log('Updating messages to seen for current user');

                    setMessagesForUser(
                        otherUser._id ?? '',
                        (prev: LocalMessage[]): LocalMessage[] => {
                            return prev.map((m): LocalMessage => {
                                // تحديث الرسائل المرسلة من المستخدم الحالي إلى المستخدم الآخر
                                if (
                                    m?.from?._id === currentUser._id &&
                                    m.status !== 'seen'
                                ) {
                                    console.log(
                                        'Updating message to seen:',
                                        m._id,
                                    );
                                    return { ...m, status: 'seen' as const };
                                }
                                return m;
                            });
                        },
                    );
                }

                // إذا كان المستخدم الآخر هو من رأى الرسائل
                if (from === otherUser._id && to === currentUser._id) {
                    console.log('Updating messages to seen for other user');

                    setMessagesForUser(
                        otherUser._id ?? '',
                        (prev: LocalMessage[]): LocalMessage[] => {
                            return prev.map((m): LocalMessage => {
                                // تحديث الرسائل المرسلة من المستخدم الآخر
                                if (
                                    m?.from?._id === otherUser._id &&
                                    m.status !== 'seen'
                                ) {
                                    console.log(
                                        'Updating other user message to seen:',
                                        m._id,
                                    );
                                    return { ...m, status: 'seen' as const };
                                }
                                return m;
                            });
                        },
                    );
                }
            },
        );

        return () => {
            socket.off('message:delivered');
            socket.off('message:received');
            socket.off('message:sent');
            socket.off('message:seen');
            socket.off('user:typing');
            socket.off('user:stopTyping');
        };
    }, [otherUser._id]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showError(t('messages.fileTooLarge'));
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('toUserId', otherUser?._id ?? '');

        try {
            const res = await axios.post(`${api}/messages/upload`, formData, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.message) {
                addMessageForUser(otherUser?._id ?? '', res.data.message);
                scrollToBottom('smooth', chatContainerRef);
            }
        } catch (err) {
            console.error('Failed to upload file:', err);
            showError(t('messages.uploadFailed'));
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    if (!auth._id) return <Navigate to={path.Login} replace />;

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                position: 'relative',
            }}
        >
            {/* زر اختبار يدوي */}
            <Button
                variant='contained'
                size='small'
                onClick={() => {
                    console.log('Manual mark as seen triggered');
                    const unseen = userMessages.filter(
                        (m) =>
                            m?.from?._id === otherUser._id &&
                            m.status !== 'seen',
                    );
                    console.log('Unseen messages:', unseen);
                    markMessagesAsSeen();
                }}
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 100,
                    display: 'none', // إخفاء في الإنتاج
                }}
            >
                Mark as Seen
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        maxWidth: 120,
                        boxShadow: 2,
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        if (selectedMessageId) {
                            handleDeleteClick(selectedMessageId);
                        }
                    }}
                    sx={{
                        color: 'error.main',
                        gap: 1,
                        '&:hover': {
                            bgcolor: 'error.light',
                            color: 'error.contrastText',
                        },
                    }}
                >
                    <DeleteIcon fontSize='small' />
                    {t('messages.delete')}
                </MenuItem>
            </Menu>

            <Box
                ref={chatContainerRef}
                onScroll={(e) => {
                    const { scrollTop } = e.currentTarget;
                    const nearBottom = isNearBottom();
                    setShowScrollBtn(!nearBottom);

                    if (nearBottom && !isLoading && userMessages.length > 0) {
                        const lastMessage =
                            userMessages[userMessages.length - 1];
                        if (
                            lastMessage?.from?._id === otherUser._id &&
                            lastMessage.status !== 'seen'
                        ) {
                            console.log('Marking as seen on scroll');

                            if (lastSeenRef.current !== lastMessage._id) {
                                lastSeenRef.current = lastMessage._id;

                                axios
                                    .patch(
                                        `${api}/messages/mark-as-seen/${otherUser._id}`,
                                        {},
                                        {
                                            headers: { Authorization: token },
                                        },
                                    )
                                    .then(() => {
                                        setMessagesForUser(
                                            otherUser._id ?? '',
                                            (
                                                prev: LocalMessage[],
                                            ): LocalMessage[] => {
                                                return prev.map(
                                                    (m): LocalMessage => {
                                                        if (
                                                            m?.from?._id ===
                                                                otherUser._id &&
                                                            m.status !== 'seen'
                                                        ) {
                                                            return {
                                                                ...m,
                                                                status: 'seen' as const,
                                                            };
                                                        }
                                                        return m;
                                                    },
                                                );
                                            },
                                        );

                                        const roomId = [
                                            otherUser._id,
                                            currentUser._id,
                                        ]
                                            .sort()
                                            .join('_');
                                        socket.emit('message:seen', {
                                            from: currentUser._id,
                                            to: otherUser._id,
                                            roomId: roomId,
                                        });
                                    })
                                    .catch((err) => {
                                        console.error(
                                            'Failed to mark as seen on scroll:',
                                            err,
                                        );
                                    });
                            }
                        }
                    }

                    if (scrollTop === 0 && hasMore && !isFetchingMore) {
                        loadConversation(false);
                    }
                }}
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 2,
                    pb: 15,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    overflowAnchor: 'auto',
                    overscrollBehaviorY: 'contain',
                }}
            >
                {isFetchingMore && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            py: 1,
                        }}
                    >
                        <CircularProgress size={20} />
                    </Box>
                )}

                {isLoading && !isFetchingMore ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 4,
                        }}
                    >
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    userMessages.map((msg) => {
                        const isMe = msg?.from?._id === currentUser._id;
                        const isFile = msg.fileUrl;

                        return (
                            <Box
                                key={msg._id}
                                data-message-id={msg._id}
                                sx={{
                                    alignSelf: isMe ? 'flex-start' : 'flex-end',
                                    position: 'relative',
                                }}
                            >
                                <Paper
                                    elevation={isMe ? 0 : 1}
                                    sx={{
                                        p: '10px 14px',
                                        minWidth: '80px',
                                        maxWidth: 'max-content',
                                        display: 'flex',
                                        gap: 1.5,
                                        flexDirection: isMe
                                            ? 'row'
                                            : 'row-reverse',
                                        borderRadius: isMe
                                            ? '12px 4px 18px 18px'
                                            : '4px 12px 18px 18px',
                                        background: isMe
                                            ? (theme) =>
                                                  `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                                            : undefined,
                                        bgcolor: !isMe
                                            ? 'background.paper'
                                            : undefined,
                                        border: !isMe ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                        wordBreak: 'break-word',
                                        position: 'relative',
                                    }}
                                >
                                    {isMe && (
                                        <IconButton
                                            size='small'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setAnchorEl(e.currentTarget);
                                                setSelectedMessageId(msg._id);
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                bgcolor: 'background.paper',
                                                width: 24,
                                                height: 24,
                                                boxShadow: 1,
                                                opacity: 0,
                                                transition:
                                                    'opacity 0.2s ease-in-out',
                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                },
                                                '.MuiPaper-root:hover &': {
                                                    opacity: 1,
                                                },
                                                zIndex: 1,
                                            }}
                                        >
                                            <MoreVertIcon
                                                fontSize='small'
                                                sx={{
                                                    color: 'text.secondary',
                                                }}
                                            />
                                        </IconButton>
                                    )}

                                    {isFile ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            {msg.fileType?.includes('image') ? (
                                                <img
                                                    src={msg.fileUrl}
                                                    alt='sent file'
                                                    style={{
                                                        maxWidth: '100%',
                                                        borderRadius: 4,
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() =>
                                                        window.open(
                                                            msg.fileUrl,
                                                            '_blank',
                                                            'noopener norferrer',
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        p: 1,
                                                        bgcolor:
                                                            'rgba(0,0,0,0.05)',
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <InsertDriveFileIcon />
                                                    <Typography
                                                        variant='caption'
                                                        sx={{
                                                            textDecoration:
                                                                'underline',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() =>
                                                            window.open(
                                                                msg.fileUrl,
                                                            )
                                                        }
                                                    >
                                                        {t('messages.viewFile')}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    ) : (
                                        <Typography
                                            variant='body2'
                                            sx={{
                                                wordBreak: 'break-word',
                                                lineHeight: 1.5,
                                                whiteSpace: 'pre-wrap',
                                            }}
                                        >
                                            <Linkify
                                                text={
                                                    msg?.message ??
                                                    msg?.text ??
                                                    ''
                                                }
                                            />
                                        </Typography>
                                    )}

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            gap: 0.5,
                                            mt: 0.3,
                                        }}
                                    >
                                        {isMe && getStatusIcon(msg.status)}
                                    </Box>
                                </Paper>
                                <Typography
                                    variant='caption'
                                    sx={{
                                        color: 'text.secondary',
                                        flex: 'flex-end',
                                    }}
                                >
                                    {String(
                                        formatMessageTime(
                                            msg?.createdAt
                                                ? new Date(msg.createdAt)
                                                : new Date(),
                                        ),
                                    )}
                                </Typography>
                            </Box>
                        );
                    })
                )}

                {typing && (
                    <Fade in={typing}>
                        <Box
                            sx={{
                                alignSelf: 'flex-end',
                                bgcolor: 'action.hover',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                maxWidth: 'fit-content',
                            }}
                        >
                            <Typography
                                variant='caption'
                                sx={{
                                    fontStyle: 'italic',
                                    color: 'text.secondary',
                                }}
                            >
                                {otherUser.name?.first} {t('common.typing')}...
                            </Typography>
                        </Box>
                    </Fade>
                )}

                <Zoom in={showScrollBtn}>
                    <Fab
                        color='primary'
                        size='small'
                        onClick={() =>
                            scrollToBottom('smooth', chatContainerRef)
                        }
                        sx={{
                            position: 'absolute',
                            bottom: 70,
                            right: dir === 'rtl' ? 'auto' : 20,
                            left: dir === 'rtl' ? 20 : 'auto',
                            zIndex: 10,
                            boxShadow: 3,
                        }}
                    >
                        <ArrowDownwardIcon />
                    </Fab>
                </Zoom>
            </Box>

            <Box
                sx={{
                    p: 1,
                    bgcolor: 'background.paper',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <input
                    type='file'
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept='image/*,.pdf,.doc,.docx'
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        color='primary'
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <AttachFileIcon />
                    </IconButton>

                    <TextField
                        fullWidth
                        size='small'
                        multiline
                        maxRows={4}
                        value={input}
                        onChange={handleInputChange}
                        placeholder={t('messages.typeMessage')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        color='primary'
                                        onClick={() =>
                                            sendMessage(
                                                input,
                                                currentUser,
                                                otherUser,
                                                setInput,
                                                chatContainerRef,
                                                addMessageForUser,
                                                token,
                                                setMessagesForUser,
                                            )
                                        }
                                        disabled={!input.trim()}
                                    >
                                        <SendIcon
                                            sx={{
                                                transform:
                                                    dir === 'rtl'
                                                        ? 'rotate(180deg)'
                                                        : 'none',
                                            }}
                                        />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: 0,
                                backgroundColor: 'action.hover',
                            },
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ChatBox;
