import { useEffect, useState } from 'react';
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
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import { FeaturedAd } from '../../interfaces/featuredAd';
import useSnackbar from '../../hooks/useSnackbar';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import { getCustomerProfilePostsBySlug } from '../../services/postsServices';
import { useUser } from '../../context/useUSer';
import { Posts } from '../../interfaces/Posts';

const api = import.meta.env.VITE_API_URL;

// ─── Plan config ────────────────────────────────────────────────────────────
const PLAN_META: Record<
    string,
    {
        label: string;
        color: string;
        accent: string;
        icon: string;
        desc: string;
        price: string;
    }
> = {
    homepage: {
        label: 'الصفحة الرئيسية',
        color: '#0f172a',
        accent: '#f59e0b',
        icon: '🏠',
        desc: 'ظهور مميز في أعلى الصفحة الرئيسية أمام آلاف الزوار يومياً',
        price: '٩٩ ₪ / أسبوع',
    },
    top: {
        label: 'إعلان مرفوع',
        color: '#1e1b4b',
        accent: '#818cf8',
        icon: '🚀',
        desc: 'إعلانك في صدارة نتائج البحث وأعلى القوائم دائماً',
        price: '٦٩ ₪ / أسبوع',
    },
    highlight: {
        label: 'إعلان مضيء',
        color: '#064e3b',
        accent: '#34d399',
        icon: '✨',
        desc: 'تمييز بصري لافت يجعل إعلانك يبرز وسط المنافسين',
        price: '٤٩ ₪ / أسبوع',
    },
};

const FeaturedAdsDashboard = () => {
    const [ads, setAds] = useState<FeaturedAd[]>([]);
    const { auth } = useUser();
    const [loading, setLoading] = useState(true);
    const [newAd, setNewAd] = useState({
        listingId: '',
        type: 'homepage',
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    });
    const [saving, setSaving] = useState(false);
    const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
    const [userListings, setUserListings] = useState<Posts[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string>('homepage');

    useEffect(() => {
        getCustomerProfilePostsBySlug(auth?.slug as string)
            .then((res) => setUserListings(res))
            .catch((err) => {
                console.error(err);
                setUserListings([]);
            });
    }, [auth?.slug]);

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

    useEffect(() => {
        fetchAds();
    }, []);

    const handleTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setNewAd((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setNewAd((prev) => ({ ...prev, [name]: value }));
        if (name === 'type') setSelectedPlan(value);
    };

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
            showSnackbar(err.response?.data?.message || 'حدث خطأ', 'error');
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

    return (
        <Box
            dir='rtl'
            component='main'
            sx={{
                minHeight: '100vh',
                fontFamily: "'Cairo', 'Tajawal', sans-serif",
                py: 6,
                px: { xs: 2, md: 4 },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'fixed',
                    top: '-40%',
                    right: '-20%',
                    width: '70vw',
                    height: '70vw',
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
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

            {/* ── Hero Header ────────────────────────────────────────────── */}
            <Box sx={{ textAlign: 'center', mb: 8, position: 'relative' }}>
                <Typography
                    variant='overline'
                    sx={{
                        color: '#f59e0b',
                        letterSpacing: 4,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'block',
                        mb: 2,
                    }}
                >
                    ✦ باقات الترويج المدفوع ✦
                </Typography>
                <Typography
                    variant='h2'
                    sx={{
                        color: '#fff',
                        fontWeight: 900,
                        fontSize: { xs: '2rem', md: '3.2rem' },
                        lineHeight: 1.2,
                        mb: 2,
                    }}
                >
                    اجعل إعلانك
                    <Box
                        component='span'
                        sx={{
                            display: 'block',
                            background:
                                'linear-gradient(90deg, #f59e0b, #fcd34d)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        لا يُقاوَم
                    </Box>
                </Typography>
                <Typography
                    sx={{
                        color: '#94a3b8',
                        maxWidth: 520,
                        mx: 'auto',
                        fontSize: '1.05rem',
                    }}
                >
                    وصول أوسع، مبيعات أكثر — اختر الباقة التي تناسبك وابدأ الآن
                </Typography>
            </Box>

            {/* ── Plan Cards ─────────────────────────────────────────────── */}
            <Grid container spacing={3} justifyContent='center' sx={{ mb: 8 }}>
                {Object.entries(PLAN_META).map(([key, meta]) => {
                    const isSelected = selectedPlan === key;
                    const count = activeCounts[key] || 0;
                    return (
                        <Grid size={{ xs: 12, sm: 4 }} key={key}>
                            <Box
                                onClick={() => {
                                    setSelectedPlan(key);
                                    setNewAd((p) => ({ ...p, type: key }));
                                }}
                                sx={{
                                    cursor: 'pointer',
                                    borderRadius: 4,
                                    p: 3.5,
                                    height: '100%',
                                    background: isSelected
                                        ? `linear-gradient(135deg, ${meta.color}, #1e293b)`
                                        : 'rgba(255,255,255,0.04)',
                                    border: `2px solid ${isSelected ? meta.accent : 'rgba(255,255,255,0.08)'}`,
                                    boxShadow: isSelected
                                        ? `0 0 40px ${meta.accent}30`
                                        : 'none',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        border: `2px solid ${meta.accent}80`,
                                        transform: 'translateY(-4px)',
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
                                            color: '#000',
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            px: 1.5,
                                            py: 0.4,
                                            borderRadius: 10,
                                            letterSpacing: 1,
                                        }}
                                    >
                                        مختار
                                    </Box>
                                )}
                                <Typography
                                    sx={{ fontSize: '2.2rem', mb: 1.5 }}
                                >
                                    {meta.icon}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 800,
                                        fontSize: '1.2rem',
                                        mb: 1,
                                    }}
                                >
                                    {meta.label}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#94a3b8',
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
                                        label={`${count} نشط`}
                                        size='small'
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
                })}
            </Grid>

            {/* ── Purchase Form ───────────────────────────────────────────── */}
            <Box sx={{ maxWidth: 820, mx: 'auto', mb: 8 }}>
                <Box
                    sx={{
                        borderRadius: 4,
                        p: { xs: 3, md: 5 },
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${plan.accent}30`,
                        backdropFilter: 'blur(20px)',
                        boxShadow: `0 0 60px ${plan.accent}10`,
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
                                    color: '#fff',
                                    fontWeight: 800,
                                    fontSize: '1.2rem',
                                }}
                            >
                                شراء باقة {plan.label}
                            </Typography>
                            <Typography
                                sx={{ color: '#64748b', fontSize: '0.85rem' }}
                            >
                                أكمل البيانات أدناه واتجه للدفع
                            </Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={2.5}>
                        {/* Listing select */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#64748b' }}>
                                    اختر إعلانك
                                </InputLabel>
                                <Select
                                    name='listingId'
                                    value={newAd.listingId}
                                    onChange={handleSelectChange}
                                    label='اختر إعلانك'
                                    sx={selectSx(plan.accent)}
                                >
                                    {userListings.map((listing) => (
                                        <MenuItem
                                            key={listing._id}
                                            value={listing._id}
                                        >
                                            {listing.product_name ||
                                                'بدون عنوان'}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Type select */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#64748b' }}>
                                    نوع الترويج
                                </InputLabel>
                                <Select
                                    name='type'
                                    value={newAd.type}
                                    onChange={handleSelectChange}
                                    label='نوع الترويج'
                                    sx={selectSx(plan.accent)}
                                >
                                    <MenuItem value='homepage'>
                                        🏠 الصفحة الرئيسية
                                    </MenuItem>
                                    <MenuItem value='top'>
                                        🚀 إعلان مرفوع
                                    </MenuItem>
                                    <MenuItem value='highlight'>
                                        ✨ إعلان مضيء
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Dates */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label='تاريخ البداية'
                                type='date'
                                name='startDate'
                                value={newAd.startDate}
                                onChange={handleTextChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                sx={inputSx(plan.accent)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label='تاريخ النهاية'
                                type='date'
                                name='endDate'
                                value={newAd.endDate}
                                onChange={handleTextChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                sx={inputSx(plan.accent)}
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
                                    background: `${plan.accent}10`,
                                    border: `1px solid ${plan.accent}25`,
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: '#94a3b8',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    المدة:{' '}
                                    <strong style={{ color: '#e2e8f0' }}>
                                        {dayjs(newAd.endDate).diff(
                                            dayjs(newAd.startDate),
                                            'day',
                                        )}{' '}
                                        يوم
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
                            </Box>
                        </Grid>

                        {/* Submit */}
                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant='contained'
                                fullWidth
                                disabled={!newAd.listingId || saving}
                                onClick={handleSubmit}
                                sx={{
                                    py: 1.8,
                                    borderRadius: 3,
                                    fontSize: '1.05rem',
                                    fontWeight: 800,
                                    fontFamily: 'inherit',
                                    background: `linear-gradient(90deg, ${plan.accent}, ${plan.accent}cc)`,
                                    color: '#000',
                                    boxShadow: `0 4px 30px ${plan.accent}40`,
                                    '&:hover': {
                                        background: `linear-gradient(90deg, ${plan.accent}ee, ${plan.accent})`,
                                        boxShadow: `0 6px 40px ${plan.accent}60`,
                                        transform: 'translateY(-1px)',
                                    },
                                    '&:disabled': {
                                        opacity: 0.5,
                                        color: '#000',
                                    },
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                {saving ? (
                                    <CircularProgress
                                        size={24}
                                        sx={{ color: '#000' }}
                                    />
                                ) : (
                                    `💳 ادفع الآن — ${plan.price}`
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* ── My Current Ads ──────────────────────────────────────────── */}
            <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 3,
                    }}
                >
                    <Typography
                        sx={{
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '1.3rem',
                        }}
                    >
                        إعلاناتك الحالية
                    </Typography>
                    <Stack direction='row' spacing={1}>
                        {Object.entries(PLAN_META).map(([key, meta]) => (
                            <Chip
                                key={key}
                                label={`${meta.icon} ${activeCounts[key] || 0}`}
                                size='small'
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
                            border: '1px dashed rgba(255,255,255,0.1)',
                        }}
                    >
                        <Typography sx={{ fontSize: '3rem', mb: 2 }}>
                            📭
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>
                            لا توجد إعلانات ترويجية بعد
                        </Typography>
                        <Typography
                            sx={{
                                color: '#475569',
                                fontSize: '0.85rem',
                                mt: 1,
                            }}
                        >
                            ابدأ بشراء أول باقة ترويجية الآن
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
                                                ? `linear-gradient(135deg, ${meta.color}cc, #1e293b)`
                                                : 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${isActive ? meta.accent + '40' : 'rgba(255,255,255,0.07)'}`,
                                            transition: 'transform 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-3px)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
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
                                                        ? `نشط • ${daysLeft} يوم`
                                                        : 'منتهي'
                                                }
                                                size='small'
                                                sx={{
                                                    background: isActive
                                                        ? `${meta.accent}20`
                                                        : 'rgba(239,68,68,0.15)',
                                                    color: isActive
                                                        ? meta.accent
                                                        : '#f87171',
                                                    border: `1px solid ${isActive ? meta.accent + '40' : '#f8717140'}`,
                                                    fontWeight: 700,
                                                    fontSize: '0.72rem',
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            sx={{
                                                color: '#e2e8f0',
                                                fontWeight: 700,
                                                mb: 0.5,
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            {ad.listingId?.product_name ||
                                                'بدون عنوان'}
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
                                                color: '#64748b',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            {dayjs(ad.startDate).format(
                                                'DD/MM/YYYY',
                                            )}{' '}
                                            ←{' '}
                                            {dayjs(ad.endDate).format(
                                                'DD/MM/YYYY',
                                            )}
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

// ─── Shared style helpers ───────────────────────────────────────────────────
const selectSx = (accent: string) => ({
    color: '#e2e8f0',
    '.MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.12)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: `${accent}60` },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: accent },
    '.MuiSvgIcon-root': { color: '#64748b' },
});

const inputSx = (accent: string) => ({
    '& .MuiInputBase-root': { color: '#e2e8f0' },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.12)',
    },
    '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: `${accent}60`,
    },
    '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: accent,
    },
    '& .MuiInputLabel-root': { color: '#64748b' },
    '& .MuiInputLabel-root.Mui-focused': { color: accent },
    '& input': { colorScheme: 'dark' },
});

export default FeaturedAdsDashboard;
