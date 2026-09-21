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
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatWindow } from '../../../context/ChatWindowContext';
import { useUser } from '../../../hooks/useUSer';
import { useChat } from '../../../hooks/useChat';

import ChatBox from './ChatBox';
import MiniChat from './MiniChat';

import BlockButton from '../../reports/BlockButton';
import ReportModal from '../../reports/ReportModal';

import { showSuccess, showError } from '../../../atoms/toasts/ReactToast';

import { deleteConversation } from '../../../services/messages';
import { mapUserMessageToChatBox } from './chatUtils';

const FloatingChats = () => {
    // ======================================================
    // CHAT WINDOW
    // ======================================================

    const { chats, minimizeChat, closeChat, clearChats, openChat } =
        useChatWindow();

    // ======================================================
    // CHAT CONTEXT
    // ======================================================

    const { setMessagesForUser } = useChat();

    // ======================================================
    // MENU STATE
    // ======================================================

    const [optionsAnchor, setOptionsAnchor] = useState<null | HTMLElement>(
        null,
    );

    const [optionsUserId, setOptionsUserId] = useState<string | null>(null);

    // ======================================================
    // REPORT STATE
    // ======================================================

    const [reportOpen, setReportOpen] = useState(false);

    // ======================================================
    // DELETE STATE
    // ======================================================

    const [isDeletingConversation, setIsDeletingConversation] = useState(false);

    // ======================================================
    // AUTH / I18N / THEME
    // ======================================================

    const { auth, isAuthLoading, isLoggedIn } = useUser();

    const { t } = useTranslation();

    const theme = useTheme();

    // ======================================================
    // CLEAR CHATS WHEN LOGGED OUT
    // ======================================================

    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            clearChats();
        }
    }, [clearChats, isAuthLoading, isLoggedIn]);

    // ======================================================
    // NO AUTH
    // ======================================================

    if (isAuthLoading || !isLoggedIn || !auth?._id) {
        return null;
    }

    // ======================================================
    // CURRENT USER
    // ======================================================

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

    // ======================================================
    // CLOSE OPTIONS MENU
    // ======================================================

    const handleOptionsClose = () => {
        setOptionsAnchor(null);
    };

    // ======================================================
    // OPEN REPORT MODAL
    // ======================================================

    const handleReportClick = () => {
        if (!optionsUserId) {
            return;
        }

        setOptionsAnchor(null);

        setReportOpen(true);
    };

    // ======================================================
    // DELETE CONVERSATION
    // ======================================================

    const handleDeleteConversation = async () => {
        const userId = optionsUserId;

        if (!userId || isDeletingConversation) {
            return;
        }

        // Close menu immediately
        setOptionsAnchor(null);

        // Confirmation
        const confirmed = window.confirm(
            t('messages.deleteConversationConfirm') ||
                'Are you sure you want to delete this conversation?',
        );

        if (!confirmed) {
            setOptionsUserId(null);
            return;
        }

        setIsDeletingConversation(true);

        try {
            // ==================================================
            // DELETE FROM SERVER
            // ==================================================

            await deleteConversation(userId);

            // ==================================================
            // CLEAR LOCAL MESSAGES
            // ==================================================

            setMessagesForUser(userId, () => []);

            // ==================================================
            // CLOSE FLOATING CHAT
            // ==================================================

            closeChat(userId);

            // ==================================================
            // SUCCESS
            // ==================================================

            showSuccess(
                t('messages.conversationDeleted') || 'Conversation deleted',
            );
        } catch (error) {
            console.error('Failed to delete conversation:', error);

            showError(
                t('messages.conversationDeleteFailed') ||
                    'Failed to delete conversation',
            );
        } finally {
            setIsDeletingConversation(false);

            setOptionsUserId(null);
        }
    };

    // ======================================================
    // OPEN OPTIONS
    // ======================================================

    const handleOptionsOpen = (
        event: React.MouseEvent<HTMLElement>,
        userId: string,
    ) => {
        setOptionsAnchor(event.currentTarget);

        setOptionsUserId(userId);
    };

    // ======================================================
    // RENDER
    // ======================================================

    return createPortal(
        <Box
            sx={{
                position: 'fixed',

                bottom: {
                    xs: 0,
                    sm: 15,
                },

                left: {
                    xs: 0,
                    sm: 20,
                },

                right: {
                    xs: 0,
                    sm: 'auto',
                },

                display: 'flex',

                flexDirection: {
                    xs: 'column-reverse',
                    sm: 'row',
                },

                alignItems: 'flex-end',

                justifyContent: {
                    xs: 'flex-end',
                    sm: 'flex-start',
                },

                gap: 2,

                zIndex: 100000,

                p: {
                    xs: 1,
                    sm: 0,
                },

                pointerEvents: 'none',

                '& > *': {
                    pointerEvents: 'auto',
                },
            }}
        >
            {/* ================================================= */}
            {/* FLOATING CHATS */}
            {/* ================================================= */}

            {chats.map((chat) => {
                const userId = chat.user._id as string;

                return (
                    <Box key={userId}>
                        {/* ===================================== */}
                        {/* MINIMIZED CHAT */}
                        {/* ===================================== */}

                        {chat.minimized ? (
                            <MiniChat
                                user={chat.user}
                                onOpen={() => openChat(chat.user)}
                            />
                        ) : (
                            /* ===================================== */
                            /* FULL CHAT */
                            /* ===================================== */

                            <Paper
                                sx={{
                                    display: 'flex',

                                    flexDirection: 'column',

                                    borderRadius: 1,

                                    overflow: 'hidden',

                                    width: {
                                        xs: '100vw',
                                        sm: 380,
                                    },

                                    height: {
                                        xs: '100dvh',
                                        sm: 520,
                                    },

                                    position: {
                                        xs: 'fixed',
                                        sm: 'relative',
                                    },

                                    top: {
                                        xs: 0,
                                        sm: 'auto',
                                    },

                                    left: {
                                        xs: 0,
                                        sm: 'auto',
                                    },
                                }}
                            >
                                {/* ================================= */}
                                {/* HEADER */}
                                {/* ================================= */}

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

                                        boxShadow: `0 2px 10px ${alpha(
                                            theme.palette.common.black,
                                            0.04,
                                        )}`,
                                    }}
                                >
                                    {/* ================================= */}
                                    {/* OPTIONS BUTTON */}
                                    {/* ================================= */}

                                    <Tooltip
                                        title={
                                            t('messages.options') || 'Options'
                                        }
                                    >
                                        <IconButton
                                            aria-label={
                                                t('messages.options') ||
                                                'Conversation options'
                                            }
                                            size='small'
                                            onClick={(event) =>
                                                handleOptionsOpen(event, userId)
                                            }
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Tooltip>

                                    {/* ================================= */}
                                    {/* USER */}
                                    {/* ================================= */}

                                    <Box
                                        display='flex'
                                        alignItems='center'
                                        gap={1}
                                        sx={{
                                            minWidth: 0,
                                        }}
                                    >
                                        <Avatar
                                            src={chat.user.image?.url}
                                            alt={chat.user.name?.first}
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                flexShrink: 0,
                                            }}
                                        />

                                        <Typography fontWeight={700} noWrap>
                                            {chat.user.name?.first}
                                        </Typography>
                                    </Box>

                                    {/* ================================= */}
                                    {/* HEADER ACTIONS */}
                                    {/* ================================= */}

                                    <Box>
                                        {/* MINIMIZE */}

                                        <Tooltip
                                            title={
                                                t('messages.minimize') ||
                                                'Minimize'
                                            }
                                        >
                                            <IconButton
                                                aria-label={
                                                    t('messages.minimize') ||
                                                    'Minimize chat'
                                                }
                                                size='small'
                                                onClick={() =>
                                                    minimizeChat(userId)
                                                }
                                            >
                                                <ExpandMoreIcon />
                                            </IconButton>
                                        </Tooltip>

                                        {/* CLOSE */}

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
                                                    closeChat(userId)
                                                }
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>

                                {/* ================================= */}
                                {/* CHAT BODY */}
                                {/* ================================= */}

                                <Box
                                    sx={{
                                        flex: 1,
                                        overflow: 'hidden',
                                        minHeight: 0,
                                    }}
                                >
                                    <ChatBox
                                        currentUser={currentUser}
                                        otherUser={{
                                            ...mapUserMessageToChatBox(
                                                chat.user,
                                            ),
                                            status: Boolean(chat.user.status),
                                        }}
                                        initialMessage={chat.initialMessage}
                                    />
                                </Box>
                            </Paper>
                        )}
                    </Box>
                );
            })}

            {/* ================================================= */}
            {/* CONVERSATION OPTIONS MENU */}
            {/* ================================================= */}

            <Menu
                anchorEl={optionsAnchor}
                open={Boolean(optionsAnchor)}
                onClose={handleOptionsClose}
                transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                }}
                anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom',
                }}
                slotProps={{
                    root: {
                        sx: {
                            zIndex: 100000,
                        },
                    },

                    paper: {
                        sx: {
                            mt: 0.75,

                            minWidth: 230,

                            borderRadius: 2,

                            border: `1px solid ${alpha(
                                theme.palette.divider,
                                0.8,
                            )}`,

                            boxShadow: theme.shadows[8],

                            overflow: 'hidden',
                        },
                    },
                }}
            >
                {/* ============================================= */}
                {/* DELETE CONVERSATION */}
                {/* ============================================= */}

                {optionsUserId && (
                    <>
                        <MenuItem
                            onClick={() => void handleDeleteConversation()}
                            disabled={isDeletingConversation}
                            sx={{
                                py: 1.25,

                                color: 'error.main',

                                '&:hover': {
                                    bgcolor: alpha(
                                        theme.palette.error.main,
                                        0.06,
                                    ),
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: 'error.main',
                                }}
                            >
                                <DeleteSweepIcon fontSize='small' />
                            </ListItemIcon>

                            <ListItemText
                                primary={
                                    t('messages.deleteConversation') ||
                                    'Delete conversation'
                                }
                                secondary={
                                    t('messages.deleteConversationHint') ||
                                    'Delete all messages'
                                }
                                slotProps={{
                                    secondary: {
                                        sx: {
                                            fontSize: '0.72rem',
                                        },
                                    },
                                }}
                            />
                        </MenuItem>

                        <Divider />
                    </>
                )}

                {/* ============================================= */}
                {/* REPORT USER */}
                {/* ============================================= */}

                <MenuItem
                    onClick={handleReportClick}
                    sx={{
                        py: 1.25,

                        '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.04),
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            color: 'error.main',
                        }}
                    >
                        <FlagOutlinedIcon fontSize='small' />
                    </ListItemIcon>

                    <ListItemText
                        primary={t('modals.report.reportThis') || 'Report user'}
                        secondary={
                            t('messages.reportHint') ||
                            'Report inappropriate behavior'
                        }
                        slotProps={{
                            secondary: {
                                sx: {
                                    fontSize: '0.72rem',
                                },
                            },
                        }}
                    />
                </MenuItem>

                <Divider />

                {/* ============================================= */}
                {/* BLOCK USER */}
                {/* ============================================= */}

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
                                if (!isBlocked) {
                                    return;
                                }

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

            {/* ================================================= */}
            {/* REPORT MODAL */}
            {/* ================================================= */}

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
