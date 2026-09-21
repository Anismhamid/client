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
                slotProps={{
                    root: {
                        sx: {
                            zIndex: 999999,
                        },
                    },

                    paper: {
                        sx: {
                            minWidth: 160,

                            borderRadius: 2,

                            boxShadow: 6,

                            overflow: 'hidden',

                            zIndex: 999999,
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

                    p: 2,

                    pb: 15,

                    display: 'flex',

                    flexDirection: 'column',

                    gap: 1.5,

                    overflowAnchor: 'auto',

                    overscrollBehaviorY: 'contain',
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

                                    maxWidth: '85%',
                                }}
                            >
                                <Paper
                                    elevation={isMe ? 0 : 1}
                                    sx={{
                                        p: '10px 14px',

                                        minWidth: '80px',

                                        maxWidth: '100%',

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

                                                top: -10,

                                                right: -10,

                                                width: 30,

                                                height: 30,

                                                bgcolor: 'background.paper',

                                                boxShadow: 2,

                                                zIndex: 100,

                                                opacity: {
                                                    xs: 1,
                                                    sm: 1,
                                                },

                                                transition:
                                                    'opacity 0.15s ease',

                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                },

                                                '& .MuiSvgIcon-root': {
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
                                                                '_blank',
                                                                'noopener,noreferrer',
                                                            )
                                                        }
                                                    >
                                                        {t('messages.viewFile')}
                                                    </Typography>
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
                                                        display: 'block',

                                                        mt: 0.25,

                                                        opacity: 0.65,

                                                        fontSize: '0.68rem',
                                                    }}
                                                >
                                                    {t('messages.edited') ||
                                                        'edited'}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    {/* ================================= */}
                                    {/* STATUS */}
                                    {/* ================================= */}

                                    {!isEditingThis && (
                                        <Box
                                            sx={{
                                                display: 'flex',

                                                alignItems: 'flex-end',

                                                justifyContent: 'flex-end',

                                                gap: 0.5,

                                                mt: 0.3,
                                            }}
                                        >
                                            {isMe && getStatusIcon(msg.status)}
                                        </Box>
                                    )}
                                </Paper>

                                {/* ================================= */}
                                {/* TIME */}
                                {/* ================================= */}

                                <Typography
                                    variant='caption'
                                    sx={{
                                        color: 'text.secondary',

                                        display: 'block',

                                        textAlign: isMe ? 'left' : 'right',

                                        mt: 0.25,
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

                {/* ============================================= */}
                {/* TYPING */}
                {/* ============================================= */}

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

            {/* ================================================= */}
            {/* INPUT */}
            {/* ================================================= */}

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
                    aria-label={t('messages.attachFile') || 'Attach a file'}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept='image/*,.pdf,.doc,.docx'
                />

                <Box
                    sx={{
                        display: 'flex',

                        alignItems: 'center',

                        gap: 1,
                    }}
                >
                    {/* ATTACH */}

                    <IconButton
                        color='primary'
                        aria-label={t('messages.attachFile') || 'Attach a file'}
                        title={
                            t('messages.attachFile') ||
                            'Attach an image, PDF, or Word document'
                        }
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <AttachFileIcon />
                    </IconButton>

                    {/* INPUT */}

                    <TextField
                        fullWidth
                        size='small'
                        multiline
                        maxRows={4}
                        value={input}
                        onChange={handleInputChange}
                        placeholder={t('messages.typeMessage')}
                        helperText={
                            t('messages.attachmentHint') ||
                            'Attachments: images, PDF, or Word documents'
                        }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        color='primary'
                                        aria-label={
                                            t('messages.send') || 'Send message'
                                        }
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
            <Suspense fallback={<Loader/>}>
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
