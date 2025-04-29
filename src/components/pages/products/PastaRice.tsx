import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface PastaRiceProps {}
/**
 * Mains pasta and rice products
 * @returns pasta and rice products
 */
const PastaRice: FunctionComponent<PastaRiceProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("categories.pastaAndRice.heading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("categories.pastaAndRice.pdescription")}
				</p>
			</div>
			<ProductCategory category='pasta & Rice' />
		</main>
	);
};

export default PastaRice;
