import {
    FunctionComponent,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    alpha,
    Box,
    Chip,
    Container,
    IconButton,
    Link,
    Skeleton,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { getPostsInDiscount } from '../../../services/postsServices';
import JsonLd from '../../../../utils/JsonLd';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import { generateDiscountsJsonLd } from '../../../../utils/structuredData';
import { path } from '../../../routes/routes';
import { Posts } from '../../../interfaces/Posts';
import handleRTL from '../../../locales/handleRTL';
import { getAbsolutePostUrl, getPostUrl } from './helpers/postUrl';

const calculateDiscountedPrice = (price: number, discount: number): number =>
    price - (price * discount) / 100;

/* ---------------------------------- Card ---------------------------------- */

interface ProductCardProps {
    product: Posts;
    viewLabel: string;
}

const ProductCard = memo(({ product, viewLabel }: ProductCardProps) => {
    const [imgLoaded, setImgLoaded] = useState(false);

    const discountedPrice = calculateDiscountedPrice(
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
        <Link
            component={RouterLink}
            to={productUrl}
            underline='none'
            color='inherit'
            sx={{
                display: 'flex',
                width: '100%',
                height: '100%',
                borderRadius: 3,
                outline: 'none',
                '&:focus-visible': {
                    boxShadow: (t) => `0 0 0 3px ${t.palette.primary.main}`,
                },
            }}
        >
            <Box
                component='article'
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'box-shadow .25s ease, transform .25s ease',
                    '@media (hover: hover)': {
                        '&:hover': {
                            boxShadow: 6,
                            transform: 'translateY(-4px)',
                            '& .product-image': { transform: 'scale(1.06)' },
                            '& .view-btn': {
                                opacity: 1,
                                transform: 'translate(-50%, 0)',
                            },
                        },
                    },
                }}
            >
                {/* Image */}
                <Box
                    sx={{
                        position: 'relative',
                        aspectRatio: '4 / 3',
                        overflow: 'hidden',
                        bgcolor: 'action.hover',
                    }}
                >
                    {!imgLoaded && (
                        <Skeleton
                            variant='rectangular'
                            animation='wave'
                            sx={{ position: 'absolute', inset: 0 }}
                        />
                    )}
                    <Box
                        component='img'
                        className='product-image'
                        src={product.image?.url}
                        alt={product.product_name}
                        loading='lazy'
                        decoding='async'
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgLoaded(true)}
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: imgLoaded ? 1 : 0,
                            transition: 'opacity .3s ease, transform .4s ease',
                        }}
                    />

                    <Chip
                        label={`-${product.discount}%`}
                        size='small'
                        color='error'
                        sx={{
                            position: 'absolute',
                            top: 10,
                            insetInlineStart: 10,
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            borderRadius: 1.5,
                            zIndex: 2,
                            boxShadow: 2,
                        }}
                    />

                    {/* Hover pill (desktop only) */}
                    <Box
                        className='view-btn'
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            position: 'absolute',
                            bottom: 12,
                            left: '50%',
                            transform: 'translate(-50%, 10px)',
                            opacity: 0,
                            transition: 'all .25s ease',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 99,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'text.primary',
                            bgcolor: (t) =>
                                alpha(t.palette.background.paper, 0.92),
                            backdropFilter: 'blur(6px)',
                            boxShadow: 1,
                            zIndex: 2,
                        }}
                    >
                        <VisibilityIcon sx={{ fontSize: 14 }} />
                        {viewLabel}
                    </Box>
                </Box>

                {/* Content */}
                <Box
                    sx={{
                        p: { xs: 1.75, md: 2 },
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        gap: 0.75,
                    }}
                >
                    <Typography
                        variant='subtitle2'
                        component='h3'
                        sx={{
                            fontWeight: 700,
                            lineHeight: 1.45,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.9em',
                        }}
                    >
                        {product.product_name}
                    </Typography>

                    <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                        }}
                    >
                        <Box
                            component='span'
                            sx={{
                                width: 5,
                                height: 5,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                flexShrink: 0,
                            }}
                        />
                        {product.category}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            flexWrap: 'wrap',
                            columnGap: 1,
                            mt: 'auto',
                            pt: 1.25,
                            borderTop: '1px dashed',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography
                            component='span'
                            variant='h6'
                            color='error.main'
                            fontWeight={800}
                            sx={{ lineHeight: 1.2 }}
                        >
                            {formatPrice(discountedPrice)}
                        </Typography>
                        <Typography
                            component='span'
                            variant='caption'
                            color='text.secondary'
                            sx={{ textDecoration: 'line-through' }}
                        >
                            {formatPrice(product.price)}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Link>
    );
});
ProductCard.displayName = 'ProductCard';

/* -------------------------------- Skeleton -------------------------------- */

const SkeletonCard = () => (
    <Box
        sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
        }}
    >
        <Skeleton
            variant='rectangular'
            animation='wave'
            sx={{ aspectRatio: '4 / 3', height: 'auto', width: '100%' }}
        />
        <Box sx={{ p: 2 }}>
            <Skeleton variant='text' width='90%' height={26} />
            <Skeleton variant='text' width='50%' height={20} />
            <Skeleton variant='text' width='40%' height={32} sx={{ mt: 1 }} />
        </Box>
    </Box>
);

/* ------------------------------- Component -------------------------------- */

const DiscountsAndOffers: FunctionComponent = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const dir = handleRTL();
    const isRtl = dir === 'rtl';

    const [postsInDiscount, setPostsInDiscount] = useState<Posts[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), []);
    const handleNext = useCallback(() => swiperRef.current?.slideNext(), []);

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

    if (postsInDiscount.length === 0 && !loading) return null;

    const productsList = generateDiscountsJsonLd(
        postsInDiscount,
        getAbsolutePostUrl,
    );
    const currentUrl = 'https://client-qqq1.vercel.app/discounts-and-offers';
    const titleKey =
        'categories.discountsAndOffers.categories.discountsAndOffers.title';
    const descKey =
        'categories.discountsAndOffers.categories.discountsAndOffers.description';
    const viewLabel = t('pages.messageAuditLogs.viewDetails') || 'عرض';

    const navBtnSx = {
        width: 42,
        height: 42,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        transition: 'all .2s ease',
        '&:hover': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderColor: 'primary.main',
        },
    } as const;

    return (
        <>
            <JsonLd data={productsList} />
            <link rel='canonical' href={currentUrl} />
            <title>{`${t(titleKey)} | صفقة`}</title>
            <meta name='description' content={t(descKey)} />

            <Box
                component='section'
              dir={dir} sx={{ py: { xs: 3, sm: 5, md: 8 } }}
            >
                <Container maxWidth='lg'>
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'stretch', sm: 'flex-end' },
                            gap: { xs: 2, sm: 3 },
                            mb: { xs: 3, md: 5 },
                            pb: { xs: 2, md: 3 },
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Box sx={{ maxWidth: 640 }}>
                            <Typography
                                component='h2'
                                fontWeight={800}
                                sx={{
                                    fontSize: {
                                        xs: '1.4rem',
                                        sm: '1.75rem',
                                        md: '2.125rem',
                                    },
                                    lineHeight: 1.25,
                                    mb: 0.75,
                                }}
                            >
                                {t(titleKey)}
                            </Typography>
                            <Typography
                                color='text.secondary'
                                sx={{
                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                    lineHeight: 1.7,
                                }}
                            >
                                {t(descKey)}
                            </Typography>
                        </Box>

                        <Stack
                            direction='row'
                            alignItems='center'
                            justifyContent={{
                                xs: 'space-between',
                                sm: 'flex-end',
                            }}
                            spacing={2}
                        >
                            <Link
                                component={RouterLink}
                                to={path.DiscountsAndOffers}
                                underline='none'
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.75,
                                    color: 'primary.main',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    whiteSpace: 'nowrap',
                                    '&:hover .arrow-icon': {
                                        transform: `translateX(${isRtl ? '-4px' : '4px'})`,
                                    },
                                }}
                            >
                                {t(
                                    'categories.discountsAndOffers.common.viewAll',
                                ) || 'View All Offers'}
                                {isRtl ? (
                                    <ArrowBackIcon
                                        className='arrow-icon'
                                        sx={{
                                            fontSize: '1.2rem',
                                            transition: 'transform .2s ease',
                                        }}
                                    />
                                ) : (
                                    <ArrowForwardIcon
                                        className='arrow-icon'
                                        sx={{
                                            fontSize: '1.2rem',
                                            transition: 'transform .2s ease',
                                        }}
                                    />
                                )}
                            </Link>

                            {/* Nav arrows – desktop/tablet only */}
                            {!isMobile && !loading && (
                                <Stack direction='row' spacing={1}>
                                    <IconButton
                                        onClick={handlePrev}
                                        aria-label={t(
                                            'common.previous',
                                            'السابق',
                                        )}
                                        sx={navBtnSx}
                                    >
                                        {isRtl ? (
                                            <ChevronRightIcon />
                                        ) : (
                                            <ChevronLeftIcon />
                                        )}
                                    </IconButton>
                                    <IconButton
                                        onClick={handleNext}
                                        aria-label={t('common.next', 'التالي')}
                                        sx={navBtnSx}
                                    >
                                        {isRtl ? (
                                            <ChevronLeftIcon />
                                        ) : (
                                            <ChevronRightIcon />
                                        )}
                                    </IconButton>
                                </Stack>
                            )}
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
                                    lg: 'repeat(4, 1fr)',
                                },
                                gap: { xs: 2, md: 3 },
                            }}
                        >
                            {[0, 1, 2, 3].map((i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: {
                                            xs: i < 1 ? 'block' : 'none',
                                            sm: i < 2 ? 'block' : 'none',
                                            md: i < 3 ? 'block' : 'none',
                                            lg: 'block',
                                        },
                                    }}
                                >
                                    <SkeletonCard />
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                mx: { xs: -2, sm: 0 },
                                '& .swiper': {
                                    px: { xs: 2, sm: 0.5 },
                                    pt: 1,
                                    pb: { xs: 4, md: 5 },
                                },
                                '& .swiper-slide': {
                                    height: 'auto',
                                    display: 'flex',
                                },
                                '& .swiper-pagination': { bottom: 0 },
                                '& .swiper-pagination-bullet': {
                                    bgcolor: 'text.secondary',
                                    opacity: 0.3,
                                    width: 8,
                                    height: 8,
                                    transition: 'all .25s ease',
                                },
                                '& .swiper-pagination-bullet-active': {
                                    bgcolor: 'primary.main',
                                    opacity: 1,
                                    width: 22,
                                    borderRadius: 4,
                                },
                            }}
                        >
                            <Swiper
                                key={dir}
                                dir={dir}
                                onSwiper={(s) => {
                                    swiperRef.current = s;
                                }}
                                modules={[Autoplay, Pagination]}
                                autoplay={
                                    reduceMotion
                                        ? false
                                        : {
                                              delay: 5000,
                                              disableOnInteraction: false,
                                              pauseOnMouseEnter: true,
                                          }
                                }
                                rewind
                                grabCursor
                                pagination={{ clickable: true }}
                                slidesPerView={1}
                                spaceBetween={20}
                                breakpoints={{
                                    600: {
                                        slidesPerView: 2.15,
                                        spaceBetween: 16,
                                    },
                                    900: {
                                        slidesPerView: 3.15,
                                        spaceBetween: 20,
                                    },
                                    1200: {
                                        slidesPerView: 4,
                                        spaceBetween: 24,
                                    },
                                }}
                            >
                                {postsInDiscount.map((product) => (
                                    <SwiperSlide key={product._id as string}>
                                        <ProductCard
                                            product={product}
                                            viewLabel={viewLabel}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default DiscountsAndOffers;
