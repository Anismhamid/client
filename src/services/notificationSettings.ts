import { registerPlugin } from '@capacitor/core';

interface NotificationSettingsPlugin {
    open(): Promise<void>;
}

const NotificationSettings =
    registerPlugin<NotificationSettingsPlugin>(
        'NotificationSettings',
    );

export const openNotificationSettings = async () => {
    try {
        await NotificationSettings.open();
    } catch (error) {
        console.error(
            'Cannot open notification settings',
            error,
        );
    }
};