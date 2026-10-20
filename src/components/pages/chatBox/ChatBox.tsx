/* eslint-disable react-hooks/exhaustive-deps */

import {
    useEffect,
    useState,
    useRef,
    FunctionComponent,
    useLayoutEffect,
    useCallback,
    useMemo,
    Suspense,
    lazy,
} from 'react';

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
    Menu,
    MenuItem,
    Button,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Navigate } from 'react-router-dom';

import socket from '../../../socket/globalSocket';
import { useChat } from '../../../hooks/useChat';
import { useUser } from '../../../hooks/useUSer';

import { BaseUser } from '../../../interfaces/chat/chatUser';
import { LocalMessage } from '../../../interfaces/chat/localMessage';

import Linkify from './Linkify';
import handleRTL from '../../../locales/handleRTL';

import {
    formatMessageTime,
    getStatusIcon,
    reconcileMessage,
    scrollToBottom,
    sendMessage,
} from './helpers/functions';

import { path } from '../../../routes/routes';

import { deleteMessage, editMessage } from '../../../services/messages';

import { showSuccess, showError } from '../../../atoms/toasts/ReactToast';

import { useTranslation } from 'react-i18next';
const AlertDialogs = lazy(() => import('../../../atoms/toasts/Sweetalert'));
import api from '../../../services/api';
import Loader from '../../../atoms/loader/Loader';

interface ChatBoxProps {
    currentUser: BaseUser;
    otherUser: BaseUser;
    initialMessage?: string;
}

const ChatBox: FunctionComponent<ChatBoxProps> = ({
    currentUser,
    otherUser,
    initialMessage,
}) => {
    // ======================================================
    // CHAT CONTEXT
    // ======================================================

    const {
        messages,
        addMessageForUser,
        setMessagesForUser,
        setUnreadForUser,
        updateMessage,
    } = useChat();

    // ======================================================
    // TRANSLATION / AUTH / RTL
    // ======================================================

    const { t } = useTranslation();

    const dir = handleRTL();

    const { auth } = useUser();

    // ======================================================
    // BASIC STATE
    // ======================================================

    const [input, setInput] = useState('');

    const [typing, setTyping] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const [hasMore, setHasMore] = useState(true);

    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const [initialMessageSent, setInitialMessageSent] = useState(false);

    // ======================================================
    // MESSAGE MENU
    // ======================================================

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
        null,
    );

    const [showDeleteMessageModal, setShowDeleteMessageModal] = useState(false);

    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

    const menuOpen = Boolean(anchorEl);

    // ======================================================
    // EDIT STATE
    // ======================================================

    const [editingMessageId, setEditingMessageId] = useState<string | null>(
        null,
    );

    const [editingText, setEditingText] = useState('');

    const [isEditing, setIsEditing] = useState(false);

    // ======================================================
    // DELETE STATE
    // ======================================================

    const [deletingMessageId, setDeletingMessageId] = useState<string | null>(
        null,
    );

    // ======================================================
    // REFS
    // ======================================================

    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isTypingRef = useRef(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const lastScrollHeightRef = useRef<number>(0);

    const lastSeenRef = useRef<string | null>(null);

    const initialScrollDone = useRef(false);

    // ======================================================
    // SCROLL BUTTON
    // ======================================================

    const [showScrollBtn, setShowScrollBtn] = useState(false);

    // ======================================================
    // CURRENT USER MESSAGES
    // ======================================================

    const userMessages = useMemo(() => {
        return messages[otherUser?._id ?? ''] || [];
    }, [messages, otherUser?._id]);

    // ======================================================
    // SELECTED MESSAGE
    // ======================================================

    const selectedMessage = useMemo(() => {
        if (!selectedMessageId) {
            return null;
        }

        return (
            userMessages.find((message) => message._id === selectedMessageId) ??
            null
        );
    }, [userMessages, selectedMessageId]);

    // ======================================================
    // MESSAGE MENU OPEN
    // ======================================================

    const handleMessageMenuOpen = (
        event: React.MouseEvent<HTMLElement>,
        message: LocalMessage,
    ) => {
        event.preventDefault();
        event.stopPropagation();

        // Only allow menu for own messages
        if (message.from?._id !== currentUser._id) {
            return;
        }

        setSelectedMessageId(message._id);

        setAnchorEl(event.currentTarget);
    };

    // ======================================================
    // CLOSE MESSAGE MENU
    // ======================================================

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedMessageId(null);
    };

    // ======================================================
    // START EDIT
    // ======================================================

    const handleEditClick = (message: LocalMessage) => {
        // Files cannot be edited
        if (message.fileUrl) {
            handleMenuClose();
            return;
        }

        // Only own messages can be edited
        if (message.from?._id !== currentUser._id) {
            handleMenuClose();
            return;
        }

        handleMenuClose();

        setEditingMessageId(message._id);

        setEditingText(message.message ?? message.text ?? '');
    };

    // ======================================================
    // CANCEL EDIT
    // ======================================================

    const handleCancelEdit = () => {
        if (isEditing) {
            return;
        }

        setEditingMessageId(null);

        setEditingText('');
    };

    // ======================================================
    // UPDATE MESSAGE
    // ======================================================

    const handleUpdateMessage = async () => {
        const messageId = editingMessageId;

        const text = editingText.trim();

        if (!messageId || !text || isEditing) {
            return;
        }

        setIsEditing(true);

        try {
            const updatedMessage = await editMessage(messageId, text);

            /*
             * Update through ChatContext.
             *
             * Do not spread the backend message object here.
             * This prevents status type conflicts.
             */
            updateMessage(otherUser._id as string, messageId, {
                message: updatedMessage.message ?? text,

                text: updatedMessage.message ?? text,

                edited: true,

                editedAt: updatedMessage.editedAt
                    ? new Date(updatedMessage.editedAt)
                    : new Date(),
            });

            setEditingMessageId(null);

            setEditingText('');

            showSuccess(
                t('messages.editSuccess') || 'Message edited successfully',
            );
        } catch (error) {
            console.error('Failed to edit message:', error);

            showError(t('messages.editFailed') || 'Failed to edit message');
        } finally {
            setIsEditing(false);
        }
    };

    // ======================================================
    // DELETE MESSAGE
    // ======================================================

    const handleDeleteClick = (messageId: string) => {
        handleMenuClose();

        if (deletingMessageId) {
            return;
        }

        setMessageToDelete(messageId);
        setShowDeleteMessageModal(true);
    };

    const handleConfirmDeleteMessage = async () => {
        if (!messageToDelete || deletingMessageId) {
            return;
        }

        setDeletingMessageId(messageToDelete);

        try {
            const success = await deleteMessage(messageToDelete);

            if (!success) {
                throw new Error('Failed to delete message');
            }

            setMessagesForUser(
                otherUser._id as string,
                (prev: LocalMessage[]) =>
                    prev.filter((message) => message._id !== messageToDelete),
            );

            setMessageToDelete(null);
            setShowDeleteMessageModal(false);
        } catch (error) {
            console.error('Failed to delete message:', error);

            throw error;
        } finally {
            setDeletingMessageId(null);
        }
    };

    // ======================================================
    // INITIAL MESSAGE
    // ======================================================

    useEffect(() => {
        if (initialMessage && !initialMessageSent && !isLoading && socket) {
            const newMessage: LocalMessage = {
                _id: `initial-${Date.now()}`,

                text: initialMessage,

                message: initialMessage,

                from: currentUser,

                to: otherUser,

                status: 'sent',

                createdAt: new Date().toISOString(),

                updatedAt: new Date().toISOString(),
            };

            addMessageForUser(otherUser._id as string, newMessage);

            api.post(`/messages`, {
                toUserId: otherUser._id,

                message: initialMessage,
            })
                .then((res) => {
                    const savedMessage = res.data?.message ?? res.data;

                    if (!savedMessage?._id) {
                        return;
                    }

                    setMessagesForUser(
                        otherUser._id as string,
                        (prev: LocalMessage[]) =>
                            prev.map((message) =>
                                message._id === newMessage._id
                                    ? {
                                          ...message,
                                          ...savedMessage,
                                      }
                                    : message,
                            ),
                    );
                })
                .catch((err) => {
                    console.error('Failed to send initial message:', err);

                    showError(
                        t('messages.sendFailed') || 'Failed to send message',
                    );
                });

            requestAnimationFrame(() => {
                scrollToBottom('smooth', chatContainerRef);
            });

            setInitialMessageSent(true);
        }
    }, [initialMessage, initialMessageSent, isLoading]);

    // ======================================================
    // INITIAL SCROLL
    // ======================================================

    useLayoutEffect(() => {
        if (isLoading) {
            return;
        }

        if (initialScrollDone.current) {
            return;
        }

        requestAnimationFrame(() => {
            scrollToBottom('auto', chatContainerRef);

            initialScrollDone.current = true;
        });
    }, [isLoading, userMessages.length]);

    // ======================================================
    // MARK AS SEEN
    // ======================================================

    const markAsSeen = useCallback(
        (lastMessageId?: string) => {
            if (!otherUser?._id || !socket) {
                return;
            }

            api.patch(`/messages/mark-as-seen/${otherUser._id}`, {})
                .then(() => {
                    setMessagesForUser(
                        otherUser._id as string,
                        (prev: LocalMessage[]): LocalMessage[] => {
                            return prev.map((message): LocalMessage => {
                                if (
                                    message?.from?._id === otherUser._id &&
                                    message.status !== 'seen'
                                ) {
                                    return {
                                        ...message,
                                        status: 'seen',
                                    };
                                }

                                return message;
                            });
                        },
                    );

                    setUnreadForUser(otherUser._id as string, 0);

                    if (lastMessageId) {
                        lastSeenRef.current = lastMessageId;
                    }

                    const roomId = [otherUser._id, currentUser._id]
                        .sort()
                        .join('_');

                    socket.emit('message:seen', {
                        from: currentUser._id,
                        to: otherUser._id,
                        roomId,
                    });
                })
                .catch((err) => {
                    console.error('Failed to mark as seen:', err);
                });
        },
        [otherUser?._id, currentUser._id, setMessagesForUser, setUnreadForUser],
    );

    // ======================================================
    // INPUT / TYPING
    // ======================================================

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setInput(value);

        if (!socket) {
            return;
        }

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

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('user:stopTyping', {
                to: otherUser._id,
                from: currentUser._id,
            });

            isTypingRef.current = false;
        }, 1500);
    };

    // ======================================================
    // LOAD CONVERSATION
    // ======================================================

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

            const res = await api.get(
                `/messages/conversation/${otherUser._id}?limit=20&skip=${skip}`,
            );

            const fetchedMessages = res.data.messages || [];

            if (isInitial) {
                setMessagesForUser(otherUser._id as string, fetchedMessages);

                requestAnimationFrame(() => {
                    scrollToBottom('smooth', chatContainerRef);
                });
            } else {
                setMessagesForUser(
                    otherUser._id as string,
                    (prev: LocalMessage[]) => [...fetchedMessages, ...prev],
                );
            }

            setHasMore(Boolean(res.data.hasMore));
        } catch (err) {
            console.error('Pagination error:', err);
        } finally {
            setIsLoading(false);

            setIsFetchingMore(false);
        }
    };

    // ======================================================
    // RESTORE SCROLL AFTER PAGINATION
    // ======================================================

    useLayoutEffect(() => {
        if (!isFetchingMore) {
            return;
        }

        if (!chatContainerRef.current) {
            return;
        }

        const container = chatContainerRef.current;

        if (lastScrollHeightRef.current > 0) {
            const diff = container.scrollHeight - lastScrollHeightRef.current;

            container.scrollTop = diff;

            lastScrollHeightRef.current = 0;
        }
    }, [isFetchingMore, userMessages.length]);

    // ======================================================
    // NEAR BOTTOM
    // ======================================================

    const isNearBottom = useCallback(() => {
        if (!chatContainerRef.current) {
            return false;
        }

        const { scrollTop, scrollHeight, clientHeight } =
            chatContainerRef.current;

        return scrollHeight - scrollTop - clientHeight < 200;
    }, []);

    // ======================================================
    // AUTO MARK SEEN
    // ======================================================

    useEffect(() => {
        if (userMessages.length === 0 || !otherUser?._id) {
            return;
        }

        const lastMessage = userMessages[userMessages.length - 1];

        if (
            lastMessage?.from?._id === otherUser._id &&
            lastMessage.status !== 'seen'
        ) {
            if (isNearBottom()) {
                markAsSeen(lastMessage._id);
            }
        }
    }, [userMessages, otherUser._id, isNearBottom, markAsSeen]);

    // ======================================================
    // MARK SEEN ON OPEN
    // ======================================================

    useEffect(() => {
        if (!otherUser?._id || isLoading) {
            return;
        }

        const timeoutId = setTimeout(() => {
            const unseenMessages = userMessages.filter(
                (message) =>
                    message?.from?._id === otherUser._id &&
                    message.status !== 'seen',
            );

            if (unseenMessages.length > 0 && isNearBottom()) {
                markAsSeen(unseenMessages[unseenMessages.length - 1]._id);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [otherUser._id, isLoading, markAsSeen]);

    // ======================================================
    // SOCKET EVENTS
    //
    // message:edited / message:deleted
    // are handled centrally in ChatContext.
    // ======================================================

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        void loadConversation();

        // ================================================
        // RECEIVED MESSAGE
        // ================================================

        const handleReceivedMessage = (message: LocalMessage) => {
            if (message?.from?._id !== otherUser?._id) {
                return;
            }

            const shouldScroll = isNearBottom();

            addMessageForUser(otherUser._id as string, message);

            if (shouldScroll) {
                requestAnimationFrame(() => {
                    scrollToBottom('smooth', chatContainerRef);
                });
            }
        };

        // ================================================
        // SENT MESSAGE
        // ================================================

        const handleSentMessage = (message: LocalMessage) => {
            if (message?.to?._id !== otherUser?._id) {
                return;
            }

            setMessagesForUser(
                otherUser._id as string,
                (prev: LocalMessage[]) => reconcileMessage(prev, message),
            );
        };

        // ================================================
        // TYPING
        // ================================================

        const handleTyping = ({ from }: { from: string }) => {
            if (from === otherUser._id) {
                setTyping(true);
            }
        };

        const handleStopTyping = ({ from }: { from: string }) => {
            if (from === otherUser._id) {
                setTyping(false);
            }
        };

        // ================================================
        // DELIVERED
        // ================================================

        const handleDelivered = (message: LocalMessage) => {
            if (message?.to?._id !== otherUser?._id) {
                return;
            }

            setMessagesForUser(
                otherUser._id as string,
                (prev: LocalMessage[]) => reconcileMessage(prev, message),
            );
        };

        // ================================================
        // SEEN
        // ================================================

        const handleSeen = ({ from, to }: { from: string; to: string }) => {
            if (!from || !to) {
                return;
            }

            // Other user read my messages
            if (from === otherUser._id && to === currentUser._id) {
                setMessagesForUser(otherUser._id, (prev: LocalMessage[]) =>
                    prev.map((message) => {
                        if (
                            message?.from?._id === currentUser._id &&
                            message.status !== 'seen'
                        ) {
                            return {
                                ...message,
                                status: 'seen',
                            };
                        }

                        return message;
                    }),
                );
            }

            // Echo of my own seen event
            if (from === currentUser._id && to === otherUser._id) {
                setMessagesForUser(otherUser._id, (prev: LocalMessage[]) =>
                    prev.map((message) => {
                        if (
                            message?.from?._id === otherUser._id &&
                            message.status !== 'seen'
                        ) {
                            return {
                                ...message,
                                status: 'seen',
                            };
                        }

                        return message;
                    }),
                );
            }
        };

        socket.on('message:received', handleReceivedMessage);

        socket.on('message:sent', handleSentMessage);

        socket.on('user:typing', handleTyping);

        socket.on('user:stopTyping', handleStopTyping);

        socket.on('message:delivered', handleDelivered);

        socket.on('message:seen', handleSeen);

        return () => {
            socket.off('message:received', handleReceivedMessage);

            socket.off('message:sent', handleSentMessage);

            socket.off('user:typing', handleTyping);

            socket.off('user:stopTyping', handleStopTyping);

            socket.off('message:delivered', handleDelivered);

            socket.off('message:seen', handleSeen);
        };
    }, [otherUser._id]);

    // ======================================================
    // FILE UPLOAD
    // ======================================================

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError(t('messages.fileTooLarge'));

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            return;
        }

        const formData = new FormData();

        formData.append('file', file);

        formData.append('toUserId', otherUser?._id ?? '');

        try {
            const res = await api.post(`/messages/upload`, formData);

            if (res.data.message) {
                addMessageForUser(otherUser._id as string, res.data.message);

                scrollToBottom('smooth', chatContainerRef);
            }
        } catch (err) {
            console.error('Failed to upload file:', err);

            showError(t('messages.uploadFailed'));
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // ======================================================
    // CLEANUP TYPING
    // ======================================================

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    // ======================================================
    // AUTH
    // ======================================================

    if (!auth?._id) {
        return <Navigate to={path.Login} replace />;
    }

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* ================================================= */}
            {/* MESSAGE MENU */}
            {/* ================================================= */}

            <Menu
                id='message-menu'
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                keepMounted
                disablePortal={false}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: dir === 'rtl' ? 'left' : 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: dir === 'rtl' ? 'left' : 'right',
                }}
                TransitionComponent={Fade}
                transitionDuration={150}
                slotProps={{
                    root: {
                        sx: {
                            zIndex: 999999,
                        },
                    },

                    paper: {
                        sx: {
                            minWidth: 160,

                            mt: 0.5,

                            borderRadius: 2.5,

                            boxShadow: 6,

                            overflow: 'hidden',

                            zIndex: 999999,

                            '& .MuiMenuItem-root': {
                                fontSize: '0.875rem',
                                py: 1,
                                gap: 1,
                            },
                        },
                    },
                }}
            >
                {/* EDIT */}

                {selectedMessage &&
                    !selectedMessage.fileUrl &&
                    selectedMessage.from?._id === currentUser._id && (
                        <MenuItem
                            onClick={() => handleEditClick(selectedMessage)}
                            disabled={isEditing}
                        >
                            <ListItemIcon>
                                <EditIcon fontSize='small' />
                            </ListItemIcon>

                            <ListItemText
                                primary={t('messages.edit') || 'Edit'}
                            />
                        </MenuItem>
                    )}

                {/* DELETE */}

                {selectedMessage &&
                    selectedMessage.from?._id === currentUser._id && (
                        <MenuItem
                            onClick={() => {
                                if (selectedMessageId) {
                                    void handleDeleteClick(selectedMessageId);
                                }
                            }}
                            disabled={deletingMessageId === selectedMessageId}
                            sx={{
                                color: 'error.main',
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: 'error.main',
                                }}
                            >
                                <DeleteIcon fontSize='small' />
                            </ListItemIcon>

                            <ListItemText
                                primary={t('messages.delete') || 'Delete'}
                            />
                        </MenuItem>
                    )}
            </Menu>

            {/* ================================================= */}
            {/* MESSAGES */}
            {/* ================================================= */}

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
                            if (lastSeenRef.current !== lastMessage._id) {
                                markAsSeen(lastMessage._id);
                            }
                        }
                    }

                    if (scrollTop === 0 && hasMore && !isFetchingMore) {
                        void loadConversation(false);
                    }
                }}
                sx={{
                    flexGrow: 1,

                    overflowY: 'auto',

                    p: { xs: 1.5, sm: 2.5 },

                    pb: 3,

                    display: 'flex',

                    flexDirection: 'column',

                    gap: 1,

                    overflowAnchor: 'auto',

                    overscrollBehaviorY: 'contain',

                    background: (theme) =>
                        theme.palette.mode === 'dark'
                            ? `radial-gradient(circle at 20% 20%, ${theme.palette.primary.dark}1A, transparent 45%),
                               radial-gradient(circle at 80% 80%, ${theme.palette.secondary.dark}1A, transparent 45%),
                               ${theme.palette.background.default}`
                            : `radial-gradient(circle at 20% 20%, ${theme.palette.primary.light}25, transparent 45%),
                               radial-gradient(circle at 80% 80%, ${theme.palette.secondary.light}25, transparent 45%),
                               ${theme.palette.background.default}`,

                    '&::-webkit-scrollbar': { width: 6 },

                    '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },

                    '&::-webkit-scrollbar-thumb': {
                        bgcolor: 'divider',
                        borderRadius: 3,
                        '&:hover': { bgcolor: 'text.disabled' },
                    },

                    '@media (hover: hover)': {
                        '& .message-row:not(:hover) .message-menu-button': {
                            opacity: 0,
                            transform: 'scale(0.85)',
                        },
                    },
                }}
            >
                {/* PAGINATION LOADER */}

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

                {/* LOADING */}

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

                        const isFile = Boolean(msg.fileUrl);

                        const isEditingThis = editingMessageId === msg._id;

                        return (
                            <Box
                                key={msg._id}
                                data-message-id={msg._id}
                                className='message-row'
                                sx={{
                                    alignSelf: isMe ? 'flex-start' : 'flex-end',

                                    position: 'relative',

                                    maxWidth: { xs: '88%', sm: '75%' },
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: '10px 14px',

                                        minWidth: '80px',

                                        maxWidth: '100%',

                                        display: 'flex',

                                        flexDirection: 'column',

                                        gap: 0.5,

                                        position: 'relative',

                                        wordBreak: 'break-word',

                                        borderRadius: isMe
                                            ? '18px 18px 4px 18px'
                                            : '18px 18px 18px 4px',

                                        background: isMe
                                            ? (theme) =>
                                                  theme.palette.mode === 'dark'
                                                      ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                                                      : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                                            : (theme) =>
                                                  theme.palette.mode === 'dark'
                                                      ? theme.palette.grey[800]
                                                      : theme.palette.background
                                                            .paper,

                                        color: isMe
                                            ? 'primary.contrastText'
                                            : 'text.primary',

                                        boxShadow: isMe
                                            ? (theme) =>
                                                  `0 2px 8px ${theme.palette.primary.main}30`
                                            : (theme) =>
                                                  `0 1px 3px ${theme.palette.common.black}0F`,

                                        border: !isMe ? '1px solid' : 'none',

                                        borderColor: 'divider',

                                        transition:
                                            'box-shadow 0.2s ease, transform 0.15s ease',

                                        '&:hover': {
                                            boxShadow: isMe
                                                ? (theme) =>
                                                      `0 4px 14px ${theme.palette.primary.main}45`
                                                : (theme) =>
                                                      `0 3px 10px ${theme.palette.common.black}18`,
                                        },
                                    }}
                                >
                                    {/* ================================= */}
                                    {/* THREE DOTS */}
                                    {/* ================================= */}

                                    {isMe && (
                                        <IconButton
                                            className='message-menu-button'
                                            size='small'
                                            aria-label={
                                                t('messages.options') ||
                                                'Message options'
                                            }
                                            aria-haspopup='true'
                                            aria-controls={
                                                menuOpen
                                                    ? 'message-menu'
                                                    : undefined
                                            }
                                            aria-expanded={
                                                menuOpen ? 'true' : undefined
                                            }
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                            }}
                                            onClick={(e) =>
                                                handleMessageMenuOpen(e, msg)
                                            }
                                            sx={{
                                                position: 'absolute',

                                                top: -20,

                                                [dir === 'rtl'
                                                    ? 'left'
                                                    : 'right']:'90%',

                                                width: 28,

                                                height: 28,

                                                bgcolor: 'background.paper',

                                                border: '1px solid',

                                                borderColor: 'divider',

                                                boxShadow: 2,

                                                zIndex: 100,

                                                // 👇 ظاهر دايماً
                                                opacity: 1,

                                                transform: 'scale(1)',

                                                transition:
                                                    'opacity 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease',

                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                    boxShadow: 3,
                                                    transform: 'scale(1.08)',
                                                },

                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 16,
                                                    color: 'text.secondary',
                                                },
                                            }}
                                        >
                                            <MoreVertIcon fontSize='small' />
                                        </IconButton>
                                    )}

                                    {/* ================================= */}
                                    {/* EDITING */}
                                    {/* ================================= */}

                                    {isEditingThis && !isFile ? (
                                        <Box
                                            sx={{
                                                minWidth: {
                                                    xs: 200,
                                                    sm: 260,
                                                },

                                                maxWidth: '100%',
                                            }}
                                        >
                                            <TextField
                                                autoFocus
                                                fullWidth
                                                multiline
                                                minRows={1}
                                                maxRows={5}
                                                size='small'
                                                label={t(
                                                    'messages.editMessage',
                                                    'تعديل الرسالة',
                                                )}
                                                aria-label={t(
                                                    'messages.editMessage',
                                                    'تعديل الرسالة',
                                                )}
                                                title={t(
                                                    'messages.editMessage',
                                                    'تعديل الرسالة',
                                                )}
                                                value={editingText}
                                                onChange={(e) =>
                                                    setEditingText(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') {
                                                        handleCancelEdit();
                                                    }

                                                    if (
                                                        (e.ctrlKey ||
                                                            e.metaKey) &&
                                                        e.key === 'Enter'
                                                    ) {
                                                        e.preventDefault();

                                                        void handleUpdateMessage();
                                                    }
                                                }}
                                                sx={{
                                                    '& .MuiInputBase-root': {
                                                        bgcolor:
                                                            'background.paper',
                                                    },
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    display: 'flex',

                                                    justifyContent: 'flex-end',

                                                    gap: 0.5,

                                                    mt: 1,
                                                }}
                                            >
                                                <Button
                                                    size='small'
                                                    onClick={handleCancelEdit}
                                                    disabled={isEditing}
                                                >
                                                    {t('common.cancel') ||
                                                        t(
                                                            'messages.cancelEdit',
                                                        ) ||
                                                        'Cancel'}
                                                </Button>

                                                <Button
                                                    size='small'
                                                    variant='contained'
                                                    onClick={() =>
                                                        void handleUpdateMessage()
                                                    }
                                                    disabled={
                                                        !editingText.trim() ||
                                                        isEditing
                                                    }
                                                >
                                                    {isEditing ? (
                                                        <CircularProgress
                                                            size={16}
                                                        />
                                                    ) : (
                                                        t(
                                                            'messages.saveEdit',
                                                        ) || 'Save'
                                                    )}
                                                </Button>
                                            </Box>
                                        </Box>
                                    ) : isFile ? (
                                        /* ================================= */
                                        /* FILE */
                                        /* ================================= */

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
                                                    alt={t(
                                                        'messages.sentImage',
                                                        'صورة مرفقة في المحادثة',
                                                    )}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: 260,
                                                        borderRadius: 10,
                                                        cursor: 'pointer',
                                                        objectFit: 'cover',
                                                    }}
                                                    onClick={() =>
                                                        window.open(
                                                            msg.fileUrl,
                                                            '_blank',
                                                            'noopener,noreferrer',
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
                                                        bgcolor: 'action.hover',
                                                        borderRadius: 1.5,
                                                    }}
                                                >
                                                    <InsertDriveFileIcon aria-hidden='true' />

                                                    <Button
                                                        variant='text'
                                                        size='small'
                                                        onClick={() =>
                                                            window.open(
                                                                msg.fileUrl,
                                                                '_blank',
                                                                'noopener,noreferrer',
                                                            )
                                                        }
                                                        aria-label={t(
                                                            'messages.viewFile',
                                                            'عرض الملف المرفق',
                                                        )}
                                                    >
                                                        {t(
                                                            'messages.viewFile',
                                                            'عرض الملف',
                                                        )}
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                    ) : (
                                        /* ================================= */
                                        /* TEXT */
                                        /* ================================= */

                                        <Box
                                            sx={{
                                                minWidth: 0,
                                            }}
                                        >
                                            <Typography
                                                variant='body2'
                                                sx={{
                                                    wordBreak: 'break-word',

                                                    lineHeight: 1.5,

                                                    whiteSpace: 'pre-wrap',

                                                    fontSize: '0.9rem',
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

                                            {/* EDITED */}

                                            {msg.edited && (
                                                <Typography
                                                    component='span'
                                                    variant='caption'
                                                    sx={{
                                                        display: 'inline-block',

                                                        mt: 0.25,

                                                        opacity: 0.7,

                                                        fontSize: '0.68rem',

                                                        fontStyle: 'italic',
                                                    }}
                                                >
                                                    {t('messages.edited') ||
                                                        'edited'}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    {/* ================================= */}
                                    {/* STATUS + TIME (مدمجين) */}
                                    {/* ================================= */}

                                    {!isEditingThis && (
                                        <Box
                                            sx={{
                                                display: 'flex',

                                                alignItems: 'center',

                                                justifyContent: 'flex-end',

                                                gap: 0.5,

                                                mt: 0.25,

                                                minHeight: 14,
                                            }}
                                        >
                                            <Typography
                                                component='span'
                                                sx={{
                                                    fontSize: '0.65rem',

                                                    opacity: isMe ? 0.8 : 0.65,

                                                    color: isMe
                                                        ? 'inherit'
                                                        : 'text.secondary',

                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {String(
                                                    formatMessageTime(
                                                        msg?.createdAt
                                                            ? new Date(
                                                                  msg.createdAt,
                                                              )
                                                            : new Date(),
                                                    ),
                                                )}
                                            </Typography>

                                            {isMe && (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        '& svg': {
                                                            fontSize: 14,
                                                        },
                                                    }}
                                                >
                                                    {getStatusIcon(msg.status)}
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Paper>
                            </Box>
                        );
                    })
                )}

                {/* ============================================= */}
                {/* TYPING */}
                {/* ============================================= */}

                {typing && (
                    <Fade in={typing}>
                        <Box
                            sx={{
                                alignSelf: 'flex-end',

                                bgcolor: 'background.paper',

                                border: '1px solid',

                                borderColor: 'divider',

                                px: 1.5,

                                py: 0.75,

                                borderRadius: '18px 18px 18px 4px',

                                maxWidth: 'fit-content',

                                boxShadow: 1,

                                display: 'flex',

                                alignItems: 'center',

                                gap: 0.75,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 0.3,
                                }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            bgcolor: 'text.secondary',
                                            animation:
                                                'typingBounce 1.2s infinite',
                                            animationDelay: `${i * 0.15}s`,
                                            '@keyframes typingBounce': {
                                                '0%, 60%, 100%': {
                                                    transform: 'translateY(0)',
                                                    opacity: 0.4,
                                                },
                                                '30%': {
                                                    transform:
                                                        'translateY(-4px)',
                                                    opacity: 1,
                                                },
                                            },
                                        }}
                                    />
                                ))}
                            </Box>

                            <Typography
                                variant='caption'
                                sx={{
                                    fontStyle: 'italic',

                                    color: 'text.secondary',
                                }}
                            >
                                {otherUser.name?.first} {t('common.typing')}
                                ...
                            </Typography>
                        </Box>
                    </Fade>
                )}

                {/* ============================================= */}
                {/* SCROLL TO BOTTOM */}
                {/* ============================================= */}

                <Zoom in={showScrollBtn}>
                    <Fab
                        aria-label={
                            t('messages.scrollToLatest') ||
                            'Scroll to latest messages'
                        }
                        color='primary'
                        size='small'
                        onClick={() =>
                            scrollToBottom('smooth', chatContainerRef)
                        }
                        sx={{
                            position: 'sticky',

                            bottom: 8,

                            alignSelf:
                                dir === 'rtl' ? 'flex-start' : 'flex-end',

                            ml: dir === 'rtl' ? 1 : 'auto',

                            mr: dir === 'rtl' ? 'auto' : 1,

                            zIndex: 10,

                            boxShadow: 4,

                            width: 38,

                            height: 38,

                            transition: 'transform 0.15s',

                            '&:hover': {
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        <ArrowDownwardIcon fontSize='small' />
                    </Fab>
                </Zoom>
            </Box>

            {/* ================================================= */}
            {/* INPUT */}
            {/* ================================================= */}

            <Box
                sx={{
                    p: { xs: 1, sm: 1.5 },

                    bgcolor: 'background.paper',

                    borderTop: '1px solid',

                    borderColor: 'divider',

                    backdropFilter: 'blur(8px)',
                }}
            >
                <input
                    type='file'
                    hidden
                    aria-label={t('messages.attachFile') || 'Attach a file'}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept='image/*,.pdf,.doc,.docx'
                />

                <Box
                    sx={{
                        display: 'flex',

                        alignItems: 'flex-end',

                        gap: 1,

                        p: 0.75,

                        borderRadius: 3,

                        bgcolor: 'action.hover',

                        border: '1px solid',

                        borderColor: 'divider',

                        transition: 'border-color 0.2s, box-shadow 0.2s',

                        '&:focus-within': {
                            borderColor: 'primary.main',

                            boxShadow: (theme) =>
                                `0 0 0 3px ${theme.palette.primary.main}20`,
                        },
                    }}
                >
                    {/* ATTACH */}

                    <Tooltip
                        title={
                            t('messages.attachmentHint') ||
                            'Attachments: images, PDF, or Word documents'
                        }
                        arrow
                    >
                        <IconButton
                            color='primary'
                            size='small'
                            aria-label={
                                t('messages.attachFile') || 'Attach a file'
                            }
                            onClick={() => fileInputRef.current?.click()}
                            sx={{ alignSelf: 'flex-end', mb: 0.25 }}
                        >
                            <AttachFileIcon fontSize='small' />
                        </IconButton>
                    </Tooltip>

                    {/* INPUT */}

                    <TextField
                        fullWidth
                        size='small'
                        multiline
                        maxRows={4}
                        value={input}
                        onChange={handleInputChange}
                        title={t('messages.typeMessage')}
                        aria-label={t('messages.typeMessage')}
                        placeholder={t('messages.typeMessage')}
                        variant='standard'
                        InputProps={{
                            disableUnderline: true,

                            sx: { px: 0.5, py: 0.25 },

                            'aria-label': t(
                                'messages.typeMessage',
                                'اكتب رسالة',
                            ),

                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        color='primary'
                                        size='small'
                                        aria-label={t(
                                            'messages.send',
                                            'اكتب رسالة',
                                        )}
                                        onClick={() =>
                                            sendMessage(
                                                input,
                                                currentUser,
                                                otherUser,
                                                setInput,
                                                chatContainerRef,
                                                addMessageForUser,
                                                setMessagesForUser,
                                            )
                                        }
                                        disabled={!input.trim()}
                                        sx={{
                                            bgcolor: 'primary.main',

                                            color: 'primary.contrastText',

                                            width: 34,

                                            height: 34,

                                            ml: 0.5,

                                            transition:
                                                'transform 0.15s, opacity 0.15s, background-color 0.15s',

                                            '&:hover': {
                                                bgcolor: 'primary.dark',
                                            },

                                            '&.Mui-disabled': {
                                                bgcolor:
                                                    'action.disabledBackground',

                                                color: 'action.disabled',
                                            },

                                            '&:active': {
                                                transform: 'scale(0.92)',
                                            },
                                        }}
                                    >
                                        <SendIcon
                                            aria-hidden={true}
                                            sx={{
                                                fontSize: 18,

                                                transform:
                                                    dir === 'rtl'
                                                        ? 'rotate(180deg)'
                                                        : 'none',
                                            }}
                                        />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Box>

            <Suspense fallback={<Loader />}>
                <AlertDialogs
                    onConfirm={() => handleConfirmDeleteMessage()}
                    onHide={() => {
                        if (deletingMessageId) {
                            return;
                        }

                        setMessageToDelete(null);
                        setShowDeleteMessageModal(false);
                    }}
                    show={showDeleteMessageModal}
                    title={t('messages.delete') || 'Delete message'}
                    description={t('messages.deleteConfirm')}
                    confirmText={
                        t('modals.report.actions.delete_message') || 'Yes'
                    }
                    cancelText={t('common.cancel') || 'Cancel'}
                    successText={
                        t('messages.deleteSuccess') ||
                        'Message deleted successfully'
                    }
                    errorText={
                        t('messages.deleteFailed') || 'Failed to delete message'
                    }
                />
            </Suspense>
        </Box>
    );
};

export default ChatBox;
