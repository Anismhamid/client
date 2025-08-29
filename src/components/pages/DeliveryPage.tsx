import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {Order} from "../../interfaces/Order";
import Loader from "../../atoms/loader/Loader";
import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import SearchBox from "../../atoms/productsManage/SearchBox";
import socket from "../../socket/globalSocket";
import {getAllOrders} from "../../services/orders";
import {handleOrderStatus} from "../../atoms/OrderStatusButtons/orderStatus";
import {getUserById} from "../../services/usersServices";
import {Link} from "react-router-dom";

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
		const newUsers: {[id: string]: string} = {};
		const missingIds = orders.map((o) => o.userId).filter((id) => !users[id]);

		for (const id of missingIds) {
			try {
				const res = await getUserById(id);
				newUsers[id] = `${res.name.first} ${res.name.last}`;
			} catch (err) {
				console.error("Failed to fetch user:", id, err);
				newUsers[id] = id;
			}
		}

		if (Object.keys(newUsers).length > 0) {
			setUsers((prev) => ({...prev, ...newUsers}));
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
		<main className='container my-5 delivery'>
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
							<div
								key={order.orderNumber}
								className='p-3 my-2 border rounded shadow-sm bg-light'
							>
								<h5>رقم الطلب: {order.orderNumber}</h5>
								<p>العميل: {users[order.userId] ?? "جارٍ التحميل..."}</p>
								<p>الحالة: {getArabicStatus(currentStatus)}</p>
								<p>
									الهاتف:{" "}
									<Link to={`tel:+972${order.phone.phone_1}`}>
										{order.phone.phone_1}
									</Link>
								</p>
								<p>
									العنوان:{" "}
									<a
										href={`https://www.waze.com/ul?q=${encodeURIComponent(
											`${order.address.city}, ${order.address.street} ${order.address.houseNumber}`,
										)}`}
										target='_blank'
										rel='noopener noreferrer'
									>
										{order.address.city}, {order.address.street}{" "}
										{order.address.houseNumber}
									</a>
								</p>

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
									{statusLoading[order.orderNumber]
										? "..."
										: "تم التسليم"}
								</Button>
							</div>
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
