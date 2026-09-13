import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import {
    FormControlLabel,
    PaletteMode,
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
import { styled } from '@mui/material/styles';
import LanguageSwitcher from '../../../locales/languageSwich';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import handleRTL from '../../../locales/handleRTL';
import {
    Brightness4,
    Brightness7,
    Menu as MenuIcon,
    Home as HomeIcon,
    Favorite as FavoriteIcon,
    Info as InfoIcon,
    ContactMail as ContactIcon,
    List as ListIcon,
    Help as HelpIcon,
    Dashboard as DashboardIcon,
    ChatBubble,
    DeleteSharp,
    WorkOutline as WorkOutlineIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { path } from '../../../routes/routes';
import socket from '../../../socket/globalSocket';
import RoleType from '../../../interfaces/UserType';
import { useTranslation } from 'react-i18next';
import AccountMenu from '../userManage/AccountMenu';
import { useUser } from '../../../hooks/useUSer';
import JsonLd from '../../../../utils/JsonLd';
import { GradientSwitch } from './GradientSwitch';
import MobileDrawer from './MobileDrawer';
import SafqaLogo from '../../../atoms/SafqaLogo';
import { useChat } from '../../../hooks/useChat';

interface ThemeProps {
    mode: PaletteMode;
    setMode: (mode: PaletteMode) => void;
}

const Theme: FunctionComponent<ThemeProps> = ({ mode, setMode }) => {
    const handleThemeChange = (
        _: React.SyntheticEvent<Element, Event>,
        checked: boolean,
    ) => {
        const newMode: PaletteMode = checked ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('theme', newMode);
    };

    const dir = handleRTL();

    // ✅ استخدم Context فقط — لا useToken ولا setAuth/setIsLoggedIn مباشرة
    const { auth, isLoggedIn, logout: contextLogout } = useUser();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<
        string | false
    >(false);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const { unreadCounts } = useChat();
    const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { t } = useTranslation();

    const navigate = useNavigate();

    const isAdmin = auth?.role === RoleType.Admin;

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // ✅ دالة logout موحّدة — تستدعي Context.logout الذي يستدعي POST /users/logout
    const handleLogout = useCallback(async () => {
        // 1. قطع socket
        try {
            socket.disconnect();
        } catch (err) {
            console.warn('Socket disconnect failed:', err);
        }

        // 2. استدعاء logout من Context — يمسح الكوكي + يحدّث الحالة
        await contextLogout();

        // 3. تنظيف أي بيانات محلية قديمة (احتياط)
        localStorage.removeItem('token');

        // 4. التوجيه للصفحة الرئيسية
        navigate(path.Home, { replace: true });
        setMobileOpen(false);
    }, [contextLogout, navigate]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <>
            {/* Structured data for SEO */}
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
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    background: mode === 'dark' ? '#0a1116' : '#ffffff',
                    boxShadow: '0 1px 10px #414141',
                    zIndex: 1100,
                    overflow: 'hidden',
                    top: 0,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 1,
                        borderRadius: '21px',
                        pointerEvents: 'none',
                        borderBottom: '3px solid transparent',
                        background: `
                                                radial-gradient(
                                                180px circle at ${mousePosition.x - 10}px ${mousePosition.y - 10}px,
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
                <Container maxWidth='xl' sx={{ px: { xs: 1, sm: 0, md: 0 } }}>
                    <Toolbar
                        component='nav'
                        aria-label='قائمة التنقل الرئيسية'
                        title='قائمة التنقل الرئيسية'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 0,
                            minHeight: { xs: '64px', md: '72px' },
                            flexWrap: 'nowrap',
                        }}
                    >
                        {/* Left side: Mobile menu button and Logo */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                minWidth: 0,
                                flexShrink: 1,
                            }}
                        >
                            {/* Mobile menu button */}
                            <IconButton
                                color='inherit'
                                aria-label='فتح القائمة'
                                title='فتح القائمة'
                                onClick={handleDrawerToggle}
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    color:
                                        mode === 'dark' ? '#e2e8f0' : '#4a5568',
                                    flexShrink: 0,
                                }}
                            >
                                <MenuIcon />
                            </IconButton>

                            {/* Logo */}

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
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
                            </motion.div>

                            {/* Messages */}
                            {isMobile && isLoggedIn && (
                                <Box role='dev' sx={{ flexShrink: 0 }}>
                                    <Badge
                                        badgeContent={totalUnread || 0}
                                        color='error'
                                    >
                                        <StyledNavLink
                                            to={path.MessagesPage}
                                            aria-label={`${(t('links.messages'), 'الرسائل')} الرسائل`}
                                            title={`${t('links.messages', 'الرسائل')} الرسائل`}
                                        >
                                            <ChatBubble sx={{ fontSize: 20 }} />
                                        </StyledNavLink>
                                    </Badge>
                                </Box>
                            )}
                            {/* Jobs */}
                            <Box
                                component='li'
                                role='listitem'
                                sx={{ flexShrink: 0, listStyle: 'none' }}
                            >
                                <StyledNavLink
                                    to={path.jobs}
                                    aria-label={t('links.jobs') || 'الوظائف'}
                                    title={t('links.jobs') || 'الوظائف'}
                                >
                                    <WorkOutlineIcon sx={{ fontSize: 20 }} />
                                </StyledNavLink>
                            </Box>
                            {/* My Listings - only if logged in */}
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
                                        to={`${path.CustomerProfile.replace(':slug', '')}/${auth?.slug}`}
                                        aria-label={
                                            t('footer.myListings') || 'إعلاناتي'
                                        }
                                        title={
                                            t('footer.myListings') || 'إعلاناتي'
                                        }
                                    >
                                        <ListIcon sx={{ fontSize: 20 }} />
                                    </StyledNavLink>
                                </Box>
                            )}

                            {/* Desktop Navigation */}
                            <Box
                                component='ul'
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    listStyle: 'none',
                                    m: 0,
                                    p: 0,
                                    alignItems: 'center',
                                    gap: 0.5,
                                    minWidth: 0,
                                    flexShrink: 1,
                                    flexWrap: 'nowrap',
                                    overflowX: 'auto',
                                    '&::-webkit-scrollbar': { display: 'none' },
                                    scrollbarWidth: 'none',
                                }}
                                aria-label='روابط التنقل الرئيسية'
                                title='روابط التنقل الرئيسية'
                            >
                                {/* Home */}
                                <Box
                                    component='li'
                                    role='listitem'
                                    sx={{ flexShrink: 0, listStyle: 'none' }}
                                >
                                    <StyledNavLink
                                        to={path.Home}
                                        aria-label={t('home')}
                                        title={t('home')}
                                    >
                                        <HomeIcon sx={{ fontSize: 20 }} />
                                    </StyledNavLink>
                                </Box>

                                {/* How to delete your account in safqa */}
                                <Box
                                    component='li'
                                    role='listitem'
                                    sx={{ flexShrink: 0 }}
                                >
                                    <StyledNavLink
                                        to={path.DeleteAccount}
                                        aria-label={t(
                                            'pages.deleteAccount.title',
                                        )}
                                        title={t('pages.deleteAccount.title')}
                                    >
                                        <DeleteSharp sx={{ fontSize: 20 }} />
                                    </StyledNavLink>
                                </Box>
                                {/* Favorites */}
                                {auth._id && (
                                    <Box
                                        component='li'
                                        role='listitem'
                                        sx={{ flexShrink: 0 }}
                                    >
                                        <StyledNavLink
                                            to={path.Favorite}
                                            aria-label={
                                                t('favorites') || 'المفضلة'
                                            }
                                            title={t('favorites') || 'المفضلة'}
                                        >
                                            <FavoriteIcon
                                                sx={{ fontSize: 20 }}
                                            />
                                        </StyledNavLink>
                                    </Box>
                                )}

                                {/* About */}
                                <Box
                                    component='li'
                                    role='listitem'
                                    sx={{ flexShrink: 0 }}
                                >
                                    <StyledNavLink
                                        to={path.About}
                                        aria-label={`${t('links.about')} معلومات عن موقع صفقة`}
                                        title={`${t('links.about')} معلومات عن موقع صفقة`}
                                    >
                                        <InfoIcon sx={{ fontSize: 20 }} />
                                    </StyledNavLink>
                                </Box>

                                {/* Messages */}
                                {isLoggedIn && (
                                    <Box
                                        component='li'
                                        role='listitem'
                                        sx={{ flexShrink: 0 }}
                                    >
                                        <Badge
                                            badgeContent={totalUnread || 0}
                                            color='error'
                                        >
                                            <StyledNavLink
                                                to={path.MessagesPage}
                                                aria-label={`${(t('links.messages'), 'الرسائل')} الرسائل`}
                                                title={`${t('links.messages', 'الرسائل')} الرسائل`}
                                            >
                                                <ChatBubble
                                                    sx={{ fontSize: 20 }}
                                                />
                                            </StyledNavLink>
                                        </Badge>
                                    </Box>
                                )}
                                {/* Contact */}
                                <Box
                                    component='li'
                                    role='listitem'
                                    sx={{ flexShrink: 0 }}
                                >
                                    <StyledNavLink
                                        to={path.Contact}
                                        aria-label={t('links.contact')}
                                        title={t('links.contact')}
                                    >
                                        <ContactIcon sx={{ fontSize: 18 }} />
                                        <Typography component='span'></Typography>
                                    </StyledNavLink>
                                </Box>

                                {/* Help */}
                                <Box component='li' role='listitem'>
                                    <StyledNavLink
                                        to={path.SellingHelp}
                                        aria-label={t('help')}
                                    >
                                        <HelpIcon sx={{ fontSize: 20 }} />
                                    </StyledNavLink>
                                </Box>
                                {/* Admin Panel - only if admin */}

                                {isAdmin ||
                                auth?.role === RoleType.Moderator ? (
                                    <Box component='li' role='listitem'>
                                        <StyledNavLink
                                            to={path.UsersManagement}
                                            aria-label={t('users-management')}
                                            title={t('users-management')}
                                        >
                                            <DashboardIcon
                                                sx={{ fontSize: 20 }}
                                            />
                                        </StyledNavLink>
                                    </Box>
                                ) : null}
                            </Box>
                        </Box>

                        {/* Left side: Theme toggle, language switcher, and account */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 1, sm: 2 },
                                flexWrap: 'nowrap',
                            }}
                        >
                            {/* Theme Toggle */}
                            {!isMobile && (
                                <Tooltip
                                    title={
                                        mode === 'dark'
                                            ? t('lightMode')
                                            : t('darkMode')
                                    }
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
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
                                                            sx={{ m: 0 }}
                                                        />
                                                    }
                                                    label=''
                                                    aria-label='تبديل وضع السمة'
                                                />
                                            </FormGroup>

                                            <AnimatePresence mode='wait'>
                                                <motion.div
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
                                                        <Brightness4
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
                                                        <Brightness7
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
                                                </motion.div>
                                            </AnimatePresence>
                                        </Box>
                                    </motion.div>
                                </Tooltip>
                            )}

                            {/* Language Switcher */}
                            {!isMobile && (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <LanguageSwitcher />
                                </motion.div>
                            )}

                            {/* Account Menu / Login Button - Desktop only */}
                            <Box sx={{ display: { xs: 'block' } }}>
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
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant='temporary'
                anchor={dir === 'rtl' ? 'left' : 'right'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: { xs: '100%', sm: 320 },
                        border: 'none',
                        zIndex: 1200,
                    },
                }}
            >
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
            </Drawer>

            {/* Backdrop for drawer */}
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
                        display: { xs: 'block', md: 'none' },
                    }}
                    onClick={handleDrawerToggle}
                />
            )}
        </>
    );
};

export default Theme;

// Styled NavLink for better SEO and accessibility
const StyledNavLink = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none',
    listStyle: 'none',
    color: theme.palette.mode === 'dark' ? '#74829b' : '#74829b',
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
                : '2px solid  rgb(245, 159, 11)',
    },
}));