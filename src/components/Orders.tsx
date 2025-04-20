import {FunctionComponent, useState, useEffect} from "react";
import {getUserOrders, patchStatus} from "../services/orders";
import {Order} from "../interfaces/Order";
import NavigathionButtons from "../atoms/NavigathionButtons";
import Loader from "../atoms/loader/Loader";
import {fontAwesomeIcon} from "../FontAwesome/Icons";
import {useUser} from "../context/useUSer";
import {useNavigate} from "react-router-dom";
import RoleType from "../interfaces/UserType";
import {useTranslation} from "react-i18next";

interface OrdersProps {}

/**
 * Navigates orders
 * @returns auth orders
 */
const Orders: FunctionComponent<OrdersProps> = () => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const {auth} = useUser();
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [orderStatuses, setOrderStatuses] = useState<{[orderNumber: string]: string}>(
		{},
	);
	const [statusLoading, setStatusLoading] = useState<{[orderNumber: string]: boolean}>(
		{},
	); // Tracking loading for each status update

	useEffect(() => {
		setLoading(true);
		getUserOrders(auth._id as string)
			.then((res) => {
				setOrders(res);

				const initialStatuses: {[orderId: string]: string} = {};
				res.forEach((order: {orderNumber: string | number; status: string}) => {
					initialStatuses[order.orderNumber] = order.status;
				});
				setOrderStatuses(initialStatuses);
			})
			.catch((error) => {
				console.error("Failed to fetch orders:", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	// Handle to update order status
	const handleStatus = async (status: string, orderId: string) => {
		setStatusLoading((prev) => ({...prev, [orderId]: true})); // loading state for specific order
		try {
			await patchStatus(status, orderId);
			setOrderStatuses((prevStatuses) => ({
				...prevStatuses,
				[orderId]: status,
			}));
		} catch (error) {
			console.error("Failed to update order status:", error);
		} finally {
			const a = setTimeout(() => {
				setStatusLoading((prev) => ({...prev, [orderId]: false})); // Reset loading state
			}, 1000);
			return () => clearTimeout(a);
		}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<main className=' min-vh-100'>
			<div className='container'>
				<h1 className='text-center'>{t("links.orders")}</h1>
				<div className='row'>
					{orders.length ? (
						orders.reverse().map((order) => (
							<div key={order.createdAt} className='mb-4 col-md-6 col-lg-3'>
								<div className='card p-4 shadow-sm'>
									<h5 className='card-title text-center bg-primary  p-2 rounded'>
										<strong>מ"ס הזמנה:</strong> {order.orderNumber}
									</h5>
									<div className='d-flex flex-column align-items-start mb-3'>
										<div className='my-1'>
											<strong>ID מזמין:</strong>
											<span className='font-weight-bold ms-1'>
												{order.userId}
											</span>
										</div>
										<div>
											<strong>תאריך הזמנה:</strong>
											{new Date(order.date).toLocaleDateString(
												"he-IL",
											)}
										</div>
										<div className='mt-1'>
											<strong>סטטוס:</strong>
											<span
												className={`${
													orderStatuses[order.orderNumber] ===
													"Pending"
														? "text-danger"
														: orderStatuses[
																	order.orderNumber
															  ] === "Shipped"
															? "text-success"
															: orderStatuses[
																		order.orderNumber
																  ] === "Delivered"
																? "text-info"
																: orderStatuses[
																			order
																				.orderNumber
																	  ] === "Preparing"
																	? "text-primary"
																	: orderStatuses[
																				order
																					.orderNumber
																		  ] ===
																		  "Cancelled"
																		? "text-danger"
																		: ""
												}`}
											>
												{orderStatuses[order.orderNumber] ===
												"Pending"
													? "בהמתנה"
													: orderStatuses[order.orderNumber] ===
														  "Shipped"
														? "נמסר"
														: orderStatuses[
																	order.orderNumber
															  ] === "Delivered"
															? "נשלח"
															: orderStatuses[
																		order.orderNumber
																  ] === "Preparing"
																? "ההזמנה שלך בהכנה"
																: orderStatuses[
																			order
																				.orderNumber
																	  ] === "Cancelled"
																	? "בוטל"
																	: ""}
											</span>
										</div>
									</div>

									{/* Admin/Moderator Controls */}
									{((auth && auth.role === RoleType.Admin) ||
										(auth && auth?.role === RoleType.Moderator)) && (
										<div className='d-flex align-items-center justify-content-between'>
											<button
												onClick={() =>
													handleStatus(
														"Preparing",
														order.orderNumber,
													)
												}
												className='btn btn-primary'
												disabled={
													statusLoading[order.orderNumber]
												}
											>
												{statusLoading[order.orderNumber]
													? "טוען..."
													: "הכנה"}
											</button>
											<button
												onClick={() =>
													handleStatus(
														"Delivered",
														order.orderNumber,
													)
												}
												className='btn btn-info'
												disabled={
													statusLoading[order.orderNumber]
												}
											>
												{statusLoading[order.orderNumber]
													? "טוען..."
													: "נשלח"}
											</button>
											<button
												onClick={() =>
													handleStatus(
														"Shipped",
														order.orderNumber,
													)
												}
												className='btn btn-success'
												disabled={
													statusLoading[order.orderNumber]
												}
											>
												{statusLoading[order.orderNumber]
													? "טוען..."
													: "נמסר"}
											</button>
											<button
												onClick={() =>
													handleStatus(
														"Cancelled",
														order.orderNumber,
													)
												}
												className='btn btn-danger'
												disabled={
													statusLoading[order.orderNumber]
												}
											>
												{statusLoading[order.orderNumber]
													? "טוען..."
													: "ביטול"}
											</button>
										</div>
									)}

									{/* Payment & Collection Methods */}
									<div className='mb-3'>
										<strong>שיטת תשלום:</strong>{" "}
										{order.payment ? (
											<span className='text-success'>
												{fontAwesomeIcon.creditCard} כרטיס אשראי
											</span>
										) : (
											<span className='text-warning'>
												{fontAwesomeIcon.moneyBillWave} מזומן
											</span>
										)}
									</div>

									<div className='mb-3'>
										<strong>שיטת איסוף:</strong>{" "}
										{order.selfCollection ? (
											<span className='text-info'>
												{fontAwesomeIcon.boxOpen} איסוף עצמי
											</span>
										) : order.delivery ? (
											<span className='text-primary'>
												{fontAwesomeIcon.boxOpen} משלוח + 20 שח
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
										<button
											onClick={() => {
												navigate(
													`/orderDetails/${order.orderNumber}`,
												);
											}}
											className='btn btn-info btn-sm'
										>
											פרטים נוספים
										</button>
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

				{/* Navigation Buttons */}
				<div className='text-center'>
					<NavigathionButtons />
				</div>
			</div>
		</main>
	);
};

export default Orders;
