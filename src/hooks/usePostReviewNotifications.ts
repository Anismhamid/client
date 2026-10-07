import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import socket from '../socket/globalSocket';
import { path, productsPathes } from '../routes/routes';

export type NotificationType =
    | 'post_approved'
    | 'post_rejected'
    | 'post_pending_review'
    | 'admin';

export interface AppNotificationData {
    postId?: string | null;

    screen?: string | null;

    category?: string;

    subcategory?: string;

    brand?: string;

    productName?: string;

    rejectionReason?: string;

    [key: string]: unknown;
}

export interface AppNotification {
    _id: string;

    type: NotificationType | string;

    title: string;

    body?: string;

    data?: AppNotificationData;

    readAt?: string | null;

    createdAt: string;

    updatedAt?: string;
}

type ToastFn = (
    message: string,
    severity: 'success' | 'error' | 'info',
    onClick?: () => void,
) => void;

interface Options {
    enabled: boolean;

    toast: ToastFn;

    onReceive?: (notification: AppNotification) => void;
}

/**
 * الصفحات المسموح للإشعارات بالانتقال إليها.
 *
 * الأدمن لا يرسل URL.
 * الأدمن يرسل فقط:
 *
 * home
 * jobs
 * posts
 * myPosts
 * notifications
 *
 * وهنا نحولها إلى Route حقيقي.
 */
const notificationRoutes: Record<string, string> = {
    home: path.Home,
    jobs: path.jobs,
    posts: productsPathes.categories,
    myPosts: path.MyAdsDashboard,
    profile: path.Profile,
    notifications: path.Notifications,
};

const getNotificationRoute = (screen?: string | null): string | null => {
    if (!screen) {
        return null;
    }

    return notificationRoutes[screen] ?? null;
};

export function usePostReviewNotifications({
    enabled,
    toast,
    onReceive,
}: Options) {
    const navigate = useNavigate();

    const toastRef = useRef<ToastFn>(toast);

    const onReceiveRef = useRef<
        ((notification: AppNotification) => void) | undefined
    >(onReceive);

    const navigateRef = useRef(navigate);

    const seenRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        toastRef.current = toast;

        onReceiveRef.current = onReceive;

        navigateRef.current = navigate;
    }, [toast, onReceive, navigate]);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const handler = (notification: AppNotification) => {
            if (!notification?._id) {
                return;
            }

            /**
             * منع الإشعار المكرر
             * خصوصًا بعد reconnect.
             */
            if (seenRef.current.has(notification._id)) {
                return;
            }

            seenRef.current.add(notification._id);

            /**
             * أخبر NotificationContext
             * أو أي component مستمع.
             */
            onReceiveRef.current?.(notification);

            /**
             * المسار القادم من Admin.
             *
             * مثال:
             *
             * data: {
             *     screen: 'jobs'
             * }
             *
             * يتحول إلى:
             *
             * /jobs
             */
            const route = getNotificationRoute(notification.data?.screen);

            const navigateToNotification = route
                ? () => {
                      navigateRef.current(route);
                  }
                : undefined;

            /**
             * ADMIN NOTIFICATION
             */
            if (notification.type === 'admin') {
                toastRef.current(
                    notification.body
                        ? `${notification.title} — ${notification.body}`
                        : notification.title,
                    'info',
                    navigateToNotification,
                );

                return;
            }

            /**
             * POST APPROVED
             */
            if (notification.type === 'post_approved') {
                const postId = notification.data?.postId;

                toastRef.current(
                    notification.body
                        ? `${notification.title} — ${notification.body}`
                        : notification.title,
                    'success',
                    postId
                        ? () => navigateRef.current(`/post-details/${postId}`)
                        : navigateToNotification,
                );

                return;
            }

            /**
             * POST REJECTED
             */
            if (notification.type === 'post_rejected') {
                toastRef.current(
                    notification.body
                        ? `${notification.title} — ${notification.body}`
                        : notification.title,
                    'error',
                    navigateToNotification ??
                        (() => navigateRef.current('/my-posts')),
                );

                return;
            }

            /**
             * POST PENDING REVIEW
             */
            if (notification.type === 'post_pending_review') {
                toastRef.current(
                    notification.body
                        ? `${notification.title} — ${notification.body}`
                        : notification.title,
                    'info',
                    navigateToNotification,
                );

                return;
            }

            /**
             * أي نوع جديد مستقبلاً
             */
            toastRef.current(
                notification.body
                    ? `${notification.title} — ${notification.body}`
                    : notification.title,
                'info',
                navigateToNotification,
            );
        };

        socket.on('notification:new', handler);

        return () => {
            socket.off('notification:new', handler);
        };
    }, [enabled]);
}
