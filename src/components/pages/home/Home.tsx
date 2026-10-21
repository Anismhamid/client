// pages/Home.tsx
import {
    FunctionComponent,
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    Box,
    Button,
    Container,
    Fab,
    Fade,
    Grid,
    Paper,
    Typography,
    Stack,
    Divider,
    Chip,
    alpha,
    useTheme,
} from '@mui/material';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SparkleRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { m, useScroll, useSpring } from 'framer-motion';

import { Link as RouterLink } from 'react-router-dom';

import HeroSection from './HeroSection';
import StatsStrip from './StatsStrip';
import AdsSection from './AdsSection';

import Loader from '../../../atoms/loader/Loader';

const AddProductModal = lazy(
    () =>
        import('../../../atoms/productsManage/addAndUpdateProduct/CreatePostModal'),
);
const UpdateProductModal = lazy(
    () =>
        import('../../../atoms/productsManage/addAndUpdateProduct/UpdatePostModal'),
);
import { useUser } from '../../../hooks/useUSer';
import { usePosts } from '../../../hooks/usePosts';
import RoleType from '../../../interfaces/UserType';
import handleRTL from '../../../locales/handleRTL';
import { deletePost } from '../../../services/postsServices';
import JsonLd from '../../../../utils/JsonLd';
import { useTranslation } from 'react-i18next';
import { path } from '../../../routes/routes';
import { Posts } from '../../../interfaces/Posts';
import AlertDialogs from '../../../atoms/toasts/Sweetalert';
import { BRAND } from '../../navbar/theme/brand';
import CategoryBar from './Categorybar';
import HowItWorks from './Howitworks';
import { showInfo } from '../../../atoms/toasts/ReactToast';

const DiscountsAndOffers = lazy(() => import('../products/DiscountsAndOffers'));
const ContactCTA = lazy(() => import('./ContactCTA'));
const PostsGrid = lazy(() => import('./PostsGrid'));

const QUICK_HELP_LINKS = [
    {
        icon: StorefrontOutlinedIcon,
        to: '/help/selling',
        key: 'pages.contact.howToSell',
        fallback: 'كيفية البيع',
        accent: '#C8783C',
    },
    {
        icon: ShieldOutlinedIcon,
        to: null,
        pathKey: 'SafetyHelp' as const,
        key: 'pages.contact.safetyTips',
        fallback: 'نصائح الأمان',
        accent: '#3E7B6A',
    },
    {
        icon: GavelOutlinedIcon,
        to: null,
        pathKey: 'DisputesHelp' as const,
        key: 'pages.contact.resolveDisputes',
        fallback: 'حل النزاعات',
        accent: '#7A5C8E',
    },
];

const Home: FunctionComponent = () => {
    const { auth } = useUser();
    const { t } = useTranslation();
    const direction = handleRTL();
    const theme = useTheme();
    const { posts: initialPosts, refetch } = usePosts();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [postIdToUpdate, setPostIdToUpdate] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState('');
    const [posts, setPosts] = useState<Posts[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );

    const categories = useMemo(() => {
        const counts = new Map<string, number>();
        posts.forEach((p) => {
            const name = p.category ? String(p.category) : '';
            if (name) counts.set(name, (counts.get(name) || 0) + 1);
        });
        return [...counts.entries()]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [posts]);

    const filteredPosts = useMemo(
        () =>
            selectedCategory
                ? posts.filter((p) => String(p.category) === selectedCategory)
                : posts,
        [posts, selectedCategory],
    );

    const [showBackToTop, setShowBackToTop] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 600);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLikeToggle = useCallback(
        async (postId: string) => {
            if (!auth?._id) return;
            const userId = auth._id;
            setPosts((prev) =>
                prev.map((p) => {
                    if (p._id !== postId) return p;
                    const liked = p.likes?.includes(userId);
                    return {
                        ...p,
                        likes: liked
                            ? p.likes!.filter((id) => id !== userId)
                            : [...(p.likes || []), userId],
                    };
                }),
            );
        },
        [auth?._id],
    );

    const isAdmin = auth?.role === RoleType.Admin;
    const isModerator = auth?.role === RoleType.Moderator;
    const canEdit = isAdmin || isModerator;

    const handleDelete = useCallback(async (postId: string) => {
        try {
            await deletePost(postId);
            setPosts((prev) => prev.filter((p) => p._id !== postId));
            setPostToDelete('');
        } catch (err) {
            console.error(err);
            throw err;
        }
    }, []);

    const currentUrl = window.location.origin;

    return (
        <>
            {/* ─── SEO ─── */}
            <title>صفقة | بيع وشراء جديد ومستعمل</title>
            <meta
                name='description'
                content='صفقة منصة إلكترونية لبيع وشراء المنتجات الجديدة والمستعملة بسهولة وأمان'
            />
            <link rel='icon' href='/d3.png' />
            <link rel='apple-touch-icon' href='/d3.png' />
            <link rel='canonical' href={currentUrl} />
            <meta property='og:title' content='صفقة | بيع وشراء جديد ومستعمل' />
            <meta
                property='og:description'
                content='بيع وشراء المنتجات بسهولة وأمان'
            />
            <meta
                property='og:image'
                content='https://client-qqq1.vercel.app/d3.png'
            />
            <meta property='og:url' content={currentUrl} />
            <meta property='og:type' content='website' />
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@graph': [
                        {
                            '@type': 'WebSite',
                            '@id': 'https://client-qqq1.vercel.app/#website',
                            name: 'صفقة',
                            alternateName: 'Safqa',
                            url: currentUrl,
                        },
                        {
                            '@type': 'Organization',
                            '@id': 'https://client-qqq1.vercel.app/#organization',
                            name: 'صفقة',
                            alternateName: 'Safqa',
                            url: currentUrl,
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://client-qqq1.vercel.app/d3.png',
                            },
                        },
                    ],
                }}
            />

            {/* ─── SCROLL PROGRESS ─── */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    insetInlineStart: 0,
                    insetInlineEnd: 0,
                    height: 3,
                    zIndex: (theme) => theme.zIndex.appBar + 1,
                    pointerEvents: 'none',
                }}
            >
                <m.div
                    style={{
                        height: '100%',
                        background: BRAND.gradient,
                        scaleX,
                        transformOrigin: direction === 'rtl' ? 'right' : 'left',
                    }}
                />
            </Box>

            {/* ─── HERO ─── */}
            <header>
                <HeroSection onAddProduct={() => setShowAddModal(true)} />
            </header>

            <main id='listing-section' dir={direction}>
                <section id='ads-section'>
                    <AdsSection />
                </section>

                {/* ─── STATS ─── */}
                <section id='StatsStrip-section'>
                    <StatsStrip postsCount={posts.length} />
                </section>

                {/* ─── HELP — Editorial Card Redesign ─── */}
                <section id='help-section'>
                    <Container
                        maxWidth='lg'
                        sx={{ px: { xs: 1.5, sm: 3, md: 4 } }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                position: 'relative',
                                my: { xs: 4, md: 6 },
                                p: { xs: 2.5, md: 4 },
                                borderRadius: '24px',
                                overflow: 'hidden',
                                background: `
                                    radial-gradient(120% 140% at ${direction === 'rtl' ? '100%' : '0%'} 0%,
                                        ${alpha(BRAND.brown, 0.08)} 0%,
                                        transparent 55%),
                                    ${theme.palette.background.paper}
                                `,
                                border: `1px solid ${alpha(BRAND.brown, 0.15)}`,
                                boxShadow: `0 24px 60px -32px ${alpha(BRAND.brown, 0.35)}`,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundImage: `
                                        repeating-linear-gradient(
                                            45deg,
                                            ${alpha(BRAND.brown, 0.03)} 0px,
                                            ${alpha(BRAND.brown, 0.03)} 1px,
                                            transparent 1px,
                                            transparent 12px
                                        )
                                    `,
                                    pointerEvents: 'none',
                                },
                            }}
                        >
                            {/* Header row */}
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                justifyContent='space-between'
                                gap={1.5}
                                mb={3}
                                sx={{ position: 'relative' }}
                            >
                                <Box>
                                    <Stack
                                        direction='row'
                                        alignItems='center'
                                        gap={1}
                                        mb={0.5}
                                    >
                                        <Chip
                                            size='small'
                                            icon={
                                                <SparkleRoundedIcon
                                                    sx={{ fontSize: 14 }}
                                                />
                                            }
                                            label={t(
                                                'pages.contact.helpEyebrow',
                                                'مصمّم لمساعدتك',
                                            )}
                                            sx={{
                                                bgcolor: alpha(
                                                    BRAND.brown,
                                                    0.1,
                                                ),
                                                color: BRAND.brown,
                                                fontWeight: 700,
                                                fontSize: '0.7rem',
                                                '& .MuiChip-icon': {
                                                    color: BRAND.brown,
                                                },
                                            }}
                                        />
                                    </Stack>
                                    <Typography
                                        variant='h5'
                                        component='h3'
                                        fontWeight={800}
                                        sx={{
                                            fontSize: {
                                                xs: '1.25rem',
                                                md: '1.6rem',
                                            },
                                            letterSpacing: '-0.02em',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {t(
                                            'pages.contact.quickHelp',
                                            'مساعدتك السريعة',
                                        )}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        component='h4'
                                        color='text.secondary'
                                        sx={{
                                            mt: 0.5,
                                            maxWidth: 460,
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        {t(
                                            'pages.contact.quickHelpSub',
                                            'خطوات بسيطة تنقلك من الفكرة إلى الصفقة بأمان.',
                                        )}
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* Cards */}
                            <Grid container spacing={2}>
                                {QUICK_HELP_LINKS.map((link, idx) => {
                                    const Icon = link.icon;
                                    const to = link.pathKey
                                        ? path[link.pathKey]
                                        : link.to!;
                                    return (
                                        <Grid
                                            key={link.key}
                                            size={{ xs: 12, sm: 4 }}
                                        >
                                            <Button
                                                fullWidth
                                                aria-label={t(
                                                    link.key,
                                                    link.fallback,
                                                )}
                                                component={RouterLink}
                                                to={to}
                                                sx={{
                                                    position: 'relative',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    justifyContent:
                                                        'space-between',
                                                    gap: 2,
                                                    p: 2.5,
                                                    minHeight: 168,
                                                    borderRadius: '18px',
                                                    bgcolor: 'background.paper',
                                                    border: `1px solid ${alpha(link.accent, 0.18)}`,
                                                    textTransform: 'none',
                                                    textAlign: 'start',
                                                    color: 'text.primary',
                                                    overflow: 'hidden',
                                                    WebkitTapHighlightColor:
                                                        'transparent',
                                                    transition:
                                                        'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        insetInlineEnd: -30,
                                                        top: -30,
                                                        width: 100,
                                                        height: 100,
                                                        borderRadius: '50%',
                                                        background: `radial-gradient(circle, ${alpha(link.accent, 0.12)} 0%, transparent 70%)`,
                                                        transition:
                                                            'transform 0.35s ease',
                                                    },
                                                    '&:hover': {
                                                        transform:
                                                            'translateY(-4px)',
                                                        borderColor:
                                                            link.accent,
                                                        boxShadow: `0 20px 40px -20px ${alpha(link.accent, 0.5)}`,
                                                        '&::after': {
                                                            transform:
                                                                'scale(1.4)',
                                                        },
                                                        '& .help-arrow': {
                                                            transform:
                                                                direction ===
                                                                'rtl'
                                                                    ? 'translateX(-4px)'
                                                                    : 'translateX(4px)',
                                                            opacity: 1,
                                                        },
                                                    },
                                                    '&:active': {
                                                        transform:
                                                            'translateY(-2px) scale(0.99)',
                                                    },
                                                }}
                                            >
                                                {/* Index numeral */}
                                                <Typography
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 12,
                                                        insetInlineEnd: 16,
                                                        fontSize: '2.5rem',
                                                        fontWeight: 900,
                                                        lineHeight: 1,
                                                        color: alpha(
                                                            link.accent,
                                                            0.1,
                                                        ),
                                                        fontFamily:
                                                            '"Georgia", serif',
                                                    }}
                                                >
                                                    0{idx + 1}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: '14px',
                                                        display: 'grid',
                                                        placeItems: 'center',
                                                        bgcolor: alpha(
                                                            link.accent,
                                                            0.1,
                                                        ),
                                                        color: link.accent,
                                                        border: `1px solid ${alpha(link.accent, 0.2)}`,
                                                    }}
                                                >
                                                    <Icon
                                                        sx={{ fontSize: 22 }}
                                                    />
                                                </Box>

                                                <Box sx={{ width: '100%' }}>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 700,
                                                            fontSize: '0.95rem',
                                                            mb: 0.5,
                                                            lineHeight: 1.3,
                                                        }}
                                                    >
                                                        {t(
                                                            link.key,
                                                            link.fallback,
                                                        )}
                                                    </Typography>
                                                    <Stack
                                                        direction='row'
                                                        alignItems='center'
                                                        gap={0.5}
                                                        sx={{
                                                            color: link.accent,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    '0.75rem',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {t(
                                                                'common.learnMore',
                                                                'اعرف المزيد',
                                                            )}
                                                        </Typography>
                                                        <ArrowForwardRoundedIcon
                                                            className='help-arrow'
                                                            sx={{
                                                                fontSize: 14,
                                                                opacity: 0.6,
                                                                transition:
                                                                    'all 0.25s ease',
                                                                transform:
                                                                    direction ===
                                                                    'rtl'
                                                                        ? 'scaleX(-1)'
                                                                        : 'none',
                                                            }}
                                                        />
                                                    </Stack>
                                                </Box>
                                            </Button>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Paper>
                    </Container>
                </section>

                <HowItWorks />
                <section id='Discounts-and-offers'>
                    <Suspense fallback={<Loader />}>
                        <DiscountsAndOffers />
                    </Suspense>
                </section>

                {/* ─── LISTINGS — Section header ─── */}
                <Container maxWidth='lg' sx={{ px: { xs: 1.5, sm: 3, md: 4 } }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                        justifyContent='space-between'
                        gap={1}
                        sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 1.5, md: 2 } }}
                    >
                        <Box>
                            <Typography
                                variant='overline'
                                component='p'
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: '0.15em',
                                    color: BRAND.brown,
                                    fontSize: '0.68rem',
                                }}
                            >
                                {t('home.listingEyebrow', 'استكشف السوق')}
                            </Typography>
                            <Typography
                                variant='h2'
                                component='h2'
                                fontWeight={800}
                                sx={{
                                    fontSize: { xs: '1.5rem', md: '2rem' },
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1.15,
                                }}
                            >
                                {t('home.latestListings', 'أحدث الإعلانات')}
                            </Typography>
                        </Box>
                        <Divider
                            sx={{
                                flex: 1,
                                display: { xs: 'none', sm: 'block' },
                                borderColor: 'divider',
                                mb: 1.2,
                                mx: 2,
                            }}
                        />
                        <Chip
                            label={t('home.totalCount', {
                                count: filteredPosts.length,
                                defaultValue: '{{count}} إعلان',
                            })}
                            size='small'
                            sx={{
                                fontWeight: 700,
                                bgcolor: alpha(BRAND.brown, 0.08),
                                color: BRAND.brown,
                                mb: 0.5,
                            }}
                        />
                    </Stack>
                </Container>

                <CategoryBar
                    categories={categories}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                    total={posts.length}
                />

                <Suspense fallback={<Loader />}>
                    <PostsGrid
                        key={selectedCategory ?? 'all'}
                        posts={filteredPosts}
                        canEdit={canEdit}
                        onSetPostIdToUpdate={setPostIdToUpdate}
                        onShowUpdateModal={() => setShowUpdateModal(true)}
                        onOpenDeleteModal={(name) => {
                            setPostToDelete(name);
                            setShowDeleteModal(true);
                        }}
                        onLikeToggle={handleLikeToggle}
                    />
                </Suspense>

                <Suspense fallback={<Loader />}>
                    <ContactCTA />
                </Suspense>
            </main>

            {/* ─── BACK TO TOP ─── */}
            <Fade in={showBackToTop}>
                <Fab
                    size='small'
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    aria-label={t('common.backToTop', 'العودة للأعلى')}
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        insetInlineStart: 20,
                        background: BRAND.gradient,
                        color: '#fff',
                        boxShadow: `0 8px 20px -6px ${BRAND.ledger(0.6)}`,
                        '&:hover': {
                            background: BRAND.gradient,
                            filter: 'brightness(1.1)',
                        },
                    }}
                >
                    <KeyboardArrowUpRoundedIcon />
                </Fab>
            </Fade>

            {/* ─── MODALS ─── */}
            <Suspense fallback={<Loader />}>
                <UpdateProductModal
                    refresh={refetch}
                    postId={postIdToUpdate}
                    show={showUpdateModal}
                    onHide={() => setShowUpdateModal(false)}
                />
            </Suspense>

            <Suspense fallback={<Loader />}>
                <AlertDialogs
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    title={t('alerts.deletePost.title')}
                    description={t('alerts.deletePost.description', {
                        name: postToDelete,
                    })}
                    onConfirm={() => {
                        if (postToDelete) return handleDelete(postToDelete);
                    }}
                    confirmText={t('common.delete', 'حذف')}
                    cancelText={t('common.cancel', 'إلغاء')}
                    successText={t(
                        'alerts.deletePost.success',
                        'تم حذف المنتج بنجاح',
                    )}
                    errorText={t(
                        'alerts.deletePost.error',
                        'حدث خطأ أثناء حذف المنتج',
                    )}
                />
            </Suspense>

            <Suspense fallback={<Loader />}>
                <AddProductModal
                    show={showAddModal}
                    onHide={() => setShowAddModal(false)}
                    onSuccess={() => {
                        refetch();
                        showInfo(
                            t(
                                'posts.pendingReview',
                                'وصلنا إعلانك وهو قيد المراجعة. رح نبلغك أول ما ينقبل.',
                            ),
                        );
                    }}
                />
            </Suspense>
        </>
    );
};

export default Home;
