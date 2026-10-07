import {
    FunctionComponent,
    lazy,
    ReactNode,
    useCallback,
    useEffect,
    useState,
    Suspense,
} from 'react';

import {
    AppBar,
    Badge,
    Box,
    Button,
    Container,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    PaletteMode,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

import {
    generatePath,
    Link,
    NavLink,
    useLocation,
    useNavigate,
} from 'react-router-dom';

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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleIcon from '@mui/icons-material/Schedule';

import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import LanguageSwitcher from '../../../locales/languageSwich';
import handleRTL from '../../../locales/handleRTL';
import { path, productsPathes } from '../../../routes/routes';
import socket from '../../../socket/globalSocket';
import RoleType from '../../../interfaces/UserType';
import { useUser } from '../../../hooks/useUSer';
import JsonLd from '../../../../utils/JsonLd';
import SafqaLogo from '../../../atoms/SafqaLogo';
import { useChat } from '../../../hooks/useChat';
import { AppNotifications } from '../../../interfaces/Notification';
import { useNotifications } from '../../../context/NotificationContext';

const AccountMenu = lazy(() => import('../userManage/AccountMenu'));
const MobileDrawer = lazy(() => import('./MobileDrawer'));

const GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';
const AMBER = '#f59f0b';

/* ========================= STYLED ========================= */

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    borderRadius: 10,
    textDecoration: 'none',
    color: theme.palette.mode === 'dark' ? '#e2e8f0' : '#33415a',
    transition: 'background-color .2s, color .2s',

    '&:hover': {
        backgroundColor:
            theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.05)',
    },

    '&.active': {
        color: AMBER,
        fontWeight: 700,
        backgroundColor: alpha(AMBER, 0.12),
        '&::after': {
            content: '""',
            position: 'absolute',
            insetInline: 12,
            bottom: 2,
            height: 3,
            borderRadius: 2,
            background: GRADIENT,
        },
    },
}));

/* ========================= NAV ITEM ========================= */

interface NavItemProps {
    to: string;
    icon: ReactNode;
    label: string;
    badge?: number;
    end?: boolean;
}

/** أيقونة + Tooltip دايماً، والنص بيظهر من lg وطالع (ما في شي بيختفي بدون بديل) */
const NavItem = ({ to, icon, label, badge = 0, end }: NavItemProps) => (
    <Tooltip title={label}>
        <StyledNavLink to={to} end={end} aria-label={label}>
            <Badge badgeContent={badge} color='error' max={99}>
                {icon}
            </Badge>
            <Box
                component='span'
                sx={{
                    display: { xs: 'none', lg: 'inline' },
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap',
                }}
            >
                {label}
            </Box>
        </StyledNavLink>
    </Tooltip>
);

/* ========================= COMPONENT ========================= */

interface ThemeProps {
    mode: PaletteMode;
    setMode: (mode: PaletteMode) => void;
}

const Theme: FunctionComponent<ThemeProps> = ({ mode, setMode }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dir = handleRTL();
    const { t, i18n } = useTranslation();
    const { pathname } = useLocation();

    const { auth, isLoggedIn, logout: contextLogout } = useUser();
    const { notifications, unreadCount, markAsRead, markAllAsRead } =
        useNotifications();
    const { unreadCounts } = useChat();
    const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

    const [notificationAnchor, setNotificationAnchor] =
        useState<null | HTMLElement>(null);
    const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<
        string | false
    >(false);

    const isAdmin = auth?.role === RoleType.Admin;
    const isStaff = isAdmin || auth?.role === RoleType.Moderator;

    const iconBtnSx = {
        color: mode === 'dark' ? '#e2e8f0' : '#33415a',
        borderRadius: '10px',
        '&:hover': { backgroundColor: alpha(AMBER, 0.12) },
    } as const;

    /* ---------- THEME ---------- */

    const applyMode = (newMode: PaletteMode) => {
        setMode(newMode);
        localStorage.setItem('theme', newMode);
    };

    // يُستعمل من MobileDrawer (نفس الـ signature القديم)
    const handleThemeChange = (
        _: React.SyntheticEvent<Element, Event>,
        checked: boolean,
    ) => applyMode(checked ? 'dark' : 'light');

    /* ---------- NOTIFICATIONS ---------- */

    const handleCloseNotifications = () => setNotificationAnchor(null);

    const getNotificationIcon = (notification: AppNotifications) => {
        const sx = { fontSize: 24, mt: 0.3, mx: 1 };
        switch (notification.type as AppNotifications['type']) {
            case 'post_approved':
                return <CheckCircleIcon sx={{ ...sx, color: 'success.main' }} />;
            case 'post_rejected':
                return <CancelIcon sx={{ ...sx, color: 'error.main' }} />;
            case 'post_pending_review':
                return <ScheduleIcon sx={{ ...sx, color: 'warning.main' }} />;
            default:
                return (
                    <NotificationsNoneIcon
                        sx={{ ...sx, color: 'primary.main' }}
                    />
                );
        }
    };

    const handleNotificationItemClick = async (
        notification: AppNotifications,
    ) => {
        try {
            if (!notification.readAt) {
                await markAsRead(notification._id);
            }

            handleCloseNotifications();

            const postId = notification.data?.postId;
            if (!postId) return;

            const category = notification.data?.category;
            const brand = notification.data?.brand;

            if (notification.type === 'post_pending_review') {
                navigate(`${path.UsersManagement}?tab=pending-posts`);
                return;
            }

            if (category && brand) {
                navigate(
                    `${productsPathes.postsDetails}/${category}/${brand}/${postId}`,
                );
                return;
            }

            navigate(`/posts/${postId}`);
        } catch (error) {
            console.error('Failed to open notification:', error);
        }
    };

    const notificationMenu = (
        <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
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
                        width: { xs: 'calc(100vw - 16px)', sm: 390 },
                        maxWidth: 'calc(100vw - 16px)',
                        maxHeight: { xs: 'calc(100vh - 100px)', sm: 560 },
                        borderRadius: 3,
                        overflow: 'hidden',
                        mt: 1,
                    },
                },
            }}
        >
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {unreadCount > 0 ? (
                        <NotificationsActiveIcon color='primary' />
                    ) : (
                        <NotificationsNoneIcon color='action' />
                    )}
                    <Typography fontWeight={700} fontSize={17}>
                        {t('notifications.title', 'الإشعارات')}
                    </Typography>
                    {unreadCount > 0 && (
                        <Badge
                            badgeContent={unreadCount > 99 ? '99+' : unreadCount}
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
                        {t('notifications.markAllRead', 'تحديد الكل كمقروء')}
                    </Button>
                )}
            </Box>

            <Divider />

            {notifications.length === 0 ? (
                <Box sx={{ py: 6, px: 2, textAlign: 'center' }}>
                    <NotificationsNoneIcon
                        sx={{ fontSize: 52, opacity: 0.3, mb: 1 }}
                    />
                    <Typography variant='body2' color='text.secondary'>
                        {t('notifications.empty', 'لا توجد إشعارات')}
                    </Typography>
                </Box>
            ) : (
                <List
                    disablePadding
                    sx={{
                        maxHeight: { xs: 'calc(100vh - 180px)', sm: 470 },
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': { width: 6 },
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
                                    '&:hover': { bgcolor: 'action.selected' },
                                }}
                            >
                                {getNotificationIcon(notification)}

                                <ListItemText
                                    sx={{ m: 0, minWidth: 0 }}
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
                                                fontWeight={isUnread ? 700 : 500}
                                                sx={{ flex: 1, lineHeight: 1.5 }}
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
                                        <Box sx={{ mt: 0.4 }}>
                                            {notification.body && (
                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                    sx={{ lineHeight: 1.5, mb: 0.5 }}
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
                                                ).toLocaleString(i18n.language, {
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

    /* ---------- GLOW (بدون re-render): CSS variables ---------- */

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    /* ---------- LOGOUT / DRAWER ---------- */

    const handleLogout = useCallback(async () => {
        try {
            socket.disconnect();
        } catch (err) {
            console.warn('Socket disconnect failed:', err);
        }

        await contextLogout();
        navigate(path.Home);
        setMobileOpen(false);
        setNotificationAnchor(null);
    }, [contextLogout, navigate]);

    const handleDrawerToggle = () => setMobileOpen((v) => !v);

    const myListingsPath = auth?.slug
        ? generatePath(path.CustomerProfile, {
              slug: encodeURIComponent(auth.slug),
          })
        : '';

    /* ========================= RENDER ========================= */

    return (
        <>
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

            <AppBar
                component='header'
                position='sticky'
                dir={dir}
                onMouseMove={handleMouseMove}
                sx={{
                    top: 0,
                    zIndex: 1100,
                    overflow: 'hidden',
                    color: 'text.primary',
                    background: mode === 'dark' ? '#151B1E' : '#ffffff',
                    boxShadow: '0 1px 10px rgba(0,0,0,0.25)',

                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 1,
                        borderRadius: '21px',
                        pointerEvents: 'none',
                        borderBottom: '3px solid transparent',
                        background: `radial-gradient(180px circle at calc(var(--mx, -999px) - 10px) calc(var(--my, -999px) - 10px), rgb(255,167,38), transparent 60%) border-box`,
                        WebkitMask:
                            'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        opacity: 0,
                        transition: 'opacity .25s',
                    },
                    '&:hover::after': { opacity: 1 },
                }}
            >
                <Container maxWidth='xl' sx={{ px: { xs: 1, md: 2 } }}>
                    <Toolbar
                        component='nav'
                        aria-label='قائمة التنقل الرئيسية'
                        disableGutters
                        sx={{
                            minHeight: { xs: 60, md: 68 },
                            gap: 1,
                            flexWrap: 'nowrap',
                        }}
                    >
                        {/* ───── START: menu + logo ───── */}
                        <IconButton
                            aria-label='فتح القائمة'
                            onClick={handleDrawerToggle}
                            sx={{ ...iconBtnSx, display: { xs: 'flex', md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to={path.Home}
                                style={{ textDecoration: 'none', display: 'block' }}
                                aria-label='الرئيسية - موقع صفقة'
                            >
                                <SafqaLogo />
                            </Link>
                        </m.div>

                        {/* ───── PRIMARY LINKS (desktop) ───── */}
                        <Box
                            component='ul'
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                listStyle: 'none',
                                m: 0,
                                p: 0,
                                ms: 2,
                                gap: 0.5,
                            }}
                        >
                            <li>
                                <NavItem
                                    to={path.Home}
                                    end
                                    label={t('home')}
                                    icon={<HomeIcon sx={{ fontSize: 22 }} />}
                                />
                            </li>
                            <li>
                                <NavItem
                                    to={path.jobs}
                                    label={t('links.jobs') || 'الوظائف'}
                                    icon={<WorkOutlineIcon sx={{ fontSize: 22 }} />}
                                />
                            </li>
                            {auth?._id && (
                                <li>
                                    <NavItem
                                        to={path.Favorite}
                                        label={t('favorites') || 'المفضلة'}
                                        icon={<FavoriteIcon sx={{ fontSize: 22 }} />}
                                    />
                                </li>
                            )}
                            {isLoggedIn && myListingsPath && (
                                <li>
                                    <NavItem
                                        to={myListingsPath}
                                        label={t('footer.myListings') || 'إعلاناتي'}
                                        icon={<ListIcon sx={{ fontSize: 22 }} />}
                                    />
                                </li>
                            )}
                            {isStaff && (
                                <li>
                                    <NavItem
                                        to={path.UsersManagement}
                                        label={t('users-management')}
                                        icon={<DashboardIcon sx={{ fontSize: 22 }} />}
                                    />
                                </li>
                            )}
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* ───── END ───── */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 0.25, md: 0.5 },
                                flexShrink: 0,
                            }}
                        >
                            {isLoggedIn && (
                                <>
                                    <NavItem
                                        to={path.MessagesPage}
                                        label={t('accountMenu.messages') || 'الرسائل'}
                                        badge={totalUnread}
                                        icon={<MailIcon sx={{ fontSize: 22 }} />}
                                    />

                                    <Tooltip title={t('notifications.title', 'الإشعارات')}>
                                        <IconButton
                                            onClick={(e) =>
                                                setNotificationAnchor(e.currentTarget)
                                            }
                                            aria-label={t('notifications.title', 'الإشعارات')}
                                            sx={iconBtnSx}
                                        >
                                            <Badge
                                                badgeContent={unreadCount}
                                                color='error'
                                                max={99}
                                            >
                                                {unreadCount > 0 ? (
                                                    <NotificationsActiveIcon />
                                                ) : (
                                                    <NotificationsNoneIcon />
                                                )}
                                            </Badge>
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}

                            {!isMobile && (
                                <>
                                    <Tooltip
                                        title={
                                            mode === 'dark'
                                                ? t('lightMode')
                                                : t('darkMode')
                                        }
                                    >
                                        <IconButton
                                            onClick={() =>
                                                applyMode(
                                                    mode === 'dark' ? 'light' : 'dark',
                                                )
                                            }
                                            aria-label='تبديل وضع السمة'
                                            sx={iconBtnSx}
                                        >
                                            {mode === 'dark' ? (
                                                <Brightness4Icon />
                                            ) : (
                                                <Brightness7Icon sx={{ color: '#ffb300' }} />
                                            )}
                                        </IconButton>
                                    </Tooltip>

                                    <LanguageSwitcher />

                                    <Tooltip title={t('more', 'المزيد')}>
                                        <IconButton
                                            onClick={(e) => setMoreAnchor(e.currentTarget)}
                                            aria-label={t('more', 'المزيد')}
                                            aria-haspopup='menu'
                                            sx={iconBtnSx}
                                        >
                                            <MoreHorizIcon />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}

                            <Suspense fallback={null}>
                                <Box sx={{ ms: 0.5 }}>
                                    {!isLoggedIn ? (
                                        <Button
                                            variant='contained'
                                            onClick={() => navigate(path.Login)}
                                            sx={{
                                                borderRadius: '30px',
                                                fontWeight: 'bold',
                                                backgroundColor: '#FBBC05',
                                                color: '#1A1E22',
                                                px: { xs: 2, sm: 3 },
                                                whiteSpace: 'nowrap',
                                                '&:hover': { backgroundColor: '#fb9905' },
                                            }}
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

            {/* ───── MORE MENU (الروابط الثانوية) ───── */}
            <Menu
                anchorEl={moreAnchor}
                open={Boolean(moreAnchor)}
                onClose={() => setMoreAnchor(null)}
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
                        sx: { borderRadius: 3, minWidth: 220, mt: 1 },
                    },
                }}
            >
                <MenuItem component={Link} to={path.About} onClick={() => setMoreAnchor(null)}>
                    <ListItemIcon><InfoIcon fontSize='small' /></ListItemIcon>
                    {t('links.about')}
                </MenuItem>
                <MenuItem component={Link} to={path.Contact} onClick={() => setMoreAnchor(null)}>
                    <ListItemIcon><ContactIcon fontSize='small' /></ListItemIcon>
                    {t('links.contact')}
                </MenuItem>
                <MenuItem component={Link} to={path.SellingHelp} onClick={() => setMoreAnchor(null)}>
                    <ListItemIcon><HelpIcon fontSize='small' /></ListItemIcon>
                    {t('help')}
                </MenuItem>

                {isLoggedIn && <Divider />}

                {isLoggedIn && (
                    <MenuItem
                        component={Link}
                        to={path.DeleteAccount}
                        onClick={() => setMoreAnchor(null)}
                        sx={{ color: 'error.main' }}
                    >
                        <ListItemIcon>
                            <DeleteSharpIcon fontSize='small' color='error' />
                        </ListItemIcon>
                        {t('pages.deleteAccount.title')}
                    </MenuItem>
                )}
            </Menu>

            {notificationMenu}

            {/* ───── MOBILE DRAWER (له backdrop خاص فيه) ───── */}
            <Drawer
                variant='temporary'
                anchor={dir === 'rtl' ? 'left' : 'right'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: { xs: '100%', sm: 320 },
                        border: 'none',
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
        </>
    );
};

export default Theme;