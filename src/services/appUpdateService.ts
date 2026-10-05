import { Capacitor } from '@capacitor/core';
import {
    AppUpdate,
    AppUpdateAvailability,
} from '@capawesome/capacitor-app-update';

export interface BackendAppVersion {
    latestVersionCode: number;
    minimumSupportedVersionCode: number;
    latestVersionName?: string;

    updateMessage?: {
        ar?: string;
        he?: string;
        en?: string;
    };
}

export interface AppVersionResponse {
    success: boolean;
    android: BackendAppVersion;
}

export interface AppUpdateCheckResult {
    available: boolean;
    forced: boolean;
    currentVersionCode: number;
    availableVersionCode: number;
    minimumSupportedVersionCode: number;
    latestVersionName?: string;
    updateMessage?: string;
}

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    'https://server-32bo.onrender.com/api';

export async function getBackendAppVersion(): Promise<AppVersionResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/app-version`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(
                `App version request failed: ${response.status}`,
            );
        }

        return await response.json();
    } catch (error) {
        console.error('[AppUpdate] Backend version check failed:', error);

        return null;
    }
}

export async function getPlayStoreUpdateInfo() {
    if (Capacitor.getPlatform() !== 'android') {
        return null;
    }

    try {
        return await AppUpdate.getAppUpdateInfo();
    } catch (error) {
        console.error('[AppUpdate] Google Play check failed:', error);

        return null;
    }
}

export async function checkAppUpdate(
    language: 'ar' | 'he' | 'en' = 'ar',
): Promise<AppUpdateCheckResult | null> {
    if (Capacitor.getPlatform() !== 'android') {
        return null;
    }

    const [playInfo, backendInfo] = await Promise.all([
        getPlayStoreUpdateInfo(),
        getBackendAppVersion(),
    ]);

    if (!playInfo) {
        return null;
    }

    const currentVersionCode = Number(
        playInfo.currentVersionCode ?? 0,
    );

    const availableVersionCode = Number(
        playInfo.availableVersionCode ?? 0,
    );

    const minimumSupportedVersionCode =
        backendInfo?.android?.minimumSupportedVersionCode ?? 0;

    const updateAvailable =
        playInfo.updateAvailability ===
        AppUpdateAvailability.UPDATE_AVAILABLE;

    const backendRequiresUpdate =
        minimumSupportedVersionCode > 0 &&
        currentVersionCode < minimumSupportedVersionCode;

    const forced = backendRequiresUpdate;

    return {
        available: updateAvailable,
        forced,
        currentVersionCode,
        availableVersionCode,
        minimumSupportedVersionCode,
        latestVersionName:
            backendInfo?.android?.latestVersionName,

        updateMessage:
            backendInfo?.android?.updateMessage?.[language],
    };
}

export async function performImmediateUpdate(): Promise<boolean> {
    try {
        const info = await AppUpdate.getAppUpdateInfo();

        if (
            info.updateAvailability !==
            AppUpdateAvailability.UPDATE_AVAILABLE
        ) {
            return false;
        }

        if (!info.immediateUpdateAllowed) {
            console.warn(
                '[AppUpdate] Immediate update is not currently allowed.',
            );

            return false;
        }

        const result =
            await AppUpdate.performImmediateUpdate();

        return result.code === 0;
    } catch (error) {
        console.error(
            '[AppUpdate] Immediate update failed:',
            error,
        );

        return false;
    }
}

export async function startFlexibleUpdate(): Promise<boolean> {
    try {
        const info = await AppUpdate.getAppUpdateInfo();

        if (
            info.updateAvailability !==
            AppUpdateAvailability.UPDATE_AVAILABLE
        ) {
            return false;
        }

        if (!info.flexibleUpdateAllowed) {
            console.warn(
                '[AppUpdate] Flexible update is not currently allowed.',
            );

            return false;
        }

        const result =
            await AppUpdate.startFlexibleUpdate();

        return result.code === 0;
    } catch (error) {
        console.error(
            '[AppUpdate] Flexible update failed:',
            error,
        );

        return false;
    }
}

export async function completeFlexibleUpdate(): Promise<void> {
    try {
        await AppUpdate.completeFlexibleUpdate();
    } catch (error) {
        console.error(
            '[AppUpdate] Completing flexible update failed:',
            error,
        );
    }
}

export async function openAppStore(): Promise<void> {
    try {
        await AppUpdate.openAppStore();
    } catch (error) {
        console.error(
            '[AppUpdate] Opening Play Store failed:',
            error,
        );
    }
}