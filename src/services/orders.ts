import axios from "axios";
import {Order} from "../interfaces/Order";

const api = `${import.meta.env.VITE_API_URL}/orders`;

/**
 * Get all orders for a specific user by user ID
 * @param userId - The unique identifier of the user
 * @returns The user's orders if successful, or empty array if there's an error
 */
export const getUserOrders = async (userId: string) => {
	try {
		const orders = await axios.get(`${api}/${userId}`, {
			headers: {Authorization: localStorage.getItem("token")},
		});
		return orders.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

/**
 * Get the details of an order by its order number
 * @param orderNumber - The unique identifier for the order
 * @returns The order details if successful, or empty array if there's an error
 */
export const getOrderByOrderNumber = async (orderNumber: string) => {
	try {
		const response = await axios.get(`${api}/details/${orderNumber}`, {
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
 * Get all orders for admin users
 * @returns An array of orders if successful, or empty array if there's an error
 */
export const getAllOrders = async () => {
	try {
		const response = await axios.get(api, {
			headers: {Authorization: localStorage.getItem("token")},
		});
		return response.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

/**
 * Post a new order to the API
 * @param order - The order data to be submitted, including products and any other necessary information
 * @returns The order confirmation data if successful, or null if there's an error
 */
export const postOrder = async (order: Order) => {
	try {
		const orders = await axios.post(
			api,
			{...order,
			},
			{
				headers: {Authorization: localStorage.getItem("token")},
			},
		);
		return orders.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Update the status of an order by order number
 * @param status - The new status for the order
 * @param orderNumber - The unique identifier of the order
 * @returns The updated order data if successful, or null if there's an error
 */
export const patchStatus = async (status: string, orderNumber: string) => {
	try {
		const patchStatus = await axios.patch(
			`${api}/${orderNumber}`,
			{status},
			{headers: {Authorization: localStorage.getItem("token")}},
		);
		return patchStatus.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};
