import { useCallback, useEffect, useState } from 'react';
import {
    Grid,
    Box,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
    IconButton,
    Avatar,
    alpha,
    Container,
    Tooltip,
    Button,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ForumTwoToneIcon from '@mui/icons-material/ForumTwoTone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion, AnimatePresence } from 'framer-motion';
import ChatList from './ChatList';
import { UserMessage } from '../../../interfaces/chat/usersMessages';
import handleRTL from '../../../locales/handleRTL';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import { path } from '../../../routes/routes';
import { ChatMessage } from '../../../interfaces/chat/chatMessage';
// import ChatBox from './ChatBox';
import { useUser } from '../../../context/useUSer';
import socket from '../../../socket/globalSocket';
import ChatModal from './ChatModal';
import ChatBox from './ChatBox';
// import socket from '../../../socket/globalSocket';

// Fixed mapping function with proper type conversion
// eslint-disable-next-line react-refresh/only-export-components
export const mapUserMessageToChatBox = (msg: UserMessage): ChatMessage => {
    const convertToDate = (dateValue: unknown): Date => {
        if (!dateValue || typeof dateValue === 'function') return new Date();
        if (dateValue instanceof Date) return dateValue;
        return new Date(dateValue as string);
    };

    return {
        _id: msg._id,
        slug: msg.slug,
        from: {
            _id: msg.from?._id ?? 'unknown',
            name: {
                first: msg.name?.first ?? 'Unknown',
                last: msg.name?.last ?? '',
            },
            email: msg.email ?? '',
            role: msg.role ?? 'Client',
            status: msg.from?.status || false,
        },
        to: {
            _id: msg.to?._id ?? 'unknown',
            name: {
                first: msg.to?.first ?? 'Unknown',
                last: msg.to?.last ?? '',
            },
            email: msg.to?.email ?? '',
            role: msg.to?.role ?? 'Client',
            status: msg.to?.status || false,
        },
        message: msg.message,
        status:
            (msg.messageStatus as 'sent' | 'delivered' | 'seen' | 'pending') ??
            'sent',
        createdAt: convertToDate(msg.createdAt),
        updatedAt: convertToDate(msg.updatedAt),
        warning: msg.warning ?? false,
        isImportant: msg.isImportant ?? false,
        replyTo: msg.replyTo
            ? mapUserMessageToChatBox(msg.replyTo as unknown as UserMessage)
            : null,
        tempId: msg._id,
    } as ChatMessage;
};

const MessagesPage = () => {
    const [selectedUser, setSelectedUser] = useState<UserMessage | null>(null);
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { auth } = useUser();
    const dir = handleRTL();
    const token = localStorage.getItem('token') ?? '';
    // const isOnline = selectedUser?.from?.status === true;
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        const handleStatusChanged = ({
            userId,
            status,
        }: {
            userId: string;
            status: boolean;
        }) => {
            setSelectedUser((prev) => {
                if (!prev || prev._id !== userId) return prev;
                return { ...prev, status };
            });
        };

        socket.on('user:statusChanged', handleStatusChanged);

        return () => {
            socket.off('user:statusChanged', handleStatusChanged);
        };
    }, []);

    const handleSelectChat = useCallback((user: UserMessage) => {
        setSelectedUser(user);
    }, []);

    if (!auth?._id) return <Navigate to={path.Login} replace />;

    const currentUser = {
        _id: auth._id as string,
        name: { first: auth.name.first, last: auth.name.last },
        email: auth.email as string,
        role: auth.role as string,
        status: auth.status as boolean,
    };

    return (
        <Box
            dir={dir}
            sx={{
                height: '90vh',
                width: '100%',
                overflow: 'hidden',
                bgcolor: 'background.default',
            }}
        >
            <Container
                maxWidth={false}
                disableGutters
                sx={{
                    height: '100%',
                    py: { xs: 0, md: 2 },
                    px: { xs: 0, md: 2 },
                }}
            >
                <Paper
                    elevation={isMobile ? 0 : 2}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        borderRadius: isMobile ? 0 : 3,
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Grid container sx={{ height: '100%', width: '100%' }}>
                        {/* Sidebar - Chat List */}
                        <AnimatePresence mode='wait'>
                            {(!isMobile || !selectedUser) && (
                                <Grid
                                    key='chat-list'
                                    size={{
                                        xs: 12,
                                        sm: 12,
                                        md: 4,
                                        lg: 3.5,
                                    }}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRight: {
                                            xs: 0,
                                            md: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                                        },
                                        bgcolor: 'background.paper',
                                        position: 'relative',
                                    }}
                                >
                                    <ChatList
                                        currentUser={currentUser}
                                        token={token}
                                        onSelectChat={handleSelectChat}
                                        selectedUserId={selectedUser?._id}
                                    />
                                </Grid>
                            )}
                        </AnimatePresence>

                        {/* Main Chat Area */}
                        <Grid
                            size={{
                                xs: 12,
                                sm: 12,
                                md: 8,
                                lg: 8.5,
                            }}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                bgcolor: alpha(
                                    theme.palette.background.default,
                                    0.4,
                                ),
                                position: 'relative',
                            }}
                        >
                            {selectedUser ? (
                                <AnimatePresence mode='wait'>
                                    <motion.div
                                        key='chat-active'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        style={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {/* Chat Header */}
                                        <Box
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                bgcolor: 'background.paper',
                                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                }}
                                            >
                                                {isMobile && (
                                                    <IconButton
                                                        onClick={() =>
                                                            setSelectedUser(
                                                                null,
                                                            )
                                                        }
                                                        size='small'
                                                    >
                                                        <ArrowBackIosNewIcon />
                                                    </IconButton>
                                                )}
                                                <Link
                                                    to={
                                                        selectedUser.slug
                                                            ? path.CustomerProfile.replace(
                                                                  ':slug',
                                                                  selectedUser.slug,
                                                              )
                                                            : '#'
                                                    }
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 44,
                                                            height: 44,
                                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                                                        }}
                                                    >
                                                        {
                                                            selectedUser.name
                                                                ?.first?.[0]
                                                        }
                                                        {
                                                            selectedUser.name
                                                                ?.last?.[0]
                                                        }
                                                    </Avatar>
                                                </Link>
                                                <Box>
                                                    <Typography
                                                        variant='subtitle1'
                                                        sx={{
                                                            fontWeight: 600,
                                                            lineHeight: 1.2,
                                                        }}
                                                    >
                                                        {
                                                            selectedUser.name
                                                                ?.first
                                                        }{' '}
                                                        {
                                                            selectedUser.name
                                                                ?.last
                                                        }
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: 0.5,
                                                            mt: 0.25,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius:
                                                                    '50%',
                                                                bgcolor:
                                                                    selectedUser?.status
                                                                        ? 'success.main'
                                                                        : 'error.main',
                                                            }}
                                                        />
                                                        <Typography
                                                            variant='caption'
                                                            sx={{
                                                                color: selectedUser?.status
                                                                    ? 'success.main'
                                                                    : 'error.main',
                                                            }}
                                                        >
                                                            {selectedUser?.status
                                                                ? t('online')
                                                                : t('offline')}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Tooltip title='More options'>
                                                <IconButton size='small'>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Button
                                            onClick={() => setChatOpen(true)}
                                        >
                                            Open Chat
                                        </Button>

                                        <ChatModal
                                            open={chatOpen}
                                            onClose={() => setChatOpen(false)}
                                            currentUser={{
                                                _id: auth._id,
                                                name: auth.name,
                                                email: auth.email,
                                                role: auth.role,
                                                // status: auth.status,
                                            }}
                                            otherUser={selectedUser}
                                            token={token}
                                        />
                                        {/* Chat Messages */}
                                        <Box
                                            sx={{ flex: 1, overflow: 'hidden' }}
                                        >
                                            <ChatBox
                                                currentUser={currentUser}
                                                otherUser={{
                                                    ...mapUserMessageToChatBox(
                                                        selectedUser,
                                                    ),
                                                    status: selectedUser?.status as boolean,
                                                }}
                                                token={
                                                    localStorage.getItem(
                                                        'token',
                                                    ) as string
                                                }
                                            />
                                        </Box>
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            maxWidth: 320,
                                            px: 3,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                mx: 'auto',
                                                mb: 2,
                                                borderRadius: '50%',
                                                bgcolor: alpha(
                                                    theme.palette.primary.main,
                                                    0.08,
                                                ),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <ForumTwoToneIcon
                                                sx={{
                                                    fontSize: 40,
                                                    color: theme.palette.primary
                                                        .main,
                                                    opacity: 0.6,
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            variant='h6'
                                            sx={{ fontWeight: 600, mb: 1 }}
                                        >
                                            {t('messages.welcome') ||
                                                'مرحباً بك في الرسائل'}
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {t('messages.chooseChat') ||
                                                'اختر محادثة من القائمة للبدء'}
                                        </Typography>
                                    </Box>
                                </motion.div>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default MessagesPage;
