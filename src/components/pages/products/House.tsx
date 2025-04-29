import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface HouseProps {}
/**
 * Mains house products
 * @returns house products
 */
const House: FunctionComponent<HouseProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("pages.house.houseHeading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.house.houseDescription")}
				</p>
			</div>
			<ProductCategory category='home' />
		</main>
	);
};

export default House;
