import {
    PushNotifications,
    Token,
} from '@capacitor/push-notifications';
import api from '../services/api';


export async function initPushNotifications() {
    await PushNotifications.removeAllListeners();

    await PushNotifications.addListener(
        'registration',
        async (token: Token) => {
            try {
                await api.patch('/users/push-token', {
                    pushToken: token.value,
                });

                console.log(
                    '✅ Push token saved successfully',
                );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error(
                    '❌ Failed to save push token:',
                    error?.response?.data || error?.message,
                );
            }
        },
    );

    await PushNotifications.addListener(
        'registrationError',
        (error) => {
            console.error(
                '❌ FCM registration error:',
                error,
            );
        },
    );

    let permission =
        await PushNotifications.checkPermissions();

    if (permission.receive !== 'granted') {
        permission =
            await PushNotifications.requestPermissions();
    }

    if (permission.receive !== 'granted') {
        console.warn(
            '⚠️ Push notification permission was not granted',
        );
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