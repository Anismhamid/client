import { FunctionComponent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
    alpha,
    Avatar,
    Box,
    Chip,
    Paper,
    Stack,
    Typography,
} from '@mui/material';

import {
    CheckRounded,
    LocationOnOutlined,
    PaymentsOutlined,
    WorkOutline,
} from '@mui/icons-material';

import { Job } from '../../interfaces/jobs.types';
import { path } from '../../routes/routes';
import {
    BRAND_BROWN,
    BRAND_GOLD,
    BRAND_GRADIENT,
} from '../pages/Jobs/jobsBrand';

// ─── Helpers ───────────────────────────────────────────────

const timeAgo = (iso: string | undefined, locale: string): string | null => {
    if (!iso) return null;

    const diffSec = (new Date(iso).getTime() - Date.now()) / 1000;
    if (Number.isNaN(diffSec)) return null;

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    const units: [Intl.RelativeTimeFormatUnit, number][] = [
        ['month', 2592000],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60],
    ];

    for (const [unit, seconds] of units) {
        if (Math.abs(diffSec) >= seconds) {
            return rtf.format(Math.round(diffSec / seconds), unit);
        }
    }

    return rtf.format(0, 'minute');
};

// ─── Card ──────────────────────────────────────────────────

const JobCard: FunctionComponent<{ job: Job }> = ({ job }) => {
    const { t, i18n } = useTranslation();

    const salaryText = [job.salaryMin, job.salaryMax]
        .filter((n) => n !== undefined && n !== null)
        .map((n) => (n as number).toLocaleString(i18n.language))
        .join(' - ');

    const posted = timeAgo(
        (job as Job & { createdAt?: string }).createdAt,
        i18n.language,
    );

    const requirements = (job.requirements ?? []).slice(0, 2);
    const logo = job.seller?.image?.url;
    const initial = (job.companyName || job.jobTitle || '?')
        .trim()
        .charAt(0)
        .toUpperCase();

    return (
        <Paper
            component={RouterLink}
            to={`${path.jobs}/${job._id}`}
            variant='outlined'
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2.5,
                height: '100%',
                borderRadius: 3,
                color: 'text.primary',
                textDecoration: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    borderColor: BRAND_GOLD,
                    boxShadow: `0 6px 20px ${alpha(BRAND_GOLD, 0.16)}`,
                },
                '&:focus-visible': {
                    outline: `2px solid ${BRAND_GOLD}`,
                    outlineOffset: 2,
                },
            }}
        >
            <Avatar
                variant='rounded'
                src={logo}
                alt={job.companyName}
                sx={{
                    width: 56,
                    height: 56,
                    flexShrink: 0,
                    borderRadius: 2,
                    fontWeight: 700,
                    color: BRAND_BROWN,
                    bgcolor: alpha(BRAND_GOLD, 0.14),
                }}
            >
                {initial}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Title */}
                <Typography
                    variant='h6'
                    component='h3'
                    fontWeight={700}
                    sx={{
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {job.jobTitle}
                </Typography>

                {/* Company */}
                {job.companyName && (
                    <Typography color='text.secondary' noWrap sx={{ mt: 0.25 }}>
                        {job.companyName}
                    </Typography>
                )}

                {/* Location */}
                {job.location && (
                    <Stack
                        direction='row'
                        spacing={0.5}
                        alignItems='center'
                        sx={{ mt: 0.25, color: 'text.secondary' }}
                    >
                        <LocationOnOutlined sx={{ fontSize: 18 }} />
                        <Typography variant='body2' noWrap>
                            {job.location}
                        </Typography>
                    </Stack>
                )}

                {/* Salary */}
                {salaryText && (
                    <Stack
                        direction='row'
                        spacing={0.75}
                        alignItems='center'
                        sx={{
                            mt: 1.5,
                            color: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? BRAND_GOLD
                                    : BRAND_BROWN,
                        }}
                    >
                        <PaymentsOutlined sx={{ fontSize: 20 }} />
                        <Typography fontWeight={700}>
                            {salaryText}
                            {job.salaryPeriod && (
                                <Box
                                    component='span'
                                    sx={{
                                        color: 'text.secondary',
                                        fontWeight: 400,
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    {' / '}
                                    {t(
                                        `pages.jobs.salaryPeriods.${job.salaryPeriod}`,
                                    )}
                                </Box>
                            )}
                        </Typography>
                    </Stack>
                )}

                {/* Chips */}
                <Stack direction='row' flexWrap='wrap' gap={0.75} sx={{ mt: 1.5 }}>
                    <Chip
                        size='small'
                        icon={<WorkOutline sx={{ color: '#fff !important' }} />}
                        label={t(`pages.jobs.types.${job.type}`)}
                        sx={{
                            background: BRAND_GRADIENT,
                            color: '#fff',
                            fontWeight: 600,
                        }}
                    />

                    {job.experienceLevel && (
                        <Chip
                            size='small'
                            variant='outlined'
                            label={t(
                                `pages.jobs.experienceLevels.${job.experienceLevel}`,
                            )}
                        />
                    )}

                    {job.remote && (
                        <Chip
                            size='small'
                            variant='outlined'
                            label={t('pages.jobs.remote')}
                            sx={{ borderColor: BRAND_GOLD }}
                        />
                    )}
                </Stack>

                {/* Requirements preview */}
                {requirements.length > 0 && (
                    <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                        {requirements.map((item, index) => (
                            <Stack
                                key={index}
                                direction='row'
                                spacing={0.75}
                                alignItems='flex-start'
                            >
                                <CheckRounded
                                    sx={{
                                        fontSize: 16,
                                        mt: '3px',
                                        color: BRAND_GOLD,
                                    }}
                                />
                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {item}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                )}

                {/* Posted */}
                {posted && (
                    <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ display: 'block', mt: 1.5 }}
                    >
                        {posted}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

// ─── Grid ──────────────────────────────────────────────────

interface JobsGridProps {
    jobs: Job[];
}

const JobsGrid: FunctionComponent<JobsGridProps> = ({ jobs }) => {
    const { t } = useTranslation();

    if (jobs.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <WorkOutline sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                <Typography variant='h6' fontWeight={600}>
                    {t('pages.jobs.empty', 'No jobs found')}
                </Typography>
                <Typography variant='body2'>
                    {t(
                        'pages.jobs.emptyHint',
                        'Try changing or resetting the filters.',
                    )}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                    xs: '1fr',
                    lg: 'repeat(2, minmax(0, 1fr))',
                },
            }}
        >
            {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
            ))}
        </Box>
    );
};

export default JobsGrid;