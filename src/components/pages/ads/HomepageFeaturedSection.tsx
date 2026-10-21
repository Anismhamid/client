// components/ads/HomepageFeaturedSection.tsx
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DevicesIcon from '@mui/icons-material/Devices';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ChairIcon from '@mui/icons-material/Chair';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import WatchIcon from '@mui/icons-material/Watch';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SpaIcon from '@mui/icons-material/Spa';
import GarageIcon from '@mui/icons-material/Garage';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import {
    CameraAlt,
    Construction,
    Factory,
    Handyman,
    MenuBook,
    Piano,
    Print,
    SvgIconComponent,
    Whatshot,
} from '@mui/icons-material';
import PaletteIcon from '@mui/icons-material/Palette';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PetsIcon from '@mui/icons-material/Pets';
import WeekendIcon from '@mui/icons-material/Weekend';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';

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
    useTheme,
    alpha,
    Avatar,
    Paper,
    Tabs,
    Tab,
} from '@mui/material';
import { m } from 'framer-motion';
import { useState, useMemo } from 'react';
import { FeaturedAd } from '../../../interfaces/featuredAd';
import { formatDate, formatPrice } from '../../../helpers/dateAndPriceFormat';
import { productsPathes } from '../../../routes/routes';
import { categoryLabels } from '../../../interfaces/postsCategoeis';
import { useNavigate } from 'react-router-dom';
import { useAllFeaturedAds } from '../../../hooks/ads/useFeaturedAds';
import { getPlanById } from '../../../interfaces/PlanConfig'; // ✅ المسار الصحيح
import { useTranslation } from 'react-i18next';

/* ── Category metadata ─────────────────────────────── */
const CATEGORY_META: Record<
    string,
    { icon: SvgIconComponent; color: string; label: string }
> = {
    House: { icon: ChairIcon, color: '#f59e0b', label: categoryLabels.House },
    Garden: { icon: SpaIcon, color: '#10b981', label: categoryLabels.Garden },
    Electronics: {
        icon: DevicesIcon,
        color: '#3b82f6',
        label: categoryLabels.Electronics,
    },
    Kids: {
        icon: SportsEsportsIcon,
        color: '#f97316',
        label: categoryLabels.Kids,
    },
    Baby: { icon: ChildCareIcon, color: '#ec4899', label: categoryLabels.Baby },
    Beauty: { icon: SpaIcon, color: '#d946ef', label: categoryLabels.Beauty },
    Cleaning: {
        icon: CleaningServicesIcon,
        color: '#06b6d4',
        label: categoryLabels.Cleaning,
    },
    Health: {
        icon: HealthAndSafetyIcon,
        color: '#14b8a6',
        label: categoryLabels.Health,
    },
    Watches: {
        icon: WatchIcon,
        color: '#8b5cf6',
        label: categoryLabels.Watches,
    },
    MenClothes: {
        icon: CheckroomIcon,
        color: '#06b6d4',
        label: categoryLabels.MenClothes,
    },
    WomenClothes: {
        icon: CheckroomIcon,
        color: '#ec4899',
        label: categoryLabels.WomenClothes,
    },
    WomenBags: {
        icon: ShoppingBagIcon,
        color: '#f43f5e',
        label: categoryLabels.WomenBags,
    },
    Cars: {
        icon: DirectionsCarIcon,
        color: '#f59e0b',
        label: categoryLabels.Cars,
    },
    Motorcycles: {
        icon: GarageIcon,
        color: '#ef4444',
        label: categoryLabels.Motorcycles,
    },
    Trucks: {
        icon: LocalShippingIcon,
        color: '#475569',
        label: categoryLabels.Trucks,
    },
    Bikes: {
        icon: PedalBikeIcon,
        color: '#84cc16',
        label: categoryLabels.Bikes,
    },
    ElectricVehicles: {
        icon: ElectricBoltIcon,
        color: '#22c55e',
        label: categoryLabels.ElectricVehicles,
    },
    Art: { icon: PaletteIcon, color: '#a855f7', label: categoryLabels.Art },
    Gaming: {
        icon: SportsEsportsIcon,
        color: '#6366f1',
        label: categoryLabels.Gaming,
    },
    RealEstate: {
        icon: ApartmentIcon,
        color: '#0ea5e9',
        label: categoryLabels.RealEstate,
    },
    Pets: { icon: PetsIcon, color: '#f59e0b', label: categoryLabels.Pets },
    Furniture: {
        icon: WeekendIcon,
        color: '#78350f',
        label: categoryLabels.Furniture,
    },
    Cameras: {
        icon: CameraAlt,
        color: '#e11d48',
        label: categoryLabels.Cameras,
    },
    Books: { icon: MenuBook, color: '#854d0e', label: categoryLabels.Books },
    MusicalInstruments: {
        icon: Piano,
        color: '#6366f1',
        label: categoryLabels.MusicalInstruments,
    },
    ConstructionEquipment: {
        icon: Construction,
        color: '#f59e0b',
        label: categoryLabels.ConstructionEquipment,
    },
    IndustrialEquipment: {
        icon: Factory,
        color: '#475569',
        label: categoryLabels.IndustrialEquipment,
    },
    WeldingEquipment: {
        icon: Whatshot,
        color: '#ef4444',
        label: categoryLabels.WeldingEquipment,
    },
    OfficeEquipment: {
        icon: Print,
        color: '#0ea5e9',
        label: categoryLabels.OfficeEquipment,
    },
    Services: {
        icon: Handyman,
        color: '#0ea5e9',
        label: categoryLabels.Services,
    },
};

/* ── Category icon helper ───────────────────────────── */
function getCategoryIcon(category?: string, size = 24) {
    const cat = category ?? '';
    const meta = CATEGORY_META[cat];
    const iconSx = { fontSize: size, color: '#0F6E56' };
    if (meta?.icon) {
        const IconComponent = meta.icon;
        return <IconComponent sx={iconSx} />;
    }
    if (cat.includes('Home') || cat.includes('apartment'))
        return <HomeIcon sx={iconSx} />;
    if (cat.includes('Cars')) return <DirectionsCarIcon sx={iconSx} />;
    if (cat.includes('Electronics')) return <DevicesIcon sx={iconSx} />;
    if (cat.includes('Kids')) return <SportsEsportsIcon sx={iconSx} />;
    if (cat.includes('Furniture')) return <ChairIcon sx={iconSx} />;
    if (cat.includes('WomenClothes')) return <CheckroomIcon sx={iconSx} />;
    if (cat.includes('Services')) return <Handyman sx={iconSx} />;
    return <CategoryIcon sx={iconSx} />;
}

/* ── Skeleton card ──────────────────────────────────── */
function AdCardSkeleton() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const skeletonBg = isDark ? 'rgba(255,255,255,0.1)' : undefined;

    return (
        <Card
            sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: isDark
                    ? '0 1px 3px rgba(0,0,0,0.3)'
                    : '0 1px 3px rgba(0,0,0,0.05)',
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
            }}
        >
            <Skeleton
                variant='rectangular'
                height={200}
                animation='wave'
                sx={{ bgcolor: skeletonBg }}
            />
            <CardContent sx={{ p: 2 }}>
                <Stack
                    direction='row'
                    spacing={1.5}
                    alignItems='center'
                    sx={{ mb: 1.5 }}
                >
                    <Skeleton
                        variant='circular'
                        width={44}
                        height={44}
                        sx={{ bgcolor: skeletonBg }}
                    />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton
                            variant='text'
                            width='60%'
                            height={18}
                            sx={{ bgcolor: skeletonBg }}
                        />
                        <Skeleton
                            variant='text'
                            width='80%'
                            height={22}
                            sx={{ bgcolor: skeletonBg }}
                        />
                    </Box>
                </Stack>
                <Skeleton
                    variant='text'
                    width='90%'
                    height={20}
                    sx={{ bgcolor: skeletonBg }}
                />
            </CardContent>
        </Card>
    );
}

/* ── Single ad card ─────────────────────────────────── */
export function HomepageAdCard({
    ad,
    index,
}: {
    ad: FeaturedAd;
    index: number;
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { t } = useTranslation();
    const listing = ad.listingId;
    const navigate = useNavigate();

    if (!listing) return null;

    const catMeta = CATEGORY_META[listing.category ?? ''];
    const accent = catMeta?.color ?? theme.palette.primary.main;
    const path = `${productsPathes.postsDetails}/${listing.category}/Ads/${listing._id}`;

    const planMeta = getPlanById(ad.type);
    const planAccent = planMeta?.accent || accent;

    // حساب الأيام المتبقية
    const daysLeft = Math.ceil(
        (new Date(ad.endDate).getTime() - new Date().getTime()) /
            (1000 * 3600 * 24),
    );

    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <Card
                onClick={() => navigate(path)}
                sx={{
                    position: 'relative',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isDark
                        ? '0 2px 8px rgba(0,0,0,0.3)'
                        : `0 4px 16px -8px ${alpha(accent, 0.25)}, 0 1px 3px rgba(0,0,0,0.06)`,
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    border: `1px solid ${alpha(accent, isDark ? 0.15 : 0.12)}`,
                    '&:hover': {
                        transform: 'translateY(-6px)',
                        borderColor: alpha(accent, 0.4),
                        boxShadow: isDark
                            ? '0 16px 32px rgba(0,0,0,0.5)'
                            : `0 24px 48px -16px ${alpha(accent, 0.45)}`,
                        '& .media-overlay': { opacity: 1 },
                        '& .view-button': {
                            opacity: 1,
                            transform: 'translateY(0)',
                        },
                        '& .card-media-img': { transform: 'scale(1.06)' },
                    },
                }}
            >
                {/* شريط علوي بلون الباقة */}
                <Box
                    sx={{
                        height: 3,
                        background: `linear-gradient(90deg, ${planAccent} 0%, ${alpha(planAccent, 0.3)} 100%)`,
                    }}
                />

                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                        component='img'
                        height='200'
                        image={listing.image?.url || '/placeholder.png'}
                        alt={listing.product_name}
                        className='card-media-img'
                        sx={{
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                        }}
                    />

                    {/* Overlay لعرض التفاصيل */}
                    <Box
                        className='media-overlay'
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background: `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0)} 30%, ${alpha(theme.palette.common.black, 0.65)} 100%)`,
                            opacity: 0,
                            transition: 'opacity 0.25s ease',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            p: 2,
                        }}
                    >
                        <Chip
                            className='view-button'
                            icon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                            label={t('postCard.viewDetails', 'عرض التفاصيل')}
                            sx={{
                                bgcolor: 'white',
                                color: accent,
                                fontWeight: 700,
                                opacity: 0,
                                transform: 'translateY(10px)',
                                transition: 'all 0.3s ease',
                                '&:hover': { bgcolor: accent, color: 'white' },
                            }}
                        />
                    </Box>

                    {/* ✅ الشارات العلوية (الباقة + الأيام المتبقية) */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 12,
                            insetInlineStart: 12,
                            insetInlineEnd: 12,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            pointerEvents: 'none',
                        }}
                    >
                        {/* شارة الباقة (يسار) */}
                        {planMeta && (
                            <Chip
                                label={planMeta.title}
                                size='small'
                                sx={{
                                    bgcolor: planMeta.accent,
                                    color: '#fff',
                                    fontSize: 10,
                                    height: 22,
                                    fontWeight: 800,
                                    boxShadow: `0 4px 12px -4px ${alpha(planMeta.accent, 0.6)}`,
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    '& .MuiChip-label': { px: 1 },
                                }}
                            />
                        )}

                        {/* شارة الأيام المتبقية (يمين) */}
                        {Number.isFinite(daysLeft) && daysLeft > 0 && (
                            <Chip
                                label={t('ads.daysLeft', '{{count}} يوم', {
                                    count: daysLeft,
                                })}
                                size='small'
                                sx={{
                                    bgcolor: 'rgba(0,0,0,0.6)',
                                    color: '#fff',
                                    fontSize: 10,
                                    height: 22,
                                    fontWeight: 700,
                                    backdropFilter: 'blur(4px)',
                                    '& .MuiChip-label': { px: 1 },
                                }}
                            />
                        )}
                    </Box>

                    {/* ✅ شارة السعر (أسفل يسار) - تظهر فقط إذا كان السعر > 0 */}
                    {listing.price && listing.price > 0 && (
                        <Chip
                            label={formatPrice(listing.price)}
                            size='small'
                            sx={{
                                position: 'absolute',
                                bottom: 12,
                                insetInlineStart: 12,
                                bgcolor: 'rgba(255,255,255,0.95)',
                                color: accent,
                                fontWeight: 800,
                                fontSize: 13,
                                height: 28,
                                backdropFilter: 'blur(6px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }}
                        />
                    )}
                </Box>

                <CardContent sx={{ p: 2.25, pb: '12px !important' }}>
                    <Stack
                        direction='row'
                        spacing={1.5}
                        alignItems='center'
                        sx={{ mb: 1.5 }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: alpha(accent, 0.12),
                                width: 42,
                                height: 42,
                                borderRadius: '12px',
                                border: `1px solid ${alpha(accent, 0.2)}`,
                                color: accent,
                                '& svg': { color: accent },
                            }}
                        >
                            {getCategoryIcon(listing.category, 20)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant='caption'
                                sx={{
                                    color: accent,
                                    fontWeight: 700,
                                    fontSize: 11,
                                    letterSpacing: 0.4,
                                    textTransform: 'uppercase',
                                }}
                            >
                                {catMeta?.label ??
                                    listing.category ??
                                    t('postCard.genericProduct', 'منتج')}
                            </Typography>
                            <Typography
                                variant='subtitle1'
                                component='p'
                                fontWeight={700}
                                sx={{
                                    lineHeight: 1.3,
                                    color: isDark ? '#fff' : 'inherit',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {listing.product_name}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack spacing={0.75}>
                        {listing.location && (
                            <Stack
                                direction='row'
                                alignItems='center'
                                spacing={0.75}
                            >
                                <LocationOnIcon
                                    sx={{
                                        fontSize: 15,
                                        color: 'text.disabled',
                                    }}
                                />
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                    noWrap
                                    sx={{ fontSize: 12 }}
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
                                sx={{ fontSize: 13, color: 'text.disabled' }}
                            />
                            <Typography
                                variant='caption'
                                color='text.secondary'
                                sx={{ fontSize: 11.5 }}
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
                        endIcon={
                            <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                        }
                        sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            py: 1,
                            bgcolor: alpha(accent, 0.08),
                            color: accent,
                            '&:hover': {
                                bgcolor: accent,
                                color: '#fff',
                            },
                        }}
                    >
                        {t('postCard.viewDetails', 'عرض التفاصيل')}
                    </Button>
                </CardActions>
            </Card>
        </m.div>
    );
}

/* ── Main section ───────────────────────────────────── */
export default function HomepageFeaturedSection() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { ads: allAds, loading } = useAllFeaturedAds();
    const [selectedTab, setSelectedTab] = useState<string>('all');
    const { t } = useTranslation();

    const adsByCategory = useMemo(() => {
        const grouped: Record<string, FeaturedAd[]> = { all: allAds };
        const categoriesWithAds = [
            ...new Set(
                allAds.map((ad) => ad.listingId?.category).filter(Boolean),
            ),
        ];
        categoriesWithAds.forEach((cat) => {
            if (cat) {
                grouped[cat] = allAds.filter(
                    (ad) => ad.listingId?.category === cat,
                );
            }
        });
        return grouped;
    }, [allAds]);

    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: string,
    ) => {
        setSelectedTab(newValue);
    };

    if (!loading && allAds.length === 0) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                position: 'relative',
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 4, md: 5 },
                bgcolor: isDark
                    ? 'rgba(255,255,255,0.03)'
                    : 'background.default',
                borderRadius: 4,
                border: isDark
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid',
                borderColor: isDark ? undefined : 'divider',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    insetInlineStart: 0,
                    insetInlineEnd: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
                },
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent='space-between'
                alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                sx={{ mb: 3 }}
                gap={2}
            >
                <Stack direction='row' alignItems='center' spacing={1.75}>
                    <Box
                        sx={{
                            position: 'relative',
                            width: 52,
                            height: 52,
                            borderRadius: '16px',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.7)})`,
                            display: 'grid',
                            placeItems: 'center',
                            boxShadow: `0 12px 24px -12px ${alpha(theme.palette.primary.main, 0.7)}`,
                        }}
                    >
                        <StarIcon sx={{ fontSize: 26, color: 'white' }} />
                        <VerifiedRoundedIcon
                            sx={{
                                position: 'absolute',
                                bottom: -4,
                                insetInlineEnd: -4,
                                fontSize: 18,
                                color: '#fff',
                                bgcolor: theme.palette.success.main,
                                borderRadius: '50%',
                                p: '2px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            }}
                        />
                    </Box>
                    <Box>
                        <Typography
                            variant='overline'
                            sx={{
                                fontWeight: 800,
                                letterSpacing: '0.18em',
                                fontSize: '0.65rem',
                                color: theme.palette.primary.main,
                            }}
                        >
                            {t('ads.showcaseEyebrow', 'مختارات المحرر')}
                        </Typography>
                        <Typography
                            variant='h5'
                            component='h3'
                            fontWeight={900}
                            sx={{
                                mb: 0.5,
                                color: isDark ? '#fff' : 'inherit',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1,
                                fontSize: { xs: '1.4rem', sm: '1.6rem' },
                            }}
                        >
                            {t('ads.financed')}
                        </Typography>
                        {!loading && allAds.length > 0 && (
                            <Typography
                                variant='body2'
                                color='text.secondary'
                                sx={{ fontSize: '0.82rem' }}
                            >
                                {allAds.length}{' '}
                                {t(
                                    'ads.promotionPackages.homepage.FeaturedAdOnTheHomepage',
                                )}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Stack>

            {!loading && allAds.length > 0 && (
                <Box
                    sx={{
                        mb: 4,
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTabs-indicator': {
                            height: 3,
                            borderRadius: '3px 3px 0 0',
                        },
                    }}
                >
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        variant='scrollable'
                        scrollButtons='auto'
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                minWidth: 'auto',
                                px: 2.25,
                                color: isDark
                                    ? 'rgba(255,255,255,0.7)'
                                    : 'text.secondary',
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main,
                                },
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: theme.palette.primary.main,
                            },
                        }}
                    >
                        <Tab label={t('ads.allTab', 'الكل')} value='all' />
                        {Object.entries(adsByCategory)
                            .filter(([key]) => key !== 'all')
                            .map(([category]) => {
                                const categoryInfo = CATEGORY_META[category];
                                if (!categoryInfo) return null;
                                return (
                                    <Tab
                                        key={category}
                                        label={`${categoryInfo.label} (${adsByCategory[category].length})`}
                                        value={category}
                                    />
                                );
                            })}
                    </Tabs>
                </Box>
            )}

            {loading && (
                <Grid container spacing={2.5}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                            <AdCardSkeleton />
                        </Grid>
                    ))}
                </Grid>
            )}

            {!loading && allAds.length > 0 && (
                <Grid container spacing={2.5}>
                    {(selectedTab === 'all'
                        ? allAds
                        : adsByCategory[selectedTab] || []
                    ).map((ad, idx) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ad._id}>
                            <HomepageAdCard ad={ad} index={idx} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {!loading && allAds.length === 0 && (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        bgcolor: alpha(theme.palette.grey[500], 0.05),
                        borderRadius: 3,
                        border: `1px dashed ${alpha(theme.palette.grey[500], 0.25)}`,
                    }}
                >
                    <Typography
                        variant='h6'
                        component='p'
                        color='text.secondary'
                        gutterBottom
                    >
                        {t('ads.noFeaturedAds', 'لا توجد إعلانات مميزة حالياً')}
                    </Typography>
                    <Typography variant='body2' color='text.disabled'>
                        {t(
                            'ads.upgradeToFeature',
                            'قم بترقية إعلانك ليظهر هنا',
                        )}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}
