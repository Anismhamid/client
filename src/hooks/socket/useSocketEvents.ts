/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { showNewPostToast } from '../../atoms/bootStrapToast/SocketToast';

import {
    showError,
    showInfo,
    showSuccess,
} from '../../atoms/toasts/ReactToast';

import { useUser } from '../useUSer';

import RoleType from '../../interfaces/UserType';

import socket from '../../socket/globalSocket';

import useNotificationSound from './useNotificationSound';

import { Posts } from '../../interfaces/Posts';

import { productsPathes } from '../../routes/routes';

import { useChat } from '../useChat';

import { LocalMessage } from '../../interfaces/chat/localMessage';

import { User } from '../../interfaces/User';

// ============================================================================
// SERVER NOTIFICATION
// ============================================================================

export interface ServerNotification {
    _id: string;

    user?: string;

    type: 'post_approved' | 'post_rejected' | 'post_pending_review';

    title: string;

    body?: string;

    data?: {
        postId?: string;
    };

    readAt: string | null;

    createdAt: string;

    updatedAt: string;
}

// ============================================================================
// PREVENT DUPLICATE SOCKET NOTIFICATIONS
// ============================================================================
//
// هذا فقط لمنع نفس Socket event من الظهور مرتين.
// لا تعتمد عليه لمعرفة unread notifications.
//
// ============================================================================

const seenNotificationIds = new Set<string>();

// ============================================================================
// HOOK
// ============================================================================

const useSocketEvents = () => {
    const { auth, isLoggedIn, isAuthLoading } = useUser();

    const userId = auth?._id;

    const userRole = auth?.role;

    const navigate = useNavigate();

    const { playNotificationSound, showNotification } = useNotificationSound();

    const {
        currentChatId,
        updateMessageStatus,
        addMessageForUser,
        setUnreadForUser,
        messages,
    } = useChat();

    // =========================================================================
    // MARK MESSAGES AS SEEN
    // =========================================================================

    useEffect(() => {
        if (
            !isLoggedIn ||
            isAuthLoading ||
            !currentChatId ||
            !userId ||
            !messages
        ) {
            return;
        }

        const userMessages = messages[currentChatId] || [];

        userMessages.forEach((msg) => {
            if (msg.from?._id !== userId && msg.status === 'sent') {
                updateMessageStatus(currentChatId, msg._id, 'seen');

                socket.emit('message:seen', {
                    messageId: msg._id,
                    from: userId,
                    to: msg.from?._id,
                });
            }
        });
    }, [
        currentChatId,
        messages,
        userId,
        updateMessageStatus,
        isLoggedIn,
        isAuthLoading,
    ]);

    // =========================================================================
    // SOCKET CONNECTION / EVENTS
    // =========================================================================

    useEffect(() => {
        if (!isLoggedIn || isAuthLoading || !userId) {
            return;
        }

        // =====================================================================
        // NEW USER REGISTERED
        // =====================================================================

        const handleUserRegistered = (user: User) => {
            if (userRole !== RoleType.Admin) {
                return;
            }

            playNotificationSound();

            const message = `${user.email} ${user.role} مستخدم جديد تم تسجيله`;

            showInfo(message);

            showNotification(message);
        };

        // =====================================================================
        // USER LOGGED IN
        // =====================================================================

        const handleUserLoggedIn = (user: User) => {
            if (userRole !== RoleType.Admin) {
                return;
            }

            playNotificationSound();

            const message =
                user.role === RoleType.Admin
                    ? `${user.email} مستخدم أدمن سجل الدخول`
                    : user.role === RoleType.Moderator
                      ? `${user.email} مستخدم مشرف سجل الدخول`
                      : `${user.email} مستخدم سجل الدخول`;

            showInfo(message);

            showNotification(message);
        };

        // =====================================================================
        // NEW PRODUCT
        // =====================================================================
        //
        // هذا event عام.
        //
        // Backend:
        //
        // io.emit('product:new', post)
        //
        // يجب أن يحدث فقط بعد قبول الإعلان.
        //
        // =====================================================================

        const handleNewProduct = (newPost: Posts) => {
            playNotificationSound();

            showNewPostToast({
                navigate,

                navigateTo:
                    `${productsPathes.postsDetails}/` +
                    `${newPost.category}/` +
                    `${newPost.brand}/` +
                    `${newPost._id}`,

                post: newPost,
            });

            showNotification(`تم إضافة منشور جديد: ${newPost.product_name}`);
        };

        // =====================================================================
        // USER NOTIFICATION
        // =====================================================================

        const handleNotification = (notification: ServerNotification) => {
            // -----------------------------------------------------------------
            // Prevent duplicate event
            // -----------------------------------------------------------------

            if (seenNotificationIds.has(notification._id)) {
                return;
            }

            seenNotificationIds.add(notification._id);

            // -----------------------------------------------------------------
            // Notification text
            // -----------------------------------------------------------------

            const text = notification.body
                ? `${notification.title} — ${notification.body}`
                : notification.title;

            // -----------------------------------------------------------------
            // Toast by notification type
            // -----------------------------------------------------------------

            switch (notification.type) {
                case 'post_approved':
                    showSuccess(text);
                    break;

                case 'post_rejected':
                    showError(text);
                    break;

                case 'post_pending_review':
                    showInfo(text);
                    break;

                default:
                    showInfo(text);
            }

            // -----------------------------------------------------------------
            // Sound
            // -----------------------------------------------------------------

            playNotificationSound();

            // -----------------------------------------------------------------
            // Native / browser notification
            // -----------------------------------------------------------------

            showNotification(notification.title);

            // -----------------------------------------------------------------
            // Dispatch global application event
            //
            // Pages like My Ads can listen to this and refetch.
            // -----------------------------------------------------------------

            window.dispatchEvent(
                new CustomEvent('app:notification', {
                    detail: notification,
                }),
            );
        };

        // =====================================================================
        // MESSAGE RECEIVED
        // =====================================================================

        const messageReceived = (msg: LocalMessage) => {
            // Ignore own messages
            if (msg.from?._id === userId) {
                return;
            }

            const otherUserId = msg.from?._id;

            if (!otherUserId) {
                return;
            }

            const isCurrentChat = currentChatId === otherUserId;

            addMessageForUser(otherUserId, msg);

            if (!isCurrentChat) {
                setUnreadForUser(otherUserId, (prev) => (prev || 0) + 1);

                playNotificationSound('messageReceived');

                showNotification(
                    `رسالة من ${msg.from?.name?.first ?? 'مستخدم'}`,
                );
            } else {
                socket.emit('message:seen', {
                    messageId: msg._id,
                    from: userId,
                    to: otherUserId,
                });
            }
        };

        // =====================================================================
        // MESSAGE SENT
        // =====================================================================

        const messageSent = (msg: any) => {
            if (msg.from?._id === userId) {
                playNotificationSound('messageSent');
            }
        };

        // =====================================================================
        // REGISTER EVENTS
        // =====================================================================

        socket.on('message:sent', messageSent);

        socket.on('message:received', messageReceived);

        socket.on('user:registered', handleUserRegistered);

        socket.on('user:newUserLoggedIn', handleUserLoggedIn);

        socket.on('product:new', handleNewProduct);

        socket.on('notification:new', handleNotification);

        // =====================================================================
        // CONNECT
        // =====================================================================

        if (!socket.connected) {
            socket.connect();
        }

        // =====================================================================
        // CLEANUP
        // =====================================================================

        return () => {
            socket.off('message:sent', messageSent);

            socket.off('message:received', messageReceived);

            socket.off('user:registered', handleUserRegistered);

            socket.off('user:newUserLoggedIn', handleUserLoggedIn);

            socket.off('product:new', handleNewProduct);

            socket.off('notification:new', handleNotification);
        };
    }, [
        userId,
        userRole,
        navigate,
        playNotificationSound,
        addMessageForUser,
        setUnreadForUser,
        showNotification,
        isLoggedIn,
        isAuthLoading,
        currentChatId,
    ]);
};

export default useSocketEvents;
