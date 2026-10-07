import {
    AppNotificationData,
    AppNotifications,
} from '../interfaces/Notification';
import { SellerUser } from '../interfaces/Posts';
import api from './api';

export interface AdminNotificationData {
    screen?: string;
    action?: string;
    postId?: string;
    jobId?: string;
    userId?: string;
    [key: string]: unknown;
}

export type AdminNotificationTarget = 'user' | 'users' | 'role' | 'all';

export interface SendAdminNotificationPayload {
    target: AdminNotificationTarget;

    userId?: string;

    userIds?: string[];

    role?: 'Admin' | 'Moderator' | 'Client' | 'delivery';

    title: string;

    body?: string;

    data?: AdminNotificationData;
}

export interface SendAdminNotificationResponse {
    success: boolean;

    message: string;

    target: AdminNotificationTarget;

    totalFound: number;

    sentCount: number;

    failedCount: number;
}

export interface SentNotification {
    _id: string;

    user: SellerUser | null;

    sentBy?: string | null;

    type: string;

    title: string;

    body?: string;

    data?: AppNotificationData;

    readAt?: string | null;

    createdAt: string;

    updatedAt?: string;
}

// ============================================================
// USER NOTIFICATIONS
// ============================================================

export const getNotifications = async (page = 1, limit = 20) => {
    const response = await api.get<{
        success: boolean;
        notifications: AppNotifications[];
        unreadCount: number;
        total: number;
        page: number;
        pages: number;
    }>('/notifications', {
        params: {
            page,
            limit,
        },
    });

    return response.data;
};

export const getUnreadNotificationCount = async () => {
    const response = await api.get<{
        success: boolean;
        unreadCount: number;
    }>('/notifications/unread-count');

    return response.data.unreadCount;
};

export const markNotificationAsRead = async (notificationId: string) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);

    return response.data;
};

export const markAllNotificationsAsRead = async () => {
    const response = await api.patch('/notifications/read-all');

    return response.data;
};

// ============================================================
// ADMIN - SEND
// ============================================================

export const sendAdminNotification = async (
    payload: SendAdminNotificationPayload,
) => {
    const response = await api.post<SendAdminNotificationResponse>(
        '/admin/notifications/send',
        payload,
    );

    return response.data;
};

// ============================================================
// ADMIN - SENT
// ============================================================

export const getSentAdminNotifications = async (page = 1, limit = 20) => {
    const response = await api.get<{
        success: boolean;
        notifications: SentNotification[];
        total: number;
        page: number;
        pages: number;
    }>('/admin/notifications/sent', {
        params: {
            page,
            limit,
        },
    });

    return response.data;
};
