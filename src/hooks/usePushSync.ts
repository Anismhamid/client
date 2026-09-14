/* eslint-disable @typescript-eslint/no-explicit-any */

// src/hooks/usePushSync.ts

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import {
    initializePushNotifications,
    removePushToken,
    refreshToken,
    getCurrentPushToken,
} from '../services/pushNotifications.service';
import { PushNotifications } from '@capacitor/push-notifications';

const usePushSync = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Push Notifications تعمل فقط على Native
        if (!Capacitor.isNativePlatform()) {
            console.log(
                'ℹ️ Not running on native platform',
            );
            return;
        }

        let mounted = true;

        const initPush = async () => {
            try {
                console.log(
                    '📱 Initializing push notifications...',
                );

                // Authentication is handled by the HttpOnly cookie.
                await initializePushNotifications();

                if (!mounted) return;

                setIsInitialized(true);
                setError(null);

                console.log(
                    '✅ Push notifications initialized successfully',
                );

                const pushToken =
                    getCurrentPushToken();

                console.log(
                    '🔑 Current push token:',
                    pushToken
                        ? '✅ Available'
                        : '❌ Not available',
                );
            } catch (error: any) {
                console.error(
                    '❌ Failed to initialize push notifications:',
                    error,
                );

                if (mounted) {
                    setError(
                        error?.message ||
                            'Failed to initialize push notifications',
                    );

                    setIsInitialized(false);
                }
            }
        };

        // إعطاء التطبيق وقتًا قصيرًا للتهيئة
        const timeoutId = setTimeout(() => {
            initPush();
        }, 1000);

        return () => {
            mounted = false;
            clearTimeout(timeoutId);

            // هنا نحذف listeners فقط.
            //
            // لا نحذف FCM token من السيرفر هنا،
            // لأن unmount لا يعني بالضرورة logout.
            if (Capacitor.isNativePlatform()) {
                PushNotifications
                    .removeAllListeners()
                    .catch(console.error);
            }

            console.log(
                '🧹 Push notification listeners cleaned up',
            );
        };
    }, []);

    /**
     * تحديث FCM token يدويًا
     *
     * لا يحتاج Auth JWT.
     * الـ backend سيعرف المستخدم من HttpOnly cookie.
     */
    const refreshPushToken = async () => {
        try {
            const result = await refreshToken();

            console.log(
                '🔄 Push token refresh result:',
                result,
            );

            return result;
        } catch (error) {
            console.error(
                '❌ Failed to refresh push token:',
                error,
            );

            return false;
        }
    };

    /**
     * إزالة FCM token من حساب المستخدم.
     *
     * يجب استدعاؤها أثناء logout،
     * قبل مسح HttpOnly authentication cookie.
     */
    const clearPushToken = async () => {
        try {
            await removePushToken();

            console.log(
                '🗑️ Push token removed from server',
            );

            return true;
        } catch (error) {
            console.error(
                '❌ Failed to remove push token:',
                error,
            );

            return false;
        }
    };

    return {
        isInitialized,
        error,
        refreshPushToken,
        clearPushToken,
        getToken: getCurrentPushToken,
    };
};

export default usePushSync;