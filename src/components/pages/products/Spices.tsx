import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface SpicesProps {}
/**
 * Mains spices
 * @returns spices products
 */
const Spices: FunctionComponent<SpicesProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("categories.spices.heading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("categories.spices.description")}
				</p>
			</div>
			<ProductCategory category='spices' />
		</main>
	);
};

export default Spices;
