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
} from '@mui/material';
import { FunctionComponent, useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../../../interfaces/chat/usersMessages';
import { getCustomerProfileBySlug } from '../../../services/usersServices';
import { getCustomerProfilePostsBySlug } from '../../../services/postsServices';
import {
    Visibility,
    Star,
    LocalOffer,
    ThumbUp,
    ArrowBack,
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
import CustomerProfileHeader from './CustomerProfileHeader';
import { AuthValues } from '../../../interfaces/authValues';
import { useUser } from '../../../context/useUSer';

const CustomerProfile: FunctionComponent = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { isLoggedIn } = useUser();
    const theme = useTheme();

    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Posts[]>([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [tabValue, setTabValue] = useState(0);
    const [stats, setStats] = useState<Stats>(initStats);

    const toggleWishlist = (productId: string) => {
        if (!isLoggedIn) {
            navigate(path.Login);
            return;
        }

        const newWishlist = new Set(wishlist);
        if (newWishlist.has(productId)) {
            newWishlist.delete(productId);
            showSuccess('تمت إزالة المنتج من المفضلة');
        } else {
            newWishlist.add(productId);
            showSuccess('تمت إضافة المنتج إلى المفضلة');
        }
        setWishlist(newWishlist);
    };

    const handleTabChange = (_: SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

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

    const handleShareProfile = () => {
        if (navigator.share) {
            navigator.share({
                title: `الملف الشخصي لـ ${user?.name?.first} ${user?.name?.last}`,
                text: `اطلع على منتجات ${user?.name?.first} على موقع صفقه`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            showSuccess('تم نسخ رابط الملف الشخصي');
        }
    };

    const handleContactSeller = () => {
        if (user?.phone?.phone_1) {
            window.open(`tel:${user.phone.phone_1}`, '_blank');
        } else {
            showError('لا يوجد رقم هاتف متوفر');
        }
    };

    const handleWhatsApp = () => {
        if (user?.phone?.phone_1) {
            const cleanNumber = user.phone.phone_1;
            const message = `مرحباً ${user?.name?.first}، أنا مهتم بمنتجاتك على موقع صفقه`;
            window.open(
                `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`,
                '_blank noopener noreferrer',
            );
        }
    };

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
                    <CircularProgress size={60} thickness={4} />
                </motion.div>
                <Typography
                    variant='h6'
                    color='text.secondary'
                    fontWeight={500}
                >
                    جاري تحميل الملف الشخصي...
                </Typography>
            </Box>
        );
    }

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
                            bgcolor: alpha(
                                theme.palette.background.paper,
                                0.95,
                            ),
                        }}
                    >
                        <Box sx={{ fontSize: 80, mb: 3 }}>😔</Box>
                        <Typography variant='h4' fontWeight={700} gutterBottom>
                            المستخدم غير موجود
                        </Typography>
                        <Typography
                            variant='body1'
                            color='text.secondary'
                            paragraph
                            sx={{ mb: 4 }}
                        >
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

    // Stats cards configuration
    const statCards = [
        {
            icon: <ThumbUp />,
            value: stats.totalLikes,
            label: 'إعجاب',
            color: theme.palette.primary.main,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            icon: <Visibility />,
            value: stats.totalViews,
            label: 'مشاهدة',
            color: theme.palette.info.main,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        },
        {
            icon: <LocalOffer />,
            value: stats.totalProducts,
            label: 'منتج',
            color: theme.palette.success.main,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        },
        {
            icon: <Star />,
            value: stats.rating,
            label: 'تقييم',
            color: theme.palette.warning.main,
            gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        },
    ];

    return (
        <>
            <link rel='canonical' href={currentUrl} />
            <title>{`منتجات ${user.name?.first} ${user.name?.last} للبيع في ${user.address?.city || 'كافة البلاد'} | صفقة`}</title>
            <meta
                name='description'
                content={`تصفح أفضل العروض من البائع ${user.name?.first} في ${user.address?.city}. متوفر ${posts.length} منتجات تشمل ${posts
                    .slice(0, 3)
                    .map((p) => p.product_name)
                    .join('، ')}. بيع وشراء آمن عبر صفقة.`}
            />
            <JsonLd data={{}} />

            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                }}
            >
                <Container dir={dir} maxWidth='lg' sx={{ py: 4 }}>
                    <CustomerProfileHeader
                        dir={dir}
                        handleContactSeller={handleContactSeller}
                        handleShareProfile={handleShareProfile}
                        handleWhatsApp={handleWhatsApp}
                        navigate={navigate}
                        posts={posts}
                        slug={slug as string}
                        stats={stats}
                        user={user}
                    />

                    {/* Modern Stats Section */}
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
                                                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(stat.color, 0.03)})`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                                                    borderColor: alpha(
                                                        stat.color,
                                                        0.3,
                                                    ),
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
                                                    background: `linear-gradient(135deg, ${alpha(stat.color, 0.12)}, ${alpha(stat.color, 0.05)})`,
                                                    color: stat.color,
                                                }}
                                            >
                                                {stat.icon}
                                            </Box>
                                            <Typography
                                                variant='h3'
                                                fontWeight={800}
                                                sx={{
                                                    fontSize: {
                                                        xs: '1.75rem',
                                                        md: '2rem',
                                                    },
                                                    mb: 0.5,
                                                    background: stat.gradient,
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip:
                                                        'text',
                                                    color: 'transparent',
                                                }}
                                            >
                                                {stat.value}
                                            </Typography>
                                            <Typography
                                                variant='body2'
                                                color='text.secondary'
                                                fontWeight={500}
                                            >
                                                {stat.label}
                                            </Typography>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>

                    {/* Enhanced Tabs Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                            }}
                        >
                            <CustomTabs
                                handleTabChange={handleTabChange}
                                tabValue={tabValue}
                            />

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
                                        <UserInformation
                                            user={user as unknown as AuthValues}
                                        />
                                    </TabPanel>

                                    <TabPanel value={tabValue} index={2}>
                                        <ContactInfoTab user={user} />
                                    </TabPanel>

                                    <TabPanel value={tabValue} index={3}>
                                        <RatingsTab stats={stats} />
                                    </TabPanel>

                                    <TabPanel value={tabValue} index={4}>
                                        <ContactTab
                                            user={user}
                                            handleWhatsApp={handleWhatsApp}
                                        />
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
