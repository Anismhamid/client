export interface ReceiptsType {
	userId: string;
	orderNumber: string;
	orderDate: string;
	customer: {
		name: {first: string; last: string};
		email: string;
		phone: {
			phone_1: string;
			phone_2: string;
		};
		address: {
			city: string;
			street: string;
			houseNumber: string;
		};
	};
	products: {
		product_name: string;
		quantity: number;
		product_price: number;
	}[];
	payment: string;
	deliveryFee: number;
	discount: number;
	totalAmount: number;
	businessInfo: {
		name: string;
		companyId: string;
		phone: string;
		email: string;
		address: string;
	};
}
