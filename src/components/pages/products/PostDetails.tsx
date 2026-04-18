import {
	FunctionComponent,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
	Alert,
	Avatar,
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardMedia,
	Chip,
	Container,
	Divider,
	Grid,
	IconButton,
	Rating,
	Skeleton,
	Stack,
	TextField,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	ArrowBack as ArrowBackIcon,
	ChevronRight,
	Comment,
	Error as ErrorIcon,
	Fullscreen,
	FullscreenExit,
	Home as HomeIcon,
	Phone,
	Share as ShareIcon,
	Store as StoreIcon,
	ZoomIn,
	ZoomOut,
} from "@mui/icons-material";
import { initialProductValue, Posts } from "../../../interfaces/Posts";
import { path } from "../../../routes/routes";
import { formatPrice } from "../../../helpers/dateAndPriceFormat";
import ColorsAndSizes from "../../../atoms/productsManage/ColorsAndSizes";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../context/useUSer";
import { showError, showSuccess } from "../../../atoms/toasts/ReactToast";
import { generateSingleProductJsonLd } from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";
import {
	categoryLabels,
	categoryPathMap,
} from "../../../interfaces/postsCategoeis";
import LikeButton from "../../../atoms/like/LikeButton";
import UpdateProductModal from "../../../atoms/productsManage/addAndUpdateProduct/UpdatePostModal";
import AlertDialogs from "../../../atoms/toasts/Sweetalert";
import PostDetailsTable from "./PostDetailsTable";
import { formatTimeAgo, generatePath } from "./helpers/helperFunctions";
import RelatedProductCard from "./RelatedProductCard";
import { deletePost, getPostById, getRelatedPosts } from "../../../services/postsServices";

const MemoizedPostDetailsTable = memo(PostDetailsTable);

const sectionCardSx = {
	borderRadius: 4,
	border: 1,
	borderColor: "divider",
	boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
};

const SectionTitle = memo(({ title, subtitle }: { title: string; subtitle?: string }) => (
	<Box sx={{ mb: 3 }}>
		<Typography variant='h5' sx={{ fontWeight: 800, mb: 1 }}>
			{title}
		</Typography>
		{subtitle && (
			<Typography variant='body2' color='text.secondary'>
				{subtitle}
			</Typography>
		)}
	</Box>
));



const PostDetails: FunctionComponent = () => {
	const { t } = useTranslation();
	const [post, setPost] = useState<Posts>(initialProductValue as Posts);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const { postId } = useParams<{ postId: string }>();
	const navigate = useNavigate();
	const { isLoggedIn, auth } = useUser();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const [zoomLevel, setZoomLevel] = useState<number>(1);
	const [isZoomed, setIsZoomed] = useState<boolean>(false);
	const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
	const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
	const imageContainerRef = useRef<HTMLDivElement>(null);
	const [relatedProducts, setRelatedProducts] = useState<Posts[]>([]); // New state for related products

	const [rating, setRating] = useState<number>(0);
	const [comment, setComment] = useState("");
	const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [isSharing, setIsSharing] = useState<boolean>(false);

	const sellerDisplayName =
		post.userData?.name.first || post.userData?.name.last || t("product.seller") || "بائع";
	const categoryLabel = post.category
		? categoryLabels[post.category] || t(post.category)
		: t("product.category") || "التصنيف";

	const isOwner = useMemo(() => {
		return auth?._id && post.userData?._id && auth._id === String(post.userData?._id);
	}, [auth?._id, post.userData?._id]);

	const handleZoomIn = useCallback(() => {
		setZoomLevel((prev) => Math.min(prev + 0.5, 3));
		setIsZoomed(true);
	}, []);

	const handleZoomOut = useCallback(() => {
		setZoomLevel((prev) => {
			const nextZoom = Math.max(prev - 0.5, 1);
			if (nextZoom === 1) setIsZoomed(false);
			return nextZoom;
		});
	}, []);

	const handleResetZoom = useCallback(() => {
		setZoomLevel(1);
		setIsZoomed(false);
		setMousePosition({ x: 50, y: 50 });
	}, []);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!isZoomed || !imageContainerRef.current) return;

			const container = imageContainerRef.current;
			const { left, top, width, height } = container.getBoundingClientRect();
			const x = ((e.clientX - left) / width) * 100;
			const y = ((e.clientY - top) / height) * 100;

			setMousePosition({ x, y });
		},
		[isZoomed],
	);

	const handleFullscreenToggle = useCallback(async () => {
		try {
			if (!document.fullscreenElement) {
				await imageContainerRef.current?.requestFullscreen();
				setIsFullscreen(true);
				return;
			}

			await document.exitFullscreen();
			setIsFullscreen(false);
		} catch {
			showError("تعذر تفعيل وضع ملء الشاشة");
		}
	}, []);

	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
	}, []);

	const handleShare = useCallback(async () => {
		setIsSharing(true);

		try {
			const shareData = {
				title: `منتج ${post.product_name} رائع`,
				text: `شاهد ${post.product_name} الآن على منصة صفقة`,
				url: window.location.href,
			};

			if (navigator.share) {
				await navigator.share(shareData);
				showSuccess("تمت مشاركة المنتج بنجاح");
				return;
			}

			await navigator.clipboard.writeText(window.location.href);
			showSuccess("تم نسخ رابط المنتج");
		} catch (shareError) {
			if ((shareError as Error).name !== "AbortError") {
				showError("تعذر تنفيذ المشاركة حالياً");
			}
		} finally {
			setIsSharing(false);
		}
	}, [post.product_name]);

	const handleDeletePost = useCallback(async () => {
		if (!postId) return;

		try {
			await deletePost(postId);
			showSuccess("تم حذف المنتج بنجاح");
			navigate(-1);
		} catch (deleteError) {
			showError(deleteError as string);
		}
	}, [navigate, postId]);

	const handleEditProduct = useCallback(() => {
		setShowUpdateModal(true);
	}, []);

	const handleCloseUpdateModal = useCallback(() => {
		setShowUpdateModal(false);
	}, []);

	const handleRefreshPost = useCallback(() => {
		if (!postId) return;

		setLoading(true);
		getPostById(postId)
			.then((res) => {
				setPost(res);
				setRating(res.rating || 0);
			})
			.catch(() => setError("حدث خطأ أثناء تحميل المنتج"))
			.finally(() => setLoading(false));
	}, [postId]);

	useEffect(() => {
		// if (!postId) {
		// 	navigate(path.Home);
		// 	return;
		// }

		setLoading(true);
		setError("");

		getPostById(postId as string)
			.then((res) => {
				setPost(res);
				setRating(res.rating || 0);
			})
			.catch((fetchError) => {
				console.error("Error fetching post:", fetchError);
				setError("حدث خطأ أثناء تحميل المنشور");
			})
			.finally(() => setLoading(false));
	}, [navigate, postId]);

	useEffect(() => {
		if (post.category && post._id) {
			getRelatedPosts(post.category, post._id, 4)
				.then((res) => {
					console.log("RELATED:", res); // 👈 مهم
					setRelatedProducts(res);
				})
				.catch((err) => console.error("Error fetching related products:", err));
		}
	}, [post._id, post.category]);


	if (loading) {
		return (
			<Container maxWidth='xl' sx={{ py: 5 }}>
				<Stack spacing={3}>
					<Skeleton variant='rounded' height={90} />
					<Grid container spacing={3}>
						<Grid size={{ xs: 12, lg: 7 }}>
							<Skeleton variant='rounded' height={520} />
						</Grid>
						<Grid size={{ xs: 12, lg: 5 }}>
							<Stack spacing={2}>
								<Skeleton variant='rounded' height={220} />
								<Skeleton variant='rounded' height={260} />
							</Stack>
						</Grid>
					</Grid>
				</Stack>
			</Container>
		);
	}


	if (!post?._id) {
		return (
			<Container maxWidth='md' sx={{ py: 8, textAlign: "center" }}>
				<ErrorIcon sx={{ fontSize: 64, color: "error.main", mb: 3 }} />
				<Typography variant='h5' color='error' gutterBottom>
					{t("product.notFound") || "المنتج غير موجود"}
				</Typography>
				<Button variant='contained' startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 3 }}>
					{t("backOneStep")}
				</Button>
			</Container>
		);
	}



	if (error) {
		return (
			<Container maxWidth='md' sx={{ py: 8, textAlign: "center" }}>
				<ErrorIcon sx={{ fontSize: 64, color: "error.main", mb: 3 }} />
				<Typography variant='h5' color='error' gutterBottom>
					{error}
				</Typography>
				<Button variant='contained' startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 3 }}>
					{t("backOneStep")}
				</Button>
			</Container>
		);
	}


	const productJsonLd = generateSingleProductJsonLd(post);
	const currentUrl = `https://client-qqq1.vercel.app/product/${post.category}/${post._id}`;

	return (
		<>
			<JsonLd data={productJsonLd} />
			<title>{post.product_name} | صفقة</title>
			<link rel='canonical' href={currentUrl} />
			<meta
				name='description'
				content={`اشتري ${post.product_name} بأفضل سعر على صفقة. ${post.description?.substring(0, 120)}`}
			/>
			<meta property='og:title' content={post.product_name} />
			<meta property='og:description' content={post.description?.substring(0, 160)} />
			<meta property='og:image' content={post.image?.url} />
			<meta property='og:type' content='product' />
			<meta property='product:price:amount' content={post.price.toString()} />
			<meta property='product:price:currency' content='ILS' />

			<Box component='main' sx={{ backgroundColor: "background.default", pb: 8 }}>
				<Container maxWidth='xl' sx={{ pt: { xs: 3, md: 5 } }}>
					<Stack spacing={4}>
						<Card sx={{ ...sectionCardSx, p: { xs: 2, md: 3 } }}>
							<Link
								to={generatePath(path.CustomerProfile, {
									slug: encodeURIComponent(post.seller?.slug ?? ""),
								})}
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<Stack
									direction={{ xs: "column", sm: "row" }}
									spacing={2}
									alignItems={{ xs: "flex-start", sm: "center" }}
									justifyContent='space-between'
								>
									<Stack direction='row' spacing={2} alignItems='center'>
										<Avatar
											src={post.seller?.imageUrl || "/user.png"}
											alt={sellerDisplayName}
											sx={{ width: 64, height: 64, border: 2, borderColor: "divider" }}
										/>
										<Box>
											<Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
												<Typography variant='h6' sx={{ fontWeight: 700 }}>
													{sellerDisplayName}
												</Typography>
												{isOwner && <Chip label='صاحب المنشور' size='small' color='primary' variant='outlined' />}
											</Stack>
											<Stack
												direction={{ xs: "column", sm: "row" }}
												spacing={1}
												divider={<Divider orientation='vertical' flexItem sx={{ display: { xs: "none", sm: "block" } }} />}
												sx={{ mt: 0.75 }}
											>
												<Typography variant='body2' color='text.secondary'>
													@{post.seller?.slug || "seller"}
												</Typography>
												<Typography variant='body2' color='text.secondary'>
													منشور منذ {formatTimeAgo(String(post.createdAt || ""))}
												</Typography>
											</Stack>
										</Box>
									</Stack>

									<Button
										variant='contained'
										startIcon={<Comment />}
										sx={{ gap: 2 }}
										onClick={(event) => {
											event.preventDefault();
											navigate(
												generatePath(path.CustomerProfile, {
													slug: encodeURIComponent(post.seller?.slug ?? ""),
												}),
											);
										}}
									>
										تواصل
									</Button>
								</Stack>
							</Link>
						</Card>

						<Box>
							<Breadcrumbs
								aria-label={t("product.breadcrumbNavigation") || "مسار التنقل"}
								separator={<ChevronRight sx={{ fontSize: 20 }} />}
							>
								<Button component={Link} to={path.Home} startIcon={<HomeIcon />} sx={{ textTransform: "none" }}>
									{t("home")}
								</Button>

								{post.category && (
									<Button
										startIcon={<StoreIcon />}
										onClick={() => {
											const catPath = categoryPathMap[post.category] || "";
											if (catPath) navigate(catPath);
										}}
										disabled={!categoryPathMap[post.category]}
										sx={{ textTransform: "none" }}
									>
										{categoryLabel}
									</Button>
								)}

								<Typography variant='body2' sx={{ fontWeight: 700 }}>
									{post.product_name}
								</Typography>
							</Breadcrumbs>
						</Box>

						<Grid container spacing={4} alignItems='flex-start'>
							<Grid size={{ xs: 12, lg: 7 }}>
								<Stack spacing={3}>
									<Card sx={{ ...sectionCardSx, overflow: "hidden" }}>
										<Box
											ref={imageContainerRef}
											onMouseMove={handleMouseMove}
											onClick={() => setIsZoomed((prev) => !prev)}
											sx={{
												position: "relative",
												height: { xs: 320, md: 560 },
												overflow: "hidden",
												background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
												cursor: isZoomed ? "zoom-out" : "zoom-in",
												"&:hover .image-controls": {
													opacity: 1,
												},
											}}
										>
											{post.image?.url ? (
												<>
													<CardMedia
														component='img'
														image={`${post.image.url}?w=1400&q=90`}
														alt={`صورة ${post.product_name}`}
														sx={{
															width: "100%",
															height: "100%",
															objectFit: "contain",
															transition: "transform 0.35s ease-in-out",
															transform: isZoomed
																? `scale(${zoomLevel}) translate(${mousePosition.x - 50}%, ${mousePosition.y - 50}%)`
																: "scale(1)",
															transformOrigin: isZoomed
																? `${mousePosition.x}% ${mousePosition.y}%`
																: "center center",
														}}
													/>

													<Stack
														className='image-controls'
														direction='row'
														spacing={1}
														sx={{
															position: "absolute",
															left: "50%",
															bottom: 16,
															transform: "translateX(-50%)",
															backgroundColor: "rgba(15, 23, 42, 0.66)",
															borderRadius: 999,
															p: 0.75,
															opacity: isMobile ? 1 : 0,
															transition: "opacity 0.25s ease",
														}}
													>
														<Tooltip title='تكبير'>
															<IconButton size='small' onClick={(event) => {
																event.stopPropagation();
																handleZoomIn();
															}} sx={{ color: "common.white" }}>
																<ZoomIn />
															</IconButton>
														</Tooltip>
														<Tooltip title='تصغير'>
															<span>
																<IconButton size='small' disabled={zoomLevel <= 1} onClick={(event) => {
																	event.stopPropagation();
																	handleZoomOut();
																}} sx={{ color: "common.white" }}>
																	<ZoomOut />
																</IconButton>
															</span>
														</Tooltip>
														<Tooltip title={isFullscreen ? 'إغلاق ملء الشاشة' : 'ملء الشاشة'}>
															<IconButton size='small' onClick={(event) => {
																event.stopPropagation();
																void handleFullscreenToggle();
															}} sx={{ color: "common.white" }}>
																{isFullscreen ? <FullscreenExit /> : <Fullscreen />}
															</IconButton>
														</Tooltip>
														{isZoomed && (
															<Tooltip title='إعادة الضبط'>
																<IconButton size='small' onClick={(event) => {
																	event.stopPropagation();
																	handleResetZoom();
																}} sx={{ color: "common.white" }}>
																	<ZoomOut sx={{ transform: "rotate(45deg)" }} />
																</IconButton>
															</Tooltip>
														)}
													</Stack>

													{isZoomed && (
														<Box
															sx={{
																position: "absolute",
																top: 16,
																right: 16,
																backgroundColor: "rgba(15, 23, 42, 0.66)",
																color: "common.white",
																px: 1.25,
																py: 0.5,
																borderRadius: 99,
															}}
														>
															{zoomLevel.toFixed(1)}x
														</Box>
													)}
												</>
											) : (
												<Stack justifyContent='center' alignItems='center' spacing={1.5} sx={{ height: "100%" }}>
													<Typography variant='h6'>لا توجد صورة للمنتج</Typography>
													<Typography variant='body2' color='text.secondary'>
														يمكن إضافة صورة لاحقاً لتحسين عرض المنتج.
													</Typography>
												</Stack>
											)}

											<Box
												sx={{
													position: "absolute",
													left: 16,
													top: 16,
													backgroundColor: "rgba(255,255,255,0.9)",
													borderRadius: 999,
													px: 1.25,
													py: 0.5,
												}}
											>
												<Typography variant='caption' sx={{ fontWeight: 700 }}>
													{isZoomed ? "اضغط لإلغاء التكبير" : "اضغط للتكبير"}
												</Typography>
											</Box>
										</Box>

										<Box sx={{ p: 2.5, borderTop: 1, borderColor: "divider" }}>
											<Stack direction='row' justifyContent='space-between' alignItems='center'>
												<Stack onClick={() => {
													if (!isLoggedIn) {
														navigate(path.Login);
													}
												}} direction='row' spacing={1}>
													<LikeButton product={post} setProduct={setPost} />
													<IconButton onClick={handleShare} disabled={isSharing}>
														<ShareIcon />
													</IconButton>
												</Stack>

												<Typography variant='body2' color='text.secondary'>
													اعرض الصورة بوضوح أعلى قبل اتخاذ قرار الشراء.
												</Typography>
											</Stack>
										</Box>

										{isOwner && (
											<Box sx={{ p: 2.5, borderTop: 1, borderColor: "divider" }}>
												<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
													<Button variant='contained' color='warning' startIcon={<EditIcon />} onClick={handleEditProduct} fullWidth>
														{t("edit")}
													</Button>
													<Button variant='contained' color='error' startIcon={<DeleteIcon />} onClick={() => setShowDeleteModal(true)} fullWidth>
														{t("delete")}
													</Button>
												</Stack>
											</Box>
										)}
									</Card>

									<Card sx={{ ...sectionCardSx, p: { xs: 2.25, md: 3 } }}>
										<SectionTitle
											title='تفاصيل المنتج'
											subtitle='معلومات منظمة تساعد المستخدم على فهم المنتج ومواصفاته بسرعة.'
										/>
										<MemoizedPostDetailsTable Posts={post} />
									</Card>

									<Card sx={{ ...sectionCardSx, p: { xs: 2.25, md: 3 } }}>
										<SectionTitle
											title='الأسئلة والتقييمات'
											subtitle='شجّع الزوار على مشاركة انطباعاتهم وطرح الأسئلة قبل الشراء.'
										/>

										<Alert severity='info' sx={{ mb: 3, borderRadius: 2 }}>
											لا توجد تعليقات منشورة حتى الآن. يمكنك أن تكون أول من يضيف رأياً واضحاً ومفيداً.
										</Alert>

										<Stack spacing={2.5}>
											<TextField
												multiline
												rows={4}
												fullWidth
												value={comment}
												onChange={(event) => setComment(event.target.value)}
												placeholder='اكتب تعليقك أو سؤالك عن المنتج هنا...'
												variant='outlined'
											/>

											<Stack
												direction={{ xs: "column", sm: "row" }}
												justifyContent='space-between'
												alignItems={{ xs: "flex-start", sm: "center" }}
												spacing={2}
											>
												<Stack spacing={0.75}>
													<Typography variant='body2' color='text.secondary'>
														قيّم تجربتك أو توقّعاتك من هذا المنتج.
													</Typography>
													<Rating value={rating} onChange={(_, newValue) => setRating(newValue ?? 0)} precision={0.5} />
												</Stack>

												<Button variant='contained' disabled={!comment.trim()}>
													نشر التعليق
												</Button>
											</Stack>
										</Stack>
									</Card>
								</Stack>
							</Grid>

							<Grid size={{ xs: 12, lg: 5 }}>
								<Stack spacing={3} sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}>
									<Card sx={{ ...sectionCardSx, p: { xs: 2.25, md: 3 } }}>
										<Stack spacing={2.5}>
											<Box>
												<Stack direction='row' spacing={1} flexWrap='wrap' sx={{ mb: 1.5 }}>
													<Chip label={categoryLabel} color='secondary' />
													{post.condition && <Chip label={String(post.condition)} variant='outlined' />}
												</Stack>
												<Typography variant='h3' component='h1' sx={{ fontWeight: 900, lineHeight: 1.2, mb: 1.5 }}>
													{post.product_name}
												</Typography>
												<Stack direction='row' spacing={1.25} alignItems='center' flexWrap='wrap'>
													<Rating value={rating} precision={0.5} onChange={(_, newValue) => setRating(newValue ?? 0)} />
													<Typography variant='body2' color='text.secondary'>
														{typeof post.reviewCount === "number" ? post.reviewCount : 0} تقييم
													</Typography>
												</Stack>
											</Box>

											<Box
												sx={{
													p: 2.5,
													borderRadius: 3,
													background: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(59,130,246,0.04) 100%)",
													border: 1,
													borderColor: "primary.light",
												}}
											>
												<Typography variant='body2' color='text.secondary' sx={{ mb: 0.75 }}>
													السعر الحالي
												</Typography>
												<Typography variant='h3' color='primary' sx={{ fontWeight: 900 }}>
													{formatPrice(post.price)}
												</Typography>
											</Box>

											<Box>
												<Typography variant='h6' sx={{ fontWeight: 700, mb: 1.5 }}>
													الخيارات المتاحة
												</Typography>
												<ColorsAndSizes category={post.category} />
											</Box>

											<Divider />

											<Box>
												<Typography variant='h6' sx={{ fontWeight: 700, mb: 1.5 }}>
													وصف المنتج
												</Typography>
												<Typography variant='body1' color='text.secondary' sx={{ lineHeight: 1.9 }}>
													{post.description || "لم تتم إضافة وصف تفصيلي لهذا المنتج بعد."}
												</Typography>
											</Box>

											<Stack spacing={1.5}>
												<Button fullWidth variant='contained' size='large' startIcon={<Comment />} onClick={(event) => {
													event.preventDefault();
													navigate(
														generatePath(path.CustomerProfile, {
															slug: encodeURIComponent(post.seller?.slug ?? ""),
														}),
													);
												}} sx={{ py: 1.5 }}>
													تواصل مع البائع
												</Button>
												<Button fullWidth variant='outlined' size='large' startIcon={<Phone />} href='tel:0538346915' sx={{ py: 1.5 }}>
													اتصل الآن
												</Button>
												<Button fullWidth variant='text' size='large' startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ py: 1.25 }}>
													{t("backOneStep")}
												</Button>
											</Stack>
										</Stack>
									</Card>

									<Card sx={{ ...sectionCardSx, p: { xs: 2.25, md: 3 } }}>
										<SectionTitle
											title='عن البائع والدعم'
											subtitle='منطقة مخصصة لبناء الثقة وتوضيح قنوات التواصل والمساندة.'
										/>

										<Stack spacing={2.5}>
											<Stack direction='row' spacing={2} alignItems='center'>
												<Link
													to={generatePath(path.CustomerProfile, {
														slug: encodeURIComponent(post.seller?.slug ?? ""),
													})}
													style={{ textDecoration: "none", color: "inherit" }}
												>
													<Avatar src={post.seller?.imageUrl || "/user.png"} alt={sellerDisplayName} sx={{ width: 56, height: 56 }} />
												</Link>
												<Box>
													<Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
														{sellerDisplayName}
													</Typography>
													<Typography variant='body2' color='text.secondary'>
														يمكنك زيارة ملف البائع للاطلاع على مزيد من المنتجات والتقييمات.
													</Typography>
												</Box>
											</Stack>

											<Alert severity='info' sx={{ borderRadius: 2 }}>
												للاستفسار عن المنتج أو تقديم شكوى، يرجى التواصل عبر الهاتف 0538346915 أو البريد الإلكتروني support@safqa.com.
											</Alert>

											<Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.8 }}>
												يعرض هذا التصميم المعلومات الأساسية أولاً، ثم ينقل المستخدم إلى التفاصيل والدعم في أقسام منفصلة وواضحة، مما يحسن تجربة التصفح ويُسهّل اتخاذ القرار.
											</Typography>
										</Stack>
									</Card>
								</Stack>
							</Grid>
						</Grid>
						{relatedProducts.length > 0 && (
							<Box sx={{ mt: 6 }}>
								<SectionTitle
									title='منتجات ذات صلة'
									subtitle='اكتشف منتجات أخرى قد تعجبك بناءً على اهتماماتك.'
								/>
								<Grid container spacing={3}>
									{relatedProducts.length === 0 ? (
										<Typography color="text.secondary">
											لا توجد منتجات مشابهة حالياً
										</Typography>
									) : (
										<Grid container spacing={3}>
											{relatedProducts.map((product) => (
												<Grid key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
													<RelatedProductCard product={product} />
												</Grid>
											))}
										</Grid>
									)}
								</Grid>
							</Box>
						)}
					</Stack>
				</Container>
			</Box>

			<AlertDialogs
				handleDelete={handleDeletePost}
				onHide={() => setShowDeleteModal(false)}

				show={showDeleteModal}
				title={`حذف ${post.product_name}`}
				description={`هل أنت متأكد من حذف المنتج "${post.product_name}"؟`}
			/>

			<UpdateProductModal
				show={showUpdateModal}
				onHide={handleCloseUpdateModal}
				postId={post._id as string}
				refresh={handleRefreshPost}
			/>
		</>
	);
};

export default PostDetails;
