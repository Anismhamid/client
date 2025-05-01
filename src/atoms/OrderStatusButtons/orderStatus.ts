import {patchStatus} from "../../services/orders";

// Mapping between status codes and translation keys
const statusMapping: {[key: string]: string} = {
	Pending: "orders.status.pending",
	Shipped: "orders.status.shipped",
	Delivered: "orders.status.delivered",
	Preparing: "orders.status.preparing",
	Cancelled: "orders.status.cancelled",
};

/**
 * Translates a given order status to a localized string
 */
export const getStatusText = (status: string, t: (key: string) => string): string => {
	return statusMapping[status] ? t(statusMapping[status]) : status;
};

/**
 * Handles updating the order status
 */
export const handleOrderStatus = async (
	status: string,
	orderId: string,
	setOrderStatuses: (updateFn: (prev: any) => any) => void,
	setStatusLoading: (updateFn: (prev: any) => any) => void,
): Promise<void> => {
	try {
		setStatusLoading((prev) => ({...prev, [orderId]: true}));

		await patchStatus(status, orderId);

		setOrderStatuses((prev) => ({
			...prev,
			[orderId]: status,
		}));
	} catch (error) {
		console.error("Failed to update order status:", error);
		throw error;
	} finally {
		setStatusLoading((prev) => ({...prev, [orderId]: false}));
	}
};

/**
 * Returns MUI-style class names based on order status
 */
export const getStatusClass = (status: string): string => {
	switch (status) {
		case "Pending":
			return "text-danger";
		case "Preparing":
			return "warning";
		case "Delivered":
			return "info";
		case "Shipped":
			return "success";
		default:
			return "";
	}
};
