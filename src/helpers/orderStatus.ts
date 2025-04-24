import {patchStatus} from "../services/orders";

// Helper function to get status text
export const getStatusText = (status: string, t: (key: string) => string) => {
	const statusMapping: {[key: string]: string} = {
		Pending: t("orders.status.pending"),
		Shipped: t("orders.status.shipped"),
		Delivered: t("orders.status.delivered"),
		Preparing: t("orders.status.preparing"),
		Cancelled: t("orders.status.cancelled"),
	};
	return statusMapping[status] || status;
};

// handling orders Status
export const handleOrderStatus = async (
	status: string,
	orderId: string,
	setOrderStatuses: Function,
	setStatusLoading: Function,
) => {
	setStatusLoading((prev: any) => ({...prev, [orderId]: true})); // loading state for specific order
	try {
		await patchStatus(status, orderId);
		setOrderStatuses((prevStatuses: any) => ({
			...prevStatuses,
			[orderId]: status,
		}));
	} catch (error) {
		console.error("Failed to update order status:", error);
	} finally {
		setTimeout(() => {
			setStatusLoading((prev: any) => ({...prev, [orderId]: false}));
		}, 1000);
	}
};


export	const getStatusClass = (status: string) => {
		switch (status) {
			case "Pending":
				return "text-danger";
			case "Shipped":
				return "text-success";
			case "Delivered":
				return "text-info";
			case "Preparing":
				return "text-primary";
			case "Cancelled":
				return "text-danger";
			default:
				return "";
		}
	};