import {
    FunctionComponent,
    lazy,
    useCallback,
    useEffect,
    useState,
    Suspense,
} from 'react';

import {
    Divider,
    FormControlLabel,
    List,
    ListItemButton,
    ListItemText,
    Menu,
    FormGroup,
    Box,
    Typography,
    Tooltip,
    useMediaQuery,
    Toolbar,
    Button,
    Container,
    IconButton,
    Drawer,
    useTheme,
    AppBar,
    Badge,
} from '@mui/material';

import { PaletteMode } from '@mui/material';

import { styled } from '@mui/material/styles';

import LanguageSwitcher from '../../../locales/languageSwich';

import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import handleRTL from '../../../locales/handleRTL';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import ContactIcon from '@mui/icons-material/ContactMail';
import ListIcon from '@mui/icons-material/List';
import HelpIcon from '@mui/icons-material/Help';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MailIcon from '@mui/icons-material/Mail';

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleIcon from '@mui/icons-material/Schedule';

import { m, AnimatePresence } from 'framer-motion';

import { path, productsPathes } from '../../../routes/routes';

import socket from '../../../socket/globalSocket';

import RoleType from '../../../interfaces/UserType';

import { useTranslation } from 'react-i18next';

const AccountMenu = lazy(() => import('../userManage/AccountMenu'));

import { useUser } from '../../../hooks/useUSer';

import JsonLd from '../../../../utils/JsonLd';

const MobileDrawer = lazy(() => import('./MobileDrawer'));

import SafqaLogo from '../../../atoms/SafqaLogo';

import { useChat } from '../../../hooks/useChat';

import { GradientSwitch } from './GradientSwitch';

import { AppNotifications } from '../../../interfaces/Notification';

import { useNotifications } from '../../../context/NotificationContext';

// إذا كان هذا المسار موجودًا عندك استخدمه.
// إذا كان اسم الملف مختلفًا غيّره حسب مشروعك.

interface ThemeProps {
    mode: PaletteMode;
    setMode: (mode: PaletteMode) => void;
}

const Theme: FunctionComponent<ThemeProps> = ({ mode, setMode }) => {
    const navigate = useNavigate();

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const dir = handleRTL();

    const { t } = useTranslation();

    const { auth, isLoggedIn, logout: contextLogout } = useUser();

    const { notifications, unreadCount, markAsRead, markAllAsRead } =
        useNotifications();

    const { unreadCounts } = useChat();

    const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

    const [notificationAnchor, setNotificationAnchor] =
        useState<null | HTMLElement>(null);

    const notificationOpen = Boolean(notificationAnchor);

    const [mobileOpen, setMobileOpen] = useState(false);

    const [expandedMobileMenu, setExpandedMobileMenu] = useState<
        string | false
    >(false);

    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0,
    });

    const [hovered, setHovered] = useState(false);

    const { pathname } = useLocation();

    const isAdmin = auth?.role === RoleType.Admin;

    /**
     * =========================================================
     * THEME
     * =========================================================
     */

    const handleThemeChange = (
        _: React.SyntheticEvent<Element, Event>,
        checked: boolean,
    ) => {
        const newMode: PaletteMode = checked ? 'dark' : 'light';

        setMode(newMode);

        localStorage.setItem('theme', newMode);
    };

    /**
     * =========================================================
     * NOTIFICATIONS
     * =========================================================
     */

    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleCloseNotifications = () => {
        setNotificationAnchor(null);
    };

    /**
     * Get notification icon according to type
     */
    const getNotificationIcon = (notification: AppNotifications) => {
        switch (notification.type as AppNotifications['type']) {
            case 'post_approved':
                return (
                    <CheckCircleIcon
                        sx={{
                            color: 'success.main',
                            fontSize: 24,
                            mt: 0.3,
                            mr: 1,
                            ml: 1,
                        }}
                    />
                );

            case 'post_rejected':
                return (
                    <CancelIcon
                        sx={{
                            color: 'error.main',
                            fontSize: 24,
                            mt: 0.3,
                            mr: 1,
                            ml: 1,
                        }}
                    />
                );

            case 'post_pending_review':
                return (
                    <ScheduleIcon
                        sx={{
                            color: 'warning.main',
                            fontSize: 24,
                            mt: 0.3,
                            mr: 1,
                            ml: 1,
                        }}
                    />
                );

            default:
                return (
                    <NotificationsNoneIcon
                        sx={{
                            color: 'primary.main',
                            fontSize: 24,
                            mt: 0.3,
                            mr: 1,
                            ml: 1,
                        }}
                    />
                );
        }
    };

    /**
     * Navigate to notification target
     */
    const handleNotificationItemClick = async (
        notification: AppNotifications,
    ) => {
        try {
            // Mark as read first
            if (!notification.readAt) {
                await markAsRead(notification._id);
            }

            handleCloseNotifications();

            const postId = notification.data?.postId;

            if (!postId) {
                return;
            }

            const category = notification.data?.category;
            const brand = notification.data?.brand;

            /**
             * =====================================================
             * ADMIN / MODERATOR
             * إعلان جديد بانتظار المراجعة
             * =====================================================
             */
            if (notification.type === 'post_pending_review') {
                // الأفضل توجيه الأدمن/المودريتور إلى صفحة الإعلانات المعلقة
                navigate(`${path.UsersManagement}?tab=pending-posts`);

                return;
            }

            /**
             * =====================================================
             * APPROVED / REJECTED
             * =====================================================
             */

            if (category && brand) {
                navigate(
                    `${productsPathes.postsDetails}/${category}/${brand}/${postId}`,
                );

                return;
            }

            /**
             * Fallback
             */
            navigate(`/posts/${postId}`);
        } catch (error) {
            console.error('Failed to open notification:', error);
        }
    };
    /**
     * =========================================================
     * NOTIFICATION MENU
     * =========================================================
     */

    const notificationMenu = (
        <Menu
            anchorEl={notificationAnchor}
            open={notificationOpen}
            onClose={handleCloseNotifications}
            dir={dir}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: dir === 'rtl' ? 'left' : 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: dir === 'rtl' ? 'left' : 'right',
            }}
            slotProps={{
                paper: {
                    elevation: 8,
                    sx: {
                        width: {
                            xs: 'calc(100vw - 16px)',
                            sm: 390,
                        },

                        maxWidth: 'calc(100vw - 16px)',

                        maxHeight: {
                            xs: 'calc(100vh - 100px)',
                            sm: 560,
                        },

                        borderRadius: 3,

                        overflow: 'hidden',

                        mt: 1,
                    },
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,

                    display: 'flex',

                    alignItems: 'center',

                    justifyContent: 'space-between',

                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    {unreadCount > 0 ? (
                        <NotificationsActiveIcon color='primary' />
                    ) : (
                        <NotificationsNoneIcon color='action' />
                    )}

                    <Typography fontWeight={700} fontSize={17}>
                        الإشعارات
                    </Typography>

                    {unreadCount > 0 && (
                        <Badge
                            badgeContent={
                                unreadCount > 99 ? '99+' : unreadCount
                            }
                            color='error'
                        />
                    )}
                </Box>

                {unreadCount > 0 && (
                    <Button
                        size='small'
                        variant='text'
                        onClick={() => markAllAsRead()}
                        sx={{
                            minWidth: 'auto',
                            fontSize: 12,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        تحديد الكل كمقروء
                    </Button>
                )}
            </Box>

            <Divider />

            {/* Empty */}
            {notifications.length === 0 ? (
                <Box
                    sx={{
                        py: 6,
                        px: 2,
                        textAlign: 'center',
                    }}
                >
                    <NotificationsNoneIcon
                        sx={{
                            fontSize: 52,
                            opacity: 0.3,
                            mb: 1,
                        }}
                    />

                    <Typography variant='body2' color='text.secondary'>
                        لا توجد إشعارات
                    </Typography>
                </Box>
            ) : (
                <List
                    disablePadding
                    sx={{
                        maxHeight: {
                            xs: 'calc(100vh - 180px)',
                            sm: 470,
                        },

                        overflowY: 'auto',

                        '&::-webkit-scrollbar': {
                            width: 6,
                        },
                    }}
                >
                    {notifications.map((notification: AppNotifications) => {
                        const isUnread = !notification.readAt;

                        return (
                            <ListItemButton
                                key={notification._id}
                                onClick={() =>
                                    handleNotificationItemClick(notification)
                                }
                                sx={{
                                    alignItems: 'flex-start',

                                    py: 1.5,

                                    px: 1.5,

                                    bgcolor: isUnread
                                        ? 'action.hover'
                                        : 'transparent',

                                    borderBottom: '1px solid',

                                    borderColor: 'divider',

                                    transition: 'background-color .2s',

                                    '&:hover': {
                                        bgcolor: 'action.selected',
                                    },
                                }}
                            >
                                {/* Icon */}
                                {getNotificationIcon(notification)}

                                {/* Text */}
                                <ListItemText
                                    sx={{
                                        m: 0,
                                        minWidth: 0,
                                    }}
                                    primary={
                                        <Box
                                            sx={{
                                                display: 'flex',

                                                alignItems: 'flex-start',

                                                gap: 1,
                                            }}
                                        >
                                            <Typography
                                                variant='body2'
                                                fontWeight={
                                                    isUnread ? 700 : 500
                                                }
                                                sx={{
                                                    flex: 1,

                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {notification.title}
                                            </Typography>

                                            {isUnread && (
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        minWidth: 8,
                                                        borderRadius: '50%',
                                                        bgcolor: 'error.main',
                                                        mt: 0.7,
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        <Box
                                            sx={{
                                                mt: 0.4,
                                            }}
                                        >
                                            {notification.body && (
                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                    sx={{
                                                        lineHeight: 1.5,

                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {notification.body}
                                                </Typography>
                                            )}

                                            <Typography
                                                variant='caption'
                                                color='text.disabled'
                                            >
                                                {new Date(
                                                    notification.createdAt,
                                                ).toLocaleString('ar', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short',
                                                })}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            )}
        </Menu>
    );

    /**
     * =========================================================
     * MOUSE EFFECT
     * =========================================================
     */

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    /**
     * =========================================================
     * SCROLL
     * =========================================================
     */

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    /**
     * =========================================================
     * LOGOUT
     * =========================================================
     */

    const handleLogout = useCallback(async () => {
        try {
            socket.disconnect();
        } catch (err) {
            console.warn('Socket disconnect failed:', err);
        }

        await contextLogout();

        navigate(path.Home);

        setMobileOpen(false);

        /**
         * Close notifications too
         */
        setNotificationAnchor(null);
    }, [contextLogout, navigate]);

    /**
     * =========================================================
     * DRAWER
     * =========================================================
     */

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    /**
     * =========================================================
     * RENDER
     * =========================================================
     */

    return (
        <>
            {/* =================================================
                SEO
            ================================================= */}

            <JsonLd
                data={{
                    '@context': 'https://schema.org',

                    '@type': 'WebSite',

                    name: 'صفقة',

                    alternateName: 'صفقة - موقع البيع والشراء',

                    url: window.location.origin,

                    description: 'أكبر موقع عربي للبيع والشراء عبر الإنترنت',

                    inLanguage: 'ar',

                    potentialAction: {
                        '@type': 'SearchAction',

                        target: `${window.location.origin}/search?q={search_term_string}`,

                        'query-input': 'required name=search_term_string',
                    },

                    publisher: {
                        '@type': 'Organization',

                        name: 'صفقة',

                        logo: `${window.location.origin}/d3.png`,
                    },
                }}
            />

            {/* =================================================
                APP BAR
            ================================================= */}

            <AppBar
                component='header'
                position='sticky'
                dir={dir}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    background: mode === 'dark' ? '#151B1E' : '#ffffff',

                    boxShadow: '0 1px 10px #414141',

                    zIndex: 1100,

                    overflow: 'hidden',

                    top: 0,

                    flexWrap: 'wrap',

                    '&::after': {
                        content: '""',

                        position: 'absolute',

                        inset: 1,

                        borderRadius: '21px',

                        pointerEvents: 'none',

                        borderBottom: '3px solid transparent',

                        background: `
                            radial-gradient(
                                180px circle at
                                ${mousePosition.x - 10}px
                                ${mousePosition.y - 10}px,
                                rgb(255, 167, 38),
                                transparent 60%
                            )
                            border-box
                        `,

                        WebkitMask:
                            'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',

                        WebkitMaskComposite: 'xor',

                        maskComposite: 'exclude',

                        opacity: hovered ? 1 : 0,

                        transition: 'opacity .25s',
                    },
                }}
                aria-label='شريط التنقل'
                title='شريط التنقل'
            >
                <Container
                    maxWidth='xl'
                    sx={{
                        px: {
                            xs: 1,
                            sm: 0,
                            md: 0,
                        },
                    }}
                >
                    <Toolbar
                        component='nav'
                        aria-label='قائمة التنقل الرئيسية'
                        title='قائمة التنقل الرئيسية'
                        sx={{
                            display: 'flex',

                            justifyContent: 'space-between',

                            alignItems: 'center',

                            p: 0,

                            minHeight: {
                                xs: '64px',
                                md: '72px',
                            },

                            flexWrap: 'nowrap',
                        }}
                    >
                        {/* =================================================
                            LEFT SIDE
                        ================================================= */}

                        <Box
                            sx={{
                                display: 'flex',

                                alignItems: 'center',

                                gap: 1,

                                minWidth: 0,

                                flexShrink: 1,
                            }}
                        >
                            {/* Mobile Menu */}
                            <IconButton
                                color='inherit'
                                aria-label='فتح القائمة'
                                title='فتح القائمة'
                                onClick={handleDrawerToggle}
                                sx={{
                                    display: {
                                        xs: 'flex',
                                        md: 'none',
                                    },

                                    color:
                                        mode === 'dark' ? '#e2e8f0' : '#4a5568',

                                    flexShrink: 0,
                                }}
                            >
                                <MenuIcon />
                            </IconButton>

                            {/* Logo */}
                            <m.div
                                whileHover={{
                                    scale: 1.05,
                                }}
                                whileTap={{
                                    scale: 0.95,
                                }}
                            >
                                <Link
                                    to={path.Home}
                                    style={{
                                        textDecoration: 'none',

                                        listStyle: 'none',
                                    }}
                                    aria-label='الرئيسية - موقع صفقة'
                                    title='الرئيسية - موقع صفقة'
                                >
                                    <SafqaLogo />
                                </Link>
                            </m.div>

                            {/* =================================================
                                MOBILE ICONS
                            ================================================= */}

                            {isMobile && isLoggedIn && (
                                <>
                                    {/* Messages */}
                                    <Box
                                        sx={{
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Badge
                                            badgeContent={totalUnread || 0}
                                            color='error'
                                            max={99}
                                        >
                                            <StyledNavLink
                                                to={path.MessagesPage}
                                                aria-label='الرسائل'
                                                title='الرسائل'
                                            >
                                                <MailIcon
                                                    sx={{
                                                        fontSize: 20,
                                                    }}
                                                />
                                            </StyledNavLink>
                                        </Badge>
                                    </Box>

                                    {/* Notifications */}
                                    <IconButton
                                        onClick={handleNotificationClick}
                                        aria-label='الإشعارات'
                                        title='الإشعارات'
                                        sx={{
                                            color:
                                                mode === 'dark'
                                                    ? '#e2e8f0'
                                                    : '#4a5568',

                                            flexShrink: 0,
                                        }}
                                    >
                                        <Badge
                                            badgeContent={
                                                unreadCount > 99
                                                    ? '99+'
                                                    : unreadCount
                                            }
                                            color='error'
                                            overlap='circular'
                                        >
                                            {unreadCount > 0 ? (
                                                <NotificationsActiveIcon />
                                            ) : (
                                                <NotificationsNoneIcon />
                                            )}
                                        </Badge>
                                    </IconButton>
                                </>
                            )}

                            {/* =================================================
                                JOBS
                            ================================================= */}

                            <Box
                                component='li'
                                role='listitem'
                                sx={{
                                    flexShrink: 0,
                                    listStyle: 'none',
                                }}
                            >
                                <StyledNavLink
                                    to={path.jobs}
                                    aria-label={t('links.jobs') || 'الوظائف'}
                                    title={t('links.jobs') || 'الوظائف'}
                                >
                                    <WorkOutlineIcon
                                        sx={{
                                            fontSize: 20,
                                        }}
                                    />
                                </StyledNavLink>
                            </Box>

                            {/* =================================================
                                MY LISTINGS
                            ================================================= */}

                            {isLoggedIn && (
                                <Box
                                    sx={{
                                        borderRadius: '8px',

                                        '&.active': {
                                            backgroundColor:
                                                'rgba(255, 168, 38, 0.541)',

                                            color: 'rgb(255, 167, 38)',

                                            fontWeight: 'bold',
                                        },
                                    }}
                                >
                                    <StyledNavLink
                                        to={`${path.CustomerProfile.replace(
                                            ':slug',
                                            '',
                                        )}/${auth?.slug}`}
                                        aria-label={
                                            t('footer.myListings') || 'إعلاناتي'
                                        }
                                        title={
                                            t('footer.myListings') || 'إعلاناتي'
                                        }
                                    >
                                        <ListIcon
                                            sx={{
                                                fontSize: 20,
                                            }}
                                        />
                                    </StyledNavLink>
                                </Box>
                            )}

                            {/* =================================================
                                DESKTOP NAVIGATION
                            ================================================= */}

                            <Box
                                component='ul'
                                sx={{
                                    display: {
                                        xs: 'none',
                                        md: 'flex',
                                    },

                                    listStyle: 'none',

                                    m: 0,

                                    p: 0,

                                    alignItems: 'center',

                                    gap: 0.5,

                                    minWidth: 0,

                                    flexShrink: 1,

                                    flexWrap: 'nowrap',

                                    overflowX: 'auto',

                                    '&::-webkit-scrollbar': {
                                        display: 'none',
                                    },

                                    scrollbarWidth: 'none',
                                }}
                                aria-label='روابط التنقل الرئيسية'
                                title='روابط التنقل الرئيسية'
                            >
                                {/* Home */}
                                <Box
                                    component='li'
                                    role='listitem'
                                    sx={{
                                        flexShrink: 0,
                                        listStyle: 'none',
                                    }}
                                >
                                    <StyledNavLink
                                        to={path.Home}
                                        aria-label={t('home')}
                                        title={t('home')}
                                    >
                                        <HomeIcon
                                            sx={{
                                                fontSize: 20,
                                            }}
                                        />
                                    </StyledNavLink>
                                </Box>

                                {/* Delete Account */}
                                <Box
                                    component='li'
                                    role='listitem'
                                    sx={{
                                        flexShrink: 0,
                                    }}
                                >
                                    <StyledNavLink
                                        to={path.DeleteAccount}
                                        aria-label={t(
                                            'pages.deleteAccount.title',
                                        )}
                                        title={t('pages.deleteAccount.title')}
                                    >
                                        <DeleteSharpIcon
                                            sx={{
                                                fontSize: 20,
                                            }}
                                        />
                                    </StyledNavLink>
                                </Box>

                                {/* Favorites */}
                                {auth?._id && (
                                    <Box
                                        component='li'
                                        role='listitem'
                                        sx={{
                                            flexShrink: 0,
                                        }}
                                    >
                                        <StyledNavLink
                                            to={path.Favorite}
                                            aria-label={
                                                t('favorites') || 'المفضلة'
                                            }
                                            title={t('favorites') || 'المفضلة'}
                                        >
                                            <FavoriteIcon
                                                sx={{
                                                    fontSize: 20,
                                                }}
                                            />
                                        </StyledNavLink>
                                    </Box>
                                )}

                                {/* =================================================
                                    DESKTOP NOTIFICATIONS
                                ================================================= */}

                                {isLoggedIn && (
                                    <Box
                                        component='li'
                                        role='listitem'
                                        sx={{
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Tooltip
                                            title='الإشعارات'
                                            placement='bottom'
                                        >
                                            <IconButton
                                                onClick={
                                                    handleNotificationClick
                                                }
                                                aria-label='الإشعارات'
                                                title='الإشعارات'
                                                sx={{
                                                    color:
                                                        mode === 'dark'
                                                            ? '#fdfeff'
                                                            : '#33415a',

                                                    borderRadius: 2,

                                                    '&:hover': {
                                                        backgroundColor:
                                                            'rgba(255, 167, 38, 0.10)',
                                                    },
                                                }}
                                            >
                                                <Badge
                                                    badgeContent={
                                                        unreadCount > 99
                                                            ? '99+'
                                                            : unreadCount
                                                    }
                                                    color='error'
                                                    overlap='circular'
                                                >
                                                    {unreadCount > 0 ? (
                                                        <NotificationsActiveIcon />
                                                    ) : (
                                                        <NotificationsNoneIcon />
                                                    )}
                                                </Badge>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                )}

                                {/* About */}
                                <Box
                                    component='li'
                                    role='listitem'
                                    sx={{
                                        flexShrink: 0,
                                    }}
                                >
                                    <StyledNavLink
                                        to={path.About}
                                        aria-label={`${t(
                                            'links.about',
                                        )} معلومات عن موقع صفقة`}
                                        title={`${t(
                                            'links.about',
                                        )} معلومات عن موقع صفقة`}
                                    >
                                        <InfoIcon
                                            sx={{
                                                fontSize: 20,
                                            }}
                                        />
                                    </StyledNavLink>
                                </Box>

                                {/* Messages */}
                                {isLoggedIn && (
                                    <Box
                                        component='li'
                                        role='listitem'
                                        sx={{
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Badge
                                            badgeContent={totalUnread || 0}
                                            color='error'
                                            max={99}
                                        >
                                            <StyledNavLink
                                                to={path.MessagesPage}
                                                aria-label='الرسائل'
                                                title='الرسائل'
                                            >
                                                <MailIcon
                                                    sx={{
                                                        fontSize: 20,
                                                    }}
                                                />
                                            </StyledNavLink>
                                        </Badge>
                                    </Box>
                                )}

                                {/* Contact */}
                                <Box
                                    component='li'
                                    role='listitem'
                                    sx={{
                                        flexShrink: 0,
                                    }}
                                >
                                    <StyledNavLink
                                        to={path.Contact}
                                        aria-label={t('links.contact')}
                                        title={t('links.contact')}
                                    >
                                        <ContactIcon
                                            sx={{
                                                fontSize: 18,
                                            }}
                                        />
                                    </StyledNavLink>
                                </Box>

                                {/* Help */}
                                <Box
                                    component='li'
                                    role='listitem'
                                    sx={{
                                        flexShrink: 0,
                                    }}
                                >
                                    <StyledNavLink
                                        to={path.SellingHelp}
                                        aria-label={t('help')}
                                        title={t('help')}
                                    >
                                        <HelpIcon
                                            sx={{
                                                fontSize: 20,
                                            }}
                                        />
                                    </StyledNavLink>
                                </Box>

                                {/* Admin */}
                                {(isAdmin ||
                                    auth?.role === RoleType.Moderator) && (
                                    <Box component='li' role='listitem'>
                                        <StyledNavLink
                                            to={path.UsersManagement}
                                            aria-label={t('users-management')}
                                            title={t('users-management')}
                                        >
                                            <DashboardIcon
                                                sx={{
                                                    fontSize: 20,
                                                }}
                                            />
                                        </StyledNavLink>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* =================================================
                            RIGHT SIDE
                        ================================================= */}

                        <Box
                            sx={{
                                display: 'flex',

                                alignItems: 'center',

                                gap: {
                                    xs: 1,
                                    sm: 2,
                                },

                                flexWrap: 'nowrap',

                                flexShrink: 0,
                            }}
                        >
                            {/* Theme */}
                            {!isMobile && (
                                <Tooltip
                                    title={
                                        mode === 'dark'
                                            ? t('lightMode')
                                            : t('darkMode')
                                    }
                                >
                                    <m.div
                                        whileHover={{
                                            scale: 1.1,
                                        }}
                                        whileTap={{
                                            scale: 0.95,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',

                                                alignItems: 'center',

                                                gap: 1,
                                            }}
                                        >
                                            <FormGroup>
                                                <FormControlLabel
                                                    checked={mode === 'dark'}
                                                    onChange={handleThemeChange}
                                                    control={
                                                        <GradientSwitch
                                                            sx={{
                                                                m: 0,
                                                            }}
                                                        />
                                                    }
                                                    label=''
                                                    aria-label='تبديل وضع السمة'
                                                />
                                            </FormGroup>

                                            <AnimatePresence mode='wait'>
                                                <m.div
                                                    key={mode}
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 0.8,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                >
                                                    {mode === 'dark' ? (
                                                        <Brightness4Icon
                                                            sx={{
                                                                color: '#ffffff',

                                                                fontSize: {
                                                                    xs: 24,
                                                                    md: 28,
                                                                },

                                                                display: {
                                                                    xs: 'none',
                                                                    sm: 'block',
                                                                },
                                                            }}
                                                        />
                                                    ) : (
                                                        <Brightness7Icon
                                                            sx={{
                                                                color: '#ffd000',

                                                                fontSize: {
                                                                    xs: 24,
                                                                    md: 28,
                                                                },

                                                                display: {
                                                                    xs: 'none',
                                                                    sm: 'block',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </m.div>
                                            </AnimatePresence>
                                        </Box>
                                    </m.div>
                                </Tooltip>
                            )}

                            {/* Language */}
                            {!isMobile && (
                                <m.div
                                    whileHover={{
                                        scale: 1.05,
                                    }}
                                    whileTap={{
                                        scale: 0.95,
                                    }}
                                >
                                    <LanguageSwitcher />
                                </m.div>
                            )}

                            {/* Account */}
                            <Suspense fallback={null}>
                                <Box
                                    sx={{
                                        display: {
                                            xs: 'block',
                                        },
                                    }}
                                >
                                    {!isLoggedIn ? (
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            onClick={() => navigate(path.Login)}
                                            sx={{
                                                borderRadius: '30px',

                                                fontWeight: 'bold',

                                                backgroundColor: '#FBBC05',

                                                color: '#1A1E22',

                                                px: 3,

                                                '&:hover': {
                                                    backgroundColor: '#fb9905',
                                                },
                                            }}
                                            aria-label='تسجيل الدخول إلى حسابك في موقع صفقة'
                                        >
                                            {t('links.login')}
                                        </Button>
                                    ) : (
                                        <AccountMenu logout={handleLogout} />
                                    )}
                                </Box>
                            </Suspense>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* =================================================
                NOTIFICATION MENU
            ================================================= */}

            {notificationMenu}

            {/* =================================================
                MOBILE DRAWER
            ================================================= */}

            <Drawer
                variant='temporary'
                anchor={dir === 'rtl' ? 'left' : 'right'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: {
                        xs: 'block',
                        md: 'none',
                    },

                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',

                        width: {
                            xs: '100%',
                            sm: 320,
                        },

                        border: 'none',

                        zIndex: 1200,
                    },
                }}
            >
                <Suspense fallback={null}>
                    <MobileDrawer
                        expandedMobileMenu={expandedMobileMenu}
                        setExpandedMobileMenu={setExpandedMobileMenu}
                        auth={auth}
                        handleDrawerToggle={handleDrawerToggle}
                        handleThemeChange={handleThemeChange}
                        isAdmin={isAdmin}
                        isLoggedIn={isLoggedIn}
                        logout={handleLogout}
                        setMobileOpen={setMobileOpen}
                        mode={mode}
                    />
                </Suspense>
            </Drawer>

            {/* =================================================
                MOBILE BACKDROP
            ================================================= */}

            {mobileOpen && (
                <Box
                    sx={{
                        position: 'fixed',

                        top: 0,

                        left: 0,

                        right: 0,

                        bottom: 0,

                        backgroundColor: 'rgba(0,0,0,0.5)',

                        zIndex: 1199,

                        display: {
                            xs: 'block',
                            md: 'none',
                        },
                    }}
                    onClick={handleDrawerToggle}
                />
            )}
        </>
    );
};

export default Theme;

/**
 * =========================================================
 * STYLED NAV LINK
 * =========================================================
 */

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none',

    listStyle: 'none',

    color: theme.palette.mode === 'dark' ? '#fdfeff' : '#33415a',

    padding: '8px 16px',

    borderRadius: '8px',

    transition: 'all 0.3s ease',

    display: 'flex',

    alignItems: 'center',

    gap: '8px',

    '&:hover': {
        backgroundColor:
            theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.04)',

        transform: 'translateY(-2px)',
    },

    '&.active': {
        fontWeight: 'bold',

        border:
            theme.palette.mode === 'dark'
                ? '2px solid rgba(255, 255, 255, 0.884)'
                : '2px solid rgb(245, 159, 11)',
    },
}));
