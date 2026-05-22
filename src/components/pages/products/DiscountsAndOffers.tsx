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
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

import { getPostsInDiscount } from '../../../services/postsServices';
import JsonLd from '../../../../utils/JsonLd';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import { generateDiscountsJsonLd } from '../../../../utils/structuredData';
import { path } from '../../../routes/routes';
import { Posts } from '../../../interfaces/Posts';

interface SwiperParams {
    slidesPerView: number;
    spaceBetween: number;
    effect: 'slide' | 'coverflow';
}

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

    const swiperParams = useMemo<SwiperParams>(() => {
        if (isMobile)
            return { slidesPerView: 1, spaceBetween: 16, effect: 'slide' };
        if (isTablet)
            return { slidesPerView: 2, spaceBetween: 24, effect: 'coverflow' };
        return { slidesPerView: 3, spaceBetween: 32, effect: 'coverflow' };
    }, [isMobile, isTablet]);

    if (error) {
        return (
            <Box
                component='section'
                aria-labelledby='discounts-heading'
                textAlign='center'
                py={8}
            >
                <Typography color='error' variant='h6'>
                    {error}
                </Typography>
            </Box>
        );
    }

    if (postsInDiscount.length === 0 && !loading) {
        return null;
    }

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
                    py: 8,
                    px: 3,
                    borderRadius: '40px',
                    background: `
        linear-gradient(
        135deg,
        ${theme.palette.primary.dark}15,
        ${theme.palette.secondary.main}10
        )`,
                }}
            >
                {/* Header Section */}
                <Box
                    textAlign='center'
                    mb={{ xs: 5, md: 8 }}
                    sx={{ maxWidth: '700px', mx: 'auto' }}
                >
                    <Typography
                        variant='h3'
                        component='h1'
                        fontWeight='900'
                        sx={{
                            background:
                                'linear-gradient(90deg,#7b61ff,#00c6ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        🔥{' '}
                        {t(
                            'categories.discountsAndOffers.categories.discountsAndOffers.title',
                        )}
                    </Typography>

                    <Typography
                        variant='body1'
                        color='text.secondary'
                        sx={{
                            fontSize: { xs: '0.95rem', md: '1.1rem' },
                            lineHeight: 1.7,
                            mb: 1,
                            opacity: 0.9,
                        }}
                    >
                        {t(
                            'categories.discountsAndOffers.categories.discountsAndOffers.description',
                        )}
                    </Typography>

                    <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ opacity: 0.6, fontWeight: 500 }}
                    >
                        {t(
                            'categories.discountsAndOffers.categories.discountsAndOffers.subtitle',
                        )}
                    </Typography>
                </Box>

                {/* Loading Skeleton Mode */}
                {loading ? (
                    <Box sx={{ display: 'flex', gap: 3, overflow: 'hidden' }}>
                        {[...Array(isMobile ? 1 : isTablet ? 2 : 3)].map(
                            (_, index) => (
                                <Box key={index} sx={{ flex: 1, minWidth: 0 }}>
                                    <Skeleton
                                        variant='rectangular'
                                        height={240}
                                        sx={{ borderRadius: 3, mb: 2 }}
                                    />
                                    <Skeleton
                                        variant='text'
                                        width='80%'
                                        height={28}
                                        sx={{ mb: 1 }}
                                    />
                                    <Skeleton
                                        variant='text'
                                        width='40%'
                                        height={20}
                                    />
                                </Box>
                            ),
                        )}
                    </Box>
                ) : (
                    /* Products Slider */
                    <Box
                        sx={{
                            position: 'relative',
                            '& .swiper-button-prev, & .swiper-button-next': {
                                color: 'primary.main',
                                bgcolor: 'background.paper',
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                boxShadow: 2,
                                '&::after': {
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                },
                            },
                        }}
                    >
                        <Swiper
                            modules={[Autoplay, Navigation, EffectCoverflow]}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            loop={postsInDiscount.length > 1}
                            navigation={!isMobile}
                            centeredSlides={true}
                            grabCursor={true}
                            {...swiperParams}
                            coverflowEffect={
                                swiperParams.effect === 'coverflow'
                                    ? {
                                          rotate: 5,
                                          stretch: 0,
                                          depth: 60,
                                          modifier: 1.5,
                                          slideShadows: false,
                                      }
                                    : undefined
                            }
                            aria-label={
                                t('categories.discountsAndOffers.ariaLabel') ||
                                'Discounted products carousel'
                            }
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
                                const productUrl = `/category/${product.category.toLowerCase()}/${product._id}`;

                                return (
                                    <SwiperSlide key={product._id}>
                                        <Link
                                            to={productUrl}
                                            component={RouterLink}
                                            style={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                display: 'block',
                                                height: '100%',
                                            }}
                                        >
                                            <Box
                                                component='article'
                                                sx={{
                                                    position: 'relative',
                                                    height: 420,
                                                    borderRadius: '28px',
                                                    overflow: 'hidden',
                                                    background: `linear-gradient(180deg,rgba(0,0,0,0) 20%,rgba(0,0,0,.75) 100%)`,
                                                    boxShadow:
                                                        '0 20px 60px rgba(0,0,0,.12)',
                                                    transition: '.5s',
                                                    cursor: 'pointer',

                                                    '&:hover': {
                                                        transform:
                                                            'translateY(-12px) scale(1.02)',
                                                    },

                                                    '&:hover img': {
                                                        transform: 'scale(1.1)',
                                                    },
                                                }}
                                            >
                                                {/* image */}

                                                {!isLoaded && (
                                                    <Skeleton
                                                        variant='rectangular'
                                                        width='100%'
                                                        height='100%'
                                                    />
                                                )}

                                                <img
                                                    src={product.image?.url}
                                                    alt={product.product_name}
                                                    onLoad={() =>
                                                        setImageLoaded(
                                                            product._id as string,
                                                        )
                                                    }
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        position: 'absolute',
                                                        inset: 0,
                                                        transition: '1s',
                                                    }}
                                                />

                                                {/* overlay */}

                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background: `
                    linear-gradient(
                    to top,
                    rgba(0,0,0,.95),
                    rgba(0,0,0,.2),
                    transparent
                    )`,
                                                    }}
                                                />

                                                {/* discount */}

                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 18,
                                                        right: 18,
                                                        backdropFilter:
                                                            'blur(20px)',
                                                        bgcolor:
                                                            'rgba(255,0,0,.85)',
                                                        color: '#fff',
                                                        fontWeight: 700,
                                                        px: 2,
                                                        py: 0.7,
                                                        borderRadius: '30px',
                                                        fontSize: '.9rem',
                                                        zIndex: 10,
                                                    }}
                                                >
                                                    🔥 {product.discount}% OFF
                                                </Box>

                                                {/* bottom content */}

                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        width: '100%',
                                                        p: 3,
                                                        color: '#fff',
                                                        zIndex: 3,
                                                    }}
                                                >
                                                    <Typography
                                                        variant='h6'
                                                        sx={{
                                                            fontWeight: 700,
                                                            mb: 0.5,
                                                            display:
                                                                '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient:
                                                                'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {product.product_name}
                                                    </Typography>

                                                    <Typography
                                                        variant='body2'
                                                        sx={{
                                                            opacity: 0.7,
                                                            mb: 2,
                                                        }}
                                                    >
                                                        {product.category}
                                                    </Typography>

                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        gap={1}
                                                    >
                                                        <Typography
                                                            variant='h5'
                                                            fontWeight='bold'
                                                        >
                                                            {formatPrice(
                                                                discountedPrice,
                                                            )}
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                textDecoration:
                                                                    'line-through',
                                                                opacity: 0.6,
                                                            }}
                                                        >
                                                            {formatPrice(
                                                                product.price,
                                                            )}
                                                        </Typography>
                                                    </Box>

                                                    <Typography
                                                        mt={1}
                                                        sx={{
                                                            color: '#00e676',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Save{' '}
                                                        {formatPrice(
                                                            product.price -
                                                                discountedPrice,
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Link>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </Box>
                )}

                {/* View All Redirect CTA */}
                {postsInDiscount.length > 3 && (
                    <Link
                        component={RouterLink}
                        underline='none'
                        color='inherit'
                        to={path.DiscountsAndOffers}
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            fontWeight: 700,
                            color: 'primary.main',
                            transition: 'gap .2s ease',
                            '&:hover': {
                                gap: 1.5,
                            },
                        }}
                    >
                        {' '}
                        <Box textAlign='center' mt={6}>
                            {t(
                                'categories.discountsAndOffers.categories.viewAll',
                            ) || 'View All Offers'}
                            <ArrowForwardIcon sx={{ fontSize: '1.1rem' }} />
                        </Box>{' '}
                    </Link>
                )}
            </Box>
        </>
    );
};

export default DiscountsAndOffers;
