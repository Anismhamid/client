import {FunctionComponent} from "react";
import {useTranslation} from "react-i18next";

import {categoriesLogic, CategoryValue} from "../../../atoms/productsManage/postLogicMap";
import {getColorHex} from "../../../atoms/colorsSettings/carsColors";

interface Product {
	category: CategoryValue;
	subcategory?: string;
	[key: string]: any;
}

interface Field {
	name: string;
	type: string;
	required?: boolean;
	options?: string[];
}

interface PostDetailsTableProps {
	product: Product;
}

const PostDetailsTable: FunctionComponent<PostDetailsTableProps> = ({product}) => {
	const {t} = useTranslation();

	const fields: Field[] = product.subcategory
		? (categoriesLogic[product.category]?.[
				product.subcategory as keyof (typeof categoriesLogic)[typeof product.category]
			] as Field[]) || []
		: [];

	return (
		<table className='table table-striped-columns w-50'>
			<thead>
				<tr>
					<td>{t(product.category)}</td>
					<td>{product.subcategory}</td>
				</tr>
			</thead>
			<tbody>
				{fields.map((field) => {
					const value = product[field.name];
					if (value === undefined || value === null) return null;

					const colorHex =
						field.name === "color" ? getColorHex(value) : undefined;

					return (
						<tr key={field.name}>
							<td>{t(field.name)}</td>
							<td style={colorHex ? {color: colorHex} : undefined}>
								{value}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default PostDetailsTable;
