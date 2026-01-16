import {FunctionComponent, useEffect, useMemo, useState} from "react";
import DiscountsAndOffers from "./products/DiscountsAndOffers";
import {useUser} from "../../context/useUSer";
import {deleteProduct, getAllProducts} from "../../services/productsServices";
import {Products} from "../../interfaces/Products";
import Loader from "../../atoms/loader/Loader";
import {Button, CircularProgress, Chip, Box, Typography} from "@mui/material";
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
import {io} from "socket.io-client";
import ProductCard from "./products/ProductCard";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";
import {productCategories} from "../navbar/navCategoryies";

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
	const [visibleCount, setVisibleCount] = useState(6);
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
		return products.filter((product) => {
			const productName = product.product_name || "";
			const productPrice = product.price || 0;
			const productInDiscount = product.sale ? "عروض" : "";
			const cartegory = product.category;
			return (
				productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(searchQuery && productPrice.toString().includes(searchQuery)) ||
				(searchQuery && productInDiscount.toString().includes(searchQuery)) ||
				(searchQuery && cartegory.includes(searchQuery))
			);
		});
	}, [products, searchQuery]);

	useEffect(() => {
		if (!observerRef.current || searchQuery) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
					setVisibleCount((prev) => prev + 6);
				}
			},
			{threshold: 1},
		);

		observer.observe(observerRef.current);

		return () => {
			if (observer) observer.disconnect();
		};
	}, [filteredProducts.length, visibleCount, searchQuery, loading]);

	useEffect(() => {
		setVisibleProducts(filteredProducts.slice(0, visibleCount));
	}, [filteredProducts, visibleCount]);

	// quantities in stock updates when the order is created
	useEffect(() => {
		const socket = io(import.meta.env.VITE_API_SOCKET_URL);

		socket.on("product:quantity_in_stock", (newProduct: Products) => {
			setProducts((prev) => {
				const exists = prev.some(
					(p) => p.product_name === newProduct.product_name,
				);
				if (exists) {
					return prev.map((p) =>
						p.product_name === newProduct.product_name ? newProduct : p,
					);
				}
				return [newProduct, ...prev];
			});

			setVisibleProducts((prev) => {
				const exists = prev.some(
					(p) => p.product_name === newProduct.product_name,
				);
				if (exists) {
					return prev.map((p) =>
						p.product_name === newProduct.product_name ? newProduct : p,
					);
				}
				return [newProduct, ...prev];
			});
		});

		// Cleaning the listenr
		return () => {
			socket.off("product:quantity_in_stock");
			socket.disconnect();
		};
	}, []);

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
		return <Loader />;
	}

	const isAdmin = auth?.role === RoleType.Admin;
	const isModerator = auth?.role === RoleType.Moderator;
	const canEdit = isAdmin || isModerator;

	const diriction = handleRTL();

	if (!loading && products.length === 0)
		return (
			<Box component={"main"} textAlign={"center"}>
				<Typography textAlign={"center"} variant='h6' color='error'>
					{t("noProducts")}
				</Typography>
				<Button onClick={refreshAfterCange} variant='contained' sx={{mt: 5}}>
					حاول ثانية
				</Button>
			</Box>
		);

	return (
		<>
			<Helmet>
				<title>بيع وشراء</title>
				<meta
					name='description'
					content='تسوق فواكه وخضار طازجة وعروض خاصة مع سوق السخنيني تجربة تسوق مريحة وعالية الجودة وبأسعار مناسبة لكل عائله'
				/>
			</Helmet>

			<Box dir={diriction} component='main'>
				{!searchQuery && <DiscountsAndOffers />}
				{/* Search and filter products */}
				<Box className='container'>
					<Box
						sx={{
							position: "sticky",
							zIndex: 1,
							top: 60,
						}}
					>
						<SearchBox
							searchQuery={searchQuery}
							text='ابحث عن منتج أو سعر أو عروض...'
							setSearchQuery={setSearchQuery}
						/>
					</Box>

					{/* ازرار التصفيه */}
					{productCategories.map(({labelKey}) => (
						<Box
							key={labelKey}
							sx={{
								borderRadius: 5,
								m: 1,
								fontSize: "1rem",
								fontWeight: "bold",
								color:
									searchQuery === t(labelKey)
										? "error.main"
										: "primary.main",
								textDecoration: "none",
								padding: "4px 8px",
								display: "inline-block",
								cursor: "pointer",

								"&.active": {
									color: "error.main",
								},
							}}
							onClick={() => setSearchQuery(t(labelKey))}
						>
							{t(labelKey)}
						</Box>
					))}
					<Box
						key={"عروض"}
						sx={{
							borderRadius: 5,
							m: 1,
							fontSize: "1rem",
							fontWeight: "bold",
							color: searchQuery === "عروض" ? "error.main" : "primary.main",
							textDecoration: "none",
							padding: "4px 8px",
							display: "inline-block",
							cursor: "pointer",

							"&.active": {
								color: "error.main",
							},
						}}
						onClick={() => setSearchQuery("عروض")}
					>
						عروض اليوم
					</Box>

					<Box className='container pb-5 home-row'>
						<Row className='mt-3' spacing={5}>
							{visibleProducts.length > 0 ? (
								visibleProducts.map((product) => {
									const discountedPrice = product.sale
										? product.price -
											(product.price * (product.discount || 0)) /
												100
										: product.price;

									return (
										<Col
											key={product.product_name}
											style={{marginBlock: 10, border: 1}}
											xs={6}
											md={4}
											xl={2}
										>
											<ProductCard
												onToggleLike={(productId, liked) =>
													handleToggleLike(
														productId,
														liked,
														auth?._id!,
													)
												}
												key={product._id}
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
												category={product.category}
											/>
										</Col>
									);
								})
							) : (
								<Box
									sx={{
										backgroundColor: "white",
										p: 5,
										width: "80%",

										m: "auto",
										mt: 5,
										textAlign: "center",
										borderRadius: 5,
										border: "1px solid red",
									}}
								>
									<Typography
										color='primary.main'
										component='h1'
										variant='body1'
									>
										لم يتم العثور على منتجات مطابقة. حاول البحث
										باستخدام:
									</Typography>
									<Box m={1}>
										<Button
											variant='contained'
											sx={{
												borderRadius: 5,
											}}
											onClick={() => {
												setSearchQuery("عنب");
											}}
										>
											<Chip
												label='عنب'
												sx={{
													color: "white",
												}}
											/>
										</Button>
										<Button
											variant='contained'
											sx={{
												borderRadius: 5,
												m: 1,
											}}
											onClick={() => {
												console.log(setSearchQuery("2"));
											}}
										>
											<Chip
												label='سعر المنتج'
												sx={{color: "white"}}
											/>
										</Button>
										<Button
											variant='contained'
											sx={{
												borderRadius: 5,
											}}
											onClick={() => {
												setSearchQuery("عروض");
											}}
										>
											<Chip
												label='عروض'
												color='default'
												variant='outlined'
											/>
										</Button>
									</Box>
								</Box>
							)}
						</Row>
					</Box>
				</Box>
				{visibleCount < filteredProducts.length && (
					<Box
						ref={observerRef}
						sx={{
							height: 40,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<CircularProgress size={24} aria-busy={"true"} />
					</Box>
				)}
				<Box sx={{bgcolor: "background.paper", py: 6}}>
					<Box sx={{maxWidth: 800, mx: "auto", px: 2, textAlign: "center"}}>
						<Typography component={"h2"} variant='h4' gutterBottom>
							نحن هنا لخدمتكم!
						</Typography>
						<Typography variant='body1'>
							إذا كانت لديك أي أسئلة حول منتجاتنا أو عروضنا الترويجية أو
							كيفية تقديم طلب، فلا تتردد في التواصل معنا! فريق خدمة العملاء
							لدينا متاح على مدار الساعة طوال أيام الأسبوع لمساعدتك
						</Typography>
						<Button
							variant='contained'
							size='large'
							onClick={() => navigate(path.Contact)}
							sx={{mt: 2}}
						>
							اتصل بنا
						</Button>
					</Box>
				</Box>
				<UpdateProductModal
					refresh={refreshAfterCange}
					productId={productIdToUpdate}
					show={showUpdateProductModal}
					onHide={() => onHideUpdateProductModal()}
				/>
				<AlertDialogs
					show={showDeleteModal}
					onHide={closeDeleteModal}
					title={"أنت على وشك حذف منتج من المتجر"}
					description={`هل أنت متأكد من أنك تريد حذف المنتج ( ${productToDelete} )؟ لا يمكن التراجع عن هذا الإجراء`}
					handleDelete={() => handleDelete(productToDelete)}
				/>
			</Box>
		</>
	);
};

export default Home;
