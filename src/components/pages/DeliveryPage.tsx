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
	Grid,
	Chip,
	Alert,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	IconButton,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import {
	LocalShipping,
	Phone,
	LocationOn,
	CheckCircle,
	Refresh,
	Visibility,
} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import SearchBox from "../../atoms/productsManage/SearchBox";
import socket from "../../socket/globalSocket";
import {getAllOrders} from "../../services/orders";
import {
	getStatusClass,
	handleOrderStatus,
} from "../../atoms/OrderStatusButtons/orderStatus";
import {getUserById} from "../../services/usersServices";
import {Link} from "react-router-dom";
import {formatDate, formatPrice} from "../../helpers/dateAndPriceFormat";

const DeliveryPage: FunctionComponent = () => {
	const {t} = useTranslation();
	const [users, setUsers] = useState<{[id: string]: string}>({});
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [orderStatuses, setOrderStatuses] = useState<{[orderNumber: string]: string}>(
		{},
	);
	const [statusLoading, setStatusLoading] = useState<{[orderNumber: string]: boolean}>(
		{},
	);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [detailDialogOpen, setDetailDialogOpen] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

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
			console.error("فشل في تحميل المستخدمين:", err);
		}
	};

	const fetchOrders = async () => {
		try {
			setRefreshing(true);
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
			setRefreshing(false);
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
		const query = searchQuery;
		return orders.filter((order) => {
			//  فلتر الحالة
			const currentStatus = orderStatuses[order.orderNumber] ?? order.status;
			if (filterStatus !== "all" && currentStatus !== filterStatus) {
				return false;
			}

			//  البحث
			const orderNumber = order.orderNumber?.toString().toLowerCase() || "";
			const date = new Date(order.date).toLocaleDateString("he-IL");
			const userName = users[order.userId]?.toLowerCase() || "";

			return (
				orderNumber.includes(query) ||
				date.includes(query) ||
				userName.includes(query)
			);
		});
	}, [orders, searchQuery, filterStatus, orderStatuses, users]);

	if (loading) return <Loader />;

	const getArabicStatus = (status: string) => {
		switch (status) {
			case "Pending":
				return "قيد الانتظار";
			case "Preparing":
				return "قيد التحضير";
			case "Delivered":
				return "تم الارسال";
			case "Shipped":
				return "تم التسليم";
			default:
				return status;
		}
	};

	const handleViewDetails = (order: Order) => {
		setSelectedOrder(order);
		setDetailDialogOpen(true);
	};

	const handleRefresh = () => {
		fetchOrders();
	};

	return (
		<main className='my-5 '>
			<Box
				className='container'
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				mb={3}
			>
				<Typography variant='h4' component='h1'>
					<LocalShipping sx={{mr: 1, verticalAlign: "middle"}} />
					{t("links.orders")} - صفحة المرسل
				</Typography>

				<Tooltip title='تحديث الطلبات'>
					<IconButton onClick={handleRefresh} disabled={refreshing}>
						{refreshing ? <CircularProgress size={24} /> : <Refresh />}
					</IconButton>
				</Tooltip>
			</Box>

			{/* فلترة وبحث */}
			<Grid container spacing={2} alignItems='center' mb={3}>
				<Grid size={{xs: 12, md: 6}}>
					<SearchBox
						text='البحث حسب رقم الطلب، الاسم أو التاريخ...'
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
					/>
				</Grid>
				<Grid size={{xs: 12, md: 3}}>
					<FormControl fullWidth>
						<InputLabel>فلترة حسب الحالة</InputLabel>
						<Select
							value={filterStatus}
							label='فلترة حسب الحالة'
							onChange={(e) => setFilterStatus(e.target.value)}
						>
							<MenuItem value='all'>جميع الطلبات</MenuItem>
							<MenuItem value='Preparing'>قيد التحضير</MenuItem>
							<MenuItem value='Delivered'>تم الارسال</MenuItem>
							<MenuItem value='Shipped'>تم التسليم</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid size={{xs: 12, md: 3}}>
					<Typography variant='body2' color='text.secondary'>
						عدد الطلبات: {filteredOrders.length}
					</Typography>
				</Grid>
			</Grid>

			{filteredOrders.length > 0 ? (
				<Grid container spacing={2}>
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
							<Grid size={{xs: 12}} key={order.orderNumber}>
								{order.delivery && (
									<Card sx={{borderRadius: 2, boxShadow: 2}}>
										<CardContent>
											<Box
												display='flex'
												justifyContent='space-between'
												alignItems='flex-start'
											>
												<Box flex={1}>
													<Box
														display='flex'
														justifyContent='space-between'
														alignItems='center'
														mb={1}
													>
														<Typography
															variant='h6'
															color='primary'
														>
															رقم الطلب: #
															{order.orderNumber}
														</Typography>
														<Chip
															label={getArabicStatus(
																currentStatus,
															)}
															color={getStatusClass(
																currentStatus,
															)}
															size='small'
														/>
													</Box>

													<Typography
														variant='body2'
														color='text.secondary'
														mb={1}
													>
														{formatDate(order.createdAt)}
													</Typography>

													<Typography variant='body1' mb={1}>
														<strong>العميل:</strong>{" "}
														{users[order.userId] ?? (
															<CircularProgress size={15} />
														)}
													</Typography>

													<Box
														display='flex'
														alignItems='center'
														mb={0.5}
													>
														<Phone
															fontSize='small'
															sx={{mr: 0.5}}
														/>
														<Typography variant='body2'>
															<Link
																to={`tel:+972${order.phone.phone_1}`}
																style={{
																	textDecoration:
																		"none",
																	color: "inherit",
																}}
															>
																{order.phone.phone_1}
															</Link>
														</Typography>
													</Box>

													<Box
														display='flex'
														alignItems='center'
														mb={2}
													>
														<LocationOn
															fontSize='small'
															sx={{mr: 0.5}}
														/>
														<Typography variant='body2'>
															<Link
																to={`https://www.waze.com/ul?q=${encodeURIComponent(
																	`${order.address.city}, ${order.address.street} ${order.address.houseNumber}`,
																)}`}
																target='_blank'
																rel='noopener noreferrer'
																style={{
																	textDecoration:
																		"none",
																	color: "inherit",
																}}
															>
																{order.address.city},{" "}
																{order.address.street}{" "}
																{
																	order.address
																		.houseNumber
																}
															</Link>
														</Typography>
													</Box>

													<Typography variant='body1' mb={2}>
														<strong>سعر الطلب:</strong>{" "}
														{formatPrice(order.totalAmount) ||
															0}
													</Typography>
												</Box>

												<Box
													display='flex'
													flexDirection='column'
													alignItems='flex-end'
													ml={2}
												>
													<Tooltip title='عرض التفاصيل'>
														<IconButton
															size='small'
															onClick={() =>
																handleViewDetails(order)
															}
															color='info'
														>
															<Visibility />
														</IconButton>
													</Tooltip>

													<Button
														variant='contained'
														color='success'
														size='small'
														startIcon={
															statusLoading[
																order.orderNumber
															] ? (
																<CircularProgress
																	size={16}
																/>
															) : (
																<CheckCircle />
															)
														}
														disabled={
															statusLoading[
																order.orderNumber
															] || !canMarkShipped
														}
														onClick={() =>
															handleOrderStatus(
																"Shipped",
																order.orderNumber,
																setOrderStatuses,
																setStatusLoading,
															).catch((err) =>
																console.error(err),
															)
														}
														sx={{mt: 1, minWidth: "120px"}}
													>
														تم التسليم
													</Button>
												</Box>
											</Box>
										</CardContent>
									</Card>
								)}
							</Grid>
						);
					})}
				</Grid>
			) : (
				<Alert severity='info' sx={{mt: 3}}>
					لا يوجد طلبات حاليا.
				</Alert>
			)}

			{/* ديالوج تفاصيل الطلب */}
			<Dialog
				open={detailDialogOpen}
				onClose={() => setDetailDialogOpen(false)}
				maxWidth='md'
				fullWidth
			>
				<DialogTitle>تفاصيل الطلب #{selectedOrder?.orderNumber}</DialogTitle>
				<DialogContent>
					{selectedOrder && (
						<Box>
							<Typography variant='body1' paragraph>
								<strong>العميل:</strong>{" "}
								{users[selectedOrder.userId] || "جاري التحميل..."}
							</Typography>
							<Typography variant='body1' paragraph>
								<strong>تاريخ الطلب:</strong>{" "}
								{formatDate(selectedOrder.createdAt)}
							</Typography>
							<Typography variant='body1' paragraph>
								<strong>الحالة:</strong>{" "}
								{getArabicStatus(selectedOrder.status)}
							</Typography>
							<Typography variant='body1' paragraph>
								<strong>الهاتف:</strong> {selectedOrder.phone.phone_1}
							</Typography>
							<Typography variant='body1' paragraph>
								<strong>العنوان:</strong> {selectedOrder.address.city},{" "}
								{selectedOrder.address.street}{" "}
								{selectedOrder.address.houseNumber}
							</Typography>
							<Typography variant='body1' paragraph>
								<strong>المجموع:</strong>{" "}
								{formatPrice(selectedOrder.totalAmount)}
							</Typography>

							{selectedOrder.products &&
								selectedOrder.products.length > 0 && (
									<>
										<Typography variant='h6' mt={2}>
											المنتجات:
										</Typography>
										{selectedOrder.products.map((item, index) => (
											<Box
												key={index}
												display='flex'
												justifyContent='space-between'
												py={1}
											>
												<Typography variant='body2'>
													{item.product_name} × {item.quantity}
												</Typography>
												<Typography variant='body2'>
													{formatPrice(
														item.product_price *
															item.quantity,
													)}
												</Typography>
											</Box>
										))}
									</>
								)}
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDetailDialogOpen(false)}>إغلاق</Button>
				</DialogActions>
			</Dialog>
		</main>
	);
};

export default DeliveryPage;
