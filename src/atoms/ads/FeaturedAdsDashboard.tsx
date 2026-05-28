import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
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
// import AlertDialogs from '../toasts/Sweetalert';

const api = import.meta.env.VITE_API_URL;

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

    // FIX 1: Track which specific ad is pending deletion, not just a boolean
    // const [adToDelete, setAdToDelete] = useState<string | null>(null);

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

    // FIX 2: Separate handlers for TextField and Select to avoid TS union-type issues
    const handleTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setNewAd((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setNewAd((prev) => ({ ...prev, [name]: value }));
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
            // Redirect to Stripe Checkout
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

    return (
        <Box sx={{ p: 4 }} component='main'>
            <Typography variant='h4' gutterBottom>
                إدارة Featured Ads
            </Typography>

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

            {/* Buy new ad */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant='h6' gutterBottom>
                    شراء إعلان جديد
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControl fullWidth>
                            <InputLabel>اختر الإعلان</InputLabel>
                            <Select
                                name='listingId'
                                value={newAd.listingId}
                                onChange={handleSelectChange}
                                label='اختر الإعلان'
                            >
                                {userListings.map((listing) => (
                                    <MenuItem
                                        key={listing._id}
                                        value={listing._id}
                                    >
                                        {listing.product_name || 'بدون عنوان'}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControl fullWidth>
                            <InputLabel>نوع الترويج</InputLabel>
                            <Select
                                name='type'
                                value={newAd.type}
                                onChange={handleSelectChange}
                                label='نوع الترويج'
                            >
                                <MenuItem value='homepage'>Homepage</MenuItem>
                                <MenuItem value='top'>Top</MenuItem>
                                <MenuItem value='highlight'>Highlight</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                            label='تاريخ البداية'
                            type='date'
                            name='startDate'
                            value={newAd.startDate}
                            onChange={handleTextChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                            label='تاريخ النهاية'
                            type='date'
                            name='endDate'
                            value={newAd.endDate}
                            onChange={handleTextChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Button
                            variant='contained'
                            disabled={!newAd.listingId || saving}
                            onClick={handleSubmit}
                        >
                            {saving ? <CircularProgress size={24} /> : 'شراء'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Active ads by type */}
            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant='h6' gutterBottom>
                    الإعلانات النشطة حسب النوع
                </Typography>
                <Stack direction='row' spacing={2}>
                    <Chip
                        label={`Homepage: ${activeCounts.homepage || 0}`}
                        color='success'
                    />
                    <Chip
                        label={`Top: ${activeCounts.top || 0}`}
                        color='success'
                    />
                    <Chip
                        label={`Highlight: ${activeCounts.highlight || 0}`}
                        color='success'
                    />
                </Stack>
            </Paper>

            {/* User's current ads */}
            <Typography variant='h6' gutterBottom>
                إعلاناتك الحالية
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : ads.length === 0 ? (
                <Typography>لا يوجد إعلانات بعد</Typography>
            ) : (
                <Grid container spacing={2}>
                    {ads.map((ad) => {
                        const isActive =
                            ad.isActive && dayjs().isBefore(dayjs(ad.endDate));
                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ad._id}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        backgroundColor: isActive
                                            ? '#e8f5e9'
                                            : '#ffebee',
                                    }}
                                >
                                    {/* FIX 3: Use correct populated field name from interface */}
                                    <Typography variant='subtitle1'>
                                        {ad.listingId?.title || 'بدون عنوان'}
                                    </Typography>
                                    <Typography variant='body2'>
                                        نوع: {ad.type}
                                    </Typography>
                                    <Typography variant='body2'>
                                        من{' '}
                                        {dayjs(ad.startDate).format(
                                            'DD/MM/YYYY',
                                        )}{' '}
                                        إلى{' '}
                                        {dayjs(ad.endDate).format('DD/MM/YYYY')}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        الحالة:
                                        {isActive ? (
                                            <Chip
                                                label='نشط'
                                                color='success'
                                                size='small'
                                            />
                                        ) : (
                                            <Chip
                                                label='غير نشط'
                                                color='error'
                                                size='small'
                                            />
                                        )}
                                    </Typography>

                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
};

export default FeaturedAdsDashboard;
