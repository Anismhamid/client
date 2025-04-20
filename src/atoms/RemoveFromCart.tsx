import {FunctionComponent} from "react";

interface RemoveFromCartModalProps {
	show: boolean;
	onHide: Function;
	cart: {[key: string]: {fruit: any; quantity: number}};
	removeFromCart: (fruitName: string) => void;
}

const RemoveFromCartModal: FunctionComponent<RemoveFromCartModalProps> = ({
	show,
	onHide,
	cart,
	removeFromCart,
}) => {
	const totalAmount = Object.values(cart).reduce(
		(total, item) => total + item.fruit.price * item.quantity,
		0,
	);

	return (
		<div
			className={`modal fade ${show ? "show" : ""}`}
			style={{display: show ? "block" : "none"}}
			tabIndex={-1}
			aria-labelledby='cartModalLabel'
			aria-hidden='true'
		>
			<div className='modal-dialog'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title' id='cartModalLabel'>
							הסל שלי
						</h5>
						<button
							type='button'
							className='btn-close'
							onClick={() => onHide(false)}
						></button>
					</div>
					<div className='modal-body'>
						<ul className='list-group'>
							{Object.entries(cart).map(
								([fruitName, {fruit, quantity}]) => (
									<li
										className='list-group-item d-flex justify-content-between align-items-center'
										key={fruit._id}
									>
										{fruit.product_name} - {quantity} ק"ג
										<button
											onClick={() => removeFromCart(fruitName)}
											className='btn btn-danger btn-sm'
										>
											מחיקה
										</button>
									</li>
								),
							)}
						</ul>
						<hr />
						<h5>
							סך הכל:
							{totalAmount.toLocaleString("he-IL", {
								style: "currency",
								currency: "ILS",
							})}
						</h5>
					</div>
					<div className='modal-footer'>
						<button
							type='button'
							className='btn btn-secondary'
							onClick={() => onHide(false)}
						>
							סגור
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RemoveFromCartModal;
