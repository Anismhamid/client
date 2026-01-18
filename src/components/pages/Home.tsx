import {FunctionComponent, useEffect, useMemo, useState} from "react";
import DiscountsAndOffers from "./products/DiscountsAndOffers";
import {useUser} from "../../context/useUSer";
import {deleteProduct, getAllProducts} from "../../services/productsServices";
import {Products} from "../../interfaces/Products";
import Loader from "../../atoms/loader/Loader";
import {
	Button,
	CircularProgress,
	Chip,
	Box,
	Typography,
	alpha,
	useMediaQuery,
} from "@mui/material";
import RoleType from "../../interfaces/UserType";
import {showError} from "../../atoms/toasts/ReactToast";
import UpdateProductModal from "../../atoms/productsManage/UpdateProductModal";
import AlertDialogs from "../../atoms/toasts/Sweetalert";
import {useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";
import SearchBox from "../../atoms/productsManage/SearchBox";
import {Col, Row} from "react-bootstrap";
import {useRef} from "react";
import handleRTL from "../../locales/handleRTL";
import ProductCard from "./products/ProductCard";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";
import {productsAndCategories} from "../navbar/navCategoryies";
import {motion, AnimatePresence} from "framer-motion";
import ChepNavigation from "../navbar/ChepNavigation";

interface HomeProps {}

/**
 * Home page
 * @returns All products by categories
 */

const Home: FunctionComponent<HomeProps> = () => {
	const [products, setProducts] = useState<Products[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const {auth} = useUser();
	const [visibleProducts, setVisibleProducts] = useState<Products[]>([]);
	const [visibleCount, setVisibleCount] = useState(16);
	const [productIdToUpdate, setProductIdToUpdate] = useState<string>("");
	const [showUpdateProductModal, setOnShowUpdateProductModal] =
		useState<boolean>(false);
	const observerRef = useRef<HTMLDivElement | null>(null);
	const [productToDelete, setProductToDelete] = useState<string>("");
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
	const [refresh, setRefresh] = useState<boolean>(false);
	const navigate = useNavigate();
	const {t} = useTranslation();
	const isMobile = useMediaQuery("(max-width:768px)");

	const openDeleteModal = (name: string) => {
		setProductToDelete(name);
		setShowDeleteModal(true);
	};
	const closeDeleteModal = () => setShowDeleteModal(false);

	const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
	const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

	const refreshAfterCange = () => setRefresh(!refresh);

	const handleToggleLike = (productId: string, liked: boolean, userId: string) => {
		setProducts((prev) =>
			prev.map((p) =>
				p._id === productId
					? {
							...p,
							likes: liked
								? [...(p.likes || []), userId]
								: (p.likes || []).filter((id) => id !== userId),
						}
					: p,
			),
		);
	};

	useEffect(() => {
		getAllProducts()
			.then((products) => {
				const safeProducts = Array.isArray(products) ? products : [];
				setProducts(safeProducts);
				setVisibleProducts(safeProducts.slice(0, 16));
				window.scrollTo(0, 0);
			})
			.catch(() => {
				setProducts([]);
				setVisibleProducts([]);
			})
			.finally(() => setLoading(false));
	}, [refresh]);

	const filteredProducts = useMemo(() => {
		if (!Array.isArray(products)) return [];

		// إذا كانت searchQuery هي "عروض"، اعرض المنتجات المخفضة فقط
		if (searchQuery === "عروض") {
			return products.filter((product) => product.sale === true);
		}

		// إذا كانت searchQuery تطابق إحدى الفئات
		const categoryKeys = productsAndCategories.map((cat) => t(cat.labelKey));
		if (categoryKeys.includes(searchQuery)) {
			return products.filter((product) =>
				product.category?.includes(searchQuery.toLowerCase()),
			);
		}

		// بحث عام
		return products.filter((product) => {
			const productName = product.product_name || "";
			const productPrice = product.price || 0;
			const cartegory = product.category || "";

			return (
				productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(searchQuery && productPrice.toString().includes(searchQuery)) ||
				(searchQuery &&
					cartegory.toLowerCase().includes(searchQuery.toLowerCase()))
			);
		});
	}, [products, searchQuery, t]);

	useEffect(() => {
		if (!observerRef.current || searchQuery) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
					setVisibleCount((prev) => prev + 12);
				}
			},
			{threshold: 0.3},
		);

		observer.observe(observerRef.current);

		return () => {
			if (observer) observer.disconnect();
		};
	}, [filteredProducts.length, visibleCount, searchQuery, loading]);

	useEffect(() => {
		setVisibleProducts(filteredProducts.slice(0, visibleCount));
	}, [filteredProducts, visibleCount]);

	const handleDelete = (product_name: string) => {
		deleteProduct(product_name)
			.then(() => {
				setProducts((p) => p.filter((p) => p.product_name !== product_name));
			})
			.catch((err) => {
				console.error(err);
				showError("שגיאה במחיקת המוצר!");
			});
	};

	if (loading) {
		return (
			<>
				<Typography
					variant='h6'
					sx={{
						color: "white",
						textAlign: "center",
						my: 3,
						fontWeight: "bold",
						textShadow: "0 2px 4px rgba(0,0,0,0.3)",
					}}
				>
					جاري تحميل المنتجات الرائعة...
				</Typography>
				<Loader />
				<motion.div
					initial={{opacity: 0}}
					animate={{opacity: 1}}
					transition={{delay: 0.5}}
				></motion.div>
			</>
		);
	}

	const isAdmin = auth?.role === RoleType.Admin;
	const isModerator = auth?.role === RoleType.Moderator;
	const canEdit = isAdmin || isModerator;

	const diriction = handleRTL();

	if (!loading && products.length === 0)
		return (
			<Box
				component={"main"}
				textAlign={"center"}
				sx={{
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					p: 3,
					background: "linear-gradient(135deg, #f8f9ff 0%, #e8eaf6 100%)",
				}}
			>
				<AnimatePresence>
					<motion.div
						initial={{y: 50, opacity: 0}}
						animate={{y: 0, opacity: 1}}
						transition={{type: "spring", stiffness: 100}}
					>
						<Box>
							<Box sx={{mb: 3}}>
								<Box
									sx={{
										width: 80,
										height: 80,
										borderRadius: "50%",
										background:
											"linear-gradient(135deg, #ff6b6b, #ff8e53)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										margin: "0 auto 20px",
										fontSize: "2.5rem",
										color: "white",
										boxShadow: "0 8px 16px rgba(255,107,107,0.3)",
									}}
								>
									😔
								</Box>
								<Typography
									variant='h4'
									sx={{
										fontWeight: "bold",
										background:
											"linear-gradient(45deg, #ff6b6b 30%, #ff8e53 90%)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										mb: 2,
									}}
								>
									{t("noProducts")}
								</Typography>
								<Typography
									variant='body1'
									sx={{
										mb: 4,
										color: "text.secondary",
										fontSize: "1.1rem",
									}}
								>
									عذراً، لم نتمكن من تحميل المنتجات في الوقت الحالي
								</Typography>
							</Box>
							<motion.div
								whileHover={!isMobile ? {scale: 1.05} : undefined}
								whileTap={{scale: 0.95}}
							>
								<Button
									onClick={refreshAfterCange}
									variant='contained'
									startIcon={
										<motion.span
											animate={{rotate: 360}}
											transition={{
												duration: 1,
												repeat: Infinity,
												ease: "linear",
											}}
										>
											🔄
										</motion.span>
									}
									sx={{
										background:
											"linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)",
										color: "white",
										borderRadius: 3,
										padding: "14px 40px",
										fontWeight: "bold",
										fontSize: "1.1rem",
										textTransform: "none",
										boxShadow: "0 8px 20px rgba(106,17,203,0.4)",
										"&:hover": {
											background:
												"linear-gradient(45deg, #5a0db8 0%, #1c68f0 100%)",
											boxShadow: "0 12px 24px rgba(106,17,203,0.5)",
										},
									}}
								>
									حاول مرة أخرى
								</Button>
							</motion.div>
						</Box>
					</motion.div>
				</AnimatePresence>
			</Box>
		);

	return (
		<>
			<Helmet>
				<title>موقع صفقه</title>
				<meta
					name='description'
					content='تسوق فواكه وخضار طازجة وعروض خاصة مع سوق السخنيني تجربة تسوق مريحة  وبأسعار مناسبة لكل عائله'
				/>
			</Helmet>

			<Box dir={diriction} component='main'>
				{/* Hero Section with Gradient */}
				<Box
					sx={{
						background: "#EFF3F9",
						color: "white",
						py: {xs: 4, md: 6},
						position: "relative",
						overflow: "hidden",
						borderBottom: 1,
						borderColor: "red",
					}}
				>
					{/* Animated Background Elements */}
					<Box
						sx={{
							position: "absolute",
							top: -100,
							right: -100,
							width: 300,
							height: 300,
							borderRadius: "50%",
							background: "rgba(34, 34, 34, 0.1)",
							animation: "float 8s ease-in-out infinite",
						}}
					/>
					<Box
						sx={{
							position: "absolute",
							bottom: -80,
							left: -80,
							width: 250,
							height: 250,
							borderRadius: "50%",
							background: "rgba(255,255,255,0.05)",
							animation: "float 10s ease-in-out infinite",
						}}
					/>

					<Box
						sx={{height: 300}}
						className='container header-image'
						position='relative'
						zIndex={1}
					>
						<motion.div
							initial={{opacity: 0, y: 30}}
							animate={{opacity: 1, y: 0}}
							transition={{duration: 0.8}}
						>
							<Typography
								variant='h2'
								sx={{
									fontWeight: "bold",
									textAlign: "center",

									mb: 2,
									fontSize: {xs: "2rem", md: "3rem"},
									textShadow: "0 4px 8px rgba(0,0,0,0.2)",
									animation: "float 8s ease-in-out infinite",
								}}
							>
								🛒 موقع صـفـقه
							</Typography>
						</motion.div>
					</Box>
				</Box>

				<ChepNavigation />

				{!searchQuery && <DiscountsAndOffers />}

				{/* Search and Filter Section */}
				<Box className='container'>
					<motion.div
						initial={{opacity: 0, y: 20}}
						animate={{opacity: 1, y: 0}}
						transition={{delay: 0.3}}
					>
						<Box
							sx={{
								position: "sticky",
								zIndex: 100,
								top: 64,
								backgroundColor: alpha("#ffffff", 0.95),
								backdropFilter: "blur(10px)",
								py: 3,
								px: {xs: 2, md: 3},
								borderRadius: 3,
								boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
								mb: 4,
								border: "1px solid rgba(255,255,255,0.2)",
							}}
						>
							<motion.div
								whileHover={!isMobile ? {scale: 1.01} : undefined}
								transition={{type: "spring", stiffness: 400}}
							>
								<SearchBox
									searchQuery={searchQuery}
									text='🔍 ابحث عن منتج، سعر، أو تصنيف...'
									setSearchQuery={setSearchQuery}
								/>
							</motion.div>

							{/* Categories Filter Section */}
							<Box sx={{mt: 3}}>
								<Typography
									variant='subtitle1'
									sx={{
										mb: 2,
										color: "text.secondary",
										fontWeight: 600,
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}
								>
									📁 التصنيفات
								</Typography>

								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: 1.5,
										justifyContent: "center",
									}}
								>
									{/* All Products Button */}
									<motion.div
										whileHover={!isMobile ? {scale: 1.05} : undefined}
										whileTap={{scale: 0.95}}
									>
										<Chip
											label='الكل'
											onClick={() => setSearchQuery("")}
											sx={{
												borderRadius: "20px",
												fontSize: "0.95rem",
												fontWeight:
													searchQuery === "" ? "bold" : 500,
												backgroundColor:
													searchQuery === ""
														? "linear-gradient(45deg, #667eea, #764ba2)"
														: "grey.100",
												color:
													searchQuery === ""
														? "white"
														: "text.primary",
												height: 40,
												px: 2,
												cursor: "pointer",
												transition: "all 0.2s ease",
												"&:hover": {
													transform: "translateY(-2px)",
													boxShadow:
														"0 4px 12px rgba(0,0,0,0.1)",
												},
											}}
										/>
									</motion.div>

									{productsAndCategories.map(({labelKey}, index) => {
										const isActive = searchQuery === t(labelKey);
										const colors = [
											"linear-gradient(45deg, #FF6B6B, #FF8E53)",
											"linear-gradient(45deg, #4ECDC4, #44A08D)",
											"linear-gradient(45deg, #FFD166, #FF9E6D)",
											"linear-gradient(45deg, #06D6A0, #0CB48A)",
											"linear-gradient(45deg, #118AB2, #0A6A8A)",
											"linear-gradient(45deg, #EF476F, #D43A5E)",
											"linear-gradient(45deg, #FFD166, #FFC145)",
											"linear-gradient(45deg, #06D6A0, #04B486)",
										];

										return (
											<motion.div
												key={labelKey}
												initial={{opacity: 0, scale: 0.8}}
												animate={{opacity: 1, scale: 1}}
												transition={{delay: index * 0.05}}
												whileHover={
													!isMobile ? {scale: 1.08} : undefined
												}
												whileTap={{scale: 0.95}}
											>
												<Chip
													label={t(labelKey)}
													onClick={() =>
														setSearchQuery(t(labelKey))
													}
													sx={{
														borderRadius: "20px",
														fontSize: "0.95rem",
														fontWeight: isActive
															? "bold"
															: 500,
														background: isActive
															? colors[
																	index % colors.length
																]
															: "grey.100",
														color: isActive
															? "white"
															: "text.primary",
														height: 40,
														px: 2,
														cursor: "pointer",
														transition:
															"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
														position: "relative",
														overflow: "hidden",
														"&:hover": {
															transform: "translateY(-2px)",
															boxShadow:
																"0 6px 16px rgba(0,0,0,0.15)",
														},
														"&::after": isActive
															? {
																	content: '""',
																	position: "absolute",
																	top: 0,
																	left: 0,
																	right: 0,
																	height: 2,
																	background:
																		"rgba(255,255,255,0.8)",
																	animation:
																		"shimmer 2s infinite",
																}
															: {},
													}}
												/>
											</motion.div>
										);
									})}

									{/* Special Offers Button */}
									<motion.div
										whileHover={!isMobile ? {scale: 1.08} : undefined}
										whileTap={{scale: 0.95}}
									>
										<Chip
											label='🔥 عروض اليوم'
											onClick={() => setSearchQuery("عروض")}
											sx={{
												borderRadius: "20px",
												fontSize: "0.95rem",
												fontWeight:
													searchQuery === "عروض" ? "bold" : 600,
												background:
													searchQuery === "عروض"
														? "linear-gradient(45deg, #FFD700, #FFA500)"
														: "linear-gradient(45deg, #fff8e1, #ffe0b2)",
												color:
													searchQuery === "عروض"
														? "#333"
														: "#ff9800",
												height: 40,
												px: 2.5,
												cursor: "pointer",
												transition: "all 0.3s",
												"&:hover": {
													transform: "translateY(-2px)",
													boxShadow:
														"0 8px 20px rgba(255,165,0,0.3)",
												},
												border: "1px solid",
												borderColor:
													searchQuery === "عروض"
														? "transparent"
														: "warning.light",
											}}
										/>
									</motion.div>

									{/* Clear Filter Button */}
									{searchQuery && (
										<motion.div
											initial={{opacity: 0, scale: 0.8}}
											animate={{opacity: 1, scale: 1}}
											exit={{opacity: 0, scale: 0.8}}
											whileHover={
												!isMobile ? {scale: 1.05} : undefined
											}
											whileTap={{scale: 0.95}}
										>
											<Chip
												label='❌ مسح الفلتر'
												onClick={() => setSearchQuery("")}
												sx={{
													borderRadius: "20px",
													fontSize: "0.9rem",
													fontWeight: 500,
													background:
														"linear-gradient(45deg, #36D1DC, #5B86E5)",
													color: "white",
													height: 40,
													px: 2,
													cursor: "pointer",
													transition: "all 0.2s",
													"&:hover": {
														background:
															"linear-gradient(45deg, #2bb8c3, #4a76d6)",
														transform: "translateY(-2px)",
														boxShadow:
															"0 4px 12px rgba(54,209,220,0.3)",
													},
												}}
											/>
										</motion.div>
									)}
								</Box>
							</Box>
						</Box>
					</motion.div>

					{/* Products Grid */}
					<Box className='container pb-5'>
						{/* Results Count */}
						<Box sx={{mb: 3, textAlign: "center"}}>
							<AnimatePresence>
								{searchQuery && (
									<motion.div
										initial={{opacity: 0, y: -20}}
										animate={{opacity: 1, y: 0}}
										exit={{opacity: 0, y: -20}}
									>
										<Typography
											variant='h6'
											sx={{
												color: "primary.main",
												fontWeight: "bold",
												display: "inline-flex",
												alignItems: "center",
												gap: 1,
												p: 2,
												background:
													"linear-gradient(45deg, #f8f9ff, #e8eaf6)",
												borderRadius: 2,
												boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
											}}
										>
											📊
											<span>
												تم العثور على{" "}
												<span style={{color: "#ff6b6b"}}>
													{filteredProducts.length}
												</span>{" "}
												منتج
											</span>
										</Typography>
									</motion.div>
								)}
							</AnimatePresence>
						</Box>

						<Box className='home-row'>
							<AnimatePresence mode='wait'>
								{visibleProducts.length > 0 ? (
									<Row className='mt-3'>
										{visibleProducts.map((product, index) => {
											const discountedPrice = product.sale
												? product.price -
													(product.price *
														(product.discount || 0)) /
														100
												: product.price;

											return (
												<Col
													key={product._id}
													style={{marginBlock: 10}}
													xs={6}
													md={4}
													lg={3}
													xl={2}
												>
													<motion.div
														initial={{opacity: 0, y: 20}}
														animate={{opacity: 1, y: 0}}
														transition={{delay: index * 0.05}}
														whileHover={{
															y: -3,
															transition: {duration: 0.01},
														}}
													>
														<ProductCard
															onToggleLike={(
																productId,
																liked,
															) =>
																handleToggleLike(
																	productId,
																	liked,
																	auth?._id!,
																)
															}
															product={product}
															discountedPrice={
																discountedPrice
															}
															canEdit={canEdit}
															setProductIdToUpdate={
																setProductIdToUpdate
															}
															onShowUpdateProductModal={
																onShowUpdateProductModal
															}
															openDeleteModal={
																openDeleteModal
															}
															setLoadedImages={
																setLoadedImages
															}
															loadedImages={loadedImages}
															category={product.category}
														/>
													</motion.div>
												</Col>
											);
										})}
									</Row>
								) : (
									<motion.div
										key='no-products'
										initial={{opacity: 0, scale: 0.9}}
										animate={{opacity: 1, scale: 1}}
										exit={{opacity: 0, scale: 0.9}}
									>
										<Box
											sx={{
												backgroundColor: "white",
												p: {xs: 3, md: 5},
												width: "90%",
												maxWidth: "600px",
												m: "auto",
												mt: 5,
												textAlign: "center",
												borderRadius: 4,
												boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
												border: "2px solid",
												borderColor: "divider",
												position: "relative",
												overflow: "hidden",
											}}
										>
											<Box
												sx={{
													width: 100,
													height: 100,
													borderRadius: "50%",
													background:
														"linear-gradient(45deg, #667eea, #764ba2)",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													fontSize: "3rem",
													color: "white",
													margin: "0 auto 20px",
													boxShadow:
														"0 10px 20px rgba(102,126,234,0.3)",
												}}
											>
												😔
											</Box>
											<Typography
												variant='h5'
												gutterBottom
												sx={{
													fontWeight: "bold",
													color: "text.primary",
													mb: 2,
												}}
											>
												لم نجد ما تبحث عنه
											</Typography>
											<Typography
												variant='body1'
												color='text.secondary'
												sx={{
													mb: 4,
													fontSize: "1.1rem",
													maxWidth: 400,
													mx: "auto",
												}}
											>
												جرب تصفح إحدى الفئات الشائعة:
											</Typography>
											<Box
												sx={{
													display: "flex",
													flexWrap: "wrap",
													gap: 2,
													justifyContent: "center",
													mb: 3,
												}}
											>
												{productsAndCategories
													.slice(0, 4)
													.map(({labelKey}) => (
														<motion.div
															key={labelKey}
															whileHover={
																!isMobile
																	? {scale: 1.1}
																	: undefined
															}
															whileTap={{scale: 0.9}}
														>
															<Button
																variant='contained'
																size='medium'
																onClick={() =>
																	setSearchQuery(
																		t(labelKey),
																	)
																}
																sx={{
																	borderRadius: 3,
																	background:
																		"linear-gradient(45deg, #36D1DC, #5B86E5)",
																	color: "white",
																	fontWeight: "bold",
																	padding: "10px 20px",
																	textTransform: "none",
																	boxShadow:
																		"0 4px 12px rgba(54,209,220,0.3)",
																	"&:hover": {
																		boxShadow:
																			"0 6px 18px rgba(54,209,220,0.4)",
																	},
																}}
															>
																{t(labelKey)}
															</Button>
														</motion.div>
													))}
											</Box>
											<motion.div
												whileHover={
													!isMobile ? {scale: 1.05} : undefined
												}
												whileTap={{scale: 0.95}}
											>
												<Button
													variant='outlined'
													onClick={() => setSearchQuery("")}
													sx={{
														mt: 2,
														borderRadius: 3,
														borderWidth: 2,
														borderColor: "primary.main",
														color: "primary.main",
														fontWeight: "bold",
														padding: "10px 30px",
														textTransform: "none",
														fontSize: "1rem",
													}}
												>
													👁️ عرض جميع المنتجات
												</Button>
											</motion.div>
										</Box>
									</motion.div>
								)}
							</AnimatePresence>
						</Box>
					</Box>
				</Box>

				{/* Load More Indicator */}
				{visibleCount < filteredProducts.length && (
					<Box
						ref={observerRef}
						sx={{
							height: 120,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
							background:
								"linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
							py: 4,
						}}
					>
						<motion.div
							animate={{
								y: [0, -10, 0],
								scale: [1, 1.1, 1],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							<CircularProgress
								size={50}
								sx={{
									color: "primary.main",
									filter: "drop-shadow(0 0 10px rgba(25,118,210,0.3))",
								}}
							/>
						</motion.div>
						<motion.div
							initial={{opacity: 0}}
							animate={{opacity: 1}}
							transition={{delay: 0.5}}
						>
							<Typography
								variant='body1'
								sx={{
									mt: 3,
									color: "text.secondary",
									fontWeight: 500,
									display: "flex",
									alignItems: "center",
									gap: 1,
								}}
							>
								⏳ جاري تحميل المزيد من المنتجات...
							</Typography>
						</motion.div>
					</Box>
				)}

				{/* Contact CTA Section */}
				<Box
					sx={{
						background: "linear-gradient(135deg, #faf8fc 0%, #ECF0F7 100%)",
						py: 8,
						position: "relative",
						overflow: "hidden",
					}}
				>
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background:
								'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%239C92AC" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")',
							opacity: 0.2,
						}}
					/>

					<Box
						sx={{
							maxWidth: 800,
							mx: "auto",
							px: 2,
							textAlign: "center",
							position: "relative",
							zIndex: 1,
						}}
					>
						<motion.div
							initial={{opacity: 0, y: 30}}
							whileInView={{opacity: 1, y: 0}}
							viewport={{once: true}}
						>
							<Box
								sx={{
									width: 80,
									height: 80,
									borderRadius: "50%",
									background:
										"linear-gradient(45deg, #ffffff, #f0f0f0)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									margin: "0 auto 30px",
									fontSize: "2.5rem",
									boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
								}}
							>
								🤝
							</Box>
							<Typography
								component={"h2"}
								variant='h3'
								gutterBottom
								sx={{
									color: "primary.main",
									fontWeight: "bold",
									textShadow: "0 2px 4px rgba(0,0,0,0.2)",
									mb: 3,
								}}
							>
								نحن هنا لخدمتكم!
							</Typography>
							<Typography
								variant='h6'
								sx={{
									color: "primary.main",
									mb: 4,
									maxWidth: 600,
									mx: "auto",
									lineHeight: 1.7,
									fontWeight: 300,
								}}
							>
								لديك استفسار أو تحتاج مساعدة؟ فريق الدعم لدينا متواجد على
								مدار الساعة لإجابة على جميع أسئلتك وتقديم أفضل تجربة تسوق
								ممكنة
							</Typography>
							<motion.div
								whileHover={!isMobile ? {scale: 1.05} : undefined}
								whileTap={{scale: 0.95}}
							>
								<Button
									variant='contained'
									size='large'
									onClick={() => navigate(path.Contact)}
									startIcon='📞'
									sx={{
										background: "white",
										color: "#6a11cb",
										borderRadius: 3,
										padding: "15px 45px",
										fontWeight: "bold",
										fontSize: "1.2rem",
										textTransform: "none",
										boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
										"&:hover": {
											background: "#f5f5f5",
											boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
										},
									}}
								>
									تواصل معنا الآن
								</Button>
							</motion.div>
						</motion.div>
					</Box>
				</Box>

				{/* Modals */}
				<UpdateProductModal
					refresh={refreshAfterCange}
					productId={productIdToUpdate}
					show={showUpdateProductModal}
					onHide={() => onHideUpdateProductModal()}
				/>
				<AlertDialogs
					show={showDeleteModal}
					onHide={closeDeleteModal}
					title={"⚠️ تنبيه مهم!"}
					description={`هل أنت متأكد من رغبتك في حذف المنتج "${productToDelete}"؟ هذا الإجراء لا يمكن التراجع عنه`}
					handleDelete={() => handleDelete(productToDelete)}
				/>

				{/* Global Animations */}
				<style>{`
					@keyframes float {
						0%, 100% { transform: translateY(0) rotate(0deg); }
						50% { transform: translateY(-20px) rotate(5deg); }
					}
					
					@keyframes shimmer {
						0% { transform: translateX(-100%); }
						100% { transform: translateX(100%); }
					}
				`}</style>
			</Box>
		</>
	);
};

export default Home;
