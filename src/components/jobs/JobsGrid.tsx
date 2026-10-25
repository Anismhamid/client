import { FunctionComponent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { alpha, Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import {
    CheckRounded,
    LocationOnOutlined,
    WorkOutline,
} from '@mui/icons-material';

import { Job } from '../../interfaces/jobs.types';
import { path } from '../../routes/routes';
import {
    BRAND_BROWN,
    BRAND_GOLD,
    BRAND_GRADIENT,
} from '../pages/Jobs/jobsBrand';
import { CategoryIcon } from '../pages/Jobs/jobsIcons';
import {
    JOB_CATEGORIES,
    labelOf,
    timeAgo,
} from '../pages/Jobs/Jobsoptions';
import {
    ArrowFab,
    EmptyState,
    isRecent,
    NewBadge,
    Reveal,
    SalaryTag,
    Ticket,
    TicketBand,
    TICKETS_GRID_SX,
} from './ticketParts';
import { DISPLAY_FONT } from '../pages/Jobs/jobBrand';

// ─── Ticket ────────────────────────────────────────────────

const JobTicket: FunctionComponent<{ job: Job }> = ({ job }) => {
    const { t, i18n } = useTranslation();

    const badge = t('pages.jobs.offerBadge', 'وظيفة شاغرة');
    const category = labelOf(t, 'categories', JOB_CATEGORIES, job.category);

    const salaryText =
        [job.salaryMin, job.salaryMax]
            .filter((n): n is number => n !== undefined && n !== null)
            .map((n) => n.toLocaleString(i18n.language))
            .join(' - ') || null;

    const posted = timeAgo(job.createdAt, i18n.language);
    const requirements = (job.requirements ?? []).slice(0, 2);
    const initial = (job.companyName || job.jobTitle || '?')
        .trim()
        .charAt(0)
        .toUpperCase();

    return (
        <Ticket
            tone='offer'
            paperProps={{
                component: RouterLink,
                to: `${path.jobs}/${job._id}`,
            }}
            band={
                <TicketBand
                    tone='offer'
                    icon={<CategoryIcon category={job.category} />}
                    label={category || badge}
                    trailing={category ? badge : undefined}
                />
            }
            footer={
                <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    spacing={1}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <SalaryTag
                            amount={salaryText}
                            period={
                                job.salaryPeriod
                                    ? t(
                                          `pages.jobs.salaryPeriods.${job.salaryPeriod}`,
                                      )
                                    : undefined
                            }
                        />
                        <Stack
                            direction='row'
                            spacing={0.75}
                            alignItems='center'
                            sx={{ mt: 0.25 }}
                        >
                            {posted && (
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                    noWrap
                                >
                                    {posted}
                                </Typography>
                            )}
                            {isRecent(job.createdAt) && <NewBadge />}
                        </Stack>
                    </Box>
                    <ArrowFab />
                </Stack>
            }
        >
            <Stack direction='row' spacing={1.75} alignItems='flex-start'>
                <Avatar
                    variant='rounded'
                    src={job.seller?.image?.url}
                    alt={job.companyName}
                    sx={{
                        width: 52,
                        height: 52,
                        flexShrink: 0,
                        borderRadius: '14px',
                        fontFamily: DISPLAY_FONT,
                        fontWeight: 800,
                        color: BRAND_BROWN,
                        bgcolor: alpha(BRAND_GOLD, 0.14),
                    }}
                >
                    {initial}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        component='h3'
                        sx={{
                            fontFamily: DISPLAY_FONT,
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {job.jobTitle}
                    </Typography>

                    {job.companyName && (
                        <Typography
                            color='text.secondary'
                            variant='body2'
                            noWrap
                            sx={{ mt: 0.25 }}
                        >
                            {job.companyName}
                        </Typography>
                    )}

                    {job.location && (
                        <Stack
                            direction='row'
                            spacing={0.5}
                            alignItems='center'
                            sx={{ mt: 0.25, color: 'text.secondary' }}
                        >
                            <LocationOnOutlined sx={{ fontSize: 17 }} />
                            <Typography variant='body2' noWrap>
                                {job.location}
                            </Typography>
                        </Stack>
                    )}
                </Box>
            </Stack>

            <Stack direction='row' flexWrap='wrap' gap={0.75} sx={{ mt: 2 }}>
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

            {requirements.length > 0 && (
                <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                    {requirements.map((item, i) => (
                        <Stack
                            key={i}
                            direction='row'
                            spacing={0.75}
                            alignItems='flex-start'
                        >
                            <CheckRounded
                                sx={{ fontSize: 16, mt: '3px', color: BRAND_GOLD }}
                            />
                            <Typography
                                variant='body2'
                                color='text.secondary'
                                noWrap
                            >
                                {item}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>
            )}
        </Ticket>
    );
};

// ─── Grid ──────────────────────────────────────────────────

interface JobsGridProps {
    jobs: Job[];
    onCreate?: () => void;
}

const JobsGrid: FunctionComponent<JobsGridProps> = ({ jobs, onCreate }) => {
    const { t } = useTranslation();

    if (jobs.length === 0) {
        return (
            <EmptyState
                icon={<WorkOutline fontSize='inherit' />}
                title={t('pages.jobs.empty', 'ما في وظائف هون')}
                hint={t(
                    'pages.jobs.emptyHint',
                    'جرّب قسم تاني، أو غيّر الفلاتر.',
                )}
                actionLabel={
                    onCreate ? t('pages.jobs.tabs.create', 'نزّل وظيفة') : undefined
                }
                onAction={onCreate}
            />
        );
    }

    return (
        <Box sx={TICKETS_GRID_SX}>
            {jobs.map((job, i) => (
                <Reveal key={job._id} index={i}>
                    <JobTicket job={job} />
                </Reveal>
            ))}
        </Box>
    );
};

export default JobsGrid;