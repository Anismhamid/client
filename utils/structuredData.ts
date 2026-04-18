import { Posts } from '../src/interfaces/Posts';

const getPostUrl = (post: Posts) =>
    `https://client-qqq1.vercel.app/product/${post.category}/${post.brand}/${post._id}`;

// For a general product (category or type)
export const generateCategoryJsonLd = (
    categoryName: string,
    posts: Posts[] = [],
) => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    description: `منشورات معروضة للبيع ضمن تصنيف ${categoryName}`,
    mainEntity: {
        '@type': 'ItemList',
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        numberOfItems: posts.length,
        itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: getPostUrl(post),
        })),
    },
});

// On an individual product page
export const generateSingleProductJsonLd = (post: Posts) => {
    const finalPrice =
        post.sale && post.discount
            ? post.price - (post.price * post.discount) / 100
            : (post.price ?? 0);

    const postUrl = getPostUrl(post);

    return {
        '@context': 'https://schema.org',
        '@type': 'post',
        '@id': `${postUrl}#post`,
        sku: post._id,
        name: post.product_name,
        description: post.description || 'منتج معروض للبيع على موقع صفقة',
        image: post.image?.url || 'https://client-qqq1.vercel.app/myLogo.png',
        category: post.category,
        brand: {
            '@type': 'Brand',
            name: post.brand || 'غير محدد',
        },
        offers: {
            '@type': 'Offer',
            url: postUrl,
            priceCurrency: 'ILS',
            price: Number(finalPrice.toFixed(2)),
            itemCondition: 'https://schema.org/UsedCondition',
            availability:
                post.in_stock && post.in_stock === true
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
            hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                returnPolicyCategory: 'https://schema.org/DynamicReturnPolicy',
                seller: {
                    '@type': 'Person',
                    name: post.seller?.name || 'مستخدم مسجل',
                    url: post.seller?.slug
                        ? `https://client-qqq1.vercel.app/user/customer/${post.seller.slug}`
                        : undefined,
                },
            },

            priceValidUntil: '2026-12-31',
            shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: {
                    '@type': 'MonetaryAmount',
                    value: 0,
                    currency: 'ILS',
                },
            },
            serviceArea: {
                '@type': 'GeoCircle',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Marketplace',
                },
                geoMidpoint: {
                    '@type': 'GeoCoordinates',
                    latitude: '32.5186',
                    longitude: '35.1524',
                },
                geoRadius: '50000',
            },
        },
    };
};

// When displaying a list of products on a page
export const generateProductsItemListJsonLd = (posts: Posts[]) => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        '@id': `${getPostUrl(post)}#product`,
        position: index + 1,
        name: post.product_name,
        url: getPostUrl(post),
        serviceArea: {
            '@type': 'GeoCircle',
            itemOffered: {
                '@type': 'Service',
                name: 'Marketplace',
            },
            geoMidpoint: {
                '@type': 'GeoCoordinates',
                latitude: '32.5186',
                longitude: '35.1524',
            },
            geoRadius: '50000',
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

export const generateDiscountsJsonLd = (posts: Posts[]) => ({
    '@context': 'https://schema.org',
    '@graph': posts.map((post) => generateSingleProductJsonLd(post)), // ✅ إعادة استخدام الدالة الأساسية لضمان التطابق 100%
});
