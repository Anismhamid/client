import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Chip,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
import {Dispatch, FunctionComponent, memo, SetStateAction} from "react";
import {Link} from "react-router-dom";
import {Products} from "../../../interfaces/Products";
import {formatPrice} from "../../../helpers/dateAndPriceFormat";
import ColorsAndSizes from "../../../atoms/productsManage/ColorsAndSizes";
import {generateSingleProductJsonLd} from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";

interface ProductCardProps {
	product: Products;
	discountedPrice: number;
	isOutOfStock: boolean;
	loadingAddToCart: string | null;
	canEdit?: boolean;
	setProductNameToUpdate: Dispatch<SetStateAction<string>>;
	onShowUpdateProductModal: () => void;
	openDeleteModal: (name: string) => void;
	setLoadedImages: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	loadedImages: Record<string, boolean>;
	category: string;
}

const ProductCard: FunctionComponent<ProductCardProps> = memo(
	({
		product,
		discountedPrice,
		isOutOfStock,
		canEdit,
		setProductNameToUpdate,
		onShowUpdateProductModal,
		openDeleteModal,
		setLoadedImages,
		loadedImages,
		category,
	}) => {
		// descriptive alt text for the image
		const generateImageAlt = (productName: string, category: string) => {
			return `${productName} منتج من بيع وشراء - ${category} عالي الجودة`;
		};

		const jsonLdData = generateSingleProductJsonLd(product);

		return (
			<Card
				style={{
					height: "100%",
					borderRadius: 20,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "space-around",
					border: "1px solid black",
					padding: 5,
					boxShadow: "0px 0px 3px white",
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
						to={`/product-details/${encodeURIComponent(product.product_name)}`}
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
							<link
								itemProp='availability'
								href={
									isOutOfStock
										? "https://schema.org/OutOfStock"
										: "https://schema.org/InStock"
								}
							/>
						</Box>
					) : (
						<Typography
							variant='h6'
							align='center'
							color={isOutOfStock ? "error.main" : "success.main"}
							fontWeight={700}
							aria-live='polite'
							itemProp='price'
							content={product.price.toString()}
						>
							{isOutOfStock
								? "غير متوفر حالياً"
								: formatPrice(product.price)}
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
									setProductNameToUpdate(product.product_name);
									onShowUpdateProductModal();
								}}
								startIcon={<EditIcon />}
								variant='outlined'
								sx={{
									borderRadius: 3,
									minWidth: 50,
								}}
							/>

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
