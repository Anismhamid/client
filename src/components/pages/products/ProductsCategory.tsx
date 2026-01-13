import {
	FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {deleteProduct, getProductsByCategory} from "../../../services/productsServices"; // פונקציה כללית שמביאה מוצרים לפי קטגוריה
import {Products} from "../../../interfaces/Products";
import {handleAddToCart} from "../../../helpers/fruitesFunctions";
import {useUser} from "../../../context/useUSer";
import Loader from "../../../atoms/loader/Loader";
import UpdateProductModal from "../../../atoms/productsManage/UpdateProductModal";
import {showError} from "../../../atoms/toasts/ReactToast";
import RoleType from "../../../interfaces/UserType";
import {useCartItems} from "../../../context/useCart";
import {Box, Chip, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import AlertDialogs from "../../../atoms/toasts/Sweetalert";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {path} from "../../../routes/routes";
import {Col, Row} from "react-bootstrap";
import SearchBox from "../../../atoms/productsManage/SearchBox";
import socket from "../../../socket/globalSocket";
import ProductCard from "./ProductCard";
import {generateCategoryJsonLd} from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";
import {Helmet} from "react-helmet";

interface ProductCategoryProps {
	category: string;
}
/**
 * Categorys product by category
 * @param {category}
 * @returns products by categoties
 */
const ProductCategory: FunctionComponent<ProductCategoryProps> = ({
	category,
}: ProductCategoryProps) => {
	const [productNameToUpdate, setProductNameToUpdate] = useState<string>("");
	const [visibleProducts, setVisibleProducts] = useState<Products[]>([]); // To hold the visible products
	const [products, setProducts] = useState<Products[]>([]);
	const [quantities, setQuantities] = useState<{[key: string]: number}>({});
	const [loading, setLoading] = useState<boolean>(true);
	const {auth, isLoggedIn} = useUser();
	const [showUpdateProductModal, setOnShowUpdateProductModal] =
		useState<boolean>(false);
	const [productToDelete, setProductToDelete] = useState<string>("");
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [loadingAddToCart, setLoadingAddToCart] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [refresh, setRefresh] = useState<boolean>(false);
	const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
	const observerRef = useRef<IntersectionObserver | null>(null);

	const {t} = useTranslation();

	// Update product
	const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
	const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

	const refreshAfterCange = () => setRefresh(!refresh);
	const navigate = useNavigate();

	// DeleteModal
	const openDeleteModal = (name: string) => {
		setProductToDelete(name);
		setShowDeleteModal(true);
	};
	const closeDeleteModal = () => setShowDeleteModal(false);

	// load products automatic
	const handleShowMore = () => {
		const nextVisibleCount = visibleProducts.length + 16;
		const newVisibleProducts = products.slice(0, nextVisibleCount);
		setVisibleProducts(newVisibleProducts);
	};
	const lastProductRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (loading) return;

			if (observerRef.current) observerRef.current.disconnect();

			observerRef.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					handleShowMore();
				}
			});

			if (node) observerRef.current.observe(node);
		},
		[loading, products, visibleProducts],
	);

	const {setQuantity} = useCartItems();

	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			const productName = product.product_name || "";
			const productPrice = product.price || "";
			const productInDiscount = product.sale ? "عروض" : "";

			return (
				productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(searchQuery && productPrice.toString().includes(searchQuery)) ||
				(searchQuery && productInDiscount.toString().includes(searchQuery))
			);
		});
	}, [products, searchQuery]);

	// add product to cart
	const handleAdd = useCallback(
		(
			product_name: string,
			quantity: {[key: string]: number},
			price: number,
			product_image: string,
			sale: boolean,
			discount: number,
		) => {
			const productQuantity = quantity[product_name];

			if (!isLoggedIn) {
				navigate(path.Login);
			} else {
				setLoadingAddToCart(product_name);
				handleAddToCart(
					setQuantities,
					product_name,
					productQuantity || 1,
					price - (price * discount) / 100,
					product_image,
					sale,
					discount,
				).then(() => {
					setQuantity((prev) => prev + (productQuantity ?? 1));
					setLoadingAddToCart(null);
				});
			}
		},
		[isLoggedIn, navigate, setQuantities, setQuantity],
	);

	// Delete product
	const handleDelete = (product_name: string) => {
		deleteProduct(product_name)
			.then(() => {
				setProducts((prevProducts) =>
					prevProducts.filter((p) => p.product_name !== product_name),
				);
				refreshAfterCange();
			})
			.catch((err) => {
				console.error(err);
				showError("خطأ في حذف المنتج");
			});
	};

	// get the products by category
	useEffect(() => {
		getProductsByCategory(category)
			.then((res) => {
				setProducts(res);
				setVisibleProducts(res.slice(0, 16));

				const initialQuantities = res.reduce(
					(acc: any, product: {product_name: string}) => {
						acc[product.product_name] = 1;
						return acc;
					},
					{},
				);

				setQuantities(initialQuantities);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => setLoading(false));
	}, [category]);

	// quantities in stock updates when the order is created
	useEffect(() => {
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
		};
	}, []);

	const isAdmin = auth?.role === RoleType.Admin;
	const isModerator = auth?.role === RoleType.Moderator;
	const canEdit = isAdmin || isModerator;

	if (loading) {
		return <Loader />;
	}

	if (!loading && products.length === 0)
		return (
			<Box component={"main"} textAlign={"center"}>
				<Typography textAlign={"center"} variant='h6' color='error'>
					لم يتم العثور على أي منتجات في المتجر
				</Typography>
				<Button onClick={refreshAfterCange} variant='contained' sx={{mt: 5}}>
					حاول ثانية
				</Button>
			</Box>
		);

	return (
		<>
			<JsonLd data={generateCategoryJsonLd(category, products)} />
			<Helmet>
				<script type='application/ld+json'>
					{JSON.stringify(generateCategoryJsonLd("سيارات", products))}
				</script>
			</Helmet>
			<Box component='main'>
				<Box
					sx={{
						position: "sticky",
						zIndex: 2,
						top: 60,
					}}
				>
					<SearchBox
						searchQuery={searchQuery}
						text={t("searchin")}
						setSearchQuery={setSearchQuery}
					/>
				</Box>
				<Box className='container pb-5'>
					<Row className='mt-3 g-3'>
						{filteredProducts.length ? (
							filteredProducts
								.slice(0, visibleProducts.length)
								.map((product: Products, index) => {
									const isOutOfStock = product.quantity_in_stock <= 0;
									const productQuantity =
										quantities[product.product_name] ?? 1;
									const discountedPrice = product.sale
										? product.price -
											(product.price * (product.discount || 0)) /
												100
										: product.price;

									const unitText =
										{
											fruit: "للكيلو",
											vegetable: "للكيلو",
										}[product.category?.toLowerCase()] || "للوحدة";

									const isLast = index === visibleProducts.length - 1;

									return (
										<Col
											key={product._id}
											style={{marginBlock: 10, border: 1}}
											xs={6}
											md={4}
											xl={2}
											ref={isLast ? lastProductRef : null}
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
												category={category}
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
									لم يتم العثور على منتجات مطابقة. حاول البحث باستخدام:
								</Typography>
								<Box m={1}>
									<Button
										variant='contained'
										sx={{borderRadius: 5}}
										onClick={() => setSearchQuery("عنب")}
									>
										<Chip label='عنب' sx={{color: "white"}} />
									</Button>
									<Button
										variant='contained'
										sx={{borderRadius: 5, m: 1}}
										onClick={() => setSearchQuery("2")}
									>
										<Chip label='سعر المنتج' sx={{color: "white"}} />
									</Button>
									<Button
										variant='contained'
										sx={{borderRadius: 5}}
										onClick={() => setSearchQuery("عروض")}
									>
										<Chip label='عروض' sx={{color: "white"}} />
									</Button>
								</Box>
							</Box>
						)}
					</Row>
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
					handleDelete={() => handleDelete(productToDelete)}
					title={"أنت على وشك حذف منتج من السوق"}
					description={`هل أنت متأكد أنك تريد حذف ال${productToDelete} ? لا يمكن التراجع عن هذا الإجراء`}
				/>
			</Box>
		</>
	);
};

export default ProductCategory;
