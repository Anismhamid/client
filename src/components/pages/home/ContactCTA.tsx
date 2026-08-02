// components/home/ContactCTA.tsx
import { Box, Button, Typography } from '@mui/material';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { path } from '../../../routes/routes';
import SealBadge from './SealBadge';

const ContactCTA = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default',
                py: { xs: 6, md: 8 },
                px: 2,
                textAlign: 'center',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <SealBadge size={56} rotate={-6}>
                        <HeadsetMicIcon sx={{ fontSize: 26 }} />
                    </SealBadge>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
                    نحن هنا لخدمتكم
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        maxWidth: 440,
                        mx: 'auto',
                        lineHeight: 1.75,
                        mb: 4,
                    }}
                >
                    فريق الدعم لدينا متواجد على مدار الساعة لإجابة على جميع أسئلتك وتقديم أفضل تجربة
                    تسوق ممكنة
                </Typography>
                <motion.div
                    style={{ display: 'inline-block' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate(path.Contact)}
                        sx={{
                            px: 4,
                            py: 1.25,
                            borderRadius: '10px',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 'none',
                                filter: 'brightness(1.06)',
                                background: 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                            },
                        }}
                    >
                        تواصل معنا
                    </Button>
                </motion.div>
            </motion.div>
        </Box>
    );
};

export default ContactCTA;