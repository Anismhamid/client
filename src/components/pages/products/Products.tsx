import {FunctionComponent} from "react";
import ProductCategory from "./ProductsCategory";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";

interface ProductsProps {}
/**
 * Mains pasta and rice products
 * @returns pasta and rice products
 */
const Products: FunctionComponent<ProductsProps> = () => {
	const {t} = useTranslation();
	const {category} = useParams<{category: string}>();

	if (!category) {
		return <div className='text-center mt-4'>Category not found</div>;
	}

	return (
		<main>
			<div className='container'>
				<h1 className='text-center mb-4 p-2 rounded display-6 fw-bold'>
					{t(`categories.${category}.heading`)}
				</h1>
				<hr />
				<p className='text-center mb-4 p-2 rounded lead'>
					{t(`categories.${category}.description`)}
				</p>
			</div>
			<ProductCategory category={category} />
		</main>
	);
};

export default Products;
