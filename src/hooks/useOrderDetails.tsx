import {useEffect, useState} from "react";
import {getOrderByOrderNumber} from "../services/orders";
import {getUserById} from "../services/usersServices";
import {showError} from "../atoms/toasts/ReactToast";
import {Order} from "../interfaces/Order";

// Custom Hook to Fetch Order Details along with User
const useOrderDetails = (orderNumber: string) => {
	const [orderItems, setOrderItems] = useState<Order | null>(null);
	const [user, setUser] = useState<any>(null); // يمكن تحديد النوع المناسب
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const orderData = await getOrderByOrderNumber(orderNumber);
				setOrderItems(orderData);

				if (orderData?.userId) {
					const userData = await getUserById(orderData.userId);
					setUser(userData);
				}
			} catch (err: any) {
				setError("Failed to load order details. Please try again later.");
				showError(err.message || err);
			} finally {
				setLoading(false);
			}

			window.scroll(0, 0);
		};

		fetchData();
	}, [orderNumber]);

	return {orderItems, user, loading, error};
};

export default useOrderDetails;
