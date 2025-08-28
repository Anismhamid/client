import {FunctionComponent, useEffect, useMemo, useState} from "react";
import DiscountsAndOffers from "./products/DiscountsAndOffers";
import {useUser} from "../../context/useUSer";
import {deleteProduct, getAllProducts} from "../../services/productsServices";
import {Products} from "../../interfaces/Products";
import {handleAddToCart} from "../../helpers/fruitesFunctions";
import Loader from "../../atoms/loader/Loader";
import {Button, CircularProgress, Chip, Box, Typography} from "@mui/material";
import RoleType from "../../interfaces/UserType";
import {showError} from "../../atoms/toasts/ReactToast";
import UpdateProductModal from "../../atoms/productsManage/UpdateProductModal";
import AlertDialogs from "../../atoms/toasts/Sweetalert";
import {Link, useNavigate} from "react-router-dom";
import {path, productsPathes} from "../../routes/routes";
import SearchBox from "../../atoms/productsManage/SearchBox";
import {Col, Row} from "react-bootstrap";
import {useRef} from "react";
import handleRTL from "../../locales/handleRTL";
import {io} from "socket.io-client";
import ProductCard from "./products/ProductCard";

interface HomeProps {}

/**
 * Home page
 * @returns All products by categories
 */

const Home: FunctionComponent<HomeProps> = () => {
	const [quantities, setQuantities] = useState<{[key: string]: number}>({});
	const [products, setProducts] = useState<Products[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [loadingAddToCart, setLoadingAddToCart] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const {auth, isLoggedIn} = useUser();
	const [visibleProducts, setVisibleProducts] = useState<Products[]>([]);
	const [visibleCount, setVisibleCount] = useState(6);
	const [productNameToUpdate, setProductNameToUpdate] = useState<string>("");
	const [showUpdateProductModal, setOnShowUpdateProductModal] =
		useState<boolean>(false);
	const observerRef = useRef<HTMLDivElement | null>(null);
	const [productToDelete, setProductToDelete] = useState<string>("");
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
	const [refresh, setRefresh] = useState<boolean>(false);
	const navigate = useNavigate();

	const openDeleteModal = (name: string) => {
		setProductToDelete(name);
		setShowDeleteModal(true);
	};
	const closeDeleteModal = () => setShowDeleteModal(false);

	const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
	const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

	const refreshAfterCange = () => setRefresh(!refresh);

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
			return (
				productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(searchQuery && productPrice.toString().includes(searchQuery)) ||
				(searchQuery && productInDiscount.toString().includes(searchQuery))
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

	const handleAdd = async (
		product_name: string,
		quantity: {[key: string]: number},
		price: number,
		product_image: string,
		sale: boolean,
		discount: number,
	) => {
		const productQuantity = quantity[product_name] || 1; // Access the quantity of the specific product
		if (!isLoggedIn) {
			navigate(path.Login);
			return;
		} else {
			setLoadingAddToCart(product_name);
			try {
				await handleAddToCart(
					setQuantities,
					product_name,
					productQuantity || 1,
					price - (price * discount) / 100,
					product_image,
					sale,
					discount,
				);
				setQuantities((prev) => ({...prev, [product_name]: 1}));
			} catch (error) {
				showError("אירעה שגיאה בהוספת מוצר לעגלה");
			} finally {
				setLoadingAddToCart(null);
			}
		}
	};

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
					لم يتم العثور على أي منتجات في المتجر
				</Typography>
				<Button onClick={refreshAfterCange} variant='contained' sx={{mt: 5}}>
					נסה שוב
				</Button>
			</Box>
		);

	return (
		<>
			<title>سوق السخنيني</title>
			<meta
				name='description'
				content='تسوق فواكه وخضار طازجة وعروض خاصة مع Corner Market. تجربة تسوق مريحة وعالية الجودة وبأسعار مناسبة.'
			/>
			<link rel='canonical' href='https://client-qqq1.vercel.app/' />
			{/* Open Graph */}
			<meta property='og:title' content='سوق السخنيني – متجر منتجات طازجة' />
			<meta
				property='og:description'
				content='تسوق فواكه وخضار طازجة وعروض خاصة مع Corner Market.'
			/>
			<meta property='og:image' content='https://client-qqq1.vercel.app/logo.png' />
			<meta property='og:url' content='https://client-qqq1.vercel.app/' />
			<meta name='twitter:card' content='summary_large_image' />
			{/* Structured Data */}
			<script type='application/ld+json'>
				{`
          {
            "@context": "https://schema.org",
            "@type": "Store",
            "name": "سوق السخنيني",
            "url": "https://client-qqq1.vercel.app/",
            "logo": "https://client-qqq1.vercel.app/myLogo2.png",
            "description": "متجر يقدم تشكيلة واسعة من الفواكه والخضار والمنتجات الطازجة.",
            "sameAs": [
              "https://www.facebook.com/shokshknini",
							"https://www.tiktok.com/discover/%D8%B3%D9%88%D9%82-%D8%A7%D9%84%D8%B3%D8%AE%D9%86%D9%8A%D9%86%D9%8A"
            ]
          }
          `}
			</script>

			<Box dir={diriction} component='main'>
				<Box className='logo-img' />
				{/* <Typography variant='h5' my={10} textAlign={"center"}>
					משלוח חינם לכל הרכישות מעל 200 ש"ח. החזרות בתוך 14 יום.
				</Typography> */}
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
					{/* Discounts Section */}
					<Box
						sx={{
							backdropFilter: "blur(10px)",
							width: "100%",
							p: 1,
							border: "1px solid red",
							borderRadius: 3,
							my: 5,
						}}
					>
						<Typography
							sx={{
								textAlign: "center",
								my: 4,
								fontWeight: "bold",
							}}
							component='h1'
							variant='h5'
							gutterBottom
						>
							جميع منتجاتنا مختارة بعناية لنقدم لكم تجربة تسوق مريحة وعالية
							الجودة وبأسعار معقولة. ستجدون هنا تشكيلة واسعة من المنتجات
							الطازجة والموثوقة وبأسعار مميزة. لأي استفسارات حول المنتجات أو
							العروض الترويجية أو كيفية الطلب، تواصلوا معنا! استمتعوا
							بتسوقكم!
						</Typography>
					</Box>

					<Box
						m={1}
						sx={{border: 1, borderRadius: 5, backdropFilter: "blure(10px)"}}
					>
						{products.map((product, i) => (
							<Button
								key={i}
								variant={
									searchQuery === product.product_name
										? "contained"
										: "outlined"
								}
								sx={{
									borderRadius: 5,
									m: 1,
									fontSize: "1rem",
									fontWeight: "bold",
								}}
								onClick={() => {
									setSearchQuery(product.product_name);
								}}
							>
								{product.product_name}
							</Button>
						))}
					</Box>
					<Box className='container pb-5 home-row'>
						<Row className='mt-3' spacing={5}>
							{visibleProducts.length > 0 ? (
								visibleProducts.map((product) => {
									const productQuantity =
										quantities[product.product_name] ?? 1;
									const isOutOfStock = product.quantity_in_stock <= 0;
									const discountedPrice = product.sale
										? product.price -
											(product.price * (product.discount || 0)) /
												100
										: product.price;

									const unitText =
										{
											// spices: "ל/100 גרם",
											fruit: "الكيلو-1",
											vegetable: "الكيلو-1",
											// meat: 'ל/ק"ג',
											// fish: 'ל/ק"ג',
										}[product.category?.toLowerCase()] || "ליחידה";

									return (
										<Col
											key={product.product_name}
											style={{marginBlock: 10, border: 1}}
											xs={6}
											md={4}
											xl={2}
										>
											<ProductCard
												key={product._id}
												product={product}
												productQuantity={productQuantity}
												discountedPrice={discountedPrice}
												unitText={unitText}
												isOutOfStock={isOutOfStock}
												quantities={quantities}
												setQuantities={setQuantities}
												loadingAddToCart={loadingAddToCart}
												canEdit={canEdit}
												setProductNameToUpdate={
													setProductNameToUpdate
												}
												onShowUpdateProductModal={
													onShowUpdateProductModal
												}
												openDeleteModal={openDeleteModal}
												setLoadedImages={setLoadedImages}
												loadedImages={loadedImages}
												handleAdd={handleAdd}
												category={""}
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
												label='اسم المنتج'
												sx={{
													mx: 0.5,
													color: "white",
												}}
											/>
										</Button>
										<Button
											variant='contained'
											sx={{
												borderRadius: 5,
											}}
											onClick={() => {
												console.log(setSearchQuery("2"));
											}}
										>
											<Chip
												label='سعر المنتج'
												sx={{mx: 0.5, color: "white"}}
											/>
										</Button>
										<Button
											variant='contained'
											sx={{
												borderRadius: 5,
											}}
											onClick={() => {
												console.log(setSearchQuery("عروض"));
											}}
										>
											<Chip
												label='عروض'
												sx={{mx: 0.5, color: "white"}}
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
					product_name={productNameToUpdate}
					show={showUpdateProductModal}
					onHide={() => onHideUpdateProductModal()}
				/>
				<AlertDialogs
					show={showDeleteModal}
					onHide={closeDeleteModal}
					title={"אתה עומד למחוק מוצר מהחנות"}
					description={`האם אתה בטוח שברצונך למחוק את המוצר ( ${productToDelete} ) ? פעולה זו לא ניתנת לביטול`}
					handleDelete={() => handleDelete(productToDelete)}
				/>
			</Box>
		</>
	);
};

export default Home;
