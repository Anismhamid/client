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
import useToken from './useToken';

const usePushSync = () => {
    const { token } = useToken(); // auth هو التوكن نفسه (string)
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // ✅ فقط على الأجهزة النative
        if (!Capacitor.isNativePlatform()) {
            console.log('ℹ️ Not running on native platform');
            return;
        }

        let mounted = true;

        const initPush = async () => {
            try {
                // 1. التحقق من وجود مستخدم مسجل دخول
                if (!token) {
                    console.log('ℹ️ No auth token, skipping push init');
                    return;
                }

                console.log('📱 Initializing push notifications...');

                // 2. تهيئة الإشعارات باستخدام auth كـ token
                await initializePushNotifications(token);

                if (mounted) {
                    setIsInitialized(true);
                    setError(null);
                    console.log(
                        '✅ Push notifications initialized successfully',
                    );

                    // 3. التحقق من التوكن
                    const token = getCurrentPushToken();
                    console.log(
                        '🔑 Current push token:',
                        token ? '✅ Available' : '❌ Not available',
                    );
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error(
                    '❌ Failed to initialize push notifications:',
                    error,
                );
                if (mounted) {
                    setError(
                        error.message ||
                            'Failed to initialize push notifications',
                    );
                    setIsInitialized(false);
                }
            }
        };

        // ✅ تأخير التهيئة قليلاً للتأكد من تحميل كل شيء
        const timeoutId = setTimeout(() => {
            initPush();
        }, 1000);

        // ✅ تنظيف عند إلغاء التثبيت أو تسجيل الخروج
        return () => {
            mounted = false;
            clearTimeout(timeoutId);

            // إزالة التوكن عند تسجيل الخروج
            if (token) {
                removePushToken(token).catch(console.error);
            }

            // إزالة المستمعين
            if (Capacitor.isNativePlatform()) {
                PushNotifications.removeAllListeners().catch(console.error);
            }

            console.log('🧹 Push notifications cleaned up');
        };
    }, [token]); // ✅ إعادة التهيئة عند تغيير التوكن

    // ✅ دالة لتحديث التوكن يدوياً
    const refreshPushToken = async () => {
        if (!token) {
            console.warn('⚠️ No token available');
            return false;
        }

        try {
            const result = await refreshToken(token);
            console.log('🔄 Token refresh result:', result);
            return result;
        } catch (error) {
            console.error('❌ Failed to refresh token:', error);
            return false;
        }
    };

    return {
        isInitialized,
        error,
        refreshPushToken,
        getToken: getCurrentPushToken,
    };
};

export default usePushSync;
