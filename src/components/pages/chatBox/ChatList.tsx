import { useEffect, useState, FunctionComponent, useMemo, memo } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    List,
    TextField,
    InputAdornment,
    CircularProgress,
    Tab,
    Tabs,
    ListItemButton,
    Badge,
    alpha,
    useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion, AnimatePresence } from 'framer-motion';
import { UserMessage } from '../../../interfaces/chat/usersMessages';
import { useChat } from '../../../hooks/useChat';
import { useTranslation } from 'react-i18next';
import { formatTime, getUserName } from './helpers/functions';

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

    useEffect(() => {
        const loadConversations = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${api}/messages/conversations`, {
                    headers: { Authorization: token },
                });

                const conversationsWithStatus = res.data.conversations.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (conv: any) => ({
                        ...conv,
                        user: {
                            ...conv.user,
                            slug: conv.user.slug || conv.user._id, // 🔥 مهم
                            name: {
                                first: conv.user.name?.first || '',
                                last: conv.user.name?.last || '',
                            },
                            status: conv.user.status ?? false,
                        },
                    }),
                );

                setConversations(conversationsWithStatus);
            } catch (err) {
                console.error('Failed to load conversations:', err);
            } finally {
                setLoading(false);
            }
        };
        loadConversations();
    }, [currentUser._id, token]);

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

    const ConversationItem = memo(
        ({ conv, isSelected }: { conv: Conversation; isSelected: boolean }) => {
            const unreadCount = unreadCounts[conv.user._id as string] || 0;
            const userName = getUserName(conv.user);

            return (
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                    <ListItemButton
                        selected={isSelected}
                        onClick={() => onSelectChat(conv.user)}
                        sx={{
                            py: 1.75,
                            px: 2.5,
                            gap: 1.75,
                            borderRadius: '14px',
                            mx: 1,
                            mb: 0.5,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: '50%',
                                transform: 'translateY(-50%) scaleY(0)',
                                width: 3,
                                height: '60%',
                                bgcolor: theme.palette.primary.main,
                                borderRadius: '0 3px 3px 0',
                                transition: 'transform 0.2s ease',
                            },
                            '&:hover': {
                                bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.06,
                                ),
                                '&::before': {
                                    transform: 'translateY(-50%) scaleY(0.5)',
                                },
                            },
                            '&.Mui-selected': {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&::before': {
                                    transform: 'translateY(-50%) scaleY(1)',
                                },
                                '&:hover': {
                                    bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.14,
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
                            sx={{
                                '& .MuiBadge-badge': {
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    minWidth: 18,
                                    height: 18,
                                    border: `2px solid ${theme.palette.background.paper}`,
                                },
                            }}
                        >
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    letterSpacing: '-0.5px',
                                    boxShadow: isSelected
                                        ? `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`
                                        : `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                                    transition: 'all 0.2s ease',
                                    flexShrink: 0,
                                    backgroundColor: isSelected
                                        ? theme.palette.primary.main
                                        : theme.palette.grey[400],
                                    color: theme.palette.common.white,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    backgroundImage: conv.user.image?.url
                                        ? `url(${conv.user.image.url})`
                                        : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {!conv.user.image?.url &&
                                    userName?.charAt(0).toUpperCase()}
                            </div>
                        </Badge>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    mb: 0.4,
                                    gap: 1,
                                }}
                            >
                                <Typography
                                    variant='subtitle1'
                                    noWrap
                                    sx={{
                                        fontWeight: unreadCount > 0 ? 700 : 600,
                                        fontSize: '0.9rem',
                                        lineHeight: 1.3,
                                        color: isSelected
                                            ? theme.palette.primary.main
                                            : unreadCount > 0
                                              ? theme.palette.text.primary
                                              : theme.palette.text.primary,
                                        transition: 'color 0.15s ease',
                                    }}
                                >
                                    {userName}
                                </Typography>
                                <Typography
                                    variant='caption'
                                    sx={{
                                        color:
                                            unreadCount > 0
                                                ? theme.palette.primary.main
                                                : theme.palette.text.disabled,
                                        fontSize: '0.68rem',
                                        fontWeight: unreadCount > 0 ? 600 : 400,
                                        flexShrink: 0,
                                        letterSpacing: '0.01em',
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
                                            ? theme.palette.text.secondary
                                            : alpha(
                                                  theme.palette.text.secondary,
                                                  0.7,
                                              ),
                                    fontSize: '0.78rem',
                                    lineHeight: 1.4,
                                    letterSpacing: '0.01em',
                                }}
                            >
                                {conv.lastMessage.message.length > 50
                                    ? conv.lastMessage.message.substring(
                                          0,
                                          50,
                                      ) + '...'
                                    : conv.lastMessage.message}
                            </Typography>
                        </Box>
                    </ListItemButton>
                </motion.div>
            );
        },
    );

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                borderRight: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 2.5,
                    pt: 3,
                    pb: 2,
                    background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, transparent 100%)`,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                }}
            >
                <Typography
                    variant='h5'
                    sx={{
                        fontWeight: 800,
                        mb: 0.25,
                        fontSize: '1.35rem',
                        letterSpacing: '-0.5px',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    {t('messages.main') || 'Messages'}
                </Typography>
                <Typography
                    variant='body2'
                    sx={{
                        color: alpha(theme.palette.text.secondary, 0.7),
                        fontSize: '0.78rem',
                        letterSpacing: '0.01em',
                    }}
                >
                    {t('messages.subtitle') || 'Your conversations'}
                </Typography>
            </Box>

            {/* Search Bar */}
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
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
                                    sx={{
                                        color: alpha(
                                            theme.palette.text.secondary,
                                            0.5,
                                        ),
                                        fontSize: '1.1rem',
                                    }}
                                />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '12px',
                            bgcolor: alpha(theme.palette.action.hover, 0.06),
                            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                            fontSize: '0.85rem',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: alpha(theme.palette.action.hover, 0.1),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            },
                            '&.Mui-focused': {
                                bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.04,
                                ),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.08)}`,
                            },
                            '& fieldset': { border: 'none' },
                        },
                    }}
                />
            </Box>

            {/* Filter Tabs */}
            <Box sx={{ px: 2, pb: 1.5 }}>
                <Tabs
                    value={filter}
                    onChange={(_, val) => setFilter(val)}
                    variant='fullWidth'
                    sx={{
                        minHeight: 36,
                        bgcolor: alpha(theme.palette.action.hover, 0.06),
                        borderRadius: '10px',
                        p: 0.4,
                        '& .MuiTabs-flexContainer': {
                            gap: 0.5,
                        },
                        '& .MuiTab-root': {
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            minHeight: 30,
                            textTransform: 'none',
                            borderRadius: '7px',
                            color: alpha(theme.palette.text.secondary, 0.7),
                            letterSpacing: '0.01em',
                            transition: 'all 0.18s ease',
                            '&:hover': {
                                color: theme.palette.text.primary,
                                bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.06,
                                ),
                            },
                        },
                        '& .Mui-selected': {
                            color: `${theme.palette.primary.main} !important`,
                            bgcolor: theme.palette.background.paper,
                            boxShadow: `0 1px 4px ${alpha(theme.palette.common.black, 0.1)}`,
                        },
                        '& .MuiTabs-indicator': {
                            display: 'none',
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
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 1 }}>
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '200px',
                        }}
                    >
                        <CircularProgress
                            size={28}
                            thickness={5}
                            sx={{
                                color: alpha(theme.palette.primary.main, 0.6),
                            }}
                        />
                    </Box>
                ) : filteredConversations.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 6,
                            px: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.75,
                        }}
                    >
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '16px',
                                bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.08,
                                ),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 26,
                                mb: 0.5,
                            }}
                        >
                            💬
                        </Box>
                        <Typography
                            variant='body1'
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: theme.palette.text.primary,
                            }}
                        >
                            {searchTerm
                                ? 'No results found'
                                : 'No conversations yet'}
                        </Typography>
                        <Typography
                            variant='body2'
                            sx={{
                                color: alpha(theme.palette.text.secondary, 0.7),
                                fontSize: '0.78rem',
                            }}
                        >
                            {searchTerm
                                ? 'Try a different search term'
                                : 'Start a conversation with someone'}
                        </Typography>
                    </Box>
                ) : (
                    <AnimatePresence>
                        <List sx={{ p: 0.5 }}>
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
