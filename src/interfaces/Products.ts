/**
 * Products interface
 */
export interface Products {
	_id?: string;
	product_name: string;
	category: string;
	price: number;
	quantity_in_stock: number;
	description: string;
	image_url: string;
	sale: boolean;
	discount: number;
}

export const initialProductValue = {
	product_name: "",
	category: "",
	price: 0,
	quantity_in_stock: 0,
	description: "",
	image_url: "",
	sale: false,
	discount: 0,
};
