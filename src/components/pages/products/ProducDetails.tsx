import {FunctionComponent, memo, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {deleteProduct, getProductById} from "../../../services/productsServices";
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
	Tooltip,
	TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
	ArrowBack as ArrowBackIcon,
	Share as ShareIcon,
	Home as HomeIcon,
	Store as StoreIcon,
	Phone,
	ChevronRight,
} from "@mui/icons-material";
import {path} from "../../../routes/routes";
import {formatPrice} from "../../../helpers/dateAndPriceFormat";
import ColorsAndSizes from "../../../atoms/productsManage/ColorsAndSizes";
import {useTranslation} from "react-i18next";
import {useUser} from "../../../context/useUSer";
import {showError, showSuccess} from "../../../atoms/toasts/ReactToast";
import {generateSingleProductJsonLd} from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";
import {categoryLabels, categoryPathMap} from "../../../interfaces/productsCategoeis";
import ProductDetailsTable from "./ProductDetailsTable";
import LikeButton from "../../../atoms/LikeButton";
import UpdateProductModal from "../../../atoms/productsManage/addAndUpdateProduct/UpdateProductModal";
import AlertDialogs from "../../../atoms/toasts/Sweetalert";

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
	const [rating, setRating] = useState<number>(0);
	const [value, setValue] = useState("");
	const [show, setShow] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const {auth} = useUser();

	const MemoizedProductDetailsTable = memo(ProductDetailsTable);
	const onShowUpdateProductModal = () => setShow(true);
	const onHide = () => setShow(false);
	const onShowDeleteModal = () => setShowDeleteModal(true);
	const onHideDeleteModal = () => setShowDeleteModal(false);
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

	const handleDelete = () => {
		deleteProduct(productId as string)
			.then((res) => {
				setProduct(res);
			})
			.catch((err) => {
				showError(err as string);
			});
	};

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

	const currentUrl = `https://client-qqq1.vercel.app/product/${product.category}/${product.brand}/${product._id}`;

	return (
		<>
			
				<JsonLd data={productJ} />
				<title>{product.product_name} | صفقة</title>
				<link rel='canonical' href={currentUrl} />
				<meta
					name='description'
					content={`اشتري ${product.product_name} بأفضل سعر على صفقة. ${product.description?.substring(0, 120)}`}
				/>
				<meta property='og:title' content={product.product_name} />
				<meta
					property='og:description'
					content={product.description?.substring(0, 160)}
				/>
				<meta property='og:image' content={product.image.url} />
				<meta property='og:type' content='product' />
				<meta
					property='product:price:amount'
					content={product.price.toString()}
				/>
				<meta property='product:price:currency' content='ILS' />
			
			<Box component={"main"}>
				<Container maxWidth='xl' sx={{py: 4, my: 5}}>
					{/* Breadcrumbs */}
					<Box
						sx={{
							mb: 4,
							px: {xs: 1, sm: 0},
							py: 1,
							// backgroundColor:
							// 	mode === "dark"
							// 		? "rgba(255, 255, 255, 0.03)"
							// 		: "rgba(0, 0, 0, 0.02)",
							borderRadius: 2,
							// border: `1px solid ${mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
						}}
					>
						<Breadcrumbs
							aria-label={
								t("product.breadcrumbNavigation") || "مسار التنقل"
							}
							separator={
								<ChevronRight
									sx={{
										fontSize: 20,
										// color:
										// 	mode === "dark"
										// 		? "text.secondary"
										// 		: "text.disabled",
										mx: 0.5,
									}}
								/>
							}
							sx={{
								"& .MuiBreadcrumbs-ol": {
									flexWrap: "nowrap",
									overflow: "hidden",
								},
								"& .MuiBreadcrumbs-li": {
									display: "flex",
									alignItems: "center",
									maxWidth: {xs: "120px", sm: "200px", md: "none"},
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								},
							}}
						>
							{/* Home Link */}
							<Tooltip title={t("home") || "الصفحة الرئيسية"} arrow>
								<Button
									component={Link}
									to={path.Home}
									startIcon={
										<HomeIcon
											sx={{
												fontSize: {xs: 16, sm: 18},
												// color:
												// mode === "dark"
												// 	? "primary.light"
												// 	: "primary.main",
											}}
										/>
									}
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 0.5,
										// color:
										// 	mode === "dark"
										// 		? "text.secondary"
										// 		: "text.primary",
										textTransform: "none",
										fontSize: {xs: "0.8rem", sm: "0.875rem"},
										fontWeight: 400,
										px: 1,
										py: 0.5,
										minHeight: 32,
										borderRadius: 1,
										// "&:hover": {
										// 	backgroundColor:
										// 		mode === "dark"
										// 			? "rgba(144, 202, 249, 0.08)"
										// 			: "rgba(25, 118, 210, 0.04)",
										// 	color:
										// 		mode === "dark"
										// 			? "primary.light"
										// 			: "primary.main",
										// },
									}}
								>
									<Typography
										variant='body2'
										sx={{
											fontWeight: 500,
											display: {xs: "none", sm: "block"},
										}}
									>
										{t("home")}
									</Typography>
								</Button>
							</Tooltip>

							{/* Category Link */}
							{product.category && (
								<Tooltip
									title={
										categoryLabels[product.category] ||
										t(product.category)
									}
									arrow
								>
									<Button
										onClick={() => {
											const catPath =
												categoryPathMap[product.category] || "";
											if (catPath) {
												navigate(catPath);
											}
										}}
										startIcon={
											<StoreIcon
												sx={{
													fontSize: {xs: 16, sm: 18},
													// color:
													// 	mode === "dark"
													// 		? "secondary.light"
													// 		: "secondary.main",
												}}
											/>
										}
										disabled={!categoryPathMap[product.category]}
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 0.5,
											// color:
											// 	mode === "dark"
											// 		? "text.secondary"
											// 		: "text.primary",
											textTransform: "none",
											fontSize: {xs: "0.8rem", sm: "0.875rem"},
											fontWeight: 400,
											px: 1,
											py: 0.5,
											minHeight: 32,
											borderRadius: 1,
											// "&:hover:not(:disabled)": {
											// 	backgroundColor:
											// 		mode === "dark"
											// 			? "rgba(240, 98, 146, 0.08)"
											// 			: "rgba(240, 98, 146, 0.04)",
											// 	color:
											// 		mode === "dark"
											// 			? "secondary.light"
											// 			: "secondary.main",
											// },
											"&.Mui-disabled": {
												opacity: 0.7,
											},
										}}
									>
										<Typography
											variant='body2'
											sx={{
												fontWeight: 500,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{categoryLabels[product.category] ||
												t(product.category)}
										</Typography>
									</Button>
								</Tooltip>
							)}

							{/* Current Product - Active Page */}
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									px: {xs: 1.5, sm: 2},
									py: 0.5,
									minHeight: 32,
									borderRadius: 1,
									// backgroundColor:
									// mode === "dark"
									// 	? "rgba(255, 255, 255, 0.05)"
									// 	: "rgba(0, 0, 0, 0.03)",
									// border: `1px solid ${mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
									maxWidth: {xs: "150px", sm: "300px", md: "400px"},
									overflow: "hidden",
								}}
							>
								<Typography
									variant='body2'
									sx={{
										fontWeight: 600,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										fontSize: {xs: "0.8rem", sm: "0.875rem"},
									}}
									title={product.product_name}
								>
									{product.product_name}
								</Typography>
							</Box>
						</Breadcrumbs>

						{/* Mobile View - Compact Version */}
						<Box
							sx={{
								display: {xs: "flex", sm: "none"},
								alignItems: "center",
								gap: 1,
								mt: 1,
							}}
						>
							<IconButton size='small' onClick={() => navigate(-1)}>
								<ArrowBackIcon fontSize='small' />
							</IconButton>
							<Typography
								variant='caption'
								sx={{
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
									flex: 1,
								}}
							>
								{product.product_name}
							</Typography>
						</Box>
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
								{auth?._id &&
									product.seller?.user &&
									auth._id === String(product.seller.user) && (
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-around",
												gap: 1,
												borderTop: `1px solid ${theme.palette.divider}`,
												p: 1,
											}}
										>
											<IconButton
												size='small'
												color='warning'
												aria-label='تعديل المنتج'
												onClick={() => {
													// setProductIdToUpdate(
													// 	product._id as string,
													// );
													onShowUpdateProductModal();
												}}
												sx={{
													bgcolor: "warning.light",
													"&:hover": {bgcolor: "warning.main"},
												}}
											>
												<EditIcon fontSize='small' />
											</IconButton>

											<IconButton
												size='small'
												color='error'
												aria-label='حذف المنتج'
												onClick={onShowDeleteModal}
												sx={{
													bgcolor: "error.light",
													"&:hover": {bgcolor: "error.main"},
												}}
											>
												<DeleteIcon fontSize='small' />
											</IconButton>
										</Box>
									)}
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
										onChange={(_, newValue) =>
											setRating(newValue ?? 0)
										}
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
								<Grid key={idx} size={{xs: 12, md: 6}}>
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
							{/* TODO:comments */}
							<Grid size={{xs: 12, md: 6}}>
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
										{"تعليقات"}
									</Typography>
									<hr />
									<Typography variant='body2' color='text.secondary'>
										{"تعليقات 1"}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										{"تعليقات 2"}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										{"تعليقات 3"}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										{"تعليقات 4"}
									</Typography>
									<hr />
									<Typography variant='body2' color='text.secondary'>
										{"كتابه تعليق"}
									</Typography>
									<TextField
										multiline
										onChange={(e) => setValue(e.target.value)}
										variant='filled'
										type='text'
										fullWidth
									/>
									<div className=''>{value}</div>
								</Card>
							</Grid>
						</Grid>
					</Box>
				</Container>
			</Box>
			<AlertDialogs
				handleDelete={handleDelete}
				onHide={onHideDeleteModal}
				show={showDeleteModal}
				title={`حذف ${product.product_name}`}
				description={`هل انت متاكد انك تريد حذف - ${product.product_name} - التابع للمستخدم - ${product.seller?.slug}`}
			/>
			<UpdateProductModal
				show={show}
				onHide={onHide}
				productId={product._id as string}
				refresh={() => {}}
			/>
		</>
	);
};

export default ProductDetails;
