/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    FunctionComponent,
    useActionState,
    useEffect,
    useMemo,
    useState,
} from 'react';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { path } from '../../routes/routes';
import {
    handleGoogleLogin,
    loginUser,
    verifyGoogleUser,
} from '../../services/usersServices';
import { useUser } from '../../hooks/useUSer';
import { showError, showSuccess } from '../../atoms/toasts/ReactToast';
import { GoogleLogin } from '@react-oauth/google';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    PaletteMode,
    Paper,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Fade,
    Container,
    Grid,
    Alert,
    AlertTitle,
    Checkbox,
    FormControlLabel,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Login as LoginIcon,
    Email,
    Lock,
    ArrowRight,
} from '@mui/icons-material';
import UserInfoModal from '../navbar/userManage/UserInfoModal';
import { jwtDecode } from 'jwt-decode';
import { CredentialResponse } from '@react-oauth/google';
import { DecodedGooglePayload } from '../../interfaces/googleValues';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../locales/handleRTL';
import SafqaLogo from '../../atoms/SafqaLogo';
import { Preferences } from '@capacitor/preferences';
import { SavePassword } from '@capgo/capacitor-autofill-save-password';
import Loader from '../../atoms/loader/Loader';
import api from '../../services/api';

interface LoginProps {
    mode?: PaletteMode;
}

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

interface CredentialHelperPlugin {
    getSavedPassword(): Promise<{
        username: string;
        password: string;
    }>;
}

const CredentialHelper =
    registerPlugin<CredentialHelperPlugin>('CredentialHelper');

const devLog = (...args: any[]) => {
    if (import.meta.env.DEV) {
        console.log(...args);
    }
};

const devError = (...args: any[]) => {
    if (import.meta.env.DEV) {
        console.error(...args);
    }
};

const GoogleIcon: FunctionComponent = () => (
    <svg width='18' height='18' viewBox='0 0 18 18'>
        <path
            fill='#4285F4'
            d='M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62z'
        />
        <path
            fill='#34A853'
            d='M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z'
        />
        <path
            fill='#FBBC05'
            d='M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z'
        />
        <path
            fill='#EA4335'
            d='M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z'
        />
    </svg>
);

const REMEMBER_KEY = 'remembered_email';

const Login: FunctionComponent<LoginProps> = ({ mode }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [googleResponse, setGoogleResponse] =
        useState<CredentialResponse | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const { logout, setAuth, setIsLoggedIn } = useUser();

    const [showSignOutButton, setShowSignOutButton] =
        useState<boolean>(false);

    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [savedEmail, setSavedEmail] = useState<string>('');

    const [isGoogleLoading, setIsGoogleLoading] =
        useState<boolean>(false);

    const [isCheckingAuth, setIsCheckingAuth] =
        useState<boolean>(true);

    const [isLoadingSavedCreds, setIsLoadingSavedCreds] =
        useState<boolean>(true);

    const [isSigningOut, setIsSigningOut] =
        useState<boolean>(false);

    const [isSubmittingUserInfo, setIsSubmittingUserInfo] =
        useState<boolean>(false);

    const { t } = useTranslation();

    /**
     * ============================================================
     * Handle successful authentication
     * ============================================================
     *
     * JWT is stored in an HttpOnly cookie by the backend.
     *
     * The frontend:
     * - DOES NOT read the JWT
     * - DOES NOT decode the JWT
     * - DOES NOT store the JWT in localStorage
     *
     * Instead we ask the backend for the authenticated user.
     */
    const handleSuccessfulLogin = async (
        email?: string,
        password?: string,
    ) => {
        try {
            const response = await api.get('/users/me', {
                withCredentials: true,
            });

            const user = response.data?.user;

            if (!user) {
                throw new Error('USER_NOT_FOUND');
            }

            setAuth(user);
            setIsLoggedIn(true);

            /**
             * Remember only the email.
             *
             * Never store the authentication token here.
             */
            if (rememberMe && email) {
                await Preferences.set({
                    key: REMEMBER_KEY,
                    value: email,
                });
            } else {
                await Preferences.remove({
                    key: REMEMBER_KEY,
                });
            }

            /**
             * Native password manager.
             *
             * This is only for saving credentials in the device's
             * password manager. It is NOT the application auth token.
             */
            if (
                Capacitor.isNativePlatform() &&
                email &&
                password
            ) {
                try {
                    await SavePassword.promptDialog({
                        username: email,
                        password,
                    });
                } catch (error) {
                    devLog(
                        'Save password prompt failed',
                        error,
                    );
                }
            }

            showSuccess(
                t('login.successMessage', {
                    name: `${user.name?.first ?? ''} ${
                        user.name?.last ?? ''
                    }`.trim(),
                }),
            );

            navigate(path.Home);
        } catch (error: any) {
            devError(
                'Login handler error:',
                error,
            );

            showError(
                t('login.error') ||
                    'Something went wrong. Please try again.',
            );
        }
    };

    /**
     * ============================================================
     * Check existing session
     * ============================================================
     *
     * We no longer check:
     *
     * localStorage.getItem('token')
     *
     * The browser automatically sends the HttpOnly cookie to the
     * backend.
     */
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/users/me', {
                    withCredentials: true,
                });

                const user = response.data?.user;

                if (user) {
                    setAuth(user);
                    setIsLoggedIn(true);

                    navigate(path.Home, {
                        replace: true,
                    });

                    return;
                }
            } catch (error) {
                /**
                 * 401 here simply means there is no active session.
                 */
                devLog(
                    'No active authentication session',
                    error,
                );
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [navigate, setAuth, setIsLoggedIn]);

    /**
     * ============================================================
     * Login validation schema
     * ============================================================
     */
    const loginSchema = useMemo(
        () =>
            yup.object({
                email: yup
                    .string()
                    .trim()
                    .lowercase()
                    .email(
                        t(
                            'login.validation.emailInvalid',
                        ),
                    )
                    .max(
                        254,
                        t(
                            'login.validation.emailInvalid',
                        ),
                    )
                    .required(
                        t(
                            'login.validation.emailRequired',
                        ),
                    ),

                password: yup
                    .string()
                    .min(
                        8,
                        t(
                            'login.validation.passwordMin',
                        ),
                    )
                    .max(
                        60,
                        t(
                            'login.validation.passwordMax',
                        ),
                    )
                    .required(
                        t(
                            'login.validation.passwordRequired',
                        ),
                    ),
            }),
        [t],
    );

    /**
     * ============================================================
     * Normal login
     * ============================================================
     */
    const loginAction = async (
        _: FormErrors | null,
        formData: FormData,
    ): Promise<FormErrors | null> => {
        try {
            const values = {
                email: (
                    formData.get('email') as string
                )
                    ?.trim()
                    .toLowerCase(),

                password:
                    formData.get('password') as string,
            };

            await loginSchema.validate(
                values,
                {
                    abortEarly: false,
                },
            );

            /**
             * Backend creates the HttpOnly cookie.
             */
            await loginUser(
                values as any,
            );

            /**
             * Fetch authenticated user through
             * the HttpOnly cookie.
             */
            await handleSuccessfulLogin(
                values.email,
                values.password,
            );

            return null;
        } catch (err: any) {
            devError(
                'Login error:',
                err,
            );

            const errors: FormErrors = {};

            if (err.inner) {
                err.inner.forEach(
                    (error: any) => {
                        if (
                            error.path ===
                            'email'
                        ) {
                            errors.email =
                                error.message;
                        } else if (
                            error.path ===
                            'password'
                        ) {
                            errors.password =
                                error.message;
                        }
                    },
                );
            } else {
                errors.general =
                    t(
                        'login.errors.loginFailed',
                    ) ||
                    'Invalid email or password.';
            }

            return Object.keys(errors)
                .length > 0
                ? errors
                : null;
        }
    };

    const [
        error,
        submitAction,
        isPending,
    ] = useActionState<
        FormErrors | null,
        FormData
    >(loginAction, null);

    /**
     * ============================================================
     * Native Google Login
     * ============================================================
     */
    const handleNativeGoogleLogin =
        async () => {
            setIsGoogleLoading(true);

            try {
                setShowSignOutButton(false);

                const res =
                    await SocialLogin.login({
                        provider: 'google',
                        options: {
                            filterByAuthorizedAccounts:
                                false,
                            scopes: [
                                'profile',
                                'email',
                            ],
                        },
                    });

                devLog(
                    'Google login result:',
                    res,
                );

                const idToken = (
                    res.result as any
                )?.idToken;

                if (!idToken) {
                    throw new Error(
                        'missing_credential',
                    );
                }

                /**
                 * This is Google's ID token.
                 *
                 * It is NOT our Safqa session token.
                 *
                 * We only decode it to identify
                 * the Google account.
                 */
                const decodedGoogle =
                    jwtDecode<DecodedGooglePayload>(
                        idToken,
                    );

                devLog(
                    'Google user:',
                    {
                        sub: decodedGoogle.sub,
                        email:
                            decodedGoogle.email,
                    },
                );

                const userExists =
                    await verifyGoogleUser(
                        decodedGoogle.sub,
                    );

                const fakeCredentialResponse =
                    {
                        credential: idToken,
                    } as CredentialResponse;

                if (userExists) {
                    /**
                     * Backend should create the
                     * HttpOnly authentication cookie.
                     */
                    await handleGoogleLogin(
                        fakeCredentialResponse,
                        null,
                    );

                    await handleSuccessfulLogin(
                        decodedGoogle.email,
                    );
                } else {
                    setGoogleResponse(
                        fakeCredentialResponse,
                    );

                    setShowModal(true);
                }
            } catch (error: any) {
                devError(
                    'Native Google login error:',
                    error,
                );

                showError(
                    t(
                        'login.errors.googleLoginError',
                        'Google sign-in failed. Please try again.',
                    ),
                );
            } finally {
                setIsGoogleLoading(false);
            }
        };

    /**
     * ============================================================
     * Web Google Login
     * ============================================================
     */
    const handleGoogleLoginSuccess =
        async (
            response: CredentialResponse,
        ) => {
            if (!response.credential) {
                devError(
                    'Missing Google credential',
                );

                showError(
                    t(
                        'login.errors.googleLoginError',
                    ) ||
                        'Google sign-in failed. Please try again.',
                );

                return;
            }

            setIsGoogleLoading(true);

            try {
                setShowSignOutButton(false);

                /**
                 * Decode ONLY Google's ID token.
                 */
                const decodedGoogle =
                    jwtDecode<DecodedGooglePayload>(
                        response.credential,
                    );

                const userExists =
                    await verifyGoogleUser(
                        decodedGoogle.sub,
                    );

                if (userExists) {
                    /**
                     * Backend creates the HttpOnly
                     * authentication cookie.
                     */
                    await handleGoogleLogin(
                        response,
                        null,
                    );

                    await handleSuccessfulLogin(
                        decodedGoogle.email,
                    );
                } else {
                    setGoogleResponse(
                        response,
                    );

                    setShowModal(true);
                    setShowSignOutButton(false);
                }
            } catch (error: any) {
                devError(
                    'Google login error:',
                    error,
                );

                showError(
                    t(
                        'login.errors.googleLoginError',
                    ) ||
                        'Google sign-in failed. Please try again.',
                );
            } finally {
                setIsGoogleLoading(false);
            }
        };

    /**
     * ============================================================
     * Google Sign Out
     * ============================================================
     */
    const handleGoogleSignOut =
        async () => {
            setIsSigningOut(true);

            try {
                if (
                    Capacitor.isNativePlatform()
                ) {
                    await SocialLogin.logout(
                        {
                            provider: 'google',
                        },
                    );
                }

                /**
                 * logout() should call the backend
                 * logout endpoint which clears the
                 * HttpOnly cookie.
                 */
                await logout();

                setShowSignOutButton(
                    false,
                );

                showSuccess(
                    t(
                        'login.signOutSuccess',
                    ) ||
                        'Signed out successfully. Please try logging in again.',
                );

                window.location.reload();
            } catch (error) {
                devError(
                    'Sign out error:',
                    error,
                );

                showError(
                    t(
                        'login.errors.signOutFailed',
                    ) ||
                        'Failed to sign out. Please try manually.',
                );
            } finally {
                setIsSigningOut(false);
            }
        };

    /**
     * ============================================================
     * Google new-user information
     * ============================================================
     */
    const handleUserInfoSubmit =
        async (
            userExtraData: any,
        ) => {
            setIsSubmittingUserInfo(true);

            try {
                if (!googleResponse) {
                    throw new Error(
                        'GOOGLE_RESPONSE_MISSING',
                    );
                }

                /**
                 * Backend creates the HttpOnly
                 * authentication cookie.
                 */
                await handleGoogleLogin(
                    googleResponse,
                    userExtraData,
                );

                /**
                 * No token is returned/used.
                 */
                await handleSuccessfulLogin();
            } catch (error: any) {
                devError(
                    'User info submit error:',
                    error,
                );

                showError(
                    t(
                        'login.errors.loginFailed',
                    ) ||
                        'Something went wrong. Please try again.',
                );

                setShowModal(false);
            } finally {
                setIsSubmittingUserInfo(
                    false,
                );
            }
        };

    /**
     * ============================================================
     * Load saved email / native saved credentials
     * ============================================================
     */
    useEffect(() => {
        const loadSavedCredentials =
            async () => {
                let email = '';

                if (
                    Capacitor.isNativePlatform()
                ) {
                    try {
                        const cred =
                            await CredentialHelper.getSavedPassword();

                        email =
                            cred.username;
                    } catch (e) {
                        devLog(
                            'No saved credential found',
                            e,
                        );
                    }
                }

                if (!email) {
                    const {
                        value,
                    } =
                        await Preferences.get(
                            {
                                key: REMEMBER_KEY,
                            },
                        );

                    if (value) {
                        email = value;
                    }
                }

                if (email) {
                    setSavedEmail(email);
                    setRememberMe(true);
                }

                setIsLoadingSavedCreds(
                    false,
                );
            };

        loadSavedCredentials();
    }, []);

    const currentUrl =
        'https://client-qqq1.vercel.app/login';

    const dire = handleRTL();

    /**
     * ============================================================
     * Text field styles
     * ============================================================
     */
    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            transition:
                'all 0.2s ease',

            '&:hover fieldset': {
                borderColor:
                    theme.palette.primary
                        .main,
                borderWidth: 2,
            },

            '&.Mui-focused fieldset': {
                borderColor:
                    theme.palette.primary
                        .main,
                borderWidth: 2,
            },
        },

        '& .MuiInputLabel-root.Mui-focused':
            {
                color: theme.palette.primary
                    .main,
            },
    };

    /**
     * ============================================================
     * Primary button styles
     * ============================================================
     */
    const primaryButtonSx = {
        borderRadius: 3,
        py: 1.5,
        fontSize: '1.1rem',
        fontWeight: 600,

        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,

        boxShadow: `0 4px 20px ${alpha(
            theme.palette.primary.main,
            0.3,
        )}`,

        '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,

            boxShadow: `0 6px 28px ${alpha(
                theme.palette.primary.main,
                0.4,
            )}`,
        },

        '&:disabled': {
            opacity: 0.7,
            background:
                theme.palette.action
                    .disabledBackground,
        },
    };

    /**
     * ============================================================
     * Initial auth check
     * ============================================================
     */
    if (isCheckingAuth) {
        return <Loader />;
    }

    return (
        <>
            <link
                rel='canonical'
                href={currentUrl}
            />

            <title>
                {`${t(
                    'login.loginButton',
                )} | صفقة`}
            </title>

            <meta
                name='description'
                content={t(
                    'login.metaDescription',
                )}
            />

            <meta
                name='keywords'
                content={t(
                    'login.metaKeywords',
                )}
            />

            <meta
                property='og:title'
                content={`${t(
                    'login.loginButton',
                )} | صفقة`}
            />

            <meta
                property='og:description'
                content={t(
                    'login.metaDescription',
                )}
            />

            <meta
                property='og:url'
                content={currentUrl}
            />

            <Container
                dir={dire}
                maxWidth='md'
                sx={{
                    py: 8,
                    bgcolor:
                        theme.palette
                            .background
                            .default,
                    minHeight: '100vh',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent:
                            'center',
                        alignItems:
                            'center',
                        minHeight: '70vh',
                    }}
                >
                    <Grid
                        container
                        spacing={4}
                        alignItems='center'
                    >
                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <Paper
                                elevation={
                                    mode ===
                                    'dark'
                                        ? 8
                                        : 4
                                }
                                sx={{
                                    p: {
                                        xs: 3,
                                        sm: 4,
                                        md: 5,
                                    },

                                    borderRadius: 4,

                                    backdropFilter:
                                        'blur(20px)',

                                    border: `1px solid ${theme.palette.divider}`,

                                    bgcolor:
                                        theme
                                            .palette
                                            .background
                                            .paper,

                                    position:
                                        'relative',

                                    overflow:
                                        'hidden',

                                    transform:
                                        isHovered
                                            ? 'translateY(-4px)'
                                            : 'translateY(0)',

                                    transition:
                                        'transform 0.3s ease, box-shadow 0.3s ease',

                                    boxShadow:
                                        mode ===
                                        'dark'
                                            ? `0 8px 32px ${alpha(
                                                  theme
                                                      .palette
                                                      .common
                                                      .black,
                                                  0.5,
                                              )}`
                                            : `0 8px 40px ${alpha(
                                                  theme
                                                      .palette
                                                      .primary
                                                      .main,
                                                  0.08,
                                              )}`,

                                    '&:hover':
                                        {
                                            boxShadow:
                                                mode ===
                                                'dark'
                                                    ? `0 12px 48px ${alpha(
                                                          theme
                                                              .palette
                                                              .common
                                                              .black,
                                                          0.6,
                                                      )}`
                                                    : `0 12px 48px ${alpha(
                                                          theme
                                                              .palette
                                                              .primary
                                                              .main,
                                                          0.12,
                                                      )}`,
                                        },

                                    '&::before':
                                        {
                                            content:
                                                '""',

                                            position:
                                                'absolute',

                                            top: 0,
                                            left: 0,
                                            right: 0,

                                            height:
                                                '6px',

                                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.main} 100%)`,

                                            borderRadius:
                                                '4px 4px 0 0',
                                        },
                                }}
                                onMouseEnter={() =>
                                    setIsHovered(
                                        true,
                                    )
                                }
                                onMouseLeave={() =>
                                    setIsHovered(
                                        false,
                                    )
                                }
                            >
                                <Typography
                                    variant='h4'
                                    component='h2'
                                    align='center'
                                    sx={{
                                        mb: 4,
                                        fontWeight: 700,
                                        color: theme
                                            .palette
                                            .primary
                                            .main,
                                    }}
                                >
                                    {t(
                                        'login.loginButton',
                                    )}
                                </Typography>

                                <form
                                    autoComplete='on'
                                    noValidate
                                    action={
                                        submitAction
                                    }
                                >
                                    <TextField
                                        label={t(
                                            'login.email',
                                        )}
                                        type='email'
                                        name='email'
                                        defaultValue={
                                            savedEmail
                                        }
                                        error={Boolean(
                                            error?.email,
                                        )}
                                        helperText={
                                            error?.email
                                        }
                                        fullWidth
                                        margin='normal'
                                        variant='outlined'
                                        disabled={
                                            isPending ||
                                            isLoadingSavedCreds
                                        }
                                        color='primary'
                                        inputProps={{
                                            maxLength: 254,
                                        }}
                                        InputProps={{
                                            startAdornment:
                                                (
                                                    <InputAdornment position='start'>
                                                        <Email color='action' />
                                                    </InputAdornment>
                                                ),

                                            endAdornment:
                                                isLoadingSavedCreds ? (
                                                    <InputAdornment position='end'>
                                                        <CircularProgress
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </InputAdornment>
                                                ) : undefined,
                                        }}
                                        sx={
                                            textFieldSx
                                        }
                                        autoComplete='email'
                                    />

                                    <TextField
                                        label={t(
                                            'login.password',
                                        )}
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        name='password'
                                        error={Boolean(
                                            error?.password,
                                        )}
                                        helperText={
                                            error?.password
                                        }
                                        fullWidth
                                        margin='normal'
                                        variant='outlined'
                                        color='primary'
                                        disabled={
                                            isPending
                                        }
                                        inputProps={{
                                            maxLength: 60,
                                        }}
                                        InputProps={{
                                            startAdornment:
                                                (
                                                    <InputAdornment position='start'>
                                                        <Lock color='action' />
                                                    </InputAdornment>
                                                ),

                                            endAdornment:
                                                (
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            aria-label={
                                                                showPassword
                                                                    ? t(
                                                                          'login.hidePassword',
                                                                          'إخفاء كلمة السر',
                                                                      )
                                                                    : t(
                                                                          'login.showPassword',
                                                                          'إظهار كلمة السر',
                                                                      )
                                                            }
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    !showPassword,
                                                                )
                                                            }
                                                            edge='end'
                                                            type='button'
                                                            tabIndex={
                                                                -1
                                                            }
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOff />
                                                            ) : (
                                                                <Visibility />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                        }}
                                        sx={
                                            textFieldSx
                                        }
                                        autoComplete='current-password'
                                    />

                                    {error?.general && (
                                        <Typography
                                            color='error'
                                            sx={{
                                                mt: 2,
                                            }}
                                            role='alert'
                                        >
                                            {
                                                error.general
                                            }
                                        </Typography>
                                    )}

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    rememberMe
                                                }
                                                onChange={(
                                                    e,
                                                ) =>
                                                    setRememberMe(
                                                        e
                                                            .target
                                                            .checked,
                                                    )
                                                }
                                                sx={{
                                                    '&.Mui-checked':
                                                        {
                                                            color: theme
                                                                .palette
                                                                .primary
                                                                .main,
                                                        },
                                                }}
                                            />
                                        }
                                        label={
                                            t(
                                                'login.rememberMe',
                                            ) ||
                                            'تذكرني'
                                        }
                                    />

                                    <Box
                                        sx={{
                                            mt: 4,
                                        }}
                                    >
                                        <Button
                                            color='primary'
                                            variant='contained'
                                            type='submit'
                                            fullWidth
                                            size='large'
                                            startIcon={
                                                isPending ? (
                                                    <CircularProgress
                                                        size={
                                                            20
                                                        }
                                                        color='inherit'
                                                    />
                                                ) : (
                                                    <LoginIcon />
                                                )
                                            }
                                            disabled={
                                                isPending
                                            }
                                            sx={
                                                primaryButtonSx
                                            }
                                        >
                                            {isPending
                                                ? t(
                                                      'login.loading',
                                                  )
                                                : t(
                                                      'login.loginButton',
                                                  )}
                                        </Button>
                                    </Box>

                                    <Box
                                        sx={{
                                            textAlign:
                                                'center',
                                            mt: 2,
                                        }}
                                    >
                                        <Link
                                            to={
                                                path.ForgotPassword
                                            }
                                            style={{
                                                textDecoration:
                                                    'none',

                                                color: theme
                                                    .palette
                                                    .primary
                                                    .main,

                                                fontSize:
                                                    '0.9rem',

                                                fontWeight: 500,

                                                transition:
                                                    'color 0.2s ease',
                                            }}
                                            onMouseEnter={(
                                                e,
                                            ) => {
                                                e.currentTarget.style.color =
                                                    theme
                                                        .palette
                                                        .primary
                                                        .dark;

                                                e.currentTarget.style.textDecoration =
                                                    'underline';
                                            }}
                                            onMouseLeave={(
                                                e,
                                            ) => {
                                                e.currentTarget.style.color =
                                                    theme
                                                        .palette
                                                        .primary
                                                        .main;

                                                e.currentTarget.style.textDecoration =
                                                    'none';
                                            }}
                                        >
                                            {t(
                                                'login.forgotPassword',
                                            ) ||
                                                'نسيت كلمة السر؟'}
                                        </Link>
                                    </Box>

                                    <Divider
                                        sx={{
                                            my: 4,
                                        }}
                                    >
                                        <Typography
                                            variant='body2'
                                            sx={{
                                                color: theme
                                                    .palette
                                                    .text
                                                    .secondary,
                                                px: 2,
                                            }}
                                        >
                                            {t(
                                                'login.or',
                                            ) ||
                                                'أو'}
                                        </Typography>
                                    </Divider>

                                    <Box
                                        sx={{
                                            display:
                                                'flex',
                                            flexDirection:
                                                'column',
                                            alignItems:
                                                'center',
                                            gap: 2,
                                        }}
                                    >
                                        {Capacitor.isNativePlatform() ? (
                                            <Button
                                                variant='outlined'
                                                onClick={
                                                    handleNativeGoogleLogin
                                                }
                                                fullWidth
                                                size='large'
                                                startIcon={
                                                    isGoogleLoading ? (
                                                        <CircularProgress
                                                            size={
                                                                20
                                                            }
                                                            color='inherit'
                                                        />
                                                    ) : (
                                                        <GoogleIcon />
                                                    )
                                                }
                                                disabled={
                                                    isGoogleLoading ||
                                                    isPending
                                                }
                                                sx={{
                                                    maxWidth: 300,
                                                    borderRadius: 50,
                                                    textTransform:
                                                        'none',
                                                    fontWeight: 600,
                                                    bgcolor:
                                                        '#fff',
                                                    color:
                                                        '#3c4043',
                                                    border: '1px solid #dadce0',

                                                    '&:hover':
                                                        {
                                                            bgcolor:
                                                                '#f7f8f8',
                                                            border: '1px solid #dadce0',
                                                            boxShadow:
                                                                '0 1px 4px rgba(0,0,0,0.08)',
                                                        },

                                                    '&:disabled':
                                                        {
                                                            opacity: 0.7,
                                                        },
                                                }}
                                            >
                                                {isGoogleLoading
                                                    ? t(
                                                          'login.loading',
                                                          'جاري التحميل...',
                                                      )
                                                    : t(
                                                          'login.continueWithGoogle',
                                                          'Continue with Google',
                                                      )}
                                            </Button>
                                        ) : (
                                            <Box
                                                sx={{
                                                    position:
                                                        'relative',
                                                    maxWidth: 300,
                                                    width: '100%',
                                                }}
                                            >
                                                {isGoogleLoading && (
                                                    <Box
                                                        sx={{
                                                            position:
                                                                'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            display:
                                                                'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            bgcolor:
                                                                alpha(
                                                                    theme
                                                                        .palette
                                                                        .common
                                                                        .white,
                                                                    0.7,
                                                                ),
                                                            borderRadius:
                                                                50,
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        <CircularProgress
                                                            size={
                                                                28
                                                            }
                                                        />
                                                    </Box>
                                                )}

                                                <GoogleLogin
                                                    ux_mode='popup'
                                                    shape='pill'
                                                    theme='filled_blue'
                                                    size='large'
                                                    width={300}
                                                    text='signin_with'
                                                    logo_alignment='center'
                                                    onSuccess={
                                                        handleGoogleLoginSuccess
                                                    }
                                                    onError={() => {
                                                        setShowSignOutButton(
                                                            true,
                                                        );

                                                        showError(
                                                            t(
                                                                'login.googleLoginError',
                                                            ) ||
                                                                'Google login failed',
                                                        );
                                                    }}
                                                    useOneTap={
                                                        false
                                                    }
                                                    auto_select={
                                                        false
                                                    }
                                                />
                                            </Box>
                                        )}

                                        {showSignOutButton && (
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 300,
                                                }}
                                            >
                                                <Alert
                                                    severity='warning'
                                                    sx={{
                                                        mb: 1,
                                                        borderRadius: 2,
                                                        borderLeft: `4px solid ${theme.palette.warning.main}`,
                                                    }}
                                                >
                                                    <AlertTitle>
                                                        {t(
                                                            'login.reauthTitle',
                                                            'Reauthentication Required',
                                                        )}
                                                    </AlertTitle>

                                                    {t(
                                                        'login.reauthBody',
                                                        'Please sign out of Google and try again.',
                                                    )}
                                                </Alert>

                                                <Button
                                                    variant='outlined'
                                                    color='error'
                                                    onClick={
                                                        handleGoogleSignOut
                                                    }
                                                    fullWidth
                                                    size='medium'
                                                    disabled={
                                                        isSigningOut
                                                    }
                                                    startIcon={
                                                        isSigningOut ? (
                                                            <CircularProgress
                                                                size={
                                                                    18
                                                                }
                                                                color='inherit'
                                                            />
                                                        ) : undefined
                                                    }
                                                    sx={{
                                                        borderRadius: 50,
                                                        textTransform:
                                                            'none',
                                                        fontWeight: 600,

                                                        borderColor:
                                                            theme
                                                                .palette
                                                                .error
                                                                .main,

                                                        color: theme
                                                            .palette
                                                            .error
                                                            .main,

                                                        '&:hover':
                                                            {
                                                                borderColor:
                                                                    theme
                                                                        .palette
                                                                        .error
                                                                        .dark,

                                                                bgcolor:
                                                                    alpha(
                                                                        theme
                                                                            .palette
                                                                            .error
                                                                            .main,
                                                                        0.04,
                                                                    ),
                                                            },

                                                        '&:disabled':
                                                            {
                                                                opacity: 0.7,
                                                            },
                                                    }}
                                                >
                                                    {t(
                                                        'login.signOutGoogle',
                                                        'Sign out of Google',
                                                    )}
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>

                                    <Box
                                        mt={2}
                                        textAlign='center'
                                    >
                                        <Typography
                                            variant='body2'
                                            color='text.secondary'
                                        >
                                            {t(
                                                'login.noAccount',
                                                "Don't have an account?",
                                            )}

                                            <Link
                                                to={
                                                    path.Register
                                                }
                                                style={{
                                                    marginLeft:
                                                        '4px',

                                                    color: theme
                                                        .palette
                                                        .primary
                                                        .main,

                                                    fontWeight: 600,

                                                    textDecoration:
                                                        'none',
                                                }}
                                                onMouseEnter={(
                                                    e,
                                                ) => {
                                                    e.currentTarget.style.textDecoration =
                                                        'underline';
                                                }}
                                                onMouseLeave={(
                                                    e,
                                                ) => {
                                                    e.currentTarget.style.textDecoration =
                                                        'none';
                                                }}
                                            >
                                                {t(
                                                    'login.register',
                                                    'Register Now',
                                                )}
                                            </Link>
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display:
                                                'flex',
                                            justifyContent:
                                                'center',
                                            gap: 4,
                                            mt: 4,
                                            pt: 3,
                                            borderTop: `1px solid ${theme.palette.divider}`,
                                        }}
                                    >
                                        <Link
                                            to={
                                                path.PrivacyAndPolicy
                                            }
                                            style={{
                                                textDecoration:
                                                    'none',

                                                color: theme
                                                    .palette
                                                    .text
                                                    .secondary,

                                                fontSize:
                                                    '0.875rem',

                                                transition:
                                                    'color 0.2s ease',
                                            }}
                                            onMouseEnter={(
                                                e,
                                            ) => {
                                                e.currentTarget.style.color =
                                                    theme
                                                        .palette
                                                        .primary
                                                        .main;
                                            }}
                                            onMouseLeave={(
                                                e,
                                            ) => {
                                                e.currentTarget.style.color =
                                                    theme
                                                        .palette
                                                        .text
                                                        .secondary;
                                            }}
                                        >
                                            {t(
                                                'login.privacyPolicy',
                                            )}
                                        </Link>

                                        <Link
                                            to={
                                                path.TermOfUse
                                            }
                                            style={{
                                                textDecoration:
                                                    'none',

                                                color: theme
                                                    .palette
                                                    .text
                                                    .secondary,

                                                fontSize:
                                                    '0.875rem',

                                                transition:
                                                    'color 0.2s ease',
                                            }}
                                            onMouseEnter={(
                                                e,
                                            ) => {
                                                e.currentTarget.style.color =
                                                    theme
                                                        .palette
                                                        .primary
                                                        .main;
                                            }}
                                            onMouseLeave={(
                                                e,
                                            ) => {
                                                e.currentTarget.style.color =
                                                    theme
                                                        .palette
                                                        .text
                                                        .secondary;
                                            }}
                                        >
                                            {t(
                                                'login.termsOfUse',
                                            )}
                                        </Link>
                                    </Box>
                                </form>
                            </Paper>
                        </Grid>

                        {/* Vertical divider */}
                        <Box
                            sx={{
                                display: {
                                    xs: 'none',
                                    md: 'block',
                                },

                                width: '5px',
                                height: '70vh',

                                mx: 'auto',

                                background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,

                                borderRadius:
                                    '10px',

                                opacity: 0.6,
                            }}
                        />

                        {/* Right side */}
                        <Grid
                            size={{
                                xs: 12,
                                md: 5,
                            }}
                        >
                            <Fade
                                in={true}
                                timeout={800}
                            >
                                <Box
                                    sx={{
                                        textAlign: {
                                            xs: 'center',
                                            md: 'right',
                                        },

                                        pr: {
                                            md: 4,
                                        },

                                        mb: {
                                            xs: 4,
                                            md: 0,
                                        },
                                    }}
                                >
                                    <Typography
                                        variant='h2'
                                        component='h1'
                                        sx={{
                                            fontWeight: 800,
                                            mb: 2,

                                            fontSize: {
                                                xs: '2.5rem',
                                                md: '3.5rem',
                                            },
                                        }}
                                    >
                                        <SafqaLogo />
                                    </Typography>

                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color: theme
                                                .palette
                                                .text
                                                .secondary,

                                            mb: 3,

                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {t(
                                            'login.description',
                                        )}
                                    </Typography>

                                    <Button
                                        variant='outlined'
                                        startIcon={
                                            <ArrowRight />
                                        }
                                        onClick={() =>
                                            navigate(
                                                path.Home,
                                            )
                                        }
                                        sx={{
                                            borderRadius: 3,
                                            px: 4,
                                            py: 1,
                                            borderWidth: 2,

                                            borderColor:
                                                theme
                                                    .palette
                                                    .primary
                                                    .main,

                                            color: theme
                                                .palette
                                                .primary
                                                .main,

                                            '&:hover':
                                                {
                                                    borderWidth: 2,

                                                    borderColor:
                                                        theme
                                                            .palette
                                                            .primary
                                                            .dark,

                                                    bgcolor:
                                                        alpha(
                                                            theme
                                                                .palette
                                                                .primary
                                                                .main,
                                                            0.04,
                                                        ),
                                                },
                                        }}
                                    >
                                        {t(
                                            'login.backToHome',
                                            'العودة للرئيسية',
                                        )}
                                    </Button>
                                </Box>
                            </Fade>
                        </Grid>
                    </Grid>
                </Box>

                <UserInfoModal
                    isOpen={showModal}
                    isSubmitting={
                        isSubmittingUserInfo
                    }
                    onClose={() => {
                        if (
                            isSubmittingUserInfo
                        ) {
                            return;
                        }

                        setShowModal(false);
                        setGoogleResponse(
                            null,
                        );
                    }}
                    onSubmit={
                        handleUserInfoSubmit
                    }
                />
            </Container>
        </>
    );
};

export default Login;