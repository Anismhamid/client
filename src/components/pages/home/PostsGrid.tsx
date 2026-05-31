// components/home/ProductsGrid.tsx
import { useRef, useMemo, useState, useEffect, FunctionComponent } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Grid,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Posts } from '../../../interfaces/Posts';
import { productsAndCategories } from '../../navbar/navCategoryies';
import ChipNavigation from '../../navbar/ChepNavigation';
import PostCard from '../products/PostsCard';

interface PostGridProps {
    posts: Posts[];
    canEdit: boolean;
    onSetPostIdToUpdate: (id: string) => void;
    onShowUpdateModal: () => void;
    onOpenDeleteModal: (name: string) => void;
    onLikeToggle: (id: string) => void;
}

const INITIAL_VISIBLE = 16;
const LOAD_MORE_STEP = 12;

const PostGrid:FunctionComponent<PostGridProps> = ({
    posts,
    canEdit,
    onSetPostIdToUpdate,
    onShowUpdateModal,
    onOpenDeleteModal,
    onLikeToggle,
}: PostGridProps) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
    const observerRef = useRef<HTMLDivElement | null>(null);

    // Reset visible count on new search
    // useEffect(() => {
    //     setVisibleCount(INITIAL_VISIBLE);
    // }, [searchQuery]);

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(posts)) return [];
        if (searchQuery === 'عروض') return posts.filter((p) => p.sale === true);

        const categoryKeys = productsAndCategories.map((cat) => t(cat.labelKey));
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

    const visibleProducts = useMemo(
        () => filteredProducts.slice(0, visibleCount),
        [filteredProducts, visibleCount],
    );

    // Infinite scroll observer
    useEffect(() => {
        if (!observerRef.current || searchQuery) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
                    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
                }
            },
            { threshold: 0.3, rootMargin: '100px' },
        );
        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [filteredProducts.length, visibleCount, searchQuery]);

    return (
        <>
            {/* Search + Categories — sticky bar */}
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
                <Container maxWidth="lg">
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={t('search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
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
                    <ChipNavigation />
                </Container>
            </Box>

            {/* Products Grid */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Results count */}
                <AnimatePresence>
                    {searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    نتائج البحث عن
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
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
                                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
                                        {filteredProducts.length} منتج
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Grid or Empty State */}
                <AnimatePresence mode="wait">
                    {visibleProducts.length > 0 ? (
                        <Grid container spacing={2.5}>
                            {visibleProducts.map((post) => {
                                const discountedPrice = post.sale
                                    ? post.price - (post.price * (post.discount || 0)) / 100
                                    : post.price;

                                return (
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={post._id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25 }}
                                            whileHover={{ y: -2, transition: { duration: 0.15 } }}
                                        >
                                            <PostCard
                                                post={post}
                                                discountedPrice={discountedPrice}
                                                canEdit={canEdit}
                                                setPostIdToUpdate={() => onSetPostIdToUpdate(post._id as string)}
                                                onShowUpdateProductModal={onShowUpdateModal}
                                                openDeleteModal={onOpenDeleteModal}
                                                setLoadedImages={setLoadedImages}
                                                loadedImages={loadedImages}
                                                category={post.category}
                                                onLikeToggle={onLikeToggle}
                                            />
                                        </motion.div>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ) : (
                        <motion.div
                            key="no-products"
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
                                <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>😔</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    لم نجد ما تبحث عنه
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
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
                                    {productsAndCategories.slice(0, 4).map(({ labelKey }) => (
                                        <Chip
                                            key={labelKey}
                                            label={t(labelKey)}
                                            variant="outlined"
                                            sx={{ borderRadius: '8px', cursor: 'pointer' }}
                                        />
                                    ))}
                                </Box>
                                <Button
                                    variant="text"
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

            {/* Load More Indicator */}
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
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        جاري التحميل...
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default PostGrid;