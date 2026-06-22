/* eslint-disable react-hooks/exhaustive-deps */
import {
    useEffect,
    useState,
    useRef,
    FunctionComponent,
    useLayoutEffect,
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
    Modal,
    Backdrop,
    Slide,
    AppBar,
    Toolbar,
    Avatar,
    Badge,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    // formatMessageTime,
    getStatusIcon,
    scrollToBottom,
    sendMessage,
} from './helpers/functions';
import { Navigate } from 'react-router-dom';
import { path } from '../../../routes/routes';

const api = import.meta.env.VITE_API_URL;

interface ChatModalProps {
    open: boolean;
    onClose: () => void;
    currentUser: BaseUser;
    otherUser: BaseUser;
    token: string;
}

const ChatModal: FunctionComponent<ChatModalProps> = ({
    open,
    onClose,
    currentUser,
    otherUser,
    token,
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

    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTypingRef = useRef(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const userMessages = messages[otherUser?._id ?? ''] || [];
    const dir = handleRTL();
    const { t } = useTranslation();

    const lastScrollHeightRef = useRef<number>(0);
    const lastSeenRef = useRef<string | null>(null);
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    const getUserFullName = (user?: BaseUser) => {
        if (!user) return '';
        return `${user.name?.first?.toUpperCase() ?? 'user'} ${user.name?.last?.toUpperCase() ?? ''}`.trim();
    };

    const markAsSeen = () => {
        if (!otherUser?._id || !socket) return;
        socket.emit('message:seen', {
            from: otherUser._id,
            to: currentUser._id,
            roomId: [otherUser._id, currentUser._id].sort().join('_'),
        });
        setUnreadForUser(otherUser._id, 0);
    };

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
        if (isInitial) setIsLoading(true);
        else {
            setIsFetchingMore(true);
            if (chatContainerRef.current) {
                lastScrollHeightRef.current =
                    chatContainerRef.current.scrollHeight;
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
                setTimeout(() => scrollToBottom('auto', chatContainerRef), 0);
            } else {
                setMessagesForUser(otherUser._id ?? '', (prev) => [
                    ...fetchedMessages,
                    ...prev,
                ]);
            }
            setHasMore(res.data.hasMore);
        } catch (err) {
            console.error('Pagination error:', err);
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsFetchingMore(false), 100);
        }
    };

    useLayoutEffect(() => {
        const container = chatContainerRef.current;
        if (!container || userMessages.length === 0) return;

        if (isFetchingMore && lastScrollHeightRef.current > 0) {
            const heightDifference =
                container.scrollHeight - lastScrollHeightRef.current;
            container.scrollTo({
                top: heightDifference,
                behavior: 'instant',
            });
            lastScrollHeightRef.current = 0;
        }
    }, [userMessages.length]);

    // Reset state when modal opens/closes or user changes
    useEffect(() => {
        if (open && otherUser?._id) {
            loadConversation();
        }
    }, [open, otherUser._id]);

    useEffect(() => {
        if (!otherUser?._id) return;

        socket.on('message:received', (message: LocalMessage) => {
            if (message?.from?._id === otherUser?._id) {
                addMessageForUser(otherUser?._id ?? '', message);
                if (isNearBottom()) {
                    scrollToBottom('smooth', chatContainerRef);
                }
            }
        });

        socket.on('message:sent', (message: LocalMessage) => {
            if (message?.to?._id === otherUser?._id) {
                setMessagesForUser(otherUser?._id ?? '', (prev) =>
                    prev.map((m) => {
                        if (
                            m.tempId &&
                            message.tempId &&
                            m.tempId === message.tempId
                        ) {
                            return { ...message };
                        }
                        if (m._id === message._id) {
                            return { ...m, status: message.status };
                        }
                        return m;
                    }),
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
                setMessagesForUser(otherUser?._id ?? '', (prev) =>
                    prev.map((m) => {
                        if (
                            m.tempId &&
                            message.tempId &&
                            m.tempId === message.tempId
                        ) {
                            return { ...message };
                        }
                        if (m._id === message._id) {
                            return { ...m, status: message.status };
                        }
                        return m;
                    }),
                );
            }
        });

        socket.on(
            'message:seen',
            ({ from }: { from: string; }) => {
                if (from === otherUser._id) {
                    setMessagesForUser(otherUser?._id ?? '', (prev) =>
                        prev.map((m) =>
                            m?.from?._id === currentUser._id
                                ? { ...m, status: 'seen' }
                                : m,
                        ),
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
    }, [open, otherUser._id]);

    useEffect(() => {
        if (!open) return;

        if (userMessages.length > 0) {
            const lastMessage = userMessages[userMessages.length - 1];
            if (
                lastMessage?.from?._id === otherUser?._id &&
                lastMessage.status !== 'seen' &&
                isNearBottom()
            ) {
                lastSeenRef.current = lastMessage._id;

                markAsSeen();
            }
        }
    }, [token, otherUser._id, open]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('הקובץ גדול מדי. מקסימום 5MB');
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
        }
    };

    const isNearBottom = () => {
        if (!chatContainerRef.current) return false;
        const { scrollTop, scrollHeight, clientHeight } =
            chatContainerRef.current;
        return scrollHeight - scrollTop - clientHeight < 200;
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    if (!currentUser?._id) return <Navigate to={path.Login} replace />;

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 300,
                    sx: {
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                },
            }}
            sx={{
                zIndex: 1300,
            }}
        >
            <Slide direction='up' in={open} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        position: 'absolute',
                        // top: '50%',
                        // left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '100%', md: '50%', xl: '40%' },
                        height: '100%',
                        maxWidth: 1200,
                        bgcolor: 'background.paper',
                        borderRadius: { xs: 0, sm: 3 },
                        boxShadow: 24,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Modal Header */}
                    <AppBar
                        position='sticky'
                        color='default'
                        elevation={1}
                        sx={{
                            bgcolor: 'background.paper',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                edge='start'
                                onClick={onClose}
                                sx={{ mr: 2 }}
                            >
                                {window.innerWidth < 600 ? (
                                    <ArrowBackIcon />
                                ) : (
                                    <CloseIcon />
                                )}
                            </IconButton>

                            <Badge
                                overlap='circular'
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                variant='dot'
                                sx={{
                                    '& .MuiBadge-badge': {
                                        bgcolor: otherUser?.status
                                            ? 'success'
                                            : 'error',
                                        boxShadow: '0 0 0 2px white',
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        bgcolor: 'primary',
                                        mr: 2,
                                    }}
                                    src={otherUser.image?.url}
                                >
                                    {getUserFullName(otherUser).charAt(0) ||
                                        'U'}
                                </Avatar>
                            </Badge>

                            <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 600 }}
                                >
                                    {getUserFullName(otherUser)}
                                </Typography>
                                <Typography
                                    variant='caption'
                                    color={
                                        otherUser?.status
                                            ? 'success'
                                            : 'secondary'
                                    }
                                >
                                    {otherUser?.status
                                        ? t('online')
                                        : t('offline')}
                                </Typography>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    {/* Chat Messages Area */}
                    <Box
                        ref={chatContainerRef}
                        onScroll={(e) => {
                            const { scrollTop } = e.currentTarget;
                            setShowScrollBtn(!isNearBottom());

                            if (scrollTop === 0 && hasMore && !isFetchingMore) {
                                loadConversation(false);
                            }
                        }}
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            overflowAnchor: 'auto',
                            overscrollBehaviorY: 'contain',
                            bgcolor: 'background.default',
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
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: isMe
                                                ? 'flex-start'
                                                : 'flex-end',
                                        }}
                                    >
                                        <Paper
                                            elevation={isMe ? 0 : 1}
                                            sx={{
                                                p: '10px 14px',
                                                minWidth: '80px',
                                                maxWidth: {
                                                    xs: '85%',
                                                    sm: '70%',
                                                    md: '60%',
                                                },
                                                borderRadius: isMe
                                                    ? '12px 12px 12px 4px'
                                                    : '12px 12px 4px 12px',
                                                bgcolor: isMe
                                                    ? 'primary.main'
                                                    : 'background.paper',
                                                border: !isMe
                                                    ? '1px solid'
                                                    : 'none',
                                                borderColor: 'divider',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {isFile ? (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 1,
                                                    }}
                                                >
                                                    {msg.fileType?.includes(
                                                        'image',
                                                    ) ? (
                                                        <img
                                                            src={msg.fileUrl}
                                                            alt='sent file'
                                                            style={{
                                                                maxWidth:
                                                                    '100%',
                                                                maxHeight: 300,
                                                                borderRadius: 8,
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() =>
                                                                window.open(
                                                                    msg.fileUrl,
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
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
                                                                View File
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            ) : (
                                                <Typography
                                                    variant='body2'
                                                    sx={{
                                                        color: isMe
                                                            ? 'white'
                                                            : 'text.primary',
                                                        wordBreak: 'break-word',
                                                        lineHeight: 1.5,
                                                        whiteSpace: 'pre-wrap',
                                                    }}
                                                >
                                                    <Linkify
                                                        text={
                                                            msg?.message ?? ''
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
                                                    mt: 0.5,
                                                }}
                                            >
                                                {isMe &&
                                                    getStatusIcon(msg.status)}
                                                <Typography
                                                    variant='caption'
                                                    sx={{
                                                        color: isMe
                                                            ? 'rgba(255,255,255,0.7)'
                                                            : 'text.secondary',
                                                        fontSize: '0.7rem',
                                                    }}
                                                >
                                                    {/* {formatMessageTime(
                                                        msg?.createdAt
                                                            ? new Date(
                                                                  msg.createdAt,
                                                              )
                                                            : new Date(),
                                                    )} */}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Box>
                                );
                            })
                        )}

                        {typing && (
                            <Fade in={typing}>
                                <Box
                                    sx={{
                                        alignSelf: 'flex-start',
                                        bgcolor: 'action.hover',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography
                                        variant='caption'
                                        sx={{
                                            fontStyle: 'italic',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        {getUserFullName(otherUser)}{' '}
                                        {t('common.typing')}
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
                                    bottom: 80,
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

                    {/* Input Area */}
                    <Box
                        sx={{
                            p: 2,
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

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <IconButton
                                color='primary'
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <AttachFileIcon />
                            </IconButton>

                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage(
                                            input,
                                            currentUser,
                                            otherUser,
                                            setInput,
                                            chatContainerRef,
                                            addMessageForUser,
                                            token,
                                        );
                                    }
                                }}
                                placeholder={
                                    t('chat.typeMessage') || 'Type a message...'
                                }
                                size='small'
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: 'action.hover',
                                    },
                                }}
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
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Slide>
        </Modal>
    );
};

export default ChatModal;
