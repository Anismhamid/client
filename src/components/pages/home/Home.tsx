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
} from '@mui/material';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { m, useScroll, useSpring } from 'framer-motion';

import { Link as RouterLink } from 'react-router-dom';

import HeroSection from './HeroSection';
import StatsStrip from './StatsStrip';
import AdsSection from './AdsSection';
import SealBadge from './SealBadge';

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
// import HowItWorks from './Howitworks';
const DiscountsAndOffers = lazy(() => import('../products/DiscountsAndOffers'));
const ContactCTA = lazy(() => import('./ContactCTA'));
const PostsGrid = lazy(() => import('./PostsGrid'));

const QUICK_HELP_LINKS = [
    {
        icon: StorefrontOutlinedIcon,
        to: '/help/selling',
        key: 'pages.contact.howToSell',
        fallback: 'كيفية البيع',
    },
    {
        icon: ShieldOutlinedIcon,
        to: null,
        pathKey: 'SafetyHelp' as const,
        key: 'pages.contact.safetyTips',
        fallback: 'نصائح الأمان',
    },
    {
        icon: GavelOutlinedIcon,
        to: null,
        pathKey: 'DisputesHelp' as const,
        key: 'pages.contact.resolveDisputes',
        fallback: 'حل النزاعات',
    },
];

const Home: FunctionComponent = () => {
    const { auth } = useUser();
    const { t } = useTranslation();
    const direction = handleRTL();
    const { posts: initialPosts, refetch } = usePosts();

    // Modals state
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [postIdToUpdate, setPostIdToUpdate] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState('');
    const [posts, setPosts] = useState<Posts[]>([]);

    // Category filter
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

    // Back-to-top FAB (يتحدّث فقط لما تتغيّر القيمة، مو كل scroll)
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Scroll progress بدون re-render للصفحة
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 600);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLikeToggle = useCallback(
        async (postId: string) => {
            if (!auth?._id) return;
            const userId = auth._id;

            // optimistic update
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
            <HowItWorks />{' '}
            <main id='listing-section' dir={direction}>
                {/* ─── STATS (حافة مسننة ملاصقة للـ Hero) ─── */}
                <section id='StatsStrip-section'>
                    <StatsStrip postsCount={posts.length} />
                </section>

                {/* ─── HELP ─── */}
                <section id='help-section'>
                    <Container
                        maxWidth='lg'
                        sx={{ px: { xs: 1.5, sm: 3, md: 4 } }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 2, md: 3 },
                                my: { xs: 3, md: 4 },
                                border: '1px dashed',
                                borderColor: 'divider',
                                borderRadius: '16px',
                                bgcolor: 'background.paper',
                            }}
                        >
                            <Typography
                                variant='h6'
                                gutterBottom
                                fontWeight='bold'
                                textAlign='center'
                                sx={{
                                    fontSize: { xs: '1.05rem', md: '1.25rem' },
                                }}
                            >
                                {t(
                                    'pages.contact.quickHelp',
                                    'مساعدتك السريعة',
                                )}
                            </Typography>

                            <Grid container spacing={1.5} mt={0.5}>
                                {QUICK_HELP_LINKS.map((link) => {
                                    const Icon = link.icon;
                                    const to = link.pathKey
                                        ? path[link.pathKey]
                                        : link.to!;
                                    return (
                                        <Grid
                                            key={link.key}
                                            size={{ xs: 4, md: 4 }}
                                        >
                                            <Button
                                                fullWidth
                                                component={RouterLink}
                                                to={to}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 0.75,
                                                    py: 1.5,
                                                    px: 1,
                                                    minHeight: 84,
                                                    borderRadius: '14px',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    color: 'text.primary',
                                                    textTransform: 'none',
                                                    WebkitTapHighlightColor:
                                                        'transparent',
                                                    transition:
                                                        'transform 0.15s ease, border-color 0.2s ease',
                                                    '&:hover': {
                                                        borderColor:
                                                            BRAND.brown,
                                                        bgcolor:
                                                            BRAND.ledger(0.05),
                                                    },
                                                    '&:active': {
                                                        transform:
                                                            'scale(0.96)',
                                                    },
                                                }}
                                            >
                                                <SealBadge
                                                    size={40}
                                                    rotate={-6}
                                                    tone='outline'
                                                >
                                                    <Icon
                                                        sx={{ fontSize: 18 }}
                                                    />
                                                </SealBadge>
                                                <Typography
                                                    sx={{
                                                        fontSize: {
                                                            xs: '0.72rem',
                                                            sm: '0.85rem',
                                                        },
                                                        fontWeight: 600,
                                                        lineHeight: 1.3,
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {t(link.key, link.fallback)}
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Paper>
                    </Container>
                </section>

                <AdsSection />
                <Suspense fallback={<Loader />}>
                    <DiscountsAndOffers />
                </Suspense>
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
                        featured={false}
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
                        if (postToDelete) {
                            return handleDelete(postToDelete);
                        }
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
