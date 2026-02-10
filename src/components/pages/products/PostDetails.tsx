import {
	FunctionComponent,
	memo,
	useEffect,
	useState,
	useCallback,
	useMemo,
	useRef,
} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {deleteProduct, getProductById} from "../../../services/postsServices";
import {initialProductValue, Products} from "../../../interfaces/Posts";
import {
	Box,
	CircularProgress,
	Typography,
	Button,
	Card,
	CardMedia,
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
	Alert,
	Stack,
	IconButton,
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
	Comment,
	Error as ErrorIcon,
	ZoomOut,
	FullscreenExit,
	Fullscreen,
	ZoomIn,
} from "@mui/icons-material";
import {path} from "../../../routes/routes";
import {formatPrice} from "../../../helpers/dateAndPriceFormat";
import ColorsAndSizes from "../../../atoms/productsManage/ColorsAndSizes";
import {useTranslation} from "react-i18next";
import {useUser} from "../../../context/useUSer";
import {showError, showSuccess} from "../../../atoms/toasts/ReactToast";
import {generateSingleProductJsonLd} from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";
import {categoryLabels, categoryPathMap} from "../../../interfaces/postsCategoeis";
import LikeButton from "../../../atoms/LikeButton";
import UpdateProductModal from "../../../atoms/productsManage/addAndUpdateProduct/UpdatePostModal";
import AlertDialogs from "../../../atoms/toasts/Sweetalert";
import PostDetailsTable from "./PostDetailsTable";

interface PostDetailsProps {}

const PostDetails: FunctionComponent<PostDetailsProps> = () => {
	const {t} = useTranslation();
	const [product, setProduct] = useState<Products>(initialProductValue as Products);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const {productId} = useParams<{productId: string}>();
	const navigate = useNavigate();
	const {isLoggedIn, auth} = useUser();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	//  التحكم بالصوره
	// ===== إضافة الـ states في بداية المكون =====
	const [zoomLevel, setZoomLevel] = useState<number>(1);
	const [isZoomed, setIsZoomed] = useState<boolean>(false);
	const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
	const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
	const imageContainerRef = useRef<HTMLDivElement>(null);

	// ===== دوال التحكم بالصورة =====
	const handleZoomIn = useCallback(() => {
		setZoomLevel((prev) => Math.min(prev + 0.5, 3));
		setIsZoomed(true);
	}, []);

	const handleZoomOut = useCallback(() => {
		setZoomLevel((prev) => Math.max(prev - 0.5, 1));
		if (zoomLevel <= 1) setIsZoomed(false);
	}, [zoomLevel]);

	const handleResetZoom = useCallback(() => {
		setZoomLevel(1);
		setIsZoomed(false);
	}, []);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!isZoomed || !imageContainerRef.current) return;

			const container = imageContainerRef.current;
			const {left, top, width, height} = container.getBoundingClientRect();
			const x = ((e.clientX - left) / width) * 100;
			const y = ((e.clientY - top) / height) * 100;
			setMousePosition({x, y});
		},
		[isZoomed],
	);

	const handleFullscreenToggle = useCallback(() => {
		if (!document.fullscreenElement) {
			imageContainerRef.current?.requestFullscreen();
			setIsFullscreen(true);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	}, []);

	// ===== تأثير الخروج من Fullscreen =====
	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () =>
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
	}, []);

	// أزل القيمة المبدئية المعتمدة على product
	const [rating, setRating] = useState<number>(0);
	const [comment, setComment] = useState("");
	const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [isSharing, setIsSharing] = useState<boolean>(false);

	// ----- Memoized values -----
	const isOwner = useMemo(() => {
		return (
			auth?._id && product.seller?.user && auth._id === String(product.seller.user)
		);
	}, [auth?._id, product.seller?.user]);

	const MemoizedPostDetailsTable = memo(PostDetailsTable);

	// ----- Memoized handlers -----
	const handleShare = useCallback(async () => {
		if (!navigator.share) {
			showError("المشاركة غير مدعومة في هذا المتصفح");
			return;
		}

		setIsSharing(true);
		try {
			await navigator.share({
				title: `منتج ${product.product_name} رائع`,
				text: `شوف ${product.product_name} المميز! على موقع صفقه`,
				url: window.location.href,
			});
			showSuccess("تمت المشاركة بنجاح");
		} catch (error) {
			if ((error as Error).name !== "AbortError") {
				showError("فشل المشاركة");
			}
		} finally {
			setIsSharing(false);
		}
	}, [product.product_name]);

	const handleDeleteProduct = useCallback(async () => {
		if (!productId) return;

		try {
			await deleteProduct(productId);
			showSuccess("تم حذف المنتج بنجاح");
			navigate(-1);
		} catch (err) {
			showError(err as string);
		}
	}, [productId, navigate]);

	const handleEditProduct = useCallback(() => {
		setShowUpdateModal(true);
	}, []);

	const handleCloseUpdateModal = useCallback(() => {
		setShowUpdateModal(false);
	}, []);

	const handleRefreshProduct = useCallback(() => {
		if (!productId) return;
		setLoading(true);
		getProductById(productId)
			.then((res) => setProduct(res))
			.catch(() => setError("حدث خطأ أثناء تحميل المنتج"))
			.finally(() => setLoading(false));
	}, [productId]);

	// ----- Fetch Product -----
	useEffect(() => {
		if (!productId) {
			navigate(path.Home);
			return;
		}

		setLoading(true);
		setError("");

		getProductById(productId)
			.then((res) => {
				setProduct(res);
				// تحديث rating هنا بعد جلب البيانات
				setRating(res.rating || 0);
			})
			.catch((err) => {
				console.error("Error fetching product:", err);
				setError("حدث خطأ أثناء تحميل المنتج");
			})
			.finally(() => setLoading(false));
	}, [productId, navigate]);

	// ----- Loading State -----
	if (loading) {
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
	}

	// ----- Check if product exists -----
	if (!product?._id) {
		return (
			<Container maxWidth='md' sx={{py: 8, textAlign: "center"}}>
				<ErrorIcon sx={{fontSize: 64, color: "error.main", mb: 3}} />
				<Typography variant='h5' color='error' gutterBottom>
					{t("product.notFound") || "المنتج غير موجود"}
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
	}

	// ----- Error State -----
	if (error) {
		return (
			<Container maxWidth='md' sx={{py: 8, textAlign: "center"}}>
				<ErrorIcon sx={{fontSize: 64, color: "error.main", mb: 3}} />
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
	}

	// ----- SEO Data -----
	const productJsonLd = generateSingleProductJsonLd(product);
	const currentUrl = `https://client-qqq1.vercel.app/product/${product.category}/${product.brand}/${product._id}`;

	return (
		<>
			{/* SEO Metadata */}
			<JsonLd data={productJsonLd} />
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
			<meta property='og:image' content={product.image?.url} />
			<meta property='og:type' content='product' />
			<meta property='product:price:amount' content={product.price.toString()} />
			<meta property='product:price:currency' content='ILS' />

			{/* Main Content */}
			<Box component='main'>
				<Container maxWidth='xl' sx={{py: 4, my: 5}}>
					{/* Breadcrumbs */}
					<Box sx={{mb: 4, px: {xs: 1, sm: 0}, py: 1}}>
						<Breadcrumbs
							aria-label={
								t("product.breadcrumbNavigation") || "مسار التنقل"
							}
							separator={<ChevronRight sx={{fontSize: 20, mx: 0.5}} />}
						>
							<Tooltip title={t("home") || "الصفحة الرئيسية"} arrow>
								<Button
									component={Link}
									to={path.Home}
									startIcon={<HomeIcon />}
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 0.5,
										textTransform: "none",
										fontSize: {xs: "0.8rem", sm: "0.875rem"},
										px: 1,
										py: 0.5,
									}}
								>
									<Typography
										variant='body2'
										sx={{display: {xs: "none", sm: "block"}}}
									>
										{t("home")}
									</Typography>
								</Button>
							</Tooltip>

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
											if (catPath) navigate(catPath);
										}}
										startIcon={<StoreIcon />}
										disabled={!categoryPathMap[product.category]}
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 0.5,
											textTransform: "none",
											fontSize: {xs: "0.8rem", sm: "0.875rem"},
											px: 1,
											py: 0.5,
										}}
									>
										<Typography variant='body2'>
											{categoryLabels[product.category] ||
												t(product.category)}
										</Typography>
									</Button>
								</Tooltip>
							)}

							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									px: 2,
									py: 0.5,
								}}
							>
								<Typography
									variant='body2'
									sx={{fontWeight: 600}}
									title={product.product_name}
								>
									{product.product_name}
								</Typography>
							</Box>
						</Breadcrumbs>
					</Box>

					{/* Main Product Grid */}
					<Grid container spacing={4}>
						<Grid size={{xs: 12}}>
							<Card
								sx={{
									borderRadius: 2,
									overflow: "hidden",
									boxShadow: theme.shadows[3],
									position: "relative",
								}}
							>
								{/* Image Container with Zoom */}
								<Box
									ref={imageContainerRef}
									onMouseMove={handleMouseMove}
									onClick={() => setIsZoomed(!isZoomed)}
									sx={{
										position: "relative",
										height: isMobile ? 300 : 500,
										overflow: "hidden",
										cursor: isZoomed ? "zoom-out" : "zoom-in",
										"&:hover .image-controls": {
											opacity: 1,
										},
									}}
								>
									{product.image?.url ? (
										<>
											<CardMedia
												component='img'
												image={`${product.image.url}?w=1200&q=85`}
												alt={`صورة ${product.product_name}`}
												sx={{
													width: "100%",
													height: "100%",
													objectFit: "contain",
													transition:
														"transform all ease-in-out",
													transform: isZoomed
														? `scale(${zoomLevel}) translate(${mousePosition.x - 50}%, ${mousePosition.y - 50}%)`
														: "scale(1)",
													transformOrigin: isZoomed
														? `${mousePosition.x}% ${mousePosition.y}%`
														: "center center",
												}}
											/>

											{/* Image Controls Overlay */}
											<Box
												className='image-controls'
												sx={{
													position: "absolute",
													bottom: 16,
													left: "50%",
													transform: "translateX(-50%)",
													display: "flex",
													gap: 1,
													backgroundColor: "rgba(0,0,0,0.6)",
													borderRadius: 2,
													padding: "8px 12px",
													opacity: 0,
													transition: "opacity 0.3s ease",
													zIndex: 10,
												}}
											>
												<Tooltip title='تكبير'>
													<IconButton
														size='small'
														onClick={(e) => {
															e.stopPropagation();
															handleZoomIn();
														}}
														sx={{color: "white"}}
													>
														<ZoomIn />
													</IconButton>
												</Tooltip>

												<Tooltip title='تصغير'>
													<IconButton
														size='small'
														onClick={(e) => {
															e.stopPropagation();
															handleZoomOut();
														}}
														disabled={zoomLevel <= 1}
														sx={{color: "white"}}
													>
														<ZoomOut />
													</IconButton>
												</Tooltip>

												<Tooltip title='عرض كامل الشاشة'>
													<IconButton
														size='small'
														onClick={(e) => {
															e.stopPropagation();
															handleFullscreenToggle();
														}}
														sx={{color: "white"}}
													>
														{isFullscreen ? (
															<FullscreenExit />
														) : (
															<Fullscreen />
														)}
													</IconButton>
												</Tooltip>

												{isZoomed && (
													<Tooltip title='إعادة الضبط'>
														<IconButton
															size='small'
															onClick={(e) => {
																e.stopPropagation();
																handleResetZoom();
															}}
															sx={{color: "white"}}
														>
															<ZoomOut
																sx={{
																	transform:
																		"rotate(45deg)",
																}}
															/>
														</IconButton>
													</Tooltip>
												)}
											</Box>

											{/* Zoom Level Indicator */}
											{isZoomed && (
												<Box
													sx={{
														position: "absolute",
														top: 16,
														right: 16,
														backgroundColor:
															"rgba(0,0,0,0.6)",
														color: "white",
														padding: "4px 8px",
														borderRadius: 1,
														fontSize: "0.875rem",
														zIndex: 10,
													}}
												>
													{zoomLevel.toFixed(1)}x
												</Box>
											)}
										</>
									) : (
										<Box
											sx={{
												height: "100%",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												flexDirection: "column",
												gap: 2,
											}}
										>
											<Typography>لا توجد صورة للمنتج</Typography>
											<Typography
												variant='body2'
												color='text.secondary'
											>
												انقر لإضافة صورة
											</Typography>
										</Box>
									)}
								</Box>

								{/* Instructions Tooltip */}
								<Box
									sx={{
										position: "absolute",
										bottom: 8,
										left: 8,
										backgroundColor: "rgba(0,0,0,0.5)",
										color: "white",
										padding: "4px 8px",
										borderRadius: 1,
										fontSize: "0.75rem",
										display: {xs: "none", md: "block"},
										zIndex: 5,
									}}
								>
									استخدم الماوس للتكبير/التصغير
								</Box>

								{/* باقي الأكواد (أزرار المشاركة واللايك) */}
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										p: 2,
										borderTop: 1,
										borderColor: "divider",
									}}
								>
									<IconButton
										onClick={() => {
											if (!isLoggedIn) navigate(path.Login);
										}}
									>
										<LikeButton
											product={product}
											setProduct={setProduct}
										/>
									</IconButton>

									<IconButton
										onClick={handleShare}
										disabled={isSharing}
									>
										<ShareIcon />
									</IconButton>
								</Box>

								{/* Owner Actions */}
								{isOwner && (
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											gap: 2,
											p: 2,
											borderTop: 1,
											borderColor: "divider",
										}}
									>
										<Button
											variant='contained'
											color='warning'
											startIcon={<EditIcon />}
											onClick={handleEditProduct}
											size='small'
										>
											تعديل
										</Button>
										<Button
											variant='contained'
											color='error'
											startIcon={<DeleteIcon />}
											onClick={() => setShowDeleteModal(true)}
											size='small'
										>
											حذف
										</Button>
									</Box>
								)}
							</Card>
						</Grid>

						<Grid size={{xs: 12, md: 6}}>
							<Box
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								{/* Product Name */}
								<Typography
									variant='h4'
									component='h1'
									gutterBottom
									sx={{fontWeight: 700}}
								>
									{product.product_name}
								</Typography>

								{/* Category */}
								{product.category && (
									<Chip
										label={categoryLabels[product.category]}
										color='secondary'
										sx={{mb: 2, alignSelf: "flex-start"}}
									/>
								)}

								{/* Rating */}
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
										({product.reviewCount || 0} تقييم)
									</Typography>
								</Box>

								{/* Price */}
								<Typography
									variant='h3'
									color='primary'
									gutterBottom
									sx={{fontWeight: 700, mb: 3}}
								>
									{formatPrice(product.price)}
								</Typography>

								{/* Colors and Sizes */}
								<ColorsAndSizes category={product.category} />

								<Divider sx={{my: 3}} />

								{/* Description */}
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

								{/* Action Buttons */}
								<Box sx={{mt: "auto", pt: 3}}>
									<Grid container spacing={2}>
										<Grid size={{xs: 12}}>
											<Button
												fullWidth
												variant='contained'
												size='large'
												onClick={() => navigate(-1)}
												sx={{py: 1.5, fontSize: "1.1rem"}}
											>
												{t("backOneStep")}
											</Button>
										</Grid>
										<Grid size={{xs: 12, md: 6}}>
											<Button
												fullWidth
												variant='outlined'
												size='large'
												startIcon={<Comment />}
												onClick={() => navigate(path.Messages)}
												sx={{py: 1.5}}
											>
												تواصل مع البائع
											</Button>
										</Grid>
										<Grid size={{xs: 12, md: 6}}>
											<Button
												fullWidth
												variant='contained'
												size='large'
												startIcon={<Phone />}
												href='tel:0538346915'
												sx={{py: 1.5}}
											>
												اتصل الآن
											</Button>
										</Grid>
									</Grid>
								</Box>
							</Box>
						</Grid>
					</Grid>

					{/* Product Details Table */}
					<Box sx={{mt: 8}}>
						<Typography
							variant='h5'
							gutterBottom
							sx={{fontWeight: 700, mb: 4}}
						>
							تفاصيل المنتج
						</Typography>
						<MemoizedPostDetailsTable product={product} />
					</Box>

					{/* Comments Section */}
					<Box sx={{mt: 8}}>
						<Typography
							variant='h5'
							gutterBottom
							sx={{fontWeight: 700, mb: 4}}
						>
							التعليقات والتقييمات
						</Typography>
						<Grid container spacing={4}>
							<Grid size={{xs: 12, md: 8}}>
								<Card
									sx={{
										p: 3,
										borderRadius: 2,
										boxShadow: theme.shadows[2],
									}}
								>
									{/* Comments List */}
									<Stack spacing={2} sx={{mb: 3}}>
										{[1, 2, 3].map((item) => (
											<Box
												key={item}
												sx={{
													p: 2,
													bgcolor: "grey.50",
													borderRadius: 1,
												}}
											>
												<Box
													sx={{
														display: "flex",
														justifyContent: "space-between",
														mb: 1,
													}}
												>
													<Typography
														variant='subtitle2'
														fontWeight='bold'
													>
														مستخدم {item}
													</Typography>
													<Rating
														value={4}
														size='small'
														readOnly
													/>
												</Box>
												<Typography variant='body2'>
													هذا تعليق تجريبي للمنتج رقم {item}
												</Typography>
											</Box>
										))}
									</Stack>

									{/* Add Comment */}
									<Divider sx={{my: 3}} />
									<Typography variant='h6' gutterBottom>
										أضف تعليقك
									</Typography>
									<TextField
										multiline
										rows={4}
										fullWidth
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										placeholder='اكتب تعليقك هنا...'
										variant='outlined'
										sx={{mb: 2}}
									/>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<Rating
											value={rating}
											onChange={(_, newValue) =>
												setRating(newValue ?? 0)
											}
											precision={0.5}
										/>
										<Button
											variant='contained'
											disabled={!comment.trim()}
										>
											نشر التعليق
										</Button>
									</Box>
								</Card>
							</Grid>

							{/* Support Info */}
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
										الدعم والمساعدة
									</Typography>
									<Typography
										variant='body2'
										color='text.secondary'
										paragraph
									>
										فريق الدعم متاح على مدار الساعة للمساعدة في أي
										استفسارات.
									</Typography>
									<Alert severity='info' sx={{mt: 2}}>
										للاستفسار عن المنتج أو الشكاوى، يرجى التواصل عبر:
										<br />
										• الهاتف: 0538346915
										<br />• البريد الإلكتروني: support@safqa.com
									</Alert>
								</Card>
							</Grid>
						</Grid>
					</Box>
				</Container>
			</Box>

			{/* Modals */}
			<AlertDialogs
				handleDelete={handleDeleteProduct}
				onHide={() => setShowDeleteModal(false)}
				show={showDeleteModal}
				title={`حذف ${product.product_name}`}
				description={`هل أنت متأكد من حذف المنتج "${product.product_name}"؟`}
			/>

			<UpdateProductModal
				show={showUpdateModal}
				onHide={handleCloseUpdateModal}
				productId={product._id as string}
				refresh={handleRefreshProduct}
			/>
		</>
	);
};

export default PostDetails;
