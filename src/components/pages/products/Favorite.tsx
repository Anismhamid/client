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

const Favorite: FunctionComponent = () => {
	const {t} = useTranslation();
	const [products, setProducts] = useState<Products[]>([]);
	const {auth} = useUser();

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
								product={product}
								discountedPrice={0}
								setProductIdToUpdate={() => {}}
								onShowUpdateProductModal={() => {}}
								openDeleteModal={() => {}}
								setLoadedImages={() => {}}
								loadedImages={{}}
								category={product.category}
								// onToggleLike={() => {}}
							/>
						</Grid>
					))}
				</Grid>
			</Box>
		</>
	);
};

export default Favorite;
