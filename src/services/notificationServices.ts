import { AppNotifications } from '../interfaces/Notification';
import api from './api';

export const getNotifications = async (
    page = 1,
    limit = 20,
) => {
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

export const getUnreadNotificationCount =
    async () => {
        const response = await api.get<{
            success: boolean;
            unreadCount: number;
        }>('/notifications/unread-count');

        return response.data.unreadCount;
    };

export const markNotificationAsRead = async (
    notificationId: string,
) => {
    const response = await api.patch(
        `/notifications/${notificationId}/read`,
    );

    return response.data;
};

export const markAllNotificationsAsRead = async () => {
    const response = await api.patch(
        '/notifications/read-all',
    );

    return response.data;
};