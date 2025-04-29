import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface FrozenProps {}
/**
 * Mains frozen
 * @returns frozen products
 */
const Frozen: FunctionComponent<FrozenProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("categories.frozen.heading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("categories.frozen.description")}
				</p>
			</div>

			<ProductCategory category='forzen' />
		</main>
	);
};

export default Frozen;
