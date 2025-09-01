import {FunctionComponent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Loader from "../../../atoms/loader/Loader";
import useOrderDetails from "../../../hooks/useOrderDetails";
import {useUser} from "../../../context/useUSer";
import RoleType from "../../../interfaces/UserType";
import {
	getStatusClass,
	getStatusText,
	handleOrderStatus,
} from "../../../atoms/OrderStatusButtons/orderStatus";
import {Box, Card, CardContent, CardMedia, Chip, Grid, Typography} from "@mui/material";
import {showError} from "../../../atoms/toasts/ReactToast";
import {useTranslation} from "react-i18next";
import OrderStatusButtons from "../../../atoms/OrderStatusButtons/StatusButtons";
import handleRTL from "../../../locales/handleRTL";
import {CardBody} from "react-bootstrap";
import {formatPrice} from "../../../helpers/dateAndPriceFormat";

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
			<Typography
				variant='h4'
				className='text-center bg-primary text-white rounded p-3 mb-4'
			>
				{"لم يتم العثور على منتجات في هذا الطلب"}
			</Typography>
		);

	const currentStatus = orderStatuses[orderItems.orderNumber];

	const canChangeStatus =
		auth && (auth.role === RoleType.Admin || auth.role === RoleType.Moderator);

	const diriction = handleRTL();

	return (
		<Box component={"main"} dir={diriction}>
			<Box sx={{padding: 5}} className='container p-3'>
				<Box className='text-center bg-gradient p-4 rounded shadow-sm'>
					<Typography variant='h4' className='text-center mb-4'>
						{orderNumber}
					</Typography>

					<Box className='d-flex justify-content-between align-items-center mb-3 flex-wrap'>
						<Box className='d-flex align-items-center gap-2'>
							<strong>{t("currentStatus")}:</strong>
							<Chip
								label={getStatusText(currentStatus, t)}
								color={getStatusClass(currentStatus)}
							/>
						</Box>

						{canChangeStatus && (
							<Box className='d-flex gap-2 flex-wrap mt-3'>
								<OrderStatusButtons
									orderNumber={orderItems.orderNumber}
									statusLoading={statusLoading}
									handleOrderStatus={handleOrderStatus}
									setOrderStatuses={setOrderStatuses}
									setStatusLoading={setStatusLoading}
									showError={showError}
									currentStatus={orderStatuses[orderItems.orderNumber]}
								/>
							</Box>
						)}
					</Box>
				</Box>

				<Grid className='row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 mt-4'>
					{orderItems.products.map((product, index) => {
						const finalPrice =
							product.discount > 0
								? product.product_price * (1 - product.discount / 100)
								: product.product_price;

						return (
							<Box key={product.product_image + index} className='col'>
								<Card className='card h-100 shadow-sm border-0 overflow-hidden'>
									<CardMedia
										component='img'
										height='200'
										image={product.product_image}
										alt={product.product_name}
										sx={{
											objectFit: "cover",
											transition: "transform 0.3s ease-in-out",
										}}
									/>
									<CardBody className='card-body'>
										<CardContent>
											<Typography variant='h5'>
												{product.product_name}
											</Typography>

											{product.discount > 0 && (
												<Chip
													label={`${product.discount}% ${t("הנחה")}`}
													color='error'
													size='small'
													className='mb-2'
												/>
											)}

											<Typography variant='body1'>
												{t("quantity")}: {product.quantity}
											</Typography>

											{product.discount > 0 && (
												<Typography
													color='error'
													variant='inherit'
													className='fw-semibold'
												>
													{t("priceAfterDiscount")}
												</Typography>
											)}
											<Typography
												variant='body1'
												className='text-success fw-bold'
											>
												{t("price")}:{formatPrice(finalPrice)}
											</Typography>
										</CardContent>
									</CardBody>
								</Card>
							</Box>
						);
					})}
				</Grid>
			</Box>
		</Box>
	);
};

export default OrderDetails;
