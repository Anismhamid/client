import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface AlcoholProps {}
/**
 * Mains alcohol products
 * @returns alcohol products
 */
const Alcohol: FunctionComponent<AlcoholProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("pages.alcohol.alcoholHeading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.alcohol.alcoholDescription")}
				</p>
			</div>
			<ProductCategory category='alcohol' />
		</main>
	);
};

export default Alcohol;
