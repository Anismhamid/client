import {FunctionComponent} from "react";
import ProductCategory from "./ProductsCategory";
import {useTranslation} from "react-i18next";

interface SnacksProps {}
/**
 * Mains snacks
 * @returns snacks products
 */
const Snacks: FunctionComponent<SnacksProps> = () => {
	const {t} = useTranslation();
	return (
		<main className=' min-vh-100'>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("pages.snacksHeading")}
				</h1>

				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.snacksDescription")}
				</p>
			</div>
			<ProductCategory category='snacks' />
		</main>
	);
};

export default Snacks;
