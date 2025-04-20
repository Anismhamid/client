import {FunctionComponent} from "react";
import {useParams} from "react-router-dom";
import Loader from "../atoms/loader/Loader";
import useOrderDetails from "../hooks/useOrderDetails";
import {useUser} from "../context/useUSer";
import RoleType from "../interfaces/UserType";

interface OrderDetailsProps {}

/**
 * Order products Details
 * @returns Order products
 */
const OrderDetails: FunctionComponent<OrderDetailsProps> = () => {
	const {orderNumber} = useParams<{orderNumber: string}>();
	const {cartItems, loading, error} = useOrderDetails(orderNumber as string);
	const {auth} = useUser();
	if (loading) {
		return <Loader />;
	}

	if (error) {
		return <div>{error}</div>;
	}

	if (!cartItems) {
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
						{((auth && auth.role === RoleType.Admin) ||
							(auth && auth.role === RoleType.Moderator)) && (
							<>
								<button
									// onClick={() =>
									// 	handleStatus("Preparing", order.orderNumber)
									// }
									className='btn btn-primary me-3'
									// disabled={
									// 	order.status === "Preparing" ||
									// 	order.status === "Delivered" ||
									// 	order.status === "Shipped"
									// }
								>
									{/* {statusLoading[order.orderNumber]
										? "טוען..."
										: "הכנה"} */}
									הכנה
								</button>
								<button
									// onClick={() =>
									// 	handleStatus("Delivered", order.orderNumber)
									// }
									className='btn btn-info me-3'
									// disabled={
									// 	order.status === "Delivered" ||
									// 	order.status === "Shipped"
									// }
								>
									{/* {statusLoading[order.orderNumber]
										? "טוען..."
										: "נשלח"} */}
									נשלח
								</button>
								<button
									// onClick={() =>
									// 	handleStatus("Shipped", order.orderNumber)
									// }
									className='btn btn-success'
									// disabled={order.status === "Shipped"}
								>
									{/* {statusLoading[order.orderNumber]
										? "טוען..."
										: "נמסר"} */}
									נמסר
								</button>
							</>
						)}
						<h1>{orderNumber}</h1>
					</div>
				</div>
				<div className='row  row-cols-1 row-cols-md-3 row-cols-lg-3 g-4'>
					{cartItems.products.map((product, index) => (
						<div key={product.product_image + index + 1} className='col'>
							<div className='card h-100 shadow-sm border-0'>
								<img
									src={product.product_image}
									alt={product.product_name || "Product image"}
									className='card-img-top'
									role='img'
									style={{height: "250px"}}
								/>
								<div className='card-body d-flex flex-column'>
									<h5 className='card-title'>{product.product_name}</h5>
									<h5>
										{product.sale ? `מבצע${product.discount}` : ""}
									</h5>
									<h6 className='card-subtitle mb-2 text-muted'>
										כמות: {product.quantity}
									</h6>
									<h6 className='card-subtitle mb-2 text-success fw-bold fs-5'>
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
