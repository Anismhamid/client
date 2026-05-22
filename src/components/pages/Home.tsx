import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import DiscountsAndOffers from './products/DiscountsAndOffers';
import { useUser } from '../../context/useUSer';
import { deletePost } from '../../services/postsServices';
import Loader from '../../atoms/loader/Loader';
import {
    Button,
    CircularProgress,
    Box,
    Typography,
    Grid,
    Container,
    InputAdornment,
    TextField,
    Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import RoleType from '../../interfaces/UserType';
import { showError } from '../../atoms/toasts/ReactToast';
import UpdateProductModal from '../../atoms/productsManage/addAndUpdateProduct/UpdatePostModal';
import AlertDialogs from '../../atoms/toasts/Sweetalert';
import { useNavigate } from 'react-router-dom';
import { path } from '../../routes/routes';
import { useRef } from 'react';
import handleRTL from '../../locales/handleRTL';
import { useTranslation } from 'react-i18next';
import { productsAndCategories } from '../navbar/navCategoryies';
import { motion, AnimatePresence } from 'framer-motion';
import AddProductModal from '../../atoms/productsManage/addAndUpdateProduct/CreatePostModal';
import PostCard from './products/PostsCard';
import { Posts } from '../../interfaces/Posts';
import { useProducts } from '../../hooks/useProducts';
import ChipNavigation from '../navbar/ChepNavigation';

/**
 * Home page — redesigned with clean, minimal aesthetic
 */
const Home: FunctionComponent = () => {
    const { auth } = useUser();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [visibleProducts, setVisibleProducts] = useState<Posts[]>([]);
    const [visibleCount, setVisibleCount] = useState(16);
    const [productIdToUpdate, setProductIdToUpdate] = useState<string>('');
    const [showUpdateProductModal, setOnShowUpdateProductModal] =
        useState<boolean>(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const [productToDelete, setProductToDelete] = useState<string>('');
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>(
        {},
    );
    const [refresh, setRefresh] = useState<boolean>(false);
    const navigate = useNavigate();
    const [onShowAddModal, setOnShowAddModal] = useState<boolean>(false);
    const { posts } = useProducts();

    const showAddProductModal = () => setOnShowAddModal(true);
    const hideAddProductModal = () => setOnShowAddModal(false);

    const openDeleteModal = (name: string) => {
        setProductToDelete(name);
        setShowDeleteModal(true);
    };
    const closeDeleteModal = () => setShowDeleteModal(false);
    const openUpdatePostModal = () => setOnShowUpdateProductModal(true);
    const closeUpdatePostModal = () => setOnShowUpdateProductModal(false);
    const refreshAfterCange = () => setRefresh(!refresh);

    const handleToggleLike = (productId: string) => {
        if (!auth?._id) return;
        const userId = auth._id;
        setVisibleProducts((prev) =>
            prev.map((p) => {
                if (p._id !== productId) return p;
                const isLiked = p.likes?.includes(userId);
                return {
                    ...p,
                    likes: isLiked
                        ? p.likes?.filter((id) => id !== userId)
                        : [...(p.likes || []), userId],
                };
            }),
        );
    };

    useEffect(() => {
        setVisibleProducts(posts.slice(0, visibleCount));
        setLoading(false);
    }, [visibleCount, posts]);

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(posts)) return [];
        if (searchQuery === 'عروض') return posts.filter((p) => p.sale === true);
        const categoryKeys = productsAndCategories.map((cat) =>
            t(cat.labelKey),
        );
        if (categoryKeys.includes(searchQuery)) {
            return posts.filter((p) =>
                p.category?.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }
        return posts.filter((p) => {
            const name = p.product_name || '';
            const price = p.price || 0;
            const cat = p.category || '';
            return (
                name.includes(searchQuery) ||
                (searchQuery && price.toString().includes(searchQuery)) ||
                (searchQuery && cat.includes(searchQuery))
            );
        });
    }, [posts, searchQuery, t]);

    useEffect(() => {
        if (!observerRef.current || searchQuery) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    visibleCount < filteredProducts.length
                ) {
                    setVisibleCount((prev) => prev + 12);
                }
            },
            { threshold: 0.3, rootMargin: '100px' },
        );
        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [filteredProducts.length, visibleCount, searchQuery]);

    useEffect(() => {
        setVisibleProducts(filteredProducts.slice(0, visibleCount));
    }, [filteredProducts, visibleCount]);

    useEffect(() => {
        setVisibleCount(16);
    }, [searchQuery]);

    const handleDelete = (product_name: string) => {
        deletePost(product_name).catch((err) => {
            console.error(err);
            showError('שגיאה במחיקת המוצר!');
        });
    };

    if (loading) return <Loader />;

    const isAdmin = auth?.role === RoleType.Admin;
    const isModerator = auth?.role === RoleType.Moderator;
    const canEdit = isAdmin || isModerator;
    const currentUrl = window.location.origin;
    const diriction = handleRTL();

    return (
        <>
            <title>
                {t('home')} | {t('webPageName')}
            </title>
            <meta
                name='description'
                content='صفقة منصة إلكترونية لبيع وشراء المنتجات الجديدة والمستعملة بسهولة وأمان'
            />
            <link rel='canonical' href={currentUrl} />
            <meta
                property='og:title'
                content='صفقة | سوق إلكتروني لبيع وشراء المنتجات'
            />
            <meta
                property='og:description'
                content='بيع وشراء المنتجات بسهولة وأمان'
            />

            {/* ─── HERO ─── */}
            <Box
                dir={diriction}
                sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: { xs: 5, md: 7 },
                    px: { xs: 2, md: 4 },
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                }}
            >
                {/* Subtle dot-grid pattern */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                            'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                        pointerEvents: 'none',
                    }}
                />

                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        maxWidth: 580,
                        mx: 'auto',
                    }}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75,
                                px: 1.5,
                                py: 0.5,
                                mb: 3,
                                border: '1px solid',
                                borderColor: 'primary.light',
                                borderRadius: '99px',
                                bgcolor: 'primary.50',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    flexShrink: 0,
                                }}
                            />
                            <Typography
                                variant='caption'
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    letterSpacing: 0.4,
                                }}
                            >
                                سوق إلكتروني موثوق
                            </Typography>
                        </Box>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Typography
                            variant='h1'
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '2.4rem', md: '3.2rem' },
                                lineHeight: 1.15,
                                letterSpacing: '-1px',
                                color: 'text.primary',
                                mb: 2,
                            }}
                        >
                            🛒 {t('webPageName')}
                        </Typography>
                        <Typography
                            variant='body1'
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                lineHeight: 1.75,
                                mb: 4,
                            }}
                        >
                            {t('bestOffers')}
                        </Typography>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1.5,
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Button
                                variant='contained'
                                size='large'
                                startIcon={<AddIcon />}
                                onClick={showAddProductModal}
                                sx={{
                                    px: 3.5,
                                    py: 1.25,
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: 'none',
                                        opacity: 0.88,
                                    },
                                }}
                            >
                                {t('create-post')}
                            </Button>
                            <Button
                                variant='outlined'
                                size='large'
                                sx={{
                                    px: 3.5,
                                    py: 1.25,
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    borderWidth: '1.5px',
                                }}
                                onClick={() =>
                                    document
                                        .getElementById('products-section')
                                        ?.scrollIntoView({ behavior: 'smooth' })
                                }
                            >
                                {t('browse-posts') || 'تصفح المنتجات'}
                            </Button>
                        </Box>
                    </motion.div>
                </Box>
            </Box>

            {/* ─── STATS STRIP ─── */}
            <Box
                dir={diriction}
                sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                    py: 2.5,
                    px: { xs: 2, md: 4 },
                }}
            >
                <Container maxWidth='lg'>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: { xs: 3, md: 6 },
                            flexWrap: 'wrap',
                        }}
                    >
                        {[
                            { num: `${posts.length}+`, label: 'منتج نشط' },
                            { num: '٢٤/٧', label: 'دعم متواصل' },
                            { num: '١٠٠٪', label: 'آمن وموثوق' },
                        ].map((stat) => (
                            <Box key={stat.label} sx={{ textAlign: 'center' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: '1.25rem',
                                        color: 'text.primary',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {stat.num}
                                </Typography>
                                <Typography
                                    variant='caption'
                                    sx={{ color: 'text.secondary' }}
                                >
                                    {stat.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ─── MAIN CONTENT ─── */}
            <Box dir={diriction} component='main' id='products-section'>
                {/* Discounts */}
                {!searchQuery && <DiscountsAndOffers />}

                {/* ─── SEARCH + CATEGORIES ─── */}
                <Box
                    sx={{
                        pt: 4,
                        pb: 2,
                        px: { xs: 2, md: 4 },
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        bgcolor: 'background.paper',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Container maxWidth='lg'>
                        {/* Search */}
                        <TextField
                            fullWidth
                            size='small'
                            placeholder={t('search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <SearchIcon
                                            fontSize='small'
                                            sx={{ color: 'text.disabled' }}
                                        />
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: '10px',
                                    bgcolor: 'background.default',
                                    '& fieldset': { borderColor: 'divider' },
                                },
                            }}
                            sx={{ mb: 2 }}
                        />

                        {/* Category pills */}
                        <ChipNavigation />
                    </Container>
                </Box>

                {/* ─── PRODUCTS SECTION ─── */}
                <Container maxWidth='lg' sx={{ py: 4 }}>
                    {/* Results count */}
                    <AnimatePresence>
                        {searchQuery && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <Box
                                    sx={{
                                        mb: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        variant='body2'
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        نتائج البحث عن
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            fontWeight: 700,
                                            color: 'text.primary',
                                        }}
                                    >
                                        "{searchQuery}"
                                    </Typography>
                                    <Box
                                        sx={{
                                            ml: 1,
                                            px: 1.5,
                                            py: 0.25,
                                            bgcolor: 'primary.50',
                                            borderRadius: '99px',
                                            border: '1px solid',
                                            borderColor: 'primary.light',
                                        }}
                                    >
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                color: 'primary.main',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {filteredProducts.length} منتج
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Grid */}
                    <AnimatePresence mode='wait'>
                        {visibleProducts.length > 0 ? (
                            <Grid container spacing={2.5}>
                                {visibleProducts.map((product) => {
                                    const discountedPrice = product.sale
                                        ? product.price -
                                          (product.price *
                                              (product.discount || 0)) /
                                              100
                                        : product.price;

                                    return (
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                                md: 4,
                                                lg: 3,
                                            }}
                                            key={product._id}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 16 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.25 }}
                                                whileHover={{
                                                    y: -2,
                                                    transition: {
                                                        duration: 0.15,
                                                    },
                                                }}
                                            >
                                                <PostCard
                                                    post={product}
                                                    discountedPrice={
                                                        discountedPrice
                                                    }
                                                    canEdit={canEdit}
                                                    setPostIdToUpdate={
                                                        setProductIdToUpdate
                                                    }
                                                    onShowUpdateProductModal={
                                                        openUpdatePostModal
                                                    }
                                                    openDeleteModal={
                                                        openDeleteModal
                                                    }
                                                    setLoadedImages={
                                                        setLoadedImages
                                                    }
                                                    loadedImages={loadedImages}
                                                    category={product.category}
                                                    onLikeToggle={
                                                        handleToggleLike
                                                    }
                                                />
                                            </motion.div>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        ) : (
                            <motion.div
                                key='no-products'
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Box
                                    sx={{
                                        py: 8,
                                        textAlign: 'center',
                                        border: '1px dashed',
                                        borderColor: 'divider',
                                        borderRadius: '16px',
                                        maxWidth: 480,
                                        mx: 'auto',
                                        mt: 4,
                                    }}
                                >
                                    <Typography
                                        sx={{ fontSize: '2.5rem', mb: 2 }}
                                    >
                                        😔
                                    </Typography>
                                    <Typography
                                        variant='h6'
                                        sx={{ fontWeight: 700, mb: 1 }}
                                    >
                                        لم نجد ما تبحث عنه
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        sx={{ color: 'text.secondary', mb: 4 }}
                                    >
                                        جرب تصفح إحدى الفئات الشائعة
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            flexWrap: 'wrap',
                                            justifyContent: 'center',
                                            mb: 3,
                                        }}
                                    >
                                        {productsAndCategories
                                            .slice(0, 4)
                                            .map(({ labelKey }) => (
                                                <Chip
                                                    key={labelKey}
                                                    label={t(labelKey)}
                                                    // onClick={() =>
                                                    //     setSearchQuery(
                                                    //         t(labelKey),
                                                    //     )
                                                    // }
                                                    variant='outlined'
                                                    sx={{
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            ))}
                                    </Box>
                                    <Button
                                        variant='text'
                                        onClick={() => setSearchQuery('')}
                                        sx={{ fontWeight: 600 }}
                                    >
                                        👁️ عرض جميع المنتجات
                                    </Button>
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Container>

                {/* Load More */}
                {visibleCount < filteredProducts.length && (
                    <Box
                        ref={observerRef}
                        sx={{
                            height: 100,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1.5,
                        }}
                    >
                        <CircularProgress size={20} thickness={4} />
                        <Typography
                            variant='body2'
                            sx={{ color: 'text.secondary' }}
                        >
                            جاري التحميل...
                        </Typography>
                    </Box>
                )}

                {/* ─── CONTACT CTA ─── */}
                <Box
                    sx={{
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.default',
                        py: { xs: 6, md: 8 },
                        px: 2,
                        textAlign: 'center',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '14px',
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                            }}
                        >
                            <HeadsetMicIcon
                                sx={{ color: 'text.secondary', fontSize: 26 }}
                            />
                        </Box>
                        <Typography
                            variant='h5'
                            sx={{
                                fontWeight: 700,
                                mb: 1.5,
                                color: 'text.primary',
                            }}
                        >
                            نحن هنا لخدمتكم
                        </Typography>
                        <Typography
                            variant='body1'
                            sx={{
                                color: 'text.secondary',
                                maxWidth: 440,
                                mx: 'auto',
                                lineHeight: 1.75,
                                mb: 4,
                            }}
                        >
                            فريق الدعم لدينا متواجد على مدار الساعة لإجابة على
                            جميع أسئلتك وتقديم أفضل تجربة تسوق ممكنة
                        </Typography>
                        <Button
                            variant='contained'
                            size='large'
                            onClick={() => navigate(path.Contact)}
                            sx={{
                                px: 4,
                                py: 1.25,
                                borderRadius: '10px',
                                fontWeight: 700,
                                boxShadow: 'none',
                                '&:hover': { boxShadow: 'none', opacity: 0.88 },
                            }}
                        >
                            تواصل معنا
                        </Button>
                    </motion.div>
                </Box>
            </Box>

            {/* ─── MODALS ─── */}
            <UpdateProductModal
                refresh={refreshAfterCange}
                postId={productIdToUpdate}
                show={showUpdateProductModal}
                onHide={closeUpdatePostModal}
            />
            <AlertDialogs
                show={showDeleteModal}
                onHide={closeDeleteModal}
                title={'⚠️ تنبيه مهم!'}
                description={`هل أنت متأكد من رغبتك في حذف المنتج "${productToDelete}"؟ هذا الإجراء لا يمكن التراجع عنه`}
                handleDelete={() => handleDelete(productToDelete)}
            />
            <AddProductModal
                show={onShowAddModal}
                onHide={hideAddProductModal}
            />
        </>
    );
};

export default Home;
