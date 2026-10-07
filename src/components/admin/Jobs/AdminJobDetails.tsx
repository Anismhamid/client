import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
// import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
// import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';

import { useNavigate, useParams } from 'react-router-dom';

import {
    ExperienceLevel,
    Job,
    JobType,
    SalaryPeriod,
    UpdateJobPayload,
} from '../../../interfaces/jobs.types';

import {
    deleteJobByAdmin,
    getJobById,
    updateJobByAdmin,
} from '../../../services/jobsService';
import { BRAND_GOLD, BRAND_GRADIENT } from '../../pages/Jobs/jobsBrand';

const AdminJobDetails: FunctionComponent = () => {
    const navigate = useNavigate();
    const { jobId } = useParams<{
        jobId: string;
    }>();

    const [job, setJob] = useState<Job | null>(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [success, setSuccess] = useState<string | null>(null);

    const [form, setForm] = useState<UpdateJobPayload>({});

    const [requirements, setRequirements] = useState<string[]>([]);

    const [benefits, setBenefits] = useState<string[]>([]);

    const loadJob = useCallback(async () => {
        if (!jobId) {
            setError('معرف الوظيفة غير موجود');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await getJobById(jobId);

            setJob(data);

            setForm({
                type: data.type,
                jobTitle: data.jobTitle,
                companyName: data.companyName || '',
                industry: data.industry || '',
                experienceLevel: data.experienceLevel,
                salaryMin: data.salaryMin,
                salaryMax: data.salaryMax,
                salaryPeriod: data.salaryPeriod,
                location: data.location || '',
                remote: data.remote,
            });

            setRequirements(data.requirements || []);

            setBenefits(data.benefits || []);
        } catch (err) {
            console.error('[AdminJobDetails] Failed to load:', err);

            setError('فشل تحميل بيانات الوظيفة');
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        loadJob();
    }, [loadJob]);

    const handleChange = <K extends keyof UpdateJobPayload>(
        field: K,
        value: UpdateJobPayload[K],
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setSuccess(null);
    };

    const updateListItem = (
        _list: string[],
        setList: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
        value: string,
    ) => {
        setList((prev) =>
            prev.map((item, itemIndex) => (itemIndex === index ? value : item)),
        );

        setSuccess(null);
    };

    const addListItem = (
        setList: React.Dispatch<React.SetStateAction<string[]>>,
    ) => {
        setList((prev) => [...prev, '']);
    };

    const removeListItem = (
        setList: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
    ) => {
        setList((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    };

    const handleSave = async () => {
        if (!jobId) {
            return;
        }

        if (!form.jobTitle || form.jobTitle.trim().length < 2) {
            setError('عنوان الوظيفة يجب أن يحتوي على حرفين على الأقل');
            return;
        }

        if (
            form.salaryMin != null &&
            form.salaryMax != null &&
            Number(form.salaryMax) < Number(form.salaryMin)
        ) {
            setError(
                'الحد الأعلى للراتب يجب أن يكون أكبر أو يساوي الحد الأدنى',
            );
            return;
        }

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const payload: UpdateJobPayload = {
                ...form,

                jobTitle: form.jobTitle.trim(),

                companyName: form.companyName?.trim() || undefined,

                industry: form.industry?.trim() || undefined,

                location: form.location?.trim() || undefined,

                salaryMin:
                    form.salaryMin === undefined ||
                    form.salaryMin === null ||
                    form.salaryMin === 0
                        ? undefined
                        : Number(form.salaryMin),

                salaryMax:
                    form.salaryMax === undefined ||
                    form.salaryMax === null ||
                    form.salaryMax === 0
                        ? undefined
                        : Number(form.salaryMax),

                requirements: requirements
                    .map((item) => item.trim())
                    .filter(Boolean),

                benefits: benefits.map((item) => item.trim()).filter(Boolean),
            };

            const updated = await updateJobByAdmin(jobId, payload);

            setJob(updated);

            setRequirements(updated.requirements || []);

            setBenefits(updated.benefits || []);

            setSuccess('تم حفظ تعديلات الوظيفة بنجاح');
        } catch (err) {
            console.error('[AdminJobDetails] Save failed:', err);

            setError('فشل حفظ تعديلات الوظيفة');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!jobId || !job) {
            return;
        }

        const confirmed = window.confirm(
            `هل أنت متأكد من حذف الوظيفة "${job.jobTitle}"؟`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);

            await deleteJobByAdmin(jobId);

            navigate('/admin/jobs', {
                replace: true,
            });
        } catch (err) {
            console.error('[AdminJobDetails] Delete failed:', err);

            setError('فشل حذف الوظيفة');
        } finally {
            setDeleting(false);
        }
    };

    const getSellerName = (currentJob: Job) => {
        const name = currentJob.seller?.name;

        if (typeof name === 'string') {
            return name;
        }

        if (name && typeof name === 'object') {
            const first = 'first' in name ? name.first : '';

            const last = 'last' in name ? name.last : '';

            const fullName = [first, last].filter(Boolean).join(' ').trim();

            if (fullName) {
                return fullName;
            }
        }

        return (
            currentJob.seller?.name.first ||
            currentJob.seller?.email ||
            'مستخدم'
        );
    };

    const getJobTypeLabel = (type?: JobType) => {
        const labels: Record<JobType, string> = {
            full_time: 'دوام كامل',
            part_time: 'دوام جزئي',
            temporary: 'مؤقت',
            remote: 'عن بُعد',
            daily: 'يومي',
            internship: 'تدريب',
        };

        return type ? labels[type] || type : '—';
    };

    const formatDate = (date?: string) => {
        if (!date) {
            return '—';
        }

        try {
            return new Intl.DateTimeFormat('ar', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(new Date(date));
        } catch {
            return date;
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 400,
                    display: 'grid',
                    placeItems: 'center',
                }}
            >
                <CircularProgress
                    sx={{
                        color: BRAND_GOLD,
                    }}
                />
            </Box>
        );
    }

    if (!job) {
        return (
            <Container maxWidth='lg' sx={{ py: 5 }}>
                <Alert severity='error'>
                    {error || 'لم يتم العثور على الوظيفة'}
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate('/admin/jobs')}
                >
                    العودة إلى الوظائف
                </Button>
            </Container>
        );
    }

    return (
        <Container
            maxWidth='xl'
            sx={{
                py: {
                    xs: 2,
                    md: 4,
                },
            }}
        >
            {/* Header */}
            <Stack
                direction={{
                    xs: 'column',
                    sm: 'row',
                }}
                justifyContent='space-between'
                alignItems={{
                    xs: 'stretch',
                    sm: 'center',
                }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Button
                        startIcon={<ArrowBackRoundedIcon />}
                        onClick={() => navigate('/admin/jobs')}
                        sx={{
                            mb: 1,
                            color: 'text.secondary',
                        }}
                    >
                        العودة إلى الوظائف
                    </Button>

                    <Typography variant='h4' fontWeight={800}>
                        تفاصيل الوظيفة
                    </Typography>
                </Box>

                <Button
                    color='error'
                    variant='outlined'
                    startIcon={
                        deleting ? (
                            <CircularProgress size={18} color='inherit' />
                        ) : (
                            <DeleteOutlineRoundedIcon />
                        )
                    }
                    disabled={deleting}
                    onClick={handleDelete}
                >
                    حذف الوظيفة
                </Button>
            </Stack>

            {error && (
                <Alert
                    severity='error'
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    severity='success'
                    sx={{ mb: 2 }}
                    onClose={() => setSuccess(null)}
                >
                    {success}
                </Alert>
            )}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        lg: 'minmax(0, 2fr) minmax(320px, 1fr)',
                    },
                    gap: 3,
                }}
            >
                {/* Main form */}
                <Paper
                    variant='outlined'
                    sx={{
                        p: {
                            xs: 2,
                            md: 3,
                        },
                        borderRadius: 3,
                    }}
                >
                    <Stack
                        direction='row'
                        spacing={1}
                        alignItems='center'
                        sx={{ mb: 3 }}
                    >
                        <WorkOutlineRoundedIcon
                            sx={{
                                color: BRAND_GOLD,
                            }}
                        />

                        <Typography variant='h6' fontWeight={800}>
                            بيانات الوظيفة
                        </Typography>
                    </Stack>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: 'repeat(2, 1fr)',
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            fullWidth
                            label='عنوان الوظيفة'
                            value={form.jobTitle ?? ''}
                            onChange={(event) =>
                                handleChange('jobTitle', event.target.value)
                            }
                        />

                        <TextField
                            select
                            fullWidth
                            label='نوع الوظيفة'
                            value={form.type ?? ''}
                            onChange={(event) =>
                                handleChange(
                                    'type',
                                    event.target.value as JobType,
                                )
                            }
                        >
                            <MenuItem value='full_time'>دوام كامل</MenuItem>

                            <MenuItem value='part_time'>دوام جزئي</MenuItem>

                            <MenuItem value='temporary'>مؤقت</MenuItem>

                            <MenuItem value='remote'>عن بُعد</MenuItem>

                            <MenuItem value='daily'>يومي</MenuItem>

                            <MenuItem value='internship'>تدريب</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth
                            label='اسم الشركة'
                            value={form.companyName ?? ''}
                            onChange={(event) =>
                                handleChange('companyName', event.target.value)
                            }
                        />

                        <TextField
                            fullWidth
                            label='المجال'
                            value={form.industry ?? ''}
                            onChange={(event) =>
                                handleChange('industry', event.target.value)
                            }
                        />

                        <TextField
                            select
                            fullWidth
                            label='مستوى الخبرة'
                            value={form.experienceLevel ?? ''}
                            onChange={(event) =>
                                handleChange(
                                    'experienceLevel',
                                    event.target.value as ExperienceLevel,
                                )
                            }
                        >
                            <MenuItem value=''>بدون تحديد</MenuItem>

                            <MenuItem value='no_experience'>بدون خبرة</MenuItem>

                            <MenuItem value='entry'>مبتدئ</MenuItem>

                            <MenuItem value='mid'>متوسط</MenuItem>

                            <MenuItem value='senior'>متقدم</MenuItem>

                            <MenuItem value='manager'>إدارة</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth
                            label='الموقع'
                            value={form.location ?? ''}
                            onChange={(event) =>
                                handleChange('location', event.target.value)
                            }
                        />

                        <TextField
                            fullWidth
                            type='number'
                            label='الحد الأدنى للراتب'
                            value={form.salaryMin ?? ''}
                            onChange={(event) =>
                                handleChange(
                                    'salaryMin',
                                    event.target.value === ''
                                        ? undefined
                                        : Number(event.target.value),
                                )
                            }
                        />

                        <TextField
                            fullWidth
                            type='number'
                            label='الحد الأعلى للراتب'
                            value={form.salaryMax ?? ''}
                            onChange={(event) =>
                                handleChange(
                                    'salaryMax',
                                    event.target.value === ''
                                        ? undefined
                                        : Number(event.target.value),
                                )
                            }
                        />

                        <TextField
                            select
                            fullWidth
                            label='فترة الراتب'
                            value={form.salaryPeriod ?? ''}
                            onChange={(event) =>
                                handleChange(
                                    'salaryPeriod',
                                    event.target.value as SalaryPeriod,
                                )
                            }
                        >
                            <MenuItem value=''>بدون تحديد</MenuItem>

                            <MenuItem value='hourly'>بالساعة</MenuItem>

                            <MenuItem value='daily'>يومي</MenuItem>

                            <MenuItem value='monthly'>شهري</MenuItem>

                            <MenuItem value='yearly'>سنوي</MenuItem>
                        </TextField>

                        <TextField
                            select
                            fullWidth
                            label='العمل عن بُعد'
                            value={form.remote ? 'true' : 'false'}
                            onChange={(event) =>
                                handleChange(
                                    'remote',
                                    event.target.value === 'true',
                                )
                            }
                        >
                            <MenuItem value='false'>حضوري</MenuItem>

                            <MenuItem value='true'>عن بُعد</MenuItem>
                        </TextField>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Requirements */}
                    <Typography variant='h6' fontWeight={800} sx={{ mb: 2 }}>
                        المتطلبات
                    </Typography>

                    <Stack spacing={1.5}>
                        {requirements.map((requirement, index) => (
                            <Stack
                                key={`requirement-${index}`}
                                direction='row'
                                spacing={1}
                            >
                                <TextField
                                    fullWidth
                                    size='small'
                                    value={requirement}
                                    placeholder='أدخل متطلبًا'
                                    onChange={(event) =>
                                        updateListItem(
                                            requirements,
                                            setRequirements,
                                            index,
                                            event.target.value,
                                        )
                                    }
                                />

                                <IconButton
                                    color='error'
                                    onClick={() =>
                                        removeListItem(setRequirements, index)
                                    }
                                >
                                    <DeleteOutlineRoundedIcon />
                                </IconButton>
                            </Stack>
                        ))}

                        <Button
                            variant='outlined'
                            onClick={() => addListItem(setRequirements)}
                        >
                            + إضافة متطلب
                        </Button>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    {/* Benefits */}
                    <Typography variant='h6' fontWeight={800} sx={{ mb: 2 }}>
                        المميزات
                    </Typography>

                    <Stack spacing={1.5}>
                        {benefits.map((benefit, index) => (
                            <Stack
                                key={`benefit-${index}`}
                                direction='row'
                                spacing={1}
                            >
                                <TextField
                                    fullWidth
                                    size='small'
                                    value={benefit}
                                    placeholder='أدخل ميزة'
                                    onChange={(event) =>
                                        updateListItem(
                                            benefits,
                                            setBenefits,
                                            index,
                                            event.target.value,
                                        )
                                    }
                                />

                                <IconButton
                                    color='error'
                                    onClick={() =>
                                        removeListItem(setBenefits, index)
                                    }
                                >
                                    <DeleteOutlineRoundedIcon />
                                </IconButton>
                            </Stack>
                        ))}

                        <Button
                            variant='outlined'
                            onClick={() => addListItem(setBenefits)}
                        >
                            + إضافة ميزة
                        </Button>
                    </Stack>

                    {/* Save */}
                    <Button
                        fullWidth
                        size='large'
                        variant='contained'
                        startIcon={
                            saving ? (
                                <CircularProgress size={20} color='inherit' />
                            ) : (
                                <SaveRoundedIcon />
                            )
                        }
                        disabled={saving}
                        onClick={handleSave}
                        sx={{
                            mt: 4,
                            py: 1.4,
                            fontWeight: 800,
                            background: BRAND_GRADIENT,
                            '&:hover': {
                                background: BRAND_GRADIENT,
                                opacity: 0.9,
                            },
                        }}
                    >
                        {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                    </Button>
                </Paper>

                {/* Seller / information */}
                <Stack spacing={3}>
                    <Paper
                        variant='outlined'
                        sx={{
                            p: 3,
                            borderRadius: 3,
                        }}
                    >
                        <Typography
                            variant='h6'
                            fontWeight={800}
                            sx={{ mb: 2 }}
                        >
                            صاحب الوظيفة
                        </Typography>

                        <Stack direction='row' spacing={2} alignItems='center'>
                            <Avatar
                                alt={getSellerName(job)}
                                src={job.seller?.image.url}
                                sx={{
                                    width: 64,
                                    height: 64,
                                }}
                            >
                                <PersonOutlineRoundedIcon />
                            </Avatar>

                            <Box>
                                <Typography fontWeight={800}>
                                    {getSellerName(job)}
                                </Typography>

                                {job.seller?.slug && (
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                    >
                                        @{job.seller.slug}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>

                        <Stack spacing={1.5} sx={{ mt: 3 }}>
                            {job.seller?.phone && (
                                <Stack
                                    direction='row'
                                    spacing={1}
                                    alignItems='center'
                                >
                                    <PhoneOutlinedIcon fontSize='small' />

                                    <Typography variant='body2'>
                                        {job.seller.phone.phone_1}
                                    </Typography>
                                </Stack>
                            )}

                            {job.seller?.personalEmail && (
                                <Stack
                                    direction='row'
                                    spacing={1}
                                    alignItems='center'
                                >
                                    <EmailOutlinedIcon fontSize='small' />

                                    <Typography
                                        variant='body2'
                                        sx={{
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {job.seller.personalEmail}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                    </Paper>

                    {/* Summary */}
                    <Paper
                        variant='outlined'
                        sx={{
                            p: 3,
                            borderRadius: 3,
                        }}
                    >
                        <Typography
                            variant='h6'
                            fontWeight={800}
                            sx={{ mb: 2 }}
                        >
                            ملخص الوظيفة
                        </Typography>

                        <Stack spacing={1.5}>
                            <Stack
                                direction='row'
                                justifyContent='space-between'
                                gap={2}
                            >
                                <Typography color='text.secondary'>
                                    النوع
                                </Typography>

                                <Chip
                                    size='small'
                                    label={getJobTypeLabel(job.type)}
                                />
                            </Stack>

                            <Stack
                                direction='row'
                                justifyContent='space-between'
                                gap={2}
                            >
                                <Typography color='text.secondary'>
                                    الموقع
                                </Typography>

                                <Typography fontWeight={600} textAlign='right'>
                                    {job.location || 'غير محدد'}
                                </Typography>
                            </Stack>

                            <Stack
                                direction='row'
                                justifyContent='space-between'
                                gap={2}
                            >
                                <Typography color='text.secondary'>
                                    تاريخ الإنشاء
                                </Typography>

                                <Typography fontWeight={600}>
                                    {formatDate(job.createdAt)}
                                </Typography>
                            </Stack>

                            <Stack
                                direction='row'
                                justifyContent='space-between'
                                gap={2}
                            >
                                <Typography color='text.secondary'>
                                    آخر تعديل
                                </Typography>

                                <Typography fontWeight={600}>
                                    {formatDate(job.updatedAt)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Paper>
                </Stack>
            </Box>
        </Container>
    );
};

export default AdminJobDetails;
