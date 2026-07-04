import {
    FunctionComponent,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Avatar,
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardMedia,
    Chip,
    Container,
    Divider,
    Grid,
    IconButton,
    Rating,
    Skeleton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    ArrowBack as ArrowBackIcon,
    ChevronRight,
    Comment,
    Error as ErrorIcon,
    Fullscreen,
    FullscreenExit,
    Home as HomeIcon,
    Phone,
    Share as ShareIcon,
    Store as StoreIcon,
    VerifiedRounded,
    ZoomIn,
    ZoomOut,
} from '@mui/icons-material';
import { initialProductValue, Posts } from '../../../interfaces/Posts';
import { path } from '../../../routes/routes';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import ColorsAndSizes from '../../../atoms/productsManage/ColorsAndSizes';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../context/useUSer';
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
    submitReview,
} from '../../../services/postsServices';
import { easeOut, motion } from 'framer-motion';

// ألوان الهوية البصرية لصفقة (نفس تدرج بطاقة العضوية)
const BRAND_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: easeOut,
        },
    },
};

const sectionCardSx = {
    borderRadius: 6,
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0 10px 40px rgba(0,0,0,.06)',
    transition: '.3s',

    '&:hover': {
        boxShadow: '0 18px 60px rgba(0,0,0,.12)',
    },
};

const SectionTitle = memo(
    ({ title, subtitle }: { title: string; subtitle?: string }) => (
        <Box sx={{ mb: 3 }}>
            <Typography variant='h5' sx={{ fontWeight: 800, mb: 1 }}>
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

const PostDetails: FunctionComponent = () => {
    const { t } = useTranslation();
    const [post, setPost] = useState<Posts>(initialProductValue as Posts);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { isLoggedIn, auth } = useUser();
    const [isSubmittingReview, setIsSubmittingReview] =
        useState<boolean>(false);
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [isZoomed, setIsZoomed] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const [relatedProducts, setRelatedProducts] = useState<Posts[]>([]);

    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [isSharing, setIsSharing] = useState<boolean>(false);
    const [activeImage, setActiveImage] = useState(0);

    const sellerDisplayName = `${post.seller?.name?.first} ${post.seller?.name?.last || 'user'}`;

    const SECTION_TITLES = useMemo(
        () => ({
            details: {
                title: 'تفاصيل المنتج',
                subtitle:
                    'معلومات منظمة تساعد المستخدم على فهم المنتج ومواصفاته بسرعة.',
            },
        }),
        [],
    );

    const images = useMemo(() => {
        if (!post.image?.url) return [];
        return [post.image.url];
    }, [post.image]);

    const categoryLabel = post.category
        ? categoryLabels[post.category] || t(post.category)
        : t('product.category') || 'التصنيف';

    const isOwner = useMemo(() => {
        return auth._id && post._id && auth._id === String(post.seller?._id);
    }, [auth._id, post._id, post.seller?._id]);

    const handleZoomIn = useCallback(() => {
        setZoomLevel((prev) => Math.min(prev + 0.5, 3));
        setIsZoomed(true);
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoomLevel((prev) => {
            const nextZoom = Math.max(prev - 0.5, 1);
            if (nextZoom === 1) setIsZoomed(false);
            return nextZoom;
        });
    }, []);

    const handleResetZoom = useCallback(() => {
        setZoomLevel(1);
        setIsZoomed(false);
        setMousePosition({ x: 50, y: 50 });
    }, []);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!isZoomed || !imageContainerRef.current) return;

            const container = imageContainerRef.current;
            const { left, top, width, height } =
                container.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;

            setMousePosition({ x, y });
        },
        [isZoomed],
    );

    const handleFullscreenToggle = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await imageContainerRef.current?.requestFullscreen();
                setIsFullscreen(true);
                return;
            }

            await document.exitFullscreen();
            setIsFullscreen(false);
        } catch {
            showError('تعذر تفعيل وضع ملء الشاشة');
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange,
            );
        };
    }, []);

    const handleShare = useCallback(async () => {
        setIsSharing(true);

        try {
            const shareData = {
                title: `منتج ${post.product_name} رائع`,
                text: `شاهد ${post.product_name} الآن على منصة صفقة`,
                url: window.location.href,
            };

            if (navigator.share) {
                await navigator.share(shareData);
                showSuccess('تمت مشاركة المنتج بنجاح');
                return;
            }

            await navigator.clipboard.writeText(window.location.href);
            showSuccess('تم نسخ رابط المنتج');
        } catch (shareError) {
            if ((shareError as Error).name !== 'AbortError') {
                showError('تعذر تنفيذ المشاركة حالياً');
            }
        } finally {
            setIsSharing(false);
        }
    }, [post.product_name]);

    const handleDeletePost = useCallback(async () => {
        if (!postId) return;

        try {
            await deletePost(postId);
            showSuccess('تم حذف المنتج بنجاح');
            navigate(-1);
        } catch (deleteError) {
            showError(deleteError as string);
        }
    }, [navigate, postId]);

    const handleEditProduct = useCallback(() => {
        setShowUpdateModal(true);
    }, []);

    const handleCloseUpdateModal = useCallback(() => {
        setShowUpdateModal(false);
    }, []);

    const handleRefreshPost = () => {
        if (!postId) return;

        setLoading(true);
        getPostById(postId)
            .then((res) => {
                setPost(res);
                setRating(res.rating || 0);
            })
            .catch(() => setError('حدث خطأ أثناء تحميل المنتج'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setLoading(true);
        setError('');

        getPostById(postId as string)
            .then((res) => {
                setPost(res);
                setRating(res.rating || 0);
            })
            .catch((fetchError) => {
                console.error('Error fetching post:', fetchError);
                setError('حدث خطأ أثناء تحميل المنشور');
            })
            .finally(() => setLoading(false));
    }, [navigate, postId]);

    useEffect(() => {
        if (!post._id || !post.category) return;

        getRelatedPosts(post.category, post._id, 4)
            .then(setRelatedProducts)
            .catch(console.error);
    }, [post._id, post.category]);

    if (loading) {
        return (
            <Container maxWidth='xl' sx={{ py: 5 }}>
                <Stack spacing={3}>
                    <Skeleton variant='rounded' height={90} />
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, lg: 7 }}>
                            <Skeleton variant='rounded' height={520} />
                        </Grid>
                        <Grid size={{ xs: 12, lg: 5 }}>
                            <Stack spacing={2}>
                                <Skeleton variant='rounded' height={220} />
                                <Skeleton variant='rounded' height={260} />
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        );
    }

    if (!post?._id) {
        return (
            <Container maxWidth='md' sx={{ py: 8, textAlign: 'center' }}>
                <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 3 }} />
                <Typography variant='h5' color='error' gutterBottom>
                    {t('product.notFound') || 'المنتج غير موجود'}
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

    if (error) {
        return (
            <Container maxWidth='md' sx={{ py: 8, textAlign: 'center' }}>
                <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 3 }} />
                <Typography variant='h5' color='error' gutterBottom>
                    {error}
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
    const currentUrl = `${window.location.origin}/product/${post.category}/${post._id}`;

    return (
        <>
            <JsonLd data={productJsonLd} />
            <title>{post.product_name} | صفقة</title>
            <link rel='canonical' href={currentUrl} />
            <meta
                name='description'
                content={`اشتري ${post.product_name} بأفضل سعر على صفقة. ${post.description?.substring(0, 120)}`}
            />
            <meta property='og:title' content={post.product_name} />
            <meta
                property='og:description'
                content={post.description?.substring(0, 160)}
            />
            <meta property='og:image' content={post.image?.url} />
            <meta property='og:type' content='product' />
            <meta
                property='product:price:amount'
                content={post.price.toString()}
            />
            <meta property='product:price:currency' content='ILS' />

            <Box
                component='main'
                sx={{ backgroundColor: 'background.default', pb: 8 }}
            >
                <Container maxWidth='xl' sx={{ pt: { xs: 2, md: 5 }, pb: 10 }}>
                    <Stack spacing={4}>
                        {/* شريط البائع العلوي */}
                        <Card sx={{ ...sectionCardSx, p: { xs: 2, md: 3 } }}>
                            <Link
                                to={generatePath(path.CustomerProfile, {
                                    slug: encodeURIComponent(
                                        post.seller?.slug ?? '',
                                    ),
                                })}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                    alignItems={{
                                        xs: 'flex-start',
                                        sm: 'center',
                                    }}
                                    justifyContent='space-between'
                                >
                                    <Stack
                                        direction='row'
                                        spacing={2}
                                        alignItems='center'
                                    >
                                        <Avatar
                                            src={
                                                post.seller?.image?.url ||
                                                '/user.png'
                                            }
                                            alt={sellerDisplayName}
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                border: '2px solid',
                                                borderColor: '#B8860B',
                                            }}
                                        />
                                        <Box>
                                            <Stack
                                                direction='row'
                                                spacing={1}
                                                alignItems='center'
                                                flexWrap='wrap'
                                            >
                                                <Typography
                                                    variant='h6'
                                                    sx={{ fontWeight: 700 }}
                                                >
                                                    {sellerDisplayName}
                                                </Typography>
                                                {isOwner && (
                                                    <Chip
                                                        label='صاحب المنشور'
                                                        size='small'
                                                        sx={{
                                                            background:
                                                                BRAND_GRADIENT,
                                                            color: '#fff',
                                                            fontWeight: 700,
                                                        }}
                                                    />
                                                )}
                                            </Stack>
                                            <Stack
                                                direction={{
                                                    xs: 'column',
                                                    sm: 'row',
                                                }}
                                                spacing={1}
                                                divider={
                                                    <Divider
                                                        orientation='vertical'
                                                        flexItem
                                                        sx={{
                                                            display: {
                                                                xs: 'none',
                                                                sm: 'block',
                                                            },
                                                        }}
                                                    />
                                                }
                                                sx={{ mt: 0.75 }}
                                            >
                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                >
                                                    @
                                                    {post.seller?.slug ||
                                                        'seller'}
                                                </Typography>
                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                >
                                                    منشور منذ{' '}
                                                    {formatTimeAgo(
                                                        String(
                                                            post.createdAt ||
                                                                '',
                                                        ),
                                                        t,
                                                    )}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>

                                    <Button
                                        variant='contained'
                                        startIcon={<Comment />}
                                        sx={{ gap: 1, background: BRAND_GRADIENT }}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            navigate(
                                                generatePath(
                                                    path.CustomerProfile,
                                                    {
                                                        slug: encodeURIComponent(
                                                            post.seller?.slug ??
                                                                '',
                                                        ),
                                                    },
                                                ),
                                            );
                                        }}
                                    >
                                        تواصل
                                    </Button>
                                </Stack>
                            </Link>
                        </Card>

                        {/* مسار التنقل */}
                        <Box>
                            <Breadcrumbs
                                aria-label={
                                    t('product.breadcrumbNavigation') ||
                                    'مسار التنقل'
                                }
                                separator={
                                    <ChevronRight sx={{ fontSize: 20 }} />
                                }
                            >
                                <Button
                                    component={Link}
                                    to={path.Home}
                                    startIcon={<HomeIcon />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    {t('home')}
                                </Button>

                                {post.category && (
                                    <Button
                                        startIcon={<StoreIcon />}
                                        onClick={() => {
                                            const catPath =
                                                categoryPathMap[
                                                    post.category
                                                ] || '';
                                            if (catPath) navigate(catPath);
                                        }}
                                        disabled={
                                            !categoryPathMap[post.category]
                                        }
                                        sx={{ textTransform: 'none' }}
                                    >
                                        {categoryLabel}
                                    </Button>
                                )}

                                <Typography
                                    variant='body2'
                                    sx={{ fontWeight: 700 }}
                                >
                                    {post.product_name}
                                </Typography>
                            </Breadcrumbs>
                        </Box>

                        <Grid container spacing={4}>
                            {/* العمود الأيسر: الصورة + التفاصيل + المراجعات */}
                            <Grid size={{ xs: 12, lg: 7 }}>
                                <Stack spacing={3}>
                                    <motion.div
                                        variants={fadeUp}
                                        initial='hidden'
                                        whileInView='show'
                                        viewport={{ once: true, amount: 0.2 }}
                                    >
                                        <Card
                                            sx={{
                                                ...sectionCardSx,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Box
                                                ref={imageContainerRef}
                                                onMouseMove={handleMouseMove}
                                                onClick={() =>
                                                    setIsZoomed((prev) => !prev)
                                                }
                                                sx={{
                                                    position: 'relative',
                                                    height: { xs: 360, md: 620 },
                                                    borderRadius: 4,
                                                    overflow: 'hidden',
                                                    cursor: isZoomed
                                                        ? 'zoom-out'
                                                        : 'zoom-in',
                                                    background:
                                                        'radial-gradient(circle at top, #f8fafc 0%, #f1ede4 100%)',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background:
                                                            'radial-gradient(circle at var(--x,50%) var(--y,50%), rgba(184,134,11,.15), transparent 40%)',
                                                        pointerEvents: 'none',
                                                        transition: '0.2s',
                                                    },
                                                }}
                                            >
                                                {post.image?.url ? (
                                                    <>
                                                        <Box>
                                                            <Box
                                                                sx={{
                                                                    height: {
                                                                        xs: 320,
                                                                        md: 500,
                                                                    },
                                                                    borderRadius: 4,
                                                                    overflow:
                                                                        'hidden',
                                                                    mb: 2,
                                                                    position:
                                                                        'relative',
                                                                }}
                                                            >
                                                                <CardMedia
                                                                    component='img'
                                                                    image={
                                                                        images[
                                                                            activeImage
                                                                        ]
                                                                    }
                                                                    sx={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit:
                                                                            'contain',
                                                                        transition:
                                                                            '0.3s ease',
                                                                        transform:
                                                                            isZoomed
                                                                                ? `scale(${zoomLevel}) translate(${(mousePosition.x - 50) * 0.1}%, ${(mousePosition.y - 50) * 0.1}%)`
                                                                                : 'scale(1)',
                                                                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                                                                    }}
                                                                />
                                                            </Box>

                                                            {images.length >
                                                                1 && (
                                                                <Stack
                                                                    direction='row'
                                                                    spacing={1}
                                                                >
                                                                    {images.map(
                                                                        (
                                                                            img,
                                                                            index,
                                                                        ) => (
                                                                            <Box
                                                                                key={
                                                                                    index
                                                                                }
                                                                                onClick={() =>
                                                                                    setActiveImage(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                                sx={{
                                                                                    width: 70,
                                                                                    height: 70,
                                                                                    borderRadius: 2,
                                                                                    overflow:
                                                                                        'hidden',
                                                                                    cursor: 'pointer',
                                                                                    border:
                                                                                        activeImage ===
                                                                                        index
                                                                                            ? '2px solid #B8860B'
                                                                                            : '1px solid #ddd',
                                                                                    opacity:
                                                                                        activeImage ===
                                                                                        index
                                                                                            ? 1
                                                                                            : 0.6,
                                                                                    transition:
                                                                                        '0.2s',
                                                                                }}
                                                                            >
                                                                                <img
                                                                                    src={
                                                                                        img
                                                                                    }
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        height: '100%',
                                                                                        objectFit:
                                                                                            'cover',
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        ),
                                                                    )}
                                                                </Stack>
                                                            )}
                                                        </Box>

                                                        <Stack
                                                            className='image-controls'
                                                            direction='row'
                                                            spacing={1}
                                                            sx={{
                                                                position:
                                                                    'absolute',
                                                                left: '50%',
                                                                bottom: 18,
                                                                transform:
                                                                    'translateX(-50%)',
                                                                background:
                                                                    'rgba(0,0,0,0.55)',
                                                                backdropFilter:
                                                                    'blur(10px)',
                                                                borderRadius: 999,
                                                                px: 1.5,
                                                                py: 1,
                                                            }}
                                                        >
                                                            <Tooltip title='تكبير'>
                                                                <IconButton
                                                                    size='small'
                                                                    onClick={(
                                                                        event,
                                                                    ) => {
                                                                        event.stopPropagation();
                                                                        handleZoomIn();
                                                                    }}
                                                                    sx={{
                                                                        color: 'common.white',
                                                                    }}
                                                                >
                                                                    <ZoomIn />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title='تصغير'>
                                                                <span>
                                                                    <IconButton
                                                                        size='small'
                                                                        disabled={
                                                                            zoomLevel <=
                                                                            1
                                                                        }
                                                                        onClick={(
                                                                            event,
                                                                        ) => {
                                                                            event.stopPropagation();
                                                                            handleZoomOut();
                                                                        }}
                                                                        sx={{
                                                                            color: 'common.white',
                                                                        }}
                                                                    >
                                                                        <ZoomOut />
                                                                    </IconButton>
                                                                </span>
                                                            </Tooltip>
                                                            <Tooltip
                                                                title={
                                                                    isFullscreen
                                                                        ? 'إغلاق ملء الشاشة'
                                                                        : 'ملء الشاشة'
                                                                }
                                                            >
                                                                <IconButton
                                                                    size='small'
                                                                    onClick={(
                                                                        event,
                                                                    ) => {
                                                                        event.stopPropagation();
                                                                        void handleFullscreenToggle();
                                                                    }}
                                                                    sx={{
                                                                        color: 'common.white',
                                                                    }}
                                                                >
                                                                    {isFullscreen ? (
                                                                        <FullscreenExit />
                                                                    ) : (
                                                                        <Fullscreen />
                                                                    )}
                                                                </IconButton>
                                                            </Tooltip>
                                                            {isZoomed && (
                                                                <Tooltip title='إعادة الضبط'>
                                                                    <IconButton
                                                                        size='small'
                                                                        onClick={(
                                                                            event,
                                                                        ) => {
                                                                            event.stopPropagation();
                                                                            handleResetZoom();
                                                                        }}
                                                                        sx={{
                                                                            color: 'common.white',
                                                                        }}
                                                                    >
                                                                        <ZoomOut
                                                                            sx={{
                                                                                transform:
                                                                                    'rotate(45deg)',
                                                                            }}
                                                                        />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Stack>

                                                        {isZoomed && (
                                                            <Box
                                                                sx={{
                                                                    position:
                                                                        'absolute',
                                                                    top: 16,
                                                                    right: 16,
                                                                    px: 1.5,
                                                                    py: 0.5,
                                                                    borderRadius: 99,
                                                                    bgcolor:
                                                                        'rgba(0,0,0,0.6)',
                                                                    color: '#fff',
                                                                    fontWeight: 700,
                                                                    fontSize: 12,
                                                                }}
                                                            >
                                                                {zoomLevel.toFixed(
                                                                    1,
                                                                )}
                                                                x
                                                            </Box>
                                                        )}
                                                    </>
                                                ) : (
                                                    <Stack
                                                        justifyContent='center'
                                                        alignItems='center'
                                                        spacing={1.5}
                                                        sx={{ height: '100%' }}
                                                    >
                                                        <Typography variant='h6'>
                                                            لا توجد صورة للمنتج
                                                        </Typography>
                                                        <Typography
                                                            variant='body2'
                                                            color='text.secondary'
                                                        >
                                                            يمكن إضافة صورة
                                                            لاحقاً لتحسين عرض
                                                            المنتج.
                                                        </Typography>
                                                    </Stack>
                                                )}

                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        left: 16,
                                                        top: 16,
                                                        backgroundColor:
                                                            'rgba(255,255,255,0.9)',
                                                        borderRadius: 999,
                                                        px: 1.25,
                                                        py: 0.5,
                                                    }}
                                                >
                                                    <Typography
                                                        variant='caption'
                                                        sx={{ fontWeight: 700 }}
                                                    >
                                                        {isZoomed
                                                            ? 'اضغط لإلغاء التكبير'
                                                            : 'اضغط للتكبير'}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box
                                                sx={{
                                                    p: 2.5,
                                                    borderTop: 1,
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                <Stack
                                                    direction='row'
                                                    justifyContent='space-between'
                                                    alignItems='center'
                                                >
                                                    <Stack
                                                        onClick={() => {
                                                            if (!isLoggedIn) {
                                                                navigate(
                                                                    path.Login,
                                                                );
                                                            }
                                                        }}
                                                        direction='row'
                                                        spacing={1}
                                                    >
                                                        <LikeButton
                                                            product={post}
                                                            setProduct={setPost}
                                                        />
                                                        <IconButton
                                                            onClick={
                                                                handleShare
                                                            }
                                                            disabled={isSharing}
                                                        >
                                                            <ShareIcon />
                                                        </IconButton>
                                                    </Stack>

                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                    >
                                                        اعرض الصورة بوضوح أعلى
                                                        قبل اتخاذ قرار الشراء.
                                                    </Typography>
                                                </Stack>
                                            </Box>

                                            {isOwner && (
                                                <Box
                                                    sx={{
                                                        p: 2.5,
                                                        borderTop: 1,
                                                        borderColor: 'divider',
                                                    }}
                                                >
                                                    <Stack
                                                        direction={{
                                                            xs: 'column',
                                                            sm: 'row',
                                                        }}
                                                        spacing={2}
                                                    >
                                                        <Button
                                                            variant='contained'
                                                            color='warning'
                                                            startIcon={
                                                                <EditIcon />
                                                            }
                                                            onClick={
                                                                handleEditProduct
                                                            }
                                                            fullWidth
                                                        >
                                                            {t('edit')}
                                                        </Button>
                                                        <Button
                                                            variant='contained'
                                                            color='error'
                                                            startIcon={
                                                                <DeleteIcon />
                                                            }
                                                            onClick={() =>
                                                                setShowDeleteModal(
                                                                    true,
                                                                )
                                                            }
                                                            fullWidth
                                                        >
                                                            {t('delete')}
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            )}
                                        </Card>
                                    </motion.div>

                                    <Card
                                        sx={{
                                            ...sectionCardSx,
                                            p: { xs: 2.25, md: 3 },
                                        }}
                                    >
                                        <SectionTitle
                                            {...SECTION_TITLES.details}
                                        />
                                        <Grid container spacing={2}>
                                            {Object.entries({
                                                التصنيف: categoryLabel,
                                                السعر: formatPrice(post.price),
                                                البائع: sellerDisplayName,
                                                الحالة: post.in_stock
                                                    ? 'متوفر'
                                                    : 'غير متوفر',
                                                التقييم: `${rating}/5`,
                                            }).map(([key, value]) => (
                                                <Grid
                                                    size={{ xs: 6, md: 4 }}
                                                    key={key}
                                                >
                                                    <Card
                                                        sx={{
                                                            ...sectionCardSx,
                                                            p: 2,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant='caption'
                                                            color='text.secondary'
                                                        >
                                                            {key}
                                                        </Typography>

                                                        <Typography
                                                            fontWeight={700}
                                                        >
                                                            {value}
                                                        </Typography>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Card>

                                    <Card
                                        sx={{
                                            ...sectionCardSx,
                                            p: { xs: 2.25, md: 3 },
                                        }}
                                    >
                                        <SectionTitle
                                            title={t(
                                                'review.questionsAndReviews',
                                            )}
                                            subtitle={t(
                                                'review.questionsAndReviewsSubtitle',
                                            )}
                                        />

                                        {post.reviews?.length === 0 ? (
                                            <Alert
                                                severity='info'
                                                sx={{ mb: 3, borderRadius: 2 }}
                                            >
                                                {t('review.noReviewsYet')}
                                            </Alert>
                                        ) : (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 2,
                                                    mb: 3,
                                                }}
                                            >
                                                {post.reviews?.map(
                                                    (review, index) => (
                                                        <Card
                                                            key={index}
                                                            sx={{
                                                                ...sectionCardSx,
                                                                p: 2.5,
                                                                display: 'flex',
                                                                gap: 2,
                                                                alignItems:
                                                                    'flex-start',
                                                            }}
                                                        >
                                                            <Avatar
                                                                src={
                                                                    review.user
                                                                        ?.image ||
                                                                    '/user.png'
                                                                }
                                                                sx={{
                                                                    width: 44,
                                                                    height: 44,
                                                                }}
                                                            />

                                                            <Box flex={1}>
                                                                <Stack
                                                                    direction='row'
                                                                    justifyContent='space-between'
                                                                    alignItems='center'
                                                                >
                                                                    <Typography
                                                                        fontWeight={
                                                                            700
                                                                        }
                                                                    >
                                                                        {review
                                                                            .user
                                                                            ?._id ===
                                                                        auth?._id
                                                                            ? t(
                                                                                  'you',
                                                                              )
                                                                            : `${review.user?.name.first} ${review.user?.name.last || ''}`}
                                                                    </Typography>

                                                                    <Typography
                                                                        variant='caption'
                                                                        color='text.secondary'
                                                                    >
                                                                        {review.createdAt &&
                                                                            formatTimeAgo(
                                                                                String(
                                                                                    review.createdAt,
                                                                                ),
                                                                                t,
                                                                            )}
                                                                    </Typography>
                                                                </Stack>

                                                                <Rating
                                                                    value={
                                                                        review.rating ||
                                                                        0
                                                                    }
                                                                    size='small'
                                                                    readOnly
                                                                />

                                                                <Typography
                                                                    variant='body2'
                                                                    sx={{
                                                                        mt: 1,
                                                                        color: 'text.secondary',
                                                                    }}
                                                                >
                                                                    {
                                                                        review.comment
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        </Card>
                                                    ),
                                                )}
                                            </Box>
                                        )}

                                        <Stack spacing={2.5}>
                                            <TextField
                                                multiline
                                                rows={4}
                                                fullWidth
                                                value={comment}
                                                onChange={(event) =>
                                                    setComment(
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder={t(
                                                    'review.reviewPlaceholder',
                                                )}
                                                variant='outlined'
                                            />

                                            <Stack
                                                direction={{
                                                    xs: 'column',
                                                    sm: 'row',
                                                }}
                                                justifyContent='space-between'
                                                alignItems={{
                                                    xs: 'flex-start',
                                                    sm: 'center',
                                                }}
                                                spacing={2}
                                            >
                                                <Stack spacing={0.75}>
                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                    >
                                                        {t(
                                                            'review.reviewExperience',
                                                        )}
                                                    </Typography>
                                                    <Rating
                                                        value={rating}
                                                        onChange={(
                                                            _,
                                                            newValue,
                                                        ) =>
                                                            setRating(
                                                                newValue ?? 0,
                                                            )
                                                        }
                                                        precision={0.5}
                                                    />
                                                </Stack>
                                                <Button
                                                    variant='contained'
                                                    disabled={
                                                        !comment.trim() ||
                                                        isSubmittingReview ||
                                                        !isLoggedIn
                                                    }
                                                    sx={{
                                                        background:
                                                            BRAND_GRADIENT,
                                                    }}
                                                    onClick={async () => {
                                                        if (!isLoggedIn) {
                                                            navigate(
                                                                path.Login,
                                                            );
                                                            return;
                                                        }

                                                        setIsSubmittingReview(
                                                            true,
                                                        );
                                                        try {
                                                            const response =
                                                                await submitReview(
                                                                    post._id!,
                                                                    {
                                                                        userId: auth._id!,
                                                                        rating,
                                                                        comment,
                                                                    },
                                                                );

                                                            if (
                                                                response &&
                                                                response.review
                                                            ) {
                                                                setPost(
                                                                    (
                                                                        prevPost,
                                                                    ) => ({
                                                                        ...prevPost,
                                                                        reviews:
                                                                            [
                                                                                response.review,
                                                                                ...(prevPost.reviews ||
                                                                                    []),
                                                                            ],
                                                                        reviewCount:
                                                                            Number(
                                                                                prevPost
                                                                                    .reviews
                                                                                    ?.length ||
                                                                                    0,
                                                                            ) +
                                                                            1,
                                                                    }),
                                                                );

                                                                setComment('');
                                                                setRating(0);
                                                                showSuccess(
                                                                    t(
                                                                        'review.submitted',
                                                                    ),
                                                                );
                                                            }
                                                        } catch {
                                                            if (!rating) {
                                                                showError(
                                                                    t(
                                                                        'review.submitError',
                                                                    ),
                                                                );
                                                                return;
                                                            }
                                                        } finally {
                                                            setIsSubmittingReview(
                                                                false,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {isSubmittingReview
                                                        ? t(
                                                              'review.submitting',
                                                          ) ||
                                                          'جارٍ النشر...'
                                                        : t('review.publish') ||
                                                          'نشر التعليق'}
                                                </Button>
                                            </Stack>
                                            {!isLoggedIn && (
                                                <Alert
                                                    severity='warning'
                                                    sx={{ mt: 1 }}
                                                >
                                                    {t('review.loginToReview')}
                                                </Alert>
                                            )}
                                        </Stack>
                                    </Card>
                                </Stack>
                            </Grid>

                            {/* العمود الأيمن: السعر، الخيارات، بطاقة البائع والتواصل */}
                            <Grid size={{ xs: 12, lg: 5 }}>
                                <Stack
                                    spacing={3}
                                    sx={{
                                        position: { lg: 'sticky' },
                                        top: { lg: 24 },
                                    }}
                                >
                                    <Card
                                        sx={{
                                            ...sectionCardSx,
                                            p: { xs: 2.25, md: 3 },
                                        }}
                                    >
                                        <Stack spacing={2.5}>
                                            <Box>
                                                <Typography
                                                    variant='h3'
                                                    component='h1'
                                                    sx={{
                                                        fontWeight: 900,
                                                        lineHeight: 1.2,
                                                        mb: 1.5,
                                                    }}
                                                >
                                                    {post.product_name}
                                                </Typography>
                                                <Stack
                                                    direction='row'
                                                    spacing={1.25}
                                                    alignItems='center'
                                                    flexWrap='wrap'
                                                >
                                                    <Rating
                                                        value={rating}
                                                        precision={0.5}
                                                        onChange={(
                                                            _,
                                                            newValue,
                                                        ) =>
                                                            setRating(
                                                                newValue ?? 0,
                                                            )
                                                        }
                                                    />
                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                    >
                                                        {post.reviews?.length ||
                                                            0}{' '}
                                                        {t('reviews') ||
                                                            'تقييم'}
                                                    </Typography>
                                                </Stack>
                                            </Box>

                                            <Card
                                                sx={{
                                                    ...sectionCardSx,
                                                    p: 3,
                                                    background:
                                                        'linear-gradient(135deg, rgba(184,134,11,0.12), rgba(139,69,19,0.05))',
                                                }}
                                            >
                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                >
                                                    السعر الحالي
                                                </Typography>

                                                <Typography
                                                    variant='h3'
                                                    fontWeight={900}
                                                    sx={{
                                                        background:
                                                            BRAND_GRADIENT,
                                                        WebkitBackgroundClip:
                                                            'text',
                                                        WebkitTextFillColor:
                                                            'transparent',
                                                    }}
                                                >
                                                    {formatPrice(post.price)}
                                                </Typography>

                                                <Stack
                                                    direction='row'
                                                    spacing={1}
                                                    mt={2}
                                                >
                                                    <Chip
                                                        label={
                                                            post.in_stock
                                                                ? 'متوفر'
                                                                : 'غير متوفر'
                                                        }
                                                        color={
                                                            post.in_stock
                                                                ? 'success'
                                                                : 'default'
                                                        }
                                                        size='small'
                                                    />
                                                    <Chip
                                                        label='رد سريع'
                                                        size='small'
                                                    />
                                                </Stack>
                                            </Card>

                                            <Box>
                                                <Typography
                                                    variant='h6'
                                                    sx={{
                                                        fontWeight: 700,
                                                        mb: 1.5,
                                                    }}
                                                >
                                                    الخيارات المتاحة
                                                </Typography>
                                                <ColorsAndSizes
                                                    category={post.category}
                                                />
                                            </Box>

                                            <Divider />

                                            <Box>
                                                <Typography
                                                    variant='h6'
                                                    fontWeight={800}
                                                    mb={1}
                                                >
                                                    الوصف
                                                </Typography>

                                                <Typography
                                                    color='text.secondary'
                                                    sx={{ lineHeight: 1.9 }}
                                                >
                                                    {post.description ||
                                                        'لا يوجد وصف متاح لهذا المنتج'}
                                                </Typography>
                                            </Box>

                                            <Stack spacing={1.5}>
                                                <Button
                                                    fullWidth
                                                    variant='contained'
                                                    size='large'
                                                    startIcon={<Comment />}
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        navigate(
                                                            generatePath(
                                                                path.CustomerProfile,
                                                                {
                                                                    slug: encodeURIComponent(
                                                                        post
                                                                            .seller
                                                                            ?.slug ??
                                                                            '',
                                                                    ),
                                                                },
                                                            ),
                                                        );
                                                    }}
                                                    sx={{
                                                        py: 1.5,
                                                        background:
                                                            BRAND_GRADIENT,
                                                    }}
                                                >
                                                    تواصل مع البائع
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant='outlined'
                                                    size='large'
                                                    startIcon={<Phone />}
                                                    href='tel:0538346915'
                                                    sx={{
                                                        py: 1.5,
                                                        borderColor: '#B8860B',
                                                        color: '#8B4513',
                                                    }}
                                                >
                                                    اتصل الآن
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant='text'
                                                    size='large'
                                                    startIcon={
                                                        <ArrowBackIcon />
                                                    }
                                                    onClick={() => navigate(-1)}
                                                    sx={{ py: 1.25 }}
                                                >
                                                    {t('backOneStep')}
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Card>

                                    {/* بطاقة البائع الموثقة */}
                                    <Card sx={{ ...sectionCardSx, p: 3 }}>
                                        <Stack spacing={2}>
                                            <Stack
                                                direction='row'
                                                spacing={2}
                                                alignItems='center'
                                            >
                                                <Avatar
                                                    src={
                                                        post.seller?.image
                                                            ?.url || '/user.png'
                                                    }
                                                    sx={{
                                                        width: 56,
                                                        height: 56,
                                                        border: '2px solid',
                                                        borderColor: '#B8860B',
                                                    }}
                                                />

                                                <Box flex={1}>
                                                    <Typography
                                                        fontWeight={800}
                                                    >
                                                        {sellerDisplayName}
                                                    </Typography>

                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                    >
                                                        بائع • @
                                                        {post.seller?.slug}
                                                    </Typography>
                                                </Box>

                                                {isOwner && (
                                                    <Chip
                                                        label='إعلانك'
                                                        size='small'
                                                        sx={{
                                                            background:
                                                                BRAND_GRADIENT,
                                                            color: '#fff',
                                                            fontWeight: 700,
                                                        }}
                                                    />
                                                )}
                                            </Stack>

                                            <Stack
                                                direction='row'
                                                spacing={1}
                                                alignItems='center'
                                                sx={{
                                                    px: 1.5,
                                                    py: 1,
                                                    borderRadius: 2,
                                                    bgcolor:
                                                        'rgba(184,134,11,0.08)',
                                                }}
                                            >
                                                <VerifiedRounded
                                                    sx={{
                                                        color: '#B8860B',
                                                        fontSize: 20,
                                                    }}
                                                />
                                                <Typography
                                                    variant='body2'
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    بائع موثوق • رد سريع
                                                </Typography>
                                            </Stack>

                                            <Button
                                                fullWidth
                                                variant='text'
                                                startIcon={<ShareIcon />}
                                                onClick={handleShare}
                                                disabled={isSharing}
                                            >
                                                شارك المنتج
                                            </Button>
                                        </Stack>
                                    </Card>
                                </Stack>
                            </Grid>
                        </Grid>

                        {relatedProducts.length > 0 && (
                            <Box sx={{ mt: 6 }}>
                                <SectionTitle
                                    title={t(
                                        'relatedProducts',
                                        'منتجات ذات صلة',
                                    )}
                                    subtitle={t(
                                        'discoverRelatedProducts',
                                        'اكتشف منتجات أخرى قد تعجبك بناءً على اهتماماتك.',
                                    )}
                                />

                                <Stack
                                    direction='row'
                                    spacing={2}
                                    sx={{
                                        overflowX: 'auto',
                                        pb: 2,
                                        '&::-webkit-scrollbar': {
                                            display: 'none',
                                        },
                                    }}
                                >
                                    {relatedProducts.map((product) => (
                                        <Box
                                            key={product._id}
                                            sx={{ minWidth: 260 }}
                                        >
                                            <RelatedProductCard
                                                product={product}
                                            />
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                </Container>
            </Box>

            <AlertDialogs
                handleDelete={handleDeletePost}
                onHide={() => setShowDeleteModal(false)}
                show={showDeleteModal}
                title={`حذف ${post.product_name}`}
                description={`هل أنت متأكد من حذف المنتج "${post.product_name}"؟`}
            />

            <UpdateProductModal
                show={showUpdateModal}
                onHide={handleCloseUpdateModal}
                postId={post._id as string}
                refresh={handleRefreshPost}
            />
        </>
    );
};

export default PostDetails;