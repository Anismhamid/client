import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    Container,
    Pagination,
    Paper,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import FilterListRounded from '@mui/icons-material/FilterListRounded';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';

import { useTranslation } from 'react-i18next';

import JobsFilters from '../../../components/jobs/JobsFilters';

import {
    Job,
    JobsFilters as JobsFiltersType,
} from '../../../interfaces/jobs.types';

import { searchJobs } from '../../../services/jobsService';
import CreateJob from './CreateJob';
import { BRAND_GOLD, BRAND_GRADIENT } from './jobsBrand';
import JobsGrid from '../../jobs/JobsGrid';

type JobsTab = 'jobs' | 'create';

const DEFAULT_FILTERS: JobsFiltersType = {
    page: 1,
    limit: 20,
};

const NON_FILTER_KEYS = ['page', 'limit'];

const JobsPage: FunctionComponent = () => {
    const { t } = useTranslation();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [filters, setFilters] = useState<JobsFiltersType>(DEFAULT_FILTERS);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState<JobsTab>('jobs');
    const [filtersOpen, setFiltersOpen] = useState(false);

    const activeFiltersCount = useMemo(
        () =>
            Object.entries(filters as unknown as Record<string, unknown>).filter(
                ([key, value]) =>
                    !NON_FILTER_KEYS.includes(key) &&
                    value !== undefined &&
                    value !== null &&
                    value !== '' &&
                    value !== false,
            ).length,
        [filters],
    );

    const loadJobs = useCallback(async (currentFilters: JobsFiltersType) => {
        try {
            setLoading(true);

            const response = await searchJobs(currentFilters);

            setJobs(response.jobs);
            setTotalPages(response.pagination?.pages ?? 1);
        } catch (error) {
            console.error('Failed to load jobs:', error);

            setJobs([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'jobs') {
            loadJobs(filters);
        }
    }, [filters, loadJobs, activeTab]);

    const handleSearch = (nextFilters: JobsFiltersType) => {
        setFilters({ ...nextFilters, page: 1 });
        setFiltersOpen(false);
    };

    const handleReset = () => {
        setFilters({ ...DEFAULT_FILTERS });
        setFiltersOpen(false);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setFilters((prev) => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Container maxWidth='xl' sx={{ py: { xs: 3, md: 4 } }}>
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
                    <Typography
                        variant='h4'
                        component='h1'
                        fontWeight={800}
                        sx={{ lineHeight: 1.25 }}
                    >
                        {t('pages.jobs.title')}
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

                <Tabs
                    value={activeTab}
                    onChange={(_, value: JobsTab) => setActiveTab(value)}
                    TabIndicatorProps={{ style: { display: 'none' } }}
                    sx={{
                        minHeight: 44,
                        p: 0.5,
                        borderRadius: 999,
                        bgcolor: 'action.hover',
                        '& .MuiTab-root': {
                            minHeight: 36,
                            px: 3,
                            borderRadius: 999,
                            textTransform: 'none',
                            fontWeight: 600,
                            color: 'text.secondary',
                            transition: 'color 0.2s ease, background 0.2s ease',
                        },
                        '& .MuiTab-root.Mui-selected': {
                            color: '#fff',
                            background: BRAND_GRADIENT,
                        },
                    }}
                >
                    <Tab
                        value='jobs'
                        label={t('pages.jobs.tabs.jobs', 'Jobs')}
                    />
                    <Tab
                        value='create'
                        label={t('pages.jobs.tabs.create', 'Share a job')}
                    />
                </Tabs>
            </Box>

            {activeTab === 'create' ? (
                <Paper
                    variant='outlined'
                    sx={{
                        p: { xs: 2, md: 4 },
                        borderRadius: 3,
                        maxWidth: 840,
                        mx: 'auto',
                    }}
                >
                    <CreateJob embedded />
                </Paper>
            ) : (
                <>
                    {/* Filters toolbar */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        <Button
                            variant='outlined'
                            onClick={() => setFiltersOpen((prev) => !prev)}
                            aria-expanded={filtersOpen}
                            startIcon={<FilterListRounded />}
                            sx={{
                                gap: 0.5,
                                borderRadius: 999,
                                px: 2.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                color: 'text.primary',
                                borderColor:
                                    filtersOpen || activeFiltersCount > 0
                                        ? BRAND_GOLD
                                        : 'divider',
                                '&:hover': {
                                    borderColor: BRAND_GOLD,
                                    bgcolor: 'transparent',
                                },
                            }}
                        >
                            {t('pages.jobs.filters.title', 'Filters')}

                            {activeFiltersCount > 0 && (
                                <Box
                                    component='span'
                                    sx={{
                                        minWidth: 20,
                                        height: 20,
                                        px: 0.5,
                                        display: 'inline-grid',
                                        placeItems: 'center',
                                        borderRadius: 999,
                                        fontSize: 12,
                                        color: '#fff',
                                        background: BRAND_GRADIENT,
                                    }}
                                >
                                    {activeFiltersCount}
                                </Box>
                            )}
                        </Button>

                        {activeFiltersCount > 0 && (
                            <Button
                                onClick={handleReset}
                                startIcon={<RestartAltRounded />}
                                sx={{
                                    gap: 0.5,
                                    textTransform: 'none',
                                    color: 'text.secondary',
                                }}
                            >
                                {t('pages.jobs.filters.reset', 'Reset')}
                            </Button>
                        )}
                    </Box>

                    <Collapse in={filtersOpen} unmountOnExit>
                        <Paper
                            variant='outlined'
                            sx={{ p: 2, mb: 3, borderRadius: 3 }}
                        >
                            <JobsFilters
                                filters={filters}
                                onSearch={handleSearch}
                                onReset={handleReset}
                            />
                        </Paper>
                    </Collapse>

                    {loading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                py: 8,
                            }}
                        >
                            <CircularProgress sx={{ color: BRAND_GOLD }} />
                        </Box>
                    ) : (
                        <>
                            <JobsGrid jobs={jobs} />

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
                                        sx={{
                                            '& .MuiPaginationItem-root.Mui-selected':
                                                {
                                                    background: BRAND_GRADIENT,
                                                    color: '#fff',
                                                },
                                        }}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </>
            )}
        </Container>
    );
};

export default JobsPage;