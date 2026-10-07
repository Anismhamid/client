import { FunctionComponent, SyntheticEvent } from 'react';
import {
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    FormControlLabel,
    FormGroup,
    PaletteMode,
    useTheme,
    Badge,
    Grid,
    Tooltip,
} from '@mui/material';
import { generatePath } from 'react-router-dom';
import { List as ListIconMui } from '@mui/icons-material';
import {
    Brightness4,
    Brightness7,
    Close as CloseIcon,
    Home as HomeIcon,
    Favorite as FavoriteIcon,
    Info as InfoIcon,
    ContactMail as ContactIcon,
    Help as HelpIcon,
    Dashboard as DashboardIcon,
    ChatBubble,
    Delete,
} from '@mui/icons-material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { NavLink } from 'react-router-dom';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';

import LanguageSwitcher from '../../../locales/languageSwich';
import handleRTL from '../../../locales/handleRTL';
import { path } from '../../../routes/routes';
import { GradientSwitch } from './GradientSwitch';
import { AuthValues } from '../../../interfaces/authValues';
import { useChat } from '../../../hooks/useChat';
import { AppSettings } from '../../settings/appSettings';
import AISearch from '../../../atoms/AISearch';

const openAppSettings = async () => {
    if (!Capacitor.isNativePlatform()) return;
    await AppSettings.open();
};

interface MobileDrawerProps {
    mode: PaletteMode;
    setMobileOpen: (value: boolean) => void;
    expandedMobileMenu: string | false;
    setExpandedMobileMenu: (value: string | false) => void;
    isLoggedIn: boolean;
    handleDrawerToggle: () => void;
    auth: AuthValues;
    isAdmin: boolean;
    handleThemeChange: (
        event: SyntheticEvent<Element, Event>,
        checked: boolean,
    ) => void;
    logout: () => void;
}

// Shared style helpers (previously duplicated per-item)
const navItemSx = {
    borderRadius: '8px',
    '&.active': {
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        color: '#f59f0b',
        fontWeight: 'bold',
    },
} as const;

const navItemSxRed = {
    borderRadius: '8px',
    '&.active': {
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        color: '#f59f0b',
        fontWeight: 'bold',
    },
} as const;

const MobileDrawer: FunctionComponent<MobileDrawerProps> = ({
    mode,
    setMobileOpen,
    setExpandedMobileMenu,
    isLoggedIn,
    handleDrawerToggle,
    auth,
    isAdmin,
    handleThemeChange,
}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { unreadCounts } = useChat();
    const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
    const dir = handleRTL();

    const handleNavLinkClick = () => {
        setMobileOpen(false);
        setExpandedMobileMenu(false);
    };

    return (
        <Box
            dir={dir}
            sx={{
                width: { xs: '100%', sm: 320 },
                height: '100%',
                background:
                    mode === 'dark'
                        ? `radial-gradient(circle, transparent 70%), ${theme.palette.background.paper}`
                        : theme.palette.background.paper,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Drawer header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
            >
                <Typography variant='h6' sx={{ fontWeight: 700 }}>
                    {t('navigationMenu') || 'قائمة التنقل'}
                </Typography>
                <m.div
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                    <IconButton
                        onClick={handleDrawerToggle}
                        aria-label='إغلاق القائمة'
                        sx={{ color: mode === 'dark' ? '#e2e8f0' : '#4a5568' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </m.div>
            </Box>

            {/* Scrollable content */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                <List
                    component='nav'
                    aria-label='القائمة الرئيسية'
                    sx={{ pt: 0 }}
                >
                    {/* Search */}
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <Box sx={{ width: '100%' }}>
                            <AISearch />
                        </Box>
                    </ListItem>

                    {/* Notification settings - native only */}
                    {Capacitor.isNativePlatform() && (
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={openAppSettings}
                                sx={{ borderRadius: '8px' }}
                            >
                                <NotificationsActiveIcon sx={{ ml: 1 }} />
                                <ListItemText
                                    primary={
                                        t('notificationSettings') ||
                                        'إعدادات الإشعارات'
                                    }
                                    primaryTypographyProps={{
                                        sx: { fontWeight: 500 },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    )}

                    {/* Home */}
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={NavLink}
                            to={path.Home}
                            onClick={handleNavLinkClick}
                            sx={navItemSx}
                        >
                            <HomeIcon sx={{ ml: 1 }} />
                            <ListItemText
                                primary={t('home')}
                                primaryTypographyProps={{
                                    sx: { fontWeight: 500 },
                                    'aria-label': 'الصفحة الرئيسية - موقع صفقة',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Favorites */}
                    {auth._id && (
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={NavLink}
                                to={path.Favorite}
                                onClick={handleNavLinkClick}
                                sx={navItemSx}
                            >
                                <FavoriteIcon sx={{ ml: 1 }} />
                                <ListItemText
                                    primary={t('favorites') || 'المفضلة'}
                                    primaryTypographyProps={{
                                        sx: { fontWeight: 500 },
                                        'aria-label': 'المفضلة - موقع صفقة',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    )}
                    {/* My listings */}
                    {isLoggedIn && auth.slug && (
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={NavLink}
                                to={generatePath(path.CustomerProfile, {
                                    slug: encodeURIComponent(auth.slug),
                                })}
                                onClick={handleNavLinkClick}
                                sx={navItemSx}
                            >
                                <ListIconMui sx={{ ml: 1 }} />
                                <ListItemText
                                    primary={
                                        t('footer.myListings') || 'إعلاناتي'
                                    }
                                    primaryTypographyProps={{
                                        sx: { fontWeight: 500 },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    )}

                    {/* Messages */}
                    {isLoggedIn && (
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={NavLink}
                                to={path.MessagesPage}
                                onClick={handleNavLinkClick}
                                sx={{
                                    ...navItemSx,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Badge
                                    badgeContent={totalUnread || 0}
                                    color='error'
                                    sx={{ ml: 1 }}
                                >
                                    <ChatBubble sx={{ fontSize: 20 }} />
                                </Badge>
                                <ListItemText
                                    primary={
                                        t('accountMenu.messages') || 'الرسائل'
                                    }
                                    primaryTypographyProps={{
                                        sx: { fontWeight: 500 },
                                        'aria-label': 'الرسائل - موقع صفقة',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    )}

                    {/* About */}
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={NavLink}
                            to={path.About}
                            onClick={handleNavLinkClick}
                            sx={navItemSxRed}
                        >
                            <InfoIcon sx={{ ml: 1 }} />
                            <ListItemText
                                primary={t('links.about')}
                                primaryTypographyProps={{
                                    sx: { fontWeight: 500 },
                                    'aria-label':
                                        'من نحن - معلومات عن موقع صفقة',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Contact */}
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={NavLink}
                            to={path.Contact}
                            onClick={handleNavLinkClick}
                            sx={navItemSxRed}
                        >
                            <ContactIcon sx={{ ml: 1 }} />
                            <ListItemText
                                primary={t('links.contact')}
                                primaryTypographyProps={{
                                    sx: { fontWeight: 500 },
                                    'aria-label':
                                        'اتصل بنا - خدمة عملاء موقع صفقة',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Jobs */}
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={NavLink}
                            to={path.jobs}
                            onClick={handleNavLinkClick}
                            sx={navItemSxRed}
                        >
                            <WorkOutlineIcon sx={{ ml: 1 }} />
                            <ListItemText
                                primary={t('links.jobs') || 'الوظائف'}
                                primaryTypographyProps={{
                                    sx: { fontWeight: 500 },
                                    'aria-label': t('links.jobs') || 'الوظائف',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Help */}
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={NavLink}
                            to={path.SellingHelp}
                            onClick={handleNavLinkClick}
                            sx={navItemSxRed}
                        >
                            <HelpIcon sx={{ ml: 1 }} />
                            <ListItemText
                                primary={t('help')}
                                primaryTypographyProps={{
                                    sx: { fontWeight: 500 },
                                    'aria-label':
                                        'صفحة مساعدة - مساعدة موقع صفقة',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Admin Panel - only if admin */}
                    {isAdmin && (
                        <>
                            <Divider
                                sx={{
                                    my: 2,
                                    borderColor:
                                        mode === 'dark'
                                            ? 'rgba(255,255,255,0.1)'
                                            : 'rgba(0,0,0,0.1)',
                                }}
                            />
                            <ListItem disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    component={NavLink}
                                    to={path.UsersManagement}
                                    onClick={handleNavLinkClick}
                                    sx={navItemSxRed}
                                >
                                    <DashboardIcon sx={{ ml: 1 }} />
                                    <ListItemText
                                        primary={
                                            t('users-management') ||
                                            'لوحة التحكم'
                                        }
                                        primaryTypographyProps={{
                                            sx: { fontWeight: 500 },
                                            'aria-label': 'لوحة تحكم الإدارة',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </List>
            </Box>
            {/* Delete account */}
            {isLoggedIn && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={NavLink}
                            to={path.DeleteAccount}
                            onClick={handleNavLinkClick}
                            sx={{ ...navItemSx, color: 'error.main' }}
                        >
                            <Delete sx={{ ml: 1 }} color='error' />
                            <ListItemText
                                primary={t('pages.deleteAccount.title')}
                                primaryTypographyProps={{
                                    sx: { fontWeight: 500 },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </>
            )}
            {/* Footer with theme and language */}
            <Grid
                container
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    borderTop: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    backgroundColor:
                        mode === 'dark'
                            ? 'rgba(0,0,0,0.2)'
                            : 'rgba(0,0,0,0.02)',
                }}
            >
                {/* Theme toggle */}
                <Grid
                    size={{ xs: 6 }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            px: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {mode === 'dark' ? (
                            <Brightness4 sx={{ color: '#ffffff' }} />
                        ) : (
                            <Brightness7 sx={{ color: '#ffd000' }} />
                        )}
                        <Typography variant='body2'>
                            {mode === 'dark' ? t('darkMode') : t('lightMode')}
                        </Typography>
                    </Box>
                    <FormGroup>
                        <FormControlLabel
                            checked={mode === 'dark'}
                            onChange={handleThemeChange}
                            control={<GradientSwitch sx={{ m: 0 }} />}
                            label=''
                            aria-label='تبديل وضع السمة'
                        />
                    </FormGroup>
                </Grid>

                {/* Language switcher */}
                <Grid
                    size={{ xs: 6 }}
                    sx={{
                        display: 'flex',
                        alignContent: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Tooltip
                        children={<LanguageSwitcher />}
                        title={t('language')}
                    />
                </Grid>

                {/* Copyright */}
                <Grid size={{ xs: 12 }}>
                    <Box borderTop={1} borderColor='divider' textAlign='center'>
                        <Typography variant='body2' color='text.secondary'>
                            © {new Date().getFullYear()} {t('footer.siteName')}{' '}
                            - {t('allRightsReserved')}
                        </Typography>
                        <Typography
                            variant='caption'
                            color='text.disabled'
                            display='block'
                            mt={1}
                        >
                            {t('footer.version', { version: '2.6.1' })}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MobileDrawer;
