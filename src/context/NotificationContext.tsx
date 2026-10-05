/* eslint-disable react-refresh/only-export-components */
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import socket from '../socket/globalSocket';

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from '../services/notificationServices';

import { AppNotifications } from '../interfaces/Notification';

interface NotificationContextType {
    notifications: AppNotifications[];
    unreadCount: number;

    refreshNotifications: () => Promise<void>;

    markAsRead: (notificationId: string) => Promise<void>;

    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined,
);

export const NotificationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [notifications, setNotifications] = useState<AppNotifications[]>([]);

    const [unreadCount, setUnreadCount] = useState<number>(0);

    const notificationIdsRef = useRef<Set<string>>(new Set());

    /**
     * IDs التي استلمناها من Socket
     *
     * تمنع تكرار نفس notification
     * حتى لو Socket أرسلها أكثر من مرة.
     */
    const receivedNotificationIds = useRef<Set<string>>(new Set());

    /**
     * =====================================================
     * LOAD NOTIFICATIONS
     * =====================================================
     */
    const refreshNotifications = useCallback(async () => {
        try {
            const response = await getNotifications(1, 50);

            const items = response.notifications ?? [];

            notificationIdsRef.current = new Set(
                items.map((notification) => notification._id),
            );

            setNotifications(items);
            setUnreadCount(response.unreadCount ?? 0);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    }, []);

    /**
     * =====================================================
     * INITIAL LOAD
     * =====================================================
     *
     * مهم:
     * إذا كان عندك lint يمنع setState داخل effect،
     * نستطيع لاحقًا نقل initial load للـ Navbar.
     *
     * حاليًا هذا الكود آمن من ناحية duplicate state
     * لأننا نستبدل القائمة وليس نضيف إليها.
     */
    useEffect(() => {
        let cancelled = false;

        const loadNotifications = async () => {
            try {
                const response = await getNotifications(1, 50);

                if (cancelled) {
                    return;
                }

                const serverNotifications = response.notifications ?? [];

                receivedNotificationIds.current = new Set(
                    serverNotifications.map((notification) => notification._id),
                );

                setNotifications(serverNotifications);

                setUnreadCount(response.unreadCount ?? 0);
            } catch (error) {
                if (!cancelled) {
                    console.error('Failed to load notifications:', error);
                }
            }
        };

        void loadNotifications();

        return () => {
            cancelled = true;
        };
    }, []);

    /**
     * =====================================================
     * REALTIME SOCKET
     * =====================================================
     */
    useEffect(() => {
        const handleNotification = (notification: AppNotifications) => {
            if (!notification?._id) {
                return;
            }

            /**
             * منع نفس الإشعار من الدخول
             * أكثر من مرة.
             */
            if (notificationIdsRef.current.has(notification._id)) {
                console.log(
                    '[notifications] duplicate ignored:',
                    notification._id,
                );

                return;
            }

            notificationIdsRef.current.add(notification._id);

            console.log(
                '[notifications] new:',
                notification._id,
                notification.type,
            );

            setNotifications((previous) => {
                // حماية إضافية
                if (previous.some((item) => item._id === notification._id)) {
                    return previous;
                }

                return [notification, ...previous];
            });

            if (!notification.readAt) {
                setUnreadCount((previous) => previous + 1);
            }
        };

        socket.on('notification:new', handleNotification);

        return () => {
            socket.off('notification:new', handleNotification);
        };
    }, []);

    /**
     * =====================================================
     * MARK ONE AS READ
     * =====================================================
     */
    const markAsRead = useCallback(
        async (notificationId: string) => {
            try {
                const notification = notifications.find(
                    (item) => item._id === notificationId,
                );

                const wasUnread = !!notification && !notification.readAt;

                await markNotificationAsRead(notificationId);

                setNotifications((previous) =>
                    previous.map((notification) => {
                        if (notification._id !== notificationId) {
                            return notification;
                        }

                        return {
                            ...notification,
                            readAt:
                                notification.readAt ?? new Date().toISOString(),
                        };
                    }),
                );

                if (wasUnread) {
                    setUnreadCount((previous) => Math.max(0, previous - 1));
                }
            } catch (error) {
                console.error('Failed to mark notification as read:', error);
            }
        },
        [notifications],
    );

    /**
     * =====================================================
     * MARK ALL AS READ
     * =====================================================
     */
    const markAllAsRead = useCallback(async () => {
        try {
            await markAllNotificationsAsRead();

            const now = new Date().toISOString();

            setNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    readAt: notification.readAt ?? now,
                })),
            );

            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                refreshNotifications,
                markAsRead,
                markAllAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

/**
 * =========================================================
 * useNotifications
 * =========================================================
 */
export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            'useNotifications must be used inside NotificationProvider',
        );
    }

    return context;
};
