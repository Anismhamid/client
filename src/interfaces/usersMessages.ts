export interface User {
	_id: string;
	name: {_id?: string; email?: string; first?: string; last?: string};
	email: string;
	role: string;
}

export interface UserMessage {
	_id?: string;
	from: {_id?: string; email?: string; first?: string; last?: string; role?: string};
	to: {_id?: string; email?: string; first?: string; last?: string; role?: string};
	message: string;
	warning?: boolean;
	isImportant?: boolean;
	status: string;
	replyTo?: string;
	createdAt: string;
}
