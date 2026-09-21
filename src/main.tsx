import { createRoot } from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './hooks/useUSer.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ErrorBoundary from './components/pages/ErrorBoundary.tsx';
import { ChatProvider } from './hooks/useChat.tsx';
import 'react-toastify/dist/ReactToastify.css';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useEffect } from 'react';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { ChatWindowProvider } from './context/ChatWindowContext.tsx';
import { LazyMotion } from 'framer-motion';
import { i18nReady } from './locales/i18n.tsx';

const loadMotionFeatures = () =>
    import('./motionFeatures').then((mod) => mod.default);

if (Capacitor.isNativePlatform()) {
    SocialLogin.initialize({
        google: {
            webClientId: import.meta.env.VITE_API_GOOGLE_API,
            mode: 'online',
        },
    }).catch((err) => {
        console.error('SocialLogin init failed:', err);
    });
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

const render = () => {
    createRoot(document.getElementById('root')!).render(
        <GoogleOAuthProvider
            clientId={import.meta.env.VITE_API_GOOGLE_API as string}
        >
            <UserProvider>
                <LazyMotion features={loadMotionFeatures} strict>
                    <AppWithProviders />
                </LazyMotion>
            </UserProvider>
        </GoogleOAuthProvider>,
    );
};

// بننتظر تحميل لغة المستخدم قبل الـ render. إذا فشل، بتضل 'ar'
i18nReady
    .catch((err) => console.error('Failed to load language', err))
    .then(render);