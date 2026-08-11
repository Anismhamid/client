// components/home/HeroSection.tsx
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VerifiedIcon from '@mui/icons-material/Verified';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../hooks/useUSer';
import handleRTL from '../../../locales/handleRTL';
import { path } from '../../../routes/routes';
import { useEffect } from 'react';
import SealBadge from './SealBadge';
import AISearch from '../../../atoms/AISearch';
// import SealBadge from './SealBadge';

interface HeroSectionProps {
    onAddProduct: () => void;
}

const GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';

const HeroSection = ({ onAddProduct }: HeroSectionProps) => {
    const { isLoggedIn } = useUser();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const direction = handleRTL();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [navigate]);

    const handleAddClick = () => {
        if (isLoggedIn) {
            onAddProduct();
        } else {
            navigate(path.Login, { state: { from: path.Home } });
        }
    };

    return (
        <Box
            id='hero-section'
            dir={direction}
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                py: { xs: 5, md: 10 },
                px: { xs: 2, md: 4 },
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                bgcolor: 'background.paper',
                // background:
                //     'radial-gradient(circle, rgba(245, 159, 11, 0.030) 0%, transparent 70%),url(public/safqa_playstore_header.jpg)',
                // backgroundPosition: 'center',
                // backgroundRepeat: 'no-repeat',
                // backgroundAttachment: 'fixed',
                // backgroundSize: 'contain',
            }}
        >
            <AISearch />
            {/* Ledger-rule texture: fine horizontal lines, like a trading ledger page */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'repeating-linear-gradient(rgba(139,69,19,0.055) 0px, rgba(139,69,19,0.055) 1px, transparent 1px, transparent 32px)',
                    maskImage:
                        'radial-gradient(ellipse at center, black 0%, transparent 75%)',
                    WebkitMaskImage:
                        'radial-gradient(ellipse at center, black 0%, transparent 75%)',
                    pointerEvents: 'none',
                }}
            />

            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: 580,
                    mx: 'auto',
                }}
            >
                {/* Seal badge + trust label */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 1.5,
                            py: 0.75,
                            mb: 3,
                            border: '1px solid',
                            borderColor: 'primary',
                            borderRadius: '11px',
                        }}
                    >
                        <SealBadge size={22} rotate={-8}>
                            <VerifiedIcon sx={{ fontSize: 13 }} />
                        </SealBadge>
                        <Typography
                            variant='caption'
                            sx={{
                                color: 'primary',
                                fontWeight: 600,
                                letterSpacing: 0.4,
                            }}
                        >
                            {t('TrustedOnlineMarketplace')}
                        </Typography>
                    </Box>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Typography
                        variant='h1'
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '2.4rem', md: '3.2rem' },
                            lineHeight: 1.15,
                            letterSpacing: '-1px',
                            color: 'text.primary',
                            mb: 2,
                        }}
                    >
                        🛒 {t('webPageName')}
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            color: 'text.secondary',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            lineHeight: 1.75,
                            mb: 4,
                        }}
                    >
                        {t('bestOffers')}
                    </Typography>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant='contained'
                                size='large'
                                startIcon={<AddIcon />}
                                onClick={handleAddClick}
                                sx={{
                                    px: 3.5,
                                    py: 1.25,
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    background: GRADIENT,
                                    boxShadow:
                                        '0 10px 24px -10px rgba(139,69,19,0.55)',
                                    '&:hover': {
                                        boxShadow:
                                            '0 14px 28px -10px rgba(139,69,19,0.65)',
                                        background: GRADIENT,
                                        filter: 'brightness(1.06)',
                                    },
                                }}
                            >
                                {t('create-post')}
                            </Button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant='outlined'
                                size='large'
                                sx={{
                                    px: 3.5,
                                    py: 1.25,
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    borderWidth: '1.5px',
                                    borderColor: 'text.primary',
                                    color: 'text.primary',
                                    '&:hover': {
                                        borderWidth: '1.5px',
                                        borderColor: '#8B4513',
                                        color: '#8B4513',
                                        bgcolor: 'transparent',
                                    },
                                }}
                                onClick={() =>
                                    document
                                        .getElementById('products-section')
                                        ?.scrollIntoView({ behavior: 'smooth' })
                                }
                            >
                                {t('browse-posts') || 'تصفح المنتجات'}
                            </Button>
                        </motion.div>
                    </Box>
                </motion.div>
            </Box>
        </Box>
    );
};

export default HeroSection;
