export const productsPathes = {
	// Vehicles
	cars: "/category/cars",
	motorcycles: "/category/motorcycles",
	bikes: "/category/bikes",
	trucks: "/category/trucks",
	electricVehicles: "/category/electric-vehicles",

	house: "/category/house",
	garden: "/category/garden",
	baby: "/category/baby",
	electronics: "/category/electronics",
	kids: "/category/kids",
	beauty: "/category/beauty",
	cleaning: "/category/cleaning",
	health: "/category/health",
	watches: "/category/watches",
	womenClothes: "/category/women-clothes",
	menClothes: "/category/men-clothes",
	womenBags: "/category/women-bags",

	blog: "/blog",
	brand: "/brands/:brand",
	categories: "/categories",

	// Product details
	productDetails: "/products",
	// will add other products here if nedded...
};

export enum path {
	// Main
	Home = "/",
	Login = "/login",
	Register = "/register",
	Profile = "/profile",

	// Help (SEO gold)
	SellingHelp = "/help/selling",
	SafetyHelp = "/help/safety",
	DisputesHelp = "/help/disputes",

	// User
	CustomerProfile = "/users/customer/:slug",
	UsersManagement = "/users-management",
	WebSiteAdmins = "/admins",
	Messages = "/messages",
	userTouserMessage = "chat",
	MessagesPage = "messages/chat",

	// Admin
	AdminSettings = "/admin-settings",

	// Pages
	PrivacyAndPolicy = "/privacy-and-policy",
	TermOfUse = "/term-of-use",
	Contact = "/contact",
	About = "/about",

	// Ecommerce
	Cart = "/cart",
	Favorite = "/favorites",
	DiscountsAndOffers = "/discounts-and-offers",

	// Catch-all
	Png = "*",
}
