/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, useActionState } from 'react';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { path } from '../../routes/routes';
import { forgotPassword } from '../../services/usersServices';
import { showError } from '../../atoms/toasts/ReactToast';
import {
    Box,
    Button,
    CircularProgress,
    PaletteMode,
    Paper,
    TextField,
    Typography,
    InputAdornment,
    Container,
    Grid,
    Alert,
} from '@mui/material';
import { Email, Send, ArrowBack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../locales/handleRTL';

interface ForgotPasswordProps {
    mode?: PaletteMode;
}

interface FormState {
    error?: string;
    success?: boolean;
}

const schema = yup.object({
    email: yup.string().email().required(),
});

const ForgotPassword: FunctionComponent<ForgotPasswordProps> = ({ mode }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dire = handleRTL();

    const submitAction = async (
        _: FormState | null,
        formData: FormData,
    ): Promise<FormState> => {
        try {
            const email = formData.get('email') as string;
            await schema.validate({ email });

            // ✅ الرسالة نفسها سواء الإيميل موجود أو لأ، ما منكشف حالة الحساب
            await forgotPassword(email);
            return { success: true };
        } catch (err: any) {
            const message =
                err?.inner?.[0]?.message ||
                err?.response?.data?.message ||
                t('login.errors.loginFailed') ||
                'Something went wrong';
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
            <title>{`${t('login.forgotPassword') || 'نسيت كلمة السر'} | صفقة`}</title>

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
                                    {t('login.forgotPassword') ||
                                        'نسيت كلمة السر؟'}
                                </Typography>

                                <Typography
                                    align='center'
                                    sx={{
                                        mb: 4,
                                        color:
                                            mode === 'dark'
                                                ? 'text.secondary'
                                                : 'text.primary',
                                    }}
                                >
                                    {t('login.forgotPasswordDescription') ||
                                        'حط إيميلك وإذا كان مسجل رح نبعتلك رابط لإعادة تعيين كلمة السر.'}
                                </Typography>

                                {state?.success ? (
                                    <Alert severity='success' sx={{ mb: 2 }}>
                                        {t('login.resetLinkSent') ||
                                            'إذا كان هيدا الإيميل مسجل عنا، رح توصلك رسالة فيها رابط إعادة التعيين خلال دقايق. تأكد تشيك الـ Spam.'}
                                    </Alert>
                                ) : (
                                    <form
                                        noValidate
                                        action={action}
                                        autoComplete='on'
                                    >
                                        <TextField
                                            label={t('login.email')}
                                            type='email'
                                            name='email'
                                            required
                                            fullWidth
                                            margin='normal'
                                            variant='outlined'
                                            disabled={isPending}
                                            autoComplete='email'
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
                                                },
                                            }}
                                        />

                                        <Box sx={{ mt: 3 }}>
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
                                                    ) : (
                                                        <Send />
                                                    )
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
                                                          'login.sendResetLink',
                                                      ) || 'إرسال الرابط'}
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
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 4,
                                        }}
                                        onClick={(e) => {
                                            if (!path.Login) {
                                                e.preventDefault();
                                                navigate(-1);
                                            }
                                        }}
                                    >
                                        <ArrowBack fontSize='small' />
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

export default ForgotPassword;