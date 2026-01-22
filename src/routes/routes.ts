export const productsPathes = {
	// Vehicles
	cars: "/category/cars",
	motorcycles: "/category/motorcycles",
	bikes: "/category/bikes",
	trucks: "/category/trucks",
	electricVehicles: "/category/electric-vehicles",

	// Other products (optional)
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

	// Product details
	productDetails: "/product-details",
	// will add other products here if nedded...
};

export enum path {
	// Main
	Home = "/",
	Login = "/login",
	Register = "/register",
	Profile = "/profile",
	SellingHelp = "/help/selling",
	SafetyHelp = "/help/safety",
	DisputesHelp = "/help/disputes",
	Favorite = "/favorites",
	DicountAndOfers = "/dicounts-and-offers",
	CustomerProfile = "/users/customer/:slug",
	myCustomerProfile = "/users/customer",
	UsersManagement = "/usersManagement",
	WebSiteAdmins = "/admins",
	Messages = "/messages",

	// Vehicles Pages
	Cars = "/category/cars",
	Motorcycles = "/category/motorcycles",
	Bikes = "/category/bikes",
	Trucks = "/category/trucks",
	ElectricVehicles = "/category/electric-vehicles",

	// Other products
	AdminSettings = "/adminSettings",

	// Other Pages
	PrivacyAndPolicy = "/Privacy-and-policy",
	CompleteProfile = "/completeProfile",
	TermOfUse = "/term-of-use",
	Contact = "/contact",
	About = "/about",
	Cart = "/cart",

	// Catch-all
	Png = "*",
}
