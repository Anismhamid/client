import { useEffect, useState } from 'react';
import {
    Alert,
    AlertTitle,
    Fab,
    IconButton,
    Slide,
    SlideProps,
    Snackbar,
    Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction='down' />;
}

function TransitionAlerts() {
    const [seen, setSeen] = useState(() => {
        return localStorage.getItem('development-alert') === 'true';
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (seen) return;

        const timer = setTimeout(() => {
            setOpen(true);

            const audio = new Audio('/perfect-ding-1-355745.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {});
        }, 3000);

        return () => clearTimeout(timer);
    }, [seen]);

    const handleClose = () => {
        setOpen(false);
        setSeen(true);

        localStorage.setItem('development-alert', 'true');
    };

    const handleReopen = () => {
        setOpen(true);
    };

    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={12000}
                onClose={handleClose}
                TransitionComponent={SlideTransition}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity='warning'
                    variant='filled'
                    sx={{
                        width: '100%',
                        maxWidth: 750,
                        borderRadius: 3,
                        boxShadow: 6,
                        alignItems: 'flex-start',
                    }}
                    action={
                        <IconButton
                            color='inherit'
                            size='small'
                            onClick={() => setOpen(false)}
                        >
                            <CloseIcon fontSize='small' />
                        </IconButton>
                    }
                >
                    <AlertTitle sx={{ fontWeight: 700 }}>🚧 تنبيه</AlertTitle>
                    الموقع لا يزال في مرحلة التطوير، لذلك قد تواجه بعض الأخطاء
                    أو تلاحظ أن بعض الميزات لم تكتمل بعد.
                    <br />
                    <br />
                    إذا واجهت أي مشكلة أو كان لديك أي اقتراح، نرجو التواصل معنا،
                    وسنعمل على معالجته في أقرب وقت ممكن.
                    <br />
                    <strong>شكرًا لتفهمكم ودعمكم ❤️</strong>
                </Alert>
            </Snackbar>

            {/* 👇 الزر الجانبي */}
            {seen && !open && (
                <Tooltip title='إظهار التنبيه'>
                    <Fab
                        color='warning'
                        size='small'
                        onClick={handleReopen}
                        sx={{
                            position: 'fixed',
                            top: 120,
                            right: 16,
                            zIndex: (theme) => theme.zIndex.snackbar,
                            animation: 'pulse 2s infinite',

                            '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.15)' },
                                '100%': { transform: 'scale(1)' },
                            },
                        }}
                    >
                        <WarningAmberRoundedIcon />
                    </Fab>
                </Tooltip>
            )}
        </>
    );
}

export default TransitionAlerts;
