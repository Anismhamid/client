import {FunctionComponent, useEffect, useMemo, useState} from "react";
import DiscountsAndOffers from "./products/DiscountsAndOffers";
import {useUser} from "../../context/useUSer";
import {deletePost, getAllPosts} from "../../services/postsServices";
import Loader from "../../atoms/loader/Loader";
import {
	Button,
	CircularProgress,
	Box,
	Typography,
	useMediaQuery,
	Alert,
	Grid,
	Container,
} from "@mui/material";
import RoleType from "../../interfaces/UserType";
import {showError} from "../../atoms/toasts/ReactToast";
import UpdateProductModal from "../../atoms/productsManage/addAndUpdateProduct/UpdatePostModal";
import AlertDialogs from "../../atoms/toasts/Sweetalert";
import {useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";
import SearchBox from "../../atoms/productsManage/SearchBox";
import {useRef} from "react";
import handleRTL from "../../locales/handleRTL";
import {useTranslation} from "react-i18next";
import {productsAndCategories} from "../navbar/navCategoryies";
import {motion, AnimatePresence} from "framer-motion";
import ChepNavigation from "../navbar/ChepNavigation";
import AddProductModal from "../../atoms/productsManage/addAndUpdateProduct/CreatePostModal";
import PostCard from "./products/PostsCard";
import { Posts } from "../../interfaces/Posts";


/**
 * Home page
 * @returns All products and categories
 */

const Home: FunctionComponent = () => {
	const {auth} = useUser();
	const {t} = useTranslation();
	const [posts, setPosts] = useState<Posts[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const [visibleProducts, setVisibleProducts] = useState<Posts[]>([]);
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
	const isMobile = useMediaQuery("(max-width:768px)");
	const [onShowAddModal, setOnShowAddModal] = useState<boolean>(false);

	const showAddProductModal = () => setOnShowAddModal(true);
	const hideAddProductModal = () => setOnShowAddModal(false);

	const openDeleteModal = (name: string) => {
		setProductToDelete(name);
		setShowDeleteModal(true);
	};
	const closeDeleteModal = () => setShowDeleteModal(false);

	const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
	const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

	const refreshAfterCange = () => setRefresh(!refresh);

	const handleToggleLike = (productId: string, liked: boolean) => {
		if (!auth?._id) return;

		const userId = auth._id;

		setPosts((prev) =>
			prev.map((p) =>
				p._id === productId
					? {
							...p,
							likes: liked
								? [...(p.likes || []), userId]
								: (p.likes || []).filter((id:string) => id !== userId),
						}
					: p,
			),
		);

		setVisibleProducts((prev) =>
			prev.map((p) =>
				p._id === productId
					? {
							...p,
							likes: liked
								? [...(p.likes || []), userId]
								: (p.likes || []).filter((id:string) => id !== userId),
						}
					: p,
			),
		);
	};

	useEffect(() => {
		getAllPosts()
			.then((products) => {
				const safeProducts = Array.isArray(products) ? products : [];
				setPosts(safeProducts);
				setVisibleProducts(safeProducts.slice(0, 16));
				window.scrollTo(0, 0);
			})
			.catch(() => {
				setPosts([]);
				setVisibleProducts([]);
			})
			.finally(() => setLoading(false));
	}, [refresh]);

	const filteredProducts = useMemo(() => {
		if (!Array.isArray(posts)) return [];

		// إذا كانت searchQuery هي "عروض"، اعرض المنتجات المخفضة فقط
		if (searchQuery === "عروض") {
			return posts.filter((product) => product.sale === true);
		}

		// إذا كانت searchQuery تطابق إحدى الفئات
		const categoryKeys = productsAndCategories.map((cat) => t(cat.labelKey));
		if (categoryKeys.includes(searchQuery)) {
			return posts.filter((product) =>
				product.category?.includes(searchQuery.toLowerCase()),
			);
		}

		// بحث عام
		return posts.filter((product) => {
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
	}, [posts, searchQuery, t]);

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
		deletePost(product_name)
			.then(() => {
				setPosts((p) => p.filter((p) => p.product_name !== product_name));
			})
			.catch((err) => {
				console.error(err);
				showError("שגיאה במחיקת המוצר!");
			});
	};

	if (loading) return <Loader />;

	const isAdmin = auth?.role === RoleType.Admin;
	const isModerator = auth?.role === RoleType.Moderator;
	const canEdit = isAdmin || isModerator;
	const currentUrl = `https://client-qqq1.vercel.app/`;

	const diriction = handleRTL();

	return (
		<>
			<title>
				{t("home")} | {t("webPageName")}
			</title>
			<meta
				name='description'
				content={
					"تسوق جميع المنتجات وعروض خاصة مع موقع صفقه تجربة تسوق مريحة مناسبة"
				}
			/>
			<link rel='canonical' href={currentUrl} />

			<Box
				className='container-fluid'
				sx={{
					py: {xs: 4, md: 6},
					position: "relative",
					overflow: "hidden",
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
						background: "linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%)",
						animation: "float 8s ease-in-out infinite",
						border: 1,
						borderColor: "rgba(0,0,0,0.05)",
						opacity: 0.8,
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
						background: "linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%)",
						animation: "float 10s ease-in-out infinite 1s",
						opacity: 0.8,
					}}
				/>

				<Box
					sx={{
						position: "relative",
						zIndex: 1,
						textAlign: "center",
						px: 2,
						width: "100%",
						maxWidth: "100%",
						margin: "0 auto",
					}}
				>
					<motion.div
						initial={{opacity: 0, y: 30}}
						animate={{opacity: 1, y: 0}}
						transition={{duration: 0.8}}
					>
						<Typography
							variant='h1'
							sx={{
								fontWeight: 800,
								mb: 3,
								fontSize: {xs: "2.5rem", sm: "3rem", md: "3.75rem"},
								textShadow: "0 4px 8px rgba(0,0,0,0.1)",
								animation: "float 8s ease-in-out infinite 0.5s",
								color: "#1a237e",
								direction: {diriction},
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: 1,
							}}
						>
							<span style={{fontSize: "1.2em"}}>🛒</span>
							<span>{t("webPageName")}</span>
						</Typography>

						<Typography
							variant='h5'
							sx={{
								mb: 4,
								color: "text.secondary",
								maxWidth: "600px",
								margin: "0 auto",
								fontSize: {xs: "1rem", sm: "1.25rem", md: "1.5rem"},
							}}
						>
							{t("bestOffers")}
						</Typography>
					</motion.div>

					{/* Buttons Section - Improved */}
					<Box
						sx={{
							display: "flex",
							gap: 2,
							justifyContent: "center",
							flexWrap: "wrap",
							mt: 4,
						}}
					>
						<Button
							variant='contained'
							size='large'
							sx={{
								px: 4,
								py: 1.5,
								borderRadius: 2,
								fontSize: "1.1rem",
								"&:hover": {
									borderWidth: 2,
									background:
										"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
								},

								minWidth: "150px",
							}}
						>
							{t("browse-posts")}
						</Button>
						<Button
							onClick={showAddProductModal}
							variant='contained'
							size='large'
							sx={{
								px: 4,
								py: 1.5,
								borderRadius: 2,
								fontSize: "1.1rem",
								borderWidth: 2,
								"&:hover": {
									borderWidth: 2,
									background:
										"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
								},
								minWidth: "150px",
							}}
						>
							{t("create-post")}
						</Button>
					</Box>
				</Box>
			</Box>
			<ChepNavigation />

			<Box dir={diriction} component='main'>
				{/* Hero Section with Gradient */}
				<Alert
					component='section'
					role='region'
					aria-labelledby='products-search-info'
					sx={{
						textAlign: "center",
						mt: 3,
						p: 3,
						borderRadius: 3,
					}}
					variant='standard'
					color='warning'
				>
					<Typography
						id='products-search-info'
						component='h2'
						variant='h6'
						fontWeight='bold'
						gutterBottom
					>
						ابحث عن أي منتج بسهولة
					</Typography>

					<Typography component='p' variant='body2'>
						اكتب اسم المنتج الذي تبحث عنه، ودعنا نعرض لك أفضل العروض المتوفرة
						من مستخدمين على موقع صفقة.
					</Typography>
				</Alert>
				{!searchQuery && <DiscountsAndOffers />}
				{/* Search and Filter Section */}
				<SearchBox
					searchQuery={searchQuery}
					text={t("search")}
					setSearchQuery={setSearchQuery}
				/>

				<main >
					{/* Products Grid */}
					<Box>
						{/* Results Count */}
						<Box sx={{mb: 3, textAlign: "center"}}>
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
											{t("was-found")}
											<span
												style={{
													color: "#ff6b6b",
													marginInline: 4,
												}}
											>
												{filteredProducts.length}
											</span>
											{t("product")}
										</span>
									</Typography>
								</motion.div>
							)}
						</Box>

						<Container>
							<AnimatePresence mode='wait'>
								{visibleProducts.length > 0 ? (
									<Grid container spacing={1} sx={{px: {xs: 1, md: 2}}}>
										{visibleProducts.map((product) => {
											const discountedPrice = product.sale
												? product.price -
													(product.price *
														(product.discount || 0)) /
														100
												: product.price;

											return (
												<Grid
													size={{xs: 12, md: 4, lg: 3}}
													key={product._id}
												>
													<motion.div
														initial={{opacity: 0, y: 20}}
														animate={{opacity: 1, y: 0}}
														transition={{duration: 0.3}}
														whileHover={{
															y: -3,
															transition: {duration: 0.01},
														}}
													>
														<PostCard
															post={product}
															discountedPrice={
																discountedPrice
															}
															canEdit={canEdit}
															setPostIdToUpdate={
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
															onLikeToggle={
																handleToggleLike
															}
														/>
													</motion.div>
												</Grid>
											);
										})}
									</Grid>
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
												width: "100%",
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
						</Container>
					</Box>
				</main>

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
								جاري تحميل المزيد من المنشورات...
							</Typography>
						</motion.div>
					</Box>
				)}

				{/* Contact CTA Section */}
				<Box
					sx={{
						// background: "linear-gradient(135deg, #faf8fc 0%, #ECF0F7 100%)",
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
									// background:
									// 	"linear-gradient(45deg, #ffffff, #f0f0f0)",
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
					postId={productIdToUpdate}
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
			<AddProductModal show={onShowAddModal} onHide={hideAddProductModal} />
		</>
	);
};

export default Home;
