import { useCallback, useState } from 'react';
import { AuthValues } from '../interfaces/authValues';

function useToken() {
    const [decodedToken, setDecodedToken] =
        useState<AuthValues | null>(null);

    const setAfterDecode = useCallback(
        (value: AuthValues | null) => {
            setDecodedToken(value);
        },
        [],
    );

    return {
        token: null,
        decodedToken,
        setAfterDecode,
    };
}

export default useToken;