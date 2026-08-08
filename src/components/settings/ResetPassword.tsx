/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, useActionState, useState } from 'react';
import * as yup from 'yup';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { path } from '../../routes/routes';
import { resetPassword } from '../../services/usersServices';
import { showError, showSuccess } from '../../atoms/toasts/ReactToast';
import {
    Box,
    Button,
    CircularProgress,
    PaletteMode,
    Paper,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Container,
    Grid,
    Alert,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff, Check } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../locales/handleRTL';

interface ResetPasswordProps {
    mode?: PaletteMode;
}

interface FormState {
    error?: string;
    success?: boolean;
}

const schema = yup.object({
    password: yup.string().min(8).max(60).required(),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'كلمة السر غير متطابقة')
        .required(),
});

const ResetPassword: FunctionComponent<ResetPasswordProps> = ({ mode }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dire = handleRTL();
    const { token } = useParams<{ token: string }>();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);

    const submitAction = async (
        _: FormState | null,
        formData: FormData,
    ): Promise<FormState> => {
        try {
            if (!token || !email) {
                throw new Error('رابط إعادة التعيين غير صالح');
            }

            const values = {
                password: formData.get('password') as string,
                confirmPassword: formData.get('confirmPassword') as string,
            };

            await schema.validate(values, { abortEarly: false });

            await resetPassword(token, email, values.password);

            showSuccess('تم تغيير كلمة السر بنجاح');
            return { success: true };
        } catch (err: any) {
            const message =
                err?.inner?.[0]?.message ||
                err?.response?.data?.message ||
                err?.message ||
                'حدث خطأ، حاول مرة تانية';
            showError(message);
            return { error: message };
        }
    };

    const [state, action, isPending] = useActionState<
        FormState | null,
        FormData
    >(submitAction, null);

    return (
        <>
            <title>{`${t('login.resetPassword') || 'إعادة تعيين كلمة السر'} | صفقة`}</title>

            <Container dir={dire} maxWidth='sm' sx={{ py: 8 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '60vh',
                    }}
                >
                    <Grid container justifyContent='center'>
                        <Grid size={12}>
                            <Paper
                                elevation={mode === 'dark' ? 8 : 4}
                                sx={{
                                    p: { xs: 3, sm: 4, md: 5 },
                                    borderRadius: 4,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: `2px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
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
                            >
                                <Typography
                                    variant='h4'
                                    component='h1'
                                    align='center'
                                    sx={{
                                        mb: 2,
                                        fontWeight: 700,
                                        color:
                                            mode === 'dark'
                                                ? 'primary.light'
                                                : 'primary.main',
                                    }}
                                >
                                    {t('login.resetPassword') ||
                                        'إعادة تعيين كلمة السر'}
                                </Typography>

                                {!token || !email ? (
                                    <Alert severity='error' sx={{ mb: 2 }}>
                                        {t('login.invalidResetLink') ||
                                            'رابط إعادة التعيين غير صالح أو ناقص. اطلب رابط جديد.'}
                                    </Alert>
                                ) : state?.success ? (
                                    <>
                                        <Alert
                                            severity='success'
                                            icon={<Check />}
                                            sx={{ mb: 3 }}
                                        >
                                            {t('login.resetSuccess') ||
                                                'تم تغيير كلمة السر بنجاح. فيك تسجل دخول هلق بكلمة السر الجديدة.'}
                                        </Alert>
                                        <Button
                                            variant='contained'
                                            fullWidth
                                            size='large'
                                            onClick={() =>
                                                navigate(path.Login)
                                            }
                                            sx={{
                                                borderRadius: 3,
                                                py: 1.5,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {t('login.loginButton') ||
                                                'تسجيل الدخول'}
                                        </Button>
                                    </>
                                ) : (
                                    <form noValidate action={action}>
                                        <TextField
                                            label={
                                                t('login.newPassword') ||
                                                'كلمة السر الجديدة'
                                            }
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name='password'
                                            required
                                            fullWidth
                                            margin='normal'
                                            variant='outlined'
                                            disabled={isPending}
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
                                                },
                                            }}
                                            autoComplete='new-password'
                                        />

                                        <TextField
                                            label={
                                                t(
                                                    'login.confirmPassword',
                                                ) || 'تأكيد كلمة السر'
                                            }
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name='confirmPassword'
                                            required
                                            fullWidth
                                            margin='normal'
                                            variant='outlined'
                                            disabled={isPending}
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
                                                                setShowConfirmPassword(
                                                                    !showConfirmPassword,
                                                                )
                                                            }
                                                            edge='end'
                                                        >
                                                            {showConfirmPassword ? (
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
                                                },
                                            }}
                                            autoComplete='new-password'
                                        />

                                        <Box sx={{ mt: 4 }}>
                                            <Button
                                                type='submit'
                                                variant='contained'
                                                fullWidth
                                                size='large'
                                                disabled={isPending}
                                                startIcon={
                                                    isPending ? (
                                                        <CircularProgress
                                                            size={20}
                                                            color='inherit'
                                                        />
                                                    ) : undefined
                                                }
                                                sx={{
                                                    borderRadius: 3,
                                                    py: 1.5,
                                                    fontWeight: 600,
                                                    background:
                                                        mode === 'dark'
                                                            ? 'linear-gradient(45deg, #29B6F6 30%, #0288D1 90%)'
                                                            : 'linear-gradient(45deg, #0288D1 30%, #0277BD 90%)',
                                                }}
                                            >
                                                {isPending
                                                    ? t('login.loading')
                                                    : t(
                                                          'login.resetPassword',
                                                      ) ||
                                                      'إعادة تعيين كلمة السر'}
                                            </Button>
                                        </Box>
                                    </form>
                                )}

                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <Link
                                        to={path.Login}
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
                                        {t('login.backToLogin') ||
                                            'رجوع لتسجيل الدخول'}
                                    </Link>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
};

export default ResetPassword;
