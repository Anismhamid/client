import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Typography,
} from '@mui/material';

import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface AppUpdateDialogProps {
    open: boolean;
    forced: boolean;
    updating: boolean;
    updateReady: boolean;
    progress: number;
    currentVersionCode: number;
    availableVersionCode: number;
    latestVersionName?: string;
    message?: string;
    onUpdate: () => void;
    onComplete: () => void;
    onLater: () => void;
}

export default function AppUpdateDialog({
    open,
    forced,
    updating,
    updateReady,
    progress,
    currentVersionCode,
    availableVersionCode,
    latestVersionName,
    message,
    onUpdate,
    onComplete,
    onLater
}: AppUpdateDialogProps) {
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth='xs'
            disableEscapeKeyDown={forced}
            slotProps={{
                backdrop: {
                    sx: {
                        backdropFilter: 'blur(4px)',
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    textAlign: 'center',
                    pt: 4,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2,
                    }}
                >
                    {updateReady ? (
                        <CheckCircleOutlineIcon
                            sx={{
                                fontSize: 60,
                            }}
                        />
                    ) : (
                        <SystemUpdateAltIcon
                            sx={{
                                fontSize: 60,
                            }}
                        />
                    )}
                </Box>

                {updateReady ? 'التحديث جاهز' : 'يتوفر تحديث جديد'}
            </DialogTitle>

            <DialogContent>
                <Typography textAlign='center' sx={{ mb: 2 }}>
                    {message ||
                        'يتوفر إصدار جديد من صفقة يحتوي على تحسينات وإصلاحات مهمة.'}
                </Typography>

                {latestVersionName && (
                    <Typography
                        textAlign='center'
                        variant='body2'
                        sx={{ mb: 1 }}
                    >
                        الإصدار الجديد: {latestVersionName}
                    </Typography>
                )}

                {availableVersionCode > 0 && (
                    <Typography
                        textAlign='center'
                        variant='caption'
                        display='block'
                    >
                        {currentVersionCode} → {availableVersionCode}
                    </Typography>
                )}

                {forced && !updateReady && (
                    <Alert severity='warning' sx={{ mt: 2 }}>
                        يجب تحديث التطبيق للمتابعة.
                    </Alert>
                )}

                {updating && !updateReady && (
                    <Box sx={{ mt: 3 }}>
                        <LinearProgress
                            variant={
                                progress > 0 ? 'determinate' : 'indeterminate'
                            }
                            value={progress}
                        />

                        {progress > 0 && (
                            <Typography
                                textAlign='center'
                                variant='body2'
                                sx={{ mt: 1 }}
                            >
                                {progress}%
                            </Typography>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                    gap: 1,
                    flexDirection: 'column',
                }}
            >
                {updateReady ? (
                    <Button fullWidth variant='contained' onClick={onComplete}>
                        إعادة تشغيل وتثبيت التحديث
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        variant='contained'
                        disabled={updating}
                        onClick={onUpdate}
                        startIcon={
                            updating ? (
                                <CircularProgress size={18} color='inherit' />
                            ) : undefined
                        }
                    >
                        {updating ? 'جاري التحديث...' : 'تحديث الآن'}
                    </Button>
                )}

                <Button fullWidth variant='text' onClick={onLater}>
                    لاحقًا
                </Button>
            </DialogActions>
        </Dialog>
    );
}
