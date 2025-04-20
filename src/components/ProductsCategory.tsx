import {FunctionComponent, useEffect, useState} from "react";
import {deleteProduct, getProductsByCategory} from "../services/productsServices"; // פונקציה כללית שמביאה מוצרים לפי קטגוריה
import {Products} from "../interfaces/Products";
import {handleAddToCart, handleQuantity} from "../helpers/fruitesFunctions";
import ForAllModal from "../atoms/LoginModal";
import {useUser} from "../context/useUSer";
import Loader from "../atoms/loader/Loader";
import UpdateProductModal from "../atoms/UpdateProductModal";
import {showError, showSuccess} from "../atoms/Toast";
import Tooltip from "@mui/material/Tooltip";
import RoleType from "../interfaces/UserType";
import {useCartItems} from "../context/useCart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from "@mui/material/Fab";
import {Button} from "@mui/material";
import AlertDialogs from "../atoms/alertDialod/AlertDialog";

interface ProductCategoryProps {
	category: string;
}
/**
 * Categorys product by category
 * @param {category}
 * @returns products by categoties
 */
const ProductCategory: FunctionComponent<ProductCategoryProps> = ({category}) => {
	const [productNameToUpdate, setProductNameToUpdate] = useState<string>("");
	const [products, setProducts] = useState<Products[]>([]);
	const [quantities, setQuantities] = useState<{[key: string]: number}>({});
	const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const {auth, isLoggedIn} = useUser();
	const [visibleProducts, setVisibleProducts] = useState<Products[]>([]); // To hold the visible products
	const [showMoreLoading, setShowMoreLoading] = useState<boolean>(false);
	const [showUpdateProductModal, setOnShowUpdateProductModal] =
		useState<boolean>(false);
	const {setQuantity} = useCartItems();
	const [productToDelete, setProductToDelete] = useState<string>("");
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const openDeleteModal = (name: string) => {
		setProductToDelete(name);
		setShowDeleteModal(true);
	};
	const closeDeleteModal = () => setShowDeleteModal(false);

	// Login modal to show whene user adding a product to cart and (not loggedIn)
	const OnShowLoginModal = () => setShowLoginModal(true);
	const OnHideLoginModal = () => setShowLoginModal(false);

	// Update product
	const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
	const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

	const handleAdd = (
		product_name: string,
		quantity: {[key: string]: number},
		price: number,
		product_image: string,
		sale: boolean,
		discount: number,
	) => {
		const productQuantity = quantity[product_name];

		if (!isLoggedIn) {
			OnShowLoginModal();
		} else {
			handleAddToCart(
				setQuantities,
				product_name,
				productQuantity,
				price - (price * discount) / 100,
				product_image,
				sale,
				discount,
			);
			setQuantity((prev) => prev + 1);
		}
	};

	const handleDelete = (product_name: string) => {
		deleteProduct(product_name)
			.then(() => {
				showSuccess("המוצר נמחק בהצלחה!");

				setProducts((prevProducts) =>
					prevProducts.filter(
						(product) => product.product_name !== product_name,
					),
				);
			})
			.catch((err) => {
				console.error(err);
				showError("שגיאה במחיקת המוצר!");
			});
	};

	useEffect(() => {
		getProductsByCategory(category)
			.then((res) => {
				setProducts(res);

				setVisibleProducts(res.slice(0, 9));

				const initialQuantities = res.reduce(
					(acc: any, product: {product_name: string}) => {
						acc[product.product_name] = 1;
						return acc;
					},
					{},
				);
				setQuantities(initialQuantities);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => setLoading(false));
	}, []);

	const handleShowMore = () => {
		setShowMoreLoading(true);
		const nextVisibleCount = visibleProducts.length + 6; // Load more products by slicing the products array
		const newVisibleProducts = products.slice(0, nextVisibleCount);
		setVisibleProducts(newVisibleProducts);
		setShowMoreLoading(false);
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<main className='min-vh-100'>
			<div className='container py-5'>
				<div className='row g-4'>
					{visibleProducts.map((product: Products) => {
						const productQuantity = quantities[product.product_name] || 1;
						return (
							<div
								className='col-md-6 mb-5 col-lg-4 col-xl-3 '
								key={product.product_name}
							>
								<div className='card h-100 shadow rounded-4 overflow-hidden'>
									<img
										loading='lazy'
										src={product.image_url}
										alt={product.product_name}
										className='card-img-top'
										style={{
											objectFit: "cover",
											height: "200px",
											transition: "transform 0.3s ease-in-out",
										}}
										onMouseOver={(e) =>
											(e.currentTarget.style.transform =
												"scale(1.05)")
										}
										onMouseOut={(e) =>
											(e.currentTarget.style.transform = "scale(1)")
										}
									/>

									<div className='card-body d-flex flex-column justify-content-between'>
										<h5 className='card-title text-center fw-bold'>
											{product.product_name}
										</h5>
										<h5
											className={` text-center fw-semibold ${
												product.quantity_in_stock <= 0
													? "text-danger"
													: "text-success"
											}`}
										>
											{product.quantity_in_stock <= 0
												? "אזל מהמלאי"
												: "במלאי"}
										</h5>
										<hr />

										{product.sale ? (
											<>
												<h5 className='text-center fw-bold'>
													מחיר לפני:
													<s className='ms-2'>
														{product.price.toLocaleString(
															"he-IL",
															{
																style: "currency",
																currency: "ILS",
															},
														)}
													</s>
												</h5>
												<h6 className='text-center'>
													מחיר:
													{(
														product.price -
														(product.discount
															? (product.price *
																	product.discount) /
																100
															: 0)
													).toLocaleString("he-IL", {
														style: "currency",
														currency: "ILS",
													})}
												</h6>
												<p className='d-block m-2 text-center text-danger'>
													{product.discount}% מבצע
												</p>
											</>
										) : (
											<h5 className='card-text text-center'>
												מחיר:
												{product.price.toLocaleString("he-IL", {
													style: "currency",
													currency: "ILS",
												})}
											</h5>
										)}

										<p className='text-center text-muted small'>
											{category === "spices"
												? "ל / 100-גרם"
												: [
															"fruit",
															"vegetable",
															"meat",
															"fish",
													  ].includes(category)
													? "ל / ק" + "\u05B2" + "ג"
													: "ל-יחידה"}
										</p>

										<div className='d-flex align-items-center justify-content-center gap-3'>
											<button
												disabled={product.quantity_in_stock <= 0}
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
													alt=''
													width={20}
												/>
											</button>
											<h5 className='fs-5 fw-bold'>
												<b>{productQuantity}</b>
											</h5>
											<button
												disabled={product.quantity_in_stock <= 0}
												onClick={() =>
													handleQuantity(
														setQuantities,
														"+",
														product.product_name,
													)
												}
												className='btn btn-light border rounded-circle shadow-sm my-1'
											>
												<img
													src='/svg/add.svg'
													alt=''
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
											disabled={product.quantity_in_stock <= 0}
											className={`w-100 btn shadow-sm py-2 fw-bold rounded-pill d-block ${
												product.quantity_in_stock <= 0
													? "btn btn-outline-danger"
													: "btn btn-outline-success"
											}`}
										>
											{product.quantity_in_stock <= 0
												? "אזל מהמלאי"
												: "הוספה לסל"}
										</button>
										{((auth && auth.role === RoleType.Admin) ||
											(auth &&
												auth.role === RoleType.Moderator)) && (
											<div className='card-footer mt-3 bg-transparent border-0 d-flex justify-content-around'>
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
							</div>
						);
					})}
				</div>
				{/* Show More Button */}
				{products.length > visibleProducts.length && (
					<div className='text-center '>
						<Button
							onClick={handleShowMore}
							color='primary'
							variant='contained'
							size='large'
							disabled={showMoreLoading}
							className='rounded-pill shadow'
						>
							הצג עוד מוצרים
						</Button>
					</div>
				)}
			</div>

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

			<ForAllModal show={showLoginModal} onHide={OnHideLoginModal} />
		</main>
	);
};

export default ProductCategory;
