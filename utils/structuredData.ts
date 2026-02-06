import {Products} from "../src/interfaces/Products";

const getProductUrl = (product: Products) =>
	`https://client-qqq1.vercel.app/product/${product.category}/${product.brand}/${product._id}`;

// For a general product (category or type)
export const generateCategoryJsonLd = (
	categoryName: string,
	products: Products[] = [],
) => ({
	"@context": "https://schema.org",
	"@type": "CollectionPage",
	name: categoryName,
	description: `منشورات معروضة للبيع ضمن تصنيف ${categoryName}`,
	mainEntity: {
		"@type": "ItemList",
		itemListOrder: "https://schema.org/ItemListOrderAscending",
		numberOfItems: products.length,
		itemListElement: products.map((product, index) => ({
			"@type": "ListItem",
			position: index + 1,
			url: getProductUrl(product),
		})),
	},
});

// On an individual product page
export const generateSingleProductJsonLd = (product: Products) => {
	const finalPrice =
		product.sale && product.discount
			? product.price - (product.price * product.discount) / 100
			: (product.price ?? 0);

	const productUrl = getProductUrl(product);

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		"@id": `${productUrl}#product`,
		sku: product._id,
		name: product.product_name,
		description: product.description || "منتج معروض للبيع على موقع صفقة",
		image: product.image?.url || "https://client-qqq1.vercel.app/myLogo.png",
		category: product.category,
		brand: {
			"@type": "Brand",
			name: product.brand || "غير محدد",
		},
		offers: {
			"@type": "Offer",
			url: productUrl,
			priceCurrency: "ILS",
			price: Number(finalPrice.toFixed(2)),
			itemCondition: "https://schema.org/UsedCondition",
			availability:
				product.in_stock && product.in_stock === true
					? "https://schema.org/InStock"
					: "https://schema.org/OutOfStock",
			hasMerchantReturnPolicy: {
				"@type": "MerchantReturnPolicy",
				returnPolicyCategory: "https://schema.org/DynamicReturnPolicy",
				seller: {
					"@type": "Person",
					name: product.seller?.name || "مستخدم مسجل",
					url: product.seller.slug
						? `https://client-qqq1.vercel.app/user/customer/${product.seller.slug}`
						: undefined,
				},
			},

			priceValidUntil: "2026-12-31",
			shippingDetails: {
				"@type": "OfferShippingDetails",
				shippingRate: {
					"@type": "MonetaryAmount",
					value: 0,
					currency: "ILS",
				},
			},
			serviceArea: {
				"@type": "GeoCircle",
				itemOffered: {
					"@type": "Service",
					name: "Marketplace",
				},
				geoMidpoint: {
					"@type": "GeoCoordinates",
					latitude: "32.5186",
					longitude: "35.1524",
				},
				geoRadius: "50000",
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
		"@id": `${getProductUrl(product)}#product`,
		position: index + 1,
		name: product.product_name,
		url: getProductUrl(product),
		serviceArea: {
			"@type": "GeoCircle",
			itemOffered: {
				"@type": "Service",
				name: "Marketplace",
			},
			geoMidpoint: {
				"@type": "GeoCoordinates",
				latitude: "32.5186",
				longitude: "35.1524",
			},
			geoRadius: "50000",
		},
	})),
});

// export const generateDiscountsJsonLd = (products: Products[]) => ({
// 	"@context": "https://schema.org",
// 	"@graph": products.map((product) => {
// 		const discountedPrice =
// 			product.price && product.discount
// 				? product.price - (product.price * product.discount) / 100
// 				: (product.price ?? 0);

// 		return {
// 			"@type": "Product",
// 			"@id": `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(
// 				product.product_name,
// 			)}#product`,
// 			name: product.product_name,
// 			description: product.description || "منتج معروض للبيع من قبل مستخدم",
// 			image: product.image.url || "https://client-qqq1.vercel.app/myLogo.png",
// 			category: product.category || "General",
// 			brand: {
// 				"@type": "Brand",
// 				name: "بيع وشراء",
// 			},
// 			offers: {
// 				"@type": "Offer",
// 				hasMerchantReturnPolicy: {
// 					"@type": "MerchantReturnPolicy",
// 					returnPolicyCategory: "https://schema.org/DynamicReturnPolicy",
// 				},
// 				shippingDetails: {
// 					"@type": "OfferShippingDetails",
// 					shippingRate: {
// 						"@type": "MonetaryAmount",
// 						value: 0,
// 						currency: "ILS",
// 					},
// 				},
// 				priceCurrency: "ILS",
// 				price: Number(discountedPrice.toFixed(2)),
// 				url: `https://client-qqq1.vercel.app/product-details/${encodeURIComponent(
// 					product.product_name,
// 				)}`,
// 				availability:
// 					product.in_stock && product.in_stock === true
// 						? "https://schema.org/InStock"
// 						: "https://schema.org/OutOfStock",
// 				seller: {
// 					"@type": "Person",
// 					name: product.seller?.name || "مستخدم مسجل",
// 					url: product.seller?.sellerId
// 						? `https://client-qqq1.vercel.app/user/customer/${product.seller.slug}`
// 						: `https://client-qqq1.vercel.app/`,
// 				},
// 			},
// 		};
// 	}),
// });

export const generateDiscountsJsonLd = (products: Products[]) => ({
	"@context": "https://schema.org",
	"@graph": products.map((product) => generateSingleProductJsonLd(product)), // ✅ إعادة استخدام الدالة الأساسية لضمان التطابق 100%
});
