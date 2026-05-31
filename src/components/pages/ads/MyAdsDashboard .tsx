import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
    Box,
    Chip,
    CircularProgress,
    Grid,
    IconButton,
    Skeleton,
    Stack,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { showError, showSuccess } from '../../../atoms/toasts/ReactToast';
import { AdType, FeaturedAd } from '../../../interfaces/featuredAd';

/* ── Config ─────────────────────────────── */
const typeConfig: Record<
    AdType,
    {
        label: string;
        color: string;
        bg: string;
        icon: React.ReactNode;
        accent: string;
    }
> = {
    homepage: {
        label: 'Homepage',
        color: '#085041',
        bg: '#E1F5EE',
        accent: '#1D9E75',
        icon: <HomeIcon sx={{ fontSize: 18 }} />,
    },
    top: {
        label: 'Top',
        color: '#633806',
        bg: '#FAEEDA',
        accent: '#BA7517',
        icon: <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />,
    },
    highlight: {
        label: 'Highlight',
        color: '#3C3489',
        bg: '#EEEDFE',
        accent: '#7F77DD',
        icon: <StarBorderIcon sx={{ fontSize: 18 }} />,
    },
};

const prices: Record<AdType, number> = { highlight: 10, top: 25, homepage: 50 };

/* ── Stat card ───────────────────────────── */
function StatCard({
    label,
    value,
    color,
}: {
    label: string;
    value: string | number;
    color?: string;
}) {
    return (
        <Box
            sx={{
                bgcolor: 'action.hover',
                borderRadius: 2,
                p: '12px 14px',
            }}
        >
            <Typography
                variant='caption'
                color='text.secondary'
                display='block'
                mb={0.5}
            >
                {label}
            </Typography>
            <Typography
                sx={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: color ?? 'text.primary',
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}

/* ── Ad row ──────────────────────────────── */
function AdRow({
    ad,
    onDelete,
    deleting,
}: {
    ad: FeaturedAd;
    onDelete: (id: string) => void;
    deleting: boolean;
}) {
    const cfg = typeConfig[ad.type];
    const fmt = (iso: string) =>
        new Date(iso).toLocaleDateString('ar-PS', {
            day: 'numeric',
            month: 'short',
        });

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: 'background.paper',
                border: '0.5px solid',
                borderColor: 'divider',
                borderRadius: 3,
                p: '10px 14px',
                opacity: ad.isActive ? 1 : 0.6,
                transition: 'opacity 0.2s',
            }}
        >
            {/* Icon */}
            <Box
                sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    bgcolor: cfg.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: cfg.color,
                }}
            >
                {cfg.icon}
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant='body2' fontWeight={500} noWrap mb={0.4}>
                    {ad.listingId?.product_name ?? '(الإعلان محذوف)'}
                </Typography>
                <Stack
                    direction='row'
                    alignItems='center'
                    gap={1}
                    flexWrap='wrap'
                >
                    <Chip
                        label={cfg.label}
                        size='small'
                        sx={{
                            bgcolor: cfg.bg,
                            color: cfg.color,
                            fontSize: 10,
                            height: 18,
                            fontWeight: 500,
                        }}
                    />
                    <Typography variant='caption' color='text.disabled'>
                        {fmt(ad.startDate)} → {fmt(ad.endDate)}
                    </Typography>
                </Stack>
            </Box>

            {/* Status + price */}
            <Stack alignItems='flex-end' gap={0.5} flexShrink={0}>
                <Chip
                    label={ad.isActive ? 'نشط' : 'منتهي'}
                    size='small'
                    sx={{
                        bgcolor: ad.isActive ? '#EAF3DE' : '#F1EFE8',
                        color: ad.isActive ? '#3B6D11' : '#5F5E5A',
                        fontSize: 10,
                        height: 18,
                        fontWeight: 500,
                    }}
                />
                <Typography variant='caption' color='text.secondary'>
                    ₪{ad.isActive ? prices[ad.type] : '—'}
                </Typography>
            </Stack>

            {/* Delete */}
            <IconButton
                size='small'
                onClick={() => onDelete(ad._id)}
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

/* ── Main dashboard ──────────────────────── */
type TabFilter = 'all' | 'active' | 'expired';
const api = import.meta.env.VITE_API_URL;

export default function MyAdsDashboard() {
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
            // setActiveCounts(
            //     data?.activeCounts || { homepage: 0, top: 0, highlight: 0 },
            // );
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
            showSuccess('تم حذف الإعلان بنجاح!');
        } catch (err) {
            console.error(err);
            showError('حدث خطأ أثناء الحذف');
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

    const totalPaid = ads.reduce((sum, a) => sum + prices[a.type], 0);

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Page title */}
            <Typography variant='h6' fontWeight={500} mb={2.5}>
                إعلاناتي المميزة
            </Typography>

            {/* Stats */}
            <Grid container spacing={1.5} mb={3}>
                <Grid size={{ xs: 4 }}>
                    <StatCard
                        label='إجمالي الإعلانات'
                        value={loading ? '—' : ads.length}
                    />
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <StatCard
                        label='نشطة الآن'
                        value={
                            loading ? '—' : ads.filter((a) => a.isActive).length
                        }
                        color='#1D9E75'
                    />
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <StatCard
                        label='إجمالي المدفوع'
                        value={loading ? '—' : `₪${totalPaid}`}
                    />
                </Grid>
            </Grid>

            {/* Tabs filter */}
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                    mb: 2,
                    minHeight: 36,
                    '& .MuiTab-root': { minHeight: 36, fontSize: 13, py: 0 },
                }}
            >
                <Tab label='الكل' value='all' />
                <Tab label='نشط' value='active' />
                <Tab label='منتهي' value='expired' />
            </Tabs>

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
                        <Typography variant='body2'>لا توجد إعلانات</Typography>
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
