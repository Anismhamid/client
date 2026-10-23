import { FunctionComponent } from 'react';
import { alpha, Box, ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { JobCategory } from '../../../interfaces/jobs.types';
import { BRAND_GOLD, BRAND_GRADIENT } from './jobsBrand';
import { CategoryIcon } from './jobsIcons';
import { JOB_CATEGORIES, optLabel } from './Jobsoptions';

interface Props {
    value?: JobCategory;
    onChange: (value?: JobCategory) => void;
}

const Pill: FunctionComponent<{
    active: boolean;
    label: string;
    category?: JobCategory;
    onClick: () => void;
}> = ({ active, label, category, onClick }) => (
    <ButtonBase
        onClick={onClick}
        aria-pressed={active}
        sx={{
            flexShrink: 0,
            gap: 0.75,
            height: 40,
            px: 1.75,
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            scrollSnapAlign: 'start',
            color: active ? '#fff' : 'text.primary',
            background: active ? BRAND_GRADIENT : 'transparent',
            border: '1px solid',
            borderColor: active ? 'transparent' : 'divider',
            transition: 'border-color 0.2s ease',
            '&:hover': { borderColor: BRAND_GOLD },
            '&:focus-visible': { outline: `2px solid ${BRAND_GOLD}`, outlineOffset: 2 },
        }}
    >
        {category && (
            <Box sx={{ display: 'grid', fontSize: 18, color: active ? '#fff' : BRAND_GOLD }}>
                <CategoryIcon category={category} />
            </Box>
        )}
        {label}
    </ButtonBase>
);

const CategoryRail: FunctionComponent<Props> = ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <Box
            role='group'
            aria-label={t('pages.jobs.rail.label', 'الأقسام')}
            sx={{
                display: 'flex',
                gap: 1,
                py: 0.5,
                mb: 2,
                overflowX: 'auto',
                scrollSnapType: 'x proximity',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                maskImage:
                    'linear-gradient(to right, transparent, #000 20px, #000 calc(100% - 20px), transparent)',
                // pad so first/last pill clear the fade
                px: 2.5,
                mx: -2.5,
                bgcolor: 'transparent',
                '& > *': { outlineOffset: 2 },
                color: (theme) => alpha(theme.palette.text.primary, 1),
            }}
        >
            <Pill
                active={!value}
                label={t('pages.jobs.rail.all', 'كل الأقسام')}
                onClick={() => onChange(undefined)}
            />
            {JOB_CATEGORIES.map((o) => (
                <Pill
                    key={o.value}
                    category={o.value}
                    active={value === o.value}
                    label={optLabel(t, 'categories', o)}
                    onClick={() => onChange(value === o.value ? undefined : o.value)}
                />
            ))}
        </Box>
    );
};

export default CategoryRail;