import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

type SoundType = 'messageReceived' | 'messageSent' | 'default';

// Audio objects على مستوى الـ module، بتنعمل مرة وحدة (lazy) وبتنشارك.
// هيك ما في تعديل على قيمة جاية من hook (React Compiler بيمنعه).
let soundsCache: Record<SoundType, HTMLAudioElement> | null = null;

const getSounds = () => {
    if (!soundsCache) {
        soundsCache = {
            messageReceived: new Audio('/live-chat-353605.mp3'),
            messageSent: new Audio('/live-chat-2.mp3'),
            default: new Audio('/notification.mp3'),
        };
    }
    return soundsCache;
};

const playSound = (type: SoundType) => {
    const audio = getSounds()[type];

    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
};

const vibrate = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
    }
};

const useNotificationSound = () => {
    // دالة ثابتة: effect تبع useSocketEvents ما يعيد تسجيل الـ listeners بكل render
    const playNotificationSound = useCallback(
        (type: SoundType = 'default') => playSound(type),
        [],
    );

    const showNotification = useCallback(async (message: string) => {
        // على التطبيق: الإشعار بيجي من FCM
        if (Capacitor.isNativePlatform()) return;

        if (
            typeof window === 'undefined' ||
            typeof window.Notification === 'undefined'
        ) {
            return;
        }

        const display = () => {
            new window.Notification(message, {
                icon: '/d3.png',
                tag: 'chat-message',
            });
            vibrate();
        };

        if (window.Notification.permission === 'granted') {
            display();
            return;
        }

        if (window.Notification.permission !== 'denied') {
            const permission = await window.Notification.requestPermission();
            if (permission === 'granted') display();
        }
    }, []);

    return { playNotificationSound, showNotification };
};

export default useNotificationSound;