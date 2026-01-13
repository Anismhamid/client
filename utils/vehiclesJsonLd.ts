import { Products } from "../src/interfaces/Products";

// Helper: Single product offer
const generateOffer = (product: Products) => ({
	"@type": "Offer",
	priceCurrency: "ILS",
	price: product.price ?? 0,
	url: `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(product.product_name)}`,
	availability:
		product.quantity_in_stock && product.quantity_in_stock > 0
			? "https://schema.org/InStock"
			: "https://schema.org/OutOfStock",
	seller: {
		"@type": "Person",
		name: product.seller?.name || "مستخدم مسجل",
		url: `https://client-qqq1.vercel.app/user/${product.seller?._id}`,
	},
});

// 🔹 Generate CollectionPage JSON-LD
export const generateVehicleCategoryJsonLd = (
	categoryName: string,
	products: Products[],
) => ({
	"@context": "https://schema.org",
	"@type": "CollectionPage",
	name: categoryName,
	description: `منتجات ضمن تصنيف ${categoryName} للبيع على المنصة`,
	mainEntity: {
		"@type": "ItemList",
		itemListOrder: "https://schema.org/ItemListOrderAscending",
		numberOfItems: products.length,
		itemListElement: products.map((product, index) => ({
			"@type": "ListItem",
			position: index + 1,
			url: `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(product.product_name)}`,
		})),
	},
});

// Generate Single Product JSON-LD
export const generateSingleVehicleJsonLd = (
	product: Products,
	type: "Car" | "Motorcycle" | "Truck" | "Bike" | "ElectricVehicle" = "Car",
) => ({
	"@context": "https://schema.org",
	"@type": type,
	name: product.product_name,
	description: product.description || "مركبة معروضة للبيع من قبل أحد المستخدمين",
	image: product.image_url || "https://client-qqq1.vercel.app/myLogo.png",
	brand: product.brand || "غير محدد",
	modelDate: product.year || 2026,
	fuelType: product.fuel || "غير محدد",
	mileageFromOdometer: product.mileage ? `${product.mileage} km` : "غير محدد",
	category: product.category || "مركبات",
	offers: generateOffer(product),
});

// 🔹 Example category names
export const vehicleCategories = [
	"سيارات",
	"دراجات نارية",
	"دراجات هوائية",
	"شاحنات",
	"مركبات كهربائية",
];
