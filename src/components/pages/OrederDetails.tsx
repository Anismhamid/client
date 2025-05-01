import {FunctionComponent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Loader from "../../atoms/loader/Loader";
import useOrderDetails from "../../hooks/useOrderDetails";
import {useUser} from "../../context/useUSer";
import RoleType from "../../interfaces/UserType";
import {
	getStatusText,
	handleOrderStatus,
} from "../../atoms/OrderStatusButtons/orderStatus";
import { CardMedia, Chip} from "@mui/material";
import {showError} from "../../atoms/Toast";
import {useTranslation} from "react-i18next";
import OrderStatusButtons from "../../atoms/OrderStatusButtons/StatusButtons";

interface OrderDetailsProps {}

const OrderDetails: FunctionComponent<OrderDetailsProps> = () => {
	const {orderNumber} = useParams<{orderNumber: string}>();
	const {orderItems, loading, error} = useOrderDetails(orderNumber as string);
	const {t} = useTranslation();
	const {auth} = useUser();

	const [orderStatuses, setOrderStatuses] = useState<{
		[orderNumber: string]: string;
	}>({});

	const [statusLoading, setStatusLoading] = useState<{
		[orderNumber: string]: boolean;
	}>({});

	useEffect(() => {
		if (orderItems?.status) {
			setOrderStatuses({[orderItems.orderNumber]: orderItems.status});
		}
	}, [orderItems]);

	if (error) return <div>{error}</div>;
	if (loading) return <Loader />;

	if (!orderItems)
		return (
			<h2 className='text-center bg-primary text-white rounded p-3 mb-4'>
				{t("No products found in this order.")}
			</h2>
		);

	const currentStatus = orderStatuses[orderItems.orderNumber];

	const canChangeStatus =
		auth && (auth.role === RoleType.Admin || auth.role === RoleType.Moderator);

	return (
		<main className='min-vh-50'>
			<div className='container p-3'>
				<div className='text-center bg-gradient p-4 rounded shadow-sm'>
					<h1 className='text-center mb-4'>{orderNumber}</h1>

					<div className='d-flex justify-content-between align-items-center mb-3 flex-wrap'>
						<div className='d-flex align-items-center gap-2'>
							<strong>{t("סטטוס נוכחי")}:</strong>
							<Chip
								label={getStatusText(currentStatus, t)}
								color={
									currentStatus === "Preparing"
										? "warning"
										: currentStatus === "Delivered"
											? "info"
											: currentStatus === "Shipped"
												? "success"
												: "default"
								}
							/>
						</div>

						{canChangeStatus && (
							<div className='d-flex gap-2 flex-wrap mt-3'>
								<OrderStatusButtons
									orderNumber={orderItems.orderNumber}
									statusLoading={statusLoading}
									handleOrderStatus={handleOrderStatus}
									setOrderStatuses={setOrderStatuses}
									setStatusLoading={setStatusLoading}
									showError={showError}
									currentStatus={orderStatuses[orderItems.orderNumber]}
								/>
							</div>
						)}
					</div>
				</div>

				<div className='row row-cols-1 row-cols-md-3 g-4 mt-4'>
					{orderItems.products.map((product, index) => {
						const finalPrice =
							product.discount > 0
								? product.product_price * (1 - product.discount / 100)
								: product.product_price;

						return (
							<div key={product.product_image + index} className='col'>
								<div className='card h-100 shadow-sm border-0 overflow-hidden'>
									<CardMedia
										component='img'
										height='180'
										image={product.product_image}
										alt={product.product_name}
										sx={{
											objectFit: "cover",
											transition: "transform 0.3s ease-in-out",
										}}
									/>
									<div className='card-body'>
										<h5 className='card-title'>
											{product.product_name}
										</h5>

										{product.discount > 0 && (
											<Chip
												label={`${product.discount}% ${t("הנחה")}`}
												color='error'
												size='small'
												className='mb-2'
											/>
										)}

										<p className='text-muted'>
											{t("כמות")}: {product.quantity}
										</p>

										<p className='text-success fw-bold'>
											{t("price")}:
											{finalPrice.toLocaleString("he-IL", {
												style: "currency",
												currency: "ILS",
											})}
										</p>

										{product.discount > 0 && (
											<p className='fw-semibold'>
												{t("מחיר אחרי מבצע")}
											</p>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</main>
	);
};

export default OrderDetails;
