import { useFormik } from 'formik';
import * as yup from 'yup';
import { showSuccess, showError } from '../../../atoms/toasts/ReactToast';
import { FunctionComponent, useEffect, useState } from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { editUserProfile, getUserById } from '../../../services/usersServices';
import Loader from '../../../atoms/loader/Loader';
import useAddressData from '../../../hooks/useAddressData';
import { EditUserProfile } from '../../../interfaces/User';
import { useTranslation } from 'react-i18next';

interface EditUserDataProps {
    userId: string;
    mode?: 'profile' | 'edit';
}

/**
 * Auth complete profile
 * @returns inputs to complete the fields on database
 */
const EditUserData: FunctionComponent<EditUserDataProps> = ({ userId }) => {
    const [loading, setIsLoading] = useState<boolean>(true);
    const [preview, setPreview] = useState<boolean>(false);
    const [user, setUser] = useState<EditUserProfile | null>(null);

    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            name: { first: '', last: '' },
            phone: { phone_1: '', phone_2: '' },
            image: { url: '', alt: '' },
            address: { city: '', street: '', houseNumber: '' },
            gender: '',
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup.object({
                first: yup.string().required('الاسم الأول مطلوب'),
                last: yup.string(),
            }),
            phone: yup.object({
                phone_1: yup
                    .string()
                    .matches(/^0[2-9]\d{7,8}$/, 'رقم الهاتف غير صحيح')
                    .required('رقم الهاتف مطلوب'),
                phone_2: yup
                    .string()
                    .matches(/^0[2-9]\d{7,8}$/, 'رقم الهاتف غير صحيح'),
            }),
            image: yup.object({
                url: yup.string(),
                alt: yup.string(),
            }),
            address: yup.object({
                city: yup.string().required('المدينة مطلوبة'),
                street: yup.string().required('الشارع مطلوب'),
                houseNumber: yup.string(),
            }),
            gender: yup.string().required('الجنس مطلوب'),
        }),
        onSubmit: (values) => {
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
                image: {
                    url: values.image.url || '',
                    alt: values.image.alt || values.name.first || '',
                },
                address: {
                    city: values.address.city,
                    street: values.address.street,
                    houseNumber: values.address.houseNumber || '',
                },
                gender: values.gender,
            };

            editUserProfile(userId, payload)
                .then(() => {
                    formik.setSubmitting(false);
                    showSuccess('تم تحديث الملف الشخصي بنجاح!');
                })
                .catch((error) => {
                    console.error('Update error:', error);
                    formik.setSubmitting(false);
                    showError('حدث خطأ أثناء تحديث الملف الشخصي');
                });
        },
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);
                const userData = await getUserById(userId);
                setUser(userData);

                formik.setValues({
                    name: {
                        first: userData.name?.first || '',
                        last: userData.name?.last || '',
                    },
                    phone: {
                        phone_1: userData.phone?.phone_1 || '',
                        phone_2: userData.phone?.phone_2 || '',
                    },
                    image: {
                        url: userData.image?.url || '',
                        alt: userData.image?.alt || userData.name?.first || '',
                    },
                    address: {
                        city: userData.address?.city || '',
                        street: userData.address?.street || '',
                        houseNumber: userData.address?.houseNumber || '',
                    },
                    gender: userData.gender || '',
                });
            } catch (err) {
                console.error('Error getting user:', err);
                showError('خطأ في تحميل الملف الشخصي');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const { cities, streets, loadingStreets } = useAddressData(
        formik.values.address.city,
    );

    const handleImageChange = () => setPreview(!preview);

    if (loading) return <Loader />;

    return (
        <Card
            variant='outlined'
            sx={{ borderRadius: 4, maxWidth: 960, mx: 'auto' }}
            aria-label='شاشة تحديث الملف الشخصي'
        >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography
                    variant='h5'
                    align='center'
                    fontWeight={800}
                    gutterBottom
                    sx={{ mb: 3 }}
                >
                    تحديث الملف الشخصي
                </Typography>

                <Box component='form' onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label='الاسم الأول'
                                name='name.first'
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
                                variant='outlined'
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label='اسم العائلة'
                                name='name.last'
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
                                variant='outlined'
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <FormControl fullWidth error={formik.touched.gender && Boolean(formik.errors.gender)}>
                                <InputLabel id='gender-label'>
                                    {t('register.gender')}
                                </InputLabel>
                                <Select
                                    labelId='gender-label'
                                    id='gender'
                                    name='gender'
                                    label={t('register.gender') as string}
                                    value={formik.values.gender}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <MenuItem value=''>
                                        <em>
                                            {t('register.selectGender') ||
                                                'اختر الجنس'}
                                        </em>
                                    </MenuItem>
                                    <MenuItem value='male'>
                                        {t('register.male')}
                                    </MenuItem>
                                    <MenuItem value='female'>
                                        {t('register.female')}
                                    </MenuItem>
                                </Select>
                                {formik.touched.gender && formik.errors.gender && (
                                    <FormHelperText>
                                        {formik.errors.gender}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label='الهاتف الرئيسي'
                                name='phone.phone_1'
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
                                variant='outlined'
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label='هاتف آخر (اختياري)'
                                name='phone.phone_2'
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
                                variant='outlined'
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label='رقم المنزل'
                                name='address.houseNumber'
                                value={formik.values.address.houseNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                                variant='outlined'
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
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
                                    <TextField
                                        {...params}
                                        label='اختر مدينة'
                                        variant='outlined'
                                        error={
                                            formik.touched.address?.city &&
                                            Boolean(formik.errors.address?.city)
                                        }
                                        helperText={
                                            formik.touched.address?.city &&
                                            formik.errors.address?.city
                                        }
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Autocomplete
                                options={streets}
                                value={formik.values.address.street || null}
                                onChange={(_event, value) =>
                                    formik.setFieldValue('address.street', value)
                                }
                                onBlur={() =>
                                    formik.setFieldTouched('address.street', true)
                                }
                                disabled={!formik.values.address.city || loadingStreets}
                                loading={loadingStreets}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='اختر شارعًا'
                                        variant='outlined'
                                        error={
                                            formik.touched.address?.street &&
                                            Boolean(formik.errors.address?.street)
                                        }
                                        helperText={
                                            formik.touched.address?.street &&
                                            formik.errors.address?.street
                                        }
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label='رابط الصورة'
                                name='image.url'
                                value={formik.values.image.url}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                                variant='outlined'
                            />
                            <Box sx={{ mt: 1.5 }}>
                                <Button
                                    variant='outlined'
                                    onClick={handleImageChange}
                                    sx={{ borderRadius: 999 }}
                                >
                                    {preview
                                        ? t('hideImage') || 'إخفاء الصورة'
                                        : t('showImage') || 'إظهار صورة الملف الشخصي'}
                                </Button>
                                {preview && (
                                    <Box sx={{ mt: 2 }}>
                                        <Box
                                            component='img'
                                            src={formik.values.image.url || user?.image?.url}
                                            alt={`${user?.name.first} avatar`}
                                            sx={{
                                                height: 220,
                                                maxWidth: 280,
                                                borderRadius: 3,
                                                objectFit: 'cover',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                            disabled={formik.isSubmitting}
                            sx={{ borderRadius: 999, px: 5, py: 1.25 }}
                        >
                            {formik.isSubmitting ? (
                                <CircularProgress size={22} color='inherit' />
                            ) : (
                                t('saveChanges') || 'حفظ التغييرات'
                            )}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default EditUserData;