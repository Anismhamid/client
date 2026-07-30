import { useRef } from 'react';
import { Capacitor } from '@capacitor/core';

const useNotificationSound = () => {
    const messageReceivedSound = useRef(new Audio('/live-chat-353605.mp3'));

    const messageSentSound = useRef(new Audio('/live-chat-2.mp3'));

    const defaultSound = useRef(new Audio('/notification.mp3'));

    const vibrate = () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
    };

    const playNotificationSound = (
        type: 'messageReceived' | 'messageSent' | 'default' = 'default',
    ) => {
        let audio: HTMLAudioElement;

        switch (type) {
            case 'messageReceived':
                audio = messageReceivedSound.current;
                break;

            case 'messageSent':
                audio = messageSentSound.current;
                break;

            default:
                audio = defaultSound.current;
                break;
        }

        audio.volume = 1;
        audio.currentTime = 0;
        audio.play().catch(() => {});

        vibrate();
    };

    const showNotification = (message: string) => {
        // لا تعمل في Capacitor
        if (Capacitor.isNativePlatform()) {
            return;
        }

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(message);
        }
    };

    return {
        playNotificationSound,
        showNotification,
    };
};

export default useNotificationSound;
