// export interface ChatUser {
// 	_id: string;
// 	message: string;
// 	from: {
// 		_id: string;
// 		name: {first: string; last: string};
// 		role: string;
// 		email: string;
// 		image?: {url: string};
// 	};
// 	to: {
// 		_id: string;
// 		name: {first: string; last: string};
// 		role: string;
// 		email: string;
// 		image?: {url: string};
// 	};
// 	createdAt: string;
// 	status: "sent" | "delivered" | "seen";
// 	warning?: boolean;
// 	isImportant?: boolean;
// 	replyTo?: ChatUser | null;
// }

export interface BaseUser {
    _id?: string;
    name?: {
        first?: string;
        last?: string;
    };
    email?: string;
    role?: string;
    image?: { url: string };
}

export interface BaseMessage {
    _id: string;
    message?: string;
    from?: BaseUser;
    to?: BaseUser;
    createdAt?: Date;
    warning?: boolean;
    isImportant?: boolean;
    replyTo?: string | null;
}
