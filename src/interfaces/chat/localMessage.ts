import { BaseMessage } from "./chatUser";

export interface LocalMessage extends Omit<BaseMessage, "status"> {
    text: string | undefined;
	status: "pending" | "sent" | "delivered" | "seen" | "error";
	fileType?: string;
	fileUrl?: string;
	tempId?: string;
	date?: Date;
}