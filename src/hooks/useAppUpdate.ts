import { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import {
    AppUpdate,
    FlexibleUpdateInstallStatus,
} from '@capawesome/capacitor-app-update';

import {
    checkAppUpdate,
    completeFlexibleUpdate,
    performImmediateUpdate,
    startFlexibleUpdate,
    type AppUpdateCheckResult,
} from '../services/appUpdateService';

type Language = 'ar' | 'he' | 'en';

interface UseAppUpdateOptions {
    language?: Language;
}

export function useAppUpdate({
    language = 'ar',
}: UseAppUpdateOptions = {}) {
    const [updateInfo, setUpdateInfo] =
        useState<AppUpdateCheckResult | null>(null);

    const [checking, setChecking] =
        useState(true);

    const [updating, setUpdating] =
        useState(false);

    const [updateReady, setUpdateReady] =
        useState(false);

    const [downloadProgress, setDownloadProgress] =
        useState(0);

    const checkStartedRef = useRef(false);

    const checkForUpdate = useCallback(async () => {
        if (
            Capacitor.getPlatform() !== 'android'
        ) {
            setChecking(false);
            return;
        }

        if (checkStartedRef.current) {
            return;
        }

        checkStartedRef.current = true;

        try {
            setChecking(true);

            const result =
                await checkAppUpdate(language);

            setUpdateInfo(result);
        } catch (error) {
            console.error(
                '[useAppUpdate] Check failed:',
                error,
            );
        } finally {
            setChecking(false);
        }
    }, [language]);

    useEffect(() => {
        void checkForUpdate();
    }, [checkForUpdate]);

    useEffect(() => {
        if (
            Capacitor.getPlatform() !== 'android'
        ) {
            return;
        }

        let listener:
            | { remove: () => Promise<void> }
            | undefined;

        const setupListener = async () => {
            listener =
                await AppUpdate.addListener(
                    'onFlexibleUpdateStateChange',
                    async (state) => {
                        if (
                            state.installStatus ===
                            FlexibleUpdateInstallStatus.DOWNLOADING
                        ) {
                            const downloaded =
                                state.bytesDownloaded ?? 0;

                            const total =
                                state.totalBytesToDownload ?? 0;

                            if (total > 0) {
                                setDownloadProgress(
                                    Math.round(
                                        (downloaded / total) *
                                            100,
                                    ),
                                );
                            }
                        }

                        if (
                            state.installStatus ===
                            FlexibleUpdateInstallStatus.DOWNLOADED
                        ) {
                            setUpdating(false);
                            setUpdateReady(true);
                            setDownloadProgress(100);
                        }

                        if (
                            state.installStatus ===
                            FlexibleUpdateInstallStatus.FAILED
                        ) {
                            setUpdating(false);
                        }

                        if (
                            state.installStatus ===
                            FlexibleUpdateInstallStatus.CANCELED
                        ) {
                            setUpdating(false);
                        }
                    },
                );
        };

        void setupListener();

        return () => {
            void listener?.remove();
        };
    }, []);

    const startUpdate = useCallback(
        async (force = false) => {
            setUpdating(true);

            if (force) {
                await performImmediateUpdate();

                setUpdating(false);

                return;
            }

            const started =
                await startFlexibleUpdate();

            if (!started) {
                setUpdating(false);
            }
        },
        [],
    );

    const completeUpdate = useCallback(
        async () => {
            await completeFlexibleUpdate();
        },
        [],
    );

    return {
        updateInfo,
        checking,
        updating,
        updateReady,
        downloadProgress,
        startUpdate,
        completeUpdate,
        checkForUpdate,
    };
}