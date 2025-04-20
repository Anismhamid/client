import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {Order} from "../interfaces/Order";
import {getAllOrders, patchStatus} from "../services/orders";
import {useNavigate} from "react-router-dom";
import {useUser} from "../context/useUSer";
import Loader from "../atoms/loader/Loader";
import {fontAwesomeIcon} from "../FontAwesome/Icons";
import NavigathionButtons from "../atoms/NavigathionButtons";
import RoleType from "../interfaces/UserType";
import SearchIcon from "@mui/icons-material/Search";
import {InputBase, Paper, IconButton} from "@mui/material";
import {useTranslation} from "react-i18next";

interface AllTheOrdersProps {}
/**
 * All Orders
 * @returns All Orders and orders statuses
 */
const AllTheOrders: FunctionComponent<AllTheOrdersProps> = () => {
	const {t} = useTranslation();
	const [orderStatuses, setOrderStatuses] = useState<{[orderNumber: string]: string}>(
		{},
	);
	const [statusLoading, setStatusLoading] = useState<{[orderNumber: string]: boolean}>(
		{},
	); // Track loading for each status update
	const [allOrders, setAllOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();
	const {auth} = useUser();

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

	useEffect(() => {
		getAllOrders()
			.then((res) => {
				setAllOrders(res.reverse());

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

	const handleStatus = useMemo(
		() => async (status: string, orderId: string) => {
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
				setTimeout(() => {
					setStatusLoading((prev) => ({...prev, [orderId]: false})); // Reset loading state
				}, 1000);
			}
		},

		[statusLoading, orderStatuses],
	);

	if (loading) {
		return <Loader />;
	}

	return (
		<main className=' min-vh-100'>
			<div className='container bg-gradient rounded  text-center align-items-center'>
				<h1 className='text-center'>{t("links.orders")}</h1>
				<Paper
					component='div'
					onSubmit={(e) => e.preventDefault()}
					sx={{
						width: {xs: "90%", sm: 400},
						m: "auto",
						mb: 4,
						p: "2px 10px",
						display: "flex",
						alignItems: "center",
						borderRadius: "50px",
						background: "rgba(255, 255, 255, 0.08)",
						boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
						backdropFilter: "blur(10px)",
						border: "1px solid rgba(255, 255, 255, 0.2)",
						transition: "0.3s ease",
						"&:hover": {
							boxShadow: "0 6px 25px rgba(0, 0, 0, 0.4)",
						},
					}}
				>
					<SearchIcon sx={{color: "#66b2ff", mr: 1}} />
					<InputBase
						sx={{
							color: "#696969",
							ml: 5,
							flex: 1,
							fontSize: "16px",
							"& input::placeholder": {
								color: "#5f5f5f",
							},
						}}
						placeholder='חיפוש לפי מזהה, תאריך או מספר הזמנה...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						inputProps={{"aria-label": "search"}}
					/>
					<IconButton onClick={() => setSearchQuery("")} size='small'>
						❌
					</IconButton>
				</Paper>
				<div className='row mt-5'>
					{filteredOrders.length ? (
						filteredOrders.map((order) => (
							<div key={order.createdAt} className='mb-4 col-md-6 col-lg-4'>
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
											<strong>תאריך הזמנה:</strong>(
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
											)
										</div>
										<div className='text-start mt-3'>
											<strong>טלפון מזמין:</strong>
										</div>
										<div className='text-start my-3'>
											<strong>כתובת מזמין:</strong>
										</div>
										<div className='mt-1'>
											<strong>סטטוס:</strong>{" "}
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
									<div className='mb-3 mx-auto text-center'>
										{((auth && auth.role === RoleType.Admin) ||
											(auth &&
												auth.role === RoleType.Moderator)) && (
											<>
												<button
													onClick={() =>
														handleStatus(
															"Preparing",
															order.orderNumber,
														)
													}
													className='btn btn-primary'
													disabled={
														order.status === "Preparing" ||
														order.status === "Delivered" ||
														order.status === "Shipped"
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
														order.status === "Delivered" ||
														order.status === "Shipped"
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
													disabled={order.status === "Shipped"}
												>
													{statusLoading[order.orderNumber]
														? "טוען..."
														: "נמסר"}
												</button>
											</>
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
												משלוח + 20 שח
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

				<div className='text-center'>
					<NavigathionButtons />
				</div>
			</div>
		</main>
	);
};

export default AllTheOrders;
