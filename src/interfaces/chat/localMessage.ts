import { BaseMessage } from "./chatUser";

export interface LocalMessage extends BaseMessage {
	status: "pending" | "sent" | "delivered" | "seen" | "error";
	fileType?: string;
	fileUrl?: string;
	tempId?: string;
}