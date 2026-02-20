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
	Skeleton,
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
import {Dispatch, FunctionComponent, memo, SetStateAction, useState, useRef} from "react";
import {generatePath, Link, useNavigate} from "react-router-dom";
import {Products} from "../../../interfaces/Posts";
import {formatPrice} from "../../../helpers/dateAndPriceFormat";
import {generateSingleProductJsonLd} from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";
import {useTranslation} from "react-i18next";
import handleRTL from "../../../locales/handleRTL";
import {showError, showSuccess} from "../../../atoms/toasts/ReactToast";
import LikeButton from "../../../atoms/LikeButton";
import {path, productsPathes} from "../../../routes/routes";
import { formatTimeAgo } from "./helpers/helperFunctions";

interface PostCardProps {
	product: Products;
	discountedPrice: number;
	canEdit?: boolean;
	setProductIdToUpdate: Dispatch<SetStateAction<string>>;
	onShowUpdateProductModal: () => void;
	openDeleteModal: (name: string) => void;
	setLoadedImages: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	loadedImages: Record<string, boolean>;
	category: string;
	onLikeToggle?: (productId: string, liked: boolean) => void;
	updateProductInList?: (updatedProduct: Products) => void;
}

const PostCard: FunctionComponent<PostCardProps> = memo(
	({
		product,
		discountedPrice,
		canEdit,
		setProductIdToUpdate,
		onShowUpdateProductModal,
		openDeleteModal,
		setLoadedImages,
		loadedImages,
		onLikeToggle,
		updateProductInList,
	}) => {
		const {t} = useTranslation();
		const theme = useTheme();
		const dir = handleRTL();
		const navigate = useNavigate();

		const [isBookmarked, setIsBookmarked] = useState(false);
		const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

		const [expanded, setExpanded] = useState<boolean>(false);

		const jsonLdData = generateSingleProductJsonLd(product);
		const menuRef = useRef(null);

		const generateImageAlt = (product: Products) => {
			return `${product.product_name} - بيع وشراء في ${product.category}`;
		};


		const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
			setMenuAnchor(event.currentTarget);
		};

		const handleMenuClose = () => {
			setMenuAnchor(null);
		};

		const handleShare = () => {
			const shareUrl = `${window.location.origin}/product-details/${product.category}/${product.brand}/${product._id}`;
			const shareText = `${product.product_name} - ${product.price} شيكل`;

			if (navigator.share) {
				navigator
					.share({
						title: product.product_name,
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

		const handleProductUpdate = (updatedProduct: Products) => {
			if (updateProductInList) {
				updateProductInList(updatedProduct);
			}
		};



		const setProduct = updateProductInList
			? (updater: (prev: Products) => Products) => {
					const updated = updater(product);
					handleProductUpdate(updated);
				}
			: undefined;

		const imageKey = product._id;
		// TODO: Translate
		return (
			<Card
				className='product-card'
				dir={dir}
				sx={{
					borderRadius: 2,
					display: "flex",
					flexDirection: "column",
					backgroundColor: "#FFFFFF",
					boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
					mb: 2,
					overflow: "hidden",
					border: "1px solid #dddfe2",
					cursor: product.in_stock === false ? "not-allowed" : "pointer",
					filter: product.in_stock === false ? "grayscale(0.5)" : "none",
					"&:hover": {
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
					},
				}}
				itemScope
				itemType='https://schema.org/Product'
				role='article'
				aria-label={`منتج: ${product.product_name}`}
			>
				<JsonLd data={jsonLdData} />

				{/* Header - رأس المنشور */}
				<Box
					sx={{
						p: 2,
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
							slug: encodeURIComponent(product.seller?.slug ?? ""),
						})}
						style={{textDecoration: "none"}}
					>
						<Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
							<Avatar
								src={product.seller?.imageUrl}
								alt={product.seller?.name || "بائع"}
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
									aria-label={`زيارة ملف ${product.seller?.name || "البائع"}`}
									sx={{
										borderColor: theme.palette.primary.main,
										fontSize: "0.9375rem",
										"&:hover": {
											textDecoration: "underline",
										},
									}}
								>
									{product.seller?.name ||
										product.seller?.slug ||
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
										{formatTimeAgo(product.createdAt)}
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
										<Box sx={{display: "flex", alignItems: "center"}}>
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
														fontSize: "0.5rem",
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
							<ShareIcon sx={{mr: 1, fontSize: 20}} />
							مشاركة
						</MenuItem>
						<MenuItem onClick={handleReport}>
							<Typography
								color='error'
								sx={{display: "flex", alignItems: "center"}}
							>
								<Report />
								الإبلاغ عن منتج
							</Typography>
						</MenuItem>
						{canEdit && (
							<Box>
								<MenuItem
									onClick={() => {
										setProductIdToUpdate(product._id as string);
										onShowUpdateProductModal();
										handleMenuClose();
									}}
								>
									<EditIcon sx={{mr: 1, fontSize: 20}} />
									تعديل
								</MenuItem>
								<MenuItem
									onClick={() => {
										openDeleteModal(product._id as string);
										handleMenuClose();
									}}
								>
									<DeleteIcon
										sx={{mr: 1, fontSize: 20, color: "error.main"}}
									/>
									<Typography color='error'>حذف</Typography>
								</MenuItem>
							</Box>
						)}
					</Menu>
				</Box>

				{/* محتوى المنشور */}
				<CardContent sx={{p: 0}}>
					{/* الوصف */}
					{product.description && (
						<Box sx={{px: 2, pb: 1}}>
							<Typography
								variant='body2'
								sx={{
									fontSize: "0.9375rem",
									lineHeight: 1.5,
									color: "#050505",
									whiteSpace: "pre-line",
									display: "-webkit-box",
									WebkitLineClamp: expanded ? "none" : 1,
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
								}}
							>
								{product.description}
							</Typography>
							{product.description.length > 120 && (
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
								if (product.in_stock === false) {
									e.preventDefault();
									showError("هذا المنتج غير متوفر حالياً");
								}
							}}
							to={`${productsPathes.productDetails}/${product.category}/${product.brand}/${product._id}`}
							aria-label={`تفاصيل عن ${product.product_name}`}
							style={{display: "block"}}
						>
							{imageKey && !loadedImages[imageKey] && (
								<Skeleton
									variant='rectangular'
									width='100%'
									height={350}
									animation='wave'
								/>
							)}
							<CardMedia
								component='img'
								loading='lazy'
								image={product.image.url}
								alt={generateImageAlt(product)}
								sx={{
									width: "100%",
									height: "auto",
									maxHeight: 400,
									objectFit: "contain",
								}}
								onLoad={() => {
									if (!imageKey) return;
									setLoadedImages((prev) => ({
										...prev,
										[imageKey]: true,
									}));
								}}
								onError={() => {
									if (!imageKey) return;
									setLoadedImages((prev) => ({
										...prev,
										[imageKey]: true,
									}));
								}}
							/>
						</Link>

						{/* البادجات */}
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
							{product.sale && (
								<Chip
									icon={<Sell sx={{fontSize: 16}} />}
									label={`${product.discount}%`}
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
							{product.in_stock === false && (
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
					<Box sx={{p: 2, pt: 1.5}}>
						{/* اسم المنتج والسعر */}
						<Box sx={{mb: 1.5}}>
							<Link
								to={`${productsPathes.productDetails}/${product.category}/${product.brand}/${product._id}`}
								style={{textDecoration: "none", color: "inherit"}}
							>
								<Typography
									variant='h6'
									fontWeight={600}
									gutterBottom
									sx={{
										fontSize: "1.0625rem",
										color: "#050505",
										"&:hover": {
											textDecoration: "underline",
										},
									}}
									itemProp='name'
								>
									{product.product_name}
								</Typography>
							</Link>
							<Stack direction='row' spacing={1.5} alignItems='baseline'>
								<Typography
									variant='h5'
									fontWeight={700}
									sx={{
										color: "#1a73e8",
										fontSize: "1.375rem",
									}}
									itemProp='offers'
									itemScope
									itemType='https://schema.org/Offer'
								>
									{product.sale
										? formatPrice(discountedPrice)
										: formatPrice(product.price)}
									<meta
										itemProp='price'
										content={
											product.sale
												? discountedPrice.toString()
												: product.price.toString()
										}
									/>
									<meta itemProp='priceCurrency' content='ILS' />
									<meta
										itemProp='availability'
										content={
											product.in_stock
												? "https://schema.org/InStock"
												: "https://schema.org/OutOfStock"
										}
									/>
								</Typography>
								{product.sale && (
									<Typography
										variant='body2'
										sx={{
											color: "#65676b",
											textDecoration: "line-through",
											fontSize: "0.875rem",
										}}
									>
										{formatPrice(product.price)}
									</Typography>
								)}
							</Stack>
						</Box>

						{/* المعلومات الإضافية */}
						<Stack
							direction='row'
							spacing={1.5}
							sx={{mb: 1.5}}
							flexWrap='wrap'
							gap={1}
							rowGap={1}
						>
							<Link
								to={`/category/${product.category.toLocaleLowerCase()}`}
								style={{textDecoration: "none"}}
							>
								<Chip
									label={`${t(`categories.${product.category.toLocaleLowerCase()}.label`)}`}
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
								to={`/category/${product.category.toLocaleLowerCase()}/${product.subcategory}`}
								style={{textDecoration: "none"}}
							>
								<Chip
									label={`${t(`categories.${product.category.toLocaleLowerCase()}.subCategories.${product.subcategory}`)}`}
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
								icon={<LocationOn sx={{fontSize: 14}} />}
								label={product.location || "أم الفحم"}
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
									product.location || "أم الفحم",
								)}&navigate=yes`}
								target='_blank'
								rel='noopener noreferrer'
								style={{textDecoration: "none"}}
							>
								<Chip
									icon={
										<img
											src='/waze.png'
											width={30}
											style={{fontSize: 10}}
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
												product.seller?.slug ?? "",
											),
										}),
									)
								}
								sx={{display: "flex"}}
							>
								تواصل
							</Button>
							{product.condition && (
								<Chip
									label={
										product.condition === "new"
											? "🆕 جديد"
											: "🔄 مستعمل"
									}
									size='small'
									sx={{
										bgcolor:
											product.condition === "new"
												? "#e8f5e9"
												: "#fff3e0",
										color:
											product.condition === "new"
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
							{product.brand && (
								<>
									<span style={{fontWeight: 500}}>
										العلامة التجارية:
									</span>
									{product.brand}
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
								{product.likes?.length || 0} إعجاب
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
				<CardActions sx={{p: 0}}>
					<Box sx={{width: "100%", display: "flex"}}>
						<Box
							sx={{
								flex: 1,
								display: "flex",
								justifyContent: "center",
							}}
						>
							<LikeButton
								product={product}
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
						<Box sx={{flex: 1, display: "flex", justifyContent: "center"}}>
							<Button
								fullWidth
								startIcon={
									isBookmarked ? (
										<Bookmark sx={{color: "#1a73e8"}} />
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
