import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

interface DecodedToken {
    exp: number;
    iat: number;
    sub: string;
    name: string;
    email: string;
    picture: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // כל נתון נוסף שהטוקן יכול להכיל
}

function useToken() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [decodedToken, setAfterDecode] = useState<any>(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);

                // Expiration check
                if (decoded.exp < currentTime) {
                    localStorage.removeItem('token');
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setAfterDecode(null);
                } else {
                    setAfterDecode(decoded);
                }
            } catch (error) {
                console.log('Invalid token:', error);
                localStorage.removeItem('token');
                setAfterDecode(null);
            }
        } else {
            setAfterDecode(null);
        }
    }, [token]);

    return { decodedToken, setAfterDecode };
}

export default useToken;
