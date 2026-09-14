/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { showNewPostToast } from '../../atoms/bootStrapToast/SocketToast';
import { showInfo } from '../../atoms/toasts/ReactToast';

import { useUser } from '../useUSer';
import RoleType from '../../interfaces/UserType';
import socket from '../../socket/globalSocket';

import useNotificationSound from './useNotificationSound';

import { Posts } from '../../interfaces/Posts';
import { productsPathes } from '../../routes/routes';

import { useChat } from '../useChat';

import { LocalMessage } from '../../interfaces/chat/localMessage';
import { User } from '../../interfaces/User';

const useSocketEvents = () => {
    const { auth, isLoggedIn, isAuthLoading } = useUser();

    const userId = auth?._id;
    const userRole = auth?.role;

    const navigate = useNavigate();

    const {
        playNotificationSound,
        showNotification,
    } = useNotificationSound();

    const {
        currentChatId,
        updateMessageStatus,
        addMessageForUser,
        setUnreadForUser,
        messages,
    } = useChat();

    // ======================================================
    // MARK MESSAGES AS SEEN
    // ======================================================

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

        const userMessages =
            messages[currentChatId] || [];

        userMessages.forEach((msg) => {
            if (
                msg.from?._id !== userId &&
                msg.status === 'sent'
            ) {
                updateMessageStatus(
                    currentChatId,
                    msg._id,
                    'seen',
                );

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

    // ======================================================
    // SOCKET CONNECTION
    // ======================================================

    useEffect(() => {
        if (
            !isLoggedIn ||
            isAuthLoading ||
            !userId
        ) {
            return;
        }

        // --------------------------------------------------
        // IMPORTANT:
        // Do NOT send userId / role / name through socket.auth.
        //
        // Authentication is now handled by the HttpOnly cookie.
        // --------------------------------------------------

        const handleConnect = () => {
            console.log(
                '🔌 Socket connected:',
                socket.id,
            );
        };

        const handleError = (err: any) => {
            console.error(
                '❌ Socket error:',
                err,
            );
        };

        const handleConnectError = (err: any) => {
            console.error(
                '❌ Socket connection error:',
                err?.message || err,
            );
        };

        const handleDisconnect = (reason: any) => {
            console.warn(
                '🔌 Socket disconnected:',
                reason,
            );
        };

        // ==================================================
        // NEW USER REGISTERED
        // ==================================================

        const handleUserRegistered = (
            user: User,
        ) => {
            if (userRole !== RoleType.Admin) {
                return;
            }

            playNotificationSound();

            const message =
                `${user.email} ${user.role} مستخدم جديد تم تسجيله`;

            showInfo(message);
            showNotification(message);
        };

        // ==================================================
        // USER LOGGED IN
        // ==================================================

        const handleUserLoggedIn = (
            user: User,
        ) => {
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

        // ==================================================
        // NEW PRODUCT
        // ==================================================

        const handleNewProduct = (
            newPost: Posts,
        ) => {
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

            showNotification(
                `تم إضافة منشور جديد: ${newPost.product_name}`,
            );
        };

        // ==================================================
        // MESSAGE RECEIVED
        // ==================================================

        const messageReceived = (
            msg: LocalMessage,
        ) => {
            // Ignore messages sent by current user
            if (msg.from?._id === userId) {
                return;
            }

            const otherUserId =
                msg.from?._id;

            if (!otherUserId) {
                return;
            }

            addMessageForUser(
                otherUserId,
                msg,
            );

            setUnreadForUser(
                otherUserId,
                (prev) => (prev || 0) + 1,
            );

            playNotificationSound(
                'messageReceived',
            );

            showNotification(
                `رسالة من ${
                    msg.from?.name?.first ??
                    'مستخدم'
                }`,
            );
        };

        // ==================================================
        // MESSAGE SENT
        // ==================================================

        const messageSent = (
            msg: any,
        ) => {
            if (msg.from?._id === userId) {
                playNotificationSound(
                    'messageSent',
                );
            }
        };

        // ==================================================
        // REGISTER EVENTS
        // ==================================================

        socket.on(
            'connect',
            handleConnect,
        );

        socket.on(
            'connect_error',
            handleConnectError,
        );

        socket.on(
            'error',
            handleError,
        );

        socket.on(
            'disconnect',
            handleDisconnect,
        );

        socket.on(
            'message:sent',
            messageSent,
        );

        socket.on(
            'message:received',
            messageReceived,
        );

        socket.on(
            'user:registered',
            handleUserRegistered,
        );

        socket.on(
            'user:newUserLoggedIn',
            handleUserLoggedIn,
        );

        socket.on(
            'product:new',
            handleNewProduct,
        );

        // ==================================================
        // CONNECT
        // ==================================================

        if (!socket.connected) {
            socket.connect();
        }

        // ==================================================
        // CLEANUP
        // ==================================================

        return () => {
            socket.off(
                'connect',
                handleConnect,
            );

            socket.off(
                'connect_error',
                handleConnectError,
            );

            socket.off(
                'error',
                handleError,
            );

            socket.off(
                'disconnect',
                handleDisconnect,
            );

            socket.off(
                'message:sent',
                messageSent,
            );

            socket.off(
                'message:received',
                messageReceived,
            );

            socket.off(
                'user:registered',
                handleUserRegistered,
            );

            socket.off(
                'user:newUserLoggedIn',
                handleUserLoggedIn,
            );

            socket.off(
                'product:new',
                handleNewProduct,
            );
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
    ]);
};

export default useSocketEvents;