// components/AISearch.tsx

import { useState, type KeyboardEvent } from 'react';
import axios from 'axios';

import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    CircularProgress,
    Chip,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Stack,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

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

interface PostImage {
    url?: string;
    publicId?: string;
}

interface Post {
    _id: string;
    product_name?: string;
    description?: string;
    price?: number;
    location?: string;
    image?: PostImage;
}

interface SearchResponse {
    success: boolean;
    filters: SearchFilters;
    count: number;
    posts: Post[];
}

const AISearch = () => {
    const [query, setQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<Post[]>([]);
    const [filters, setFilters] =
        useState<SearchFilters | null>(null);
    const [searched, setSearched] =
        useState<boolean>(false);

    const handleSearch = async (): Promise<void> => {
        const value = query.trim();

        if (!value || loading) {
            return;
        }

        try {
            setLoading(true);
            setSearched(true);

            const response =
                await axios.post<SearchResponse>(
                    `${API_URL}/ai/search`,
                    {
                        query: value,
                    }
                );

            setResults(response.data.posts || []);
            setFilters(response.data.filters || null);
        } catch (error) {
            console.error(
                'AI search error:',
                error
            );

            setResults([]);
            setFilters(null);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (
        event: KeyboardEvent<
            HTMLDivElement
        >
    ): void => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const clearSearch = (): void => {
        setQuery('');
        setResults([]);
        setFilters(null);
        setSearched(false);
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 1100,
                mx: 'auto',
                px: {
                    xs: 2,
                    md: 3,
                },
                py: 3,
            }}
        >
            {/* SEARCH BAR */}

            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <TextField
                    fullWidth
                    value={query}
                    onChange={(event) =>
                        setQuery(
                            event.target.value
                        )
                    }
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    placeholder="ابحث عن أي شيء... سيارة، آيفون، شقة، لابتوب..."
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor:
                                'background.paper',
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {loading ? (
                                    <CircularProgress
                                        size={22}
                                    />
                                ) : (
                                    <SearchIcon />
                                )}
                            </InputAdornment>
                        ),

                        endAdornment: query ? (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={
                                        clearSearch
                                    }
                                    disabled={
                                        loading
                                    }
                                    aria-label="مسح البحث"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        ) : undefined,
                    }}
                />

                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={
                        loading ||
                        !query.trim()
                    }
                    sx={{
                        height: 56,
                        px: {
                            xs: 2,
                            md: 4,
                        },
                        borderRadius: 3,
                        whiteSpace:
                            'nowrap',
                        fontWeight: 700,
                    }}
                >
                    {loading ? (
                        <CircularProgress
                            size={22}
                            color="inherit"
                        />
                    ) : (
                        'بحث'
                    )}
                </Button>
            </Box>

            {/* DETECTED FILTERS */}

            {filters && (
                <Box sx={{ mt: 2 }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                    >
                        {filters.category && (
                            <Chip
                                label={
                                    filters.category
                                }
                                size="small"
                            />
                        )}

                        {filters.type && (
                            <Chip
                                label={
                                    filters.type
                                }
                                size="small"
                            />
                        )}

                        {filters.brand && (
                            <Chip
                                label={
                                    filters.brand
                                }
                                size="small"
                            />
                        )}

                        {filters.model && (
                            <Chip
                                label={
                                    filters.model
                                }
                                size="small"
                            />
                        )}

                        {filters.storage && (
                            <Chip
                                label={
                                    filters.storage
                                }
                                size="small"
                            />
                        )}

                        {filters.condition && (
                            <Chip
                                label={
                                    filters.condition
                                }
                                size="small"
                            />
                        )}

                        {filters.fuel && (
                            <Chip
                                label={
                                    filters.fuel
                                }
                                size="small"
                            />
                        )}

                        {filters.minPrice !==
                            null && (
                            <Chip
                                label={`من ${filters.minPrice}`}
                                size="small"
                            />
                        )}

                        {filters.maxPrice !==
                            null && (
                            <Chip
                                label={`حتى ${filters.maxPrice}`}
                                size="small"
                            />
                        )}

                        {filters.location && (
                            <Chip
                                label={
                                    filters.location
                                }
                                size="small"
                            />
                        )}

                        {filters.nearMe && (
                            <Chip
                                label="قريب مني"
                                size="small"
                            />
                        )}
                    </Stack>
                </Box>
            )}

            {/* RESULTS */}

            {searched && !loading && (
                <Typography
                    sx={{
                        mt: 3,
                        mb: 2,
                        fontWeight: 700,
                    }}
                >
                    {results.length === 0
                        ? 'لا توجد نتائج'
                        : `${results.length} نتيجة`}
                </Typography>
            )}

            {/* RESULTS GRID */}

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
                    <Card
                        key={post._id}
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            height: '100%',
                        }}
                    >
                        {post.image?.url && (
                            <CardMedia
                                component="img"
                                height="220"
                                image={
                                    post.image.url
                                }
                                alt={
                                    post.product_name ||
                                    'Product'
                                }
                                sx={{
                                    objectFit:
                                        'cover',
                                }}
                            />
                        )}

                        <CardContent>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                noWrap
                            >
                                {
                                    post.product_name
                                }
                            </Typography>

                            {post.description && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 1,
                                    }}
                                >
                                    {
                                        post.description
                                    }
                                </Typography>
                            )}

                            {post.price !==
                                undefined && (
                                <Typography
                                    variant="h6"
                                    fontWeight={800}
                                    sx={{
                                        mt: 2,
                                    }}
                                >
                                    {post.price.toLocaleString()}{' '}
                                    ₪
                                </Typography>
                            )}

                            {post.location && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 1,
                                    }}
                                >
                                    📍{' '}
                                    {
                                        post.location
                                    }
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default AISearch;