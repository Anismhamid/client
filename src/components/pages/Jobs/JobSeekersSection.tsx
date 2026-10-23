import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    Collapse,
    Pagination,
    Paper,
} from '@mui/material';
import FilterListRounded from '@mui/icons-material/FilterListRounded';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';
import Swal from 'sweetalert2';

import JobSeekersFilters from '../../jobs/JobSeekersFilters';
import JobSeekersGrid from '../../jobs/JobSeekersGrid';
import { TicketsSkeleton } from '../../jobs/ticketParts';
import CategoryRail from './CategoryRail';
import {
    JobSeeker,
    JobSeekersFilters as FiltersType,
} from '../../../interfaces/jobs.types';
import {
    deleteJobSeeker,
    getMyJobSeekers,
    searchJobSeekers,
    toggleJobSeeker,
} from '../../../services/jobSeekersService';
import { BRAND_GOLD, BRAND_GRADIENT } from './jobsBrand';

const DEFAULT_FILTERS: FiltersType = { page: 1, limit: 20 };
const NON_FILTER_KEYS = ['page', 'limit'];

interface Props {
    onCreate: () => void;
}

const JobSeekersSection: FunctionComponent<Props> = ({ onCreate }) => {
    const { t } = useTranslation();

    const [items, setItems] = useState<JobSeeker[]>([]);
    const [filters, setFilters] = useState<FiltersType>(DEFAULT_FILTERS);
    const [mine, setMine] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
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

    const load = useCallback(async (f: FiltersType, onlyMine: boolean) => {
        try {
            setLoading(true);

            if (onlyMine) {
                setItems(await getMyJobSeekers());
                setTotalPages(1);
            } else {
                const res = await searchJobSeekers(f);
                setItems(res.seekers);
                setTotalPages(res.pagination?.pages ?? 1);
            }
        } catch (error) {
            console.error('Failed to load job seekers:', error);
            setItems([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load(filters, mine);
    }, [filters, mine, load]);

    const handleSearch = (next: FiltersType) => {
        setFilters({ ...next, page: 1 });
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

    const handleToggle = async (s: JobSeeker) => {
        try {
            const updated = await toggleJobSeeker(s._id);
            setItems((prev) => prev.map((x) => (x._id === s._id ? { ...x, active: updated.active } : x)));
        } catch (error) {
            console.error('Toggle job seeker error:', error);
            Swal.fire({
                icon: 'error',
                text: t('pages.jobs.errors.update'),
                confirmButtonColor: BRAND_GOLD,
            });
        }
    };

    const handleDelete = async (s: JobSeeker) => {
        const res = await Swal.fire({
            icon: 'warning',
            title: t('pages.jobs.seekers.deleteConfirm', 'حذف البوست؟'),
            showCancelButton: true,
            confirmButtonText: t('pages.jobs.seekers.delete', 'حذف'),
            cancelButtonText: t('common.cancel', 'إلغاء'),
            confirmButtonColor: '#d32f2f',
        });
        if (!res.isConfirmed) return;

        try {
            await deleteJobSeeker(s._id);
            setItems((prev) => prev.filter((x) => x._id !== s._id));
        } catch (error) {
            console.error('Delete job seeker error:', error);
            Swal.fire({
                icon: 'error',
                text: t('pages.jobs.errors.update'),
                confirmButtonColor: BRAND_GOLD,
            });
        }
    };

    return (
        <>
            {!mine && (
                <CategoryRail
                    value={filters.category}
                    onChange={(category) => setFilters((p) => ({ ...p, category, page: 1 }))}
                />
            )}

            {/* Toolbar */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
                {!mine && (
                    <Button
                        variant='outlined'
                        onClick={() => setFiltersOpen((p) => !p)}
                        aria-expanded={filtersOpen}
                        startIcon={<FilterListRounded />}
                        sx={{
                            gap: 0.5,
                            borderRadius: 999,
                            px: 2.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            color: 'text.primary',
                            borderColor: filtersOpen || activeFiltersCount > 0 ? BRAND_GOLD : 'divider',
                            '&:hover': { borderColor: BRAND_GOLD, bgcolor: 'transparent' },
                        }}
                    >
                        {t('pages.jobs.filters.title', 'فلاتر')}
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
                )}

                {!mine && activeFiltersCount > 0 && (
                    <Button
                        onClick={handleReset}
                        startIcon={<RestartAltRounded />}
                        sx={{ gap: 0.5, textTransform: 'none', color: 'text.secondary' }}
                    >
                        {t('pages.jobs.filters.reset', 'إعادة ضبط')}
                    </Button>
                )}

                <Box sx={{ flexGrow: 1 }} />

                <Button
                    variant={mine ? 'contained' : 'outlined'}
                    disableElevation
                    onClick={() => setMine((p) => !p)}
                    sx={{
                        borderRadius: 999,
                        px: 2.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        ...(mine
                            ? { color: '#fff', background: BRAND_GRADIENT }
                            : { color: 'text.primary', borderColor: 'divider' }),
                    }}
                >
                    {t('pages.jobs.seekers.mine', 'بوستاتي')}
                </Button>

            </Box>

            <Collapse in={filtersOpen && !mine} unmountOnExit>
                <Paper variant='outlined' sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                    <JobSeekersFilters filters={filters} onSearch={handleSearch} onReset={handleReset} />
                </Paper>
            </Collapse>

            {loading ? (
                <TicketsSkeleton />
            ) : (
                <>
                    <JobSeekersGrid
                        seekers={items}
                        onCreate={onCreate}
                        onToggle={mine ? handleToggle : undefined}
                        onDelete={mine ? handleDelete : undefined}
                    />

                    {!mine && totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={filters.page ?? 1}
                                onChange={handlePageChange}
                                sx={{
                                    '& .MuiPaginationItem-root.Mui-selected': {
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
    );
};

export default JobSeekersSection;