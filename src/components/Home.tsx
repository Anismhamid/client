import {FunctionComponent, useEffect, useMemo, useState} from "react";
import DiscountsAndOffers from "./DiscountsAndOffers";
import {useUser} from "../context/useUSer";
import AddProdutModal from "../atoms/AddProdutModal";
import {deleteProduct, getAllProducts} from "../services/productsServices";
import {Products} from "../interfaces/Products";
import {handleAddToCart, handleQuantity} from "../helpers/fruitesFunctions";
import Loader from "../atoms/loader/Loader";
import ForAllModal from "../atoms/LoginModal";
import {
	SpeedDial,
	SpeedDialIcon,
	SpeedDialAction,
	Button,
	Tooltip,
	Fab,
} from "@mui/material";
import {fontAwesomeIcon} from "../FontAwesome/Icons";
import RoleType from "../interfaces/UserType";
import SearchIcon from "@mui/icons-material/Search";
import {InputBase, Paper, IconButton} from "@mui/material";
import {showError, showSuccess} from "../atoms/Toast";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateProductModal from "../atoms/UpdateProductModal";
import AlertDialogs from "../atoms/alertDialod/AlertDialog";

interface HomeProps {}

/**
 * Home page
 * @returns All products by categories
 */

const Home: FunctionComponent<HomeProps> = () => {
	const [quantities, setQuantities] = useState<{[key: string]: number}>({});
	const [onShowAddModal, setOnShowAddModal] = useState<boolean>(false);
	const [onShowModal, setOnShowModal] = useState<boolean>(false);
	const [products, setProducts] = useState<Products[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const {auth, isLoggedIn} = useUser();
	const [visibleProducts, setVisibleProducts] = useState<Products[]>([]);
	const [visibleCount, setVisibleCount] = useState(15);
	const [productNameToUpdate, setProductNameToUpdate] = useState<string>("");
	const [showUpdateProductModal, setOnShowUpdateProductModal] =
		useState<boolean>(false);
	const [productToDelete, setProductToDelete] = useState<string>("");
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const openDeleteModal = (name: string) => {
		setProductToDelete(name);
		setShowDeleteModal(true);
	};
	const closeDeleteModal = () => setShowDeleteModal(false);

	const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
	const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

	const OnShowCartModal = () => setOnShowModal(true);
	const OnHideCartModal = () => setOnShowModal(false);

	const showAddProductModal = () => setOnShowAddModal(true);
	const hideAddProductModal = () => setOnShowAddModal(false);

	useEffect(() => {
		getAllProducts()
			.then((products) => {
				setProducts(products);
				setVisibleProducts(products.slice(0, 15));
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			const productName = product.product_name || "";
			const productPrice = product.price || "";
			const productInDiscount = product.sale ? "מבצע" : "";

			return (
				productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(searchQuery && productPrice.toString().includes(searchQuery)) ||
				(searchQuery && productInDiscount.toString().includes(searchQuery))
			);
		});
	}, [products, searchQuery]);

	useEffect(() => {
		const dataToDisplay = searchQuery
			? filteredProducts
			: products.slice(0, visibleCount);

		setVisibleProducts(dataToDisplay);
	}, [products, searchQuery, filteredProducts, visibleCount]);

	const handleAdd = (
		product_name: string,
		quantity: {[key: string]: number},
		price: number,
		product_image: string,
		sale: boolean,
		discount: number,
	) => {
		const productQuantity = quantity[product_name]; // Access the quantity of the specific product
		if (!isLoggedIn) {
			OnShowCartModal();
		} else {
			handleAddToCart(
				setQuantities,
				product_name,
				productQuantity || 1,
				price - (price * discount) / 100,
				product_image,
				sale,
				discount,
			);
		}
	};

	const actions = [
		{
			icon: fontAwesomeIcon.CartInoc,
			name: "מוצר חדש",
			addClick: () => showAddProductModal(),
		},
	];

	const handleDelete = (product_name: string) => {
		deleteProduct(product_name)
			.then(() => {
				showSuccess("המוצר נמחק בהצלחה!");
				setProducts((p) => p.filter((p) => p.product_name !== product_name));
			})
			.catch((err) => {
				console.error(err);
				showError("שגיאה במחיקת המוצר!");
			});
	};

	if (loading) {
		return <Loader />;
	}

	const isAdmin = auth.role === RoleType.Admin;
	const isModerator = auth.role === RoleType.Moderator;

	return (
		<main className='min-vh-100'>
			{((auth && isAdmin) || (auth && isModerator)) && (
				<SpeedDial
					ariaLabel='SpeedDial basic example'
					sx={{position: "fixed", bottom: 90, right: 16}}
					icon={<SpeedDialIcon />}
				>
					{actions.map((action) => (
						<SpeedDialAction
							key={action.name}
							icon={action.icon}
							tooltipTitle={action.name}
							tooltipOpen={true}
							onClick={action.addClick}
						/>
					))}
				</SpeedDial>
			)}

			{/* Search and filter products */}
			<div className='container py-5'>
				<div className=''>
					<Paper
						component='div'
						onSubmit={(e) => e.preventDefault()}
						sx={{
							width: {xs: "90%", sm: 400},
							m: "auto",
							mb: 4,
							p: "2px 10px",
							display: "flex",
							alignItems: "center",
							borderRadius: "50px",
							background: "rgba(255, 255, 255, 0.08)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
							backdropFilter: "blur(10px)",
							border: "1px solid rgba(255, 255, 255, 0.2)",
							transition: "0.3s ease",
							"&:hover": {
								boxShadow: "0 6px 25px rgba(0, 0, 0, 0.4)",
							},
						}}
					>
						<SearchIcon sx={{color: "#66b2ff", mr: 1}} />
						<InputBase
							sx={{
								color: "#696969",
								ml: 5,
								flex: 1,
								fontSize: "16px",
								"& input::placeholder": {
									color: "#ff5151",
								},
							}}
							placeholder='חיפוש מוצר'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							inputProps={{"aria-label": "search"}}
						/>
						<IconButton onClick={() => setSearchQuery("")} size='small'>
							❌
						</IconButton>
					</Paper>
					{/* Discounts Section */}
					{!searchQuery && <DiscountsAndOffers />}

					<div className='row'>
						{visibleProducts.length > 0 ? (
							visibleProducts.map((product) => {
								const productQuantity =
									quantities[product.product_name] ?? 1;
								const isOutOfStock = product.quantity_in_stock <= 0;
								const discountedPrice = product.sale
									? product.price -
										(product.price * (product.discount || 0)) / 100
									: product.price;
								return (
									<div
										className='col-md-6 col-lg-4 col-xl-3 mb-4'
										key={product._id}
									>
										<div className='card shadow rounded-4 h-100 overflow-hidden border-0'>
											<div className='card-img-top'>
												<img
													loading='lazy'
													src={product.image_url}
													alt={product.product_name}
													className='card-img-top'
													style={{
														objectFit: "cover",
														height: "200px",
														transition:
															"transform 0.3s ease-in-out",
													}}
													onMouseOver={(e) =>
														(e.currentTarget.style.transform =
															"scale(1.05)")
													}
													onMouseOut={(e) =>
														(e.currentTarget.style.transform =
															"scale(1)")
													}
												/>
											</div>

											<div className='card-body d-flex flex-column justify-content-between'>
												<h5 className='card-title text-center fw-bol'>
													{product.product_name}
												</h5>

												<p className='text-success text-center mb-2'>
													במלאי {product.quantity_in_stock}
												</p>

												{product.sale ? (
													<>
														<h6 className=' text-center'>
															מחיר קודם:
															<s>
																{product.price.toLocaleString(
																	"he-IL",
																	{
																		style: "currency",
																		currency: "ILS",
																	},
																)}
															</s>
														</h6>

														<h5 className=' text-center'>
															מחיר:
															{discountedPrice.toLocaleString(
																"he-IL",
																{
																	style: "currency",
																	currency: "ILS",
																},
															)}
															<small className='text-muted ms-2'>
																({product.discount}% הנחה)
															</small>
														</h5>
													</>
												) : (
													<h5 className='card-text text-center'>
														{product.price.toLocaleString(
															"he-IL",
															{
																style: "currency",
																currency: "ILS",
															},
														)}
													</h5>
												)}

												<h6 className=' text-primary'>
													ל / 1-ק"ג
												</h6>
												<div className='d-flex align-items-center justify-content-evenly'>
													<button
														disabled={isOutOfStock}
														onClick={() =>
															handleQuantity(
																setQuantities,
																"-",
																product.product_name,
															)
														}
														className='btn btn-light border rounded-circle shadow-sm my-1'
													>
														<img
															src='/svg/remove.svg'
															alt='remove one'
															width={20}
														/>
													</button>
													<h5 className='text-decoration-underline'>
														<b>{productQuantity}</b>
													</h5>
													<button
														disabled={
															product.quantity_in_stock <= 0
																? true
																: false
														}
														onClick={() => {
															handleQuantity(
																setQuantities,
																"+",
																product.product_name,
															);
														}}
														className='btn btn-light border rounded-circle shadow-sm my-1'
													>
														<img
															src='/svg/add.svg'
															alt='add more one'
															width={20}
														/>
													</button>
												</div>
												<button
													onClick={() => {
														handleAdd(
															product.product_name,
															quantities,
															product.price,
															product.image_url,
															product.sale || false,
															product.discount || 0,
														);
													}}
													disabled={isOutOfStock}
													className={`w-100 btn shadow-sm py-2 fw-bold rounded-pill ${
														isOutOfStock
															? "btn-outline-danger"
															: "btn-outline-success"
													}`}
												>
													{isOutOfStock
														? "אזל מהמלאי"
														: "הוספה לסל"}
												</button>
											</div>

											{((auth && isAdmin) ||
												(auth &&
													isModerator)) && (
												<div className='card-footer my-3 bg-transparent border-0 d-flex justify-content-around'>
													<Tooltip title='עריכה'>
														<Fab
															color='warning'
															aria-label='עריכה'
															onClick={() => {
																setProductNameToUpdate(
																	product.product_name,
																);
																onShowUpdateProductModal();
															}}
															size='small'
															className='z-1'
														>
															<EditIcon />
														</Fab>
													</Tooltip>
													<Tooltip title='מחיקה'>
														<Fab
															color='error'
															aria-label='מחיקה'
															onClick={() =>
																openDeleteModal(
																	product.product_name,
																)
															}
															size='small'
															className='z-1'
														>
															<DeleteIcon />
														</Fab>
													</Tooltip>
												</div>
											)}
										</div>
									</div>
								);
							})
						) : (
							<p className='rounded border border-light mt-3 text-center lead'>
								חפש לפי/
								<strong className='text-danger fw-bold mx-1'>
									שם מוצר
								</strong>
								/
								<strong className='text-danger fw-bold mx-1'>
									מחיר מוצר
								</strong>
								/
								<strong className='text-danger fw-bold ms-1'>
									מילת מבצע
								</strong>
							</p>
						)}
					</div>
				</div>
				{/* Show More Button */}
				{!searchQuery && visibleCount < products.length && (
					<div className='text-center mt-4'>
						<Button
							color='primary'
							variant='contained'
							onClick={() => setVisibleCount((prev) => prev + 15)}
						>
							הצג עוד מוצרים
						</Button>
					</div>
				)}
			</div>

			<div className='container'>
				{/* Customer support section */}
				<section className='my-5'>
					<h2 className='text-center mb-4'>אנו כאן לשירותכם!</h2>
					<p className='text-center mb-4'>
						אם יש לכם שאלות על המוצרים, המבצעים, או איך לבצע הזמנה, אל תהססו
						לפנות אלינו! צוות שירות הלקוחות שלנו זמין 24/7 כדי לעזור לכם.
						אנחנו כאן כדי להבטיח שתהנו מכל רכישה ושזה יהיה תהליך חלק ונעים
						עבורכם.
					</p>
				</section>
			</div>

			{/* Add product modal */}
			<AddProdutModal show={onShowAddModal} onHide={hideAddProductModal} />

			<UpdateProductModal
				product_name={productNameToUpdate}
				show={showUpdateProductModal}
				onHide={() => onHideUpdateProductModal()}
			/>

			<AlertDialogs
				show={showDeleteModal}
				openModal={() => setShowDeleteModal(true)}
				onHide={closeDeleteModal}
				handleDelete={() => handleDelete(productToDelete)}
			/>
			<ForAllModal show={onShowModal} onHide={OnHideCartModal} />
		</main>
	);
};

export default Home;
