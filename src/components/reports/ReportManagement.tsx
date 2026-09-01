import { FunctionComponent, useCallback, useEffect, useState } from 'react';

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';

import {
    DeleteForeverOutlined,
    VisibilityOutlined,
    RefreshOutlined,
    ReportOutlined,
} from '@mui/icons-material';

import { useTranslation } from 'react-i18next';

import useReport from '../../hooks/useReport';

import {
    UserReportStatus,
    UserReportType,
    UserReportUnion,
    ReportAdminAction,
} from '../../interfaces/report.types';

const ReportManagement: FunctionComponent = () => {
    const { t } = useTranslation();

    const {
        loading,
        reports,
        totalReports,
        stats,
        fetchAllReports,
        fetchStats,
        updateReportStatus,
        deleteReport,
    } = useReport();

    // =====================================================
    // Filters
    // =====================================================

    const [status, setStatus] = useState<UserReportStatus | ''>('');

    const [type, setType] = useState<UserReportType | ''>('');

    const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    // =====================================================
    // Dialog
    // =====================================================

    const [selectedReport, setSelectedReport] =
        useState<UserReportUnion | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [actionLoading, setActionLoading] = useState(false);

    // =====================================================
    // Fetch
    // =====================================================

    const loadReports = useCallback(async () => {
        await fetchAllReports({
            status: status || undefined,
            type: type || undefined,
            page: page + 1,
            limit: rowsPerPage,
            sort,
        });
    }, [fetchAllReports, status, type, page, rowsPerPage, sort]);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // =====================================================
    // Filters
    // =====================================================

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as UserReportStatus | '');
        setPage(0);
    };

    const handleTypeChange = (event: SelectChangeEvent) => {
        setType(event.target.value as UserReportType | '');
        setPage(0);
    };

    const handleSortChange = (event: SelectChangeEvent) => {
        setSort(event.target.value as 'newest' | 'oldest');
        setPage(0);
    };

    // =====================================================
    // View
    // =====================================================

    const handleView = (report: UserReportUnion) => {
        setSelectedReport(report);
        setDetailsOpen(true);
    };

    // =====================================================
    // Update
    // =====================================================

    const handleUpdate = async (
        reportId: string,
        newStatus: UserReportStatus,
        action?: ReportAdminAction,
    ) => {
        try {
            setActionLoading(true);

            await updateReportStatus(reportId, {
                status: newStatus,
                action,
            });

            await fetchStats();
        } finally {
            setActionLoading(false);
        }
    };

    // =====================================================
    // Delete
    // =====================================================

    const handleDelete = async (reportId: string) => {
        const confirmed = window.confirm(
            t(
                'reports.management.confirmDelete',
                'Are you sure you want to delete this report?',
            ),
        );

        if (!confirmed) return;

        try {
            setActionLoading(true);

            await deleteReport(reportId);

            setDeleteId(null);

            if (selectedReport?._id === reportId) {
                setSelectedReport(null);
                setDetailsOpen(false);
            }

            await fetchStats();
        } finally {
            setActionLoading(false);
        }
    };

    // =====================================================
    // Helpers
    // =====================================================

    const getStatusLabel = (value: UserReportStatus) => {
        return t(`reports.status.${value}`, value);
    };

    const getTypeLabel = (value: UserReportType) => {
        return t(`reports.types.${value}`, value);
    };

    const getReasonLabel = (value: string) => {
        return t(`reports.reasons.${value}`, value);
    };

    const getStatusColor = (value: UserReportStatus) => {
        switch (value) {
            case 'pending':
                return 'warning';

            case 'reviewing':
                return 'info';

            case 'resolved':
                return 'success';

            case 'rejected':
                return 'error';

            default:
                return 'default';
        }
    };

    const getTargetName = (report: UserReportUnion): string => {
        switch (report.type) {
            case 'user': {
                const first = report.targetUser?.name?.first ?? '';

                const last = report.targetUser?.name?.last ?? '';

                return (
                    `${first} ${last}`.trim() ||
                    t('reports.targetUnavailable', 'User no longer available')
                );
            }

            case 'post':
                return (
                    report.targetPost?.product_name ??
                    t('reports.targetUnavailable', 'Post no longer available')
                );

            case 'message':
                return (
                    report.targetMessage?.message ??
                    t(
                        'reports.targetUnavailable',
                        'Message no longer available',
                    )
                );

            case 'comment':
                return (
                    report.targetComment?.content ??
                    t(
                        'reports.targetUnavailable',
                        'Comment no longer available',
                    )
                );

            default:
                return t(
                    'reports.targetUnavailable',
                    'Target no longer available',
                );
        }
    };

    // =====================================================
    // Render
    // =====================================================

    return (
        <Box sx={{ width: '100%' }}>
            {/* ================================================= */}
            {/* Header */}
            {/* ================================================= */}

            <Stack
                direction={{
                    xs: 'column',
                    sm: 'row',
                }}
                justifyContent='space-between'
                alignItems={{
                    xs: 'flex-start',
                    sm: 'center',
                }}
                spacing={2}
                mb={3}
            >
                <Stack direction='row' spacing={1} alignItems='center'>
                    <ReportOutlined />

                    <Box>
                        <Typography variant='h5' fontWeight={700}>
                            {t(
                                'reports.management.title',
                                'Reports Management',
                            )}
                        </Typography>

                        <Typography variant='body2' color='text.secondary'>
                            {t(
                                'reports.management.subtitle',
                                'Manage and review user reports.',
                            )}
                        </Typography>
                    </Box>
                </Stack>

                <Button
                    variant='outlined'
                    startIcon={<RefreshOutlined />}
                    onClick={() => {
                        loadReports();
                        fetchStats();
                    }}
                    disabled={loading}
                >
                    {t('common.refresh', 'Refresh')}
                </Button>
            </Stack>

            {/* ================================================= */}
            {/* Statistics */}
            {/* ================================================= */}

            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color='text.secondary' variant='body2'>
                                {t('reports.stats.total', 'Total Reports')}
                            </Typography>

                            <Typography variant='h4' fontWeight={700}>
                                {stats?.total ?? totalReports}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color='text.secondary' variant='body2'>
                                {t('reports.stats.pending', 'Pending')}
                            </Typography>

                            <Typography variant='h4' fontWeight={700}>
                                {stats?.pending ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color='text.secondary' variant='body2'>
                                {t('reports.stats.reviewing', 'Reviewing')}
                            </Typography>

                            <Typography variant='h4' fontWeight={700}>
                                {stats?.reviewing ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color='text.secondary' variant='body2'>
                                {t('reports.stats.resolved', 'Resolved')}
                            </Typography>

                            <Typography variant='h4' fontWeight={700}>
                                {stats?.resolved ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ================================================= */}
            {/* Filters */}
            {/* ================================================= */}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid
                            size={{
                                xs: 12,
                                sm: 4,
                            }}
                        >
                            <FormControl fullWidth>
                                <InputLabel>
                                    {t('reports.filters.status', 'Status')}
                                </InputLabel>

                                <Select
                                    value={status}
                                    label={t(
                                        'reports.filters.status',
                                        'Status',
                                    )}
                                    onChange={handleStatusChange}
                                >
                                    <MenuItem value=''>
                                        {t('common.all', 'All')}
                                    </MenuItem>

                                    <MenuItem value='pending'>
                                        {getStatusLabel('pending')}
                                    </MenuItem>

                                    <MenuItem value='reviewing'>
                                        {getStatusLabel('reviewing')}
                                    </MenuItem>

                                    <MenuItem value='resolved'>
                                        {getStatusLabel('resolved')}
                                    </MenuItem>

                                    <MenuItem value='rejected'>
                                        {getStatusLabel('rejected')}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 4,
                            }}
                        >
                            <FormControl fullWidth>
                                <InputLabel>
                                    {t('reports.filters.type', 'Type')}
                                </InputLabel>

                                <Select
                                    value={type}
                                    label={t('reports.filters.type', 'Type')}
                                    onChange={handleTypeChange}
                                >
                                    <MenuItem value=''>
                                        {t('common.all', 'All')}
                                    </MenuItem>

                                    <MenuItem value='user'>
                                        {getTypeLabel('user')}
                                    </MenuItem>

                                    <MenuItem value='post'>
                                        {getTypeLabel('post')}
                                    </MenuItem>

                                    <MenuItem value='message'>
                                        {getTypeLabel('message')}
                                    </MenuItem>

                                    <MenuItem value='comment'>
                                        {getTypeLabel('comment')}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 4,
                            }}
                        >
                            <FormControl fullWidth>
                                <InputLabel>
                                    {t('reports.filters.sort', 'Sort')}
                                </InputLabel>

                                <Select
                                    value={sort}
                                    label={t('reports.filters.sort', 'Sort')}
                                    onChange={handleSortChange}
                                >
                                    <MenuItem value='newest'>
                                        {t('reports.filters.newest', 'Newest')}
                                    </MenuItem>

                                    <MenuItem value='oldest'>
                                        {t('reports.filters.oldest', 'Oldest')}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* ================================================= */}
            {/* Table */}
            {/* ================================================= */}

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {t('reports.table.type', 'Type')}
                                </TableCell>

                                <TableCell>
                                    {t('reports.table.target', 'Target')}
                                </TableCell>

                                <TableCell>
                                    {t('reports.table.reason', 'Reason')}
                                </TableCell>

                                <TableCell>
                                    {t('reports.table.status', 'Status')}
                                </TableCell>

                                <TableCell>
                                    {t('reports.table.date', 'Date')}
                                </TableCell>

                                <TableCell align='right'>
                                    {t('common.actions', 'Actions')}
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading && reports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align='center'>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : reports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align='center'>
                                        <Alert severity='info'>
                                            {t(
                                                'reports.management.noReports',
                                                'No reports found.',
                                            )}
                                        </Alert>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reports.map((report) => (
                                    <TableRow key={report._id} hover>
                                        <TableCell>
                                            <Chip
                                                size='small'
                                                label={getTypeLabel(
                                                    report.type,
                                                )}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant='body2'
                                                sx={{
                                                    maxWidth: 250,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {getTargetName(report)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {getReasonLabel(report.reason)}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                size='small'
                                                color={
                                                    getStatusColor(
                                                        report.status,
                                                    ) as
                                                        | 'warning'
                                                        | 'info'
                                                        | 'success'
                                                        | 'error'
                                                        | 'default'
                                                }
                                                label={getStatusLabel(
                                                    report.status,
                                                )}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {new Date(
                                                report.createdAt,
                                            ).toLocaleString()}
                                        </TableCell>

                                        <TableCell align='right'>
                                            <Stack
                                                direction='row'
                                                spacing={0.5}
                                                justifyContent='flex-end'
                                            >
                                                <IconButton
                                                    size='small'
                                                    onClick={() =>
                                                        handleView(report)
                                                    }
                                                >
                                                    <VisibilityOutlined />
                                                </IconButton>

                                                <IconButton
                                                    size='small'
                                                    color='error'
                                                    onClick={() =>
                                                        setDeleteId(report._id)
                                                    }
                                                >
                                                    <DeleteForeverOutlined />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component='div'
                    count={totalReports}
                    page={page}
                    onPageChange={(_, value) => setPage(value)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(Number(event.target.value));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </Card>

            {/* ================================================= */}
            {/* Details Dialog */}
            {/* ================================================= */}

            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                fullWidth
                maxWidth='md'
            >
                <DialogTitle>
                    {t('reports.management.details', 'Report Details')}
                </DialogTitle>

                <DialogContent>
                    {selectedReport && (
                        <Stack spacing={2} mt={1}>
                            <Stack direction='row' spacing={1}>
                                <Chip
                                    label={getTypeLabel(selectedReport.type)}
                                />

                                <Chip
                                    color={
                                        getStatusColor(
                                            selectedReport.status,
                                        ) as
                                            | 'warning'
                                            | 'info'
                                            | 'success'
                                            | 'error'
                                            | 'default'
                                    }
                                    label={getStatusLabel(
                                        selectedReport.status,
                                    )}
                                />
                            </Stack>

                            <Divider />

                            <Box>
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                >
                                    {t('reports.table.reason', 'Reason')}
                                </Typography>

                                <Typography>
                                    {getReasonLabel(selectedReport.reason)}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                >
                                    {t('reports.table.target', 'Target')}
                                </Typography>

                                <Typography
                                    sx={{
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {getTargetName(selectedReport)}
                                </Typography>
                            </Box>

                            {selectedReport.description && (
                                <Box>
                                    <Typography
                                        variant='caption'
                                        color='text.secondary'
                                    >
                                        {t(
                                            'reports.description',
                                            'Description',
                                        )}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {selectedReport.description}
                                    </Typography>
                                </Box>
                            )}

                            <Box>
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                >
                                    ID
                                </Typography>

                                <Typography variant='body2'>
                                    {selectedReport._id}
                                </Typography>
                            </Box>

                            <Divider />

                            <Typography variant='subtitle2'>
                                {t(
                                    'reports.management.actions',
                                    'Moderation Actions',
                                )}
                            </Typography>

                            <Stack
                                direction={{
                                    xs: 'column',
                                    sm: 'row',
                                }}
                                spacing={1}
                            >
                                <Button
                                    variant='outlined'
                                    disabled={actionLoading}
                                    onClick={() =>
                                        handleUpdate(
                                            selectedReport._id,
                                            'reviewing',
                                        )
                                    }
                                >
                                    {t(
                                        'reports.actions.review',
                                        'Mark Reviewing',
                                    )}
                                </Button>

                                <Button
                                    variant='contained'
                                    color='success'
                                    disabled={actionLoading}
                                    onClick={() =>
                                        handleUpdate(
                                            selectedReport._id,
                                            'resolved',
                                        )
                                    }
                                >
                                    {t('reports.actions.resolve', 'Resolve')}
                                </Button>

                                <Button
                                    variant='outlined'
                                    color='error'
                                    disabled={actionLoading}
                                    onClick={() =>
                                        handleUpdate(
                                            selectedReport._id,
                                            'rejected',
                                            'ignore',
                                        )
                                    }
                                >
                                    {t('reports.actions.reject', 'Reject')}
                                </Button>

                                {selectedReport.type === 'user' && (
                                    <Button
                                        variant='outlined'
                                        color='warning'
                                        disabled={actionLoading}
                                        onClick={() =>
                                            handleUpdate(
                                                selectedReport._id,
                                                'resolved',
                                                'block',
                                            )
                                        }
                                    >
                                        {t(
                                            'reports.actions.block',
                                            'Block User',
                                        )}
                                    </Button>
                                )}

                                {selectedReport.type === 'post' && (
                                    <Button
                                        variant='outlined'
                                        color='error'
                                        disabled={actionLoading}
                                        onClick={() =>
                                            handleUpdate(
                                                selectedReport._id,
                                                'resolved',
                                                'delete_post',
                                            )
                                        }
                                    >
                                        {t(
                                            'reports.actions.deletePost',
                                            'Delete Post',
                                        )}
                                    </Button>
                                )}

                                {selectedReport.type === 'message' && (
                                    <Button
                                        variant='outlined'
                                        color='error'
                                        disabled={actionLoading}
                                        onClick={() =>
                                            handleUpdate(
                                                selectedReport._id,
                                                'resolved',
                                                'delete_message',
                                            )
                                        }
                                    >
                                        {t(
                                            'reports.actions.deleteMessage',
                                            'Delete Message',
                                        )}
                                    </Button>
                                )}

                                {selectedReport.type === 'comment' && (
                                    <Button
                                        variant='outlined'
                                        color='error'
                                        disabled={actionLoading}
                                        onClick={() =>
                                            handleUpdate(
                                                selectedReport._id,
                                                'resolved',
                                                'delete_comment',
                                            )
                                        }
                                    >
                                        {t(
                                            'reports.actions.deleteComment',
                                            'Delete Comment',
                                        )}
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>
                        {t('common.close', 'Close')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ================================================= */}
            {/* Delete Confirmation */}
            {/* ================================================= */}

            <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
                <DialogTitle>
                    {t('reports.management.deleteTitle', 'Delete Report')}
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        {t(
                            'reports.management.deleteMessage',
                            'Are you sure you want to delete this report?',
                        )}
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setDeleteId(null)}
                        disabled={actionLoading}
                    >
                        {t('common.cancel', 'Cancel')}
                    </Button>

                    <Button
                        color='error'
                        variant='contained'
                        disabled={actionLoading}
                        onClick={() => {
                            if (deleteId) {
                                handleDelete(deleteId);
                            }
                        }}
                        startIcon={
                            actionLoading ? (
                                <CircularProgress size={16} color='inherit' />
                            ) : (
                                <DeleteForeverOutlined />
                            )
                        }
                    >
                        {t('common.delete', 'Delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReportManagement;
