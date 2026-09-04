import { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useTranslation } from 'react-i18next';
import useReport from '../../hooks/useReport';

interface BlockButtonProps {
    userId: string;
    /** Pass when the parent already knows the blocked state, to skip the initial check call */
    initialBlocked?: boolean;
    variant?: 'icon' | 'text';
    onChange?: (isBlocked: boolean) => void;
}

const BlockButton = ({
    userId,
    initialBlocked,
    variant = 'text',
    onChange,
}: BlockButtonProps) => {
    const { t } = useTranslation();
    const { blockUser, unblockUser, checkIfBlocked, loading } = useReport();

    const [isBlocked, setIsBlocked] = useState(initialBlocked ?? false);
    const [checking, setChecking] = useState(initialBlocked === undefined);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [duration, setDuration] = useState<'7' | '30' | 'permanent'>(
        'permanent',
    );
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (initialBlocked !== undefined) return;
        let mounted = true;
        checkIfBlocked(userId).then((result) => {
            if (mounted) {
                setIsBlocked(result);
                setChecking(false);
            }
        });
        return () => {
            mounted = false;
        };
    }, [userId, initialBlocked, checkIfBlocked]);

    const handleUnblock = async () => {
        try {
            await unblockUser(userId);
            setIsBlocked(false);
            onChange?.(false);
        } catch {
            // toast already shown by useReport
        }
    };

    const handleConfirmBlock = async () => {
        try {
            const expiresAt =
                duration === 'permanent'
                    ? undefined
                    : new Date(
                          Date.now() + Number(duration) * 24 * 60 * 60 * 1000,
                      ).toISOString();

            await blockUser({
                userId,
                reason: reason.trim() || undefined,
                expiresAt,
            });
            setIsBlocked(true);
            onChange?.(true);
            setConfirmOpen(false);
            setReason('');
            setDuration('permanent');
        } catch {
            // toast already shown by useReport
        }
    };

    if (checking) {
        return <CircularProgress size={18} />;
    }

    return (
        <>
            <Button
                size='small'
                variant={variant === 'text' ? 'outlined' : 'text'}
                color={isBlocked ? 'success' : 'error'}
                startIcon={isBlocked ? <LockOpenIcon /> : <BlockIcon />}
                disabled={loading}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isBlocked) {
                        handleUnblock();
                    } else {
                        setConfirmOpen(true);
                    }
                }}
                sx={{ borderRadius: 1, textTransform: 'none' }}
            >
                {isBlocked ? t('modals.block.unblock') : t('modals.block.block')}
            </Button>

            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                maxWidth='xs'
                slotProps={{
                    root: {
                        sx: {
                            zIndex: 6000,
                        },
                    },
                }}
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#12161C' }}>
                    {t('modals.block.confirmTitle')}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography variant='body2' color='text.secondary'>
                            {t('modals.block.confirmBody')}
                        </Typography>

                        <ToggleButtonGroup
                            value={duration}
                            exclusive
                            fullWidth
                            size='small'
                            onChange={(_, value) => value && setDuration(value)}
                        >
                            <ToggleButton value='7'>
                                {t('modals.block.days7')}
                            </ToggleButton>
                            <ToggleButton value='30'>
                                {t('modals.block.days30')}
                            </ToggleButton>
                            <ToggleButton value='permanent'>
                                {t('modals.block.permanent')}
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            label={t('modals.block.reasonOptional')}
                            value={reason}
                            onChange={(e) =>
                                setReason(e.target.value.slice(0, 300))
                            }
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={() => setConfirmOpen(false)}
                        color='inherit'
                        disabled={loading}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={handleConfirmBlock}
                        variant='contained'
                        color='error'
                        disableElevation
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress
                                size={20}
                                sx={{ color: '#fff' }}
                            />
                        ) : (
                            t('modals.block.block')
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BlockButton;
