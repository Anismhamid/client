import { Paper, Avatar, Box, Typography } from '@mui/material';
import { BaseUser } from '../../../interfaces/chat/chatUser';

interface Props {
    user: BaseUser;
    onOpen: () => void;
}

const MiniChat = ({ user, onOpen }: Props) => {
    const { name, image } = user;
    return (
        <Paper
            onClick={onOpen}
            elevation={8}
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: 320,
                height: 70,
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                cursor: 'pointer',
                borderRadius: 3,
            }}
        >
            <Avatar src={image?.url} alt={name?.first}>
                {name?.first?.[0]}
            </Avatar>

            <Box ml={2}>
                <Typography fontWeight={600}>
                    {name?.first} {name?.last}
                </Typography>

                <Typography variant='caption'>فتح المحادثة</Typography>
            </Box>
        </Paper>
    );
};

export default MiniChat;
