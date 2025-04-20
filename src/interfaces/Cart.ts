export interface Cart {
	_id?: string;
	userId: string;
	products: [
		{
			product_name: string;
			quantity: number;
			product_price: number;
			product_image: string;
			sale: boolean;
			discount: number;
		},
	];
	total_price: number;
}
