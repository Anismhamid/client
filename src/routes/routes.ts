export const productsPathes = {
	// Vehicles
	cars: "/category/cars",
	motorcycles: "/category/motorcycles",
	bikes: "/category/bikes",
	trucks: "/category/trucks",
	electricVehicles: "/category/electric-vehicles",

	// Other products (optional)
	fruits: "/category/fruit",
	vegetable: "/category/vegetable",
	fish: "/category/fish",
	dairy: "/category/dairy",
	meat: "/category/meat",
	spices: "/category/spices",
	bakery: "/category/bakery",
	beverages: "/category/beverages",
	frozen: "/category/frozen",
	snacks: "/category/snacks",
	baby: "/category/baby",
	alcohol: "/category/alcohol",
	cleaning: "/category/cleaning",
	pastaRice: "/category/pasta-and-Rice",
	house: "/category/house",
	health: "/category/health",
	watches: "/category/watches",
	womenClothes: "/category/women-clothes",
	womenBags: "/category/women-bags",
	cigarettes: "/category/cigarettes",

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
	CustomerProfile = "/users/customer/:slug",
	UsersManagement = "/usersManagement",
	WebSiteAdmins = "/admins",
	Messages = "/messages",
	DeliveryPage = "/delivery",

	// Vehicles Pages
	Cars = "/category/cars",
	Motorcycles = "/category/motorcycles",
	Bikes = "/category/bikes",
	Trucks = "/category/trucks",
	ElectricVehicles = "/category/electric-vehicles",

	// Other products (optional)
	Fruits = "/fruits",
	Vegetable = "/vegetable",
	AdminSettings = "/adminSettings",

	// Orders & Checkout
	MyOrders = "/all-orders",
	OrderDetails = "/orderDetails/:orderNumber",
	Checkout = "/checkout",
	Receipt = "/receipt",
	CompleteOrders = "/complete-orders",
	AllTheOrders = "/all-orders",

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

