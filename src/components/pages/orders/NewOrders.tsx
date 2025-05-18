import {FunctionComponent} from "react";
import {Order} from "../../../interfaces/Order";
import {
	getStatusClass,
	getStatusText,
	handleOrderStatus,
} from "../../../atoms/OrderStatusButtons/orderStatus";
import {Box, Button, Card, Chip, CircularProgress, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useUser} from "../../../context/useUSer";
import RoleType from "../../../interfaces/UserType";
import OrderStatusButtons from "../../../atoms/OrderStatusButtons/StatusButtons";
import {showError} from "../../../atoms/toasts/ReactToast";
import {fontAwesomeIcon} from "../../../FontAwesome/Icons";
import {useNavigate} from "react-router-dom";
import handleRTL from "../../../locales/handleRTL";
import {CardTitle} from "react-bootstrap";
import {formatDate, formatPrice} from "../../../helpers/dateAndPriceFormat";

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

	const canChangeStatus =
		auth && (auth.role === RoleType.Admin || auth.role === RoleType.Moderator);

	const diriction = handleRTL();

	return (
		<Box dir={diriction} className='row mt-5'>
			{filteredOrders.length ? (
				filteredOrders.map((order) => (
					<Box
						key={order.orderNumber}
						className='mb-4 col-md-6 col-lg-4 col-xl-3 '
					>
						<Card dir={diriction} className='h-100 p-3 shadow'>
							<CardTitle className='text-center bg-primary text-white p-2 rounded'>
								<strong>{t("orderNumber")}</strong> {order.orderNumber}
							</CardTitle>
							<Box className='mb-3'>
								<Box className='my-1'>
									<strong className=''>{t("UserId")}</strong>
									<span className='fw-bold rounded d-block text-danger'>
										{order.userId}
									</span>
								</Box>
								<Box>
									<Typography
										className='fw-bold p-1'
										component={"strong"}
									>
										{t("date")}:
									</Typography>
									{formatDate(order.date)}
								</Box>
								<Box className='mt-3'>
									<Typography
										className='fw-bold p-1'
										component={"span"}
									>
										{t("phone")}:
									</Typography>
									{order.phone?.phone_1 ??
										order.phone?.phone_2 ??
										"לא זמין"}
								</Box>
								<Box className='my-3'>
									<Typography
										className='p-1 fw-bold'
										component={"span"}
									>
										{t("address")}:
									</Typography>
									{order.address
										? `${order.address.city}, ${order.address.street}, ${order.address.houseNumber}`
										: "לא זמין"}
								</Box>
								<Box className='mt-1'>
									<Typography
										className='p-1 fw-bold'
										component={"strong"}
									>
										{t("currentStatus")}:
									</Typography>
									<Chip
										label={getStatusText(
											orderStatuses[order.orderNumber],
											t,
										)}
										color={getStatusClass(order.orderNumber)}
									/>
								</Box>
							</Box>
							<Box className='mb-3 mx-auto text-center'>
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
							</Box>
							<Box className='mb-3 border p-1'>
								<Typography
									component='strong'
									variant='body1'
									sx={{px: 1, fontWeight: "bold"}}
								>
									{t("paymentMethod")}
								</Typography>

								{order.payment ? (
									<Typography
										sx={{
											color: "success.main",
										}}
										variant='body1'
									>
										{fontAwesomeIcon.creditCard} | {t("creditCard")}
									</Typography>
								) : (
									<Typography
										sx={{
											color: "warning.main",
										}}
										variant='body1'
									>
										{fontAwesomeIcon.moneyBillWave} | {t("cash")}
									</Typography>
								)}
							</Box>

							<Box className='mb-3 border p-1'>
								<Typography
									component={"strong"}
									variant='body1'
									sx={{p: 1, fontWeight: "bold"}}
								>{`${t("collectionMethod")}`}</Typography>
								{order.selfCollection ? (
									<Typography
										component={"span"}
										className='text-info d-block'
									>
										{fontAwesomeIcon.boxOpen} | {`${t("selfPickup")}`}
									</Typography>
								) : order.delivery && order.deliveryFee ? (
									<>
										<Typography
											component={"span"}
											className='text-primary d-block'
										>
											{fontAwesomeIcon.boxOpen} | {t("delivery")}
											<Typography
												component={"span"}
												className='text-primary px-1'
											>
												{formatPrice(order.deliveryFee)}
											</Typography>
										</Typography>
									</>
								) : (
									<span className='text-muted'>לא נבחר</span>
								)}
							</Box>

							<div>
								<h5 className='text-center text-success'>
									<strong>{`${t("totalOrderPrice")}:`}</strong>{" "}
									{formatPrice(order.totalAmount)}
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
						</Card>
					</Box>
				))
			) : (
				<div className='text-center text-danger fs-4'>אין הזמנות עדיין</div>
			)}
		</Box>
	);
};

export default NewOrders;
