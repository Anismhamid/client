import {
    AppBar,
    Box,
    Breadcrumbs,
    ButtonBase,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import {
    Dashboard,
    Group,
    Campaign,
    Report,
    Security,
    Block,
    ManageSearch,
    Notifications,
    Work,
    Settings,
    Menu as MenuIcon,
    Home,
    NavigateNext,
} from '@mui/icons-material';

import {
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router-dom';

import {
    motion,
    AnimatePresence,
} from 'framer-motion';

import {
    useCallback,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import { useTranslation } from 'react-i18next';

import { path } from '../../routes/routes';

// ============================================================
// Constants
// ============================================================

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 76;
const MOBILE_DRAWER_WIDTH = 290;

// ============================================================
// Types
// ============================================================

interface AdminMenuItem {
    labelKey: string;
    fallbackLabel: string;
    path: string;
    icon: ReactNode;
    children?: AdminMenuItem[];
}

// ============================================================
// Motion
// ============================================================

const pageVariants = {
    initial: {
        opacity: 0,
        y: 12,
    },

    animate: {
        opacity: 1,
        y: 0,
    },

    exit: {
        opacity: 0,
        y: -8,
    },
};

// ============================================================
// Admin Menu
// ============================================================

const ADMIN_MENU: AdminMenuItem[] = [
    {
        labelKey: 'admin.dashboard',
        fallbackLabel: 'لوحة التحكم',
        path: path.Admin,
        icon: <Dashboard />,
    },

    {
        labelKey: 'admin.users',
        fallbackLabel: 'المستخدمون',
        path: path.AdminUsers,
        icon: <Group />,
    },

    {
        labelKey: 'admin.posts',
        fallbackLabel: 'الإعلانات',
        path: path.AdminPosts,
        icon: <Campaign />,
    },

    {
        labelKey: 'admin.reports',
        fallbackLabel: 'التقارير',
        path: path.AdminReports,
        icon: <Report />,
    },

    {
        labelKey: 'admin.security',
        fallbackLabel: 'الأمان',
        path: path.AdminSecurity,
        icon: <Security />,
        children: [
            {
                labelKey: 'admin.blockedUsers',
                fallbackLabel: 'المستخدمون المحظورون',
                path: path.AdminBlockedUsers,
                icon: <Block />,
            },

            {
                labelKey: 'admin.auditLogs',
                fallbackLabel: 'سجل التدقيق',
                path: path.AdminAuditLogs,
                icon: <ManageSearch />,
            },

            {
                labelKey: 'admin.investigation',
                fallbackLabel: 'التحقيق بالرسائل',
                path: path.AdminMessageInvestigation,
                icon: <Security />,
            },
        ],
    },

    {
        labelKey: 'admin.notifications',
        fallbackLabel: 'الإشعارات',
        path: path.AdminNotifications,
        icon: <Notifications />,
    },

    {
        labelKey: 'admin.jobs',
        fallbackLabel: 'الوظائف',
        path: path.AdminJobs,
        icon: <Work />,
    },

    {
        labelKey: 'admin.settings',
        fallbackLabel: 'الإعدادات',
        path: path.AdminSettingsRoot,
        icon: <Settings />,
    },
];

// ============================================================
// Component
// ============================================================

const AdminLayout = () => {
    const theme = useTheme();

    const navigate = useNavigate();

    const location = useLocation();

    const { t, i18n } = useTranslation();

    const isMobile = useMediaQuery(
        theme.breakpoints.down('md'),
    );

    const [mobileOpen, setMobileOpen] = useState(false);

    const [collapsed, setCollapsed] = useState(false);

    // ========================================================
    // Direction
    // ========================================================

    const isRTL =
        i18n.dir?.() === 'rtl' ||
        ['ar', 'he'].includes(
            i18n.language?.split('-')[0] ?? '',
        );

    const direction = isRTL ? 'rtl' : 'ltr';

    // ========================================================
    // Active path
    // ========================================================

    const isPathActive = useCallback(
        (menuPath: string): boolean => {
            if (menuPath === path.Admin) {
                return location.pathname === path.Admin;
            }

            return (
                location.pathname === menuPath ||
                location.pathname.startsWith(`${menuPath}/`)
            );
        },
        [location.pathname],
    );

    // ========================================================
    // Menu item active state
    // ========================================================

    const isMenuItemActive = useCallback(
        (item: AdminMenuItem): boolean => {
            if (isPathActive(item.path)) {
                return true;
            }

            if (item.children?.length) {
                return item.children.some((child) =>
                    isPathActive(child.path),
                );
            }

            return false;
        },
        [isPathActive],
    );

    // ========================================================
    // Navigation
    // ========================================================

    const handleNavigate = useCallback(
        (targetPath: string) => {
            if (isMobile) {
                setMobileOpen(false);
            }

            navigate(targetPath);
        },
        [isMobile, navigate],
    );

    // ========================================================
    // Breadcrumbs
    // ========================================================

    const breadcrumbs = useMemo(() => {
        const result: Array<{
            label: string;
            path?: string;
        }> = [
            {
                label: t(
                    'admin.home',
                    'الرئيسية',
                ),
                path: path.Admin,
            },
        ];

        // Dashboard
        if (location.pathname === path.Admin) {
            result.push({
                label: t(
                    'admin.dashboard',
                    'لوحة التحكم',
                ),
            });

            return result;
        }

        const findMenuItem = (
            items: AdminMenuItem[],
        ): AdminMenuItem | undefined => {
            for (const item of items) {
                if (
                    item.path !== path.Admin &&
                    isPathActive(item.path)
                ) {
                    return item;
                }

                if (item.children?.length) {
                    const child = findMenuItem(
                        item.children,
                    );

                    if (child) {
                        return child;
                    }
                }
            }

            return undefined;
        };

        const activeItem = findMenuItem(
            ADMIN_MENU,
        );

        if (activeItem) {
            result.push({
                label: t(
                    activeItem.labelKey,
                    activeItem.fallbackLabel,
                ),
            });
        }

        return result;
    }, [
        isPathActive,
        location.pathname,
        t,
    ]);

    // ========================================================
    // Sidebar
    // ========================================================

    const sidebarContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor:
                    theme.palette.background.paper,
                direction,
            }}
        >
            {/* ==================================================
                Brand
            ================================================== */}

            <Box
                sx={{
                    minHeight: 72,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                        collapsed && !isMobile
                            ? 'center'
                            : 'space-between',
                    px:
                        collapsed && !isMobile
                            ? 1
                            : 2,
                    borderBottom:
                        `1px solid ${theme.palette.divider}`,
                }}
            >
                <ButtonBase
                    onClick={() =>
                        handleNavigate(path.Admin)
                    }
                    sx={{
                        borderRadius: 2,
                        px: 1,
                        py: 0.5,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                flexShrink: 0,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor:
                                    theme.palette.primary.main,
                                color:
                                    theme.palette.primary
                                        .contrastText,
                                fontWeight: 800,
                                fontSize: 18,
                            }}
                        >
                            ص
                        </Box>

                        {(!collapsed ||
                            isMobile) && (
                            <Box
                                sx={{
                                    textAlign:
                                        isRTL
                                            ? 'right'
                                            : 'left',
                                }}
                            >
                                <Typography
                                    fontWeight={800}
                                    lineHeight={1.1}
                                >
                                    صفقة
                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {t(
                                        'admin.center',
                                        'مركز الإدارة',
                                    )}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </ButtonBase>
            </Box>

            {/* ==================================================
                Navigation
            ================================================== */}

            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    py: 1.5,
                }}
            >
                <List
                    disablePadding
                    sx={{
                        px:
                            collapsed && !isMobile
                                ? 1
                                : 1.5,
                    }}
                >
                    {ADMIN_MENU.map((item) => {
                        const active =
                            isMenuItemActive(item);

                        const hasChildren =
                            Boolean(
                                item.children?.length,
                            );

                        const targetPath =
                            hasChildren &&
                            item.path ===
                                path.AdminSecurity
                                ? item.children?.[0]
                                      ?.path ??
                                  item.path
                                : item.path;

                        return (
                            <Box key={item.path}>
                                {/* Main item */}

                                <Tooltip
                                    title={
                                        collapsed &&
                                        !isMobile
                                            ? t(
                                                  item.labelKey,
                                                  item.fallbackLabel,
                                              )
                                            : ''
                                    }
                                    placement={
                                        isRTL
                                            ? 'left'
                                            : 'right'
                                    }
                                    arrow
                                >
                                    <ListItemButton
                                        selected={
                                            active
                                        }
                                        onClick={() =>
                                            handleNavigate(
                                                targetPath,
                                            )
                                        }
                                        sx={{
                                            minHeight: 48,
                                            mb: 0.5,
                                            borderRadius: 2,

                                            justifyContent:
                                                collapsed &&
                                                !isMobile
                                                    ? 'center'
                                                    : 'initial',

                                            '&.Mui-selected':
                                                {
                                                    bgcolor:
                                                        'action.selected',
                                                    color:
                                                        'primary.main',

                                                    '& .MuiListItemIcon-root':
                                                        {
                                                            color:
                                                                'primary.main',
                                                        },
                                                },

                                            '&:hover':
                                                {
                                                    bgcolor:
                                                        'action.hover',
                                                },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth:
                                                    collapsed &&
                                                    !isMobile
                                                        ? 0
                                                        : 42,

                                                justifyContent:
                                                    'center',

                                                color: active
                                                    ? 'primary.main'
                                                    : 'text.secondary',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>

                                        {(!collapsed ||
                                            isMobile) && (
                                            <ListItemText
                                                primary={t(
                                                    item.labelKey,
                                                    item.fallbackLabel,
                                                )}
                                                primaryTypographyProps={{
                                                    fontWeight:
                                                        active
                                                            ? 700
                                                            : 500,
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </Tooltip>

                                {/* ==================================================
                                    Children
                                ================================================== */}

                                {hasChildren &&
                                    active &&
                                    (!collapsed ||
                                        isMobile) && (
                                        <List
                                            disablePadding
                                            sx={{
                                                marginInlineStart: 2,
                                                mt: 0.5,
                                                mb: 1,

                                                borderInlineStart:
                                                    `2px solid ${theme.palette.divider}`,
                                            }}
                                        >
                                            {item.children!.map(
                                                (
                                                    child,
                                                ) => {
                                                    const childActive =
                                                        isPathActive(
                                                            child.path,
                                                        );

                                                    return (
                                                        <ListItemButton
                                                            key={
                                                                child.path
                                                            }
                                                            selected={
                                                                childActive
                                                            }
                                                            onClick={() =>
                                                                handleNavigate(
                                                                    child.path,
                                                                )
                                                            }
                                                            sx={{
                                                                minHeight: 42,
                                                                mx: 1,
                                                                mb: 0.25,
                                                                borderRadius: 1.5,

                                                                '&.Mui-selected':
                                                                    {
                                                                        bgcolor:
                                                                            'action.selected',
                                                                        color:
                                                                            'primary.main',

                                                                        '& .MuiListItemIcon-root':
                                                                            {
                                                                                color:
                                                                                    'primary.main',
                                                                            },
                                                                    },

                                                                '&:hover':
                                                                    {
                                                                        bgcolor:
                                                                            'action.hover',
                                                                    },
                                                            }}
                                                        >
                                                            <ListItemIcon
                                                                sx={{
                                                                    minWidth: 34,
                                                                    color:
                                                                        childActive
                                                                            ? 'primary.main'
                                                                            : 'text.secondary',
                                                                }}
                                                            >
                                                                {
                                                                    child.icon
                                                                }
                                                            </ListItemIcon>

                                                            <ListItemText
                                                                primary={t(
                                                                    child.labelKey,
                                                                    child.fallbackLabel,
                                                                )}
                                                                primaryTypographyProps={{
                                                                    variant:
                                                                        'body2',
                                                                    fontWeight:
                                                                        childActive
                                                                            ? 700
                                                                            : 400,
                                                                }}
                                                            />
                                                        </ListItemButton>
                                                    );
                                                },
                                            )}
                                        </List>
                                    )}
                            </Box>
                        );
                    })}
                </List>
            </Box>

            {/* ==================================================
                Bottom
            ================================================== */}

            <Divider />

            <Box sx={{ p: 1.5 }}>
                <Tooltip
                    title={
                        collapsed && !isMobile
                            ? t(
                                  'admin.backToHome',
                                  'العودة للموقع',
                              )
                            : ''
                    }
                    placement={
                        isRTL
                            ? 'left'
                            : 'right'
                    }
                    arrow
                >
                    <ListItemButton
                        onClick={() =>
                            handleNavigate(
                                path.Home,
                            )
                        }
                        sx={{
                            minHeight: 46,
                            borderRadius: 2,
                            justifyContent:
                                collapsed &&
                                !isMobile
                                    ? 'center'
                                    : 'initial',
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth:
                                    collapsed &&
                                    !isMobile
                                        ? 0
                                        : 42,

                                justifyContent:
                                    'center',
                            }}
                        >
                            <Home />
                        </ListItemIcon>

                        {(!collapsed ||
                            isMobile) && (
                            <ListItemText
                                primary={t(
                                    'admin.backToHome',
                                    'العودة للموقع',
                                )}
                            />
                        )}
                    </ListItemButton>
                </Tooltip>
            </Box>
        </Box>
    );

    // ========================================================
    // Render
    // ========================================================

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                bgcolor:
                    theme.palette.background.default,
                direction,
            }}
        >
            {/* ==================================================
                Desktop Drawer
            ================================================== */}

            {!isMobile && (
                <Drawer
                    variant="permanent"
                    anchor={
                        isRTL
                            ? 'right'
                            : 'left'
                    }
                    sx={{
                        width:
                            collapsed
                                ? COLLAPSED_DRAWER_WIDTH
                                : DRAWER_WIDTH,

                        flexShrink: 0,

                        '& .MuiDrawer-paper': {
                            width:
                                collapsed
                                    ? COLLAPSED_DRAWER_WIDTH
                                    : DRAWER_WIDTH,

                            boxSizing:
                                'border-box',

                            border: 0,

                            borderInlineEnd:
                                isRTL
                                    ? 'none'
                                    : `1px solid ${theme.palette.divider}`,

                            borderInlineStart:
                                isRTL
                                    ? `1px solid ${theme.palette.divider}`
                                    : 'none',

                            transition:
                                theme.transitions.create(
                                    'width',
                                ),
                        },
                    }}
                >
                    {sidebarContent}
                </Drawer>
            )}

            {/* ==================================================
                Mobile Drawer
            ================================================== */}

            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() =>
                        setMobileOpen(false)
                    }
                    anchor={
                        isRTL
                            ? 'right'
                            : 'left'
                    }
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width:
                                MOBILE_DRAWER_WIDTH,
                            boxSizing:
                                'border-box',
                        },
                    }}
                >
                    {sidebarContent}
                </Drawer>
            )}

            {/* ==================================================
                Main
            ================================================== */}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* ==================================================
                    Header
                ================================================== */}

                <AppBar
                    position="sticky"
                    elevation={0}
                    color="inherit"
                    sx={{
                        borderBottom:
                            `1px solid ${theme.palette.divider}`,

                        bgcolor:
                            theme.palette.background.paper,

                        zIndex:
                            theme.zIndex.drawer - 1,
                    }}
                >
                    <Toolbar
                        sx={{
                            minHeight: {
                                xs: 64,
                                md: 72,
                            },
                            gap: 1,
                        }}
                    >
                        <IconButton
                            onClick={() => {
                                if (isMobile) {
                                    setMobileOpen(
                                        true,
                                    );
                                } else {
                                    setCollapsed(
                                        (value) =>
                                            !value,
                                    );
                                }
                            }}
                            aria-label={t(
                                'admin.toggleSidebar',
                                'فتح القائمة',
                            )}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box
                            sx={{
                                flex: 1,
                                minWidth: 0,
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={800}
                                noWrap
                            >
                                {t(
                                    'admin.title',
                                    'مركز إدارة صفقة',
                                )}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                            >
                                {t(
                                    'admin.subtitle',
                                    'إدارة المستخدمين والإعلانات والأمان والإشعارات',
                                )}
                            </Typography>
                        </Box>

                        <Tooltip
                            title={t(
                                'admin.backToHome',
                                'العودة للموقع',
                            )}
                        >
                            <IconButton
                                onClick={() =>
                                    handleNavigate(
                                        path.Home,
                                    )
                                }
                            >
                                <Home />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>

                {/* ==================================================
                    Breadcrumbs
                ================================================== */}

                <Box
                    sx={{
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                        pt: 2,
                    }}
                >
                    <Breadcrumbs
                        separator={
                            <NavigateNext
                                fontSize="small"
                                sx={
                                    isRTL
                                        ? {
                                              transform:
                                                  'rotate(180deg)',
                                          }
                                        : undefined
                                }
                            />
                        }
                        aria-label="breadcrumb"
                    >
                        {breadcrumbs.map(
                            (
                                breadcrumb,
                                index,
                            ) => {
                                const last =
                                    index ===
                                    breadcrumbs.length -
                                        1;

                                return (
                                    <ButtonBase
                                        key={`${breadcrumb.label}-${index}`}
                                        disabled={
                                            last ||
                                            !breadcrumb.path
                                        }
                                        onClick={() =>
                                            breadcrumb.path &&
                                            navigate(
                                                breadcrumb.path,
                                            )
                                        }
                                        sx={{
                                            borderRadius: 1,
                                            px: 0.5,
                                            py: 0.25,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color={
                                                last
                                                    ? 'text.primary'
                                                    : 'text.secondary'
                                            }
                                            fontWeight={
                                                last
                                                    ? 700
                                                    : 400
                                            }
                                        >
                                            {
                                                breadcrumb.label
                                            }
                                        </Typography>
                                    </ButtonBase>
                                );
                            },
                        )}
                    </Breadcrumbs>
                </Box>

                {/* ==================================================
                    Page Content
                ================================================== */}

                <Box
                    sx={{
                        flex: 1,
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                        py: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                        overflow: 'hidden',
                    }}
                >
                    <AnimatePresence
                        mode="wait"
                    >
                        <motion.div
                            key={
                                location.pathname
                            }
                            variants={
                                pageVariants
                            }
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{
                                duration: 0.22,
                                ease: 'easeOut',
                            }}
                            style={{
                                width: '100%',
                            }}
                        >
                            {/* IMPORTANT:
                                Admin routes render here.
                            */}
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLayout;