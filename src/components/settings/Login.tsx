/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FunctionComponent,
    useActionState,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { UserLogin } from '../../interfaces/User';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { path } from '../../routes/routes';
import {
    handleGoogleLogin,
    loginUser,
    verifyGoogleUser,
} from '../../services/usersServices';
import { useUser } from '../../hooks/useUSer';
import useToken from '../../hooks/useToken';
import { showError, showSuccess } from '../../atoms/toasts/ReactToast';
import { AuthValues } from '../../interfaces/authValues';
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
// ✅ إزالة import registerPush - usePushSync سيتعامل معها
// import { registerPush } from '../../services/pushNotifications';
import { Preferences } from '@capacitor/preferences';
import { SavePassword } from '@capgo/capacitor-autofill-save-password';

interface LoginProps {
    mode?: PaletteMode;
}

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

interface CredentialHelperPlugin {
    getSavedPassword(): Promise<{ username: string; password: string }>;
}
const CredentialHelper =
    registerPlugin<CredentialHelperPlugin>('CredentialHelper');

// interface AutofillHelperPlugin {
//     commit(): Promise<void>;
// }
// const AutofillHelper = registerPlugin<AutofillHelperPlugin>('AutofillHelper');

const Login: FunctionComponent<LoginProps> = ({ mode }) => {
    const navigate = useNavigate();
    const { setAfterDecode } = useToken();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [googleResponse, setGoogleResponse] = useState<any>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const { setAuth, setIsLoggedIn } = useUser();
    const [showSignOutButton, setShowSignOutButton] = useState<boolean>(false);
    const [savedPasswordValue, setSavedPasswordValue] = useState<string>('');

    const { t } = useTranslation();

    // ✅ دالة موحدة لتسجيل الدخول
    const handleSuccessfulLogin = async (
        token: string,
        email?: string,
        password?: string,
    ) => {
        try {
            // 1. حفظ التوكن
            localStorage.setItem('token', token);

            // 2. فك تشفير التوكن
            const decoded = jwtDecode<AuthValues>(token);
            setAfterDecode(token);
            setAuth(decoded);
            setIsLoggedIn(true);

            if (rememberMe && email) {
                await Preferences.set({ key: REMEMBER_KEY, value: email });
            } else {
                await Preferences.remove({ key: REMEMBER_KEY });
            }

            if (Capacitor.isNativePlatform() && email && password) {
                try {
                    await SavePassword.promptDialog({
                        username: email,
                        password,
                    });
                } catch (e) {
                    console.log('Save password prompt failed', e);
                }
            }

            // 4. عرض رسالة نجاح
            showSuccess(
                t('login.successMessage', {
                    name: decoded.name?.first || '',
                }) || 'Login successful',
            );

            // 5. التوجيه للصفحة الرئيسية
            navigate(path.Home);
        } catch (error: any) {
            console.error('Login handler error:', error);
            showError(error.message || 'Login failed');
        }
    };

    const handleNativeGoogleLogin = async () => {
        try {
            setShowSignOutButton(false);
            const res = await SocialLogin.login({
                provider: 'google',
                options: {
                    webClientId: import.meta.env.VITE_API_GOOGLE_API,
                    mode: 'online',
                    ...({
                        additionalParameters: {
                            prompt: 'select_account',
                        },
                    } as any),
                },
            });

            const idToken = (res.result as any)?.idToken;
            if (!idToken) {
                throw new Error(
                    t('login.errors.missingGoogleCredential') ||
                        'Missing Google credential',
                );
            }

            const decodedGoogle = jwtDecode<DecodedGooglePayload>(idToken);
            const userExists = await verifyGoogleUser(decodedGoogle.sub);

            const fakeCredentialResponse = {
                credential: idToken,
            } as CredentialResponse;

            if (userExists) {
                const token = await handleGoogleLogin(
                    fakeCredentialResponse,
                    null,
                );
                if (token) {
                    // ✅ استخدام الدالة الموحدة
                    await handleSuccessfulLogin(token);
                }
            } else {
                setGoogleResponse(fakeCredentialResponse);
                setShowModal(true);
            }
        } catch (error: any) {
            console.error('Google login error:', error);
            if (error.message?.includes('16')) {
                showError(
                    'Account reauthentication needed. Please sign out of Google and try again.',
                );
            } else {
                showError(
                    t('login.errors.googleLoginError') + ': ' + error.message,
                );
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<AuthValues>(token);
                const isExpired = decoded.exp
                    ? decoded.exp * 1000 < Date.now()
                    : false;

                if (!isExpired) {
                    navigate(path.Home, { replace: true });
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                localStorage.removeItem('token');
                console.log(error);
            }
        }
    }, [navigate]);

    const loginSchema = useMemo(
        () =>
            yup.object({
                email: yup
                    .string()
                    .email(t('login.validation.emailInvalid'))
                    .required(t('login.validation.emailRequired')),
                password: yup
                    .string()
                    .min(8, t('login.validation.passwordMin'))
                    .max(60, t('login.validation.passwordMax'))
                    .required(t('login.validation.passwordRequired')),
            }),
        [t],
    );

    const loginAction = async (
        _: FormErrors | null,
        formData: FormData,
    ): Promise<FormErrors | null> => {
        try {
            const values = {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
            };

            await loginSchema.validate(values, { abortEarly: false });

            const token = await loginUser(values as UserLogin);

            if (token) {
                // ✅ استخدام الدالة الموحدة
                await handleSuccessfulLogin(
                    token,
                    values.email,
                    values.password,
                );
                return null;
            } else {
                throw new Error('Something is wrong please try again');
            }
        } catch (err: any) {
            console.error('Login error:', err);

            const errors: FormErrors = {};

            if (err.inner) {
                err.inner.forEach((error: any) => {
                    if (error.path === 'email') {
                        errors.email = error.message;
                    } else if (error.path === 'password') {
                        errors.password = error.message;
                    }
                });
            } else {
                errors.general =
                    err.message ||
                    t('login.errors.loginFailed') ||
                    'Login failed';
            }

            return Object.keys(errors).length > 0 ? errors : null;
        }
    };

    const [error, submitAction, isPending] = useActionState<
        FormErrors | null,
        FormData
    >(loginAction, null);

    const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
        if (!response.credential) {
            throw new Error(
                t('login.errors.missingGoogleCredential') ||
                    'Missing Google credential',
            );
        }
        try {
            setShowSignOutButton(false);
            const decodedGoogle = jwtDecode<DecodedGooglePayload>(
                response.credential,
            );
            const userExists = await verifyGoogleUser(decodedGoogle.sub);

            if (userExists) {
                const token = await handleGoogleLogin(response, null);
                if (token) {
                    // ✅ استخدام الدالة الموحدة
                    await handleSuccessfulLogin(token);
                }
            } else {
                setGoogleResponse(response);
                setShowModal(true);
                setShowSignOutButton(false);
            }
        } catch (error: any) {
            showError(
                t('login.errors.googleLoginError') + ': ' + error.message,
            );
        }
    };

    const handleGoogleSignOut = async () => {
        try {
            if (Capacitor.isNativePlatform()) {
                await SocialLogin.logout({
                    provider: 'google',
                });
            }
            localStorage.removeItem('token');
            setAuth({} as AuthValues);
            setIsLoggedIn(false);
            setShowSignOutButton(false);
            showSuccess(
                'Signed out successfully. Please try logging in again.',
            );
            window.location.reload();
        } catch (error) {
            console.error('Sign out error:', error);
            showError('Failed to sign out. Please try manually.');
        }
    };

    const handleUserInfoSubmit = async (userExtraData: any) => {
        try {
            const token = await handleGoogleLogin(
                googleResponse,
                userExtraData,
            );
            if (!token) {
                showError('Please try again');
                return;
            }
            // ✅ استخدام الدالة الموحدة
            await handleSuccessfulLogin(token);
        } catch (error: any) {
            showError(error.message);
            setShowModal(false);
        }
    };

    const REMEMBER_KEY = 'remembered_email';

    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [savedEmail, setSavedEmail] = useState<string>('');

    useEffect(() => {
        (async () => {
            const { value } = await Preferences.get({ key: REMEMBER_KEY });
            if (value) {
                setSavedEmail(value);
                setRememberMe(true);
            }
        })();
    }, []);

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;
        (async () => {
            try {
                const cred = await CredentialHelper.getSavedPassword();
                setSavedEmail(cred.username);
                setSavedPasswordValue(cred.password);
            } catch (e) {
                console.log('No saved credential found', e);
            }
        })();
    }, []);

    const currentUrl = `https://client-qqq1.vercel.app/login`;
    const dire = handleRTL();

    return (
        <>
            <link rel='canonical' href={currentUrl} />
            <title>{`${t('login.loginButton')} | صفقة`}</title>
            <meta
                name='description'
                content={`${t('login.metaDescription')}`}
            />
            <meta name='keywords' content={t('login.metaKeywords')} />
            <meta
                property='og:title'
                content={`${t('login.loginButton')} | صفقة`}
            />
            <meta
                property='og:description'
                content={`${t('login.metaDescription')}`}
            />
            <meta property='og:url' content={currentUrl} />

            <Container dir={dire} maxWidth='md' sx={{ py: 8 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '70vh',
                    }}
                >
                    <Grid container spacing={4} alignItems='center'>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper
                                elevation={mode === 'dark' ? 8 : 4}
                                sx={{
                                    p: { xs: 3, sm: 4, md: 5 },
                                    borderRadius: 4,
                                    backdropFilter: 'blur(20px)',
                                    border: `2px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transform: isHovered
                                        ? 'translateY(-4px)'
                                        : 'translateY(0)',
                                    transition:
                                        'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        boxShadow:
                                            mode === 'dark'
                                                ? '0 20px 60px rgba(0, 0, 0, 0.4)'
                                                : '0 20px 60px rgba(0, 0, 0, 0.1)',
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '6px',
                                        background:
                                            'linear-gradient(90deg, #4FC3F7 0%, #29B6F6 50%, #0288D1 100%)',
                                        borderRadius: '4px 4px 0 0',
                                    },
                                }}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <Typography
                                    variant='h4'
                                    component='h2'
                                    align='center'
                                    sx={{
                                        mb: 4,
                                        fontWeight: 700,
                                        color:
                                            mode === 'dark'
                                                ? 'primary.light'
                                                : 'primary.main',
                                    }}
                                >
                                    {t('login.loginButton')}
                                </Typography>

                                <form
                                    autoComplete='on'
                                    noValidate
                                    action={submitAction}
                                >
                                    <TextField
                                        label={t('login.email')}
                                        type='email'
                                        name='email'
                                        defaultValue={savedEmail}
                                        error={Boolean(error?.email)}
                                        helperText={error?.email}
                                        fullWidth
                                        margin='normal'
                                        variant='outlined'
                                        disabled={isPending}
                                        color='primary'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <Email />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                '&:hover fieldset': {
                                                    borderColor: 'primary.main',
                                                    borderWidth: 2,
                                                },
                                            },
                                        }}
                                        autoComplete='email'
                                    />

                                    <TextField
                                        label={t('login.password')}
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        name='password'
                                        error={Boolean(error?.password)}
                                        helperText={error?.password}
                                        defaultValue={savedPasswordValue}
                                        fullWidth
                                        margin='normal'
                                        variant='outlined'
                                        color='primary'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <Lock color='action' />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                        edge='end'
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
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                '&:hover fieldset': {
                                                    borderColor: 'primary.main',
                                                    borderWidth: 2,
                                                },
                                            },
                                        }}
                                        autoComplete='current-password'
                                    />

                                    {error?.general && (
                                        <Typography
                                            color='error'
                                            sx={{ mt: 2 }}
                                        >
                                            {error.general}
                                        </Typography>
                                    )}
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={rememberMe}
                                                onChange={(e) =>
                                                    setRememberMe(
                                                        e.target.checked,
                                                    )
                                                }
                                            />
                                        }
                                        label={
                                            t('login.rememberMe') || 'تذكرني'
                                        }
                                    />
                                    <Box sx={{ mt: 4 }}>
                                        <Button
                                            color='primary'
                                            variant='contained'
                                            type='submit'
                                            fullWidth
                                            size='large'
                                            startIcon={
                                                isPending ? (
                                                    <CircularProgress
                                                        size={20}
                                                        color='inherit'
                                                    />
                                                ) : (
                                                    <LoginIcon />
                                                )
                                            }
                                            disabled={isPending}
                                            sx={{
                                                borderRadius: 3,
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                background:
                                                    mode === 'dark'
                                                        ? 'linear-gradient(45deg, #29B6F6 30%, #0288D1 90%)'
                                                        : 'linear-gradient(45deg, #0288D1 30%, #0277BD 90%)',
                                                boxShadow:
                                                    mode === 'dark'
                                                        ? '0 3px 15px rgba(41, 182, 246, 0.3)'
                                                        : '0 3px 15px rgba(2, 136, 209, 0.3)',
                                                '&:hover': {
                                                    background:
                                                        mode === 'dark'
                                                            ? 'linear-gradient(45deg, #4FC3F7 30%, #29B6F6 90%)'
                                                            : 'linear-gradient(45deg, #0277BD 30%, #01579B 90%)',
                                                    boxShadow:
                                                        mode === 'dark'
                                                            ? '0 6px 20px rgba(41, 182, 246, 0.4)'
                                                            : '0 6px 20px rgba(2, 136, 209, 0.4)',
                                                },
                                                '&:disabled': {
                                                    opacity: 0.7,
                                                },
                                            }}
                                        >
                                            {isPending
                                                ? t('login.loading')
                                                : t('login.loginButton')}
                                        </Button>
                                    </Box>

                                    <Divider sx={{ my: 4 }}>
                                        <Typography
                                            variant='body2'
                                            sx={{
                                                color:
                                                    mode === 'dark'
                                                        ? 'text.secondary'
                                                        : 'text.primary',
                                                px: 2,
                                            }}
                                        >
                                            {t('login.or') || 'أو'}
                                        </Typography>
                                    </Divider>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 2,
                                        }}
                                    >
                                        {Capacitor.isNativePlatform() ? (
                                            <Button
                                                variant='contained'
                                                onClick={
                                                    handleNativeGoogleLogin
                                                }
                                                fullWidth
                                                size='large'
                                                sx={{
                                                    maxWidth: 300,
                                                    borderRadius: 50,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    background: '#1a73e8',
                                                    '&:hover': {
                                                        background: '#1765c9',
                                                    },
                                                }}
                                            >
                                                {t('login.loginButton')} Google
                                            </Button>
                                        ) : (
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
                                                    setShowSignOutButton(true);
                                                    showError(
                                                        t(
                                                            'login.googleLoginError',
                                                        ) ||
                                                            'Google login failed',
                                                    );
                                                }}
                                                useOneTap={false}
                                                auto_select={false}
                                                hosted_domain={undefined}
                                            />
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
                                                    sx={{ mb: 1 }}
                                                >
                                                    <AlertTitle>
                                                        Reauthentication
                                                        Required
                                                    </AlertTitle>
                                                    Please sign out of Google
                                                    and try again.
                                                </Alert>
                                                <Button
                                                    variant='outlined'
                                                    color='error'
                                                    onClick={
                                                        handleGoogleSignOut
                                                    }
                                                    fullWidth
                                                    size='medium'
                                                    sx={{
                                                        borderRadius: 50,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        borderColor: '#d32f2f',
                                                        color: '#d32f2f',
                                                        '&:hover': {
                                                            borderColor:
                                                                '#b71c1c',
                                                            background:
                                                                'rgba(211, 47, 47, 0.04)',
                                                        },
                                                    }}
                                                >
                                                    Sign out of Google
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: 4,
                                            mt: 4,
                                            pt: 3,
                                            borderTop: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                                        }}
                                    >
                                        <Link
                                            to={path.PrivacyAndPolicy}
                                            style={{
                                                textDecoration: 'none',
                                                color:
                                                    mode === 'dark'
                                                        ? '#90caf9'
                                                        : '#1976d2',
                                                fontSize: '0.9rem',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {t('login.privacyPolicy')}
                                        </Link>
                                        <Link
                                            to={path.TermOfUse}
                                            style={{
                                                textDecoration: 'none',
                                                color:
                                                    mode === 'dark'
                                                        ? '#90caf9'
                                                        : '#1976d2',
                                                fontSize: '0.9rem',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {t('login.termsOfUse')}
                                        </Link>
                                    </Box>
                                </form>
                            </Paper>
                        </Grid>
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                width: '5px',
                                height: '70vh',
                                mx: 'auto',
                                background:
                                    'linear-gradient(to bottom, #48C1F7, #103365)',
                                borderRadius: '10px',
                            }}
                        />
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Fade in={true} timeout={800}>
                                <Box
                                    sx={{
                                        textAlign: {
                                            xs: 'center',
                                            md: 'right',
                                        },
                                        pr: { md: 4 },
                                        mb: { xs: 4, md: 0 },
                                    }}
                                >
                                    <Typography
                                        variant='h2'
                                        component='h1'
                                        sx={{
                                            fontWeight: 800,
                                            background:
                                                mode === 'dark'
                                                    ? 'linear-gradient(45deg, #4FC3F7 30%, #29B6F6 90%)'
                                                    : 'linear-gradient(45deg, #0288D1 30%, #0277BD 90%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            mb: 2,
                                            fontSize: {
                                                xs: '2.5rem',
                                                md: '3.5rem',
                                            },
                                        }}
                                    />
                                    <SafqaLogo />
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color:
                                                mode === 'dark'
                                                    ? 'text.secondary'
                                                    : 'text.primary',
                                            mb: 3,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {t('login.description')}
                                    </Typography>
                                    <Button
                                        variant='outlined'
                                        startIcon={<ArrowRight />}
                                        onClick={() => navigate(path.Home)}
                                        sx={{
                                            borderRadius: 3,
                                            px: 4,
                                            py: 1,
                                            borderWidth: 2,
                                            '&:hover': {
                                                borderWidth: 2,
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
                    onClose={() => {
                        setShowModal(false);
                        setGoogleResponse(null);
                    }}
                    onSubmit={handleUserInfoSubmit}
                />
            </Container>
        </>
    );
};

export default Login;
