import { FunctionComponent, useCallback, useEffect, useState } from 'react';

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    Stack,
    Typography,
    Alert,
    Tooltip,
} from '@mui/material';

import BlockIcon from '@mui/icons-material/Block';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { useUser } from '../../hooks/useUSer';
import handleRTL from '../../locales/handleRTL';
import AlertDialogs from '../../atoms/toasts/Sweetalert';
import api from '../../services/api';

interface BlockedUser {
    _id: string;
    name?: {
        first?: string;
        last?: string;
    };
    slug?: string;
    email?: string;
    image?: {
        url?: string;
    };
    role?: string;
    blockedAt?: string;
    reason?: string;
    expiresAt?: string | null;
    isPermanent?: boolean;
}

const BlockedUsers: FunctionComponent = () => {
    const { t } = useTranslation();
    const { auth } = useUser();

    const direction = handleRTL();

    const [users, setUsers] = useState<BlockedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [unblockingId, setUnblockingId] = useState<string | null>(null);
    const [confirmUnblockId, setConfirmUnblockId] = useState<string | null>(
        null,
    );
    const [error, setError] = useState('');

    // ============================================
    // Fetch blocked users
    // ============================================

    const fetchBlockedUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/blocks/my');

            setUsers(response.data?.blocks || []);
        } catch (err) {
            console.error('Failed to fetch blocked users:', err);

            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setError(
                        t('common.unauthorized') || 'Your session has expired',
                    );
                    return;
                }
            }

            setError(
                t('modals.blockedUsers.loadError') ||
                    'Failed to load blocked users',
            );
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        if (auth?._id) {
            fetchBlockedUsers();
        }
    }, [auth?._id, fetchBlockedUsers]);

    // ============================================
    // Helpers
    // ============================================

    const getUserName = useCallback(
        (user: BlockedUser) => {
            const first = user.name?.first || '';
            const last = user.name?.last || '';

            return (
                `${first} ${last}`.trim() ||
                t('modals.blockedUsers.user') ||
                'User'
            );
        },
        [t],
    );

    const getInitials = useCallback((user: BlockedUser) => {
        const first = user.name?.first?.[0] || '';
        const last = user.name?.last?.[0] || '';

        return `${first}${last}`.toUpperCase() || 'U';
    }, []);

    const formatDate = useCallback((date?: string) => {
        if (!date) return '';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return '';

        return new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(parsedDate);
    }, []);

    const getExpirationText = useCallback(
        (user: BlockedUser) => {
            if (user.isPermanent || !user.expiresAt) {
                return t('modals.blockedUsers.permanent') || 'Permanent block';
            }

            return `${t('modals.blockedUsers.until') || 'Until'} ${formatDate(
                user.expiresAt,
            )}`;
        },
        [formatDate, t],
    );

    // ============================================
    // Unblock user
    // ============================================

    const handleUnblock = useCallback(
        async (userId: string): Promise<boolean> => {
            try {
                setUnblockingId(userId);
                setError('');

                await api.delete(`/blocks/${userId}`);

                setUsers((prev) => prev.filter((user) => user._id !== userId));

                return true;
            } catch (err) {
                console.error('Failed to unblock user:', err);

                if (axios.isAxiosError(err)) {
                    // Already unblocked
                    if (err.response?.status === 404) {
                        setUsers((prev) =>
                            prev.filter((user) => user._id !== userId),
                        );
                        return true;
                    }

                    // Session expired
                    if (err.response?.status === 401) {
                        setError(
                            t('common.unauthorized') ||
                                'Your session has expired',
                        );
                        return false;
                    }
                }

                setError(
                    t('modals.blockedUsers.unblockError') ||
                        'Failed to unblock user',
                );

                return false;
            } finally {
                setUnblockingId(null);
            }
        },
        [t],
    );

    const selectedUser = users.find((user) => user._id === confirmUnblockId);

    const handleConfirmUnblock = useCallback(async () => {
        if (!confirmUnblockId) return;

        const ok = await handleUnblock(confirmUnblockId);

        // AlertDialogs يعرض رسالة الخطأ لما نرمي exception
        if (!ok) {
            throw new Error('Unblock failed');
        }
    }, [confirmUnblockId, handleUnblock]);

    // ============================================
    // Loading
    // ============================================

    if (loading) {
        return (
            <Box
                dir={direction}
                sx={{
                    minHeight: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress
                    aria-label={t('common.loading', 'جاري التحميل')}
                />
            </Box>
        );
    }

    // ============================================
    // Render
    // ============================================

    return (
        <Box
            dir={direction}
            sx={{
                width: '100%',
                maxWidth: 900,
                mx: 'auto',
                px: { xs: 2, sm: 3 },
                py: { xs: 3, md: 5 },
            }}
        >
            {/* Header */}
            <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                sx={{ mb: 3 }}
            >
                <Box>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <BlockIcon color='error' aria-hidden='true' />

                        <Typography
                            variant='h5'
                            component='h1'
                            fontWeight={700}
                        >
                            {t('modals.blockedUsers.title') || 'Blocked Users'}
                        </Typography>
                    </Stack>

                    <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 0.5 }}
                    >
                        {t('modals.blockedUsers.description') ||
                            'Manage the users you have blocked.'}
                    </Typography>
                </Box>

                <Tooltip title={t('modals.blockedUsers.refresh') || 'Refresh'}>
                    <span>
                        <IconButton
                            onClick={fetchBlockedUsers}
                            disabled={loading || Boolean(unblockingId)}
                            aria-label={
                                t('modals.blockedUsers.refresh') || 'Refresh'
                            }
                        >
                            <RefreshIcon aria-hidden='true' />
                        </IconButton>
                    </span>
                </Tooltip>
            </Stack>

            {/* Error */}
            {error && (
                <Alert
                    severity='error'
                    sx={{ mb: 3 }}
                    onClose={() => setError('')}
                    slotProps={{
                        closeButton: {
                            'aria-label': t('common.close', 'إغلاق'),
                        },
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* Empty */}
            {users.length === 0 ? (
                <Card
                    elevation={0}
                    sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 3,
                    }}
                >
                    <CardContent sx={{ py: 7, textAlign: 'center' }}>
                        <BlockIcon
                            aria-hidden='true'
                            sx={{
                                fontSize: 60,
                                color: 'text.secondary',
                                mb: 2,
                            }}
                        />

                        <Typography
                            variant='h6'
                            component='h2'
                            fontWeight={600}
                            gutterBottom
                        >
                            {t('modals.blockedUsers.empty') ||
                                'No blocked users'}
                        </Typography>

                        <Typography variant='body2' color='text.secondary'>
                            {t('modals.blockedUsers.emptyDescription') ||
                                'You have not blocked any users.'}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Stack spacing={1.5}>
                    {users.map((user) => {
                        const userName = getUserName(user);
                        const isUnblocking = unblockingId === user._id;

                        return (
                            <Card
                                key={user._id}
                                elevation={0}
                                sx={{
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 3,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: 'error.light',
                                        boxShadow:
                                            '0 4px 18px rgba(0,0,0,0.06)',
                                    },
                                }}
                            >
                                <CardContent>
                                    <Stack
                                        direction={{
                                            xs: 'column',
                                            sm: 'row',
                                        }}
                                        alignItems={{
                                            xs: 'stretch',
                                            sm: 'center',
                                        }}
                                        justifyContent='space-between'
                                        spacing={2}
                                    >
                                        {/* User information */}
                                        <Stack
                                            direction='row'
                                            alignItems='center'
                                            spacing={2}
                                            sx={{ minWidth: 0 }}
                                        >
                                            <Avatar
                                                src={
                                                    user.image?.url || undefined
                                                }
                                                alt={userName}
                                                sx={{
                                                    width: 52,
                                                    height: 52,
                                                }}
                                            >
                                                {getInitials(user)}
                                            </Avatar>

                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    fontWeight={700}
                                                    noWrap
                                                >
                                                    {userName}
                                                </Typography>

                                                {user.email && (
                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                        noWrap
                                                    >
                                                        {user.email}
                                                    </Typography>
                                                )}

                                                <Stack
                                                    direction='row'
                                                    spacing={1}
                                                    flexWrap='wrap'
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    <Typography
                                                        variant='caption'
                                                        color='error.main'
                                                        fontWeight={600}
                                                    >
                                                        {getExpirationText(
                                                            user,
                                                        )}
                                                    </Typography>

                                                    {user.blockedAt && (
                                                        <Typography
                                                            variant='caption'
                                                            color='text.secondary'
                                                        >
                                                            •{' '}
                                                            {t(
                                                                'modals.blockedUsers.blockedOn',
                                                            )}{' '}
                                                            {formatDate(
                                                                user.blockedAt,
                                                            )}
                                                        </Typography>
                                                    )}
                                                </Stack>

                                                {user.reason && (
                                                    <Typography
                                                        variant='caption'
                                                        color='text.secondary'
                                                        sx={{
                                                            display: 'block',
                                                            mt: 0.75,
                                                        }}
                                                    >
                                                        {t(
                                                            'modals.blockedUsers.reason',
                                                        )}
                                                        : {user.reason}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Stack>

                                        {/* Unblock */}
                                        <Button
                                            variant='outlined'
                                            color='error'
                                            startIcon={
                                                isUnblocking ? (
                                                    <CircularProgress
                                                        size={18}
                                                        aria-label={t(
                                                            'modals.blockedUsers.unblocking',
                                                            'جاري إلغاء الحظر...',
                                                        )}
                                                    />
                                                ) : (
                                                    <PersonRemoveIcon aria-hidden='true' />
                                                )
                                            }
                                            disabled={Boolean(unblockingId)}
                                            onClick={() =>
                                                setConfirmUnblockId(user._id)
                                            }
                                            sx={{
                                                minWidth: 130,
                                                flexShrink: 0,
                                                gap: 1,
                                            }}
                                        >
                                            {isUnblocking
                                                ? t(
                                                      'modals.blockedUsers.unblocking',
                                                  ) || 'Unblocking...'
                                                : t(
                                                      'modals.blockedUsers.unblock',
                                                  ) || 'Unblock'}
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            )}

            {/* Confirm Dialog */}
            <AlertDialogs
                show={Boolean(confirmUnblockId)}
                title={
                    t('modals.blockedUsers.confirmUnblockTitle') ||
                    'Unblock User'
                }
                description={
                    selectedUser
                        ? `${
                              t('modals.blockedUsers.confirmUnblock') ||
                              'Are you sure you want to unblock this user?'
                          } ${getUserName(selectedUser)}?`
                        : t('modals.blockedUsers.confirmUnblock') ||
                          'Are you sure you want to unblock this user?'
                }
                confirmText={t('common.yes') || 'Yes'}
                cancelText={t('common.cancel') || 'Cancel'}
                successText={
                    t('modals.blockedUsers.unblockedSuccessfully') ||
                    'User unblocked successfully'
                }
                errorText={
                    t('modals.blockedUsers.unblockError') ||
                    'Failed to unblock user'
                }
                onConfirm={handleConfirmUnblock}
                onHide={() => setConfirmUnblockId(null)}
            />
        </Box>
    );
};

export default BlockedUsers;
