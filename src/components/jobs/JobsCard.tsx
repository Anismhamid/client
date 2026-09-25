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
    Avatar,
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
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                position: 'relative',
                bgcolor: 'background.paper',
                boxShadow: '0 2px 10px rgba(18,22,28,0.06)',
                transition: 'all 0.25s ease',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    insetInlineStart: 0,
                    insetBlockStart: 0,
                    width: '100%',
                    height: 4,
                    background: BRAND_GRADIENT,
                    opacity: 0,
                    transition: 'opacity 0.25s ease',
                },
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 14px 28px rgba(184,134,11,0.16)',
                    '&::before': { opacity: 1 },
                },
                '&:focus-within': {
                    boxShadow: `0 0 0 2px ${BRAND_GOLD}55`,
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                {/* Seller */}
                <Stack
                    direction='row'
                    spacing={1.5}
                    alignItems='center'
                    sx={{ mb: 1.5 }}
                >
                    <Avatar
                        src={job.seller.image.url}
                        alt={job.seller.name.first}
                        sx={{
                            width: 46,
                            height: 46,
                            border: '2px solid',
                            borderColor: BRAND_GOLD,
                            boxShadow: '0 0 0 3px rgba(184,134,11,0.12)',
                        }}
                    />

                    {job.companyName && (
                        <Stack direction='row' spacing={0.75} alignItems='center'>
                            <BusinessOutlined
                                fontSize='small'
                                sx={{ color: 'text.secondary' }}
                            />
                            <Typography variant='body2' color='text.secondary'>
                                {job.companyName}
                            </Typography>
                        </Stack>
                    )}
                </Stack>

                <Divider sx={{ mb: 1.5 }} />

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
                        lineHeight: 1.3,
                    }}
                >
                    {job.jobTitle}
                </Typography>

                {/* Information */}
                <Stack spacing={1.25} sx={{ mt: 1 }}>
                    {job.type && (
                        <Box>
                            <Chip
                                size='small'
                                icon={<WorkOutline sx={{ fontSize: 16 }} />}
                                label={t(`pages.jobs.types.${job.type}`)}
                                sx={{
                                    background: BRAND_GRADIENT,
                                    color: '#fff',
                                    fontWeight: 600,
                                    '& .MuiChip-icon': { color: '#fff' },
                                }}
                            />
                        </Box>
                    )}

                    {job.location && (
                        <Stack direction='row' spacing={1} alignItems='center'>
                            <LocationOnOutlined
                                fontSize='small'
                                sx={{ color: 'text.secondary' }}
                            />
                            <Typography variant='body2' color='text.secondary'>
                                {job.location}
                            </Typography>
                        </Stack>
                    )}

                    {salary && (
                        <Stack direction='row' spacing={1} alignItems='center'>
                            <PaymentsOutlined
                                fontSize='small'
                                sx={{ color: BRAND_BROWN }}
                            />
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
                                            { defaultValue: job.salaryPeriod },
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
                            label={t('pages.jobs.filters.remote', {
                                defaultValue: 'Remote',
                            })}
                        />
                    )}

                    {job.industry && (
                        <Chip size='small' variant='outlined' label={job.industry} />
                    )}
                </Stack>

                {/* Seller phone */}
                {job.seller?.phone?.phone_1 && (
                    <Typography
                        component='a'
                        href={`tel:${job.seller.phone.phone_1}`}
                        variant='body2'
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 2,
                            color: BRAND_BROWN,
                            fontWeight: 600,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        📞 {job.seller.phone.phone_1}
                    </Typography>
                )}
            </CardContent>

            <Button
                fullWidth
                disableElevation
                aria-label={t('pages.jobs.card.openDetails', {
                    title: job.jobTitle,
                    defaultValue: `View details for ${job.jobTitle}`,
                })}
                onClick={goToDetails}
                sx={{
                    borderRadius: 0,
                    py: 1.4,
                    fontWeight: 700,
                    color: '#fff',
                    background: BRAND_GRADIENT,
                    '&:hover': {
                        background: BRAND_GRADIENT,
                        filter: 'brightness(0.92)',
                    },
                }}
            >
                {t('pages.jobs.card.openDetails')}
            </Button>
        </Card>
    );
};

export default memo(JobsCard);