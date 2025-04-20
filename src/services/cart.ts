import axios from "axios";

const api = `${import.meta.env.VITE_API_URL}`;

/**
 * Adds a product to the user's cart
 * @param product_name - The name of the product to add to the cart
 * @param quantity - The quantity of the product
 * @param product_price - The price of the product
 * @param product_image - The image URL of the product
 * @param sale - Indicates if the product is on sale is false by defualt
 * @param discount - The discount for the product (defaults to 0 if not provided)
 * @returns The updated cart data if successful, or an error message if there's an issue
 */
export const addToCart = async (
	product_name: string,
	quantity: number,
	product_price: number,
	product_image: string,
	sale: boolean,
	discount: number,
) => {
	try {
		const product = {
			product_name,
			quantity,
			product_price,
			product_image,
			sale,
			discount,
		};

		const response = await axios.post(`${api}/carts`, product, {
			headers: {Authorization: localStorage.getItem("token")},
		});
		return response.data;
	} catch (error) {
		console.log(error);
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
				Authorization: localStorage.getItem("token"),
			},
		});

		return response.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};
