import {
    PushNotifications,
    Token,
} from '@capacitor/push-notifications';

import axios from 'axios';

const api = `${import.meta.env.VITE_API_URL}/users`;


export async function initPushNotifications(authToken: string) {

    // منع تكرار listeners
    await PushNotifications.removeAllListeners();


    let permission =
        await PushNotifications.checkPermissions();


    if (permission.receive !== 'granted') {

        permission =
            await PushNotifications.requestPermissions();

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


    PushNotifications.addListener(
        'registration',
        async (token: Token) => {

            console.log(
                'FCM TOKEN:',
                token.value
            );


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


                console.log(
                    'Push token saved'
                );


            } catch(error) {

                console.error(
                    'Saving push token failed',
                    error
                );

            }

        }
    );


    PushNotifications.addListener(
        'registrationError',
        (error) => {

            console.error(
                'FCM registration error',
                error
            );

        }
    );


    PushNotifications.addListener(
        'pushNotificationReceived',
        (notification) => {

            console.log(
                'Foreground notification:',
                notification
            );

        }
    );


    PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (action) => {

            console.log(
                'Notification clicked:',
                action
            );

        }
    );


    await PushNotifications.register();

}