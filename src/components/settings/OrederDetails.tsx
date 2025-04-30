import {FunctionComponent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Loader from "../../atoms/loader/Loader";
import useOrderDetails from "../../hooks/useOrderDetails";
import {useUser} from "../../context/useUSer";
import RoleType from "../../interfaces/UserType";
import {
	getStatusClass,
	getStatusText,
	handleOrderStatus,
} from "../../helpers/orderStatus";
import {CardMedia, CircularProgress} from "@mui/material";
import {showError} from "../../atoms/Toast";
import {useTranslation} from "react-i18next";

interface OrderDetailsProps {}

/**
 * Order products Details
 * @returns Order products
 */
const OrderDetails: FunctionComponent<OrderDetailsProps> = () => {
	const {orderNumber} = useParams<{orderNumber: string}>();
	const {orderItems, loading, error} = useOrderDetails(orderNumber as string);
	const {auth} = useUser();
	const [orderStatuses, setOrderStatuses] = useState<{
		[orderNumber: string]: string;
	}>({});
	const [statusLoading, setStatusLoading] = useState<{
		[orderNumber: string]: boolean;
	}>({});
	const {t} = useTranslation();

	useEffect(() => {
		if (orderItems?.status) {
			setOrderStatuses({[orderItems.orderNumber]: orderItems.status});
		}
	}, [orderItems]);

	if (error) {
		return <div>{error}</div>;
	}

	if (loading) {
		return <Loader />;
	}

	if (!orderItems) {
		return (
			<h2 className='text-center bg-primary text-white rounded p-3 mb-4'>
				No products found in this order.
			</h2>
		);
	}

	return (
		<main className='min-vh-50'>
			<div className='container p-3'>
				<div className='text-center bg-gradient rounded p-3 mb-4'>
					<div className='mb-3 text-center d-flex align-items-center justify-content-between'>
						<div className='mb-3'>
							<strong>סטטוס נוכחי:</strong>{" "}
							<span
								className={getStatusClass(
									orderStatuses[orderItems.orderNumber],
								)}
							>
								{getStatusText(orderStatuses[orderItems.orderNumber], t)}
							</span>
						</div>
						{((auth && auth.role === RoleType.Admin) ||
							(auth && auth.role === RoleType.Moderator)) && (
							<>
								<button
									onClick={() =>
										handleOrderStatus(
											"Preparing",
											orderItems.orderNumber,
											setOrderStatuses,
											setStatusLoading,
										).catch((err) => {
											showError(err);
										})
									}
									className='btn btn-primary me-2'
									disabled={
										orderItems.status === "Preparing" ||
										orderItems.status === "Delivered" ||
										orderItems.status === "Shipped"
									}
								>
									{statusLoading[orderItems.orderNumber] ? (
										<CircularProgress size={20} color='inherit' />
									) : (
										"הכנה"
									)}
								</button>
								<button
									onClick={() =>
										handleOrderStatus(
											"Delivered",
											orderItems.orderNumber,
											setOrderStatuses,
											setStatusLoading,
										).catch((err) => {
											showError(err);
										})
									}
									className='btn btn-info me-1'
									disabled={
										orderItems.status === "Delivered" ||
										orderItems.status === "Shipped"
									}
								>
									{statusLoading[orderItems.orderNumber] ? (
										<CircularProgress size={20} color='inherit' />
									) : (
										"נשלח"
									)}
								</button>
								<button
									onClick={() =>
										handleOrderStatus(
											"Shipped",
											orderItems.orderNumber,
											setOrderStatuses,
											setStatusLoading,
										).catch((err) => {
											showError(err);
										})
									}
									className='btn btn-success'
									disabled={orderItems.status === "Shipped"}
								>
									{statusLoading[orderItems.orderNumber] ? (
										<CircularProgress size={20} color='inherit' />
									) : (
										"נמסר"
									)}
								</button>
							</>
						)}
						<h1>{orderNumber}</h1>
					</div>
				</div>
				<div className='row  row-cols-1 row-cols-md-3 row-cols-lg-3 g-4'>
					{orderItems.products.map((product, index) => (
						<div key={product.product_image + index + 1} className='col'>
							<div className='card h-100 shadow-sm border-0 overflow-hidden'>
								<CardMedia
									component='img'
									height='194'
									image={product.product_image}
									alt={product.product_name}
									sx={{
										objectFit: "cover",
										transition: "transform 0.3s ease-in-out",
									}}
									onMouseOver={(e) =>
										(e.currentTarget.style.transform = "scale(1.05)")
									}
									onMouseOut={(e) =>
										(e.currentTarget.style.transform = "scale(1)")
									}
								/>
								<h5 className='card-title'>{product.product_name}</h5>
								<div className='card-body d-flex flex-column text-danger'>
									<h6>
										{product.discount
											? `הנחה ${product.discount}%`
											: ""}
									</h6>
									<h6 className='card-subtitle mb-2 text-muted'>
										כמות: {product.quantity}
									</h6>
									<h6 className='card-subtitle my-2 text-success fw-bold'>
										מחיר{" "}
										{product.product_price.toLocaleString("he-IL", {
											style: "currency",
											currency: "ILS",
										})}
									</h6>
									<h5>
										{product.discount < 0 ? "מחיר אחרי מבצע" : ""}
									</h5>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
};

export default OrderDetails;
