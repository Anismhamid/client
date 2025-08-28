// ProductStructuredData.tsx
import {FunctionComponent} from "react";
import {Products} from "../../interfaces/Products";
import {Helmet} from "react-helmet";

interface ProductStructuredDataProps {
	product: Products;
	discountedPrice: number;
	isOutOfStock: boolean;
	category: string;
}

const ProductStructuredData: FunctionComponent<ProductStructuredDataProps> = ({
	product,
	discountedPrice,
	isOutOfStock,
	category,
}) => {
	const productSchema = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.product_name,
		description: `${product.product_name} طازج من مزارع محلية، ${category} عالي الجودة${product.discount ? ` مع خصم خاص ${product.discount}%` : ""}. تسوق الآن من سوق السخنيني واستمتع بأفضل الأسعار والجودة.`,
		image: product.image_url,
		sku: product._id || product.product_name,
		offers: {
			"@type": "Offer",
			price: discountedPrice.toString(),
			priceCurrency: "ILS",
			availability: isOutOfStock
				? "https://schema.org/OutOfStock"
				: "https://schema.org/InStock",
			priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split("T")[0],
			seller: {
				"@type": "Organization",
				name: "سوق السخنيني",
				url: window.location.origin,
			},
			itemCondition: "https://schema.org/NewCondition",
		},
		category: category,
		brand: {
			"@type": "Brand",
			name: "سوق السخنيني",
		},
	};

	return (
		<Helmet>
			<script type='application/ld+json'>{JSON.stringify(productSchema)}</script>
		</Helmet>
	);
};

export default ProductStructuredData;
