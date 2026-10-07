import {
    FunctionComponent,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import {
    Alert,
    Avatar,
    Box,
    Breadcrumbs,
    Button,
    Chip,
    Container,
    Dialog,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Rating,
    Skeleton,
    Stack,
    TextField,
    Tooltip,
    Typography,
    alpha,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import {
    AccessTimeRounded,
    ArrowBack as ArrowBackIcon,
    Comment,
    Error as ErrorIcon,
    Home as HomeIcon,
    LocationOn,
    Phone,
    Refresh as RefreshIcon,
    ShieldOutlined,
    Share as ShareIcon,
    Store as StoreIcon,
    Visibility as ViewIcon,
    WhatsApp,
    ZoomIn,
    ZoomOut,
} from '@mui/icons-material';

import { initialProductValue, Posts, Review } from '../../../interfaces/Posts';
import { path } from '../../../routes/routes';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../hooks/useUSer';
import { showError, showSuccess } from '../../../atoms/toasts/ReactToast';
import { generateSingleProductJsonLd } from '../../../../utils/structuredData';
import JsonLd from '../../../../utils/JsonLd';
import {
    categoryLabels,
    categoryPathMap,
} from '../../../interfaces/postsCategoeis';
import LikeButton from '../../../atoms/like/LikeButton';
import UpdateProductModal from '../../../atoms/productsManage/addAndUpdateProduct/UpdatePostModal';
import AlertDialogs from '../../../atoms/toasts/Sweetalert';
import { formatTimeAgo, generatePath } from './helpers/helperFunctions';
import RelatedProductCard from './RelatedProductCard';
import {
    deletePost,
    getPostById,
    getRelatedPosts,
    incrementViewCount,
    submitReview,
} from '../../../services/postsServices';
import { useChatWindow } from '../../../context/ChatWindowContext';
import { UserMessage } from '../../../interfaces/chat/usersMessages';
import PostSpecifications from './PostSpecifications';
import handleRTL from '../../../locales/handleRTL';
import ReportButton from '../../reports/ReportButton';

const SITE_URL = 'https://client-qqq1.vercel.app';

/* ========================= BRAND ========================= */

const BRAND_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';
const BRAND_COLOR = '#B8860B';
const BRAND_DARK = '#8B4513';

const sectionCardSx = {
    borderRadius: 3,
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0 4px 20px rgba(0,0,0,.04)',
} as const;

const gradientBtnSx = {
    py: 1.4,
    fontWeight: 700,
    color: '#fff',
    background: BRAND_GRADIENT,
    '&:hover': { background: BRAND_GRADIENT, filter: 'brightness(1.1)' },
} as const;

/* ========================= HELPERS ========================= */

/** wa.me يحتاج رقم دولي بدون + أو 0 (افتراض: أرقام إسرائيل 972) */
const toWhatsAppNumber = (raw?: string) => {
    const digits = (raw ?? '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('972')) return digits;
    if (digits.startsWith('0')) return `972${digits.slice(1)}`;
    return digits;
};

const getReviewUserId = (review: Review): string => {
    const u = review.user as { _id?: string } | string | null | undefined;
    if (!u) return '';
    return typeof u === 'string' ? u : String(u._id ?? '');
};

/* ========================= SMALL COMPONENTS ========================= */

const SectionTitle = memo(
    ({ title, subtitle }: { title: string; subtitle?: string }) => (
        <Box sx={{ mb: 2.5 }}>
            <Typography variant='h6' sx={{ fontWeight: 800 }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant='body2' color='text.secondary'>
                    {subtitle}
                </Typography>
            )}
        </Box>
    ),
);
SectionTitle.displayName = 'SectionTitle';

const RatingSummary = memo(
    ({ reviews, average }: { reviews: Review[]; average: number }) => {
        const rated = reviews.filter((r) => Number(r.rating) > 0);
        const counts = [5, 4, 3, 2, 1].map((star) => ({
            star,
            count: rated.filter((r) => Math.round(Number(r.rating)) === star)
                .length,
        }));

        return (
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: alpha(BRAND_COLOR, 0.05),
                }}
            >
                <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                    <Typography
                        sx={{ fontSize: '2.75rem', fontWeight: 900, lineHeight: 1 }}
                    >
                        {average.toFixed(1)}
                    </Typography>
                    <Rating
                        value={average}
                        precision={0.1}
                        size='small'
                        readOnly
                    />
                    <Typography
                        variant='caption'
                        color='text.secondary'
                        display='block'
                    >
                        {rated.length}
                    </Typography>
                </Box>

                <Stack spacing={0.5} sx={{ flex: 1 }}>
                    {counts.map(({ star, count }) => (
                        <Stack
                            key={star}
                            direction='row'
                            alignItems='center'
                            spacing={1}
                        >
                            <Typography variant='caption' sx={{ width: 12 }}>
                                {star}
                            </Typography>
                            <LinearProgress
                                variant='determinate'
                                value={
                                    rated.length
                                        ? (count / rated.length) * 100
                                        : 0
                                }
                                sx={{
                                    flex: 1,
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: alpha(BRAND_COLOR, 0.15),
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        background: BRAND_GRADIENT,
                                    },
                                }}
                            />
                            <Typography
                                variant='caption'
                                color='text.secondary'
                                sx={{ width: 24, textAlign: 'end' }}
                            >
                                {count}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
        );
    },
);
RatingSummary.displayName = 'RatingSummary';

/* ========================= COMPONENT ========================= */

const PostDetails: FunctionComponent = () => {
    const { t, i18n } = useTranslation();
    const { postId } = useParams<{ postId: string }>();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, auth } = useUser();
    const { openChat } = useChatWindow();
    const dir = handleRTL();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    const [post, setPost] = useState(initialProductValue as Posts);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [relatedProducts, setRelatedProducts] = useState<Posts[]>([]);

    const [reviewRating, setReviewRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);

    /* ---------- derived ---------- */

    const pageUrl = `${SITE_URL}${pathname}`;
    const reviews = useMemo(() => post.reviews ?? [], [post.reviews]);

    const sellerDisplayName = useMemo(
        () =>
            [post.seller?.name?.first, post.seller?.name?.last]
                .filter(Boolean)
                .join(' ') || 'user',
        [post.seller?.name?.first, post.seller?.name?.last],
    );

    const categoryLabel = useMemo(() => {
        if (!post.category) return t('common.product.category') || 'التصنيف';
        return categoryLabels[post.category] || t(post.category);
    }, [post.category, t]);

    const isOwner = Boolean(
        auth?._id &&
        post?._id &&
        String(auth._id) === String(post.seller?._id),
    );

    const finalPrice = useMemo(
        () =>
            post.sale
                ? post.price - (post.price * (post.discount || 0)) / 100
                : post.price,
        [post.sale, post.price, post.discount],
    );

    const averageRating = useMemo(() => {
        const rated = reviews.filter((r) => Number(r.rating) > 0);
        if (!rated.length) return 0;
        return rated.reduce((sum, r) => sum + Number(r.rating), 0) / rated.length;
    }, [reviews]);

    const hasReviewed = useMemo(
        () =>
            auth?._id
                ? reviews.some((r) => getReviewUserId(r) === String(auth._id))
                : false,
        [reviews, auth?._id],
    );

    const sellerPhone = post.seller?.phone?.phone_1 ?? '';
    const whatsappNumber = toWhatsAppNumber(sellerPhone);

    const memberSince = useMemo(() => {
        const raw = post.seller?.registrAt || post.seller?.createdAt;
        if (!raw) return '';
        const d = new Date(raw);
        return Number.isNaN(d.getTime())
            ? ''
            : d.toLocaleDateString(i18n.language, {
                  year: 'numeric',
                  month: 'long',
              });
    }, [post.seller?.registrAt, post.seller?.createdAt, i18n.language]);

    /* ---------- data ---------- */

    const loadPost = useCallback(
        async (silent = false) => {
            if (!postId) {
                setError(t('common.product.idMissing'));
                setLoading(false);
                return;
            }
            if (!silent) {
                setLoading(true);
                setError('');
            }
            try {
                setPost(await getPostById(postId));
            } catch (fetchError) {
                console.error('Error fetching post:', fetchError);
                if (silent) showError(t('common.product.loadError'));
                else setError(t('common.product.loadPostError'));
            } finally {
                if (!silent) setLoading(false);
            }
        },
        [postId, t],
    );

    useEffect(() => {
        void loadPost();
    }, [loadPost, auth._id]);

    useEffect(() => {
        if (!post._id || !post.category) return;
        getRelatedPosts(post.category, post._id, 4)
            .then(setRelatedProducts)
            .catch((relatedError) =>
                console.error('Related products error:', relatedError),
            );
    }, [post._id, post.category]);

    const incrementedRef = useRef<string | null>(null);
    useEffect(() => {
        const id = post._id;
        if (!id || incrementedRef.current === id) return;
        incrementedRef.current = id;
        incrementViewCount(id);
    }, [post._id]);

    /* ---------- actions ---------- */

    const handleContactSeller = useCallback(() => {
        const seller = post.seller;

        if (!auth?._id) {
            navigate(path.Login);
            return;
        }
        if (!seller?._id) {
            showError(t('common.product.sellerUnavailable'));
            return;
        }
        if (String(auth._id) === String(seller._id)) {
            showError(t('common.product.cannotContactSelf'));
            return;
        }

        const initialMessage =
            `${t('chat.interestedIn')} "${post.product_name}" 💬\n\n` +
            `📦 ${t('common.product.currentPrice')}: ${formatPrice(finalPrice)}\n` +
            `📂 ${t('common.product.category')}: ${categoryLabel}\n` +
            `🔗 ${t('common.product.productLink')}: ${pageUrl}\n\n` +
            t('chat.isStillAvailable');

        openChat(seller as UserMessage, initialMessage);
    }, [
        post.seller,
        post.product_name,
        auth._id,
        finalPrice,
        categoryLabel,
        pageUrl,
        t,
        openChat,
        navigate,
    ]);

    const goToProfile = useCallback(() => {
        if (!post.seller?.slug) return;
        navigate(
            generatePath(path.CustomerProfile, {
                slug: encodeURIComponent(post.seller.slug),
            }),
        );
    }, [navigate, post.seller?.slug]);

    const handleShare = useCallback(async () => {
        setIsSharing(true);
        try {
            const shareData = {
                title: t('common.product.shareTitle', {
                    name: post.product_name,
                }),
                text: t('common.product.shareText', { name: post.product_name }),
                url: pageUrl,
            };

            if (navigator.share) {
                await navigator.share(shareData);
                showSuccess(t('common.product.shareSuccess'));
                return;
            }
            await navigator.clipboard.writeText(pageUrl);
            showSuccess(t('common.product.linkCopied'));
        } catch (shareError) {
            if ((shareError as Error).name !== 'AbortError') {
                showError(t('common.product.shareError'));
            }
        } finally {
            setIsSharing(false);
        }
    }, [post.product_name, pageUrl, t]);

    const handleDeletePost = useCallback(async () => {
        if (!postId) return;
        try {
            await deletePost(postId);
            showSuccess(t('common.product.deleteSuccess'));
            const categoryPath = post.category
                ? categoryPathMap[post.category]
                : undefined;
            navigate(categoryPath || path.Home, { replace: true });
        } catch (deleteError) {
            console.error('Delete post error:', deleteError);
            showError(deleteError as string);
        }
    }, [navigate, post.category, postId, t]);

    const handleSubmitReview = useCallback(async () => {
        if (!isLoggedIn) {
            navigate(path.Login);
            return;
        }
        if (!post._id || !auth?._id) {
            showError(t('review.missingData'));
            return;
        }

        setIsSubmittingReview(true);
        try {
            await submitReview(post._id, {
                userId: auth._id,
                rating: reviewRating,
                comment: comment.trim(),
            });
            setComment('');
            setReviewRating(0);
            showSuccess(t('review.submitted'));
            // نعيد الجلب ليرجع التقييم مع بيانات المستخدم populated
            await loadPost(true);
        } catch (submitError) {
            console.error('Submit review error:', submitError);
            showError(t('review.submitError') || 'حدث خطأ أثناء نشر التقييم');
        } finally {
            setIsSubmittingReview(false);
        }
    }, [
        isLoggedIn,
        post._id,
        auth._id,
        reviewRating,
        comment,
        t,
        navigate,
        loadPost,
    ]);

    const scrollToReviews = () =>
        document
            .getElementById('reviews')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    /* ========================= LOADING / ERROR ========================= */

    if (loading) {
        return (
            <Container maxWidth='xl' sx={{ py: 4 }}>
                <Skeleton variant='text' width={260} height={32} />
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Skeleton variant='rounded' height={480} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Stack spacing={2}>
                            <Skeleton variant='rounded' height={320} />
                            <Skeleton variant='rounded' height={160} />
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        );
    }

    if (error || !post?._id) {
        return (
            <Container maxWidth='md' sx={{ py: 8, textAlign: 'center' }}>
                <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 3 }} />
                <Typography variant='h5' color='error' gutterBottom>
                    {error || t('common.product.notFound') || 'المنتج غير موجود'}
                </Typography>
                <Button
                    variant='contained'
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mt: 3, background: BRAND_GRADIENT }}
                >
                    {t('backOneStep')}
                </Button>
            </Container>
        );
    }

    const productJsonLd = generateSingleProductJsonLd(post);
    const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);
    const isSold = post.status === 'sold';

    /* ========================= RENDER ========================= */

    return (
        <>
            <JsonLd data={productJsonLd} />
            <title>{post.product_name} | صفقة</title>
            <link rel='canonical' href={pageUrl} />
            <meta name='description' content={post.description?.slice(0, 160)} />
            <meta property='og:title' content={post.product_name} />
            <meta
                property='og:description'
                content={post.description?.substring(0, 160) || ''}
            />
            <meta property='og:image' content={post.image?.url || ''} />
            <meta property='og:type' content='product' />
            <meta
                property='product:price:amount'
                content={String(finalPrice || 0)}
            />
            <meta property='product:price:currency' content='ILS' />

            <Box
                component='main'
                dir={dir}
                sx={{
                    bgcolor: 'background.default',
                    pb: { xs: 14, lg: 8 },
                }}
            >
                <Container maxWidth='xl' sx={{ pt: { xs: 2, md: 3 } }}>
                    {/* ───────── BREADCRUMBS ───────── */}
                    <Breadcrumbs
                        separator='›'
                        aria-label={
                            t('common.product.breadcrumbNavigation') ||
                            'مسار التنقل'
                        }
                        sx={{ mb: 2 }}
                    >
                        <Button
                            component={Link}
                            to={path.Home}
                            size='small'
                            startIcon={<HomeIcon sx={{ fontSize: 18 }} />}
                            sx={{ textTransform: 'none', gap: 0.5 }}
                        >
                            {t('home')}
                        </Button>

                        {post.category && (
                            <Button
                                size='small'
                                startIcon={<StoreIcon sx={{ fontSize: 18 }} />}
                                disabled={!categoryPathMap[post.category]}
                                onClick={() =>
                                    navigate(categoryPathMap[post.category])
                                }
                                sx={{ textTransform: 'none', gap: 0.5 }}
                            >
                                {categoryLabel}
                            </Button>
                        )}

                        <Typography
                            variant='body2'
                            noWrap
                            sx={{ fontWeight: 700, maxWidth: 200 }}
                        >
                            {post.product_name}
                        </Typography>
                    </Breadcrumbs>

                    {/* ───────── MAIN LAYOUT ───────── */}
                    <Box
                        sx={{
                            display: 'grid',
                            gap: 3,
                            alignItems: 'start',
                            gridTemplateColumns: {
                                xs: 'minmax(0, 1fr)',
                                lg: 'minmax(0, 1fr) 400px',
                            },
                            gridTemplateAreas: {
                                xs: '"gallery" "buy" "details"',
                                lg: '"gallery buy" "details buy"',
                            },
                        }}
                    >
                        {/* ───────── GALLERY ───────── */}
                        <Box sx={{ gridArea: 'gallery' }}>
                            <Paper
                                elevation={0}
                                sx={{ ...sectionCardSx, overflow: 'hidden' }}
                            >
                                <Box
                                    role='button'
                                    tabIndex={0}
                                    aria-label={t(
                                        'common.product.zoomIn',
                                        'تكبير الصورة',
                                    )}
                                    onClick={() =>
                                        post.image?.url &&
                                        setImageDialogOpen(true)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === 'Enter' &&
                                            post.image?.url
                                        ) {
                                            setImageDialogOpen(true);
                                        }
                                    }}
                                    sx={{
                                        position: 'relative',
                                        height: { xs: 300, sm: 420, md: 520 },
                                        overflow: 'hidden',
                                        bgcolor: 'action.hover',
                                        cursor: post.image?.url
                                            ? 'zoom-in'
                                            : 'default',
                                    }}
                                >
                                    {post.image?.url ? (
                                        <>
                                            {/* خلفية ضبابية من نفس الصورة */}
                                            <Box
                                                aria-hidden
                                                sx={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    backgroundImage: `url(${post.image.url})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    filter: 'blur(28px) brightness(0.9)',
                                                    transform: 'scale(1.15)',
                                                }}
                                            />
                                            <Box
                                                component='img'
                                                src={post.image.url}
                                                alt={post.product_name}
                                                sx={{
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    display: 'block',
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <Stack
                                            alignItems='center'
                                            justifyContent='center'
                                            sx={{ height: '100%' }}
                                        >
                                            <Typography color='text.secondary'>
                                                {t('common.product.noImage')}
                                            </Typography>
                                        </Stack>
                                    )}

                                    {post.sale && (
                                        <Chip
                                            label={`-${post.discount}%`}
                                            color='error'
                                            size='small'
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                insetInlineStart: 12,
                                                fontWeight: 800,
                                            }}
                                        />
                                    )}

                                    {post.image?.url && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 12,
                                                insetInlineEnd: 12,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                px: 1.25,
                                                py: 0.5,
                                                borderRadius: 99,
                                                color: '#fff',
                                                bgcolor: 'rgba(18,22,28,0.6)',
                                                backdropFilter: 'blur(6px)',
                                            }}
                                        >
                                            <ZoomIn sx={{ fontSize: 16 }} />
                                            <Typography
                                                variant='caption'
                                                fontWeight={600}
                                            >
                                                {t(
                                                    'common.product.zoomIn',
                                                    'تكبير',
                                                )}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        </Box>

                        {/* ───────── BUY BOX (sticky) ───────── */}
                        <Box sx={{ gridArea: 'buy', alignSelf: 'stretch' }}>
                            <Stack
                                spacing={2.5}
                                sx={{
                                    position: { lg: 'sticky' },
                                    top: { lg: 80 },
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{ ...sectionCardSx, p: { xs: 2, md: 3 } }}
                                >
                                    <Stack spacing={2}>
                                        {/* chips */}
                                        <Stack
                                            direction='row'
                                            flexWrap='wrap'
                                            gap={0.75}
                                        >
                                            <Chip
                                                label={categoryLabel}
                                                size='small'
                                                onClick={() => {
                                                    const p =
                                                        categoryPathMap[
                                                            post.category
                                                        ];
                                                    if (p) navigate(p);
                                                }}
                                                sx={{
                                                    fontWeight: 600,
                                                    bgcolor: alpha(BRAND_COLOR, 0.1),
                                                    color: BRAND_DARK,
                                                }}
                                            />
                                            {post.isNew !== undefined && (
                                                <Chip
                                                    size='small'
                                                    label={
                                                        post.isNew
                                                            ? `🆕 ${t('postCard.new')}`
                                                            : `🔄 ${t('postCard.used')}`
                                                    }
                                                    variant='outlined'
                                                />
                                            )}
                                            <Chip
                                                size='small'
                                                label={
                                                    isSold
                                                        ? t(
                                                              'common.product.sold',
                                                              'تم البيع',
                                                          )
                                                        : post.in_stock
                                                          ? t('common.product.available')
                                                          : t('common.product.notAvailable')
                                                }
                                                color={
                                                    isSold || !post.in_stock
                                                        ? 'default'
                                                        : 'success'
                                                }
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </Stack>

                                        {/* title */}
                                        <Typography
                                            variant='h4'
                                            component='h1'
                                            sx={{
                                                fontWeight: 800,
                                                lineHeight: 1.3,
                                                fontSize: {
                                                    xs: '1.4rem',
                                                    md: '1.65rem',
                                                },
                                            }}
                                        >
                                            {post.product_name}
                                        </Typography>

                                        {/* rating */}
                                        <Stack
                                            direction='row'
                                            alignItems='center'
                                            spacing={1}
                                            onClick={scrollToReviews}
                                            sx={{ cursor: 'pointer', width: 'fit-content' }}
                                        >
                                            <Rating
                                                value={averageRating}
                                                precision={0.1}
                                                size='small'
                                                readOnly
                                            />
                                            <Typography
                                                variant='body2'
                                                color='text.secondary'
                                                sx={{ '&:hover': { textDecoration: 'underline' } }}
                                            >
                                                {reviews.length > 0
                                                    ? `${averageRating.toFixed(1)} · ${reviews.length} ${t('reviews') || 'تقييم'}`
                                                    : t('review.noReviewsYet')}
                                            </Typography>
                                        </Stack>

                                        {/* price */}
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                background: `linear-gradient(135deg, ${alpha(BRAND_COLOR, 0.1)}, ${alpha(BRAND_DARK, 0.04)})`,
                                                border: `1px solid ${alpha(BRAND_COLOR, 0.18)}`,
                                            }}
                                        >
                                            <Stack
                                                direction='row'
                                                alignItems='baseline'
                                                flexWrap='wrap'
                                                columnGap={1.5}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: { xs: '1.9rem', md: '2.2rem' },
                                                        fontWeight: 900,
                                                        lineHeight: 1.1,
                                                    }}
                                                >
                                                    {formatPrice(finalPrice)}
                                                </Typography>
                                                {post.sale && (
                                                    <>
                                                        <Typography
                                                            sx={{
                                                                color: 'text.disabled',
                                                                textDecoration: 'line-through',
                                                            }}
                                                        >
                                                            {formatPrice(post.price)}
                                                        </Typography>
                                                        <Chip
                                                            label={`-${post.discount}%`}
                                                            color='error'
                                                            size='small'
                                                            sx={{ fontWeight: 700 }}
                                                        />
                                                    </>
                                                )}
                                            </Stack>
                                        </Box>

                                        {/* meta */}
                                        <Stack spacing={1} sx={{ color: 'text.secondary' }}>
                                            <Stack direction='row' alignItems='center' spacing={1}>
                                                <LocationOn sx={{ fontSize: 18 }} />
                                                {post.location ? (
                                                    <Typography
                                                        variant='body2'
                                                        component='a'
                                                        href={`https://waze.com/ul?q=${encodeURIComponent(post.location)}&navigate=yes`}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        sx={{
                                                            color: 'inherit',
                                                            textDecoration: 'none',
                                                            '&:hover': { textDecoration: 'underline' },
                                                        }}
                                                    >
                                                        {post.location}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant='body2'>
                                                        {t('common.product.locationNotSpecified')}
                                                    </Typography>
                                                )}
                                            </Stack>
                                            <Stack direction='row' alignItems='center' spacing={1}>
                                                <AccessTimeRounded sx={{ fontSize: 18 }} />
                                                <Typography variant='body2'>
                                                    {formatTimeAgo(String(post.createdAt || ''), t)}
                                                </Typography>
                                            </Stack>
                                            <Stack direction='row' alignItems='center' spacing={1}>
                                                <ViewIcon sx={{ fontSize: 18 }} />
                                                <Typography variant='body2'>
                                                    {post.views ?? 0} {t('common.product.viewsCount')}
                                                </Typography>
                                            </Stack>
                                        </Stack>

                                        <Divider />

                                        {/* CTA */}
                                        {isOwner ? (
                                            <Stack direction='row' spacing={1}>
                                                <Button
                                                    fullWidth
                                                    variant='outlined'
                                                    startIcon={<EditIcon />}
                                                    onClick={() => setShowUpdateModal(true)}
                                                    sx={{ gap: 0.5 }}
                                                >
                                                    {t('postCard.edit')}
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant='outlined'
                                                    color='error'
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => setShowDeleteModal(true)}
                                                    sx={{ gap: 0.5 }}
                                                >
                                                    {t('postCard.delete')}
                                                </Button>
                                            </Stack>
                                        ) : (
                                            <Stack spacing={1}>
                                                <Button
                                                    fullWidth
                                                    variant='contained'
                                                    size='large'
                                                    startIcon={<Comment />}
                                                    onClick={handleContactSeller}
                                                    sx={{ ...gradientBtnSx, gap: 1 }}
                                                >
                                                    {t('common.product.contactSeller')}
                                                </Button>

                                                {(sellerPhone || whatsappNumber) && (
                                                    <Stack direction='row' spacing={1}>
                                                        {sellerPhone && (
                                                            <Button
                                                                fullWidth
                                                                variant='outlined'
                                                                startIcon={<Phone />}
                                                                href={`tel:${sellerPhone}`}
                                                                sx={{
                                                                    gap: 0.5,
                                                                    borderColor: BRAND_COLOR,
                                                                    color: BRAND_DARK,
                                                                }}
                                                            >
                                                                {t('common.product.callNow')}
                                                            </Button>
                                                        )}
                                                        {whatsappNumber && (
                                                            <Button
                                                                fullWidth
                                                                variant='outlined'
                                                                startIcon={<WhatsApp />}
                                                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`${t('chat.interestedIn')} "${post.product_name}"\n${pageUrl}`)}`}
                                                                target='_blank'
                                                                rel='noopener noreferrer'
                                                                sx={{
                                                                    gap: 0.5,
                                                                    borderColor: '#25D366',
                                                                    color: '#128C7E',
                                                                }}
                                                            >
                                                                {t('whatsapp')}
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                )}
                                            </Stack>
                                        )}

                                        {/* secondary actions */}
                                        <Stack
                                            direction='row'
                                            alignItems='center'
                                            justifyContent='space-around'
                                        >
                                            <LikeButton product={post} setProduct={setPost} />
                                            <Tooltip title={t('common.product.shareProduct')}>
                                                <span>
                                                    <IconButton
                                                        onClick={handleShare}
                                                        disabled={isSharing}
                                                        aria-label={t('common.product.shareProduct')}
                                                    >
                                                        <ShareIcon />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            {!isOwner && post._id && (
                                                <ReportButton
                                                    targetId={post._id}
                                                    type='post'
                                                />
                                            )}
                                        </Stack>
                                    </Stack>
                                </Paper>

                                {/* ───────── SELLER ───────── */}
                                <Paper
                                    elevation={0}
                                    sx={{ ...sectionCardSx, p: { xs: 2, md: 2.5 } }}
                                >
                                    <Stack spacing={2}>
                                        <Stack direction='row' spacing={1.5} alignItems='center'>
                                            <Avatar
                                                src={post.seller?.image?.url || '/user.png'}
                                                alt={sellerDisplayName}
                                                onClick={goToProfile}
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    cursor: 'pointer',
                                                    border: '2px solid',
                                                    borderColor: BRAND_COLOR,
                                                }}
                                            />
                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                                <Typography fontWeight={800} noWrap>
                                                    {sellerDisplayName}
                                                </Typography>
                                                {post.seller?.slug && (
                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                        noWrap
                                                    >
                                                        @{post.seller.slug}
                                                    </Typography>
                                                )}
                                                {memberSince && (
                                                    <Typography
                                                        variant='caption'
                                                        color='text.disabled'
                                                    >
                                                        {t('common.product.memberSince', 'عضو منذ')}{' '}
                                                        {memberSince}
                                                    </Typography>
                                                )}
                                            </Box>
                                            {isOwner && (
                                                <Chip
                                                    size='small'
                                                    label={t('common.product.yourListing')}
                                                    sx={{
                                                        background: BRAND_GRADIENT,
                                                        color: '#fff',
                                                        fontWeight: 700,
                                                    }}
                                                />
                                            )}
                                        </Stack>

                                        {post.seller?.slug && (
                                            <Button
                                                fullWidth
                                                variant='outlined'
                                                onClick={goToProfile}
                                                sx={{
                                                    borderColor: 'divider',
                                                    color: 'text.primary',
                                                    '&:hover': {
                                                        borderColor: BRAND_COLOR,
                                                        color: BRAND_COLOR,
                                                    },
                                                }}
                                            >
                                                {t(
                                                    'common.product.viewSellerProfile',
                                                    'عرض ملف البائع وإعلاناته',
                                                )}
                                            </Button>
                                        )}
                                    </Stack>
                                </Paper>

                                {/* ───────── SAFETY ───────── */}
                                {!isOwner && (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            ...sectionCardSx,
                                            p: 2.5,
                                            display: { xs: 'none', lg: 'block' },
                                        }}
                                    >
                                        <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                                            <ShieldOutlined sx={{ color: BRAND_COLOR, fontSize: 20 }} />
                                            <Typography variant='subtitle2' fontWeight={800}>
                                                {t('common.product.safetyTitle', 'نصائح للشراء الآمن')}
                                            </Typography>
                                        </Stack>
                                        <Stack
                                            component='ul'
                                            spacing={0.5}
                                            sx={{ m: 0, ps: 2.5, color: 'text.secondary' }}
                                        >
                                            <Typography component='li' variant='body2'>
                                                {t('common.product.safety1', 'عاين المنتج شخصياً قبل الدفع')}
                                            </Typography>
                                            <Typography component='li' variant='body2'>
                                                {t('common.product.safety2', 'قابل البائع في مكان عام')}
                                            </Typography>
                                            <Typography component='li' variant='body2'>
                                                {t('common.product.safety3', 'لا تحوّل أموالاً مسبقاً لأي شخص')}
                                            </Typography>
                                        </Stack>
                                    </Paper>
                                )}
                            </Stack>
                        </Box>

                        {/* ───────── DETAILS + REVIEWS ───────── */}
                        <Stack spacing={3} sx={{ gridArea: 'details' }}>
                            <Paper
                                elevation={0}
                                sx={{ ...sectionCardSx, p: { xs: 2, md: 3 } }}
                            >
                                <SectionTitle title={t('common.product.description')} />
                                <Typography
                                    color='text.secondary'
                                    sx={{ lineHeight: 1.9, whiteSpace: 'pre-line' }}
                                >
                                    {post.description || t('common.product.noDescription')}
                                </Typography>
                            </Paper>

                            <PostSpecifications
                                product={post}
                                categoryLabel={categoryLabel}
                                t={t}
                            />

                            {/* REVIEWS */}
                            <Paper
                                id='reviews'
                                elevation={0}
                                sx={{
                                    ...sectionCardSx,
                                    p: { xs: 2, md: 3 },
                                    scrollMarginTop: '80px',
                                }}
                            >
                                <SectionTitle
                                    title={t('review.questionsAndReviews')}
                                    subtitle={t('review.questionsAndReviewsSubtitle')}
                                />

                                {reviews.length === 0 ? (
                                    <Alert severity='info' sx={{ mb: 3, borderRadius: 2 }}>
                                        {t('review.noReviewsYet')}
                                    </Alert>
                                ) : (
                                    <>
                                        <RatingSummary
                                            reviews={reviews}
                                            average={averageRating}
                                        />

                                        <Stack spacing={2} sx={{ mb: 2 }}>
                                            {visibleReviews.map((review, index) => {
                                                const reviewUserName = [
                                                    review.user?.name?.first,
                                                    review.user?.name?.last,
                                                ]
                                                    .filter(Boolean)
                                                    .join(' ');
                                                const isMine =
                                                    !!auth?._id &&
                                                    getReviewUserId(review) ===
                                                        String(auth._id);

                                                return (
                                                    <Stack
                                                        key={review._id ?? index}
                                                        direction='row'
                                                        spacing={2}
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 2,
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                        }}
                                                    >
                                                        <Avatar
                                                            src={review.user?.image?.url || '/user.png'}
                                                            alt={reviewUserName || 'user'}
                                                            sx={{ width: 40, height: 40 }}
                                                        />
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Stack
                                                                direction='row'
                                                                justifyContent='space-between'
                                                                alignItems='center'
                                                                flexWrap='wrap'
                                                                gap={0.5}
                                                            >
                                                                <Typography fontWeight={700}>
                                                                    {isMine
                                                                        ? t('you')
                                                                        : reviewUserName || 'user'}
                                                                </Typography>
                                                                <Typography variant='caption' color='text.secondary'>
                                                                    {review.createdAt &&
                                                                        formatTimeAgo(String(review.createdAt), t)}
                                                                </Typography>
                                                            </Stack>
                                                            <Rating
                                                                value={Number(review.rating || 0)}
                                                                size='small'
                                                                readOnly
                                                                sx={{ mt: 0.5 }}
                                                            />
                                                            <Typography
                                                                variant='body2'
                                                                color='text.secondary'
                                                                sx={{ mt: 0.75, lineHeight: 1.7, whiteSpace: 'pre-line' }}
                                                            >
                                                                {review.comment}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                );
                                            })}
                                        </Stack>

                                        {reviews.length > 3 && (
                                            <Button
                                                fullWidth
                                                variant='text'
                                                onClick={() => setShowAllReviews((v) => !v)}
                                                sx={{ mb: 2, color: BRAND_DARK }}
                                            >
                                                {showAllReviews
                                                    ? t('review.showLess', 'عرض أقل')
                                                    : `${t('review.showMore', 'عرض كل التقييمات')} (${reviews.length})`}
                                            </Button>
                                        )}
                                    </>
                                )}

                                <Divider sx={{ mb: 3 }} />

                                {/* REVIEW FORM */}
                                {!isLoggedIn ? (
                                    <Alert
                                        severity='info'
                                        sx={{ borderRadius: 2 }}
                                        action={
                                            <Button
                                                color='inherit'
                                                size='small'
                                                onClick={() => navigate(path.Login)}
                                            >
                                                {t('login', 'تسجيل الدخول')}
                                            </Button>
                                        }
                                    >
                                        {t('review.loginToReview')}
                                    </Alert>
                                ) : isOwner ? (
                                    <Alert severity='info' sx={{ borderRadius: 2 }}>
                                        {t('review.ownerCannotReview', 'لا يمكنك تقييم منتجك الخاص')}
                                    </Alert>
                                ) : hasReviewed ? (
                                    <Alert severity='success' sx={{ borderRadius: 2 }}>
                                        {t('review.alreadyReviewed', 'شكراً، لقد قيّمت هذا المنتج')}
                                    </Alert>
                                ) : (
                                    <Stack spacing={2}>
                                        <Stack spacing={0.5}>
                                            <Typography variant='body2' color='text.secondary'>
                                                {t('review.reviewExperience')}
                                            </Typography>
                                            <Rating
                                                value={reviewRating}
                                                onChange={(_, v) => setReviewRating(v ?? 0)}
                                                size='large'
                                            />
                                        </Stack>

                                        <TextField
                                            multiline
                                            rows={3}
                                            fullWidth
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder={t('review.reviewPlaceholder')}
                                            slotProps={{ htmlInput: { maxLength: 500 } }}
                                            helperText={`${comment.length}/500`}
                                        />

                                        <Button
                                            variant='contained'
                                            disabled={
                                                !comment.trim() ||
                                                !reviewRating ||
                                                isSubmittingReview
                                            }
                                            onClick={handleSubmitReview}
                                            sx={{
                                                ...gradientBtnSx,
                                                alignSelf: { sm: 'flex-start' },
                                                px: 4,
                                                '&:disabled': { opacity: 0.5, color: '#fff' },
                                            }}
                                        >
                                            {isSubmittingReview
                                                ? t('review.submitting') || 'جارٍ النشر...'
                                                : t('review.publish') || 'نشر التقييم'}
                                        </Button>
                                    </Stack>
                                )}
                            </Paper>
                        </Stack>
                    </Box>

                    {/* ───────── RELATED ───────── */}
                    {relatedProducts.length > 0 && (
                        <Box sx={{ mt: 6 }}>
                            <SectionTitle
                                title={t('common.product.relatedProducts')}
                                subtitle={t('common.product.discoverRelatedProducts')}
                            />
                            <Grid container spacing={2}>
                                {relatedProducts.map((product) => (
                                    <Grid key={product._id} size={{ xs: 6, md: 3 }}>
                                        <RelatedProductCard product={product} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Container>
            </Box>

            {/* ───────── MOBILE STICKY BAR ───────── */}
            {isMobile && (
                <Paper
                    elevation={8}
                    sx={{
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1100,
                        px: 2,
                        pt: 1.25,
                        pb: 'calc(10px + env(safe-area-inset-bottom, 0px))',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '16px 16px 0 0',
                    }}
                >
                    <Stack direction='row' alignItems='center' spacing={1.5} dir={dir}>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant='caption' color='text.secondary'>
                                {t('common.product.currentPrice')}
                            </Typography>
                            <Typography sx={{ fontWeight: 900, lineHeight: 1.1, fontSize: '1.15rem' }}>
                                {formatPrice(finalPrice)}
                            </Typography>
                        </Box>

                        {isOwner ? (
                            <Button
                                fullWidth
                                variant='contained'
                                startIcon={<EditIcon />}
                                onClick={() => setShowUpdateModal(true)}
                                sx={{ ...gradientBtnSx, py: 1.1, gap: 0.5 }}
                            >
                                {t('postCard.edit')}
                            </Button>
                        ) : (
                            <>
                                {sellerPhone && (
                                    <IconButton
                                        component='a'
                                        href={`tel:${sellerPhone}`}
                                        aria-label={t('common.product.callNow')}
                                        sx={{
                                            border: '1px solid',
                                            borderColor: BRAND_COLOR,
                                            color: BRAND_DARK,
                                            borderRadius: '12px',
                                        }}
                                    >
                                        <Phone />
                                    </IconButton>
                                )}
                                <Button
                                    fullWidth
                                    variant='contained'
                                    startIcon={<Comment />}
                                    onClick={handleContactSeller}
                                    sx={{ ...gradientBtnSx, py: 1.1, gap: 0.5 }}
                                >
                                    {t('common.product.contactSeller')}
                                </Button>
                            </>
                        )}
                    </Stack>
                </Paper>
            )}

            {/* ───────── MODALS ───────── */}
            <AlertDialogs
                onConfirm={handleDeletePost}
                onHide={() => setShowDeleteModal(false)}
                show={showDeleteModal}
                title={t('modals.report.deletePost.title', {
                    productName: post.product_name,
                })}
                description={t('modals.report.deletePost.description', {
                    productName: post.product_name,
                })}
            />

            <UpdateProductModal
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                postId={post._id as string}
                refresh={() => void loadPost(true)}
            />

            {/* ───────── LIGHTBOX (pinch / wheel / double-tap) ───────── */}
            <Dialog
                fullScreen
                open={imageDialogOpen}
                onClose={() => setImageDialogOpen(false)}
                sx={{ zIndex: 9999, '& .MuiDialog-paper': { bgcolor: '#000' } }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: '100vw',
                        height: '100vh',
                        bgcolor: '#000',
                        overflow: 'hidden',
                    }}
                >
                    <IconButton
                        onClick={() => setImageDialogOpen(false)}
                        aria-label='close'
                        sx={{
                            position: 'absolute',
                            top: 16,
                            insetInlineEnd: 16,
                            zIndex: 10,
                            color: '#fff',
                            bgcolor: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {post.image?.url && (
                        <TransformWrapper
                            initialScale={1}
                            minScale={1}
                            maxScale={5}
                            centerOnInit
                            doubleClick={{ mode: 'toggle' }}
                            wheel={{ step: 0.1 }}
                            pinch={{ step: 5 }}
                        >
                            {({ zoomIn, zoomOut, resetTransform }) => (
                                <>
                                    <TransformComponent
                                        wrapperStyle={{ width: '100vw', height: '100vh' }}
                                        contentStyle={{
                                            width: '100vw',
                                            height: '100vh',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <img
                                            src={post.image.url}
                                            alt={post.product_name}
                                            draggable={false}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain',
                                                userSelect: 'none',
                                            }}
                                        />
                                    </TransformComponent>

                                    <Stack
                                        direction='row'
                                        spacing={1}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 24,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            bgcolor: 'rgba(0,0,0,0.6)',
                                            backdropFilter: 'blur(12px)',
                                            borderRadius: 99,
                                            px: 1.5,
                                            py: 1,
                                            zIndex: 10,
                                        }}
                                    >
                                        <IconButton onClick={() => zoomOut()} sx={{ color: '#fff' }} size='small'>
                                            <ZoomOut />
                                        </IconButton>
                                        <IconButton onClick={() => resetTransform()} sx={{ color: '#fff' }} size='small'>
                                            <RefreshIcon />
                                        </IconButton>
                                        <IconButton onClick={() => zoomIn()} sx={{ color: '#fff' }} size='small'>
                                            <ZoomIn />
                                        </IconButton>
                                    </Stack>
                                </>
                            )}
                        </TransformWrapper>
                    )}
                </Box>
            </Dialog>
        </>
    );
};

export default PostDetails;