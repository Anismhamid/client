export interface CompleteUserPayload {
	image?: {
		url: String;
	};
	phone: {phone_1: string; phone_2?: string};
	address: {city: string; street: string; houseNumber?: string};
}
