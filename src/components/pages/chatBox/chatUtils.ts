// Fixed mapping function with proper type conversion

import { ChatMessage } from "../../../interfaces/chat/chatMessage";
import { UserMessage } from "../../../interfaces/chat/usersMessages";

export const mapUserMessageToChatBox = (msg: UserMessage): ChatMessage => {
    const convertToDate = (dateValue: unknown): Date => {
        if (!dateValue || typeof dateValue === 'function') return new Date();
        if (dateValue instanceof Date) return dateValue;
        return new Date(dateValue as string);
    };

    return {
        _id: msg._id,
        slug: msg.slug,
        from: {
            _id: msg.from?._id ?? 'unknown',
            name: {
                first: msg.name?.first ?? 'Unknown',
                last: msg.name?.last ?? '',
            },
            email: msg.email ?? '',
            role: msg.role ?? 'Client',
            status: msg.from?.status || false,
        },
        to: {
            _id: msg.to?._id ?? 'unknown',
            name: {
                first: msg.to?.first ?? 'Unknown',
                last: msg.to?.last ?? '',
            },
            email: msg.to?.email ?? '',
            role: msg.to?.role ?? 'Client',
            status: msg.to?.status || false,
        },
        message: msg.message,
        status:
            (msg.messageStatus as 'sent' | 'delivered' | 'seen' | 'pending') ??
            'sent',
        createdAt: convertToDate(msg.createdAt),
        updatedAt: convertToDate(msg.updatedAt),
        warning: msg.warning ?? false,
        isImportant: msg.isImportant ?? false,
        replyTo: msg.replyTo
            ? mapUserMessageToChatBox(msg.replyTo as unknown as UserMessage)
            : null,
        tempId: msg._id,
    } as ChatMessage;
};
