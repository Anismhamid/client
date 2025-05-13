import {FunctionComponent} from "react";
import {Order} from "../../../interfaces/Order";
import {
	getStatusClass,
	getStatusText,
	handleOrderStatus,
} from "../../../atoms/OrderStatusButtons/orderStatus";
import {Box, Button, Chip, CircularProgress} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useUser} from "../../../context/useUSer";
import RoleType from "../../../interfaces/UserType";
import OrderStatusButtons from "../../../atoms/OrderStatusButtons/StatusButtons";
import {showError} from "../../../atoms/toasts/ReactToast";
import {fontAwesomeIcon} from "../../../FontAwesome/Icons";
import {useNavigate} from "react-router-dom";

interface NewOrdersProps {
	filteredOrders: Order[];
	setOrderStatuses: React.Dispatch<
		React.SetStateAction<{[orderNumber: string]: string}>
	>;
	setStatusLoading: React.Dispatch<
		React.SetStateAction<{[orderNumber: string]: boolean}>
	>;

	orderStatuses: {[orderNumber: string]: string};
	statusLoading: {[orderNumber: string]: boolean};
}

const NewOrders: FunctionComponent<NewOrdersProps> = ({
	setOrderStatuses,
	setStatusLoading,
	statusLoading,
	filteredOrders,
	orderStatuses,
}) => {
	const {auth} = useUser();

	const {t} = useTranslation();
	const navigate = useNavigate();

	filteredOrders.forEach((order) => {
		if (!order.phone) {
			console.warn("Missing phone field for order:", order.orderNumber);
		}
	});
	const canChangeStatus =
		auth && (auth.role === RoleType.Admin || auth.role === RoleType.Moderator);

	return (
		<div className='row mt-5'>
			{filteredOrders.length ? (
				filteredOrders.map((order) => (
					<div key={order.orderNumber} className='mb-4 col-md-6 col-lg-4'>
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
									{new Date(order.date).toLocaleString("he-IL", {
										year: "2-digit",
										month: "short",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
								<div className='text-start mt-3'>
									<strong>טלפון מזמין:</strong>
									{order.phone?.phone_1 ??
										order.phone?.phone_2 ??
										"לא זמין"}
								</div>
								<div className='text-start my-3'>
									<strong>כתובת מזמין:</strong>
									{order.address
										? `${order.address.city}, ${order.address.street}, ${order.address.houseNumber}`
										: "לא זמין"}
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
										currentStatus={orderStatuses[order.orderNumber]}
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
								) : order.delivery && order.deliveryFee ? (
									<span className='text-primary'>
										{fontAwesomeIcon.boxOpen}
										{order.deliveryFee.toLocaleString("he-IL", {
											style: "currency",
											currency: "ILS",
										})}
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

							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									mt: 3,
								}}
								className='d-flex justify-content-center mt-3'
							>
								<Button
									startIcon={
										statusLoading[order.orderNumber] ? (
											<CircularProgress size={18} color='inherit' />
										) : null
									}
									onClick={() => {
										navigate(`/orderDetails/${order.orderNumber}`);
									}}
									variant='contained'
									color='info'
									size='small'
								>
									פרטי הזמנה
								</Button>
							</Box>
						</div>
					</div>
				))
			) : (
				<div className='text-center text-danger fs-4'>אין הזמנות עדיין</div>
			)}
		</div>
	);
};

export default NewOrders;
