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
import api from '../services/api';
import { getCurrentUser } from '../services/usersServices';

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

const UserContext =
    createContext<UserContextType>(defaultUserContext);

export const useUser = () => {
    return useContext(UserContext);
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: FunctionComponent<UserProviderProps> = ({
    children,
}) => {
    const [isLoggedIn, setIsLoggedIn] =
        useState<boolean>(false);

    const [auth, setAuth] =
        useState<Auth>(emptyAuthValues);

    const [isAuthLoading, setIsAuthLoading] =
        useState<boolean>(true);

    /**
     * Get current authenticated user
     *
     * JWT is stored inside HttpOnly cookie.
     * Frontend never reads the JWT.
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
     * Logout from backend and clear local auth state.
     */
    const logout = useCallback(async () => {
        try {
            await api.post('/users/logout');
        } catch (error) {
            console.warn(
                'Logout request failed:',
                error,
            );
        } finally {
            setAuth(emptyAuthValues);
            setIsLoggedIn(false);
        }
    }, []);

    /**
     * Restore session when application starts.
     */
    useEffect(() => {
        refreshAuth();
    }, [refreshAuth]);

    /**
     * Handle centralized 401 events.
     */
    useEffect(() => {
        const handleAuthLogout = () => {
            setAuth(emptyAuthValues);
            setIsLoggedIn(false);
        };

        window.addEventListener(
            'auth:logout',
            handleAuthLogout,
        );

        return () => {
            window.removeEventListener(
                'auth:logout',
                handleAuthLogout,
            );
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