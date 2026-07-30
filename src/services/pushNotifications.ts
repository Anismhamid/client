import {
    PushNotifications,
    Token,
    PushNotificationSchema,
    ActionPerformed,
} from '@capacitor/push-notifications';

import axios from 'axios';
import { Capacitor } from '@capacitor/core';

const api = import.meta.env.VITE_API_URL;


export async function registerPush(tokenAuth: string) {

    // فقط تطبيق Native
    if (!Capacitor.isNativePlatform()) {
        return;
    }


    const permission =
        await PushNotifications.requestPermissions();


    if (permission.receive !== 'granted') {
        console.log('Push permission denied');
        return;
    }


    await PushNotifications.register();


    // Token
    await PushNotifications.addListener(
        'registration',
        async (token: Token) => {

            console.log(
                'FCM TOKEN:',
                token.value
            );


            try {

                await axios.post(
                    `${api}/users/push-token`,
                    {
                        token: token.value,
                    },
                    {
                        headers:{
                            Authorization: tokenAuth,
                        }
                    }
                );


                console.log(
                    'Token saved'
                );


            } catch(error){
                console.error(
                    'Token save error',
                    error
                );
            }

        }
    );



    await PushNotifications.addListener(
        'registrationError',
        error => {

            console.error(
                'Push error',
                error
            );

        }
    );



    await PushNotifications.addListener(
        'pushNotificationReceived',
        (
            notification: PushNotificationSchema
        ) => {

            console.log(
                'Foreground notification:',
                notification
            );

        }
    );



    await PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (
            action: ActionPerformed
        ) => {


            const data =
                action.notification.data;


            console.log(
                'Clicked notification:',
                data
            );


            if(data?.type === 'chat'){

                // هنا لاحقاً نفتح صفحة الشات
                // navigate(`/chat/${data.userId}`)

            }

        }
    );

}