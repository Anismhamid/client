export type LocalMessage = {
	_id: string;
	from: {_id: string; name: string; email: string; role: string};
	to: {_id: string};
	message: string;
	warning: boolean;
	isImportant: boolean;
	replyTo?: LocalMessage | null;
	status: "sent" | "delivered" | "seen";
	createdAt: string;
};
