import { Routes, Route, Navigate } from 'react-router-dom';

import { lazy, FunctionComponent } from 'react';

import { path, productsPathes } from './routes';

import RoleType from '../interfaces/UserType';

import { AuthValues } from '../interfaces/authValues';

import { UserMessage } from '../interfaces/chat/usersMessages';

import { useUser } from '../hooks/useUSer';
import Loader from '../atoms/loader/Loader';

const AdminJobs = lazy(() => import('../components/admin/Jobs/AdminJobs'));

const AdminJobDetails = lazy(
    () => import('../components/admin/Jobs/AdminJobDetails'),
);

/* =========================================================
 * PUBLIC / GENERAL
 * ========================================================= */

const Home = lazy(() => import('../components/pages/home/Home'));

const Login = lazy(() => import('../components/settings/Login'));

const Register = lazy(() => import('../components/settings/register/Register'));

const About = lazy(() => import('../components/pages/About'));

const Contact = lazy(() => import('../components/pages/Contact'));

const PrivacyAdnPolicy = lazy(
    () => import('../components/pages/PrivacyAndPolicy'),
);

const TermOfUse = lazy(() => import('../components/pages/TermOfUse'));

const PageNotFound = lazy(() => import('../components/pages/Png'));

const ForgotPassword = lazy(
    () => import('../components/settings/ForgotPassword'),
);

const ResetPassword = lazy(
    () => import('../components/settings/ResetPassword'),
);

const DeleteAccount = lazy(
    () => import('../components/settings/DeleteAccount'),
);

/* =========================================================
 * USER
 * ========================================================= */

const Profile = lazy(() => import('../components/settings/profile/Profile'));

const CustomerProfile = lazy(
    () => import('../components/settings/customerProfile/CustomerProfile'),
);

const Favorite = lazy(
    () => import('../components/pages/products/FavoritesPosts'),
);

const BlockedUsers = lazy(() => import('../components/pages/BlockedUsers'));

/* =========================================================
 * PRODUCTS
 * ========================================================= */

const AdminNotifications = lazy(
    () => import('../components/admin/notifications/AdminNotifications'),
);

const AdminSendNotification = lazy(
    () => import('../components/admin/notifications/AdminSendNotification'),
);

const AdminSentNotifications = lazy(
    () => import('../components/admin/notifications/AdminSentNotifications'),
);

/* =========================================================
 * PRODUCTS
 * ========================================================= */

const Products = lazy(() => import('../components/pages/products/Posts'));

const PostDetails = lazy(
    () => import('../components/pages/products/PostDetails'),
);

const DiscountsAndOffers = lazy(
    () => import('../components/pages/products/DiscountsAndOffers'),
);

const MyAdsDashboard = lazy(
    () => import('../components/pages/ads/MyAdsDashboard'),
);

const FeaturedAdsDashboard = lazy(
    () => import('../components/pages/ads/FeaturedAdsDashboard'),
);

const HomepageFeaturedSection = lazy(
    () => import('../components/pages/ads/HomepageFeaturedSection'),
);

const PendingPosts = lazy(() => import('../components/PendingPosts'));

/* =========================================================
 * CHAT
 * ========================================================= */

const Messages = lazy(() => import('../components/settings/Messages'));

const ChatBoxWrapper = lazy(
    () => import('../components/pages/chatBox/ChatBoxWrapper'),
);

const MessagesPage = lazy(
    () => import('../components/pages/chatBox/MessagesPage'),
);

/* =========================================================
 * SEARCH
 * ========================================================= */

const SearchPage = lazy(() => import('../atoms/SearchPage'));

/* =========================================================
 * HELP
 * ========================================================= */

const SellingHelp = lazy(() => import('../components/pages/SellingHelp'));

const SafetyHelp = lazy(() => import('../components/pages/SafetyHelp'));

const DisputesHelp = lazy(() => import('../components/pages/DisputesHelp'));

/* =========================================================
 * JOBS
 * ========================================================= */

const JobsPage = lazy(() => import('../components/pages/Jobs/JobsPage'));

const JobDetails = lazy(() => import('../components/pages/Jobs/JobDetails'));

const CreateJob = lazy(() => import('../components/pages/Jobs/CreateJob'));

const EditJob = lazy(() => import('../components/pages/Jobs/EditJob'));

/* =========================================================
 * PAYMENT
 * ========================================================= */

const PaymentSuccess = lazy(
    () => import('../components/pages/payment/Success'),
);

/* =========================================================
 * ADMIN
 * ========================================================= */

const AdminLayout = lazy(() => import('../components/admin/AdminLayout'));

const AdminDashboard = lazy(
    () => import('../components/admin/Dashboard/AdminDashboard'),
);

const UsersManagement = lazy(
    () =>
        import('../components/settings/usersManagement/components/UsersManagement'),
);

const AdminSettings = lazy(
    () => import('../components/settings/AdminSettengs'),
);

const ReportManagement = lazy(
    () => import('../components/reports/ReportManagement'),
);

const MessageInvestigation = lazy(
    () =>
        import('../components/settings/usersManagement/components/MessageInvestigation/MessageInvestigation'),
);

const MessageAuditLogs = lazy(
    () =>
        import('../components/settings/usersManagement/components/MessageInvestigation/MessageAuditLogs'),
);

/* =========================================================
 * ADMIN GUARD
 * ========================================================= */

interface AdminGuardProps {
    children: React.ReactNode;
}

const AdminGuard: FunctionComponent<AdminGuardProps> = ({ children }) => {
    const { auth, isAuthLoading } = useUser();

    const isAuthenticated = Boolean(auth?._id);

    const isAdminOrModerator =
        auth?.role === RoleType.Admin || auth?.role === RoleType.Moderator;

    /*
     * ⏳ انتظر حتى ينتهي استرجاع جلسة المستخدم
     *
     * مهم جداً:
     * لا تعمل Redirect أثناء تحميل الـ Auth.
     */
    if (isAuthLoading) {
        return <Loader />;
    }

    /*
     * 🔐 انتهى التحميل ولكن لا يوجد مستخدم
     */
    if (!isAuthenticated) {
        return <Navigate to={path.Login} replace />;
    }

    /*
     * 🚫 المستخدم مسجل دخول لكنه ليس Admin/Moderator
     */
    if (!isAdminOrModerator) {
        return <Navigate to={path.Home} replace />;
    }

    /*
     * ✅ Admin / Moderator
     */
    return <>{children}</>;
};

/* =========================================================
 * ROUTES PROPS
 * ========================================================= */

interface AppRoutesProps {
    auth: AuthValues;
}

/* =========================================================
 * APP ROUTES
 * ========================================================= */

const AppRoutes: FunctionComponent<AppRoutesProps> = ({ auth }) => {
    return (
        <Routes>
            {/* =================================================
             * PUBLIC
             * ================================================= */}

            <Route path={path.Home} element={<Home />} />

            <Route path={path.Login} element={<Login />} />

            <Route path={path.Register} element={<Register />} />

            <Route path={path.About} element={<About />} />

            <Route path={path.Contact} element={<Contact />} />

            <Route
                path={path.PrivacyAndPolicy}
                element={<PrivacyAdnPolicy />}
            />

            <Route path={path.TermOfUse} element={<TermOfUse />} />

            {/* =================================================
             * ACCOUNT
             * ================================================= */}

            <Route path={path.Profile} element={<Profile />} />

            <Route path={`${path.Profile}/:id`} element={<Profile />} />

            <Route path={path.CustomerProfile} element={<CustomerProfile />} />

            <Route path={path.Favorite} element={<Favorite />} />

            <Route path={path.BlockedUsers} element={<BlockedUsers />} />

            <Route path={path.DeleteAccount} element={<DeleteAccount />} />

            {/* =================================================
             * ADS
             * ================================================= */}

            <Route
                path={path.FeaturedAdsDashboard}
                element={<FeaturedAdsDashboard />}
            />

            <Route path={path.PendingPosts} element={<PendingPosts />} />

            <Route path={path.MyAdsDashboard} element={<MyAdsDashboard />} />

            <Route
                path={path.FeaturedAds}
                element={<HomepageFeaturedSection />}
            />

            <Route
                path={path.DiscountsAndOffers}
                element={<DiscountsAndOffers />}
            />

            {/* =================================================
             * CHAT
             * ================================================= */}

            <Route path={path.Messages} element={<Messages />} />

            <Route
                path={path.userTouserMessage}
                element={
                    <ChatBoxWrapper user={auth as unknown as UserMessage} />
                }
            />

            <Route path={path.MessagesPage} element={<MessagesPage />} />

            {/* =================================================
             * JOBS
             * ================================================= */}

            <Route path={path.jobs} element={<JobsPage />} />

            <Route path={path.createJob} element={<CreateJob />} />

            <Route path={path.editJob} element={<EditJob />} />

            <Route path='/jobs/:id' element={<JobDetails />} />

            {/* =================================================
             * HELP
             * ================================================= */}

            <Route path={path.SellingHelp} element={<SellingHelp />} />

            <Route path={path.SafetyHelp} element={<SafetyHelp />} />

            <Route path={path.DisputesHelp} element={<DisputesHelp />} />

            {/* =================================================
             * PRODUCTS
             * ================================================= */}

            <Route
                path='/category/:category/:subCategory?'
                element={<Products />}
            />

            <Route
                path={`${productsPathes.postsDetails}/:postId`}
                element={<PostDetails />}
            />

            <Route
                path={`/:sellerSlug${productsPathes.postsDetails}/:category/:postSlug`}
                element={<PostDetails />}
            />

            <Route
                path={`${productsPathes.postsDetails}/:category/:brand/:postId`}
                element={<PostDetails />}
            />

            {/* =================================================
             * SEARCH
             * ================================================= */}

            <Route path='/search' element={<SearchPage />} />

            {/* =================================================
             * PAYMENT
             * ================================================= */}

            <Route path='/payment/success' element={<PaymentSuccess />} />

            {/* =================================================
             * PASSWORD
             * ================================================= */}

            <Route path='/password-recover' element={<ForgotPassword />} />

            <Route path='/reset-password/:token' element={<ResetPassword />} />

            {/* =================================================
             * ADMIN CENTER
             * ================================================= */}

            <Route
                path={path.Admin}
                element={
                    <AdminGuard>
                        <AdminLayout />
                    </AdminGuard>
                }
            >
                {/* /admin */}

                <Route index element={<AdminDashboard />} />

                {/* /admin/users */}

                <Route path='users' element={<UsersManagement />} />

                {/* /admin/posts */}

                <Route path='posts' element={<PendingPosts />} />

                {/* /admin/jobs */}

                <Route path='jobs' element={<AdminJobs />} />
                <Route path='jobs/:jobId' element={<AdminJobDetails />} />

                {/* /admin/reports */}

                <Route path='reports' element={<ReportManagement />} />

                {/* /admin/security */}

                <Route
                    path='security'
                    element={<Navigate to='audit-logs' replace />}
                />

                {/* /admin/security/blocked */}

                <Route path='security/blocked' element={<BlockedUsers />} />

                {/* /admin/security/audit-logs */}

                <Route
                    path='security/audit-logs'
                    element={<MessageAuditLogs />}
                />

                <Route path='notifications' element={<AdminNotifications />}>
                    <Route index element={<Navigate to='send' replace />} />

                    <Route path='send' element={<AdminSendNotification />} />

                    <Route path='sent' element={<AdminSentNotifications />} />
                </Route>

                {/* /admin/security/investigation */}

                <Route
                    path='security/investigation'
                    element={<MessageInvestigation />}
                />

                {/* /admin/settings */}

                <Route path='settings' element={<AdminSettings />} />
            </Route>

            {/* =================================================
             * OLD ADMIN ROUTES
             * ================================================= */}

            <Route
                path={path.WebsiteAdmins}
                element={<Navigate to={path.Admin} replace />}
            />

            <Route
                path={path.UsersManagement}
                element={<Navigate to={path.AdminUsers} replace />}
            />

            <Route
                path={path.AdminSettings}
                element={<Navigate to={path.AdminSettingsRoot} replace />}
            />

            <Route
                path={path.ReportsManagement}
                element={<Navigate to={path.AdminReports} replace />}
            />

            <Route
                path={path.MessageAuditLogs}
                element={<Navigate to={path.AdminAuditLogs} replace />}
            />

            <Route
                path={path.MessageInvestigation}
                element={
                    <Navigate to={path.AdminMessageInvestigation} replace />
                }
            />

            {/* =================================================
             * 404
             * ================================================= */}

            <Route path='*' element={<PageNotFound />} />
        </Routes>
    );
};

export default AppRoutes;
