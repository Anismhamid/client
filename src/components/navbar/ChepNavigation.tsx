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
                borderBottom: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
                top: 0,
                l: 0,
                r: 0,

                zIndex: 10,

                bgcolor: '#05050511',
                backdropFilter: 'blur(8px)',
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
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',

                    width: 20,
                    height: 20,
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
                    listStyle: 'none',
                    overflowX: 'auto',
                    scrollbarWidth: 'unset',
                    '&::-webkit-scrollbar': { display: 'block' },
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
                            alignItems: 'center',
                            flexShrink: 0,
                            minWidth: 120,
                            pt:2
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
                                        gap: 1,
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
                                        alt={`${t(category.labelKey)} - category`}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            maxHeight: 50,
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
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    // borderColor: 'divider',
                    width: 20,
                    height: 20,
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
