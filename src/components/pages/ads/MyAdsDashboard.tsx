import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import {
    Box,
    CardMedia,
    Chip,
    CircularProgress,
    IconButton,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../atoms/toasts/ReactToast';
import { FeaturedAd } from '../../../interfaces/featuredAd';
import {
    FEATURED_AD_ICONS,
    FEATURED_AD_PRICES,
    FEATURED_AD_TIERS,
} from '../../../interfaces/featuredAdsMeta';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import { productsPathes } from '../../../routes/routes';
import { Link } from 'react-router-dom';

/* ── design tokens (matching Merchant Passport / Profile.tsx) ── */
const INK = '#12161C';
const GOLD_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';
const AMBER = '#f59f0b';

/* ── Stat pill (lives inside the dark ribbon) ───────────────── */
function StatPill({
    label,
    value,
    accent,
}: {
    label: string;
    value: string | number;
    accent?: string;
}) {
    return (
        <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography
                sx={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: accent ?? '#fff',
                    lineHeight: 1.2,
                }}
            >
                {value}
            </Typography>
            <Typography
                variant='caption'
                sx={{ color: 'rgba(255,255,255,0.55)' }}
            >
                {label}
            </Typography>
        </Box>
    );
}

/* ── Segmented pill tab ──────────────────────────────────────── */
function PillTab({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <Box
            onClick={onClick}
            sx={{
                flex: 1,
                textAlign: 'center',
                py: 0.9,
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                userSelect: 'none',
                color: active ? '#fff' : 'text.secondary',
                background: active ? GOLD_GRADIENT : 'transparent',
                transition: 'background 0.2s, color 0.2s',
            }}
        >
            {label}
        </Box>
    );
}

/* ── Ad row ──────────────────────────────────────────────────── */
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
    const tier = FEATURED_AD_TIERS[ad.type];
    const Icon = FEATURED_AD_ICONS[ad.type];
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
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: 'background.paper',
                border: '1.5px solid',
                borderColor: ad.isActive ? `${tier.accent}55` : 'divider',
                borderRadius: 3,
                p: '10px 14px',
                opacity: ad.isActive ? 1 : 0.55,
                transition: 'opacity 0.2s, border-color 0.2s',
            }}
        >
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
                }}
            >
                {listing?.image && (
                    <CardMedia
                        component='img'
                        image={listing.image.url}
                        alt={listing.product_name ?? t('ads.common.untitled')}
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 2,
                            objectFit: 'cover',
                            flexShrink: 0,
                        }}
                    />
                )}

                {/* Icon */}
                <Box
                    sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        bgcolor: tier.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: tier.color,
                    }}
                >
                    <Icon sx={{ fontSize: 18 }} />
                </Box>

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant='body2'
                        fontWeight={700}
                        noWrap
                        mb={0.4}
                        sx={{ color: INK }}
                    >
                        {listing?.product_name ?? t('ads.common.untitled')}
                    </Typography>
                    <Stack
                        direction='row'
                        alignItems='center'
                        gap={1}
                        flexWrap='wrap'
                    >
                        <Chip
                            label={tier.label}
                            size='small'
                            sx={{
                                bgcolor: tier.bg,
                                color: tier.color,
                                fontSize: 10,
                                height: 18,
                                fontWeight: 700,
                            }}
                        />
                        {price != null && (
                            <Typography
                                variant='caption'
                                sx={{ color: 'text.disabled' }}
                            >
                                {formatPrice(price)}
                            </Typography>
                        )}
                        <Typography variant='caption' color='text.disabled'>
                            {fmt(ad.startDate)} → {fmt(ad.endDate)}
                        </Typography>
                    </Stack>
                </Box>

                {/* Status + what was paid */}
                <Stack alignItems='flex-end' gap={0.5} flexShrink={0}>
                    <Chip
                        label={
                            ad.isActive
                                ? t('ads.stats.active')
                                : t('ads.stats.expired')
                        }
                        size='small'
                        sx={{
                            bgcolor: ad.isActive
                                ? `${AMBER}22`
                                : 'action.hover',
                            color: ad.isActive ? '#B8860B' : 'text.disabled',
                            fontSize: 10,
                            height: 18,
                            fontWeight: 700,
                        }}
                    />
                    <Typography
                        variant='caption'
                        sx={{ color: tier.accent, fontWeight: 700 }}
                    >
                        ₪{ad.isActive ? FEATURED_AD_PRICES[ad.type] : '—'}
                    </Typography>
                </Stack>
            </Box>

            {/* Delete — outside the Link, own click target */}
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
                    '&:hover': { color: 'error.main' },
                }}
            >
                {deleting ? (
                    <CircularProgress size={14} />
                ) : (
                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                )}
            </IconButton>
        </Box>
    );
}

/* ── Main dashboard ──────────────────────────────────────────── */
type TabFilter = 'all' | 'active' | 'expired';
const api = import.meta.env.VITE_API_URL;

export default function MyAdsDashboard() {
    const { t } = useTranslation();
    const [ads, setAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabFilter>('all');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${api}/featured-ads/me`, {
                headers: { Authorization: localStorage.getItem('token') },
            });
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
            await axios.delete(`${api}/featured-ads/delete/${adId}`, {
                headers: { Authorization: localStorage.getItem('token') },
            });
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

    const filtered =
        tab === 'all'
            ? ads
            : ads.filter((a) => (tab === 'active' ? a.isActive : !a.isActive));

    const activeCount = ads.filter((a) => a.isActive).length;
    const totalPaid = ads.reduce(
        (sum, a) => sum + FEATURED_AD_PRICES[a.type],
        0,
    );

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Dark stats ribbon — matches Merchant Passport header */}
            <Box
                sx={{
                    bgcolor: INK,
                    borderRadius: 4,
                    p: '18px 16px',
                    mb: 2,
                    position: 'relative',
                    overflow: 'hidden',
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
                    gap={1}
                    mb={2}
                    sx={{ color: '#fff' }}
                >
                    <TrendingUpRoundedIcon
                        sx={{ fontSize: 20, color: AMBER }}
                    />
                    <Typography variant='subtitle2' fontWeight={700}>
                        {t('ads.currentAds')}
                    </Typography>
                </Stack>
                <Stack direction='row'>
                    <StatPill
                        label={t('ads.stats.totalAds')}
                        value={loading ? '—' : ads.length}
                    />
                    <StatPill
                        label={t('ads.stats.activeNow')}
                        value={loading ? '—' : activeCount}
                        accent={AMBER}
                    />
                    <StatPill
                        label={t('ads.stats.totalPaid')}
                        value={loading ? '—' : `₪${totalPaid}`}
                    />
                </Stack>
            </Box>

            {/* Segmented pill tabs */}
            <Stack
                direction='row'
                gap={0.5}
                sx={{
                    bgcolor: 'action.hover',
                    borderRadius: 999,
                    p: 0.5,
                    mb: 2,
                }}
            >
                <PillTab
                    label={t('ads.stats.all')}
                    active={tab === 'all'}
                    onClick={() => setTab('all')}
                />
                <PillTab
                    label={t('ads.stats.active')}
                    active={tab === 'active'}
                    onClick={() => setTab('active')}
                />
                <PillTab
                    label={t('ads.stats.expired')}
                    active={tab === 'expired'}
                    onClick={() => setTab('expired')}
                />
            </Stack>

            {/* List */}
            <Stack spacing={1}>
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            variant='rounded'
                            height={62}
                            sx={{ borderRadius: 3 }}
                        />
                    ))
                ) : filtered.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 5,
                            color: 'text.secondary',
                            border: '0.5px dashed',
                            borderColor: 'divider',
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant='body2' fontWeight={600} mb={0.5}>
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
