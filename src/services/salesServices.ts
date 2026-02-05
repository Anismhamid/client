import axios from "axios";

const api = `${import.meta.env.VITE_API_URL}`;

export interface SaleData {
	productId: string;
	productName: string;
	quantity: number;
	totalPrice: number;
	commission: number;
	date: string;
	buyerId: string;
	sellerId: string;
}

/**
 * Get all sales data
 */
export const getAllSales = async (): Promise<SaleData[]> => {
	try {
		const response = await axios.get(`${api}/sales`, {
			headers: {Authorization: localStorage.getItem("token")},
		});
		return response.data || [];
	} catch (error) {
		console.error("Error fetching sales:", error);
		return [];
	}
};

/**
 * Get sales for specific time period
 */
export const getSalesByDateRange = async (
	startDate: string,
	endDate: string,
): Promise<SaleData[]> => {
	try {
		const response = await axios.get(`${api}/sales/filter`, {
			params: {startDate, endDate},
			headers: {Authorization: localStorage.getItem("token")},
		});
		return response.data || [];
	} catch (error) {
		console.error("Error fetching filtered sales:", error);
		return [];
	}
};
