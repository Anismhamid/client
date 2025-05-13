import {FunctionComponent} from "react";
import {Order} from "../../../interfaces/Order";
import {Box, Button, Card, Chip, CircularProgress, Typography} from "@mui/material";
import {fontAwesomeIcon} from "../../../FontAwesome/Icons";
import {
	getStatusClass,
	getStatusText,
} from "../../../atoms/OrderStatusButtons/orderStatus";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {showError} from "../../../atoms/toasts/ReactToast";
import OrderStatusButtons from "../../../atoms/OrderStatusButtons/StatusButtons";
import {CardTitle} from "react-bootstrap";
import handleRTL from "../../../locales/handleRTL";

interface PreviousOrdersProps {
	setPrevious: Order[];
	orderStatuses: {[orderNumber: string]: string};
}

const PreviousOrders: FunctionComponent<PreviousOrdersProps> = ({
	setPrevious,
	orderStatuses,
}) => {
	const {t} = useTranslation();

	const navigate = useNavigate();

	const now: string = new Date().toLocaleString("he-IL", {
		year: "2-digit",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

	const diriction = handleRTL();
	return (
		<>
			{setPrevious.length > 0 && (
				<div className='mt-4'>
					<h4 className='text-danger'>הזמנות קודמות</h4>
					<div className='row'>
						{setPrevious.map(
							(order) =>
								order.date !== now && (
									<div
										key={order.orderNumber}
										className='mb-4 col-md-6 col-lg-4'
									>
										<Card
											dir={diriction}
											className='h-100 p-3 shadow'
										>
											<CardTitle className='text-center bg-primary text-white p-2 rounded'>
												<strong>{t("orderNumber")}</strong>{" "}
												{order.orderNumber}
											</CardTitle>
											<Box className='mb-3'>
												<Box className='my-1'>
													<strong className=''>
														{t("UserId")}
													</strong>
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
															orderStatuses[
																order.orderNumber
															],
															t,
														)}
														color={getStatusClass(
															order.orderNumber,
														)}
													/>
												</Box>
											</Box>
											{/* <Box className='mb-3 mx-auto text-center'>
												{canChangeStatus && (
													<OrderStatusButtons
														orderNumber={order.orderNumber}
														statusLoading={statusLoading}
														handleOrderStatus={
															handleOrderStatus
														}
														setOrderStatuses={
															setOrderStatuses
														}
														setStatusLoading={
															setStatusLoading
														}
														showError={showError}
														currentStatus={
															orderStatuses[
																order.orderNumber
															]
														}
													/>
												)}
											</Box> */}
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
														{fontAwesomeIcon.creditCard} |{" "}
														{t("creditCard")}
													</Typography>
												) : (
													<Typography
														sx={{
															color: "warning.main",
														}}
														variant='body1'
													>
														{fontAwesomeIcon.moneyBillWave} |{" "}
														{t("cash")}
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
														{fontAwesomeIcon.boxOpen} |{" "}
														{`${t("selfPickup")}`}
													</Typography>
												) : order.delivery &&
												  order.deliveryFee ? (
													<>
														<Typography
															component={"span"}
															className='text-primary d-block'
														>
															{fontAwesomeIcon.boxOpen} |{" "}
															{t("delivery")}
															<Typography
																component={"span"}
																className='text-primary px-1'
															>
																{order.deliveryFee.toLocaleString(
																	"he-IL",
																	{
																		style: "currency",
																		currency: "ILS",
																	},
																)}
															</Typography>
														</Typography>
													</>
												) : (
													<span className='text-muted'>
														לא נבחר
													</span>
												)}
											</Box>

											<div>
												<h5 className='text-center text-success'>
													<strong>{`${t("totalOrderPrice")}:`}</strong>{" "}
													{order.totalAmount.toLocaleString(
														"he-IL",
														{
															style: "currency",
															currency: "ILS",
														},
													)}
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
														navigate(
															`/orderDetails/${order.orderNumber}`,
														);
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
								),
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default PreviousOrders;
