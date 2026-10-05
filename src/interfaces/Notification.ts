export interface AppNotificationData {
    postId?: string | null;

    category?: string;

    subcategory?: string;

    brand?: string;

    productName?: string;

    rejectionReason?: string;

    [key: string]: unknown;
}

export interface AppNotifications {
    _id: string;

    user: string;

    type:
        | 'post_approved'
        | 'post_rejected'
        | 'post_pending_review'
        | string;

    title: string;

    body?: string;

    data?: AppNotificationData;

    readAt?: string | null;

    createdAt: string;

    updatedAt?: string;
}