import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {deleteProduct, getProductsByCategory} from "../../services/productsServices"; // פונקציה כללית שמביאה מוצרים לפי קטגוריה
import {Products} from "../../interfaces/Products";
import {handleAddToCart, handleQuantity} from "../../helpers/fruitesFunctions";
import {useUser} from "../../context/useUSer";
import Loader from "../../atoms/loader/Loader";
import UpdateProductModal from "../../atoms/productsManage/UpdateProductModal";
import {showError, showSuccess} from "../../atoms/toasts/ReactToast";
import Tooltip from "@mui/material/Tooltip";
import RoleType from "../../interfaces/UserType";
import {useCartItems} from "../../context/useCart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import Fab from "@mui/material/Fab";
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Chip,
	CircularProgress,
	Typography,
} from "@mui/material";
import AlertDialogs from "../../atoms/toasts/Sweetalert";
import Seo from "../../atoms/Seo/Seo";
import {getFaviconForCategory} from "../../FontAwesome/tapIcons";
import {useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router-dom";
import {path, productsPathes} from "../../routes/routes";
import ColorsAndSizes from "../../atoms/productsManage/ColorsAndSizes";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {Col, Row} from "react-bootstrap";
import SearchBox from "../../atoms/SearchBox";
import {formatPrice} from "../../helpers/dateAndPriceFormat";
import {io} from "socket.io-client";

interface ProductCategoryProps {
	category: string;
}
/**
 * Categorys product by category
 * @param {category}
 * @returns products by categoties
 */
const ProductCategory: FunctionComponent<ProductCategoryProps> = ({
	category,
}: ProductCategoryProps) => {
	const [productNameToUpdate, setProductNameToUpdate] = useState<string>("");
	const [products, setProducts] = useState<Products[]>([]);
	const [quantities, setQuantities] = useState<{[key: string]: number}>({});
	const [loading, setLoading] = useState<boolean>(true);
	const {auth, isLoggedIn} = useUser();
	const [visibleProducts, setVisibleProducts] = useState<Products[]>([]); // To hold the visible products
	const [showMoreLoading, setShowMoreLoading] = useState<boolean>(false);
	const [showUpdateProductModal, setOnShowUpdateProductModal] =
		useState<boolean>(false);
	const [productToDelete, setProductToDelete] = useState<string>("");
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [loadingAddToCart, setLoadingAddToCart] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [refresh, setRefresh] = useState<boolean>(false);

	const {setQuantity} = useCartItems();
	const navigate = useNavigate();

	const openDeleteModal = (name: string) => {
		setProductToDelete(name);
		setShowDeleteModal(true);
	};
	const closeDeleteModal = () => setShowDeleteModal(false);

	const {t} = useTranslation();

	// Update product
	const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
	const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

	const icons = getFaviconForCategory(category);

	const refreshAfterCange = () => setRefresh(!refresh);

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
			navigate(path.Login);
		} else {
			setLoadingAddToCart(product_name);
			handleAddToCart(
				setQuantities,
				product_name,
				productQuantity,
				price - (price * discount) / 100,
				product_image,
				sale,
				discount,
			).then(() => {
				setQuantity((prev) => prev + productQuantity);
				setLoadingAddToCart(null);
			});
		}
	};

	const handleDelete = (product_name: string) => {
		deleteProduct(product_name)
			.then(() => {
				showSuccess("המוצר נמחק בהצלחה!");

				setProducts((prevProducts) =>
					prevProducts.filter((p) => p.product_name !== product_name),
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

				setVisibleProducts(res.slice(0, 16));

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

	// quantities in stock updates when the order is created
	useEffect(() => {
		const socket = io(import.meta.env.VITE_API_SOCKET_URL);

		socket.on("product:quantity_in_stock", (newProduct: Products) => {
			setProducts((prev) => {
				const exists = prev.some(
					(p) => p.product_name === newProduct.product_name,
				);
				if (exists) {
					return prev.map((p) =>
						p.product_name === newProduct.product_name ? newProduct : p,
					);
				}
				return [newProduct, ...prev];
			});

			setVisibleProducts((prev) => {
				const exists = prev.some(
					(p) => p.product_name === newProduct.product_name,
				);
				if (exists) {
					return prev.map((p) =>
						p.product_name === newProduct.product_name ? newProduct : p,
					);
				}
				return [newProduct, ...prev];
			});
		});

		// // האזנה לעדכון מוצר
		// socket.on("productUpdated", (updatedProduct: Products) => {
		// 	setProducts((prev) =>
		// 		prev.map((p) =>
		// 			p.product_name === updatedProduct.product_name ? updatedProduct : p,
		// 		),
		// 	);
		// 	setVisibleProducts((prev) =>
		// 		prev.map((p) =>
		// 			p.product_name === updatedProduct.product_name ? updatedProduct : p,
		// 		),
		// 	);
		// });

		// // האזנה למחיקת מוצר
		// socket.on("productDeleted", (deletedProductName: string) => {
		// 	setProducts((prev) =>
		// 		prev.filter((p) => p.product_name !== deletedProductName),
		// 	);
		// 	setVisibleProducts((prev) =>
		// 		prev.filter((p) => p.product_name !== deletedProductName),
		// 	);
		// });

		// ניקוי מאזינים כשהקומפוננטה מתפרקת
		return () => {
			socket.off("product:quantity_in_stock");
			// socket.off("productAdded");
			// socket.off("productDeleted");
		};
	}, []);

	const handleShowMore = () => {
		setShowMoreLoading(true);
		const nextVisibleCount = visibleProducts.length + 16;
		const newVisibleProducts = products.slice(0, nextVisibleCount);
		setVisibleProducts(newVisibleProducts);
		setShowMoreLoading(false);
	};

	const isAdmin = auth?.role === RoleType.Admin;
	const isModerator = auth?.role === RoleType.Moderator;
	const canEdit = isAdmin || isModerator;

	if (loading) {
		return <Loader />;
	}

	return (
		<>
			<Seo
				title={t("seo.categoryTitle", {category: t(`categories.${category}`)})}
				description={t("seo.categoryDescription", {
					category: t(`categories.${category}`),
				})}
				image={icons}
				type='category'
			/>
			<Box component='main'>
				<Box
					sx={{
						position: "sticky",
						zIndex: 2000,
						top: 100,
					}}
				>
					<SearchBox
						searchQuery={searchQuery}
						text={t("searchin")}
						setSearchQuery={setSearchQuery}
					/>
				</Box>
				<Box className='container pb-5'>
					<Row spacing={5}>
						{filteredProducts
							.slice(0, visibleProducts.length)
							.map((product: Products) => {
								const isOutOfStock = product.quantity_in_stock <= 0;
								const productQuantity =
									quantities[product.product_name] || 1;
								const discountedPrice = product.sale
									? product.price -
										(product.price * (product.discount || 0)) / 100
									: product.price;

								const unitText =
									{
										spices: "ל/100 גרם",
										fruit: 'ל/ק"ג',
										vegetable: 'ל/ק"ג',
										meat: 'ל/ק"ג',
										fish: 'ל/ק"ג',
									}[product.category?.toLowerCase()] || "ליחידה";

								return (
									<Col
										key={product.product_name}
										xs={6}
										sm={2}
										md={4}
										xl={3}
									>
										<Card className='cards'>
											<Link
												to={`/product-details/${encodeURIComponent(product.product_name)}`}
											>
												{product.quantity_in_stock}
												<CardMedia
													component='img'
													loading='lazy'
													image={product.image_url}
													alt={product.product_name}
													title={product.product_name}
													height='200'
												/>
											</Link>
											<CardContent>
												<Typography
													variant='h6'
													align='center'
													fontWeight='bold'
												>
													{product.product_name}
												</Typography>
												<Typography
													variant='h6'
													align='center'
													className={`text-center fw-semibold ${
														isOutOfStock
															? "text-danger"
															: "text-success"
													}`}
												>
													{isOutOfStock
														? "אזל מהמלאי"
														: "במלאי "}
												</Typography>
												{product.sale ? (
													<>
														<Typography
															variant='h6'
															align='center'
														>
															<s className='ms-2'>
																{formatPrice(
																	product.price,
																)}
															</s>
														</Typography>
														<Chip
															label={`${product.discount}% הנחה`}
															color='error'
															size='small'
														/>
														<Typography
															variant='h5'
															align='center'
															color='success.main'
														>
															{formatPrice(discountedPrice)}
														</Typography>
													</>
												) : (
													<Typography
														variant='h6'
														align='center'
													>
														{formatPrice(product.price)}
													</Typography>
												)}

												<Typography
													variant='h6'
													align='center'
													color='primary'
												>
													{unitText}
												</Typography>
												<Box
													sx={{
														margin: "auto",
														textAlign: "center",
														p: 0,
													}}
												>
													<ColorsAndSizes category={category} />
												</Box>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-around",
														my: 1,
													}}
												>
													<Button
														disabled={isOutOfStock}
														onClick={() =>
															handleQuantity(
																setQuantities,
																"-",
																product.product_name,
															)
														}
														startIcon={<RemoveSharpIcon />}
													/>

													<Typography
														variant='h6'
														align='center'
													>
														{productQuantity}
													</Typography>
													<Button
														disabled={isOutOfStock}
														onClick={() =>
															handleQuantity(
																setQuantities,
																"+",
																product.product_name,
															)
														}
														startIcon={<AddSharpIcon />}
													/>
												</Box>
												<Button
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
													className={`w-100 btn shadow-sm mt-2 fw-bold rounded-pill d-block ${
														product.quantity_in_stock <= 0
															? "btn btn-outline-danger"
															: "btn btn-outline-primary"
													}`}
												>
													{isOutOfStock ? (
														"אזל מהמלאי"
													) : loadingAddToCart ===
													  product.product_name ? (
														<CircularProgress
															size={20}
															color='inherit'
														/>
													) : (
														<AddShoppingCartIcon />
													)}
												</Button>
												{canEdit && (
													<CardActionArea
														sx={{
															display: "flex",
															alignItems: "center",
															justifyContent:
																"space-between",
															p: 3,
															width: "100%",
														}}
													>
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
															>
																<DeleteIcon />
															</Fab>
														</Tooltip>
													</CardActionArea>
												)}
											</CardContent>
										</Card>
									</Col>
								);
							})}
					</Row>
					{/* Show More Button */}
					{products.length > visibleProducts.length && (
						<div className='text-center my-4 '>
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
				</Box>

				<UpdateProductModal
					refresh={refreshAfterCange}
					product_name={productNameToUpdate}
					show={showUpdateProductModal}
					onHide={() => onHideUpdateProductModal()}
				/>

				<AlertDialogs
					show={showDeleteModal}
					onHide={closeDeleteModal}
					handleDelete={() => handleDelete(productToDelete)}
					title={"אתה עומד למחוק מוצר מהחנות"}
					description={`האם אתה בטוח שברצונך למחוק את המוצר ( ${productToDelete} ) ? פעולה זו לא ניתנת לביטול`}
				/>
			</Box>
		</>
	);
};

export default ProductCategory;
