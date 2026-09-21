import { FunctionComponent, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    Typography,
    Box,
    Stack,
    Card,
    CardContent,
    Avatar,
    Grid,
    Paper,
    Chip,
    Divider,
    useTheme,
    useMediaQuery,
    Tabs,
    Tab,
    Container,
    CircularProgress,
    IconButton,
    Tooltip,
    alpha,
} from '@mui/material';
import {
    History as HistoryIcon,
    Visibility as VisibilityIcon,
    Phone,
    Email,
    LocationOn,
    VerifiedUser,
    CalendarToday,
    Share,
    Lock,
    Person,
    Settings,
    Logout,
    Favorite,
    ShoppingCart,
    Star,
} from '@mui/icons-material';
import { useTranslation} from 'react-i18next';
import { m } from 'framer-motion';
import PersonalInformation from './tabs/PersonalInformationTab';
import { useUserPosts } from '../../../hooks/useUserPosts';
import { usePosts } from '../../../hooks/usePosts';
import { useUser } from '../../../hooks/useUSer';
import { Posts } from '../../../interfaces/Posts';
import { path } from '../../../routes/routes';
import { showSuccess } from '../../../atoms/toasts/ReactToast';
import { deleteUserById, getUserById } from '../../../services/usersServices';
import { formatDate } from '../../../helpers/dateAndPriceFormat';
import DeleteAccountBox from '../../navbar/userManage/DeleteAccountBox';
import EditUserData from '../../navbar/userManage/EditUserData';
import QuickActionsTab from './tabs/QuickActionsTab';
import FavoritesProducts from '../../pages/products/FavoritesPosts';
import { User } from '../../../interfaces/chat/usersMessages';
import Loader from '../../../atoms/loader/Loader';
import handleRTL from '../../../locales/handleRTL';
import AlertDialogs from '../../../atoms/toasts/Sweetalert';

const ACCENT = '#f59e0b';

const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return '#22c55e';
    if (percentage >= 50) return ACCENT;
    return '#ef4444';
};

const Profile: FunctionComponent = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();
    const detailsRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // ✅ احذف useToken، استخدم Context فقط
    const { auth, logout: contextLogout } = useUser();

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const getRelativeDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const today = new Date();
        const diffDays = Math.floor(
            (today.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) /
                86400000,
        );
        const time = date.toLocaleTimeString('i18ready.language', {
            hour: '2-digit',
            minute: '2-digit',
        });
        if (diffDays === 0) return `${t('activity.today')}، ${time}`;
        if (diffDays === 1) return `${t('activity.yesterday')}، ${time}`;
        return `${date.toLocaleDateString('i18ready.language', { day: 'numeric', month: 'short' })}، ${time}`;
    };

    const { id } = useParams();
    const handleShowIdit = () => setShowEdit((p) => !p);

    const [user, setUser] = useState<{
        name: { first: string; last: string };
        phone: { phone_1: string; phone_2: string };
        address: { city: string; street: string; houseNumber: number };
        email: string;
        image: { url: string; alt: string };
        role: string;
        status: boolean;
        activity: string[];
        createdAt: string;
        slug: string;
        gender?: string;
    }>({
        name: { first: '', last: '' },
        phone: { phone_1: '', phone_2: '' },
        address: { city: '', street: '', houseNumber: 0 },
        email: '',
        image: { url: '', alt: '' },
        role: '',
        status: false,
        activity: [],
        gender: 'male',
        createdAt: '',
        slug: '',
    });

    const { userPosts, loading: productsLoading } = useUserPosts(user.slug);
    const { posts } = usePosts();

    const calculateProfileCompletion = (u: User) => {
        const fields = [
            u.name?.first,
            u.name?.last,
            u.phone?.phone_1,
            u.address?.city,
            u.address?.street,
            u.address?.houseNumber,
            u.image?.url,
            u.gender?.toString(),
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
    };

    const calculateRating = (products: Posts[]) => {
        if (!products.length) return 0;
        const ratings = products
            .flatMap((p) => p.reviews?.map((r) => r.rating) ?? [])
            .filter((r): r is number => r !== undefined);
        if (!ratings.length) return 0;
        const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
        return Number(avg.toFixed(1));
    };

    const handleShareProfile = () => {
        const profileUrl = `${window.location.origin}/users/customer/${user.slug}`;
        if (navigator.share) {
            navigator.share({
                title: `${t('profile.title')} ${user.name.first} ${user.name.last}`,
                text: t('profile.shareText', {
                    defaultValue: 'اطلع على ملفي الشخصي على موقع صفقه',
                }),
                url: profileUrl,
            });
        } else {
            navigator.clipboard.writeText(profileUrl);
            showSuccess(
                t('profile.linkCopied', {
                    defaultValue: 'تم نسخ رابط الملف الشخصي',
                }),
            );
        }
    };

    // ✅ استخدم logout من Context
    const handleLogout = async () => {
        await contextLogout();
        navigate(path.Home, { replace: true });
    };

    // ✅ احصل على userId من auth
    const targetId = id || auth?._id;

    useEffect(() => {
        if (!targetId) return;
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                const userRes = await getUserById(targetId);
                if (!cancelled) setUser(userRes);
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id, targetId]);

    const stats = useMemo(() => {
        const viewerId = auth?._id;
        const totalFavorites = viewerId
            ? posts.filter(
                  (post) =>
                      Array.isArray(post.likes) &&
                      post.likes.includes(viewerId),
              ).length
            : 0;

        return {
            totalProducts: userPosts.length,
            totalFavorites,
            rating: user ? calculateRating(userPosts || []) : 0,
            completionPercentage: user
                ? calculateProfileCompletion(user as unknown as User)
                : 0,
        };
    }, [user, userPosts, posts, auth?._id]);

    const handleDeleteAccount = async () => {
        if (!auth?._id) {
            throw new Error('User ID is missing');
        }

        await deleteUserById(auth._id);

        // ✅ استخدم logout من Context (سيمسح الكوكي)
        await contextLogout();
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    if (loading || productsLoading) return <Loader />;

    const tabs = [
        { label: t('profile.title'), icon: <Person /> },
        { label: t('profile.myFavorites'), icon: <Favorite /> },
        { label: t('profile.settings'), icon: <Settings /> },
    ];

    const currentUrl = `https://client-qqq1.vercel.app/profile`;
    const completionColor = getCompletionColor(stats.completionPercentage);

    const statItems = [
        {
            icon: <ShoppingCart sx={{ fontSize: 24 }} />,
            color: theme.palette.primary.main,
            value: userPosts.length || 0,
            label: t('profile.myPosts'),
            to: `/users/customer/${user.slug}`,
        },
        {
            icon: <Favorite sx={{ fontSize: 24 }} />,
            color: '#ef4444',
            value: stats.totalFavorites,
            label: t('profile.myFavorites'),
            to: path.Favorite,
        },
        {
            icon: <Star sx={{ fontSize: 24 }} />,
            color: ACCENT,
            value: stats.rating.toFixed(1),
            label: t('profile.ratings'),
        },
    ];

    const dir = handleRTL();

    return (
        <>
            <link rel='canonical' href={currentUrl} />
            <title>
                {t('accountMenu.profile')} {user.name.first} {user.name.last} |
                صفقة
            </title>
            <meta
                name='description'
                content={`${t('accountMenu.profile')} ${user.name.first} ${user.name.last}`}
            />
            <meta
                property='og:title'
                content={`${user.name.first} ${user.name.last} - ملف شخصي`}
            />
            <meta
                property='og:description'
                content={`تعرف على ${user.name.first} على موقع صفقه`}
            />
            <meta property='og:image' content={user.image?.url} />

            <Box
                dir={dir}
                sx={{ minHeight: '100vh', py: 4, px: { xs: 2, sm: 3 } }}
            >
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Container maxWidth='lg'>
                        {/* === Membership Card Header === */}
                        <Box
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            sx={{
                                position: 'relative',
                                mb: 7,
                                borderRadius: '22px',
                                px: { xs: 3, md: 5 },
                                pt: { xs: 3, md: 4 },
                                pb: { xs: 5, md: 5 },
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px -20px rgba(0,0,0,.55)',

                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 1,
                                    borderRadius: '21px',
                                    pointerEvents: 'none',
                                    border: '1px solid transparent',
                                    background: `
                radial-gradient(
                    180px circle at ${mousePosition.x - 10}px ${mousePosition.y - 10}px,
                    rgb(255, 167, 38),
                    transparent 80%
                ) border-box
            `,
                                    WebkitMask:
                                        'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                                    WebkitMaskComposite: 'xor',
                                    maskComposite: 'exclude',
                                    opacity: hovered ? 1 : 0,
                                    transition: 'opacity .25s',
                                },
                            }}
                        >
                            <Stack
                                direction='row'
                                justifyContent='space-between'
                                alignItems='flex-start'
                                sx={{ mb: 2 }}
                            >
                                <Typography
                                    variant='overline'
                                    sx={{ letterSpacing: 3, fontWeight: 700 }}
                                >
                                    {t('profile.membershipCard')}
                                </Typography>
                                <Stack direction='row' gap={1}>
                                    <Tooltip title={t('common.share')}>
                                        <IconButton
                                            onClick={handleShareProfile}
                                            size='small'
                                            sx={{
                                                color: 'inherit',
                                                border: '1px solid',
                                                borderColor: alpha('#fff', 0.2),
                                                '&:hover': {
                                                    borderColor: alpha(
                                                        '#272aee',
                                                        0.8,
                                                    ),
                                                },
                                            }}
                                        >
                                            <Share fontSize='small' />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t('logout') as string}>
                                        <IconButton
                                            onClick={handleLogout}
                                            size='small'
                                            sx={{
                                                color: 'inherit',
                                                border: '1px solid',
                                                borderColor: alpha('#fff', 0.2),
                                                '&:hover': {
                                                    borderColor: 'error.main',
                                                    color: 'error.light',
                                                },
                                            }}
                                        >
                                            <Logout fontSize='small' />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Stack>

                            <Grid container spacing={3} alignItems='center'>
                                <Grid size={{ xs: 12, sm: 'auto' }}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: { xs: 108, md: 128 },
                                            height: { xs: 108, md: 128 },
                                            mx: { xs: 'auto', sm: 0 },
                                        }}
                                    >
                                        <Avatar
                                            src={
                                                user.image?.url ||
                                                'https://i.ibb.co/5GzXkwq/user.png'
                                            }
                                            alt={
                                                user.image?.alt ||
                                                `${user.name.first}'s avatar`
                                            }
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                fontSize: 42,
                                                border: `3px solid ${alpha('#fff', 0.15)}`,
                                                bgcolor:
                                                    theme.palette.primary.main,
                                            }}
                                        >
                                            {user.name?.first
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </Avatar>

                                        <Tooltip
                                            title={t('profile.verifiedAccount')}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: -8,
                                                    insetInlineEnd: -8,
                                                    width: 42,
                                                    height: 42,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: '#d1ab00',
                                                    p: '3px',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: '50%',
                                                        bgcolor: 'success.main',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                    }}
                                                >
                                                    <VerifiedUser
                                                        sx={{
                                                            fontSize: 18,
                                                            color: '#fff',
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                </Grid>

                                <Grid
                                    size={{ xs: 12, sm: 'auto' }}
                                    sx={{ flex: 1 }}
                                >
                                    <Typography
                                        variant='h4'
                                        fontWeight={800}
                                        gutterBottom
                                        sx={{
                                            textAlign: {
                                                xs: 'center',
                                                sm: 'start',
                                            },
                                        }}
                                    >
                                        {user.name.first} {user.name.last}
                                    </Typography>
                                    <Stack
                                        direction='row'
                                        alignItems='center'
                                        spacing={1}
                                        mb={2}
                                        flexWrap='wrap'
                                        useFlexGap
                                        justifyContent={{
                                            xs: 'center',
                                            sm: 'flex-start',
                                        }}
                                    >
                                        <Typography
                                            variant='body2'
                                            sx={{ opacity: 0.8 }}
                                        >
                                            @
                                            {user.slug ||
                                                user.email.split('@')[0]}
                                        </Typography>
                                        <Chip
                                            label={
                                                user.role === 'Admin'
                                                    ? t('accountMenu.admin')
                                                    : user.role === 'Moderator'
                                                      ? t(
                                                            'accountMenu.moderator',
                                                        )
                                                      : t('accountMenu.client')
                                            }
                                            size='small'
                                            sx={{
                                                bgcolor: alpha('#fff', 0.12),
                                                color: 'inherit',
                                                fontWeight: 600,
                                            }}
                                        />
                                        <Chip
                                            label={
                                                user.status === true
                                                    ? t('status.active')
                                                    : t('status.inActive')
                                            }
                                            size='small'
                                            sx={{
                                                fontWeight: 600,
                                                bgcolor: user.status
                                                    ? alpha('#22c55e', 0.18)
                                                    : alpha('#fff', 0.1),
                                                color: user.status
                                                    ? '#4ade80'
                                                    : alpha('#fff', 0.6),
                                            }}
                                        />
                                    </Stack>

                                    <Stack direction='column' spacing={0.75}>
                                        {user.email && (
                                            <Box
                                                display='flex'
                                                alignItems='center'
                                                gap={1}
                                            >
                                                <Email
                                                    fontSize='small'
                                                    sx={{ opacity: 0.6 }}
                                                />
                                                <Typography variant='body2'>
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        )}
                                        {user.phone?.phone_1 && (
                                            <Box
                                                display='flex'
                                                alignItems='center'
                                                gap={1}
                                            >
                                                <Phone
                                                    fontSize='small'
                                                    sx={{ opacity: 0.6 }}
                                                />
                                                <Typography variant='body2'>
                                                    {user.phone.phone_1}
                                                </Typography>
                                            </Box>
                                        )}
                                        {user.address?.city && (
                                            <Box
                                                display='flex'
                                                alignItems='center'
                                                gap={1}
                                            >
                                                <LocationOn
                                                    fontSize='small'
                                                    sx={{ opacity: 0.6 }}
                                                />
                                                <Typography variant='body2'>
                                                    {user.address.street}،{' '}
                                                    {user.address.city}
                                                    {user.address.houseNumber &&
                                                        `، رقم ${user.address.houseNumber}`}
                                                </Typography>
                                            </Box>
                                        )}
                                        {user.createdAt && (
                                            <Box
                                                display='flex'
                                                alignItems='center'
                                                gap={1}
                                            >
                                                <CalendarToday
                                                    fontSize='small'
                                                    sx={{ opacity: 0.6 }}
                                                />
                                                <Typography variant='body2'>
                                                    {t('profile.memberSince')} :{' '}
                                                    {formatDate(user.createdAt)}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* === Stats Ribbon === */}
                        <Paper
                            variant='outlined'
                            sx={{
                                borderRadius: '18px',
                                mb: 5,
                                overflow: 'hidden',
                            }}
                        >
                            <Grid container>
                                {statItems.map((s, i) => {
                                    const totalCells = statItems.length + 1;
                                    const isLast = i === totalCells - 1;
                                    const content = (
                                        <Box
                                            sx={{
                                                px: 2,
                                                py: 3,
                                                textAlign: 'center',
                                                height: '100%',
                                                transition:
                                                    'background-color .2s',
                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    mx: 'auto',
                                                    mb: 1,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: alpha(
                                                        s.color,
                                                        0.12,
                                                    ),
                                                    color: s.color,
                                                }}
                                            >
                                                {s.icon}
                                            </Box>
                                            <Typography
                                                variant='h5'
                                                fontWeight={800}
                                            >
                                                {s.value}
                                            </Typography>
                                            <Typography
                                                variant='body2'
                                                color='text.secondary'
                                            >
                                                {s.label}
                                            </Typography>
                                        </Box>
                                    );
                                    return (
                                        <Grid
                                            key={s.label}
                                            size={{ xs: 6, sm: 3 }}
                                            sx={{
                                                borderInlineEnd: !isLast
                                                    ? '1px solid'
                                                    : 'none',
                                                borderColor: 'divider',
                                            }}
                                        >
                                            {s.to ? (
                                                <Link
                                                    to={s.to}
                                                    style={{
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        display: 'block',
                                                        height: '100%',
                                                    }}
                                                >
                                                    {content}
                                                </Link>
                                            ) : (
                                                content
                                            )}
                                        </Grid>
                                    );
                                })}

                                <Grid
                                    size={{ xs: 6, sm: 3 }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        py: 2,
                                    }}
                                >
                                    <Tooltip
                                        title={`${t('profile.complete')}: ${stats.completionPercentage}%`}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 0.5,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    display: 'inline-flex',
                                                }}
                                            >
                                                <CircularProgress
                                                    variant='determinate'
                                                    value={100}
                                                    size={64}
                                                    thickness={4}
                                                    sx={{
                                                        color: alpha(
                                                            completionColor,
                                                            0.15,
                                                        ),
                                                        position: 'absolute',
                                                    }}
                                                />
                                                <CircularProgress
                                                    variant='determinate'
                                                    value={
                                                        stats.completionPercentage
                                                    }
                                                    size={64}
                                                    thickness={4}
                                                    sx={{
                                                        color: completionColor,
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                    }}
                                                >
                                                    <Typography
                                                        variant='caption'
                                                        fontWeight={800}
                                                    >
                                                        {
                                                            stats.completionPercentage
                                                        }
                                                        %
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography
                                                mt={3}
                                                variant='body2'
                                                color='text.secondary'
                                            >
                                                {t('profile.completed')}
                                            </Typography>
                                        </Box>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* === Tabs Navigation === */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mb: 4,
                            }}
                        >
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                variant={isMobile ? 'scrollable' : 'standard'}
                                scrollButtons={isMobile ? 'auto' : false}
                                TabIndicatorProps={{ sx: { display: 'none' } }}
                                sx={{
                                    p: 0.75,
                                    bgcolor: (th) =>
                                        alpha(th.palette.text.primary, 0.04),
                                    borderRadius: 999,
                                    minHeight: 0,
                                    '& .MuiTabs-flexContainer': { gap: 0.5 },
                                    '& .MuiTab-root': {
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        minHeight: 40,
                                        borderRadius: 999,
                                        px: 2.5,
                                        color: 'text.secondary',
                                        transition: 'all .2s',
                                    },
                                    '& .Mui-selected': {
                                        bgcolor: 'background.paper',
                                        color: `${theme.palette.text.primary} !important`,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    },
                                }}
                            >
                                {tabs.map((tab, index) => (
                                    <Tab
                                        key={index}
                                        label={tab.label}
                                        icon={tab.icon}
                                        iconPosition='start'
                                    />
                                ))}
                            </Tabs>
                        </Box>

                        {/* === Tab Content === */}
                        {activeTab === 0 && (
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, lg: 8 }}>
                                        <PersonalInformation
                                            user={user as unknown as User}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, lg: 4 }}>
                                        <Card
                                            variant='outlined'
                                            sx={{
                                                borderRadius: 3,
                                                height: '100%',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '4px',
                                                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${ACCENT})`,
                                                },
                                            }}
                                        >
                                            <CardContent sx={{ pt: 3 }}>
                                                <Stack
                                                    direction='row'
                                                    alignItems='center'
                                                    spacing={1.5}
                                                    mb={3}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            bgcolor: alpha(
                                                                theme.palette
                                                                    .primary
                                                                    .main,
                                                                0.12,
                                                            ),
                                                            color: theme.palette
                                                                .primary.main,
                                                        }}
                                                    >
                                                        <HistoryIcon fontSize='small' />
                                                    </Box>
                                                    <Typography
                                                        variant='h6'
                                                        fontWeight={800}
                                                    >
                                                        {t('activity.title')}
                                                    </Typography>
                                                </Stack>

                                                {user.activity?.length ? (
                                                    <Box
                                                        sx={{
                                                            position:
                                                                'relative',
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                position:
                                                                    'absolute',
                                                                top: 6,
                                                                bottom: 6,
                                                                insetInlineStart: 15,
                                                                width: '2px',
                                                                background: `linear-gradient(180deg, ${ACCENT}, ${alpha(theme.palette.divider, 0.5)})`,
                                                            }}
                                                        />
                                                        <Stack spacing={2.5}>
                                                            {user.activity
                                                                .slice(-5)
                                                                .reverse()
                                                                .map(
                                                                    (
                                                                        timestamp,
                                                                        index,
                                                                    ) => (
                                                                        <Box
                                                                            key={
                                                                                index
                                                                            }
                                                                            sx={{
                                                                                position:
                                                                                    'relative',
                                                                                paddingInlineStart:
                                                                                    '38px',
                                                                            }}
                                                                        >
                                                                            <Box
                                                                                sx={{
                                                                                    position:
                                                                                        'absolute',
                                                                                    insetInlineStart: 6,
                                                                                    top: 2,
                                                                                    width: 20,
                                                                                    height: 20,
                                                                                    borderRadius:
                                                                                        '50%',
                                                                                    display:
                                                                                        'flex',
                                                                                    alignItems:
                                                                                        'center',
                                                                                    justifyContent:
                                                                                        'center',
                                                                                    bgcolor:
                                                                                        index ===
                                                                                        0
                                                                                            ? ACCENT
                                                                                            : theme
                                                                                                  .palette
                                                                                                  .background
                                                                                                  .paper,
                                                                                    border: `2px solid ${index === 0 ? ACCENT : theme.palette.primary.main}`,
                                                                                    boxShadow:
                                                                                        index ===
                                                                                        0
                                                                                            ? `0 0 0 4px ${alpha(ACCENT, 0.15)}`
                                                                                            : 'none',
                                                                                }}
                                                                            >
                                                                                {index ===
                                                                                    0 && (
                                                                                    <Box
                                                                                        sx={{
                                                                                            width: 6,
                                                                                            height: 6,
                                                                                            borderRadius:
                                                                                                '50%',
                                                                                            bgcolor:
                                                                                                '#fff',
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </Box>
                                                                            <Typography
                                                                                variant='body2'
                                                                                fontWeight={
                                                                                    600
                                                                                }
                                                                            >
                                                                                {getRelativeDate(
                                                                                    timestamp,
                                                                                )}
                                                                            </Typography>
                                                                            <Typography
                                                                                variant='caption'
                                                                                color='text.secondary'
                                                                            >
                                                                                {t(
                                                                                    'activity.lastLogin',
                                                                                )}
                                                                            </Typography>
                                                                        </Box>
                                                                    ),
                                                                )}
                                                        </Stack>
                                                    </Box>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            py: 5,
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            alignItems:
                                                                'center',
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius:
                                                                    '50%',
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                justifyContent:
                                                                    'center',
                                                                bgcolor: alpha(
                                                                    theme
                                                                        .palette
                                                                        .text
                                                                        .secondary,
                                                                    0.08,
                                                                ),
                                                                color: 'text.secondary',
                                                            }}
                                                        >
                                                            <HistoryIcon />
                                                        </Box>
                                                        <Typography
                                                            color='text.secondary'
                                                            textAlign='center'
                                                        >
                                                            {t(
                                                                'activity.empty',
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </m.div>
                        )}

                        {activeTab === 1 && <FavoritesProducts />}

                        {activeTab === 2 && (
                            <Card variant='outlined' sx={{ borderRadius: 3 }}>
                                <CardContent>
                                    <Typography
                                        variant='h6'
                                        gutterBottom
                                        fontWeight={800}
                                    >
                                        {t('profile.accountSettings')}
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Card
                                                variant='outlined'
                                                sx={{ p: 2, borderRadius: 3 }}
                                            >
                                                <Typography
                                                    variant='subtitle1'
                                                    fontWeight={700}
                                                    gutterBottom
                                                >
                                                    {t('profile.dataPrivacy')}
                                                </Typography>
                                                <Stack spacing={1.5}>
                                                    <Button
                                                        disabled
                                                        variant='outlined'
                                                        startIcon={
                                                            <VisibilityIcon />
                                                        }
                                                        sx={{
                                                            justifyContent:
                                                                'flex-start',
                                                            gap: 2,
                                                            borderRadius: 999,
                                                        }}
                                                    >
                                                        {t(
                                                            'profile.appearanceSettings',
                                                        )}
                                                    </Button>
                                                    <Button
                                                        disabled
                                                        variant='outlined'
                                                        startIcon={<Lock />}
                                                        sx={{
                                                            justifyContent:
                                                                'flex-start',
                                                            gap: 2,
                                                            borderRadius: 999,
                                                        }}
                                                    >
                                                        {t(
                                                            'profile.accountPrivacy',
                                                        )}
                                                    </Button>
                                                    <Button
                                                        disabled
                                                        variant='outlined'
                                                        startIcon={<Email />}
                                                        sx={{
                                                            justifyContent:
                                                                'flex-start',
                                                            gap: 2,
                                                            borderRadius: 999,
                                                        }}
                                                    >
                                                        {t(
                                                            'profile.mailNotifications',
                                                        )}
                                                    </Button>
                                                </Stack>
                                                <QuickActionsTab
                                                    user={
                                                        user as unknown as User
                                                    }
                                                />
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}

                        {/* === Edit User Data === */}
                        <Box
                            ref={detailsRef}
                            sx={{
                                my: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <Button
                                variant='outlined'
                                onClick={handleShowIdit}
                                sx={{ borderRadius: 999, px: 3 }}
                            >
                                {showEdit
                                    ? t('profile.hideEdit', {
                                          defaultValue: 'إخفاء التعديل',
                                      })
                                    : t('profile.editData', {
                                          defaultValue: 'تعديل البيانات',
                                      })}
                            </Button>
                        </Box>

                        {showEdit && (
                            <Suspense fallback={null}>
                                <EditUserData userId={auth?._id || ''} />
                            </Suspense>
                        )}

                        <Divider sx={{ my: 4 }} />

                        <DeleteAccountBox
                            onDelete={() => setShowDeleteConfirm(true)}
                        />
                    </Container>
                </m.div>
                <AlertDialogs
                    show={showDeleteConfirm}
                    onHide={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDeleteAccount}
                    title={t('deleteAccount.title', {
                        defaultValue: 'حذف الحساب؟',
                    })}
                    description={t('deleteAccount.description', {
                        defaultValue:
                            'هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.',
                    })}
                    confirmText={t('common.delete', {
                        defaultValue: 'حذف',
                    })}
                    cancelText={t('common.cancel', {
                        defaultValue: 'إلغاء',
                    })}
                    successText={t('deleteAccount.success', {
                        defaultValue: 'تم حذف الحساب بنجاح',
                    })}
                    errorText={t('deleteAccount.error', {
                        defaultValue: 'حدث خطأ أثناء حذف الحساب',
                    })}
                />
            </Box>
        </>
    );
};

export default Profile;
