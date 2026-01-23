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

const Favorite: FunctionComponent = () => {
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

	return (
		<>
			<Helmet>
				<title>المفضله | صفقه</title>
				<script type='application/ld+json'>
					{JSON.stringify(generateProductsItemListJsonLd(products))}
				</script>
			</Helmet>
			<Box sx={{px: {xs: 2, md: 4}, py: 4}}>
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
								onToggleLike={() => {}}
							/>
						</Grid>
					))}
				</Grid>
			</Box>
		</>
	);
};

export default Favorite;
