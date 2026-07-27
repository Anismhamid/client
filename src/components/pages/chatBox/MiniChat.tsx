import {
    Paper,
    Avatar,
    Box,
    Typography,
    keyframes,
} from '@mui/material';
import { BaseUser } from '../../../interfaces/chat/chatUser';

interface Props {
    user: BaseUser;
    onOpen: () => void;
    unreadCount?: number;
}

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
            elevation={8}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpen();
                }
            }}
            aria-label={`Open chat with ${name?.first} ${name?.last}`}
            sx={{
                animation: `${slideIn} 0.3s ease-out`,
                position: 'relative',
                left: 50,
                width: 220,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                cursor: 'pointer',
                borderRadius: 1,
                backgroundImage: 'linear-gradient(#51636e7a, #52799757)',
                backdropFilter: 'blur(10px)',
                boxShadow: 5,
                border: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 8,
                    borderColor: 'primary.main',
                },
                '&:active': {
                    transform: 'scale(0.98)',
                },
                '&:focus-visible': {
                    outline: 2,
                    outlineColor: 'primary.main',
                    outlineOffset: 2,
                },
            }}
        >
            <Box>
                <Typography fontWeight={600} noWrap>
                    {name?.first} {name?.last}
                </Typography>
            </Box>

            <Typography
                color={status ? 'success.main' : 'error.main'}
                fontWeight={100}
                variant='caption'
                noWrap
            >
                {statusLabel}
            </Typography>
            <Avatar src={image?.url}>{name?.first?.[0]}</Avatar>

            {Boolean(unreadCount) && unreadCount! > 0 && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                    }}
                >
                    {unreadCount! > 99 ? '99+' : unreadCount}
                </Box>
            )}
        </Paper>
    );
};

export default MiniChat;
