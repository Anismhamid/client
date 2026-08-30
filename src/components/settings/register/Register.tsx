import {
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { useFormik } from 'formik';

import { Link, useNavigate } from 'react-router-dom';

import { path } from '../../../routes/routes';

import {
    registerNewUser,
    checkSlugAvailability,
} from '../../../services/usersServices';

import {
    Autocomplete,
    Alert,
    alpha,
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
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import {
    ArrowBack,
    ArrowForward,
    Check as CheckIcon,
    CheckCircle,
    Close as CloseIcon,
    Error as ErrorIcon,
    PersonAdd,
    Tag,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';

import { motion, AnimatePresence } from 'framer-motion';

import { debounce } from 'lodash';

import { useTranslation } from 'react-i18next';

import useAddressData from '../../../hooks/useAddressData';

import handleRTL from '../../../locales/handleRTL';

import {
    registerInitialValues,
    registerValidationSchema,
    UserRegisterFormValues,
} from './registerSchema';

const Register: FunctionComponent = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();

    const dir = handleRTL();

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // =========================================================
    // STATE
    // =========================================================

    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [submitError, setSubmitError] = useState<string | null>(null);

    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [currentStep, setCurrentStep] = useState(0);

    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

    const [checkingSlug, setCheckingSlug] = useState(false);

    /**
     * Used to prevent an old slug request from overriding
     * the result of a newer request.
     */
    const slugRequestId = useRef(0);

    // =========================================================
    // PASSWORD VISIBILITY
    // =========================================================

    const handleClickShowPassword = useCallback(() => {
        setShowPassword((previous) => !previous);
    }, []);

    const handleClickShowConfirmPassword = useCallback(() => {
        setShowConfirmPassword((previous) => !previous);
    }, []);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
    };

    // =========================================================
    // SLUG CHECK
    // =========================================================

    const checkSlug = useMemo(
        () =>
            debounce(async (slug: string) => {
                const normalizedSlug = slug.trim().toLowerCase();

                if (normalizedSlug.length < 3) {
                    setSlugAvailable(null);
                    setCheckingSlug(false);
                    return;
                }

                const requestId = ++slugRequestId.current;

                setCheckingSlug(true);

                try {
                    const available =
                        await checkSlugAvailability(normalizedSlug);

                    /**
                     * Ignore stale requests.
                     */
                    if (requestId !== slugRequestId.current) {
                        return;
                    }

                    setSlugAvailable(Boolean(available));
                } catch (error) {
                    console.error('Error checking slug:', error);

                    if (requestId === slugRequestId.current) {
                        setSlugAvailable(null);
                    }
                } finally {
                    if (requestId === slugRequestId.current) {
                        setCheckingSlug(false);
                    }
                }
            }, 500),
        [],
    );

    useEffect(() => {
        return () => {
            checkSlug.cancel();
            slugRequestId.current += 1;
        };
    }, [checkSlug]);

    // =========================================================
    // FORMIK
    // =========================================================

    const formik = useFormik<UserRegisterFormValues>({
        initialValues: registerInitialValues,

        validationSchema: registerValidationSchema(t),

        validateOnMount: true,

        onSubmit: async (user: UserRegisterFormValues) => {
            if (checkingSlug || slugAvailable !== true) {
                return;
            }

            setIsLoading(true);
            setSubmitError(null);

            try {
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

                        houseNumber: user.address.houseNumber?.trim() || '',
                    },

                    email: user.email.trim().toLowerCase(),

                    personalEmail:
                        user.personalEmail?.trim().toLowerCase() || '',

                    password: user.password,

                    gender: user.gender,

                    slug: user.slug.trim().toLowerCase(),

                    image: {
                        url: user.image?.url?.trim() || '',

                        alt:
                            user.image?.alt?.trim() ||
                            `${user.name.first} ${user.name.last}`,
                    },

                    terms: user.terms,
                };

                const token = await registerNewUser(dataToSend);

                localStorage.setItem('token', token);

                setSubmitSuccess(true);

                window.setTimeout(() => {
                    navigate(path.Home);
                }, 1500);
            } catch (error: unknown) {
                const errors = error as {
                    code?: string;
                    data?: {
                        code?: string;
                    };
                };

                const errorData = errors?.data || errors;

                const errorCode = errorData?.code;

                const errorMessage = handleRegistrationError(errorCode);

                setSubmitError(errorMessage);

                if (errorCode === 'EMAIL_EXISTS') {
                    setCurrentStep(0);

                    formik.setFieldTouched('email', true);

                    formik.setFieldError('email', errorMessage);
                }

                if (errorCode === 'SLUG_EXISTS') {
                    setCurrentStep(0);

                    setSlugAvailable(false);

                    formik.setFieldTouched('slug', true);

                    formik.setFieldError('slug', errorMessage);
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    // =========================================================
    // ERROR HANDLER
    // =========================================================

    const handleRegistrationError = (errorCode?: string): string => {
        const errorMap: Record<string, string> = {
            EMAIL_EXISTS: t('register.errors.EMAIL_EXISTS'),

            SLUG_EXISTS: t('register.errors.slugExists'),

            WEAK_PASSWORD: t('register.errors.weakPassword'),

            INVALID_PHONE: t('register.errors.invalidPhone'),

            NETWORK_ERROR: t('register.errors.networkError'),

            RATE_LIMITED: t('register.errors.rateLimited'),
        };

        return errorMap[errorCode || ''] || t('register.errors.serverError');
    };

    // =========================================================
    // AUTO GENERATE SLUG
    // =========================================================

    const generateSlugFromName = useCallback(() => {
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

        formik.setFieldValue('slug', generatedSlug, true);

        if (generatedSlug.length >= 3) {
            checkSlug(generatedSlug);
        }
    }, [formik, checkSlug]);

    // =========================================================
    // SLUG CHANGE
    // =========================================================

    useEffect(() => {
        const slug = formik.values.slug?.trim().toLowerCase() || '';

        /**
         * Cancel previous debounce.
         */
        checkSlug.cancel();

        if (slug.length < 3) {
            setSlugAvailable(null);
            setCheckingSlug(false);
            return;
        }

        setSlugAvailable(null);

        checkSlug(slug);
    }, [formik.values.slug, checkSlug]);

    // =========================================================
    // ADDRESS DATA
    // =========================================================

    const { cities, streets, loadingStreets } = useAddressData(
        formik.values.address.city,
    );

    // =========================================================
    // STEPS
    // =========================================================

    const steps = useMemo(
        () => [
            {
                label: t('register.steps.personalInfo'),

                fields: ['name.first', 'name.last', 'slug', 'email', 'gender'],
            },

            {
                label: t('register.steps.contactInfo'),

                fields: [
                    'phone.phone_1',
                    'phone.phone_2',
                    'address',
                    'image.url',
                ],
            },

            {
                label: t('register.steps.security'),

                fields: ['password', 'confirmPassword'],
            },

            {
                label: t('register.steps.agreements'),

                fields: ['terms'],
            },
        ],
        [t],
    );

    // =========================================================
    // STEP VALIDATION
    // =========================================================

    const validateCurrentStep = useCallback(async () => {
        const validationErrors = await formik.validateForm();

        const currentFields = steps[currentStep].fields;

        let hasErrors = false;

        currentFields.forEach((field) => {
            if (field === 'address') {
                if (
                    validationErrors.address?.city ||
                    validationErrors.address?.street
                ) {
                    hasErrors = true;
                }

                return;
            }

            const error = field.split('.').reduce((object: unknown, key) => {
                if (object && typeof object === 'object') {
                    return (object as Record<string, unknown>)[key];
                }

                return undefined;
            }, validationErrors);

            if (error) {
                hasErrors = true;
            }
        });

        /**
         * Slug must be confirmed available
         * before moving from step 1.
         */
        if (currentStep === 0 && slugAvailable !== true) {
            hasErrors = true;
        }

        return !hasErrors;
    }, [currentStep, formik, slugAvailable, steps]);

    // =========================================================
    // NEXT
    // =========================================================

    const handleNext = async () => {
        const isValid = await validateCurrentStep();

        if (isValid) {
            setCurrentStep((previous) =>
                Math.min(previous + 1, steps.length - 1),
            );

            return;
        }

        const currentFields = steps[currentStep].fields;

        currentFields.forEach((field) => {
            if (field === 'address') {
                formik.setFieldTouched('address.city', true);

                formik.setFieldTouched('address.street', true);

                return;
            }

            formik.setFieldTouched(field, true);
        });
    };

    // =========================================================
    // BACK
    // =========================================================

    const handleBack = () => {
        setCurrentStep((previous) => Math.max(previous - 1, 0));
    };

    // =========================================================
    // PASSWORD STRENGTH
    // =========================================================

    const PasswordStrengthIndicator = ({ password }: { password: string }) => {
        const getStrength = (value: string) => {
            let score = 0;

            if (value.length >= 8) {
                score++;
            }

            if (/[a-z]/.test(value)) {
                score++;
            }

            if (/[A-Z]/.test(value)) {
                score++;
            }

            if (/[0-9]/.test(value)) {
                score++;
            }

            if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                score++;
            }

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
            <Box
                dir={dir}
                sx={{
                    mt: 1,
                    mb: 2,
                }}
            >
                <Typography variant='caption' color='text.secondary'>
                    {strengthLabels[strength]}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 0.5,
                        mt: 0.5,
                    }}
                >
                    {[...Array(5)].map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                flex: 1,
                                height: 4,
                                borderRadius: 1,

                                bgcolor:
                                    index < strength
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

    // =========================================================
    // SLUG INDICATOR
    // =========================================================

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

                    <Typography variant='caption' color='text.secondary'>
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
                    <CheckIcon
                        sx={{
                            color: theme.palette.success.main,

                            fontSize: 16,
                        }}
                    />

                    <Typography
                        variant='caption'
                        sx={{
                            color: theme.palette.success.main,
                        }}
                    >
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
                    <CloseIcon
                        sx={{
                            color: theme.palette.error.main,

                            fontSize: 16,
                        }}
                    />

                    <Typography
                        variant='caption'
                        sx={{
                            color: theme.palette.error.main,
                        }}
                    >
                        {t('register.slugTaken')}
                    </Typography>
                </Box>
            );
        }

        return null;
    };

    // =========================================================
    // STYLED TEXT FIELD
    // =========================================================

    const StyledTextField = useMemo(
        () =>
            function StyledTextField(
                props: React.ComponentProps<typeof TextField>,
            ) {
                const theme = useTheme();
                return (
                    <TextField
                        {...props}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                backgroundColor:
                                    theme.palette.mode === 'dark'
                                        ? alpha(
                                              theme.palette.common.white,
                                              0.05,
                                          )
                                        : alpha(
                                              theme.palette.common.black,
                                              0.02,
                                          ),
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
            },
        [],
    );

    // =========================================================
    // SUCCESS SCREEN
    // =========================================================

    if (submitSuccess) {
        return (
            <>
                <title>{t('register.success.title')} | صفقة</title>

                <meta
                    name='description'
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
                        sx={{
                            maxWidth: 500,
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 4,

                            boxShadow: `0 8px 40px ${alpha(
                                theme.palette.primary.main,
                                0.15,
                            )}`,

                            border: `1px solid ${theme.palette.divider}`,

                            bgcolor: theme.palette.background.paper,
                        }}
                    >
                        <motion.div
                            initial={{
                                scale: 0,
                            }}
                            animate={{
                                scale: 1,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 200,
                            }}
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
                            variant='h4'
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {t('register.success.title')}
                        </Typography>

                        <Typography
                            variant='body1'
                            color='text.secondary'
                            paragraph
                        >
                            {t('register.success.message')}
                        </Typography>

                        <Typography
                            variant='body2'
                            color='text.secondary'
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

                                bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.08,
                                ),

                                border: `1px solid ${alpha(
                                    theme.palette.primary.main,
                                    0.2,
                                )}`,

                                mb: 2,
                            }}
                        >
                            <Typography
                                variant='body2'
                                sx={{
                                    color: theme.palette.primary.main,

                                    fontWeight: 600,
                                }}
                            >
                                {window.location.origin}
                                /customer/
                                {formik.values.slug}
                            </Typography>
                        </Box>

                        <Typography
                            variant='body2'
                            color='text.secondary'
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

    // =========================================================
    // SEO
    // =========================================================

    const currentUrl = 'https://client-qqq1.vercel.app/register';

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <>
            <link rel='canonical' href={currentUrl} />

            <title>{t('register.title')} | صفقة</title>

            <meta
                name='description'
                content={`${t('register.title')} | صفقة`}
            />

            <Box
                dir={dir}
                sx={{
                    minHeight: '100vh',

                    py: {
                        xs: 2,
                        md: 4,
                    },

                    px: {
                        xs: 1,
                        md: 2,
                    },

                    bgcolor:
                        theme.palette.mode === 'dark'
                            ? theme.palette.background.default
                            : '#f0f4f8',
                }}
            >
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                >
                    <Grid container justifyContent='center'>
                        <Grid
                            size={{
                                xs: 12,
                                md: 10,
                                lg: 8,
                            }}
                        >
                            <Paper
                                elevation={
                                    theme.palette.mode === 'dark' ? 8 : 24
                                }
                                sx={{
                                    borderRadius: 4,
                                    overflow: 'hidden',

                                    backdropFilter: 'blur(10px)',

                                    border: `1px solid ${theme.palette.divider}`,

                                    bgcolor: theme.palette.background.paper,

                                    boxShadow:
                                        theme.palette.mode === 'dark'
                                            ? `0 8px 32px ${alpha(
                                                  theme.palette.common.black,
                                                  0.6,
                                              )}`
                                            : `0 8px 40px ${alpha(
                                                  theme.palette.primary.main,
                                                  0.08,
                                              )}`,
                                }}
                            >
                                {/* =================================================
                                    HEADER
                                ================================================= */}

                                <Box
                                    sx={{
                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 40%, ${theme.palette.secondary.main} 100%)`,

                                        color: '#fff',

                                        p: {
                                            xs: 2,
                                            md: 3,
                                        },

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

                                            background: alpha(
                                                theme.palette.common.white,
                                                0.04,
                                            ),

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

                                            background: alpha(
                                                theme.palette.common.white,
                                                0.03,
                                            ),

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

                                                bgcolor: alpha(
                                                    theme.palette.common.white,
                                                    0.15,
                                                ),

                                                '&:hover': {
                                                    bgcolor: alpha(
                                                        theme.palette.common
                                                            .white,
                                                        0.25,
                                                    ),
                                                },
                                            }}
                                            aria-label={t('common.back')}
                                        >
                                            {dir === 'rtl' ? (
                                                <ArrowForward />
                                            ) : (
                                                <ArrowBack />
                                            )}
                                        </IconButton>

                                        <Typography
                                            variant='h4'
                                            sx={{
                                                fontWeight: 700,

                                                display: 'flex',

                                                alignItems: 'center',

                                                gap: 1,
                                            }}
                                        >
                                            <PersonAdd
                                                sx={{
                                                    fontSize: 32,
                                                }}
                                            />

                                            {t('register.title')}
                                        </Typography>

                                        <Box
                                            sx={{
                                                width: 40,
                                            }}
                                        />
                                    </Box>

                                    <Typography
                                        variant='body1'
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

                                <CardContent
                                    sx={{
                                        p: {
                                            xs: 2,
                                            md: 4,
                                        },
                                    }}
                                >
                                    {/* =================================================
                                        STEPPER
                                    ================================================= */}

                                    {!isMobile && (
                                        <Stepper
                                            activeStep={currentStep}
                                            alternativeLabel
                                            sx={{
                                                mb: 4,

                                                '& .MuiStepLabel-root .Mui-completed':
                                                    {
                                                        color: theme.palette
                                                            .success.main,
                                                    },

                                                '& .MuiStepLabel-root .Mui-active':
                                                    {
                                                        color: theme.palette
                                                            .primary.main,
                                                    },

                                                '& .MuiStepConnector-line': {
                                                    borderColor:
                                                        theme.palette.divider,
                                                },
                                            }}
                                        >
                                            {steps.map((step, index) => (
                                                <Step key={step.label}>
                                                    <StepLabel
                                                        StepIconProps={{
                                                            sx: {
                                                                '&.Mui-active':
                                                                    {
                                                                        color: theme
                                                                            .palette
                                                                            .primary
                                                                            .main,
                                                                    },

                                                                '&.Mui-completed':
                                                                    {
                                                                        color: theme
                                                                            .palette
                                                                            .success
                                                                            .main,
                                                                    },
                                                            },
                                                        }}
                                                    >
                                                        <Typography
                                                            variant='caption'
                                                            sx={{
                                                                color:
                                                                    currentStep ===
                                                                    index
                                                                        ? theme
                                                                              .palette
                                                                              .primary
                                                                              .main
                                                                        : theme
                                                                              .palette
                                                                              .text
                                                                              .secondary,

                                                                fontWeight:
                                                                    currentStep ===
                                                                    index
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

                                    {/* =================================================
                                        MOBILE STEP INDICATOR
                                    ================================================= */}

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
                                                                index ===
                                                                currentStep
                                                                    ? theme
                                                                          .palette
                                                                          .primary
                                                                          .main
                                                                    : index <
                                                                        currentStep
                                                                      ? theme
                                                                            .palette
                                                                            .success
                                                                            .main
                                                                      : theme
                                                                            .palette
                                                                            .divider,
                                                        }}
                                                    />

                                                    {index <
                                                        steps.length - 1 && (
                                                        <Box
                                                            sx={{
                                                                width: 20,
                                                                height: 2,

                                                                bgcolor:
                                                                    index <
                                                                    currentStep
                                                                        ? theme
                                                                              .palette
                                                                              .success
                                                                              .main
                                                                        : theme
                                                                              .palette
                                                                              .divider,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}

                                    {/* =================================================
                                        SUBMIT ERROR
                                    ================================================= */}

                                    {submitError && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -20,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                        >
                                            <Alert
                                                severity='error'
                                                onClose={() =>
                                                    setSubmitError(null)
                                                }
                                                icon={<ErrorIcon />}
                                                sx={{
                                                    mb: 3,

                                                    borderRadius: 2,

                                                    borderLeft: `4px solid ${theme.palette.error.main}`,

                                                    bgcolor: alpha(
                                                        theme.palette.error
                                                            .main,
                                                        0.05,
                                                    ),
                                                }}
                                            >
                                                {submitError}
                                            </Alert>
                                        </motion.div>
                                    )}

                                    {/* =================================================
                                        FORM
                                    ================================================= */}

                                    <form
                                        autoComplete='off'
                                        noValidate
                                        onSubmit={formik.handleSubmit}
                                    >
                                        <AnimatePresence mode='wait'>
                                            <motion.div
                                                key={currentStep}
                                                initial={{
                                                    opacity: 0,
                                                    x: dir === 'rtl' ? -50 : 50,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    x: dir === 'rtl' ? 50 : -50,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                }}
                                            >
                                                {/* =================================================
                                                    STEP 1
                                                ================================================= */}

                                                {currentStep === 0 && (
                                                    <Grid container spacing={3}>
                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                                md: 6,
                                                            }}
                                                        >
                                                            <StyledTextField
                                                                autoFocus
                                                                label={t(
                                                                    'register.firstName',
                                                                )}
                                                                name='name.first'
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .name
                                                                        .first
                                                                }
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                error={
                                                                    formik
                                                                        .touched
                                                                        .name
                                                                        ?.first &&
                                                                    Boolean(
                                                                        formik
                                                                            .errors
                                                                            .name
                                                                            ?.first,
                                                                    )
                                                                }
                                                                helperText={
                                                                    formik
                                                                        .touched
                                                                        .name
                                                                        ?.first &&
                                                                    formik
                                                                        .errors
                                                                        .name
                                                                        ?.first
                                                                }
                                                                fullWidth
                                                            />
                                                        </Grid>

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                                md: 6,
                                                            }}
                                                        >
                                                            <StyledTextField
                                                                label={t(
                                                                    'register.lastName',
                                                                )}
                                                                name='name.last'
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .name
                                                                        .last
                                                                }
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                error={
                                                                    formik
                                                                        .touched
                                                                        .name
                                                                        ?.last &&
                                                                    Boolean(
                                                                        formik
                                                                            .errors
                                                                            .name
                                                                            ?.last,
                                                                    )
                                                                }
                                                                helperText={
                                                                    formik
                                                                        .touched
                                                                        .name
                                                                        ?.last &&
                                                                    formik
                                                                        .errors
                                                                        .name
                                                                        ?.last
                                                                }
                                                                fullWidth
                                                            />
                                                        </Grid>

                                                        {/* SLUG */}

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        'flex',

                                                                    alignItems:
                                                                        'flex-start',

                                                                    gap: 2,

                                                                    flexWrap: {
                                                                        xs: 'wrap',
                                                                        sm: 'nowrap',
                                                                    },
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        flex: 1,
                                                                        minWidth: 0,
                                                                    }}
                                                                >
                                                                    <StyledTextField
                                                                        label={t(
                                                                            'register.slug',
                                                                        )}
                                                                        name='slug'
                                                                        value={
                                                                            formik
                                                                                .values
                                                                                .slug
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) => {
                                                                            const value =
                                                                                event.target.value
                                                                                    .toLowerCase()
                                                                                    .replace(
                                                                                        /[^a-z0-9-]/g,
                                                                                        '',
                                                                                    );

                                                                            formik.setFieldValue(
                                                                                'slug',
                                                                                value,
                                                                            );
                                                                        }}
                                                                        onBlur={
                                                                            formik.handleBlur
                                                                        }
                                                                        error={
                                                                            formik
                                                                                .touched
                                                                                .slug &&
                                                                            Boolean(
                                                                                formik
                                                                                    .errors
                                                                                    .slug,
                                                                            )
                                                                        }
                                                                        helperText={
                                                                            formik
                                                                                .touched
                                                                                .slug &&
                                                                            formik
                                                                                .errors
                                                                                .slug
                                                                                ? formik
                                                                                      .errors
                                                                                      .slug
                                                                                : t(
                                                                                      'register.slugHint',
                                                                                  )
                                                                        }
                                                                        fullWidth
                                                                        InputProps={{
                                                                            startAdornment:
                                                                                (
                                                                                    <InputAdornment position='start'>
                                                                                        <Tag />
                                                                                    </InputAdornment>
                                                                                ),
                                                                        }}
                                                                    />

                                                                    <SlugAvailabilityIndicator />
                                                                </Box>

                                                                <Button
                                                                    variant='outlined'
                                                                    onClick={
                                                                        generateSlugFromName
                                                                    }
                                                                    disabled={
                                                                        !formik
                                                                            .values
                                                                            .name
                                                                            .first &&
                                                                        !formik
                                                                            .values
                                                                            .name
                                                                            .last
                                                                    }
                                                                    sx={{
                                                                        mt: 1,
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    {t(
                                                                        'register.generateSlug',
                                                                    )}
                                                                </Button>
                                                            </Box>

                                                            <Typography
                                                                variant='caption'
                                                                color='text.secondary'
                                                                sx={{
                                                                    display:
                                                                        'block',

                                                                    mt: 1,
                                                                }}
                                                            >
                                                                {t(
                                                                    'register.slugExample',
                                                                )}
                                                            </Typography>
                                                        </Grid>

                                                        {/* EMAIL */}

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                            }}
                                                        >
                                                            <StyledTextField
                                                                label={t(
                                                                    'register.email',
                                                                )}
                                                                name='email'
                                                                type='email'
                                                                autoComplete='email'
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .email
                                                                }
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                error={
                                                                    formik
                                                                        .touched
                                                                        .email &&
                                                                    Boolean(
                                                                        formik
                                                                            .errors
                                                                            .email,
                                                                    )
                                                                }
                                                                helperText={
                                                                    formik
                                                                        .touched
                                                                        .email &&
                                                                    formik
                                                                        .errors
                                                                        .email
                                                                }
                                                                fullWidth
                                                            />
                                                        </Grid>

                                                        {/* PERSONAL EMAIL */}

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                            }}
                                                        >
                                                            <StyledTextField
                                                                label={t(
                                                                    'register.personalEmail',
                                                                )}
                                                                name='personalEmail'
                                                                type='email'
                                                                autoComplete='email'
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .personalEmail
                                                                }
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                error={
                                                                    formik
                                                                        .touched
                                                                        .personalEmail &&
                                                                    Boolean(
                                                                        formik
                                                                            .errors
                                                                            .personalEmail,
                                                                    )
                                                                }
                                                                helperText={
                                                                    formik
                                                                        .touched
                                                                        .personalEmail &&
                                                                    formik
                                                                        .errors
                                                                        .personalEmail
                                                                }
                                                                fullWidth
                                                            />
                                                        </Grid>

                                                        {/* GENDER */}

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                            }}
                                                        >
                                                            <StyledTextField
                                                                select
                                                                label={t(
                                                                    'register.gender',
                                                                )}
                                                                name='gender'
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .gender
                                                                }
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                error={
                                                                    formik
                                                                        .touched
                                                                        .gender &&
                                                                    Boolean(
                                                                        formik
                                                                            .errors
                                                                            .gender,
                                                                    )
                                                                }
                                                                helperText={
                                                                    formik
                                                                        .touched
                                                                        .gender &&
                                                                    formik
                                                                        .errors
                                                                        .gender
                                                                }
                                                                fullWidth
                                                            >
                                                                <MenuItem value=''>
                                                                    {t(
                                                                        'register.selectGender',
                                                                    )}
                                                                </MenuItem>

                                                                <MenuItem value='male'>
                                                                    {t(
                                                                        'register.male',
                                                                    )}
                                                                </MenuItem>

                                                                <MenuItem value='female'>
                                                                    {t(
                                                                        'register.female',
                                                                    )}
                                                                </MenuItem>
                                                            </StyledTextField>
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {/* =================================================
                                                    STEP 2
                                                ================================================= */}

                                                {currentStep === 1 && (
                                                    <Grid container spacing={3}>
                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                                md: 6,
                                                            }}
                                                        >
                                                            <StyledTextField
                                                                label={t(
                                                                    'register.phone1',
                                                                )}
                                                                name='phone.phone_1'
                                                                type='tel'
                                                                placeholder='05x-xxxxxxx'
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .phone
                                                                        .phone_1
                                                                }
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                error={
                                                                    formik
                                                                        .touched
                                                                        .phone
                                                                        ?.phone_1 &&
                                                                    Boolean(
                                                                        formik
                                                                            .errors
                                                                            .phone
                                                                            ?.phone_1,
                                                                    )
                                                                }
                                                                helperText={
                                                                    formik
                                                                        .touched
                                                                        .phone
                                                                        ?.phone_1 &&
                                                                    formik
                                                                        .errors
                                                                        .phone
                                                                        ?.phone_1
                                                                }
                                                                fullWidth
                                                            />
                                                        </Grid>

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                                md: 6,
                                                            }}
                                                        >
                                                            <StyledTextField
                                                                label={t(
                                                                    'register.phone2',
                                                                )}
                                                                name='phone.phone_2'
                                                                type='tel'
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .phone
                                                                        .phone_2
                                                                }
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                error={
                                                                    formik
                                                                        .touched
                                                                        .phone
                                                                        ?.phone_2 &&
                                                                    Boolean(
                                                                        formik
                                                                            .errors
                                                                            .phone
                                                                            ?.phone_2,
                                                                    )
                                                                }
                                                                helperText={
                                                                    formik
                                                                        .touched
                                                                        .phone
                                                                        ?.phone_2 &&
                                                                    formik
                                                                        .errors
                                                                        .phone
                                                                        ?.phone_2
                                                                }
                                                                fullWidth
                                                            />
                                                        </Grid>

                                                        {/* CITY */}

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                                md: 4,
                                                            }}
                                                        >
                                                            <Autocomplete
                                                                options={cities}
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .address
                                                                        .city ||
                                                                    null
                                                                }
                                                                onChange={(
                                                                    _event,
                                                                    value,
                                                                ) => {
                                                                    formik.setFieldValue(
                                                                        'address.city',
                                                                        value ||
                                                                            '',
                                                                    );

                                                                    formik.setFieldValue(
                                                                        'address.street',
                                                                        '',
                                                                    );
                                                                }}
                                                                onBlur={() =>
                                                                    formik.setFieldTouched(
                                                                        'address.city',
                                                                        true,
                                                                    )
                                                                }
                                                                renderInput={(
                                                                    params,
                                                                ) => (
                                                                    <StyledTextField
                                                                        {...params}
                                                                        label={t(
                                                                            'register.city',
                                                                        )}
                                                                        error={
                                                                            formik
                                                                                .touched
                                                                                .address
                                                                                ?.city &&
                                                                            Boolean(
                                                                                formik
                                                                                    .errors
                                                                                    .address
                                                                                    ?.city,
                                                                            )
                                                                        }
                                                                        helperText={
                                                                            formik
                                                                                .touched
                                                                                .address
                                                                                ?.city &&
                                                                            formik
                                                                                .errors
                                                                                .address
                                                                                ?.city
                                                                        }
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>

                                                        {/* STREET */}

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                                md: 6,
                                                            }}
                                                        >
                                                            <Autocomplete
                                                                options={
                                                                    streets
                                                                }
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .address
                                                                        .street ||
                                                                    null
                                                                }
                                                                onChange={(
                                                                    _event,
                                                                    value,
                                                                ) =>
                                                                    formik.setFieldValue(
                                                                        'address.street',
                                                                        value ||
                                                                            '',
                                                                    )
                                                                }
                                                                onBlur={() =>
                                                                    formik.setFieldTouched(
                                                                        'address.street',
                                                                        true,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !formik
                                                                        .values
                                                                        .address
                                                                        .city ||
                                                                    loadingStreets
                                                                }
                                                                loading={
                                                                    loadingStreets
                                                                }
                                                                renderInput={(
                                                                    params,
                                                                ) => (
                                                                    <StyledTextField
                                                                        {...params}
                                                                        label={t(
                                                                            'register.street',
                                                                        )}
                                                                        error={
                                                                            formik
                                                                                .touched
                                                                                .address
                                                                                ?.street &&
                                                                            Boolean(
                                                                                formik
                                                                                    .errors
                                                                                    .address
                                                                                    ?.street,
                                                                            )
                                                                        }
                                                                        helperText={
                                                                            formik
                                                                                .touched
                                                                                .address
                                                                                ?.street &&
                                                                            formik
                                                                                .errors
                                                                                .address
                                                                                ?.street
                                                                        }
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>

                                                        {/* HOUSE NUMBER */}

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                                md: 6,
                                                            }}
                                                        >
                                                            <StyledTextField
                                                                label={t(
                                                                    'register.houseNumber',
                                                                )}
                                                                name='address.houseNumber'
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .address
                                                                        .houseNumber
                                                                }
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                fullWidth
                                                            />
                                                        </Grid>

                                                        {/* IMAGE */}

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                            }}
                                                        >
                                                            <StyledTextField
                                                                label={t(
                                                                    'register.imageUrl',
                                                                )}
                                                                name='image.url'
                                                                type='url'
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .image
                                                                        ?.url ||
                                                                    ''
                                                                }
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                onBlur={
                                                                    formik.handleBlur
                                                                }
                                                                error={
                                                                    formik
                                                                        .touched
                                                                        .image
                                                                        ?.url &&
                                                                    Boolean(
                                                                        formik
                                                                            .errors
                                                                            .image
                                                                            ?.url,
                                                                    )
                                                                }
                                                                helperText={
                                                                    formik
                                                                        .touched
                                                                        .image
                                                                        ?.url &&
                                                                    formik
                                                                        .errors
                                                                        .image
                                                                        ?.url
                                                                }
                                                                fullWidth
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {/* =================================================
                                                    STEP 3
                                                ================================================= */}

                                                {currentStep === 2 && (
                                                    <Grid container spacing={3}>
                                                        {/* PASSWORD */}

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                            }}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                                variant='outlined'
                                                                error={
                                                                    formik
                                                                        .touched
                                                                        .password &&
                                                                    Boolean(
                                                                        formik
                                                                            .errors
                                                                            .password,
                                                                    )
                                                                }
                                                            >
                                                                <InputLabel htmlFor='password'>
                                                                    {t(
                                                                        'register.password',
                                                                    )}
                                                                </InputLabel>

                                                                <OutlinedInput
                                                                    id='password'
                                                                    name='password'
                                                                    type={
                                                                        showPassword
                                                                            ? 'text'
                                                                            : 'password'
                                                                    }
                                                                    value={
                                                                        formik
                                                                            .values
                                                                            .password
                                                                    }
                                                                    onChange={
                                                                        formik.handleChange
                                                                    }
                                                                    onBlur={
                                                                        formik.handleBlur
                                                                    }
                                                                    autoComplete='new-password'
                                                                    label={t(
                                                                        'register.password',
                                                                    )}
                                                                    endAdornment={
                                                                        <InputAdornment position='end'>
                                                                            <IconButton
                                                                                onClick={
                                                                                    handleClickShowPassword
                                                                                }
                                                                                onMouseDown={
                                                                                    handleMouseDownPassword
                                                                                }
                                                                                edge='end'
                                                                                aria-label={
                                                                                    showPassword
                                                                                        ? t(
                                                                                              'register.hidePassword',
                                                                                          )
                                                                                        : t(
                                                                                              'register.showPassword',
                                                                                          )
                                                                                }
                                                                            >
                                                                                {showPassword ? (
                                                                                    <VisibilityOff />
                                                                                ) : (
                                                                                    <Visibility />
                                                                                )}
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    }
                                                                    sx={{
                                                                        borderRadius: 2,
                                                                    }}
                                                                />

                                                                {formik.touched
                                                                    .password &&
                                                                    formik
                                                                        .errors
                                                                        .password && (
                                                                        <FormHelperText>
                                                                            {
                                                                                formik
                                                                                    .errors
                                                                                    .password
                                                                            }
                                                                        </FormHelperText>
                                                                    )}

                                                                {formik.values
                                                                    .password && (
                                                                    <PasswordStrengthIndicator
                                                                        password={
                                                                            formik
                                                                                .values
                                                                                .password
                                                                        }
                                                                    />
                                                                )}
                                                            </FormControl>
                                                        </Grid>

                                                        {/* CONFIRM PASSWORD */}

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                            }}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                                variant='outlined'
                                                                error={
                                                                    formik
                                                                        .touched
                                                                        .confirmPassword &&
                                                                    Boolean(
                                                                        formik
                                                                            .errors
                                                                            .confirmPassword,
                                                                    )
                                                                }
                                                            >
                                                                <InputLabel htmlFor='confirmPassword'>
                                                                    {t(
                                                                        'register.confirmPassword',
                                                                    )}
                                                                </InputLabel>

                                                                <OutlinedInput
                                                                    id='confirmPassword'
                                                                    name='confirmPassword'
                                                                    type={
                                                                        showConfirmPassword
                                                                            ? 'text'
                                                                            : 'password'
                                                                    }
                                                                    value={
                                                                        formik
                                                                            .values
                                                                            .confirmPassword
                                                                    }
                                                                    onChange={
                                                                        formik.handleChange
                                                                    }
                                                                    onBlur={
                                                                        formik.handleBlur
                                                                    }
                                                                    autoComplete='new-password'
                                                                    label={t(
                                                                        'register.confirmPassword',
                                                                    )}
                                                                    endAdornment={
                                                                        <InputAdornment position='end'>
                                                                            <IconButton
                                                                                onClick={
                                                                                    handleClickShowConfirmPassword
                                                                                }
                                                                                onMouseDown={
                                                                                    handleMouseDownPassword
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
                                                                    }
                                                                    sx={{
                                                                        borderRadius: 2,
                                                                    }}
                                                                />

                                                                {formik.touched
                                                                    .confirmPassword &&
                                                                    formik
                                                                        .errors
                                                                        .confirmPassword && (
                                                                        <FormHelperText>
                                                                            {
                                                                                formik
                                                                                    .errors
                                                                                    .confirmPassword
                                                                            }
                                                                        </FormHelperText>
                                                                    )}
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {/* =================================================
                                                    STEP 4
                                                ================================================= */}

                                                {currentStep === 3 && (
                                                    <Grid container spacing={3}>
                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                            }}
                                                        >
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        id='terms'
                                                                        name='terms'
                                                                        checked={
                                                                            formik
                                                                                .values
                                                                                .terms
                                                                        }
                                                                        onChange={
                                                                            formik.handleChange
                                                                        }
                                                                        onBlur={
                                                                            formik.handleBlur
                                                                        }
                                                                    />
                                                                }
                                                                label={
                                                                    <>
                                                                        {t(
                                                                            'register.agreeTo',
                                                                        )}{' '}
                                                                        <Link
                                                                            to={
                                                                                path.TermOfUse
                                                                            }
                                                                            target='_blank'
                                                                            rel='noopener noreferrer'
                                                                        >
                                                                            {t(
                                                                                'register.termsOfService',
                                                                            )}
                                                                        </Link>{' '}
                                                                        {t(
                                                                            'register.and',
                                                                        )}{' '}
                                                                        <Link
                                                                            to={
                                                                                path.PrivacyAndPolicy
                                                                            }
                                                                            target='_blank'
                                                                            rel='noopener noreferrer'
                                                                        >
                                                                            {t(
                                                                                'register.privacyPolicy',
                                                                            )}
                                                                        </Link>
                                                                    </>
                                                                }
                                                            />

                                                            {formik.touched
                                                                .terms &&
                                                                formik.errors
                                                                    .terms && (
                                                                    <Typography
                                                                        color='error'
                                                                        variant='caption'
                                                                        sx={{
                                                                            display:
                                                                                'block',
                                                                            mt: 1,
                                                                        }}
                                                                    >
                                                                        {
                                                                            formik
                                                                                .errors
                                                                                .terms
                                                                        }
                                                                    </Typography>
                                                                )}
                                                        </Grid>

                                                        {/* PRIVACY NOTE */}

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant='body2'
                                                                color='text.secondary'
                                                                sx={{
                                                                    mt: 2,
                                                                    lineHeight: 1.6,
                                                                    p: 2,
                                                                    borderRadius: 2,
                                                                    bgcolor:
                                                                        alpha(
                                                                            theme
                                                                                .palette
                                                                                .primary
                                                                                .main,
                                                                            0.03,
                                                                        ),
                                                                }}
                                                            >
                                                                {t(
                                                                    'register.privacyNote',
                                                                )}
                                                            </Typography>
                                                        </Grid>

                                                        {/* PROFILE PREVIEW */}

                                                        <Grid
                                                            size={{
                                                                xs: 12,
                                                            }}
                                                        >
                                                            <Paper
                                                                variant='outlined'
                                                                sx={{
                                                                    p: 3,
                                                                    mt: 2,
                                                                    borderRadius: 3,
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant='subtitle2'
                                                                    sx={{
                                                                        color: theme
                                                                            .palette
                                                                            .primary
                                                                            .main,
                                                                        fontWeight: 600,
                                                                        mb: 2,
                                                                    }}
                                                                >
                                                                    {t(
                                                                        'register.profilePreview',
                                                                    )}
                                                                </Typography>

                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            'flex',
                                                                        alignItems:
                                                                            'center',
                                                                        gap: 2,
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            width: 56,
                                                                            height: 56,
                                                                            borderRadius:
                                                                                '50%',
                                                                            bgcolor:
                                                                                alpha(
                                                                                    theme
                                                                                        .palette
                                                                                        .primary
                                                                                        .main,
                                                                                    0.12,
                                                                                ),
                                                                            display:
                                                                                'flex',
                                                                            alignItems:
                                                                                'center',
                                                                            justifyContent:
                                                                                'center',
                                                                            color: theme
                                                                                .palette
                                                                                .primary
                                                                                .main,
                                                                            fontWeight: 600,
                                                                            fontSize: 24,
                                                                        }}
                                                                    >
                                                                        {formik
                                                                            .values
                                                                            .name
                                                                            .first
                                                                            ? formik.values.name.first
                                                                                  .charAt(
                                                                                      0,
                                                                                  )
                                                                                  .toUpperCase()
                                                                            : 'U'}
                                                                    </Box>

                                                                    <Box>
                                                                        <Typography fontWeight='medium'>
                                                                            {
                                                                                formik
                                                                                    .values
                                                                                    .name
                                                                                    .first
                                                                            }{' '}
                                                                            {
                                                                                formik
                                                                                    .values
                                                                                    .name
                                                                                    .last
                                                                            }
                                                                        </Typography>

                                                                        <Typography
                                                                            variant='caption'
                                                                            color='text.secondary'
                                                                        >
                                                                            @
                                                                            {formik
                                                                                .values
                                                                                .slug ||
                                                                                'username'}
                                                                        </Typography>

                                                                        <Typography
                                                                            variant='caption'
                                                                            display='block'
                                                                            color='text.secondary'
                                                                        >
                                                                            {
                                                                                window
                                                                                    .location
                                                                                    .origin
                                                                            }
                                                                            /customer/
                                                                            {formik
                                                                                .values
                                                                                .slug ||
                                                                                'username'}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Paper>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* =================================================
                                            NAVIGATION
                                        ================================================= */}

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
                                                variant='outlined'
                                                onClick={handleBack}
                                                disabled={
                                                    currentStep === 0 ||
                                                    isLoading
                                                }
                                                startIcon={
                                                    dir === 'rtl' ? (
                                                        <ArrowForward />
                                                    ) : (
                                                        <ArrowBack />
                                                    )
                                                }
                                            >
                                                {t('common.back')}
                                            </Button>

                                            {currentStep < steps.length - 1 ? (
                                                <Button
                                                    variant='contained'
                                                    onClick={handleNext}
                                                    disabled={
                                                        checkingSlug &&
                                                        currentStep === 0
                                                    }
                                                >
                                                    {t('common.next')}
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant='contained'
                                                    type='submit'
                                                    disabled={
                                                        isLoading ||
                                                        !formik.isValid ||
                                                        checkingSlug ||
                                                        slugAvailable !== true
                                                    }
                                                    startIcon={
                                                        isLoading ? (
                                                            <CircularProgress
                                                                size={20}
                                                                color='inherit'
                                                            />
                                                        ) : undefined
                                                    }
                                                >
                                                    {isLoading
                                                        ? t(
                                                              'register.creatingAccount',
                                                          )
                                                        : t(
                                                              'register.completeRegistration',
                                                          )}
                                                </Button>
                                            )}
                                        </Box>
                                    </form>

                                    {/* =================================================
                                        LOGIN
                                    ================================================= */}

                                    <Box
                                        sx={{
                                            textAlign: 'center',

                                            mt: 4,

                                            pt: 3,

                                            borderTop: `1px solid ${theme.palette.divider}`,
                                        }}
                                    >
                                        <Typography
                                            color='text.secondary'
                                            sx={{
                                                mb: 1,
                                            }}
                                        >
                                            {t('register.haveAccount')}
                                        </Typography>

                                        <Button
                                            variant='text'
                                            onClick={() => navigate(path.Login)}
                                        >
                                            {t('register.loginHere')}
                                        </Button>
                                    </Box>

                                    {/* =================================================
                                        QUICK LINKS
                                    ================================================= */}

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

                                                color: theme.palette.text
                                                    .secondary,
                                            }}
                                        >
                                            {t('common.contact')}
                                        </Link>

                                        <Link
                                            to={path.About}
                                            style={{
                                                textDecoration: 'none',

                                                color: theme.palette.text
                                                    .secondary,
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
