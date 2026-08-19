import { useEffect, useState } from 'react';
import axios from 'axios';

import {
    Box,
    CircularProgress,
    Typography,
    Chip,
    Stack,
    Card,
    CardMedia,
    CardContent,
} from '@mui/material';

import { Link, useSearchParams } from 'react-router-dom';

import { Posts } from '../interfaces/Posts';
import { productsPathes } from '../routes/routes';
import handleRTL from '../locales/handleRTL';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../helpers/dateAndPriceFormat';

const API_URL = import.meta.env.VITE_API_URL;

interface SearchFilters {
    query: string | null;
    brand: string | null;
    model: string | null;
    category: string | null;
    type: string | null;
    subcategory: string | null;
    storage: string | null;
    condition: string | null;
    fuel: string | null;
    maxPrice: number | null;
    minPrice: number | null;
    currency: string | null;
    location: string | null;
    nearMe: boolean | null;
}

interface SearchResponse {
    success: boolean;
    filters: SearchFilters;
    count: number;
    posts: Posts[];
}

const SearchPage = () => {
    const [searchParams] = useSearchParams();

    const query = searchParams.get('q')?.trim() || '';

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Posts[]>([]);
    const [filters, setFilters] = useState<SearchFilters | null>(null);
    const [error, setError] = useState(false);

    const { t } = useTranslation();
    const direction = handleRTL();

    useEffect(() => {
        if (!query) {
            setResults([]);
            setFilters(null);
            return;
        }

        const search = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await axios.post<SearchResponse>(
                    `${API_URL}/ai/search`,
                    {
                        query,
                    },
                );

                console.log('🔎 SearchPage AI response:', response.data);

                setResults(
                    Array.isArray(response.data?.posts)
                        ? response.data.posts
                        : [],
                );

                setFilters(response.data?.filters ?? null);
            } catch (error) {
                console.error('❌ SearchPage error:', error);

                setResults([]);
                setFilters(null);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        search();
    }, [query]);

    const getProductUrl = (post: Posts) => {
        return (
            `${productsPathes.postsDetails}/` +
            `${post.category}/` +
            `${post.brand}/` +
            `${post._id}`
        );
    };

    return (
        <Box
            component='main'
            dir={direction}
            sx={{
                width: '100%',
                maxWidth: 1400,
                mx: 'auto',
                px: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                },
                py: 4,
            }}
        >
            {/* HEADER */}

            <Typography
                variant='h4'
                fontWeight={800}
                sx={{
                    mb: 1,
                }}
            >
                {t('searchPage.title')}
            </Typography>

            <Typography color='text.secondary' sx={{ mb: 3 }}>
                {t('searchPage.searchFor')}{' '}
                <Typography
                    component='span'
                    fontWeight={700}
                    color='text.primary'
                >
                    {query}
                </Typography>
            </Typography>

            {/* LOADING */}

            {loading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        py: 10,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {/* ERROR */}

            {!loading && error && (
                <Typography
                    color='error'
                    sx={{
                        py: 5,
                    }}
                >
                    {t('searchPage.error')}
                </Typography>
            )}

            {/* FILTERS */}

            {!loading && !error && filters && (
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant='subtitle1'
                        fontWeight={800}
                        sx={{
                            mb: 1.5,
                        }}
                    >
                        {t('searchPage.detectedFilters')}
                    </Typography>

                    <Stack
                        direction='row'
                        spacing={1}
                        flexWrap='wrap'
                        useFlexGap
                    >
                        {filters.category && (
                            <Chip
                                label={`${t('searchPage.filters.category')}: ${filters.category}`}
                            />
                        )}

                        {filters.type && (
                            <Chip
                                label={`${t('searchPage.filters.type')}: ${filters.type}`}
                            />
                        )}

                        {filters.brand && (
                            <Chip
                                label={`${t('searchPage.filters.brand')}: ${filters.brand}`}
                            />
                        )}

                        {filters.model && (
                            <Chip
                                label={`${t('searchPage.filters.model')}: ${filters.model}`}
                            />
                        )}

                        {filters.storage && (
                            <Chip
                                label={`${t('searchPage.filters.storage')}: ${filters.storage}`}
                            />
                        )}

                        {filters.condition && (
                            <Chip
                                label={`${t('searchPage.filters.condition')}: ${filters.condition}`}
                            />
                        )}

                        {filters.fuel && (
                            <Chip
                                label={`${t('searchPage.filters.fuel')}: ${filters.fuel}`}
                            />
                        )}

                        {filters.minPrice !== null && (
                            <Chip
                                label={`${t('searchPage.filters.minPrice')} ${filters.minPrice} ${t(
                                    'postCard.priceCurrency',
                                )}`}
                            />
                        )}

                        {filters.maxPrice !== null && (
                            <Chip
                                label={`${t('searchPage.filters.maxPrice')} ${filters.maxPrice} ${t(
                                    'postCard.priceCurrency',
                                )}`}
                            />
                        )}

                        {filters.location && (
                            <Chip
                                label={`${t('searchPage.filters.location')}: ${filters.location}`}
                            />
                        )}

                        {filters.nearMe && (
                            <Chip label={t('searchPage.filters.nearMe')} />
                        )}
                    </Stack>
                </Box>
            )}

            {/* COUNT */}

            {!loading && !error && (
                <Typography
                    variant='h6'
                    fontWeight={800}
                    sx={{
                        mb: 2,
                    }}
                >
                    {t('searchPage.resultsCount', { count: results.length })}
                </Typography>
            )}

            {/* RESULTS */}

            {!loading && !error && results.length > 0 && (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        },
                        gap: 2,
                    }}
                >
                    {results.map((post) => (
                        <Link
                            key={post._id}
                            to={getProductUrl(post)}
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            <Card
                                sx={{
                                    height: '100%',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    transition:
                                        'transform .2s ease, box-shadow .2s ease',

                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 5,
                                    },
                                }}
                            >
                                {post.image?.url?.trim() && (
                                    <CardMedia
                                        component='img'
                                        height='220'
                                        image={post.image.url}
                                        alt={
                                            post.product_name ||
                                            t('searchPage.product')
                                        }
                                        sx={{
                                            objectFit: 'cover',
                                        }}
                                    />
                                )}

                                <CardContent>
                                    <Typography
                                        variant='h6'
                                        fontWeight={800}
                                        noWrap
                                    >
                                        {formatPrice(post.price)}{' '}
                                        {t('postCard.priceCurrency')}
                                    </Typography>

                                    {post.description && (
                                        <Typography
                                            variant='body2'
                                            color='text.secondary'
                                            sx={{
                                                mt: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {post.description}
                                        </Typography>
                                    )}

                                    {typeof post.price === 'number' &&
                                        Number.isFinite(post.price) && (
                                            <Typography
                                                variant='h6'
                                                fontWeight={900}
                                                sx={{
                                                    mt: 2,
                                                }}
                                            >
                                                {formatPrice(post.price)}
                                            </Typography>
                                        )}

                                    {post.location && (
                                        <Typography
                                            variant='body2'
                                            color='text.secondary'
                                            sx={{
                                                mt: 1,
                                            }}
                                        >
                                            📍 {post.location}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </Box>
            )}

            {/* NO RESULTS */}

            {!loading && !error && query && results.length === 0 && (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                    }}
                >
                    <Typography variant='h6' fontWeight={700}>
                        {t('searchPage.noResults')}
                    </Typography>

                    <Typography color='text.secondary' sx={{ mt: 1 }}>
                        {t('searchPage.tryDifferent')}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default SearchPage;
