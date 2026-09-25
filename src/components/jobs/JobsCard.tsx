import { FunctionComponent, memo } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Divider,
    Box,
    Button,
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

// =====================================================
// Shared brand constants
// =====================================================

const BRAND_GOLD = '#B8860B';
const BRAND_BROWN = '#8B4513';
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_GOLD} 0%, ${BRAND_BROWN} 100%)`;

const NUMBER_FORMAT = new Intl.NumberFormat();

interface JobsCardProps {
    job: Job;
}

const JobsCard: FunctionComponent<JobsCardProps> = ({ job }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // =====================================================
    // Salary formatting
    // =====================================================

    const formatSalary = (): string | null => {
        const hasMin = job.salaryMin != null;
        const hasMax = job.salaryMax != null;

        if (!hasMin && !hasMax) return null;

        const min = hasMin ? NUMBER_FORMAT.format(job.salaryMin as number) : '';
        const max = hasMax ? NUMBER_FORMAT.format(job.salaryMax as number) : '';

        if (min && max) return `${min} - ${max}`;
        return min || max;
    };

    const salary = formatSalary();

    // =====================================================
    // Navigation
    // =====================================================

    const goToDetails = () => navigate(`/jobs/${job._id}`);

    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid transparent',
                transition: '0.2s',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    borderColor: BRAND_GOLD,
                    boxShadow: '0 8px 20px rgba(184,134,11,0.18)',
                },
                '&:focus-within': {
                    borderColor: BRAND_GOLD,
                    boxShadow: `0 0 0 2px ${BRAND_GOLD}40`,
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
                    {job.type && (
                        <Stack direction='row' spacing={1} alignItems='center'>
                            <Chip
                                size='small'
                                icon={<WorkOutline />}
                                label={t(`pages.jobs.types.${job.type}`)}
                                sx={{
                                    background: BRAND_GRADIENT,
                                    color: '#fff',
                                    fontWeight: 600,
                                    '& .MuiChip-icon': {
                                        color: '#fff',
                                        fontSize: 16,
                                    },
                                }}
                            />
                        </Stack>
                    )}

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
                                component='span'
                                variant='body2'
                                fontWeight={700}
                                sx={{ color: BRAND_BROWN }}
                            >
                                {salary}
                                {job.salaryPeriod && (
                                    <Box
                                        component='span'
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 400,
                                        }}
                                    >
                                        {' / '}
                                        {t(
                                            `pages.jobs.salaryPeriods.${job.salaryPeriod}`,
                                            {
                                                defaultValue: job.salaryPeriod,
                                            },
                                        )}
                                    </Box>
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
                    useFlexGap
                    sx={{ mt: 2 }}
                >
                    {job.experienceLevel && (
                        <Chip
                            size='small'
                            label={t(
                                `pages.jobs.experienceLevels.${job.experienceLevel}`,
                            )}
                        />
                    )}

                    {job.remote && (
                        <Chip
                            size='small'
                            label={t('pages.jobs.filters.remote', {
                                defaultValue: 'Remote',
                            })}
                        />
                    )}

                    {job.industry && <Chip size='small' label={job.industry} />}
                </Stack>
            </CardContent>
            <Button
            variant='contained'
                aria-label={t('pages.jobs.card.openDetails', {
                    title: job.jobTitle,
                    defaultValue: `View details for ${job.jobTitle}`,
                })}
                onClick={goToDetails}
            >
                {t('pages.jobs.card.openDetails')}
            </Button>
        </Card>
    );
};

export default memo(JobsCard);
