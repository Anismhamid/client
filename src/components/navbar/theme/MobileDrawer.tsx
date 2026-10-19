import { FunctionComponent, SyntheticEvent } from 'react';
import {
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    FormControlLabel,
    FormGroup,
    PaletteMode,
    useTheme,
    Badge,
    Grid,
    Tooltip,
    alpha,
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

    // دالة موحدة لتنسيق روابط التنقل (تحل مشكلة التباين وتنظم الكود)
    const getNavItemStyle = (isDestructive = false) => ({
        borderRadius: '8px',
        mb: 0.5,
        color: isDestructive
            ? 'error.main'
            : mode === 'dark'
              ? '#e2e8f0'
              : '#33415a',
        '& .MuiListItemIcon-root': {
            color: 'inherit',
            minWidth: 36,
        },
        '&.active': {
            backgroundColor: alpha('#f59f0b', 0.15),
            // إصلاح التباين: نص داكن على خلفية برتقالية شفافة
            color: mode === 'dark' ? '#ffffff' : '#1A1E22',
            fontWeight: 700,
        },
        '&:hover': {
            backgroundColor: isDestructive
                ? alpha(theme.palette.error.main, 0.1)
                : alpha(theme.palette.text.primary, 0.05),
        },
    });

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
                    borderBottom: `1px solid ${theme.palette.divider}`,
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
                        sx={{ color: 'text.primary' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </m.div>
            </Box>

            {/* Scrollable Content */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                <List
                    component='nav'
                    aria-label='القائمة الرئيسية'
                    sx={{ pt: 0 }}
                >
                    {/* Search */}
                    <ListItem disablePadding sx={{ mb: 2 }}>
                        <Box sx={{ width: '100%' }}>
                            <AISearch />
                        </Box>
                    </ListItem>

                    {/* Notification settings - native only */}
                    {Capacitor.isNativePlatform() && (
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={openAppSettings}
                                sx={getNavItemStyle()}
                            >
                                <ListItemIcon>
                                    <NotificationsActiveIcon />
                                </ListItemIcon>
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
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={path.Home}
                            onClick={handleNavLinkClick}
                            sx={getNavItemStyle()}
                        >
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={t('home')}
                                primaryTypographyProps={{
                                    sx: { fontWeight: 500 },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Favorites */}
                    {auth._id && (
                        <ListItem disablePadding>
                            <ListItemButton
                                component={NavLink}
                                to={path.Favorite}
                                onClick={handleNavLinkClick}
                                sx={getNavItemStyle()}
                            >
                                <ListItemIcon>
                                    <FavoriteIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={t('favorites') || 'المفضلة'}
                                    primaryTypographyProps={{
                                        sx: { fontWeight: 500 },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    )}

                    {/* My listings */}
                    {isLoggedIn && auth.slug && (
                        <ListItem disablePadding>
                            <ListItemButton
                                component={NavLink}
                                to={generatePath(path.CustomerProfile, {
                                    slug: encodeURIComponent(auth.slug),
                                })}
                                onClick={handleNavLinkClick}
                                sx={getNavItemStyle()}
                            >
                                <ListItemIcon>
                                    <ListIconMui />
                                </ListItemIcon>
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
                        <ListItem disablePadding>
                            <ListItemButton
                                component={NavLink}
                                to={path.MessagesPage}
                                onClick={handleNavLinkClick}
                                sx={getNavItemStyle()}
                            >
                                <ListItemIcon>
                                    <Badge
                                        badgeContent={totalUnread || 0}
                                        color='error'
                                    >
                                        <ChatBubble />
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        t('accountMenu.messages') || 'الرسائل'
                                    }
                                    primaryTypographyProps={{
                                        sx: { fontWeight: 500 },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    )}

                    <Divider sx={{ my: 1.5 }} />

                    {/* About */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={path.About}
                            onClick={handleNavLinkClick}
                            sx={getNavItemStyle()}
                        >
                            <ListItemIcon>
                                <InfoIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={t('links.about')}
                                primaryTypographyProps={{
                                    sx: { fontWeight: 500 },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Contact */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={path.Contact}
                            onClick={handleNavLinkClick}
                            sx={getNavItemStyle()}
                        >
                            <ListItemIcon>
                                <ContactIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={t('links.contact')}
                                primaryTypographyProps={{
                                    sx: { fontWeight: 500 },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Jobs */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={path.jobs}
                            onClick={handleNavLinkClick}
                            sx={getNavItemStyle()}
                        >
                            <ListItemIcon>
                                <WorkOutlineIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={t('links.jobs') || 'الوظائف'}
                                primaryTypographyProps={{
                                    sx: { fontWeight: 500 },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Help */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={path.SellingHelp}
                            onClick={handleNavLinkClick}
                            sx={getNavItemStyle()}
                        >
                            <ListItemIcon>
                                <HelpIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={t('help')}
                                primaryTypographyProps={{
                                    sx: { fontWeight: 500 },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Admin Panel */}
                    {isAdmin && (
                        <>
                            <Divider sx={{ my: 1.5 }} />
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to={path.UsersManagement}
                                    onClick={handleNavLinkClick}
                                    sx={getNavItemStyle()}
                                >
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            t('users-management') ||
                                            'لوحة التحكم'
                                        }
                                        primaryTypographyProps={{
                                            sx: { fontWeight: 500 },
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}

                    {/* Delete Account */}
                    {isLoggedIn && (
                        <>
                            <Divider sx={{ my: 1.5 }} />
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to={path.DeleteAccount}
                                    onClick={handleNavLinkClick}
                                    sx={getNavItemStyle(true)}
                                >
                                    <ListItemIcon>
                                        <Delete color='error' />
                                    </ListItemIcon>
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
                </List>
            </Box>

            {/* Footer (Theme & Language) - Fixed at bottom */}
            <Box
                sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    backgroundColor:
                        mode === 'dark'
                            ? 'rgba(0,0,0,0.2)'
                            : 'rgba(0,0,0,0.02)',
                    p: 2,
                    pb: 1,
                }}
            >
                <Grid container spacing={2} alignItems='center'>
                    {/* Theme toggle */}
                    <Grid size={{ xs: 6 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                            }}
                        >
                            {mode === 'dark' ? (
                                <Brightness4 sx={{ color: 'text.primary' }} />
                            ) : (
                                <Brightness7 sx={{ color: '#ffb300' }} />
                            )}
                            <FormGroup>
                                <FormControlLabel
                                    checked={mode === 'dark'}
                                    onChange={handleThemeChange}
                                    control={<GradientSwitch sx={{ m: 0 }} />}
                                    label=''
                                    aria-label='تبديل وضع السمة'
                                />
                            </FormGroup>
                        </Box>
                    </Grid>

                    {/* Language switcher */}
                    <Grid size={{ xs: 6 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Tooltip
                                children={<LanguageSwitcher />}
                                title={t('language')}
                            />
                        </Box>
                    </Grid>

                    {/* Copyright */}
                    <Grid size={{ xs: 12 }}>
                        <Box
                            textAlign='center'
                            pt={1}
                            borderTop={`1px dashed ${theme.palette.divider}`}
                        >
                            <Typography variant='caption' color='text.secondary'>
                                © {new Date().getFullYear()}{' '}
                                {t('footer.siteName')} -{' '}
                                {t('allRightsReserved')}
                            </Typography>
                            <Typography
                                variant='caption'
                                color='text.disabled'
                                display='block'
                            >
                                {t('footer.version', { version: '2.6.1' })}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default MobileDrawer;