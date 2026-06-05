import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { path } from '../../../routes/routes';
import { Typography, alpha, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RoleType from '../../../interfaces/UserType';
import handleRTL from '../../../locales/handleRTL';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import { useUser } from '../../../context/useUSer';

interface AccountMenuProps {
    logout: () => void;
}

const AccountMenu: FunctionComponent<AccountMenuProps> = ({ logout }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { auth } = useUser();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();
    const direction = handleRTL();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigateTo = (route: string) => {
        handleClose();
        navigate(route);
    };

    const isAdmin = auth?.role === RoleType.Admin;
    const isSiteModerator = auth?.role === RoleType.Moderator;
    const isPrivileged = isAdmin || isSiteModerator;

    const getUserInitials = () => {
        if (auth?.name?.first && auth?.name?.last) {
            return `${auth.name.first[0]}${auth.name.last[0]}`.toUpperCase();
        }
        if (auth?.name?.first) {
            return auth.name.first[0].toUpperCase();
        }
        return 'U';
    };

    const getRoleLabel = () => {
        if (isAdmin) return t('accountMenu.admin');
        if (isSiteModerator) return t('accountMenu.siteModerator');
        return t('accountMenu.client') || 'Client';
    };

    // Fixed: Pass theme as parameter
    const menuItemSx = () => ({
        py: 1.25,
        px: 2,
        gap: 0,
        transition: 'all 0.2s',
        '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            transform: 'translateX(4px)',
        },
    });

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title={t('account-management') || 'Account Settings'}>
                    <IconButton
                        onClick={handleClick}
                        size='small'
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        sx={{
                            width: 44,
                            height: 44,
                            border: `2px solid ${theme.palette.primary.main}`,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                borderColor: theme.palette.secondary.main,
                                transform: 'scale(1.05)',
                                boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: theme.palette.primary.main,
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            }}
                            src={auth?.image?.url || undefined}
                        >
                            {!auth?.image?.url && getUserInitials()}
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>

            <Menu
                id='account-menu'
                dir={direction}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                elevation={8}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        overflow: 'hidden',
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 220,
                        boxShadow:
                            '0 10px 40px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.05)',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: direction === 'ltr' ? 14 : 180,
                            width: 15,
                            height: 15,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            boxShadow: '-2px -2px 5px rgba(0,0,0,0.05)',
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* User Profile Header */}
                <Box
                    sx={{
                        py: 1.5,
                        px: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        pointerEvents: 'none',
                    }}
                >
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: theme.palette.primary.main,
                            fontWeight: 600,
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                        src={auth?.image?.url || undefined}
                    >
                        {!auth?.image?.url && getUserInitials()}
                    </Avatar>

                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography
                            variant='subtitle2'
                            fontWeight={600}
                            noWrap
                            sx={{ lineHeight: 1.3 }}
                        >
                            {auth?.name?.first && auth?.name?.last
                                ? `${auth.name.first} ${auth.name.last}`
                                : auth?.name?.first || 'User'}
                        </Typography>

                        <Typography
                            variant='caption'
                            color='text.secondary'
                            noWrap
                            sx={{ display: 'block' }}
                        >
                            {auth?.email || ''}
                        </Typography>

                        {/* Role badge — shown for all roles */}
                        <Typography
                            variant='caption'
                            sx={{
                                display: 'inline-block',
                                mt: 0.5,
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                fontWeight: 600,
                                bgcolor: isAdmin
                                    ? alpha(theme.palette.primary.main, 0.1)
                                    : isSiteModerator
                                      ? alpha(theme.palette.warning.main, 0.1)
                                      : alpha(theme.palette.grey[500], 0.1),
                                color: isAdmin
                                    ? 'primary.main'
                                    : isSiteModerator
                                      ? 'warning.dark'
                                      : 'text.secondary',
                            }}
                        >
                            {getRoleLabel()}
                        </Typography>
                    </Box>
                </Box>

                {/* Profile */}
                <Divider sx={{ height: 1 }} />
                <MenuItem
                    onClick={() => navigateTo(path.Profile)}
                    sx={menuItemSx()}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <PersonOutlineIcon
                            sx={{ fontSize: 20, color: 'text.secondary' }}
                        />
                    </ListItemIcon>
                    <Typography variant='body2'>
                        {t('accountMenu.profile') || 'Profile'}
                    </Typography>
                </MenuItem>

                {/* Admin / Moderator section */}
                {isPrivileged && (
                    <>
                        <Divider />
                        <Typography
                            variant='caption'
                            sx={{
                                display: 'block',
                                px: 2,
                                pt: 1,
                                pb: 0.5,
                                color: 'text.secondary',
                                fontWeight: 600,
                                letterSpacing: 0.5,
                                textTransform: 'uppercase',
                            }}
                        >
                            {getRoleLabel()}
                        </Typography>
                    </>
                )}
                {isAdmin && (
                    <MenuItem
                        onClick={() => navigateTo(path.Messages)}
                        sx={menuItemSx()}
                    >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            <EmailIcon
                                sx={{ fontSize: 20, color: 'text.secondary' }}
                            />
                        </ListItemIcon>
                        <Typography variant='body2'>
                            {t('accountMenu.messages') || 'Messages'}
                        </Typography>
                    </MenuItem>
                )}

                {isAdmin && (
                    <MenuItem
                        onClick={() => navigateTo(path.AdminSettings)}
                        sx={menuItemSx()}
                    >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            <SettingsIcon
                                sx={{ fontSize: 20, color: 'text.secondary' }}
                            />
                        </ListItemIcon>
                        <Typography variant='body2'>
                            {t('accountMenu.settings') || 'Settings'}
                        </Typography>
                    </MenuItem>
                )}

                {isAdmin && (
                    <MenuItem
                        onClick={() => navigateTo(path.WebSiteAdmins)}
                        sx={menuItemSx()}
                    >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            <DashboardIcon
                                sx={{ fontSize: 20, color: 'text.secondary' }}
                            />
                        </ListItemIcon>
                        <Typography variant='body2'>
                            {t('accountMenu.storeStatistics') ||
                                'Store Statistics'}
                        </Typography>
                    </MenuItem>
                )}

                {/* Ads (available to all users) */}
                {isPrivileged && <Divider />}
                {!isPrivileged && <Divider />}

                <Typography
                    variant='caption'
                    sx={{
                        display: 'block',
                        px: 2,
                        pt: 1,
                        pb: 0.5,
                        color: 'text.secondary',
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        textTransform: 'uppercase',
                    }}
                >
                    {t('accountMenu.ads') || 'Ads'}
                </Typography>

                <MenuItem
                    onClick={() => navigateTo(path.FeaturedAdsDashboard)}
                    sx={menuItemSx()}
                    title={t('ads.createAdDescription') || ''}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <DashboardIcon
                            sx={{ fontSize: 20, color: 'text.secondary' }}
                        />
                    </ListItemIcon>
                    <Typography variant='body2'>
                        {t('ads.createAd') || 'Create Ad'}
                    </Typography>
                </MenuItem>

                <MenuItem
                    onClick={() => navigateTo(path.MyAdsDashboard)}
                    sx={menuItemSx()}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <DashboardIcon
                            sx={{ fontSize: 20, color: 'text.secondary' }}
                        />
                    </ListItemIcon>
                    <Typography variant='body2'>
                        {t('ads.dashboard') || 'Ads Dashboard'}
                    </Typography>
                </MenuItem>

                {/* Logout */}
                <Divider />
                <MenuItem
                    onClick={() => {
                        handleClose();
                        logout();
                    }}
                    sx={{
                        ...menuItemSx(),
                        '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                            transform: direction === 'rtl' ? 'translateX(4px)' : 'translateX(4px)',
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <LogoutIcon
                            sx={{ fontSize: 20, color: 'error.main' }}
                        />
                    </ListItemIcon>
                    <Typography
                        variant='body2'
                        sx={{ color: 'error.main', fontWeight: 600 }}
                    >
                        {t('accountMenu.logout') || 'Logout'}
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    );
};

export default AccountMenu;