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
	Tabs,
	Tab,
	Badge,
	Divider,
	Paper,
} from "@mui/material";
import {FunctionComponent, useEffect, useState, SyntheticEvent} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {User} from "../../interfaces/usersMessages";
import {getCustomerProfileBySlug} from "../../services/usersServices";
import {getCustomerProfileProductsBySlug} from "../../services/productsServices";
import {
	FavoriteBorder,
	Favorite,
	Share,
	Visibility,
	Star,
	LocalOffer,
	Phone,
	Email,
	LocationOn,
	VerifiedUser,
	Storefront,
	ThumbUp,
	// Comment,
	ArrowBack,
	WhatsApp,
	Facebook,
	Instagram,
	Twitter,
	ChatBubble,
} from "@mui/icons-material";
import {Products} from "../../interfaces/Products";
import {formatPrice, formatDate} from "../../helpers/dateAndPriceFormat";
import {Helmet} from "react-helmet";
import {motion} from "framer-motion";
import {useUser} from "../../context/useUSer";
import {showSuccess, showError} from "../../atoms/toasts/ReactToast";
import LikeButton from "../../atoms/LikeButton";
import {path} from "../../routes/routes";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const TabPanel: FunctionComponent<TabPanelProps> = ({children, value, index}) => {
	return (
		<div role='tabpanel' hidden={value !== index}>
			{value === index && <Box sx={{py: 3}}>{children}</Box>}
		</div>
	);
};

const CustomerProfile: FunctionComponent = () => {
	const {slug} = useParams<{slug: string}>();
	const theme = useTheme();
	const navigate = useNavigate();
	const {isLoggedIn} = useUser();

	const [user, setUser] = useState<User | null>(null);
	const [products, setProducts] = useState<Products[]>([]);
	const [loading, setLoading] = useState(true);
	const [wishlist, setWishlist] = useState<Set<string>>(new Set());
	const [tabValue, setTabValue] = useState(0);
	const [stats, setStats] = useState({
		totalProducts: 0,
		totalLikes: 0,
		totalViews: 0,
		rating: 4.5,
	});

	const toggleWishlist = (productId: string) => {
		if (!isLoggedIn) {
			navigate(path.Login);
			return;
		}

		const newWishlist = new Set(wishlist);
		if (newWishlist.has(productId)) {
			newWishlist.delete(productId);
			showSuccess("تمت إزالة المنتج من المفضلة");
		} else {
			newWishlist.add(productId);
			showSuccess("تمت إضافة المنتج إلى المفضلة");
		}
		setWishlist(newWishlist);
	};

	const handleTabChange = (_: SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	useEffect(() => {
		if (!slug) return;

		const fetchData = async () => {
			try {
				const [profile, productsData] = await Promise.all([
					getCustomerProfileBySlug(slug),
					getCustomerProfileProductsBySlug(slug),
				]);

				setUser(profile);
				setProducts(productsData);

				// حساب الإحصائيات
				const totalLikes = productsData.reduce(
					(sum, product) => sum + (product.likes?.length || 0),
					0,
				);
				const totalViews = productsData.reduce(
					(sum, product) => sum + (product.views || 0),
					0,
				);

				setStats({
					totalProducts: productsData.length,
					totalLikes,
					totalViews,
					rating: profile.rating || 4.5,
				});
			} catch (error) {
				console.error(error);
				showError("حدث خطأ في تحميل بيانات المستخدم");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [slug]);

	const updateProductInList = (updatedProduct: Products) => {
		setProducts((prev) =>
			prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)),
		);
	};

	const handleShareProfile = () => {
		if (navigator.share) {
			navigator.share({
				title: `الملف الشخصي لـ ${user?.name?.first} ${user?.name?.last}`,
				text: `اطلع على منتجات ${user?.name?.first} على موقع صفقه`,
				url: window.location.href,
			});
		} else {
			navigator.clipboard.writeText(window.location.href);
			showSuccess("تم نسخ رابط الملف الشخصي");
		}
	};

	const handleContactSeller = () => {
		if (user?.phone?.phone_1) {
			window.open(`tel:${user.phone.phone_1}`, "_blank");
		} else {
			showError("لا يوجد رقم هاتف متوفر");
		}
	};

	const handleWhatsApp = () => {
		if (user?.phone?.phone_1) {
			const message = `مرحباً ${user?.name?.first}، أنا مهتم بمنتجاتك على موقع صفقه`;
			window.open(
				`https://wa.me/${user.phone.phone_1}?text=${encodeURIComponent(message)}`,
				"_blank",
			);
		}
	};

	if (loading) {
		return (
			<Box
				display='flex'
				flexDirection='column'
				justifyContent='center'
				alignItems='center'
				minHeight='80vh'
				gap={3}
			>
				<motion.div
					animate={{rotate: 360}}
					transition={{duration: 2, repeat: Infinity, ease: "linear"}}
				>
					<CircularProgress size={60} />
				</motion.div>
				<Typography variant='h6' color='text.secondary'>
					جاري تحميل الملف الشخصي...
				</Typography>
			</Box>
		);
	}

	if (!user) {
		return (
			<Container maxWidth='md' sx={{py: 8, textAlign: "center"}}>
				<Card sx={{p: 4, borderRadius: 3}}>
					<Box sx={{fontSize: 80, mb: 3}}>😔</Box>
					<Typography variant='h5' color='text.secondary' gutterBottom>
						المستخدم غير موجود
					</Typography>
					<Typography variant='body1' color='text.secondary' paragraph>
						الملف الشخصي الذي تبحث عنه غير موجود أو تم حذفه.
					</Typography>
					<Button
						variant='contained'
						startIcon={<ArrowBack />}
						onClick={() => navigate(-1)}
						sx={{mt: 2}}
					>
						العودة للخلف
					</Button>
				</Card>
			</Container>
		);
	}

	return (
		<>
			<Helmet>
				<title>
					{user.name?.first} {user.name?.last} | بائع صفقة
				</title>
				<meta
					name='description'
					content={`تصفح منتجات ${user.name?.first} ${user.name?.last} على موقع صفقه. ${products.length} منتج متوفر للبيع.`}
				/>
				<meta
					property='og:title'
					content={`${user.name?.first} ${user.name?.last} | بائع صفقة`}
				/>
				<meta
					property='og:description'
					content={`تصفح منتجات ${user.name?.first} على موقع صفقه`}
				/>
				<meta property='og:image' content={user?.image?.url || ""} />
			</Helmet>

			<Container maxWidth='lg' sx={{py: 4}}>
				{/* Back Button */}
				<Button
					startIcon={<ArrowBack />}
					onClick={() => navigate(-1)}
					sx={{mb: 3}}
				>
					العودة
				</Button>

				{/* ENHANCED PROFILE HEADER */}
				<motion.div
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.5}}
				>
					<Card
						sx={{
							mb: 4,
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
						<CardContent sx={{p: {xs: 2, md: 3}}}>
							<Grid container alignItems='center' spacing={3}>
								{/* Avatar Section */}
								<Grid size={{xs: 12, md: "auto"}}>
									<Box
										position='relative'
										sx={{display: "flex", justifyContent: "center"}}
									>
										<Badge
											overlap='circular'
											anchorOrigin={{
												vertical: "bottom",
												horizontal: "right",
											}}
											badgeContent={
												<VerifiedUser
													sx={{
														color: "success.main",
														fontSize: 30,
														bgcolor: "white",
														borderRadius: "50%",
														p: 0.5,
													}}
												/>
											}
										>
											<Avatar
												src={user.image?.url}
												sx={{
													width: {xs: 100, md: 120},
													height: {xs: 100, md: 120},
													fontSize: {xs: 36, md: 48},
													border: `4px solid ${theme.palette.background.paper}`,
													boxShadow: 3,
													bgcolor: theme.palette.primary.main,
												}}
											>
												{user.name?.first
													?.charAt(0)
													.toUpperCase()}
											</Avatar>
										</Badge>
									</Box>
								</Grid>

								{/* User Info */}
								<Grid size={{xs: 12, md: 6}}>
									<Typography
										variant='h4'
										fontWeight='bold'
										gutterBottom
									>
										{user.name?.first} {user.name?.last}
									</Typography>
									<Stack
										direction='row'
										alignItems='center'
										spacing={1}
										mb={2}
									>
										<Typography
											variant='subtitle1'
											color='text.secondary'
										>
											@{slug}
										</Typography>
										<Chip
											icon={<Storefront />}
											label='بائع معتمد'
											size='small'
											color='primary'
											variant='outlined'
										/>
										{user.role === "Admin" && (
											<Chip
												label='مدير'
												size='small'
												color='warning'
												variant='outlined'
											/>
										)}
									</Stack>

									{/* Rating */}
									<Stack
										direction='row'
										alignItems='center'
										spacing={2}
										mb={2}
									>
										<Box>
											<Rating
												value={stats.rating}
												precision={0.1}
												readOnly
											/>
											<Typography
												variant='caption'
												color='text.secondary'
											>
												({stats.rating} من 5)
											</Typography>
										</Box>
										<Typography
											variant='body2'
											color='text.secondary'
										>
											{stats.totalProducts} منتج
										</Typography>
									</Stack>

									{/* Contact Info */}
									<Stack
										direction='row'
										spacing={2}
										flexWrap='wrap'
										gap={1}
									>
										{user.email && (
											<Chip
												icon={<Email />}
												label={user.email}
												variant='outlined'
												size='small'
											/>
										)}
										{user.phone?.phone_1 && (
											<Chip
												icon={<Phone />}
												label={user.phone.phone_1}
												variant='outlined'
												size='small'
											/>
										)}
										{user.address?.city && (
											<Chip
												icon={<LocationOn />}
												label={user.address.city}
												variant='outlined'
												size='small'
											/>
										)}
									</Stack>
								</Grid>

								{/* Action Buttons */}
								<Grid size={{xs: 12, md: 6}}>
									<Stack spacing={2}>
										<Button
											variant='contained'
											size='large'
											startIcon={<ChatBubble />}
											fullWidth
											onClick={handleContactSeller}
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
											startIcon={<WhatsApp />}
											onClick={handleWhatsApp}
											color='success'
										>
											واتساب
										</Button>
										<Button
											variant='outlined'
											size='large'
											fullWidth
											startIcon={<Share />}
											onClick={handleShareProfile}
										>
											مشاركة الملف
										</Button>
									</Stack>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</motion.div>

				{/* Stats Section */}
				<motion.div
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.5, delay: 0.1}}
				>
					<Grid container spacing={2} sx={{mb: 4}}>
						<Grid size={{xs: 6, sm: 3}}>
							<Paper sx={{p: 2, textAlign: "center", borderRadius: 2}}>
								<ThumbUp color='primary' sx={{fontSize: 40, mb: 1}} />
								<Typography variant='h4' fontWeight='bold'>
									{stats.totalLikes}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									إعجاب
								</Typography>
							</Paper>
						</Grid>
						<Grid size={{xs: 6, sm: 3}}>
							<Paper sx={{p: 2, textAlign: "center", borderRadius: 2}}>
								<Visibility color='info' sx={{fontSize: 40, mb: 1}} />
								<Typography variant='h4' fontWeight='bold'>
									{stats.totalViews}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									مشاهدة
								</Typography>
							</Paper>
						</Grid>
						<Grid size={{xs: 6, sm: 3}}>
							<Paper sx={{p: 2, textAlign: "center", borderRadius: 2}}>
								<LocalOffer color='success' sx={{fontSize: 40, mb: 1}} />
								<Typography variant='h4' fontWeight='bold'>
									{stats.totalProducts}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									منتج
								</Typography>
							</Paper>
						</Grid>
						<Grid size={{xs: 6, sm: 3}}>
							<Paper sx={{p: 2, textAlign: "center", borderRadius: 2}}>
								<Star color='warning' sx={{fontSize: 40, mb: 1}} />
								<Typography variant='h4' fontWeight='bold'>
									{stats.rating}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									تقييم
								</Typography>
							</Paper>
						</Grid>
					</Grid>
				</motion.div>

				{/* Tabs Section */}
				<Card sx={{mb: 4, borderRadius: 3}}>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						variant='scrollable'
						scrollButtons='auto'
						sx={{
							borderBottom: 1,
							borderColor: "divider",
							"& .MuiTab-root": {
								fontWeight: 600,
								minHeight: 60,
							},
						}}
					>
						<Tab
							label='المنتجات'
							icon={<Storefront />}
							iconPosition='start'
						/>
						<Tab
							label='المعلومات'
							icon={<VerifiedUser />}
							iconPosition='start'
						/>
						<Tab label='التقييمات' icon={<Star />} iconPosition='start' />
						<Tab label='التواصل' icon={<ChatBubble />} iconPosition='start' />
					</Tabs>

					<TabPanel value={tabValue} index={0}>
						{/* Products Grid */}
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
									منتجات {user.name?.first}
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
										<Grid
											size={{xs: 12, sm: 6, md: 4}}
											key={product._id}
										>
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
														{product.sale &&
															product.discount && (
																<Chip
																	label={`-${product.discount}%`}
																	color='error'
																	size='small'
																	sx={{
																		fontWeight:
																			"bold",
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
														onClick={() =>
															navigate(
																`/product-details/${product.category}/${product.brand}/${product._id}`,
															)
														}
													>
														<CardMedia
															component='img'
															image={
																product.image?.url ||
																"/placeholder.jpg"
															}
															alt={product.product_name}
															sx={{
																height: "100%",
																width: "100%",
																objectFit: "cover",
																transition:
																	"transform 0.5s ease",
																"&:hover": {
																	transform:
																		"scale(1.05)",
																},
															}}
														/>
													</Box>

													<CardContent sx={{p: 2.5}}>
														{/* Product Name and Category */}
														<Typography
															variant='subtitle1'
															fontWeight='bold'
															gutterBottom
															sx={{
																overflow: "hidden",
																textOverflow: "ellipsis",
																display: "-webkit-box",
																WebkitLineClamp: 2,
																WebkitBoxOrient:
																	"vertical",
																minHeight: 48,
																cursor: "pointer",
															}}
															onClick={() =>
																navigate(
																	`/product-details/${product.category}/${product.brand}/${product._id}`,
																)
															}
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
																		{formatPrice(
																			product.price,
																		)}
																	</Typography>
																)}
															</Box>
															<Box
																display='flex'
																alignItems='center'
															>
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
																	{product.rating ||
																		"4.5"}
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
																<LikeButton
																	product={product}
																/>
															</Box>
															<IconButton
																size='small'
																onClick={() =>
																	toggleWishlist(
																		product._id ?? "",
																	)
																}
															>
																{wishlist.has(
																	product._id ?? "",
																) ? (
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
									<Typography
										variant='h6'
										color='text.secondary'
										gutterBottom
									>
										لا توجد منتجات
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										{user.name?.first} لم يقم بإضافة أي منتجات بعد.
									</Typography>
								</Box>
							)}
						</Box>
					</TabPanel>

					<TabPanel value={tabValue} index={1}>
						{/* User Information */}
						<Grid container spacing={3}>
							<Grid size={{xs: 12, md: 6}}>
								<Card sx={{p: 3, borderRadius: 2}}>
									<Typography variant='h6' gutterBottom color='primary'>
										معلومات التواصل
									</Typography>
									<Stack spacing={2}>
										{user.email && (
											<Box
												display='flex'
												alignItems='center'
												gap={1}
											>
												<Email color='action' />
												<Typography>{user.email}</Typography>
											</Box>
										)}
										{user.phone?.phone_1 && (
											<Box
												display='flex'
												alignItems='center'
												gap={1}
											>
												<Phone color='action' />
												<Typography>
													{user.phone.phone_1}
												</Typography>
											</Box>
										)}
										{user.phone?.phone_2 && (
											<Box
												display='flex'
												alignItems='center'
												gap={1}
											>
												<Phone color='action' />
												<Typography>
													{user.phone.phone_2}
												</Typography>
											</Box>
										)}
									</Stack>
								</Card>
							</Grid>
							<Grid size={{xs: 12, md: 6}}>
								<Card sx={{p: 3, borderRadius: 2}}>
									<Typography variant='h6' gutterBottom color='primary'>
										العنوان
									</Typography>
									{user.address ? (
										<Stack spacing={1}>
											{user.address.city && (
												<Box
													display='flex'
													alignItems='center'
													gap={1}
												>
													<LocationOn color='action' />
													<Typography>
														{user.address?.street}،{" "}
														{user.address?.city}
														{user.address?.houseNumber &&
															`، رقم ${user.address?.houseNumber}`}
													</Typography>
												</Box>
											)}
										</Stack>
									) : (
										<Typography color='text.secondary'>
											لا يوجد عنوان مسجل
										</Typography>
									)}
								</Card>
							</Grid>
							<Grid size={{xs: 12}}>
								<Card sx={{p: 3, borderRadius: 2}}>
									<Typography variant='h6' gutterBottom color='primary'>
										معلومات الحساب
									</Typography>
									<Grid container spacing={2}>
										<Grid size={{xs: 6, md: 3}}>
											<Typography
												variant='body2'
												color='text.secondary'
											>
												تاريخ الانضمام
											</Typography>
											<Typography
												variant='body1'
												fontWeight='medium'
											>
												{user.createdAt
													? formatDate(user.createdAt)
													: "غير محدد"}
											</Typography>
										</Grid>
										<Grid size={{xs: 6, md: 3}}>
											<Typography
												variant='body2'
												color='text.secondary'
											>
												الدور
											</Typography>
											<Typography
												variant='body1'
												fontWeight='medium'
											>
												{user.role === "Admin" ? "مدير" : "بائع"}
											</Typography>
										</Grid>
										<Grid size={{xs: 6, md: 3}}>
											<Typography
												variant='body2'
												color='text.secondary'
											>
												الجنس
											</Typography>
											<Typography
												variant='body1'
												fontWeight='medium'
											>
												{user.gender === "זכר" ? "ذكر" : "أنثى"}
											</Typography>
										</Grid>
										<Grid size={{xs: 6, md: 3}}>
											<Typography
												variant='body2'
												color='text.secondary'
											>
												الحالة
											</Typography>
											<Chip
												label='نشط'
												color='success'
												size='small'
												variant='outlined'
											/>
										</Grid>
									</Grid>
								</Card>
							</Grid>
						</Grid>
					</TabPanel>

					<TabPanel value={tabValue} index={2}>
						{/* Reviews */}
						<Card sx={{p: 3, borderRadius: 2}}>
							<Typography variant='h6' gutterBottom color='primary'>
								تقييمات المستخدمين
							</Typography>
							<Box textAlign='center' py={4}>
								<Rating
									value={stats.rating}
									precision={0.1}
									readOnly
									size='large'
								/>
								<Typography variant='h3' sx={{my: 2}}>
									{stats.rating}
								</Typography>
								<Typography variant='body1' color='text.secondary'>
									من 5 نجوم بناءً على 28 تقييم
								</Typography>
							</Box>
							<Typography
								variant='body2'
								color='text.secondary'
								textAlign='center'
							>
								{user.name?.first} لديه تقييم ممتاز! ⭐
							</Typography>
						</Card>
					</TabPanel>

					<TabPanel value={tabValue} index={3}>
						{/* Contact */}
						<Card sx={{p: 3, borderRadius: 2}}>
							<Typography variant='h6' gutterBottom color='primary'>
								تواصل مع {user.name?.first}
							</Typography>
							<Grid container spacing={3}>
								<Grid size={{xs: 12, md: 6}}>
									<Button
										variant='contained'
										fullWidth
										size='large'
										startIcon={<ChatBubble />}
										onClick={handleContactSeller}
										sx={{py: 1.5}}
									>
										مراسلة مباشرة
									</Button>
								</Grid>
								<Grid size={{xs: 12, md: 6}}>
									<Button
										variant='contained'
										fullWidth
										size='large'
										color='success'
										startIcon={<WhatsApp />}
										onClick={handleWhatsApp}
										sx={{py: 1.5}}
									>
										مراسلة عبر واتساب
									</Button>
								</Grid>
							</Grid>

							<Divider sx={{my: 3}} />

							<Typography
								variant='subtitle2'
								gutterBottom
								color='text.secondary'
							>
								أو تواصل عبر:
							</Typography>
							<Stack direction='row' spacing={2} justifyContent='center'>
								<IconButton color='primary'>
									<Facebook />
								</IconButton>
								<IconButton color='primary'>
									<Twitter />
								</IconButton>
								<IconButton color='primary'>
									<Instagram />
								</IconButton>
								<IconButton
									color='primary'
									onClick={() => window.open(`mailto:${user.email}`)}
								>
									<Email />
								</IconButton>
								<IconButton
									color='primary'
									onClick={() =>
										window.open(`tel:${user.phone?.phone_1}`)
									}
								>
									<Phone />
								</IconButton>
							</Stack>
						</Card>
					</TabPanel>
				</Card>
			</Container>
		</>
	);
};

export default CustomerProfile;
