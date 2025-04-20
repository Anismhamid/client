import {FunctionComponent} from "react";
import ProductCategory from "./ProductsCategory";
import { useTranslation } from "react-i18next";

interface FruitsProps {}
/**
 * Mains fruits
 * @returns fruits products
 */
const Fruits: FunctionComponent<FruitsProps> = () => {
	const {t} = useTranslation();
	return (
		<main className=' min-vh-100'>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("pages.fruitsHeading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.fruitsDescription")}
				</p>
			</div>
			<ProductCategory category='fruit' />
		</main>
	);
};

export default Fruits;
