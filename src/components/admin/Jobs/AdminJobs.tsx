import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Collapse,
    Container,
    IconButton,
    InputAdornment,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
    AdminJobsFilters,
    ExperienceLevel,
    Job,
    JobType,
} from '../../../interfaces/jobs.types';

import { deleteJobByAdmin, getAdminJobs } from '../../../services/jobsService';


import { path } from '../../../routes/routes';
import { BRAND_GOLD, BRAND_GRADIENT } from '../../pages/Jobs/jobsBrand';

const DEFAULT_FILTERS: AdminJobsFilters = {
    page: 1,
    limit: 12,
};

const AdminJobs: FunctionComponent = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [filters, setFilters] = useState<AdminJobsFilters>(DEFAULT_FILTERS);

    const [searchInput, setSearchInput] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);

    const [filtersOpen, setFiltersOpen] = useState(false);

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const activeFiltersCount = useMemo(() => {
        return Object.entries(filters).filter(
            ([key, value]) =>
                !['page', 'limit', 'search'].includes(key) &&
                value !== undefined &&
                value !== null &&
                value !== '',
        ).length;
    }, [filters]);

    const loadJobs = useCallback(
        async (currentFilters: AdminJobsFilters) => {
            try {
                setLoading(true);
                setError(null);

                const response = await getAdminJobs(currentFilters);

                setJobs(response.jobs || []);

                setTotalPages(response.pagination?.pages ?? 1);

                setTotalJobs(
                    response.pagination?.total ?? response.jobs?.length ?? 0,
                );
            } catch (err) {
                console.error('[AdminJobs] Failed to load jobs:', err);

                setJobs([]);
                setTotalPages(1);
                setTotalJobs(0);

                setError(t('admin.jobs.errors.load', 'فشل تحميل الوظائف'));
            } finally {
                setLoading(false);
            }
        },
        [t],
    );

    useEffect(() => {
        loadJobs(filters);
    }, [filters, loadJobs]);

    const handleSearch = () => {
        setFilters((prev) => ({
            ...prev,
            search: searchInput.trim() || undefined,
            page: 1,
        }));
    };

    const handleSearchKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleFilterChange = (
        key: keyof AdminJobsFilters,
        value: unknown,
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === '' || value === undefined ? undefined : value,
            page: 1,
        }));
    };

    const handleReset = () => {
        setSearchInput('');
        setFilters({ ...DEFAULT_FILTERS });
        setFiltersOpen(false);
    };

    const handlePageChange = (
        _: React.ChangeEvent<unknown>,
        pageNumber: number,
    ) => {
        setFilters((prev) => ({
            ...prev,
            page: pageNumber,
        }));

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleDelete = async (job: Job) => {
        const confirmed = window.confirm(
            `هل أنت متأكد من حذف الوظيفة "${job.jobTitle}"؟`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(job._id);

            await deleteJobByAdmin(job._id);

            setJobs((prev) => prev.filter((item) => item._id !== job._id));

            setTotalJobs((prev) => Math.max(prev - 1, 0));
        } catch (err) {
            console.error('[AdminJobs] Delete failed:', err);

            setError(t('admin.jobs.errors.delete', 'فشل حذف الوظيفة'));
        } finally {
            setDeletingId(null);
        }
    };

    const getSellerName = (job: Job) => {
        const name = job.seller?.name;

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

        return job.seller?.name.first || job.seller?.email || 'مستخدم';
    };

    const getJobTypeLabel = (type: JobType) => {
        const labels: Record<JobType, string> = {
            full_time: 'دوام كامل',
            part_time: 'دوام جزئي',
            temporary: 'مؤقت',
            remote: 'عن بُعد',
            daily: 'يومي',
            internship: 'تدريب',
        };

        return labels[type] || type;
    };

    const getExperienceLabel = (level?: ExperienceLevel) => {
        if (!level) {
            return '—';
        }

        const labels: Record<ExperienceLevel, string> = {
            no_experience: 'بدون خبرة',
            entry: 'مبتدئ',
            mid: 'متوسط',
            senior: 'متقدم',
            manager: 'إدارة',
        };

        return labels[level] || level;
    };

    const formatDate = (date: string) => {
        try {
            return new Intl.DateTimeFormat('ar', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(new Date(date));
        } catch {
            return date;
        }
    };

    const formatSalary = (job: Job) => {
        if (job.salaryMin == null && job.salaryMax == null) {
            return 'الراتب غير محدد';
        }

        const min =
            job.salaryMin != null
                ? job.salaryMin.toLocaleString('he-IL')
                : null;

        const max =
            job.salaryMax != null
                ? job.salaryMax.toLocaleString('he-IL')
                : null;

        if (min && max) {
            return `${min} - ${max}`;
        }

        return min || max || '—';
    };

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
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant='h4' fontWeight={800}>
                        إدارة الوظائف
                    </Typography>

                    <Typography color='text.secondary' sx={{ mt: 0.5 }}>
                        إدارة ومراجعة الوظائف المنشورة
                    </Typography>

                    <Box
                        sx={{
                            width: 56,
                            height: 4,
                            borderRadius: 2,
                            mt: 1,
                            background: BRAND_GRADIENT,
                        }}
                    />
                </Box>

                <Chip
                    icon={<WorkOutlineRoundedIcon />}
                    label={`${totalJobs} وظيفة`}
                    sx={{
                        fontWeight: 700,
                    }}
                />
            </Box>

            {/* Search */}
            <Paper
                variant='outlined'
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 3,
                }}
            >
                <Stack
                    direction={{
                        xs: 'column',
                        md: 'row',
                    }}
                    spacing={1.5}
                >
                    <TextField
                        fullWidth
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder='ابحث عن وظيفة، شركة، مجال أو موقع...'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchRoundedIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        variant='contained'
                        onClick={handleSearch}
                        sx={{
                            minWidth: {
                                xs: '100%',
                                md: 130,
                            },
                            background: BRAND_GRADIENT,
                            fontWeight: 700,
                            '&:hover': {
                                opacity: 0.9,
                                background: BRAND_GRADIENT,
                            },
                        }}
                    >
                        بحث
                    </Button>
                </Stack>
            </Paper>

            {/* Filter toolbar */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 2,
                }}
            >
                <Button
                    variant='outlined'
                    startIcon={<FilterListRoundedIcon />}
                    onClick={() => setFiltersOpen((prev) => !prev)}
                    sx={{
                        borderRadius: 999,
                        fontWeight: 700,
                        borderColor:
                            filtersOpen || activeFiltersCount
                                ? BRAND_GOLD
                                : 'divider',
                    }}
                >
                    الفلاتر
                    {activeFiltersCount > 0 && (
                        <Chip
                            size='small'
                            label={activeFiltersCount}
                            sx={{
                                ml: 1,
                                height: 22,
                                fontWeight: 700,
                            }}
                        />
                    )}
                </Button>

                {(activeFiltersCount > 0 || filters.search) && (
                    <Button
                        startIcon={<RestartAltRoundedIcon />}
                        onClick={handleReset}
                        sx={{
                            color: 'text.secondary',
                        }}
                    >
                        إعادة ضبط
                    </Button>
                )}
            </Box>

            {/* Filters */}
            <Collapse in={filtersOpen} unmountOnExit>
                <Paper
                    variant='outlined'
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            },
                            gap: 2,
                        }}
                    >
                        <Select
                            fullWidth
                            displayEmpty
                            value={filters.type ?? ''}
                            onChange={(event) =>
                                handleFilterChange('type', event.target.value)
                            }
                        >
                            <MenuItem value=''>كل أنواع الوظائف</MenuItem>

                            <MenuItem value='full_time'>دوام كامل</MenuItem>

                            <MenuItem value='part_time'>دوام جزئي</MenuItem>

                            <MenuItem value='temporary'>مؤقت</MenuItem>

                            <MenuItem value='remote'>عن بُعد</MenuItem>

                            <MenuItem value='daily'>يومي</MenuItem>

                            <MenuItem value='internship'>تدريب</MenuItem>
                        </Select>

                        <Select
                            fullWidth
                            displayEmpty
                            value={filters.experienceLevel ?? ''}
                            onChange={(event) =>
                                handleFilterChange(
                                    'experienceLevel',
                                    event.target.value,
                                )
                            }
                        >
                            <MenuItem value=''>كل مستويات الخبرة</MenuItem>

                            <MenuItem value='no_experience'>بدون خبرة</MenuItem>

                            <MenuItem value='entry'>مبتدئ</MenuItem>

                            <MenuItem value='mid'>متوسط</MenuItem>

                            <MenuItem value='senior'>متقدم</MenuItem>

                            <MenuItem value='manager'>إدارة</MenuItem>
                        </Select>

                        <Select
                            fullWidth
                            displayEmpty
                            value={filters.salaryPeriod ?? ''}
                            onChange={(event) =>
                                handleFilterChange(
                                    'salaryPeriod',
                                    event.target.value,
                                )
                            }
                        >
                            <MenuItem value=''>كل فترات الراتب</MenuItem>

                            <MenuItem value='hourly'>بالساعة</MenuItem>

                            <MenuItem value='daily'>يومي</MenuItem>

                            <MenuItem value='monthly'>شهري</MenuItem>

                            <MenuItem value='yearly'>سنوي</MenuItem>
                        </Select>

                        <Select
                            fullWidth
                            displayEmpty
                            value={
                                filters.remote === undefined
                                    ? ''
                                    : String(filters.remote)
                            }
                            onChange={(event) => {
                                const value = event.target.value;

                                handleFilterChange(
                                    'remote',
                                    value === '' ? undefined : value === 'true',
                                );
                            }}
                        >
                            <MenuItem value=''>العمل عن بُعد</MenuItem>

                            <MenuItem value='true'>عن بُعد فقط</MenuItem>

                            <MenuItem value='false'>حضوري فقط</MenuItem>
                        </Select>

                        <TextField
                            label='الموقع'
                            value={filters.location ?? ''}
                            onChange={(event) =>
                                handleFilterChange(
                                    'location',
                                    event.target.value,
                                )
                            }
                        />

                        <TextField
                            label='المجال'
                            value={filters.industry ?? ''}
                            onChange={(event) =>
                                handleFilterChange(
                                    'industry',
                                    event.target.value,
                                )
                            }
                        />
                    </Box>
                </Paper>
            </Collapse>

            {/* Error */}
            {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Loading */}
            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        py: 10,
                    }}
                >
                    <CircularProgress
                        sx={{
                            color: BRAND_GOLD,
                        }}
                    />
                </Box>
            ) : jobs.length === 0 ? (
                <Paper
                    variant='outlined'
                    sx={{
                        py: 10,
                        textAlign: 'center',
                        borderRadius: 3,
                    }}
                >
                    <WorkOutlineRoundedIcon
                        sx={{
                            fontSize: 52,
                            color: 'text.disabled',
                            mb: 1,
                        }}
                    />

                    <Typography variant='h6' fontWeight={700}>
                        لا توجد وظائف
                    </Typography>

                    <Typography color='text.secondary'>
                        لم يتم العثور على وظائف مطابقة للبحث.
                    </Typography>
                </Paper>
            ) : (
                <>
                    {/* Jobs */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: 'repeat(2, 1fr)',
                                xl: 'repeat(3, 1fr)',
                            },
                            gap: 2,
                        }}
                    >
                        {jobs.map((job) => (
                            <Paper
                                key={job._id}
                                variant='outlined'
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    transition:
                                        'transform .2s ease, box-shadow .2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3,
                                    },
                                }}
                            >
                                {/* Job header */}
                                <Stack
                                    direction='row'
                                    justifyContent='space-between'
                                    alignItems='flex-start'
                                    spacing={2}
                                >
                                    <Box
                                        sx={{
                                            minWidth: 0,
                                        }}
                                    >
                                        <Typography
                                            variant='h6'
                                            fontWeight={800}
                                            noWrap
                                        >
                                            {job.jobTitle}
                                        </Typography>

                                        {job.companyName && (
                                            <Stack
                                                direction='row'
                                                alignItems='center'
                                                spacing={0.5}
                                                sx={{
                                                    mt: 0.5,
                                                }}
                                            >
                                                <BusinessOutlinedIcon
                                                    sx={{
                                                        fontSize: 18,
                                                    }}
                                                />

                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                    noWrap
                                                >
                                                    {job.companyName}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Box>

                                    <Chip
                                        size='small'
                                        label={getJobTypeLabel(job.type)}
                                    />
                                </Stack>

                                {/* Location */}
                                <Stack
                                    spacing={1}
                                    sx={{
                                        mt: 2,
                                    }}
                                >
                                    <Stack
                                        direction='row'
                                        alignItems='center'
                                        spacing={1}
                                    >
                                        <LocationOnOutlinedIcon
                                            sx={{
                                                fontSize: 19,
                                                color: 'text.secondary',
                                            }}
                                        />

                                        <Typography variant='body2'>
                                            {job.location || 'الموقع غير محدد'}
                                        </Typography>
                                    </Stack>

                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                    >
                                        الخبرة:{' '}
                                        {getExperienceLabel(
                                            job.experienceLevel,
                                        )}
                                    </Typography>

                                    <Typography
                                        variant='body2'
                                        fontWeight={700}
                                    >
                                        الراتب: {formatSalary(job)}
                                        {job.salaryPeriod
                                            ? ` / ${job.salaryPeriod}`
                                            : ''}
                                    </Typography>
                                </Stack>

                                {/* Seller */}
                                <Stack
                                    direction='row'
                                    alignItems='center'
                                    spacing={1}
                                    sx={{
                                        mt: 2,
                                        pt: 2,
                                        borderTop: 1,
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Avatar
                                        src={job.seller?.image.url}
                                        alt={job.seller?.image.alt || 'صورة المستخدم'}
                                        sx={{
                                            width: 36,
                                            height: 36,
                                        }}
                                    >
                                        <PersonOutlineRoundedIcon />
                                    </Avatar>

                                    <Box
                                        sx={{
                                            minWidth: 0,
                                            flex: 1,
                                        }}
                                    >
                                        <Typography
                                            variant='body2'
                                            fontWeight={700}
                                            noWrap
                                        >
                                            {getSellerName(job)}
                                        </Typography>

                                        <Typography
                                            variant='caption'
                                            color='text.secondary'
                                        >
                                            {formatDate(job.createdAt)}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* Actions */}
                                <Stack
                                    direction='row'
                                    spacing={1}
                                    sx={{
                                        mt: 2,
                                    }}
                                >
                                    <Button
                                        fullWidth
                                        variant='outlined'
                                        startIcon={<VisibilityRoundedIcon />}
                                        onClick={() =>
                                            navigate(
                                                `${path.AdminJobs}/${job._id}`,
                                            )
                                        }
                                    >
                                        عرض
                                    </Button>

                                    <Tooltip title='تعديل'>
                                        <IconButton
                                            onClick={() =>
                                                navigate(
                                                    `${path.AdminJobs}/${job._id}`,
                                                )
                                            }
                                        >
                                            <EditRoundedIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title='حذف'>
                                        <span>
                                            <IconButton
                                                color='error'
                                                disabled={
                                                    deletingId === job._id
                                                }
                                                onClick={() =>
                                                    handleDelete(job)
                                                }
                                            >
                                                {deletingId === job._id ? (
                                                    <CircularProgress
                                                        size={22}
                                                    />
                                                ) : (
                                                    <DeleteOutlineRoundedIcon />
                                                )}
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Stack>
                            </Paper>
                        ))}
                    </Box>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 4,
                            }}
                        >
                            <Pagination
                                count={totalPages}
                                page={filters.page ?? 1}
                                onChange={handlePageChange}
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default AdminJobs;
