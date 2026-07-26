import { createRoot } from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/useUSer.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Buffer } from 'buffer';
import ErrorBoundary from './components/pages/ErrorBoundary.tsx';
import { ChatProvider } from './hooks/useChat.tsx';
window.Buffer = Buffer;
import 'react-toastify/dist/ReactToastify.css';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useEffect } from 'react';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { ChatWindowProvider } from './context/ChatWindowContext.tsx';

if (Capacitor.isNativePlatform()) {
    SocialLogin.initialize({
        google: {
            webClientId: import.meta.env.VITE_API_GOOGLE_API,
        },
    }).catch((err) => console.error('SocialLogin init failed', err));
}

// eslint-disable-next-line react-refresh/only-export-components
function BackButtonHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        const listenerPromise = CapApp.addListener('backButton', () => {
            if (location.pathname === '/' || location.pathname === '/home') {
                CapApp.exitApp();
            } else {
                navigate(-1);
            }
        });

        return () => {
            listenerPromise.then((listener) => listener.remove());
        };
    }, [location, navigate]);

    return null;
}

// eslint-disable-next-line react-refresh/only-export-components
const AppWithProviders = () => {
    const { auth } = useUser();
    return (
        <ChatWindowProvider>
            <ChatProvider authId={auth._id ?? ''}>
                <SpeedInsights />
                <BrowserRouter>
                    <ErrorBoundary>
                        <BackButtonHandler />
                        <App />
                    </ErrorBoundary>
                </BrowserRouter>
            </ChatProvider>
        </ChatWindowProvider>
    );
};

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_API_GOOGLE_API}>
        <UserProvider>
            <AppWithProviders />
        </UserProvider>
    </GoogleOAuthProvider>,
);
