import {Products} from "../src/interfaces/Products";

interface ProductStructuredDataProps {
	productName: string;
	productUrl: string;
	description?: string;
	image?: string;
	price: number;
	currency?: string;
	inStock?: boolean;
	category?: string;
	brand?: string;
}

// For a general product (category or type)
export const generateCategoryJsonLd = (categoryName: string, products: Products[]) => ({
	"@context": "https://schema.org",
	"@type": "CollectionPage",
	name: categoryName,
	mainEntity: {
		"@type": "ItemList",
		itemListElement: products.map((product, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: generateSingleProductJsonLd(product),
		})),
	},
});

// On an individual product page
export const generateSingleProductJsonLd = (product: Products) => {
	const finalPrice =
		product.sale && product.discount
			? product.price - (product.price * product.discount) / 100
			: product.price || 0.0;

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.product_name,
		description: product.description || "منتج مميز من سوق السخنيني",
		image: product.image_url || "https://client-qqq1.vercel.app/myLogo.png",
		category: product.category || "منتجات طازجة",
		brand: {
			"@type": "Brand",
			name: "سوق السخنيني ام الفحم",
		},
		offers: {
			"@type": "Offer",
			priceCurrency: "ILS",
			price: Number(finalPrice),
			url: `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(
				product.product_name,
			)}`,
			availability:
				product.quantity_in_stock && product.quantity_in_stock > 0
					? "https://schema.org/InStock"
					: "https://schema.org/OutOfStock",
		},
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: 4.5,
			reviewCount: 10,
		},
	};
};

// When displaying a list of products on a page
export const generateProductsItemListJsonLd = (products: Products[]) => ({
	"@context": "https://schema.org",
	"@type": "ItemList",
	itemListElement: products.map((product, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: product.product_name,
		url: `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(
			product.product_name,
		)}`,
	})),
});

export const generateDiscountsJsonLd = (products: Products[]) => ({
	"@context": "https://schema.org",
	"@type": "ItemList",
	itemListElement: products.map((product, index) => ({
		"@type": "ListItem",
		position: index + 1,
		item: generateSingleProductJsonLd(product),
	})),
});
