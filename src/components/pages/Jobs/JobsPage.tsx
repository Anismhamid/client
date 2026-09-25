import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    Box,
    Container,
    Pagination,
    Typography,
    CircularProgress,
    Tabs,
    Tab,
    useTheme,
} from '@mui/material';

import { useTranslation } from 'react-i18next';

import JobsFilters from '../../../components/jobs/JobsFilters';
import JobsGrid from '../../../components/jobs/JobsGrid';

import {
    Job,
    JobsFilters as JobsFiltersType,
} from '../../../interfaces/jobs.types';

import { searchJobs } from '../../../services/jobsService';
import CreateJob from './CreateJob';

const DEFAULT_FILTERS: JobsFiltersType = {
    page: 1,
    limit: 20,
};

const JobsPage: FunctionComponent = () => {
    const { t } = useTranslation();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [filters, setFilters] = useState<JobsFiltersType>(DEFAULT_FILTERS);

    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState<'jobs' | 'filter' | 'create'>(
        'jobs',
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

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    useEffect(() => {
        if (activeTab === 'jobs') {
            loadJobs(filters);
        }
    }, [filters, loadJobs, activeTab]);

    const handleSearch = (nextFilters: JobsFiltersType) => {
        setFilters(nextFilters);
    };

    const handleReset = () => {
        setFilters({ ...DEFAULT_FILTERS });
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    const handleTabChange = (
        _: React.SyntheticEvent,
        newValue: 'jobs' | 'create'|'filter',
    ) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth='xl' sx={{ py: 4 }}>
            <Typography
                variant='h4'
                fontWeight={700}
                sx={{ mb: 3, color: '#12161C' }}
            >
                {t('pages.jobs.title')}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    TabIndicatorProps={{ style: { display: 'none' } }}
                    sx={{
                        minHeight: 44,
                        bgcolor: isDark
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.04)',
                        borderRadius: 999,
                        p: 0.5,
                        '& .MuiTab-root': {
                            minHeight: 36,
                            borderRadius: 999,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            transition: 'color 0.2s ease',
                        },
                        '& .Mui-selected': { color: '#fff !important' },
                    }}
                >
                    <Tab
                        value='jobs'
                        label={t('pages.jobs.tabs.jobs', 'Jobs')}
                        sx={
                            activeTab === 'jobs'
                                ? {
                                      background:
                                          'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                                  }
                                : undefined
                        }
                    />
                    {activeTab === 'filter' && (
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                mb: 3,
                                border: '1px solid',
                                borderColor: isDark
                                    ? 'rgba(255,255,255,0.08)'
                                    : 'rgba(0,0,0,0.06)',
                            }}
                        >
                            <JobsFilters
                                filters={filters}
                                onSearch={handleSearch}
                                onReset={handleReset}
                            />
                        </Box>
                    )}
                    <Tab
                        value='create'
                        label={t('pages.jobs.tabs.create', 'Share a job')}
                        sx={
                            activeTab === 'create'
                                ? {
                                      background:
                                          'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                                  }
                                : undefined
                        }
                    />
                </Tabs>
            </Box>

            {activeTab === 'create' ? (
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        mb: 3,
                        border: '1px solid',
                        borderColor: isDark
                            ? 'rgba(255,255,255,0.08)'
                            : 'rgba(0,0,0,0.06)',
                    }}
                >
                    <CreateJob />
                </Box>
            ) : (
                <>
                    <JobsFilters
                        filters={filters}
                        onSearch={handleSearch}
                        onReset={handleReset}
                    />

                    {loading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                py: 8,
                            }}
                        >
                            <CircularProgress />
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
                                                    background:
                                                        'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
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
