import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    alpha,
    useTheme,
} from '@mui/material';
import { useFormik } from 'formik';
import { FunctionComponent } from 'react';
import * as yup from 'yup';
import useAddressData from '../../../hooks/useAddressData';
import { useTranslation } from 'react-i18next';

interface UserInfoModalProps {
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: {
        phone_1: string;
        phone_2: string;
        city: string;
        street: string;
        houseNumber: string;
        gender: string;
    }) => Promise<void>;
}
/**
 * Determines whether open is
 * @param {
 * 	isOpen,
 * 	onClose,
 * 	onSubmit,
 * }
 * @returns
 */
const UserInfoModal: FunctionComponent<UserInfoModalProps> = ({
    isOpen,
    isSubmitting: isSubmittingExternal = false,
    onClose,
    onSubmit,
}) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const formik = useFormik({
        initialValues: {
            phone_1: '',
            phone_2: '',
            city: '',
            street: '',
            houseNumber: '',
            gender: '',
        },
        validationSchema: yup.object({
            phone_1: yup
                .string()
                .required('رقم الهاتف الرئيسي مطلوب')
                .matches(/^0\d{1,2}-?\d{7}$/, 'رقم هاتف غير صالح'),
            phone_2: yup
                .string()
                .matches(/^$|^0\d{1,2}-?\d{7}$/, 'رقم الهاتف الثانوي غير صالح'),
            city: yup.string().required('المدينة مطلوبة'),
            street: yup.string().required('الشارع مطلوب'),
            houseNumber: yup.string(),
            gender: yup.string().required(),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await onSubmit(values);
            } finally {
                setSubmitting(false);
            }
        },
    });
    const { cities, streets, loadingStreets } = useAddressData(
        formik.values.city,
    );

    const isBusy = formik.isSubmitting || isSubmittingExternal;

    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            transition: 'all 0.2s ease',
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: theme.palette.primary.main,
        },
    };

    return (
        <Dialog
            open={isOpen}
            onClose={isBusy ? undefined : onClose}
            maxWidth='xs'
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    bgcolor: theme.palette.background.paper,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.main} 100%)`,
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    textAlign: 'center',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    pt: 3,
                }}
            >
                {t(
                    'register.completeDetailsTitle',
                    'يجب عليك إكمال التفاصيل لمواصلة التسجيل.',
                )}
            </DialogTitle>
            <DialogContent>
                <Box component='form' onSubmit={formik.handleSubmit} noValidate>
                    <TextField
                        margin='dense'
                        label={t('register.phone1', 'الهاتف الرئيسي')}
                        fullWidth
                        name='phone_1'
                        value={formik.values.phone_1}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isBusy}
                        error={
                            formik.touched.phone_1 &&
                            Boolean(formik.errors.phone_1)
                        }
                        helperText={
                            formik.touched.phone_1 && formik.errors.phone_1
                        }
                        sx={textFieldSx}
                    />
                    <TextField
                        margin='dense'
                        label={t('register.phone2', 'هاتف آخر اختياري')}
                        fullWidth
                        name='phone_2'
                        value={formik.values.phone_2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isBusy}
                        error={
                            formik.touched.phone_2 &&
                            Boolean(formik.errors.phone_2)
                        }
                        helperText={
                            formik.touched.phone_2 && formik.errors.phone_2
                        }
                        sx={textFieldSx}
                    />
                    <Autocomplete
                        options={cities}
                        value={formik.values.city || null}
                        onChange={(_event, value) =>
                            formik.setFieldValue('city', value)
                        }
                        onBlur={() => formik.setFieldTouched('city', true)}
                        disabled={isBusy}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('register.selectCity', 'اختر المدينة')}
                                variant='outlined'
                                error={
                                    formik.touched.city &&
                                    Boolean(formik.errors.city)
                                }
                                helperText={
                                    formik.touched.city && formik.errors.city
                                }
                                fullWidth
                                margin='dense'
                                sx={textFieldSx}
                            />
                        )}
                    />
                    <Autocomplete
                        options={streets}
                        value={formik.values.street || null}
                        onChange={(_event, value) =>
                            formik.setFieldValue('street', value)
                        }
                        onBlur={() => formik.setFieldTouched('street', true)}
                        disabled={isBusy || !formik.values.city || loadingStreets}
                        loading={loadingStreets}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('register.selectStreet', 'اختر الشارع')}
                                variant='outlined'
                                error={
                                    formik.touched.street &&
                                    Boolean(formik.errors.street)
                                }
                                helperText={
                                    formik.touched.street &&
                                    formik.errors.street
                                }
                                fullWidth
                                margin='dense'
                                sx={textFieldSx}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingStreets ? (
                                                <CircularProgress size={16} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                    <TextField
                        margin='dense'
                        label={t('register.houseNumber', 'رقم البيت')}
                        fullWidth
                        name='houseNumber'
                        value={formik.values.houseNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isBusy}
                        error={
                            formik.touched.houseNumber &&
                            Boolean(formik.errors.houseNumber)
                        }
                        helperText={
                            formik.touched.houseNumber &&
                            formik.errors.houseNumber
                        }
                        sx={textFieldSx}
                    />

                    <FormControl
                        fullWidth
                        margin='dense'
                        disabled={isBusy}
                        error={
                            formik.touched.gender &&
                            Boolean(formik.errors.gender)
                        }
                        sx={textFieldSx}
                    >
                        <InputLabel id='gender-label'>
                            {t('register.gender')}
                        </InputLabel>
                        <Select
                            labelId='gender-label'
                            id='gender'
                            name='gender'
                            label={t('register.gender')}
                            value={formik.values.gender}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <MenuItem value=''>
                                <em>{t('register.selectGender')}</em>
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
                                {t('register.validation.genderRequired')}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <DialogActions
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: 3,
                            px: 0,
                        }}
                    >
                        <Button
                            variant='outlined'
                            onClick={onClose}
                            color='error'
                            disabled={isBusy}
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            {t('register.cancelRegistration', 'إلغاء التسجيل')}
                        </Button>

                        <Button
                            type='submit'
                            variant='contained'
                            disabled={isBusy}
                            startIcon={
                                isBusy ? (
                                    <CircularProgress
                                        size={18}
                                        color='inherit'
                                    />
                                ) : undefined
                            }
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                },
                                '&:disabled': {
                                    opacity: 0.7,
                                    background:
                                        theme.palette.action.disabledBackground,
                                },
                            }}
                        >
                            {isBusy
                                ? t('register.submitting', 'جاري الإرسال...')
                                : t('register.continueRegistration', 'استمرار التسجيل')}
                        </Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default UserInfoModal;