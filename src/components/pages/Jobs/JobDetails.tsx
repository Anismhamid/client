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
} from '@mui/material';

import {
    LocationOnOutlined,
    BusinessOutlined,
    WorkOutline,
    PaymentsOutlined,
    ArrowBack,
    EditOutlined,
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

const BRAND_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';
const INK = '#12161C';

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

        await deleteJob(job._id);

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
                <CircularProgress />
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

    return (
        <Container maxWidth='md' sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                {t('back')}
            </Button>

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        md: 4,
                    },
                    borderRadius: 3,
                    borderTop: '4px solid transparent',
                    borderImage: `${BRAND_GRADIENT} 1`,
                }}
            >
                {/* Title */}
                <Typography
                    variant='h4'
                    fontWeight={700}
                    gutterBottom
                    sx={{ color: INK }}
                >
                    {job.jobTitle}
                </Typography>

                {/* Company */}
                {job.companyName && (
                    <Stack
                        direction='row'
                        spacing={1}
                        alignItems='center'
                        sx={{ mb: 2 }}
                    >
                        <BusinessOutlined />

                        <Typography variant='h6' color='text.secondary'>
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
                            label={t(
                                `pages.jobs.experienceLevels.${job.experienceLevel}`,
                            )}
                        />
                    )}

                    {job.remote && (
                        <Chip
                            label={t('pages.jobs.remote')}
                            variant='outlined'
                            sx={{ borderColor: '#B8860B', color: '#8B4513' }}
                        />
                    )}

                    {job.industry && <Chip label={job.industry} />}
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* Location */}
                {job.location && (
                    <Stack
                        direction='row'
                        spacing={1}
                        alignItems='center'
                        sx={{ mb: 2 }}
                    >
                        <LocationOnOutlined />

                        <Typography>{job.location}</Typography>
                    </Stack>
                )}

                {/* Salary */}
                {salary && (
                    <Stack
                        direction='row'
                        spacing={1}
                        alignItems='center'
                        sx={{ mb: 3 }}
                    >
                        <PaymentsOutlined sx={{ color: '#8B4513' }} />

                        <Typography fontWeight={700} sx={{ color: '#8B4513' }}>
                            {job.salaryMin !== undefined &&
                                job.salaryMin.toLocaleString()}

                            {job.salaryMin !== undefined &&
                                job.salaryMax !== undefined &&
                                ' - '}

                            {job.salaryMax !== undefined &&
                                job.salaryMax.toLocaleString()}

                            {job.salaryPeriod && (
                                <>
                                    {' / '}
                                    {t(`pages.jobs.salaryPeriods.${job.salaryPeriod}`)}
                                </>
                            )}
                        </Typography>
                    </Stack>
                )}

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant='h6' fontWeight={700} gutterBottom>
                            {t('pages.jobs.requirements')}
                        </Typography>

                        <Stack spacing={1}>
                            {job.requirements.map((requirement, index) => (
                                <Typography key={index}>
                                    • {requirement}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                    <Box>
                        <Typography variant='h6' fontWeight={700} gutterBottom>
                            {t('pages.jobs.benefits')}
                        </Typography>

                        <Stack spacing={1}>
                            {job.benefits.map((benefit, index) => (
                                <Typography key={index}>• {benefit}</Typography>
                            ))}
                        </Stack>
                    </Box>
                )}
                {isOwner && (
                    <Stack direction='row' spacing={1} sx={{ mb: 3 }}>
                        <Button
                            variant='outlined'
                            startIcon={<EditOutlined />}
                            onClick={() => navigate(`${path.jobs}/${job._id}/edit`)}
                            sx={{
                                borderColor: INK,
                                color: INK,
                                '&:hover': {
                                    borderColor: '#8B4513',
                                    color: '#8B4513',
                                    bgcolor: 'transparent',
                                },
                            }}
                        >
                            {t('pages.jobs.actions.edit')}
                        </Button>

                        <Button
                            variant='outlined'
                            color='error'
                            startIcon={<DeleteOutline />}
                            onClick={() => setDeleteDialog(true)}
                        >
                            {t('pages.jobs.actions.delete')}
                        </Button>
                    </Stack>
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