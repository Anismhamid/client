// components/ads/HighlightAdsSection.tsx
import {
    Box,
    Typography,
    Grid,
    useTheme,
    alpha,
    Container,
    Button,
    Chip,
    Stack,
    Paper,
} from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import EastIcon from '@mui/icons-material/East';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHighlightAds } from '../../../hooks/ads/useFeaturedAds';
import React from 'react';
import { AdGridSkeleton } from './Adgridskeleton';
import { HomepageAdCard } from './HomepageFeaturedSection ';


// ── Constants ──────────────────────────────────────────────────────────────
const DEFAULT_MAX_ITEMS = 8;

// ── Props ──────────────────────────────────────────────────────────────────
interface HighlightAdsSectionProps {
    maxItems?: number;
    showViewAll?: boolean;
}

// ── Component ──────────────────────────────────────────────────────────────
export const HighlightAdsSection = React.memo(function HighlightAdsSection({
    maxItems = DEFAULT_MAX_ITEMS,
    showViewAll = true,
}: HighlightAdsSectionProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    const { ads: highlightAds, loading, error } = useHighlightAds();

    if (loading) {
        return (
            <Box sx={{ mb: 6 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 3 }}
                >
                    <Typography variant="h5" fontWeight={800}>
                        إعلانات مميزة جداً 🔥
                    </Typography>
                </Stack>
                <AdGridSkeleton count={4} height={280} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mb: 6, textAlign: 'center', py: 4 }}>
                <Typography color="error" gutterBottom>
                    {error}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                >
                    إعادة المحاولة
                </Button>
            </Box>
        );
    }

    if (highlightAds.length === 0) return null;

    const displayAds = highlightAds.slice(0, maxItems);
    const hasMore = highlightAds.length > maxItems;

    return (
        <Container maxWidth="lg" sx={{ mb: 8, px: { xs: 2, sm: 3, md: 4 } }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header Section */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        p: 2.5,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${alpha(
                            theme.palette.warning.main,
                            0.08,
                        )} 0%, ${alpha(theme.palette.warning.main, 0.02)} 100%)`,
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        gap={2}
                    >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 2.5,
                                        background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}`,
                                    }}
                                >
                                    <LocalFireDepartmentIcon
                                        sx={{ fontSize: 32, color: 'white' }}
                                    />
                                </Box>
                            </motion.div>

                            <Box>
                                <Typography
                                    variant="h5"
                                    fontWeight={800}
                                    sx={{
                                        mb: 0.5,
                                        background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                    }}
                                >
                                    إعلانات مميزة جداً 🔥
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    أقوى العروض والتخفيضات الحصرية
                                </Typography>
                            </Box>
                        </Stack>

                        {showViewAll && (
                            <motion.div whileHover={{ x: -4 }}>
                                <Button
                                    variant="contained"
                                    endIcon={<EastIcon />}
                                    onClick={() => navigate('/featured-ads?type=highlight')}
                                    sx={{
                                        fontWeight: 600,
                                        bgcolor: theme.palette.warning.main,
                                        '&:hover': {
                                            bgcolor: theme.palette.warning.dark,
                                        },
                                        borderRadius: 2,
                                        px: 3,
                                    }}
                                >
                                    عرض الكل
                                </Button>
                            </motion.div>
                        )}
                    </Stack>

                    {/* Stats Badges */}
                    <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                        <Chip
                            label={`${highlightAds.length} إعلان مميز`}
                            size="small"
                            sx={{
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                color: theme.palette.warning.main,
                                fontWeight: 600,
                            }}
                        />
                        <Chip
                            label="عروض حصرية"
                            size="small"
                            variant="outlined"
                            sx={{
                                borderColor: alpha(theme.palette.warning.main, 0.3),
                                color: theme.palette.warning.main,
                            }}
                        />
                    </Stack>
                </Paper>

                {/* Ads Grid */}
                <AnimatePresence mode="wait">
                    <Grid container spacing={3}>
                        {displayAds.map((ad, idx) => (
                            <Grid
                                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                key={`highlight-ad-${ad._id}`}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: idx * 0.05,
                                        ease: 'easeOut',
                                    }}
                                    whileHover={{ y: -4 }}
                                >
                                    <Box sx={{ position: 'relative', height: '100%' }}>
                                        {/* Premium Badge */}
                                        <Chip
                                            label="مميز جداً"
                                            size="small"
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
                                                height: 28,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                '& .MuiChip-icon': { color: 'white' },
                                            }}
                                        />

                                        {/* Glow Effect */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                borderRadius: 3,
                                                background: `radial-gradient(circle at 30% 20%, ${alpha(
                                                    theme.palette.warning.main,
                                                    0.08,
                                                )}, transparent)`,
                                                pointerEvents: 'none',
                                                zIndex: 1,
                                            }}
                                        />

                                        <HomepageAdCard ad={ad} index={idx} />
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </AnimatePresence>

                {/* View More (mobile) */}
                {showViewAll && hasMore && (
                    <Box
                        sx={{
                            textAlign: 'center',
                            mt: 4,
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/featured-ads?type=highlight')}
                            sx={{
                                borderRadius: 2,
                                borderColor: alpha(theme.palette.warning.main, 0.5),
                                color: theme.palette.warning.main,
                            }}
                        >
                            عرض المزيد من الإعلانات المميزة
                        </Button>
                    </Box>
                )}
            </motion.div>
        </Container>
    );
});

// ── Skeleton export (for lazy loading) ────────────────────────────────────
export const HighlightAdsSectionSkeleton = () => (
    <Box sx={{ mb: 6 }}>
        <Box
            sx={{
                height: 120,
                mb: 3,
                borderRadius: 3,
                bgcolor: 'action.hover',
            }}
        />
        <AdGridSkeleton count={4} height={280} />
    </Box>
);