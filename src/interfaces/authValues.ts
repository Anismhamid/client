export const emptyAuthValues = {
	_id: "",
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
	role: "",
	iat: 0,
};

export interface AuthValues {
	_id?: string;
	name: {
		first: string;
		last: string;
	};
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
}
