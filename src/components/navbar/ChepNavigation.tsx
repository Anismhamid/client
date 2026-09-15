import { useState } from 'react';
import {
    Box,
    IconButton,
    List,
    ListItemButton,
    Typography,
    Collapse,
} from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { NavLink } from 'react-router-dom';
import { productsAndCategories, NavCategory } from './navCategoryies';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../locales/handleRTL';

// --- Constants ---
const SIDEBAR_WIDTH = 310;
const BUTTON_SIZE = 32;
const NAVBAR_HEIGHT = { xs: 64, md: 72 };

// --- Sub-Component: Single Category Item ---
interface CategoryItemProps {
    category: NavCategory;
    isExpanded: boolean;
    onToggle: (value: string) => void;
    onClose: () => void;
    t: (key: string) => string;
}

const CategoryItem = ({
    category,
    isExpanded,
    onToggle,
    onClose,
    t,
}: CategoryItemProps) => {
    const hasSubs = category.subCategories && category.subCategories.length > 0;

    return (
        <Box sx={{ mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Main Category Link */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <NavLink
                        to={category.path}
                        onClick={onClose}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        {({ isActive }) => (
                            <ListItemButton
                                selected={isActive}
                                sx={{
                                    gap: 1,
                                    minHeight: 56,
                                    borderRadius: 2,
                                    px: 1.5,
                                    '&.Mui-selected': {
                                        bgcolor: 'warning.light',
                                        color: 'warning.contrastText',
                                        '&:hover': { bgcolor: 'warning.main' },
                                    },
                                    '&:hover': { bgcolor: 'action.hover' },
                                }}
                            >
                                <Box
                                    component='img'
                                    src={category.icon}
                                    alt={t(category.labelKey)}
                                    loading='lazy'
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        objectFit: 'contain',
                                        flexShrink: 0,
                                        marginInlineStart: 1.5,
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontSize: '0.9rem',
                                        fontWeight: isActive ? 700 : 500,
                                        textAlign: 'start',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        ml: 1,
                                    }}
                                >
                                    {t(category.labelKey)}
                                </Typography>
                            </ListItemButton>
                        )}
                    </NavLink>
                </Box>

                {/* Expand/Collapse Arrow */}
                {hasSubs && (
                    <IconButton
                        size='small'
                        aria-label={
                            isExpanded
                                ? t('common.collapse')
                                : t('common.expand')
                        }
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onToggle(category.value);
                        }}
                        sx={{ flexShrink: 0, mr: 0.5 }}
                    >
                        {isExpanded ? (
                            <ExpandLessIcon fontSize='small' />
                        ) : (
                            <ExpandMoreIcon fontSize='small' />
                        )}
                    </IconButton>
                )}
            </Box>

            {/* Subcategories */}
            {hasSubs && (
                <Collapse in={isExpanded} unmountOnExit>
                    <List component='div' disablePadding>
                        {category.subCategories!.map((sub) => (
                            <NavLink
                                key={`${category.value}-${sub.path}`}
                                to={sub.path}
                                onClick={onClose}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                {({ isActive }) => (
                                    <ListItemButton
                                        selected={isActive}
                                        sx={{
                                            pl: 4,
                                            py: 0.75,
                                            borderRadius: 2,
                                            mb: 0.25,
                                            '&.Mui-selected': {
                                                bgcolor: 'secondary.light',
                                                color: 'secondary.main',
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: isActive
                                                    ? 600
                                                    : 400,
                                                textAlign: 'start',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {t(sub.labelKey)}
                                        </Typography>
                                    </ListItemButton>
                                )}
                            </NavLink>
                        ))}
                    </List>
                </Collapse>
            )}
        </Box>
    );
};

// --- Main Component ---
const ChipNavigation = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | false>(
        false,
    );

    const dir = handleRTL();
    const isRTL = dir === 'rtl';

    // Determine transform direction based on RTL
    const closedTranslate = isRTL ? '-100%' : '100%';
    const showRightArrow = (isRTL && !open) || (!isRTL && open);

    const handleCategoryToggle = (value: string) => {
        setExpandedCategory((prev) => (prev === value ? false : value));
    };

    const handleClose = () => {
        setOpen(false);
        setExpandedCategory(false);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <IconButton
                onClick={() => setOpen((prev) => !prev)}
                aria-label={open ? t('common.close') : t('categories.title')}
                sx={{
                    position: 'fixed',
                    top: '40%',
                    insetInlineEnd: open ? SIDEBAR_WIDTH : 0,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    width: BUTTON_SIZE,
                    height: 42,
                    borderRadius: 0,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 2,
                    transition: 'inset-inline-end 200ms ease-in-out',
                    '&:hover': { bgcolor: 'background.paper' },
                }}
            >
                {showRightArrow ? (
                    <ChevronRightRoundedIcon fontSize='small' />
                ) : (
                    <ChevronLeftRoundedIcon fontSize='small' />
                )}
            </IconButton>

            {/* Sidebar Drawer */}
            <Box
                component='aside'
                dir={dir}
                sx={{
                    position: 'fixed',
                    top: NAVBAR_HEIGHT,
                    insetInlineEnd: 0,
                    width: SIDEBAR_WIDTH,
                    height: {
                        xs: `calc(100dvh - ${NAVBAR_HEIGHT.xs}px)`,
                        md: `calc(100dvh - ${NAVBAR_HEIGHT.md}px)`,
                    },
                    bgcolor: 'background.paper',
                    borderInlineStart: '1px solid',
                    borderColor: 'divider',
                    boxShadow: {
                        xs: open ? '-8px 0 30px rgba(0,0,0,0.15)' : 'none',
                        lg: open ? '-4px 0 20px rgba(0,0,0,0.08)' : 'none',
                    },
                    zIndex: 1050,
                    overflow: 'hidden',
                    // Note: 'translateX(+10)' looks like a typo, usually it's 0 for open state
                    transform: open
                        ? 'translateX(0)'
                        : `translateX(${closedTranslate})`,
                    visibility: open ? 'visible' : 'hidden',
                    pointerEvents: open ? 'auto' : 'none',
                    transition: 'transform 200ms ease-in-out, visibility 200ms',
                }}
            >
                {/* Sidebar Header */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        insetInlineStart: 0,
                        insetInlineEnd: 0,
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        py: 1.5,
                        bgcolor: 'background.paper',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant='h6' fontWeight={700}>
                        {t('categories.title')}
                    </Typography>
                </Box>

                {/* Sidebar List */}
                <List
                    disablePadding
                    sx={{
                        p: 1,
                        height: '100%',
                        pt: 8, // Space for sticky header
                        overflowY: 'auto',
                        overflowX: 'hidden',
                    }}
                >
                    {productsAndCategories.map((category) => (
                        <CategoryItem
                            key={category.value}
                            category={category}
                            isExpanded={expandedCategory === category.value}
                            onToggle={handleCategoryToggle}
                            onClose={handleClose}
                            t={t}
                        />
                    ))}
                </List>
            </Box>
        </>
    );
};

export default ChipNavigation;
