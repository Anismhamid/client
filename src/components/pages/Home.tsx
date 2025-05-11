import {FunctionComponent, useEffect, useMemo, useState} from "react";
import DiscountsAndOffers from "./products/DiscountsAndOffers";
import {useUser} from "../../context/useUSer";
import AddProdutModal from "../../atoms/AddProdutModal";
import {deleteProduct, getAllProducts} from "../../services/productsServices";
import {Products} from "../../interfaces/Products";
import {handleAddToCart, handleQuantity} from "../../helpers/fruitesFunctions";
import Loader from "../../atoms/loader/Loader";
import {
	SpeedDial,
	SpeedDialIcon,
	SpeedDialAction,
	Button,
	Tooltip,
	Fab,
	CircularProgress,
	CardMedia,
	Card,
	Chip,
	Box,
	Typography,
	CardContent,
	IconButton,
} from "@mui/material";
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";
import RoleType from "../../interfaces/UserType";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import {showError, showSuccess} from "../../atoms/Toast";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateProductModal from "../../atoms/UpdateProductModal";
import AlertDialogs from "../../atoms/alertDialod/AlertDialog";
import {useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";
import SearchBox from "../../atoms/SearchBox";
import {Col, Row} from "react-bootstrap";

interface HomeProps {}

/**
 * Home page
 * @returns All products by categories
 */

const Home: FunctionComponent<HomeProps> = () => {
	const [quantities, setQuantities] = useState<{[key: string]: number}>({});
	const [onShowAddModal, setOnShowAddModal] = useState<boolean>(false);
	const [products, setProducts] = useState<Products[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loadingAddToCart, setLoadingAddToCart] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const {auth, isLoggedIn} = useUser();
	const [visibleProducts, setVisibleProducts] = useState<Products[]>([]);
	const [visibleCount, setVisibleCount] = useState(16);
	const [productNameToUpdate, setProductNameToUpdate] = useState<string>("");
	const [showUpdateProductModal, setOnShowUpdateProductModal] =
		useState<boolean>(false);
	const [productToDelete, setProductToDelete] = useState<string>("");
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const navigate = useNavigate();

	const openDeleteModal = (name: string) => {
		setProductToDelete(name);
		setShowDeleteModal(true);
	};
	const closeDeleteModal = () => setShowDeleteModal(false);

	const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
	const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

	const showAddProductModal = () => setOnShowAddModal(true);
	const hideAddProductModal = () => setOnShowAddModal(false);

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
			await handleAddToCart(
				setQuantities,
				product_name,
				productQuantity || 1,
				price - (price * discount) / 100,
				product_image,
				sale,
				discount,
			);
			setLoadingAddToCart(null);
		}
	};

	const actions = [
		{
			icon: <AddSharpIcon />,
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
	const canEdit = isAdmin || isModerator;

	return (
		<Box component='main'>
			{canEdit && (
				<SpeedDial
					ariaLabel='SpeedDial basic example'
					sx={{position: "fixed", bottom: 100, right: 16}}
					icon={<SpeedDialIcon />}
				>
					{actions.map((action) => (
						<SpeedDialAction
							key={action.name}
							icon={action.icon}
							tooltipTitle={action.name}
							tooltipOpen
							onClick={action.addClick}
						/>
					))}
				</SpeedDial>
			)}

			{/* Search and filter products */}
			<Box className='container'>
				<Box>
					<SearchBox
						searchQuery={searchQuery}
						text='חפש שם מוצר, מחיר או מבצע...'
						setSearchQuery={setSearchQuery}
					/>
				</Box>
				{/* Discounts Section */}
				{!searchQuery && <DiscountsAndOffers />}

				<Box
					sx={{
						backdropFilter: "blur(10px)",
						width: "100%",
						p: 1,
						border: "1px solid red",
						borderRadius: 3,
					}}
				>
					<Typography align='center' variant='h3' gutterBottom>
						כל המוצרים שלנו נבחרים בקפידה כדי להעניק לכם חוויית קנייה איכותית,
						משתלמת ונוחה. תמצאו כאן מגוון רחב של פריטים – טריים, מהימנים
						ובמחירים מעולים. אם יש לכם שאלות על המוצרים, המבצעים, או איך לבצע
						הזמנה – אל תהססו לפנות אלינו! קנייה נעימה!
					</Typography>
				</Box>

				<Row container spacing={3}>
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
								}[product.category.toLowerCase()] || "ליחידה";

							return (
								<Col
									key={product.product_name}
									xs={6}
									sm={2}
									md={4}
									xl={3}
								>
									<Card sx={{mt: 3, height: "95%"}}>
										<CardMedia
											component='img'
											height='200'
											image={product.image_url}
											alt={product.product_name}
										/>
										<CardContent
											sx={{
												display: "flex",
												flexDirection: "column",
												justifyContent: "space-between",
											}}
										>
											<Typography
												variant='h6'
												align='center'
												fontWeight='bold'
											>
												{product.product_name}
											</Typography>

											{product.sale ? (
												<>
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
															: "במלאי"}
													</Typography>
													<Chip
														label={`${product.discount}% הנחה`}
														color='error'
														size='small'
													/>
													<hr />
													<Typography
														variant='h6'
														align='center'
														className='text-center'
													>
														<s>
															{product.price.toLocaleString(
																"he-IL",
																{
																	style: "currency",
																	currency: "ILS",
																},
															)}
														</s>
													</Typography>
													<Typography
														variant='h5'
														align='center'
														className='text-center text-success'
													>
														{discountedPrice.toLocaleString(
															"he-IL",
															{
																style: "currency",
																currency: "ILS",
															},
														)}
													</Typography>
												</>
											) : (
												<>
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
															: "במלאי"}
													</Typography>

													<Typography
														variant='h6'
														align='center'
													>
														{product.price.toLocaleString(
															"he-IL",
															{
																style: "currency",
																currency: "ILS",
															},
														)}
													</Typography>
												</>
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
												>
													<IconButton>
														<RemoveSharpIcon />
													</IconButton>
												</Button>
												<Typography variant='h6' align='center'>
													<b>{productQuantity}</b>
												</Typography>
												<Button
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
												>
													<IconButton>
														<AddSharpIcon />
													</IconButton>
												</Button>
											</Box>
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
														: "btn-outline-primary"
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
													"הוספה לסל"
												)}
											</button>
										</CardContent>
										{canEdit && (
											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
													p: 1,
												}}
											>
												<Tooltip title='ערוך מוצר'>
													<Fab
														size='small'
														color='warning'
														aria-label='ערוך מוצר'
														onClick={() => {
															setProductNameToUpdate(
																product.product_name,
															);
															onShowUpdateProductModal();
														}}
													>
														<EditIcon />
													</Fab>
												</Tooltip>
												<Tooltip title='מחק מוצר'>
													<Fab
														size='small'
														color='error'
														aria-label='מחק מוצר'
														onClick={() =>
															openDeleteModal(
																product.product_name,
															)
														}
													>
														<DeleteIcon />
													</Fab>
												</Tooltip>
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

				{/* Show More Button */}
				{!searchQuery && visibleCount < products.length && (
					<Box textAlign='center' mt={4}>
						<Fab
							color='primary'
							variant='extended'
							onClick={() => setVisibleCount((prev) => prev + 15)}
						>
							הצג עוד מוצרים
						</Fab>
					</Box>
				)}
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
				title={"אתה עומד למחוק מוצר מהחנות"}
				description={`האם אתה בטוח שברצונך למחוק את המוצר ( ${productToDelete} ) ? פעולה זו לא ניתנת לביטול`}
				handleDelete={() => handleDelete(productToDelete)}
			/>
		</Box>
	);
};

export default Home;
