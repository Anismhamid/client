// components/home/HeroSection.tsx
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../context/useUSer';
import handleRTL from '../../../locales/handleRTL';
import { path } from '../../../routes/routes';


interface HeroSectionProps {
    onAddProduct: () => void;
}

const HeroSection = ({ onAddProduct }: HeroSectionProps) => {
    const { isLoggedIn } = useUser();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const direction = handleRTL();

    const handleAddClick = () => {
        if (isLoggedIn) {
            onAddProduct();
        } else {
            navigate(path.Login, { state: { from: path.Home } });
        }
    };

    return (
        <Box
            dir={direction}
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                py: { xs: 5, md: 7 },
                px: { xs: 2, md: 4 },
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                bgcolor: 'background.paper',
                background:
                    'radial-gradient(circle, rgba(245, 159, 11, 0.030) 0%, transparent 70%)',
            }}
        >
            {/* Dot-grid pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    pointerEvents: 'none',
                }}
            />

            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 580, mx: 'auto' }}>
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            px: 1.5,
                            py: 0.5,
                            mb: 3,
                            border: '1px solid',
                            borderColor: 'primary.light',
                            borderRadius: '99px',
                            bgcolor: 'primary.50',
                        }}
                    >
                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                flexShrink: 0,
                            }}
                        />
                        <Typography
                            variant="caption"
                            sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 0.4 }}
                        >
                            سـوق إلـكـتـرونـي مـوثـوق
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
                        variant="h1"
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
                        variant="body1"
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
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={handleAddClick}
                            sx={{
                                px: 3.5,
                                py: 1.25,
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                boxShadow: 'none',
                                '&:hover': { boxShadow: 'none', opacity: 0.88 },
                            }}
                        >
                            {t('create-post')}
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                px: 3.5,
                                py: 1.25,
                                borderRadius: '10px',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                borderWidth: '1.5px',
                            }}
                            onClick={() =>
                                document
                                    .getElementById('products-section')
                                    ?.scrollIntoView({ behavior: 'smooth' })
                            }
                        >
                            {t('browse-posts') || 'تصفح المنتجات'}
                        </Button>
                    </Box>
                </motion.div>
            </Box>
        </Box>
    );
};

export default HeroSection;