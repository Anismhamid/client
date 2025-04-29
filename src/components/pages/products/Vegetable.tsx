import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface VegentableProps {}
/**
 * Mains vegentable
 * @returns vegentable products
 */
const Vegentable: FunctionComponent<VegentableProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container m-auto'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("categories.fruitAndVegetables.vegetable.heading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("categories.fruitAndVegetables.vegetable.description")}
				</p>
			</div>
			<ProductCategory category='vegetable' />
		</main>
	);
};

export default Vegentable;
