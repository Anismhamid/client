import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Chip,
	IconButton,
	Skeleton,
	Stack,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import {Share as ShareIcon} from "@mui/icons-material";
import {Dispatch, FunctionComponent, memo, SetStateAction} from "react";
import {Link} from "react-router-dom";
import {Products} from "../../../interfaces/Products";
import {formatPrice} from "../../../helpers/dateAndPriceFormat";
import {generateSingleProductJsonLd} from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";
import {useTranslation} from "react-i18next";
import handleRTL from "../../../locales/handleRTL";
import {showError, showSuccess} from "../../../atoms/toasts/ReactToast";

import LikeButton from "../../../atoms/LikeButton";

interface ProductCardProps {
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

const ProductCard: FunctionComponent<ProductCardProps> = memo(
	({
		product,
		discountedPrice,
		canEdit,
		setProductIdToUpdate,
		onShowUpdateProductModal,
		openDeleteModal,
		setLoadedImages,
		loadedImages,
		category,
		onLikeToggle,
		updateProductInList,
	}) => {
		// descriptive alt text for the image
		const generateImageAlt = (product: Products) => {
			return `${product.product_name} - بيع وشراء في ${product.category}`;
		};

		const jsonLdData = generateSingleProductJsonLd(product);
		const {t} = useTranslation();
		// const navigate = useNavigate();
		const dir = handleRTL();
		const theme = useTheme();

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

		

		return (
			<Card
				className='card'
				dir={dir}
				sx={{
					minHeight: "max-content",
					borderRadius: 3,
					display: "flex",
					flexDirection: "column",
					backgroundColor: "#FFFFFF",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
					transition: "all 0.3s ease",
					position: "relative",
					overflow: "hidden",
					cursor: product.in_stock === false ? "not-allowed" : "pointer",
					filter: product.in_stock === false ? "grayscale(0.5)" : "none",
					"&:hover": {
						boxShadow:
							product.in_stock === false
								? "0px 4px 12px rgba(0, 0, 0, 0.1)"
								: "0px 8px 24px rgba(0, 0, 0, 0.15)",
						transform:
							product.in_stock === false ? "none" : "translateY(-4px)",
					},
				}}
				itemScope
				itemType='https://schema.org/Product'
				role='article'
				aria-label={`منتج: ${product.product_name}`}
			>
				<JsonLd data={jsonLdData} />
				{product.in_stock === false && (
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0, 0, 0, 0.05)",
							zIndex: 3,
							pointerEvents: "none",
						}}
					/>
				)}
				{product.in_stock === false && (
					<Chip
						label='غير متوفر'
						color='default'
						size='small'
						sx={{
							position: "absolute",
							top: 10,
							right: 10,
							bgcolor: "#9e9e9e",
							color: "#fff",
							fontWeight: "bold",
							zIndex: 4,
							py: 0.5,
							px: 1.5,
							fontSize: "0.75rem",
							borderRadius: 2,
						}}
					/>
				)}

				{/* Sale Badge */}
				{product.sale && (
					<Chip
						label={`${product.discount}% تخفيض`}
						color='error'
						size='small'
						aria-label={`خصم ${product.discount} بالمئة`}
						sx={{
							position: "absolute",
							top: 10,
							left: 10,
							bgcolor: "#ff4444",
							color: "#fff",
							fontWeight: "bold",
							zIndex: 2,
							py: 0.5,
							px: 1.5,
							fontSize: "0.75rem",
							borderRadius: 2,
						}}
					/>
				)}

				{/* Image Section */}
				<Box
					position='relative'
					width='100%'
					sx={{
						height: {
							xs: "180px",
							sm: "220px",
							md: "200px",
						},
						overflow: "hidden",
					}}
				>
					<Link
						onClick={(e) => {
							if (product.in_stock === false) {
								e.preventDefault();
								showError("هذا المنتج غير متوفر حالياً");
							}
						}}
						to={`/product-details/${product.category}/${product.brand}/${product._id}`}
						aria-label={`تفاصيل عن ${product.product_name}`}
						style={{display: "block", height: "100%"}}
					>
						{!loadedImages[product.product_name] && (
							<Skeleton
								variant='rounded'
								width='100%'
								height='100%'
								animation='wave'
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									zIndex: 1,
								}}
								aria-hidden='true'
							/>
						)}
						<CardMedia
							component='img'
							loading='lazy'
							image={product.image.url}
							alt={generateImageAlt(product)}
							title={product.description}
							sx={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								transition: "transform 0.3s ease",
								"&:hover": {
									transform: "scale(1.05)",
								},
							}}
							onLoad={() => {
								setLoadedImages((prev) => ({
									...prev,
									[product.product_name]: true,
								}));
							}}
							onError={() => {
								setLoadedImages((prev) => ({
									...prev,
									[product.product_name]: true,
								}));
							}}
							itemProp='image'
						/>
					</Link>
				</Box>

				<CardContent sx={{flexGrow: 1, p: 2}}>
					{/* Product Name */}
					<Link
						to={`/product-details/${product.category}/${product.brand}/${product._id}`}
						style={{textDecoration: "none", color: "inherit"}}
					>
						<Typography
							variant='h6'
							fontWeight='600'
							gutterBottom
							itemProp='name'
							sx={{
								fontSize: "1.1rem",
								lineHeight: 1.3,
								color: "#333",
								"&:hover": {
									color: "#1976d2",
								},
							}}
						>
							{product.product_name}
						</Typography>
					</Link>

					{/* Condition Chip - New */}
					<Chip
						label={t("links.new")}
						size='small'
						sx={{
							bgcolor: "#e8f5e9",
							color: "#2e7d32",
							fontWeight: 500,
							fontSize: "0.7rem",
							mb: 1.5,
							height: "24px",
						}}
					/>

					{/* Price Section */}
					<Box sx={{mb: 1.5}}>
						{product.sale ? (
							<Stack direction='row' spacing={1} alignItems='center'>
								<Typography
									variant='h5'
									fontWeight={700}
									color='#333'
									itemProp='offers'
									content={discountedPrice.toString()}
									sx={{fontSize: "1.4rem"}}
								>
									{formatPrice(discountedPrice)}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
									sx={{
										textDecoration: "line-through",
										fontSize: "0.9rem",
									}}
									itemProp='price'
									content={product.price.toString()}
								>
									{formatPrice(product.price)}
								</Typography>
								<meta itemProp='priceCurrency' content='ILS' />
								<meta
									itemProp='price'
									content={discountedPrice.toString()}
								/>
							</Stack>
						) : (
							<Typography
								variant='h5'
								fontWeight={700}
								color='#333'
								aria-live='polite'
								itemProp='price'
								content={formatPrice(product.price)}
								sx={{fontSize: "1.4rem"}}
							>
								{formatPrice(product.price)}
								<meta itemProp='priceCurrency' content='ILS' />
							</Typography>
						)}
					</Box>

					<Typography
						variant='body2'
						color='text.secondary'
						sx={{
							fontSize: "0.85rem",
							fontWeight: 500,
						}}
					>
						{t(category)}
					</Typography>

					{/* Location and Category */}
					<Stack
						direction='row'
						justifyContent='space-between'
						alignItems='center'
						display={"block"}
					>
						<Typography
							variant='body2'
							color='text.secondary'
							sx={{
								alignItems: "center",
								gap: 1,
								fontSize: "0.85rem",
								m: 1,
							}}
						>
							📍 {product.location || "Umm al fahm"}
						</Typography>
					</Stack>

					{/* Description (if available) */}
					{product.description && (
						<Typography
							variant='body2'
							color='text.secondary'
							sx={{
								mt: 1.5,
								fontSize: "0.85rem",
								lineHeight: 1.5,
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}
						>
							{product.description}
						</Typography>
					)}

					{/* Edit and Delete Buttons (for authorized users) */}
					{canEdit && (
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
									setProductIdToUpdate(product._id as string);
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
								onClick={() => openDeleteModal(product.product_name)}
								sx={{
									bgcolor: "error.light",
									"&:hover": {bgcolor: "error.main"},
								}}
							>
								<DeleteIcon fontSize='small' />
							</IconButton>
						</Box>
					)}
				</CardContent>

				{/* Action Buttons */}
				<Box
					sx={{
						p: 2,
						pt: 0,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						borderTop: `1px solid ${theme.palette.divider}`,
						mt: "auto",
					}}
				>
					{/* Like Button */}
					<Box sx={{display: "flex", alignItems: "center", gap: 1}}>
						<LikeButton
							product={product}
							setProduct={setProduct}
							onLikeToggle={onLikeToggle}
						/>
						{/* Simple like count display */}
						{product.likes && product.likes.length > 0 && (
							<Tooltip
								title={`${product.likes.length} شخص أعجب بهذا المنتج`}
								arrow
							>
								<Typography
									variant='caption'
									sx={{
										color: "text.secondary",
										ml: 1,
										cursor: "default",
									}}
								>
									{product.likes.length} إعجاب
								</Typography>
							</Tooltip>
						)}
					</Box>

					{/* Share Button */}
					<IconButton
						aria-label='share'
						onClick={() => {
							if (navigator.share) {
								navigator
									.share({
										title: `منتج ${product.product_name} رائع`,
										text: `شوف ${product.product_name} المميز!`,
										url: window.location.href,
									})
									.then(() => showSuccess("تمت المشاركة بنجاح"))
									.catch(() => showError("فشل المشاركة"));
							} else showError("المشاركة غير مدعومة في هذا المتصفح");
						}}
						sx={{
							color: "#666",
							"&:hover": {
								backgroundColor: "rgba(25, 118, 210, 0.08)",
								color: "#1976d2",
							},
						}}
					>
						<ShareIcon />
					</IconButton>
				</Box>

				{/* Seller info at bottom */}
				{product.seller && (
					<Box
						sx={{
							p: 2,
							pt: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Typography
							variant='body2'
							color='text.secondary'
							sx={{fontSize: "0.8rem"}}
						>
							{t("seller")}:
						</Typography>
						<Link
							to={`/users/customer/${product.seller.slug}`}
							aria-label={`الانتقال إلى صفحة البائع ${product.seller.slug}`}
							style={{
								textDecoration: "none",
								color: "#1976d2",
								fontWeight: 500,
								fontSize: "0.9rem",
							}}
						>
							@{product.seller.slug}
						</Link>
					</Box>
				)}
			</Card>
		);
	},
);

export default ProductCard;
