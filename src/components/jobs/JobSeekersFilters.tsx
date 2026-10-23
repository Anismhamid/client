import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    FormControlLabel,
    MenuItem,
    Stack,
    Switch,
    TextField,
} from '@mui/material';

import { JobSeekersFilters as Filters } from '../../interfaces/jobs.types';
import { BRAND_GRADIENT } from '../pages/Jobs/jobsBrand';
import { JOB_CATEGORIES, optLabel, JOB_REGIONS, JOB_TYPE_VALUES, EXPERIENCE_VALUES, HEBREW_LEVELS } from '../pages/Jobs/Jobsoptions';


interface Props {
    filters: Filters;
    onSearch: (filters: Filters) => void;
    onReset: () => void;
}

interface SelProps {
    label: string;
    value?: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}

const Sel: FunctionComponent<SelProps> = ({ label, value, onChange, options }) => {
    const { t } = useTranslation();
    return (
        <TextField
            select
            size='small'
            fullWidth
            label={label}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
        >
            <MenuItem value=''>{t('pages.jobs.filters.all', 'الكل')}</MenuItem>
            {options.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                    {o.label}
                </MenuItem>
            ))}
        </TextField>
    );
};

const JobSeekersFilters: FunctionComponent<Props> = ({ filters, onSearch, onReset }) => {
    const { t } = useTranslation();
    const [draft, setDraft] = useState<Filters>(filters);

    const set = <K extends keyof Filters>(key: K, value: Filters[K] | '') =>
        setDraft((p) => ({ ...p, [key]: value === '' ? undefined : value }));

    return (
        <Stack spacing={2}>
            <Box
                sx={{
                    display: 'grid',
                    gap: 1.5,
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                }}
            >
                <TextField
                    size='small'
                    fullWidth
                    label={t('pages.jobs.seekers.filters.q', 'بحث (مهنة، مهارة، مدينة)')}
                    value={draft.q ?? ''}
                    onChange={(e) => set('q', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSearch(draft)}
                />

                <Sel
                    label={t('pages.jobs.seekers.form.category', 'القسم')}
                    value={draft.category}
                    onChange={(v) => set('category', v as Filters['category'] | '')}
                    options={JOB_CATEGORIES.map((o) => ({
                        value: o.value,
                        label: optLabel(t, 'categories', o),
                    }))}
                />

                <Sel
                    label={t('pages.jobs.seekers.form.region', 'المنطقة')}
                    value={draft.region}
                    onChange={(v) => set('region', v as Filters['region'] | '')}
                    options={JOB_REGIONS.map((o) => ({
                        value: o.value,
                        label: optLabel(t, 'regions', o),
                    }))}
                />

                <Sel
                    label={t('pages.jobs.seekers.form.types', 'نوع الدوام')}
                    value={draft.type}
                    onChange={(v) => set('type', v as Filters['type'] | '')}
                    options={JOB_TYPE_VALUES.map((v) => ({
                        value: v,
                        label: t(`pages.jobs.types.${v}`),
                    }))}
                />

                <Sel
                    label={t('pages.jobs.seekers.form.experience', 'مستوى الخبرة')}
                    value={draft.experienceLevel}
                    onChange={(v) => set('experienceLevel', v as Filters['experienceLevel'] | '')}
                    options={EXPERIENCE_VALUES.map((v) => ({
                        value: v,
                        label: t(`pages.jobs.experienceLevels.${v}`),
                    }))}
                />

                <Sel
                    label={t('pages.jobs.seekers.form.hebrew', 'مستوى العبرية')}
                    value={draft.hebrewLevel}
                    onChange={(v) => set('hebrewLevel', v as Filters['hebrewLevel'] | '')}
                    options={HEBREW_LEVELS.map((o) => ({
                        value: o.value,
                        label: optLabel(t, 'hebrewLevels', o),
                    }))}
                />
            </Box>

            <FormControlLabel
                control={
                    <Switch
                        checked={!!draft.remote}
                        onChange={(_, c) => set('remote', c ? true : '')}
                        color='warning'
                    />
                }
                label={t('pages.jobs.filters.remote', 'عن بعد')}
            />

            <Stack direction='row' spacing={1}>
                <Button
                    disableElevation
                    onClick={() => onSearch(draft)}
                    sx={{
                        px: 3,
                        fontWeight: 700,
                        color: '#fff',
                        background: BRAND_GRADIENT,
                        '&:hover': { background: BRAND_GRADIENT, filter: 'brightness(0.92)' },
                    }}
                >
                    {t('pages.jobs.filters.search', 'بحث')}
                </Button>
                <Button
                    onClick={() => {
                        setDraft({ page: 1, limit: filters.limit });
                        onReset();
                    }}
                    sx={{ color: 'text.secondary' }}
                >
                    {t('pages.jobs.filters.reset', 'إعادة ضبط')}
                </Button>
            </Stack>
        </Stack>
    );
};

export default JobSeekersFilters;