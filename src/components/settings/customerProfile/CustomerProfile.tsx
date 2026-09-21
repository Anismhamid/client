import {
    Box,
    Button,
    Card,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import {
    FunctionComponent,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowBack,
    LocalOffer,
    Star,
    ThumbUp,
    Visibility,
} from '@mui/icons-material';
import { m, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { User } from '../../../interfaces/chat/usersMessages';
import { Posts } from '../../../interfaces/Posts';
import { getCustomerProfileBySlug } from '../../../services/usersServices';
import { getCustomerProfilePostsBySlug } from '../../../services/postsServices';
import { showError, showSuccess } from '../../../atoms/toasts/ReactToast';
import { path } from '../../../routes/routes';
import handleRTL from '../../../locales/handleRTL';
import JsonLd from '../../../../utils/JsonLd';
import { useUser } from '../../../hooks/useUSer';

import CustomerProfileHeader from './CustomerProfileHeader';
import CustomTabs from './taps/Tabs';
import TabPanel from './taps/TabPanel';
import ProductsTab from './taps/ProductsTap';
import RatingsTab from './taps/RatingsTab';
import ContactInfoTab from './taps/ContactInfoTab';
import { initStats, Stats } from './types/states';

const BRAND_GOLD = '#B8860B';
const BRAND_BROWN = '#8B4513';
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_GOLD} 0%, ${BRAND_BROWN} 100%)`;

interface StatCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    color: string;
    delay?: number;
}

const StatCard: FunctionComponent<StatCardProps> = ({
    icon,
    value,
    label,
    color,
    delay = 0,
}) => {
    const theme = useTheme();
    return (
        <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 2.5 },
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                    bgcolor: 'background.paper',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 28px ${alpha(color, 0.15)}`,
                        borderColor: alpha(color, 0.35),
                    },
                }}
            >
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1.25,
                        bgcolor: alpha(color, 0.1),
                        color,
                    }}
                >
                    {icon}
                </Box>
                <Typography
                    variant='h5'
                    fontWeight={800}
                    sx={{ color, lineHeight: 1.1, mb: 0.5 }}
                >
                    {value}
                </Typography>
                <Typography
                    variant='caption'
                    color='text.secondary'
                    fontWeight={600}
                >
                    {label}
                </Typography>
            </Paper>
        </m.div>
    );
};

const CustomerProfile: FunctionComponent = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { isLoggedIn } = useUser();
    const theme = useTheme();
    const { t } = useTranslation();

    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Posts[]>([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [tabValue, setTabValue] = useState(0);
    const [stats, setStats] = useState<Stats>(initStats);

    const toggleWishlist = useCallback(
        (productId: string) => {
            if (!isLoggedIn) {
                navigate(path.Login);
                return;
            }
            setWishlist((prev) => {
                const next = new Set(prev);
                if (next.has(productId)) {
                    next.delete(productId);
                    showSuccess(t('common.removedFromWishlist'));
                } else {
                    next.add(productId);
                    showSuccess(t('common.addedToWishlist'));
                }
                return next;
            });
        },
        [isLoggedIn, navigate, t],
    );

    const handleTabChange = useCallback(
        (_: SyntheticEvent, v: number) => setTabValue(v),
        [],
    );

    useEffect(() => {
        if (!slug) return;
        const ctrl = new AbortController();

        (async () => {
            try {
                const [profile, productsData] = await Promise.all([
                    getCustomerProfileBySlug(slug),
                    getCustomerProfilePostsBySlug(slug),
                ]);
                if (ctrl.signal.aborted) return;

                setUser(profile);
                setPosts(productsData);

                const totalLikes = productsData.reduce(
                    (sum, p) => sum + (p.likes?.length || 0),
                    0,
                );
                const totalViews = productsData.reduce(
                    (sum, p) => sum + (Number((p as Posts).views) || 0),
                    0,
                );
                const reviewsCount = productsData.reduce(
                    (sum, p) => sum + (p.reviews?.length || 0),
                    0,
                );

                setStats({
                    totalProducts: productsData.length,
                    totalLikes,
                    totalViews,
                    reviewsCount,
                    rating: profile.rating || 0,
                });
            } catch (e) {
                if (!ctrl.signal.aborted) {
                    console.error(e);
                    showError(t('common.loadUserError'));
                }
            } finally {
                if (!ctrl.signal.aborted) setLoading(false);
            }
        })();

        return () => ctrl.abort();
    }, [slug, t]);

  const handleShareProfile = useCallback(async () => {
    if (!user || !slug) return;

    const profileUrl = `${import.meta.env.VITE_API_SOCKET_URL}/users/customer/${slug}`;

    const message = t('common.shareProfileText', {
        name: user.name?.first ?? '',
    });

    const shareText = `${message}\n\n${profileUrl}`;

    try {
        if (navigator.share) {
            await navigator.share({
                title: t('common.shareProfileTitle', {
                    name: `${user.name?.first ?? ''} ${user.name?.last ?? ''}`.trim(),
                }),
                text: shareText,
            });
        } else {
            await navigator.clipboard.writeText(shareText);
            showSuccess(t('common.profileLinkCopied'));
        }
    } catch (e) {
        if (e instanceof Error && e.name !== 'AbortError') {
            console.error('Share profile error:', e);
        }
    }
}, [user, slug, t]);

    const handleWhatsApp = useCallback(() => {
        if (!user?.phone?.phone_1) {
            showError(t('common.noWhatsappNumber'));
            return;
        }
        const clean = user.phone.phone_1.replace(/\s/g, '');
        const msg = t('common.whatsappGreeting', { name: user?.name?.first });
        window.open(
            `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`,
            '_blank noopener noreferrer',
        );
    }, [user, t]);

    const statCards = useMemo(
        () => [
            {
                icon: <LocalOffer sx={{ fontSize: 22 }} />,
                value: stats.totalProducts,
                label: t('common.products'),
                color: '#B8860B', // ذهبي أساسي
            },
            {
                icon: <ThumbUp sx={{ fontSize: 22 }} />,
                value: stats.totalLikes,
                label: t('common.likes'),
                color: '#A0522D', // بني متوسط
            },
            {
                icon: <Visibility sx={{ fontSize: 22 }} />,
                value: stats.totalViews,
                label: t('common.views'),
                color: '#8B6914', // ذهبي داكن
            },
            {
                icon: <Star sx={{ fontSize: 22 }} />,
                value: stats.rating ? stats.rating.toFixed(1) : '—',
                label: t('common.rating'),
                color: '#8B4513', // بني أساسي
            },
        ],
        [stats, t],
    );

    /* === Loading === */
    if (loading) {
        return (
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                minHeight='70vh'
                gap={3}
            >
                <CircularProgress
                    size={52}
                    thickness={4}
                    sx={{ color: BRAND_GOLD }}
                />
                <Typography
                    variant='body1'
                    color='text.secondary'
                    fontWeight={500}
                >
                    {t('common.loadingProfile')}
                </Typography>
            </Box>
        );
    }

    /* === Not Found === */
    if (!user) {
        return (
            <Container maxWidth='sm' sx={{ py: 10, textAlign: 'center' }}>
                <Card
                    sx={{
                        p: 5,
                        borderRadius: 4,
                        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                    }}
                >
                    <Box sx={{ fontSize: 72, mb: 2 }}>😔</Box>
                    <Typography variant='h5' fontWeight={800} gutterBottom>
                        {t('common.userNotFound')}
                    </Typography>
                    <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mb: 4 }}
                    >
                        {t('common.userNotFoundDescription')}
                    </Typography>
                    <Button
                        variant='contained'
                        startIcon={<ArrowBack />}
                        onClick={() => navigate(-1)}
                        sx={{
                            px: 4,
                            py: 1.25,
                            borderRadius: 2.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            background: BRAND_GRADIENT,
                        }}
                    >
                        {t('common.goBack')}
                    </Button>
                </Card>
            </Container>
        );
    }

    const dir = handleRTL();
    const currentUrl = `https://client-qqq1.vercel.app/users/customer/${slug}`;

    return (
        <>
            <link rel='canonical' href={currentUrl} />
            <title>
                {t('profile.seo.title', {
                    firstName: user.name?.first ?? '',
                    lastName: user.name?.last ?? '',
                    city: user.address?.city || t('profile.seo.defaultCity'),
                })}
            </title>
            <meta
                name='description'
                content={t('profile.seo.description', {
                    firstName: user.name?.first ?? '',
                    city: user.address?.city || t('profile.seo.defaultCity'),
                    count: posts.length,
                })}
            />
            <JsonLd data={{}} />

            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: alpha(BRAND_GOLD, 0.025),
                    py: { xs: 3, md: 5 },
                }}
            >
                <Container dir={dir} maxWidth='lg'>
                    {/* === الهيدر === */}
                    <CustomerProfileHeader
                        handleShareProfile={handleShareProfile}
                        handleWhatsApp={handleWhatsApp}
                        navigate={navigate}
                        user={user}
                        slug={slug ?? ''}
                        stats={stats}
                        dir={dir}
                    />

                    {/* === كروت الإحصائيات === */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {statCards.map((s, i) => (
                            <Grid size={{ xs: 6, sm: 3 }} key={i}>
                                <StatCard {...s} delay={i * 0.06} />
                            </Grid>
                        ))}
                    </Grid>

                    {/* === التبويبات === */}
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                        }}
                    >
                        <CustomTabs
                            handleTabChange={handleTabChange}
                            tabValue={tabValue}
                        />

                        <AnimatePresence mode='wait'>
                            <m.div
                                key={tabValue}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
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
                                    <RatingsTab stats={stats} user={user} />
                                </TabPanel>

                                <TabPanel value={tabValue} index={2}>
                                    <ContactInfoTab user={user} />
                                </TabPanel>
                            </m.div>
                        </AnimatePresence>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default CustomerProfile;
