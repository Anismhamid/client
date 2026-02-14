export interface ChatUser {
	_id: string;
	message: string;
	from: {_id: string; name: {first: string; last: string}; role: string; email: string};
	to: {_id: string; name: {first: string; last: string}; role: string; email: string};
	createdAt: string;
	status: string;
	warning?: boolean;
	isImportant?: boolean;
	replyTo?: ChatUser | null;
}
