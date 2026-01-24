import axios from "axios";
import {Products} from "../interfaces/Products";

const api = `${import.meta.env.VITE_API_URL}`;

/**
 * Gets a specific product by name
 * @param productName - The name of the product to fetch
 * @returns The product data if found, or null if there's an error or product not found
 */
export const getProductById = async (product_id: string) => {
	try {
		const product = await axios.get(`${api}/products/spicific/${product_id}`, {
			headers: {Authorization: localStorage.getItem("token")},
		});
		return product.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Update product by id
 * @param productId - The id of the product to update
 * @param updatedProduct - The updated product data
 * @returns The updated product if successful, or null if there's an error
 */
export const updateProduct = async (productId: string, updatedProduct: Products) => {
	try {
		const product = await axios.put(`${api}/products/${productId}`, updatedProduct, {
			headers: {
				Authorization: localStorage.getItem("token"),
				"Content-Type": "application/json",
			},
		});
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
		if (Array.isArray(response.data)) return response.data;
		return [];
	} catch (error: any) {
		console.error(error);
		return [];
	}
};

/**
 * Create a new product
 * @param products - Product data to be created
 * @returns The created product if successful, or null if there's an error
 */
export async function createNewProduct(product: Products) {
	try {
		const response = await axios.post(`${api}/products`, product, {
			headers: {
				Authorization: localStorage.getItem("token"),
				"Content-Type": "application/json",
			},
		});

		return response.data;
	} catch (error) {
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
		return [];
	}
};

export const getCustomerProfileProductsBySlug = async (
	slug: string,
): Promise<Products[]> => {
	try {
		const res = await axios.get(`${api}/products/customer/${slug}`);
		return res.data;
	} catch (err) {
		return [];
	}
};

export const toggleLike = async (productId: string) => {
	const token = localStorage.getItem("token");
	const res = await axios.patch(
		`${api}/products/${productId}/like`,
		{},
		{
			headers: {Authorization: token},
		},
	);
	return res.data; // { liked: true/false, totalLikes: number }
};
