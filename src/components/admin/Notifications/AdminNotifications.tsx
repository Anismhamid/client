import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from '@mui/material';

import {
    NavLink,
    Outlet,
    useLocation,
} from 'react-router-dom';

import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';

const AdminNotifications =
    () => {
        const location =
            useLocation();

        const isSend =
            location.pathname.endsWith(
                '/send',
            );

        const isSent =
            location.pathname.endsWith(
                '/sent',
            );

        return (
            <Box
                sx={{
                    width: '100%',
                    direction: 'rtl',
                }}
            >
                <Stack spacing={3}>
                    {/* HEADER */}

                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={800}
                        >
                            الإشعارات
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            إرسال وإدارة إشعارات
                            المستخدمين
                        </Typography>
                    </Box>

                    {/* NAVIGATION */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 1,
                            border:
                                '1px solid',
                            borderColor:
                                'divider',
                            borderRadius: 3,
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                        >
                            <Button
                                component={
                                    NavLink
                                }
                                to="send"
                                variant={
                                    isSend
                                        ? 'contained'
                                        : 'text'
                                }
                                startIcon={
                                    <SendIcon />
                                }
                                sx={{
                                    borderRadius: 2,
                                }}
                            >
                                إرسال إشعار
                            </Button>

                            <Button
                                component={
                                    NavLink
                                }
                                to="sent"
                                variant={
                                    isSent
                                        ? 'contained'
                                        : 'text'
                                }
                                startIcon={
                                    <HistoryIcon />
                                }
                                sx={{
                                    borderRadius: 2,
                                }}
                            >
                                الإشعارات المرسلة
                            </Button>
                        </Stack>
                    </Paper>

                    {/* CONTENT */}

                    <Outlet />
                </Stack>
            </Box>
        );
    };

export default AdminNotifications;