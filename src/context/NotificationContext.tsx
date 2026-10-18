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

interface NotificationProviderProps {
    children: React.ReactNode;
    isAuthenticated: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined,
);

export const NotificationProvider = ({
    children,
    isAuthenticated,
}: NotificationProviderProps) => {
    const [notifications, setNotifications] = useState<AppNotifications[]>([]);

    const [unreadCount, setUnreadCount] = useState(0);

    const notificationIdsRef = useRef<Set<string>>(new Set());
    const authenticatedRef = useRef(isAuthenticated);
    const requestVersionRef = useRef(0);

    useEffect(() => {
        authenticatedRef.current = isAuthenticated;
    }, [isAuthenticated]);

    const clearNotifications = useCallback(() => {
        requestVersionRef.current += 1;
        notificationIdsRef.current.clear();
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    const refreshNotifications = useCallback(async () => {
        if (!authenticatedRef.current) {
            clearNotifications();
            return;
        }

        const requestVersion = requestVersionRef.current;

        try {
            const response = await getNotifications(1, 50);

            // تجاهل النتيجة إذا تغيّرت جلسة المستخدم أثناء الطلب.
            if (
                !authenticatedRef.current ||
                requestVersion !== requestVersionRef.current
            ) {
                return;
            }

            const items = response.notifications ?? [];

            notificationIdsRef.current = new Set(items.map((item) => item._id));

            setNotifications(items);
            setUnreadCount(response.unreadCount ?? 0);
        } catch (error) {
            if (
                authenticatedRef.current &&
                requestVersion === requestVersionRef.current
            ) {
                console.error('Failed to load notifications:', error);
            }
        }
    }, [clearNotifications]);

    // تحميل الإشعارات فقط بعد تسجيل الدخول.
    useEffect(() => {
        if (!isAuthenticated) {
            const requestVersion = requestVersionRef.current;
            queueMicrotask(() => {
                if (
                    !authenticatedRef.current &&
                    requestVersion === requestVersionRef.current
                ) {
                    clearNotifications();
                }
            });
            return;
        }

        queueMicrotask(() => {
            if (authenticatedRef.current) {
                void refreshNotifications();
            }
        });
    }, [isAuthenticated, refreshNotifications, clearNotifications]);

    // استقبال الإشعارات المباشرة للمستخدم المسجّل فقط.
    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const handleNotification = (notification: AppNotifications) => {
            if (!authenticatedRef.current || !notification?._id) {
                return;
            }

            if (notificationIdsRef.current.has(notification._id)) {
                return;
            }

            notificationIdsRef.current.add(notification._id);

            setNotifications((previous) => {
                if (previous.some((item) => item._id === notification._id)) {
                    return previous;
                }

                return [notification, ...previous].slice(0, 50);
            });

            if (!notification.readAt) {
                setUnreadCount((previous) => previous + 1);
            }
        };

        socket.on('notification:new', handleNotification);

        return () => {
            socket.off('notification:new', handleNotification);
        };
    }, [isAuthenticated]);

    const markAsRead = useCallback(
        async (notificationId: string) => {
            if (!authenticatedRef.current) {
                return;
            }

            const requestVersion = requestVersionRef.current;

            const notification = notifications.find(
                (item) => item._id === notificationId,
            );

            const wasUnread = !!notification && !notification.readAt;

            try {
                await markNotificationAsRead(notificationId);

                if (
                    !authenticatedRef.current ||
                    requestVersion !== requestVersionRef.current
                ) {
                    return;
                }

                setNotifications((previous) =>
                    previous.map((item) =>
                        item._id === notificationId
                            ? {
                                  ...item,
                                  readAt:
                                      item.readAt ?? new Date().toISOString(),
                              }
                            : item,
                    ),
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

    const markAllAsRead = useCallback(async () => {
        if (!authenticatedRef.current) {
            return;
        }

        const requestVersion = requestVersionRef.current;

        try {
            await markAllNotificationsAsRead();

            if (
                !authenticatedRef.current ||
                requestVersion !== requestVersionRef.current
            ) {
                return;
            }

            const now = new Date().toISOString();

            setNotifications((previous) =>
                previous.map((item) => ({
                    ...item,
                    readAt: item.readAt ?? now,
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

export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            'useNotifications must be used inside NotificationProvider',
        );
    }

    return context;
};
