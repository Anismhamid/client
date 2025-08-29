import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {getUserOrders} from "../../../services/orders";
import PreviousOrders from "./PreviousOrders";
import Loader from "../../../atoms/loader/Loader";
import {Order} from "../../../interfaces/Order";

const CompleteOrdersPage = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [orderStatuses, setOrderStatuses] = useState<{[k: string]: string}>({});
	const location = useLocation();

	const params = new URLSearchParams(location.search);
	const userId = params.get("userId");

	useEffect(() => {
		if (userId) {
			getUserOrders(userId)
				.then((res) => {
					setOrders(res);
					// هون فيك تعبي orderStatuses إذا عندك API بترجع ستاتوس
					const statuses: {[k: string]: string} = {};
					res.forEach((o: any) => {
						statuses[o.orderNumber] = o.status;
					});
					setOrderStatuses(statuses);
				})
				.catch((err) => console.error("Error fetching user orders:", err))
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, [userId]);

	if (loading) return <Loader />;

	return (
		<main>
			<div className='container my-5 d-flex align-items-center justify-content-between'>
				<PreviousOrders previous={orders} orderStatuses={orderStatuses} />
			</div>
		</main>
	);
};

export default CompleteOrdersPage;
