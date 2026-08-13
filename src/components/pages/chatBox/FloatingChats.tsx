import { createPortal } from 'react-dom';
import { Box, Paper, IconButton, Typography, Avatar } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useChatWindow } from '../../../context/ChatWindowContext';
import { useUser } from '../../../hooks/useUSer';
import ChatBox from './ChatBox';
import { mapUserMessageToChatBox } from './MessagesPage';
import MiniChat from './MiniChat';
import { useEffect } from 'react';

const FloatingChats = () => {
    const { chats, minimizeChat, closeChat,clearChats, openChat } = useChatWindow();

    const { auth } = useUser();
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
                zIndex: 2000,
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
                                width: { xs: '100vw', sm: 360 },
                                height: { xs: '100vh', sm: 500 },
                                position: { xs: 'fixed', sm: 'relative' },
                                top: { xs: 0, sm: 'auto' },
                                left: { xs: 0, sm: 'auto' },
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
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    flexShrink: 0,
                                }}
                            >
                                <Box display='flex' alignItems='center' gap={1}>
                                    <Avatar src={chat.user.image?.url} />
                                    <Typography>
                                        {chat.user.name?.first}
                                    </Typography>
                                </Box>

                                <Box>
                                    <IconButton
                                        onClick={() =>
                                            minimizeChat(
                                                chat.user._id as string,
                                            )
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
                                    initialMessage={chat.initialMessage}
                                />
                            </Box>
                        </Paper>
                    )}
                </Box>
            ))}
        </Box>,
        document.body,
    );
};

export default FloatingChats;
