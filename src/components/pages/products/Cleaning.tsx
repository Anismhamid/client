import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface CleaningProps {}
/**
 * Mains cleaning products
 * @returns cleaning products
 */
const Cleaning: FunctionComponent<CleaningProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("categories.cleaning.heading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("categories.cleaning.description")}
				</p>
			</div>
			<ProductCategory category='cleaning' />
		</main>
	);
};

export default Cleaning;
