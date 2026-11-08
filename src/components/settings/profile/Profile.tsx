import {
    FunctionComponent,
    lazy,
    ReactElement,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    CircularProgress,
    Collapse,
    Container,
    Divider,
    Grid,
    Stack,
    Tab,
    Tabs,
    alpha,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Favorite, Person, Settings } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { m, MotionConfig } from 'framer-motion';
import QuickActionsTab from './tabs/QuickActionsTab';


import { useUserPosts } from '../../../hooks/useUserPosts';
import { usePosts } from '../../../hooks/usePosts';
import { useUser } from '../../../hooks/useUSer';
import { path } from '../../../routes/routes';
import { showSuccess } from '../../../atoms/toasts/ReactToast';
import { deleteUserById, getUserById } from '../../../services/usersServices';
import DeleteAccountBox from '../../navbar/userManage/DeleteAccountBox';
import { User } from '../../../interfaces/chat/usersMessages';
import Loader from '../../../atoms/loader/Loader';
import handleRTL from '../../../locales/handleRTL';
import AlertDialogs from '../../../atoms/toasts/Sweetalert';
import { calculateProfileCompletion, computeLevel, EMPTY_USER, getLikesReceived, getMissingFields, getReviewStats, ProfileUser } from './ProfileShared';
import ActivityCard from './ActivityCard';
import CompletionCard from './CompletionCard';
import ProfileHero from './ProfileHero';
import ReputationCard from './ReputationCard';
import PersonalInformation from './tabs/PersonalInformation';

const EditUserData = lazy(() => import('../../navbar/userManage/EditUserData'));
const FavoritesProducts = lazy(
    () => import('../../pages/products/FavoritesPosts'),
);

type TabKey = 'overview' | 'favorites' | 'settings';

const InlineSpinner = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={32} />
    </Box>
);

const Profile: FunctionComponent = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    const dir = handleRTL();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams();
    const { auth, logout: contextLogout } = useUser();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<ProfileUser>(EMPTY_USER);
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const editRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef(0);

    const targetId = id || auth?._id;
    const isOwner = !!auth?._id && (!id || id === auth._id);

    /* ───────── Tabs (synced with ?tab=) ───────── */
    const allowedTabs: TabKey[] = isOwner
        ? ['overview', 'favorites', 'settings']
        : ['overview'];
    const tabParam = searchParams.get('tab') as TabKey | null;
    const activeTab: TabKey =
        tabParam && allowedTabs.includes(tabParam) ? tabParam : 'overview';

    const selectTab = useCallback(
        (key: TabKey) =>
            setSearchParams(key === 'overview' ? {} : { tab: key }, {
                replace: true,
            }),
        [setSearchParams],
    );

    /* ───────── Data ───────── */
    const loadUser = useCallback(
        async (silent = false) => {
            if (!targetId) return;
            const reqId = ++requestRef.current;
            try {
                if (!silent) setLoading(true);
                const res = await getUserById(targetId);
                if (reqId === requestRef.current) setUser(res);
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                if (!silent && reqId === requestRef.current) setLoading(false);
            }
        },
        [targetId],
    );

    useEffect(() => {
        void loadUser();
        return () => {
            requestRef.current += 1; // يلغي أي رد متأخر
        };
    }, [loadUser]);

    const { userPosts, loading: productsLoading } = useUserPosts(user.slug);
    const { posts } = usePosts();

    /* ───────── Derived ───────── */
    const reviewStats = useMemo(() => getReviewStats(userPosts), [userPosts]);
    const likesReceived = useMemo(() => getLikesReceived(userPosts), [userPosts]);
    const completion = useMemo(() => calculateProfileCompletion(user), [user]);
    const missing = useMemo(() => getMissingFields(user), [user]);

    const favorites = useMemo(() => {
        const viewerId = auth?._id;
        if (!viewerId) return 0;
        return posts.filter(
            (p) => Array.isArray(p.likes) && p.likes.includes(viewerId),
        ).length;
    }, [posts, auth?._id]);

    const level = useMemo(
        () =>
            computeLevel({
                posts: userPosts.length,
                completion,
                reviews: reviewStats.count,
                rating: reviewStats.average,
            }),
        [userPosts.length, completion, reviewStats],
    );

    /* ───────── Actions ───────── */
    const openEdit = useCallback(() => {
        setShowEdit(true);
        selectTab('settings');
    }, [selectTab]);

    const toggleEdit = () => {
        // عند الإغلاق نعيد جلب البيانات بصمت حتى يتحدّث الـ Hero
        if (showEdit) void loadUser(true);
        setShowEdit((v) => !v);
    };

    // بعد فتح التعديل ينزل التمرير تلقائياً للنموذج
    useEffect(() => {
        if (!showEdit || activeTab !== 'settings') return;
        const timer = window.setTimeout(
            () =>
                editRef.current?.scrollIntoView({
                    behavior: reduceMotion ? 'auto' : 'smooth',
                    block: 'start',
                }),
            150,
        );
        return () => window.clearTimeout(timer);
    }, [showEdit, activeTab, reduceMotion]);

    const handleShareProfile = async () => {
        const profileUrl = `${window.location.origin}/users/customer/${user.slug}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${t('profile.title')} ${user.name.first} ${user.name.last}`,
                    text: t('profile.shareText', {
                        defaultValue: 'اطلع على ملفي الشخصي على موقع صفقه',
                    }),
                    url: profileUrl,
                });
            } else {
                await navigator.clipboard.writeText(profileUrl);
                showSuccess(
                    t('profile.linkCopied', {
                        defaultValue: 'تم نسخ رابط الملف الشخصي',
                    }),
                );
            }
        } catch (shareError) {
            // المستخدم سكّر نافذة المشاركة
            if ((shareError as Error).name !== 'AbortError') {
                console.error('Share profile error:', shareError);
            }
        }
    };

    const handleLogout = async () => {
        await contextLogout();
        navigate(path.Home, { replace: true });
    };

    const handleDeleteAccount = async () => {
        if (!auth?._id) throw new Error('User ID is missing');
        await deleteUserById(auth._id);
        await contextLogout();
    };

    if (loading || productsLoading) return <Loader />;

    const fullName = `${user.name.first} ${user.name.last}`.trim();

    const tabs: { key: TabKey; label: string; icon: ReactElement }[] = [
        { key: 'overview', label: t('profile.title'), icon: <Person /> },
        ...(isOwner
            ? [
                  {
                      key: 'favorites' as const,
                      label: t('profile.myFavorites'),
                      icon: <Favorite />,
                  },
                  {
                      key: 'settings' as const,
                      label: t('profile.settings'),
                      icon: <Settings />,
                  },
              ]
            : []),
    ];

    return (
        <MotionConfig reducedMotion='user'>
            <link rel='canonical' href={`${window.location.origin}/profile`} />
            <title>{`${t('accountMenu.profile')} ${fullName} | صفقة`}</title>
            <meta
                name='description'
                content={`${t('accountMenu.profile')} ${fullName}`}
            />
            <meta property='og:title' content={`${fullName} - ملف شخصي`} />
            <meta
                property='og:description'
                content={`تعرف على ${user.name.first} على موقع صفقه`}
            />
            {user.image?.url && (
                <meta property='og:image' content={user.image.url} />
            )}

            <Box
                dir={dir}
                sx={{ minHeight: '100vh', py: { xs: 2, md: 4 }, px: { xs: 1.5, sm: 3 } }}
            >
                <Container maxWidth='lg'>
                    <m.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                    >
                        <ProfileHero
                            user={user}
                            isOwner={isOwner}
                            completion={completion}
                            level={level}
                            stats={{
                                posts: userPosts.length,
                                favorites,
                                likes: likesReceived,
                                rating: reviewStats.average,
                                reviews: reviewStats.count,
                            }}
                            onShare={handleShareProfile}
                            onEdit={openEdit}
                            onLogout={handleLogout}
                        />
                    </m.div>

                    {/* Tabs — بتظهر بس إذا في أكثر من تاب */}
                    {tabs.length > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <Tabs
                                value={activeTab}
                                onChange={(_, value: TabKey) => selectTab(value)}
                                aria-label={t('profile.title')}
                                variant={isMobile ? 'scrollable' : 'standard'}
                                scrollButtons={isMobile ? 'auto' : false}
                                slotProps={{ indicator: { sx: { display: 'none' } } }}
                                sx={{
                                    p: 0.75,
                                    bgcolor: (th) => alpha(th.palette.text.primary, 0.04),
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
                                {tabs.map((tab) => (
                                    <Tab
                                        key={tab.key}
                                        value={tab.key}
                                        label={tab.label}
                                        icon={tab.icon}
                                        iconPosition='start'
                                    />
                                ))}
                            </Tabs>
                        </Box>
                    )}

                    <m.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        style={{ marginTop: tabs.length > 1 ? 0 : 32 }}
                    >
                        {/* ───── Overview ───── */}
                        {activeTab === 'overview' && (
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, lg: isOwner ? 8 : 12 }}>
                                    <Stack spacing={3}>
                                        <PersonalInformation
                                            user={user as unknown as User}
                                        />
                                        <ReputationCard
                                            stats={reviewStats}
                                            level={level}
                                            isOwner={isOwner}
                                        />
                                    </Stack>
                                </Grid>

                                {isOwner && (
                                    <Grid size={{ xs: 12, lg: 4 }}>
                                        <Stack spacing={3}>
                                            {completion < 100 && (
                                                <CompletionCard
                                                    completion={completion}
                                                    missing={missing}
                                                    onComplete={openEdit}
                                                />
                                            )}
                                            <ActivityCard activity={user.activity} />
                                        </Stack>
                                    </Grid>
                                )}
                            </Grid>
                        )}

                        {/* ───── Favorites ───── */}
                        {activeTab === 'favorites' && (
                            <Suspense fallback={<InlineSpinner />}>
                                <FavoritesProducts />
                            </Suspense>
                        )}

                        {/* ───── Settings ───── */}
                        {activeTab === 'settings' && (
                            <Stack spacing={3} sx={{ maxWidth: 860, mx: 'auto' }}>
                                <QuickActionsTab
                                    user={user}
                                    onEditProfile={toggleEdit}
                                    editOpen={showEdit}
                                />

                                <Collapse in={showEdit} unmountOnExit>
                                    <Box ref={editRef} sx={{ scrollMarginTop: 16 }}>
                                        <Suspense fallback={<InlineSpinner />}>
                                            <EditUserData userId={auth?._id || ''} />
                                        </Suspense>
                                    </Box>
                                </Collapse>

                                <Divider />

                                <DeleteAccountBox
                                    onDelete={() => setShowDeleteConfirm(true)}
                                />
                            </Stack>
                        )}
                    </m.div>
                </Container>

                {isOwner && (
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
                        confirmText={t('common.delete', { defaultValue: 'حذف' })}
                        cancelText={t('common.cancel', { defaultValue: 'إلغاء' })}
                        successText={t('deleteAccount.success', {
                            defaultValue: 'تم حذف الحساب بنجاح',
                        })}
                        errorText={t('deleteAccount.error', {
                            defaultValue: 'حدث خطأ أثناء حذف الحساب',
                        })}
                    />
                )}
            </Box>
        </MotionConfig>
    );
};

export default Profile;