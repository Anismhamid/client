import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import axios from 'axios';

import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    CircularProgress,
    Chip,
    Stack,
    Paper,
    Typography,
    Fade,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { path } from '../routes/routes';

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
}

const AISearch = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<SearchFilters | null>(null);
    const [openSuggestions, setOpenSuggestions] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    /**
     * --------------------------------------------------------
     * Clear search when route changes
     * --------------------------------------------------------
     */
    useEffect(() => {
        setQuery('');
        setFilters(null);
        setOpenSuggestions(false);
    }, [location.pathname]);

    /**
     * --------------------------------------------------------
     * Execute AI Search
     * --------------------------------------------------------
     */
    const handleSearch = async (searchValue?: string) => {
        const value = (searchValue ?? query).trim();

        if (!value || loading) {
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post<SearchResponse>(
                `${API_URL}/ai/search`,
                {
                    query: value,
                },
            );

            setFilters(response.data?.filters ?? null);

            // مهم: الانتقال حتى لو ما رجعت posts
            navigate(`${path.Search}?q=${encodeURIComponent(value)}`);
            setOpenSuggestions(false);
        } catch (error: unknown) {
            console.error('❌ AI search failed:', error);

            // ننتقل إلى صفحة البحث حتى لو الـ API فشل
            navigate(`${path.Search}?q=${encodeURIComponent(value)}`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * --------------------------------------------------------
     * Keyboard
     * --------------------------------------------------------
     */
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }

        if (event.key === 'Escape') {
            setOpenSuggestions(false);
        }
    };

    /**
     * --------------------------------------------------------
     * Clear
     * --------------------------------------------------------
     */
    const clearSearch = () => {
        setQuery('');
        setFilters(null);
        setOpenSuggestions(false);

        inputRef.current?.focus();
    };

    /**
     * --------------------------------------------------------
     * Example searches
     * --------------------------------------------------------
     */
    const examples = [
        t('searchPage.search.examples.iphone'),
        t('searchPage.search.examples.car'),
        t('searchPage.search.examples.hebrew'),
        t('searchPage.search.examples.samsung'),
    ];

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 1100,

                mx: 'auto',
                px: {
                    xs: 1,
                    sm: 2,
                    md: 3,
                },
                py: {
                    xs: 1.5,
                    md: 2,
                },
                position: 'relative',
            }}
        >
            {/* ================================================= */}
            {/* SEARCH BAR */}
            {/* ================================================= */}

            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <TextField
                    inputRef={inputRef}
                    fullWidth
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setOpenSuggestions(
                            event.target.value.trim().length > 0,
                        );
                    }}
                    onFocus={() => {
                        if (query.trim()) {
                            setOpenSuggestions(true);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    placeholder={t('searchPage.search.placeholder')}
                    inputProps={{
                        'aria-label': t('searchPage.search.placeholder'),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 4,
                            backgroundColor: 'background.paper',
                            minHeight: 54,

                            transition: 'all .25s ease',

                            '&:hover': {
                                boxShadow: '0 4px 20px rgba(245, 159, 11, .12)',
                            },

                            '&.Mui-focused': {
                                boxShadow: '0 4px 25px rgba(245, 159, 11, .18)',
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                {loading ? (
                                    <CircularProgress size={22} />
                                ) : (
                                    <SearchIcon />
                                )}
                            </InputAdornment>
                        ),

                        endAdornment: query ? (
                            <InputAdornment position='end'>
                                <IconButton
                                    onClick={clearSearch}
                                    disabled={loading}
                                    aria-label={t('searchPage.search.clear')}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        ) : undefined,
                    }}
                />

                <Button
                    variant='contained'
                    onClick={() => handleSearch()}
                    disabled={loading || !query.trim()}
                    sx={{
                        height: 54,
                        px: {
                            xs: 2,
                            md: 4,
                        },
                        borderRadius: 4,
                        whiteSpace: 'nowrap',
                        fontWeight: 700,
                    }}
                >
                    {loading ? (
                        <CircularProgress size={22} color='inherit' />
                    ) : (
                        t('searchPage.search.button')
                    )}
                </Button>
            </Box>

            {/* ================================================= */}
            {/* SUGGESTIONS */}
            {/* ================================================= */}

            <Fade in={openSuggestions}>
                <Paper
                    elevation={8}
                    sx={{
                        position: 'absolute',
                        top: 'calc(100% - 4px)',
                        left: {
                            xs: 8,
                            sm: 16,
                            md: 24,
                        },
                        right: {
                            xs: 8,
                            sm: 16,
                            md: 24,
                        },
                        zIndex: 1500,
                        borderRadius: 3,
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{
                                display: 'block',
                                mb: 1.5,
                                fontWeight: 700,
                            }}
                        >
                            {t('searchPage.search.suggestions')}{' '}
                        </Typography>

                        <Stack
                            direction='row'
                            spacing={1}
                            flexWrap='wrap'
                            useFlexGap
                        >
                            {examples.map((example) => (
                                <Chip
                                    key={example}
                                    label={example}
                                    icon={<SearchIcon />}
                                    onClick={() => {
                                        setQuery(example);
                                        handleSearch(example);
                                    }}
                                    sx={{
                                        cursor: 'pointer',
                                        mb: 0.5,
                                    }}
                                />
                            ))}
                        </Stack>

                        {/* Detected filters */}
                        {filters && (
                            <Box sx={{ mt: 2 }}>
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                    }}
                                >
                                    {t('searchPage.search.detectedFilters')}
                                </Typography>

                                <Stack
                                    direction='row'
                                    spacing={1}
                                    flexWrap='wrap'
                                    useFlexGap
                                >
                                    {filters.category && (
                                        <Chip
                                            size='small'
                                            label={`${t('search.filters.category')}: ${filters.category}`}
                                        />
                                    )}

                                    {filters.brand && (
                                        <Chip
                                            size='small'
                                            label={`${t('search.filters.brand')}: ${filters.brand}`}
                                        />
                                    )}

                                    {filters.model && (
                                        <Chip
                                            size='small'
                                            label={`${t('search.filters.model')}: ${filters.model}`}
                                        />
                                    )}

                                    {filters.storage && (
                                        <Chip
                                            size='small'
                                            label={`${t('search.filters.storage')}: ${filters.storage}`}
                                        />
                                    )}

                                    {filters.fuel && (
                                        <Chip
                                            size='small'
                                            label={`${t('search.filters.fuel')}: ${filters.fuel}`}
                                        />
                                    )}

                                    {filters.condition && (
                                        <Chip
                                            size='small'
                                            label={`${t('search.filters.condition')}: ${filters.condition}`}
                                        />
                                    )}
                                </Stack>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
};

export default AISearch;
