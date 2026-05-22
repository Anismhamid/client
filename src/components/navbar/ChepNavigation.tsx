import { useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeftTwoTone, ChevronRightTwoTone } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { productsAndCategories } from './navCategoryies';
import { useTranslation } from 'react-i18next';
import JsonLd from '../../../utils/JsonLd';

const ChipNavigation = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const scroll = (direction: 'left' | 'right') => {
        const container = containerRef.current;
        if (!container) return;
        const scrollAmount = container.clientWidth * 0.8;
        const newScrollLeft =
            direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;
        container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    };

    return (
        <Box
            component='nav'
            aria-label='Main Categories'
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 200,
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                py: 1,
            }}
        >
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: 'تصنيفات المنتجات',
                    itemListElement: productsAndCategories.map(
                        (category, index) => ({
                            '@type': 'SiteNavigationElement',
                            position: index + 1,
                            name: t(category.labelKey),
                            url: `${window.location.origin}${category.path}`,
                        }),
                    ),
                }}
            />

            {/* Left scroll button */}
            <IconButton
                onClick={() => scroll('left')}
                size='small'
                sx={{
                    position: 'absolute',
                    left: 4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    width: 28,
                    height: 28,
                    '&:hover': {
                        bgcolor: 'background.default',
                        borderColor: 'text.secondary',
                    },
                }}
            >
                <ChevronLeftTwoTone sx={{ fontSize: 18 }} />
            </IconButton>

            {/* Scrollable container */}
            <Box
                ref={containerRef}
                component='ul'
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0,
                    listStyle: 'none',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    px: 5,
                    '&::-webkit-scrollbar': { display: 'none' },
                    maskImage:
                        'linear-gradient(to right, transparent, #fff 40px, #fff calc(100% - 40px), transparent)',
                    WebkitMaskImage:
                        'linear-gradient(to right, transparent, #fff 40px, #fff calc(100% - 40px), transparent)',
                }}
            >
                {productsAndCategories.map((category) => (
                    <Box
                        key={category.value}
                        component='li'
                        role='listitem'
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexShrink: 0,
                            minWidth: 72,
                        }}
                    >
                        <NavLink
                            title={`${t('links.products')} - ${t(category.labelKey)}`}
                            to={category.path}
                            style={{ textDecoration: 'none' }}
                        >
                            {({ isActive }) => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        px: 1,
                                        py: 0.75,
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        bgcolor: isActive
                                            ? 'primary.50'
                                            : 'transparent',
                                        border: '1px solid',
                                        borderColor: isActive
                                            ? 'primary.light'
                                            : 'transparent',
                                        transition: 'all 0.15s ease',
                                        '&:hover': {
                                            bgcolor: isActive
                                                ? 'primary.50'
                                                : 'action.hover',
                                        },
                                    }}
                                >
                                    <Box
                                        component='img'
                                        src={category.icon}
                                        alt={`${t(category.labelKey)} - تصنيف`}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            objectFit: 'contain',
                                            filter: isActive
                                                ? 'none'
                                                : 'grayscale(0.2)',
                                            transition: 'filter 0.15s',
                                        }}
                                    />
                                    <Typography
                                        component='span'
                                        variant='caption'
                                        sx={{
                                            fontWeight: isActive ? 700 : 500,
                                            fontSize: '0.7rem',
                                            color: isActive
                                                ? 'primary.main'
                                                : 'text.secondary',
                                            whiteSpace: 'nowrap',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {t(category.labelKey)}
                                    </Typography>
                                </Box>
                            )}
                        </NavLink>
                    </Box>
                ))}
            </Box>

            {/* Right scroll button */}
            <IconButton
                onClick={() => scroll('right')}
                size='small'
                sx={{
                    position: 'absolute',
                    right: 4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    width: 28,
                    height: 28,
                    '&:hover': {
                        bgcolor: 'background.default',
                        borderColor: 'text.secondary',
                    },
                }}
            >
                <ChevronRightTwoTone sx={{ fontSize: 18 }} />
            </IconButton>
        </Box>
    );
};

export default ChipNavigation;
