// components/ads/TopAdsSection.tsx
import {
    Box,
    Typography,
    Grid,
    useTheme,
    alpha,
    Container,
    Button,
    Paper,
    Chip,
    Stack,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EastIcon from '@mui/icons-material/East';
import { LocalFireDepartment, Verified } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FunctionComponent } from 'react';
import { useTopAds } from '../../../hooks/ads/useFeaturedAds';
import { AdGridSkeleton } from './Adgridskeleton';
import { HomepageAdCard } from './HomepageFeaturedSection ';
import React from 'react';

// ── Constants ──────────────────────────────────────────────────────────────
const MAX_ADS = 8;

const FEATURED_META = {
    homepage: {
        label: 'صفحة رئيسية',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.10)',
    },
    top: {
        label: 'مرفوع',
        color: '#818cf8',
        bg: 'rgba(129,140,248,0.10)',
    },
    highlight: {
        label: 'مضيء',
        color: '#34d399',
        bg: 'rgba(52,211,153,0.10)',
    },
} as const;

// ── Sub-components ─────────────────────────────────────────────────────────
interface RankBadgeProps {
    rank: number;
}

const RankBadge = ({ rank }: RankBadgeProps) => {
    const theme = useTheme();
    const isTop3 = rank <= 3;

    return (
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
                    isTop3
                        ? theme.palette.warning.main
                        : theme.palette.grey[600],
                    0.9,
                ),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
            }}
        >
            <Typography sx={{ fontWeight: 800, fontSize: 14, color: 'white' }}>
                #{rank}
            </Typography>
        </Box>
    );
};

// ── Props ──────────────────────────────────────────────────────────────────
interface TopAdsSectionProps {
    featured?: boolean;
    featuredType?: keyof typeof FEATURED_META;
}

// ── Component ──────────────────────────────────────────────────────────────
const TopAdsSection: FunctionComponent<TopAdsSectionProps> = ({
    featured = false,
    featuredType = 'highlight',
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { ads: topAds, loading, error } = useTopAds();
    const featuredMeta = FEATURED_META[featuredType];

    if (loading) {
        return (
            <Box sx={{ mb: 6 }}>
                <Typography variant='h5' fontWeight={800} sx={{ mb: 3 }}>
                    أفضل الإعلانات ⭐
                </Typography>
                <AdGridSkeleton count={4} height={250} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mb: 6, textAlign: 'center', py: 4 }}>
                <Typography color='error' gutterBottom>
                    {error}
                </Typography>
                <Button
                    variant='outlined'
                    onClick={() => window.location.reload()}
                >
                    إعادة المحاولة
                </Button>
            </Box>
        );
    }

    if (topAds.length === 0) return null;

    return (
        <Container
            component={'article'}
            maxWidth='lg'
            sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Featured Banner Card */}
                <Box
                    sx={{
                        borderRadius: '16px',
                        border: '1.5px solid',
                        borderColor: featured
                            ? featuredMeta.color + '60'
                            : 'divider',
                        boxShadow: featured
                            ? `0 0 0 3px ${featuredMeta.color}18, 0 4px 24px ${featuredMeta.color}15`
                            : 'none',
                        overflow: 'hidden',
                        transition:
                            'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                        position: 'relative',
                        mb: 3,
                        '&:hover': {
                            borderColor: featured
                                ? featuredMeta.color + '90'
                                : 'text.disabled',
                            transform: featured ? 'translateY(-2px)' : 'none',
                        },
                    }}
                >
                    {/* Featured Banner */}
                    {featured && (
                        <Box
                            sx={{
                                background: `linear-gradient(90deg, ${featuredMeta.color}22, ${featuredMeta.color}08)`,
                                borderBottom: `1px solid ${featuredMeta.color}30`,
                                px: 1.5,
                                py: 0.6,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Stack
                                direction='row'
                                alignItems='center'
                                gap={0.75}
                            >
                                <LocalFireDepartment
                                    sx={{
                                        fontSize: 14,
                                        color: featuredMeta.color,
                                    }}
                                />
                                <Typography
                                    variant='caption'
                                    sx={{
                                        color: featuredMeta.color,
                                        fontWeight: 700,
                                        fontSize: '0.72rem',
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    إعلان مميز · {featuredMeta.label}
                                </Typography>
                            </Stack>

                            <Chip
                                label='موثّق'
                                size='small'
                                sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    bgcolor: featuredMeta.bg,
                                    color: featuredMeta.color,
                                    border: `1px solid ${featuredMeta.color}40`,
                                    '& .MuiChip-label': { px: 0.75 },
                                }}
                            />
                        </Box>
                    )}

                    {/* Header Content */}
                    <Box sx={{ p: 2.5 }}>
                        <Stack
                            direction='row'
                            alignItems='center'
                            justifyContent='space-between'
                            flexWrap='wrap'
                            gap={2}
                        >
                            <Stack
                                direction='row'
                                alignItems='center'
                                gap={1.5}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.1,
                                        ),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    <EmojiEventsIcon
                                        sx={{
                                            fontSize: 28,
                                            color: theme.palette.primary.main,
                                        }}
                                    />
                                    {featured && (
                                        <Verified
                                            sx={{
                                                position: 'absolute',
                                                bottom: -4,
                                                right: -4,
                                                fontSize: 18,
                                                bgcolor: 'background.paper',
                                                borderRadius: '50%',
                                                color: featuredMeta.color,
                                            }}
                                        />
                                    )}
                                </Box>

                                <Box>
                                    <Typography
                                        variant='h5'
                                        fontWeight={800}
                                        sx={{ mb: 0.5 }}
                                    >
                                        أفضل الإعلانات ⭐
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                    >
                                        الإعلانات الأكثر مشاهدة وتفاعلاً
                                    </Typography>
                                </Box>
                            </Stack>

                            <Button
                                variant='text'
                                endIcon={<EastIcon />}
                                onClick={() =>
                                    navigate('/featured-ads?type=top')
                                }
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.08,
                                        ),
                                    },
                                }}
                            >
                                عرض الكل
                            </Button>
                        </Stack>
                    </Box>

                    {/* Featured overlay gradient */}
                    {featured && (
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 60,
                                background: `linear-gradient(to top, ${featuredMeta.color}18, transparent)`,
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                </Box>

                {/* Ads Grid */}
                <Grid container spacing={2.5}>
                    {topAds.slice(0, MAX_ADS).map((ad, idx) => (
                        <Grid
                            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                            key={`top-ad-${ad._id}`}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: idx * 0.05,
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: 2,
                                    }}
                                >
                                    <RankBadge rank={idx + 1} />
                                    <HomepageAdCard ad={ad} index={idx} />
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </motion.div>
        </Container>
    );
};

export default React.memo(TopAdsSection);
