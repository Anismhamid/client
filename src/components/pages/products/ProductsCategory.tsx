import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {deleteProduct, getProductsByCategory} from "../../../services/productsServices"; // פונקציה כללית שמביאה מוצרים לפי קטגוריה
import {Products} from "../../../interfaces/Products";
import {handleAddToCart} from "../../../helpers/fruitesFunctions";
import {useUser} from "../../../context/useUSer";
import Loader from "../../../atoms/loader/Loader";
import UpdateProductModal from "../../../atoms/productsManage/UpdateProductModal";
import {showError, showSuccess} from "../../../atoms/toasts/ReactToast";
import RoleType from "../../../interfaces/UserType";
import {useCartItems} from "../../../context/useCart";
import {
	Box,
	Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import AlertDialogs from "../../../atoms/toasts/Sweetalert";
import Seo from "../../../atoms/Seo/Seo";
import {getFaviconForCategory} from "../../../FontAwesome/tapIcons";
import {useTranslation} from "react-i18next";
import { useNavigate} from "react-router-dom";
import {path} from "../../../routes/routes";
import {Col, Row} from "react-bootstrap";
import SearchBox from "../../../atoms/productsManage/SearchBox";
import socket from "../../../socket/globalSocket";
import ProductCard from "./ProductCard";

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
	const [showMoreLoading, setShowMoreLoading] = useState<boolean>(false);
	const [showUpdateProductModal, setOnShowUpdateProductModal] =
		useState<boolean>(false);
	const [productToDelete, setProductToDelete] = useState<string>("");
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [loadingAddToCart, setLoadingAddToCart] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [refresh, setRefresh] = useState<boolean>(false);
	const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

	const {setQuantity} = useCartItems();
	const navigate = useNavigate();

	const openDeleteModal = (name: string) => {
		setProductToDelete(name);
		setShowDeleteModal(true);
	};
	const closeDeleteModal = () => setShowDeleteModal(false);

	const {t} = useTranslation();

	// Update product
	const onShowUpdateProductModal = () => setOnShowUpdateProductModal(true);
	const onHideUpdateProductModal = () => setOnShowUpdateProductModal(false);

	const icons = getFaviconForCategory(category);

	const refreshAfterCange = () => setRefresh(!refresh);

	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			const productName = product.product_name || "";
			const productPrice = product.price || "";
			const productInDiscount = product.sale ? "מבצע" : "";

			return (
				productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(searchQuery && productPrice.toString().includes(searchQuery)) ||
				(searchQuery && productInDiscount.toString().includes(searchQuery))
			);
		});
	}, [products, searchQuery]);

	const handleAdd = (
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
				setQuantity((prev) => prev + productQuantity);
				setLoadingAddToCart(null);
			});
		}
	};

	const handleDelete = (product_name: string) => {
		deleteProduct(product_name)
			.then(() => {
				showSuccess("המוצר נמחק בהצלחה!");

				setProducts((prevProducts) =>
					prevProducts.filter((p) => p.product_name !== product_name),
				);
			})
			.catch((err) => {
				console.error(err);
				showError("שגיאה במחיקת המוצר!");
			});
	};

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

	const handleShowMore = () => {
		setShowMoreLoading(true);
		const nextVisibleCount = visibleProducts.length + 16;
		const newVisibleProducts = products.slice(0, nextVisibleCount);
		setVisibleProducts(newVisibleProducts);
		setShowMoreLoading(false);
	};

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
					לא נמצאו מוצרים בחנות
				</Typography>
				<Button onClick={refreshAfterCange} variant='contained' sx={{mt: 5}}>
					נסה שוב
				</Button>
			</Box>
		);

	return (
		<>
			<Seo
				title={t("seo.categoryTitle", {category: t(`categories.${category}`)})}
				description={t("seo.categoryDescription", {
					category: t(`categories.${category}`),
				})}
				image={icons}
				type='category'
			/>
			<Box component='main'>
				<Box
					sx={{
						position: "sticky",
						zIndex: 1,
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
					<Row className='mt-3' spacing={5}>
						{filteredProducts
							.slice(0, visibleProducts.length)
							.map((product: Products) => {
								const isOutOfStock = product.quantity_in_stock <= 0;
								const productQuantity =
									quantities[product.product_name] ?? 1;
								const discountedPrice = product.sale
									? product.price -
										(product.price * (product.discount || 0)) / 100
									: product.price;

								const unitText =
									{
										spices: "ל/100 גרם",
										fruit: 'ל/ק"ג',
										vegetable: 'ל/ק"ג',
										meat: 'ל/ק"ג',
										fish: 'ל/ק"ג',
									}[product.category?.toLowerCase()] || "ליחידה";

								return (
									<Col
										key={product._id}
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
											category={category}
										/>
									</Col>
								);
							})}
					</Row>
					{/* Show More Button */}
					{products.length > visibleProducts.length && (
						<div className='text-center my-4 '>
							<Button
								onClick={handleShowMore}
								color='primary'
								variant='contained'
								size='large'
								disabled={showMoreLoading}
								className='rounded-pill shadow'
							>
								הצג עוד מוצרים
							</Button>
						</div>
					)}
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
					title={"אתה עומד למחוק מוצר מהחנות"}
					description={`האם אתה בטוח שברצונך למחוק את המוצר ( ${productToDelete} ) ? פעולה זו לא ניתנת לביטול`}
				/>
			</Box>
		</>
	);
};

export default ProductCategory;
