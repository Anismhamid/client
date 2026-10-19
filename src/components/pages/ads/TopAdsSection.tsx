// components/ads/TopAdsSection.tsx
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
    Divider,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { LocalFireDepartment, Verified } from '@mui/icons-material';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FunctionComponent, useMemo } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTopAds } from '../../../hooks/ads/useFeaturedAds';
import { HomepageAdCard } from './HomepageFeaturedSection';
import { path } from '../../../routes/routes';
import { AdGridSkeleton } from './Adgridskeleton';

// ✅ استيراد ملف الباقات المركزي
import { getPlanById, PLANS } from '../../../interfaces/PlanConfig';
import { AdType } from '../../../interfaces/featuredAd';

const MAX_ADS = 8;

type FeaturedType = AdType;

/* ── Rank badge — medal for top 3, neutral for the rest ─────── */
interface RankBadgeProps {
    rank: number;
}

const MEDAL_STYLES: Record<
    number,
    { gradient: string; shadow: string; icon?: true }
> = {
    1: {
        gradient: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
        shadow: '0 4px 14px -4px rgba(184, 134, 11, 0.65)',
        icon: true,
    },
    2: {
        gradient: 'linear-gradient(135deg, #E8E8E8 0%, #9CA3AF 100%)',
        shadow: '0 4px 14px -4px rgba(156, 163, 175, 0.55)',
    },
    3: {
        gradient: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)',
        shadow: '0 4px 14px -4px rgba(139, 69, 19, 0.55)',
    },
};

const RankBadge = ({ rank }: RankBadgeProps) => {
    const theme = useTheme();
    const medal = MEDAL_STYLES[rank];

    if (medal) {
        return (
            <Box
                sx={{
                    position: 'absolute',
                    top: 10,
                    insetInlineStart: 10,
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    height: 28,
                    pl: 0.5,
                    pr: 1,
                    borderRadius: '999px',
                    background: medal.gradient,
                    boxShadow: medal.shadow,
                    border: '1.5px solid rgba(255,255,255,0.85)',
                }}
            >
                <Box
                    sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(255,255,255,0.35)',
                    }}
                >
                    {medal.icon ? (
                        <WorkspacePremiumRoundedIcon
                            sx={{ fontSize: 13, color: '#fff' }}
                        />
                    ) : (
                        <Typography
                            sx={{
                                fontWeight: 900,
                                fontSize: 11,
                                color: '#fff',
                                lineHeight: 1,
                            }}
                        >
                            {rank}
                        </Typography>
                    )}
                </Box>
                <Typography
                    sx={{
                        fontWeight: 900,
                        fontSize: 11,
                        color: '#fff',
                        lineHeight: 1,
                        textShadow: '0 1px 2px rgba(0,0,0,0.25)',
                    }}
                >
                    {rank === 1 ? 'TOP' : `#${rank}`}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 10,
                insetInlineStart: 10,
                zIndex: 2,
                minWidth: 26,
                height: 24,
                px: 0.75,
                borderRadius: '999px',
                bgcolor: alpha(theme.palette.common.black, 0.6),
                backdropFilter: 'blur(6px)',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid rgba(255,255,255,0.15)',
            }}
        >
            <Typography
                sx={{
                    fontWeight: 800,
                    fontSize: 11,
                    color: '#fff',
                    lineHeight: 1,
                }}
            >
                #{rank}
            </Typography>
        </Box>
    );
};

/* ── Main section ──────────────────────────────────────────── */
interface TopAdsSectionProps {
    featured?: boolean;
    featuredType?: FeaturedType;
}

const TopAdsSection: FunctionComponent<TopAdsSectionProps> = ({
    featured = false,
    featuredType = 'highlight',
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { ads: topAds, loading } = useTopAds();

    // ✅ استخدام المصدر المركزي للباقات لجلب الألوان والتسميات
    const featuredMeta = useMemo(() => {
        const plan = getPlanById(featuredType) || PLANS[0];
        return {
            color: plan.accent,
            bg: plan.lightBg,
            label: plan.title,
        };
    }, [featuredType]);

    if (loading) {
        return (
            <Container
                maxWidth='lg'
                sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}
            >
                <Typography variant='h5' fontWeight={800} sx={{ mb: 3 }}>
                    {t('ads.topAdsSection.title')}
                </Typography>
                <AdGridSkeleton count={4} height={250} />
            </Container>
        );
    }

    if (topAds.length === 0) return null;

    return (
        <Container
            component='article'
            maxWidth='lg'
            sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}
        >
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* ── Hero banner ──────────────────────────────── */}
                <Box
                    sx={{
                        position: 'relative',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        mb: 3,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: featured
                            ? alpha(featuredMeta.color, 0.35)
                            : 'divider',
                        boxShadow: featured
                            ? `0 24px 60px -32px ${alpha(featuredMeta.color, 0.4)}`
                            : `0 12px 32px -20px ${alpha('#000', 0.15)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': featured
                            ? {
                                  borderColor: alpha(featuredMeta.color, 0.6),
                                  transform: 'translateY(-2px)',
                              }
                            : undefined,
                    }}
                >
                    {/* Top ribbon (featured) */}
                    {featured && (
                        <Box
                            sx={{
                                background: `linear-gradient(90deg, ${alpha(featuredMeta.color, 0.14)}, ${alpha(featuredMeta.color, 0.03)})`,
                                borderBottom: `1px solid ${alpha(featuredMeta.color, 0.2)}`,
                                px: 2,
                                py: 0.7,
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
                                        fontSize: 15,
                                        color: featuredMeta.color,
                                    }}
                                />
                                <Typography
                                    variant='caption'
                                    sx={{
                                        color: featuredMeta.color,
                                        fontWeight: 800,
                                        fontSize: '0.7rem',
                                        letterSpacing: 0.6,
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {t('ads.topAdsSection.featuredBadge')} ·{' '}
                                    {featuredMeta.label}
                                </Typography>
                            </Stack>

                            <Chip
                                icon={
                                    <Verified
                                        sx={{ fontSize: '12px !important' }}
                                    />
                                }
                                label={t('ads.topAdsSection.verified')}
                                size='small'
                                sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    bgcolor: featuredMeta.bg,
                                    color: featuredMeta.color,
                                    border: `1px solid ${alpha(featuredMeta.color, 0.3)}`,
                                    '& .MuiChip-icon': {
                                        color: featuredMeta.color,
                                    },
                                    '& .MuiChip-label': { px: 0.75 },
                                }}
                            />
                        </Box>
                    )}

                    {/* Gold top rule (always present) */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: featured ? 'auto' : 0,
                            insetInlineStart: 0,
                            insetInlineEnd: 0,
                            height: 3,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
                        }}
                    />

                    <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            justifyContent='space-between'
                            gap={2}
                        >
                            <Stack direction='row' alignItems='center' gap={2}>
                                {/* Trophy badge — layered with soft halo */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: 56,
                                        height: 56,
                                        flexShrink: 0,
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: -8,
                                            borderRadius: '50%',
                                            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.25)} 0%, transparent 70%)`,
                                            pointerEvents: 'none',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '16px',
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                                            display: 'grid',
                                            placeItems: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <EmojiEventsIcon
                                            sx={{
                                                fontSize: 30,
                                                color: theme.palette.primary
                                                    .main,
                                            }}
                                        />
                                        {featured && (
                                            <Verified
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: -4,
                                                    insetInlineEnd: -4,
                                                    fontSize: 18,
                                                    bgcolor: 'background.paper',
                                                    borderRadius: '50%',
                                                    color: featuredMeta.color,
                                                    border: `1.5px solid ${alpha(featuredMeta.color, 0.3)}`,
                                                    p: '2px',
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography
                                        variant='overline'
                                        sx={{
                                            display: 'block',
                                            fontWeight: 800,
                                            letterSpacing: '0.15em',
                                            fontSize: '0.65rem',
                                            color: theme.palette.primary.main,
                                            lineHeight: 1,
                                            mb: 0.5,
                                        }}
                                    >
                                        {t(
                                            'ads.topAdsSection.eyebrow',
                                            'لوحة المتصدرين',
                                        )}
                                    </Typography>
                                    <Typography
                                        variant='h5'
                                        fontWeight={900}
                                        sx={{
                                            mb: 0.5,
                                            letterSpacing: '-0.02em',
                                            lineHeight: 1.15,
                                            fontSize: {
                                                xs: '1.25rem',
                                                md: '1.5rem',
                                            },
                                        }}
                                    >
                                        {t('ads.topAdsSection.title')}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                        sx={{ fontSize: '0.85rem' }}
                                    >
                                        {t('ads.topAdsSection.subtitle')}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Button
                                variant='text'
                                endIcon={
                                    <ArrowForwardRoundedIcon
                                        sx={{
                                            transform:
                                                theme.direction === 'rtl'
                                                    ? 'scaleX(-1)'
                                                    : 'none',
                                        }}
                                    />
                                }
                                onClick={() =>
                                    navigate(`${path.FeaturedAds}?type=top`)
                                }
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.08,
                                        ),
                                    },
                                }}
                            >
                                {t('ads.topAdsSection.viewAll')}
                            </Button>
                        </Stack>
                    </Box>
                </Box>

                {/* ── "Podium divider" between banner and grid ─── */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 2.5,
                        color: 'text.disabled',
                    }}
                >
                    <Divider
                        sx={{
                            flex: 1,
                            borderColor: alpha(
                                theme.palette.primary.main,
                                0.15,
                            ),
                        }}
                    />
                    <Typography
                        variant='caption'
                        sx={{
                            fontWeight: 800,
                            letterSpacing: '0.2em',
                            fontSize: '0.6rem',
                            color: alpha(theme.palette.primary.main, 0.7),
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {t('ads.topAdsSection.rankings', 'الترتيب')}
                    </Typography>
                    <Divider
                        sx={{
                            flex: 1,
                            borderColor: alpha(
                                theme.palette.primary.main,
                                0.15,
                            ),
                        }}
                    />
                </Box>

                {/* ── Ads grid ─────────────────────────────────── */}
                <Grid container spacing={2.5}>
                    {topAds.slice(0, MAX_ADS).map((ad, idx) => (
                        <Grid
                            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                            key={`top-ad-${ad._id}`}
                        >
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: idx * 0.05,
                                }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    <RankBadge rank={idx + 1} />
                                    <HomepageAdCard ad={ad} index={idx} />
                                </Box>
                            </m.div>
                        </Grid>
                    ))}
                </Grid>
            </m.div>
        </Container>
    );
};

export default React.memo(TopAdsSection);
