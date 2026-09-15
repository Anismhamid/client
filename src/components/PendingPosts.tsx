import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardMedia,
    Chip,
    Container,
    Grid,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { FunctionComponent, useEffect, useState } from 'react';
import { Posts } from '../interfaces/Posts';
import {
    getPendingPosts,
    approvePost,
    rejectPost,
} from '../services/postsServices';
import { formatPrice } from '../helpers/dateAndPriceFormat';
import { showError, showSuccess } from '../atoms/toasts/ReactToast';

const BRAND_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';

const PendingPosts: FunctionComponent = () => {
    const [posts, setPosts] = useState<Posts[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [actioningId, setActioningId] = useState<string | null>(null);

    useEffect(() => {
        const fetchPendingPosts = async () => {
            try {
                setLoading(true);
                setError('');

                const res = await getPendingPosts();
                setPosts([...res]);
            } catch (err) {
                console.error('Failed to fetch pending posts:', err);

                setError('Failed to load pending posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchPendingPosts();
    }, []);

    const handleApprove = async (postId: string) => {
        try {
            setActioningId(postId);

            await approvePost(postId);

            setPosts((prev) => prev.filter((post) => post._id !== postId));
            showSuccess('تم قبول الإعلان بنجاح');
        } catch (err) {
            console.error('Failed to approve post:', err);
            showError('فشل قبول الإعلان');
        } finally {
            setActioningId(null);
        }
    };

    const handleReject = async (postId: string) => {
        try {
            setActioningId(postId);

            await rejectPost(postId);

            setPosts((prev) => prev.filter((post) => post._id !== postId));
            showSuccess('تم رفض الإعلان');
        } catch (err) {
            console.error('Failed to reject post:', err);
            showError('فشل رفض الإعلان');
        } finally {
            setActioningId(null);
        }
    };

    if (loading) {
        return (
            <Box component='main'>
                <Container sx={{ py: 4 }}>
                    <Grid container spacing={1}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Grid key={i} size={{ xs: 12, md: 6, lg: 3 }}>
                                <Skeleton variant='rounded' height={280} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        );
    }

    if (!posts.length) {
        return (
            <Box component='main'>
                <Container sx={{ py: 4 }}>
                    <Alert severity='info'>
                        لا توجد إعلانات بانتظار المراجعة حاليًا.
                    </Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box component='main'>
            <Container sx={{ py: 4 }}>
                {error && (
                    <Alert severity='error' sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={1}>
                    {posts.map((post) => (
                        <Grid key={post._id} size={{ xs: 12, md: 6, lg: 3 }}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <CardMedia
                                    component='img'
                                    image={post.image?.url}
                                    alt={post.product_name}
                                    sx={{ height: 160, objectFit: 'cover' }}
                                />

                                <Stack spacing={1.2} sx={{ p: 2, flexGrow: 1 }}>
                                    <Stack
                                        direction='row'
                                        alignItems='flex-start'
                                        justifyContent='space-between'
                                        spacing={1}
                                    >
                                        <Typography
                                            variant='subtitle1'
                                            fontWeight={700}
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {post.product_name}
                                        </Typography>

                                        <Chip
                                            label={post.category}
                                            size='small'
                                            sx={{
                                                background: BRAND_GRADIENT,
                                                color: '#fff',
                                                fontWeight: 600,
                                                flexShrink: 0,
                                            }}
                                        />
                                    </Stack>

                                    <Typography
                                        variant='h6'
                                        fontWeight={800}
                                        sx={{ color: '#B8860B' }}
                                    >
                                        {formatPrice(post.price)}
                                    </Typography>

                                    <Stack
                                        direction='row'
                                        spacing={1}
                                        alignItems='center'
                                    >
                                        <Avatar
                                            src={post.seller?.image?.url}
                                            sx={{ width: 28, height: 28 }}
                                        >
                                            {post.seller?.name?.first?.[0]}
                                        </Avatar>
                                        <Typography
                                            variant='body2'
                                            color='text.secondary'
                                        >
                                            {post.seller?.name?.first}{' '}
                                            {post.seller?.name?.last}
                                        </Typography>
                                    </Stack>

                                    <Stack
                                        direction='row'
                                        spacing={0.5}
                                        alignItems='center'
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        <CalendarTodayIcon
                                            sx={{ fontSize: 14 }}
                                        />
                                        <Typography variant='caption'>
                                            {post.createdAt
                                                ? new Date(
                                                      post.createdAt,
                                                  ).toLocaleDateString('ar-EG')
                                                : ''}
                                        </Typography>
                                    </Stack>

                                    <Stack
                                        direction='row'
                                        spacing={1}
                                        sx={{ mt: 'auto', pt: 1 }}
                                    >
                                        <Button
                                            fullWidth
                                            variant='contained'
                                            color='success'
                                            size='small'
                                            startIcon={<CheckCircleIcon />}
                                            disabled={actioningId === post._id}
                                            onClick={() =>
                                                handleApprove(
                                                    post._id as string,
                                                )
                                            }
                                        >
                                            قبول
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant='outlined'
                                            color='error'
                                            size='small'
                                            startIcon={<CancelIcon />}
                                            disabled={actioningId === post._id}
                                            onClick={() =>
                                                handleReject(post._id as string)
                                            }
                                        >
                                            رفض
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default PendingPosts;
