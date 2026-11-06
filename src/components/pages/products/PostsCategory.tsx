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
import { useLocation, useNavigate } from 'react-router-dom';
import { path } from '../../../routes/routes';
import SearchBox from '../../../atoms/productsManage/SearchBox';
import { Posts } from '../../../interfaces/Posts';
import PostCard from './PostsCard';
import { usePosts } from '../../../hooks/usePosts';
import handleRTL from '../../../locales/handleRTL';
import { getAbsolutePostUrl } from './helpers/postUrl';
import { categoryPathMap } from '../../../interfaces/postsCategoeis';

const PAGE_SIZE = 12;
const SITE_URL = 'https://client-qqq1.vercel.app';

// بحث بدون حساسية لحالة الأحرف (baby → /category/Baby)
const resolveCategoryPath = (category: string): string => {
    const map = categoryPathMap as Record<string, string>;
    if (map[category]) return map[category];
    const key = Object.keys(map).find(
        (k) => k.toLowerCase() === category.toLowerCase(),
    );
    return key ? map[key] : `/category/${category}`;
};

interface PostsCategoryProps {
    category: string;
    // بارامتر اختياري - نفس الكومبوننت بيخدم كل تصنيف فرعي
    subCategory?: string;
}

const PostsCategory: FunctionComponent<PostsCategoryProps> = ({
    category,
    subCategory,
}: PostsCategoryProps) => {
    const [postIdToUpdate, setPostIdToUpdate] = useState<string>('');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const { posts, setPosts, loading, refetch } = usePosts(
        category,
        subCategory,
    );

    const { auth } = useUser();
    const [showUpdateProductModal, setOnShowUpdateProductModal] =
        useState<boolean>(false);
    const [postToDelete, setPostToDelete] = useState<string>('');
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>(
        {},
    );
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const loadMoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const dir = handleRTL();

    const categoryKey = `${category}-${subCategory ?? ''}`;

    // Reset عند تغيير التصنيف (setState أثناء الـ render مسموح لنفس الكومبوننت)
    const [prevKey, setPrevKey] = useState(categoryKey);
    if (prevKey !== categoryKey) {
        setPrevKey(categoryKey);
        setVisibleCount(PAGE_SIZE);
        setSearchQuery('');
        setIsLoadingMore(false);
    }

    /* ---------- canonical path ---------- */

    const basePath = resolveCategoryPath(category);
    const canonicalPath = subCategory ? `${basePath}/${subCategory}` : basePath;
    const currentUrl = `${SITE_URL}${canonicalPath}`;

    // لو الرابط وصل بحالة أحرف مختلفة (/category/baby) حوّله للصحيح
    useEffect(() => {
        if (
            pathname !== canonicalPath &&
            pathname.toLowerCase() === canonicalPath.toLowerCase()
        ) {
            navigate(canonicalPath, { replace: true });
        }
    }, [pathname, canonicalPath, navigate]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
        setVisibleCount(PAGE_SIZE);
    }, []);

    // نظّف الـ timer عند تغيير التصنيف أو الـ unmount
    useEffect(() => {
        return () => {
            if (loadMoreTimerRef.current) {
                clearTimeout(loadMoreTimerRef.current);
                loadMoreTimerRef.current = null;
            }
        };
    }, [categoryKey]);

    const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
    const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

    const refreshAfterChange = () => {
        refetch();
    };

    const openDeleteModal = (productId: string) => {
        setPostToDelete(productId);
        setShowDeleteModal(true);
    };

    const postToDeleteData = useMemo(
        () => posts.find((post) => post._id === postToDelete),
        [posts, postToDelete],
    );

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
                productPrice.includes(searchLower)
            );
        });
    }, [posts, searchQuery]);

    const visibleProducts = useMemo(
        () => filteredProducts.slice(0, visibleCount),
        [filteredProducts, visibleCount],
    );

    const handleShowMore = useCallback(() => {
        if (isLoadingMore || visibleCount >= filteredProducts.length) {
            return;
        }

        setIsLoadingMore(true);

        loadMoreTimerRef.current = setTimeout(() => {
            setVisibleCount((prev) =>
                Math.min(prev + PAGE_SIZE, filteredProducts.length),
            );
            setIsLoadingMore(false);
            loadMoreTimerRef.current = null;
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

    const handleDelete = async (postId: string) => {
        try {
            await deletePost(postId);

            setPosts((prevPosts) =>
                prevPosts.filter((post) => post._id !== postId),
            );

            setPostToDelete('');
            setShowDeleteModal(false);
        } catch (err) {
            console.error(err);
            showError(t('modals.report.deletePost.error'));
        }
    };

    const isAdmin = auth?.role === RoleType.Admin;
    const isModerator = auth?.role === RoleType.Moderator;
    const canEdit = isAdmin || isModerator;

    // لو في subCategory، دور على ترجمة خاصة فيه أول، وإذا مش موجودة
    // ارجع لترجمة التصنيف الرئيسي (fallback)
   const categoryTitle = subCategory
    ? t(
          `categories.${category}.subCategoryPages.${subCategory}.heading`,
          t(`categories.${category}.heading`),
      )
    : t(`categories.${category}.heading`);

const categoryDescription = subCategory
    ? t(
          `categories.${category}.subCategoryPages.${subCategory}.description`,
          t(`categories.${category}.description`),
      )
    : t(`categories.${category}.description`);

const searchPlaceholder = subCategory
    ? t(
          `categories.${category}.subCategoryPages.${subCategory}.label`,
          t(`categories.${category}.label`),
      )
    : t(`categories.${category}.label`);

    /* ---------- head (React 19 بيرفعها للـ <head> تلقائياً) ---------- */

    const isEmpty = !loading && posts.length === 0;

    const head = (
        <>
            <title>{`${categoryTitle} | صفقة`}</title>
            <link rel='canonical' href={currentUrl} />
            <meta name='description' content={categoryDescription} />
            <meta property='og:url' content={currentUrl} />
            {isEmpty && <meta name='robots' content='noindex,follow' />}
        </>
    );

    if (loading)
        return (
            <>
                {head}
                <Loader />
            </>
        );

    if (isEmpty)
        return (
            <main dir={dir}>
                {head}
                <Container maxWidth='lg' sx={{ textAlign: 'center' }}>
                    <Typography
                        variant='h5'
                        color='text.secondary'
                        sx={{ mb: 3 }}
                    >
                        {t('categories.notFound')}
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
                        {t('common.refresh', 'تحديث الصفحة')}
                    </Button>
                </Container>
            </main>
        );

    // الـ structured data بيعكس التصنيف الفرعي الفعلي
    const generateCategory = generateCategoryJsonLd(
        subCategory ? `${category}/${subCategory}` : category,
        posts,
        getAbsolutePostUrl,
        currentUrl,
    );

    return (
        <Box component={'main'} p={3} dir={dir}>
            {head}

            <JsonLd data={generateCategory} />

            <Container maxWidth='lg'>
                {/* h1 ظاهر دايماً (Google بيفهرس بالموبايل أول) */}
                <Typography
                    component='h1'
                    sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        fontSize: { xs: '1.35rem', md: '1.6rem' },
                        mb: 1,
                    }}
                >
                    {categoryTitle}
                </Typography>

                {/* نص فعلي بالصفحة (بدونه الصفحة شبكة منتجات رفيعة) */}
                <Typography
                    variant='body1'
                    color='text.secondary'
                    sx={{ mb: 2, maxWidth: 800, lineHeight: 1.8 }}
                >
                    {categoryDescription}
                </Typography>
            </Container>

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
                        setSearchQuery={handleSearchChange}
                        text={searchPlaceholder}
                    />
                </Box>
            </Box>

            <Container maxWidth='lg'>
                <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ my: 3, px: { xs: 2, md: 0 } }}
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
                                    size={{ xs: 12, md: 6, lg: 3 }}
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
                                                prev.map((p) =>
                                                    p._id === updatedPost._id
                                                        ? updatedPost
                                                        : p,
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
                            {t('searchPage.search.tryAgain')}
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

            <AlertDialogs
                onConfirm={() => {
                    if (postToDelete) {
                        handleDelete(postToDelete);
                    }
                }}
                onHide={() => {
                    setPostToDelete('');
                    setShowDeleteModal(false);
                }}
                show={showDeleteModal}
                title={t('modals.report.deletePost.title', {
                    productName: postToDeleteData?.product_name || '',
                })}
                description={t('modals.report.deletePost.description', {
                    productName: postToDeleteData?.product_name || '',
                })}
            />

            <UpdateProductModal
                refresh={refreshAfterChange}
                postId={postIdToUpdate}
                show={showUpdateProductModal}
                onHide={() => onHideUpdateProductModal()}
            />
        </Box>
    );
};

export default PostsCategory;