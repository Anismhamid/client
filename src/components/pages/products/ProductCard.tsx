import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Chip,
	IconButton,
	Skeleton,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import {
	Share as ShareIcon,
	Favorite as FavoriteIcon,
	FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import {Dispatch, FunctionComponent, memo, SetStateAction} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Products} from "../../../interfaces/Products";
import {formatPrice} from "../../../helpers/dateAndPriceFormat";
import ColorsAndSizes from "../../../atoms/productsManage/ColorsAndSizes";
import {generateSingleProductJsonLd} from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";
import {useTranslation} from "react-i18next";
import handleRTL from "../../../locales/handleRTL";
import {showError, showSuccess} from "../../../atoms/toasts/ReactToast";
import {toggleLike} from "../../../services/productsServices";
import {useUser} from "../../../context/useUSer";
import {path} from "../../../routes/routes";

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
	onToggleLike: (productId: string, liked: boolean) => void;
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
		onToggleLike,
	}) => {
		// descriptive alt text for the image
		const generateImageAlt = (productName: string, category: string) => {
			return `${productName} منتج من بيع وشراء - ${category} عالي الجودة`;
		};

		const jsonLdData = generateSingleProductJsonLd(product);
		const {t} = useTranslation();
		const {auth, isLoggedIn} = useUser();
		const navigate = useNavigate();
		const dir = handleRTL();
		const theme = useTheme();

		const handleLike = async () => {
			if (!isLoggedIn) {
				navigate(path.Login);
				return;
			}

			try {
				// Call the backend route
				const res = await toggleLike(product._id ?? "");

				onToggleLike(product._id!, res.liked);

				showSuccess(
					res.liked
						? "تمت إضافة المنتج للمفضلة"
						: "تمت إزالة المنتج من المفضلة",
				);
			} catch (err) {
				console.error(err);
				showError("حدث خطأ أثناء تحديث المفضلة");
			}
		};

		const userLiked = product.likes?.includes(auth?._id ?? "");

		return (
			<Card
				dir={dir}
				sx={{
					height: "100%",
					borderRadius: 2.5,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "space-around",
					backgroundColor: "#F5F5F5",
					p: 1,
					boxShadow: "3px 3px 10px #505050",
					transition: "0.3s ease",
					"&:hover": {
						boxShadow: "6px 6px 20px #303030",
						transform: "translateY(-4px)",
					},
				}}
				itemScope
				itemType='https://schema.org/Product'
				role='article'
				aria-label={`منتج: ${product.product_name}`}
			>
				<JsonLd data={jsonLdData} />
				<Box
					position='relative'
					width='100%'
					sx={{
						maxHeight: {
							xs: "130px",
							md: "163px",
							lg: "130px",
						},
					}}
				>
					<Link
						to={`/product-details/${product.category}/${product.brand}/${product._id}`}
						aria-label={`تفاصيل عن ${product.product_name}`}
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
							image={product.image_url}
							alt={generateImageAlt(product.product_name, category)}
							title={product.product_name}
							sx={{
								width: "100%",
								height: "100%",
								borderRadius: 3,
								overflow: "hidden",
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
					{product.sale && (
						<Chip
							label={`${product.discount}% تخفيض`}
							color='error'
							size='small'
							aria-label={`خصم ${product.discount} بالمئة`}
							sx={{
								position: "absolute",
								top: 10,
								right: 10,
								bgcolor: "#d32f2f",
								color: "#fff",
								fontWeight: "bold",
								zIndex: 1,
								py: 2,
							}}
						/>
					)}
				</Box>
				{product?.color && (
					<Box sx={{display: "flex", gap: 1, mt: 2}}>
						<Typography>{t("color")}</Typography>
						<Typography
							sx={{
								width: 20,
								height: 20,
								border: `5px solid ${product.color}`,
								borderRadius: 3,
							}}
						/>
					</Box>
				)}
				{product.category}
				{product.seller && (
					<Box textAlign={"center"} m={1}>
						<Link
							to={`/users/customer/${product.seller.slug}`}
							aria-label={`الانتقال إلى صفحة البائع ${product.seller.slug}`}
						>
							@{product.seller.slug}
						</Link>
					</Box>
				)}
				<CardContent sx={{flexGrow: 1}}>
					<Typography
						variant='h6'
						align='center'
						fontWeight='bold'
						gutterBottom
						itemProp='name'
					>
						{product.product_name}
					</Typography>
					{product.description && (
						<Box
							sx={{
								width: "100%",
								mb: 1,
								border: 1,
								p: 1,
								borderRadius: 3,
							}}
						>
							<Typography
								component='p'
								variant='body2'
								align='center'
								color='text.secondary'
								sx={{lineHeight: 1.6}}
							>
								{product.description}
							</Typography>
						</Box>
					)}
					{product.sale ? (
						<Box textAlign='center' my={1}>
							<Typography
								variant='body2'
								color='text.secondary'
								sx={{textDecoration: "line-through"}}
								itemProp='price'
								content={product.price.toString()}
							>
								{formatPrice(product.price)}
							</Typography>
							<Typography
								variant='h6'
								color='error.main'
								fontWeight={700}
								itemProp='offers'
								content={discountedPrice.toString()}
							>
								{formatPrice(discountedPrice)}
							</Typography>
							<meta itemProp='priceCurrency' content='ILS' />
							<meta itemProp='price' content={discountedPrice.toString()} />
						</Box>
					) : (
						<Typography
							variant='h6'
							align='center'
							color={"success.main"}
							fontWeight={700}
							aria-live='polite'
							itemProp='price'
							content={formatPrice(product.price)}
						>
							<meta itemProp='priceCurrency' content='ILS' />
						</Typography>
					)}

					<Box
						sx={{
							textAlign: "center",
						}}
					>
						<ColorsAndSizes category={category} />
					</Box>
				</CardContent>
				<Stack
					sx={{
						my: 1,
					}}
				>
					{canEdit && (
						<Box
							sx={{
								display: "flex",
								alignSelf: "center",
								justifyContent: "space-around",
							}}
							role='group'
							aria-label='خيارات إدارة المنتج'
						>
							<Button
								size='small'
								color='warning'
								aria-label='تعديل المنتج'
								onClick={() => {
									setProductIdToUpdate(product._id as string);
									onShowUpdateProductModal();
								}}
								startIcon={<EditIcon />}
								variant='outlined'
								sx={{
									borderRadius: 3,
									minWidth: 50,
								}}
							/>
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
									onClick={handleLike}
								>
									{userLiked ? (
										<>
											<FavoriteIcon color='error' />
											<Typography sx={{ml: 0.5}}>
												{product.likes?.length ?? 0}
											</Typography>
										</>
									) : (
										<>
											<FavoriteBorderIcon />
											<Typography sx={{ml: 0.5}}>
												{product.likes?.length ?? 0}
											</Typography>
										</>
									)}
								</IconButton>

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
												.then(() =>
													showSuccess("تمت المشاركة بنجاح"),
												)
												.catch(() => showError("فشل المشاركة"));
										} else
											showError(
												"المشاركة غير مدعومة في هذا المتصفح",
											);
									}}
								>
									<ShareIcon />
								</IconButton>
							</Box>
							<Button
								size='small'
								color='error'
								aria-label='حذف المنتج'
								onClick={() => openDeleteModal(product.product_name)}
								startIcon={<DeleteIcon />}
								variant='outlined'
								sx={{borderRadius: 3, minWidth: 50}}
							/>
						</Box>
					)}
				</Stack>
			</Card>
		);
	},
);

export default ProductCard;
