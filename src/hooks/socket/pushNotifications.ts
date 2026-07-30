import { PushNotifications, Token } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

import axios from 'axios';

const api = `${import.meta.env.VITE_API_URL}/users`;

await LocalNotifications.createChannel({
    id: 'default',
    name: 'Default',
    description: 'Default notifications',
    importance: 5,
    visibility: 1,
    sound: 'default',
});

export async function initPushNotifications(authToken: string) {
    let permission = await PushNotifications.checkPermissions();

    if (permission.receive !== 'granted') {
        permission = await PushNotifications.requestPermissions();
    }

    if (permission.receive !== 'granted') {
        return;
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token: Token) => {
        console.log('FCM TOKEN', token);

        await axios.patch(
            `${api}/push-token`,
            {
                pushToken: token,
            },
            {
                headers: {
                    Authorization: authToken,
                },
            },
        );
    });

    PushNotifications.addListener(
        'pushNotificationReceived',
        (notification) => {
            console.log('Push received', notification);
        },
    );

    PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (action) => {
            console.log('Push clicked', action);
        },
    );
}
