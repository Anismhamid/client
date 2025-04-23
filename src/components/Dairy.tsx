import {FunctionComponent} from "react";
import ProductCategory from "./ProductsCategory";
import {useTranslation} from "react-i18next";

interface DairyProps {}
/**
 * Mains dairy
 * @returns dairy products
 */
const Dairy: FunctionComponent<DairyProps> = () => {
	const {t} = useTranslation();
	return (
		<main className=' min-vh-100'>
			<div className='container'>
				<h1 className='text-center mb-4  p-2 rounded display-6 fw-bold'>
					{t("pages.dairy.dairyHeading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.dairy.dairydescription")}
				</p>
			</div>
			<ProductCategory category='dairy' />
		</main>
	);
};

export default Dairy;
