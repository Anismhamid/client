import { Box, Paper, IconButton, Typography, Avatar } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useChatWindow } from '../../../context/ChatWindowContext';
import { useUser } from '../../../context/useUSer';
import ChatBox from './ChatBox';
import { mapUserMessageToChatBox } from './MessagesPage';

const FloatingChats = () => {
    const { chats, minimizeChat, closeChat, openChat } = useChatWindow();

    const { auth } = useUser();
    const token = localStorage.getItem('token') ?? '';
    if (!auth) return null;

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

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 20,
                left: 20,
                display: 'flex',
                gap: 1,
                zIndex: 2000,
            }}
        >
            {chats.map((chat) =>
                chat.minimized ? (
                    <Paper
                        key={chat.user._id}
                        onClick={() => openChat(chat.user)}
                        sx={{
                            width: 220,
                            height: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 2,
                            cursor: 'pointer',
                            borderRadius: 1,
                        }}
                    >
                        <Avatar src={chat.user.image?.url} sx={{ mr: 1 }} />

                        <Typography>{chat.user.name?.first}</Typography>
                    </Paper>
                ) : (
                    <Paper
                        key={chat.user._id}
                        sx={{
                            width: 360,
                            height: 500,
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                height: 55,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                px: 2,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <Box display='flex' alignItems='center' gap={1}>
                                <Avatar src={chat.user.image?.url} />

                                <Typography>{chat.user.name?.first}</Typography>
                            </Box>

                            <Box>
                                <IconButton
                                    onClick={() =>
                                        minimizeChat(chat.user._id as string)
                                    }
                                >
                                    <ExpandMoreIcon />
                                </IconButton>

                                <IconButton
                                    onClick={() =>
                                        closeChat(chat.user._id as string)
                                    }
                                >
                                    <CloseIcon />
                                </IconButton>
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
                            />
                        </Box>
                    </Paper>
                ),
            )}
        </Box>
    );
};

export default FloatingChats;
