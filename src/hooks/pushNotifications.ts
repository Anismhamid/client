import { PushNotifications, Token } from '@capacitor/push-notifications';

import axios from 'axios';

const api = `${import.meta.env.VITE_API_URL}/users`;

export async function initPushNotifications(authToken: string) {
    // منع تكرار listeners
    await PushNotifications.removeAllListeners();

    let permission = await PushNotifications.checkPermissions();

    if (permission.receive !== 'granted') {
        permission = await PushNotifications.requestPermissions();
    }

    if (permission.receive !== 'granted') {
        console.log('Push permission denied');
        return;
    }

    // Android notification channel
    await PushNotifications.createChannel({
        id: 'chat',
        name: 'Chat Messages',
        description: 'Chat notifications',
        importance: 5,
        sound: 'notification',
        vibration: true,
    });

    await PushNotifications.addListener(
        'registration',
        async (token: Token) => {
            console.log('🔥 TOKEN:', token.value);

            console.log('AUTH TOKEN:', authToken);

            console.log('URL:', `${api}/push-token`);

            const body = {
                pushToken: token.value,
            };

            console.log('BODY:', body);

            try {
                const res = await axios.patch(`${api}/push-token`, body, {
                    headers: {
                        Authorization: authToken,
                    },
                });

                console.log('✅ SAVED:', res.data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log('❌ ERROR STATUS:', error.response?.status);

                console.log('❌ ERROR DATA:', error.response?.data);
            }
        },
    );

    PushNotifications.addListener('registrationError', (error) => {
        console.error('FCM registration error', error);
    });

    PushNotifications.addListener(
        'pushNotificationReceived',
        (notification) => {
            console.log('Foreground notification:', notification);
        },
    );

    PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (action) => {
            console.log('Notification clicked:', action);
        },
    );

    await PushNotifications.register();
}
