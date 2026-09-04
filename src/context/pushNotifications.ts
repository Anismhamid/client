import { PushNotifications, Token } from '@capacitor/push-notifications';

import axios from 'axios';

const api = `${process.env.VITE_API_URL}/users`;

export async function initPushNotifications(authToken: string) {
    await PushNotifications.removeAllListeners();

    await PushNotifications.addListener(
        'registration',
        async (token: Token) => {

            try {
                await axios.patch(
                    `${api}/push-token`,
                    {
                        pushToken: token.value,
                    },
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    },
                );
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error('❌ ERROR:', error.response?.data || error.message);
            }
        },
    );

    await PushNotifications.addListener('registrationError', (error) => {
        console.error('FCM ERROR:', error);
    });

    let permission = await PushNotifications.checkPermissions();

    if (permission.receive !== 'granted') {
        permission = await PushNotifications.requestPermissions();
    }

    if (permission.receive !== 'granted') {
        return;
    }

    await PushNotifications.createChannel({
        id: 'chat',
        name: 'Chat Messages',
        importance: 5,
        sound: 'notification',
        vibration: true,
    });

    await PushNotifications.register();
}
