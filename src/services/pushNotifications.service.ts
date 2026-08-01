/* eslint-disable @typescript-eslint/no-explicit-any */
// pushNotifications.service.ts - نسخة معدلة بدون background-task
import {
    PushNotifications,
    Token,
    PushNotificationSchema,
    ActionPerformed,
} from '@capacitor/push-notifications';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import axios from 'axios';

const api = import.meta.env.VITE_API_URL;
let currentToken: string | null = null;
let backgroundInterval: number | null = null;

// ✅ استخدام App State بدلاً من BackgroundTask
export async function initializePushNotifications(authToken: string) {
    if (!Capacitor.isNativePlatform()) {
        console.log('ℹ️ Push notifications only available on native platforms');
        return;
    }

    try {
        await registerPush(authToken);
        setupAppStateListeners(authToken);
        console.log('✅ Push notifications fully initialized');
    } catch (error) {
        console.error('❌ Failed to initialize push notifications:', error);
    }
}

export async function registerPush(tokenAuth: string) {
    if (!Capacitor.isNativePlatform()) {
        return;
    }

    try {
        await PushNotifications.removeAllListeners();

        if (Capacitor.getPlatform() === 'android') {
            await setupAndroidChannels();
        }

        setupListeners(tokenAuth);

        const hasPermission = await checkAndRequestPermissions();
        if (!hasPermission) {
            console.warn('⚠️ Push notifications permission denied');
            return;
        }

        await PushNotifications.register();
        console.log('✅ Push notifications registered successfully');

        const savedToken = localStorage.getItem('fcmToken');
        if (savedToken) {
            await saveTokenToServer(savedToken, tokenAuth);
            currentToken = savedToken;
        }

    } catch (error) {
        console.error('❌ Push registration failed:', error);
    }
}

// ✅ استخدام App State Listeners فقط
function setupAppStateListeners(authToken: string) {
    // مستمع لتغيير حالة التطبيق
    App.addListener('appStateChange', async (state) => {
        console.log(`📱 App state changed: ${state.isActive ? 'Foreground' : 'Background'}`);
        
        if (state.isActive) {
            await onAppForeground(authToken);
        } else {
            await onAppBackground(authToken);
        }
    });

    // مستمع لعودة التطبيق
    App.addListener('appRestoredResult', async () => {
        console.log('🔄 App restored from background');
        const token = localStorage.getItem('fcmToken');
        if (token && authToken) {
            await saveTokenToServer(token, authToken);
        }
    });
}

// ✅ معالجة التطبيق في المقدمة
async function onAppForeground(authToken: string) {
    try {
        const userId = localStorage.getItem('userId');
        if (userId) {
            await axios.patch(
                `${api}/users/status/${userId}`,
                { status: true },
                {
                    headers: { Authorization: authToken }
                }
            );
            console.log('✅ User status updated to online');
        }

        const token = localStorage.getItem('fcmToken');
        if (token) {
            await saveTokenToServer(token, authToken);
        }

        // إيقاف الـ interval إذا كان يعمل
        if (backgroundInterval) {
            clearInterval(backgroundInterval);
            backgroundInterval = null;
            console.log('⏹️ Background interval stopped');
        }

    } catch (error) {
        console.error('❌ Error updating foreground status:', error);
    }
}

// ✅ معالجة التطبيق في الخلفية
async function onAppBackground(authToken: string) {
    try {
        console.log('📱 App in background');

        // تحديث حالة المستخدم إلى offline
        const userId = localStorage.getItem('userId');
        if (userId) {
            await axios.patch(
                `${api}/users/status/${userId}`,
                { status: false },
                {
                    headers: { Authorization: authToken },
                    timeout: 5000 // مهلة قصيرة
                }
            ).catch(() => {
                // تجاهل الأخطاء لأن التطبيق في الخلفية
                console.log('⚠️ Could not update status while in background');
            });
        }

        // البدء في إعادة المحاولة بشكل دوري للاتصال
        if (!backgroundInterval) {
            backgroundInterval = window.setInterval(async () => {
                console.log('🔄 Background reconnect attempt');
                const token = localStorage.getItem('fcmToken');
                const auth = localStorage.getItem('token');
                
                if (token && auth) {
                    try {
                        await saveTokenToServer(token, auth);
                        console.log('✅ Token refreshed in background');
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (error) {
                        console.log('⚠️ Background token refresh failed');
                    }
                }
            }, 60000); // كل 60 ثانية
        }

        console.log('✅ App in background, background interval started');
    } catch (error) {
        console.error('❌ Error handling background state:', error);
    }
}

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

        // ✅ قناة خاصة للخلفية
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
        console.error('❌ Failed to create Android channels:', error);
    }
}

function setupListeners(authToken: string) {
    PushNotifications.addListener('registration', async (token: Token) => {
        console.log('📱 FCM Token received:', token.value.substring(0, 20) + '...');
        
        if (currentToken === token.value) {
            console.log('ℹ️ Token unchanged, skipping save');
            return;
        }

        const saved = await saveTokenToServer(token.value, authToken);
        if (saved) {
            currentToken = token.value;
            localStorage.setItem('fcmToken', token.value);
            localStorage.setItem('fcmTokenTimestamp', Date.now().toString());
        }
    });

    PushNotifications.addListener('registrationError', (error: any) => {
        console.error('❌ FCM Registration error:', error);
        setTimeout(() => {
            console.log('🔄 Retrying registration...');
            registerPush(authToken);
        }, 5000);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        console.log('📨 Notification received in foreground:', {
            title: notification.title,
            body: notification.body,
        });
        
        window.dispatchEvent(new CustomEvent('push-notification-received', {
            detail: notification
        }));
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
        const data = action.notification.data;
        console.log('👆 Notification clicked:', data);
        
        window.dispatchEvent(new CustomEvent('push-notification-clicked', {
            detail: data
        }));
    });
}

async function checkAndRequestPermissions(): Promise<boolean> {
    let permission = await PushNotifications.checkPermissions();
    
    if (permission.receive === 'granted') {
        return true;
    }
    
    if (permission.receive === 'prompt') {
        permission = await PushNotifications.requestPermissions();
        return permission.receive === 'granted';
    }
    
    if (Capacitor.getPlatform() === 'android') {
        try {
            const result = await PushNotifications.requestPermissions();
            return result.receive === 'granted';
        } catch (error) {
            console.error('Permission request failed:', error);
            return false;
        }
    }
    
    return false;
}

async function saveTokenToServer(token: string, authToken: string): Promise<boolean> {
    const maxRetries = 3;
    const deviceInfo = await getDeviceInfo();
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await axios.patch(
                `${api}/users/push-token`,
                { 
                    pushToken: token,
                    platform: Capacitor.getPlatform(),
                    deviceInfo: deviceInfo,
                },
                {
                    headers: { Authorization: authToken },
                    timeout: 10000,
                }
            );
            console.log('✅ Push token saved to server');
            return true;
        } catch (error) {
            console.warn(`⚠️ Save attempt ${attempt}/${maxRetries} failed:`, error);
            
            if (attempt === maxRetries) {
                console.error('❌ All save attempts failed');
                return false;
            }
            
            await new Promise(resolve => 
                setTimeout(resolve, 1000 * Math.pow(2, attempt - 1))
            );
        }
    }
    return false;
}

async function getDeviceInfo() {
    try {
        const { Device } = await import('@capacitor/device');
        const info = await Device.getInfo();
        return {
            model: info.model,
            platform: info.platform,
            operatingSystem: info.operatingSystem,
            osVersion: info.osVersion,
            manufacturer: info.manufacturer,
        };
    } catch (error) {
        console.warn('Could not get device info:', error);
        return { platform: Capacitor.getPlatform() };
    }
}

export async function removePushToken(authToken: string) {
    if (!Capacitor.isNativePlatform()) {
        return;
    }

    const token = localStorage.getItem('fcmToken');
    if (!token) {
        return;
    }

    try {
        await axios.delete(
            `${api}/users/push-token`,
            {
                data: { pushToken: token },
                headers: { Authorization: authToken }
            }
        );
        localStorage.removeItem('fcmToken');
        localStorage.removeItem('fcmTokenTimestamp');
        currentToken = null;
        
        if (backgroundInterval) {
            clearInterval(backgroundInterval);
            backgroundInterval = null;
        }
        
        console.log('✅ Push token removed');
    } catch (error) {
        console.error('❌ Failed to remove push token:', error);
    }
}

export function getCurrentPushToken(): string | null {
    return currentToken || localStorage.getItem('fcmToken') || null;
}

export function setupNotificationNavigation(navigate: (path: string) => void) {
    window.addEventListener('push-notification-clicked', ((event: CustomEvent) => {
        const data = event.detail;
        
        if (data?.type === 'chat' && data?.userId) {
            navigate(`/chat/${data.userId}`);
        } else if (data?.type === 'order' && data?.orderId) {
            navigate(`/orders/${data.orderId}`);
        } else if (data?.type === 'product' && data?.productId) {
            navigate(`/product/${data.productId}`);
        } else if (data?.type === 'profile' && data?.userId) {
            navigate(`/profile/${data.userId}`);
        } else if (data?.screen) {
            navigate(data.screen);
        }
    }) as EventListener);
}

// ✅ دالة لتحديث التوكن بشكل دوري
export async function refreshToken(authToken: string) {
    const token = localStorage.getItem('fcmToken');
    if (token) {
        return await saveTokenToServer(token, authToken);
    }
    return false;
}