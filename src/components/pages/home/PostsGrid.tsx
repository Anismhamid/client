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
    Typography,
} from '@mui/material';

import SearchOffIcon from '@mui/icons-material/SearchOff';

import { motion, AnimatePresence } from 'framer-motion';

import { useTranslation } from 'react-i18next';

import { Posts } from '../../../interfaces/Posts';

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

    const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE);

    const observerRef = useRef<HTMLDivElement | null>(null);

    /* =========================================================
       SAFE POSTS
       ========================================================= */

    const safePosts = useMemo(() => {
        if (!Array.isArray(posts)) {
            return [];
        }

        return posts.filter((post): post is Posts & { _id: string } =>
            Boolean(post?._id),
        );
    }, [posts]);

    const visibleProducts = useMemo(() => {
        return safePosts.slice(0, visibleCount);
    }, [safePosts, visibleCount]);

    /* =========================================================
       LOAD MORE
       ========================================================= */

    const hasMore = visibleCount < safePosts.length;

    const handleLoadMore = useCallback(() => {
        setVisibleCount((previousCount) => {
            if (previousCount >= safePosts.length) {
                return previousCount;
            }

            return Math.min(previousCount + LOAD_MORE_STEP, safePosts.length);
        });
    }, [safePosts.length]);

    /* =========================================================
       INFINITE SCROLL
       ========================================================= */

    useEffect(() => {
        const target = observerRef.current;

        if (!target || !hasMore) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (entry?.isIntersecting) {
                    handleLoadMore();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '150px',
            },
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [handleLoadMore, hasMore]);

    const isEmpty = safePosts.length === 0;

    return (
        <Container>
            {/* =================================================
                SEO
               ================================================= */}

            <JsonLd
                data={generateProductsItemListJsonLd(safePosts.slice(0, 20))}
            />

            {/* =================================================
                PRODUCTS
               ================================================= */}

            <Container
                maxWidth='lg'
                sx={{
                    py: 4,
                }}
                id={'products-section'}
            >
                <AnimatePresence mode='wait'>
                    {!isEmpty ? (
                        <Grid container spacing={2.5}>
                            {visibleProducts.map((post, index) => {
                                /* -------------------------
                                       DISCOUNT
                                       ------------------------- */

                                const discountedPrice = post.sale
                                    ? post.price -
                                      (post.price * (post.discount || 0)) / 100
                                    : post.price;

                                return (
                                    <Grid
                                        key={post._id}
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                            md: 4,
                                            lg: 3,
                                        }}
                                    >
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: 10,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                duration: 0.35,

                                                delay:
                                                    Math.min(
                                                        index % LOAD_MORE_STEP,
                                                        12,
                                                    ) * 0.03,
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
                        /* =================================================
                           EMPTY STATE
                           ================================================= */

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
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mb: 2,
                                }}
                            >
                                <SealBadge size={56} rotate={0} tone='outline'>
                                    <SearchOffIcon
                                        sx={{
                                            fontSize: 24,
                                        }}
                                    />
                                </SealBadge>
                            </Box>

                            <Typography variant='h6' fontWeight={600}>
                                {t('search.noResults', 'لا توجد نتائج')}
                            </Typography>

                            <Typography
                                variant='body2'
                                color='text.secondary'
                                sx={{
                                    mt: 1,
                                }}
                            >
                                {t(
                                    'search.tryAnother',
                                    'جرّب البحث باستخدام كلمات أخرى',
                                )}
                            </Typography>
                        </Box>
                    )}
                </AnimatePresence>

                {/* =================================================
                    INFINITE SCROLL LOADER
                   ================================================= */}

                {hasMore && (
                    <Box
                        ref={observerRef}
                        sx={{
                            py: 4,

                            display: 'flex',
                            justifyContent: 'center',

                            minHeight: 60,
                        }}
                    >
                        <CircularProgress size={20} />
                    </Box>
                )}
            </Container>
        </Container>
    );
};

export default PostGrid;
