import {
    PushNotifications,
    Token,
} from '@capacitor/push-notifications';

import axios from 'axios';

const api = import.meta.env.VITE_API_URL;


export async function initPushNotifications(
    authToken:string
){

    let permission =
        await PushNotifications.checkPermissions();


    if(permission.receive !== 'granted'){

        permission =
        await PushNotifications.requestPermissions();

    }


    if(permission.receive !== 'granted'){
        return;
    }


    await PushNotifications.register();



    PushNotifications.addListener(
        'registration',
        async(token:Token)=>{

            console.log(
                "FCM TOKEN",
                token.value
            );


            await axios.patch(
                `${api}/users/push-token`,
                {
                    pushToken:token.value
                },
                {
                    headers:{
                        Authorization:authToken
                    }
                }
            );

        }
    );



    PushNotifications.addListener(
        'pushNotificationReceived',
        notification=>{

            console.log(
                "Push received",
                notification
            );

        }
    );


    PushNotifications.addListener(
        'pushNotificationActionPerformed',
        action=>{

            console.log(
                "Push clicked",
                action
            );

        }
    );

}