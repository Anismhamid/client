import {Products} from "../src/interfaces/Products";

//🟢 For a general product (category or type)
export const generateCategoryJsonLd = (categoryName: string, products: Products[]) => ({
	"@context": "https://schema.org",
	"@type": "CollectionPage",
	name: categoryName,
	description: `منتجات معروضة ضمن تصنيف ${categoryName}`,
	mainEntity: {
		"@type": "ItemList",
		itemListOrder: "https://schema.org/ItemListOrderAscending",
		numberOfItems: products.length,
		itemListElement: products.map((product, index) => ({
			"@type": "ListItem",
			position: index + 1,
			url: `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(
				product.product_name,
			)}`,
		})),
	},
});

//🟢 On an individual product page
export const generateSingleProductJsonLd = (product: Products) => {
	const finalPrice =
		product.sale && product.discount
			? product.price - (product.price * product.discount) / 100
			: (product.price ?? 0);

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		sku: product._id,
		name: product.product_name,
		description: product.description || "منتج معروض للبيع من قبل أحد المستخدمين",
		image: product.image_url || "https://client-qqq1.vercel.app/myLogo.png",
		category: product.category || "General",
		brand: {
			"@type": "Thing",
			name: "بيع وشراء",
		},
		offers: {
			"@type": "Offer",
			priceCurrency: "ILS",
			price: Number(finalPrice.toFixed(2)),
			url: `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(
				product.product_name,
			)}`,
			availability:
				product.quantity_in_stock && product.quantity_in_stock > 0
					? "https://schema.org/InStock"
					: "https://schema.org/OutOfStock",

			seller: {
				"@type": "Person",
				name: product.seller?.name || "مستخدم مسجل",
				url: `https://client-qqq1.vercel.app/user/${product.seller?._id}`,
			},
		},
	};
};

// When displaying a list of products on a page
export const generateProductsItemListJsonLd = (products: Products[]) => ({
	"@context": "https://schema.org",
	"@type": "ItemList",
	itemListElement: products.map((product, index) => ({
		"@type": "ListItem",
		"@id": `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(
			product.product_name,
		)}#product`,
		position: index + 1,
		name: product.product_name,
		url: `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(
			product.product_name,
		)}`,
	})),
});

export const generateDiscountsJsonLd = (products: Products[]) => ({
	"@context": "https://schema.org",
	"@graph": products.map((product) => {
		const discountedPrice =
			product.price && product.discount
				? product.price - (product.price * product.discount) / 100
				: (product.price ?? 0);

		return {
			"@type": "Product",
			"@id": `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(
				product.product_name,
			)}#product`,
			name: product.product_name,
			description: product.description || "منتج معروض للبيع من قبل مستخدم",
			image: product.image_url || "https://client-qqq1.vercel.app/myLogo.png",
			category: product.category || "General",
			brand: {
				"@type": "Brand",
				name: "بيع وشراء",
			},
			offers: {
				"@type": "Offer",
				priceCurrency: "ILS",
				price: Number(discountedPrice.toFixed(2)),
				url: `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(
					product.product_name,
				)}`,
				availability:
					product.quantity_in_stock && product.quantity_in_stock > 0
						? "https://schema.org/InStock"
						: "https://schema.org/OutOfStock",
				seller: {
					"@type": "Person",
					name: product.seller?.name || "مستخدم مسجل",
					url: `https://client-qqq1.vercel.app/user/${product.seller?._id}`,
				},
			},
		};
	}),
});
