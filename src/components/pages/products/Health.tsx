import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface HealthProps {}
/**
 * Mains health products
 * @returns health products
 */
const Health: FunctionComponent<HealthProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("pages.health.healthHeading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.health.healthDescription")}
				</p>
			</div>
			<ProductCategory category='health' />
		</main>
	);
};

export default Health;
