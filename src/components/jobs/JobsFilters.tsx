import { FunctionComponent, useEffect, useState } from 'react';

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    FormControlLabel,
    Switch,
    useTheme,
    Grid,
} from '@mui/material';

import { Search, RestartAlt } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import {
    JobType,
    ExperienceLevel,
    SalaryPeriod,
    JobsFilters as JobsFiltersType,
} from '../../interfaces/jobs.types';
import handleRTL from '../../locales/handleRTL';

interface JobsFiltersProps {
    filters: JobsFiltersType;
    onSearch: (filters: JobsFiltersType) => void;
    onReset: () => void;
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';
const INK = '#12161C';

const JobsFilters: FunctionComponent<JobsFiltersProps> = ({
    filters,
    onSearch,
    onReset,
}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [localFilters, setLocalFilters] = useState<JobsFiltersType>(filters);

    // =====================================================
    // Sync local filters when parent resets/changes filters
    // =====================================================

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // =====================================================
    // Update local filter only
    // =====================================================

    const updateFilter = <K extends keyof JobsFiltersType>(
        key: K,
        value: JobsFiltersType[K],
    ) => {
        setLocalFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // =====================================================
    // Search
    // =====================================================

    const handleSearch = () => {
        const nextFilters = {
            ...localFilters,
            page: 1,
        };

        onSearch(nextFilters);
    };

    // =====================================================
    // Reset
    // =====================================================

    const handleReset = () => {
        setLocalFilters(filters);
        onReset();
    };

    const fieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#B8860B',
                borderWidth: 2,
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#B8860B',
        },
    };

    const dir = handleRTL();

    return (
        <Box p={2}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                flexWrap='wrap'
            >
                <Grid container spacing={1}>
                    {/* Job type */}
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        <FormControl
                            fullWidth
                            size='small'
                            sx={{ minWidth: 180, ...fieldSx }}
                        >
                            <InputLabel>
                                {t('pages.jobs.filters.type')}
                            </InputLabel>

                            <Select
                                value={localFilters.type || ''}
                                label={t('pages.jobs.filters.type')}
                                onChange={(event) => {
                                    updateFilter(
                                        'type',
                                        event.target.value
                                            ? (event.target.value as JobType)
                                            : undefined,
                                    );
                                }}
                            >
                                <MenuItem value=''>
                                    {t('pages.jobs.filters.all')}
                                </MenuItem>

                                <MenuItem value='full_time'>
                                    {t('pages.jobs.types.full_time')}
                                </MenuItem>

                                <MenuItem value='part_time'>
                                    {t('pages.jobs.types.part_time')}
                                </MenuItem>

                                <MenuItem value='temporary'>
                                    {t('pages.jobs.types.temporary')}
                                </MenuItem>

                                <MenuItem value='remote'>
                                    {t('pages.jobs.types.remote')}
                                </MenuItem>

                                <MenuItem value='daily'>
                                    {t('pages.jobs.types.daily')}
                                </MenuItem>

                                <MenuItem value='internship'>
                                    {t('pages.jobs.types.internship')}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        {/* Experience */}
                        <FormControl
                            fullWidth
                            size='small'
                            sx={{ minWidth: 180, ...fieldSx }}
                        >
                            <InputLabel>
                                {t('pages.jobs.filters.experience')}
                            </InputLabel>

                            <Select
                                value={localFilters.experienceLevel || ''}
                                label={t('pages.jobs.filters.experience')}
                                onChange={(event) =>
                                    updateFilter(
                                        'experienceLevel',
                                        event.target.value
                                            ? (event.target
                                                  .value as ExperienceLevel)
                                            : undefined,
                                    )
                                }
                            >
                                <MenuItem value=''>
                                    {t('pages.jobs.filters.all')}
                                </MenuItem>

                                <MenuItem value='no_experience'>
                                    {t(
                                        'pages.jobs.experienceLevels.no_experience',
                                    )}
                                </MenuItem>

                                <MenuItem value='entry'>
                                    {t('pages.jobs.experienceLevels.entry')}
                                </MenuItem>

                                <MenuItem value='mid'>
                                    {t('pages.jobs.experienceLevels.mid')}
                                </MenuItem>

                                <MenuItem value='senior'>
                                    {t('pages.jobs.experienceLevels.senior')}
                                </MenuItem>

                                <MenuItem value='manager'>
                                    {t('pages.jobs.experienceLevels.manager')}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        {/* Salary period */}
                        <FormControl
                            fullWidth
                            size='small'
                            sx={{ minWidth: 160, ...fieldSx }}
                        >
                            <InputLabel>
                                {t('pages.jobs.filters.salaryPeriod')}
                            </InputLabel>

                            <Select
                                value={localFilters.salaryPeriod || ''}
                                label={t('pages.jobs.filters.salaryPeriod')}
                                onChange={(event) =>
                                    updateFilter(
                                        'salaryPeriod',
                                        event.target.value
                                            ? (event.target
                                                  .value as SalaryPeriod)
                                            : undefined,
                                    )
                                }
                            >
                                <MenuItem value=''>
                                    {t('pages.jobs.filters.all')}
                                </MenuItem>

                                <MenuItem value='hourly'>
                                    {t('pages.jobs.salaryPeriods.hourly')}
                                </MenuItem>

                                <MenuItem value='daily'>
                                    {t('pages.jobs.salaryPeriods.daily')}
                                </MenuItem>

                                <MenuItem value='monthly'>
                                    {t('pages.jobs.salaryPeriods.monthly')}
                                </MenuItem>

                                <MenuItem value='yearly'>
                                    {t('pages.jobs.salaryPeriods.yearly')}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                        {/* Location */}
                        <TextField
                            fullWidth
                            size='small'
                            label={t('pages.jobs.filters.location')}
                            value={localFilters.location || ''}
                            onChange={(event) =>
                                updateFilter(
                                    'location',
                                    event.target.value || undefined,
                                )
                            }
                            sx={fieldSx}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        {/* Industry */}
                        <TextField
                            fullWidth
                            size='small'
                            label={t('pages.jobs.filters.industry')}
                            value={localFilters.industry || ''}
                            onChange={(event) =>
                                updateFilter(
                                    'industry',
                                    event.target.value || undefined,
                                )
                            }
                            sx={fieldSx}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        {/* Min salary */}
                        <TextField
                            fullWidth
                            size='small'
                            type='number'
                            label={t('pages.jobs.filters.salaryMin')}
                            value={localFilters.salaryMin ?? ''}
                            onChange={(event) =>
                                updateFilter(
                                    'salaryMin',
                                    event.target.value
                                        ? Number(event.target.value)
                                        : undefined,
                                )
                            }
                            sx={fieldSx}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        {/* Max salary */}
                        <TextField
                            fullWidth
                            size='small'
                            type='number'
                            label={t('pages.jobs.filters.salaryMax')}
                            value={localFilters.salaryMax ?? ''}
                            onChange={(event) =>
                                updateFilter(
                                    'salaryMax',
                                    event.target.value
                                        ? Number(event.target.value)
                                        : undefined,
                                )
                            }
                            sx={fieldSx}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                        {/* Remote */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={localFilters.remote === true}
                                    onChange={(event) =>
                                        updateFilter(
                                            'remote',
                                            event.target.checked
                                                ? true
                                                : undefined,
                                        )
                                    }
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#B8860B',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                            {
                                                backgroundColor: '#8B4513',
                                            },
                                    }}
                                />
                            }
                            label={t('pages.jobs.filters.remote')}
                        />
                    </Grid>
                </Grid>
            </Stack>

            {/* Actions */}
            <Stack
                dir={dir}
                direction='row'
                spacing={1}
                sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }}
            >
                <Button
                    variant='contained'
                    startIcon={<Search />}
                    onClick={handleSearch}
                    sx={{
                        gap: 1,
                        background: BRAND_GRADIENT,
                        color: '#fff',
                        borderRadius: 2,
                        px: 3,
                        boxShadow: 'none',
                        '&:hover': {
                            background: BRAND_GRADIENT,
                            filter: 'brightness(0.92)',
                            boxShadow: 'none',
                        },
                    }}
                >
                    {t('pages.jobs.filters.search')}
                </Button>

                <Button
                    variant='outlined'
                    startIcon={<RestartAlt />}
                    onClick={handleReset}
                    sx={{
                        gap: 1,
                        borderRadius: 2,
                        borderColor: isDark ? 'rgba(255,255,255,0.2)' : INK,
                        color: isDark ? 'text.primary' : INK,
                        '&:hover': {
                            borderColor: '#8B4513',
                            color: '#8B4513',
                            bgcolor: 'transparent',
                        },
                    }}
                >
                    {t('pages.jobs.filters.reset')}
                </Button>
            </Stack>
        </Box>
    );
};

export default JobsFilters;
