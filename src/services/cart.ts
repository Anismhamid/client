import axios from "axios";

const api = `${import.meta.env.VITE_API_URL}`;

/**
 * Adds a product to the user's cart.
 *
 * @param product_name — The name of the product.
 * @param quantity — The quantity of the product.
 * @param product_price — The price of the product.
 * @param product_image — The image URL of the product.
 * @param sale — Indicates if the product is on sale (default: false).
 * @param discount — The discount for the product (default: 0).
 * @param sellerId — The ID of the seller (required).
 * @param _id — The product's unique ID (optional).
 * @returns The updated cart data if successful, or throws an error if there's an issue.
 */
export const addToCart = async (
	userId: string,
	product_name: string,
	quantity: number,
	product_price: number,
	product_image: string,
	sale: boolean = false,
	discount: number = 0,
	sellerId: string,
) => {
	const finalPrice = quantity * (product_price - (product_price * discount) / 100);

	const cart = {
		userId,
		products: [
			{
				product_name,
				quantity,
				product_price,
				product_image,
				sale,
				discount,
				sellerId,
			},
		],
		total_price: finalPrice,
	};

	try {
		const response = await axios.post(`${api}/carts`, cart, {
			headers: {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			},
		});
		return response.data;
	} catch (error) {
		console.error("Failed to add product to cart:", error);
		throw error;
	}
};

/**
 * Get all items in the user's cart
 * @returns An array of cart items if successful, or null if there's an error
 */
export const getCartItems = async () => {
	try {
		const response = await axios.get(`${api}/carts/my-cart`, {
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		});

		return response.data;
	} catch (error) {
		console.log("Error fetching cart items:", error);
		return [];
	}
};

/**
 * Delete an item from the user's cart by product name
 * @param product_name - The name of the product to be removed from the cart
 * @returns The response data if successful, or null if there's an error
 */
export const DeleteCartItems = async (product_name: string) => {
	try {
		const response = await axios.delete(`${api}/carts/${product_name}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			},
		});

		return response.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};
