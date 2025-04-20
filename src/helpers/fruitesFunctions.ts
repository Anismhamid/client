import {showSuccess} from "../atoms/Toast";
import {addToCart} from "../services/cart";

interface Quantities {
	[product_name: string]: number;
}

/**
 * Handles the quantity adjustment for a product in the cart.
 *
 * @param {React.Dispatch<React.SetStateAction<Quantities>>} setQuantities The setter function for updating the quantities of products.
 * @param {string} action The action to perform: either `+` (increase) or `-` (decrease).
 * @param {string} product_name The name of the product (e.g., "Apple").
 */
export const handleQuantity = (
	setQuantities: React.Dispatch<React.SetStateAction<Quantities>>,
	action: "-" | "+",
	product_name: string,
) => {
	setQuantities((prevQuantities: Quantities) => {
		const currentQuantity = prevQuantities[product_name] || 1;
		const newQuantity =
			action === "-" ? Math.max(1, currentQuantity - 1) : currentQuantity + 1;
		return {...prevQuantities, [product_name]: newQuantity};
	});
};

/**
 * Updates or adds a product to the cart.
 *
 * @param {string} product_name The name of the product (e.g., "Apple").
 * @param {function} setQuantities The setter function to update the quantity of products.
 * @param {number} quantity The quantity of the product to add.
 * @param {number} product_price The price of the product.
 * @param {boolean} sale If the product is on sale, set to `true`; otherwise, `false` by default.
 * @param {string} product_image The URL of the product image.
 * @param {number} discount The discount percentage of the product (e.g., `10` for 10% off).
 */
export const handleAddToCart = async (
	setQuantities: React.Dispatch<React.SetStateAction<Quantities>>,
	product_name: string,
	quantity: number,
	product_price: number,
	product_image: string,
	sale: boolean,
	discount: number,
) => {
	try {
		const response = await addToCart(
			product_name,
			quantity,
			product_price,
			product_image,
			sale,
			discount,
		);

		if (response) {
			showSuccess(`${quantity} ק"ג ${product_name} נוסף לעגלת הקניות בהצלחה`);

			// Reset quantity for this specific product after adding it to the cart
			setQuantities((prevQuantities) => ({
				...prevQuantities,
				[product_name]: 1,
			}));
		}
	} catch (error) {
		console.log("Error adding to cart:", error);
	}
};
