import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface WomenClothesProps {}
/**
 * Mains WomenClothess products
 * @returns WomenClothess products
 */
const WomenClothes: FunctionComponent<WomenClothesProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("categories.womenClothes.heading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("categories.womenClothes.description")}
				</p>
			</div>
			<ProductCategory category='Women-clothes' />
		</main>
	);
};

export default WomenClothes;
