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
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EastIcon from '@mui/icons-material/East';

import {
    Box,
    Button,
    Grid,
    Skeleton,
    Stack,
    Typography,
    Chip,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Divider,
    useTheme,
    alpha,
    Avatar,
    Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { FeaturedAd } from '../../interfaces/featuredAd';
import { formatDate, formatPrice } from '../../helpers/dateAndPriceFormat';
import { useHomePageAds } from '../../hooks/useHomePageAds';
import { productsPathes } from '../../routes/routes';

/* ── Category icon helper ───────────────────────────── */
function getCategoryIcon(category?: string, size = 24) {
    const cat = category?.toLowerCase() ?? '';
    const iconSx = { fontSize: size, color: '#0F6E56' };
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
        <Card
            sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
        >
            <Skeleton variant='rectangular' height={200} animation='wave' />
            <CardContent>
                <Stack direction='row' spacing={1} sx={{ mb: 1 }}>
                    <Skeleton variant='circular' width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant='text' width='80%' height={24} />
                        <Skeleton variant='text' width='60%' height={20} />
                    </Box>
                </Stack>
                <Skeleton
                    variant='text'
                    width='90%'
                    height={32}
                    sx={{ mb: 1 }}
                />
                <Skeleton variant='text' width='70%' height={20} />
            </CardContent>
        </Card>
    );
}

/* ── Featured badge component ───────────────────────── */
function FeaturedBadge({ endDate }: { endDate: Date | string }) {
    const theme = useTheme();
    const daysLeft = Math.ceil(
        (new Date(endDate).getTime() - new Date().getTime()) /
            (1000 * 3600 * 24),
    );

    return (
        <Chip
            icon={
                <TrendingUpIcon
                    sx={{ fontSize: 12, color: 'white !important' }}
                />
            }
            label={`مميز ${daysLeft > 0 ? `· ${daysLeft} يوم متبقي` : ''}`}
            size='small'
            sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                fontSize: 11,
                height: 24,
                fontWeight: 600,
                '& .MuiChip-icon': { color: 'white' },
            }}
        />
    );
}

/* ── Single ad card (modern redesign) ─────────────────── */
function HomepageAdCard({ ad, index }: { ad: FeaturedAd; index: number }) {
    const theme = useTheme();
    const listing = ad.listingId;
    const path = `${productsPathes.postsDetails}/${listing?.category}/Ads/${listing?._id}`;

    if (!listing) return null;

    return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
            >
                <Card
                    onClick={() => {
                        window.location.href = path;
                    }}
                    sx={{
                        position: 'relative',
                        borderRadius: 3,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease-in-out',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                            '& .media-overlay': {
                                opacity: 1,
                            },
                            '& .view-button': {
                                opacity: 1,
                                transform: 'translateX(0)',
                            },
                        },
                    }}
                >
                    {/* Image Section with Overlay */}
                    <Box sx={{ position: 'relative' }}>
                        <CardMedia
                            component='img'
                            height='200'
                            image={listing.image?.url}
                            alt={listing.product_name}
                            sx={{ objectFit: 'cover' }}
                        />
                        <Box
                            className='media-overlay'
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                bgcolor: alpha(theme.palette.common.black, 0.4),
                                opacity: 0,
                                transition: 'opacity 0.25s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Chip
                                className='view-button'
                                icon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                                label='عرض التفاصيل'
                                sx={{
                                    bgcolor: 'white',
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    opacity: 0,
                                    transform: 'translateX(-10px)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.main,
                                        color: 'white',
                                    },
                                }}
                            />
                        </Box>

                        {/* Price Badge */}
                        {listing.price && (
                            <Chip
                                label={formatPrice(listing.price)}
                                size='small'
                                sx={{
                                    position: 'absolute',
                                    bottom: 12,
                                    left: 12,
                                    bgcolor: alpha(
                                        theme.palette.common.black,
                                        0.75,
                                    ),
                                    color: theme.palette.success.light,
                                    fontWeight: 700,
                                    fontSize: 14,
                                    backdropFilter: 'blur(4px)',
                                }}
                            />
                        )}

                        {/* Featured Badge */}
                        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                            <FeaturedBadge endDate={formatDate(ad.endDate)} />
                        </Box>
                    </Box>

                    <CardContent sx={{ p: 2.5 }}>
                        {/* Header with Icon and Category */}
                        <Stack
                            direction='row'
                            spacing={1.5}
                            alignItems='center'
                            sx={{ mb: 1.5 }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.1,
                                    ),
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2,
                                }}
                            >
                                {getCategoryIcon(listing.category, 22)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                    sx={{ fontSize: 12 }}
                                >
                                    {listing.category || 'منتج'}
                                </Typography>
                                <Typography
                                    variant='h6'
                                    fontWeight={700}
                                    sx={{ lineHeight: 1.3 }}
                                >
                                    {listing.product_name}
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 1.5 }} />

                        {/* Details Stack */}
                        <Stack spacing={1}>
                            {listing.location && (
                                <Stack
                                    direction='row'
                                    alignItems='center'
                                    spacing={0.75}
                                >
                                    <LocationOnIcon
                                        sx={{
                                            fontSize: 16,
                                            color: 'text.disabled',
                                        }}
                                    />
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                        noWrap
                                    >
                                        {listing.location}
                                    </Typography>
                                </Stack>
                            )}

                            <Stack
                                direction='row'
                                alignItems='center'
                                spacing={0.75}
                            >
                                <CalendarTodayIcon
                                    sx={{
                                        fontSize: 14,
                                        color: 'text.disabled',
                                    }}
                                />
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                >
                                    {formatDate(ad.startDate)} →{' '}
                                    {formatDate(ad.endDate)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                            size='small'
                            fullWidth
                            variant='outlined'
                            endIcon={<EastIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderColor: alpha(
                                    theme.palette.primary.main,
                                    0.3,
                                ),
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.05,
                                    ),
                                },
                            }}
                        >
                            عرض التفاصيل
                        </Button>
                    </CardActions>
                </Card>
            </motion.div>
        </Grid>
    );
}

/* ── Main Section Component ─────────────────────────── */
interface HomepageFeaturedSectionProps {
    onViewAll?: () => void;
}

export default function HomepageFeaturedSection({
    onViewAll,
}: HomepageFeaturedSectionProps) {
    const theme = useTheme();
    const { homePageAds, loading } = useHomePageAds();

    if (!loading && homePageAds.length === 0) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 3, md: 4 },
                bgcolor: 'background.default',
                borderRadius: 0,
            }}
        >
            {/* Header Section */}
            <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='flex-end'
                sx={{ mb: 3 }}
                flexWrap='wrap'
                gap={2}
            >
                <Stack direction='row' alignItems='center' spacing={1.5}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <StarIcon
                            sx={{
                                fontSize: 28,
                                color: theme.palette.primary.main,
                            }}
                        />
                    </Box>
                    <Box>
                        <Typography
                            variant='h5'
                            fontWeight={800}
                            sx={{ mb: 0.5 }}
                        >
                            إعلانات مميزة
                        </Typography>
                        {!loading && homePageAds.length > 0 && (
                            <Typography variant='body2' color='text.secondary'>
                                {homePageAds.length} إعلان مميز على الصفحة
                                الرئيسية
                            </Typography>
                        )}
                    </Box>
                </Stack>

                {onViewAll && (
                    <Button
                        variant='text'
                        onClick={onViewAll}
                        endIcon={<EastIcon />}
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
                )}
            </Stack>

            {/* Featured Ads Grid */}
            <Grid container spacing={2.5}>
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                              <AdCardSkeleton />
                          </Grid>
                      ))
                    : homePageAds.map((ad, idx) => (
                          <HomepageAdCard key={ad._id} ad={ad} index={idx} />
                      ))}
            </Grid>

            {/* Empty State */}
            {!loading && homePageAds.length === 0 && (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        bgcolor: alpha(theme.palette.grey[500], 0.05),
                        borderRadius: 3,
                    }}
                >
                    <Typography
                        variant='h6'
                        color='text.secondary'
                        gutterBottom
                    >
                        لا توجد إعلانات مميزة حالياً
                    </Typography>
                    <Typography variant='body2' color='text.disabled'>
                        قم بترقية إعلانك ليظهر هنا
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}
