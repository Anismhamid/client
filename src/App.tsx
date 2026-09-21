import Footer from './components/footer/Footer.tsx';
import { ToastContainer } from 'react-toastify';
import { useUser } from './hooks/useUSer.tsx';
import {
    CssBaseline,
    ThemeProvider,
    createTheme,
    PaletteMode,
} from '@mui/material';
import './locales/i18n.tsx';
import AppRoutes from './routes/AppRoutes.tsx';
import Theme from './components/navbar/theme/AppTheme.tsx';
import useSocketEvents from './hooks/socket/useSocketEvents.ts';
import {
    lazy,
    useEffect,
    useMemo,
    useRef,
    useState,
    Suspense,
} from 'react';
import handleRTL from './locales/handleRTL.ts';
import Loader from './atoms/loader/Loader.tsx';
import TransitionAlerts from './components/pages/home/TransitionAlerts.tsx';
import usePushSync from './hooks/usePushSync.ts';
import { Capacitor } from '@capacitor/core';
import { useNavigate } from 'react-router-dom';
import NotificationListener from './components/settings/NotificationListener.tsx';
import axios from 'axios';
import ChipNavigation from './components/navbar/ChepNavigation.tsx';

const FloatingChats = lazy(
    () => import('./components/pages/chatBox/FloatingChats'),
);
const SpeedDialComponent = lazy(
    () => import('./atoms/productsManage/SpeedDialComponent.tsx'),
);

const api = import.meta.env.VITE_API_URL;

const getInitialMode = (): PaletteMode => {
    const stored = localStorage.getItem('theme');
    return (stored as PaletteMode) || 'light';
};

function App() {
    const { auth } = useUser();
    const navigate = useNavigate();

    // ✅ تفعيل الإشعارات
    const { isInitialized, refreshPushToken } = usePushSync();

    // ✅ تفعيل Socket Events
    useSocketEvents();

    useEffect(() => {
        axios.get(api).catch(() => {});
    }, []);

    const [mode, setMode] = useState<PaletteMode>(getInitialMode);
    const diriction = handleRTL();

    useEffect(() => {
        localStorage.setItem('theme', mode);
    }, [mode]);

    // ✅ إعداد التنقل من الإشعارات (native فقط)
    const navigateRef = useRef(navigate);
    navigateRef.current = navigate;

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        let cancelled = false;

        import('./services/pushNotifications.service').then(
            ({ setupNotificationNavigation }) => {
                if (cancelled) return;

                setupNotificationNavigation((path: string) => {
                    console.log('🔔 Navigating from notification:', path);
                    navigateRef.current(path);
                });
            },
        );

        return () => {
            cancelled = true;
        };
    }, []);

    // ✅ تحديث التوكن بشكل دوري (كل 5 دقائق)
    useEffect(() => {
        if (!Capacitor.isNativePlatform() || !isInitialized || !auth) return;

        const interval = setInterval(() => {
            refreshPushToken();
        }, 300000);

        return () => clearInterval(interval);
    }, [isInitialized, refreshPushToken, auth]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                              primary: { main: '#f59f0b' },
                              secondary: { main: '#1976d2' },
                              background: {
                                  default: '#f5f5f5',
                                  paper: '#ffffff',
                              },
                              text: {
                                  primary: 'rgba(0, 0, 0, 0.87)',
                                  secondary: 'rgba(0, 0, 0, 0.6)',
                              },
                          }
                        : {
                              primary: { main: '#f59f0b' },
                              secondary: { main: '#000000' },
                              background: {
                                  default: '#121212',
                                  paper: '#0C141A',
                              },
                              text: {
                                  primary: '#ffffff',
                                  secondary: 'rgba(255, 255, 255, 0.7)',
                              },
                              error: { main: '#f44336' },
                              warning: { main: '#ffa726' },
                              info: { main: '#29b6f6' },
                              success: { main: '#66bb6a' },
                          }),
                },
                direction: diriction,
                typography: {
                    fontFamily:
                        '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
                    h1: { fontWeight: 700 },
                    h2: { fontWeight: 600 },
                    h3: { fontWeight: 600 },
                    h4: { fontWeight: 500 },
                    h5: { fontWeight: 500 },
                    h6: { fontWeight: 500 },
                    button: { textTransform: 'none' },
                },
                shape: {
                    borderRadius: 8,
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                fontWeight: 600,
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 12,
                            },
                        },
                    },
                },
            }),
        [mode, diriction],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastContainer
                position='top-right'
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={diriction === 'rtl'}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={mode}
            />
            <Theme mode={mode} setMode={setMode} />
            <TransitionAlerts />

            <Suspense fallback={null}>
                <SpeedDialComponent />
                <FloatingChats />
            </Suspense>

            <Suspense fallback={<Loader />}>
                <AppRoutes auth={auth} />
            </Suspense>

            <ChipNavigation />

            {/* مستمع الإشعارات */}
            <NotificationListener />

            <Footer />
        </ThemeProvider>
    );
}

export default App;