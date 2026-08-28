//  PostsCategory.tsx
import {
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { deletePost } from '../../../services/postsServices';
import { useUser } from '../../../hooks/useUSer';
import Loader from '../../../atoms/loader/Loader';
import UpdateProductModal from '../../../atoms/productsManage/addAndUpdateProduct/UpdatePostModal';
import { showError } from '../../../atoms/toasts/ReactToast';
import RoleType from '../../../interfaces/UserType';
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    useTheme,
    alpha,
} from '@mui/material';
import AlertDialogs from '../../../atoms/toasts/Sweetalert';
import { useTranslation } from 'react-i18next';
import { generateCategoryJsonLd } from '../../../../utils/structuredData';
import JsonLd from '../../../../utils/JsonLd';
import { useNavigate } from 'react-router-dom';
import { path } from '../../../routes/routes';
import SearchBox from '../../../atoms/productsManage/SearchBox';
import { Posts } from '../../../interfaces/Posts';
import PostCard from './PostsCard';
import { usePosts } from '../../../hooks/usePosts';

interface PostsCategoryProps {
    category: string;
}

const PostsCategory: FunctionComponent<PostsCategoryProps> = ({
    category,
}: PostsCategoryProps) => {
    const [postIdToUpdate, setPostIdToUpdate] = useState<string>('');
    const [visibleCount, setVisibleCount] = useState(12); // const [products, setProducts] = useState<Posts[]>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    const { posts, setPosts, loading, refetch } = usePosts(category);
    const { auth } = useUser();
    const [showUpdateProductModal, setOnShowUpdateProductModal] =
        useState<boolean>(false);
    const [productToDelete, setProductToDelete] = useState<string>('');
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>(
        {},
    );
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const { t } = useTranslation();
    const theme = useTheme();

    const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
    const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

    const refreshAfterChange = () => {
        refetch();
    };

    const openDeleteModal = (productId: string) => {
        setProductToDelete(productId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => setShowDeleteModal(false);

    const filteredProducts = useMemo(() => {
        const searchLower = searchQuery.toLowerCase().trim();

        return [...posts].reverse().filter((post) => {
            const productName = post.product_name || '';
            const productDescription = post.description || '';
            const productBrand = post.brand || '';
            const productPrice = post.price?.toString() || '';

            return (
                productName.toLowerCase().includes(searchLower) ||
                productDescription.toLowerCase().includes(searchLower) ||
                productBrand.toLowerCase().includes(searchLower) ||
                productPrice.includes(searchQuery)
            );
        });
    }, [posts, searchQuery]);

    const visibleProducts = useMemo(() => {
        return filteredProducts.slice(0, visibleCount);
    }, [filteredProducts, visibleCount]);

    const handleShowMore = useCallback(() => {
        if (isLoadingMore || visibleCount >= filteredProducts.length) {
            return;
        }

        setIsLoadingMore(true);

        setTimeout(() => {
            setVisibleCount((prev) =>
                Math.min(prev + 12, filteredProducts.length),
            );

            setIsLoadingMore(false);
        }, 300);
    }, [isLoadingMore, visibleCount, filteredProducts.length]);

    useEffect(() => {
        if (!loadMoreRef.current || visibleCount >= filteredProducts.length) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingMore) {
                    handleShowMore();
                }
            },
            {
                rootMargin: '200px',
                threshold: 0.1,
            },
        );

        observer.observe(loadMoreRef.current);

        return () => {
            observer.disconnect();
        };
    }, [handleShowMore, isLoadingMore, visibleCount, filteredProducts.length]);

    const navigate = useNavigate();

    const handleToggleLike = (productId: string, liked: boolean) => {
        if (!auth?._id) {
            navigate(path.Login);
            return;
        }

        const userId = auth._id;

        setPosts((prev) =>
            prev.map((post) =>
                post._id === productId
                    ? {
                          ...post,
                          likes: liked
                              ? [...(post.likes || []), userId]
                              : (post.likes || []).filter(
                                    (id) => id !== userId,
                                ),
                      }
                    : post,
            ),
        );
    };

    const handleDelete = (postId: string) => {
        deletePost(postId)
            .then(() => {
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post._id !== postId),
                );
            })
            .catch((err) => {
                console.error(err);
                showError('خطأ في حذف المنتج');
            });
    };

    const isAdmin = auth?.role === RoleType.Admin;
    const isModerator = auth?.role === RoleType.Moderator;
    const canEdit = isAdmin || isModerator;

    // FIX: Consistent key casing — no more manual toUpperCase() hack
    const categoryTitle = t(`categories.${category}.heading`);
    const categoryDescription = t(`categories.${category}.description`);
    const currentUrl = `${window.location.origin}/category/${category}`;

    if (loading) return <Loader />;

    if (!loading && posts.length === 0)
        return (
            <main>
                {/* React 19: these tags are hoisted to <head> automatically */}
                <title>{categoryTitle} | صفقة</title>
                <link rel='canonical' href={currentUrl} />
                <meta name='description' content={categoryDescription} />
                <Container maxWidth='lg' sx={{ textAlign: 'center' }}>
                    <Typography
                        variant='h5'
                        color='text.secondary'
                        sx={{ mb: 3 }}
                    >
                        لم يتم العثور على أي منتجات في هذه الفئة
                    </Typography>
                    <Button
                        onClick={refreshAfterChange}
                        variant='contained'
                        size='large'
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            '&:hover': {
                                bgcolor: theme.palette.primary.dark,
                            },
                        }}
                    >
                        تحديث الصفحة
                    </Button>
                </Container>
            </main>
        );

    const generateCategory = generateCategoryJsonLd(category, posts);

    return (
        <main>
            {/* FIX 1: React 19 hoists these to <head> natively — no library needed */}
            <title>{categoryTitle} | صفقة</title>
            <link rel='canonical' href={currentUrl} />
            <meta name='description' content={categoryDescription} />

            <JsonLd data={generateCategory} />

            {/* FIX 2: h1 always visible — visually hidden on mobile via clip trick,
			    still readable by crawlers and screen readers */}
            <Typography
                component='h1'
                sx={{
                    position: { xs: 'absolute' },
                    width: { xs: '1px', md: 'auto' },
                    height: { xs: '1px', md: 'auto' },
                    overflow: { xs: 'hidden', md: 'visible' },

                    whiteSpace: { xs: 'nowrap', md: 'normal' },
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    fontSize: '1.25rem',
                    px: { md: 2 },
                    py: { md: 1 },
                }}
            >
                {categoryTitle}
            </Typography>

            {/* Search Bar */}
            <Box
                sx={{
                    position: 'static',
                    zIndex: 2,
                    px: 'auto',
                    borderBottom: '1px solid #2C3646',
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <SearchBox
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        text={t(`categories.${category}.label`)}
                    />
                </Box>
            </Box>

            <Container maxWidth='lg'>
                <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 3, px: { xs: 2, md: 0 } }}
                >
                    {t('common.viewOf')} {visibleProducts.length}{' '}
                    {t('common.outOf')} {filteredProducts.length}{' '}
                    {t('common.countOfPosts')}
                </Typography>

                {filteredProducts.length > 0 ? (
                    <Grid container spacing={2}>
                        {visibleProducts.map((post: Posts) => {
                            const discountedPrice = post.sale
                                ? post.price -
                                  (post.price * (post.discount || 0)) / 100
                                : post.price;

                            return (
                                <Grid
                                    key={post._id}
                                    size={{ xs: 12, md: 4, lg: 3 }}
                                >
                                    <PostCard
                                        featured={post.featured}
                                        post={post}
                                        discountedPrice={discountedPrice}
                                        canEdit={canEdit}
                                        setPostIdToUpdate={setPostIdToUpdate}
                                        onShowUpdateProductModal={
                                            onShowUpdateProductModal
                                        }
                                        openDeleteModal={openDeleteModal}
                                        setLoadedImages={setLoadedImages}
                                        loadedImages={loadedImages}
                                        category={category}
                                        onLikeToggle={handleToggleLike}
                                        updateProductInList={(updatedPost) => {
                                            setPosts((prev) =>
                                                prev.map((post) =>
                                                    post._id === updatedPost._id
                                                        ? updatedPost
                                                        : post,
                                                ),
                                            );
                                        }}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : (
                    <Box
                        sx={{
                            bgcolor: '#fff',
                            p: 5,
                            textAlign: 'center',
                            borderRadius: 3,
                            border: '1px solid #e4e6eb',
                            mt: 3,
                        }}
                    >
                        <Typography
                            variant='h6'
                            color='primary.main'
                            sx={{ mb: 2 }}
                        >
                           {t('searchPage.search.noResults')}
                        </Typography>
                        <Typography variant='body2' color='primary.main'>
                           {t("searchPage.search.tryAgain")}
                        </Typography>
                    </Box>
                )}

                {visibleProducts.length < filteredProducts.length && (
                    <Box
                        ref={loadMoreRef}
                        sx={{
                            py: 4,
                            textAlign: 'center',
                        }}
                    >
                        {isLoadingMore ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Loader />
                            </Box>
                        ) : (
                            <Button
                                variant='outlined'
                                onClick={handleShowMore}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.04,
                                        ),
                                        borderColor: theme.palette.primary.dark,
                                    },
                                }}
                            >
                               {t('loadMore')}
                            </Button>
                        )}
                    </Box>
                )}

                {visibleProducts.length === filteredProducts.length &&
                    filteredProducts.length > 0 && (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography variant='body2' color='text.secondary'>
                                🎉 {t('common.endOfPosts')}
                            </Typography>
                        </Box>
                    )}
            </Container>

            <UpdateProductModal
                refresh={refreshAfterChange}
                postId={postIdToUpdate}
                show={showUpdateProductModal}
                onHide={() => onHideUpdateProductModal()}
            />

            <AlertDialogs
                show={showDeleteModal}
                onHide={closeDeleteModal}
                handleDelete={() => handleDelete(productToDelete)}
                title={'حذف المنتج'}
                description={`هل أنت متأكد أنك تريد حذف "${productToDelete}"؟ لا يمكن التراجع عن هذا الإجراء.`}
            />
        </main>
    );
};

export default PostsCategory;
