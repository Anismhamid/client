import {ReactNode} from "react";

export const emptyAuthValues = {
	_id: "",
	status: "",
	name: {
		first: "",
		last: "",
	},
	phone: {
		phone_1: "",
		phone_2: "",
	},
	image: {
		url: "",
		alt: "",
	},
	address: {
		city: "",
		street: "",
		houseNumber: "",
	},
	role: "Client",
	iat: 0,
	slug: "",
	gender: "",
	createdAt: "",
};

export interface AuthValues {
	status: ReactNode;
	createdAt: any;
	exp?: number;
	_id?: string;
	name: {
		first: string;
		last: string;
	};
	email?: string;
	phone: {
		phone_1: string;
		phone_2: string;
	};
	image?: {
		url: string;
		alt: string;
	};
	address: {
		city: string;
		street: string;
		houseNumber: string;
	};
	role?: string;
	iat?: number;
	slug?: string;
	gender: string;
}
