export const productsPathes = {
    // =========================================================
    // Vehicles
    // =========================================================

    cars: '/category/Cars',
    motorcycles: '/category/Motorcycles',
    bikes: '/category/Bikes',
    trucks: '/category/Trucks',
    electricVehicles: '/category/ElectricVehicles',

    // =========================================================
    // Products
    // =========================================================

    house: '/category/House',
    garden: '/category/Garden',
    electronics: '/category/Electronics',
    baby: '/category/Baby',
    kids: '/category/Kids',
    beauty: '/category/Beauty',
    cleaning: '/category/Cleaning',
    health: '/category/Health',
    watches: '/category/Watches',

    WomenClothes: '/category/WomenClothes',
    MenClothes: '/category/MenClothes',

    WomenBags: '/category/WomenBags',

    Camera: '/category/cameras',
    Books: '/category/books',
    MusicalInstruments: '/category/musicalInstruments',
    ConstructionEquipment: '/category/constructionEquipment',
    IndustrialEquipment: '/category/industrialEquipment',
    WeldingEquipment: '/category/weldingEquipment',
    OfficeEquipment: '/category/officeEquipment',
    Services: '/category/Services',

    // =========================================================
    // Other
    // =========================================================

    art: '/category/Art',
    gaming: '/category/Gaming',
    realEstate: '/category/RealEstate',
    pets: '/category/Pets',
    furniture: '/category/Furniture',

    // =========================================================
    // Categories / Brands
    // =========================================================

    brand: '/brands/:brand',
    categories: '/categories',

    // =========================================================
    // Post details
    // =========================================================

    postsDetails: '/posts',
} as const;

/**
 * ============================================================
 * Application Routes
 * ============================================================
 *
 * جميع مسارات التطبيق في مكان واحد.
 *
 * ملاحظة:
 * - Admin أصبح له مركز إدارة موحّد تحت /admin
 * - أبقينا المسارات القديمة للإدارة حتى لا تنكسر الروابط
 *   الموجودة حالياً في المشروع.
 *
 * ============================================================
 */

export enum path {
    // =========================================================
    // Main
    // =========================================================

    Home = '/',
    Login = '/login',
    Register = '/register',

    Profile = '/profile',
    Notifications = '/notifications',

    FeaturedAdsDashboard = '/adsDashboard',

    ForgotPassword = '/password-recover',
    ResetPassword = '/reset-password/:token',

    Search = '/search',

    // =========================================================
    // Help / SEO
    // =========================================================

    SellingHelp = '/help/selling',
    SafetyHelp = '/help/safety',
    DisputesHelp = '/help/disputes',

    // =========================================================
    // User
    // =========================================================

    CustomerProfile = '/users/customer/:slug',

    Messages = '/messages',

    /**
     * Chat between two users.
     *
     * مثال:
     * /chat/USER_ID
     */
    userTouserMessage = 'chat',

    MessagesPage = '/messages/chat',

    MyAdsDashboard = '/my-ads-dashboard',

    FeaturedAds = '/featured-ads',

    Favorite = '/favorites',

    DiscountsAndOffers = '/discounts-and-offers',

    BlockedUsers = '/blocked-users',

    DeleteAccount = '/delete-account',

    // =========================================================
    // Jobs
    // =========================================================

    jobs = '/jobs',

    createJob = '/jobs/create',

    editJob = '/jobs/:id/edit',

    // =========================================================
    // =========================================================
    // ADMIN CENTER
    // =========================================================
    // =========================================================

    /**
     * Admin root.
     *
     * /admin
     *
     * Dashboard الرئيسي للإدارة.
     */
    Admin = '/admin',

    // ---------------------------------------------------------
    // Users
    // ---------------------------------------------------------

    AdminUsers = '/admin/users',

    AdminUserDetails = '/admin/users/:userId',

    // ---------------------------------------------------------
    // Posts
    // ---------------------------------------------------------

    AdminPosts = '/admin/posts',

    // ---------------------------------------------------------
    // Reports
    // ---------------------------------------------------------

    AdminReports = '/admin/reports',

    // ---------------------------------------------------------
    // Security
    // ---------------------------------------------------------

    AdminSecurity = '/admin/security',

    AdminBlockedUsers = '/admin/security/blocked',

    AdminAuditLogs = '/admin/security/audit-logs',

    AdminMessageInvestigation = '/admin/security/investigation',

    // ---------------------------------------------------------
    // Notifications
    // ---------------------------------------------------------

    AdminNotifications = '/admin/notifications',

    AdminSendNotification = '/admin/notifications/send',

    AdminSentNotifications = '/admin/notifications/sent',

    AdminNotificationTemplates = '/admin/notifications/templates',

    // ---------------------------------------------------------
    // Jobs Administration
    // ---------------------------------------------------------

    AdminJobs = '/admin/jobs',

    AdminJobDetails = '/admin/jobs/:jobId',

    // ---------------------------------------------------------
    // Admin Settings
    // ---------------------------------------------------------

    AdminSettingsRoot = '/admin/settings',

    AdminRoles = '/admin/settings/roles',

    AdminPermissions = '/admin/settings/permissions',

    // =========================================================
    // Pages
    // =========================================================

    PrivacyAndPolicy = '/privacy-and-policy',

    TermOfUse = '/term-of-use',

    Contact = '/contact',

    About = '/about',

    // =========================================================
    // Legacy Admin Routes
    // =========================================================
    //
    // هذه المسارات موجودة فقط للتوافق مع الكود القديم.
    //
    // AppRoutes سيعمل Redirect منها إلى Admin Center.
    //
    // =========================================================

    /**
     * القديم:
     * /statistics-panel
     *
     * الجديد:
     * /admin
     */
    WebsiteAdmins = '/statistics-panel',

    /**
     * القديم:
     * /users-management
     *
     * الجديد:
     * /admin/users
     */
    UsersManagement = '/users-management',

    /**
     * القديم:
     * /reports-management
     *
     * الجديد:
     * /admin/reports
     */
    ReportsManagement = '/reports-management',

    /**
     * القديم:
     * /message-audit-logs
     *
     * الجديد:
     * /admin/security/audit-logs
     */
    MessageAuditLogs = '/message-audit-logs',

    /**
     * القديم:
     * /admin-settings
     *
     * الجديد:
     * /admin/settings
     */
    AdminSettings = '/admin-settings',

    /**
     * القديم:
     * /admin/message-investigation
     *
     * الجديد:
     * /admin/security/investigation
     */
    MessageInvestigation = '/admin/message-investigation',

    /**
     * القديم:
     * /blocked-users
     *
     * الجديد:
     * /admin/security/blocked
     *
     * ملاحظة:
     * هذا route ليس Admin-only حالياً لأنه صفحة مستخدم
     * أيضاً. لذلك أبقيناه كما هو.
     */
    // BlockedUsers موجود أعلاه.

    /**
     * القديم:
     * /isPending
     */
    PendingPosts = '/isPending',

    // =========================================================
    // Other
    // =========================================================

    // Payment
    PaymentSuccess = '/payment/success',

    // =========================================================
    // Catch all
    // =========================================================

    Png = '*',
}
