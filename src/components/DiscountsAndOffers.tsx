import {FunctionComponent, useEffect, useState} from "react";
import {Products} from "../interfaces/Products";
import {getProductsInDiscount} from "../services/productsServices";
import {Link} from "react-router-dom";
import {productsPathes} from "../routes/routes";
import Loader from "../atoms/loader/Loader";
import {Skeleton} from "@mui/material";
import {useTranslation} from "react-i18next";

interface DiscountsAndOffersProps {}

/**
 * Products in discount
 * @returns Products in discount
 */
const DiscountsAndOffers: FunctionComponent<DiscountsAndOffersProps> = () => {
	const {t} = useTranslation();
	const [productsInDiscount, setProductsInDiscount] = useState<Products[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

	// Category to path mapping
	const categoryToPath: Record<string, string> = {
		Fruit: productsPathes.Fruits,
		Vegetable: productsPathes.Vegetable,
		Fish: productsPathes.fish,
		Dairy: productsPathes.dairy,
		Meat: productsPathes.meat,
		Spices: productsPathes.spices,
		Bakery: productsPathes.bakery,
		Beverages: productsPathes.beverages,
		Frozen: productsPathes.forzen,
		Snacks: productsPathes.snacks,
	};

	useEffect(() => {
		getProductsInDiscount()
			.then((res) => {
				setProductsInDiscount(res);
				setLoading(false);
			})
			.catch((error) => {
				console.error(error);
				setLoading(false);
			});
	}, []);

	const setImageLoaded = (id: string) => {
		setLoadedImages((prev) => ({...prev, [id]: true}));
	};

	if (loading) {
		return <Loader />;
	}
	return (
		<main className=' min-vh-100'>
			<div className='container'>
				<h1 className='text-center mb-4 display-5 fw-bold'>
					{t("pages.discountsAndOffersHeading")}
				</h1>
				<p className='text-center lead mb-5'>
					<span className='d-block'>{t("pages.discountsAndOffersSpan")}</span>
					{t("pages.discountsAndOffersDescription")}
				</p>
			</div>

			<div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4'>
				{productsInDiscount.map((product: Products) => {
					// Look up the category path from the map
					const categoryPath = categoryToPath[product.category] || "";
					const isLoaded = loadedImages[product.product_name];
					return (
						<div className='col' key={product._id}>
							<div className='card h-100 shadow-sm'>
								<Link to={categoryPath}>
									{!isLoaded && (
										<Skeleton
											variant='rectangular'
											width='100%'
											height={200}
											sx={{bgcolor: "grey.900"}}
										/>
									)}
									<img
										src={product.image_url}
										alt={product.product_name}
										className='card-img-top'
										style={{
											display: isLoaded ? "block" : "none",
											objectFit: "cover",
											height: "200px",
										}}
										onLoad={() =>
											setImageLoaded(product.product_name)
										}
									/>
								</Link>

								<div className='card-body text-center'>
									<h5 className='card-title'>{product.product_name}</h5>
									<hr />
									<h5 className='text-danger'>
										{product.sale
											? `במבצע ${product.discount}%`
											: "הצעות בשבילך"}
									</h5>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
};

export default DiscountsAndOffers;
