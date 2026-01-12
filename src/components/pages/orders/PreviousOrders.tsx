import {FunctionComponent} from "react";
import {Order} from "../../../interfaces/Order";
import {Box, Button, Card, Chip, Typography} from "@mui/material";
import {fontAwesomeIcon} from "../../../FontAwesome/Icons";
import {
	getStatusClass,
	getStatusText,
} from "../../../atoms/OrderStatusButtons/orderStatus";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {CardTitle} from "react-bootstrap";
import handleRTL from "../../../locales/handleRTL";
import {formatDate, formatPrice} from "../../../helpers/dateAndPriceFormat";

interface PreviousOrdersProps {
	previous: Order[];
	orderStatuses: {[orderNumber: string]: string};
}

const PreviousOrders: FunctionComponent<PreviousOrdersProps> = ({
	previous,
	orderStatuses,
}) => {
	const {t} = useTranslation();

	const navigate = useNavigate();

	const nonTodayOrders = previous.filter((order) => order.status === "Shipped");
	const ordersToDisplay = nonTodayOrders;

	const diriction = handleRTL();

	return (
		<Box dir={diriction} className='row mt-5'>
			<Typography
				textAlign={"center"}
				variant='h4'
				className='fw-bold p-1'
				component={"h1"}
				my={3}
			>
				الطلبات المكتمله
			</Typography>
			{ordersToDisplay.length > 0 ? (
				previous.map((order) => (
					<div key={order.orderNumber} className='mb-4 col-md-6 col-lg-4'>
						<Card dir={diriction} className='h-100 p-3 shadow'>
							<CardTitle className='text-center bg-primary text-white p-2 rounded'>
								<strong>{t("orderNumber")}</strong> {order.orderNumber}
							</CardTitle>
							<Box className='mb-3'>
								<Box className='my-1'>
									<strong className=''>{t("UserId")}</strong>
									<span className='fw-bold rounded d-block text-danger'>
										{typeof order.user === "string"
											? order.user
											: (order.user?._id ?? "غير متوفر")}
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
					</div>
				))
			) : (
				<></>
			)}
		</Box>
	);
};

export default PreviousOrders;
