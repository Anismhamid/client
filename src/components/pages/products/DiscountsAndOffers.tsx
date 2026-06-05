import {
    FunctionComponent,
    useEffect,
    useState,
    useCallback,
    useMemo,
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
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBack from '@mui/icons-material/ArrowBack';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { getPostsInDiscount } from '../../../services/postsServices';
import JsonLd from '../../../../utils/JsonLd';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import { generateDiscountsJsonLd } from '../../../../utils/structuredData';
import { path, productsPathes } from '../../../routes/routes';
import { Posts } from '../../../interfaces/Posts';
import handleRTL from '../../../locales/handleRTL';

const calculateDiscountedPrice = (price: number, discount: number): number => {
    return price - (price * discount) / 100;
};

const DiscountsAndOffers: FunctionComponent = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const [postsInDiscount, setPostsInDiscount] = useState<Posts[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

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
        if (isMobile) return 1;
        if (isTablet) return 2;
        return 3;
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

    const dir = handleRTL();

    const productsList = generateDiscountsJsonLd(postsInDiscount);
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
                    py: { xs: 4, sm: 6, md: 8 },
                }}
                dir={dir}
            >
                <Container maxWidth='lg'>
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: { xs: 3, md: 5 },
                            gap: { xs: 2, sm: 0 },
                        }}
                    >
                        <Box>
                            <Typography
                                variant={isMobile ? 'h5' : 'h4'}
                                component='h2'
                                fontWeight={700}
                                sx={{ mt: 0.5 }}
                            >
                                {t(
                                    'categories.discountsAndOffers.categories.discountsAndOffers.title',
                                )}
                            </Typography>
                            <Typography
                                variant='body2'
                                color='text.secondary'
                                sx={{ mt: 1, maxWidth: 500 }}
                            >
                                {t(
                                    'categories.discountsAndOffers.categories.discountsAndOffers.description',
                                )}
                            </Typography>
                        </Box>
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
                            {[...Array(slidesPerView)].map((_, index) => (
                                <Box key={index}>
                                    <Skeleton
                                        variant='rounded'
                                        height={200}
                                        sx={{ mb: 2 }}
                                    />
                                    <Skeleton variant='text' width='70%' />
                                    <Skeleton variant='text' width='50%' />
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                '& .swiper': {
                                    pb: { xs: 5, md: 2 },
                                },
                                '& .swiper-button-prev, & .swiper-button-next':
                                    {
                                        color: 'text.primary',
                                        bgcolor: 'background.paper',
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        boxShadow: 2,
                                        '&::after': {
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                        },
                                        '&:hover': {
                                            bgcolor: 'grey.100',
                                        },
                                    },
                                '& .swiper-pagination-bullet-active': {
                                    bgcolor: 'primary.main',
                                },
                            }}
                        >
                            <Swiper
                                modules={[Autoplay, Navigation, Pagination]}
                                autoplay={{
                                    delay: 1000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                loop={postsInDiscount.length > slidesPerView}
                                navigation={!isMobile}
                                pagination={ true 
                                }
                                spaceBetween={24}
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
                                    const productUrl = `${productsPathes.postsDetails}/${product.category}/${product.brand || decodeURI(product.product_name)}/${product._id}`;

                                    return (
                                        <SwiperSlide key={product._id}>
                                            <Link
                                                to={productUrl}
                                                component={RouterLink}
                                                style={{
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                }}
                                            >
                                                <Box
                                                    component='article'
                                                    sx={{
                                                        borderRadius: 2,
                                                        overflow: 'hidden',
                                                        bgcolor:
                                                            'background.paper',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        transition:
                                                            'box-shadow 0.3s ease, transform 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: 4,
                                                            transform:
                                                                'translateY(-4px)',
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
                                                            bgcolor: 'grey.100',
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
                                                                    'opacity 0.3s ease',
                                                            }}
                                                        />

                                                        {/* Discount Badge */}
                                                        <Box
                                                            sx={{
                                                                position:
                                                                    'absolute',
                                                                top: 12,
                                                                left: 12,
                                                                bgcolor:
                                                                    'error.main',
                                                                color: '#fff',
                                                                px: 1.5,
                                                                py: 0.5,
                                                                borderRadius: 1,
                                                                fontSize:
                                                                    '0.8rem',
                                                                fontWeight: 700,
                                                                zIndex: 2,
                                                            }}
                                                        >
                                                            -{product.discount}%
                                                        </Box>
                                                    </Box>

                                                    {/* Content */}
                                                    <Box sx={{ p: 2 }}>
                                                        <Typography
                                                            variant='subtitle2'
                                                            sx={{
                                                                fontWeight: 600,
                                                                mb: 0.5,
                                                                display:
                                                                    '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient:
                                                                    'vertical',
                                                                overflow:
                                                                    'hidden',
                                                            }}
                                                        >
                                                            {
                                                                product.product_name
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            variant='caption'
                                                            color='text.secondary'
                                                            sx={{
                                                                mb: 1.5,
                                                                display:
                                                                    'block',
                                                            }}
                                                        >
                                                            {product.category}
                                                        </Typography>

                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant='h6'
                                                                fontWeight={700}
                                                                color='error.main'
                                                                sx={{
                                                                    fontSize:
                                                                        '1.1rem',
                                                                }}
                                                            >
                                                                {formatPrice(
                                                                    discountedPrice,
                                                                )}
                                                            </Typography>
                                                            <Typography
                                                                variant='body2'
                                                                color='text.disabled'
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
                        </Box>
                    )}
                    {postsInDiscount && (
                        <Box textAlign='center' mt={2}>
                            <Link
                                component={RouterLink}
                                to={path.DiscountsAndOffers}
                                underline='none'
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                }}
                            >
                                {t(
                                    'categories.discountsAndOffers.common.viewAll',
                                ) || 'View All Offers'}
                                {dir === 'ltr' ? (
                                    <ArrowForwardIcon
                                        sx={{ fontSize: '1.1rem' }}
                                    />
                                ) : (
                                    <ArrowBack sx={{ fontSize: '1.1rem' }} />
                                )}
                            </Link>
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default DiscountsAndOffers;
