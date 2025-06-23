import {FunctionComponent, useEffect, useRef, useState} from "react";
import {DeleteCartItems, getCartItems} from "../../services/cart";
import {Cart as CartType} from "../../interfaces/Cart";
import useToken from "../../hooks/useToken";
import {Link, useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";
import NavigathionButtons from "../../atoms/productsManage/NavigathionButtons";
import Loader from "../../atoms/loader/Loader";
import {fontAwesomeIcon} from "../../FontAwesome/Icons";
import {Button, IconButton, Tooltip} from "@mui/material";
import {useCartItems} from "../../context/useCart";
import {Products} from "../../interfaces/Products";
import {showError, showSuccess} from "../../atoms/toasts/ReactToast";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardIos";
import {formatPrice} from "../../helpers/dateAndPriceFormat";

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
		formRef.current?.scrollIntoView({behavior: "smooth"});
	};

	/**
	 * Deleteing product from cart by name
	 * @param product_name
	 */
	const handleDelete = (product_name: string) => {
		setItems((prev: CartType[]) => {
			return prev.map((item: any) => {
				const updatedProducts = item.products.filter(
					(product: Products) => product.product_name !== product_name,
				);

				return {...item, products: updatedProducts};
			});
		});

		DeleteCartItems(product_name)
			.then(() => {
				showSuccess("the item has been removed from cart");
			})
			.catch((err) => {
				console.log(err);

				showError("Error while deleting item:");
			});
		setQuantity((prev) => prev - 1);
	};

	// Calculate total amount of the cart
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

	useEffect(() => {
		if (decodedToken) {
			getCartItems()
				.then((cartItems) => {
					setItems(cartItems);
				})
				.catch(() => {})
				.finally(() => setLoading(false));
		}
	}, [decodedToken]);

	const totalAmount = calculateTotalAmount(items);

	if (loading) {
		return <Loader />;
	}

	return (
		<main>
			<div className='container py-5'>
				{items[0].products.length && (
					<div className=' text-center m-auto my-5'>
						<Button
							variant='contained'
							color='primary'
							onClick={scrollToContent}
						>
							{fontAwesomeIcon.arrowDown}{" "}
							<span className='ms-3'>לתשלום</span>
						</Button>
					</div>
				)}
				<h1 className='text-center'>סל קניות</h1>
				<IconButton onClick={() => navigate(-1)} aria-label='back'>
					<ArrowForwardIcon sx={{fontSize: "2rem"}} color='error' />
				</IconButton>
				<ul className='list-group'>
					{items[0].products.length ? (
						items.map((item, index) => (
							<div key={index}>
								{item.products.map((product) => (
									<li
										key={product.product_name}
										className='mt-3 list-group-item d-flex justify-content-between align-items-center rounded-4'
									>
										<div
											ref={formRef}
											className=' d-flex align-items-center flex-wrap pe-2'
										>
											<Link
												to={`/product-details/${encodeURIComponent(product.product_name)}`}
											>
												<img
													style={{
														height: "200px",
													}}
													className='img-fluid me-5 rounded'
													src={product.product_image}
													alt={product.product_name}
												/>
											</Link>
											{product.sale ? (
												<>
													<h5 className='text-muted m-3'>
														{formatPrice(
															product.product_price,
														)}
													</h5>
													<strong className='me-2 text-danger'>
														הנחה {product.discount}% |
													</strong>
												</>
											) : (
												<h5 className='text-muted m-3'>
													{formatPrice(product.product_price)}
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
									<strong>סך הכל:</strong> {formatPrice(totalAmount)}
								</h4>

								<div className='d-flex justify-content-center mt-3'>
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
						<>
							<h5 className='text-danger text-center'>אין מוצרים בסל</h5>
							<NavigathionButtons />
						</>
					)}
				</ul>
			</div>
		</main>
	);
};

export default Cart;
