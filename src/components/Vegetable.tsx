import {FunctionComponent} from "react";
import ProductCategory from "./ProductsCategory";
import {useTranslation} from "react-i18next";

interface VegentableProps {}
/**
 * Mains vegentable
 * @returns vegentable products
 */
const Vegentable: FunctionComponent<VegentableProps> = () => {
	const {t} = useTranslation();
	return (
		<main className=' min-vh-100'>
			<div className='container m-auto'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("pages.vegetableHeading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.vegetableDescription")}
				</p>
			</div>
			<ProductCategory category='vegetable' />
		</main>
	);
};

export default Vegentable;
