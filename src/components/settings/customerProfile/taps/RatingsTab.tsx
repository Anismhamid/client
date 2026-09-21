import {
    Box,
    Typography,
    LinearProgress,
    Chip,
    Grid,
    alpha,
    Rating,
    Skeleton,
    Stack,
} from '@mui/material';
import { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stats } from '../types/states';
import { Star, RateReview, Storefront } from '@mui/icons-material';
import { m } from 'framer-motion';
import { usePosts } from '../../../../hooks/usePosts';
import { getAverageRating } from '../../../pages/products/helpers/helperFunctions';
import { User } from '../../../../interfaces/chat/usersMessages';

const BRAND_GOLD = '#B8860B';
const BRAND_BROWN = '#8B4513';
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_GOLD} 0%, ${BRAND_BROWN} 100%)`;

interface RatingsTabProps {
    stats: Stats;
    user: User;
}

const RatingsTab: FunctionComponent<RatingsTabProps> = ({ user }) => {
    const { t } = useTranslation();
    const { posts, loading } = usePosts();

    /* === جميع إعلانات المستخدم === */
    const myPosts = useMemo(
        () => (posts ?? []).filter((post) => user._id === post.seller?._id),
        [posts, user._id],
    );

    /* === الإعلانات التي لديها تقييمات === */
    const ratedPosts = useMemo(
        () => myPosts.filter((post) => getAverageRating(post) > 0),
        [myPosts],
    );

    /* === متوسط تقييم المنتجات === */
    const userPostsRating = useMemo(() => {
        if (ratedPosts.length === 0) return 0;
        const total = ratedPosts.reduce(
            (sum, post) => sum + getAverageRating(post),
            0,
        );
        return Math.round((total / ratedPosts.length) * 10) / 10;
    }, [ratedPosts]);

    /* === إجمالي عدد التقييمات === */
    const totalReviews = useMemo(
        () =>
            myPosts.reduce((sum, post) => sum + (post.reviews?.length ?? 0), 0),
        [myPosts],
    );

    /* === توزيع التقييمات === */
    const ratingDistribution = useMemo(() => {
        const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        myPosts.forEach((post) => {
            post.reviews?.forEach((review) => {
                const rating = Number(review.rating);
                if (rating >= 1 && rating <= 5) dist[rating]++;
            });
        });
        return dist;
    }, [myPosts]);

    /* === Loading === */
    if (loading) {
        return (
            <Box py={4}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Skeleton
                            variant='rounded'
                            height={320}
                            sx={{ borderRadius: 4 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Skeleton variant='text' width={200} height={32} />
                        {[5, 4, 3, 2, 1].map((s) => (
                            <Skeleton
                                key={s}
                                variant='rounded'
                                height={28}
                                sx={{ my: 1, borderRadius: 2 }}
                            />
                        ))}
                    </Grid>
                </Grid>
            </Box>
        );
    }

    /* === Empty === */
    if (totalReviews === 0 && myPosts.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 10 }}>
                <Box
                    sx={{
                        width: 96,
                        height: 96,
                        borderRadius: '50%',
                        bgcolor: alpha(BRAND_GOLD, 0.08),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                    }}
                >
                    <RateReview sx={{ fontSize: 48, color: BRAND_GOLD }} />
                </Box>
                <Typography variant='h6' fontWeight={700} gutterBottom>
                    {t('common.noProductsForRatings')}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    {t('common.noRatingsYet', {
                        name: user.name?.first,
                        defaultValue: 'لا توجد تقييمات بعد',
                    })}
                </Typography>
            </Box>
        );
    }

    return (
        <Box py={{ xs: 2, md: 4 }} mx={3}>
            <Grid container spacing={{ xs: 3, md: 4 }} alignItems='stretch'>
                {/* === بطاقة الرقم الكبير === */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <m.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        style={{ height: '100%' }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                textAlign: 'center',
                                p: { xs: 3, md: 4 },
                                borderRadius: 4,
                                background: `linear-gradient(180deg, ${alpha(
                                    BRAND_GOLD,
                                    0.08,
                                )} 0%, ${alpha(BRAND_GOLD, 0.02)} 100%)`,
                                border: `1px solid ${alpha(BRAND_GOLD, 0.22)}`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 2,
                            }}
                        >
                            {/* دائرة النجمة */}
                            <Box
                                sx={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: '50%',
                                    background: BRAND_GRADIENT,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                    boxShadow: `0 8px 20px ${alpha(
                                        BRAND_GOLD,
                                        0.3,
                                    )}`,
                                }}
                            >
                                <Star sx={{ fontSize: 36, color: '#fff' }} />
                            </Box>

                            <Typography
                                variant='h2'
                                fontWeight={800}
                                lineHeight={1}
                                sx={{ color: BRAND_BROWN }}
                            >
                                {userPostsRating.toFixed(1)}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    mt: 1,
                                    direction: 'ltr',
                                }}
                            >
                                <Rating
                                    value={userPostsRating}
                                    precision={0.5}
                                    readOnly
                                    size='medium'
                                    sx={{
                                        color: BRAND_GOLD,
                                    }}
                                />
                            </Box>

                            <Typography
                                variant='body2'
                                color='text.secondary'
                                sx={{ mt: 1 }}
                            >
                                {t('common.basedOnCustomerFeedback')}
                            </Typography>

                            <Stack
                                direction='row'
                                spacing={1}
                                flexWrap='wrap'
                                useFlexGap
                                justifyContent='center'
                                sx={{ mt: 2.5 }}
                            >
                                <Chip
                                    icon={<RateReview fontSize='small' />}
                                    label={t('common.reviewsCount', {
                                        count: totalReviews,
                                    })}
                                    size='small'
                                    sx={{
                                        bgcolor: alpha(BRAND_GOLD, 0.1),
                                        color: BRAND_BROWN,
                                        fontWeight: 700,
                                        border: 'none',
                                    }}
                                />
                                <Chip
                                    icon={<Storefront fontSize='small' />}
                                    label={t('common.productsCount', {
                                        count: myPosts.length,
                                    })}
                                    size='small'
                                    variant='outlined'
                                    sx={{
                                        fontWeight: 700,
                                        borderColor: alpha(BRAND_GOLD, 0.4),
                                    }}
                                />
                            </Stack>
                        </Box>
                    </m.div>
                </Grid>

                {/* === توزيع النجوم === */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <m.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        style={{ height: '100%' }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                p: { xs: 2.5, md: 3 },
                                borderRadius: 4,
                                // border: `1px solid ${alpha(
                                //     theme.palette.divider,
                                //     0.6,
                                // )}`,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <Typography variant='h6' fontWeight={800} mb={2.5}>
                                {t('common.ratingsDistribution')}
                            </Typography>

                            {totalReviews > 0 ? (
                                <Stack spacing={1.5}>
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count =
                                            ratingDistribution[star] ?? 0;
                                        const pct =
                                            totalReviews > 0
                                                ? (count / totalReviews) * 100
                                                : 0;

                                        return (
                                            <Box
                                                key={star}
                                                display='flex'
                                                alignItems='center'
                                                gap={1.5}
                                            >
                                                {/* النجوم */}
                                                <Stack
                                                    direction='row'
                                                    alignItems='center'
                                                    spacing={0.25}
                                                    sx={{ minWidth: 84 }}
                                                >
                                                    <Typography
                                                        variant='body2'
                                                        fontWeight={700}
                                                        sx={{
                                                            color: BRAND_BROWN,
                                                            mr: 0.5,
                                                        }}
                                                    >
                                                        {star}
                                                    </Typography>
                                                    <Star
                                                        sx={{
                                                            fontSize: 16,
                                                            color: BRAND_GOLD,
                                                        }}
                                                    />
                                                </Stack>

                                                {/* الشريط */}
                                                <LinearProgress
                                                    variant='determinate'
                                                    value={pct}
                                                    sx={{
                                                        flex: 1,
                                                        height: 10,
                                                        borderRadius: 5,
                                                        bgcolor: alpha(
                                                            BRAND_GOLD,
                                                            0.08,
                                                        ),
                                                        '& .MuiLinearProgress-bar':
                                                            {
                                                                background:
                                                                    BRAND_GRADIENT,
                                                                borderRadius: 5,
                                                            },
                                                    }}
                                                />

                                                {/* العدد */}
                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                    fontWeight={600}
                                                    sx={{
                                                        minWidth: 32,
                                                        textAlign: 'end',
                                                    }}
                                                >
                                                    {count}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            ) : (
                                <Box textAlign='center' py={4}>
                                    <Typography
                                        color='text.secondary'
                                        variant='body2'
                                    >
                                        {t('common.noProductsForRatings')}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </m.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RatingsTab;
