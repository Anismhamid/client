import {
    Paper,
    Avatar,
    Box,
    Typography,
    keyframes,
    Badge,
} from '@mui/material';
import { BaseUser } from '../../../interfaces/chat/chatUser';
import { memo } from 'react';

interface Props {
    user: BaseUser;
    onOpen: () => void;
    unreadCount?: number;
}

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.5);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0);
  }
`;

const MiniChat = ({ user, onOpen, unreadCount }: Props) => {
    const { name, image, status } = user;
    const statusLabel = status ? 'Online' : 'Offline';

    return (
        <Paper
            onClick={onOpen}
            role='button'
            tabIndex={0}
            elevation={6}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpen();
                }
            }}
            aria-label={`Open chat with ${name?.first || 'Unknown'} ${name?.last || ''}`}
            sx={{
                animation: `${slideIn} 0.35s cubic-bezier(0.4, 0, 0.2, 1)`,
                position: 'relative',
                width: { xs: 200, sm: 240 },
                height: 56,
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1.5,

                py: 1,
                cursor: 'pointer',
                borderRadius: 2.5,
                overflow: 'visible',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                boxShadow: 3,
                transition:
                    'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',

                '&:hover': {
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: 8,
                    borderColor: 'primary.main',
                    '& .mini-chat-avatar': {
                        transform: 'scale(1.08)',
                    },
                },

                '&:active': {
                    transform: 'translateY(0) scale(0.98)',
                },

                '&:focus-visible': {
                    outline: 2,
                    outlineColor: 'primary.main',
                    outlineOffset: 2,
                },
            }}
        >
            {/* Avatar مع الحالة */}
            <Box
                sx={{
                    position: 'relative',
                    flexShrink: 0,
                }}
            >
                <Avatar
                    className='mini-chat-avatar'
                    src={image?.url}
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'primary.main',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'transform 0.2s ease',
                        border: '2px solid',
                        borderColor: 'background.paper',
                        boxShadow: 1,
                    }}
                >
                    {name?.first?.[0]}
                </Avatar>

                {/* Status dot على الـ avatar */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -1,
                        right: -1,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: status ? 'success.main' : 'error.main',
                        border: '2px solid',
                        borderColor: 'background.paper',
                        animation: status ? `${pulse} 2s infinite` : 'none',
                    }}
                />
            </Box>

            {/* الاسم + الحالة */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 0.25,
                }}
            >
                <Typography
                    fontWeight={600}
                    noWrap
                    sx={{
                        fontSize: '0.875rem',
                        lineHeight: 1.2,
                        color: 'text.primary',
                    }}
                >
                    {name?.first} {name?.last}
                </Typography>

                <Typography
                    variant='caption'
                    noWrap
                    sx={{
                        fontSize: '0.7rem',
                        lineHeight: 1.2,
                        color: status ? 'success.main' : 'text.secondary',
                        fontWeight: 500,
                    }}
                >
                    {statusLabel}
                </Typography>
            </Box>

            {/* Unread Badge */}
            {Boolean(unreadCount) && unreadCount! > 0 && (
                <Badge
                    badgeContent={unreadCount! > 99 ? '99+' : unreadCount}
                    color='error'
                    sx={{
                        flexShrink: 0,
                        '& .MuiBadge-badge': {
                            position: 'relative',
                            transform: 'none',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            height: 20,
                            minWidth: 20,
                            borderRadius: 10,
                            px: 0.75,
                            animation: `${pulse} 2s infinite`,
                        },
                    }}
                />
            )}
        </Paper>
    );
};

export default memo(MiniChat);
