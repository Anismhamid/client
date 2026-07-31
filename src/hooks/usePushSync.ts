import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { registerPush } from '../services/pushNotifications';
import useToken from './useToken';

export default function usePushSync() {
    const { token } = useToken();

    useEffect(() => {
        if (Capacitor.isNativePlatform() && token) {
            registerPush(token);
        }
    }, [token]);
}
