export interface InvestigationUser {
    _id: string;

    name: {
        first: string;
        last: string;
    };

    email: string;

    role: 'Admin' | 'Moderator' | 'Client';

    image?: {
        url?: string;
        alt?: string;
    };

    status?: boolean;

    slug?: string;

    accountStatus?: 'active' | 'disabled';
}

export interface InvestigationMessage {
    _id: string;

    from: InvestigationUser;

    to: InvestigationUser;

    message: string;

    warning?: boolean;

    isImportant?: boolean;

    replyTo?: {
        _id: string;
        message: string;
        from: string;
        to: string;
        createdAt?: string;
    } | null;

    roomId: string;

    status: 'sent' | 'delivered' | 'seen';

    createdAt: string;

    updatedAt?: string;
}

export interface ConversationResponse {
    success: boolean;

    roomId: string;

    users: InvestigationUser[];

    messages: InvestigationMessage[];

    totalMessages: number;
}

export interface AuditLog {
    _id: string;

    admin: InvestigationUser;

    user1?: InvestigationUser | null;

    user2?: InvestigationUser | null;

    message?: {
        _id: string;
        from: string;
        to: string;
        roomId: string;
        message?: string;
        createdAt: string;
    } | null;

    action: 'VIEW_MESSAGE' | 'VIEW_CONVERSATION';

    reason: string;

    ip?: string | null;

    userAgent?: string | null;

    createdAt: string;

    updatedAt: string;
}

export interface AuditLogsResponse {
    success: boolean;

    logs: AuditLog[];

    pagination: {
        limit: number;
        skip: number;
        count: number;
        hasMore: boolean;
    };
}
