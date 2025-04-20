import {FunctionComponent, useEffect, useRef, useState} from "react";
import {DeleteCartItems, getCartItems} from "../services/cart";
import {Cart as CartType} from "../interfaces/Cart";
import useToken from "../hooks/useToken";
import {useNavigate} from "react-router-dom";
import {path} from "../routes/routes";
import NavigathionButtons from "../atoms/NavigathionButtons";
import Loader from "../atoms/loader/Loader";
import {fontAwesomeIcon} from "../FontAwesome/Icons";
import {Button, Tooltip} from "@mui/material";
import {useCartItems} from "../context/useCart";

interface CartProps {}

/**
 * Cart
 * @returns Cart items
 */
const Cart: FunctionComponent<CartProps> = () => {
	const [items, setItems] = useState<CartType[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const {decodedToken} = useToken();
	const navigate = useNavigate();
	const {setQuantity} = useCartItems();
	const formRef = useRef<HTMLDivElement | null>(null);

	const scrollToContent = () => {
		if (formRef.current) {
			const yOffset = -500;
			const y =
				formRef.current.getBoundingClientRect().top +
				window.pageYOffset +
				yOffset;
			window.scrollTo({top: y, behavior: "smooth"});
		}
	};

	/**
	 * Deleteing product from cart by name
	 * @param product_name
	 */
	const handleDelete = (product_name: string) => {
		setItems((prev: CartType[]) => {
			return prev.map((item: any) => {
				const updatedProducts = item.products.filter(
					(product: any) => product.product_name !== product_name,
				);

				return {...item, products: updatedProducts};
			});
		});

		DeleteCartItems(product_name).catch((err) => {
			console.error("Error deleting item:", err);
		});
		setQuantity((prev) => prev - 1);
	};

	// Calculate total amount of the cart, only considering items that have valid products
	const calculateTotalAmount = (cartItems: CartType[]): number => {
		return cartItems.reduce((total, item) => {
			return (
				total +
				item.products.reduce((productTotal, product) => {
					return productTotal + product.product_price;
				}, 0)
			);
		}, 0);
	};

	// Fetch cart items when the component mounts
	useEffect(() => {
		if (decodedToken) {
			getCartItems()
				.then((cartItems) => {
					setItems(cartItems);
					setLoading(false);
				})
				.catch((err) => {
					console.error(err);
					setLoading(false);
				});
		}
	}, [decodedToken]);

	const totalAmount = calculateTotalAmount(items);

	if (loading) {
		return <Loader />;
	}

	return (
		<main className=' min-vh-100'>
			<div className='container'>
				<div className=' text-center m-auto'>
					<Button variant='contained' color='primary' onClick={scrollToContent}>
						לתשלום
					</Button>
				</div>
				<h1 className='text-center'>סל קניות</h1>
				<ul className='list-group'>
					{items.length ? (
						items.map((item, index) => (
							<div key={index} className=''>
								{item.products.map((product) => (
									<li
										key={product.product_name}
										className='my-3 list-group-item d-flex justify-content-between align-items-center rounded-4'
									>
										<div className='border rounded-3 pe-2'>
											<img
												style={{
													height: "150px",
													width: "150px",
												}}
												className='img-fluid me-5 rounded'
												src={product.product_image}
												alt={product.product_name}
											/>
											{product.sale ? (
												<>
													<h5 className='text-muted m-3'>
														{product.product_price.toLocaleString(
															"he-IL",
															{
																style: "currency",
																currency: "ILS",
															},
														)}
													</h5>
													<strong className='me-2 text-danger'>
														במבצע {product.discount}% |
													</strong>
												</>
											) : (
												<h5 className='text-muted m-3'>
													{product.product_price.toLocaleString(
														"he-IL",
														{
															style: "currency",
															currency: "ILS",
														},
													)}
												</h5>
											)}
											<strong>{product.product_name}</strong> -
											{product.quantity} ק"ג{" "}
										</div>
										<Tooltip title='Delete'>
											<button
												onClick={() => {
													handleDelete(product.product_name);
												}}
												className='btn  m-auto text-danger bg-danger-subtle'
											>
												{fontAwesomeIcon.trash}
											</button>
										</Tooltip>
									</li>
								))}
								<h4 className='text-right my-5'>
									<strong>סך הכל:</strong>{" "}
									{totalAmount.toLocaleString("he-IL", {
										style: "currency",
										currency: "ILS",
									})}
								</h4>

								<div
									ref={formRef}
									className='d-flex justify-content-center mt-3'
								>
									<Button
										variant='contained'
										color='primary'
										disabled={totalAmount == 0}
										onClick={() => navigate(path.Checkout)}
									>
										המשך לקופה
									</Button>
								</div>
								<NavigathionButtons />
							</div>
						))
					) : (
						<h5 className='text-danger'>אין מוצרים בסל</h5>
					)}
				</ul>
			</div>
		</main>
	);
};

export default Cart;
