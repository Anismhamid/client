// Register interface
export interface UserRegister {
	_id?: string;
	name: {
		first: string;
		last: string;
	};
	phone: {
		phone_1: string;
		phone_2: string;
	};
	address: {
		city: string;
		street: string;
		houseNumber?: string;
	};
	email: string;
	password: string;
	confirmPassword?:string;
	gender: string;
	image: {
		url?: string;
		alt?: string;
	};
	role: string;
	status?: string;
	terms: boolean;
}

// Login interface
export interface UserLogin {
	email: string;
	password: string;
}
