import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {Order} from "../../interfaces/Order";
import {getAllOrders, getUserOrders} from "../../services/orders";
import {useNavigate} from "react-router-dom";
import {useUser} from "../../context/useUSer";
import Loader from "../../atoms/loader/Loader";
import {fontAwesomeIcon} from "../../FontAwesome/Icons";
import NavigathionButtons from "../../atoms/NavigathionButtons";
import RoleType from "../../interfaces/UserType";
import SearchIcon from "@mui/icons-material/Search";
import {CircularProgress, Button, Chip} from "@mui/material";
import {useTranslation} from "react-i18next";
import {
	getStatusClass,
	getStatusText,
	handleOrderStatus,
} from "../../atoms/OrderStatusButtons/orderStatus";
import {showError} from "../../atoms/Toast";
import OrderStatusButtons from "../../atoms/OrderStatusButtons/StatusButtons";
import {io} from "socket.io-client";
import useNotificationSound from "../../hooks/useNotificationSound";
import SearchBox from "../../atoms/SearchBox";

interface AllTheOrdersProps {}
/**
 * All Orders
 * @returns All Orders and orders statuses
 */
const AllTheOrders: FunctionComponent<AllTheOrdersProps> = () => {
	const {t} = useTranslation();
	const [allOrders, setAllOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();
	const {auth} = useUser();

	const [orderStatuses, setOrderStatuses] = useState<{[orderNumber: string]: string}>(
		{},
	);
	const [statusLoading, setStatusLoading] = useState<{[orderNumber: string]: boolean}>(
		{},
	);

	const canChangeStatus =
		auth && (auth.role === RoleType.Admin || auth.role === RoleType.Moderator);

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
	const {playNotificationSound} = useNotificationSound();

	useEffect(() => {
		const socket = io(import.meta.env.VITE_API_SOCKET_URL);

		socket.on("order:status:client", (order: Order) => {
			playNotificationSound();
			setOrderStatuses((prev) => ({
				...prev,
				[order.orderNumber]: order.status,
			}));
		});

		return () => socket.disconnect();
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
				.catch((error) => {
					console.error("Failed to fetch orders:", error);
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
			<div className='container bg-gradient rounded  text-center align-items-center'>
				<h1 className='text-center'>{t("links.orders")}</h1>
				<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
				<div className='row mt-5'>
					{filteredOrders.length ? (
						filteredOrders.map((order) => (
							<div
								key={order.orderNumber}
								className='mb-4 col-md-6 col-lg-4'
							>
								<div className='card p-3 shadow'>
									<h5 className='card-title text-center bg-primary text-white p-2 rounded'>
										<strong>מ"ס הזמנה:</strong> {order.orderNumber}
									</h5>
									<div className='mb-3'>
										<div className='my-1'>
											<strong className=''>ID מזמין</strong>
											<span className='fw-bold rounded d-block text-danger'>
												{order.userId}
											</span>
										</div>
										<div>
											<strong>תאריך הזמנה:</strong>
											{new Date(order.date).toLocaleString(
												"he-IL",
												{
													year: "2-digit",
													month: "short",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												},
											)}
										</div>
										<div className='text-start mt-3'>
											<strong>טלפון מזמין:</strong>
										</div>
										<div className='text-start my-3'>
											<strong>כתובת מזמין:</strong>
										</div>
										<div className='mt-1'>
											<strong>סטטוס:</strong>{" "}
											<Chip
												label={getStatusText(
													orderStatuses[order.orderNumber],
													t,
												)}
												color={getStatusClass(order.orderNumber)}
											/>
										</div>
									</div>
									<div className='mb-3 mx-auto text-center'>
										{canChangeStatus && (
											<OrderStatusButtons
												orderNumber={order.orderNumber}
												statusLoading={statusLoading}
												handleOrderStatus={handleOrderStatus}
												setOrderStatuses={setOrderStatuses}
												setStatusLoading={setStatusLoading}
												showError={showError}
												currentStatus={
													orderStatuses[order.orderNumber]
												}
											/>
										)}
									</div>

									<div className='mb-3'>
										<strong>שיטת תשלום:</strong>{" "}
										{order.payment ? (
											<span className='text-success'>
												{fontAwesomeIcon.creditCard}
												כרטיס אשראי
											</span>
										) : (
											<span className='text-warning'>
												{fontAwesomeIcon.moneyBillWave}
												מזומן
											</span>
										)}
									</div>

									<div className='mb-3'>
										<strong>שיטת איסוף:</strong>{" "}
										{order.selfCollection ? (
											<span className='text-info'>
												{fontAwesomeIcon.boxOpen}
												איסוף עצמי
											</span>
										) : order.delivery ? (
											<span className='text-primary'>
												{fontAwesomeIcon.boxOpen}
												{order.deliveryFee.toLocaleString(
													"he-IL",
													{style: "currency", currency: "ILS"},
												)}
											</span>
										) : (
											<span className='text-muted'>לא נבחר</span>
										)}
									</div>

									<div>
										<h5 className='text-center text-success'>
											<strong>ס"כ מחיר הזמנה:</strong>{" "}
											{order.totalAmount.toLocaleString("he-IL", {
												style: "currency",
												currency: "ILS",
											})}
										</h5>
									</div>

									<div className='d-flex justify-content-center mt-3'>
										<Button
											startIcon={
												statusLoading[order.orderNumber] ? (
													<CircularProgress
														size={18}
														color='inherit'
													/>
												) : null
											}
											onClick={() => {
												navigate(
													`/orderDetails/${order.orderNumber}`,
												);
											}}
											variant='contained'
											color='info'
											size='small'
											sx={{mt: 1}}
										>
											פרטים נוספים
										</Button>
									</div>
								</div>
							</div>
						))
					) : (
						<div className='text-center text-danger fs-4'>
							אין הזמנות עדיין
						</div>
					)}
				</div>

				<div className='text-center'>
					<NavigathionButtons />
				</div>
			</div>
		</main>
	);
};

export default AllTheOrders;
