import { FunctionComponent, useCallback, useEffect, useState } from 'react';

import {
    Box,
    Container,
    Pagination,
    Typography,
    CircularProgress,
} from '@mui/material';

import { useTranslation } from 'react-i18next';

import JobsFilters from '../../../components/jobs/JobsFilters';
import JobsGrid from '../../../components/jobs/JobsGrid';

import {
    Job,
    JobsFilters as JobsFiltersType,
} from '../../../interfaces/jobs.types';

import { searchJobs } from '../../../services/jobsService';

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

    // =====================================================
    // Load jobs whenever filters change
    // =====================================================

    useEffect(() => {
        loadJobs(filters);
    }, [filters, loadJobs]);

    // =====================================================
    // Search
    // =====================================================

    const handleSearch = (nextFilters: JobsFiltersType) => {
        setFilters(nextFilters);
    };

    // =====================================================
    // Reset
    // =====================================================

    const handleReset = () => {
        setFilters({
            ...DEFAULT_FILTERS,
        });
    };

    // =====================================================
    // Pagination
    // =====================================================

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setFilters((prev) => ({
            ...prev,
            page,
        }));
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
                                    '& .MuiPaginationItem-root.Mui-selected': {
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
        </Container>
    );
};

export default JobsPage;