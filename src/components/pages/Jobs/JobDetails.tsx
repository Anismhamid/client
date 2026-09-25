import { FunctionComponent, useEffect, useState } from 'react';

import {
    Container,
    Typography,
    Box,
    Stack,
    Chip,
    Divider,
    CircularProgress,
    Button,
    Paper,
    Avatar,
} from '@mui/material';

import {
    LocationOnOutlined,
    BusinessOutlined,
    WorkOutline,
    PaymentsOutlined,
    ArrowBack,
    EditOutlined,
    ArrowForward,
} from '@mui/icons-material';

import { deleteJob } from '../../../services/jobsService';

import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Job } from '../../../interfaces/jobs.types';
import { getJobById } from '../../../services/jobsService';
import { useUser } from '../../../hooks/useUSer';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import AlertDialogs from '../../../atoms/toasts/Sweetalert';
import { path } from '../../../routes/routes';
import handleRTL from '../../../locales/handleRTL';

const BRAND_GOLD = '#B8860B';
const BRAND_BROWN = '#8B4513';
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_GOLD} 0%, ${BRAND_BROWN} 100%)`;

const JobDetails: FunctionComponent = () => {
    const { id } = useParams();
    const { auth } = useUser();

    const navigate = useNavigate();
    const { t } = useTranslation();

    const [job, setJob] = useState<Job | null>(null);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [loading, setLoading] = useState(true);

    const handleDelete = async () => {
        if (!job?._id) return;

        await deleteJob(job._id).then(() => {
            navigate(-1);
        });

        navigate('/jobs', {
            replace: true,
        });
    };

    useEffect(() => {
        if (!id) return;

        const loadJob = async () => {
            try {
                setLoading(true);

                const result = await getJobById(id);

                setJob(result);
            } catch (error) {
                console.error('Failed to load job:', error);
            } finally {
                setLoading(false);
            }
        };

        loadJob();
    }, [id]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 10,
                }}
            >
                <CircularProgress sx={{ color: BRAND_GOLD }} />
            </Box>
        );
    }

    if (!job) {
        return (
            <Container sx={{ py: 6 }}>
                <Typography variant='h5' fontWeight={700}>
                    {t('notFound')}
                </Typography>
            </Container>
        );
    }

    const salary = job.salaryMin !== undefined || job.salaryMax !== undefined;

    const isOwner = Boolean(
        auth?._id && job.seller?._id && auth._id === job.seller._id,
    );

    const dir = handleRTL();

    return (
        <Container dir={dir} maxWidth='md' sx={{ py: 4 }}>
            <Button
                startIcon={dir === 'ltr' ? <ArrowBack /> : <ArrowForward />}
                onClick={() => navigate(-1)}
                sx={{
                    mb: 3,
                    gap: 1,
                    color: 'text.secondary',
                    '&:hover': { color: BRAND_BROWN, bgcolor: 'transparent' },
                }}
            >
                {t('pages.jobs.actions.back', { defaultValue: t('back') })}
            </Button>

            <Paper
                elevation={0}
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 4px 20px rgba(18,22,28,0.06)',
                    p: { xs: 2.5, md: 4 },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        insetInlineStart: 0,
                        insetBlockStart: 0,
                        width: '100%',
                        height: 5,
                        background: BRAND_GRADIENT,
                    },
                }}
            >
                  <Stack
                    direction='row'
                    spacing={1.5}
                    alignItems='center'
                    sx={{ mb: 1.5 }}
                >
                    <Avatar
                    component={'a'}
                    href={`/users/customer/${job.seller.slug}`}
                        src={job.seller.image.url}
                        alt={job.seller.name.first}
                        sx={{
                            width: 60,
                            height: 60,
                            border: '2px solid',
                            borderColor: BRAND_GOLD,
                            boxShadow: '0 0 0 3px rgba(184,134,11,0.12)',
                        }}
                    />
                    </Stack>

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
                {/* Title */}
                <Typography
                    variant='h4'
                    fontWeight={800}
                    gutterBottom
                    sx={{ color: 'text.primary', lineHeight: 1.25 }}
                >
                    {job.jobTitle}
                </Typography>

                {/* Company */}
                {job.companyName && (
                    <Stack
                        direction='row'
                        spacing={1}
                        alignItems='center'
                        sx={{ mb: 2.5 }}
                    >
                        <BusinessOutlined sx={{ color: 'text.secondary' }} />

                        <Typography variant='h6' color='text.secondary' fontWeight={500}>
                            {job.companyName}
                        </Typography>
                    </Stack>
                )}

                <Stack direction='row' flexWrap='wrap' gap={1} sx={{ mb: 3 }}>
                    <Chip
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
                            variant='outlined'
                            label={t(
                                `pages.jobs.experienceLevels.${job.experienceLevel}`,
                            )}
                        />
                    )}

                    {job.remote && (
                        <Chip
                            label={t('pages.jobs.remote')}
                            variant='outlined'
                            sx={{ borderColor: BRAND_GOLD, color: BRAND_BROWN }}
                        />
                    )}

                    {job.industry && (
                        <Chip variant='outlined' label={job.industry} />
                    )}
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2} sx={{ mb: salary ? 3 : 0 }}>
                    {/* Location */}
                    {job.location && (
                        <Stack direction='row' spacing={1} alignItems='center'>
                            <LocationOnOutlined sx={{ color: 'text.secondary' }} />
                            <Typography>{job.location}</Typography>
                        </Stack>
                    )}

                    {/* Salary */}
                    {salary && (
                        <Stack direction='row' spacing={1} alignItems='center'>
                            <PaymentsOutlined sx={{ color: BRAND_BROWN }} />

                            <Typography fontWeight={700} sx={{ color: BRAND_BROWN }}>
                                {job.salaryMin !== undefined &&
                                    job.salaryMin.toLocaleString()}

                                {job.salaryMin !== undefined &&
                                    job.salaryMax !== undefined &&
                                    ' - '}

                                {job.salaryMax !== undefined &&
                                    job.salaryMax.toLocaleString()}

                                {job.salaryPeriod && (
                                    <Box
                                        component='span'
                                        sx={{ color: 'text.secondary', fontWeight: 400 }}
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
                </Stack>

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant='h6'
                            fontWeight={700}
                            gutterBottom
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                '&::before': {
                                    content: '""',
                                    width: 4,
                                    height: 18,
                                    borderRadius: 1,
                                    background: BRAND_GRADIENT,
                                },
                            }}
                        >
                            {t('pages.jobs.requirements')}
                        </Typography>

                        <Stack spacing={1} sx={{ mt: 1 }}>
                            {job.requirements.map((requirement, index) => (
                                <Typography key={index} color='text.secondary'>
                                    • {requirement}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                    <Box sx={{ mb: isOwner ? 4 : 0 }}>
                        <Typography
                            variant='h6'
                            fontWeight={700}
                            gutterBottom
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                '&::before': {
                                    content: '""',
                                    width: 4,
                                    height: 18,
                                    borderRadius: 1,
                                    background: BRAND_GRADIENT,
                                },
                            }}
                        >
                            {t('pages.jobs.benefits')}
                        </Typography>

                        <Stack spacing={1} sx={{ mt: 1 }}>
                            {job.benefits.map((benefit, index) => (
                                <Typography key={index} color='text.secondary'>
                                    • {benefit}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>
                )}

                {isOwner && (
                    <>
                        <Divider sx={{ mb: 3 }} />

                        <Stack
                            direction='row'
                            spacing={2}
                            justifyContent='center'
                        >
                            <Button
                                variant='outlined'
                                startIcon={<EditOutlined />}
                                onClick={() =>
                                    navigate(`${path.jobs}/${job._id}/edit`)
                                }
                                sx={{
                                    gap: 1,
                                    borderColor: 'text.primary',
                                    color: 'text.primary',
                                    '&:hover': {
                                        borderColor: BRAND_BROWN,
                                        color: BRAND_BROWN,
                                        bgcolor: 'transparent',
                                    },
                                }}
                            >
                                {t('pages.jobs.actions.edit')}
                            </Button>

                            <Button
                                sx={{ gap: 1 }}
                                variant='outlined'
                                color='error'
                                startIcon={<DeleteOutline />}
                                onClick={() => setDeleteDialog(true)}
                            >
                                {t('pages.jobs.actions.delete')}
                            </Button>
                        </Stack>
                    </>
                )}
            </Paper>

            <AlertDialogs
                show={deleteDialog}
                onHide={() => setDeleteDialog(false)}
                onConfirm={handleDelete}
                title={t('pages.jobs.delete.title')}
                description={t('pages.jobs.delete.message')}
                confirmText={t('pages.jobs.delete.confirm')}
                cancelText={t('pages.jobs.delete.cancel')}
                successText={t('pages.jobs.delete.success')}
                errorText={t('pages.jobs.delete.error')}
            />
        </Container>
    );
};

export default JobDetails;