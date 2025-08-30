import LoadingButton from "@mui/lab/LoadingButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Chip,
	Skeleton,
	Typography,
} from "@mui/material";
import {Dispatch, FunctionComponent, SetStateAction} from "react";
import {Link} from "react-router-dom";
import {Products} from "../../../interfaces/Products";
import {formatPrice} from "../../../helpers/dateAndPriceFormat";
import {handleQuantity} from "../../../helpers/fruitesFunctions";
import ColorsAndSizes from "../../../atoms/productsManage/ColorsAndSizes";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {generateSingleProductJsonLd} from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";

interface ProductCardProps {
	product: Products;
	productQuantity: number;
	discountedPrice: number;
	unitText: string;
	isOutOfStock: boolean;
	quantities: {[key: string]: number};
	setQuantities: React.Dispatch<React.SetStateAction<{[key: string]: number}>>;
	loadingAddToCart: string | null;
	canEdit: boolean;
	setProductNameToUpdate: Dispatch<SetStateAction<string>>;
	onShowUpdateProductModal: () => void;
	openDeleteModal: (name: string) => void;
	setLoadedImages: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	loadedImages: Record<string, boolean>;
	handleAdd: Function;
	category: string;
}

const ProductCard: FunctionComponent<ProductCardProps> = ({
	product,
	productQuantity,
	discountedPrice,
	unitText,
	isOutOfStock,
	quantities,
	setQuantities,
	loadingAddToCart,
	canEdit,
	setProductNameToUpdate,
	onShowUpdateProductModal,
	openDeleteModal,
	setLoadedImages,
	loadedImages,
	handleAdd,
	category,
}) => {
	// descriptive alt text for the image
	const generateImageAlt = (productName: string, category: string) => {
		return `${productName} طازج من سوق السخنيني - ${category} عالي الجودة`;
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
				padding: 10,
				boxShadow: "0px 0px 1px white",
			}}
			className='card-hover'
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
				{product.sale ? (
					<Box textAlign='center' my={1}>
						<Typography
							variant='body2'
							color='text.secondary'
							sx={{textDecoration: "line-through"}}
						>
							{formatPrice(product.price)}
						</Typography>
						<Typography variant='h5' color='success.main' fontWeight={700}>
							{formatPrice(discountedPrice)}
						</Typography>
					</Box>
				) : (
					<Typography
						variant='h6'
						align='center'
						color={isOutOfStock ? "error" : "success.main"}
						aria-live='polite'
					>
						{isOutOfStock ? "غير متوفر حالياً" : formatPrice(product.price)}
					</Typography>
				)}

				<Typography
					variant='body2'
					align='center'
					color='text.secondary'
					itemProp='description'
				>
					{unitText}
				</Typography>
				<Box
					sx={{
						textAlign: "center",
					}}
				>
					<ColorsAndSizes category={category} />
				</Box>
			</CardContent>
			<Box role='group' aria-label='إدارة الكمية'>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						my: 1,
					}}
				>
					<Button
						size='small'
						color='error'
						disabled={isOutOfStock}
						onClick={() =>
							handleQuantity(setQuantities, "-", product.product_name)
						}
						startIcon={<RemoveSharpIcon />}
						aria-label='تقليل الكمية'
					/>

					<Typography aria-live='polite' fontSize={25}>
						{productQuantity}
					</Typography>

					<Button
						size='small'
						color='error'
						disabled={isOutOfStock}
						onClick={() =>
							handleQuantity(setQuantities, "+", product.product_name)
						}
						startIcon={<AddSharpIcon />}
						aria-label='زيادة الكمية'
					/>
				</Box>
			</Box>
			{product.description && (
				<Box sx={{my: 1}}>
					<Typography
						variant='subtitle1'
						align='center'
						fontWeight='bold'
						color='text.primary'
					>
						وصف المنتج
					</Typography>
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
			<LoadingButton
				fullWidth
				onClick={() => {
					handleAdd(
						product.product_name,
						quantities,
						product.price,
						product.image_url,
						product.sale || false,
						product.discount || 0,
					);
				}}
				loading={loadingAddToCart === product.product_name}
				loadingPosition='center'
				startIcon={<AddShoppingCartIcon />}
				disabled={isOutOfStock || loadingAddToCart === product.product_name}
				variant='outlined'
				color={
					isOutOfStock || loadingAddToCart === product.product_name
						? "error"
						: "success"
				}
				aria-label={`إضافة ${product.product_name} إلى السلة`}
			>
				{isOutOfStock ? "غير متوفر" : "أضف إلى السلة"}
			</LoadingButton>
			{canEdit && (
				<Box
					sx={{
						width: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						p: 1,
						mt: 1,
					}}
					role='group'
					aria-label='خيارات إدارة المنتج'
				>
					<Button
						size='medium'
						color='warning'
						aria-label='تعديل المنتج'
						onClick={() => {
							setProductNameToUpdate(product.product_name);
							onShowUpdateProductModal();
						}}
						startIcon={<EditIcon />}
						variant='outlined'
						sx={{
							borderRadius: "0px 0px 10px 0px",
						}}
					/>

					<Button
						size='medium'
						color='error'
						aria-label='حذف المنتج'
						onClick={() => openDeleteModal(product.product_name)}
						startIcon={<DeleteIcon />}
						variant='outlined'
						sx={{
							borderRadius: "0px 0px 0px 10px",
						}}
					/>
				</Box>
			)}
		</Card>
	);
};

export default ProductCard;
