import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { InputBase, IconButton, Box, CircularProgress } from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';

interface SearchBoxProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    text: string;
}

const SearchBox: FunctionComponent<SearchBoxProps> = ({
    text = 'search',
    searchQuery,
    setSearchQuery,
}) => {
    const [inputValue, setInputValue] = useState(searchQuery);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        if (inputValue === searchQuery) {
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        const handler = setTimeout(() => {
            setSearchQuery(inputValue);
            setIsSearching(false);
        }, 400);
        return () => clearTimeout(handler);
    }, [inputValue, setSearchQuery, searchQuery]);

    return (
        <Box
            sx={{
                px: { xs: 2, md: 4 },
                py: 2,
                maxWidth: 680,
                mx: 'auto',
                width: '100%',
            }}
        >
            <Box
                component='form'
                onSubmit={(e) => e.preventDefault()}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    height: 44,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '10px',
                    bgcolor: 'background.default',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    '&:focus-within': {
                        borderColor: 'primary.main',
                        boxShadow: '0 0 0 3px rgba(25,118,210,0.08)',
                        bgcolor: 'background.paper',
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                    }}
                >
                    {isSearching ? (
                        <CircularProgress
                            size={16}
                            thickness={4}
                            sx={{ color: 'text.disabled' }}
                        />
                    ) : (
                        <SearchIcon
                            sx={{ fontSize: 18, color: 'text.disabled' }}
                        />
                    )}
                </Box>

                <InputBase
                    sx={{
                        flex: 1,
                        fontSize: '0.9375rem',
                        color: 'text.primary',
                        '& input::placeholder': {
                            color: 'text.secondary',
                            opacity: 1,
                        },
                    }}
                    placeholder={text}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    inputProps={{ 'aria-label': 'search' }}
                />

                {inputValue && (
                    <IconButton
                        onClick={() => {
                            setInputValue('');
                            setSearchQuery('');
                        }}
                        size='small'
                        sx={{
                            p: 0.5,
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'text.primary',
                                bgcolor: 'transparent',
                            },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
};

export default SearchBox;
