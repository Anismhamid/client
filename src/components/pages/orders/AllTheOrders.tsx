import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {Order} from "../../../interfaces/Order";
import {getAllOrders, getUserOrders} from "../../../services/orders";
import {useUser} from "../../../context/useUSer";
import Loader from "../../../atoms/loader/Loader";
import NavigathionButtons from "../../../atoms/productsManage/NavigathionButtons";
import RoleType from "../../../interfaces/UserType";
import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import {showError} from "../../../atoms/toasts/ReactToast";
import useNotificationSound from "../../../hooks/useNotificationSound";
import SearchBox from "../../../atoms/SearchBox";
import NewOrders from "./NewOrders";
import PreviousOrders from "./PreviousOrders";
import socket from "../../../socket/globalSocket";

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
	const [searchQuery, setSearchQuery] = useState<string>("");
	const {auth} = useUser();

	const [orderStatuses, setOrderStatuses] = useState<{[orderNumber: string]: string}>(
		{},
	);
	const [statusLoading, setStatusLoading] = useState<{[orderNumber: string]: boolean}>(
		{},
	);

	const canChangeStatus =
		!!auth && (auth.role === RoleType.Admin || auth.role === RoleType.Moderator);

	const [viewPreviousOrders, setViewPreviousOrders] = useState(false);

	const newOrders = useMemo(() => {
		const today = new Date().toLocaleDateString("he-IL");

		return allOrders.filter((order) => {
			const orderDate = new Date(order.date).toLocaleDateString("he-IL");
			return orderDate === today;
		});
	}, [allOrders]);

	const filteredOrders = useMemo(() => {
		return newOrders.filter((order) => {
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
	}, [newOrders, searchQuery]);

	const previousOrders = useMemo(() => {
		const today = new Date().toLocaleDateString("he-IL");

		return allOrders.filter((order) => {
			const orderDate = new Date(order.date).toLocaleDateString("he-IL");
			return orderDate !== today;
		});
	}, [allOrders]);

	const filteredPreviousOrders = useMemo(() => {
		const query = searchQuery.toLowerCase();
		return previousOrders.filter((order) => {
			const orderNumber = order.orderNumber?.toString().toLowerCase() || "";
			const userId = order.userId?.toString().toLowerCase() || "";
			const date = new Date(order.date).toLocaleDateString("he-IL");

			return (
				orderNumber.includes(query) ||
				userId.includes(query) ||
				date.includes(query)
			);
		});
	}, [previousOrders, searchQuery]);

	useEffect(() => {

		const handleStatusChange = (order: Order) => {
			playNotificationSound();
			setOrderStatuses((prev) => ({
				...prev,
				[order.orderNumber]: order.status,
			}));

			setAllOrders((prevOrders) =>
				prevOrders.map((o) =>
					o.orderNumber === order.orderNumber
						? {...o, status: order.status}
						: o,
				),
			);
		};

		socket.on("order:status:updated", handleStatusChange);

		socket.on("new order", (newOrder: Order) => {
			setAllOrders((prevOrders) => [newOrder, ...prevOrders]);
		});

		return () => {
			socket.off("order:status:updated");
			socket.off("new order");
			socket.disconnect();
		};
	}, []);

	const fetchOrders = async () => {
		try {
			const res = canChangeStatus
				? await getAllOrders()
				: await getUserOrders(auth._id as string);

			const reversed = res.reverse();
			setAllOrders(reversed);

			const initialStatuses: {[orderNumber: string]: string} = {};
			reversed.forEach(({orderNumber, status}) => {
				initialStatuses[orderNumber] = status;
			});
			setOrderStatuses(initialStatuses);
		} catch (error) {
			showError("אחזור ההזמנות נכשל");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (auth?._id) {
			fetchOrders();
		}
	}, [auth]);

	if (loading) {
		return <Loader />;
	}

	return (
		<main>
			<div className='container my-5 d-flex align-items-center justify-content-between'>
				<Button
					variant='contained'
					color='warning'
					onClick={() => setViewPreviousOrders(false)}
					sx={{ml: 5}}
				>
					הצג את כל ההזמנות
				</Button>
				<Button
					variant='contained'
					color='error'
					onClick={() => {
						setViewPreviousOrders(true);
					}}
				>
					הצג הזמנות קודמות
				</Button>
			</div>
			<div className='container bg-gradient rounded  text-center align-items-center'>
				{viewPreviousOrders ? (
					<>
						<h1 className='text-center'>{t("links.orders")}</h1>
						<SearchBox
							text='חפוש לפי מספר הזמנה...'
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
						/>
						<h3 className='text-danger bg-gradient fw-bold'>הזמנות קודמות</h3>
						<PreviousOrders
							orderStatuses={orderStatuses}
							previous={filteredPreviousOrders}
						/>
					</>
				) : (
					<>
						<h1 className='text-center'>{t("links.orders")}</h1>
						<SearchBox
							text='חפוש לפי מספר הזמנה...'
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
						/>
						<h3 className='text-primary bg-gradient fw-bold'>הזמנות חדשות</h3>
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
