/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    PushNotifications,
    Token,
    PushNotificationSchema,
    ActionPerformed,
} from '@capacitor/push-notifications';

import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

import api from './api';

let currentToken: string | null = null;

let backgroundInterval: number | null = null;

/**
 * ============================================================
 * INITIALIZE
 * ============================================================
 */

export async function initializePushNotifications() {
    if (!Capacitor.isNativePlatform()) {
        console.log(
            'ℹ️ Push notifications only available on native platforms',
        );

        return;
    }

    try {
        await registerPush();

        setupAppStateListeners();

        console.log('✅ Push notifications fully initialized');
    } catch (error) {
        console.error(
            '❌ Failed to initialize push notifications:',
            error,
        );
    }
}

/**
 * ============================================================
 * REGISTER PUSH
 * ============================================================
 */

export async function registerPush() {
    if (!Capacitor.isNativePlatform()) {
        return;
    }

    try {
        await PushNotifications.removeAllListeners();

        if (Capacitor.getPlatform() === 'android') {
            await setupAndroidChannels();
        }

        setupListeners();

        const hasPermission = await checkAndRequestPermissions();

        if (!hasPermission) {
            console.warn('⚠️ Push notifications permission denied');

            return;
        }

        await PushNotifications.register();

        console.log('✅ Push notifications registered successfully');

        const savedToken = localStorage.getItem('fcmToken');

        if (savedToken) {
            const saved = await saveTokenToServer(savedToken);

            if (saved) {
                currentToken = savedToken;
            }
        }
    } catch (error) {
        console.error('❌ Push registration failed:', error);
    }
}

/**
 * ============================================================
 * APP STATE
 * ============================================================
 */

function setupAppStateListeners() {
    App.addListener('appStateChange', async (state) => {
        console.log(
            `📱 App state changed: ${
                state.isActive ? 'Foreground' : 'Background'
            }`,
        );

        if (state.isActive) {
            await onAppForeground();
        } else {
            await onAppBackground();
        }
    });

    App.addListener('appRestoredResult', async () => {
        console.log('🔄 App restored from background');

        const token = localStorage.getItem('fcmToken');

        if (token) {
            await saveTokenToServer(token);
        }
    });
}

/**
 * ============================================================
 * FOREGROUND
 * ============================================================
 */

async function onAppForeground() {
    try {
        const userId = localStorage.getItem('userId');

        if (userId) {
            await api.patch(`/users/status/${userId}`, {
                status: true,
            });

            console.log('✅ User status updated to online');
        }

        const token = localStorage.getItem('fcmToken');

        if (token) {
            await saveTokenToServer(token);
        }

        if (backgroundInterval) {
            clearInterval(backgroundInterval);

            backgroundInterval = null;

            console.log('⏹️ Background interval stopped');
        }
    } catch (error) {
        console.error(
            '❌ Error updating foreground status:',
            error,
        );
    }
}

/**
 * ============================================================
 * BACKGROUND
 * ============================================================
 */

async function onAppBackground() {
    try {
        console.log('📱 App in background');

        const userId = localStorage.getItem('userId');

        if (userId) {
            await api
                .patch(
                    `/users/status/${userId}`,
                    {
                        status: false,
                    },
                    {
                        timeout: 5000,
                    },
                )
                .catch(() => {
                    console.log(
                        '⚠️ Could not update status while in background',
                    );
                });
        }

        /**
         * IMPORTANT:
         *
         * Do not use localStorage token anymore.
         *
         * Authentication is handled by HttpOnly Cookie.
         */

        if (!backgroundInterval) {
            backgroundInterval = window.setInterval(async () => {
                console.log('🔄 Background token sync attempt');

                const token = localStorage.getItem('fcmToken');

                if (!token) {
                    return;
                }

                try {
                    const saved = await saveTokenToServer(token);

                    if (saved) {
                        console.log(
                            '✅ Push token synced in background',
                        );
                    }
                } catch {
                    console.log(
                        '⚠️ Background token sync failed',
                    );
                }
            }, 60000);
        }

        console.log(
            '✅ App in background, background interval started',
        );
    } catch (error) {
        console.error(
            '❌ Error handling background state:',
            error,
        );
    }
}

/**
 * ============================================================
 * ANDROID CHANNELS
 * ============================================================
 */

async function setupAndroidChannels() {
    try {
        await PushNotifications.createChannel({
            id: 'default',
            name: 'General Notifications',
            description: 'General app notifications',
            importance: 4,
            vibration: true,
            sound: 'default',
            visibility: 1,
            lights: true,
            lightColor: '#FF0000',
        });

        await PushNotifications.createChannel({
            id: 'chat',
            name: 'Chat Messages',
            description: 'Notifications for new messages',
            importance: 5,
            vibration: true,
            sound: 'notification',
            visibility: 1,
            lights: true,
            lightColor: '#00FF00',
        });

        await PushNotifications.createChannel({
            id: 'orders',
            name: 'Order Updates',
            description: 'Notifications about your orders',
            importance: 4,
            vibration: true,
            sound: 'default',
            visibility: 1,
            lights: true,
            lightColor: '#0000FF',
        });

        /**
         * This channel is not required for authentication.
         * Keep it only if the Android implementation actually
         * uses it.
         */
        await PushNotifications.createChannel({
            id: 'background_service',
            name: 'Background Service',
            description: 'Keep app connected in background',
            importance: 2,
            vibration: false,
            sound: 'none',
            visibility: -1,
        });

        console.log('✅ Android channels created');
    } catch (error) {
        console.error(
            '❌ Failed to create Android channels:',
            error,
        );
    }
}

/**
 * ============================================================
 * PUSH LISTENERS
 * ============================================================
 */

function setupListeners() {
    PushNotifications.addListener(
        'registration',
        async (token: Token) => {
            if (currentToken === token.value) {
                console.log(
                    'ℹ️ Token unchanged, skipping save',
                );

                return;
            }

            const saved = await saveTokenToServer(token.value);

            if (saved) {
                currentToken = token.value;

                localStorage.setItem(
                    'fcmToken',
                    token.value,
                );

                localStorage.setItem(
                    'fcmTokenTimestamp',
                    Date.now().toString(),
                );
            }
        },
    );

    PushNotifications.addListener(
        'registrationError',
        (error: any) => {
            console.error(
                '❌ FCM Registration error:',
                error,
            );

            setTimeout(() => {
                console.log(
                    '🔄 Retrying registration...',
                );

                void registerPush();
            }, 5000);
        },
    );

    PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
            console.log(
                '📨 Notification received in foreground:',
                {
                    title: notification.title,
                    body: notification.body,
                },
            );

            window.dispatchEvent(
                new CustomEvent(
                    'push-notification-received',
                    {
                        detail: notification,
                    },
                ),
            );
        },
    );

    PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (action: ActionPerformed) => {
            const data = action.notification.data;

            console.log(
                '👆 Notification clicked:',
                data,
            );

            window.dispatchEvent(
                new CustomEvent(
                    'push-notification-clicked',
                    {
                        detail: data,
                    },
                ),
            );
        },
    );
}

/**
 * ============================================================
 * PERMISSIONS
 * ============================================================
 */

async function checkAndRequestPermissions(): Promise<boolean> {
    let permission =
        await PushNotifications.checkPermissions();

    if (permission.receive === 'granted') {
        return true;
    }

    if (permission.receive === 'prompt') {
        permission =
            await PushNotifications.requestPermissions();

        return permission.receive === 'granted';
    }

    if (Capacitor.getPlatform() === 'android') {
        try {
            const result =
                await PushNotifications.requestPermissions();

            return result.receive === 'granted';
        } catch (error) {
            console.error(
                'Permission request failed:',
                error,
            );

            return false;
        }
    }

    return false;
}

/**
 * ============================================================
 * SAVE PUSH TOKEN
 * ============================================================
 *
 * Authentication:
 * HttpOnly Cookie
 *
 * There is NO JWT argument here.
 * There is NO Authorization header here.
 */

async function saveTokenToServer(
    token: string,
): Promise<boolean> {
    const maxRetries = 3;

    const deviceInfo = await getDeviceInfo();

    for (
        let attempt = 1;
        attempt <= maxRetries;
        attempt++
    ) {
        try {
            await api.patch(
                '/users/push-token',
                {
                    pushToken: token,
                    platform: Capacitor.getPlatform(),
                    deviceInfo,
                },
                {
                    timeout: 10000,
                },
            );

            console.log(
                '✅ Push token saved to server',
            );

            return true;
        } catch (error) {
            console.warn(
                `⚠️ Save attempt ${attempt}/${maxRetries} failed:`,
                error,
            );

            if (attempt === maxRetries) {
                console.error(
                    '❌ All save attempts failed',
                );

                return false;
            }

            await new Promise((resolve) =>
                setTimeout(
                    resolve,
                    1000 * Math.pow(2, attempt - 1),
                ),
            );
        }
    }

    return false;
}

/**
 * ============================================================
 * DEVICE INFO
 * ============================================================
 */

async function getDeviceInfo() {
    try {
        const { Device } =
            await import('@capacitor/device');

        const info = await Device.getInfo();

        return {
            model: info.model,
            platform: info.platform,
            operatingSystem: info.operatingSystem,
            osVersion: info.osVersion,
            manufacturer: info.manufacturer,
        };
    } catch (error) {
        console.warn(
            'Could not get device info:',
            error,
        );

        return {
            platform: Capacitor.getPlatform(),
        };
    }
}

/**
 * ============================================================
 * REMOVE PUSH TOKEN
 * ============================================================
 */

export async function removePushToken() {
    if (!Capacitor.isNativePlatform()) {
        return;
    }

    const token =
        localStorage.getItem('fcmToken');

    if (!token) {
        return;
    }

    try {
        await api.delete(
            '/users/push-token',
            {
                data: {
                    pushToken: token,
                },
            },
        );

        localStorage.removeItem('fcmToken');

        localStorage.removeItem(
            'fcmTokenTimestamp',
        );

        currentToken = null;

        if (backgroundInterval) {
            clearInterval(backgroundInterval);

            backgroundInterval = null;
        }

        console.log(
            '✅ Push token removed',
        );
    } catch (error) {
        console.error(
            '❌ Failed to remove push token:',
            error,
        );
    }
}

/**
 * ============================================================
 * CURRENT PUSH TOKEN
 * ============================================================
 */

export function getCurrentPushToken(): string | null {
    return (
        currentToken ||
        localStorage.getItem('fcmToken') ||
        null
    );
}

/**
 * ============================================================
 * NOTIFICATION NAVIGATION
 * ============================================================
 */

export function setupNotificationNavigation(
    navigate: (path: string) => void,
) {
    window.addEventListener(
        'push-notification-clicked',
        ((event: CustomEvent) => {
            const data = event.detail;

            if (
                data?.type === 'chat' &&
                data?.userId
            ) {
                navigate(
                    `/chat/${data.userId}`,
                );
            } else if (
                data?.type === 'order' &&
                data?.orderId
            ) {
                navigate(
                    `/orders/${data.orderId}`,
                );
            } else if (
                data?.type === 'product' &&
                data?.productId
            ) {
                navigate(
                    `/product/${data.productId}`,
                );
            } else if (
                data?.type === 'profile' &&
                data?.userId
            ) {
                navigate(
                    `/profile/${data.userId}`,
                );
            } else if (data?.screen) {
                navigate(data.screen);
            }
        }) as EventListener,
    );
}

/**
 * ============================================================
 * REFRESH PUSH TOKEN
 * ============================================================
 */

export async function refreshToken() {
    const token =
        localStorage.getItem('fcmToken');

    if (!token) {
        return false;
    }

    return saveTokenToServer(token);
}