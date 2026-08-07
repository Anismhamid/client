import {
    Box,
    Button,
    Card,
    CircularProgress,
    Grid,
    Typography,
    Container,
    Paper,
    useTheme,
    alpha,
    Avatar,
    Badge,
    Chip,
    Stack,
    Rating,
} from '@mui/material';
import { FunctionComponent, useEffect, useState, SyntheticEvent, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, UserMessage } from '../../../interfaces/chat/usersMessages';
import { getCustomerProfileBySlug } from '../../../services/usersServices';
import { getCustomerProfilePostsBySlug } from '../../../services/postsServices';
import {
    Visibility,
    Star,
    LocalOffer,
    ThumbUp,
    ArrowBack,
    Share,
    Phone,
    WhatsApp,
    LocationOn,
    Storefront,
    VerifiedUser,
    ChatBubble,
    ArrowRight,
    ArrowLeft,
} from '@mui/icons-material';
import { Posts } from '../../../interfaces/Posts';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '../../../atoms/toasts/ReactToast';
import { path } from '../../../routes/routes';
import JsonLd from '../../../../utils/JsonLd';
import handleRTL from '../../../locales/handleRTL';
import TabPanel from './taps/TabPanel';
import ProductsTab from './taps/ProductsTap';
import CustomTabs from './taps/Tabs';
import ContactInfoTab from './taps/ContactInfoTab';
import { initStats, Stats } from './types/states';
import RatingsTab from './taps/RatingsTab';
import ContactTab from './taps/ContactTab';
import UserInformation from './taps/UserInformation';
import { AuthValues } from '../../../interfaces/authValues';
import { useUser } from '../../../hooks/useUSer';
import { useChatWindow } from '../../../context/ChatWindowContext';
import RoleType from '../../../interfaces/UserType';

// Brand colors
const BRAND_GOLD = '#B8860B';
const BRAND_BROWN = '#8B4513';
const BRAND_GRADIENT = `linear-gradient(90deg, ${BRAND_GOLD}, ${BRAND_BROWN})`;

const CustomerProfile: FunctionComponent = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { isLoggedIn, auth } = useUser();
    const { openChat } = useChatWindow();
    const theme = useTheme();

    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Posts[]>([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [tabValue, setTabValue] = useState(0);
    const [stats, setStats] = useState<Stats>(initStats);

    const toggleWishlist = useCallback((productId: string) => {
        if (!isLoggedIn) {
            navigate(path.Login);
            return;
        }

        setWishlist((prev) => {
            const newWishlist = new Set(prev);
            if (newWishlist.has(productId)) {
                newWishlist.delete(productId);
                showSuccess('تمت إزالة المنتج من المفضلة');
            } else {
                newWishlist.add(productId);
                showSuccess('تمت إضافة المنتج إلى المفضلة');
            }
            return newWishlist;
        });
    }, [isLoggedIn, navigate]);

    const handleTabChange = useCallback((_: SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    }, []);

    useEffect(() => {
        if (!slug) return;
        const abortController = new AbortController();

        const fetchData = async () => {
            try {
                const [profile, productsData] = await Promise.all([
                    getCustomerProfileBySlug(slug),
                    getCustomerProfilePostsBySlug(slug),
                ]);

                setUser(profile);
                setPosts(productsData);

                const totalLikes = productsData.reduce(
                    (sum, post) => sum + (post.likes?.length || 0),
                    0,
                );
                const totalViews = productsData.reduce(
                    (sum, post) => sum + (Number(post.reviews?.length) || 0),
                    0,
                );

                setStats({
                    totalProducts: productsData.length,
                    totalLikes,
                    totalViews,
                    rating: profile.rating || 4.5,
                });
            } catch (error) {
                console.error(error);
                showError('حدث خطأ في تحميل بيانات المستخدم');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        return () => abortController.abort();
    }, [slug]);

    const handleShareProfile = useCallback(async () => {
        const shareData = {
            title: `الملف الشخصي لـ ${user?.name?.first} ${user?.name?.last}`,
            text: `اطلع على منتجات ${user?.name?.first} على موقع صفقه`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Share error:', error);
                }
            }
        } else {
            await navigator.clipboard.writeText(window.location.href);
            showSuccess('تم نسخ رابط الملف الشخصي');
        }
    }, [user]);

    const handleWhatsApp = useCallback(() => {
        if (user?.phone?.phone_1) {
            const cleanNumber = user.phone.phone_1.replace(/\s/g, '');
            const message = `مرحباً ${user?.name?.first}، أنا مهتم بمنتجاتك على موقع صفقه`;
            window.open(
                `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`,
                '_blank noopener noreferrer',
            );
        } else {
            showError('لا يوجد رقم هاتف متوفر للواتساب');
        }
    }, [user]);

    const handleOpenChat = useCallback(() => {
        if (!auth?._id) {
            navigate(path.Login);
            return;
        }
        if (!user?._id) {
            showError('لا يمكن فتح المحادثة، المستخدم غير متوفر');
            return;
        }
        openChat(user as UserMessage);
    }, [auth, navigate, openChat, user]);

    // Memoized stat cards
    const statCards = useMemo(() => [
        {
            icon: <ThumbUp sx={{ fontSize: 28 }} />,
            value: stats.totalLikes,
            label: 'إعجاب',
            color: BRAND_GOLD,
            gradient: `linear-gradient(135deg, ${BRAND_GOLD} 0%, ${BRAND_BROWN} 100%)`,
        },
        {
            icon: <Visibility sx={{ fontSize: 28 }} />,
            value: stats.totalViews,
            label: 'مشاهدة',
            color: '#A0522D',
            gradient: 'linear-gradient(135deg, #A0522D 0%, #6B3410 100%)',
        },
        {
            icon: <LocalOffer sx={{ fontSize: 28 }} />,
            value: stats.totalProducts,
            label: 'منتج',
            color: '#8B6914',
            gradient: 'linear-gradient(135deg, #C9A227 0%, #8B6914 100%)',
        },
        {
            icon: <Star sx={{ fontSize: 28 }} />,
            value: stats.rating.toFixed(1),
            label: 'تقييم',
            color: BRAND_BROWN,
            gradient: `linear-gradient(135deg, #D2955B 0%, ${BRAND_BROWN} 100%)`,
        },
    ], [stats]);

    // Loading Skeleton
    if (loading) {
        return (
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                minHeight='80vh'
                gap={3}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <CircularProgress
                        size={60}
                        thickness={4}
                        sx={{ color: BRAND_GOLD }}
                    />
                </motion.div>
                <Typography variant='h6' color='text.secondary' fontWeight={500}>
                    جاري تحميل الملف الشخصي...
                </Typography>
            </Box>
        );
    }

    // Not Found State
    if (!user) {
        return (
            <Container maxWidth='md' sx={{ py: 8, textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card
                        sx={{
                            p: 5,
                            borderRadius: 5,
                            textAlign: 'center',
                            bgcolor: alpha(theme.palette.background.paper, 0.95),
                        }}
                    >
                        <Box sx={{ fontSize: 80, mb: 3 }}>😔</Box>
                        <Typography variant='h4' fontWeight={700} gutterBottom>
                            المستخدم غير موجود
                        </Typography>
                        <Typography variant='body1' color='text.secondary' paragraph sx={{ mb: 4 }}>
                            الملف الشخصي الذي تبحث عنه غير موجود أو تم حذفه.
                        </Typography>
                        <Button
                            variant='contained'
                            startIcon={<ArrowBack />}
                            onClick={() => navigate(-1)}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                background: `linear-gradient(135deg, ${BRAND_GOLD} 0%, ${BRAND_BROWN} 100%)`,
                            }}
                        >
                            العودة للخلف
                        </Button>
                    </Card>
                </motion.div>
            </Container>
        );
    }

    const currentUrl = `https://client-qqq1.vercel.app/users/customer/${slug}`;
    const dir = handleRTL();
    const isRtl = dir === 'rtl';

    return (
        <>
            <link rel='canonical' href={currentUrl} />
            <title>{`منتجات ${user.name?.first} ${user.name?.last} للبيع في ${user.address?.city || 'كافة البلاد'} | صفقة`}</title>
            <meta
                name='description'
                content={`تصفح أفضل العروض من البائع ${user.name?.first} في ${user.address?.city}. متوفر ${posts.length} منتجات. بيع وشراء آمن عبر صفقة.`}
            />
            <JsonLd data={{}} />

            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: alpha(BRAND_GOLD, 0.03),
                    py: 4,
                }}
            >
                <Container dir={dir} maxWidth='lg'>
                    {/* Profile Header - Integrated */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card
                            sx={{
                                mb: 4,
                                borderRadius: 4,
                                boxShadow: theme.shadows[2],
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 70%, ${BRAND_GOLD}10 100%)`,
                                position: 'relative',
                                overflow: 'visible',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 6,
                                    background: BRAND_GRADIENT,
                                    borderRadius: '4px 4px 0 0',
                                },
                            }}
                        >
                            {/* Back Button */}
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-start' }}>
                                <Button
                                    size='small'
                                    variant='text'
                                    startIcon={isRtl ? <ArrowRight /> : <ArrowLeft />}
                                    onClick={() => navigate(-1)}
                                    sx={{
                                        fontWeight: '600',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            transform: isRtl ? 'translateX(4px)' : 'translateX(-4px)',
                                            backgroundColor: 'transparent',
                                            color: BRAND_BROWN,
                                        },
                                    }}
                                >
                                    رجوع
                                </Button>
                            </Box>

                            <Box sx={{ px: { xs: 3, md: 4 }, pb: { xs: 4, md: 4 }, pt: 0 }}>
                                <Grid container spacing={{ xs: 4, md: 2 }} alignItems='center'>
                                    {/* Avatar */}
                                    <Grid size={{ xs: 12, md: 'auto' }} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Box position='relative'>
                                            <Badge
                                                overlap='circular'
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: isRtl ? 'right' : 'left',
                                                }}
                                                badgeContent={
                                                    <VerifiedUser
                                                        sx={{
                                                            color: BRAND_GOLD,
                                                            fontSize: 32,
                                                            bgcolor: 'background.paper',
                                                            borderRadius: '50%',
                                                            p: 0.5,
                                                            boxShadow: 2,
                                                        }}
                                                    />
                                                }
                                            >
                                                <Avatar
                                                    src={user.image?.url}
                                                    sx={{
                                                        width: { xs: 130, md: 160 },
                                                        height: { xs: 130, md: 160 },
                                                        border: `4px solid ${theme.palette.background.paper}`,
                                                        boxShadow: theme.shadows[4],
                                                        background: BRAND_GRADIENT,
                                                        fontSize: '2rem',
                                                        fontWeight: 'bold',
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'scale(1.04)',
                                                            boxShadow: `0 0 20px ${BRAND_GOLD}30`,
                                                        },
                                                    }}
                                                >
                                                    {user.name?.first?.charAt(0).toUpperCase()}
                                                    {user.name?.last?.charAt(0).toUpperCase()}
                                                </Avatar>
                                            </Badge>
                                        </Box>
                                    </Grid>

                                    {/* Profile Info */}
                                    <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                        <Typography variant='h4' fontWeight='800' sx={{ mb: 1, letterSpacing: '-0.5px' }}>
                                            {`${user.name?.first || ''} ${user.name?.last || ''}`.trim() || 'مستخدم'}
                                        </Typography>

                                        <Stack
                                            direction='row'
                                            flexWrap='wrap'
                                            alignItems='center'
                                            justifyContent={{ xs: 'center', md: 'flex-start' }}
                                            spacing={1}
                                            useFlexGap
                                            sx={{ mb: 2 }}
                                        >
                                            <Typography variant='subtitle2' color='text.secondary' fontWeight='600'>
                                                اسم النشاط التجاري
                                            </Typography>
                                            <Typography variant='subtitle2' fontWeight='700' sx={{ color: BRAND_BROWN }}>
                                                @{slug}
                                            </Typography>
                                            <Chip
                                                icon={<Storefront style={{ fontSize: 16 }} />}
                                                label='بائع معتمد'
                                                size='small'
                                                sx={{
                                                    fontWeight: 'bold',
                                                    borderRadius: 1.5,
                                                    background: BRAND_GRADIENT,
                                                    color: '#fff',
                                                    '& .MuiChip-icon': { color: '#fff' },
                                                }}
                                            />
                                            {user.role === RoleType.Admin && (
                                                <Chip
                                                    label='مدير'
                                                    size='small'
                                                    color='warning'
                                                    sx={{ fontWeight: 'bold', borderRadius: 1.5 }}
                                                />
                                            )}
                                        </Stack>

                                        {/* Rating */}
                                        <Stack
                                            direction='row'
                                            alignItems='center'
                                            justifyContent={{ xs: 'center', md: 'flex-start' }}
                                            spacing={1}
                                            sx={{ mb: 2.5 }}
                                        >
                                            <Rating
                                                value={stats.rating}
                                                precision={0.5}
                                                readOnly
                                                size='small'
                                                sx={{ color: BRAND_GOLD }}
                                            />
                                            <Typography variant='caption' color='text.secondary' fontWeight='600'>
                                                ({stats.rating.toFixed(1)} من 5)
                                            </Typography>
                                        </Stack>

                                        {/* Quick Info */}
                                        <Stack
                                            direction='row'
                                            flexWrap='wrap'
                                            spacing={1}
                                            useFlexGap
                                            justifyContent={{ xs: 'center', md: 'flex-start' }}
                                        >
                                            {user.phone?.phone_1 && (
                                                <Chip
                                                    icon={<Phone style={{ fontSize: 14 }} />}
                                                    label={user.phone.phone_1}
                                                    variant='outlined'
                                                    size='small'
                                                    sx={{ borderRadius: 1.5, borderColor: 'divider' }}
                                                />
                                            )}
                                            {user.address?.city && (
                                                <Chip
                                                    icon={<LocationOn style={{ fontSize: 14 }} />}
                                                    label={user.address.city}
                                                    variant='outlined'
                                                    size='small'
                                                    sx={{ borderRadius: 1.5, borderColor: 'divider' }}
                                                />
                                            )}
                                        </Stack>
                                    </Grid>

                                    {/* Action Buttons */}
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Stack spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Button
                                                variant='contained'
                                                size='small'
                                                disableElevation
                                                startIcon={<ChatBubble />}
                                                fullWidth
                                                onClick={handleOpenChat}
                                                sx={{
                                                    fontWeight: 'bold',
                                                    borderRadius: 1.5,
                                                    py: 1.2,
                                                    gap: 1,
                                                    background: BRAND_GRADIENT,
                                                    '&:hover': {
                                                        opacity: 0.9,
                                                        transform: 'translateY(-1px)',
                                                    },
                                                }}
                                            >
                                                تواصل عبر المنصة
                                            </Button>

                                            <Button
                                                variant='outlined'
                                                size='small'
                                                fullWidth
                                                color='success'
                                                startIcon={<WhatsApp />}
                                                onClick={handleWhatsApp}
                                                sx={{
                                                    fontWeight: 'bold',
                                                    py: 1.2,
                                                    borderWidth: 1.5,
                                                    gap: 1,
                                                    '&:hover': {
                                                        borderColor: '#25D366',
                                                        bgcolor: alpha('#25D366', 0.04),
                                                    },
                                                }}
                                            >
                                                واتساب
                                            </Button>

                                            <Button
                                                variant='text'
                                                size='small'
                                                fullWidth
                                                startIcon={<Share sx={{ fontSize: 18 }} />}
                                                onClick={handleShareProfile}
                                                sx={{
                                                    fontWeight: 600,
                                                    color: 'text.secondary',
                                                    py: 1,
                                                    borderRadius: 2,
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        color: BRAND_BROWN,
                                                        bgcolor: alpha(BRAND_GOLD, 0.04),
                                                    },
                                                }}
                                            >
                                                مشاركة الملف الشخصي
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Grid container spacing={2.5} sx={{ mb: 5 }}>
                            {statCards.map((stat, index) => (
                                <Grid size={{ xs: 6, sm: 3 }} key={index}>
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                textAlign: 'center',
                                                borderRadius: 4,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(stat.color, 0.04)})`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: `0 8px 24px ${alpha(stat.color, 0.18)}`,
                                                    borderColor: alpha(stat.color, 0.3),
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 3,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 12px',
                                                    background: `linear-gradient(135deg, ${alpha(stat.color, 0.14)}, ${alpha(stat.color, 0.05)})`,
                                                    color: stat.color,
                                                }}
                                            >
                                                {stat.icon}
                                            </Box>
                                            <Typography
                                                variant='h3'
                                                fontWeight={800}
                                                sx={{
                                                    fontSize: { xs: '1.75rem', md: '2rem' },
                                                    mb: 0.5,
                                                    background: stat.gradient,
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    color: 'transparent',
                                                }}
                                            >
                                                {stat.value}
                                            </Typography>
                                            <Typography variant='body2' color='text.secondary' fontWeight={500}>
                                                {stat.label}
                                            </Typography>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>

                    {/* Tabs Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card sx={{ overflow: 'hidden' }}>
                            <CustomTabs handleTabChange={handleTabChange} tabValue={tabValue} />

                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={tabValue}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <TabPanel value={tabValue} index={0}>
                                        <ProductsTab
                                            toggleWishlist={toggleWishlist}
                                            wishlist={wishlist}
                                            products={posts}
                                            tabValue={tabValue}
                                            user={user}
                                        />
                                    </TabPanel>

                                    <TabPanel value={tabValue} index={1}>
                                        <UserInformation user={user as unknown as AuthValues} />
                                    </TabPanel>

                                    <TabPanel value={tabValue} index={2}>
                                        <ContactInfoTab user={user} />
                                    </TabPanel>

                                    <TabPanel value={tabValue} index={3}>
                                        <RatingsTab stats={stats} user={user} />
                                    </TabPanel>

                                    <TabPanel value={tabValue} index={4}>
                                        <ContactTab user={user} handleWhatsApp={handleWhatsApp} />
                                    </TabPanel>
                                </motion.div>
                            </AnimatePresence>
                        </Card>
                    </motion.div>
                </Container>
            </Box>
        </>
    );
};

export default CustomerProfile;