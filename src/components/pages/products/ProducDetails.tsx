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
import {path} from "../../../routes/routes";
import {formatPrice} from "../../../helpers/dateAndPriceFormat";
import ColorsAndSizes from "../../../atoms/productsManage/ColorsAndSizes";

interface ProductDetailsProps {}

const ProductDetails: FunctionComponent<ProductDetailsProps> = () => {
	const {productName} = useParams<{productName: string}>();
	const [product, setProduct] = useState<Products>(initialProductValue);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
					חזור לדף הקודם
				</Button>
			</Container>
		);

	const capitalize = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

	if (!productName) navigate(-1);

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
							בית
						</Button>
						<Button
							color='inherit'
							onClick={() => {
								navigate(-1);
							}}
							sx={{display: "flex", alignItems: "center"}}
						>
							<StoreIcon sx={{mr: 0.5}} fontSize='inherit' />
							מוצרים
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
										backgroundColor: "#f5f5f5",
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
									value={4.5}
									precision={0.5}
									readOnly
									sx={{mr: 1}}
								/>
								<Typography variant='body2' color='text.secondary'>
									(24 חוות דעת)
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
											חזור לחנות
										</Button>
									</Grid>
									<Grid size={{xs: 12, md: 6}}>
										<Button
											fullWidth
											variant='contained'
											size='large'
											startIcon={<ShoppingCartIcon />}
											onClick={() => alert("הוספה לעגלה")}
											sx={{
												py: 1.5,
												fontWeight: 700,
												fontSize: "1rem",
												borderRadius: 1,
											}}
										>
											הוסף לסל
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
						פרטים נוספים
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
									משלוחים והחזרות
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									משלוח חינם לכל הרכישות מעל 200 ש"ח. החזרות בתוך 14
									יום.
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
									תמיכה
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									צוות התמיכה שלנו זמין 24/7 לעזור עם כל שאלה או בעיה.
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
									אחריות
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									אחריות יצרן לשנה על כל המוצרים שלנו.
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
