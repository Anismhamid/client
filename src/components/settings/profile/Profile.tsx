import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PersonalInformation from './tabs/PersonalInformationTab';
import { useUserPosts } from '../../../hooks/useUserPosts';
import useToken from '../../../hooks/useToken';
import { useUser } from '../../../context/useUSer';
import { Posts } from '../../../interfaces/Posts';
import { path } from '../../../routes/routes';
import { showSuccess } from '../../../atoms/toasts/ReactToast';
import { emptyAuthValues } from '../../../interfaces/authValues';
import { deleteUserById, getUserById } from '../../../services/usersServices';
import { formatDate } from '../../../helpers/dateAndPriceFormat';
import DeleteAccountBox from '../../navbar/userManage/DeleteAccountBox';
import EditUserData from '../../navbar/userManage/EditUserData';
import QuickActionsTab from './tabs/QuickActionsTab';
import FavoritesProducts from '../../pages/products/FavoritesPosts';
import { User } from '../../../interfaces/chat/usersMessages';

const INK = '#12161C';

/**
 * User Profile Component
 * @returns User profile with personal data and management options
 */
const Profile: FunctionComponent = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();
    const { decodedToken, setAfterDecode } = useToken();
    const { setAuth, setIsLoggedIn } = useUser();
    const detailsRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [showEdit, setShowEdit] = useState<boolean>(false);

    const { id } = useParams();

    const handleShowIdit = () => setShowEdit(!showEdit);

    const [user, setUser] = useState<{
        name: { first: string; last: string };
        phone: { phone_1: string; phone_2: string };
        address: {
            city: string;
            street: string;
            houseNumber: number;
        };
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

    const calculateProfileCompletion = (user: User) => {
        const fields = [
            user.name?.first,
            user.name?.last,
            user.phone?.phone_1,
            user.address?.city,
            user.address?.street,
            user.address?.houseNumber,
            user.image?.url,
            user.gender?.toString(),
        ];

        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
    };

    const calculateRating = (products: Posts[]) => {
        if (!products.length) return 0;

        const ratings = products.flatMap(
            (p) => p.reviews?.map((r) => r.rating) || [],
        );

        if (!ratings.length) return 0;

        const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
        return Number(avg.toFixed(1));
    };

    const handleShareProfile = () => {
        const profileUrl = `${window.location.origin}/users/customer/${user.slug}`;
        if (navigator.share) {
            navigator.share({
                title: `الملف الشخصي لـ ${user.name.first} ${user.name.last}`,
                text: `اطلع على ملفي الشخصي على موقع صفقه`,
                url: profileUrl,
            });
        } else {
            navigator.clipboard.writeText(profileUrl);
            showSuccess('تم نسخ رابط الملف الشخصي');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuth(emptyAuthValues);
        setIsLoggedIn(false);
        setAfterDecode(null);
        navigate(path.Home);
    };

    const targetId = id || decodedToken?._id;

    useEffect(() => {
        if (!targetId) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const userRes = await getUserById(targetId);
                setUser(userRes);
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, decodedToken, targetId]);

    const stats = useMemo(() => {
        if (!user)
            return {
                totalProducts: userPosts.length,
                totalFavorites: 0,
                rating: 0,
                totalLikesOnMyProducts: 0,
                completionPercentage: 0,
            };

        return {
            totalProducts: userPosts.length,
            totalFavorites: 0,
            rating: calculateRating(userPosts || []),
            completionPercentage: calculateProfileCompletion(user),
        };
    }, [user, userPosts]);

    const handleDeleteAccount = () => {
        if (!decodedToken?._id) return;

        deleteUserById(decodedToken._id).then(() => {
            localStorage.removeItem('token');
            setAuth(emptyAuthValues);
            setIsLoggedIn(false);
            setAfterDecode(null);
            navigate(path.Home);
        });
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    if (loading || productsLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                    gap: 3,
                }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <CircularProgress size={60} thickness={3} />
                </motion.div>
                <Typography variant='h6' color='text.secondary'>
                    جاري تحميل الملف الشخصي...
                </Typography>
            </Box>
        );
    }

    const tabs = [
        { label: 'الملف الشخصي', icon: <Person /> },
        { label: 'المفضلة', icon: <Favorite /> },
        { label: 'الإعدادات', icon: <Settings /> },
    ];
    const currentUrl = `https://client-qqq1.vercel.app/profile`;

    const statItems = [
        {
            icon: <ShoppingCart sx={{ fontSize: 28 }} color='primary' />,
            value: userPosts.length || 0,
            label: 'منشوراتي',
            to: `/users/customer/${user.slug}`,
        },
        {
            icon: <Favorite sx={{ fontSize: 28 }} color='error' />,
            value: stats.totalFavorites,
            label: t('favorites'),
        },
        {
            icon: <Star sx={{ fontSize: 28 }} color='warning' />,
            value: stats.rating.toFixed(1),
            label: 'تقييم',
        },
    ];

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

            <Box sx={{ minHeight: '100vh', py: 4, px: { xs: 2, sm: 3 } }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Container maxWidth='lg'>
                        {/* Membership Card Header */}
                        <Box
                            sx={{
                                position: 'relative',
                                mb: 7,
                                borderRadius: '22px',
                                bgcolor: INK,
                                color: '#fff',
                                px: { xs: 3, md: 5 },
                                pt: { xs: 3, md: 4 },
                                pb: { xs: 5, md: 5 },
                                boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5)',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -11,
                                    insetInline: 0,
                                    height: 22,
                                    background: `radial-gradient(circle at 11px 0, transparent 11px, ${INK} 11.5px)`,
                                    backgroundSize: '22px 22px',
                                    backgroundRepeat: 'repeat-x',
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
                                    sx={{
                                        letterSpacing: 3,
                                        color: alpha('#fff', 0.55),
                                        fontWeight: 700,
                                    }}
                                >
                                    بطاقة عضوية · صفقة
                                </Typography>
                                <Stack direction='row' spacing={1}>
                                    <Tooltip title='مشاركة'>
                                        <IconButton
                                            onClick={handleShareProfile}
                                            size='small'
                                            sx={{
                                                color: '#fff',
                                                border: '1px solid',
                                                borderColor: alpha('#fff', 0.2),
                                                '&:hover': {
                                                    borderColor: alpha(
                                                        '#fff',
                                                        0.5,
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
                                                color: '#fff',
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
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: -6,
                                                insetInlineEnd: -6,
                                                width: 38,
                                                height: 38,
                                                borderRadius: '50%',
                                                bgcolor: 'success.main',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: `3px solid ${INK}`,
                                                transform: 'rotate(-8deg)',
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
                                </Grid>

                                <Grid size={{ xs: 12 }}>
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
                                            sx={{ color: alpha('#fff', 0.6) }}
                                        >
                                            @
                                            {user.slug ||
                                                user.email.split('@')[0]}
                                        </Typography>
                                        <Chip
                                            label={
                                                user.role === 'Admin'
                                                    ? 'مدير'
                                                    : user.role === 'Moderator'
                                                      ? 'مشرف'
                                                      : 'مستخدم'
                                            }
                                            size='small'
                                            sx={{
                                                bgcolor: alpha('#fff', 0.12),
                                                color: '#fff',
                                                fontWeight: 600,
                                            }}
                                        />
                                        <Chip
                                            label={
                                                user.status === true
                                                    ? 'نشط'
                                                    : 'غير نشط'
                                            }
                                            size='small'
                                            color='success'
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Stack>

                                    <Stack
                                        direction='column'
                                        spacing={0.75}
                                        sx={{ color: alpha('#fff', 0.75) }}
                                    >
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
                                                    عضو منذ:{' '}
                                                    {formatDate(user.createdAt)}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Stats Ribbon — the "back of the card" */}
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
                                            {s.icon}
                                            <Typography
                                                variant='h5'
                                                fontWeight={800}
                                                sx={{ mt: 0.5 }}
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
                                                borderInlineEnd:
                                                    i < 3
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
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            display: 'inline-flex',
                                        }}
                                    >
                                        <CircularProgress
                                            variant='determinate'
                                            value={stats.completionPercentage}
                                            size={64}
                                            thickness={4}
                                            sx={{ color: 'primary.main' }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography
                                                variant='caption'
                                                fontWeight={800}
                                            >
                                                {stats.completionPercentage}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Tabs Navigation */}
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant={isMobile ? 'scrollable' : 'standard'}
                            scrollButtons='auto'
                            centered={!isMobile}
                            TabIndicatorProps={{
                                sx: { height: 3, borderRadius: 3 },
                            }}
                            sx={{
                                mb: 4,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                '& .MuiTab-root': {
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    minHeight: 52,
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

                        {/* Tab Content */}
                        {activeTab === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, lg: 8 }}>
                                        <PersonalInformation user={user} />
                                        <QuickActionsTab user={user} />
                                    </Grid>

                                    {/* Activity History */}
                                    <Grid size={{ xs: 12, lg: 4 }}>
                                        <Card
                                            variant='outlined'
                                            sx={{
                                                borderRadius: 3,
                                                height: '100%',
                                            }}
                                        >
                                            <CardContent>
                                                <Typography
                                                    variant='h6'
                                                    gutterBottom
                                                    fontWeight={800}
                                                >
                                                    سجل النشاط
                                                </Typography>
                                                {user.activity?.length ? (
                                                    <Box
                                                        sx={{
                                                            position:
                                                                'relative',
                                                            mt: 2,
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
                                                                bgcolor:
                                                                    'divider',
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
                                                                    ) => {
                                                                        const date =
                                                                            new Date(
                                                                                timestamp,
                                                                            );
                                                                        return (
                                                                            <Box
                                                                                key={
                                                                                    index
                                                                                }
                                                                                sx={{
                                                                                    position:
                                                                                        'relative',
                                                                                    pInlineStart:
                                                                                        '38px',
                                                                                    pl: '38px',
                                                                                }}
                                                                            >
                                                                                <Box
                                                                                    sx={{
                                                                                        position:
                                                                                            'absolute',
                                                                                        insetInlineStart: 9,
                                                                                        top: 4,
                                                                                        width: 14,
                                                                                        height: 14,
                                                                                        borderRadius:
                                                                                            '50%',
                                                                                        bgcolor:
                                                                                            'background.paper',
                                                                                        border: '2px solid',
                                                                                        borderColor:
                                                                                            'primary.main',
                                                                                    }}
                                                                                />
                                                                                <Typography
                                                                                    variant='body2'
                                                                                    fontWeight={
                                                                                        600
                                                                                    }
                                                                                >
                                                                                    {date.toLocaleString(
                                                                                        'he-IL',
                                                                                    )}
                                                                                </Typography>
                                                                                <Typography
                                                                                    variant='caption'
                                                                                    color='text.secondary'
                                                                                >
                                                                                    {t(
                                                                                        'login.lastLogin',
                                                                                    )}
                                                                                </Typography>
                                                                            </Box>
                                                                        );
                                                                    },
                                                                )}
                                                        </Stack>
                                                    </Box>
                                                ) : (
                                                    <Typography
                                                        sx={{ py: 4 }}
                                                        color='text.secondary'
                                                        textAlign='center'
                                                    >
                                                        لا يوجد نشاطات حديثة
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </motion.div>
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
                                        إعدادات الحساب
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
                                                    خصوصية البيانات
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
                                                        إعدادات الظهور
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
                                                        خصوصية الحساب
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
                                                        إشعارات البريد
                                                    </Button>
                                                </Stack>
                                            </Card>
                                        </Grid>
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
                                                    معلومات الدفع
                                                </Typography>
                                                <Stack spacing={1.5}>
                                                    <Button
                                                        disabled
                                                        variant='outlined'
                                                        startIcon={
                                                            <ShoppingCart />
                                                        }
                                                        sx={{
                                                            justifyContent:
                                                                'flex-start',
                                                            gap: 2,
                                                            borderRadius: 999,
                                                        }}
                                                    >
                                                        البطاقات المصرفية
                                                    </Button>
                                                    <Button
                                                        disabled
                                                        variant='outlined'
                                                        startIcon={
                                                            <HistoryIcon />
                                                        }
                                                        sx={{
                                                            justifyContent:
                                                                'flex-start',
                                                            gap: 2,
                                                            borderRadius: 999,
                                                        }}
                                                    >
                                                        سجل الدفع (قريبأ)
                                                    </Button>
                                                    <Button
                                                        disabled
                                                        variant='outlined'
                                                        startIcon={<Settings />}
                                                        sx={{
                                                            justifyContent:
                                                                'flex-start',
                                                            gap: 2,
                                                            borderRadius: 999,
                                                        }}
                                                    >
                                                        إعدادات الدفع (قريبأ)
                                                    </Button>
                                                </Stack>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}

                        {/* Edit User Data Section */}
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
                                {showEdit ? 'إخفاء التعديل' : 'تعديل البيانات'}
                            </Button>
                        </Box>

                        {showEdit && (
                            <EditUserData userId={decodedToken?._id || ''} />
                        )}

                        <Divider sx={{ my: 4 }} />

                        <DeleteAccountBox onDelete={handleDeleteAccount} />
                    </Container>
                </motion.div>
            </Box>
        </>
    );
};

export default Profile;
