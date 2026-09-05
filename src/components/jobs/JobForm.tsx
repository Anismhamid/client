import { FunctionComponent, useMemo } from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import { Add, DeleteOutline, Save } from '@mui/icons-material';

import { FieldArray, Form, Formik, FormikHelpers, useField } from 'formik';

import * as Yup from 'yup';

import { useTranslation } from 'react-i18next';

import { CreateJobPayload, Job, JobType } from '../../interfaces/jobs.types';
import handleRTL from '../../locales/handleRTL';

const BRAND_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';
const INK = '#12161C';
const GOLD = '#B8860B';
const BROWN = '#8B4513';

// =====================================================
// Props
// =====================================================

interface JobFormProps {
    initialValues?: Partial<Job>;

    onSubmit: (
        values: CreateJobPayload,
        helpers: FormikHelpers<CreateJobPayload>,
    ) => Promise<void> | void;

    loading?: boolean;

    submitLabel?: string;

    mode?: 'create' | 'edit';
}

// =====================================================
// Default values
// =====================================================

const DEFAULT_VALUES: CreateJobPayload = {
    type: 'full_time',
    jobTitle: '',
    companyName: '',
    industry: '',
    experienceLevel: undefined,
    salaryMin: undefined,
    salaryMax: undefined,
    salaryPeriod: undefined,
    location: '',
    remote: false,
    requirements: [],
    benefits: [],
};

// =====================================================
// Reusable Formik TextField
// =====================================================

interface FormikTextFieldProps {
    name: string;
    label: string;
    type?: string;
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
    required?: boolean;
}

const FormikTextField: FunctionComponent<FormikTextFieldProps> = ({
    name,
    label,
    type = 'text',
    multiline = false,
    rows,
    placeholder,
    required = false,
}) => {
    const [field, meta] = useField(name);

    const hasError = Boolean(meta.touched && meta.error);
    const textFieldSx = hasError
        ? undefined
        : {
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                  {
                      borderColor: GOLD,
                      borderWidth: 2,
                  },
              '& .MuiInputLabel-root.Mui-focused': {
                  color: GOLD,
              },
          };

    return (
        <TextField
            {...field}
            fullWidth
            size='small'
            type={type}
            label={label}
            placeholder={placeholder}
            multiline={multiline}
            rows={rows}
            required={required}
            error={hasError}
            helperText={hasError ? meta.error : undefined}
            InputLabelProps={
                type === 'number'
                    ? {
                          shrink: true,
                      }
                    : undefined
            }
            sx={textFieldSx}
        />
    );
};

// =====================================================
// Salary validation helper
// =====================================================

const normalizeNumber = (value: unknown): number | undefined => {
    if (value === '' || value === null || value === undefined) {
        return undefined;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : undefined;
};

// =====================================================
// Component
// =====================================================

const JobForm: FunctionComponent<JobFormProps> = ({
    initialValues,
    onSubmit,
    loading = false,
    submitLabel,
    mode = 'create',
}) => {
    const { t } = useTranslation();

    // =================================================
    // RTL
    // =================================================

    const isRTL = handleRTL();

    // =================================================
    // Initial values
    // =================================================

    const values = useMemo<CreateJobPayload>(() => {
        return {
            ...DEFAULT_VALUES,

            ...(initialValues
                ? {
                      type: initialValues.type ?? DEFAULT_VALUES.type,

                      jobTitle: initialValues.jobTitle ?? '',

                      companyName: initialValues.companyName ?? '',

                      industry: initialValues.industry ?? '',

                      experienceLevel: initialValues.experienceLevel,

                      salaryMin: initialValues.salaryMin,

                      salaryMax: initialValues.salaryMax,

                      salaryPeriod: initialValues.salaryPeriod,

                      location: initialValues.location ?? '',

                      remote: initialValues.remote ?? false,

                      requirements: initialValues.requirements ?? [],

                      benefits: initialValues.benefits ?? [],
                  }
                : {}),
        };
    }, [initialValues]);

    // =================================================
    // Validation
    // =================================================

    const validationSchema = useMemo(
        () =>
            Yup.object({
                type: Yup.string()
                    .oneOf<JobType>([
                        'full_time',
                        'part_time',
                        'temporary',
                        'remote',
                        'daily',
                        'internship',
                    ])
                    .required(t('pages.jobs.validation.typeRequired')),

                jobTitle: Yup.string()
                    .trim()
                    .min(2, t('pages.jobs.validation.jobTitleMin'))
                    .max(150, t('pages.jobs.validation.jobTitleMax'))
                    .required(t('pages.jobs.validation.jobTitleRequired')),

                companyName: Yup.string()
                    .trim()
                    .max(150, t('pages.jobs.validation.companyNameMax')),

                industry: Yup.string()
                    .trim()
                    .max(100, t('pages.jobs.validation.industryMax')),

                experienceLevel: Yup.string().oneOf([
                    'no_experience',
                    'entry',
                    'mid',
                    'senior',
                    'manager',
                ]),

                salaryMin: Yup.number()
                    .transform((_, originalValue) =>
                        normalizeNumber(originalValue),
                    )
                    .min(0, t('pages.jobs.validation.salaryMinPositive'))
                    .nullable()
                    .optional(),

                salaryMax: Yup.number()
                    .transform((_, originalValue) =>
                        normalizeNumber(originalValue),
                    )
                    .min(0, t('pages.jobs.validation.salaryMaxPositive'))
                    .test(
                        'salary-range',
                        t('pages.jobs.validation.salaryMaxGreater'),
                        function (value) {
                            const { salaryMin } = this.parent;

                            if (
                                value === undefined ||
                                salaryMin === undefined
                            ) {
                                return true;
                            }

                            return value >= salaryMin;
                        },
                    )
                    .nullable()
                    .optional(),

                salaryPeriod: Yup.string().oneOf([
                    'hourly',
                    'daily',
                    'monthly',
                    'yearly',
                ]),

                location: Yup.string()
                    .trim()
                    .max(150, t('pages.jobs.validation.locationMax')),

                remote: Yup.boolean(),

                requirements: Yup.array().of(
                    Yup.string()
                        .trim()
                        .max(300, t('pages.jobs.validation.requirementMax')),
                ),

                benefits: Yup.array().of(
                    Yup.string()
                        .trim()
                        .max(300, t('pages.jobs.validation.benefitMax')),
                ),
            }),
        [t],
    );

    // =================================================
    // Submit
    // =================================================

    const handleSubmit = async (
        formValues: CreateJobPayload,
        helpers: FormikHelpers<CreateJobPayload>,
    ) => {
        const payload: CreateJobPayload = {
            ...formValues,

            jobTitle: formValues.jobTitle.trim(),

            companyName: formValues.companyName?.trim() || undefined,

            industry: formValues.industry?.trim() || undefined,

            location: formValues.location?.trim() || undefined,

            salaryMin:
                formValues.salaryMin === undefined ||
                formValues.salaryMin === null
                    ? undefined
                    : Number(formValues.salaryMin),

            salaryMax:
                formValues.salaryMax === undefined ||
                formValues.salaryMax === null
                    ? undefined
                    : Number(formValues.salaryMax),

            requirements: formValues.requirements
                ?.map((item) => item.trim())
                .filter(Boolean),

            benefits: formValues.benefits
                ?.map((item) => item.trim())
                .filter(Boolean),
        };

        await onSubmit(payload, helpers);
    };

    return (
        <Formik
            initialValues={values}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}
        >
            {({
                values: formValues,
                errors,
                touched,
                setFieldValue,
                isSubmitting,
            }) => (
                <Form dir={isRTL ? 'rtl' : 'ltr'}>
                    <Stack spacing={3}>
                        {/* ================================= */}
                        {/* Basic Information */}
                        {/* ================================= */}

                        <Card
                            elevation={1}
                            sx={{
                                borderRadius: 3,
                                borderInlineStart: `4px solid ${GOLD}`,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant='h6'
                                    fontWeight={700}
                                    sx={{
                                        mb: 3,
                                        color: INK,
                                    }}
                                >
                                    {t('pages.jobs.form.basicInformation')}
                                </Typography>

                                <Grid container spacing={2}>
                                    {/* Job title */}
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 8,
                                        }}
                                    >
                                        <FormikTextField
                                            name='jobTitle'
                                            label={t(
                                                'pages.jobs.form.jobTitle',
                                            )}
                                            required
                                        />
                                    </Grid>

                                    {/* Type */}
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 4,
                                        }}
                                    >
                                        <FormControl
                                            fullWidth
                                            size='small'
                                            error={Boolean(
                                                touched.type && errors.type,
                                            )}
                                            required
                                        >
                                            <InputLabel>
                                                {t('pages.jobs.form.type')}
                                            </InputLabel>

                                            <Select
                                                name='type'
                                                value={formValues.type}
                                                label={t(
                                                    'pages.jobs.form.type',
                                                )}
                                                onChange={(event) =>
                                                    setFieldValue(
                                                        'type',
                                                        event.target.value,
                                                    )
                                                }
                                            >
                                                <MenuItem value='full_time'>
                                                    {t(
                                                        'pages.jobs.types.full_time',
                                                    )}
                                                </MenuItem>

                                                <MenuItem value='part_time'>
                                                    {t(
                                                        'pages.jobs.types.part_time',
                                                    )}
                                                </MenuItem>

                                                <MenuItem value='temporary'>
                                                    {t(
                                                        'pages.jobs.types.temporary',
                                                    )}
                                                </MenuItem>

                                                <MenuItem value='remote'>
                                                    {t(
                                                        'pages.jobs.types.remote',
                                                    )}
                                                </MenuItem>

                                                <MenuItem value='daily'>
                                                    {t(
                                                        'pages.jobs.types.daily',
                                                    )}
                                                </MenuItem>

                                                <MenuItem value='internship'>
                                                    {t(
                                                        'pages.jobs.types.internship',
                                                    )}
                                                </MenuItem>
                                            </Select>

                                            {touched.type && errors.type && (
                                                <FormHelperText>
                                                    {errors.type}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    {/* Company */}
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <FormikTextField
                                            name='companyName'
                                            label={t(
                                                'pages.jobs.form.companyName',
                                            )}
                                        />
                                    </Grid>

                                    {/* Industry */}
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <FormikTextField
                                            name='industry'
                                            label={t(
                                                'pages.jobs.form.industry',
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* ================================= */}
                        {/* Experience */}
                        {/* ================================= */}

                        <Card
                            elevation={1}
                            sx={{
                                borderRadius: 3,
                                borderInlineStart: `4px solid ${GOLD}`,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant='h6'
                                    fontWeight={700}
                                    sx={{
                                        mb: 3,
                                        color: INK,
                                    }}
                                >
                                    {t('pages.jobs.form.experienceSection')}
                                </Typography>

                                <FormControl fullWidth size='small'>
                                    <InputLabel>
                                        {t('pages.jobs.form.experienceLevel')}
                                    </InputLabel>

                                    <Select
                                        value={formValues.experienceLevel || ''}
                                        label={t(
                                            'pages.jobs.form.experienceLevel',
                                        )}
                                        onChange={(event) =>
                                            setFieldValue(
                                                'experienceLevel',
                                                event.target.value || undefined,
                                            )
                                        }
                                    >
                                        <MenuItem value=''>
                                            {t('pages.jobs.form.notSpecified')}
                                        </MenuItem>

                                        <MenuItem value='no_experience'>
                                            {t(
                                                'pages.jobs.experienceLevels.no_experience',
                                            )}
                                        </MenuItem>

                                        <MenuItem value='entry'>
                                            {t(
                                                'pages.jobs.experienceLevels.entry',
                                            )}
                                        </MenuItem>

                                        <MenuItem value='mid'>
                                            {t(
                                                'pages.jobs.experienceLevels.mid',
                                            )}
                                        </MenuItem>

                                        <MenuItem value='senior'>
                                            {t(
                                                'pages.jobs.experienceLevels.senior',
                                            )}
                                        </MenuItem>

                                        <MenuItem value='manager'>
                                            {t(
                                                'pages.jobs.experienceLevels.manager',
                                            )}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>

                        {/* ================================= */}
                        {/* Salary */}
                        {/* ================================= */}

                        <Card
                            elevation={1}
                            sx={{
                                borderRadius: 3,
                                borderInlineStart: `4px solid ${GOLD}`,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant='h6'
                                    fontWeight={700}
                                    sx={{
                                        mb: 3,
                                        color: INK,
                                    }}
                                >
                                    {t('pages.jobs.form.salarySection')}
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 4,
                                        }}
                                    >
                                        <FormikTextField
                                            name='salaryMin'
                                            label={t(
                                                'pages.jobs.form.salaryMin',
                                            )}
                                            type='number'
                                        />
                                    </Grid>

                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 4,
                                        }}
                                    >
                                        <FormikTextField
                                            name='salaryMax'
                                            label={t(
                                                'pages.jobs.form.salaryMax',
                                            )}
                                            type='number'
                                        />
                                    </Grid>

                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 4,
                                        }}
                                    >
                                        <FormControl fullWidth size='small'>
                                            <InputLabel>
                                                {t(
                                                    'pages.jobs.form.salaryPeriod',
                                                )}
                                            </InputLabel>

                                            <Select
                                                value={
                                                    formValues.salaryPeriod ||
                                                    ''
                                                }
                                                label={t(
                                                    'pages.jobs.form.salaryPeriod',
                                                )}
                                                onChange={(event) =>
                                                    setFieldValue(
                                                        'salaryPeriod',
                                                        event.target.value ||
                                                            undefined,
                                                    )
                                                }
                                            >
                                                <MenuItem value=''>
                                                    {t(
                                                        'pages.jobs.form.notSpecified',
                                                    )}
                                                </MenuItem>

                                                <MenuItem value='hourly'>
                                                    {t(
                                                        'pages.jobs.salaryPeriods.hourly',
                                                    )}
                                                </MenuItem>

                                                <MenuItem value='daily'>
                                                    {t(
                                                        'pages.jobs.salaryPeriods.daily',
                                                    )}
                                                </MenuItem>

                                                <MenuItem value='monthly'>
                                                    {t(
                                                        'pages.jobs.salaryPeriods.monthly',
                                                    )}
                                                </MenuItem>

                                                <MenuItem value='yearly'>
                                                    {t(
                                                        'pages.jobs.salaryPeriods.yearly',
                                                    )}
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* ================================= */}
                        {/* Location */}
                        {/* ================================= */}

                        <Card
                            elevation={1}
                            sx={{
                                borderRadius: 3,
                                borderInlineStart: `4px solid ${GOLD}`,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant='h6'
                                    fontWeight={700}
                                    sx={{
                                        mb: 3,
                                        color: INK,
                                    }}
                                >
                                    {t('pages.jobs.form.locationSection')}
                                </Typography>

                                <Stack spacing={2}>
                                    <FormikTextField
                                        name='location'
                                        label={t('pages.jobs.form.location')}
                                    />

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formValues.remote}
                                                onChange={(event) =>
                                                    setFieldValue(
                                                        'remote',
                                                        event.target.checked,
                                                    )
                                                }
                                                sx={{
                                                    '&.Mui-checked': {
                                                        color: GOLD,
                                                    },
                                                }}
                                            />
                                        }
                                        label={t('pages.jobs.form.remote')}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* ================================= */}
                        {/* Requirements */}
                        {/* ================================= */}

                        <Card
                            elevation={1}
                            sx={{
                                borderRadius: 3,
                                borderInlineStart: `4px solid ${GOLD}`,
                            }}
                        >
                            <CardContent>
                                <FieldArray name='requirements'>
                                    {({ push, remove }) => (
                                        <Stack spacing={2}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography
                                                    variant='h6'
                                                    fontWeight={700}
                                                    sx={{ color: INK }}
                                                >
                                                    {t(
                                                        'pages.jobs.form.requirements',
                                                    )}
                                                </Typography>

                                                <Button
                                                    size='small'
                                                    variant='outlined'
                                                    startIcon={<Add />}
                                                    onClick={() => push('')}
                                                    sx={{
                                                        borderColor: GOLD,
                                                        color: BROWN,
                                                        '&:hover': {
                                                            borderColor: BROWN,
                                                            bgcolor:
                                                                'rgba(184,134,11,0.06)',
                                                        },
                                                    }}
                                                >
                                                    {t(
                                                        'pages.jobs.form.addRequirement',
                                                    )}
                                                </Button>
                                            </Box>

                                            <Divider />

                                            {formValues.requirements?.length ===
                                            0 ? (
                                                <Typography
                                                    color='text.secondary'
                                                    variant='body2'
                                                >
                                                    {t(
                                                        'pages.jobs.form.noRequirements',
                                                    )}
                                                </Typography>
                                            ) : (
                                                formValues.requirements?.map(
                                                    (_, index) => (
                                                        <Stack
                                                            key={index}
                                                            direction='row'
                                                            spacing={1}
                                                            alignItems='flex-start'
                                                        >
                                                            <Box
                                                                sx={{
                                                                    flex: 1,
                                                                }}
                                                            >
                                                                <FormikTextField
                                                                    name={`requirements.${index}`}
                                                                    label={`${t(
                                                                        'pages.jobs.form.requirement',
                                                                    )} ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                />
                                                            </Box>

                                                            <IconButton
                                                                color='error'
                                                                onClick={() =>
                                                                    remove(
                                                                        index,
                                                                    )
                                                                }
                                                                sx={{
                                                                    mt: 0.5,
                                                                }}
                                                            >
                                                                <DeleteOutline />
                                                            </IconButton>
                                                        </Stack>
                                                    ),
                                                )
                                            )}
                                        </Stack>
                                    )}
                                </FieldArray>
                            </CardContent>
                        </Card>

                        {/* ================================= */}
                        {/* Benefits */}
                        {/* ================================= */}

                        <Card
                            elevation={1}
                            sx={{
                                borderRadius: 3,
                                borderInlineStart: `4px solid ${GOLD}`,
                            }}
                        >
                            <CardContent>
                                <FieldArray name='benefits'>
                                    {({ push, remove }) => (
                                        <Stack spacing={2}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography
                                                    variant='h6'
                                                    fontWeight={700}
                                                    sx={{ color: INK }}
                                                >
                                                    {t(
                                                        'pages.jobs.form.benefits',
                                                    )}
                                                </Typography>

                                                <Button
                                                    size='small'
                                                    variant='outlined'
                                                    startIcon={<Add />}
                                                    onClick={() => push('')}
                                                    sx={{
                                                        borderColor: GOLD,
                                                        color: BROWN,
                                                        '&:hover': {
                                                            borderColor: BROWN,
                                                            bgcolor:
                                                                'rgba(184,134,11,0.06)',
                                                        },
                                                    }}
                                                >
                                                    {t(
                                                        'pages.jobs.form.addBenefit',
                                                    )}
                                                </Button>
                                            </Box>

                                            <Divider />

                                            {formValues.benefits?.length ===
                                            0 ? (
                                                <Typography
                                                    color='text.secondary'
                                                    variant='body2'
                                                >
                                                    {t(
                                                        'pages.jobs.form.noBenefits',
                                                    )}
                                                </Typography>
                                            ) : (
                                                formValues.benefits?.map(
                                                    (_, index) => (
                                                        <Stack
                                                            key={index}
                                                            direction='row'
                                                            spacing={1}
                                                            alignItems='flex-start'
                                                        >
                                                            <Box
                                                                sx={{
                                                                    flex: 1,
                                                                }}
                                                            >
                                                                <FormikTextField
                                                                    name={`benefits.${index}`}
                                                                    label={`${t(
                                                                        'pages.jobs.form.benefit',
                                                                    )} ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                />
                                                            </Box>

                                                            <IconButton
                                                                color='error'
                                                                onClick={() =>
                                                                    remove(
                                                                        index,
                                                                    )
                                                                }
                                                                sx={{
                                                                    mt: 0.5,
                                                                }}
                                                            >
                                                                <DeleteOutline />
                                                            </IconButton>
                                                        </Stack>
                                                    ),
                                                )
                                            )}
                                        </Stack>
                                    )}
                                </FieldArray>
                            </CardContent>
                        </Card>

                        {/* ================================= */}
                        {/* Submit */}
                        {/* ================================= */}

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Button
                                type='submit'
                                variant='contained'
                                size='large'
                                disabled={loading || isSubmitting}
                                startIcon={
                                    loading || isSubmitting ? (
                                        <CircularProgress
                                            size={20}
                                            color='inherit'
                                        />
                                    ) : (
                                        <Save />
                                    )
                                }
                                sx={{
                                    minWidth: 180,
                                    borderRadius: 2,
                                    background: BRAND_GRADIENT,
                                    boxShadow: 'none',
                                    '&:hover': {
                                        background: BRAND_GRADIENT,
                                        filter: 'brightness(0.92)',
                                        boxShadow: 'none',
                                    },
                                    '&.Mui-disabled': {
                                        background: 'rgba(0,0,0,0.12)',
                                    },
                                }}
                            >
                                {submitLabel ||
                                    (mode === 'edit'
                                        ? t('pages.jobs.form.update')
                                        : t('pages.jobs.form.create'))}
                            </Button>
                        </Box>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
};

export default JobForm;
