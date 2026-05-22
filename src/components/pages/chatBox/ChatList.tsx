import { useEffect, useState, FunctionComponent, useMemo } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    List,
    Divider,
    TextField,
    InputAdornment,
    CircularProgress,
    Tab,
    Tabs,
    ListItemButton,
    Avatar,
    Badge,
    alpha,
    useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion, AnimatePresence } from 'framer-motion';
import { UserMessage } from '../../../interfaces/chat/usersMessages';
import { useChat } from '../../../hooks/useChat';
import { useTranslation } from 'react-i18next';

const api = import.meta.env.VITE_API_URL;

interface ChatListProps {
    currentUser: {
        _id: string;
        name: { first: string; last: string };
        email: string;
        role: string;
    };
    token: string;
    onSelectChat: (user: UserMessage) => void;
    selectedUserId?: string;
}

interface Conversation {
    user: UserMessage;
    lastMessage: { message: string; createdAt: string };
}

const ChatList: FunctionComponent<ChatListProps> = ({
    currentUser,
    token,
    onSelectChat,
    selectedUserId,
}) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const { unreadCounts } = useChat();
    const { t } = useTranslation();
    const theme = useTheme();
    const getUserName = (user: UserMessage) => {
        if (typeof user.name === 'string') return user.name;
        const first = user.name?.first || '';
        const last = user.name?.last || '';
        return `${first} ${last}`.trim() || 'User';
    };

    useEffect(() => {
        const loadConversations = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${api}/messages/conversations`, {
                    headers: { Authorization: token },
                });
                setConversations(res.data.conversations || []);
            } catch (err) {
                console.error('Failed to load conversations:', err);
            } finally {
                setLoading(false);
            }
        };
        if (currentUser._id) loadConversations();
    }, [currentUser, token]);

    const filteredConversations = useMemo(() => {
        return conversations
            .filter((conv) => {
                const nameStr = getUserName(conv.user);
                const searchMatch = nameStr
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                const unreadCount = unreadCounts[conv.user._id as string] || 0;
                const unreadMatch =
                    filter === 'all' ||
                    (filter === 'unread' && unreadCount > 0);
                return searchMatch && unreadMatch;
            })
            .sort(
                (a, b) =>
                    new Date(b.lastMessage.createdAt).getTime() -
                    new Date(a.lastMessage.createdAt).getTime(),
            );
    }, [conversations, searchTerm, filter, unreadCounts]);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        }
        return date.toLocaleDateString([], {
            day: '2-digit',
            month: '2-digit',
        });
    };

    const ConversationItem = ({
        conv,
        isSelected,
    }: {
        conv: Conversation;
        isSelected: boolean;
    }) => {
        const unreadCount = unreadCounts[conv.user._id as string] || 0;
        const userName = getUserName(conv.user);
        const initials = userName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();

        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <ListItemButton
                    selected={isSelected}
                    onClick={() => onSelectChat(conv.user)}
                    sx={{
                        py: 2,
                        px: 2.5,
                        gap: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            transform: 'translateX(4px)',
                        },
                        '&.Mui-selected': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            borderLeft: `3px solid ${theme.palette.primary.main}`,
                            '&:hover': {
                                bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.15,
                                ),
                            },
                        },
                    }}
                >
                    <Badge
                        color='primary'
                        badgeContent={unreadCount}
                        invisible={unreadCount === 0}
                        overlap='circular'
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 52,
                                height: 52,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                            }}
                        >
                            {initials || userName.charAt(0).toUpperCase()}
                        </Avatar>
                    </Badge>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                mb: 0.5,
                            }}
                        >
                            <Typography
                                variant='subtitle1'
                                sx={{
                                    fontWeight: unreadCount > 0 ? 700 : 600,
                                    fontSize: '0.95rem',
                                    color: isSelected
                                        ? 'primary.main'
                                        : 'text.primary',
                                }}
                            >
                                {userName}
                            </Typography>
                            <Typography
                                variant='caption'
                                sx={{
                                    color: 'text.disabled',
                                    fontSize: '0.7rem',
                                }}
                            >
                                {formatTime(conv.lastMessage.createdAt)}
                            </Typography>
                        </Box>

                        <Typography
                            variant='body2'
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: unreadCount > 0 ? 500 : 400,
                                color:
                                    unreadCount > 0
                                        ? 'text.primary'
                                        : 'text.secondary',
                                fontSize: '0.8rem',
                            }}
                        >
                            {conv.lastMessage.message.length > 50
                                ? conv.lastMessage.message.substring(0, 50) +
                                  '...'
                                : conv.lastMessage.message}
                        </Typography>
                    </Box>
                </ListItemButton>
                <Divider sx={{ ml: 9, opacity: 0.5 }} />
            </motion.div>
        );
    };

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
            }}
        >
            {/* Header */}
            <Box sx={{ p: 2.5, pb: 1 }}>
                <Typography
                    variant='h5'
                    sx={{
                        fontWeight: 800,
                        mb: 0.5,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    {t('messages.title') || 'Messages'}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    {t('messages.subtitle') || 'Your conversations'}
                </Typography>
            </Box>

            {/* Search Bar */}
            <Box sx={{ px: 2.5, pb: 1 }}>
                <TextField
                    fullWidth
                    size='small'
                    placeholder={t('messages.search') || 'Search chats...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon
                                    fontSize='small'
                                    sx={{ color: 'text.secondary' }}
                                />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '28px',
                            bgcolor: alpha(theme.palette.action.hover, 0.5),
                        },
                    }}
                />
            </Box>

            {/* Filter Tabs */}
            <Box sx={{ px: 2.5, pb: 1 }}>
                <Tabs
                    value={filter}
                    onChange={(_, val) => setFilter(val)}
                    variant='fullWidth'
                    sx={{
                        minHeight: 40,
                        '& .MuiTab-root': {
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            minHeight: 36,
                            textTransform: 'none',
                        },
                        '& .Mui-selected': {
                            color: theme.palette.primary.main,
                        },
                        '& .MuiTabs-indicator': {
                            bgcolor: theme.palette.primary.main,
                            height: 3,
                        },
                    }}
                >
                    <Tab label={t('messages.all') || 'All'} value='all' />
                    <Tab
                        label={t('messages.unread') || 'Unread'}
                        value='unread'
                    />
                </Tabs>
            </Box>

            {/* Conversation List */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1 }}>
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '200px',
                        }}
                    >
                        <CircularProgress size={32} thickness={4} />
                    </Box>
                ) : filteredConversations.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6, px: 3 }}>
                        <Box sx={{ fontSize: 48, mb: 2 }}>💬</Box>
                        <Typography
                            variant='body1'
                            sx={{ fontWeight: 500, mb: 0.5 }}
                        >
                            {searchTerm
                                ? 'No results found'
                                : 'No conversations yet'}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {searchTerm
                                ? 'Try a different search term'
                                : 'Start a conversation with someone'}
                        </Typography>
                    </Box>
                ) : (
                    <AnimatePresence>
                        <List sx={{ p: 0 }}>
                            {filteredConversations.map((conv) => (
                                <ConversationItem
                                    key={conv.user._id}
                                    conv={conv}
                                    isSelected={
                                        selectedUserId === conv.user._id
                                    }
                                />
                            ))}
                        </List>
                    </AnimatePresence>
                )}
            </Box>
        </Box>
    );
};

export default ChatList;
