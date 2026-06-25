export interface BaseUser {
    _id?: string;
    name?: {
        first?: string;
        last?: string;
    };
    email?: string;
    role?: string;
    image?: { url: string; alt: string };
    status?: boolean;
    slug?: string;
}

export interface BaseMessage {
    _id: string;
    message?: string;

    from?: BaseUser;

    to?: BaseUser;

    createdAt: Date | string;
    updatedAt?: Date | string;

    warning?: boolean;
    isImportant?: boolean;

    replyTo?: BaseMessage | null;

    tempId?: string;

    fileUrl?: string;
    fileType?: string;
}
