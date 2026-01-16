import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Chip,
	CircularProgress,
	Grid,
	IconButton,
	Rating,
	Typography,
	useTheme,
	Stack,
	Container,
} from "@mui/material";
import {FunctionComponent, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {User} from "../../interfaces/usersMessages";
import {getCustomerProfileBySlug} from "../../services/usersServices";
import {getCustomerProfileProductsBySlug} from "../../services/productsServices";
import {
	FavoriteBorder,
	Favorite,
	Share,
	Visibility,
	ShoppingCart,
	Star,
	LocalOffer,
} from "@mui/icons-material";
import {Products} from "../../interfaces/Products";
import {formatPrice} from "../../helpers/dateAndPriceFormat";

const CustomerProfile: FunctionComponent = () => {
	const {slug} = useParams<{slug: string}>();
	const theme = useTheme();
	const navigat = useNavigate();

	const [user, setUser] = useState<User | null>(null);
	const [products, setProducts] = useState<Products[]>([]);
	const [loading, setLoading] = useState(true);
	const [wishlist, setWishlist] = useState<Set<string>>(new Set());

	const toggleWishlist = (productId: string) => {
		const newWishlist = new Set(wishlist);
		if (newWishlist.has(productId)) {
			newWishlist.delete(productId);
		} else {
			newWishlist.add(productId);
		}
		setWishlist(newWishlist);
	};

	useEffect(() => {
		if (!slug) return;

		const fetchData = async () => {
			try {
				const [profile, products] = await Promise.all([
					getCustomerProfileBySlug(slug),
					getCustomerProfileProductsBySlug(slug),
				]);

				setUser(profile);
				setProducts(products);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [slug]);

	if (loading)
		return (
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				minHeight='60vh'
			>
				<CircularProgress />
			</Box>
		);

	if (!user)
		return (
			<Box textAlign='center' mt={10}>
				<Typography variant='h5' color='text.secondary' gutterBottom>
					User not found
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					The profile you're looking for doesn't exist.
				</Typography>
			</Box>
		);

	return (
		<Container maxWidth='xl' sx={{py: 4}}>
			{/* ENHANCED PROFILE HEADER */}
			<Card
				sx={{
					mb: 6,
					borderRadius: 4,
					background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
					position: "relative",
					overflow: "hidden",
					"&::before": {
						content: '""',
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						height: 4,
						background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
					},
				}}
			>
				<CardContent>
					<Grid container alignItems='center' spacing={3}>
						<Grid size={{xs: 12, md: "auto"}}>
							<Box position='relative'>
								<Avatar
									sx={{
										width: 120,
										height: 120,
										fontSize: 48,
										border: `4px solid ${theme.palette.background.paper}`,
										boxShadow: 3,
										bgcolor: theme.palette.primary.main,
									}}
								>
									{user.name?.first?.charAt(0).toUpperCase()}
								</Avatar>
								<Chip
									label='Verified'
									color='success'
									size='small'
									sx={{
										position: "absolute",
										bottom: 0,
										right: 0,
										transform: "translate(25%, 25%)",
									}}
								/>
							</Box>
						</Grid>

						<Grid size={{xs: 12, md: 6}}>
							<Typography variant='h4' fontWeight='bold' gutterBottom>
								{user.name?.first} {user.name?.last}
							</Typography>
							<Typography
								variant='subtitle1'
								color='text.secondary'
								gutterBottom
								sx={{display: "flex", alignItems: "center", gap: 1}}
							>
								@{slug}
								<Chip
									label='Premium Seller'
									size='small'
									color='primary'
									variant='outlined'
								/>
							</Typography>
							<Box display='flex' alignItems='center' gap={2} mt={1}>
								<Rating value={4.5} precision={0.5} readOnly />
								<Typography variant='body2' color='text.secondary'>
									(128 reviews)
								</Typography>
							</Box>
							{user.email && (
								<Typography
									variant='body1'
									sx={{mt: 2, color: "text.secondary"}}
								>
									{user.role}
								</Typography>
							)}
						</Grid>

						<Grid size={{xs: 12, md: 6}} sx={{ml: "auto"}}>
							<Stack spacing={2}>
								<Button
									variant='contained'
									size='large'
									startIcon={<ShoppingCart />}
									fullWidth
									sx={{
										background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
										boxShadow: 3,
									}}
								>
									تواصل مع البائع
								</Button>
								<Button
									variant='outlined'
									size='large'
									fullWidth
									startIcon={<Share />}
								>
									مشاركة الملف الشخصي
								</Button>
							</Stack>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* PRODUCTS SECTION */}
			<Box mb={4}>
				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='center'
					mb={3}
				>
					<Typography
						variant='h5'
						fontWeight='bold'
						sx={{position: "relative"}}
					>
						المنتجات الخاصه بهذه المستخدم
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
						label={`${products.length} Products`}
						color='primary'
						variant='outlined'
					/>
				</Box>

				<Grid container spacing={3}>
					{products.map((product) => (
						<Grid size={{xs: 12, sm: 6, md: 4}} key={product._id}>
							<Card
								sx={{
									height: "100%",
									borderRadius: 3,
									overflow: "hidden",
									transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
									position: "relative",
									"&:hover": {
										transform: "translateY(-8px)",
										boxShadow: theme.shadows[8],
										"& .product-actions": {
											opacity: 1,
											transform: "translateY(0)",
										},
										"& .product-image": {
											transform: "scale(1.05)",
										},
									},
								}}
							>
								{/* PRODUCT BADGES */}
								<Box position='absolute' top={12} left={12} zIndex={1}>
									{product.isNew && (
										<Chip
											label='NEW'
											color='success'
											size='small'
											sx={{mr: 1, fontWeight: "bold"}}
										/>
									)}
									{product.discount && (
										<Chip
											label={`-${product.discount}%`}
											color='error'
											size='small'
											sx={{fontWeight: "bold"}}
										/>
									)}
								</Box>

								{/* WISHLIST BUTTON */}
								<IconButton
									onClick={() => toggleWishlist(product._id ?? "")}
									sx={{
										position: "absolute",
										top: 12,
										right: 12,
										zIndex: 1,
										bgcolor: "background.paper",
										"&:hover": {
											bgcolor: "background.paper",
										},
									}}
								>
									{wishlist.has(product._id ?? "") ? (
										<Favorite color='error' />
									) : (
										<FavoriteBorder />
									)}
								</IconButton>

								{/* PRODUCT IMAGE */}
								<Box
									sx={{
										position: "relative",
										overflow: "hidden",
										height: 200,
										bgcolor: "grey.100",
									}}
								>
									<CardMedia
										component='img'
										image={product.image_url || "/placeholder.jpg"}
										alt={product.product_name}
										sx={{
											height: "100%",
											width: "100%",
											objectFit: "cover",
											transition: "transform 0.5s ease",
											"&.product-image": {},
										}}
										className='product-image'
									/>

									{/* QUICK VIEW OVERLAY */}
									<Box
										className='product-actions'
										sx={{
											position: "absolute",
											bottom: 0,
											left: 0,
											right: 0,
											background:
												"linear-gradient(transparent, rgba(0,0,0,0.7))",
											padding: 2,
											opacity: 0,
											transform: "translateY(20px)",
											transition: "all 0.3s ease",
										}}
									>
										<Button
											variant='contained'
											size='small'
											fullWidth
											startIcon={<Visibility />}
											sx={{
												bgcolor: "background.paper",
												color: "text.primary",
												"&:hover": {
													bgcolor: "primary.main",
													color: "primary.contrastText",
												},
											}}
											onClick={() =>
												navigat(
													`/product-details/${product.category || product.type}/${product.brand}/${product._id}`,
												)
											}
										>
											نظرة سريعة
										</Button>
									</Box>
								</Box>

								<CardContent sx={{p: 2.5}}>
									<Typography
										variant='subtitle1'
										fontWeight='bold'
										gutterBottom
										sx={{
											overflow: "hidden",
											textOverflow: "ellipsis",
											display: "-webkit-box",
											WebkitLineClamp: 2,
											WebkitBoxOrient: "vertical",
											minHeight: 48,
										}}
									>
										{product.product_name}
									</Typography>

									{product.category && (
										<Typography
											variant='caption'
											color='text.secondary'
											display='block'
											mb={1}
										>
											{product.category}
										</Typography>
									)}

									{/* PRICE & RATING */}
									<Box
										display='flex'
										justifyContent='space-between'
										alignItems='center'
										mb={2}
									>
										<Box>
											<Typography
												variant='h6'
												color='primary'
												fontWeight='bold'
											>
												{formatPrice(product.price)}
											</Typography>
											{product.sale && (
												<Typography
													variant='body2'
													color='text.secondary'
													sx={{textDecoration: "line-through"}}
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
											<Typography variant='body2' fontWeight='bold'>
												{product.rating || "4.5"}
											</Typography>
										</Box>
									</Box>

									{/* ACTION BUTTONS */}
									<Stack direction='row' spacing={1}>
										{/* <Button
											variant='contained'
											fullWidth
											startIcon={<ShoppingCart />}
											size='medium'
											sx={{
												flex: 1,
												py: 1,
												background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
											}}
										>
											أضف إلى السلة
										</Button> */}
										<Button
											variant='outlined'
											size='medium'
											sx={{minWidth: 44, px: 0}}
										>
											<Share fontSize='small' />
										</Button>
									</Stack>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>

				{products.length === 0 && (
					<Box textAlign='center' py={10}>
						<Typography variant='h6' color='text.secondary' gutterBottom>
							No products available
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							This seller hasn't added any products yet.
						</Typography>
					</Box>
				)}
			</Box>
		</Container>
	);
};

export default CustomerProfile;
