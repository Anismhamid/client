import {FunctionComponent} from "react";

import ProductCategory from "./ProductsCategory";
import { useTranslation } from "react-i18next";

interface FishProps {}
/**
 * Mains fish
 * @returns fishs products
 */
const Fish: FunctionComponent<FishProps> = () => {
	const {t} = useTranslation();
	return (
		<main >
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t("pages.fish.fishHeading")}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t("pages.fish.fishDescription")}
				</p>
			</div>

			<ProductCategory category='fish' />
		</main>
	);
};

export default Fish;
