import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import {
    InputBase,
    IconButton,
    Box,
    CircularProgress,
    Button,
} from '@mui/material';
import {
    FunctionComponent,
    useCallback,
    useState,
    type KeyboardEvent,
} from 'react';
import { useTranslation } from 'react-i18next';

interface SearchBoxProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    text?: string;
    /** Optional: fired when the user presses the Search button or Enter. */
    onSearch?: (value: string) => void;
}

// =====================================================
// Palette (matches AISearch / JobsFilters / JobsCard)
// =====================================================

const BRAND_GOLD = '#B8860B';
const BRAND_BROWN = '#8B4513';
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_GOLD} 0%, ${BRAND_BROWN} 100%)`;
const BRAND_SOFT = 'rgba(184, 134, 11, 0.12)';
const BRAND_SOFT_STRONG = 'rgba(184, 134, 11, 0.20)';

const SEARCH_BAR_HEIGHT = 54;

const SearchBox: FunctionComponent<SearchBoxProps> = ({
    text = 'Search',
    searchQuery,
    setSearchQuery,
    onSearch,
}) => {
    const [inputValue, setInputValue] = useState(searchQuery);
    const [isSearching, setIsSearching] = useState(false);

    const { t } = useTranslation();

    // =====================================================
    // Actions
    // =====================================================

    const handleClear = useCallback(() => {
        setInputValue('');
        setSearchQuery('');
        setIsSearching(false);
    }, [setSearchQuery]);

    const handleSubmit = useCallback(() => {
        const value = inputValue.trim();
        if (!value) return;

        // Flush any pending debounce immediately so the parent
        // gets the freshest value right now.
        setSearchQuery(value);
        setIsSearching(false);

        onSearch?.(value);
    }, [inputValue, setSearchQuery, onSearch]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSubmit();
                return;
            }

            if (event.key === 'Escape' && inputValue) {
                event.preventDefault();
                handleClear();
            }
        },
        [handleSubmit, handleClear, inputValue],
    );

    const canSubmit = inputValue.trim().length > 0;

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 520,
                mx: 'auto',
                px: { xs: 2, sm: 2, md: 3 },
                py: { xs: 1.5, md: 2 },
            }}
        >
            {/* ================================================= */}
            {/* SEARCH BAR — same shell as AISearch */}
            {/* ================================================= */}

            <Box
                component='form'
                role='search'
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 0.5,
                    pl: 1.5,
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
                    transition:
                        'border-color .25s ease, box-shadow .25s ease, background-color .25s ease',
                    '&:hover': {
                        borderColor: (theme) =>
                            theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.12)'
                                : 'rgba(0,0,0,0.10)',
                    },
                    '&:focus-within': {
                        borderColor: BRAND_GOLD,
                        backgroundColor: 'background.paper',
                        boxShadow: `0 6px 28px ${BRAND_SOFT}`,
                    },
                }}
            >
                {/* Leading icon / spinner */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        width: 24,
                        height: 24,
                        color: 'text.secondary',
                        transition: 'color .2s ease',
                    }}
                >
                    {isSearching ? (
                        <CircularProgress
                            size={16}
                            thickness={4}
                            sx={{ color: BRAND_GOLD }}
                        />
                    ) : (
                        <SearchIcon sx={{ fontSize: 22 }} />
                    )}
                </Box>

                <InputBase
                    sx={{
                        flex: 1,
                        fontSize: '1rem',
                        color: 'text.primary',
                        '& input': { p: 0 },
                        '& input::placeholder': {
                            color: 'text.secondary',
                            opacity: 0.7,
                        },
                    }}
                    placeholder={text}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    inputProps={{
                        'aria-label': text,
                        autoComplete: 'off',
                        spellCheck: false,
                    }}
                />

                {inputValue && (
                    <IconButton
                        onClick={handleClear}
                        size='small'
                        aria-label='Clear search'
                        sx={{
                            p: 0.5,
                            color: 'text.secondary',
                            transition:
                                'color .15s ease, background-color .15s ease',
                            '&:hover': {
                                color: BRAND_BROWN,
                                bgcolor: BRAND_SOFT,
                            },
                        }}
                    >
                        <CloseIcon fontSize='small' />
                    </IconButton>
                )}

                {/* Search button — same style as AISearch */}
                <Button
                    type='submit'
                    variant='contained'
                    disabled={!canSubmit}
                    aria-label={t('pages.jobs.filters.search')}
                    sx={{
                        height: SEARCH_BAR_HEIGHT - 8,
                        px: { xs: 2.5, md: 3.5 },
                        borderRadius: 3,
                        whiteSpace: 'nowrap',
                        fontWeight: 700,
                        letterSpacing: 0.3,
                        textTransform: 'none',
                        flexShrink: 0,
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
                    {t('pages.jobs.filters.search')}
                </Button>
            </Box>
        </Box>
    );
};

export default SearchBox;
