import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Stack,
    Typography,
    IconButton,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { UserReportReason, UserReportType } from '../../interfaces/report.types';
import useReport from '../../hooks/useReport';

const GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';

const REASONS: UserReportReason[] = [
    'spam',
    'harassment',
    'inappropriate_content',
    'fake_account',
    'scam',
    'violence',
    'hate_speech',
    'nudity',
    'copyright',
    'other',
];

interface ReportModalProps {
    open: boolean;
    onClose: () => void;
    targetId: string;
    type: UserReportType;
    onSuccess?: () => void;
}

const ReportModal = ({ open, onClose, targetId, type, onSuccess }: ReportModalProps) => {
    const { t } = useTranslation();
    const { createReport, loading } = useReport();
    const [reason, setReason] = useState<UserReportReason | ''>('');
    const [description, setDescription] = useState('');
    const [touched, setTouched] = useState(false);

    const resetAndClose = () => {
        setReason('');
        setDescription('');
        setTouched(false);
        onClose();
    };

    const handleSubmit = async () => {
        setTouched(true);
        if (!reason) return;

        try {
            await createReport({
                type,
                targetId,
                reason,
                description: description.trim() || undefined,
            });
            onSuccess?.();
            resetAndClose();
        } catch {
            // useReport already surfaces a toast on failure
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : resetAndClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Typography variant="h6" fontWeight={700} color="#12161C">
                    {t('modals.report.title')}
                </Typography>
                <IconButton onClick={resetAndClose} disabled={loading} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {t('modals.report.subtitle')}
                    </Typography>

                    <TextField
                        select
                        required
                        fullWidth
                        label={t('modals.report.reason')}
                        value={reason}
                        onChange={(e) => setReason(e.target.value as UserReportReason)}
                        error={touched && !reason}
                        helperText={touched && !reason ? t('modals.report.reasonRequired') : ' '}
                    >
                        {REASONS.map((r) => (
                            <MenuItem key={r} value={r}>
                                {t(`modals.report.reasons.${r}`)}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={6}
                        label={t('modals.report.description')}
                        placeholder={t('modals.report.descriptionPlaceholder') ?? ''}
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                        helperText={`${description.length}/500`}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3,display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                <Button onClick={resetAndClose} disabled={loading} color="inherit">
                    {t('modals.report.cancel')}
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !reason}
                    variant="contained"
                    disableElevation
                    sx={{
                        background: GRADIENT,
                        color: '#fff',
                        px: 3,
                        '&:hover': { background: GRADIENT, filter: 'brightness(0.95)' },
                        '&.Mui-disabled': { background: 'action.disabledBackground' },
                    }}
                >
                    {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : t('modals.report.submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReportModal;