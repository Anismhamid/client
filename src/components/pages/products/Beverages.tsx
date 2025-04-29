import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface BeveragesProps {}
/**
 * Mains beverages
 * @returns beverages products
 */
const Beverages: FunctionComponent<BeveragesProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("pages.beverages.beveragesHeading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.beverages.beveragesdescription")}
				</p>
			</div>
			<ProductCategory category='beverages' />
		</main>
	);
};

export default Beverages;
