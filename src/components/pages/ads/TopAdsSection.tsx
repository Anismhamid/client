// components/ads/TopAdsSection.tsx
import {
    Box,
    Typography,
    Grid,
    useTheme,
    alpha,
    Container,
    Skeleton,
    Button,
    Paper,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EastIcon from '@mui/icons-material/East';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTopAds } from '../../../hooks/ads/useFeaturedAds';
import { HomepageAdCard } from './HomepageFeaturedSection ';

export function TopAdsSection() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { ads: topAds, loading } = useTopAds(); // ← استخدم الـ hook الجديد

    if (loading) {
        return (
            <Box sx={{ mb: 6 }}>
                <Typography variant='h5' fontWeight={800} sx={{ mb: 3 }}>
                    أفضل الإعلانات ⭐
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

    if (topAds.length === 0) return null;

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
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <EmojiEventsIcon
                                sx={{
                                    fontSize: 28,
                                    color: theme.palette.primary.main,
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography variant='h5' fontWeight={800} sx={{ mb: 0.5 }}>
                                أفضل الإعلانات ⭐
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                الإعلانات الأكثر مشاهدة وتفاعلاً
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant='text'
                        endIcon={<EastIcon />}
                        onClick={() => navigate('/featured-ads?type=top')}
                        sx={{
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                            },
                        }}
                    >
                        عرض الكل
                    </Button>
                </Box>

                <Grid container spacing={2.5}>
                    {topAds.slice(0, 8).map((ad, idx) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={ad._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            left: 12,
                                            zIndex: 2,
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            bgcolor: alpha(
                                                idx < 3 
                                                    ? theme.palette.warning.main 
                                                    : theme.palette.grey[600],
                                                0.9
                                            ),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backdropFilter: 'blur(4px)',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: 14,
                                                color: 'white',
                                            }}
                                        >
                                            #{idx + 1}
                                        </Typography>
                                    </Box>
                                    <HomepageAdCard ad={ad} index={idx} />
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </motion.div>
        </Container>
    );
}