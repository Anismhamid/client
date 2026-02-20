export interface User {
	_id?: string;
	name: {_id?: string; email?: string; first: string; last: string};
	phone?: {phone_1: string; phone_2?: string};
	image?: {url: string; alt: string};
	address?: {city: string; street: string; houseNumber: number};
	email: string;
	role: string;
	gender: string;
	createdAt?: string;
}

export interface UserMessage {
	first: string;
	last: string;
	otherUser: any;
	_id?: string;
	from: {_id?: string; email?: string; first?: string; last?: string; role?: string};
	to: {_id?: string; email?: string; first?: string; last?: string; role?: string};
	message: string;
	warning?: boolean;
	isImportant?: boolean;
	status: string;
	replyTo?: string;
	createdAt: string;
	name?: {first: string; last: string};
	email?: string;
	role?: string;
}
