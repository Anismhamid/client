export interface ChatUser {
	_id: string;
	message: string;
	from: {
		_id: string;
		name: {first: string; last: string};
		role: string;
		email: string;
		image?: {url: string};
	};
	to: {
		_id: string;
		name: {first: string; last: string};
		role: string;
		email: string;
		image?: {url: string};
	};
	createdAt: string;
	status: string;
	warning?: boolean;
	isImportant?: boolean;
	replyTo?: ChatUser | null;
}
