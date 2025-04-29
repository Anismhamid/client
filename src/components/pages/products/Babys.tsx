import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface BabyProps {}
/**
 * Mains babys products
 * @returns babys products
 */
const Baby: FunctionComponent<BabyProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("pages.baby.babyHeading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.baby.babyDescription")}
				</p>
			</div>
			<ProductCategory category='baby' />
		</main>
	);
};

export default Baby;
