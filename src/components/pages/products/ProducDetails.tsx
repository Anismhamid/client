import {FunctionComponent, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getProductByspicificName} from "../../../services/productsServices";
import {initialProductValue, Products} from "../../../interfaces/Products";
import {
	Box,
	CircularProgress,
	Typography,
	Button,
	Card,
	CardMedia,
	IconButton,
	Container,
	Grid,
	Divider,
	Chip,
	Breadcrumbs,
	Rating,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import {path, productsPathes} from "../../../routes/routes";
import {formatPrice} from "../../../helpers/dateAndPriceFormat";
import ColorsAndSizes from "../../../atoms/productsManage/ColorsAndSizes";
import {useTranslation} from "react-i18next";
import {useUser} from "../../../context/useUSer";
import {handleAddToCart, handleQuantity} from "../../../helpers/fruitesFunctions";
import {showError} from "../../../atoms/toasts/ReactToast";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";

interface ProductDetailsProps {}

const ProductDetails: FunctionComponent<ProductDetailsProps> = () => {
	const {t} = useTranslation();
	const [quantities, setQuantities] = useState<{[key: string]: number}>({});
	const {productName} = useParams<{productName: string}>();
	const [product, setProduct] = useState<Products>(initialProductValue);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();
	const {auth, isLoggedIn} = useUser();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [rating, setRating] = useState<number | null>(product.rating || null);
	const [loadingAddToCart, setLoadingAddToCart] = useState<string | null>(null);

	const handleAdd = async (
		product_name: string,
		quantity: {[key: string]: number},
		price: number,
		product_image: string,
		sale: boolean,
		discount: number,
	) => {
		const productQuantity = quantity[product_name] || 1; // Access the quantity of the specific product
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
				setQuantities((prev) => ({...prev, [product_name]: 1}));
			} catch (error) {
				showError("אירעה שגיאה בהוספת מוצר לעגלה");
			} finally {
				setLoadingAddToCart(null);
			}
		}
	};

	useEffect(() => {
		if (productName) {
			const decodedName = decodeURIComponent(productName);
			setLoading(true);
			getProductByspicificName(decodedName)
				.then((res) => {
					if (!res) {
						setError("המוצר לא נמצא");
						setProduct(initialProductValue);
					} else {
						setProduct(res);
						setError("");
					}
				})
				.catch(() => {
					setError("אירעה שגיאה בטעינת המוצר");
					setProduct(initialProductValue);
				})
				.finally(() => setLoading(false));
		}
	}, [productName]);

	if (loading)
		return (
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				minHeight='80vh'
			>
				<CircularProgress color='primary' size={60} />
			</Box>
		);

	if (!productName) navigate(-1);
	if (error)
		return (
			<Container maxWidth='md' sx={{py: 8, textAlign: "center"}}>
				<Typography variant='h5' color='error' gutterBottom>
					{error}
				</Typography>
				<Button
					variant='contained'
					startIcon={<ArrowBackIcon />}
					onClick={() => navigate(-1)}
					sx={{mt: 3}}
				>
					{t("backOneStep")}
				</Button>
			</Container>
		);

	const capitalize = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);
	const isOutOfStock = product.quantity_in_stock === 0;
	const productQuantity = quantities[product.product_name] || 1;

	return (
		<Box component={"main"}>
			<Container maxWidth='xl' sx={{py: 4, my: 5}}>
				{/* Breadcrumbs Navigation */}
				<Box sx={{mb: 4}}>
					<Breadcrumbs aria-label='breadcrumb' separator='›'>
						<Button
							color='inherit'
							href={path.Home}
							sx={{display: "flex", alignItems: "center"}}
							startIcon={
								<HomeIcon sx={{mr: 0.5, ml: 1}} fontSize='inherit' />
							}
						>
							{t("home")}
						</Button>
						<Button
							color='inherit'
							onClick={() => {
								product.category === "Fruit"
									? navigate(productsPathes.fruits)
									: navigate(productsPathes.vegetable);
							}}
							sx={{display: "flex", alignItems: "center"}}
						>
							<StoreIcon sx={{mr: 0.5}} fontSize='inherit' />
							{/* {t("products")} */}
							{product.category === "Fruit" ? "فواكه" : "خضار"}
						</Button>
						<Typography p={3} color='info'>
							{product.product_name}
						</Typography>
					</Breadcrumbs>
				</Box>

				<Grid container spacing={4}>
					{/* Product Image */}
					<Grid size={{xs: 12, md: 6}}>
						<Card
							sx={{
								borderRadius: 2,
								overflow: "hidden",
								boxShadow: theme.shadows[3],
								height: "100%",
								display: "flex",
								flexDirection: "column",
								// backgroundColor: "#FFFFFF",
							}}
						>
							{product.image_url && (
								<CardMedia
									component='img'
									image={product.image_url}
									alt={product.product_name}
									sx={{
										height: isMobile ? "300px" : "500px",
										objectFit: "contain",
										p: 2,
										backgroundColor: "#FFFFFF",
									}}
								/>
							)}
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									p: 2,
									borderTop: `1px solid ${theme.palette.divider}`,
								}}
							>
								<IconButton aria-label='add to favorites'>
									<FavoriteBorderIcon color='primary' />
								</IconButton>
								<IconButton aria-label='share'>
									<ShareIcon color='primary' />
								</IconButton>
							</Box>
						</Card>
					</Grid>

					{/* Product Details */}
					<Grid size={{xs: 12, md: 6}}>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								height: "100%",
							}}
						>
							<Typography
								variant='h3'
								component='h1'
								gutterBottom
								sx={{fontWeight: 700}}
							>
								{product.product_name}
							</Typography>

							{product.category && (
								<Chip
									label={product.category}
									color='secondary'
									sx={{mb: 3, alignSelf: "flex-start"}}
								/>
							)}

							<Box sx={{display: "flex", alignItems: "center", mb: 3}}>
								<Rating
									// dir='ltr'
									value={rating}
									precision={0.5}
									onChange={(_, newValue) => setRating(newValue)}
									sx={{mr: 1}}
								/>
								<Typography variant='body2' color='text.secondary'>
									( חוות דעת - {product.reviewCount || 0} )
								</Typography>
							</Box>

							<Typography
								variant='h4'
								color='info'
								gutterBottom
								sx={{fontWeight: 700, mb: 3}}
							>
								{formatPrice(product.price)}
							</Typography>

							<ColorsAndSizes category={capitalize(product.category)} />

							<Divider sx={{my: 3}} />

							{product.description && (
								<>
									<Typography
										variant='h6'
										gutterBottom
										sx={{fontWeight: 600}}
									>
										תיאור המוצר
									</Typography>
									<Typography
										variant='body1'
										color='text.secondary'
										sx={{mb: 3, lineHeight: 1.8}}
									>
										{product.description}
									</Typography>
								</>
							)}
							<Box role='group' aria-label='إدارة الكمية'>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										my: 1,
										width: 200,
										backgroundColor: "white",
										p: 1,
									}}
								>
									<Button
										size='small'
										color='error'
										disabled={isOutOfStock || productQuantity <= 1}
										onClick={() =>
											handleQuantity(
												setQuantities,
												"-",
												product.product_name,
											)
										}
										startIcon={<RemoveSharpIcon />}
										aria-label='تقليل الكمية'
									/>

									<Typography aria-live='polite'>
										{productQuantity}
									</Typography>

									<Button
										size='small'
										color='success'
										disabled={isOutOfStock}
										onClick={() =>
											handleQuantity(
												setQuantities,
												"+",
												product.product_name,
											)
										}
										startIcon={<AddSharpIcon />}
										aria-label='زيادة الكمية'
									/>
								</Box>
							</Box>
							<Box sx={{mt: "auto", pt: 3}}>
								<Grid container spacing={2}>
									<Grid size={{xs: 12, md: 6}}>
										<Button
											fullWidth
											variant='outlined'
											size='large'
											onClick={() => navigate(-1)}
											sx={{
												py: 1.5,
												fontWeight: 700,
												fontSize: "1.1rem",
												borderRadius: 1,
											}}
										>
											العودة إلى السوق
										</Button>
									</Grid>
									<Grid size={{xs: 12, md: 6}}>
										<Button
											fullWidth
											variant='contained'
											size='large'
											startIcon={<ShoppingCartIcon />}
											onClick={() =>
												handleAdd(
													product.product_name,
													quantities,
													product.price,
													product.image_url,
													product.sale,
													product.discount || 0,
												)
											}
											disabled={
												loadingAddToCart === product.product_name
											}
											sx={{
												py: 1.5,
												fontWeight: 700,
												fontSize: "1rem",
												borderRadius: 1,
											}}
										>
											{loadingAddToCart === product.product_name
												? "جاري الإضافة..."
												: "أضف إلى السلة"}
										</Button>
									</Grid>
								</Grid>
							</Box>
						</Box>
					</Grid>
				</Grid>

				{/* Additional Information Section */}
				<Box sx={{mt: 8}}>
					<Typography variant='h5' gutterBottom sx={{fontWeight: 700, mb: 4}}>
						مزيد من التفاصيل
					</Typography>
					<Grid container spacing={4}>
						<Grid size={{xs: 12, md: 4}}>
							<Card
								sx={{
									p: 3,
									height: "100%",
									borderRadius: 2,
									boxShadow: theme.shadows[2],
								}}
							>
								<Typography
									variant='h6'
									gutterBottom
									sx={{fontWeight: 600}}
								>
									الشحن والإرجاع
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									شحن مجاني لجميع المشتريات التي تزيد قيمتها عن 300
									شيكل. إمكانية الإرجاع خلال ١٤ يومًا
								</Typography>
							</Card>
						</Grid>
						<Grid size={{xs: 12, md: 4}}>
							<Card
								sx={{
									p: 3,
									height: "100%",
									borderRadius: 2,
									boxShadow: theme.shadows[2],
								}}
							>
								<Typography
									variant='h6'
									gutterBottom
									sx={{fontWeight: 600}}
								>
									دعم
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									فريق الدعم لدينا متاح على مدار الساعة طوال أيام
									الأسبوع للمساعدة في أي أسئلة أو مشكلات
								</Typography>
							</Card>
						</Grid>
						<Grid size={{xs: 12, md: 4}}>
							<Card
								sx={{
									p: 3,
									height: "100%",
									borderRadius: 2,
									boxShadow: theme.shadows[2],
								}}
							>
								<Typography
									variant='h6'
									gutterBottom
									sx={{fontWeight: 600}}
								>
									مسؤولية
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									ضمان الشركة المصنعة لمدة عام واحد على جميع منتجاتنا
								</Typography>
							</Card>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</Box>
	);
};

export default ProductDetails;
