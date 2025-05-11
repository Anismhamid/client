import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {Order} from "../../../interfaces/Order";
import {getAllOrders, getUserOrders} from "../../../services/orders";
import {useUser} from "../../../context/useUSer";
import Loader from "../../../atoms/loader/Loader";
import NavigathionButtons from "../../../atoms/NavigathionButtons";
import RoleType from "../../../interfaces/UserType";
import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import {showError} from "../../../atoms/Toast";
import {io} from "socket.io-client";
import useNotificationSound from "../../../hooks/useNotificationSound";
import SearchBox from "../../../atoms/SearchBox";
import IncompleteOrders from "./IncompleteOrders";
import NewOrders from "./NewOrders";

interface AllTheOrdersProps {}
/**
 * All Orders
 * @returns All Orders and orders statuses
 */
const AllTheOrders: FunctionComponent<AllTheOrdersProps> = () => {
	const {t} = useTranslation();
	const [allOrders, setAllOrders] = useState<Order[]>([]);
	const {playNotificationSound} = useNotificationSound();
	const [loading, setLoading] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState("");
	const {auth} = useUser();

	const [orderStatuses, setOrderStatuses] = useState<{[orderNumber: string]: string}>(
		{},
	);
	const [statusLoading, setStatusLoading] = useState<{[orderNumber: string]: boolean}>(
		{},
	);
	const [incompleteOrders, setIncompleteOrders] = useState<Order[]>([]);

	const canChangeStatus =
		!!auth && (auth.role === RoleType.Admin || auth.role === RoleType.Moderator);

	const [viewIncomplete, setViewIncomplete] = useState(false);

	const filteredOrders = useMemo(() => {
		return allOrders.filter((order) => {
			const query = searchQuery.toLowerCase();
			const orderNumber = order.orderNumber?.toString().toLowerCase() || "";
			const userId = order.userId?.toString().toLowerCase() || "";
			const date = new Date(order.date).toLocaleDateString("he-IL");

			return (
				orderNumber.includes(query) ||
				userId.includes(query) ||
				date.includes(query)
			);
		});
	}, [allOrders, searchQuery]);

	const findIncompleteOrders = () => {
		const incomplete = allOrders.filter((order) => {
			return (
				!order.address?.city ||
				!order.address?.street ||
				!order.address?.houseNumber
			);
		});
		setIncompleteOrders(incomplete);
	};

	useEffect(() => {
		const socket = io(import.meta.env.VITE_API_SOCKET_URL);

		const handleStatusChange = (order: Order) => {
			playNotificationSound();
			setOrderStatuses((prev) => ({
				...prev,
				[order.orderNumber]: order.status,
			}));
		};
		socket.on("order:status:client", handleStatusChange);

		return () => {
			socket.off("order:status:client", handleStatusChange);
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (canChangeStatus) {
			getAllOrders()
				.then((res) => {
					setAllOrders(res.reverse());

					const initialStatuses: {[orderId: string]: string} = {};
					res.forEach(
						(order: {orderNumber: string | number; status: string}) => {
							initialStatuses[order.orderNumber] = order.status;
						},
					);
					setOrderStatuses(initialStatuses);
				})
				.catch(() => {
					showError("Failed to fetch orders:");
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			if (auth) {
				getUserOrders(auth._id as string)
					.then((res) => {
						setAllOrders(res.reverse());

						const initialStatuses: {[orderId: string]: string} = {};
						res.forEach(
							(order: {orderNumber: string | number; status: string}) => {
								initialStatuses[order.orderNumber] = order.status;
							},
						);
						setOrderStatuses(initialStatuses);
					})
					.catch((error) => {
						console.error("Failed to fetch orders:", error);
					})
					.finally(() => {
						setLoading(false);
					});
			}
		}
	}, [auth]);

	if (loading) {
		return <Loader />;
	}

	return (
		<main>
			{canChangeStatus && (
				<div className='container my-3 d-flex align-items-center justify-content-between'>
					<Button
						variant='contained'
						color='warning'
						onClick={() => setViewIncomplete(false)}
						sx={{ml: 5}}
					>
						הצג את כל ההזמנות
					</Button>

					<Button
						variant='contained'
						color='error'
						onClick={() => {
							findIncompleteOrders();
							setViewIncomplete(true);
						}}
					>
						הצג הזמנות חסרות מידע
					</Button>
				</div>
			)}
			<div className='container bg-gradient rounded  text-center align-items-center'>
				{viewIncomplete ? (
					<IncompleteOrders incompleteOrders={incompleteOrders} />
				) : (
					<>
						<h1 className='text-center'>{t("links.orders")}</h1>
						<SearchBox
							text="'חיפוש לפי מזהה, תאריך או מספר הזמנה...'"
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
						/>
						<NewOrders
							filteredOrders={filteredOrders}
							orderStatuses={orderStatuses}
							setOrderStatuses={setOrderStatuses}
							setStatusLoading={setStatusLoading}
							statusLoading={statusLoading}
						/>
					</>
				)}
				<div className='text-center'>
					<NavigathionButtons />
				</div>
			</div>
		</main>
	);
};

export default AllTheOrders;
