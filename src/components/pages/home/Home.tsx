// pages/Home.tsx
import {
    FunctionComponent,
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { Box, Button, Fab, Fade, Grid, Paper, Typography } from '@mui/material';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

import { Link as RouterLink } from 'react-router-dom';

import HeroSection from './HeroSection';
import StatsStrip from './StatsStrip';
import AdsSection from './AdsSection';
import Loader from '../../../atoms/loader/Loader';

const AddProductModal = lazy(
    () =>
        import(
            '../../../atoms/productsManage/addAndUpdateProduct/CreatePostModal'
        ),
);

const UpdateProductModal = lazy(
    () =>
        import(
            '../../../atoms/productsManage/addAndUpdateProduct/UpdatePostModal'
        ),
);
import { showError } from '../../../atoms/toasts/ReactToast';
const AlertDialogs = lazy(() => import('../../../atoms/toasts/Sweetalert'));
import { useUser } from '../../../hooks/useUSer';
import { usePosts } from '../../../hooks/usePosts';
import RoleType from '../../../interfaces/UserType';
import handleRTL from '../../../locales/handleRTL';
import { deletePost } from '../../../services/postsServices';
import JsonLd from '../../../../utils/JsonLd';
import { useTranslation } from 'react-i18next';
import { path } from '../../../routes/routes';
import { Posts } from '../../../interfaces/Posts';
import ChipNavigation from '../../navbar/ChepNavigation';
const DiscountsAndOffers = lazy(() => import('../products/DiscountsAndOffers'));
const ContactCTA = lazy(() => import('./ContactCTA'));
const PostsGrid = lazy(() => import('./PostsGrid'));

const GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';

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

    // Scroll progress + back-to-top FAB
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setScrollProgress(progress);
            setShowBackToTop(scrollTop > 600);
        };

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

    const handleDelete = async (postId: string) => {
        try {
            await deletePost(postId);
            setPosts((prev) => prev.filter((p) => p._id !== postId));
        } catch (err) {
            console.error(err);
            showError('שגיאה במחיקת המוצר!');
        }
    };

    // if (loading) return <Loader />;

    const currentUrl = window.location.origin;

    return (
        <>
            {/* ─── SEO ─── */}
            <title>بيع وشراء جديد ومستعمل | صفقة</title>

            <meta
                name='description'
                content='صفقة منصة إلكترونية لبيع وشراء المنتجات الجديدة والمستعملة بسهولة وأمان'
            />
            <link rel='icon' href='/d3.png' />
            <link rel='apple-touch-icon' href='/d3.png' />
            <link rel='canonical' href={currentUrl} />
            <meta property='og:title' content='بيع وشراء جديد ومستعمل | صفقة' />
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
                            url: { currentUrl },
                        },
                        {
                            '@type': 'Organization',
                            '@id': 'https://client-qqq1.vercel.app/#organization',
                            name: 'صفقة',
                            alternateName: 'Safqa',
                            url: { currentUrl },
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
                <Box
                    sx={{
                        height: '100%',
                        width: `${scrollProgress}%`,
                        background: GRADIENT,
                        transition: 'width 0.1s linear',
                    }}
                />
            </Box>

            {/* ─── HERO ─── */}
            <header>
                <HeroSection onAddProduct={() => setShowAddModal(true)} />
            </header>
            {/* help section */}
            <section id='help-section' style={{ margin: 'auto' }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, md: 3 },
                        m: { xs: 1.5, md: 2 },
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            insetInlineStart: 0,
                            insetInlineEnd: 0,
                            height: 4,
                            background: GRADIENT,
                        },
                    }}
                >
                    <Typography
                        variant='h6'
                        gutterBottom
                        fontWeight='bold'
                        textAlign='center'
                        sx={{
                            pt: 0.5,
                            fontSize: { xs: '1.05rem', md: '1.25rem' },
                        }}
                    >
                        {t('pages.contact.quickHelp', 'مساعدتك السريعة')}
                    </Typography>

                    <Grid container spacing={1.5} mt={0.5}>
                        {QUICK_HELP_LINKS.map((link) => {
                            const Icon = link.icon;
                            const to = link.pathKey
                                ? path[link.pathKey]
                                : link.to!;
                            return (
                                <Grid key={link.key} size={{ xs: 4, md: 4 }}>
                                    <Button
                                        fullWidth
                                        component={RouterLink}
                                        to={to}
                                        disableRipple={false}
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
                                                borderColor: '#8B4513',
                                                bgcolor: 'primary.50',
                                            },
                                            '&:active': {
                                                transform: 'scale(0.96)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: GRADIENT,
                                                color: '#fff',
                                            }}
                                        >
                                            <Icon fontSize='small' />
                                        </Box>
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
            </section>
            {/* ─── STATS ─── */}
            <section id='StatsStrip-section'>
                <StatsStrip postsCount={posts.length} />
            </section>
            {/* ─── MAIN ─── */}
            <main id='lising-section' dir={direction}>
                <AdsSection />

                <Suspense fallback={<Loader />}>
                    <DiscountsAndOffers />
                </Suspense>
                {/* =================================================
            CATEGORY NAVIGATION
               ================================================= */}

                <ChipNavigation />

                <Suspense fallback={<Loader />}>
                    <PostsGrid
                        posts={posts}
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
                        background: GRADIENT,
                        color: '#fff',
                        boxShadow: '0 8px 20px -6px rgba(139,69,19,0.6)',
                        '&:hover': {
                            background: GRADIENT,
                            filter: 'brightness(1.1)',
                        },
                    }}
                >
                    <KeyboardArrowUpRoundedIcon />
                </Fab>
            </Fade>

            <Suspense fallback={<Loader />}>
                {/* ─── MODALS ─── */}
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
                    title='⚠️ تنبيه مهم!'
                    description={`هل أنت متأكد من رغبتك في حذف "${postToDelete}"؟ هذا الإجراء لا يمكن التراجع عنه`}
                    handleDelete={() => handleDelete(postToDelete)}
                />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <AddProductModal
                    show={showAddModal}
                    onHide={() => setShowAddModal(false)}
                    onSuccess={refetch}
                />
            </Suspense>
        </>
    );
};

export default Home;
