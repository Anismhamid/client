import { FunctionComponent, ReactNode, useEffect, useState } from 'react';

import {
    alpha,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Stack,
    Typography,
} from '@mui/material';

import {
    ArrowBack,
    ArrowForward,
    BusinessOutlined,
    CheckCircleOutline,
    EditOutlined,
    LocationOnOutlined,
    PaymentsOutlined,
    WorkOutline,
} from '@mui/icons-material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';

import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Job } from '../../../interfaces/jobs.types';
import { deleteJob, getJobById } from '../../../services/jobsService';
import { useUser } from '../../../hooks/useUSer';
import AlertDialogs from '../../../atoms/toasts/Sweetalert';
import { showInfo } from '../../../atoms/toasts/ReactToast';
import { path } from '../../../routes/routes';
import handleRTL from '../../../locales/handleRTL';
import { BRAND_BROWN, BRAND_GOLD, BRAND_GRADIENT } from './jobsBrand';

// ─── Helpers ───────────────────────────────────────────────

const Fact = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
    <Stack direction='row' spacing={1.5} alignItems='center'>
        <Box
            sx={{
                width: 40,
                height: 40,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 2,
                color: BRAND_BROWN,
                bgcolor: alpha(BRAND_GOLD, 0.14),
            }}
        >
            {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>{children}</Box>
    </Stack>
);

const ListSection = ({ title, items }: { title: string; items: string[] }) => (
    <Box>
        <Typography variant='h6' component='h2' fontWeight={700} sx={{ mb: 1.5 }}>
            {title}
        </Typography>

        <Stack component='ul' spacing={1.25} sx={{ m: 0, p: 0, listStyle: 'none' }}>
            {items.map((item, index) => (
                <Stack
                    key={index}
                    component='li'
                    direction='row'
                    spacing={1.25}
                    alignItems='flex-start'
                >
                    <CheckCircleOutline
                        sx={{ fontSize: 20, mt: '2px', color: BRAND_GOLD }}
                    />
                    <Typography color='text.secondary'>{item}</Typography>
                </Stack>
            ))}
        </Stack>
    </Box>
);

// ─── Page ──────────────────────────────────────────────────

const JobDetails: FunctionComponent = () => {
    const { id } = useParams();
    const { auth } = useUser();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const dir = handleRTL();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState(false);

    useEffect(() => {
        if (!id) return;

        const loadJob = async () => {
            try {
                setLoading(true);
                setJob(await getJobById(id));
            } catch (error) {
                console.error('Failed to load job:', error);
            } finally {
                setLoading(false);
            }
        };

        loadJob();
    }, [id]);

    const handleDelete = async () => {
        if (!job?._id) return;

        try {
            await deleteJob(job._id);
            navigate(path.jobs, { replace: true });
        } catch (error) {
            console.error('Failed to delete job:', error);
            showInfo(t('pages.jobs.errors.delete'));
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
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

    const salaryText = [job.salaryMin, job.salaryMax]
        .filter((n) => n !== undefined && n !== null)
        .map((n) => (n as number).toLocaleString(i18n.language))
        .join(' - ');

    const hasFacts = Boolean(salaryText || job.location);

    const isOwner = Boolean(
        auth?._id && job.seller?._id && auth._id === job.seller._id,
    );

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
                variant='outlined'
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    p: { xs: 2.5, md: 4 },
                    pt: { xs: 3.5, md: 5 },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        insetInline: 0,
                        top: 0,
                        height: 5,
                        background: BRAND_GRADIENT,
                    },
                }}
            >
                {/* Seller */}
                {job.seller && (
                    <Stack
                        component={RouterLink}
                        to={`/users/customer/${job.seller.slug}`}
                        direction='row'
                        spacing={1.5}
                        alignItems='center'
                        sx={{
                            width: 'fit-content',
                            mb: 3,
                            color: 'text.primary',
                            textDecoration: 'none',
                            '&:hover .seller-name': { color: BRAND_BROWN },
                        }}
                    >
                        <Avatar
                            src={job.seller.image?.url}
                            alt={job.seller.name?.first}
                            sx={{
                                width: 48,
                                height: 48,
                                border: '2px solid',
                                borderColor: BRAND_GOLD,
                            }}
                        />
                        <Box>
                            <Typography variant='caption' color='text.secondary'>
                                {t('pages.jobs.postedBy', {
                                    defaultValue: 'Posted by',
                                })}
                            </Typography>
                            <Typography
                                className='seller-name'
                                fontWeight={600}
                                sx={{ lineHeight: 1.2, transition: 'color 0.2s' }}
                            >
                                {job.seller.name?.first}
                            </Typography>
                        </Box>
                    </Stack>
                )}

                {/* Title + company */}
                <Typography
                    variant='h4'
                    component='h1'
                    fontWeight={800}
                    sx={{ lineHeight: 1.25, mb: job.companyName ? 1 : 2.5 }}
                >
                    {job.jobTitle}
                </Typography>

                {job.companyName && (
                    <Stack
                        direction='row'
                        spacing={1}
                        alignItems='center'
                        sx={{ mb: 2.5, color: 'text.secondary' }}
                    >
                        <BusinessOutlined fontSize='small' />
                        <Typography variant='h6' fontWeight={500}>
                            {job.companyName}
                        </Typography>
                    </Stack>
                )}

                {/* Chips */}
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
                            variant='outlined'
                            label={t('pages.jobs.remote')}
                            sx={{ borderColor: BRAND_GOLD, color: BRAND_BROWN }}
                        />
                    )}

                    {job.industry && (
                        <Chip variant='outlined' label={job.industry} />
                    )}
                </Stack>

                {/* Key facts */}
                {hasFacts && (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, minmax(0, 1fr))',
                            },
                            gap: 2.5,
                            p: 2.5,
                            mb: 4,
                            borderRadius: 3,
                            bgcolor: alpha(BRAND_GOLD, 0.07),
                            border: '1px solid',
                            borderColor: alpha(BRAND_GOLD, 0.25),
                        }}
                    >
                        {salaryText && (
                            <Fact icon={<PaymentsOutlined />}>
                                <Typography variant='h6' fontWeight={800}>
                                    {salaryText}
                                    {job.salaryPeriod && (
                                        <Box
                                            component='span'
                                            sx={{
                                                color: 'text.secondary',
                                                fontWeight: 400,
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {' / '}
                                            {t(
                                                `pages.jobs.salaryPeriods.${job.salaryPeriod}`,
                                            )}
                                        </Box>
                                    )}
                                </Typography>
                            </Fact>
                        )}

                        {job.location && (
                            <Fact icon={<LocationOnOutlined />}>
                                <Typography fontWeight={600}>
                                    {job.location}
                                </Typography>
                            </Fact>
                        )}
                    </Box>
                )}

                {/* Requirements + benefits */}
                <Stack spacing={4}>
                    {job.requirements && job.requirements.length > 0 && (
                        <ListSection
                            title={t('pages.jobs.requirements')}
                            items={job.requirements}
                        />
                    )}

                    {job.benefits && job.benefits.length > 0 && (
                        <ListSection
                            title={t('pages.jobs.benefits')}
                            items={job.benefits}
                        />
                    )}
                </Stack>

                {/* Owner actions */}
                {isOwner && (
                    <>
                        <Divider sx={{ my: 4 }} />

                        <Stack direction='row' spacing={1.5}>
                            <Button
                                variant='contained'
                                startIcon={<EditOutlined />}
                                onClick={() =>
                                    navigate(`${path.jobs}/${job._id}/edit`)
                                }
                                sx={{
                                    gap: 1,
                                    color: '#fff',
                                    background: BRAND_GRADIENT,
                                    boxShadow: 'none',
                                    '&:hover': {
                                        background: BRAND_GRADIENT,
                                        filter: 'brightness(0.92)',
                                        boxShadow: 'none',
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
                                sx={{ gap: 1 }}
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