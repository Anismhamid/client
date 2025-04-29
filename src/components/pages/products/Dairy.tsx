import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface DairyProps {}
/**
 * Mains dairy
 * @returns dairy products
 */
const Dairy: FunctionComponent<DairyProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4  p-2 rounded display-6 fw-bold'>
					{t("categories.dairy.heading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("categories.dairy.description")}
				</p>
			</div>
			<ProductCategory category='dairy' />
		</main>
	);
};

export default Dairy;
