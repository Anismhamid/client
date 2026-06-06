import {
    Box,
    Typography,
    LinearProgress,
    Chip,
    Grid,
    alpha,
    useTheme,
} from '@mui/material';
import { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stats } from '../types/states';
import { Star, StarBorder, RateReview } from '@mui/icons-material';
import { Rating } from '@mui/material';
import { usePosts } from '../../../../hooks/usePosts';
import { getAverageRating } from '../../../pages/products/helpers/helperFunctions';
import { User } from '../../../../interfaces/chat/usersMessages';

interface RatingsTabProps {
    stats: Stats;
    user: User;
}

const RatingsTab: FunctionComponent<RatingsTabProps> = ({ user, stats }) => {
    const { t } = useTranslation();
    const { posts } = usePosts();
    const theme = useTheme();

    const myPosts = useMemo(
        () => posts.filter((post) => user._id === post.seller?.user?._id),
        [posts, user._id],
    );

    const userPostsRating = useMemo(() => {
        if (myPosts.length === 0) return 0;
        const total = myPosts.reduce(
            (sum, post) => sum + getAverageRating(post),
            0,
        );
        return Math.round((total / myPosts.length) * 10) / 10;
    }, [myPosts]);

    const ratingDistribution = useMemo(() => {
        const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        myPosts.forEach((post) => {
            const avg = Math.round(getAverageRating(post));
            if (avg >= 1 && avg <= 5) dist[avg]++;
        });
        return dist;
    }, [myPosts]);

    const totalReviews = useMemo(
        () =>
            myPosts.reduce(
                (sum, post) => sum + (post.reviews?.length ?? 0),
                0,
            ),
        [myPosts],
    );

    return (
        <Box py={4} px={2}>
            <Grid container spacing={4} justifyContent='center'>

                {/* الرقم الكبير */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box
                        textAlign='center'
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            bgcolor: alpha(theme.palette.warning.main, 0.06),
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                        }}
                    >
                        <Star sx={{ fontSize: 52, color: 'warning.main', mb: 1 }} />

                        <Typography variant='h2' fontWeight={800} lineHeight={1}>
                            {userPostsRating.toFixed(1)}
                        </Typography>

                        <Typography variant='body2' color='text.secondary' mb={1.5}>
                            {t('based_on_customer_feedback')}
                        </Typography>

                        <Rating
                            value={userPostsRating}
                            precision={0.5}
                            readOnly
                            size='medium'
                        />

                        <Box
                            display='flex'
                            justifyContent='center'
                            gap={2}
                            mt={2}
                            flexWrap='wrap'
                        >
                            <Chip
                                icon={<RateReview fontSize='small' />}
                                label={`${totalReviews} تقييم`}
                                size='small'
                                variant='outlined'
                                color='warning'
                            />
                            <Chip
                                icon={<Star fontSize='small' />}
                                label={`${myPosts.length} منتج`}
                                size='small'
                                variant='outlined'
                            />
                        </Box>

                        {stats.rating > 0 && (
                            <Box
                                mt={3}
                                pt={3}
                                sx={{
                                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                }}
                            >
                                <Typography variant='caption' color='text.secondary'>
                                    تقييم البروفايل العام
                                </Typography>
                                <Typography
                                    variant='h5'
                                    fontWeight={700}
                                    color='warning.main'
                                >
                                    {stats.rating.toFixed(1)}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* توزيع النجوم */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box>
                        <Typography variant='h6' fontWeight={700} mb={2.5}>
                            توزيع التقييمات
                        </Typography>

                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = ratingDistribution[star] ?? 0;
                            const pct =
                                myPosts.length > 0
                                    ? (count / myPosts.length) * 100
                                    : 0;
                            return (
                                <Box
                                    key={star}
                                    display='flex'
                                    alignItems='center'
                                    gap={1.5}
                                    mb={1.5}
                                >
                                    <Box
                                        display='flex'
                                        alignItems='center'
                                        gap={0.3}
                                        minWidth={80}
                                    >
                                        {Array.from({ length: 5 }).map((_, i) =>
                                            i < star ? (
                                                <Star
                                                    key={i}
                                                    sx={{
                                                        fontSize: 16,
                                                        color: 'warning.main',
                                                    }}
                                                />
                                            ) : (
                                                <StarBorder
                                                    key={i}
                                                    sx={{
                                                        fontSize: 16,
                                                        color: 'text.disabled',
                                                    }}
                                                />
                                            ),
                                        )}
                                    </Box>

                                    <LinearProgress
                                        variant='determinate'
                                        value={pct}
                                        sx={{
                                            flex: 1,
                                            height: 10,
                                            borderRadius: 5,
                                            bgcolor: alpha(
                                                theme.palette.warning.main,
                                                0.1,
                                            ),
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor:
                                                    pct > 0
                                                        ? 'warning.main'
                                                        : 'transparent',
                                                borderRadius: 5,
                                            },
                                        }}
                                    />

                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                        minWidth={30}
                                        textAlign='right'
                                    >
                                        {count}
                                    </Typography>
                                </Box>
                            );
                        })}

                        {myPosts.length === 0 && (
                            <Box textAlign='center' py={4}>
                                <Typography color='text.secondary' variant='body2'>
                                    لا توجد منتجات بعد لعرض تقييماتها
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RatingsTab;