import {FunctionComponent, memo, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getProductById} from "../../../services/productsServices";
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
import {
	ArrowBack as ArrowBackIcon,
	Share as ShareIcon,
	Home as HomeIcon,
	Store as StoreIcon,
	Phone,
} from "@mui/icons-material";
import {path} from "../../../routes/routes";
import {formatPrice} from "../../../helpers/dateAndPriceFormat";
import ColorsAndSizes from "../../../atoms/productsManage/ColorsAndSizes";
import {useTranslation} from "react-i18next";
import {useUser} from "../../../context/useUSer";
import {showError, showSuccess} from "../../../atoms/toasts/ReactToast";
import {generateSingleProductJsonLd} from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";
import {Helmet} from "react-helmet";
import {categoryLabels, categoryPathMap} from "../../../interfaces/productsCategoeis";
import ProductDetailsTable from "./ProductDetailsTable";
import LikeButton from "../../../atoms/LikeButton";

interface ProductDetailsProps {}

const ProductDetails: FunctionComponent<ProductDetailsProps> = () => {
	const {t} = useTranslation();
	const [product, setProduct] = useState<Products>(initialProductValue as Products);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const {productId} = useParams();
	const navigate = useNavigate();
	const {isLoggedIn} = useUser();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [rating, setRating] = useState<number | null>(product.rating || null);

	const MemoizedProductDetailsTable = memo(ProductDetailsTable);


	// ----- Fetch Product -----
	useEffect(() => {
		if (!productId) {
			navigate(path.Home);
			return;
		}
		setLoading(true);
		getProductById(productId)
			.then((res) => setProduct(res))
			.catch(() => {
				setError("حدث خطأ أثناء تحميل المنتج");
				setProduct(initialProductValue as Products);
			})
			.finally(() => setLoading(false));
	}, [productId, navigate]);

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

	if (!productId) navigate(-1);

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

	const productJ = generateSingleProductJsonLd(product);

	return (
		<>
			<JsonLd data={productJ} />

			<Helmet>
				<title>{product.product_name} | صفقه</title>
				<meta
					name='description'
					content={product.description?.substring(0, 160)}
				/>
				<meta property='og:title' content={product.product_name} />
				<meta
					property='og:description'
					content={product.description?.substring(0, 160)}
				/>
				<meta property='og:image' content={product.image?.url} />
				<meta property='og:type' content='product' />
				<meta
					property='product:price:amount'
					content={product.price.toString()}
				/>
				<meta property='product:price:currency' content='ILS' />
			</Helmet>
			<Box component={"main"}>
				<Container maxWidth='xl' sx={{py: 4, my: 5}}>
					{/* Breadcrumbs */}
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
									const catPath =
										categoryPathMap[product.category] || "";
									navigate(catPath);
								}}
								sx={{display: "flex", alignItems: "center"}}
							>
								<StoreIcon sx={{mr: 0.5}} fontSize='inherit' />
								{categoryLabels[product.category] || t("categories")}
							</Button>
							<Button
								color='inherit'
								onClick={() => {
									const catPath =
										categoryPathMap[product.category] || "";
									navigate(catPath);
								}}
								sx={{display: "flex", alignItems: "center"}}
							>
								<Typography p={3} color='info'>
									{t(product.category)}
								</Typography>
							</Button>

							<Typography p={3} color='info'>
								{product.product_name}
							</Typography>
						</Breadcrumbs>
					</Box>

					{/* Main Grid */}
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
								{!loading && product.image && (
									<CardMedia
										component='img'
										image={`${product.image.url}?w=800&q=75`}
										alt={`صورة ${product.product_name}`}
										aria-label={`صورة ${product.product_name}`}
										loading='lazy'
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
									{/* <IconButton
										aria-label='add to favorites'
										onClick={() =>
											handleLike(
												isLoggedIn,
												isLiking,
												navigate,
												setIsLiking,
												setProduct,
												product,
												auth,
											)
										}
										disabled={isLiking}
										sx={{position: "relative"}}
									>
										{isLiking ? (
											<>
												<FavoriteBorderIcon sx={{opacity: 0.1}} />
												<CircularProgress
													size={10}
													sx={{
														position: "absolute",
														top: "35%",
														left: "37%",
													}}
												/>
											</>
										) : userLiked ? (
											<>
												<FavoriteIcon color='error' />
												<Typography
													sx={{ml: 0.5, fontSize: "0.875rem"}}
												>
													{product.likes?.length ?? 0}
												</Typography>
											</>
										) : (
											<>
												<FavoriteBorderIcon />
												<Typography
													sx={{ml: 0.5, fontSize: "0.875rem"}}
												>
													{product.likes?.length ?? 0}
												</Typography>
											</>
										)}
									</IconButton> */}
									{/* <LikeButton
										product={product}
										// onLikeToggle={onLikeToggle}
									/> */}
									<IconButton
										aria-label='add to favorites'
										onClick={() => {
											if (!isLoggedIn) {
												navigate(path.Login);
												return;
											}
										}}
									>
										<LikeButton
											product={product}
											setProduct={setProduct}
										/>
									</IconButton>
									<IconButton
										aria-label='share'
										onClick={() => {
											if (navigator.share) {
												navigator
													.share({
														title: `منتج ${product.product_name} رائع`,
														text: `شوف ${product.product_name} المميز! عللى موقع صفقه`,
														url: window.location.href,
													})
													.then(() =>
														showSuccess("تمت المشاركة بنجاح"),
													)
													.catch(() =>
														showError("فشل المشاركة"),
													);
											} else
												showError(
													"المشاركة غير مدعومة في هذا المتصفح",
												);
										}}
									>
										<ShareIcon />
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
										label={categoryLabels[product.category]}
										color='secondary'
										sx={{mb: 3, alignSelf: "flex-start"}}
									/>
								)}

								<Box sx={{display: "flex", alignItems: "center", mb: 3}}>
									<Rating
										value={rating}
										precision={0.5}
										onChange={(_, newValue) => setRating(newValue)}
										sx={{mr: 1}}
									/>
									<Typography variant='body2' color='text.secondary'>
										( חוות דעת - {product.reviewCount || 132} )
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

								<ColorsAndSizes category={product.category} />

								<Divider sx={{my: 3}} />

								{product.description && (
									<>
										<Typography
											variant='h6'
											gutterBottom
											sx={{fontWeight: 600}}
										>
											وصف المنتج
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

								{/* Quantity Controls */}
								{/* <Box role='group' aria-label='إدارة الكمية'>
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
											disabled={
												isOutOfStock || productQuantity <= 1
											}
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
										<Typography
											aria-live='polite'
											fontSize={30}
											color='primary'
										>
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
								</Box> */}

								<Box sx={{mt: "auto", pt: 3}}>
									<Grid container spacing={2}>
										<Grid size={{xs: 12, md: 6}}>
											<Button
												fullWidth
												variant='contained'
												size='large'
												onClick={() => navigate(-1)}
												sx={{
													py: 1.5,
													fontWeight: 700,
													fontSize: "1.1rem",
													borderRadius: 1,
												}}
											>
												العودة إلى صفقه
											</Button>
										</Grid>
										<Grid size={{xs: 12, md: 6}}>
											<Button
												fullWidth
												variant='contained'
												size='large'
												startIcon={<Phone color='success' />}
												href='tel:0538346915'
												sx={{
													py: 2.2,
													fontWeight: 700,
													fontSize: "1rem",
													borderRadius: 1,
												}}
											></Button>
										</Grid>
									</Grid>
								</Box>
							</Box>
						</Grid>
					</Grid>

					{/* Additional Info */}
					<Box sx={{mt: 8}}>
						<Typography
							variant='h5'
							gutterBottom
							sx={{fontWeight: 700, mb: 4}}
						>
							مزيد من التفاصيل
						</Typography>
						<MemoizedProductDetailsTable product={product} />
						<Grid container spacing={4}>
							{[
								{
									title: "دعم",
									text: "فريق الدعم لدينا متاح على مدار الساعة طوال أيام الأسبوع للمساعدة في أي أسئلة أو مشكلات",
								},
							].map((item, idx) => (
								<Grid key={idx} size={{xs: 12, md: 4}}>
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
											{item.title}
										</Typography>
										<Typography
											variant='body2'
											color='text.secondary'
										>
											{item.text}
										</Typography>
									</Card>
								</Grid>
							))}
						</Grid>
					</Box>
				</Container>
			</Box>
		</>
	);
};

export default ProductDetails;
