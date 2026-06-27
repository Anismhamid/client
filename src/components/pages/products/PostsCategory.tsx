//  PostsCategory.tsx
import {
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    deletePost,
    getpostsByCategory,
} from '../../../services/postsServices';
import { useUser } from '../../../context/useUSer';
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

interface PostsCategoryProps {
    category: string;
}

const PostsCategory: FunctionComponent<PostsCategoryProps> = ({
    category,
}: PostsCategoryProps) => {
    const [postIdToUpdate, setPostIdToUpdate] = useState<string>('');
    const [visibleProducts, setVisibleProducts] = useState<Posts[]>([]);
    const [products, setProducts] = useState<Posts[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { auth } = useUser();
    const [showUpdateProductModal, setOnShowUpdateProductModal] =
        useState<boolean>(false);
    const [productToDelete, setProductToDelete] = useState<string>('');
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>(
        {},
    );
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const { t } = useTranslation();
    const theme = useTheme();

    const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
    const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

    const refreshAfterChange = () => setRefresh(!refresh);

    const openDeleteModal = (productId: string) => {
        setProductToDelete(productId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => setShowDeleteModal(false);

    const filteredProducts = useMemo(() => {
        return products.filter((post) => {
            const productName = post.product_name || '';
            const productDescription = post.description || '';
            const productBrand = post.brand || '';
            const productPrice = post.price?.toString() || '';

            const searchLower = searchQuery.toLowerCase();

            return (
                productName.toLowerCase().includes(searchLower) ||
                productDescription.toLowerCase().includes(searchLower) ||
                productBrand.toLowerCase().includes(searchLower) ||
                productPrice.includes(searchQuery)
            );
        });
    }, [products, searchQuery]);

    const handleShowMore = useCallback(() => {
        if (isLoadingMore || visibleProducts.length >= filteredProducts.length)
            return;

        setIsLoadingMore(true);

        setTimeout(() => {
            const nextVisibleCount = Math.min(
                visibleProducts.length + 12,
                filteredProducts.length,
            );
            const newVisibleProducts = filteredProducts.slice(
                0,
                nextVisibleCount,
            );
            setVisibleProducts(newVisibleProducts);
            setIsLoadingMore(false);
        }, 300);
    }, [isLoadingMore, visibleProducts.length, filteredProducts]);

    useEffect(() => {
        if (
            !loadMoreRef.current ||
            visibleProducts.length >= filteredProducts.length
        )
            return;

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
            if (observer) observer.disconnect();
        };
    }, [
        handleShowMore,
        isLoadingMore,
        visibleProducts.length,
        filteredProducts.length,
    ]);

    const navigate = useNavigate();

    const handleToggleLike = (productId: string, liked: boolean) => {
        if (!auth?._id) {
            navigate(path.Login);
            return;
        }

        const userId = auth._id;

        setProducts((prev) =>
            prev.map((p) =>
                p._id === productId
                    ? {
                          ...p,
                          likes: liked
                              ? [...(p.likes || []), userId]
                              : (p.likes || []).filter((id) => id !== userId),
                      }
                    : p,
            ),
        );

        setVisibleProducts((prev) =>
            prev.map((p) =>
                p._id === productId
                    ? {
                          ...p,
                          likes: liked
                              ? [...(p.likes || []), userId]
                              : (p.likes || []).filter((id) => id !== userId),
                      }
                    : p,
            ),
        );
    };

    const handleDelete = (productId: string) => {
        deletePost(productId)
            .then(() => {
                setProducts((prevProducts) =>
                    prevProducts.filter((p) => p._id !== productId),
                );
                setVisibleProducts((prev) =>
                    prev.filter((p) => p._id !== productId),
                );
            })
            .catch((err) => {
                console.error(err);
                showError('خطأ في حذف المنتج');
            });
    };

    useEffect(() => {
        getpostsByCategory(category)
            .then((res) => {
                setProducts(res);
                setVisibleProducts(res.slice(0, 12));
            })
            .catch((err) => {
                console.error(err);
                showError('حدث خطأ في تحميل المنتجات');
            })
            .finally(() => setLoading(false));
    }, [category]);

    const isAdmin = auth?.role === RoleType.Admin;
    const isModerator = auth?.role === RoleType.Moderator;
    const canEdit = isAdmin || isModerator;

    // FIX: Consistent key casing — no more manual toUpperCase() hack
    const categoryTitle = t(`categories.${category}.heading`);
    const categoryDescription = t(`categories.${category}.description`);
    const currentUrl = `${window.location.origin}/category/${category}`;

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Loader />
            </Box>
        );
    }

    if (!loading && products.length === 0)
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

    const generateCategory = generateCategoryJsonLd(category, products);

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
                                <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                                    <Box ref={observerRef}>
                                        <PostCard
                                            key={post._id}
                                            featured={post.featured}
                                            post={post}
                                            discountedPrice={discountedPrice}
                                            canEdit={canEdit}
                                            setPostIdToUpdate={
                                                setPostIdToUpdate
                                            }
                                            onShowUpdateProductModal={
                                                onShowUpdateProductModal
                                            }
                                            openDeleteModal={openDeleteModal}
                                            setLoadedImages={setLoadedImages}
                                            loadedImages={loadedImages}
                                            category={category}
                                            onLikeToggle={handleToggleLike}
                                            updateProductInList={(
                                                updatedPost,
                                            ) => {
                                                setProducts((prev) =>
                                                    prev.map((p) =>
                                                        p._id ===
                                                        updatedPost._id
                                                            ? updatedPost
                                                            : p,
                                                    ),
                                                );
                                                setVisibleProducts((prev) =>
                                                    prev.map((p) =>
                                                        p._id ===
                                                        updatedPost._id
                                                            ? updatedPost
                                                            : p,
                                                    ),
                                                );
                                            }}
                                        />
                                    </Box>
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
                            لم يتم العثور على منتجات مطابقة لمعايير البحث
                        </Typography>
                        <Typography variant='body2' color='primary.main'>
                            حاول البحث باستخدام كلمات أخرى
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
                                تحميل المزيد
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
