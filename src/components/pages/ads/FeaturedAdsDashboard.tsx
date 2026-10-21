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
    Divider,
    alpha,
    Paper,
} from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

import { AdType, FeaturedAd } from '../../../interfaces/featuredAd';
import useSnackbar from '../../../hooks/useSnackbar';
import { getCustomerProfilePostsBySlug } from '../../../services/postsServices';
import { useUser } from '../../../hooks/useUSer';
import { Posts } from '../../../interfaces/Posts';
import { formatDate } from '../../../helpers/dateAndPriceFormat';
import api from '../../../services/api';

// ✅ استيراد ملف الباقات المركزي الجديد
import { getPlanById, PlanConfig, PLANS } from '../../../interfaces/PlanConfig';

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

    // الباقة المختارة افتراضياً هي الأرخص (أول عنصر في المصفوفة)
    const [selectedPlan, setSelectedPlan] = useState<AdType>(PLANS[0].id);

    const [newAd, setNewAd] = useState<{
        listingId: string;
        type: AdType;
        startDate: string;
        endDate: string;
    }>({
        listingId: '',
        type: PLANS[0].id,
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    });

    useEffect(() => {
        if (!auth?.slug) return;
        getCustomerProfilePostsBySlug(auth.slug)
            .then((res) => setUserListings(res))
            .catch((err) => {
                console.error(err);
                setUserListings([]);
            });
    }, [auth?.slug]);

    const fetchAds = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/featured-ads/me');
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
    const durationDays = dayjs(newAd.endDate).diff(
        dayjs(newAd.startDate),
        'day',
    );

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const { data } = await api.post('featured-ads/buy', newAd);
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

    const activeCounts = useMemo(
        () =>
            ads.reduce(
                (acc, ad) => {
                    if (ad?.isActive && ad?.type) {
                        acc[ad.type] = (acc[ad.type] || 0) + 1;
                    }
                    return acc;
                },
                {} as Record<string, number>,
            ),
        [ads],
    );

    // جلب تفاصيل الخطة المختارة حالياً من المصدر المركزي
    const currentPlan = getPlanById(selectedPlan) || PLANS[0];

    const textPrimary = isDark ? '#fff' : '#0f172a';
    const textSecondary = isDark ? '#94a3b8' : '#475569';
    const textTertiary = isDark ? '#64748b' : '#64748b';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const amber = '#f59e0b';

    return (
        <Box
            dir='rtl'
            component='main'
            sx={{
                minHeight: '100vh',
                fontFamily: "'Cairo', 'Tajawal', sans-serif",
                py: { xs: 4, md: 6 },
                px: { xs: 2, md: 4 },
                position: 'relative',
                overflow: 'hidden',
                bgcolor: isDark ? 'transparent' : '#fafaf7',
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
                        : 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)',
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

            {/* ── Editorial masthead ──────────────────────────────────── */}
            <Box
                sx={{
                    textAlign: 'center',
                    mb: { xs: 6, md: 8 },
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        mx: 'auto',
                        mb: 2.5,
                        borderRadius: '18px',
                        background: `linear-gradient(135deg, ${amber}, ${alpha(amber, 0.6)})`,
                        display: 'grid',
                        placeItems: 'center',
                        boxShadow: `0 16px 32px -16px ${alpha(amber, 0.7)}`,
                        position: 'relative',
                        transform: 'rotate(-6deg)',
                    }}
                >
                    <LocalOfferOutlinedIcon
                        sx={{ fontSize: 28, color: '#fff' }}
                    />
                    <VerifiedRoundedIcon
                        sx={{
                            position: 'absolute',
                            bottom: -6,
                            insetInlineEnd: -6,
                            fontSize: 20,
                            color: '#fff',
                            bgcolor: '#3E7B6A',
                            borderRadius: '50%',
                            p: '3px',
                            border: '2px solid',
                            borderColor: isDark ? '#12161C' : '#fafaf7',
                        }}
                    />
                </Box>

                <Typography
                    variant='overline'
                    sx={{
                        color: amber,
                        letterSpacing: 5,
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        display: 'block',
                        mb: 1.5,
                    }}
                >
                    {t('ads.promotionPackages.title')}
                </Typography>
                <Typography
                    variant='h2'
                    sx={{
                        color: textPrimary,
                        fontWeight: 900,
                        fontSize: { xs: '1.9rem', md: '3rem' },
                        lineHeight: 1.15,
                        mb: 2,
                        letterSpacing: '-0.02em',
                    }}
                >
                    {t('ads.promotionPackages.subtitle')}
                </Typography>
                <Typography
                    sx={{
                        color: textSecondary,
                        maxWidth: 560,
                        mx: 'auto',
                        fontSize: '1rem',
                        lineHeight: 1.7,
                    }}
                >
                    {t('ads.promotionPackages.description')}
                </Typography>
            </Box>

            {/* ── Plan Cards (The Selector) ────────────────────────── */}
            <Grid
                container
                spacing={3}
                justifyContent='center'
                alignItems='stretch'
                sx={{ mb: { xs: 6, md: 8 } }}
            >
                {PLANS.map((meta: PlanConfig) => {
                    const isSelected = selectedPlan === meta.id;
                    const Icon = meta.icon;

                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={meta.id}>
                            <Box
                                onClick={() => {
                                    setSelectedPlan(meta.id);
                                    setNewAd((p) => ({ ...p, type: meta.id }));
                                }}
                                sx={{
                                    position: 'relative',
                                    cursor: 'pointer',
                                    height: '100%',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    bgcolor: 'background.paper',
                                    border: '2px solid',
                                    borderColor: isSelected
                                        ? meta.accent
                                        : borderColor,
                                    boxShadow: isSelected
                                        ? `0 20px 50px -12px ${alpha(meta.accent, 0.4)}`
                                        : 'none',
                                    transform: isSelected
                                        ? 'translateY(-6px)'
                                        : 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: isSelected
                                            ? 'translateY(-6px)'
                                            : 'translateY(-4px)',
                                        borderColor: isSelected
                                            ? meta.accent
                                            : alpha(meta.accent, 0.5),
                                    },
                                }}
                            >
                                {/* شريط علوي */}
                                <Box
                                    sx={{
                                        height: 5,
                                        background: isSelected
                                            ? meta.accent
                                            : alpha(meta.accent, 0.3),
                                    }}
                                />

                                {/* شارة "مختار" */}
                                {isSelected && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 20,
                                            insetInlineEnd: 20,
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: '20px',
                                            bgcolor: meta.accent,
                                            color: isDark ? '#000' : '#fff',
                                            fontSize: '0.75rem',
                                            fontWeight: 900,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            boxShadow: `0 4px 12px -4px ${alpha(meta.accent, 0.6)}`,
                                        }}
                                    >
                                        <CheckRoundedIcon
                                            sx={{ fontSize: 14 }}
                                        />
                                        مختار
                                    </Box>
                                )}

                                {/* شارة "الأكثر شعبية" */}
                                {meta.recommended && !isSelected && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 20,
                                            insetInlineEnd: 20,
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: '20px',
                                            bgcolor: alpha(meta.accent, 0.15),
                                            color: meta.accent,
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            border: `1px solid ${alpha(meta.accent, 0.3)}`,
                                        }}
                                    >
                                        الأكثر شعبية
                                    </Box>
                                )}

                                <Box sx={{ p: { xs: 3, md: 3.5 } }}>
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '18px',
                                            bgcolor: alpha(
                                                meta.accent,
                                                isSelected ? 0.15 : 0.08,
                                            ),
                                            display: 'grid',
                                            placeItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <Icon
                                            sx={{
                                                fontSize: 30,
                                                color: meta.accent,
                                            }}
                                        />
                                    </Box>

                                    <Typography
                                        sx={{
                                            color: textPrimary,
                                            fontWeight: 900,
                                            fontSize: '1.25rem',
                                            mb: 0.5,
                                        }}
                                    >
                                        {meta.title}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: textSecondary,
                                            fontSize: '0.9rem',
                                            mb: 3,
                                            minHeight: 44,
                                        }}
                                    >
                                        {meta.description}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'baseline',
                                            gap: 0.75,
                                            mb: 3,
                                            pb: 2,
                                            borderBottom: `1px dashed ${alpha(meta.accent, 0.25)}`,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: meta.accent,
                                                fontWeight: 900,
                                                fontSize: '2rem',
                                                lineHeight: 1,
                                            }}
                                        >
                                            ₪{meta.price}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: textTertiary,
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            / {meta.days} أيام
                                        </Typography>
                                    </Box>

                                    <Stack spacing={1.25} sx={{ mb: 3 }}>
                                        {meta.perks.map((perk, i) => (
                                            <Stack
                                                key={i}
                                                direction='row'
                                                alignItems='center'
                                                gap={1}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 18,
                                                        height: 18,
                                                        borderRadius: '50%',
                                                        bgcolor: alpha(
                                                            meta.accent,
                                                            0.15,
                                                        ),
                                                        color: meta.accent,
                                                        display: 'grid',
                                                        placeItems: 'center',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <CheckRoundedIcon
                                                        sx={{ fontSize: 12 }}
                                                    />
                                                </Box>
                                                <Typography
                                                    sx={{
                                                        color: textSecondary,
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    {perk}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>

                                    <Button
                                        fullWidth
                                        variant={
                                            isSelected
                                                ? 'contained'
                                                : 'outlined'
                                        }
                                        sx={{
                                            py: 1,
                                            borderRadius: '12px',
                                            fontWeight: 800,
                                            fontSize: '0.85rem',
                                            bgcolor: isSelected
                                                ? meta.accent
                                                : 'transparent',
                                            color: isSelected
                                                ? isDark
                                                    ? '#000'
                                                    : '#fff'
                                                : meta.accent,
                                            borderColor: alpha(
                                                meta.accent,
                                                0.4,
                                            ),
                                            '&:hover': {
                                                bgcolor: isSelected
                                                    ? alpha(meta.accent, 0.9)
                                                    : alpha(meta.accent, 0.05),
                                            },
                                        }}
                                    >
                                        {isSelected
                                            ? 'تم الاختيار'
                                            : 'اختيار هذه الباقة'}
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>

            {/* ── Checkout panel (receipt) ──────────────────────────── */}
            <Box sx={{ maxWidth: 860, mx: 'auto', mb: { xs: 6, md: 8 } }}>
                <Paper
                    elevation={0}
                    sx={{
                        position: 'relative',
                        borderRadius: '24px',
                        p: { xs: 3, md: 4.5 },
                        bgcolor: isDark
                            ? 'rgba(255,255,255,0.04)'
                            : 'background.paper',
                        border: `1px solid ${alpha(currentPlan.accent, 0.25)}`,
                        backdropFilter: isDark ? 'blur(20px)' : 'none',
                        boxShadow: isDark
                            ? `0 24px 60px -32px ${alpha(currentPlan.accent, 0.25)}`
                            : '0 20px 60px -32px rgba(0,0,0,0.15)',
                        overflow: 'hidden',
                        transition:
                            'border-color 0.4s ease, box-shadow 0.4s ease',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            insetInlineStart: 0,
                            insetInlineEnd: 0,
                            height: 4,
                            background: `linear-gradient(90deg, ${currentPlan.accent}, ${alpha(currentPlan.accent, 0.3)})`,
                        },
                    }}
                >
                    <Stack
                        direction='row'
                        alignItems='center'
                        justifyContent='space-between'
                        flexWrap='wrap'
                        gap={2}
                        sx={{ mb: 3 }}
                    >
                        <Stack direction='row' alignItems='center' gap={2}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '14px',
                                    bgcolor: alpha(currentPlan.accent, 0.12),
                                    border: `1px solid ${alpha(currentPlan.accent, 0.3)}`,
                                    display: 'grid',
                                    placeItems: 'center',
                                    fontSize: '1.5rem',
                                }}
                            >
                                {/* هنا استخدمنا الأيقونة كـ Component وليس كنص */}
                                <currentPlan.icon
                                    sx={{
                                        fontSize: 24,
                                        color: currentPlan.accent,
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: textPrimary,
                                        fontWeight: 900,
                                        fontSize: '1.1rem',
                                        mb: 0.25,
                                    }}
                                >
                                    {t('ads.purchase.title')} —{' '}
                                    {currentPlan.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: textTertiary,
                                        fontSize: '0.82rem',
                                    }}
                                >
                                    {t('ads.purchase.subtitle')}
                                </Typography>
                            </Box>
                        </Stack>
                        <Chip
                            icon={
                                <ReceiptLongRoundedIcon
                                    sx={{ fontSize: '14px !important' }}
                                />
                            }
                            label={t('ads.purchase.summary', 'ملخص الطلب')}
                            size='small'
                            sx={{
                                bgcolor: alpha(currentPlan.accent, 0.1),
                                color: currentPlan.accent,
                                border: `1px solid ${alpha(currentPlan.accent, 0.25)}`,
                                fontWeight: 800,
                                fontSize: '0.72rem',
                                '& .MuiChip-icon': {
                                    color: currentPlan.accent,
                                },
                            }}
                        />
                    </Stack>

                    <Divider
                        sx={{
                            mb: 3,
                            borderStyle: 'dashed',
                            borderColor: alpha(currentPlan.accent, 0.2),
                        }}
                    />

                    {/* Form */}
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: textTertiary }}>
                                    {t('ads.purchase.selectListing')}
                                </InputLabel>
                                <Select
                                    name='listingId'
                                    value={newAd.listingId}
                                    onChange={handleSelectChange}
                                    label={t('ads.purchase.selectListing')}
                                    sx={selectSx(currentPlan.accent, isDark)}
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

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: textTertiary }}>
                                    {t('ads.purchase.selectPromotion')}
                                </InputLabel>
                                <Select
                                    name='type'
                                    value={newAd.type}
                                    onChange={handleSelectChange}
                                    label={t('ads.purchase.selectPromotion')}
                                    sx={selectSx(currentPlan.accent, isDark)}
                                >
                                    {/* ✅ جلب الباقات من PLANS المرتبة */}
                                    {PLANS.map(
                                        (
                                            p: PlanConfig, // <--- أضف : PlanConfig هنا
                                        ) => (
                                            <MenuItem key={p.id} value={p.id}>
                                                {p.emoji} {p.title}
                                            </MenuItem>
                                        ),
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label={t('ads.purchase.startDate')}
                                type='date'
                                name='startDate'
                                value={newAd.startDate}
                                onChange={handleTextChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                sx={inputSx(currentPlan.accent, isDark)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label={t('ads.purchase.endDate')}
                                type='date'
                                name='endDate'
                                value={newAd.endDate}
                                onChange={handleTextChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                error={!isDateRangeValid}
                                sx={inputSx(currentPlan.accent, isDark)}
                            />
                        </Grid>

                        {/* Summary */}
                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 1.5,
                                    p: 2.25,
                                    borderRadius: '14px',
                                    background: isDateRangeValid
                                        ? alpha(currentPlan.accent, 0.06)
                                        : 'rgba(239,68,68,0.08)',
                                    border: `1px dashed ${isDateRangeValid ? alpha(currentPlan.accent, 0.3) : 'rgba(239,68,68,0.35)'}`,
                                }}
                            >
                                {isDateRangeValid ? (
                                    <>
                                        <Stack
                                            direction='row'
                                            alignItems='center'
                                            gap={1}
                                        >
                                            <CalendarMonthRoundedIcon
                                                sx={{
                                                    fontSize: 18,
                                                    color: currentPlan.accent,
                                                }}
                                            />
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
                                                    {durationDays}{' '}
                                                    {t('ads.purchase.days')}
                                                </strong>
                                            </Typography>
                                        </Stack>
                                        <Typography
                                            sx={{
                                                color: currentPlan.accent,
                                                fontWeight: 900,
                                                fontSize: '1.15rem',
                                            }}
                                        >
                                            ₪{currentPlan.price}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography
                                        sx={{
                                            color: '#ef4444',
                                            fontSize: '0.9rem',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {t('ads.purchase.invalidDateRange')}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>

                        {/* Submit */}
                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant='contained'
                                fullWidth
                                disabled={
                                    !newAd.listingId ||
                                    !isDateRangeValid ||
                                    saving
                                }
                                onClick={handleSubmit}
                                sx={{
                                    py: 1.8,
                                    borderRadius: '14px',
                                    fontSize: '1rem',
                                    fontWeight: 900,
                                    fontFamily: 'inherit',
                                    letterSpacing: 0.3,
                                    background: `linear-gradient(135deg, ${currentPlan.accent}, ${alpha(currentPlan.accent, 0.85)})`,
                                    color: isDark ? '#000' : '#fff',
                                    boxShadow: `0 12px 32px -12px ${alpha(currentPlan.accent, 0.7)}`,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${currentPlan.accent}ee, ${currentPlan.accent})`,
                                        boxShadow: `0 16px 40px -12px ${alpha(currentPlan.accent, 0.85)}`,
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
                                        aria-label={t(
                                            'common.loading',
                                            'جاري التحميل',
                                        )}
                                        size={22}
                                        sx={{ color: isDark ? '#000' : '#fff' }}
                                    />
                                ) : (
                                    `${t('ads.purchase.payNow')} — ₪${currentPlan.price}`
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* ── Current ads ───────────────────────────────────────── */}
            <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
                <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    flexWrap='wrap'
                    gap={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography
                            variant='overline'
                            sx={{
                                display: 'block',
                                fontWeight: 800,
                                letterSpacing: '0.18em',
                                fontSize: '0.62rem',
                                color: currentPlan.accent,
                                lineHeight: 1,
                                mb: 0.5,
                            }}
                        >
                            {t('ads.yourPromotions', 'ترقياتك')}
                        </Typography>
                        <Typography
                            sx={{
                                color: textPrimary,
                                fontWeight: 900,
                                fontSize: '1.3rem',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            {t('ads.currentAds')}
                        </Typography>
                    </Box>
                    <Stack direction='row' spacing={1}>
                        {/* ✅ استخدام PLANS بدلاً من PLAN_META */}
                        {PLANS.map((meta: PlanConfig) => (
                            <Chip
                                key={meta.id}
                                label={`${meta.emoji} ${activeCounts[meta.id] || 0}`}
                                size='small'
                                sx={{
                                    background: alpha(meta.accent, 0.1),
                                    color: meta.accent,
                                    border: `1px solid ${alpha(meta.accent, 0.3)}`,
                                    fontWeight: 800,
                                    fontSize: '0.75rem',
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>

                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            py: 8,
                        }}
                    >
                        <CircularProgress aria-label={t('common.loading', 'جاري التحميل')}  sx={{ color: amber }} />
                    </Box>
                ) : ads.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            px: 2,
                            borderRadius: '20px',
                            border: `1.5px dashed ${alpha(amber, 0.3)}`,
                            bgcolor: alpha(amber, 0.03),
                        }}
                    >
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '16px',
                                bgcolor: alpha(amber, 0.1),
                                color: amber,
                                display: 'grid',
                                placeItems: 'center',
                                mx: 'auto',
                                mb: 2,
                            }}
                        >
                            <LocalOfferOutlinedIcon sx={{ fontSize: 26 }} />
                        </Box>
                        <Typography
                            sx={{
                                color: textSecondary,
                                fontWeight: 700,
                                fontSize: '1rem',
                                mb: 0.5,
                            }}
                        >
                            {t('ads.noPromotedAds')}
                        </Typography>
                        <Typography
                            sx={{ color: textTertiary, fontSize: '0.85rem' }}
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
                            // جلب تفاصيل الخطة الخاصة بهذا الإعلان
                            const meta = getPlanById(ad.type) || PLANS[0];
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
                                            position: 'relative',
                                            borderRadius: '16px',
                                            p: 2.5,
                                            bgcolor: 'background.paper',
                                            border: '1.5px solid',
                                            borderColor: isActive
                                                ? alpha(meta.accent, 0.35)
                                                : borderColor,
                                            opacity: isActive ? 1 : 0.7,
                                            overflow: 'hidden',
                                            boxShadow: isActive
                                                ? `0 8px 24px -16px ${alpha(meta.accent, 0.4)}`
                                                : 'none',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                insetInlineStart: 0,
                                                top: 0,
                                                bottom: 0,
                                                width: 3,
                                                bgcolor: isActive
                                                    ? meta.accent
                                                    : 'divider',
                                            },
                                        }}
                                    >
                                        <Stack
                                            direction='row'
                                            justifyContent='space-between'
                                            alignItems='center'
                                            mb={1.5}
                                        >
                                            <Box
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '10px',
                                                    bgcolor: alpha(
                                                        meta.accent,
                                                        0.12,
                                                    ),
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    fontSize: '1.15rem',
                                                }}
                                            >
                                                {meta.emoji}
                                            </Box>
                                            <Chip
                                                label={
                                                    isActive
                                                        ? t(
                                                              'ads.stats.activeDaysLeft',
                                                              {
                                                                  count: daysLeft,
                                                              },
                                                          )
                                                        : t('ads.stats.expired')
                                                }
                                                size='small'
                                                sx={{
                                                    background: isActive
                                                        ? alpha(
                                                              meta.accent,
                                                              0.12,
                                                          )
                                                        : 'rgba(239,68,68,0.1)',
                                                    color: isActive
                                                        ? meta.accent
                                                        : '#f87171',
                                                    border: `1px solid ${isActive ? alpha(meta.accent, 0.3) : 'rgba(248,113,113,0.3)'}`,
                                                    fontWeight: 800,
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                        </Stack>
                                        <Typography
                                            sx={{
                                                color: textPrimary,
                                                fontWeight: 800,
                                                mb: 0.5,
                                                fontSize: '0.92rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {ad.listingId?.product_name ||
                                                t('ads.common.untitled')}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: meta.accent,
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                mb: 1,
                                                letterSpacing: 0.2,
                                            }}
                                        >
                                            {meta.title}
                                        </Typography>
                                        <Stack
                                            direction='row'
                                            alignItems='center'
                                            gap={0.5}
                                            sx={{ color: textTertiary }}
                                        >
                                            <CalendarMonthRoundedIcon
                                                sx={{ fontSize: 12 }}
                                            />
                                            <Typography
                                                sx={{ fontSize: '0.75rem' }}
                                            >
                                                {formatDate(ad.startDate)} ←{' '}
                                                {formatDate(ad.endDate)}
                                            </Typography>
                                        </Stack>
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
    borderRadius: '12px',
    fontSize: '0.9rem',
    '.MuiOutlinedInput-notchedOutline': {
        borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
        transition: 'border-color 0.2s ease',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: `${accent}60`,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: accent,
        borderWidth: 1.5,
    },
    '.MuiSvgIcon-root': { color: isDark ? '#64748b' : '#94a3b8' },
    '& .MuiMenu-paper': { borderRadius: '12px', mt: 0.5 },
});

const inputSx = (accent: string, isDark: boolean) => ({
    '& .MuiInputBase-root': {
        color: isDark ? '#e2e8f0' : '#0f172a',
        borderRadius: '12px',
        fontSize: '0.9rem',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
        transition: 'border-color 0.2s ease',
    },
    '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: `${accent}60`,
    },
    '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: accent,
        borderWidth: 1.5,
    },
    '& .MuiInputLabel-root': { color: isDark ? '#64748b' : '#94a3b8' },
    '& .MuiInputLabel-root.Mui-focused': { color: accent },
    '& input': { colorScheme: isDark ? 'dark' : 'light' },
});

export default FeaturedAdsDashboard;
