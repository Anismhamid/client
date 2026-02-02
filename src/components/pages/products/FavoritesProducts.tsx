import {FunctionComponent, useEffect, useState} from "react";
import {Products} from "../../../interfaces/Products";
import {getAllProducts} from "../../../services/productsServices";
import {useUser} from "../../../context/useUSer";
import {Box, Grid, Typography} from "@mui/material";
import ProductCard from "./ProductCard";
import {Helmet} from "react-helmet";
// import JsonLd from "../../../../utils/JsonLd";
import {generateProductsItemListJsonLd} from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";
import {useTranslation} from "react-i18next";
import handleRTL from "../../../locales/handleRTL";
import {useNavigate} from "react-router-dom";
import {path} from "../../../routes/routes";

const FavoritesProducts: FunctionComponent = () => {
	const {t} = useTranslation();
	const [products, setProducts] = useState<Products[]>([]);
	const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

	const {auth} = useUser();
	const navigate = useNavigate();
	useEffect(() => {
		if (!auth?._id) return;

		getAllProducts()
			.then((allProducts) => {
				const filtered = allProducts.filter(
					(product) =>
						Array.isArray(product.likes) && product.likes.includes(auth._id!),
				);
				setProducts(filtered);
			})
			.catch(console.error);
	}, [auth?._id]);

	if (!products.length) {
		return (
			<Box sx={{textAlign: "center", py: 6}}>
				<Typography variant='h6' color='text.secondary'>
					لا توجد منتجات مفضلة ❤️
				</Typography>
			</Box>
		);
	}

	const direction = handleRTL();

	const productsList = generateProductsItemListJsonLd(products);

	const currentUrl = `https://client-qqq1.vercel.app/favorites`;

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
								? [...(p.likes || []), userId] // userId مؤكد كـ string
								: (p.likes || []).filter((id) => id !== userId),
						}
					: p,
			),
		);

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

	return (
		<>
			<Helmet>
				<JsonLd data={productsList} />
				<link rel='canonical' href={currentUrl} />
				<title>{t("favorites")} | صفقه</title>
				<meta name='description' content={t("favorites")} />
			</Helmet>
			<Box dir={direction} sx={{px: {xs: 2, md: 4}, py: 4}}>
				<h1>{t("favorites")}</h1>
				<Grid container spacing={3}>
					{products.map((product) => (
						<Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={product._id}>
							<ProductCard
								key={product._id}
								product={product}
								discountedPrice={product.discount || 0}
								setProductIdToUpdate={() => {}}
								onShowUpdateProductModal={() => {}}
								openDeleteModal={() => {}}
								setLoadedImages={() =>
									setLoadedImages((prev) => ({
										...prev,
										[product._id as string]: true,
									}))
								}
								loadedImages={loadedImages}
								category={product.category}
								onLikeToggle={handleToggleLike}
							/>
						</Grid>
					))}
				</Grid>
			</Box>
		</>
	);
};

export default FavoritesProducts;
