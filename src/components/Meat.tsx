import {FunctionComponent} from "react";
import ProductCategory from "./ProductsCategory";
import {useTranslation} from "react-i18next";

interface MeatProps {}
/**
 * Mains meat
 * @returns meat products
 */
const Meat: FunctionComponent<MeatProps> = () => {
	const {t} = useTranslation();
	return (
		<main className=' min-vh-100'>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("pages.meatHeading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.meatDescription")}
				</p>
			</div>
			<ProductCategory category='meat' />
		</main>
	);
};

export default Meat;
