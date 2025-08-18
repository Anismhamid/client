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
	setLoadedImages: React.Dispatch<SetStateAction<Record<string, boolean>>>;
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
	return (
		<Card
			style={{height: "100%"}}
			className='d-flex p-1 flex-column justify-content-between shadow-sm rounded-4'
		>
			<Box
				position='relative'
				width='100%'
				sx={{
					minHeight: {
						xs: "160px",
						md: "200px",
						lg: "200px",
					},
				}}
			>
				<Link to={`/product-details/${encodeURIComponent(product.product_name)}`}>
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
						/>
					)}
					<CardMedia
						component='img'
						loading='lazy'
						image={product.image_url}
						alt={product.product_name}
						title={product.product_name}
						sx={{
							width: "100%",
							height: "100%",
              borderRadius:3,
              overflow: "hidden",
						}}
						onLoad={() => {
							setLoadedImages((prev) => ({
								...prev,
								[product.product_name]: true,
							}));
						}}
					/>
				</Link>
			</Box>
			<CardContent sx={{flexGrow: 1}}>
				<Typography variant='h6' align='center' fontWeight='bold' gutterBottom>
					{product.product_name}
				</Typography>
				{product.sale ? (
					<Box
						sx={{
							textAlign: "center",
						}}
					>
						<Chip
							label={`${product.discount}% הנחה`}
							color='error'
							size='small'
						/>
						<Typography variant='h6' align='center'>
							<s>{formatPrice(product.price)}</s>
						</Typography>
					</Box>
				) : (
					<Typography
						variant='body2'
						align='center'
						className={isOutOfStock ? "text-danger" : "text-success"}
					>
						{isOutOfStock
							? "אזל מהמלאי"
							: `במלאי: ${product.quantity_in_stock}`}
					</Typography>
				)}

				<Typography variant='body2' align='center' color='text.secondary'>
					{unitText}
				</Typography>
				<Box
					sx={{
						textAlign: "center",
					}}
				>
					<ColorsAndSizes category={category} />
				</Box>
				<Typography variant='h5' align='center' color='success.main'>
					{formatPrice(discountedPrice)}
				</Typography>
			</CardContent>

			<Box>
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
					/>

					<Typography>{productQuantity}</Typography>

					<Button
						size='small'
						color='error'
						disabled={isOutOfStock}
						onClick={() =>
							handleQuantity(setQuantities, "+", product.product_name)
						}
						startIcon={<AddSharpIcon />}
					/>
				</Box>
			</Box>
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
			/>

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
				>
					<Button
						size='medium'
						color='warning'
						aria-label='עריכה'
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
						aria-label='מחיקה'
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
