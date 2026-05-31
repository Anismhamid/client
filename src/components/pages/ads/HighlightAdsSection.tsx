// components/ads/HighlightAdsSection.tsx
import {
    Box,
    Typography,
    Grid,
    useTheme,
    alpha,
    Container,
    Skeleton,
    Button,
    Chip,
} from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import EastIcon from '@mui/icons-material/East';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { useHighlightAds } from '../../../hooks/ads/useFeaturedAds';
import { HomepageAdCard } from './HomepageFeaturedSection ';

export function HighlightAdsSection() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { ads: highlightAds, loading } = useHighlightAds(); // ← استخدم الـ hook الجديد

    if (loading) {
        return (
            <Box sx={{ mb: 6 }}>
                <Typography variant='h5' fontWeight={800} sx={{ mb: 3 }}>
                    إعلانات مميزة جداً 🔥
                </Typography>
                <Grid container spacing={2.5}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                            <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (highlightAds.length === 0) return null;

    return (
        <Container maxWidth='lg' sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 3,
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.warning.main, 0.15),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <WhatshotIcon
                                sx={{
                                    fontSize: 28,
                                    color: theme.palette.warning.main,
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography variant='h5' fontWeight={800} sx={{ mb: 0.5 }}>
                                إعلانات مميزة جداً 🔥
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                أقوى العروض والتخفيضات المميزة
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant='text'
                        endIcon={<EastIcon />}
                        onClick={() => navigate('/featured-ads?type=highlight')}
                        sx={{
                            fontWeight: 600,
                            color: theme.palette.warning.main,
                            '&:hover': {
                                bgcolor: alpha(theme.palette.warning.main, 0.08),
                            },
                        }}
                    >
                        عرض الكل
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {highlightAds.slice(0, 8).map((ad, idx) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={ad._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    <Chip
                                        label='مميز جداً'
                                        size='small'
                                        icon={<WhatshotIcon sx={{ fontSize: 14 }} />}
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            zIndex: 2,
                                            bgcolor: theme.palette.warning.main,
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: 11,
                                            height: 26,
                                            '& .MuiChip-icon': {
                                                color: 'white',
                                            },
                                        }}
                                    />
                                    <HomepageAdCard ad={ad} index={idx} />
                                </Box>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </motion.div>
        </Container>
    );
}