import {
    FunctionComponent,
    ReactNode,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { getIn, useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    alpha,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LinkIcon from '@mui/icons-material/Link';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { showSuccess, showError } from '../../../atoms/toasts/ReactToast';
import { editUserProfile, getUserById } from '../../../services/usersServices';
import Loader from '../../../atoms/loader/Loader';
import useAddressData from '../../../hooks/useAddressData';
import { EditUserProfile } from '../../../interfaces/User';

const BRAND_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';
const ACCENT = '#f59e0b';

interface EditUserDataProps {
    userId: string;
    mode?: 'profile' | 'edit';
}

interface FormValues {
    name: { first: string; last: string };
    personalEmail: string;
    phone: { phone_1: string; phone_2: string };
    image: { url: string; alt: string };
    address: { city: string; street: string; houseNumber: string };
    gender: string;
}

const emptyValues: FormValues = {
    name: { first: '', last: '' },
    personalEmail: '',
    phone: { phone_1: '', phone_2: '' },
    image: { url: '', alt: '' },
    address: { city: '', street: '', houseNumber: '' },
    gender: '',
};

const toFormValues = (u: EditUserProfile): FormValues => ({
    name: { first: u.name?.first || '', last: u.name?.last || '' },
    personalEmail: u.personalEmail || '',
    phone: {
        phone_1: u.phone?.phone_1 || '',
        phone_2: u.phone?.phone_2 || '',
    },
    image: {
        url: u.image?.url || '',
        alt: u.image?.alt || u.name?.first || '',
    },
    address: {
        city: u.address?.city || '',
        street: u.address?.street || '',
        houseNumber: String(u.address?.houseNumber ?? ''),
    },
    gender: u.gender || '',
});

const fieldSx: SxProps<Theme> = (theme) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 2.5,
        transition: 'all .2s ease',
        backgroundColor:
            theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.04)
                : alpha(theme.palette.common.black, 0.02),
        '&:hover fieldset': { borderColor: theme.palette.primary.light },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
        },
    },
});

const startIcon = (icon: ReactNode) => ({
    input: {
        startAdornment: (
            <InputAdornment position='start'>{icon}</InputAdornment>
        ),
    },
});

// معرّف برّا الـ component عشان ما ينعمل له unmount/mount مع كل render
const Section = ({
    icon,
    title,
    children,
}: {
    icon: ReactNode;
    title: string;
    children: ReactNode;
}) => (
    <Box>
        <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 2 }}>
            <Box
                sx={(theme) => ({
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(ACCENT, 0.14),
                    color: theme.palette.primary.main,
                })}
            >
                {icon}
            </Box>
            <Typography variant='subtitle1' fontWeight={800}>
                {title}
            </Typography>
            <Divider sx={{ flex: 1 }} />
        </Stack>
        {children}
    </Box>
);

/**
 * Auth complete profile
 * @returns inputs to complete the fields on database
 */
const EditUserData: FunctionComponent<EditUserDataProps> = ({ userId }) => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<FormValues>(emptyValues);

    const schema = useMemo(
        () =>
            yup.object({
                name: yup.object({
                    first: yup.string().required(
                        t('editProfile.errors.firstName', {
                            defaultValue: 'الاسم الأول مطلوب',
                        }),
                    ),
                    last: yup.string(),
                }),
                phone: yup.object({
                    phone_1: yup
                        .string()
                        .matches(
                            /^0[2-9]\d{7,8}$/,
                            t('editProfile.errors.phone', {
                                defaultValue: 'رقم الهاتف غير صحيح',
                            }),
                        )
                        .required(
                            t('editProfile.errors.phoneRequired', {
                                defaultValue: 'رقم الهاتف مطلوب',
                            }),
                        ),
                    phone_2: yup.string().matches(
                        /^0[2-9]\d{7,8}$/,
                        t('editProfile.errors.phone', {
                            defaultValue: 'رقم الهاتف غير صحيح',
                        }),
                    ),
                }),
                personalEmail: yup.string().email(
                    t('editProfile.errors.email', {
                        defaultValue: 'البريد الإلكتروني غير صحيح',
                    }),
                ),
                image: yup.object({
                    url: yup.string(),
                    alt: yup.string(),
                }),
                address: yup.object({
                    city: yup.string().required(
                        t('editProfile.errors.city', {
                            defaultValue: 'المدينة مطلوبة',
                        }),
                    ),
                    street: yup.string().required(
                        t('editProfile.errors.street', {
                            defaultValue: 'الشارع مطلوب',
                        }),
                    ),
                    houseNumber: yup.string(),
                }),
                gender: yup.string().required(
                    t('editProfile.errors.gender', {
                        defaultValue: 'الجنس مطلوب',
                    }),
                ),
            }),
        [t],
    );

    const formik = useFormik<FormValues>({
        initialValues,
        enableReinitialize: true,
        validationSchema: schema,
        onSubmit: async (values) => {
            if (!userId) return;

            const payload = {
                name: {
                    first: values.name.first,
                    last: values.name.last || '',
                },
                phone: {
                    phone_1: values.phone.phone_1,
                    phone_2: values.phone.phone_2 || '',
                },
                personalEmail: values.personalEmail,
                image: {
                    url: values.image.url || '',
                    alt: values.image.alt || values.name.first || '',
                },
                address: {
                    city: values.address.city,
                    street: values.address.street,
                    houseNumber: values.address.houseNumber || '',
                },
                gender: values.gender as EditUserProfile['gender'],
            };

            try {
                await editUserProfile(userId, payload);
                // القيم المحفوظة صارت هي الأساس، فـ dirty وreset بيشتغلو صح
                setInitialValues(values);
                showSuccess(
                    t('editProfile.saved', {
                        defaultValue: 'تم تحديث الملف الشخصي بنجاح!',
                    }),
                );
            } catch (error) {
                console.error('Update error:', error);
                showError(
                    t('editProfile.saveFailed', {
                        defaultValue: 'حدث خطأ أثناء تحديث الملف الشخصي',
                    }),
                );
            }
        },
    });

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                const userData = await getUserById(userId);
                if (!cancelled) setInitialValues(toFormValues(userData));
            } catch (err) {
                console.error('Error getting user:', err);
                showError(
                    t('editProfile.loadFailed', {
                        defaultValue: 'خطأ في تحميل الملف الشخصي',
                    }),
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const { cities, streets, loadingStreets } = useAddressData(
        formik.values.address.city,
    );

    const errorOf = (name: string): string | undefined =>
        getIn(formik.touched, name)
            ? (getIn(formik.errors, name) as string | undefined)
            : undefined;

    const field = (name: string) => {
        const error = errorOf(name);
        return {
            ...formik.getFieldProps(name),
            error: Boolean(error),
            helperText: error,
            fullWidth: true,
            sx: fieldSx,
        };
    };

    if (loading) return <Loader />;

    return (
        <Card
            variant='outlined'
            aria-label={t('editProfile.title', {
                defaultValue: 'تحديث الملف الشخصي',
            })}
            sx={{
                borderRadius: 3,
                maxWidth: 960,
                mx: 'auto',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    insetInline: 0,
                    height: 4,
                    background: BRAND_GRADIENT,
                },
            }}
        >
            <CardContent sx={{ p: { xs: 3, md: 4 }, pt: { xs: 4, md: 5 } }}>
                {/* Header */}
                <Stack
                    direction='row'
                    alignItems='center'
                    spacing={2}
                    sx={{ mb: 4 }}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            background: BRAND_GRADIENT,
                            boxShadow: `0 8px 20px -8px ${alpha('#8B4513', 0.7)}`,
                        }}
                    >
                        <EditOutlinedIcon />
                    </Box>
                    <Box>
                        <Typography variant='h5' fontWeight={800}>
                            {t('editProfile.title', {
                                defaultValue: 'تحديث الملف الشخصي',
                            })}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {t('editProfileSubtitle', {
                                defaultValue:
                                    'حدّث بياناتك ليسهل على المشترين والبائعين التواصل معك',
                            })}
                        </Typography>
                    </Box>
                </Stack>

                <Box component='form' noValidate onSubmit={formik.handleSubmit}>
                    <Stack spacing={4}>
                        {/* Identity */}
                        <Section
                            icon={<PersonOutlineIcon fontSize='small' />}
                            title={t('identity', {
                                defaultValue: 'identity',
                            })}
                        >
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <TextField
                                        label={t('register.firstName')}
                                        {...field('name.first')}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <TextField
                                        label={t('register.lastName')}
                                        {...field('name.last')}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl
                                        fullWidth
                                        sx={fieldSx}
                                        error={Boolean(errorOf('gender'))}
                                    >
                                        <InputLabel id='gender-label'>
                                            {t('register.gender')}
                                        </InputLabel>
                                        <Select
                                            labelId='gender-label'
                                            id='gender'
                                            label={t('register.gender')}
                                            {...formik.getFieldProps('gender')}
                                        >
                                            <MenuItem value=''>
                                                <em>
                                                    {t('register.selectGender')}
                                                </em>
                                            </MenuItem>
                                            <MenuItem value='male'>
                                                {t('register.male')}
                                            </MenuItem>
                                            <MenuItem value='female'>
                                                {t('register.female')}
                                            </MenuItem>
                                        </Select>
                                        {errorOf('gender') && (
                                            <FormHelperText>
                                                {errorOf('gender')}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Section>

                        {/* Contact */}
                        <Section
                            icon={<PhoneOutlinedIcon fontSize='small' />}
                            title={t('contact', {
                                defaultValue: 'التواصل',
                            })}
                        >
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label={t('register.personalEmail')}
                                        type='email'
                                        slotProps={startIcon(
                                            <EmailOutlinedIcon fontSize='small' />,
                                        )}
                                        {...field('personalEmail')}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <TextField
                                        label={t('register.phone1')}
                                        type='tel'
                                        slotProps={startIcon(
                                            <PhoneOutlinedIcon fontSize='small' />,
                                        )}
                                        {...field('phone.phone_1')}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <TextField
                                        label={t('register.phone2')}
                                        type='tel'
                                        slotProps={startIcon(
                                            <PhoneOutlinedIcon fontSize='small' />,
                                        )}
                                        {...field('phone.phone_2')}
                                    />
                                </Grid>
                            </Grid>
                        </Section>

                        {/* Address */}
                        <Section
                            icon={<LocationOnOutlinedIcon fontSize='small' />}
                            title={t('address', {
                                defaultValue: 'العنوان',
                            })}
                        >
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Autocomplete
                                        options={cities}
                                        value={
                                            formik.values.address.city || null
                                        }
                                        onChange={(_event, value) => {
                                            formik.setFieldValue(
                                                'address.city',
                                                value ?? '',
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
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t('register.city')}
                                                error={Boolean(
                                                    errorOf('address.city'),
                                                )}
                                                helperText={errorOf(
                                                    'address.city',
                                                )}
                                                sx={fieldSx}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Autocomplete
                                        options={streets}
                                        value={
                                            formik.values.address.street || null
                                        }
                                        onChange={(_event, value) =>
                                            formik.setFieldValue(
                                                'address.street',
                                                value ?? '',
                                            )
                                        }
                                        onBlur={() =>
                                            formik.setFieldTouched(
                                                'address.street',
                                                true,
                                            )
                                        }
                                        disabled={
                                            !formik.values.address.city ||
                                            loadingStreets
                                        }
                                        loading={loadingStreets}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t('register.street')}
                                                error={Boolean(
                                                    errorOf('address.street'),
                                                )}
                                                helperText={errorOf(
                                                    'address.street',
                                                )}
                                                sx={fieldSx}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <TextField
                                        label={t('register.houseNumber')}
                                        {...field('address.houseNumber')}
                                    />
                                </Grid>
                            </Grid>
                        </Section>

                        {/* Photo */}
                        <Section
                            icon={<ImageOutlinedIcon fontSize='small' />}
                            title={t('photo', {
                                defaultValue: 'الصورة الشخصية',
                            })}
                        >
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={3}
                                alignItems='center'
                            >
                                <Avatar
                                    src={formik.values.image.url || undefined}
                                    alt={formik.values.name.first}
                                    sx={{
                                        width: 88,
                                        height: 88,
                                        fontSize: 34,
                                        fontWeight: 700,
                                        bgcolor: 'primary.main',
                                        border: `3px solid ${alpha(ACCENT, 0.35)}`,
                                    }}
                                >
                                    {formik.values.name.first
                                        .charAt(0)
                                        .toUpperCase()}
                                </Avatar>

                                <TextField
                                    label={t('register.imageUrl')}
                                    type='url'
                                    slotProps={startIcon(
                                        <LinkIcon fontSize='small' />,
                                    )}
                                    {...field('image.url')}
                                />
                            </Stack>
                        </Section>
                    </Stack>

                    {/* Actions */}
                    <Stack
                        direction={{ xs: 'column-reverse', sm: 'row' }}
                        justifyContent='flex-end'
                        spacing={1.5}
                        sx={{
                            mt: 4,
                            pt: 3,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Button
                            variant='outlined'
                            color='inherit'
                            startIcon={<RestartAltIcon />}
                            onClick={() => formik.resetForm()}
                            disabled={!formik.dirty || formik.isSubmitting}
                            sx={{ borderRadius: 999, px: 3,gap:1 }}
                        >
                            {t('reset', {
                                defaultValue: 'إعادة تعيين',
                            })}
                        </Button>

                        <Button
                            type='submit'
                            variant='contained'
                            disabled={!formik.dirty || formik.isSubmitting}
                            startIcon={
                                formik.isSubmitting ? (
                                    <CircularProgress
                                        size={18}
                                        color='inherit'
                                    />
                                ) : (
                                    <SaveOutlinedIcon />
                                )
                            }
                            sx={(theme) => ({
                                borderRadius: 999,
                                px: 4,
                                py: 1.25,
                                color: '#fff',
                                gap:1,
                                background: BRAND_GRADIENT,
                                '&:hover': {
                                    background: BRAND_GRADIENT,
                                    filter: 'brightness(1.08)',
                                },
                                '&.Mui-disabled': {
                                    color: theme.palette.action.disabled,
                                    background:
                                        theme.palette.action.disabledBackground,
                                },
                            })}
                        >
                            {t('save', {
                                defaultValue: 'حفظ',
                            })}
                        </Button>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default EditUserData;