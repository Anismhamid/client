import {FunctionComponent} from "react";
import ProductCategory from "./ProductsCategory";
import {useTranslation} from "react-i18next";

interface BakeryProps {}
/**
 * Mains bakery
 * @returns bakery product
 */
const Bakery: FunctionComponent<BakeryProps> = () => {
	const {t} = useTranslation();
	return (
		<main className=' min-vh-100'>
			<div className='container'>
				<h1 className='text-center mb-4 rounded display-6 fw-bold'>
					{t("pages.bakeryHeading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.bakerydescription")}
				</p>
			</div>
			<ProductCategory category='bakery' />
		</main>
	);
};

export default Bakery;
