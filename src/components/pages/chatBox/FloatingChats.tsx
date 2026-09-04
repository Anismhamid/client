import { createPortal } from 'react-dom';
import {
    Box,
    Paper,
    IconButton,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Tooltip,
    alpha,
    useTheme,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';

import { useChatWindow } from '../../../context/ChatWindowContext';
import { useUser } from '../../../hooks/useUSer';
import ChatBox from './ChatBox';
import { mapUserMessageToChatBox } from './MessagesPage';
import MiniChat from './MiniChat';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BlockButton from '../../reports/BlockButton';
import ReportModal from '../../reports/ReportModal';

const FloatingChats = () => {
    const { chats, minimizeChat, closeChat, clearChats, openChat } =
        useChatWindow();
    const [optionsAnchor, setOptionsAnchor] = useState<null | HTMLElement>(
        null,
    );
    const [optionsUserId, setOptionsUserId] = useState<string | null>(null);
    const [reportOpen, setReportOpen] = useState(false);

    const { auth } = useUser();
    const { t } = useTranslation();
    const theme = useTheme();
    const token = localStorage.getItem('token') ?? '';

    useEffect(() => {
        if (!auth || !token) {
            clearChats?.();
        }
    }, [auth, token, clearChats]);

    if (!auth || !token) return null;

    const currentUser = {
        _id: auth._id,
        name: {
            first: auth.name.first,
            last: auth.name.last,
        },
        email: auth.email,
        role: auth.role,
        status: Boolean(auth.status),
    };

    return createPortal(
        <Box
            sx={{
                position: 'fixed',
                bottom: { xs: 0, sm: 15 },
                left: { xs: 0, sm: 20 },
                right: { xs: 0, sm: 'auto' },

                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                alignItems: 'flex-end',
                justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                gap: 2,
                p: { xs: 1, sm: 0 },
                pointerEvents: 'none', // Prevents blocking clicks behind
                '& > *': {
                    pointerEvents: 'auto', // Re-enable clicks on children
                },
            }}
        >
            {chats.map((chat) => (
                <Box key={chat.user._id}>
                    {chat.minimized ? (
                        <MiniChat
                            user={chat.user}
                            onOpen={() => openChat(chat.user)}
                        />
                    ) : (
                        <Paper
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 1,
                                overflow: 'hidden',
                                // maxWidth: 360,
                                width: { xs: '100vw', sm: 380 },
                                height: { xs: '100dvh', sm: 520 },
                                position: { xs: 'fixed', sm: 'relative' },
                                top: { xs: 0, sm: 'auto' },
                                left: { xs: 0, sm: 'auto' },
                            }}
                        >
                            <Box
                                sx={{
                                    height: 60,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    px: 1.5,
                                    bgcolor: 'background.paper',
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    flexShrink: 0,
                                    boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.04)}`,
                                }}
                            >
                                <Tooltip
                                    title={t('messages.options') || 'Options'}
                                >
                                    <IconButton
                                        aria-label={
                                            t('messages.options') ||
                                            'Conversation options'
                                        }
                                        size='small'
                                        onClick={(event) => {
                                            setOptionsAnchor(
                                                event.currentTarget,
                                            );
                                            setOptionsUserId(
                                                chat.user._id as string,
                                            );
                                        }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Tooltip>
                                <Box display='flex' alignItems='center' gap={1}>
                                    <Avatar
                                        src={chat.user.image?.url}
                                        alt={chat.user.name?.first}
                                        sx={{ width: 36, height: 36 }}
                                    />
                                    <Typography fontWeight={700} noWrap>
                                        {chat.user.name?.first}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Tooltip
                                        title={
                                            t('messages.minimize') || 'Minimize'
                                        }
                                    >
                                        <IconButton
                                            aria-label={
                                                t('messages.minimize') ||
                                                'Minimize chat'
                                            }
                                            size='small'
                                            onClick={() =>
                                                minimizeChat(
                                                    chat.user._id as string,
                                                )
                                            }
                                        >
                                            <ExpandMoreIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip
                                        title={t('common.close') || 'Close'}
                                    >
                                        <IconButton
                                            aria-label={
                                                t('common.close') ||
                                                'Close chat'
                                            }
                                            size='small'
                                            onClick={() =>
                                                closeChat(
                                                    chat.user._id as string,
                                                )
                                            }
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    flex: 1,
                                    overflow: 'hidden',
                                }}
                            >
                                <ChatBox
                                    currentUser={currentUser}
                                    otherUser={{
                                        ...mapUserMessageToChatBox(chat.user),
                                        status: Boolean(chat.user.status),
                                    }}
                                    token={token}
                                    initialMessage={chat.initialMessage}
                                />
                            </Box>
                        </Paper>
                    )}
                </Box>
            ))}
            <Menu
                anchorEl={optionsAnchor}
                open={Boolean(optionsAnchor)}
                onClose={() => {
                    setOptionsAnchor(null);
                    setOptionsUserId(null);
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    root: {
                        sx: { zIndex: 5000 },
                    },
                    paper: {
                        sx: {
                            mt: 0.75,
                            minWidth: 210,
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                            boxShadow: theme.shadows[8],
                            overflow: 'hidden',
                        },
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        setOptionsAnchor(null);
                        setReportOpen(true);
                    }}
                    sx={{ py: 1.25 }}
                >
                    <ListItemIcon sx={{ color: 'error.main' }}>
                        <FlagOutlinedIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText
                        primary={t('modals.report.reportThis') || 'Report user'}
                        secondary={
                            t('messages.reportHint') ||
                            'Report inappropriate behavior'
                        }
                        slotProps={{
                            secondary: { sx: { fontSize: '0.72rem' } },
                        }}
                    />
                </MenuItem>
                <Divider />
                {optionsUserId && (
                    <MenuItem
                        disableRipple
                        sx={{
                            py: 0.75,
                            px: 1,
                        }}
                    >
                        <BlockButton
                            userId={optionsUserId}
                            variant='text'
                            onChange={(isBlocked) => {
                                if (!isBlocked) return;

                                const blockedUserId = optionsUserId;

                                setOptionsAnchor(null);
                                setOptionsUserId(null);
                                setReportOpen(false);

                                closeChat(blockedUserId);
                            }}
                        />
                    </MenuItem>
                )}
            </Menu>
            {optionsUserId && (
                <ReportModal
                    open={reportOpen}
                    onClose={() => {
                        setReportOpen(false);
                        setOptionsUserId(null);
                    }}
                    targetId={optionsUserId}
                    type='user'
                />
            )}
        </Box>,
        document.body,
    );
};

export default FloatingChats;
