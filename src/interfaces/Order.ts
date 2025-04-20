export interface Order {
	userId: string;
	orderNumber: string;
	products: [
		{
			product_name: string;
			product_image: string;
			product_price: number;
			quantity: number;
			sale: boolean;
			discount: number;
		},
	];
	payment: boolean;
	cashOnDelivery: boolean;
	selfCollection: boolean;
	delivery: boolean;
	status: string;
	totalAmount: number;
	deliveryFee: number;
	date: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}
