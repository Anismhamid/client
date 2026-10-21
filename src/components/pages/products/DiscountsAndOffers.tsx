import {
    FunctionComponent,
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    Skeleton,
    Link,
    Container,
    Chip,
    IconButton,
    Stack,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getPostsInDiscount } from '../../../services/postsServices';
import JsonLd from '../../../../utils/JsonLd';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import { generateDiscountsJsonLd } from '../../../../utils/structuredData';
import { path } from '../../../routes/routes';
import { Posts } from '../../../interfaces/Posts';
import handleRTL from '../../../locales/handleRTL';
import { getAbsolutePostUrl, getPostUrl } from './helpers/postUrl';

const calculateDiscountedPrice = (price: number, discount: number): number => {
    return price - (price * discount) / 100;
};

const DiscountsAndOffers: FunctionComponent = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const dir = handleRTL();

    const [postsInDiscount, setPostsInDiscount] = useState<Posts[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    // Ref to control Swiper manually
    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getPostsInDiscount();
                if (isMounted) setPostsInDiscount(data);
            } catch (err) {
                console.error('Failed to fetch discounted products:', err);
                if (isMounted) {
                    setError(
                        t('common.errors.fetchFailed') ||
                            'Failed to load products',
                    );
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchPosts();
        return () => {
            isMounted = false;
        };
    }, [t]);

    const setImageLoaded = useCallback((id: string) => {
        setLoadedImages((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    }, []);

    const slidesPerView = useMemo(() => {
        if (isMobile) return 1.15;
        if (isTablet) return 2.15;
        return 3.15;
    }, [isMobile, isTablet]);

    if (error) {
        return (
            <Container maxWidth='lg'>
                <Box
                    component='section'
                    textAlign='center'
                    py={{ xs: 6, md: 8 }}
                >
                    <Typography color='error' variant='h6'>
                        {error}
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (postsInDiscount.length === 0 && !loading) {
        return null;
    }

    const productsList = generateDiscountsJsonLd(
        postsInDiscount,
        getAbsolutePostUrl,
    );
    const currentUrl = 'https://client-qqq1.vercel.app/discounts-and-offers';
    return (
        <>
            <JsonLd data={productsList} />
            <link rel='canonical' href={currentUrl} />

            <title>
                {t(
                    `categories.discountsAndOffers.categories.discountsAndOffers.title`,
                )}{' '}
                | صفقة
            </title>
            <meta
                name='description'
                content={t(
                    `categories.discountsAndOffers.categories.discountsAndOffers.title`,
                )}
            />

            <Box
                component='section'
                sx={{
                    py: { xs: 5, sm: 7, md: 9 },
                    bgcolor: '#f4f6f8',
                }}
                dir={dir}
            >
                <Container maxWidth='lg'>
                    {/* Header - Organized Layout with Navigation Buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'flex-end' },
                            mb: { xs: 4, md: 6 },
                            gap: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            pb: 3,
                        }}
                    >
                        {/* Title & Description */}
                        <Box sx={{ maxWidth: 600 }}>
                            <Typography
                                variant={isMobile ? 'h5' : 'h4'}
                                component='h2'
                                fontWeight={800}
                                sx={{
                                    color: 'text.primary',
                                    mb: 1,
                                }}
                            >
                                {t(
                                    'categories.discountsAndOffers.categories.discountsAndOffers.title',
                                )}
                            </Typography>
                            <Typography
                                variant='body1'
                                color='text.secondary'
                                sx={{ lineHeight: 1.6 }}
                            >
                                {t(
                                    'categories.discountsAndOffers.categories.discountsAndOffers.description',
                                )}
                            </Typography>
                        </Box>

                        {/* Controls: View All + Navigation Arrows */}
                        <Stack
                            direction='row'
                            alignItems='center'
                            spacing={2}
                            sx={{
                                width: { xs: '100%', sm: 'auto' },
                                justifyContent: 'space-between',
                            }}
                        >
                            <Link
                                component={RouterLink}
                                to={path.DiscountsAndOffers}
                                underline='none'
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: 'primary.main',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    whiteSpace: 'nowrap',
                                    '&:hover .arrow-icon': {
                                        transform:
                                            dir === 'ltr'
                                                ? 'translateX(4px)'
                                                : 'translateX(-4px)',
                                    },
                                }}
                            >
                                {t(
                                    'categories.discountsAndOffers.common.viewAll',
                                ) || 'View All Offers'}
                                {dir === 'ltr' ? (
                                    <ArrowForwardIcon
                                        className='arrow-icon'
                                        sx={{
                                            fontSize: '1.2rem',
                                            transition: 'transform 0.2s ease',
                                        }}
                                    />
                                ) : (
                                    <ArrowBackIcon
                                        className='arrow-icon'
                                        sx={{
                                            fontSize: '1.2rem',
                                            transition: 'transform 0.2s ease',
                                        }}
                                    />
                                )}
                            </Link>
                        </Stack>
                    </Box>

                    {/* Content */}
                    {loading ? (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                },
                                gap: 3,
                            }}
                        >
                            {[...Array(3)].map((_, index) => (
                                <Box key={index}>
                                    <Skeleton
                                        variant='rounded'
                                        height={220}
                                        sx={{ mb: 2, borderRadius: 2 }}
                                    />
                                    <Skeleton
                                        variant='text'
                                        width='80%'
                                        height={32}
                                    />
                                    <Skeleton variant='text' width='60%' />
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                '& .swiper': {
                                    pb: { xs: 6, md: 4 },
                                    px: 0.5,
                                },
                                '& .swiper-slide': {
                                    height: 'auto',
                                    display: 'flex',
                                },
                                // Hide default Swiper arrows since we use custom ones
                                '& .swiper-button-prev, & .swiper-button-next':
                                    {
                                        display: 'none',
                                    },
                                '& .swiper-pagination-bullet': {
                                    bgcolor: 'text.secondary',
                                    opacity: 0.3,
                                    width: 8,
                                    height: 8,
                                    transition: 'all 0.2s ease',
                                },
                                '& .swiper-pagination-bullet-active': {
                                    bgcolor: 'primary.main',
                                    opacity: 1,
                                    width: 24,
                                    borderRadius: 4,
                                },
                            }}
                        >
                            <Swiper
                                onSwiper={(swiper) => {
                                    swiperRef.current = swiper;
                                }}
                                modules={[Autoplay, Navigation, Pagination]}
                                autoplay={{
                                    delay: 4500,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                loop={postsInDiscount.length > slidesPerView}
                                navigation={false} // Disabled default navigation
                                pagination={{ clickable: true }}
                                spaceBetween={16}
                                slidesPerView={slidesPerView}
                                grabCursor={true}
                            >
                                {postsInDiscount.map((product) => {
                                    const isLoaded = loadedImages.has(
                                        product._id as string,
                                    );
                                    const discountedPrice =
                                        calculateDiscountedPrice(
                                            product.price,
                                            product.discount,
                                        );

                                    const productUrl = getPostUrl({
                                        _id: product._id,
                                        product_name: product.product_name,
                                        category: product.category,
                                        seller: product.seller,
                                    });

                                    return (
                                        <SwiperSlide key={product._id}>
                                            <Link
                                                to={productUrl}
                                                component={RouterLink}
                                                style={{
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    display: 'flex',
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                            >
                                                <Box
                                                    component='article'
                                                    sx={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        borderRadius: 2,
                                                        bgcolor:
                                                            'background.paper',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        transition:
                                                            'box-shadow 0.2s ease, transform 0.2s ease',
                                                        '&:hover': {
                                                            boxShadow: 6,
                                                            transform:
                                                                'translateY(-4px)',
                                                            '& .product-image':
                                                                {
                                                                    transform:
                                                                        'scale(1.05)',
                                                                },
                                                            '& .view-btn': {
                                                                opacity: 1,
                                                                transform:
                                                                    'translateY(0)',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {/* Image Container */}
                                                    <Box
                                                        sx={{
                                                            position:
                                                                'relative',
                                                            pt: '75%',
                                                            overflow: 'hidden',
                                                            bgcolor: 'grey.50',
                                                            borderTopLeftRadius: 8,
                                                            borderTopRightRadius: 8,
                                                        }}
                                                    >
                                                        {!isLoaded && (
                                                            <Skeleton
                                                                variant='rectangular'
                                                                sx={{
                                                                    position:
                                                                        'absolute',
                                                                    inset: 0,
                                                                }}
                                                            />
                                                        )}
                                                        <img
                                                            src={
                                                                product.image
                                                                    ?.url
                                                            }
                                                            alt={
                                                                product.product_name
                                                            }
                                                            className='product-image'
                                                            onLoad={() =>
                                                                setImageLoaded(
                                                                    product._id as string,
                                                                )
                                                            }
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                inset: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit:
                                                                    'cover',
                                                                opacity:
                                                                    isLoaded
                                                                        ? 1
                                                                        : 0,
                                                                transition:
                                                                    'opacity 0.3s ease, transform 0.3s ease',
                                                            }}
                                                        />

                                                        {/* Discount Badge */}
                                                        <Chip
                                                            label={`-${product.discount}%`}
                                                            size='small'
                                                            sx={{
                                                                position:
                                                                    'absolute',
                                                                top: 10,
                                                                left: 10,
                                                                bgcolor:
                                                                    'error.main',
                                                                color: '#fff',
                                                                fontWeight: 700,
                                                                fontSize:
                                                                    '0.75rem',
                                                                borderRadius: 1,
                                                                zIndex: 2,
                                                            }}
                                                        />

                                                        {/* Hover View Button */}
                                                        <Box
                                                            className='view-btn'
                                                            sx={{
                                                                position:
                                                                    'absolute',
                                                                bottom: 10,
                                                                left: '50%',
                                                                transform:
                                                                    'translate(-50%, 10px)',
                                                                opacity: 0,
                                                                transition:
                                                                    'all 0.2s ease',
                                                                bgcolor:
                                                                    'rgba(255,255,255,0.95)',
                                                                color: 'text.primary',
                                                                px: 1.5,
                                                                py: 0.5,
                                                                borderRadius: 16,
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                gap: 0.5,
                                                                fontSize:
                                                                    '0.75rem',
                                                                fontWeight: 600,
                                                                boxShadow: 1,
                                                            }}
                                                        >
                                                            <VisibilityIcon
                                                                sx={{
                                                                    fontSize: 14,
                                                                }}
                                                            />
                                                            {t(
                                                                'pages.messageAuditLogs.viewDetails',
                                                            ) || 'عرض'}
                                                        </Box>
                                                    </Box>

                                                    {/* Content Container */}
                                                    <Box
                                                        sx={{
                                                            p: 2,
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            flexGrow: 1,
                                                        }}
                                                    >
                                                        {/* Title */}
                                                        <Typography
                                                            variant='subtitle2'
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: 'text.primary',
                                                                lineHeight: 1.4,
                                                                display:
                                                                    '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient:
                                                                    'vertical',
                                                                overflow:
                                                                    'hidden',
                                                                minHeight:
                                                                    '2.8em',
                                                                mb: 1,
                                                            }}
                                                        >
                                                            {
                                                                product.product_name
                                                            }
                                                        </Typography>

                                                        {/* Category */}
                                                        <Typography
                                                            variant='caption'
                                                            sx={{
                                                                color: 'text.secondary',
                                                                mb: 2,
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                gap: 0.5,
                                                            }}
                                                        >
                                                            <Box
                                                                component='span'
                                                                sx={{
                                                                    width: 4,
                                                                    height: 4,
                                                                    borderRadius:
                                                                        '50%',
                                                                    bgcolor:
                                                                        'text.disabled',
                                                                }}
                                                            />
                                                            {product.category}
                                                        </Typography>

                                                        {/* Price Row */}
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems:
                                                                    'baseline',
                                                                gap: 1,
                                                                mt: 'auto',
                                                                pt: 1,
                                                                borderTop:
                                                                    '1px dashed',
                                                                borderColor:
                                                                    'divider',
                                                            }}
                                                        >
                                                            <Typography
                                                                variant='subtitle1'
                                                                fontWeight={800}
                                                                color='error.main'
                                                                sx={{
                                                                    lineHeight: 1,
                                                                }}
                                                            >
                                                                {formatPrice(
                                                                    discountedPrice,
                                                                )}
                                                            </Typography>
                                                            <Typography
                                                                variant='caption'
                                                                color='text.secondary'
                                                                sx={{
                                                                    textDecoration:
                                                                        'line-through',
                                                                }}
                                                            >
                                                                {formatPrice(
                                                                    product.price,
                                                                )}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Link>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            {/* Custom Navigation Buttons */}
                            {!isMobile && (
                                <Stack
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-around',
                                    }}
                                    direction='row'
                                    spacing={1}
                                >
                                    <IconButton
                                        onClick={() =>
                                            swiperRef.current?.slideNext()
                                        }
                                        sx={{
                                            bgcolor: 'background.paper',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            color: 'text.primary',
                                            width: 40,
                                            height: 40,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                borderColor: 'primary.main',
                                            },
                                        }}
                                    >
                                        {dir === 'rtl' ? (
                                            <ChevronRightIcon />
                                        ) : (
                                            <ChevronLeftIcon />
                                        )}
                                    </IconButton>
                                    <IconButton
                                        onClick={() =>
                                            swiperRef.current?.slidePrev()
                                        }
                                        sx={{
                                            bgcolor: 'background.paper',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            color: 'text.primary',
                                            width: 40,
                                            height: 40,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                borderColor: 'primary.main',
                                            },
                                        }}
                                    >
                                        {dir === 'rtl' ? (
                                            <ChevronLeftIcon />
                                        ) : (
                                            <ChevronRightIcon />
                                        )}
                                    </IconButton>
                                </Stack>
                            )}
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default DiscountsAndOffers;

