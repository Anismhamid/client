import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from '@mui/material';

import HistoryIcon from '@mui/icons-material/History';

import {
    useEffect,
    useState,
} from 'react';

import {
    getSentAdminNotifications,
    SentNotification,
} from '../../../services/notificationServices';

const getUserDisplayName = (user?: SentNotification['user']) => {
    if (!user) {
        return 'مستخدم غير معروف';
    }

    if (typeof user.name === 'string') {
        return user.name;
    }

    if (
        user.name &&
        typeof user.name === 'object'
    ) {
        const name = user.name as {
            first?: string;
            last?: string;
        };

        return [name.first, name.last]
            .filter(Boolean)
            .join(' ')
            .trim() || user.email || user.name.first || 'مستخدم';
    }

    return (
        user.name ||
        user.email ||
        'مستخدم'
    );
};

const AdminSentNotifications =
    () => {
        const [
            notifications,
            setNotifications,
        ] = useState<
            SentNotification[]
        >([]);

        const [loading, setLoading] =
            useState(true);

        const [error, setError] =
            useState<string | null>(
                null,
            );

        useEffect(() => {
            let mounted = true;

            const load =
                async () => {
                    try {
                        setLoading(true);

                        const response =
                            await getSentAdminNotifications(
                                1,
                                50,
                            );

                        if (!mounted) {
                            return;
                        }

                        setNotifications(
                            response.notifications,
                        );
                    } catch {
                        if (mounted) {
                            setError(
                                'فشل تحميل الإشعارات المرسلة',
                            );
                        }
                    } finally {
                        if (mounted) {
                            setLoading(false);
                        }
                    }
                };

            load();

            return () => {
                mounted = false;
            };
        }, []);



        return (
            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2,
                        md: 4,
                    },
                    border:
                        '1px solid',
                    borderColor:
                        'divider',
                    borderRadius: 4,
                }}
            >
                <Stack spacing={3}>
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <HistoryIcon />

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={800}
                            >
                                الإشعارات المرسلة
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                سجل الإشعارات التي
                                أرسلتها الإدارة.
                            </Typography>
                        </Box>
                    </Stack>

                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    {loading ? (
                        <Box
                            sx={{
                                minHeight: 250,
                                display:
                                    'flex',
                                alignItems:
                                    'center',
                                justifyContent:
                                    'center',
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : notifications.length ===
                      0 ? (
                        <Alert severity="info">
                            لا توجد إشعارات
                            مرسلة حتى الآن.
                        </Alert>
                    ) : (
                        <Stack spacing={2}>
                            {notifications.map(
                                (
                                    notification,
                                ) => (
                                    <Paper
                                        key={
                                            notification._id
                                        }
                                        variant="outlined"
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 3,
                                        }}
                                    >
                                        <Stack
                                            spacing={
                                                1
                                            }
                                        >
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                gap={2}
                                            >
                                                <Typography
                                                    fontWeight={
                                                        800
                                                    }
                                                >
                                                    {
                                                        notification.title
                                                    }
                                                </Typography>

                                                <Chip
                                                    size="small"
                                                    label={
                                                        notification.readAt
                                                            ? 'مقروء'
                                                            : 'غير مقروء'
                                                    }
                                                    color={
                                                        notification.readAt
                                                            ? 'default'
                                                            : 'warning'
                                                    }
                                                />
                                            </Stack>

                                            {notification.body && (
                                                <Typography>
                                                    {
                                                        notification.body
                                                    }
                                                </Typography>
                                            )}

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                المستخدم:{' '}
                                                {getUserDisplayName(
                                                    notification.user,
                                                )}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {new Date(
                                                    notification.createdAt,
                                                ).toLocaleString(
                                                    'ar',
                                                )}
                                            </Typography>
                                        </Stack>
                                    </Paper>
                                ),
                            )}
                        </Stack>
                    )}
                </Stack>
            </Paper>
        );
    };

export default AdminSentNotifications;