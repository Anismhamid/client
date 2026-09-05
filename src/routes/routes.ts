export const productsPathes = {
    // Vehicles
    cars: '/category/Cars',
    motorcycles: '/category/Motorcycles',
    bikes: '/category/Bikes',
    trucks: '/category/Trucks',
    electricVehicles: '/category/ElectricVehicles',

    // Products
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

    // Other
    art: '/category/Art',
    gaming: '/category/Gaming',
    realEstate: '/category/RealEstate',
    pets: '/category/Pets',
    furniture: '/category/Furniture',

    brand: '/brands/:brand',
    categories: '/categories',

    // Post details
    postsDetails: '/posts',
    // will add other products here if nedded...
};

export enum path {
    // Main
    Home = '/',
    Login = '/login',
    Register = '/register',
    Profile = '/profile',
    FeaturedAdsDashboard = '/adsDashboard',
    ForgotPassword = '/password-recover',
    ResetPassword = '/reset-password/:token',
    ReportsManagement = '/reports-management',
    MessageAuditLogs = '/message-audit-logs',
    BlockedUsers = '/blocked-users',

    Search = '/search',

    // Help (SEO gold)
    SellingHelp = '/help/selling',
    SafetyHelp = '/help/safety',
    DisputesHelp = '/help/disputes',

    // User
    CustomerProfile = '/users/customer/:slug',
    UsersManagement = '/users-management',
    WebsiteAdmins = '/statistics-panel',
    Messages = '/messages',
    userTouserMessage = 'chat',
    MessagesPage = 'messages/chat',
    MyAdsDashboard = '/my-ads-dashboard',
    FeaturedAds = '/featured-ads',

    // jobs routes
    jobs = '/jobs',
    createJob = '/jobs/create',
    editJob = '/jobs/:id/edit',

    // Admin
    AdminSettings = '/admin-settings',

    // Pages
    PrivacyAndPolicy = '/privacy-and-policy',
    TermOfUse = '/term-of-use',
    Contact = '/contact',
    About = '/about',
    DeleteAccount = '/delete-account',
    MessageInvestigation = '/admin/message-investigation',

    // Ecommerce
    Favorite = '/favorites',
    DiscountsAndOffers = '/discounts-and-offers',

    // Catch-all
    Png = '*',
}
