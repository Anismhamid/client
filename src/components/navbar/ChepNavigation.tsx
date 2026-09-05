import { useState } from 'react';
import {
    Box,
    IconButton,
    List,
    ListItemButton,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { NavLink } from 'react-router-dom';
import { productsAndCategories } from './navCategoryies';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../locales/handleRTL';

const SIDEBAR_WIDTH = 200;

const ChipNavigation = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

    // مفتوح افتراضياً عالشاشات الكبيرة، مسكر عالموبايل
    const [open, setOpen] = useState(isLgUp);

    const dir = handleRTL();
    const isRTL = dir === 'rtl';

    // transform فيزيائي وما بيتبع insetInlineEnd تلقائياً،
    // فلازم نحدد اتجاه الإخفاء يدوياً حسب RTL/LTR.
    const closedTranslate = isRTL ? '-100%' : '100%';

    return (
        <>
            {/* =========================
                MENU BUTTON (mobile + desktop)
            ========================= */}
            <IconButton
                onClick={() => setOpen((prev) => !prev)}
                aria-label={t(
                    open ? 'common.close' : 'categories.title',
                    open ? 'إغلاق' : 'التصنيفات',
                )}
                sx={{
                    position: 'fixed',
                    top: 70,
                    insetInlineEnd: 0,
                    borderRadius: 0,

                    zIndex: (theme) => theme.zIndex.drawer + 1,

                    width: 100,
                    height: 42,

                    bgcolor: 'background.paper',

                    border: '1px solid',
                    borderColor: 'divider',

                    boxShadow: 2,

                    '&:hover': {
                        bgcolor: 'background.paper',
                    },
                }}
            >
                {open ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
            </IconButton>

            {/* =========================
                SIDEBAR
            ========================= */}
            <Box
                component='aside'
                dir={dir}
                sx={{
                    position: 'fixed',

                    top: 0,
                    insetInlineEnd: 0,

                    width: SIDEBAR_WIDTH,

                    height: '100dvh',

                    bgcolor: 'background.paper',

                    borderInlineStart: '1px solid',
                    borderColor: 'divider',

                    boxShadow: {
                        xs: open ? '-8px 0 30px rgba(0,0,0,0.15)' : 'none',
                        lg: open ? '-4px 0 20px rgba(0,0,0,0.08)' : 'none',
                    },

                    zIndex: (theme) => theme.zIndex.drawer,

                    overflowY: 'auto',
                    overflowX: 'hidden',

                    /*
                     * نخفيه بالكامل خارج الشاشة (موبايل ودسكتوب لما يكون مسكر).
                     * لازم نحدد الاتجاه يدوياً لأن transform ما بيتبع
                     * insetInlineEnd/Start تلقائياً.
                     */
                    transform: open
                        ? 'translateX(0)'
                        : `translateX(${closedTranslate})`,

                    transition: 'transform 200ms ease-in-out',

                    visibility: open ? 'visible' : 'hidden',

                    pointerEvents: open ? 'auto' : 'none',

                    pt: {
                        xs: 0,
                        lg: 8,
                    },
                }}
            >
                {/* =========================
                    HEADER
                ========================= */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,

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
                        {t('categories.title', 'التصنيفات')}
                    </Typography>

                 
                </Box>

                {/* =========================
                    CATEGORIES
                ========================= */}
                <List
                    disablePadding
                    sx={{
                        p: 1,
                    }}
                >
                    {productsAndCategories.map((category) => (
                        <NavLink
                            key={category.value}
                            to={category.path}
                            onClick={() => setOpen(false)}
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            {({ isActive }) => (
                                <ListItemButton
                                    selected={isActive}
                                    sx={{
                                        minHeight: 56,

                                        borderRadius: 2,

                                        mb: 0.5,

                                        px: 1.5,

                                        '&.Mui-selected': {
                                            bgcolor: 'primary.50',

                                            color: 'primary.main',
                                        },

                                        '&.Mui-selected:hover': {
                                            bgcolor: 'primary.100',
                                        },

                                        '&:hover': {
                                            bgcolor: 'action.hover',
                                        },
                                    }}
                                >
                                    <Box
                                        component='img'
                                        src={category.icon}
                                        alt={t(category.labelKey)}
                                        loading='lazy'
                                        sx={{
                                            width: 40,
                                            height: 40,

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
                                        }}
                                    >
                                        {t(category.labelKey)}
                                    </Typography>
                                </ListItemButton>
                            )}
                        </NavLink>
                    ))}
                </List>
            </Box>
        </>
    );
};

export default ChipNavigation;
