import { FunctionComponent } from 'react';
import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    FormControlLabel,
    MenuItem,
    Stack,
    Switch,
    TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
    CreateJobSeekerPayload,
    JobCategory,
} from '../../interfaces/jobs.types';
import {  BRAND_GRADIENT } from '../../components/pages/Jobs/jobsBrand';
import {
    AVAILABILITIES,
    EXPERIENCE_VALUES,
    HEBREW_LEVELS,
    JOB_CATEGORIES,
    JOB_REGIONS,
    JOB_TYPE_VALUES,
    SALARY_PERIOD_VALUES,
    SEEKER_LANGUAGES,
    optLabel,
} from '../../components/pages/Jobs/Jobsoptions';

export const EMPTY_SEEKER: CreateJobSeekerPayload = {
    title: '',
    category: '' as JobCategory,
    types: [],
    remote: false,
    skills: [],
    languages: ['ar'],
    hebrewLevel: 'none',
    availability: 'flexible',
    about: '',
    showPhone: true,
};

interface JobSeekerFormProps {
    initialValues?: Partial<CreateJobSeekerPayload>;
    onSubmit: (
        values: CreateJobSeekerPayload,
        helpers: FormikHelpers<CreateJobSeekerPayload>,
    ) => void | Promise<void>;
    mode?: 'create' | 'edit';
}

const JobSeekerForm: FunctionComponent<JobSeekerFormProps> = ({
    initialValues,
    onSubmit,
    mode = 'create',
}) => {
    const { t } = useTranslation();

    const validate = (v: CreateJobSeekerPayload) => {
        const e: FormikErrors<CreateJobSeekerPayload> = {};
        const req = t('pages.jobs.seekers.form.required', 'هذا الحقل مطلوب');

        if (v.title.trim().length < 3)
            e.title = t('pages.jobs.seekers.form.titleMin', 'العنوان 3 أحرف على الأقل');
        if (!v.category) e.category = req;
        if (!v.types.length) e.types = req;
        if (v.expectedSalary != null && v.expectedSalary < 0)
            e.expectedSalary = t('pages.jobs.seekers.form.salaryInvalid', 'قيمة غير صحيحة');
        if ((v.about ?? '').length > 1000)
            e.about = t('pages.jobs.seekers.form.aboutMax', 'الحد الأقصى 1000 حرف');

        return e;
    };

    return (
        <Formik<CreateJobSeekerPayload>
            initialValues={{ ...EMPTY_SEEKER, ...initialValues }}
            validate={validate}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
                isSubmitting,
            }) => {
                const err = (k: keyof CreateJobSeekerPayload) =>
                    touched[k] && errors[k] ? String(errors[k]) : undefined;

                const num = (k: 'expectedSalary') => (e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue(k, e.target.value === '' ? undefined : Number(e.target.value));

                return (
                    <Form noValidate>
                        <Stack spacing={2.5}>
                            <TextField
                                name='title'
                                label={t('pages.jobs.seekers.form.title', 'شو الشغل اللي بتدور عليه؟')}
                                placeholder={t('pages.jobs.seekers.form.titlePlaceholder', 'مثال: محاسب، سائق شاحنة، عامل بناء')}
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!err('title')}
                                helperText={err('title')}
                                inputProps={{ maxLength: 100 }}
                                fullWidth
                                required
                            />

                            <Box
                                sx={{
                                    display: 'grid',
                                    gap: 2,
                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                }}
                            >
                                <TextField
                                    select
                                    name='category'
                                    label={t('pages.jobs.seekers.form.category', 'القسم')}
                                    value={values.category}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!err('category')}
                                    helperText={err('category')}
                                    required
                                >
                                    {JOB_CATEGORIES.map((o) => (
                                        <MenuItem key={o.value} value={o.value}>
                                            {optLabel(t, 'categories', o)}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    name='types'
                                    label={t('pages.jobs.seekers.form.types', 'نوع الدوام')}
                                    value={values.types}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!err('types')}
                                    helperText={err('types')}
                                    SelectProps={{ multiple: true }}
                                    required
                                >
                                    {JOB_TYPE_VALUES.map((v) => (
                                        <MenuItem key={v} value={v}>
                                            {t(`pages.jobs.types.${v}`)}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    name='experienceLevel'
                                    label={t('pages.jobs.seekers.form.experience', 'مستوى الخبرة')}
                                    value={values.experienceLevel ?? ''}
                                    onChange={handleChange}
                                >
                                    <MenuItem value=''>—</MenuItem>
                                    {EXPERIENCE_VALUES.map((v) => (
                                        <MenuItem key={v} value={v}>
                                            {t(`pages.jobs.experienceLevels.${v}`)}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    name='availability'
                                    label={t('pages.jobs.seekers.form.availability', 'متى بتقدر تبلّش؟')}
                                    value={values.availability}
                                    onChange={handleChange}
                                >
                                    {AVAILABILITIES.map((o) => (
                                        <MenuItem key={o.value} value={o.value}>
                                            {optLabel(t, 'availabilities', o)}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    name='region'
                                    label={t('pages.jobs.seekers.form.region', 'المنطقة')}
                                    value={values.region ?? ''}
                                    onChange={handleChange}
                                >
                                    <MenuItem value=''>—</MenuItem>
                                    {JOB_REGIONS.map((o) => (
                                        <MenuItem key={o.value} value={o.value}>
                                            {optLabel(t, 'regions', o)}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    name='location'
                                    label={t('pages.jobs.seekers.form.city', 'المدينة / البلد')}
                                    value={values.location ?? ''}
                                    onChange={handleChange}
                                    inputProps={{ maxLength: 80 }}
                                />

                                <TextField
                                    name='expectedSalary'
                                    type='number'
                                    label={t('pages.jobs.seekers.form.expectedSalary', 'الراتب المتوقع (₪)')}
                                    value={values.expectedSalary ?? ''}
                                    onChange={num('expectedSalary')}
                                    onBlur={handleBlur}
                                    error={!!err('expectedSalary')}
                                    helperText={err('expectedSalary')}
                                    inputProps={{ min: 0 }}
                                />

                                <TextField
                                    select
                                    name='salaryPeriod'
                                    label={t('pages.jobs.seekers.form.salaryPeriod', 'الفترة')}
                                    value={values.salaryPeriod ?? ''}
                                    onChange={handleChange}
                                >
                                    <MenuItem value=''>—</MenuItem>
                                    {SALARY_PERIOD_VALUES.map((v) => (
                                        <MenuItem key={v} value={v}>
                                            {t(`pages.jobs.salaryPeriods.${v}`)}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    name='hebrewLevel'
                                    label={t('pages.jobs.seekers.form.hebrew', 'مستوى العبرية')}
                                    value={values.hebrewLevel}
                                    onChange={handleChange}
                                >
                                    {HEBREW_LEVELS.map((o) => (
                                        <MenuItem key={o.value} value={o.value}>
                                            {optLabel(t, 'hebrewLevels', o)}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    name='languages'
                                    label={t('pages.jobs.seekers.form.languages', 'اللغات')}
                                    value={values.languages}
                                    onChange={handleChange}
                                    SelectProps={{ multiple: true }}
                                >
                                    {SEEKER_LANGUAGES.map((o) => (
                                        <MenuItem key={o.value} value={o.value}>
                                            {optLabel(t, 'languages', o)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            <Autocomplete<string, true, false, true>
                                multiple
                                freeSolo
                                options={[]}
                                value={values.skills}
                                onChange={(_, v) =>
                                    setFieldValue(
                                        'skills',
                                        v.map((s) => s.trim()).filter(Boolean).slice(0, 15),
                                    )
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('pages.jobs.seekers.form.skills', 'مهارات (اكتب واضغط Enter)')}
                                    />
                                )}
                            />

                            <TextField
                                name='about'
                                label={t('pages.jobs.seekers.form.about', 'عن حالك وخبرتك')}
                                value={values.about ?? ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!err('about')}
                                helperText={err('about') ?? `${(values.about ?? '').length}/1000`}
                                inputProps={{ maxLength: 1000 }}
                                multiline
                                minRows={4}
                            />

                            <Stack>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={values.remote}
                                            onChange={(_, c) => setFieldValue('remote', c)}
                                            color='warning'
                                        />
                                    }
                                    label={t('pages.jobs.seekers.form.remote', 'بقبل شغل عن بعد')}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={values.showPhone}
                                            onChange={(_, c) => setFieldValue('showPhone', c)}
                                            color='warning'
                                        />
                                    }
                                    label={t('pages.jobs.seekers.form.showPhone', 'اعرض رقم تلفوني بالبوست')}
                                />
                            </Stack>

                            <Button
                                type='submit'
                                disabled={isSubmitting}
                                disableElevation
                                sx={{
                                    py: 1.4,
                                    fontWeight: 700,
                                    color: '#fff',
                                    background: BRAND_GRADIENT,
                                    '&:hover': { background: BRAND_GRADIENT, filter: 'brightness(0.92)' },
                                    '&.Mui-disabled': { color: '#fff', opacity: 0.6 },
                                }}
                            >
                                {isSubmitting ? (
                                    <CircularProgress size={22} sx={{ color: '#fff' }} />
                                ) : mode === 'edit' ? (
                                    t('pages.jobs.seekers.form.update', 'حفظ التعديلات')
                                ) : (
                                    t('pages.jobs.seekers.form.publish', 'انشر البوست')
                                )}
                            </Button>
                        </Stack>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default JobSeekerForm;