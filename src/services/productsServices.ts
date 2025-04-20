import axios from "axios";
import {Products} from "../interfaces/Products";

const api = `${import.meta.env.VITE_API_URL}`;

/**
 * Gets a specific product by name
 * @param productName - The name of the product to fetch
 * @returns The product data if found, or null if there's an error or product not found
 */
export const getProductByspicificName = async (product_name: string) => {
	try {
		const product = await axios.get(`${api}/products/spicific/${product_name}`, {
			headers: {Authorization: localStorage.getItem("token")},
		});
		return product.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Update product by name
 * @param productName - The name of the product to update
 * @param updatedProduct - The updated product data
 * @returns The updated product if successful, or null if there's an error
 */
export const updateProduct = async (productName: string, updatedProduct: Products) => {
	try {
		const product = await axios.put(
			`${api}/products/${productName}`,
			updatedProduct,
			{
				headers: {Authorization: localStorage.getItem("token")},
			},
		);
		return product.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Get all products from all categories
 * @returns An array of products, or an empty array if there's an error
 */
export const getAllProducts = async () => {
	try {
		const response = await axios.get(`${api}/products`);
		return response.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

/**
 * Create a new product
 * @param products - Product data to be created
 * @returns The created product if successful, or null if there's an error
 */
export async function createNewProduct(products: Products) {
	try {
		const response = await axios.post(`${api}/products`, products, {
			headers: {Authorization: localStorage.getItem("token")},
		});

		return response.data;
	} catch (error) {
		console.log(error);
		return null;
	}
}

/**
 * Get products in discount limit (6 items)
 * @returns An array of products on discount, or an empty array if there's an error
 */
export async function getProductsInDiscount() {
	try {
		const response = await axios.get(`${api}/discounts`);

		return response.data;
	} catch (error) {
		console.log(error);
		return [];
	}
}

/**
 * Delete product by name
 * @param productName - The name of the product to delete
 * @returns The deleted product if successful, or null if there's an error
 */
export async function deleteProduct(productName: string) {
	try {
		const response = await axios.delete(`${api}/products/${productName}`, {
			headers: {Authorization: localStorage.getItem("token")},
		});

		return response.data;
	} catch (error) {
		console.log(error);
		return null;
	}
}

/**
 * Get products by category name
 * @param category - The name of the category to fetch products for
 * @returns Array of products if successful, or an empty array if there's an error
 */
export const getProductsByCategory = async (category: string) => {
	try {
		const response = await axios.get(`${api}/products/${category}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching products by category:", error);
		return [];
	}
};
