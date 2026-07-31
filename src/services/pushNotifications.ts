// pushNotifications.service.ts
import {
    PushNotifications,
    Token,
    PushNotificationSchema,
    ActionPerformed,
} from '@capacitor/push-notifications';
import axios from 'axios';
import { Capacitor } from '@capacitor/core';

const api = import.meta.env.VITE_API_URL;

// Cache for the current token
let currentToken: string | null = null;

export async function registerPush(tokenAuth: string) {
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) {
        console.log('ℹ️ Push notifications only available on native platforms');
        return;
    }

    try {
        await PushNotifications.removeAllListeners();

        // Setup Android channels
        if (Capacitor.getPlatform() === 'android') {
            await setupAndroidChannels();
        }

        // Setup listeners BEFORE registering
        setupListeners(tokenAuth);

        // Check and request permissions
        const hasPermission = await checkAndRequestPermissions();
        if (!hasPermission) {
            console.warn('⚠️ Push notifications permission denied');
            return;
        }

        // Register with FCM
        await PushNotifications.register();
        console.log('✅ Push notifications registered successfully');

    } catch (error) {
        console.error('❌ Push registration failed:', error);
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
        });

        await PushNotifications.createChannel({
            id: 'chat',
            name: 'Chat Messages',
            description: 'Notifications for new messages',
            importance: 5,
            vibration: true,
            sound: 'notification',
        });

        await PushNotifications.createChannel({
            id: 'orders',
            name: 'Order Updates',
            description: 'Notifications about your orders',
            importance: 4,
            vibration: true,
            sound: 'default',
        });
        
        console.log('✅ Android channels created');
    } catch (error) {
        console.error('❌ Failed to create Android channels:', error);
    }
}

function setupListeners(authToken: string) {
    // Registration / Token refresh
    PushNotifications.addListener('registration', async (token: Token) => {
        console.log('📱 FCM Token received:', token.value.substring(0, 20) + '...');
        
        // Skip if token hasn't changed
        if (currentToken === token.value) {
            console.log('ℹ️ Token unchanged, skipping save');
            return;
        }

        const saved = await saveTokenToServer(token.value, authToken);
        if (saved) {
            currentToken = token.value;
            localStorage.setItem('fcmToken', token.value);
        }
    });

    // Registration error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PushNotifications.addListener('registrationError', (error: any) => {
        console.error('❌ FCM Registration error:', error);
    });

    // Foreground notification received
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        console.log('📨 Notification received in foreground:', {
            title: notification.title,
            body: notification.body,
            data: notification.data,
        });
        
        // Emit event for in-app notifications
        window.dispatchEvent(new CustomEvent('push-notification-received', {
            detail: notification
        }));
    });

    // Notification clicked
    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
        const data = action.notification.data;
        console.log('👆 Notification clicked:', data);
        
        // Emit event for navigation
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
    
    return false;
}

async function saveTokenToServer(token: string, authToken: string): Promise<boolean> {
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await axios.patch(
                `${api}/users/push-token`,
                { pushToken: token },
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
            
            // Exponential backoff
            await new Promise(resolve => 
                setTimeout(resolve, 1000 * Math.pow(2, attempt - 1))
            );
        }
    }
    return false;
}

// Function to remove token on logout
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
        currentToken = null;
        console.log('✅ Push token removed');
    } catch (error) {
        console.error('❌ Failed to remove push token:', error);
    }
}

// Helper function to get current token
export function getCurrentPushToken(): string | null {
    return currentToken || localStorage.getItem('fcmToken') || null;
}

// For navigation from notification clicks - use with React Router
export function setupNotificationNavigation(navigate: (path: string) => void) {
    window.addEventListener('push-notification-clicked', ((event: CustomEvent) => {
        const data = event.detail;
        
        if (data?.type === 'chat' && data?.userId) {
            navigate(`/chat/${data.userId}`);
        } else if (data?.type === 'order' && data?.orderId) {
            navigate(`/orders/${data.orderId}`);
        } else if (data?.type === 'product' && data?.productId) {
            navigate(`/product/${data.productId}`);
        }
    }) as EventListener);
}