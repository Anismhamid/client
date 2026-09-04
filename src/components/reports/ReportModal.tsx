import { FunctionComponent, useState } from 'react';

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
} from '@mui/material';

import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';

import { useTranslation } from 'react-i18next';



import useReport from '../../hooks/useReport';
import { UserReportReason, UserReportType } from '../../interfaces/report.types';
import handleRTL from '../../locales/handleRTL';

interface ReportModalProps {
    open: boolean;

    onClose: () => void;

    type: UserReportType;

    targetId: string;

    onSuccess?: () => void;
}

const reasons: UserReportReason[] = [
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

const ReportModal: FunctionComponent<ReportModalProps> = ({
    open,
    onClose,
    type,
    targetId,
    onSuccess,
}) => {
    const { t } = useTranslation();

    const { createReport, loading } = useReport();

    const [reason, setReason] = useState<UserReportReason | ''>('');

    const [description, setDescription] = useState('');

    const [error, setError] = useState('');

    // =====================================================
    // Reason
    // =====================================================

    const handleReasonChange = (event: SelectChangeEvent) => {
        setReason(event.target.value as UserReportReason);

        setError('');
    };

    // =====================================================
    // Close
    // =====================================================

    const handleClose = () => {
        if (loading) return;

        setReason('');
        setDescription('');
        setError('');

        onClose();
    };

    // =====================================================
    // Submit
    // =====================================================

    const handleSubmit = async () => {
        if (!reason) {
            setError(t('modals.report.reasonRequired', 'Please select a reason.'));

            return;
        }

        try {
            setError('');

            await createReport({
                type,
                targetId,
                reason,
                description: description.trim() || undefined,
            });

            setReason('');
            setDescription('');
            setError('');

            onSuccess?.();
            onClose();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Create report error:', err);

            if (err?.response?.status === 409) {
                setError(
                    t(
                        'modals.report.alreadyReported',
                        'You have already reported this.',
                    ),
                );
            } else {
                setError(
                    err?.response?.data?.message ||
                        t('modals.report.failed', 'Failed to submit modals.report.'),
                );
            }
        }
    };

    const dir = handleRTL()

    return (
        <Dialog dir={dir} open={open} onClose={handleClose} fullWidth maxWidth='sm'>
            <DialogTitle>
                <Stack direction='row' spacing={1} alignItems='center'>
                    <FlagOutlinedIcon color='error' />

                    <Box sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {t('modals.report.title', 'Report')}
                    </Box>
                </Stack>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2.5} mt={1}>
                    {error && <Alert severity='error'>{error}</Alert>}

                    <FormControl fullWidth>
                        <InputLabel>{t('modals.report.reason', 'Reason')}</InputLabel>

                        <Select
                            value={reason}
                            label={t('modals.report.reason', 'Reason')}
                            onChange={handleReasonChange}
                        >
                            {reasons.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {t(`modals.report.reasons.${item}`, item)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label={t('modals.report.description', 'Description')}
                        placeholder={t(
                            'modals.report.descriptionPlaceholder',
                            'Tell us more about the problem...',
                        )}
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value.slice(0, 500))
                        }
                        multiline
                        rows={5}
                        fullWidth
                        helperText={`${description.length}/500`}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} disabled={loading}>
                    {t('common.cancel', 'Cancel')}
                </Button>

                <Button
                    variant='contained'
                    onClick={handleSubmit}
                    disabled={loading || !reason}
                    startIcon={
                        loading ? (
                            <CircularProgress size={18} color='inherit' />
                        ) : (
                            <FlagOutlinedIcon />
                        )
                    }
                >
                    {loading
                        ? t('common.sending', 'Sending...')
                        : t('modals.report.submit', 'Submit report')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReportModal;
