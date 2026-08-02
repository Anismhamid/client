/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
// import {useTranslation} from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { showNewPostToast } from '../../atoms/bootStrapToast/SocketToast';
import { showInfo } from '../../atoms/toasts/ReactToast';
import { useUser } from '../useUSer';
import { UserRegister } from '../../interfaces/User';
import RoleType from '../../interfaces/UserType';
import socket from '../../socket/globalSocket';
import useNotificationSound from './useNotificationSound';
import { Posts } from '../../interfaces/Posts';
import { productsPathes } from '../../routes/routes';
import { useChat } from '../useChat';
import { LocalMessage } from '../../interfaces/chat/localMessage';

const useSocketEvents = () => {
    const { auth } = useUser();

    const userId = auth?._id;
    const userRole = auth?.role;
    const userName = auth?.name?.first;

    const navigate = useNavigate();
    const { playNotificationSound, showNotification } = useNotificationSound();
    const {
        currentChatId,
        updateMessageStatus,
        addMessageForUser,
        setUnreadForUser,
        messages,
    } = useChat();

    useEffect(() => {
        if (!currentChatId || !userId || !messages) return;

        const userMessages = messages[currentChatId] || [];

        userMessages.forEach((msg) => {
            if (msg.from?._id !== userId && msg.status === 'sent') {
                // تحديث محليًا
                updateMessageStatus(currentChatId, msg._id, 'seen');

                // إرسال إلى السيرفر
                socket.emit('message:seen', {
                    messageId: msg._id,
                    from: userId,
                    to: msg.from?._id,
                });
            }
        });
    }, [currentChatId, messages, userId, updateMessageStatus]);

    useEffect(() => {
        if (!userId) return;

        const isAdminOrModerator =
            userRole === RoleType.Admin || userRole === RoleType.Moderator;

        // הגדרת נתוני התחברות
        socket.auth = {
            userId: userId,
            role: userRole,
            name: userName,
            withCredentials: true,
        };

        // התחברות לחדר אדמין
        const handleConnect = () => {
            socket.emit('join-user', {
                userId: userId,
            });

            if (isAdminOrModerator)
                socket.emit('admins', { userId: userId, role: userRole });
        };

        socket.on('connect', handleConnect);

        // התחברות אם לא מחובר
        if (!socket.connected) socket.connect();

        // הודעת שגיאה
        const handleError = (err: any) => console.error('Socket error:', err);

        // ניתוק
        // const handleDisconnect = (reason: any) => {
        //     console.warn('Socket disconnected:', reason);
        //     setTimeout(() => {
        //         if (!socket.connected) socket.connect();
        //     }, 1000);
        // };

        const handleDisconnect = (reason: any) => {
            console.warn('Socket disconnected:', reason);
        };

        // משתמש חדש נרשם
        const handleUserRegistered = (user: UserRegister) => {
            if (userRole === RoleType.Admin) {
                playNotificationSound();
                showInfo(`${user.email} ${user.role} مستخدم جديد تم تسجيله`);
                showNotification(
                    `${user.email} ${user.role} مستخدم جديد تم تسجيله`,
                );
            }
        };

        // משתמש התחבר
        const handleUserLoggedIn = (user: UserRegister) => {
            if (userRole === RoleType.Admin) {
                playNotificationSound();

                const msg =
                    user.role === RoleType.Admin
                        ? `${user.email} משתמש אדמין התחבר`
                        : user.role === RoleType.Moderator
                          ? `${user.email} משתמש מנחה התחבר`
                          : `${user.email} משתמש התחבר`;
                showInfo(msg);
                showNotification(msg);
            }
        };

        const handleNewProduct = (newPost: Posts) => {
            playNotificationSound();

            showNewPostToast({
                navigate,
                navigateTo: `${productsPathes.postsDetails}/${newPost.category}/${newPost.brand}/${newPost._id}`,
                post: newPost,
            });

            showNotification(`تم إضافة منشور جديد: ${newPost.product_name}`);
        };

        // const messageReceived = (msg: any) => {
        // 	// إذا المرسل هو المستخدم الحالي
        // 	if (msg.to?._id === auth._id) {
        // 		playNotificationSound("messageReceived");
        // 		if (addMessageForUser !== msg.chatId)
        // 			new Notification(`رسالة من ${msg.from?.name.first}`, {
        // 				body: msg.text,
        // 			});
        // 	}
        // };
        const messageReceived = (msg: LocalMessage) => {
            if (msg.from?._id === userId) {
                return;
            }

            // const otherUserId =
            //     msg.from?._id === userId ? msg.to?._id : msg.from?._id;

            const otherUserId = msg.from?._id;

            addMessageForUser(otherUserId as string, msg);

            // showInfo(`لديك رسالة جديده ${msg.from?.name?.first ?? 'user'}`);

            if (otherUserId) {
                // setUnreadForUser(
                //     otherUserId as string,
                //     (prev) => (prev || 0) + 1,
                // );

                setUnreadForUser(otherUserId, (prev) => (prev || 0) + 1);

                playNotificationSound('messageReceived');

                showNotification(
                    `رسالة من ${msg.from?.name?.first ?? 'مستخدم'}`,
                );
            }
        };

        const messageSent = (msg: any) => {
            if (msg.from?._id === userId) {
                playNotificationSound('messageSent');
            }
        };

        // חיבור מאזינים
        socket.on('error', handleError);
        socket.on('disconnect', handleDisconnect);
        socket.on('message:sent', messageSent);
        socket.on('message:received', messageReceived);
        socket.on('user:registered', handleUserRegistered);
        socket.on('user:newUserLoggedIn', handleUserLoggedIn);
        socket.on('product:new', handleNewProduct);

        // ניקוי מאזינים
        return () => {
            socket.off('connect', handleConnect);
            socket.off('error', handleError);
            socket.off('disconnect', handleDisconnect);
            socket.off('message:sent', messageSent);
            socket.off('message:received', messageReceived);
            socket.off('user:registered', handleUserRegistered);
            socket.off('user:newUserLoggedIn', handleUserLoggedIn);
            socket.off('product:new', handleNewProduct);
        };
    }, [
        userId,
        userRole,
        userName,
        navigate,
        playNotificationSound,
        addMessageForUser,
        setUnreadForUser,
        showNotification,
    ]);
};

export default useSocketEvents;
