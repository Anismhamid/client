export type LocalMessage = {
	text?: string | undefined;
	fileType: any;
	fileUrl: any;
	_id: string;
	from: {_id: string; name: string; email: string; role: string};
	to: {_id: string};
	message: string;
	warning: boolean;
	isImportant: boolean;
	replyTo?: LocalMessage | null;
	status: "pending" | "sent" | "delivered" | "seen" | "error";
	createdAt: string;
};
