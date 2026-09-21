/* eslint-disable @typescript-eslint/no-explicit-any */

// src/hooks/usePushSync.ts

import { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';

type PushService = typeof import('../services/pushNotifications.service');

const loadPushService = () => import('../services/pushNotifications.service');

const usePushSync = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // بنخزّن الـ service بعد ما يتحمّل، ليضل getToken sync متل قبل
    const serviceRef = useRef<PushService | null>(null);

    useEffect(() => {
        // Push Notifications تعمل فقط على Native
        if (!Capacitor.isNativePlatform()) {
            return;
        }

        let mounted = true;

        const initPush = async () => {
            try {
                console.log('📱 Initializing push notifications...');

                const svc = await loadPushService();
                serviceRef.current = svc;

                // Authentication is handled by the HttpOnly cookie.
                await svc.initializePushNotifications();

                if (!mounted) return;

                setIsInitialized(true);
                setError(null);

                console.log(
                    '✅ Push notifications initialized. Token:',
                    svc.getCurrentPushToken() ? 'available' : 'not available',
                );
            } catch (err: any) {
                console.error('❌ Failed to initialize push notifications:', err);

                if (mounted) {
                    setError(
                        err?.message ||
                            'Failed to initialize push notifications',
                    );
                    setIsInitialized(false);
                }
            }
        };

        // إعطاء التطبيق وقتًا قصيرًا للتهيئة
        const timeoutId = setTimeout(initPush, 1000);

        return () => {
            mounted = false;
            clearTimeout(timeoutId);

            // نحذف listeners فقط. لا نحذف FCM token من السيرفر،
            // لأن unmount لا يعني بالضرورة logout.
            import('@capacitor/push-notifications')
                .then(({ PushNotifications }) =>
                    PushNotifications.removeAllListeners(),
                )
                .catch(console.error);

            console.log('🧹 Push notification listeners cleaned up');
        };
    }, []);

    /**
     * تحديث FCM token يدويًا.
     * الـ backend بيعرف المستخدم من HttpOnly cookie.
     */
    const refreshPushToken = useCallback(async () => {
        try {
            const svc = serviceRef.current ?? (await loadPushService());
            serviceRef.current = svc;

            const result = await svc.refreshToken();

            console.log('🔄 Push token refresh result:', result);

            return result;
        } catch (err) {
            console.error('❌ Failed to refresh push token:', err);

            return false;
        }
    }, []);

    /**
     * إزالة FCM token من حساب المستخدم.
     * لازم تنستدعى أثناء logout، قبل مسح HttpOnly cookie.
     */
    const clearPushToken = useCallback(async () => {
        try {
            const svc = serviceRef.current ?? (await loadPushService());
            serviceRef.current = svc;

            await svc.removePushToken();

            console.log('🗑️ Push token removed from server');

            return true;
        } catch (err) {
            console.error('❌ Failed to remove push token:', err);

            return false;
        }
    }, []);

    // sync زي قبل. بيرجّع null قبل ما يتحمّل الـ service (يعني قبل الـ init)
    const getToken = useCallback(
        () => serviceRef.current?.getCurrentPushToken() ?? null,
        [],
    );

    return {
        isInitialized,
        error,
        refreshPushToken,
        clearPushToken,
        getToken,
    };
};

export default usePushSync;