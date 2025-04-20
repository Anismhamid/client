/**
 * Fruit interface
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

