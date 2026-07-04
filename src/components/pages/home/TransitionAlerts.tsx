import { useEffect, useState } from 'react';
import { Box, Fab, IconButton, Slide, SlideProps, Snackbar, Tooltip, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction='down' />;
}

function TransitionAlerts() {
    const [seen, setSeen] = useState(() => localStorage.getItem('development-alert') === 'true');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

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

    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={12000}
                onClose={handleClose}
                TransitionComponent={SlideTransition}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ top: { xs: 12, sm: 24 } }}
            >
                <Box
                    role='alert'
                    sx={{
                        width: { xs: '92vw', sm: 460 },
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 20px 45px -12px rgba(0,0,0,0.45)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        bgcolor: '#12121a',
                        position: 'relative',
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            px: 2.5,
                            py: 1.75,
                            background: 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'rgba(255,255,255,0.18)',
                                flexShrink: 0,
                            }}
                        >
                            <ConstructionRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
                        </Box>
                        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 15, flexGrow: 1 }}>
                            🚧 الموقع في مرحلة التطوير
                        </Typography>
                        <IconButton
                            onClick={() => setOpen(false)}
                            size='small'
                            sx={{ color: 'rgba(255,255,255,0.85)' }}
                        >
                            <CloseIcon fontSize='small' />
                        </IconButton>

                        {/* حافة scalloped */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -1,
                                left: 0,
                                right: 0,
                                height: 10,
                                backgroundImage:
                                    'radial-gradient(circle at 10px 0, transparent 9px, #12121a 9.5px)',
                                backgroundSize: '20px 10px',
                                backgroundRepeat: 'repeat-x',
                            }}
                        />
                    </Box>

                    {/* Body */}
                    <Box sx={{ px: 2.5, pt: 2, pb: 2.25 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, lineHeight: 1.9 }}>
                            قد تواجه بعض الأخطاء أو ميزات لم تكتمل بعد، ونعمل باستمرار على تحسين
                            تجربتك.
                        </Typography>

                        <Box
                            onClick={() => {
                                navigate('/contact', { state: { from: 'alert' } });
                                setOpen(false);
                            }}
                            sx={{
                                mt: 1.75,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                py: 1,
                                borderRadius: 2.5,
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: 13.5,
                                color: '#fff',
                                background: 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                                transition: 'transform 0.15s ease, filter 0.15s ease',
                                '&:hover': { filter: 'brightness(1.1)', transform: 'translateY(-1px)' },
                            }}
                        >
                            <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 17 }} />
                            {t('common.contact')}
                        </Box>

                        <Typography
                            sx={{
                                mt: 1.75,
                                textAlign: 'center',
                                color: 'rgba(255,255,255,0.45)',
                                fontSize: 12,
                                fontWeight: 600,
                            }}
                        >
                            شكرًا لتفهمكم ودعمكم ❤️
                        </Typography>
                    </Box>
                </Box>
            </Snackbar>

            {seen && !open && (
                <Tooltip title='إظهار التنبيه' placement='left'>
                    <Fab
                        size='small'
                        onClick={() => setOpen(true)}
                        sx={{
                            position: 'fixed',
                            top: 120,
                            right: 16,
                            zIndex: (theme) => theme.zIndex.snackbar,
                            background: 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                            color: '#fff',
                            boxShadow: '0 8px 20px -6px rgba(139,69,19,0.6)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                                filter: 'brightness(1.1)',
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                border: '2px solid #B8860B',
                                animation: 'ring 1.8s ease-out infinite',
                            },
                            '@keyframes ring': {
                                '0%': { transform: 'scale(1)', opacity: 0.7 },
                                '100%': { transform: 'scale(1.6)', opacity: 0 },
                            },
                        }}
                    >
                        <ConstructionRoundedIcon fontSize='small' />
                    </Fab>
                </Tooltip>
            )}
        </>
    );
}

export default TransitionAlerts;