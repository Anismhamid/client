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
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { NavLink } from 'react-router-dom';
import { productsAndCategories } from './navCategoryies';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../locales/handleRTL';

const SIDEBAR_WIDTH = 200;
const BUTTON_SIZE = 32;

const ChipNavigation = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

    const [open, setOpen] = useState(isLgUp);

    const dir = handleRTL();
    const isRTL = dir === 'rtl';

    // مسكر -> يهرب 100% كامل، ما في بارز خلف الزر
    const closedTranslate = isRTL ? '-100%' : '100%';

    // السهم بيأشر بالاتجاه يلي رح يفتح فيه السايدبار
    const showRightArrow = (isRTL && !open) || (!isRTL && open);

    return (
        <>
            {/* =========================
                زر منفصل تماماً، ثابت عالشاشة، ما إله علاقة بالـ aside
            ========================= */}
            <IconButton
                onClick={() => setOpen((prev) => !prev)}
                aria-label={t(
                    open ? 'common.close' : 'categories.title',
                    open ? 'إغلاق' : 'التصنيفات',
                )}
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

                    '&:hover': {
                        bgcolor: 'background.paper',
                    },
                }}
            >
                {showRightArrow ? (
                    <ChevronRightRoundedIcon fontSize='small' />
                ) : (
                    <ChevronLeftRoundedIcon fontSize='small' />
                )}
            </IconButton>

            {/* =========================
                SIDEBAR - بيختفي بالكامل (visibility) وهو مسكر
              
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

                    overflow: 'hidden',

                    transform: open
                        ? 'translateX(+10)'
                        : `translateX(${closedTranslate})`,

                    visibility: open ? 'visible' : 'hidden',
                    pointerEvents: open ? 'auto' : 'none',

                    transition: 'transform 200ms ease-in-out, visibility 200ms',
                }}
            >
                {/* =========================
                    HEADER
                ========================= */}
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
                        height: '100%',
                        pt: 8,
                        overflowY: 'auto',
                        overflowX: 'hidden',
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
