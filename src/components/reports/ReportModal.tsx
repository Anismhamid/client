/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
    UserReportReason,
    UserReportType,
} from '../../interfaces/report.types';
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

    const [customReason, setCustomReason] = useState('');

    const [description, setDescription] = useState('');

    const [error, setError] = useState('');

    // =====================================================
    // Reason
    // =====================================================

    const handleReasonChange = (event: SelectChangeEvent) => {
        const value = event.target.value as UserReportReason;

        setReason(value);
        setError('');

        if (value !== 'other') {
            setCustomReason('');
        }
    };

    // =====================================================
    // Close
    // =====================================================

    const handleClose = () => {
        if (loading) return;

        setReason('');
        setCustomReason('');
        setDescription('');
        setError('');

        onClose();
    };

    // =====================================================
    // Submit
    // =====================================================

    const handleSubmit = async () => {
        // Reason required
        if (!reason) {
            setError(
                t('modals.report.reasonRequired', 'Please select a reason.'),
            );

            return;
        }

        // Custom reason required when "other"
        if (reason === 'other' && !customReason.trim()) {
            setError(
                t(
                    'modals.report.customReasonRequired',
                    'Please enter the reason.',
                ),
            );

            return;
        }

        try {
            setError('');

            await createReport({
                type,
                targetId,

                // Always send the enum reason
                reason,

                // Only send customReason when reason === "other"
                customReason:
                    reason === 'other' ? customReason.trim() : undefined,

                // Optional description
                description: description.trim() || undefined,
            });

            // Reset form
            setReason('');
            setCustomReason('');
            setDescription('');
            setError('');

            onSuccess?.();
            onClose();
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
                        t('modals.report.failed', 'Failed to submit report.'),
                );
            }
        }
    };

    // =====================================================
    // Title
    // =====================================================

    const reportTitle = `${t('modals.report.title', 'Report')} ${t(
        `modals.report.types.${type}`,
        type,
    )}`;

    const dir = handleRTL();

    // =====================================================
    // Render
    // =====================================================

    return (
        <Dialog
            sx={{ zIndex: 100001 }}
            dir={dir}
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth='sm'
        >
            <DialogTitle>
                <Stack direction='row' spacing={1} alignItems='center'>
                    <FlagOutlinedIcon color='error' />

                    <Box
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                        }}
                    >
                        {reportTitle}
                    </Box>
                </Stack>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2.5} mt={1}>
                    {/* Error */}
                    {error && <Alert severity='error'>{error}</Alert>}

                    {/* ================= Reason ================= */}

                    <FormControl fullWidth>
                        <InputLabel>
                            {t('modals.report.reason', 'Reason')}
                        </InputLabel>

                        <Select
                            value={reason}
                            label={t('modals.report.reason', 'Reason')}
                            onChange={handleReasonChange}
                            MenuProps={{
                                sx: {
                                    zIndex: 100002,
                                },
                            }}
                        >
                            {reasons.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {t(`modals.report.reasons.${item}`, item)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* ================= Custom Reason ================= */}

                    {reason === 'other' && (
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label={t(
                                'modals.report.customReason',
                                'Other reason',
                            )}
                            placeholder={t(
                                'modals.report.customReasonPlaceholder',
                                'Write the reason for your report...',
                            )}
                            value={customReason}
                            onChange={(event) => {
                                setCustomReason(
                                    event.target.value.slice(0, 300),
                                );

                                setError('');
                            }}
                            error={!customReason.trim() && !!error}
                            helperText={`${customReason.length}/300`}
                        />
                    )}

                    {/* ================= Description ================= */}

                    <TextField
                        label={t(
                            'modals.report.description',
                            'Additional details',
                        )}
                        placeholder={t(
                            'modals.report.descriptionPlaceholder',
                            'Tell us more about the problem...',
                        )}
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value.slice(0, 500));

                            setError('');
                        }}
                        multiline
                        rows={5}
                        fullWidth
                        helperText={`${description.length}/500`}
                    />
                </Stack>
            </DialogContent>

            {/* ================= Actions ================= */}

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} disabled={loading}>
                    {t('common.cancel', 'Cancel')}
                </Button>

                <Button
                    sx={{ gap: 1 }}
                    variant='contained'
                    onClick={handleSubmit}
                    disabled={
                        loading ||
                        !reason ||
                        (reason === 'other' && !customReason.trim())
                    }
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
