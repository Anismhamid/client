import {
	FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {deleteProduct, getProductsByCategory} from "../../../services/postsServices";
import {Products} from "../../../interfaces/Posts";
import {useUser} from "../../../context/useUSer";
import Loader from "../../../atoms/loader/Loader";
import UpdateProductModal from "../../../atoms/productsManage/addAndUpdateProduct/UpdatePostModal";
import {showError} from "../../../atoms/toasts/ReactToast";
import RoleType from "../../../interfaces/UserType";
import {Box, Button, Container, Grid, Typography, useTheme, alpha} from "@mui/material";
import AlertDialogs from "../../../atoms/toasts/Sweetalert";
import {useTranslation} from "react-i18next";
// import socket from "../../../socket/globalSocket";
import ProductCard from "./PostsCard";
import {generateCategoryJsonLd} from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";
import {useNavigate} from "react-router-dom";
import {path} from "../../../routes/routes";
import SearchBox from "../../../atoms/productsManage/SearchBox";

interface PostsCategoryProps {
	category: string;
}

const PostsCategory: FunctionComponent<PostsCategoryProps> = ({
	category,
}: PostsCategoryProps) => {
	const [productIdToUpdate, setProductIdToUpdate] = useState<string>("");
	const [visibleProducts, setVisibleProducts] = useState<Products[]>([]);
	const [products, setProducts] = useState<Products[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const {auth} = useUser();
	const [showUpdateProductModal, setOnShowUpdateProductModal] =
		useState<boolean>(false);
	const [productToDelete, setProductToDelete] = useState<string>("");
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [refresh, setRefresh] = useState<boolean>(false);
	const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
	const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	const {t} = useTranslation();
	const theme = useTheme();

	// Update product
	const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
	const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

	const refreshAfterChange = () => setRefresh(!refresh);

	// DeleteModal
	const openDeleteModal = (productId: string) => {
		setProductToDelete(productId);
		setShowDeleteModal(true);
	};

	const closeDeleteModal = () => setShowDeleteModal(false);

	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			const productName = product.product_name || "";
			const productDescription = product.description || "";
			const productBrand = product.brand || "";
			const productPrice = product.price?.toString() || "";

			const searchLower = searchQuery.toLowerCase();

			return (
				productName.toLowerCase().includes(searchLower) ||
				productDescription.toLowerCase().includes(searchLower) ||
				productBrand.toLowerCase().includes(searchLower) ||
				productPrice.includes(searchQuery)
			);
		});
	}, [products, searchQuery]);

	// Infinite scroll with better UX
	const handleShowMore = useCallback(() => {
		if (isLoadingMore || visibleProducts.length >= filteredProducts.length) return;

		setIsLoadingMore(true);

		// Simulate loading delay for better UX
		setTimeout(() => {
			const nextVisibleCount = Math.min(
				visibleProducts.length + 12,
				filteredProducts.length,
			);
			const newVisibleProducts = filteredProducts.slice(0, nextVisibleCount);
			setVisibleProducts(newVisibleProducts);
			setIsLoadingMore(false);
		}, 300);
	}, [isLoadingMore, visibleProducts.length, filteredProducts]);

	// Setup intersection observer
	useEffect(() => {
		if (!loadMoreRef.current || visibleProducts.length >= filteredProducts.length)
			return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isLoadingMore) {
					handleShowMore();
				}
			},
			{
				rootMargin: "200px",
				threshold: 0.1,
			},
		);

		observer.observe(loadMoreRef.current);

		return () => {
			if (observer) observer.disconnect();
		};
	}, [handleShowMore, isLoadingMore, visibleProducts.length, filteredProducts.length]);

	const navigate = useNavigate();

	const handleToggleLike = (productId: string, liked: boolean) => {
		if (!auth?._id) {
			navigate(path.Login);
			return;
		}

		const userId = auth._id;

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

		setVisibleProducts((prev) =>
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

	// Delete product
	const handleDelete = (productId: string) => {
		deleteProduct(productId)
			.then(() => {
				setProducts((prevProducts) =>
					prevProducts.filter((p) => p._id !== productId),
				);
				setVisibleProducts((prev) => prev.filter((p) => p._id !== productId));
				// refreshAfterChange();
			})
			.catch((err) => {
				console.error(err);
				showError("خطأ في حذف المنتج");
			});
	};

	// Fetch products by category
	useEffect(() => {
		setLoading(true);
		getProductsByCategory(category)
			.then((res) => {
				setProducts(res);
				setVisibleProducts(res.slice(0, 12)); // Start with 12 products
			})
			.catch((err) => {
				console.error(err);
				showError("حدث خطأ في تحميل المنتجات");
			})
			.finally(() => setLoading(false));
	}, [category]);

	const isAdmin = auth?.role === RoleType.Admin;
	const isModerator = auth?.role === RoleType.Moderator;
	const canEdit = isAdmin || isModerator;

	if (loading) {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Loader />
			</Box>
		);
	}

	if (!loading && products.length === 0)
		return (
			<main>
				<Container maxWidth='lg' sx={{textAlign: "center"}}>
					<Typography variant='h5' color='text.secondary' sx={{mb: 3}}>
						لم يتم العثور على أي منتجات في هذه الفئة
					</Typography>
					<Button
						onClick={refreshAfterChange}
						variant='contained'
						size='large'
						sx={{
							bgcolor: theme.palette.primary.main,
							"&:hover": {
								bgcolor: theme.palette.primary.dark,
							},
						}}
					>
						تحديث الصفحة
					</Button>
				</Container>
			</main>
		);

	const generateCategory = generateCategoryJsonLd(category, products);
	const currentUrl = `https://client-qqq1.vercel.app/category/${category}`;

	return (
		<>
			<JsonLd data={generateCategory} />
			<title>{t(`categories.${category}.heading`)} | صفقة</title>
			<link rel='canonical' href={currentUrl} />
			<meta name='description' content={t(`categories.${category}.description`)} />

			{/* Sticky Search Bar */}

			<Box
				sx={{
					position: "static",
					zIndex: 2,
					px: "auto",
					borderBottom: "1px solid #2C3646",
				}}
			>
				<Box sx={{flex: 1}}>
					<SearchBox
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						text={t("")}
					/>
				</Box>
				<Container maxWidth='lg'>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 2,
						}}
					>
						<Typography
							variant='h6'
							sx={{
								color: theme.palette.primary.main,
								fontWeight: 600,
								display: {xs: "none", md: "block"},
							}}
						>
							{t(`categories.${category}.heading`)}
						</Typography>
					</Box>
				</Container>
			</Box>
			<Box component='main'>
				<Container maxWidth='lg'>
					{/* Results Count */}
					<Typography
						variant='body2'
						color='text.secondary'
						sx={{mb: 3, px: {xs: 2, md: 0}}}
					>
						{t("common.viewOf")} {visibleProducts.length} {t("common.outOf")}{" "}
						{filteredProducts.length} {t("common.countOfPosts")}
					</Typography>

					{/* Products Grid */}
					{filteredProducts.length > 0 ? (
						<Grid container spacing={2}>
							{visibleProducts.map((product: Products) => {
								const discountedPrice = product.sale
									? product.price -
										(product.price * (product.discount || 0)) / 100
									: product.price;

								return (
									<Grid
										size={{xs: 12, sm: 4, lg: 3}}
										key={product._id}
										sx={{
											display: "flex",
											justifyContent: "center",
										}}
									>
										<Box ref={observerRef}>
											<ProductCard
												product={product}
												discountedPrice={discountedPrice}
												canEdit={canEdit}
												setProductIdToUpdate={
													setProductIdToUpdate
												}
												onShowUpdateProductModal={
													onShowUpdateProductModal
												}
												openDeleteModal={openDeleteModal}
												setLoadedImages={setLoadedImages}
												loadedImages={loadedImages}
												category={category}
												onLikeToggle={handleToggleLike}
												updateProductInList={(updatedProduct) => {
													setProducts((prev) =>
														prev.map((p) =>
															p._id === updatedProduct._id
																? updatedProduct
																: p,
														),
													);
													setVisibleProducts((prev) =>
														prev.map((p) =>
															p._id === updatedProduct._id
																? updatedProduct
																: p,
														),
													);
												}}
											/>
										</Box>
									</Grid>
								);
							})}
						</Grid>
					) : (
						<Box
							sx={{
								bgcolor: "#fff",
								p: 5,
								textAlign: "center",
								borderRadius: 3,
								border: "1px solid #e4e6eb",
								mt: 3,
							}}
						>
							<Typography variant='h6' color='primary.main' sx={{mb: 2}}>
								لم يتم العثور على منتجات مطابقة لمعايير البحث
							</Typography>
							<Typography variant='body2' color='primary.main'>
								حاول البحث باستخدام كلمات أخرى
							</Typography>
						</Box>
					)}

					{/* Load More Area */}
					{visibleProducts.length < filteredProducts.length && (
						<Box
							ref={loadMoreRef}
							sx={{
								py: 4,
								textAlign: "center",
							}}
						>
							{isLoadingMore ? (
								<Box sx={{display: "flex", justifyContent: "center"}}>
									<Loader />
								</Box>
							) : (
								<Button
									variant='outlined'
									onClick={handleShowMore}
									sx={{
										px: 4,
										py: 1.5,
										borderRadius: 2,
										borderColor: theme.palette.primary.main,
										color: theme.palette.primary.main,
										"&:hover": {
											bgcolor: alpha(
												theme.palette.primary.main,
												0.04,
											),
											borderColor: theme.palette.primary.dark,
										},
									}}
								>
									تحميل المزيد
								</Button>
							)}
						</Box>
					)}

					{/* End of Results */}
					{visibleProducts.length === filteredProducts.length &&
						filteredProducts.length > 0 && (
							<Box sx={{py: 4, textAlign: "center"}}>
								<Typography variant='body2' color='text.secondary'>
									🎉 {t("common.endOfPosts")}
								</Typography>
							</Box>
						)}
				</Container>

				<UpdateProductModal
					refresh={refreshAfterChange}
					productId={productIdToUpdate}
					show={showUpdateProductModal}
					onHide={() => onHideUpdateProductModal()}
				/>

				<AlertDialogs
					show={showDeleteModal}
					onHide={closeDeleteModal}
					handleDelete={() => handleDelete(productToDelete)}
					title={"حذف المنتج"}
					description={`هل أنت متأكد أنك تريد حذف "${productToDelete}"؟ لا يمكن التراجع عن هذا الإجراء.`}
				/>
			</Box>
		</>
	);
};

export default PostsCategory;
