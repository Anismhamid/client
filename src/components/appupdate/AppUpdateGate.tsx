import { useMemo, useState } from 'react';

import AppUpdateDialog from './AppUpdateDialog';
import { useAppUpdate } from '../../hooks/useAppUpdate';

interface AppUpdateGateProps {
    children: React.ReactNode;
    language?: 'ar' | 'he' | 'en';
}

export default function AppUpdateGate({
    children,
    language = 'ar',
}: AppUpdateGateProps) {
    const [dismissed, setDismissed] =
        useState(false);

    const {
        updateInfo,
        checking,
        updating,
        updateReady,
        downloadProgress,
        startUpdate,
        completeUpdate,
    } = useAppUpdate({
        language,
    });

    const forced = Boolean(
        updateInfo?.forced,
    );

    const open = useMemo(() => {
        if (checking) {
            return false;
        }

        if (!updateInfo?.available) {
            return false;
        }

        if (forced) {
            return true;
        }

        return !dismissed;
    }, [
        checking,
        updateInfo,
        forced,
        dismissed,
    ]);

    const handleUpdate = async () => {
        await startUpdate(forced);
    };

    const handleComplete = async () => {
        await completeUpdate();
    };

    return (
        <>
            {children}

            {updateInfo?.available && (
                <AppUpdateDialog
                    open={open}
                    forced={forced}
                    updating={updating}
                    updateReady={updateReady}
                    progress={downloadProgress}
                    currentVersionCode={
                        updateInfo.currentVersionCode
                    }
                    availableVersionCode={
                        updateInfo.availableVersionCode
                    }
                    latestVersionName={
                        updateInfo.latestVersionName
                    }
                    message={
                        updateInfo.updateMessage
                    }
                    onUpdate={handleUpdate}
                    onComplete={handleComplete}
                    onLater={() =>
                        setDismissed(true)
                    }
                />
            )}
        </>
    );
}