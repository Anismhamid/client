// components/home/ContactCTA.tsx
import { Box, Button, Typography } from '@mui/material';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { path } from '../../../routes/routes';
import SealBadge from './SealBadge';
import { useTranslation } from 'react-i18next';

const ContactCTA = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default',
                py: { xs: 6, md: 8 },
                px: 2,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* نفس تكسچر خطوط الدفتر من الـ Hero وStatsStrip */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'repeating-linear-gradient(rgba(139,69,19,0.045) 0px, rgba(139,69,19,0.045) 1px, transparent 1px, transparent 26px)',
                    maskImage:
                        'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                    WebkitMaskImage:
                        'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            {/* حافة مسننة علوية — نفس تفصيلة TransitionAlerts وStatsStrip */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -1,
                    left: 0,
                    right: 0,
                    height: 8,
                    backgroundImage: (theme) =>
                        `radial-gradient(circle at 8px 8px, transparent 7px, ${theme.palette.background.default} 7.5px)`,
                    backgroundSize: '16px 8px',
                    backgroundRepeat: 'repeat-x',
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ position: 'relative' }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <SealBadge size={56} rotate={-6}>
                        <HeadsetMicIcon sx={{ fontSize: 26 }} />
                    </SealBadge>
                </Box>
                <Typography
                    variant='h5'
                    sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}
                >
                    {t('contactCTA.title')}
                </Typography>

                {/* الفقرة صارت "بند دفتر" بخط متقطع فوق وتحت، مو نص عائم بس */}
                <Box
                    sx={{
                        maxWidth: 440,
                        mx: 'auto',
                        mb: 4,
                        py: 2,
                        borderTop: '1px dashed',
                        borderBottom: '1px dashed',
                        borderColor: 'divider',
                    }}
                >
                    <Typography
                        variant='body1'
                        sx={{
                            color: 'text.secondary',
                            lineHeight: 1.75,
                        }}
                    >
                        {t('contactCTA.description')}
                    </Typography>
                </Box>

                <motion.div
                    style={{ display: 'inline-block' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        variant='contained'
                        size='large'
                        onClick={() => navigate(path.Contact)}
                        sx={{
                            px: 4,
                            py: 1.25,
                            borderRadius: '10px',
                            fontWeight: 700,
                            background:
                                'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 'none',
                                filter: 'brightness(1.06)',
                                background:
                                    'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                            },
                        }}
                    >
                        {t('contactCTA.button')}
                    </Button>
                </motion.div>
            </motion.div>
        </Box>
    );
};

export default ContactCTA;
