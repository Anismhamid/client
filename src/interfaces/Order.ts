import {User} from "./usersMessages";

export interface Order {
	user: User;
	commission: number;
	orderNumber: string;
	products: {
		product_name: string;
		product_image: string;
		product_price: number;
		quantity: number;
		sale: boolean;
		discount: number;
	}[];
	payment: boolean;
	cashOnDelivery: boolean;
	selfCollection: boolean;
	delivery: boolean;
	status: string;
	totalAmount: number;
	deliveryFee: number;
	date: string;
	phone: {
		phone_1: string;
		phone_2?: string;
	};
	address: {
		city: string;
		street: string;
		houseNumber: string;
	};
	createdAt: string;
	updatedAt: string;
	__v: number;
}
