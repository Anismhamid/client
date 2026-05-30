import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DevicesIcon from '@mui/icons-material/Devices';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ChairIcon from '@mui/icons-material/Chair';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import {
    Box,
    Button,
    Grid,
    Skeleton,
    Stack,
    Typography,
    Chip,
} from '@mui/material';
import { FeaturedAd } from '../../interfaces/featuredAd';
import { formatDate, formatPrice } from '../../helpers/dateAndPriceFormat';
import { useHomePageAds } from '../../hooks/useHomePageAds';
import { productsPathes } from '../../routes/routes';

/* ── Category icon helper ───────────────────────────── */
function getCategoryIcon(category?: string) {
    const cat = category?.toLowerCase() ?? '';
    const iconSx = { fontSize: 22, color: '#0F6E56' };
    if (cat.includes('عقار') || cat.includes('شقة') || cat.includes('بيت'))
        return <HomeIcon sx={iconSx} />;
    if (cat.includes('سيارة') || cat.includes('مركبة') || cat.includes('دراج'))
        return <DirectionsCarIcon sx={iconSx} />;
    if (
        cat.includes('إلكترون') ||
        cat.includes('جهاز') ||
        cat.includes('لابتوب') ||
        cat.includes('موبايل')
    )
        return <DevicesIcon sx={iconSx} />;
    if (cat.includes('ألعاب') || cat.includes('لعبة'))
        return <SportsEsportsIcon sx={iconSx} />;
    if (cat.includes('أثاث') || cat.includes('كرسي') || cat.includes('طاولة'))
        return <ChairIcon sx={iconSx} />;
    if (cat.includes('ملابس') || cat.includes('أزياء'))
        return <CheckroomIcon sx={iconSx} />;
    if (cat.includes('محل') || cat.includes('تجاري'))
        return <StorefrontIcon sx={iconSx} />;
    return <CategoryIcon sx={iconSx} />;
}

/* ── Skeleton card ──────────────────────────────────── */
function AdCardSkeleton() {
    return (
        <Box
            sx={{
                border: '0.5px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden',
            }}
        >
            <Skeleton
                variant='rectangular'
                height={8}
                sx={{ bgcolor: '#9FE1CB' }}
            />
            <Box sx={{ p: 2 }}>
                <Skeleton
                    variant='rounded'
                    width={48}
                    height={48}
                    sx={{ mb: 1.5, borderRadius: 2 }}
                />
                <Skeleton
                    variant='text'
                    width='70%'
                    height={20}
                    sx={{ mb: 0.5 }}
                />
                <Skeleton
                    variant='text'
                    width='45%'
                    height={16}
                    sx={{ mb: 1.5 }}
                />
                <Skeleton variant='text' width='55%' height={16} />
            </Box>
        </Box>
    );
}

/* ── Single ad card ─────────────────────────────────── */
function HomepageAdCard({ ad }: { ad: FeaturedAd }) {
    const listing = ad.listingId;
    const path = `${productsPathes.postsDetails}/${listing?.category}/Ads/${listing?._id}`;

    return (
        <Box
            onClick={() => {
                window.location.href = path;
            }}
            sx={{
                position: 'relative',
                bgcolor: 'background.paper',
                border: '0.5px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.18s ease, border-color 0.18s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: '#9FE1CB',
                },
            }}
        >
            {/* Top accent bar */}
            <Box sx={{ height: 4, bgcolor: '#1D9E75' }} />

            <Box sx={{ p: 2 }}>
                {/* Featured chip */}
                <Chip
                    label='مميز'
                    size='small'
                    sx={{
                        position: 'absolute',
                        top: 4,
                        right: 12,
                        bgcolor: '#1D9E75',
                        color: '#fff',
                        fontSize: 10,
                        height: 18,
                        fontWeight: 600,
                        borderRadius: '0 0 6px 6px',
                    }}
                />

                <Box
                    sx={{
                        position: 'relative',
                        height: 160,
                        overflow: 'hidden',
                        bgcolor: '#E1F5EE',
                    }}
                >
                    <img
                        src={listing?.image?.url}
                        alt={listing?.product_name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />
                    <Chip
                        label='مميز'
                        size='small'
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            bgcolor: '#1D9E75',
                            color: '#085041',
                        }}
                    />
                    {listing?.price && (
                        <Chip
                            label={formatPrice(listing.price)}
                            size='small'
                            sx={{
                                position: 'absolute',
                                bottom: 10,
                                left: 10,
                                bgcolor: 'background.paper',
                                color: '#19c421',
                                border: '0.5px solid #9FE1CB',
                            }}
                        />
                    )}
                </Box>

                {/* Icon box */}
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: '#E1F5EE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5,
                        mt: 0.5,
                    }}
                >
                    {getCategoryIcon(listing?.category)}
                </Box>

                {/* Title */}
                <Typography
                    variant='body2'
                    fontWeight={600}
                    noWrap
                    sx={{ mb: 0.5, color: 'text.primary' }}
                >
                    {listing?.product_name ?? '—'}
                </Typography>

                {/* Category */}
                {listing?.category && (
                    <Typography
                        variant='caption'
                        sx={{
                            display: 'inline-block',
                            bgcolor: '#E1F5EE',
                            color: '#085041',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontWeight: 500,
                            mb: 1,
                        }}
                    >
                        {listing.category}
                    </Typography>
                )}

                {/* Location + dates */}
                <Stack spacing={0.4} sx={{ mt: 0.5 }}>
                    {listing?.location && (
                        <Stack direction='row' alignItems='center' gap={0.5}>
                            <LocationOnIcon
                                sx={{ fontSize: 12, color: 'text.disabled' }}
                            />
                            <Typography
                                variant='caption'
                                color='text.secondary'
                                noWrap
                            >
                                {listing.location}
                            </Typography>
                        </Stack>
                    )}
                    <Stack direction='row' alignItems='center' gap={0.5}>
                        <CalendarTodayIcon
                            sx={{ fontSize: 11, color: 'text.disabled' }}
                        />
                        <Typography variant='caption' color='text.disabled'>
                            {formatDate(ad.startDate)} —{' '}
                            {formatDate(ad.endDate)}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}

/* ── Main section ───────────────────────────────────── */
interface HomepageFeaturedSectionProps {
    onViewAll?: () => void;
}

// const api = import.meta.env.VITE_API_URL;

export default function HomepageFeaturedSection({
    onViewAll,
}: HomepageFeaturedSectionProps) {
    const { homePageAds, loading } = useHomePageAds();
    if (!loading && homePageAds.length === 0) return null;

    return (
        <Box
            sx={{
                px: { xs: 2, md: 4 },
                py: 3,
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            {/* Header */}
            <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                mb={2}
            >
                <Stack direction='row' alignItems='center' gap={1}>
                    <Box
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1.5,
                            bgcolor: '#E1F5EE',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <HomeIcon sx={{ fontSize: 16, color: '#1D9E75' }} />
                    </Box>
                    <Box>
                        <Typography variant='subtitle2' fontWeight={600}>
                            إعلانات مميزة
                        </Typography>
                        {!loading && (
                            <Typography
                                variant='caption'
                                color='text.secondary'
                            >
                                {homePageAds.length} إعلان نشط على الصفحة
                                الرئيسية
                            </Typography>
                        )}
                    </Box>
                </Stack>

                {onViewAll && (
                    <Button
                        size='small'
                        variant='text'
                        onClick={onViewAll}
                        sx={{
                            fontSize: 12,
                            color: '#1D9E75',
                            fontWeight: 500,
                            '&:hover': { bgcolor: '#E1F5EE' },
                        }}
                    >
                        عرض الكل
                    </Button>
                )}
            </Stack>

            {/* Grid */}
            <Grid container spacing={1.5}>
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                              <AdCardSkeleton />
                          </Grid>
                      ))
                    : homePageAds.map((ad) => (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ad._id}>
                              <HomepageAdCard ad={ad} />
                          </Grid>
                      ))}
            </Grid>
        </Box>
    );
}
