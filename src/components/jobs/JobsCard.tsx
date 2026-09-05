import { FunctionComponent } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Divider,
} from '@mui/material';

import {
    LocationOnOutlined,
    WorkOutline,
    BusinessOutlined,
    PaymentsOutlined,
} from '@mui/icons-material';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Job } from '../../interfaces/jobs.types';

const BRAND_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';

interface JobsCardProps {
    job: Job;
}

const JobsCard: FunctionComponent<JobsCardProps> = ({ job }) => {
    const { t } = useTranslation('jobs');
    const navigate = useNavigate();

    const formatSalary = () => {
        if (job.salaryMin === undefined && job.salaryMax === undefined) {
            return null;
        }

        const min =
            job.salaryMin !== undefined ? job.salaryMin.toLocaleString() : '';

        const max =
            job.salaryMax !== undefined ? job.salaryMax.toLocaleString() : '';

        if (min && max) {
            return `${min} - ${max}`;
        }

        return min || max;
    };

    const salary = formatSalary();

    return (
        <Card
            onClick={() => navigate(`/jobs/${job._id}`)}
            sx={{
                height: '100%',
                cursor: 'pointer',
                borderRadius: 3,
                border: '1px solid transparent',
                transition: '0.2s',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    borderColor: '#B8860B',
                    boxShadow: '0 8px 20px rgba(184,134,11,0.18)',
                },
            }}
        >
            <CardContent>
                {/* Job title */}
                <Typography
                    variant='h6'
                    fontWeight={700}
                    gutterBottom
                    sx={{
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
                    <Stack
                        direction='row'
                        spacing={1}
                        alignItems='center'
                        sx={{ mb: 1 }}
                    >
                        <BusinessOutlined fontSize='small' />

                        <Typography variant='body2' color='text.secondary'>
                            {job.companyName}
                        </Typography>
                    </Stack>
                )}

                <Divider sx={{ my: 1.5 }} />

                {/* Information */}
                <Stack spacing={1}>
                    {/* Type */}
                    <Stack direction='row' spacing={1} alignItems='center'>
                        <Chip
                            size='small'
                            icon={<WorkOutline sx={{ fontSize: 16, color: '#fff !important' }} />}
                            label={t(`types.${job.type}`)}
                            sx={{
                                background: BRAND_GRADIENT,
                                color: '#fff',
                                fontWeight: 600,
                            }}
                        />
                    </Stack>

                    {/* Location */}
                    {job.location && (
                        <Stack direction='row' spacing={1} alignItems='center'>
                            <LocationOnOutlined fontSize='small' />

                            <Typography variant='body2'>
                                {job.location}
                            </Typography>
                        </Stack>
                    )}

                    {/* Salary */}
                    {salary && (
                        <Stack direction='row' spacing={1} alignItems='center'>
                            <PaymentsOutlined fontSize='small' />

                            <Typography
                                variant='body2'
                                fontWeight={700}
                                sx={{ color: '#8B4513' }}
                            >
                                {salary}

                                {job.salaryPeriod && (
                                    <Typography
                                        component='span'
                                        variant='body2'
                                        color='text.secondary'
                                    >
                                        {' '}
                                        /{' '}
                                        {t(`salaryPeriods.${job.salaryPeriod}`)}
                                    </Typography>
                                )}
                            </Typography>
                        </Stack>
                    )}
                </Stack>

                {/* Tags */}
                <Stack
                    direction='row'
                    spacing={1}
                    flexWrap='wrap'
                    sx={{ mt: 2, gap: 1 }}
                >
                    {job.experienceLevel && (
                        <Chip
                            size='small'
                            label={t(`experienceLevels.${job.experienceLevel}`)}
                        />
                    )}

                    {job.remote && <Chip size='small' label={t('remote')} />}

                    {job.industry && <Chip size='small' label={job.industry} />}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default JobsCard;