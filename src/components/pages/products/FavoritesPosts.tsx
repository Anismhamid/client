import { FunctionComponent, useState } from 'react';
import { useUser } from '../../../hooks/useUSer';
import { Box, Grid, Typography } from '@mui/material';
import ProductCard from './PostsCard';
import { generateProductsItemListJsonLd } from '../../../../utils/structuredData';
import JsonLd from '../../../../utils/JsonLd';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../../locales/handleRTL';
import { useNavigate } from 'react-router-dom';
import { path } from '../../../routes/routes';
import { usePosts } from '../../../hooks/usePosts';
import { Posts } from '../../../interfaces/Posts';
import Loader from '../../../atoms/loader/Loader';

const FavoritesPosts: FunctionComponent = () => {
    const { t } = useTranslation();

    const { posts, setPosts, loading } = usePosts();

    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>(
        {},
    );

    const { auth } = useUser();
    const navigate = useNavigate();

    // Get current user ID once
    const userId = auth?._id;

    // Favorites are derived directly from posts
    const favorites = userId
        ? posts.filter(
              (post) =>
                  Array.isArray(post.likes) && post.likes.includes(userId),
          )
        : [];

    const direction = handleRTL();

    const currentUrl = 'https://client-qqq1.vercel.app/favorites';

    const productsList = generateProductsItemListJsonLd(favorites);

    const handleToggleLike = (productId: string, liked: boolean) => {
        if (!userId) {
            navigate(path.Login);
            return;
        }

        setPosts((prev: Posts[]) =>
            prev.map((post: Posts) => {
                if (post._id !== productId) {
                    return post;
                }

                const currentLikes = post.likes || [];

                return {
                    ...post,
                    likes: liked
                        ? currentLikes.includes(userId)
                            ? currentLikes
                            : [...currentLikes, userId]
                        : currentLikes.filter((id: string) => id !== userId),
                };
            }),
        );
    };

    if (loading) return <Loader />;

    if (!favorites.length) {
        return (
            <>
                <title>{t('pages.favorites.title')} | صفقة</title>

                <Box
                    dir={direction}
                    sx={{
                        textAlign: 'center',
                        py: 6,
                        px: { xs: 2, md: 4 },
                    }}
                >
                    <Typography variant='h6' color='text.secondary'>
                        {t('pages.favorites.empty')}
                    </Typography>
                </Box>
            </>
        );
    }

    return (
        <>
            <JsonLd data={productsList} />

            <link rel='canonical' href={currentUrl} />

            <title>{t('pages.favorites.title')} | صفقة</title>

            <meta name='description' content={t('pages.favorites.title')} />

            <Box
                dir={direction}
                sx={{
                    px: { xs: 2, md: 4 },
                    py: 4,
                }}
            >
                <Typography
                    component='h1'
                    variant='h4'
                    fontWeight={700}
                    sx={{ mb: 3 }}
                >
                    {t('pages.favorites.title')}
                </Typography>

                <Grid container spacing={3}>
                    {favorites.map((post) => (
                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4,
                                lg: 3,
                            }}
                            key={post._id}
                        >
                            <ProductCard
                                post={post}
                                discountedPrice={post.discount || 0}
                                setPostIdToUpdate={() => {}}
                                onShowUpdateProductModal={() => {}}
                                openDeleteModal={() => {}}
                                setLoadedImages={() =>
                                    setLoadedImages((prev) => ({
                                        ...prev,
                                        [post._id as string]: true,
                                    }))
                                }
                                loadedImages={loadedImages}
                                category={post.category}
                                onLikeToggle={handleToggleLike}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export default FavoritesPosts;
