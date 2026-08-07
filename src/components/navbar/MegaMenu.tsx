import {
    Box,
    Popper,
    Paper,
    Grid,
    Typography,
    useMediaQuery,
    ListItemText,
    ListItemButton,
    ListItem,
    List,
    ButtonBase,
    ClickAwayListener,
    Fade,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { NavLink, useLocation, matchPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { NavCategory } from './navCategoryies';

interface MegaMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    categories: NavCategory[];
    onClose: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    mode: 'light' | 'dark';
}

const MegaMenu = ({
    anchorEl,
    open,
    categories,
    onClose,
    onMouseEnter,
    mode = 'dark',
    onMouseLeave,
}: MegaMenuProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { t } = useTranslation();
    const loc = useLocation();
    const menuRef = useRef<HTMLDivElement>(null);
    const isRtl = theme.direction === 'rtl';

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    // Handle mouse leave with delay for better UX
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleMouseLeave = () => {
            timeoutId = setTimeout(() => {
                if (onMouseLeave) onMouseLeave();
            }, 150);
        };

        const handleMouseEnter = () => {
            clearTimeout(timeoutId);
            if (onMouseEnter) onMouseEnter();
        };

        const menuElement = menuRef.current;
        if (menuElement) {
            menuElement.addEventListener('mouseenter', handleMouseEnter);
            menuElement.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (menuElement) {
                menuElement.removeEventListener('mouseenter', handleMouseEnter);
                menuElement.removeEventListener('mouseleave', handleMouseLeave);
            }
            clearTimeout(timeoutId);
        };
    }, [onMouseEnter, onMouseLeave]);

    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement={isRtl ? 'bottom-end' : 'bottom-start'}
            transition
            sx={{
                zIndex: 1300,
                pointerEvents: open ? 'auto' : 'none',
                '& .MuiPaper-root': {
                    minWidth: 300,
                    maxWidth: isMobile ? '100vw' : 650,
                },
            }}
            modifiers={[
                {
                    name: 'offset',
                    options: { offset: [0, 8] },
                },
                {
                    name: 'flip',
                    options: {
                        fallbackPlacements: ['top-start', 'bottom-start'],
                    },
                },
            ]}
        >
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={200}>
                    <Box
                        ref={menuRef}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        {/* Backdrop for mobile */}
                        {isMobile && open && (
                            <Box
                                sx={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    zIndex: -1,
                                }}
                                onClick={onClose}
                            />
                        )}

                        <ClickAwayListener onClickAway={onClose}>
                            <Paper
                                elevation={8}
                                sx={{
                                    p: isMobile ? 2 : 3,
                                    maxHeight: isMobile ? '80vh' : '70vh',
                                    overflow: 'auto',
                                    borderRadius: '12px',
                                    backgroundColor:
                                        mode === 'dark'
                                            ? theme.palette.background.paper
                                            : '#ffffff',
                                    boxShadow:
                                        mode === 'dark'
                                            ? '0px 8px 32px rgba(0,0,0,0.6)'
                                            : '0px 8px 32px rgba(0,0,0,0.12)',
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    '&::-webkit-scrollbar': {
                                        width: '6px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        background: alpha(
                                            theme.palette.divider,
                                            0.05,
                                        ),
                                        borderRadius: '8px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: alpha(
                                            theme.palette.primary.main,
                                            0.3,
                                        ),
                                        borderRadius: '8px',
                                        '&:hover': {
                                            background: alpha(
                                                theme.palette.primary.main,
                                                0.5,
                                            ),
                                        },
                                    },
                                }}
                            >
                                <Grid container spacing={3}>
                                    {categories.map((cat) => (
                                        <Grid
                                            size={{ xs: 12, sm: 6, md: 4 }}
                                            key={`cat-${cat.value}`}
                                        >
                                            {/* Category Header */}
                                            <Box sx={{ mb: 1.5 }}>
                                                {cat.path ? (
                                                    <ButtonBase
                                                        component={NavLink}
                                                        to={cat.path}
                                                        onClick={onClose}
                                                        sx={{
                                                            textAlign: 'left',
                                                            width: '100%',
                                                            p: 0.5,
                                                            borderRadius: 1,
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: 1,
                                                            '&:focus-visible': {
                                                                outline: `2px solid ${theme.palette.primary.main}`,
                                                                outlineOffset: 2,
                                                            },
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    alpha(
                                                                        theme
                                                                            .palette
                                                                            .primary
                                                                            .main,
                                                                        0.08,
                                                                    ),
                                                            },
                                                        }}
                                                    >
                                                        {cat.icon && (
                                                            <Box
                                                                component='img'
                                                                src={cat.icon}
                                                                alt=''
                                                                sx={{
                                                                    width: 20,
                                                                    height: 20,
                                                                }}
                                                            />
                                                        )}
                                                        <Typography
                                                            variant='subtitle1'
                                                            fontWeight={700}
                                                            sx={{
                                                                color: 'primary.main',
                                                                fontSize:
                                                                    '0.95rem',
                                                            }}
                                                        >
                                                            {t(cat.labelKey)}
                                                        </Typography>
                                                        {cat.subCategories && (
                                                            <Typography
                                                                component='span'
                                                                sx={{
                                                                    fontSize:
                                                                        '0.65rem',
                                                                    color: 'text.secondary',
                                                                    backgroundColor:
                                                                        alpha(
                                                                            theme
                                                                                .palette
                                                                                .divider,
                                                                            0.2,
                                                                        ),
                                                                    px: 0.75,
                                                                    py: 0.25,
                                                                    borderRadius:
                                                                        '10px',
                                                                    ml: 'auto',
                                                                }}
                                                            >
                                                                {
                                                                    cat
                                                                        .subCategories
                                                                        .length
                                                                }
                                                            </Typography>
                                                        )}
                                                    </ButtonBase>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: 1,
                                                            p: 0.5,
                                                        }}
                                                    >
                                                        {cat.icon && (
                                                            <Box
                                                                component='img'
                                                                src={cat.icon}
                                                                alt=''
                                                                sx={{
                                                                    width: 20,
                                                                    height: 20,
                                                                }}
                                                            />
                                                        )}
                                                        <Typography
                                                            variant='subtitle1'
                                                            fontWeight={700}
                                                            sx={{
                                                                color: 'primary.main',
                                                                fontSize:
                                                                    '0.95rem',
                                                            }}
                                                        >
                                                            {t(cat.labelKey)}
                                                        </Typography>
                                                        {cat.subCategories && (
                                                            <Typography
                                                                component='span'
                                                                sx={{
                                                                    fontSize:
                                                                        '0.65rem',
                                                                    color: 'text.secondary',
                                                                    backgroundColor:
                                                                        alpha(
                                                                            theme
                                                                                .palette
                                                                                .divider,
                                                                            0.2,
                                                                        ),
                                                                    px: 0.75,
                                                                    py: 0.25,
                                                                    borderRadius:
                                                                        '10px',
                                                                    ml: 'auto',
                                                                }}
                                                            >
                                                                {
                                                                    cat
                                                                        .subCategories
                                                                        .length
                                                                }
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Subcategories List */}
                                            <List
                                                disablePadding
                                                component='div'
                                            >
                                                {cat.subCategories &&
                                                cat.subCategories.length > 0 ? (
                                                    cat.subCategories.map(
                                                        (sub) => {
                                                            const isActive =
                                                                !!matchPath(
                                                                    {
                                                                        path: sub.path,
                                                                        end: false,
                                                                    },
                                                                    loc.pathname,
                                                                );

                                                            return (
                                                                <ListItem
                                                                    key={`sub-${cat.value}-${sub.path}`}
                                                                    disablePadding
                                                                    sx={{
                                                                        mb: 0.25,
                                                                    }}
                                                                >
                                                                    <ListItemButton
                                                                        component={
                                                                            NavLink
                                                                        }
                                                                        to={
                                                                            sub.path
                                                                        }
                                                                        onClick={
                                                                            onClose
                                                                        }
                                                                        selected={
                                                                            isActive
                                                                        }
                                                                        sx={{
                                                                            borderRadius:
                                                                                '8px',
                                                                            py: 0.75,
                                                                            px: 1.5,
                                                                            transition:
                                                                                'all 0.2s ease',
                                                                            '&:hover':
                                                                                {
                                                                                    backgroundColor:
                                                                                        alpha(
                                                                                            theme
                                                                                                .palette
                                                                                                .primary
                                                                                                .main,
                                                                                            0.05,
                                                                                        ),
                                                                                },
                                                                            '&.Mui-selected':
                                                                                {
                                                                                    backgroundColor:
                                                                                        alpha(
                                                                                            theme
                                                                                                .palette
                                                                                                .secondary
                                                                                                .main,
                                                                                            0.1,
                                                                                        ),
                                                                                    color: 'secondary.main',
                                                                                    '&:hover':
                                                                                        {
                                                                                            backgroundColor:
                                                                                                alpha(
                                                                                                    theme
                                                                                                        .palette
                                                                                                        .secondary
                                                                                                        .main,
                                                                                                    0.15,
                                                                                                ),
                                                                                        },
                                                                                },
                                                                        }}
                                                                    >
                                                                        <ListItemText
                                                                            primary={t(
                                                                                sub.labelKey,
                                                                            )}
                                                                            primaryTypographyProps={{
                                                                                fontWeight:
                                                                                    isActive
                                                                                        ? 600
                                                                                        : 400,
                                                                                fontSize:
                                                                                    '0.875rem',
                                                                            }}
                                                                        />
                                                                        {isActive && (
                                                                            <Box
                                                                                sx={{
                                                                                    width: 6,
                                                                                    height: 6,
                                                                                    borderRadius:
                                                                                        '50%',
                                                                                    backgroundColor:
                                                                                        'secondary.main',
                                                                                    ml: 1,
                                                                                    flexShrink: 0,
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </ListItemButton>
                                                                </ListItem>
                                                            );
                                                        },
                                                    )
                                                ) : (
                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                        sx={{
                                                            px: 1.5,
                                                            py: 0.5,
                                                            fontStyle: 'italic',
                                                        }}
                                                    >
                                                        {t(
                                                            'no_items_available',
                                                            'لا توجد عناصر',
                                                        )}
                                                    </Typography>
                                                )}
                                            </List>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </ClickAwayListener>
                    </Box>
                </Fade>
            )}
        </Popper>
    );
};

export default MegaMenu;
