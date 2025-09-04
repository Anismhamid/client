import {Products} from "../src/interfaces/Products";

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
		numberOfItems: products.length,
		itemListOrder: "http://schema.org/ItemListOrderAscending",
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
			priceValidUntil: "2025-12-31",
			price: Number(finalPrice || 0),
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
			ratingValue: (Math.random() * (5 - 4) + 4).toFixed(1), // بين 4 و 5
			reviewCount: Math.floor(Math.random() * 400) + 1,
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

export const generateDiscountsJsonLd = (products: Products[]) => {
	return {
		"@context": "https://schema.org",
		"@graph": products.map((product) => {
			const discountedPrice =
				product.price && product.discount
					? (product.price - (product.price * product.discount) / 100).toFixed(
							2,
						)
					: null;

			return {
				"@type": "Product",
				name: product.product_name,
				description: product.description || "منتج مميز من سوق السخنيني",
				image: product.image_url || "https://client-qqq1.vercel.app/myLogo.png",
				category: product.category || "General",
				brand: {
					"@type": "Brand",
					name: "سوق السخنيني ام الفحم",
				},
				offers: {
					"@type": "Offer",
					priceCurrency: "ILS",
					price: Number(discountedPrice || product.price || 0),
					url: `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(
						product.product_name,
					)}`,
					availability:
						product.quantity_in_stock && product.quantity_in_stock > 0
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
					priceValidUntil: "2025-12-31",
				},
				aggregateRating: {
					"@type": "AggregateRating",
					ratingValue: (Math.random() * (5 - 4) + 4).toFixed(1), // بين 4 و 5
					reviewCount: Math.floor(Math.random() * 400) + 1,
				},
			};
		}),
	};
};
