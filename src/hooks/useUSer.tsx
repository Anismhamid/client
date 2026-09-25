/* eslint-disable react-refresh/only-export-components */
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    ReactNode,
    FunctionComponent,
} from 'react';

import { AuthValues, emptyAuthValues } from '../interfaces/authValues';

import { getCurrentUser, logoutUser } from '../services/usersServices';

type Auth = AuthValues;

interface UserContextType {
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;

    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;

    isAuthLoading: boolean;

    refreshAuth: () => Promise<void>;

    logout: () => Promise<void>;
}

const defaultUserContext: UserContextType = {
    auth: emptyAuthValues,
    setAuth: () => {},

    isLoggedIn: false,
    setIsLoggedIn: () => {},

    isAuthLoading: true,

    refreshAuth: async () => {},

    logout: async () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = () => {
    return useContext(UserContext);
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: FunctionComponent<UserProviderProps> = ({
    children,
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const [auth, setAuth] = useState<Auth>(emptyAuthValues);

    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

    /**
     * Restore the current authenticated user.
     *
     * Authentication is handled by the HttpOnly cookie.
     * The frontend never reads or stores the JWT.
     */
    const refreshAuth = useCallback(async () => {
        try {
            setIsAuthLoading(true);

            const user = await getCurrentUser();

            if (!user) {
                setAuth(emptyAuthValues);
                setIsLoggedIn(false);
                return;
            }

            setAuth(user);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Failed to restore authentication:', error);

            setAuth(emptyAuthValues);
            setIsLoggedIn(false);
        } finally {
            setIsAuthLoading(false);
        }
    }, []);

    /**
     * Logout from the backend and clear local auth state.
     *
     * The backend is responsible for clearing
     * the HttpOnly authentication cookie.
     */
    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.warn('Logout request failed:', error);
        } finally {
            setAuth(emptyAuthValues);
            setIsLoggedIn(false);
        }
    }, []);

    /**
     * Restore authentication when the application starts.
     */
    useEffect(() => {
        refreshAuth();
    }, [refreshAuth]);

    /**
     * Handle centralized authentication logout events.
     *
     * This can be triggered by the Axios interceptor
     * when the backend returns 401/403.
     */
    useEffect(() => {
        const handleAuthLogout = () => {
            setAuth(emptyAuthValues);
            setIsLoggedIn(false);
        };

        window.addEventListener('auth:logout', handleAuthLogout);

        return () => {
            window.removeEventListener('auth:logout', handleAuthLogout);
        };
    }, []);

    return (
        <UserContext.Provider
            value={{
                auth,
                setAuth,

                isLoggedIn,
                setIsLoggedIn,

                isAuthLoading,

                refreshAuth,

                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
