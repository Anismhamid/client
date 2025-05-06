import {FunctionComponent} from "react";
import {Order} from "../../../interfaces/Order";
import {Link} from "react-router-dom";

interface IncompleteOrdersProps {
	incompleteOrders: Order[];
}

const IncompleteOrders: FunctionComponent<IncompleteOrdersProps> = ({
	incompleteOrders,
}) => {
	return (
		<>
			{incompleteOrders.length > 0 && (
				<div className='mt-4'>
					<h4 className='text-danger'>הזמנות חסרות מידע:</h4>
					<div className='row'>
						{incompleteOrders.map((order) => (
							<div
								key={order.orderNumber}
								className='col-md-6 col-lg-4 mb-3'
							>
								<Link
									className='text-decoration-none'
									to={`/orderDetails/${order.orderNumber}`}
								>
									<div className='card border-danger p-3'>
										<h5 className='text-center text-danger'>
											הזמנה: {order.orderNumber}
										</h5>
										<p>
											<strong>טלפון:</strong>
											<span className='text-danger'>חסר</span>
										</p>
										<p>
											<strong>כתובת:</strong>
											<span className='text-danger'>
												חסרה כתובת
											</span>
										</p>
									</div>
								</Link>
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);
};

export default IncompleteOrders;
