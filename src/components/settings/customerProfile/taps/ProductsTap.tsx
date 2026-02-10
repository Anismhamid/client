import {
	Grid,
	CardContent,
	CardMedia,
	Stack,
	IconButton,
	Box,
	Card,
	Chip,
	Typography,
	useTheme,
} from "@mui/material";
import {FunctionComponent} from "react";
import TabPanel from "./TabPanel";
import {} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {
	LocalOffer,
	Star,
	Favorite,
	FavoriteBorder,
	Share,
	Storefront,
} from "@mui/icons-material";
import {Products} from "../../../../interfaces/Posts";
import {User} from "../../../../interfaces/usersMessages";
import {productsPathes} from "../../../../routes/routes";
import {useTranslation} from "react-i18next";
import {formatPrice} from "../../../../helpers/dateAndPriceFormat";
import LikeButton from "../../../../atoms/LikeButton";
import {showSuccess} from "../../../../atoms/toasts/ReactToast";

interface ProductsTabProps {
	tabValue: number;
	products: Products[];
	user: User;
	wishlist: Set<string>;
	toggleWishlist: (id: string) => void;
}

const ProductsTab: FunctionComponent<ProductsTabProps> = ({
	tabValue,
	products,
	user,
	toggleWishlist,
	wishlist,
}) => {
	const theme = useTheme();
	const {t} = useTranslation();
	const navigate = useNavigate();

	return (
		<TabPanel value={tabValue} index={0}>
			<Box mb={4}>
				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='center'
					m={3}
				>
					<Typography
						variant='h5'
						fontWeight='bold'
						sx={{position: "relative"}}
					>
						{t("shares")} {user.name?.first}
						<Box
							sx={{
								position: "absolute",
								bottom: -8,
								left: 0,
								width: 60,
								height: 4,
								background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
								borderRadius: 2,
							}}
						/>
					</Typography>
					<Chip
						icon={<LocalOffer />}
						label={`${products.length} منتج`}
						color='primary'
						variant='outlined'
					/>
				</Box>

				{products.length > 0 ? (
					<Grid container spacing={3}>
						{products.map((product, index) => (
							<Grid size={{xs: 12, sm: 6, md: 4}} key={product._id}>
								<motion.div
									initial={{opacity: 0, y: 20}}
									animate={{opacity: 1, y: 0}}
									transition={{
										duration: 0.3,
										delay: index * 0.05,
									}}
								>
									<Card
										sx={{
											height: "100%",
											borderRadius: 3,
											overflow: "hidden",
											transition: "all 0.3s ease",
											position: "relative",
											"&:hover": {
												transform: "translateY(-8px)",
												boxShadow: theme.shadows[8],
											},
										}}
									>
										{/* Product Badges */}
										<Box
											position='absolute'
											top={12}
											left={12}
											zIndex={1}
										>
											{product.isNew && (
												<Chip
													label='جديد'
													color='success'
													size='small'
													sx={{
														mr: 1,
														fontWeight: "bold",
													}}
												/>
											)}
											{product.sale && product.discount && (
												<Chip
													label={`-${product.discount}%`}
													color='error'
													size='small'
													sx={{
														fontWeight: "bold",
													}}
												/>
											)}
										</Box>

										{/* Product Image */}
										<Box
											sx={{
												position: "relative",
												overflow: "hidden",
												height: 200,
												bgcolor: "grey.100",
												cursor: "pointer",
											}}
										>
											<CardMedia
												component='img'
												image={
													product.image?.url ||
													`${product.product_name} - بيع وشراء في ${product.category}`
												}
												alt={`${product.product_name} للبيع في ${user.address?.city} - متجر ${user.name?.first}`}
												loading='lazy'
												sx={{
													height: "100%",
													width: "100%",
													objectFit: "cover",
													transition: "transform 0.5s ease",
													"&:hover": {
														transform: "scale(1.05)",
													},
												}}
												onClick={() =>
													navigate(
														`${productsPathes.productDetails}/${product.category}/${product.brand}/${product._id}`,
													)
												}
											/>
										</Box>

										<CardContent sx={{p: 2.5}}>
											{/* Product Name and Category */}
											<Typography
												variant='subtitle1'
												fontWeight='bold'
												component={Link}
												gutterBottom
												to={`${productsPathes.productDetails}/${product.category}/${product.brand}/${product._id}`}
												sx={{
													textDecoration: "none",
													textOverflow: "ellipsis",
													display: "-webkit-box",
													WebkitLineClamp: 2,
													WebkitBoxOrient: "vertical",
													minHeight: 48,
													color: "inherit",
													"&:hover": {
														color: "primary.main",
													},
												}}
											>
												{product.product_name}
											</Typography>

											{/* Price and Rating */}
											<Box
												display='flex'
												justifyContent='space-between'
												alignItems='center'
												mb={2}
											>
												<Box>
													{product.sale ? (
														<Box>
															<Typography
																variant='h6'
																color='error'
																fontWeight='bold'
															>
																{formatPrice(
																	product.price -
																		(product.price *
																			(product.discount ||
																				0)) /
																			100,
																)}
															</Typography>
															<Typography
																variant='body2'
																color='text.secondary'
																sx={{
																	textDecoration:
																		"line-through",
																}}
															>
																{formatPrice(
																	product.price,
																)}
															</Typography>
														</Box>
													) : (
														<Typography
															variant='h6'
															color='primary'
															fontWeight='bold'
														>
															{formatPrice(product.price)}
														</Typography>
													)}
												</Box>
												<Box display='flex' alignItems='center'>
													<Star
														sx={{
															color: "warning.main",
															fontSize: 18,
															mr: 0.5,
														}}
													/>
													<Typography
														variant='body2'
														fontWeight='bold'
													>
														{product.rating || "4.5"}
													</Typography>
												</Box>
											</Box>

											{/* Like and Action Buttons */}
											<Stack
												direction='row'
												spacing={1}
												alignItems='center'
											>
												<Box sx={{flex: 1}}>
													<LikeButton product={product} />
												</Box>
												<IconButton
													size='small'
													onClick={() =>
														toggleWishlist(product._id ?? "")
													}
												>
													{wishlist.has(product._id ?? "") ? (
														<Favorite color='error' />
													) : (
														<FavoriteBorder />
													)}
												</IconButton>
												<IconButton
													size='small'
													onClick={() => {
														if (navigator.share) {
															navigator.share({
																title: product.product_name,
																text: `شاهد ${product.product_name} على موقع صفقه`,
																url: `${window.location.origin}/product-details/${product.category}/${product.brand}/${product._id}`,
															});
														} else {
															navigator.clipboard.writeText(
																`${window.location.origin}/product-details/${product.category}/${product.brand}/${product._id}`,
															);
															showSuccess(
																"تم نسخ رابط المنتج",
															);
														}
													}}
												>
													<Share />
												</IconButton>
											</Stack>
										</CardContent>
									</Card>
								</motion.div>
							</Grid>
						))}
					</Grid>
				) : (
					<Box textAlign='center' py={10}>
						<Storefront
							sx={{
								fontSize: 80,
								color: "text.secondary",
								mb: 2,
							}}
						/>
						<Typography variant='h6' color='text.secondary' gutterBottom>
							لا توجد منتجات
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							{user.name?.first} لم يقم بإضافة أي منتجات بعد.
						</Typography>
					</Box>
				)}
			</Box>
		</TabPanel>
	);
};

export default ProductsTab;
