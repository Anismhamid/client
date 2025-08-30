import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {Order} from "../../interfaces/Order";
import Loader from "../../atoms/loader/Loader";
import {
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Typography,
} from "@mui/material";
import {useTranslation} from "react-i18next";
import SearchBox from "../../atoms/productsManage/SearchBox";
import socket from "../../socket/globalSocket";
import {getAllOrders} from "../../services/orders";
import {handleOrderStatus} from "../../atoms/OrderStatusButtons/orderStatus";
import {getUserById} from "../../services/usersServices";
import {Link} from "react-router-dom";
import {formatDate} from "../../helpers/dateAndPriceFormat";

const DeliveryPage: FunctionComponent = () => {
	const {t} = useTranslation();
	const [users, setUsers] = useState<{[id: string]: string}>({});
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [orderStatuses, setOrderStatuses] = useState<{[orderNumber: string]: string}>(
		{},
	);
	const [statusLoading, setStatusLoading] = useState<{[orderNumber: string]: boolean}>(
		{},
	);

	const fetchUserNames = async (orders: Order[]) => {
		const missingIds = orders.map((o) => o.userId).filter((id) => !users[id]);

		if (!missingIds.length) return;

		try {
			const results = await Promise.all(missingIds.map((id) => getUserById(id)));
			const newUsers = missingIds.reduce(
				(acc, id, idx) => {
					acc[id] = `${results[idx].name.first} ${results[idx].name.last}`;
					return acc;
				},
				{} as {[id: string]: string},
			);

			setUsers((prev) => ({...prev, ...newUsers}));
		} catch (err) {
			console.error("Failed to fetch users:", err);
		}
	};

	const fetchOrders = async () => {
		try {
			const res = await getAllOrders();
			setOrders(res);
			fetchUserNames(res);

			const initialStatuses: {[orderNumber: string]: string} = {};
			res.forEach((o) => {
				initialStatuses[o.orderNumber] = o.status;
			});
			setOrderStatuses(initialStatuses);
		} catch (err) {
			console.error("فشل تحميل الطلبات:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();

		socket.on("new order", (newOrder: Order) => {
			setOrders((prev) => [newOrder, ...prev]);
			setOrderStatuses((prev) => ({
				...prev,
				[newOrder.orderNumber]: newOrder.status,
			}));
			fetchUserNames([newOrder]);
		});

		const handleStatusChange = (order: Order) => {
			setOrders((prev) =>
				prev.map((o) =>
					o.orderNumber === order.orderNumber
						? {...o, status: order.status}
						: o,
				),
			);
			setOrderStatuses((prev) => ({
				...prev,
				[order.orderNumber]: order.status,
			}));
		};

		socket.on("order:status:updated", handleStatusChange);

		return () => {
			socket.off("new order");
			socket.off("order:status:updated", handleStatusChange);
		};
	}, []);

	const filteredOrders = useMemo(() => {
		const query = searchQuery.toLowerCase();
		return orders.filter((order) => {
			const orderNumber = order.orderNumber?.toString().toLowerCase() || "";
			const date = new Date(order.date).toLocaleDateString("he-IL");
			return orderNumber.includes(query) || date.includes(query);
		});
	}, [orders, searchQuery]);

	if (loading) return <Loader />;

	const getArabicStatus = (status: string) => {
		switch (status) {
			case "Pending":
			case "Preparing":
				return "قيد التحضير";
			case "Delivered":
				return "تم الإرسال";
			case "Shipped":
				return "تم التسليم";
			default:
				return status;
		}
	};

	return (
		<main className=' my-5 delivery'>
			<h1 className='text-center'>{t("links.orders")} - صفحة المرسل</h1>
			<SearchBox
				text='البحث حسب رقم الطلب...'
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
			/>

			{filteredOrders.length > 0 ? (
				<div className='mt-4'>
					{filteredOrders.map((order) => {
						const currentStatus =
							orderStatuses[order.orderNumber] ?? order.status;

						// يظهر فقط إذا الحالة Preparing أو Delivered
						if (
							currentStatus !== "Preparing" &&
							currentStatus !== "Delivered"
						)
							return null;

						const canMarkShipped = currentStatus === "Delivered";

						return (
							<>
								{order.delivery && (
									<Card
										key={order.orderNumber}
										sx={{
											mb: 2,
											borderRadius: 3,
											boxShadow: 3,
											backgroundColor: "#f9f9f9",
										}}
									>
										<CardContent>
											<Box
												display='flex'
												justifyContent='space-between'
												alignItems='center'
												mb={1}
											>
												<Typography variant='h6'>
													رقم الطلب: {order.orderNumber}
												</Typography>
												<Typography
													variant='body2'
													color='text.secondary'
												>
													{formatDate(order.createdAt)}
												</Typography>
											</Box>

											<Typography variant='body1' mb={0.5}>
												العميل:{" "}
												{users[order.userId] ?? (
													<CircularProgress size={15} />
												)}
											</Typography>

											<Typography variant='body1' mb={0.5}>
												الحالة: {getArabicStatus(currentStatus)}
											</Typography>

											<Typography variant='body1' mb={0.5}>
												الهاتف:{" "}
												<Link
													to={`tel:+972${order.phone.phone_1}`}
												>
													{order.phone.phone_1}
												</Link>
											</Typography>

											<Typography variant='body1' mb={2}>
												العنوان:{" "}
												<Link
													to={`https://www.waze.com/ul?q=${encodeURIComponent(
														`${order.address.city}, ${order.address.street} ${order.address.houseNumber}`,
													)}`}
													target='_blank'
													rel='noopener noreferrer'
												>
													{order.address.city},{" "}
													{order.address.street}{" "}
													{order.address.houseNumber}
												</Link>
											</Typography>

											<Button
												variant='contained'
												color='primary'
												disabled={
													statusLoading[order.orderNumber] ||
													!canMarkShipped
												}
												onClick={() =>
													handleOrderStatus(
														"Shipped",
														order.orderNumber,
														setOrderStatuses,
														setStatusLoading,
													).catch((err) => console.error(err))
												}
											>
												{statusLoading[order.orderNumber] ? (
													<CircularProgress size={20} />
												) : (
													"تم التسليم"
												)}
											</Button>
										</CardContent>
									</Card>
								)}
							</>
						);
					})}
				</div>
			) : (
				<p className='text-center text-muted'>لا يوجد طلبات حاليا.</p>
			)}
		</main>
	);
};

export default DeliveryPage;
