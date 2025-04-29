import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface MeatProps {}
/**
 * Mains meat
 * @returns meat products
 */
const Meat: FunctionComponent<MeatProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("categories.meatAndFish.meat.heading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("categories.meatAndFish.meat.description")}
				</p>
			</div>
			<ProductCategory category='meat' />
		</main>
	);
};

export default Meat;
