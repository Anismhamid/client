import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
	IconButton,
	Menu,
	MenuItem,
	// Skeleton,
	Stack,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import {
	Bookmark,
	BookmarkBorder,
	Comment,
	MoreHoriz,
	Share as ShareIcon,
	LocationOn,
	Sell,
	VisibilityRounded,
	Report,
} from "@mui/icons-material";
import { Dispatch, FunctionComponent, memo, SetStateAction, useState, useRef } from "react";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { Posts } from "../../../interfaces/Posts";
import { formatPrice } from "../../../helpers/dateAndPriceFormat";
import { generateSingleProductJsonLd } from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";
import { useTranslation } from "react-i18next";
import handleRTL from "../../../locales/handleRTL";
import { showError, showSuccess } from "../../../atoms/toasts/ReactToast";
import LikeButton from "../../../atoms/like/LikeButton";
import { path, productsPathes } from "../../../routes/routes";
import { formatTimeAgo } from "./helpers/helperFunctions";

interface PostCardProps {
	post: Posts;
	discountedPrice: number;
	canEdit?: boolean;
	setPostIdToUpdate: Dispatch<SetStateAction<string>>;
	onShowUpdateProductModal: () => void;
	openDeleteModal: (name: string) => void;
	setLoadedImages: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	loadedImages: Record<string, boolean>;
	category: string;
	onLikeToggle?: (postId: string, liked: boolean) => void;
	updateProductInList?: (updatedPost: Posts) => void;
}

const PostCard: FunctionComponent<PostCardProps> = memo(
	({
		post,
		discountedPrice,
		canEdit,
		setPostIdToUpdate,
		onShowUpdateProductModal,
		openDeleteModal,
		// setLoadedImages,
		// loadedImages,
		onLikeToggle,
		updateProductInList,
	}) => {
		const { t } = useTranslation();
		const theme = useTheme();
		const dir = handleRTL();
		const navigate = useNavigate();

		const [isBookmarked, setIsBookmarked] = useState(false);
		const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

		const [expanded, setExpanded] = useState<boolean>(false);

		const jsonLdData = generateSingleProductJsonLd(post);
		const menuRef = useRef(null);

		// const generateImageAlt = (product: Products) => {
		// 	return `${post.product_name} - بيع وشراء في ${post.category}`;
		// };

		const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
			setMenuAnchor(event.currentTarget);
		};

		const handleMenuClose = () => {
			setMenuAnchor(null);
		};

		const handleShare = () => {
			const shareUrl = `${window.location.origin}/product-details/${post.category}/${post.brand}/${post._id}`;
			const shareText = `${post.product_name} - ${post.price} شيكل`;

			if (navigator.share) {
				navigator
					.share({
						title: post.product_name,
						text: shareText,
						url: shareUrl,
					})
					.then(() => showSuccess("تمت المشاركة بنجاح"))
					.catch(() => showError("فشل المشاركة"));
			} else {
				navigator.clipboard
					.writeText(shareUrl)
					.then(() => showSuccess("تم نسخ الرابط"))
					.catch(() => showError("فشل نسخ الرابط"));
			}
			handleMenuClose();
		};

		const handleReport = () => {
			showSuccess("تم الإبلاغ عن المنتج");
			handleMenuClose();
		};

		const handleProductUpdate = (updatedProduct: Posts) => {
			if (updateProductInList) {
				updateProductInList(updatedProduct);
			}
		};

		const setProduct = updateProductInList
			? (updater: (prev: Posts) => Posts) => {
				const updated = updater(post);
				handleProductUpdate(updated);
			}
			: undefined;

		// const imageKey = post._id;
		// TODO: Translate
		return (
			<Card
				dir={dir}
				sx={{
					// color: "main",
					borderRadius: 2,
					display: "flex",
					flexDirection: "column",
					// backgroundColor: "#FFFFFF",
					boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
					mb: 2,
					overflow: "hidden",
					// border: "1px solid #dddfe2",
					cursor: post.in_stock === false ? "not-allowed" : "pointer",
					filter: post.in_stock === false ? "grayscale(0.5)" : "none",
					"&:hover": {
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
					},
				}}
				itemScope
				itemType='https://schema.org/Product'
				role='article'
				aria-label={`منتج: ${post.product_name}`}
			>
				<JsonLd data={jsonLdData} />

				{/* Header - رأس المنشور */}
				<Box
					sx={{
						p: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						// TODO:Add user mask
						// 						background: `
						// 	radial-gradient(circle at 20% 30%, #E0EDEF 15%, transparent 20%),
						// 	radial-gradient(circle at 80% 70%, #A1DAC2 15%, transparent 20%),
						// 	radial-gradient(circle at 40% 80%, #EADDF0 10%, transparent 15%),
						// 	radial-gradient(circle at 60% 20%, #A2C7DE 10%, transparent 15%),
						// 	linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)
						// `,
					}}
				>
					<Link
						to={generatePath(path.CustomerProfile, {
							slug: encodeURIComponent(post.seller?.slug ?? ""),
						})}
						style={{ textDecoration: "none" }}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
							<Avatar
								src={post.seller?.imageUrl}
								alt={post.seller?.name || "بائع"}
								sx={{
									width: 48,
									height: 48,
									border: "2px solid #e4e6eb",
									"& img": {
										objectFit: "cover",
										transform: "scale(2)", // تكبير الصورة داخل الإطار
									},
									"&:hover": {
										borderColor: theme.palette.primary.main,
									},
								}}
							/>

							<Box>
								<Typography
									variant='subtitle2'
									fontWeight={600}
									aria-label={`زيارة ملف ${post.seller?.name || "البائع"}`}
									sx={{
										borderColor: theme.palette.primary.main,
										fontSize: "0.9375rem",
										"&:hover": {
											textDecoration: "underline",
										},
									}}
								>
									{post.seller?.name ||
										post.seller?.slug ||
										"بائع"}
								</Typography>

								<Stack direction='row' spacing={0.5} alignItems='center'>
									<Typography
										variant='caption'
										sx={{
											color: "#65676b",
											fontSize: "0.8125rem",
										}}
									>
										{formatTimeAgo(String(post.createdAt) || "")}
									</Typography>
									<Typography
										variant='caption'
										sx={{
											color: "#65676b",
											fontSize: "0.8125rem",
										}}
									>
										•
									</Typography>
									<Tooltip title='عام للجميع'>
										<Box sx={{ display: "flex", alignItems: "center" }}>
											<Box
												sx={{
													width: 12,
													height: 12,
													bgcolor: "#e4e6eb",
													borderRadius: "50%",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Typography
													variant='caption'
													sx={{
														color: "#65676b",
														fontSize: "1rem",
													}}
												>
													🌍
												</Typography>
											</Box>
										</Box>
									</Tooltip>
								</Stack>
							</Box>
						</Box>
					</Link>
					<IconButton
						size='small'
						onClick={handleMenuOpen}
						ref={menuRef}
						sx={{
							color: "#65676b",
							"&:hover": {
								backgroundColor: "rgba(0, 0, 0, 0.05)",
							},
						}}
					>
						<MoreHoriz />
					</IconButton>
					<Menu
						anchorEl={menuAnchor}
						open={Boolean(menuAnchor)}
						onClose={handleMenuClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "right",
						}}
						transformOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
					>
						<MenuItem onClick={handleShare}>
							<ShareIcon sx={{ mr: 1, fontSize: 20 }} />
							مشاركة
						</MenuItem>
						<MenuItem onClick={handleReport}>
							<Typography
								color='error'
								sx={{ display: "flex", alignItems: "center" }}
							>
								<Report />
								الإبلاغ عن منتج
							</Typography>
						</MenuItem>
						{canEdit && (
							<Box>
								<MenuItem
									onClick={() => {
										setPostIdToUpdate(post._id as string);
										onShowUpdateProductModal();
										handleMenuClose();
									}}
								>
									<EditIcon sx={{ mr: 1, fontSize: 20 }} />
									تعديل
								</MenuItem>
								<MenuItem
									onClick={() => {
										openDeleteModal(post._id as string);
										handleMenuClose();
									}}
								>
									<DeleteIcon
										sx={{ mr: 1, fontSize: 20, color: "error" }}
									/>
									<Typography color='error'>حذف</Typography>
								</MenuItem>
							</Box>
						)}
					</Menu>
				</Box>

				{/* محتوى المنشور */}
				<CardContent sx={{ p: 0 }}>
					<Box sx={{ p: 2, pt: 1.5 }}>
						{/* اسم المنتج والسعر */}
						<Box sx={{ mb: 1.5 }}>
							<Link
								to={`${productsPathes.productDetails}/${post.category}/${post.brand}/${post._id}`}
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<Typography
									variant='h6'
									fontWeight={600}
									gutterBottom
									sx={{
										fontSize: "1.0625rem",
										color: "info",
										"&:hover": {
											textDecoration: "underline",
										},
									}}
									itemProp='name'
								>
									{post.product_name}
								</Typography>
							</Link>

							{/* الصورة */}
							<Box
								sx={{
									position: "relative",
									width: "100%",
									overflow: "hidden",
									bgcolor: "#f0f2f5",
								}}
							>
								<Link
									onClick={(e) => {
										if (post.in_stock === false) {
											e.preventDefault();
											showError("هذا المنتج غير متوفر حالياً");
										}
									}}
									to={`${productsPathes.productDetails}/${post.category}/${post.brand}/${post._id}`}
									aria-label={`تفاصيل عن ${post.product_name}`}
									style={{ display: "block" }}
								>
									<Box sx={{ position: "relative" }}>
										<CardMedia
											component='img'
											image={post.image.url}
											alt={post.product_name}
											sx={{
												height: 220,
												objectFit: "cover",
											}}
										/>

										{/* Discount badge */}
										{post.sale && (
											<Chip
												label={`-${post.discount}%`}
												sx={{
													position: "absolute",
													top: 10,
													left: 10,
													bgcolor: "error.main",
													color: "#fff",
													fontWeight: "bold",
												}}
											/>
										)}

										{/* Bookmark */}
										<IconButton
											onClick={() => setIsBookmarked(!isBookmarked)}
											sx={{
												position: "absolute",
												top: 10,
												right: 10,
												bgcolor: "rgba(255, 255, 255, 0.466)",
												"&:hover": { bgcolor: "#fff", color: "black" },
											}}
										>
											{isBookmarked ? <Bookmark /> : <BookmarkBorder />}
										</IconButton>
									</Box>
								</Link>

								<Box
									sx={{
										position: "absolute",
										top: 12,
										left: 12,
										display: "flex",
										flexDirection: "column",
										gap: 1,
										zIndex: 2,
									}}
								>
									{post.sale && (
										<Chip
											icon={<Sell sx={{ fontSize: 16 }} />}
											label={`${post.discount}%`}
											size='small'
											sx={{
												bgcolor: "#ff4444",
												color: "#fff",
												fontWeight: 600,
												height: 24,
												"& .MuiChip-icon": {
													color: "#fff",
													marginLeft: 0.5,
												},
											}}
										/>
									)}
									{!post.in_stock && (
										<Chip
											label='غير متوفر'
											size='small'
											sx={{
												bgcolor: "rgba(0, 0, 0, 0.7)",
												color: "#fff",
												fontWeight: 500,
												height: 24,
											}}
										/>
									)}
								</Box>
							</Box>

							{/* تفاصيل المنتج */}

							{post.description && (
								<Box sx={{ px: 2, pb: 1 }}>
									<Typography
										component={"h2"}
										variant='body2'
										sx={{
											fontSize: "1rem",
											lineHeight: 1.5,
											whiteSpace: "pre-line",
											display: "-webkit-box",
											WebkitLineClamp: expanded ? "none" : 1,
											WebkitBoxOrient: "vertical",
											overflow: "hidden",
										}}
									>
										{post.description}
									</Typography>
									{post.description.length > 120 && (
										<Button
											size='small'
											onClick={() => setExpanded(!expanded)}
											sx={{
												mt: 0.5,
												px: 0,
												textTransform: "none",
												fontWeight: 600,
												color: theme.palette.primary.main,
											}}
										>
											{expanded ? "إخفاء" : "قراءة المزيد"}
										</Button>
									)}
								</Box>
							)}
							<Stack direction='row' spacing={1.5} alignItems='baseline'>
								<Typography
									variant='h5'
									fontWeight={700}
									sx={{
										color: "primary.main",
										fontSize: "1.375rem",
									}}
									itemProp='offers'
									itemScope
									itemType='https://schema.org/Offer'
								>
									{post.sale
										? formatPrice(discountedPrice)
										: formatPrice(post.price)}
									<meta
										itemProp='price'
										content={
											post.sale
												? discountedPrice.toString()
												: post.price.toString()
										}
									/>
									<meta itemProp='priceCurrency' content='ILS' />
									<meta
										itemProp='availability'
										content={
											post.in_stock
												? "https://schema.org/InStock"
												: "https://schema.org/OutOfStock"
										}
									/>
								</Typography>
								{post.sale && (
									<Typography
										variant='body2'
										sx={{
											color: "#65676b",
											textDecoration: "line-through",
											fontSize: "0.875rem",
										}}
									>
										{formatPrice(post.price)}
									</Typography>
								)}
							</Stack>
						</Box>

						{/* المعلومات الإضافية */}
						<Stack
							direction='row'
							spacing={1.5}
							sx={{ mb: 1.5 }}
							flexWrap='wrap'
							gap={1}
							rowGap={1}
						>
							<Link
								to={`/category/${post.category.toLocaleLowerCase()}`}
								style={{ textDecoration: "none" }}
							>
								<Chip
									label={`${t(`categories.${post.category.toLocaleLowerCase()}.label`)}`}
									size='small'
									variant='filled'
									sx={{
										color: "#e8f0fe",
										bgcolor: "#1a73e8",
										fontWeight: 500,
										height: 24,
										"&:hover": {
											transform: "scale(1.1)",
										},
									}}
								/>
							</Link>
							-
							<Link
								to={`/category/${post.category.toLocaleLowerCase()}/${post.subcategory}`}
								style={{ textDecoration: "none" }}
							>
								<Chip
									label={`${t(`categories.${post.category.toLocaleLowerCase()}.subCategories.${post.subcategory}`)}`}
									size='small'
									sx={{
										color: "#e8f0fe",
										bgcolor: "#1a73e8",
										fontWeight: 500,
										height: 24,
										"&:hover": {
											transform: "scale(1.1)",
										},
									}}
								/>
							</Link>
							<Chip
								icon={<LocationOn sx={{ fontSize: 14 }} />}
								label={post.location || "أم الفحم"}
								size='small'
								sx={{
									bgcolor: "#f3f4f6",
									color: "#5f6368",
									height: 24,

									"& .MuiChip-icon": {
										marginLeft: 0.5,
									},
								}}
							/>
							<Link
								to={`https://waze.com/ul?q=${encodeURIComponent(
									post.location || "أم الفحم",
								)}&navigate=yes`}
								target='_blank'
								rel='noopener noreferrer'
								style={{ textDecoration: "none" }}
							>
								<Chip
									icon={
										<img
											src='/waze.png'
											width={30}
											style={{ fontSize: 10 }}
										/>
									}
									label={"Waze"}
									size='small'
									sx={{
										// bgcolor: "#f3f4f6",
										// color: "#5f6368",
										backgroundColor: "#33CCFF",
										height: 24,
										cursor: "pointer",
										gap: 1,
										display: "inline",
										fontSize: 14,
										"& .MuiChip-icon": {
											marginLeft: 0.5,
										},
									}}
								/>
							</Link>
							<Button
								variant='contained'
								size='small'
								startIcon={<Comment />}
								onClick={() =>
									navigate(
										generatePath(path.CustomerProfile, {
											slug: encodeURIComponent(
												post.seller?.slug ?? "",
											),
										}),
									)
								}
								sx={{ display: "flex" }}
							>
								تواصل
							</Button>
							{post.condition && (
								<Chip
									label={
										post.condition === "new"
											? "🆕 جديد"
											: "🔄 مستعمل"
									}
									size='small'
									sx={{
										bgcolor:
											post.condition === "new"
												? "#e8f5e9"
												: "#fff3e0",
										color:
											post.condition === "new"
												? "#2e7d32"
												: "#f57c00",
										height: 24,
									}}
								/>
							)}
						</Stack>

						{/* معلومات إضافية */}
						<Typography
							variant='body2'
							sx={{
								color: "#65676b",
								fontSize: "0.8125rem",
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							{post.brand && (
								<>
									<span style={{ fontWeight: 500 }}>
										العلامة التجارية:
									</span>
									{post.brand}
								</>
							)}
						</Typography>
					</Box>
				</CardContent>

				{/* إحصائيات التفاعل */}
				<Box
					sx={{
						px: 2,
						py: 1,
						borderTop: "1px solid #e4e6eb",
						borderBottom: "1px solid #e4e6eb",
					}}
				>
					<Stack
						direction='row'
						justifyContent='space-between'
						alignItems='center'
					>
						<Stack direction='row' alignItems='center' spacing={0.5}>
							{/* <Box
								sx={{
									bgcolor: "#1a73e8",
									borderRadius: "50%",
									width: 20,
									height: 20,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<LikeIcon />
							</Box> */}
							<Typography
								variant='caption'
								sx={{
									color: "#65676b",
									fontSize: "0.8125rem",
								}}
							>
								{post.likes?.length || 0} إعجاب
							</Typography>
						</Stack>
						<Typography
							variant='caption'
							sx={{
								color: "#65676b",
								fontSize: "0.8125rem",
							}}
						>
							129 <VisibilityRounded />
							{/* يمكن إضافة عدد التعليقات أو المشاهدات هنا */}
						</Typography>
					</Stack>
				</Box>

				{/* أزرار التفاعل - تم استخدام LikeButton هنا */}
				<CardActions sx={{ p: 0 }}>
					<Box sx={{ width: "100%", display: "flex" }}>
						<Box
							sx={{
								flex: 1,
								display: "flex",
								justifyContent: "center",
							}}
						>
							<LikeButton
								product={post}
								setProduct={setProduct}
								onLikeToggle={onLikeToggle}
							/>
						</Box>
						<Box
							sx={{
								flex: 1,
								display: "flex",
								justifyContent: "center",
							}}
						>
							<Button
								fullWidth
								startIcon={<Comment />}
								onClick={() => {
									// يمكن إضافة منطق التعليقات هنا
								}}
								sx={{
									color: "#65676b",
									py: 1.25,
									borderRadius: 0,
									textTransform: "none",
									fontSize: "0.9375rem",
									fontWeight: 600,
									gap: 1,
									"&:hover": {
										bgcolor: "rgba(0, 0, 0, 0.04)",
									},
								}}
							>
								تعليق
							</Button>
						</Box>
						<Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
							<Button
								fullWidth
								startIcon={
									isBookmarked ? (
										<Bookmark sx={{ color: "#1a73e8" }} />
									) : (
										<BookmarkBorder />
									)
								}
								onClick={() => setIsBookmarked(!isBookmarked)}
								sx={{
									color: isBookmarked ? "#1a73e8" : "#65676b",
									py: 1.25,
									borderRadius: 0,
									textTransform: "none",
									fontSize: "0.9375rem",
									fontWeight: 600,
									gap: 1,
									"&:hover": {
										bgcolor: "rgba(0, 0, 0, 0.04)",
									},
								}}
							>
								حفظ
							</Button>
						</Box>
					</Box>
				</CardActions>
			</Card>
		);
	},
);

export default PostCard;
