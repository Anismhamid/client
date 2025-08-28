import {FunctionComponent} from "react";
import {Helmet} from "react-helmet";
import {Products} from "../../interfaces/Products";

interface ProductDiscountStructuredDataProps {
	products: Products[];
}

const ProductDiscountStructuredData: FunctionComponent<ProductDiscountStructuredDataProps> = ({
	products,
}) => {
	return (
		<Helmet>
			<script type='application/ld+json'>
				{`
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "منتجات سوق السخنيني",
            "description": "قائمة بمنتجات سوق السخنيني من فواكه وخضروات طازجة",
            "numberOfItems": "${products.length}",
            "itemListElement": [
              ${products
					.map((product, index) => {
						const discountedPrice =
							product.price - (product.price * product.discount) / 100;
						return `
                {
                  "@type": "ListItem",
                  "position": "${index + 1}",
                  "item": {
                    "@type": "Product",
                    "name": "${product.product_name}",
                    "description": "${product.product_name} طازج وبجودة عالية",
                    "image": "${product.image_url}",
                    "category": "${product.category}",
                    "offers": {
                      "@type": "Offer",
                      "price": "${discountedPrice}",
                      "priceCurrency": "ILS",
                      "priceValidUntil": "${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}",
                      "availability": "https://schema.org/${product.quantity_in_stock > 0 ? "InStock" : "OutOfStock"}",
                      "seller": {
                        "@type": "Organization",
                        "name": "سوق السخنيني"
                      }
                    }
                  }
                }`;
					})
					.join(",")}
            ]
          }
        `}
			</script>
		</Helmet>
	);
};

export default ProductDiscountStructuredData;
