import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import {
    Box,
    CardMedia,
    Chip,
    CircularProgress,
    IconButton,
    Skeleton,
    Stack,
    Typography,
    alpha,
    Tooltip,
    useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../atoms/toasts/ReactToast';
import { FeaturedAd } from '../../../interfaces/featuredAd';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import { productsPathes } from '../../../routes/routes';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { getPlanById, PLANS } from '../../../interfaces/PlanConfig';

// ✅ استيراد ملف الباقات المركزي الجديد

/* ── design tokens ──────────────────────────────────────────── */
const GOLD_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';
const AMBER = '#f59f0b';

/* ── Stat pill ──────────────────────────────────────────────── */
function StatPill({
    label,
    value,
    accent,
    divider,
}: {
    label: string;
    value: string | number;
    accent?: string;
    divider?: boolean;
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                flex: 1,
                textAlign: 'center',
                position: 'relative',
                '&::after': divider
                    ? {
                          content: '""',
                          position: 'absolute',
                          insetInlineEnd: 0,
                          top: '20%',
                          height: '60%',
                          width: 1,
                          bgcolor: isDark
                              ? 'rgba(255,255,255,0.1)'
                              : 'divider',
                      }
                    : undefined,
            }}
        >
            <Typography
                sx={{
                    fontSize: { xs: 22, sm: 26 },
                    fontWeight: 800,
                    color: accent ?? (isDark ? '#fff' : theme.palette.text.primary),
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                }}
            >
                {value}
            </Typography>
            <Typography
                variant='caption'
                sx={{
                    color: isDark
                        ? 'rgba(255,255,255,0.55)'
                        : theme.palette.text.secondary,
                    fontSize: 10.5,
                    letterSpacing: 0.4,
                    fontWeight: 600,
                }}
            >
                {label}
            </Typography>
        </Box>
    );
}

/* ── Segmented pill tab ─────────────────────────────────────── */
function PillTab({
    label,
    active,
    onClick,
    count,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
    count?: number;
}) {
    return (
        <Box
            role='tab'
            aria-selected={active}
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onClick();
            }}
            sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                py: 0.9,
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                userSelect: 'none',
                color: active ? '#fff' : 'text.secondary',
                background: active ? GOLD_GRADIENT : 'transparent',
                transition: 'background 0.25s, color 0.2s',
                boxShadow: active
                    ? `0 4px 12px -4px ${alpha('#B8860B', 0.5)}`
                    : 'none',
            }}
        >
            {label}
            {count != null && (
                <Box
                    component='span'
                    sx={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        px: 0.75,
                        py: 0.1,
                        borderRadius: 999,
                        bgcolor: active
                            ? 'rgba(255,255,255,0.2)'
                            : 'rgba(0,0,0,0.06)',
                        lineHeight: 1.4,
                    }}
                >
                    {count}
                </Box>
            )}
        </Box>
    );
}

/* ── Ad row ─────────────────────────────────────────────────── */
function AdRow({
    ad,
    onDelete,
    deleting,
}: {
    ad: FeaturedAd;
    onDelete: (id: string) => void;
    deleting: boolean;
}) {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // ✅ استخدام المصدر المركزي للباقات
    const planMeta = getPlanById(ad.type) || PLANS[0];
    const Icon = planMeta.icon;

    const fmt = (iso: string) =>
        new Date(iso).toLocaleDateString(i18n.language, {
            day: 'numeric',
            month: 'short',
        });

    const price = ad.listingId?.price;
    const listing = ad.listingId;
    const productUrl = listing
        ? `${productsPathes.postsDetails}/${listing.category}/${listing.product_name}/${listing._id}`
        : null;

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'stretch',
                gap: 0,
                bgcolor: 'background.paper',
                border: '1.5px solid',
                borderColor: ad.isActive ? alpha(planMeta.accent, 0.35) : 'divider',
                borderRadius: 3,
                overflow: 'hidden',
                opacity: ad.isActive ? 1 : 0.6,
                transition: 'all 0.25s ease',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: ad.isActive
                        ? `0 8px 20px -8px ${alpha(planMeta.accent, 0.35)}`
                        : 'none',
                    '& .row-open-icon': { opacity: 1, transform: 'translateX(0)' },
                },
            }}
        >
            <Box
                sx={{
                    width: 4,
                    flexShrink: 0,
                    background: ad.isActive ? planMeta.accent : 'divider',
                }}
            />

            <Box
                component={productUrl ? Link : 'div'}
                to={productUrl ?? undefined}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    flex: 1,
                    minWidth: 0,
                    textDecoration: 'none',
                    color: 'inherit',
                    py: '10px',
                    px: 1.5,
                }}
            >
                {listing?.image && (
                    <Box sx={{ position: 'relative', flexShrink: 0 }}>
                        <CardMedia
                            component='img'
                            image={listing.image.url}
                            alt={listing.product_name ?? t('ads.common.untitled')}
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 2,
                                objectFit: 'cover',
                                filter: ad.isActive ? 'none' : 'grayscale(0.6)',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -4,
                                insetInlineEnd: -4,
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                bgcolor: alpha(planMeta.accent, 0.15),
                                color: planMeta.accent,
                                display: 'grid',
                                placeItems: 'center',
                                border: `1.5px solid ${alpha('#fff', 0.95)}`,
                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            }}
                        >
                            <Icon sx={{ fontSize: 12 }} />
                        </Box>
                    </Box>
                )}

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction='row' alignItems='center' gap={0.75} mb={0.5}>
                        <Typography
                            variant='body2'
                            fontWeight={700}
                            noWrap
                            sx={{ color: 'primary.main', fontSize: '0.85rem' }}
                        >
                            {listing?.product_name ?? t('ads.common.untitled')}
                        </Typography>
                        <OpenInNewRoundedIcon
                            className='row-open-icon'
                            sx={{
                                fontSize: 12,
                                color: 'text.disabled',
                                opacity: 0,
                                transform: 'translateX(-4px)',
                                transition: 'all 0.2s ease',
                            }}
                        />
                    </Stack>
                    <Stack
                        direction='row'
                        alignItems='center'
                        gap={1}
                        flexWrap='wrap'
                    >
                        <Chip
                            label={planMeta.title}
                            size='small'
                            sx={{
                                bgcolor: alpha(planMeta.accent, 0.12),
                                color: isDark ? planMeta.accent : planMeta.accent,
                                fontSize: 10,
                                height: 18,
                                fontWeight: 700,
                            }}
                        />
                        {price != null && (
                            <Typography
                                variant='caption'
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 700,
                                    fontSize: 11,
                                }}
                            >
                                {formatPrice(price)}
                            </Typography>
                        )}
                        <Stack
                            direction='row'
                            alignItems='center'
                            gap={0.4}
                            sx={{ color: 'text.disabled' }}
                        >
                            <CalendarMonthRoundedIcon sx={{ fontSize: 11 }} />
                            <Typography
                                variant='caption'
                                sx={{ fontSize: 10.5 }}
                            >
                                {fmt(ad.startDate)} → {fmt(ad.endDate)}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Box>

            <Stack
                alignItems='flex-end'
                justifyContent='center'
                gap={0.4}
                flexShrink={0}
                sx={{
                    py: '10px',
                    px: 1.25,
                    borderInlineStart: `1px dashed ${alpha(
                        ad.isActive ? planMeta.accent : '#000',
                        0.15,
                    )}`,
                }}
            >
                <Chip
                    label={
                        ad.isActive
                            ? t('ads.stats.active')
                            : t('ads.stats.expired')
                    }
                    size='small'
                    sx={{
                        bgcolor: ad.isActive ? `${AMBER}22` : 'action.hover',
                        color: ad.isActive ? '#B8860B' : 'text.disabled',
                        fontSize: 10,
                        height: 18,
                        fontWeight: 700,
                    }}
                />
                <Typography
                    variant='caption'
                    sx={{
                        color: ad.isActive ? planMeta.accent : 'text.disabled',
                        fontWeight: 800,
                        fontSize: 11.5,
                    }}
                >
                    {/* ✅ استخدام سعر الباقة الجديد */}
                    ₪{ad.isActive ? planMeta.price : '—'}
                </Typography>
            </Stack>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 0.5,
                    borderInlineStart: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Tooltip title={t('ads.common.delete')}>
                    <span>
                        <IconButton
                            size='small'
                            aria-label={t('ads.common.delete')}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete(ad._id);
                            }}
                            disabled={deleting}
                            sx={{
                                color: 'text.disabled',
                                '&:hover': {
                                    color: 'error.main',
                                    bgcolor: alpha('#d32f2f', 0.08),
                                },
                            }}
                        >
                            {deleting ? (
                                <CircularProgress aria-label={t('common.loading', 'جاري التحميل')}  size={14} />
                            ) : (
                                <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                            )}
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </Box>
    );
}

/* ── Main dashboard ─────────────────────────────────────────── */
type TabFilter = 'all' | 'active' | 'expired';

export default function MyAdsDashboard() {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [ads, setAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabFilter>('all');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('featured-ads/me');
            setAds(data?.ads || []);
        } catch (err) {
            console.error(err);
            setAds([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (adId: string) => {
        setDeletingId(adId);
        try {
            await api.delete(`featured-ads/delete/${adId}`);
            await fetchAds();
            showSuccess(t('ads.common.success'));
        } catch (err) {
            console.error(err);
            showError(t('ads.common.error'));
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const counts = useMemo(
        () => ({
            all: ads.length,
            active: ads.filter((a) => a.isActive).length,
            expired: ads.filter((a) => !a.isActive).length,
        }),
        [ads],
    );

    const filtered =
        tab === 'all'
            ? ads
            : ads.filter((a) =>
                  tab === 'active' ? a.isActive : !a.isActive,
              );

    // ✅ حساب الإجمالي بناءً على الأسعار الجديدة
    const totalPaid = ads.reduce(
        (sum, a) => {
            const plan = getPlanById(a.type);
            return sum + (plan ? plan.price : 0);
        },
        0,
    );

    /* ── theme-aware ribbon colors ─────────────────────────── */
    const ribbonBg = isDark
        ? '#12161C'
        : alpha('#B8860B', 0.06);
    const ribbonBorder = isDark
        ? 'transparent'
        : alpha('#B8860B', 0.2);
    const ribbonTitleColor = isDark ? '#fff' : theme.palette.text.primary;
    const ribbonGlow = isDark
        ? alpha(AMBER, 0.18)
        : alpha(AMBER, 0.12);

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* ── Stats ribbon ─────────────── */}
            <Box
                sx={{
                    position: 'relative',
                    bgcolor: ribbonBg,
                    border: isDark ? 'none' : `1px solid ${ribbonBorder}`,
                    borderRadius: 4,
                    p: '18px 16px 16px',
                    mb: 2.5,
                    overflow: 'hidden',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '-40%',
                        insetInlineEnd: '-10%',
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${ribbonGlow} 0%, transparent 70%)`,
                        pointerEvents: 'none',
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        insetInlineStart: 0,
                        top: 0,
                        width: '100%',
                        height: 3,
                        background: GOLD_GRADIENT,
                    }}
                />
                <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    mb={2}
                    sx={{ color: ribbonTitleColor, position: 'relative' }}
                >
                    <Stack direction='row' alignItems='center' gap={1}>
                        <Box
                            sx={{
                                width: 30,
                                height: 30,
                                borderRadius: '9px',
                                bgcolor: alpha(AMBER, isDark ? 0.15 : 0.18),
                                display: 'grid',
                                placeItems: 'center',
                            }}
                        >
                            <TrendingUpRoundedIcon
                                sx={{ fontSize: 17, color: AMBER }}
                            />
                        </Box>
                        <Typography
                            variant='subtitle2'
                            fontWeight={800}
                            letterSpacing={0.2}
                        >
                            {t('ads.currentAds')}
                        </Typography>
                    </Stack>
                    <Chip
                        icon={
                            <LocalOfferOutlinedIcon
                                sx={{ fontSize: 12, color: `${AMBER} !important` }}
                            />
                        }
                        label={t('ads.promoted', 'مُروَّج')}
                        size='small'
                        sx={{
                            bgcolor: alpha(AMBER, isDark ? 0.15 : 0.18),
                            color: isDark ? AMBER : '#8B4513',
                            fontSize: 10,
                            height: 20,
                            fontWeight: 800,
                            '& .MuiChip-icon': { ml: 0.5 },
                        }}
                    />
                </Stack>
                <Stack direction='row' sx={{ position: 'relative' }}>
                    <StatPill
                        label={t('ads.stats.totalAds')}
                        value={loading ? '—' : ads.length}
                        divider
                    />
                    <StatPill
                        label={t('ads.stats.activeNow')}
                        value={loading ? '—' : counts.active}
                        accent={AMBER}
                        divider
                    />
                    <StatPill
                        label={t('ads.stats.totalPaid')}
                        value={loading ? '—' : `₪${totalPaid}`}
                    />
                </Stack>
            </Box>

            {/* ── Segmented pill tabs ─────────── */}
            <Stack
                direction='row'
                gap={0.5}
                role='tablist'
                sx={{
                    bgcolor: 'action.hover',
                    borderRadius: 999,
                    p: 0.5,
                    mb: 2.5,
                }}
            >
                <PillTab
                    label={t('ads.stats.all')}
                    active={tab === 'all'}
                    onClick={() => setTab('all')}
                    count={counts.all}
                />
                <PillTab
                    label={t('ads.stats.active')}
                    active={tab === 'active'}
                    onClick={() => setTab('active')}
                    count={counts.active}
                />
                <PillTab
                    label={t('ads.stats.expired')}
                    active={tab === 'expired'}
                    onClick={() => setTab('expired')}
                    count={counts.expired}
                />
            </Stack>

            {/* ── List ─────────────────────────── */}
            <Stack spacing={1.25}>
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            variant='rounded'
                            height={78}
                            sx={{ borderRadius: 3 }}
                        />
                    ))
                ) : filtered.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 6,
                            px: 2,
                            color: 'text.secondary',
                            border: '1.5px dashed',
                            borderColor: alpha('#B8860B', 0.25),
                            borderRadius: 3,
                            bgcolor: alpha('#B8860B', 0.03),
                        }}
                    >
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '14px',
                                bgcolor: alpha('#B8860B', 0.1),
                                color: '#B8860B',
                                display: 'grid',
                                placeItems: 'center',
                                mx: 'auto',
                                mb: 1.5,
                            }}
                        >
                            <LocalOfferOutlinedIcon sx={{ fontSize: 24 }} />
                        </Box>
                        <Typography variant='body2' fontWeight={700} mb={0.5}>
                            {t('ads.noPromotedAds')}
                        </Typography>
                        <Typography variant='caption' color='text.disabled'>
                            {t('ads.startPromoting')}
                        </Typography>
                    </Box>
                ) : (
                    filtered.map((ad) => (
                        <AdRow
                            key={ad._id}
                            ad={ad}
                            onDelete={handleDelete}
                            deleting={deletingId === ad._id}
                        />
                    ))
                )}
            </Stack>
        </Box>
    );
}