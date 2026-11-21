import { useState } from 'react';
import {
    Box,
    IconButton,
    List,
    ListItemButton,
    Typography,
    Collapse,
    Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { NavLink } from 'react-router-dom';
import { productsAndCategories, NavCategory } from './navCategoryies';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../locales/handleRTL';
import FloatingToggle from './FloatingToggle';

// --- Constants ---
const SIDEBAR_WIDTH = 310;
const COLLAPSED_WIDTH = 72;
const BUTTON_SIZE = 32;
const NAVBAR_HEIGHT = { xs: 64, md: 72 };

// --- Sub-Component: Single Category Item ---
interface CategoryItemProps {
    category: NavCategory;
    isExpanded: boolean;
    collapsed: boolean;
    tooltipPlacement: 'left' | 'right';
    onToggle: (value: string) => void;
    onClose: () => void;
    t: (key: string) => string;
}

const CategoryItem = ({
    category,
    isExpanded,
    collapsed,
    tooltipPlacement,
    onToggle,
    onClose,
    t,
}: CategoryItemProps) => {
    const hasSubs = !!category.subCategories?.length;
    const label = t(category.labelKey);

    return (
        <Box sx={{ mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <NavLink
                        to={category.path}
                        onClick={onClose}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        {({ isActive }) => (
                            <Tooltip
                                title={collapsed ? label : ''}
                                placement={tooltipPlacement}
                                arrow
                            >
                                <ListItemButton
                                    selected={isActive}
                                    sx={{
                                        gap: 1,
                                        minHeight: 56,
                                        borderRadius: 2,
                                        px: 1.5,
                                        justifyContent: collapsed
                                            ? 'center'
                                            : 'flex-start',
                                        '&.Mui-selected': {
                                            bgcolor: 'warning.light',
                                            color: 'warning.contrastText',
                                            '&:hover': {
                                                bgcolor: 'warning.main',
                                            },
                                        },
                                        '&:hover': { bgcolor: 'action.hover' },
                                    }}
                                >
                                    <Box
                                        component='img'
                                        src={category.icon}
                                        alt={label}
                                        loading='lazy'
                                        sx={{
                                            width: 45,
                                            height: 45,
                                            objectFit: 'contain',
                                            flexShrink: 0,
                                            marginInlineStart: collapsed
                                                ? 0
                                                : 1.5,
                                        }}
                                    />
                                    {!collapsed && (
                                        <Typography
                                            sx={{
                                                fontSize: '0.9rem',
                                                fontWeight: isActive
                                                    ? 700
                                                    : 500,
                                                textAlign: 'start',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                marginInlineStart: 1,
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                    )}
                                </ListItemButton>
                            </Tooltip>
                        )}
                    </NavLink>
                </Box>

                {/* Expand/Collapse Arrow */}
                {hasSubs && !collapsed && (
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
                        sx={{ flexShrink: 0, marginInlineEnd: 0.5 }}
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
            {hasSubs && !collapsed && (
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
                                            paddingInlineStart: 4,
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
    const [open, setOpen] = useState(false); // true = expanded, false = icons only
    const [expandedCategory, setExpandedCategory] = useState<string | false>(
        false,
    );

    const dir = handleRTL();
    const isRTL = dir === 'rtl';

    // Only used on xs, where the closed sidebar is fully hidden
    const closedTranslate = isRTL ? '-100%' : '100%';
    const collapsed = !open;

    const handleCategoryToggle = (value: string) => {
        setExpandedCategory((prev) => (prev === value ? false : value));
    };

    const handleClose = () => {
        setOpen(false);
        setExpandedCategory(false);
    };

    return (
        <>
            <FloatingToggle
                BUTTON_SIZE={BUTTON_SIZE}
                SIDEBAR_WIDTH={SIDEBAR_WIDTH}
                COLLAPSED_WIDTH={COLLAPSED_WIDTH}
                open={open}
                setOpen={setOpen}
            />

            <Box
                component='aside'
                dir={dir}
                sx={{
                    position: 'fixed',
                    top: NAVBAR_HEIGHT,
                    insetInlineEnd: 0,
                    width: open ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
                    height: {
                        xs: `calc(100dvh - ${NAVBAR_HEIGHT.xs}px)`,
                        md: `calc(100dvh - ${NAVBAR_HEIGHT.md}px)`,
                    },
                    bgcolor: 'background.paper',
                    borderInlineStart: '1px solid',
                    borderColor: 'divider',
                    border: isRTL ? '2px solid #F8F5EF' : undefined,
                    boxShadow: {
                        xs: open ? '-8px 10px 30px #8a806c' : 'none',
                        lg: open ? '-4px 10px 20px #8a806c ' : 'none',
                    },
                    zIndex: 1050,
                    overflow: 'hidden',
                    // xs: hidden when closed (as before) — md+: icon rail
                    transform: {
                        xs: open
                            ? 'translateX(0)'
                            : `translateX(${closedTranslate})`,
                        md: 'none',
                    },
                    visibility: {
                        xs: open ? 'visible' : 'hidden',
                        md: 'visible',
                    },
                    pointerEvents: { xs: open ? 'auto' : 'none', md: 'auto' },
                    transition:
                        'width 200ms ease-in-out, transform 200ms ease-in-out, visibility 200ms',
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
                        minHeight: 56,
                        bgcolor: 'background.paper',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    {!collapsed && (
                        <Typography variant='h6' fontWeight={700} noWrap>
                            {t('categories.title')}
                        </Typography>
                    )}
                </Box>

                {/* Sidebar List */}
                <List
                    disablePadding
                    sx={{
                        p: 1,
                        height: '100%',
                        pt: 8,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                    }}
                >
                    {productsAndCategories.map((category) => (
                        <CategoryItem
                            key={category.value}
                            category={category}
                            isExpanded={expandedCategory === category.value}
                            collapsed={collapsed}
                            tooltipPlacement={isRTL ? 'right' : 'left'}
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
