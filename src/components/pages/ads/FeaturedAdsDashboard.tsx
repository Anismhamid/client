import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    MenuItem,
    TextField,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Stack,
    Chip,
    SelectChangeEvent,
    useTheme,
    Snackbar as MuiSnackbar,
    Alert,
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import { AdType, FeaturedAd } from '../../../interfaces/featuredAd';
import useSnackbar from '../../../hooks/useSnackbar';
import { getCustomerProfilePostsBySlug } from '../../../services/postsServices';
import { useUser } from '../../../hooks/useUSer';
import { Posts } from '../../../interfaces/Posts';
import { formatDate } from '../../../helpers/dateAndPriceFormat';
import {
    FEATURED_AD_EMOJI,
    FEATURED_AD_PRICES,
    FEATURED_AD_TIERS,
} from '../../../interfaces/featuredAdsMeta';

const api = import.meta.env.VITE_API_URL;

// ✅ Correct TFunction usage — no `=> string`
const buildPlanMeta = (
    type: AdType,
    isDark: boolean,
    t: TFunction<'translation', undefined>,
) => {
    const tier = FEATURED_AD_TIERS[type];
    return {
        label: t(`ads.promotionPackages.${type}.name`),
        color: isDark ? tier.darkBg : tier.bg,
        accent: tier.accent,
        icon: FEATURED_AD_EMOJI[type],
        desc: t(`ads.promotionPackages.${type}.description`),
        price: t(`ads.promotionPackages.${type}.price`, {
            price: FEATURED_AD_PRICES[type],
        }),
    };
};

const FeaturedAdsDashboard = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { auth } = useUser();
    const { t } = useTranslation();
    const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

    const [ads, setAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userListings, setUserListings] = useState<Posts[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<AdType>('homepage');

    const [newAd, setNewAd] = useState<{
        listingId: string;
        type: AdType;
        startDate: string;
        endDate: string;
    }>({
        listingId: '',
        type: 'homepage',
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    });

    // ✅ Memoized — rebuilds only when theme or language changes
    const PLAN_META = useMemo(
        () => ({
            homepage: buildPlanMeta('homepage', isDark, t),
            top: buildPlanMeta('top', isDark, t),
            highlight: buildPlanMeta('highlight', isDark, t),
        }),
        [isDark, t],
    );

    // ── Load user's own listings ────────────────────────────────────────
    useEffect(() => {
        if (!auth?.slug) return;
        getCustomerProfilePostsBySlug(auth.slug)
            .then((res) => setUserListings(res))
            .catch((err) => {
                console.error(err);
                setUserListings([]);
            });
    }, [auth?.slug]);

    // ── Load current ads ────────────────────────────────────────────────
    const fetchAds = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    // ── Change handlers ─────────────────────────────────────────────────
    const handleTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setNewAd((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;

        if (name === 'type') {
            const adType = value as AdType;
            setNewAd((prev) => ({ ...prev, type: adType }));
            setSelectedPlan(adType);
            return;
        }

        setNewAd((prev) => ({ ...prev, [name]: value }));
    };

    const isDateRangeValid = dayjs(newAd.endDate).isAfter(
        dayjs(newAd.startDate),
    );

    // ── Submit ──────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        setSaving(true);
        try {
            const { data } = await axios.post(
                `${api}/featured-ads/buy`,
                newAd,
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    },
                },
            );
            window.location.href = data.url;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showSnackbar(
                err.response?.data?.message || t('ads.common.error'),
                'error',
            );
        } finally {
            setSaving(false);
        }
    };

    const activeCounts = ads.reduce(
        (acc, ad) => {
            if (ad?.isActive && ad?.type) {
                acc[ad.type] = (acc[ad.type] || 0) + 1;
            }
            return acc;
        },
        {} as Record<string, number>,
    );

    const plan = PLAN_META[selectedPlan];

    const textPrimary = isDark ? '#fff' : '#0f172a';
    const textSecondary = isDark ? '#94a3b8' : '#475569';
    const textTertiary = isDark ? '#64748b' : '#64748b';
    const surfaceColor = isDark
        ? 'rgba(255,255,255,0.04)'
        : 'rgba(0,0,0,0.04)';
    const borderColor = isDark
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(0,0,0,0.08)';

    const selectedCardBg = isDark
        ? `linear-gradient(135deg, ${plan.color}, #1e293b)`
        : `linear-gradient(135deg, ${plan.color}, #f8fafc)`;

    return (
        <Box
            dir="rtl"
            component="main"
            sx={{
                minHeight: '100vh',
                fontFamily: "'Cairo', 'Tajawal', sans-serif",
                py: 6,
                px: { xs: 2, md: 4 },
                position: 'relative',
                overflow: 'hidden',
                bgcolor: isDark ? 'transparent' : '#f8fafc',
                '&::before': {
                    content: '""',
                    position: 'fixed',
                    top: '-40%',
                    right: '-20%',
                    width: '70vw',
                    height: '70vw',
                    borderRadius: '50%',
                    background: isDark
                        ? 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <MuiSnackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={closeSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </MuiSnackbar>

            {/* ── Hero Header ─────────────────────────────────────────── */}
            <Box sx={{ textAlign: 'center', mb: 8, position: 'relative' }}>
                <Typography
                    variant="overline"
                    sx={{
                        color: '#f59e0b',
                        letterSpacing: 4,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'block',
                        mb: 2,
                    }}
                >
                    {t('ads.promotionPackages.title')}
                </Typography>
                <Typography
                    variant="h2"
                    sx={{
                        color: textPrimary,
                        fontWeight: 900,
                        fontSize: { xs: '2rem', md: '3.2rem' },
                        lineHeight: 1.2,
                        mb: 2,
                    }}
                >
                    {t('ads.promotionPackages.subtitle')}
                </Typography>
                <Typography
                    sx={{
                        color: textSecondary,
                        maxWidth: 520,
                        mx: 'auto',
                        fontSize: '1.05rem',
                    }}
                >
                    {t('ads.promotionPackages.description')}
                </Typography>
            </Box>

            {/* ── Plan Cards ──────────────────────────────────────────── */}
            <Grid
                container
                spacing={3}
                justifyContent="center"
                sx={{ mb: 8 }}
            >
                {(Object.entries(PLAN_META) as [AdType, typeof plan][]).map(
                    ([key, meta]) => {
                        const isSelected = selectedPlan === key;
                        const count = activeCounts[key] || 0;
                        return (
                            <Grid size={{ xs: 12, sm: 4 }} key={key}>
                                <Box
                                    onClick={() => {
                                        setSelectedPlan(key);
                                        setNewAd((p) => ({
                                            ...p,
                                            type: key,
                                        }));
                                    }}
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: 4,
                                        p: 3.5,
                                        height: '100%',
                                        background: isSelected
                                            ? selectedCardBg
                                            : surfaceColor,
                                        border: `2px solid ${isSelected ? meta.accent : borderColor}`,
                                        boxShadow: isSelected
                                            ? `0 0 40px ${meta.accent}30`
                                            : isDark
                                              ? 'none'
                                              : '0 4px 12px rgba(0,0,0,0.05)',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            border: `2px solid ${meta.accent}80`,
                                            transform: 'translateY(-4px)',
                                            boxShadow: isDark
                                                ? '0 8px 30px rgba(0,0,0,0.3)'
                                                : '0 8px 30px rgba(0,0,0,0.1)',
                                        },
                                    }}
                                >
                                    {isSelected && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 16,
                                                left: 16,
                                                background: meta.accent,
                                                color: isDark
                                                    ? '#000'
                                                    : '#fff',
                                                fontSize: '0.65rem',
                                                fontWeight: 800,
                                                px: 1.5,
                                                py: 0.4,
                                                borderRadius: 10,
                                                letterSpacing: 1,
                                            }}
                                        >
                                            {t('ads.common.selected')}
                                        </Box>
                                    )}
                                    <Typography
                                        sx={{ fontSize: '2.2rem', mb: 1.5 }}
                                    >
                                        {meta.icon}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: textPrimary,
                                            fontWeight: 800,
                                            fontSize: '1.2rem',
                                            mb: 1,
                                        }}
                                    >
                                        {meta.label}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: textSecondary,
                                            fontSize: '0.88rem',
                                            mb: 2,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {meta.desc}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: meta.accent,
                                            fontWeight: 800,
                                            fontSize: '1.1rem',
                                            mb: 1,
                                        }}
                                    >
                                        {meta.price}
                                    </Typography>
                                    {count > 0 && (
                                        <Chip
                                            label={t(
                                                'ads.stats.activeCount',
                                                { count },
                                            )}
                                            size="small"
                                            sx={{
                                                background: `${meta.accent}20`,
                                                color: meta.accent,
                                                border: `1px solid ${meta.accent}40`,
                                                fontWeight: 700,
                                                fontSize: '0.75rem',
                                            }}
                                        />
                                    )}
                                </Box>
                            </Grid>
                        );
                    },
                )}
            </Grid>

            {/* ── Purchase Form ───────────────────────────────────────── */}
            <Box sx={{ maxWidth: 820, mx: 'auto', mb: 8 }}>
                <Box
                    sx={{
                        borderRadius: 4,
                        p: { xs: 3, md: 5 },
                        background: isDark
                            ? 'rgba(255,255,255,0.04)'
                            : 'rgba(255,255,255,0.9)',
                        border: `1px solid ${plan.accent}30`,
                        backdropFilter: isDark ? 'blur(20px)' : 'none',
                        boxShadow: isDark
                            ? `0 0 60px ${plan.accent}10`
                            : '0 8px 40px rgba(0,0,0,0.08)',
                        transition:
                            'box-shadow 0.4s ease, border-color 0.4s ease',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 4,
                        }}
                    >
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 3,
                                background: `${plan.accent}20`,
                                border: `1px solid ${plan.accent}40`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                            }}
                        >
                            {plan.icon}
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    color: textPrimary,
                                    fontWeight: 800,
                                    fontSize: '1.2rem',
                                }}
                            >
                                {t('ads.purchase.title')} — {plan.label}
                            </Typography>
                            <Typography
                                sx={{
                                    color: textTertiary,
                                    fontSize: '0.85rem',
                                }}
                            >
                                {t('ads.purchase.subtitle')}
                            </Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={2.5}>
                        {/* Listing select */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: textTertiary }}>
                                    {t('ads.purchase.selectListing')}
                                </InputLabel>
                                <Select
                                    name="listingId"
                                    value={newAd.listingId}
                                    onChange={handleSelectChange}
                                    label={t('ads.purchase.selectListing')}
                                    sx={selectSx(plan.accent, isDark)}
                                >
                                    {userListings.map((listing) => (
                                        <MenuItem
                                            key={listing._id}
                                            value={listing._id}
                                        >
                                            {listing.product_name ||
                                                t('ads.common.untitled')}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Type select */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: textTertiary }}>
                                    {t('ads.purchase.selectPromotion')}
                                </InputLabel>
                                <Select
                                    name="type"
                                    value={newAd.type}
                                    onChange={handleSelectChange}
                                    label={t(
                                        'ads.purchase.selectPromotion',
                                    )}
                                    sx={selectSx(plan.accent, isDark)}
                                >
                                    <MenuItem value="homepage">
                                        {FEATURED_AD_EMOJI.homepage}{' '}
                                        {PLAN_META.homepage.label}
                                    </MenuItem>
                                    <MenuItem value="top">
                                        {FEATURED_AD_EMOJI.top}{' '}
                                        {PLAN_META.top.label}
                                    </MenuItem>
                                    <MenuItem value="highlight">
                                        {FEATURED_AD_EMOJI.highlight}{' '}
                                        {PLAN_META.highlight.label}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Dates */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label={t('ads.purchase.startDate')}
                                type="date"
                                name="startDate"
                                value={newAd.startDate}
                                onChange={handleTextChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                sx={inputSx(plan.accent, isDark)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label={t('ads.purchase.endDate')}
                                type="date"
                                name="endDate"
                                value={newAd.endDate}
                                onChange={handleTextChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                error={!isDateRangeValid}
                                sx={inputSx(plan.accent, isDark)}
                            />
                        </Grid>

                        {/* Duration info */}
                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 2,
                                    borderRadius: 3,
                                    background: isDateRangeValid
                                        ? `${plan.accent}10`
                                        : 'rgba(239,68,68,0.1)',
                                    border: `1px solid ${
                                        isDateRangeValid
                                            ? `${plan.accent}25`
                                            : 'rgba(239,68,68,0.3)'
                                    }`,
                                }}
                            >
                                {isDateRangeValid ? (
                                    <>
                                        <Typography
                                            sx={{
                                                color: textSecondary,
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {t('ads.purchase.duration')}:{' '}
                                            <strong
                                                style={{
                                                    color: textPrimary,
                                                }}
                                            >
                                                {dayjs(newAd.endDate).diff(
                                                    dayjs(newAd.startDate),
                                                    'day',
                                                )}{' '}
                                                {t('ads.purchase.days')}
                                            </strong>
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: plan.accent,
                                                fontWeight: 800,
                                                fontSize: '1rem',
                                            }}
                                        >
                                            {plan.price}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography
                                        sx={{
                                            color: '#ef4444',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {t(
                                            'ads.purchase.invalidDateRange',
                                        )}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>

                        {/* Submit */}
                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={
                                    !newAd.listingId ||
                                    !isDateRangeValid ||
                                    saving
                                }
                                onClick={handleSubmit}
                                sx={{
                                    py: 1.8,
                                    borderRadius: 3,
                                    fontSize: '1.05rem',
                                    fontWeight: 800,
                                    fontFamily: 'inherit',
                                    background: `linear-gradient(90deg, ${plan.accent}, ${plan.accent}cc)`,
                                    color: isDark ? '#000' : '#fff',
                                    boxShadow: `0 4px 30px ${plan.accent}40`,
                                    '&:hover': {
                                        background: `linear-gradient(90deg, ${plan.accent}ee, ${plan.accent})`,
                                        boxShadow: `0 6px 40px ${plan.accent}60`,
                                        transform: 'translateY(-1px)',
                                    },
                                    '&:disabled': {
                                        opacity: 0.5,
                                        color: isDark ? '#000' : '#fff',
                                    },
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                {saving ? (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: isDark
                                                ? '#000'
                                                : '#fff',
                                        }}
                                    />
                                ) : (
                                    `${t('ads.purchase.payNow')} — ${plan.price}`
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* ── My Current Ads ──────────────────────────────────────── */}
            <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
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
                    <Typography
                        sx={{
                            color: textPrimary,
                            fontWeight: 800,
                            fontSize: '1.3rem',
                        }}
                    >
                        {t('ads.currentAds')}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        {(
                            Object.entries(PLAN_META) as [AdType, typeof plan][]
                        ).map(([key, meta]) => (
                            <Chip
                                key={key}
                                label={`${meta.icon} ${activeCounts[key] || 0}`}
                                size="small"
                                sx={{
                                    background: `${meta.accent}15`,
                                    color: meta.accent,
                                    border: `1px solid ${meta.accent}30`,
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                }}
                            />
                        ))}
                    </Stack>
                </Box>

                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            py: 8,
                        }}
                    >
                        <CircularProgress sx={{ color: '#f59e0b' }} />
                    </Box>
                ) : ads.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 10,
                            borderRadius: 4,
                            border: `1px dashed ${borderColor}`,
                            bgcolor: surfaceColor,
                        }}
                    >
                        <Typography sx={{ fontSize: '3rem', mb: 2 }}>
                            📭
                        </Typography>
                        <Typography
                            sx={{ color: textSecondary, fontSize: '1rem' }}
                        >
                            {t('ads.noPromotedAds')}
                        </Typography>
                        <Typography
                            sx={{
                                color: textTertiary,
                                fontSize: '0.85rem',
                                mt: 1,
                            }}
                        >
                            {t('ads.startPromoting')}
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2.5}>
                        {ads.map((ad) => {
                            const isActive =
                                ad.isActive &&
                                dayjs().isBefore(dayjs(ad.endDate));
                            const meta =
                                PLAN_META[ad.type] || PLAN_META.homepage;
                            const daysLeft = dayjs(ad.endDate).diff(
                                dayjs(),
                                'day',
                            );
                            return (
                                <Grid
                                    size={{ xs: 12, sm: 6, md: 4 }}
                                    key={ad._id}
                                >
                                    <Box
                                        sx={{
                                            borderRadius: 3,
                                            p: 3,
                                            background: isActive
                                                ? isDark
                                                    ? `linear-gradient(135deg, ${meta.color}cc, #1e293b)`
                                                    : `linear-gradient(135deg, ${meta.color}, #f8fafc)`
                                                : surfaceColor,
                                            border: `1px solid ${
                                                isActive
                                                    ? meta.accent + '40'
                                                    : borderColor
                                            }`,
                                            transition:
                                                'transform 0.2s ease, box-shadow 0.2s ease',
                                            boxShadow: isDark
                                                ? 'none'
                                                : '0 2px 8px rgba(0,0,0,0.04)',
                                            '&:hover': {
                                                transform:
                                                    'translateY(-3px)',
                                                boxShadow: isDark
                                                    ? '0 8px 30px rgba(0,0,0,0.3)'
                                                    : '0 8px 30px rgba(0,0,0,0.08)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent:
                                                    'space-between',
                                                mb: 2,
                                            }}
                                        >
                                            <Typography
                                                sx={{ fontSize: '1.6rem' }}
                                            >
                                                {meta.icon}
                                            </Typography>
                                            <Chip
                                                label={
                                                    isActive
                                                        ? t(
                                                              'ads.stats.activeDaysLeft',
                                                              {
                                                                  count: daysLeft,
                                                              },
                                                          )
                                                        : t(
                                                              'ads.stats.expired',
                                                          )
                                                }
                                                size="small"
                                                sx={{
                                                    background: isActive
                                                        ? `${meta.accent}20`
                                                        : isDark
                                                          ? 'rgba(239,68,68,0.15)'
                                                          : 'rgba(239,68,68,0.1)',
                                                    color: isActive
                                                        ? meta.accent
                                                        : '#f87171',
                                                    border: `1px solid ${
                                                        isActive
                                                            ? meta.accent +
                                                              '40'
                                                            : '#f8717140'
                                                    }`,
                                                    fontWeight: 700,
                                                    fontSize: '0.72rem',
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            sx={{
                                                color: textPrimary,
                                                fontWeight: 700,
                                                mb: 0.5,
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            {ad.listingId?.product_name ||
                                                t('ads.common.untitled')}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: meta.accent,
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                mb: 1.5,
                                            }}
                                        >
                                            {meta.label}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: textTertiary,
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            {formatDate(ad.startDate)} ←{' '}
                                            {formatDate(ad.endDate)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

// ─── Shared style helpers ────────────────────────────────────────────────
const selectSx = (accent: string, isDark: boolean) => ({
    color: isDark ? '#e2e8f0' : '#0f172a',
    '.MuiOutlinedInput-notchedOutline': {
        borderColor: isDark
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(0,0,0,0.12)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: `${accent}60`,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: accent,
    },
    '.MuiSvgIcon-root': { color: isDark ? '#64748b' : '#94a3b8' },
});

const inputSx = (accent: string, isDark: boolean) => ({
    '& .MuiInputBase-root': { color: isDark ? '#e2e8f0' : '#0f172a' },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isDark
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(0,0,0,0.12)',
    },
    '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: `${accent}60`,
    },
    '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: accent,
    },
    '& .MuiInputLabel-root': { color: isDark ? '#64748b' : '#94a3b8' },
    '& .MuiInputLabel-root.Mui-focused': { color: accent },
    '& input': { colorScheme: isDark ? 'dark' : 'light' },
});

export default FeaturedAdsDashboard;