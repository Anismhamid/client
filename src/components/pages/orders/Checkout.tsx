import {FunctionComponent, useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Cart as CartType} from "../../../interfaces/Cart";
import {getCartItems} from "../../../services/cart";
import {path} from "../../../routes/routes";
import {postOrder} from "../../../services/orders";
import {useFormik} from "formik";
import * as yup from "yup";
import {showError, showInfo} from "../../../atoms/toasts/ReactToast";
import Loader from "../../../atoms/loader/Loader";
import {Order} from "../../../interfaces/Order";
import Checkbox from "@mui/material/Checkbox";
import {useUser} from "../../../context/useUSer";
import {Button, CircularProgress} from "@mui/material";
import PaymentModal from "../../../atoms/pymentModal/PymentModal";
import {useCartItems} from "../../../context/useCart";
import {getBusinessInfo} from "../../../services/businessInfo";
import handleRTL from "../../../locales/handleRTL";

interface CheckoutProps {}
/**
 * Auths checkout
 * @returns chooise of payments and delivery
 */
const Checkout: FunctionComponent<CheckoutProps> = () => {
	const {auth} = useUser();
	const navigate = useNavigate();
	const [cartItems, setCartItems] = useState<CartType[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [, setOrderDetails] = useState<Order | null>(null);
	const [newOrder, setNewOrder] = useState<Order | null>(null);
	const [showPymentModal, setShowPymentModal] = useState<boolean>(false);
	const formRef = useRef<HTMLFormElement | null>(null);
	const [deliveryFee, setDeliveryFee] = useState<number>(0);

	const onShowPymentModal = () => setShowPymentModal(true);
	const hidePymentModal = () => setShowPymentModal(false);
	const {setQuantity} = useCartItems();

	const scrollToContent = () => {
		if (formRef.current) {
			const yOffset = -200;
			const y =
				formRef.current.getBoundingClientRect().top +
				window.pageYOffset +
				yOffset;
			window.scrollTo({top: y, behavior: "smooth"});
		}
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			payment: false,
			cashOnDelivery: false,
			selfCollection: false,
			delivery: false,
			sale: false,
			discount: 0,
			totalAmount: 0,
			phone: {
				phone_1: auth.phone.phone_1,
				phone_2: auth.phone.phone_1,
			},
			address: {
				city: auth.address?.city || "",
				street: auth.address?.street || "",
				houseNumber: auth.address?.houseNumber || "",
			},
		},
		validationSchema: yup.object({
			payment: yup.boolean().required(),
			cashOnDelivery: yup.boolean().required(),
			selfCollection: yup.boolean().required(),
			delivery: yup.boolean().required(),
			sale: yup.boolean().required(),
			discount: yup.number().required(),
			totalAmount: yup.number().required(),
			phone: yup.object({
				phone_1: yup.string(),
				phone_2: yup.string(),
			}),
			address: yup.object({
				city: yup.string().required(),
				street: yup.string().required(),
				houseNumber: yup.string().required(),
			}),
		}),
		onSubmit: (value) => {
			handleCheckout(value).catch((err) => {
				console.log(err);
			});
		},
	});

	useEffect(() => {
		if (auth) {
			getBusinessInfo()
				.then((res) => {
					setDeliveryFee(res.deliveryFee || 0);
				})
				.then(() => {
					getCartItems()
						.then((items) => {
							setCartItems(items);
						})
						.catch(() => {
							showError("שגיאה בטעינת הסל או המידע העסקי");
						})
						.finally(() => setLoading(false));
				});
		}
	}, [auth]);

	// Calculate total amount of the cart
	const totalAmount = cartItems.reduce((total, item) => {
		return (
			total +
			item.products.reduce(
				(productTotal, product) => productTotal + product.product_price,
				0,
			)
		);
	}, 0);

	const discountedAmount = totalAmount - (totalAmount * formik.values.discount) / 100;

	const finalAmount = formik.values.delivery
		? discountedAmount + deliveryFee
		: discountedAmount;

	const handleCheckout = async (value: {
		payment: boolean;
		cashOnDelivery: boolean;
		selfCollection: boolean;
		delivery: boolean;
		sale: boolean;
		discount: number;
	}) => {
		const itemsToOrder = cartItems.flatMap((item) =>
			item.products.map((product) => ({
				product_name: product.product_name,
				product_image: product.product_image,
				product_price: product.product_price,
				quantity: product.quantity,
				sale: product.sale,
				discount: product.discount,
			})),
		);

		const newOrder = {
			userId: auth._id,
			products: [...itemsToOrder],
			payment: value.payment,
			cashOnDelivery: value.cashOnDelivery,
			selfCollection: value.selfCollection,
			delivery: value.delivery,
			deliveryFee: value.delivery ? deliveryFee : 0,
			totalAmount: finalAmount,
			phone: {
				phone_1: auth.phone?.phone_1 || "",
				phone_2: auth.phone?.phone_2 || "",
			},
			address: {
				city: auth.address?.city,
				street: auth.address?.street,
				houseNumber: auth.address?.houseNumber || "",
			},
		};

		setNewOrder(newOrder as Order);
		try {
			if (value.payment) {
				setLoading(true);
				onShowPymentModal();
				setLoading(false);
			} else {
				await postOrder(newOrder as Order);
				setOrderDetails(newOrder as Order);
				navigate(path.AllTheOrders);
				showInfo("في انتظار الموافقة على طلبك");
				setQuantity((prev) => prev - prev);
			}

			setLoading(false);
		} catch (error) {
			showError("حدث خطأ أثناء تقديم الطلب");
		}
	};

	if (loading) return <Loader />;
	const diriction = handleRTL();
	return (
		<main dir={diriction} className='lead '>
			<div className='container'>
				<h1 className='text-center'>اختيار طريقة الدفع والاستلام</h1>
				<div className=' text-center m-auto'>
					<Button variant='contained' color='primary' onClick={scrollToContent}>
						انتقال للدفع مباشرة
					</Button>
				</div>

				{/* Cart Summary */}
				<section className='mt-4 bg-gradient p-3'>
					<h4>ملخص السلة</h4>
					<ul className='list-group'>
						{cartItems.length ? (
							cartItems.map((item) => (
								<div key={item._id} className=' rounded-3'>
									{item.products.map((product) => (
										<li
											key={product.product_name}
											className='list-group-item d-flex align-items-center justify-content-between'
										>
											<img
												className='img-fluid rounded'
												src={product.product_image}
												alt={product.product_name}
												style={{width: "100px"}}
											/>
											<div className=''>
												<strong>{product.product_name}</strong>
												<h6>
													{product.discount
														? `تخفيض ${product.discount}%`
														: ""}
												</h6>
											</div>
											<div className='text-muted text-danger fw-bold'>
												{product.product_price.toLocaleString(
													"he-IL",
													{
														style: "currency",
														currency: "ILS",
													},
												)}
											</div>
										</li>
									))}
								</div>
							))
						) : (
							<h5 className='text-danger'>لا يوجد منتجات في السلة</h5>
						)}
					</ul>
				</section>

				{/* Payment Methods Selection */}
				<section className='bg-gradient p-3 rounded-3 my-5'>
					<form ref={formRef} onSubmit={formik.handleSubmit} className='mt-5'>
						<h4>اختر طريقة الدفع</h4>
						<fieldset disabled={formik.isSubmitting}>
							<div className='mt-3'>
								<div className='form-check mb-2'>
									<Checkbox
										id='payment'
										name='payment'
										checked={formik.values.payment}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										disabled={formik.values.cashOnDelivery}
									/>
									<label htmlFor='payment' className='form-check-label'>
										بطاقة إئتمان
									</label>
								</div>
								<div className='form-check'>
									<Checkbox
										id='cashOnDelivery'
										name='cashOnDelivery'
										checked={formik.values.cashOnDelivery}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										disabled={formik.values.payment}
									/>
									<label
										htmlFor='cashOnDelivery'
										className='form-check-label'
									>
										نقدي
									</label>
								</div>
							</div>

							<h4 className='mt-5'>اختر طريقة الاستلام</h4>
							<div>
								<div className='form-check'>
									<Checkbox
										id='selfCollection'
										name='selfCollection'
										checked={formik.values.selfCollection}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										disabled={formik.values.delivery}
									/>
									<label
										htmlFor='selfCollection'
										className='form-check-label'
									>
										استلام ذاتي
									</label>
								</div>
								<div className='form-check'>
									<Checkbox
										id='delivery'
										name='delivery'
										checked={formik.values.delivery}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										disabled={formik.values.selfCollection}
									/>
									<label
										htmlFor='delivery'
										className='form-check-label'
									>
										خدمة توصيل
										<span className='text-danger fw-bold ms-2'>
											+{" "}
											{deliveryFee.toLocaleString("he-IL", {
												style: "currency",
												currency: "ILS",
											})}
										</span>
									</label>
								</div>
							</div>

							{/* new coppon */}
							<div className='form-group mt-3'>
								<label htmlFor='discount'>קופון הנחה</label>
								<input
									disabled
									type='text'
									name='discount'
									className='form-control w-25'
									value={formik.values.discount}
									onChange={formik.handleChange}
								/>
							</div>

							<hr />
							{/* --- Total Display --- */}
							<div>
								<div className='text-primary fw-bold bg-white border p-2'>
									<h5 className='text-danger'>כתובת למשלוח:</h5>{" "}
									<p>
										{formik.values.address.city},
										{formik.values.address.street}{" "}
										{formik.values.address.houseNumber}
									</p>
								</div>
								<div className=' text-center mt-5'>
									<strong className='me-2 fw-bold'>סך הכל</strong>
									<input
										type='text'
										name='totalAmount'
										value={finalAmount.toLocaleString("he-IL", {
											style: "currency",
											currency: "ILS",
										})}
										className='form-control bg-black text-light border-0 fs-4 text-center w-50 m-auto'
										disabled
									/>
								</div>
							</div>

							{/* --- Submit Button --- */}
							<div className=' d-flex align-items-start my-5'>
								<Button
									type='submit'
									disabled={
										formik.isSubmitting ||
										(!formik.values.payment &&
											!formik.values.cashOnDelivery) ||
										(!formik.values.selfCollection &&
											!formik.values.delivery)
									}
									className='btn btn-primary me-5'
								>
									{formik.isSubmitting ? (
										<CircularProgress size={30} color='inherit' />
									) : (
										"تم"
									)}
								</Button>
								<Button
									onClick={() => navigate(-1)}
									color='error'
									className='btn btn-danger me-5'
								>
									إلغاء
								</Button>
							</div>
						</fieldset>
					</form>
				</section>
			</div>
			<PaymentModal
				order={newOrder}
				show={showPymentModal}
				onHide={hidePymentModal}
				onConfirm={async () => {
					if (!newOrder) return;

					try {
						const orderToSend = {
							...newOrder,
							// creditCard: cardData, // אופציונלי –  אם שומרים בצד שרת
						};

						setLoading(true);
						await postOrder(orderToSend);
						setOrderDetails(orderToSend);
						navigate(path.AllTheOrders);
						showInfo("התשלום התקבל וההזמנה ממתינה לאישור");
						setLoading(false);
						setQuantity(0);
					} catch (error) {
						console.error(error);
						showError("אירעה שגיאה בביצוע התשלום");
						setLoading(false);
					}
				}}
			/>
		</main>
	);
};

export default Checkout;
