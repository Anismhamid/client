import {useEffect, useState} from "react";
import {getOrderByOrderNumber} from "../services/orders";
import {showError} from "../atoms/toasts/ReactToast";
import {Order} from "../interfaces/Order";

// Custom Hook to Fetch Order Details
const useOrderDetails = (orderNumber: string) => {
	const [orderItems, setOrderItems] = useState<Order | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		getOrderByOrderNumber(orderNumber)
			.then((data) => {
				setOrderItems(data);
			})
			.catch((err) => {
				setError("Failed to load order details. Please try again later.");
				showError(err);
			})
			.finally(() => {
				setLoading(false);
			});

		window.scroll(0, 0);
	}, [orderNumber]);

	return {orderItems, loading, error};
};

export default useOrderDetails;
