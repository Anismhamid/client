export const productsPathes = {
    // Vehicles
    cars: '/category/Cars',
    motorcycles: '/category/Motorcycles',
    bikes: '/category/Bikes',
    trucks: '/category/Trucks',
    electricVehicles: '/category/ElectricVehicles',

    house: '/category/House',
    garden: '/category/Garden',
    baby: '/category/Baby',
    electronics: '/category/Electronics',
    kids: '/category/Kids',
    beauty: '/category/Beauty',
    cleaning: '/category/Cleaning',
    health: '/category/Health',
    watches: '/category/Watches',
    WomenClothes: '/category/WomenClothes',
    MenClothes: '/category/MenClothes',
    WomenBags: '/category/WomenBags',

    blog: '/blog',
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

    // Help (SEO gold)
    SellingHelp = '/help/selling',
    SafetyHelp = '/help/safety',
    DisputesHelp = '/help/disputes',

    // User
    CustomerProfile = '/users/customer/:slug',
    UsersManagement = '/users-management',
    WebSiteAdmins = '/admins',
    Messages = '/messages',
    userTouserMessage = 'chat',
    MessagesPage = 'messages/chat',

    // Admin
    AdminSettings = '/admin-settings',

    // Pages
    PrivacyAndPolicy = '/privacy-and-policy',
    TermOfUse = '/term-of-use',
    Contact = '/contact',
    About = '/about',

    // Ecommerce
    Cart = '/cart',
    Favorite = '/favorites',
    DiscountsAndOffers = '/discounts-and-offers',

    // Catch-all
    Png = '*',
}
