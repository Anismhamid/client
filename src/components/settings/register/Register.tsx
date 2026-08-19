import { useFormik } from 'formik';
import { FunctionComponent, useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { path } from '../../../routes/routes';
import {
    registerNewUser,
    checkSlugAvailability,
} from '../../../services/usersServices';
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    TextField,
    Typography,
    useTheme,
    useMediaQuery,
    Alert,
    Stepper,
    Step,
    StepLabel,
    alpha,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    ArrowBack,
    PersonAdd,
    CheckCircle,
    Error as ErrorIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Tag,
    ArrowForward,
} from '@mui/icons-material';
import useAddressData from '../../../hooks/useAddressData';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import handleRTL from '../../../locales/handleRTL';
import {
    registerValidationSchema,
    registerInitialValues,
    UserRegisterFormValues,
} from './registerSchema';

const Register: FunctionComponent = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
    const [checkingSlug, setCheckingSlug] = useState<boolean>(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () =>
        setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
    };

    const dir = handleRTL();

    const checkSlug = useMemo(
        () =>
            debounce(async (slug: string) => {
                if (slug.length < 3) {
                    setSlugAvailable(null);
                    return;
                }

                setCheckingSlug(true);
                try {
                    const available = await checkSlugAvailability(slug);
                    setSlugAvailable(available);
                } catch (error) {
                    console.error('Error checking slug:', error);
                    setSlugAvailable(null);
                } finally {
                    setCheckingSlug(false);
                }
            }, 500),
        [],
    );

    useEffect(() => {
        return () => {
            checkSlug.cancel();
        };
    }, [checkSlug]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRegistrationError = (error: any) => {
        const errorMap: Record<string, string> = {
            EMAIL_EXISTS: t('register.errors.EMAIL_EXISTS'),
            SLUG_EXISTS: t('register.errors.slugExists'),
            WEAK_PASSWORD: t('register.errors.weakPassword'),
            INVALID_PHONE: t('register.errors.invalidPhone'),
            NETWORK_ERROR: t('register.errors.networkError'),
            RATE_LIMITED: t('register.errors.rateLimited'),
        };

        const errorCode = error.code;
        return errorMap[errorCode] || t('register.errors.serverError');
    };

    const formik = useFormik<UserRegisterFormValues>({
        initialValues: registerInitialValues,
        validationSchema: registerValidationSchema(t),
        onSubmit: (user: UserRegisterFormValues) => {
            setIsLoading(true);
            setSubmitError('');

            const dataToSend = {
                name: {
                    first: user.name.first.trim(),
                    last: user.name.last.trim(),
                },
                phone: {
                    phone_1: user.phone.phone_1.trim(),
                    phone_2: user.phone.phone_2?.trim() || '',
                },
                address: {
                    city: user.address.city.trim(),
                    street: user.address.street.trim(),
                    houseNumber: user?.address?.houseNumber?.trim(),
                },
                email: user.email.trim().toLowerCase(),
                password: user.password,
                gender: user.gender,
                slug: user.slug.trim().toLowerCase(),
                image: {
                    url: user?.image?.url?.trim(),
                    alt:
                        user.image.alt ||
                        `${user.name.first} ${user.name.last}`,
                },
                terms: user.terms,
            };

            registerNewUser(dataToSend)
                .then((data) => {
                    localStorage.setItem('token', data);
                    setSubmitSuccess(true);
                    setTimeout(() => {
                        navigate(path.Home);
                    }, 1500);
                })
                .catch((error) => {
                    const errors = error.data || error;
                    const errorMessage = handleRegistrationError(errors);

                    setSubmitError(errorMessage);

                    if (errors.code === 'EMAIL_EXISTS') {
                        setCurrentStep(0);
                        formik.setFieldError('email', errorMessage);
                        console.log(errors);
                    } else {
                        formik.setStatus({ serverError: 'حدث خطأ في السيرفر' });
                    }
                })
                .finally(() => setIsLoading(false));
        },
    });

    const generateSlugFromName = () => {
        const firstName = formik.values.name.first || '';
        const lastName = formik.values.name.last || '';

        if (!firstName && !lastName) {
            return;
        }

        const fullName = `${firstName} ${lastName}`.trim();

        const generatedSlug = fullName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        formik.setFieldValue('slug', generatedSlug);
        checkSlug(generatedSlug);
    };

    useEffect(() => {
        if (formik.values.slug && formik.values.slug.length >= 3) {
            checkSlug(formik.values.slug);
        } else {
            setSlugAvailable(null);
        }
    }, [formik.values.slug, checkSlug]);

    const { cities, streets, loadingStreets } = useAddressData(
        formik.values.address.city,
    );

    const steps = [
        {
            label: t('register.steps.personalInfo'),
            fields: ['name.first', 'name.last', 'slug', 'email', 'gender'],
        },
        {
            label: t('register.steps.contactInfo'),
            fields: ['phone.phone_1', 'phone.phone_2', 'address'],
        },
        {
            label: t('register.steps.security'),
            fields: ['password', 'confirmPassword'],
        },
        { label: t('register.steps.agreements'), fields: ['terms'] },
    ];

    const validateCurrentStep = () => {
        const currentFields = steps[currentStep].fields;
        let hasErrors = false;

        currentFields.forEach((field) => {
            if (field === 'address') {
                if (
                    formik.errors.address?.city ||
                    formik.errors.address?.street
                ) {
                    hasErrors = true;
                }
            } else if (formik.errors[field as keyof typeof formik.errors]) {
                hasErrors = true;
            }
        });

        return !hasErrors;
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        } else {
            steps[currentStep].fields.forEach((field) => {
                if (field === 'address') {
                    formik.setFieldTouched('address.city', true);
                    formik.setFieldTouched('address.street', true);
                } else {
                    formik.setFieldTouched(field, true);
                }
            });
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    // ================ مكونات مساعدة محسنة ================

    const PasswordStrengthIndicator = ({ password }: { password: string }) => {
        const getStrength = (pass: string) => {
            let score = 0;
            if (pass.length >= 8) score++;
            if (/[a-z]/.test(pass)) score++;
            if (/[A-Z]/.test(pass)) score++;
            if (/[0-9]/.test(pass)) score++;
            if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
            return score;
        };

        const strength = getStrength(password);
        const strengthLabels = [
            t('register.passwordStrength.veryWeak'),
            t('register.passwordStrength.weak'),
            t('register.passwordStrength.fair'),
            t('register.passwordStrength.good'),
            t('register.passwordStrength.strong'),
            t('register.passwordStrength.veryStrong'),
        ];

        const strengthColors = [
            theme.palette.error.main,
            theme.palette.warning.main,
            theme.palette.info.main,
            theme.palette.success.main,
            theme.palette.success.dark,
            theme.palette.success.dark,
        ];

        return (
            <Box dir={dir} sx={{ mt: 1, mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    {strengthLabels[strength]}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    {[...Array(5)].map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                flex: 1,
                                height: 4,
                                borderRadius: 1,
                                bgcolor:
                                    i < strength
                                        ? strengthColors[strength - 1]
                                        : theme.palette.divider,
                                transition: 'background-color 0.3s ease',
                            }}
                        />
                    ))}
                </Box>
            </Box>
        );
    };

    const SlugAvailabilityIndicator = () => {
        if (!formik.values.slug || formik.values.slug.length < 3) {
            return null;
        }

        if (checkingSlug) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 1,
                    }}
                >
                    <CircularProgress size={16} />
                    <Typography variant="caption" color="text.secondary">
                        {t('register.checkingSlug')}
                    </Typography>
                </Box>
            );
        }

        if (slugAvailable === true) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 1,
                    }}
                >
                    <CheckIcon sx={{ color: theme.palette.success.main, fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: theme.palette.success.main }}>
                        {t('register.slugAvailable')}
                    </Typography>
                </Box>
            );
        }

        if (slugAvailable === false) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 1,
                    }}
                >
                    <CloseIcon sx={{ color: theme.palette.error.main, fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
                        {t('register.slugTaken')}
                    </Typography>
                </Box>
            );
        }

        return null;
    };

    // ================ مكون حقل الإدخال المنسق ================

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const StyledTextField = (props: any) => (
        <TextField
            {...props}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.light,
                    },
                },
                '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                        color: theme.palette.primary.main,
                    },
                },
                ...props.sx,
            }}
        />
    );

    // ================ شاشة النجاح ================

    if (submitSuccess) {
        return (
            <>
                <title>{t('register.success.title')} | صفقة</title>
                <meta
                    name="description"
                    content={t('register.success.description')}
                />
                <Box
                    dir={dir}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '80vh',
                        px: 2,
                        bgcolor: theme.palette.background.default,
                    }}
                >
                    <Card
                        dir={dir}
                        sx={{
                            maxWidth: 500,
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 4,
                            boxShadow: `0 8px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                            border: `1px solid ${theme.palette.divider}`,
                            bgcolor: theme.palette.background.paper,
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <CheckCircle
                                sx={{
                                    fontSize: 80,
                                    color: theme.palette.success.main,
                                    mb: 3,
                                }}
                            />
                        </motion.div>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                        >
                            {t('register.success.title')}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                        >
                            {t('register.success.message')}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                        >
                            {t('register.success.profileLink')}:
                        </Typography>
                        <Box
                            sx={{
                                display: 'inline-block',
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                mb: 2,
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                }}
                            >
                                {window.location.origin}/customer/{formik.values.slug}
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                        >
                            {t('register.success.redirect')}
                        </Typography>
                        <CircularProgress size={24} sx={{ mt: 2 }} />
                    </Card>
                </Box>
            </>
        );
    }

    const currentUrl = `https://client-qqq1.vercel.app/register`;

    // ================ الشاشة الرئيسية ================

    return (
        <>
            <link rel="canonical" href={currentUrl} />
            <title>{t('register.title')} | صفقة</title>
            <meta
                name="description"
                content={`${t('register.title')} | صفقة`}
            />

            <Box
                dir={dir}
                sx={{
                    minHeight: '100vh',
                    py: { xs: 2, md: 4 },
                    px: { xs: 1, md: 2 },
                    bgcolor: theme.palette.mode === 'dark'
                        ? theme.palette.background.default
                        : '#f0f4f8',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Grid container justifyContent="center">
                        <Grid size={{ xs: 12, md: 10, lg: 8 }}>
                            <Paper
                                elevation={theme.palette.mode === 'dark' ? 8 : 24}
                                sx={{
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${theme.palette.divider}`,
                                    bgcolor: theme.palette.background.paper,
                                    boxShadow: theme.palette.mode === 'dark'
                                        ? `0 8px 32px ${alpha(theme.palette.common.black, 0.6)}`
                                        : `0 8px 40px ${alpha(theme.palette.primary.main, 0.08)}`,
                                }}
                            >
                                {/* ===== HEADER ===== */}
                                <Box
                                    sx={{
                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 40%, ${theme.palette.secondary.main} 100%)`,
                                        color: '#fff',
                                        p: { xs: 2, md: 3 },
                                        textAlign: 'center',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: '-50%',
                                            right: '-20%',
                                            width: '80%',
                                            height: '200%',
                                            background: alpha(theme.palette.common.white, 0.04),
                                            transform: 'rotate(15deg)',
                                            pointerEvents: 'none',
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: '-60%',
                                            left: '-30%',
                                            width: '60%',
                                            height: '200%',
                                            background: alpha(theme.palette.common.white, 0.03),
                                            transform: 'rotate(-20deg)',
                                            pointerEvents: 'none',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            position: 'relative',
                                            zIndex: 1,
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => navigate(-1)}
                                            sx={{
                                                color: 'white',
                                                bgcolor: alpha(theme.palette.common.white, 0.15),
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.common.white, 0.25),
                                                },
                                            }}
                                            aria-label={t('common.back')}
                                        >
                                            {dir === 'rtl' ? <ArrowForward /> : <ArrowBack />}
                                        </IconButton>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <PersonAdd sx={{ fontSize: 32 }} />
                                            {t('register.title')}
                                        </Typography>
                                        <Box sx={{ width: 40 }} />
                                    </Box>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mt: 1,
                                            opacity: 0.9,
                                            position: 'relative',
                                            zIndex: 1,
                                        }}
                                    >
                                        {t('register.subtitle')}
                                    </Typography>
                                </Box>

                                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                                    {/* ===== Stepper ===== */}
                                    {!isMobile && (
                                        <Stepper
                                            activeStep={currentStep}
                                            sx={{
                                                mb: 4,
                                                '& .MuiStepLabel-root .Mui-completed': {
                                                    color: theme.palette.success.main,
                                                },
                                                '& .MuiStepLabel-root .Mui-active': {
                                                    color: theme.palette.primary.main,
                                                },
                                                '& .MuiStepConnector-line': {
                                                    borderColor: theme.palette.divider,
                                                },
                                            }}
                                            alternativeLabel
                                        >
                                            {steps.map((step) => (
                                                <Step key={step.label}>
                                                    <StepLabel
                                                        StepIconProps={{
                                                            sx: {
                                                                '&.Mui-active': {
                                                                    color: theme.palette.primary.main,
                                                                },
                                                                '&.Mui-completed': {
                                                                    color: theme.palette.success.main,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: currentStep === steps.indexOf(step)
                                                                    ? theme.palette.primary.main
                                                                    : theme.palette.text.secondary,
                                                                fontWeight: currentStep === steps.indexOf(step)
                                                                    ? 600
                                                                    : 400,
                                                            }}
                                                        >
                                                            {step.label}
                                                        </Typography>
                                                    </StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    )}

                                    {/* ===== Mobile Step Indicator ===== */}
                                    {isMobile && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 3,
                                                pb: 2,
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                            }}
                                        >
                                            {steps.map((step, index) => (
                                                <Box
                                                    key={step.label}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: '50%',
                                                            bgcolor:
                                                                index === currentStep
                                                                    ? theme.palette.primary.main
                                                                    : index < currentStep
                                                                    ? theme.palette.success.main
                                                                    : theme.palette.divider,
                                                            transition: 'all 0.3s ease',
                                                        }}
                                                    />
                                                    {index < steps.length - 1 && (
                                                        <Box
                                                            sx={{
                                                                width: 20,
                                                                height: 2,
                                                                bgcolor:
                                                                    index < currentStep
                                                                        ? theme.palette.success.main
                                                                        : theme.palette.divider,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}

                                    {/* ===== Error Alert ===== */}
                                    {submitError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            <Alert
                                                severity="error"
                                                sx={{
                                                    mb: 3,
                                                    borderRadius: 2,
                                                    '& .MuiAlert-icon': {
                                                        color: theme.palette.error.main,
                                                    },
                                                    borderLeft: `4px solid ${theme.palette.error.main}`,
                                                    bgcolor: alpha(theme.palette.error.main, 0.05),
                                                }}
                                                onClose={() => setSubmitError(null)}
                                                icon={<ErrorIcon />}
                                            >
                                                {submitError}
                                            </Alert>
                                        </motion.div>
                                    )}

                                    <form
                                        autoComplete="off"
                                        noValidate
                                        onSubmit={formik.handleSubmit}
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentStep}
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -50 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {/* ===== STEP 1: Personal Information ===== */}
                                                {currentStep === 0 && (
                                                    <Grid container spacing={3}>
                                                        <Grid size={{ xs: 12, md: 6 }}>
                                                            <StyledTextField
                                                                autoFocus
                                                                label={t('register.firstName')}
                                                                name="name.first"
                                                                type="text"
                                                                value={formik.values.name.first}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={
                                                                    formik.touched.name?.first &&
                                                                    Boolean(formik.errors.name?.first)
                                                                }
                                                                helperText={
                                                                    formik.touched.name?.first &&
                                                                    formik.errors.name?.first
                                                                }
                                                                fullWidth
                                                                variant="outlined"
                                                                size="medium"
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 6 }}>
                                                            <StyledTextField
                                                                label={t('register.lastName')}
                                                                name="name.last"
                                                                type="text"
                                                                value={formik.values.name.last}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={
                                                                    formik.touched.name?.last &&
                                                                    Boolean(formik.errors.name?.last)
                                                                }
                                                                helperText={
                                                                    formik.touched.name?.last &&
                                                                    formik.errors.name?.last
                                                                }
                                                                fullWidth
                                                                variant="outlined"
                                                                size="medium"
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12 }}>
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'flex-start',
                                                                    gap: 2,
                                                                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                                                }}
                                                            >
                                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                    <StyledTextField
                                                                        label={t('register.slug')}
                                                                        name="slug"
                                                                        type="text"
                                                                        placeholder={t('register.slug')}
                                                                        value={formik.values.slug}
                                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                        onChange={(e:any) => {
                                                                            const value = e.target.value
                                                                                .toLowerCase()
                                                                                .replace(/[^a-z0-9-]/g, '');
                                                                            formik.setFieldValue('slug', value);
                                                                        }}
                                                                        onBlur={formik.handleBlur}
                                                                        error={
                                                                            formik.touched.slug &&
                                                                            Boolean(formik.errors.slug)
                                                                        }
                                                                        helperText={
                                                                            formik.touched.slug && formik.errors.slug
                                                                                ? formik.errors.slug
                                                                                : t('register.slugHint')
                                                                        }
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        size="medium"
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <Tag sx={{ color: theme.palette.action.active }} />
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                    />
                                                                    <SlugAvailabilityIndicator />
                                                                </Box>
                                                                <Button
                                                                    variant="outlined"
                                                                    onClick={generateSlugFromName}
                                                                    disabled={
                                                                        !formik.values.name.first &&
                                                                        !formik.values.name.last
                                                                    }
                                                                    sx={{
                                                                        mt: 1,
                                                                        flexShrink: 0,
                                                                        borderColor: theme.palette.primary.main,
                                                                        color: theme.palette.primary.main,
                                                                        '&:hover': {
                                                                            borderColor: theme.palette.primary.dark,
                                                                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                                                                        },
                                                                    }}
                                                                >
                                                                    {t('register.generateSlug')}
                                                                </Button>
                                                            </Box>
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                                sx={{ display: 'block', mt: 1 }}
                                                            >
                                                                {t('register.slugExample')}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid size={{ xs: 12 }}>
                                                            <StyledTextField
                                                                label={t('register.email')}
                                                                name="email"
                                                                type="email"
                                                                autoComplete="email"
                                                                value={formik.values.email}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={
                                                                    formik.touched.email &&
                                                                    Boolean(formik.errors.email)
                                                                }
                                                                helperText={
                                                                    formik.touched.email && formik.errors.email
                                                                }
                                                                fullWidth
                                                                variant="outlined"
                                                                size="medium"
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12 }}>
                                                            <StyledTextField
                                                                select
                                                                label={t('register.gender')}
                                                                name="gender"
                                                                value={formik.values.gender}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={
                                                                    formik.touched.gender &&
                                                                    Boolean(formik.errors.gender)
                                                                }
                                                                helperText={
                                                                    formik.touched.gender && formik.errors.gender
                                                                }
                                                                fullWidth
                                                                variant="outlined"
                                                                size="medium"
                                                            >
                                                                <MenuItem value="">
                                                                    {t('register.selectGender')}
                                                                </MenuItem>
                                                                <MenuItem value="male">
                                                                    {t('register.male')}
                                                                </MenuItem>
                                                                <MenuItem value="female">
                                                                    {t('register.female')}
                                                                </MenuItem>
                                                            </StyledTextField>
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {/* ===== STEP 2: Contact Information ===== */}
                                                {currentStep === 1 && (
                                                    <Grid container spacing={3}>
                                                        <Grid size={{ xs: 12, md: 6 }}>
                                                            <StyledTextField
                                                                label={t('register.phone1')}
                                                                name="phone.phone_1"
                                                                type="tel"
                                                                placeholder="05x-xxxxxxx"
                                                                value={formik.values.phone.phone_1}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={
                                                                    formik.touched.phone?.phone_1 &&
                                                                    Boolean(formik.errors.phone?.phone_1)
                                                                }
                                                                helperText={
                                                                    formik.touched.phone?.phone_1 &&
                                                                    formik.errors.phone?.phone_1
                                                                }
                                                                fullWidth
                                                                variant="outlined"
                                                                size="medium"
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 6 }}>
                                                            <StyledTextField
                                                                label={t('register.phone2')}
                                                                name="phone.phone_2"
                                                                type="tel"
                                                                placeholder="05x-xxxxxxx (اختياري)"
                                                                value={formik.values.phone.phone_2}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={
                                                                    formik.touched.phone?.phone_2 &&
                                                                    Boolean(formik.errors.phone?.phone_2)
                                                                }
                                                                helperText={
                                                                    formik.touched.phone?.phone_2 &&
                                                                    formik.errors.phone?.phone_2
                                                                }
                                                                fullWidth
                                                                variant="outlined"
                                                                size="medium"
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 4 }}>
                                                            <Autocomplete
                                                                options={cities}
                                                                value={formik.values.address.city || null}
                                                                onChange={(_event, value) =>
                                                                    formik.setFieldValue('address.city', value)
                                                                }
                                                                onBlur={() =>
                                                                    formik.setFieldTouched('address.city', true)
                                                                }
                                                                renderInput={(params) => (
                                                                    <StyledTextField
                                                                        {...params}
                                                                        label={t('register.city')}
                                                                        variant="outlined"
                                                                        error={
                                                                            formik.touched.address?.city &&
                                                                            Boolean(formik.errors.address?.city)
                                                                        }
                                                                        helperText={
                                                                            formik.touched.address?.city &&
                                                                            formik.errors.address?.city
                                                                        }
                                                                        fullWidth
                                                                        size="medium"
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 6 }}>
                                                            <Autocomplete
                                                                options={streets}
                                                                value={formik.values.address.street || null}
                                                                onChange={(_event, value) =>
                                                                    formik.setFieldValue('address.street', value)
                                                                }
                                                                onBlur={() =>
                                                                    formik.setFieldTouched('address.street', true)
                                                                }
                                                                disabled={
                                                                    !formik.values.address.city ||
                                                                    loadingStreets
                                                                }
                                                                loading={loadingStreets}
                                                                renderInput={(params) => (
                                                                    <StyledTextField
                                                                        {...params}
                                                                        label={t('register.street')}
                                                                        variant="outlined"
                                                                        error={
                                                                            formik.touched.address?.street &&
                                                                            Boolean(formik.errors.address?.street)
                                                                        }
                                                                        helperText={
                                                                            formik.touched.address?.street &&
                                                                            formik.errors.address?.street
                                                                        }
                                                                        fullWidth
                                                                        size="medium"
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 6 }}>
                                                            <StyledTextField
                                                                label={t('register.houseNumber')}
                                                                name="address.houseNumber"
                                                                type="text"
                                                                placeholder="اختياري"
                                                                value={formik.values.address.houseNumber}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={
                                                                    formik.touched.address?.houseNumber &&
                                                                    Boolean(formik.errors.address?.houseNumber)
                                                                }
                                                                helperText={
                                                                    formik.touched.address?.houseNumber &&
                                                                    formik.errors.address?.houseNumber
                                                                }
                                                                fullWidth
                                                                variant="outlined"
                                                                size="medium"
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12 }}>
                                                            <StyledTextField
                                                                label={t('register.imageUrl')}
                                                                name="image.url"
                                                                type="url"
                                                                placeholder="https://example.com/image.jpg (اختياري)"
                                                                value={formik.values.image.url}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={
                                                                    formik.touched.image?.url &&
                                                                    Boolean(formik.errors.image?.url)
                                                                }
                                                                helperText={
                                                                    formik.touched.image?.url &&
                                                                    formik.errors.image?.url
                                                                }
                                                                fullWidth
                                                                variant="outlined"
                                                                size="medium"
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {/* ===== STEP 3: Security ===== */}
                                                {currentStep === 2 && (
                                                    <Grid container spacing={3}>
                                                        <Grid size={{ xs: 12 }}>
                                                            <FormControl
                                                                variant="outlined"
                                                                error={
                                                                    formik.touched.password &&
                                                                    Boolean(formik.errors.password)
                                                                }
                                                                fullWidth
                                                            >
                                                                <InputLabel htmlFor="password">
                                                                    {t('register.password')}
                                                                </InputLabel>
                                                                <OutlinedInput
                                                                    id="password"
                                                                    type={showPassword ? 'text' : 'password'}
                                                                    autoComplete="new-password"
                                                                    sx={{
                                                                        borderRadius: 2,
                                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                            borderColor: theme.palette.primary.main,
                                                                            borderWidth: 2,
                                                                        },
                                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                            borderColor: theme.palette.primary.light,
                                                                        },
                                                                    }}
                                                                    endAdornment={
                                                                        <InputAdornment position="end">
                                                                            <IconButton
                                                                                aria-label={
                                                                                    showPassword
                                                                                        ? 'إخفاء كلمة المرور'
                                                                                        : 'إظهار كلمة المرور'
                                                                                }
                                                                                onClick={handleClickShowPassword}
                                                                                onMouseDown={handleMouseDownPassword}
                                                                                edge="end"
                                                                            >
                                                                                {showPassword ? (
                                                                                    <VisibilityOff />
                                                                                ) : (
                                                                                    <Visibility />
                                                                                )}
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    }
                                                                    label={t('register.password')}
                                                                    name="password"
                                                                    value={formik.values.password}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                />
                                                                {formik.touched.password &&
                                                                    formik.errors.password && (
                                                                        <FormHelperText error>
                                                                            {formik.errors.password}
                                                                        </FormHelperText>
                                                                    )}
                                                                {formik.values.password && (
                                                                    <PasswordStrengthIndicator
                                                                        password={formik.values.password}
                                                                    />
                                                                )}
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid size={{ xs: 12 }}>
                                                            <FormControl
                                                                variant="outlined"
                                                                error={
                                                                    formik.touched.confirmPassword &&
                                                                    Boolean(formik.errors.confirmPassword)
                                                                }
                                                                fullWidth
                                                            >
                                                                <InputLabel htmlFor="confirmPassword">
                                                                    {t('register.confirmPassword')}
                                                                </InputLabel>
                                                                <OutlinedInput
                                                                    id="confirmPassword"
                                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                                    autoComplete="new-password"
                                                                    sx={{
                                                                        borderRadius: 2,
                                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                            borderColor: theme.palette.primary.main,
                                                                            borderWidth: 2,
                                                                        },
                                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                            borderColor: theme.palette.primary.light,
                                                                        },
                                                                    }}
                                                                    endAdornment={
                                                                        <InputAdornment position="end">
                                                                            <IconButton
                                                                                aria-label={
                                                                                    showConfirmPassword
                                                                                        ? 'إخفاء تأكيد كلمة المرور'
                                                                                        : 'إظهار تأكيد كلمة المرور'
                                                                                }
                                                                                onClick={handleClickShowConfirmPassword}
                                                                                onMouseDown={handleMouseDownPassword}
                                                                                edge="end"
                                                                            >
                                                                                {showConfirmPassword ? (
                                                                                    <VisibilityOff />
                                                                                ) : (
                                                                                    <Visibility />
                                                                                )}
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    }
                                                                    label={t('register.confirmPassword')}
                                                                    name="confirmPassword"
                                                                    value={formik.values.confirmPassword}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                />
                                                                {formik.touched.confirmPassword &&
                                                                    formik.errors.confirmPassword && (
                                                                        <FormHelperText error>
                                                                            {formik.errors.confirmPassword}
                                                                        </FormHelperText>
                                                                    )}
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {/* ===== STEP 4: Agreements ===== */}
                                                {currentStep === 3 && (
                                                    <Grid container spacing={3}>
                                                        <Grid size={{ xs: 12 }}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        id="terms"
                                                                        name="terms"
                                                                        color="primary"
                                                                        checked={formik.values.terms}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        sx={{
                                                                            '&.Mui-checked': {
                                                                                color: theme.palette.primary.main,
                                                                            },
                                                                        }}
                                                                    />
                                                                }
                                                                label={
                                                                    <>
                                                                        {t('register.agreeTo')}{' '}
                                                                        <Link
                                                                            to={path.TermOfUse}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{
                                                                                color: theme.palette.primary.main,
                                                                                fontWeight: 600,
                                                                                textDecoration: 'none',
                                                                            }}
                                                                            onMouseEnter={(e) => {
                                                                                e.currentTarget.style.textDecoration = 'underline';
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                e.currentTarget.style.textDecoration = 'none';
                                                                            }}
                                                                        >
                                                                            {t('register.termsOfService')}
                                                                        </Link>{' '}
                                                                        {t('register.and')}{' '}
                                                                        <Link
                                                                            to={path.PrivacyAndPolicy}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{
                                                                                color: theme.palette.primary.main,
                                                                                fontWeight: 600,
                                                                                textDecoration: 'none',
                                                                            }}
                                                                            onMouseEnter={(e) => {
                                                                                e.currentTarget.style.textDecoration = 'underline';
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                e.currentTarget.style.textDecoration = 'none';
                                                                            }}
                                                                        >
                                                                            {t('register.privacyPolicy')}
                                                                        </Link>
                                                                    </>
                                                                }
                                                            />
                                                            {formik.touched.terms &&
                                                                formik.errors.terms && (
                                                                    <Typography
                                                                        color="error"
                                                                        variant="caption"
                                                                        sx={{ display: 'block', mt: 1 }}
                                                                    >
                                                                        {formik.errors.terms}
                                                                    </Typography>
                                                                )}
                                                        </Grid>
                                                        <Grid size={{ xs: 12 }}>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    mt: 2,
                                                                    lineHeight: 1.6,
                                                                    p: 2,
                                                                    borderRadius: 2,
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                                                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.06)}`,
                                                                }}
                                                            >
                                                                {t('register.privacyNote')}
                                                            </Typography>
                                                        </Grid>
                                                        {/* Profile Preview */}
                                                        <Grid size={{ xs: 12 }}>
                                                            <Paper
                                                                variant="outlined"
                                                                sx={{
                                                                    p: 3,
                                                                    mt: 2,
                                                                    borderRadius: 3,
                                                                    borderColor: alpha(theme.palette.primary.main, 0.15),
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    gutterBottom
                                                                    sx={{
                                                                        color: theme.palette.primary.main,
                                                                        fontWeight: 600,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1,
                                                                    }}
                                                                >
                                                                    {t('register.profilePreview')}
                                                                </Typography>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 2,
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            width: 56,
                                                                            height: 56,
                                                                            borderRadius: '50%',
                                                                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            color: theme.palette.primary.main,
                                                                            fontWeight: 600,
                                                                            fontSize: 24,
                                                                        }}
                                                                    >
                                                                        {formik.values.name.first
                                                                            ? formik.values.name.first.charAt(0).toUpperCase()
                                                                            : 'U'}
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography variant="body1" fontWeight="medium">
                                                                            {formik.values.name.first}{' '}
                                                                            {formik.values.name.last}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            @{formik.values.slug || 'username'}
                                                                        </Typography>
                                                                        <br />
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {t('register.profileLink')}:{' '}
                                                                            <Box
                                                                                component="span"
                                                                                sx={{
                                                                                    color: theme.palette.primary.main,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                safqa.com/users/customer
                                                                                {formik.values.slug || 'username'}
                                                                            </Box>
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Paper>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* ===== Navigation Buttons ===== */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                mt: 4,
                                                pt: 3,
                                                borderTop: `1px solid ${theme.palette.divider}`,
                                            }}
                                        >
                                            <Button
                                                variant="outlined"
                                                onClick={handleBack}
                                                disabled={currentStep === 0 || isLoading}
                                                startIcon={dir === 'rtl' ? <ArrowForward /> : <ArrowBack />}
                                                sx={{
                                                    minWidth: 120,
                                                    gap: 1,
                                                    borderColor: theme.palette.primary.main,
                                                    color: theme.palette.primary.main,
                                                    '&:hover': {
                                                        borderColor: theme.palette.primary.dark,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                                                    },
                                                    '&:disabled': {
                                                        borderColor: theme.palette.action.disabledBackground,
                                                        color: theme.palette.action.disabled,
                                                    },
                                                }}
                                            >
                                                {t('common.back')}
                                            </Button>

                                            {currentStep < steps.length - 1 ? (
                                                <Button
                                                    variant="contained"
                                                    onClick={handleNext}
                                                    sx={{
                                                        minWidth: 120,
                                                        bgcolor: theme.palette.primary.main,
                                                        '&:hover': {
                                                            bgcolor: theme.palette.primary.dark,
                                                            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                                                        },
                                                    }}
                                                >
                                                    {t('common.next')}
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                    disabled={
                                                        isLoading ||
                                                        !formik.isValid ||
                                                        slugAvailable === false
                                                    }
                                                    sx={{
                                                        minWidth: 160,
                                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                                        '&:hover': {
                                                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                                            boxShadow: `0 4px 24px ${alpha(theme.palette.primary.main, 0.5)}`,
                                                        },
                                                        '&:disabled': {
                                                            background: theme.palette.action.disabledBackground,
                                                            color: theme.palette.action.disabled,
                                                        },
                                                    }}
                                                    startIcon={
                                                        isLoading ? (
                                                            <CircularProgress size={20} color="inherit" />
                                                        ) : null
                                                    }
                                                >
                                                    {isLoading
                                                        ? t('register.creatingAccount')
                                                        : t('register.completeRegistration')}
                                                </Button>
                                            )}
                                        </Box>
                                    </form>

                                    {/* ===== Login Link ===== */}
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            mt: 4,
                                            pt: 3,
                                            borderTop: `1px solid ${theme.palette.divider}`,
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{ mb: 1 }}
                                        >
                                            {t('register.haveAccount')}
                                        </Typography>
                                        <Button
                                            variant="text"
                                            onClick={() => navigate(path.Login)}
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.primary.main,
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                                },
                                            }}
                                        >
                                            {t('register.loginHere')}
                                        </Button>
                                    </Box>

                                    {/* ===== Quick Links ===== */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: 3,
                                            mt: 3,
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <Link
                                            to={path.Contact}
                                            style={{
                                                textDecoration: 'none',
                                                color: theme.palette.text.secondary,
                                                fontSize: '0.875rem',
                                                transition: 'color 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = theme.palette.primary.main;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = theme.palette.text.secondary;
                                            }}
                                        >
                                            {t('common.contact')}
                                        </Link>
                                        <Link
                                            to={path.About}
                                            style={{
                                                textDecoration: 'none',
                                                color: theme.palette.text.secondary,
                                                fontSize: '0.875rem',
                                                transition: 'color 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = theme.palette.primary.main;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = theme.palette.text.secondary;
                                            }}
                                        >
                                            {t('common.about')}
                                        </Link>
                                    </Box>
                                </CardContent>
                            </Paper>
                        </Grid>
                    </Grid>
                </motion.div>
            </Box>
        </>
    );
};

export default Register;