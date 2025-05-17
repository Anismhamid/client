import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface WomenBagsProps {}
/**
 * Mains WomenBagss products
 * @returns WomenBagss products
 */
const WomenBags: FunctionComponent<WomenBagsProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("categories.womenBags.heading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("categories.womenBags.description")}
				</p>
			</div>
			<ProductCategory category='Women-bags' />
		</main>
	);
};

export default WomenBags;