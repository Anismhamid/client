// components/home/ProductsGrid.tsx
import {
    useRef,
    useMemo,
    useState,
    useEffect,
    FunctionComponent,
    useCallback,
} from 'react';
import {
    Box,
    CircularProgress,
    Container,
    Grid,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Posts } from '../../../interfaces/Posts';
import { productsAndCategories } from '../../navbar/navCategoryies';
import ChipNavigation from '../../navbar/ChepNavigation';
import PostCard from '../products/PostsCard';
import JsonLd from '../../../../utils/JsonLd';
import { generateProductsItemListJsonLd } from '../../../../utils/structuredData';
import SealBadge from './SealBadge';

interface PostGridProps {
    posts: Posts[];
    canEdit: boolean;
    featured?: boolean;
    onSetPostIdToUpdate: (id: string) => void;
    onShowUpdateModal: () => void;
    onOpenDeleteModal: (name: string) => void;
    onLikeToggle: (id: string, liked?: boolean) => void;
}

const INITIAL_VISIBLE = 16;
const LOAD_MORE_STEP = 12;

const PostGrid: FunctionComponent<PostGridProps> = ({
    posts,
    canEdit,
    onSetPostIdToUpdate,
    onShowUpdateModal,
    onOpenDeleteModal,
    onLikeToggle,
}) => {
    const { t } = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
    const observerRef = useRef<HTMLDivElement | null>(null);

    /* ---------------- SAFE POSTS ---------------- */
    const safePosts = useMemo(() => {
        return Array.isArray(posts)
            ? posts.filter((p): p is Posts & { _id: string } => Boolean(p?._id))
            : [];
    }, [posts]);

    /* ---------------- FILTER ---------------- */
    const filteredProducts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!safePosts.length) return [];

        if (!q) return safePosts;

        if (q === 'عروض') {
            return safePosts.filter((p) => p.sale === true);
        }

        const categoryKeys = productsAndCategories.map((cat) =>
            t(cat.labelKey),
        );

        if (categoryKeys.includes(searchQuery)) {
            return safePosts.filter((p) =>
                (p.category || '').toLowerCase().includes(q),
            );
        }

        return safePosts.filter((p) => {
            return (
                (p.product_name || '').toLowerCase().includes(q) ||
                (p.description || '').toLowerCase().includes(q) ||
                (p.category || '').toLowerCase().includes(q) ||
                String(p.price || '').includes(q) ||
                (p.seller?.name?.first || '').toLowerCase().includes(q)
            );
        });
    }, [safePosts, searchQuery, t]);

    /* ---------------- PAGINATION ---------------- */
    const visibleProducts = useMemo(() => {
        return filteredProducts.slice(0, visibleCount);
    }, [filteredProducts, visibleCount]);


    const handleLoadMore = useCallback(() => {
        setVisibleCount((prev) => {
            if (prev >= filteredProducts.length) return prev;
            return prev + LOAD_MORE_STEP;
        });
    }, [filteredProducts.length]);

    /* ---------------- INFINITE SCROLL ---------------- */
    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    handleLoadMore();
                }
            },
            { threshold: 0.1, rootMargin: '150px' },
        );

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [handleLoadMore]);

    return (
        <>
            <JsonLd data={generateProductsItemListJsonLd(posts.slice(0, 20))} />

            {/* SEARCH */}
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
                }}
            >
                <Container maxWidth='lg'>
                    <Box
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '14px',
                            p: 1,
                            bgcolor: 'background.default',
                        }}
                    >
                        <TextField
                            fullWidth
                            size='small'
                            placeholder={t('search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <SearchIcon fontSize='small' />
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: '10px',
                                    bgcolor: 'background.paper',
                                },
                            }}
                        />
                    </Box>
                    <Box sx={{ mt: 1.5 }}>
                        <ChipNavigation />
                    </Box>
                </Container>
            </Box>

            {/* GRID */}
            <Container maxWidth='lg' sx={{ py: 4 }}>
                <AnimatePresence mode='wait'>
                    {visibleProducts.length > 0 ? (
                        <Grid container spacing={2.5}>
                            {visibleProducts.map((post, index) => {
                                const discountedPrice = post.sale
                                    ? post.price -
                                      (post.price * (post.discount || 0)) / 100
                                    : post.price;

                                return (
                                    <Grid
                                        key={post._id}
                                        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.35,
                                                delay: Math.min(index % LOAD_MORE_STEP, 12) * 0.03,
                                            }}
                                        >
                                            <PostCard
                                                post={post}
                                                featured={post.featured}
                                                discountedPrice={
                                                    discountedPrice
                                                }
                                                canEdit={canEdit}
                                                setPostIdToUpdate={() =>
                                                    onSetPostIdToUpdate(
                                                        post._id,
                                                    )
                                                }
                                                onShowUpdateProductModal={
                                                    onShowUpdateModal
                                                }
                                                openDeleteModal={
                                                    onOpenDeleteModal
                                                }
                                                category={post.category}
                                                onLikeToggle={onLikeToggle}
                                            />
                                        </motion.div>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ) : (
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                px: 3,
                                border: '1px dashed',
                                borderColor: 'divider',
                                borderRadius: '16px',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <SealBadge size={56} rotate={0} tone='outline'>
                                    <SearchOffIcon sx={{ fontSize: 24 }} />
                                </SealBadge>
                            </Box>
                            <Typography variant='h6'>لا توجد نتائج</Typography>
                        </Box>
                    )}
                </AnimatePresence>

                {/* LOADER */}
                {visibleCount < filteredProducts.length && (
                    <Box
                        ref={observerRef}
                        sx={{
                            py: 4,
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress size={20} />
                    </Box>
                )}
            </Container>
        </>
    );
};

export default PostGrid;