import { useRef, useState, type KeyboardEvent } from 'react';

import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Chip,
    Stack,
    Paper,
    Typography,
    Fade,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { path } from '../routes/routes';

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

const AISearch = () => {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilters | null>(null);
    const [openSuggestions, setOpenSuggestions] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { t } = useTranslation();
    const navigate = useNavigate();

    /**
     * --------------------------------------------------------
     * Execute Search
     * --------------------------------------------------------
     */
    const handleSearch = (searchValue?: string) => {
        const value = (searchValue ?? query).trim();

        if (!value) return;

        setOpenSuggestions(false);

        navigate(`${path.Search}?q=${encodeURIComponent(value)}`);
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
                maxWidth: 500,
                mx: 'auto',
                px: {
                    xs: 4,
                    sm: 2,
                    md: 3,
                },
                py: {
                    xs: 1.5,
                    md: 2,
                },
                position: 'sticky',
                top: 0,
                zIndex: 1000,
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
                        const value = event.target.value;

                        setQuery(value);
                        setOpenSuggestions(value.trim().length > 0);
                    }}
                    onFocus={() => {
                        if (query.trim()) {
                            setOpenSuggestions(true);
                        }
                    }}
                    onKeyDown={handleKeyDown}
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
                                <SearchIcon />
                            </InputAdornment>
                        ),

                        endAdornment: query ? (
                            <InputAdornment position='end'>
                                <IconButton
                                    onClick={clearSearch}
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
                    disabled={!query.trim()}
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
                    {t('searchPage.search.button')}
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
                            {t('searchPage.search.suggestions')}
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
                                            label={`${t(
                                                'search.filters.category',
                                            )}: ${filters.category}`}
                                        />
                                    )}

                                    {filters.brand && (
                                        <Chip
                                            size='small'
                                            label={`${t(
                                                'search.filters.brand',
                                            )}: ${filters.brand}`}
                                        />
                                    )}

                                    {filters.model && (
                                        <Chip
                                            size='small'
                                            label={`${t(
                                                'search.filters.model',
                                            )}: ${filters.model}`}
                                        />
                                    )}

                                    {filters.storage && (
                                        <Chip
                                            size='small'
                                            label={`${t(
                                                'search.filters.storage',
                                            )}: ${filters.storage}`}
                                        />
                                    )}

                                    {filters.fuel && (
                                        <Chip
                                            size='small'
                                            label={`${t(
                                                'search.filters.fuel',
                                            )}: ${filters.fuel}`}
                                        />
                                    )}

                                    {filters.condition && (
                                        <Chip
                                            size='small'
                                            label={`${t(
                                                'search.filters.condition',
                                            )}: ${filters.condition}`}
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
