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
    Paper,
    Skeleton,
    Stack,
    TextField,
    Tooltip,
    Typography,
    alpha,
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
    Person,
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

import { easeOut, motion } from 'framer-motion';

import { useChatWindow } from '../../../context/ChatWindowContext';
import { UserMessage } from '../../../interfaces/chat/usersMessages';
import PostSpecifications from './PostSpecifications';

/* =========================================================
   BRAND
========================================================= */

const BRAND_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';

const BRAND_COLOR = '#B8860B';

const BRAND_DARK = '#8B4513';

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeUp = {
    hidden: {
        opacity: 0,
        y: 24,
    },

    show: {
        opacity: 1,
        y: 0,

        transition: {
            duration: 0.5,
            ease: easeOut,
        },
    },
};

/* =========================================================
   COMMON CARD STYLE
========================================================= */

const sectionCardSx = {
    borderRadius: 3,
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0 4px 20px rgba(0,0,0,.04)',
    transition: 'all .3s cubic-bezier(.4,0,.2,1)',

    '&:hover': {
        boxShadow: '0 8px 40px rgba(0,0,0,.08)',
    },
};

/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = memo(
    ({ title, subtitle }: { title: string; subtitle?: string }) => (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant='h5'
                sx={{
                    fontWeight: 800,
                    mb: 0.5,
                }}
            >
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

/* =========================================================
   COMPONENT
========================================================= */

const PostDetails: FunctionComponent = () => {
    const { t } = useTranslation();

    const { postId } = useParams<{ postId: string }>();

    const navigate = useNavigate();

    const { isLoggedIn, auth } = useUser();

    const { openChat } = useChatWindow();

    /* =====================================================
       STATE
    ===================================================== */

    const [post, setPost] = useState(initialProductValue as Posts);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const [productRating, setProductRating] = useState<number>(0);

    const [reviewRating, setReviewRating] = useState<number>(0);

    const [comment, setComment] = useState('');

    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const [isSharing, setIsSharing] = useState<boolean>(false);

    const [zoomLevel, setZoomLevel] = useState<number>(1);

    const [isZoomed, setIsZoomed] = useState<boolean>(false);

    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const [mousePosition, setMousePosition] = useState({
        x: 50,
        y: 50,
    });

    const [relatedProducts, setRelatedProducts] = useState<Posts[]>([]);

    const imageContainerRef = useRef<HTMLDivElement | null>(null);

    /* =====================================================
       SELLER
    ===================================================== */

    const sellerDisplayName = useMemo(() => {
        return (
            [post.seller?.name?.first, post.seller?.name?.last]
                .filter(Boolean)
                .join(' ') || 'user'
        );
    }, [post.seller?.name?.first, post.seller?.name?.last]);

    /* =====================================================
       CATEGORY
    ===================================================== */

    const categoryLabel = useMemo(() => {
        if (!post.category) {
            return t('product.category') || 'التصنيف';
        }

        return categoryLabels[post.category] || t(post.category);
    }, [post.category, t]);

    /* =====================================================
       OWNER
    ===================================================== */

    const isOwner = useMemo(() => {
        return Boolean(
            auth?._id &&
                post?._id &&
                String(auth._id) === String(post.seller?._id),
        );
    }, [auth?._id, post?._id, post.seller?._id]);

    /* =====================================================
       CONTACT SELLER
    ===================================================== */

    const handleContactSeller = useCallback(() => {
        const seller = post.seller;

        if (!auth?._id) {
            navigate(path.Login);
            return;
        }

        if (!seller?._id) {
            showError('لا يمكن فتح المحادثة، البائع غير متوفر');
            return;
        }

        if (String(auth._id) === String(seller._id)) {
            showError('لا يمكنك التواصل مع نفسك');
            return;
        }

        const initialMessage =
            `مرحباً، أنا مهتم ب"${post.product_name}" 💬\n\n` +
            `📦 السعر: ${formatPrice(post.price)}\n` +
            `📂 التصنيف: ${categoryLabel}\n` +
            `🔗 رابط المنتج: ${window.location.href}\n\n` +
            `هل لا يزال متوفراً؟`;

        openChat(seller as UserMessage, initialMessage);
    }, [
        auth?._id,
        navigate,
        openChat,
        post.price,
        post.product_name,
        post.seller,
        categoryLabel,
    ]);

    /* =====================================================
       PROFILE
    ===================================================== */

    const goToProfile = useCallback(() => {
        if (!post.seller?.slug) {
            return;
        }

        navigate(
            generatePath(path.CustomerProfile, {
                slug: encodeURIComponent(post.seller.slug),
            }),
        );
    }, [navigate, post.seller?.slug]);

    /* =====================================================
       ZOOM
    ===================================================== */

    const handleZoomIn = useCallback(() => {
        setZoomLevel((prev) => Math.min(prev + 0.5, 3));

        setIsZoomed(true);
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoomLevel((prev) => {
            const nextZoom = Math.max(prev - 0.5, 1);

            if (nextZoom === 1) {
                setIsZoomed(false);
            }

            return nextZoom;
        });
    }, []);

    const handleResetZoom = useCallback(() => {
        setZoomLevel(1);
        setIsZoomed(false);

        setMousePosition({
            x: 50,
            y: 50,
        });
    }, []);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!isZoomed || !imageContainerRef.current) {
                return;
            }

            const container = imageContainerRef.current;

            const { left, top, width, height } =
                container.getBoundingClientRect();

            const x = ((e.clientX - left) / width) * 100;

            const y = ((e.clientY - top) / height) * 100;

            setMousePosition({
                x,
                y,
            });
        },
        [isZoomed],
    );

    /* =====================================================
       FULLSCREEN
    ===================================================== */

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
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange,
            );
        };
    }, []);

    /* =====================================================
       SHARE
    ===================================================== */

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

    /* =====================================================
       DELETE POST
    ===================================================== */

    const handleDeletePost = useCallback(async () => {
        if (!postId) {
            return;
        }

        try {
            await deletePost(postId);

            showSuccess('تم حذف المنتج بنجاح');

            const categoryPath = post.category
                ? categoryPathMap[post.category]
                : undefined;

            navigate(categoryPath || path.Home, {
                replace: true,
            });
        } catch (deleteError) {
            console.error('Delete post error:', deleteError);

            showError(deleteError as string);
        }
    }, [navigate, post.category, postId]);

    /* =====================================================
       EDIT
    ===================================================== */

    const handleEditProduct = useCallback(() => {
        setShowUpdateModal(true);
    }, []);

    const handleCloseUpdateModal = useCallback(() => {
        setShowUpdateModal(false);
    }, []);

    /* =====================================================
       REFRESH POST
    ===================================================== */

    const handleRefreshPost = useCallback(() => {
        if (!postId) {
            return;
        }

        setLoading(true);

        getPostById(postId)
            .then((res) => {
                setPost(res);

                setProductRating(Number(res.rating || 0));
            })
            .catch(() => {
                setError('حدث خطأ أثناء تحميل المنتج');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [postId]);

    /* =====================================================
       GET POST
    ===================================================== */

    useEffect(() => {
        if (!postId) {
            setError('معرف المنتج غير موجود');

            setLoading(false);

            return;
        }

        setLoading(true);
        setError('');

        getPostById(postId)
            .then((res) => {
                setPost(res);

                setProductRating(Number(res.rating || 0));
            })
            .catch((fetchError) => {
                console.error('Error fetching post:', fetchError);

                setError('حدث خطأ أثناء تحميل المنشور');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [postId]);

    /* =====================================================
       RELATED PRODUCTS
    ===================================================== */

    useEffect(() => {
        if (!post._id || !post.category) {
            return;
        }

        getRelatedPosts(post.category, post._id, 4)
            .then(setRelatedProducts)
            .catch((relatedError) => {
                console.error('Related products error:', relatedError);
            });
    }, [post._id, post.category]);

    // Call this when the post details page loads
    useEffect(() => {
        if (postId && !isOwner) {
            incrementViewCount(postId);
        }
    }, [isOwner, postId]);

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <Container maxWidth='xl' sx={{ py: 5 }}>
                <Stack spacing={3}>
                    <Skeleton variant='rounded' height={90} />

                    <Grid container spacing={3}>
                        <Grid
                            size={{
                                xs: 12,
                                lg: 7,
                            }}
                        >
                            <Skeleton variant='rounded' height={520} />
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                lg: 5,
                            }}
                        >
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

    /* =====================================================
       ERROR / NOT FOUND
    ===================================================== */

    if (error) {
        return (
            <Container
                maxWidth='md'
                sx={{
                    py: 8,
                    textAlign: 'center',
                }}
            >
                <ErrorIcon
                    sx={{
                        fontSize: 64,
                        color: 'error.main',
                        mb: 3,
                    }}
                />

                <Typography variant='h5' color='error' gutterBottom>
                    {error}
                </Typography>

                <Button
                    variant='contained'
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{
                        mt: 3,
                        background: BRAND_GRADIENT,
                    }}
                >
                    {t('backOneStep')}
                </Button>
            </Container>
        );
    }

    if (!post?._id) {
        return (
            <Container
                maxWidth='md'
                sx={{
                    py: 8,
                    textAlign: 'center',
                }}
            >
                <ErrorIcon
                    sx={{
                        fontSize: 64,
                        color: 'error.main',
                        mb: 3,
                    }}
                />

                <Typography variant='h5' color='error' gutterBottom>
                    {t('product.notFound') || 'المنتج غير موجود'}
                </Typography>

                <Button
                    variant='contained'
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{
                        mt: 3,
                        background: BRAND_GRADIENT,
                    }}
                >
                    {t('backOneStep')}
                </Button>
            </Container>
        );
    }

    /* =====================================================
       SEO
    ===================================================== */

    const productJsonLd = generateSingleProductJsonLd(post);

    const currentUrl =
        `${window.location.origin}/product/` + `${post.category}/${post._id}`;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <>
            <JsonLd data={productJsonLd} />

            <title>{post.product_name} | صفقة</title>

            <link rel='canonical' href={currentUrl} />

            <meta
                name='description'
                content={
                    `اشتري ${post.product_name} بأفضل سعر على صفقة. ` +
                    `${post.description?.substring(0, 120) || ''}`
                }
            />

            <meta property='og:title' content={post.product_name} />

            <meta
                property='og:description'
                content={post.description?.substring(0, 160) || ''}
            />

            <meta property='og:image' content={post.image?.url || ''} />

            <meta property='og:type' content='product' />

            <meta
                property='product:price:amount'
                content={String(post.price || 0)}
            />

            <meta property='product:price:currency' content='ILS' />

            <Box
                component='main'
                sx={{
                    backgroundColor: 'background.default',
                    pb: 8,
                }}
            >
                <Container
                    maxWidth='xl'
                    sx={{
                        pt: {
                            xs: 2,
                            md: 5,
                        },
                        pb: 10,
                    }}
                >
                    <Stack spacing={4}>
                        {/* =================================================
                            SELLER TOP BAR
                        ================================================= */}

                        <Paper
                            elevation={0}
                            sx={{
                                ...sectionCardSx,
                                p: {
                                    xs: 2,
                                    md: 3,
                                },
                                borderRadius: 3,
                            }}
                        >
                            <Stack
                                direction={{
                                    xs: 'column',
                                    md: 'row',
                                }}
                                spacing={{
                                    xs: 2,
                                    md: 2,
                                }}
                                alignItems={{
                                    xs: 'stretch',
                                    md: 'center',
                                }}
                                justifyContent='space-between'
                            >
                                <Stack
                                    direction='row'
                                    spacing={2}
                                    alignItems='center'
                                    sx={{
                                        flex: 1,
                                        minWidth: 0,
                                    }}
                                >
                                    <Avatar
                                        src={
                                            post.seller?.image?.url ||
                                            '/user.png'
                                        }
                                        alt={sellerDisplayName}
                                        onClick={goToProfile}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            border: '2px solid',
                                            borderColor: BRAND_COLOR,
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',

                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            minWidth: 0,
                                            flex: 1,
                                        }}
                                    >
                                        <Stack
                                            direction='row'
                                            spacing={1}
                                            alignItems='center'
                                            flexWrap='wrap'
                                        >
                                            <Typography
                                                variant='h6'
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: {
                                                        xs: '1rem',
                                                        md: '1.1rem',
                                                    },
                                                }}
                                            >
                                                {sellerDisplayName}
                                            </Typography>

                                            {isOwner && (
                                                <Chip
                                                    label='صاحب المنشور'
                                                    size='small'
                                                    sx={{
                                                        fontWeight: 700,
                                                        height: 24,

                                                        '& .MuiChip-label': {
                                                            px: 1.5,
                                                            fontSize: '0.7rem',
                                                        },
                                                    }}
                                                />
                                            )}

                                            {post.seller?.slug && (
                                                <Tooltip title='بائع موثوق'>
                                                    <VerifiedRounded
                                                        sx={{
                                                            color: BRAND_COLOR,
                                                            fontSize: 20,
                                                        }}
                                                    />
                                                </Tooltip>
                                            )}
                                        </Stack>

                                        <Stack
                                            direction={{
                                                xs: 'column',
                                                sm: 'row',
                                            }}
                                            spacing={{
                                                xs: 0.5,
                                                sm: 1.5,
                                            }}
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
                                            sx={{
                                                mt: 0.5,
                                            }}
                                        >
                                            <Typography
                                                variant='body2'
                                                color='text.secondary'
                                                sx={{
                                                    fontSize: '0.8125rem',
                                                }}
                                            >
                                                @{post.seller?.slug || 'seller'}
                                            </Typography>

                                            <Typography
                                                variant='body2'
                                                color='text.secondary'
                                                sx={{
                                                    fontSize: '0.8125rem',
                                                }}
                                            >
                                                منشور منذ{' '}
                                                {formatTimeAgo(
                                                    String(
                                                        post.createdAt || '',
                                                    ),
                                                    t,
                                                )}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Stack>

                                <Stack
                                    direction='row'
                                    spacing={1}
                                    sx={{
                                        flexShrink: 0,

                                        '& .MuiButton-root': {
                                            py: 1,
                                            px: {
                                                xs: 1.5,
                                                sm: 2.5,
                                            },
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            whiteSpace: 'nowrap',
                                        },
                                    }}
                                >
                                    <Button
                                        variant='outlined'
                                        startIcon={
                                            <Person
                                                sx={{
                                                    fontSize: 20,
                                                }}
                                            />
                                        }
                                        onClick={goToProfile}
                                        sx={{
                                            borderColor: 'divider',
                                            color: 'text.secondary',

                                            '&:hover': {
                                                borderColor: BRAND_COLOR,
                                                color: BRAND_COLOR,
                                                bgcolor: alpha(
                                                    BRAND_COLOR,
                                                    0.04,
                                                ),
                                            },
                                        }}
                                    >
                                        الملف الشخصي
                                    </Button>

                                    {isOwner ? (
                                        <>
                                            <Button
                                                variant='outlined'
                                                startIcon={
                                                    <EditIcon
                                                        sx={{
                                                            fontSize: 20,
                                                        }}
                                                    />
                                                }
                                                onClick={handleEditProduct}
                                                sx={{
                                                    borderColor: 'warning.main',

                                                    '&:hover': {
                                                        bgcolor: alpha(
                                                            '#ED6C02',
                                                            0.04,
                                                        ),
                                                    },
                                                }}
                                            >
                                                تعديل
                                            </Button>

                                            <Button
                                                variant='outlined'
                                                startIcon={
                                                    <DeleteIcon
                                                        sx={{
                                                            fontSize: 20,
                                                        }}
                                                    />
                                                }
                                                onClick={() =>
                                                    setShowDeleteModal(true)
                                                }
                                                sx={{
                                                    borderColor: 'error.main',
                                                    color: 'error.main',

                                                    '&:hover': {
                                                        bgcolor: alpha(
                                                            '#D32F2F',
                                                            0.04,
                                                        ),
                                                    },
                                                }}
                                            >
                                                حذف
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant='outlined'
                                            startIcon={
                                                <Comment
                                                    sx={{
                                                        fontSize: 20,
                                                    }}
                                                />
                                            }
                                            onClick={handleContactSeller}
                                            sx={{
                                                gap: 1,
                                                borderColor: 'divider',
                                                color: 'text.secondary',

                                                '&:hover': {
                                                    borderColor: BRAND_COLOR,
                                                    color: BRAND_COLOR,
                                                    bgcolor: alpha(
                                                        BRAND_COLOR,
                                                        0.04,
                                                    ),
                                                },
                                            }}
                                        >
                                            تواصل
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>
                        </Paper>

                        {/* =================================================
                            BREADCRUMBS
                        ================================================= */}

                        <Box>
                            <Breadcrumbs
                                aria-label={
                                    t('product.breadcrumbNavigation') ||
                                    'مسار التنقل'
                                }
                                separator={
                                    <ChevronRight
                                        sx={{
                                            fontSize: 20,
                                            color: 'text.disabled',
                                        }}
                                    />
                                }
                            >
                                <Button
                                    component={Link}
                                    to={path.Home}
                                    startIcon={
                                        <HomeIcon
                                            sx={{
                                                fontSize: 18,
                                            }}
                                        />
                                    }
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    {t('home')}
                                </Button>

                                {post.category && (
                                    <Button
                                        startIcon={
                                            <StoreIcon
                                                sx={{
                                                    fontSize: 18,
                                                }}
                                            />
                                        }
                                        onClick={() => {
                                            const catPath =
                                                categoryPathMap[
                                                    post.category
                                                ] || '';

                                            if (catPath) {
                                                navigate(catPath);
                                            }
                                        }}
                                        disabled={
                                            !categoryPathMap[post.category]
                                        }
                                        sx={{
                                            textTransform: 'none',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {categoryLabel}
                                    </Button>
                                )}

                                <Typography
                                    variant='body2'
                                    sx={{
                                        fontWeight: 700,
                                        color: 'text.primary',
                                        fontSize: '0.875rem',
                                        maxWidth: 200,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {post.product_name}
                                </Typography>
                            </Breadcrumbs>
                        </Box>

                        {/* =================================================
                            MAIN GRID
                        ================================================= */}

                        <Grid container spacing={4}>
                            {/* =================================================
                                LEFT
                            ================================================= */}

                            <Grid
                                size={{
                                    xs: 12,
                                    lg: 7,
                                }}
                            >
                                <Stack spacing={3}>
                                    {/* IMAGE */}
                                    <motion.div
                                        variants={fadeUp}
                                        initial='hidden'
                                        whileInView='show'
                                        viewport={{
                                            once: true,
                                            amount: 0.2,
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                ...sectionCardSx,
                                                overflow: 'hidden',
                                                borderRadius: 3,
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
                                                    height: {
                                                        xs: 360,
                                                        md: 520,
                                                    },
                                                    borderRadius: 3,
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
                                                        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(184,134,11,.12), transparent 40%)`,
                                                        pointerEvents: 'none',
                                                        transition: '0.2s',
                                                    },
                                                }}
                                            >
                                                {post.image?.url ? (
                                                    <>
                                                        <CardMedia
                                                            component='img'
                                                            image={
                                                                post.image.url
                                                            }
                                                            alt={
                                                                post.product_name
                                                            }
                                                            sx={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit:
                                                                    'contain',
                                                                transition:
                                                                    'transform 0.3s ease',

                                                                transform:
                                                                    isZoomed
                                                                        ? `scale(${zoomLevel}) translate(${(mousePosition.x - 50) * 0.1}%, ${(mousePosition.y - 50) * 0.1}%)`
                                                                        : 'scale(1)',

                                                                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                                                            }}
                                                        />

                                                        {/* IMAGE CONTROLS */}

                                                        <Stack
                                                            direction='row'
                                                            spacing={0.5}
                                                            sx={{
                                                                position:
                                                                    'absolute',
                                                                left: '50%',
                                                                bottom: 16,
                                                                transform:
                                                                    'translateX(-50%)',
                                                                background:
                                                                    'rgba(0,0,0,0.6)',
                                                                backdropFilter:
                                                                    'blur(12px)',
                                                                borderRadius: 99,
                                                                px: 1,
                                                                py: 0.75,
                                                                boxShadow:
                                                                    '0 4px 20px rgba(0,0,0,0.2)',
                                                            }}
                                                        >
                                                            <Tooltip
                                                                title='تكبير'
                                                                placement='top'
                                                            >
                                                                <IconButton
                                                                    size='small'
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        handleZoomIn();
                                                                    }}
                                                                    sx={{
                                                                        color: 'common.white',
                                                                    }}
                                                                >
                                                                    <ZoomIn
                                                                        sx={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip
                                                                title='تصغير'
                                                                placement='top'
                                                            >
                                                                <span>
                                                                    <IconButton
                                                                        size='small'
                                                                        disabled={
                                                                            zoomLevel <=
                                                                            1
                                                                        }
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleZoomOut();
                                                                        }}
                                                                        sx={{
                                                                            color: 'common.white',
                                                                        }}
                                                                    >
                                                                        <ZoomOut
                                                                            sx={{
                                                                                fontSize: 20,
                                                                            }}
                                                                        />
                                                                    </IconButton>
                                                                </span>
                                                            </Tooltip>

                                                            <Divider
                                                                orientation='vertical'
                                                                flexItem
                                                                sx={{
                                                                    bgcolor:
                                                                        'rgba(255,255,255,0.2)',
                                                                }}
                                                            />

                                                            <Tooltip
                                                                title={
                                                                    isFullscreen
                                                                        ? 'إغلاق ملء الشاشة'
                                                                        : 'ملء الشاشة'
                                                                }
                                                                placement='top'
                                                            >
                                                                <IconButton
                                                                    size='small'
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();

                                                                        void handleFullscreenToggle();
                                                                    }}
                                                                    sx={{
                                                                        color: 'common.white',
                                                                    }}
                                                                >
                                                                    {isFullscreen ? (
                                                                        <FullscreenExit
                                                                            sx={{
                                                                                fontSize: 20,
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <Fullscreen
                                                                            sx={{
                                                                                fontSize: 20,
                                                                            }}
                                                                        />
                                                                    )}
                                                                </IconButton>
                                                            </Tooltip>

                                                            {isZoomed && (
                                                                <>
                                                                    <Divider
                                                                        orientation='vertical'
                                                                        flexItem
                                                                        sx={{
                                                                            bgcolor:
                                                                                'rgba(255,255,255,0.2)',
                                                                        }}
                                                                    />

                                                                    <Tooltip
                                                                        title='إعادة الضبط'
                                                                        placement='top'
                                                                    >
                                                                        <IconButton
                                                                            size='small'
                                                                            onClick={(
                                                                                e,
                                                                            ) => {
                                                                                e.stopPropagation();

                                                                                handleResetZoom();
                                                                            }}
                                                                            sx={{
                                                                                color: 'common.white',
                                                                            }}
                                                                        >
                                                                            <ZoomOut
                                                                                sx={{
                                                                                    fontSize: 20,
                                                                                    transform:
                                                                                        'rotate(45deg)',
                                                                                }}
                                                                            />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </>
                                                            )}
                                                        </Stack>

                                                        {/* ZOOM LEVEL */}

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
                                                                        'rgba(0,0,0,0.7)',
                                                                    color: '#fff',
                                                                    fontWeight: 700,
                                                                    fontSize: 12,
                                                                    backdropFilter:
                                                                        'blur(8px)',
                                                                }}
                                                            >
                                                                {zoomLevel.toFixed(
                                                                    1,
                                                                )}
                                                                x
                                                            </Box>
                                                        )}

                                                        {/* ZOOM HINT */}

                                                        <Box
                                                            sx={{
                                                                position:
                                                                    'absolute',
                                                                left: 16,
                                                                top: 16,
                                                                backgroundColor:
                                                                    'rgba(255,255,255,0.9)',
                                                                backdropFilter:
                                                                    'blur(4px)',
                                                                borderRadius: 99,
                                                                px: 1.5,
                                                                py: 0.5,
                                                                boxShadow:
                                                                    '0 2px 8px rgba(0,0,0,0.08)',
                                                            }}
                                                        >
                                                            <Typography
                                                                variant='caption'
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    color: 'text.secondary',
                                                                    fontSize:
                                                                        '0.6875rem',
                                                                }}
                                                            >
                                                                {isZoomed
                                                                    ? '🔄 اضغط لإلغاء التكبير'
                                                                    : '🔍 اضغط للتكبير'}
                                                            </Typography>
                                                        </Box>
                                                    </>
                                                ) : (
                                                    <Stack
                                                        justifyContent='center'
                                                        alignItems='center'
                                                        spacing={1.5}
                                                        sx={{
                                                            height: '100%',
                                                        }}
                                                    >
                                                        <Typography
                                                            variant='h6'
                                                            color='text.secondary'
                                                        >
                                                            لا توجد صورة للمنتج
                                                        </Typography>

                                                        <Typography
                                                            variant='body2'
                                                            color='text.disabled'
                                                        >
                                                            يمكن إضافة صورة
                                                            لاحقاً لتحسين عرض
                                                            المنتج.
                                                        </Typography>
                                                    </Stack>
                                                )}
                                            </Box>

                                            {/* ACTIONS */}

                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderTop: 1,
                                                    borderColor: 'divider',
                                                    bgcolor: alpha(
                                                        '#000',
                                                        0.01,
                                                    ),
                                                }}
                                            >
                                                <Stack
                                                    direction='row'
                                                    justifyContent='space-between'
                                                    alignItems='center'
                                                    flexWrap='wrap'
                                                    gap={1}
                                                >
                                                    <Stack
                                                        direction='row'
                                                        spacing={0.5}
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
                                                            sx={{
                                                                color: 'text.secondary',

                                                                '&:hover': {
                                                                    color: BRAND_COLOR,
                                                                    bgcolor:
                                                                        alpha(
                                                                            BRAND_COLOR,
                                                                            0.08,
                                                                        ),
                                                                },
                                                            }}
                                                        >
                                                            <ShareIcon />
                                                        </IconButton>
                                                    </Stack>

                                                    <Typography
                                                        variant='caption'
                                                        color='text.secondary'
                                                        sx={{
                                                            fontSize: '0.75rem',
                                                            opacity: 0.7,
                                                        }}
                                                    >
                                                        اعرض الصورة بوضوح أعلى
                                                        قبل اتخاذ قرار الشراء.
                                                    </Typography>
                                                </Stack>
                                            </Box>

                                            {/* OWNER ACTIONS */}
                                            {/* 
                                            {isOwner && (
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderTop: 1,
                                                        borderColor: 'divider',
                                                        bgcolor: alpha(
                                                            '#000',
                                                            0.01,
                                                        ),
                                                    }}
                                                >
                                                    <Stack
                                                        direction={{
                                                            xs: 'column',
                                                            sm: 'row',
                                                        }}
                                                        spacing={1.5}
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
                                                            sx={{
                                                                py: 1.25,
                                                                fontWeight: 600,
                                                            }}
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
                                                            sx={{
                                                                py: 1.25,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {t('delete')}
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            )} */}
                                        </Card>
                                    </motion.div>

                                    {/* =================================================
                                        DETAILS
                                    ================================================= */}

                                    {/* <Card
                                        sx={{
                                            ...sectionCardSx,
                                            p: {
                                                xs: 2.25,
                                                md: 3,
                                            },
                                            borderRadius: 3,
                                        }}
                                    >
                                        <SectionTitle
                                            {...SECTION_TITLES.details}
                                        />

                                        <Grid
                                            container
                                            spacing={2}
                                        >
                                            {Object.entries({
                                                التصنيف:
                                                    categoryLabel,
                                                السعر:
                                                    formatPrice(
                                                        post.price,
                                                    ),
                                                البائع:
                                                    sellerDisplayName,
                                                الحالة:
                                                    post.in_stock
                                                        ? '✅ متوفر'
                                                        : '❌ غير متوفر',
                                                التقييم:
                                                    `${productRating.toFixed(
                                                        1,
                                                    )}/5 ⭐`,
                                            }).map(
                                                ([
                                                    key,
                                                    value,
                                                ]) => (
                                                    <Grid
                                                        size={{
                                                            xs: 6,
                                                            md: 4,
                                                        }}
                                                        key={
                                                            key
                                                        }
                                                    >
                                                        <Box
                                                            sx={{
                                                                p: 2,
                                                                borderRadius: 2,
                                                                bgcolor:
                                                                    alpha(
                                                                        '#000',
                                                                        0.02,
                                                                    ),
                                                                border:
                                                                    '1px solid',
                                                                borderColor:
                                                                    'divider',
                                                                transition:
                                                                    '0.2s',

                                                                '&:hover':
                                                                    {
                                                                        bgcolor:
                                                                            alpha(
                                                                                BRAND_COLOR,
                                                                                0.04,
                                                                            ),
                                                                        borderColor:
                                                                            BRAND_COLOR,
                                                                    },
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                                sx={{
                                                                    display:
                                                                        'block',
                                                                    fontSize:
                                                                        '0.6875rem',
                                                                    textTransform:
                                                                        'uppercase',
                                                                    letterSpacing: 0.5,
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {
                                                                    key
                                                                }
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    fontSize:
                                                                        '0.9375rem',
                                                                    mt: 0.5,
                                                                    color:
                                                                        key ===
                                                                        'السعر'
                                                                            ? BRAND_COLOR
                                                                            : 'text.primary',
                                                                }}
                                                            >
                                                                {
                                                                    value
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                ),
                                            )}
                                        </Grid>
                                    </Card> */}
                                    {/* PRODUCT INFO */}

                                    <Card
                                        sx={{
                                            ...sectionCardSx,
                                            p: {
                                                xs: 2.25,
                                                md: 3,
                                            },
                                            borderRadius: 3,
                                        }}
                                    >
                                        <Stack spacing={2.5}>
                                            <Box>
                                                <Typography
                                                    variant='h4'
                                                    component='h1'
                                                    sx={{
                                                        fontWeight: 900,
                                                        lineHeight: 1.2,
                                                        mb: 1.5,
                                                        fontSize: {
                                                            xs: '1.5rem',
                                                            md: '2rem',
                                                        },
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
                                                    {/* PRODUCT RATING
                                                        READ ONLY */}
                                                    <Rating
                                                        value={productRating}
                                                        precision={0.5}
                                                        size='medium'
                                                        readOnly
                                                    />

                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                    >
                                                        {post.reviews?.length ??
                                                            post.reviews
                                                                ?.length ??
                                                            0}{' '}
                                                        {t('reviews') ||
                                                            'تقييم'}
                                                    </Typography>
                                                </Stack>
                                            </Box>

                                            {/* PRICE */}

                                            <Box
                                                sx={{
                                                    p: 3,
                                                    borderRadius: 2,
                                                    background: `linear-gradient(135deg, ${alpha(
                                                        BRAND_COLOR,
                                                        0.08,
                                                    )}, ${alpha(
                                                        BRAND_DARK,
                                                        0.04,
                                                    )})`,
                                                    border: `1px solid ${alpha(
                                                        BRAND_COLOR,
                                                        0.12,
                                                    )}`,
                                                }}
                                            >
                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                    sx={{
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    السعر الحالي
                                                </Typography>

                                                <Typography
                                                    variant='h3'
                                                    sx={{
                                                        fontWeight: 900,
                                                        background:
                                                            BRAND_GRADIENT,
                                                        WebkitBackgroundClip:
                                                            'text',
                                                        WebkitTextFillColor:
                                                            'transparent',
                                                        fontSize: {
                                                            xs: '2rem',
                                                            md: '2.5rem',
                                                        },
                                                    }}
                                                >
                                                    {formatPrice(post.price)}
                                                </Typography>

                                                <Stack
                                                    direction='row'
                                                    spacing={1}
                                                    sx={{
                                                        mt: 2,
                                                    }}
                                                >
                                                    <Chip
                                                        label={
                                                            post.in_stock
                                                                ? '✅ متوفر'
                                                                : '❌ غير متوفر'
                                                        }
                                                        color={
                                                            post.in_stock
                                                                ? 'success'
                                                                : 'default'
                                                        }
                                                        size='small'
                                                        sx={{
                                                            fontWeight: 600,
                                                        }}
                                                    />

                                                    <Chip
                                                        label='⚡ رد سريع'
                                                        size='small'
                                                        sx={{
                                                            bgcolor: alpha(
                                                                BRAND_COLOR,
                                                                0.1,
                                                            ),
                                                            color: BRAND_DARK,
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>

                                            {/* OPTIONS */}

                                            {post.category && (
                                                <Box>
                                                    <Typography
                                                        variant='h6'
                                                        sx={{
                                                            fontWeight: 700,
                                                            mb: 1.5,
                                                        }}
                                                    >
                                                        {t(
                                                            'product.availableOptions',
                                                            'الخيارات المتاحة',
                                                        )}
                                                    </Typography>

                                                    <ColorsAndSizes
                                                        category={post.category}
                                                    />
                                                </Box>
                                            )}

                                            <Divider />

                                            {/* DESCRIPTION */}

                                            {/* ACTIONS */}

                                            <Stack spacing={1.5}>
                                                {!isOwner && (
                                                    <Button
                                                        fullWidth
                                                        variant='contained'
                                                        size='large'
                                                        startIcon={<Comment />}
                                                        onClick={
                                                            handleContactSeller
                                                        }
                                                        sx={{
                                                            py: 1.5,
                                                            background:
                                                                BRAND_GRADIENT,

                                                            '&:hover': {
                                                                opacity: 0.9,
                                                                transform:
                                                                    'translateY(-2px)',
                                                                boxShadow:
                                                                    '0 4px 20px rgba(184,134,11,0.3)',
                                                            },
                                                        }}
                                                    >
                                                        تواصل مع البائع
                                                    </Button>
                                                )}

                                                <Button
                                                    fullWidth
                                                    variant='outlined'
                                                    size='large'
                                                    startIcon={<Phone />}
                                                    href={`tel:${post.seller?.phone?.phone_1}`}
                                                    sx={{
                                                        py: 1.5,
                                                        borderColor:
                                                            BRAND_COLOR,
                                                        color: BRAND_DARK,

                                                        '&:hover': {
                                                            borderColor:
                                                                BRAND_DARK,
                                                            bgcolor: alpha(
                                                                BRAND_COLOR,
                                                                0.04,
                                                            ),
                                                        },
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
                                                    sx={{
                                                        py: 1.25,
                                                    }}
                                                >
                                                    {t('backOneStep')}
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Card>

                                    <PostSpecifications
                                        product={post}
                                        categoryLabel={categoryLabel}
                                        t={t}
                                    />
                                    <Box>
                                        <Typography
                                            variant='h6'
                                            fontWeight={800}
                                            mb={1}
                                        >
                                            {t('product.description', 'الوصف')}
                                        </Typography>

                                        <Typography
                                            color='text.secondary'
                                            sx={{
                                                lineHeight: 1.9,
                                            }}
                                        >
                                            {post.description ||
                                                t(
                                                    'product.noDescription',
                                                    'لا يوجد وصف متاح لهذا المنتج',
                                                )}
                                        </Typography>
                                    </Box>
                                    {/* =================================================
                                        REVIEWS
                                    ================================================= */}

                                    <Card
                                        sx={{
                                            ...sectionCardSx,
                                            p: {
                                                xs: 2.25,
                                                md: 3,
                                            },
                                            borderRadius: 3,
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

                                        {!post.reviews ||
                                        post.reviews.length === 0 ? (
                                            <Alert
                                                severity='info'
                                                sx={{
                                                    mb: 3,
                                                    borderRadius: 2,
                                                    bgcolor: alpha(
                                                        '#0288D1',
                                                        0.04,
                                                    ),
                                                }}
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
                                                {post.reviews.map(
                                                    (review, index) => {
                                                        const reviewUserName = [
                                                            review.user?.name
                                                                ?.first,
                                                            review.user?.name
                                                                ?.last,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(' ');
                                                        const isCurrentUser =
                                                            !!review.user
                                                                ?._id &&
                                                            !!auth?._id &&
                                                            String(
                                                                review.user._id,
                                                            ) ===
                                                                String(
                                                                    auth._id,
                                                                );

                                                        return (
                                                            <Card
                                                                key={index}
                                                                sx={{
                                                                    ...sectionCardSx,
                                                                    p: 2.5,
                                                                    display:
                                                                        'flex',
                                                                    gap: 2,
                                                                    alignItems:
                                                                        'flex-start',
                                                                    borderRadius: 2,
                                                                }}
                                                            >
                                                                <Avatar
                                                                    src={
                                                                        review
                                                                            .user
                                                                            ?.image
                                                                            ?.url ||
                                                                        '/user.png'
                                                                    }
                                                                    alt={
                                                                        [
                                                                            review
                                                                                .user
                                                                                ?.name
                                                                                ?.first,
                                                                            review
                                                                                .user
                                                                                ?.name
                                                                                ?.last,
                                                                        ]
                                                                            .filter(
                                                                                Boolean,
                                                                            )
                                                                            .join(
                                                                                ' ',
                                                                            ) ||
                                                                        'user'
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
                                                                        flexWrap='wrap'
                                                                        gap={
                                                                            0.5
                                                                        }
                                                                    >
                                                                        <Typography
                                                                            fontWeight={
                                                                                700
                                                                            }
                                                                        >
                                                                            {isCurrentUser
                                                                                ? t(
                                                                                      'you',
                                                                                  )
                                                                                : reviewUserName ||
                                                                                  'user'}
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
                                                                        value={Number(
                                                                            review.rating ||
                                                                                0,
                                                                        )}
                                                                        size='small'
                                                                        readOnly
                                                                        precision={
                                                                            0.5
                                                                        }
                                                                        sx={{
                                                                            mt: 0.5,
                                                                        }}
                                                                    />

                                                                    <Typography
                                                                        variant='body2'
                                                                        sx={{
                                                                            mt: 1,
                                                                            color: 'text.secondary',
                                                                            lineHeight: 1.7,
                                                                        }}
                                                                    >
                                                                        {
                                                                            review.comment
                                                                        }
                                                                    </Typography>
                                                                </Box>
                                                            </Card>
                                                        );
                                                    },
                                                )}
                                            </Box>
                                        )}

                                        {/* REVIEW FORM */}

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
                                                sx={{
                                                    '& .MuiOutlinedInput-root':
                                                        {
                                                            borderRadius: 2,
                                                            bgcolor: alpha(
                                                                '#000',
                                                                0.01,
                                                            ),
                                                        },
                                                }}
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
                                                        value={reviewRating}
                                                        onChange={(
                                                            _,
                                                            newValue,
                                                        ) =>
                                                            setReviewRating(
                                                                newValue ?? 0,
                                                            )
                                                        }
                                                        precision={0.5}
                                                        size='large'
                                                    />
                                                </Stack>

                                                <Button
                                                    variant='contained'
                                                    disabled={
                                                        !comment.trim() ||
                                                        !reviewRating ||
                                                        isSubmittingReview ||
                                                        !isLoggedIn
                                                    }
                                                    sx={{
                                                        background:
                                                            BRAND_GRADIENT,
                                                        px: 4,
                                                        py: 1.25,
                                                        fontWeight: 600,

                                                        '&:hover': {
                                                            opacity: 0.9,
                                                            transform:
                                                                'translateY(-1px)',
                                                        },

                                                        '&:disabled': {
                                                            opacity: 0.5,
                                                        },
                                                    }}
                                                    onClick={async () => {
                                                        if (!isLoggedIn) {
                                                            navigate(
                                                                path.Login,
                                                            );

                                                            return;
                                                        }

                                                        if (
                                                            !post._id ||
                                                            !auth?._id
                                                        ) {
                                                            showError(
                                                                'بيانات المستخدم أو المنتج غير متوفرة',
                                                            );

                                                            return;
                                                        }

                                                        setIsSubmittingReview(
                                                            true,
                                                        );

                                                        try {
                                                            const response =
                                                                await submitReview(
                                                                    post._id,
                                                                    {
                                                                        userId: auth._id,
                                                                        rating: reviewRating,
                                                                        comment:
                                                                            comment.trim(),
                                                                    },
                                                                );

                                                            if (
                                                                response &&
                                                                response.review
                                                            ) {
                                                                setPost(
                                                                    (
                                                                        prevPost,
                                                                    ) => {
                                                                        const oldReviews =
                                                                            prevPost.reviews ||
                                                                            [];

                                                                        const updatedReviews =
                                                                            [
                                                                                response.review,
                                                                                ...oldReviews,
                                                                            ];

                                                                        const calculatedRating =
                                                                            response.rating !==
                                                                                undefined &&
                                                                            response.rating !==
                                                                                null
                                                                                ? Number(
                                                                                      response.rating,
                                                                                  )
                                                                                : updatedReviews.length >
                                                                                    0
                                                                                  ? updatedReviews.reduce(
                                                                                        (
                                                                                            sum,
                                                                                            review,
                                                                                        ) =>
                                                                                            sum +
                                                                                            Number(
                                                                                                review.rating ||
                                                                                                    0,
                                                                                            ),
                                                                                        0,
                                                                                    ) /
                                                                                    updatedReviews.length
                                                                                  : 0;

                                                                        return {
                                                                            ...prevPost,

                                                                            reviews:
                                                                                updatedReviews,

                                                                            reviewCount:
                                                                                response.reviewCount !==
                                                                                    undefined &&
                                                                                response.reviewCount !==
                                                                                    null
                                                                                    ? Number(
                                                                                          response.reviewCount,
                                                                                      )
                                                                                    : updatedReviews.length,

                                                                            rating: calculatedRating,
                                                                        };
                                                                    },
                                                                );

                                                                setProductRating(
                                                                    (
                                                                        prevRating,
                                                                    ) =>
                                                                        response.rating !==
                                                                            undefined &&
                                                                        response.rating !==
                                                                            null
                                                                            ? Number(
                                                                                  response.rating,
                                                                              )
                                                                            : prevRating,
                                                                );

                                                                setComment('');

                                                                setReviewRating(
                                                                    0,
                                                                );

                                                                showSuccess(
                                                                    t(
                                                                        'review.submitted',
                                                                    ),
                                                                );
                                                            }
                                                        } catch (submitError) {
                                                            console.error(
                                                                'Submit review error:',
                                                                submitError,
                                                            );

                                                            showError(
                                                                t(
                                                                    'review.submitError',
                                                                ) ||
                                                                    'حدث خطأ أثناء نشر التقييم',
                                                            );
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
                                                          ) || 'جارٍ النشر...'
                                                        : t('review.publish') ||
                                                          'نشر التعليق'}
                                                </Button>
                                            </Stack>

                                            {!isLoggedIn && (
                                                <Alert
                                                    severity='warning'
                                                    sx={{
                                                        mt: 1,
                                                        borderRadius: 2,
                                                        bgcolor: alpha(
                                                            '#ED6C02',
                                                            0.04,
                                                        ),
                                                    }}
                                                >
                                                    {t('review.loginToReview')}
                                                </Alert>
                                            )}
                                        </Stack>
                                    </Card>
                                </Stack>
                            </Grid>

                            {/* =================================================
                                RIGHT
                            ================================================= */}

                            <Grid
                                size={{
                                    xs: 12,
                                    lg: 5,
                                }}
                            >
                                <Stack
                                    spacing={3}
                                    sx={{
                                        position: {
                                            lg: 'sticky',
                                        },
                                        top: {
                                            lg: 24,
                                        },
                                    }}
                                >
                                    {/* SELLER CARD */}

                                    <Card
                                        sx={{
                                            ...sectionCardSx,
                                            p: 3,
                                            borderRadius: 3,
                                        }}
                                    >
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
                                                        borderColor:
                                                            BRAND_COLOR,
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

                                            <Box
                                                sx={{
                                                    px: 1.5,
                                                    py: 1,
                                                    borderRadius: 2,
                                                    bgcolor: alpha(
                                                        BRAND_COLOR,
                                                        0.06,
                                                    ),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <VerifiedRounded
                                                    sx={{
                                                        color: BRAND_COLOR,
                                                        fontSize: 20,
                                                    }}
                                                />

                                                <Typography
                                                    variant='body2'
                                                    sx={{
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    بائع موثوق • رد سريع
                                                </Typography>
                                            </Box>

                                            <Button
                                                fullWidth
                                                variant='text'
                                                startIcon={<ShareIcon />}
                                                onClick={handleShare}
                                                disabled={isSharing}
                                                sx={{
                                                    color: 'text.secondary',

                                                    '&:hover': {
                                                        color: BRAND_COLOR,
                                                        bgcolor: alpha(
                                                            BRAND_COLOR,
                                                            0.04,
                                                        ),
                                                    },
                                                }}
                                            >
                                                شارك المنتج
                                            </Button>
                                        </Stack>
                                    </Card>
                                </Stack>
                            </Grid>
                        </Grid>

                        {/* =================================================
                            RELATED PRODUCTS
                        ================================================= */}

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

                                        scrollBehavior: 'smooth',
                                    }}
                                >
                                    {relatedProducts.map((product) => (
                                        <Box
                                            key={product._id}
                                            sx={{
                                                minWidth: {
                                                    xs: 200,
                                                    sm: 260,
                                                },
                                            }}
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

            {/* =========================================================
                DELETE MODAL
            ========================================================= */}

            <AlertDialogs
                handleDelete={handleDeletePost}
                onHide={() => setShowDeleteModal(false)}
                show={showDeleteModal}
                title={`حذف ${post.product_name}`}
                description={`هل أنت متأكد من حذف المنتج "${post.product_name}"؟`}
            />

            {/* =========================================================
                UPDATE MODAL
            ========================================================= */}

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
