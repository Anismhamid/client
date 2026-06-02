export interface BaseUser {
    _id?: string;
    name?: {
        first?: string;
        last?: string;
    };
    email?: string;
    role?: string;
    image?: { url: string; alt: string };
}

export interface BaseMessage {
    _id: string;
    message?: string;

    from?: BaseUser;
    to?: BaseUser;

    createdAt: Date | string;

    status?: 'sent' | 'delivered' | 'seen';

    warning?: boolean;
    isImportant?: boolean;

    replyTo?: BaseMessage | null;

    tempId?: string;

    fileUrl?: string;
    fileType?: string;
}
