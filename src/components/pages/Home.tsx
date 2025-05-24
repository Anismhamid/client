import {FunctionComponent, useEffect, useMemo, useState} from "react";
import DiscountsAndOffers from "./products/DiscountsAndOffers";
import {useUser} from "../../context/useUSer";
import {deleteProduct, getAllProducts} from "../../services/productsServices";
import {Products} from "../../interfaces/Products";
import {handleAddToCart, handleQuantity} from "../../helpers/fruitesFunctions";
import Loader from "../../atoms/loader/Loader";
import {
	Button,
	CircularProgress,
	CardMedia,
	Card,
	Chip,
	Box,
	Typography,
	CardContent,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";
import RoleType from "../../interfaces/UserType";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import {showError} from "../../atoms/toasts/ReactToast";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateProductModal from "../../atoms/productsManage/UpdateProductModal";
import AlertDialogs from "../../atoms/toasts/Sweetalert";
import {Link, useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";
import SearchBox from "../../atoms/SearchBox";
import {Col, Row} from "react-bootstrap";
import {useRef} from "react";
import ColorsAndSizes from "../../atoms/productsManage/ColorsAndSizes";
import {formatPrice} from "../../helpers/dateAndPriceFormat";
import handleRTL from "../../locales/handleRTL";
import {io} from "socket.io-client";

interface HomeProps {}

/**
 * Home page
 * @returns All products by categories
 */

const Home: FunctionComponent<HomeProps> = () => {
	const [quantities, setQuantities] = useState<{[key: string]: number}>({});
	const [products, setProducts] = useState<Products[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [loadingAddToCart, setLoadingAddToCart] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const {auth, isLoggedIn} = useUser();
	const [visibleProducts, setVisibleProducts] = useState<Products[]>([]);
	const [visibleCount, setVisibleCount] = useState(6);
	const [productNameToUpdate, setProductNameToUpdate] = useState<string>("");
	const [showUpdateProductModal, setOnShowUpdateProductModal] =
		useState<boolean>(false);
	const observerRef = useRef<HTMLDivElement | null>(null);
	const [productToDelete, setProductToDelete] = useState<string>("");
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [refresh, setRefresh] = useState<boolean>(false);
	const navigate = useNavigate();

	const openDeleteModal = (name: string) => {
		setProductToDelete(name);
		setShowDeleteModal(true);
	};
	const closeDeleteModal = () => setShowDeleteModal(false);

	const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
	const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

	const refreshAfterCange = () => setRefresh(!refresh);

	useEffect(() => {
		getAllProducts()
			.then((products) => {
				setProducts(products);
				setVisibleProducts(products.slice(0, 16));
				setLoading(false);
				window.scrollTo(0, 0);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [refresh]);

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
		if (!observerRef.current || searchQuery) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
					setVisibleCount((prev) => prev + 6);
				}
			},
			{threshold: 1},
		);

		observer.observe(observerRef.current);

		return () => {
			if (observerRef.current) observer.unobserve(observerRef.current);
		};
	}, [filteredProducts.length, visibleCount, searchQuery, loading]);

	useEffect(() => {
		setVisibleProducts(filteredProducts.slice(0, visibleCount));
	}, [filteredProducts, visibleCount]);

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

		// Cleaning the listenr
		return () => {
			socket.off("product:quantity_in_stock");
		};
	}, []);

	const handleAdd = async (
		product_name: string,
		quantity: {[key: string]: number},
		price: number,
		product_image: string,
		sale: boolean,
		discount: number,
	) => {
		const productQuantity = quantity[product_name]; // Access the quantity of the specific product
		if (!isLoggedIn) {
			navigate(path.Login);
			return;
		} else {
			setLoadingAddToCart(product_name);
			try {
				await handleAddToCart(
					setQuantities,
					product_name,
					productQuantity || 1,
					price - (price * discount) / 100,
					product_image,
					sale,
					discount,
				);
			} catch (error) {
				showError("אירעה שגיאה בהוספת מוצר לעגלה");
			} finally {
				setLoadingAddToCart(null);
			}
		}
	};

	const handleDelete = (product_name: string) => {
		deleteProduct(product_name)
			.then(() => {
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

	const isAdmin = auth?.role === RoleType.Admin;
	const isModerator = auth?.role === RoleType.Moderator;
	const canEdit = isAdmin || isModerator;

	const diriction = handleRTL();

	return (
		<Box dir={diriction} component='main'>
			{!searchQuery && <DiscountsAndOffers />}
			{/* Search and filter products */}
			<Box className='container'>
				<Box
					sx={{
						position: "sticky",
						zIndex: 1,
						top: {xs: 55, md: 135, lg: 95},
					}}
				>
					<SearchBox
						searchQuery={searchQuery}
						text='חפש שם מוצר, מחיר או מבצע...'
						setSearchQuery={setSearchQuery}
					/>
				</Box>
				{/* Discounts Section */}

				<Box
					sx={{
						backdropFilter: "blur(10px)",
						width: "100%",
						p: 1,
						border: "1px solid red",
						borderRadius: 3,
						my: 5,
					}}
				>
					<Typography align='center' variant='h6' gutterBottom>
						כל המוצרים שלנו נבחרים בקפידה כדי להעניק לכם חוויית קנייה איכותית,
						משתלמת ונוחה. תמצאו כאן מגוון רחב של פריטים – טריים, מהימנים
						ובמחירים מעולים. אם יש לכם שאלות על המוצרים, המבצעים, או איך לבצע
						הזמנה – אל תהססו לפנות אלינו! קנייה נעימה!
					</Typography>
				</Box>

				<Row spacing={5}>
					{visibleProducts.length > 0 ? (
						visibleProducts.map((product) => {
							const productQuantity = quantities[product.product_name] ?? 1;
							const isOutOfStock = product.quantity_in_stock <= 0;
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
									md={4}
									xl={3}
								>
									<Card
										style={{height: "95%"}}
										className='d-flex mb-4 flex-column justify-content-between shadow-sm rounded-4'
									>
										<Link
											to={`/product-details/${encodeURIComponent(product.product_name)}`}
										>
											<CardMedia
												component='img'
												width='100%'
												image={product.image_url}
												alt={product.product_name}
												loading='lazy'
												sx={{
													height: 180,
													objectFit: "contain",
												}}
											/>
										</Link>
										<CardContent sx={{flexGrow: 1}}>
											<Typography
												variant='h6'
												align='center'
												fontWeight='bold'
												gutterBottom
											>
												{product.product_name}
											</Typography>
											{product.sale ? (
												<>
													<Chip
														label={`${product.discount}% הנחה`}
														color='error'
														size='small'
													/>
													<Typography
														variant='h6'
														align='center'
													>
														<s>
															{formatPrice(product.price)}
														</s>
													</Typography>
												</>
											) : (
												<>
													<Typography
														variant='body2'
														align='center'
														className={
															isOutOfStock
																? "text-danger"
																: "text-success"
														}
													>
														{isOutOfStock
															? "אזל מהמלאי"
															: `במלאי: ${product.quantity_in_stock}`}
													</Typography>

													<Typography
														variant='body2'
														align='center'
														color='text.secondary'
													>
														{unitText}
													</Typography>
												</>
											)}
											<Box
												sx={{
													mt: 1,
													textAlign: "center",
												}}
											>
												<ColorsAndSizes
													category={product.category}
												/>
											</Box>
											<Typography
												variant='h5'
												align='center'
												color='success.main'
											>
												{formatPrice(discountedPrice)}
											</Typography>
										</CardContent>
										<Box sx={{px: 2, pb: 2}}>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-around",
													my: 1,
												}}
											>
												<Button
													size='small'
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

												<Typography>{productQuantity}</Typography>

												<Button
													size='small'
													disabled={isOutOfStock}
													onClick={() => {
														handleQuantity(
															setQuantities,
															"+",
															product.product_name,
														);
													}}
													startIcon={<AddSharpIcon />}
												/>
											</Box>
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
											startIcon={<AddShoppingCartIcon />}
											disabled={isOutOfStock}
											variant='outlined'
											color={isOutOfStock ? "primary" : "info"}
										>
											{loadingAddToCart === product.product_name ? (
												<CircularProgress
													size={20}
													color='inherit'
												/>
											) : (
												<>הוסף לעגלה</>
											)}
										</Button>

										{canEdit && (
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													p: 1,
													mt: 1,
													borderTop: "1px solid #ff0000",
												}}
												className='cards-footer'
											>
												<Button
													size='small'
													color='warning'
													aria-label='עריכה'
													onClick={() => {
														setProductNameToUpdate(
															product.product_name,
														);
														onShowUpdateProductModal();
													}}
													startIcon={<EditIcon />}
													variant='outlined'
												/>

												<Button
													size='small'
													color='error'
													aria-label='מחיקה'
													onClick={() =>
														openDeleteModal(
															product.product_name,
														)
													}
													startIcon={<DeleteIcon />}
													variant='outlined'
												/>
											</Box>
										)}
									</Card>
								</Col>
							);
						})
					) : (
						<>
							<Typography variant='body1'>
								לא נמצאו מוצרים תואמים. נסו לחפש לפי:
							</Typography>
							<Box mt={1}>
								<Chip label='שם מוצר' sx={{mx: 0.5}} />
								<Chip label='מחיר' sx={{mx: 0.5}} />
								<Chip label='מבצע' sx={{mx: 0.5}} />
							</Box>
						</>
					)}
				</Row>
			</Box>
			<Box
				ref={observerRef}
				sx={{
					height: 40,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<CircularProgress size={24} aria-busy={"true"} />
			</Box>
			<Box sx={{bgcolor: "background.paper", py: 6, mt: 6}}>
				<Box sx={{maxWidth: 800, mx: "auto", px: 2, textAlign: "center"}}>
					<Typography variant='h4' gutterBottom>
						אנו כאן לשירותכם!
					</Typography>
					<Typography variant='body1'>
						אם יש לכם שאלות על המוצרים, המבצעים, או איך לבצע הזמנה, אל תהססו
						לפנות אלינו! צוות שירות הלקוחות שלנו זמין 24/7 כדי לעזור לכם.
					</Typography>
					<Button
						variant='contained'
						size='large'
						onClick={() => navigate(path.Contact)}
						sx={{mt: 2}}
					>
						צור קשר
					</Button>
				</Box>
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
				title={"אתה עומד למחוק מוצר מהחנות"}
				description={`האם אתה בטוח שברצונך למחוק את המוצר ( ${productToDelete} ) ? פעולה זו לא ניתנת לביטול`}
				handleDelete={() => handleDelete(productToDelete)}
			/>
		</Box>
	);
};

export default Home;
