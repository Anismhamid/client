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
    ClickAwayListener,
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

// =====================================================
// Palette (single source of truth)
// =====================================================

const BRAND_GOLD = '#B8860B';
const BRAND_BROWN = '#8B4513';
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_GOLD} 0%, ${BRAND_BROWN} 100%)`;
const BRAND_SOFT = 'rgba(184, 134, 11, 0.12)';
const BRAND_SOFT_STRONG = 'rgba(184, 134, 11, 0.20)';

const SEARCH_BAR_HEIGHT = 54;

const AISearch = () => {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilters | null>(null);
    const [openSuggestions, setOpenSuggestions] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSearch = (searchValue?: string) => {
        const value = (searchValue ?? query).trim();
        if (!value) return;

        setOpenSuggestions(false);
        navigate(`${path.Search}?q=${encodeURIComponent(value)}`);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }

        if (event.key === 'Escape') {
            setOpenSuggestions(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setFilters(null);
        setOpenSuggestions(false);
        inputRef.current?.focus();
    };

    const examples = [
        t('searchPage.search.examples.iphone'),
        t('searchPage.search.examples.car'),
        t('searchPage.search.examples.hebrew'),
        t('searchPage.search.examples.samsung'),
    ];

    return (
        <ClickAwayListener onClickAway={() => setOpenSuggestions(false)}>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 520,
                    mx: 'auto',
                    px: { xs: 2, sm: 2, md: 3 },
                    py: { xs: 1.5, md: 2 },
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
                        p: 0.5,
                        borderRadius: 4,
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.03)'
                                : 'rgba(0,0,0,0.02)',
                        border: '1px solid',
                        borderColor: (theme) =>
                            theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.06)'
                                : 'rgba(0,0,0,0.05)',
                        transition: 'border-color .25s ease, box-shadow .25s ease',
                        '&:focus-within': {
                            borderColor: BRAND_GOLD,
                            boxShadow: `0 6px 28px ${BRAND_SOFT}`,
                        },
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
                            if (query.trim()) setOpenSuggestions(true);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={t('searchPage.search.placeholder')}
                        variant='standard'
                        inputProps={{
                            'aria-label': t('searchPage.search.placeholder'),
                        }}
                        sx={{
                            '& .MuiInput-underline:before, & .MuiInput-underline:after':
                                { display: 'none' },
                            '& .MuiInputBase-root': {
                                minHeight: SEARCH_BAR_HEIGHT,
                                px: 1,
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '1rem',
                                '&::placeholder': {
                                    opacity: 0.7,
                                },
                            },
                        }}
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: 22,
                                        }}
                                    />
                                </InputAdornment>
                            ),
                            endAdornment: query ? (
                                <InputAdornment position='end'>
                                    <IconButton
                                        onClick={clearSearch}
                                        aria-label={t('searchPage.search.clear')}
                                        size='small'
                                        sx={{
                                            color: 'text.secondary',
                                            '&:hover': {
                                                color: BRAND_BROWN,
                                                backgroundColor: BRAND_SOFT,
                                            },
                                        }}
                                    >
                                        <CloseIcon fontSize='small' />
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
                            height: SEARCH_BAR_HEIGHT - 8,
                            px: { xs: 2.5, md: 4 },
                            borderRadius: 3,
                            whiteSpace: 'nowrap',
                            fontWeight: 700,
                            letterSpacing: 0.3,
                            textTransform: 'none',
                            background: BRAND_GRADIENT,
                            color: '#fff',
                            boxShadow: 'none',
                            transition: 'filter .2s ease, transform .2s ease',
                            '&:hover': {
                                background: BRAND_GRADIENT,
                                filter: 'brightness(0.94)',
                                boxShadow: `0 6px 18px ${BRAND_SOFT_STRONG}`,
                            },
                            '&:active': {
                                transform: 'translateY(1px)',
                            },
                            '&.Mui-disabled': {
                                background: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(255,255,255,0.08)'
                                        : 'rgba(0,0,0,0.08)',
                                color: 'text.disabled',
                            },
                        }}
                    >
                        {t('searchPage.search.button')}
                    </Button>
                </Box>

                {/* ================================================= */}
                {/* SUGGESTIONS */}
                {/* ================================================= */}

                <Fade in={openSuggestions} unmountOnExit>
                    <Paper
                        elevation={0}
                        sx={{
                            position: 'absolute',
                            top: 'calc(100% - 2px)',
                            left: { xs: 8, sm: 16, md: 24 },
                            right: { xs: 8, sm: 16, md: 24 },
                            zIndex: 1500,
                            mt: 1,
                            borderRadius: 3,
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.08)'
                                    : 'rgba(0,0,0,0.06)',
                            boxShadow: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? '0 12px 32px rgba(0,0,0,0.45)'
                                    : '0 12px 32px rgba(0,0,0,0.10)',
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
                                    letterSpacing: 0.4,
                                    textTransform: 'uppercase',
                                    fontSize: 11,
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
                                        icon={<SearchIcon sx={{ fontSize: 16 }} />}
                                        onClick={() => {
                                            setQuery(example);
                                            handleSearch(example);
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(255,255,255,0.10)'
                                                    : 'rgba(0,0,0,0.08)',
                                            backgroundColor: 'transparent',
                                            transition:
                                                'background-color .2s ease, border-color .2s ease, color .2s ease',
                                            '& .MuiChip-icon': {
                                                color: 'text.secondary',
                                            },
                                            '&:hover': {
                                                backgroundColor: BRAND_SOFT,
                                                borderColor: BRAND_GOLD,
                                                color: BRAND_BROWN,
                                                '& .MuiChip-icon': {
                                                    color: BRAND_BROWN,
                                                },
                                            },
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
                                            fontWeight: 700,
                                            letterSpacing: 0.4,
                                            textTransform: 'uppercase',
                                            fontSize: 11,
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
                                                sx={{ borderRadius: 2 }}
                                            />
                                        )}

                                        {filters.brand && (
                                            <Chip
                                                size='small'
                                                label={`${t('search.filters.brand')}: ${filters.brand}`}
                                                sx={{ borderRadius: 2 }}
                                            />
                                        )}

                                        {filters.model && (
                                            <Chip
                                                size='small'
                                                label={`${t('search.filters.model')}: ${filters.model}`}
                                                sx={{ borderRadius: 2 }}
                                            />
                                        )}

                                        {filters.storage && (
                                            <Chip
                                                size='small'
                                                label={`${t('search.filters.storage')}: ${filters.storage}`}
                                                sx={{ borderRadius: 2 }}
                                            />
                                        )}

                                        {filters.fuel && (
                                            <Chip
                                                size='small'
                                                label={`${t('search.filters.fuel')}: ${filters.fuel}`}
                                                sx={{ borderRadius: 2 }}
                                            />
                                        )}

                                        {filters.condition && (
                                            <Chip
                                                size='small'
                                                label={`${t('search.filters.condition')}: ${filters.condition}`}
                                                sx={{ borderRadius: 2 }}
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Fade>
            </Box>
        </ClickAwayListener>
    );
};

export default AISearch;