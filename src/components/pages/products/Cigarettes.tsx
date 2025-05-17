import {FunctionComponent} from "react";
import ProductCategory from "../../settings/ProductsCategory";
import {useTranslation} from "react-i18next";

interface CigarettesProps {}
/**
 * Mains Cigarettess products
 * @returns Cigarettess products
 */
const Cigarettes: FunctionComponent<CigarettesProps> = () => {
	const {t} = useTranslation();
	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("categories.cigarettes.heading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("categories.cigarettes.description")}
				</p>
			</div>
			<ProductCategory category='Cigarettes' />
		</main>
	);
};

export default Cigarettes;
