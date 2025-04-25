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
		<main >
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("pages.fruit.fruitsHeading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.fruit.fruitsDescription")}
				</p>
			</div>
			<ProductCategory category='fruit' />
		</main>
	);
};

export default Fruits;
