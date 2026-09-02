// MessageAuditLogs.tsx
import { FunctionComponent, useMemo, useState, useCallback } from 'react';

import {
    Box,
    Card,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    Alert,
    Button,
    Avatar,
} from '@mui/material';

import {
    Visibility as VisibilityIcon,
    Search as SearchIcon,
    Chat as ChatIcon,
    Message as MessageIcon,
    Close as CloseIcon,
    Download as DownloadIcon,
    Refresh as RefreshIcon,
    Person as PersonIcon,
} from '@mui/icons-material';

import { formatDate } from '../../../../../helpers/dateAndPriceFormat';
import { useTranslation } from 'react-i18next';

import {
    AuditLog,
    InvestigationUser,
} from '../../../../../interfaces/InvestigationMessage';
import useMessageAuditLogs from '../../hooks/useMessageAuditLogs';
import { TablePagination } from '@mui/material';
import handleRTL from '../../../../../locales/handleRTL';

// ============================================
// المكون الرئيسي
// ============================================

const MessageAuditLogs: FunctionComponent = () => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState<
        'ALL' | 'VIEW_MESSAGE' | 'VIEW_CONVERSATION'
    >('ALL');
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // ✅ استخدام الـ Hook مع الأسماء الصحيحة
    const { logs, loading, error, fetchAuditLogs } = useMessageAuditLogs();

    // ✅ دالة إعادة المحاولة
    const handleRetry = useCallback(() => {
        fetchAuditLogs(rowsPerPage, page * rowsPerPage);
    }, [fetchAuditLogs, rowsPerPage, page]);

    // ============================================
    // الفلترة والترقيم
    // ============================================

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            const searchable = [
                log._id,
                log.reason,
                getUserName(log.admin),
                getUserName(log.user1),
                getUserName(log.user2),
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            const matchesSearch = searchable.includes(search.toLowerCase());
            const matchesAction =
                actionFilter === 'ALL' || log.action === actionFilter;

            return matchesSearch && matchesAction;
        });
    }, [logs, search, actionFilter]);

    const paginatedLogs = useMemo(() => {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredLogs.slice(start, end);
    }, [filteredLogs, page, rowsPerPage]);

    // ============================================
    // الأمان: إخفاء المعلومات الحساسة
    // ============================================

    const redactIP = (ip?: string | null) => {
        if (!ip) return '-';

        // إخفاء IPv4
        const ipv4Match = ip.match(
            /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
        );
        if (ipv4Match) {
            return `***.***.***.${ipv4Match[4]}`;
        }

        // إخفاء IPv6
        if (ip.includes(':')) {
            const parts = ip.split(':');
            if (parts.length >= 4) {
                return `****:****:****:${parts.slice(-2).join(':')}`;
            }
        }

        return '***.***.***.***';
    };

    const redactUserAgent = (ua?: string | null) => {
        if (!ua) return '-';
        if (ua.length > 30) {
            return ua.substring(0, 27) + '...';
        }
        return ua;
    };

    // ============================================
    // تصدير البيانات
    // ============================================

    const exportToCSV = () => {
        const headers = [
            t('pages.messageAuditLogs.action', 'العملية'),
            t('pages.messageAuditLogs.admin', 'الأدمن'),
            t('pages.messageAuditLogs.userOne', 'المستخدم الأول'),
            t('pages.messageAuditLogs.userTwo', 'المستخدم الثاني'),
            t('pages.messageAuditLogs.reason', 'السبب'),
            t('pages.messageAuditLogs.date', 'التاريخ'),
        ];

        const rows = filteredLogs.map((log) => [
            log.action === 'VIEW_CONVERSATION'
                ? t('pages.messageAuditLogs.viewConversation', 'فتح محادثة')
                : t('pages.messageAuditLogs.viewMessage', 'فتح رسالة'),
            getUserName(log.admin),
            getUserName(log.user1),
            getUserName(log.user2),
            log.reason,
            formatDate(log.createdAt),
        ]);

        const csvContent = [headers, ...rows]
            .map((row) => row.join(','))
            .join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    // ============================================
    // حالات التحميل والخطأ
    // ============================================

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={48} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert
                severity='error'
                action={
                    <Button
                        color='inherit'
                        size='small'
                        onClick={handleRetry} // ✅ استخدام handleRetry
                        startIcon={<RefreshIcon />}
                    >
                        {t('common.retry', 'إعادة المحاولة')}
                    </Button>
                }
                sx={{ borderRadius: 2 }}
            >
                {error ||
                    t(
                        'pages.messageAuditLogs.error',
                        'حدث خطأ في تحميل السجلات',
                    )}
            </Alert>
        );
    }

    // ============================================
    // التصيير الرئيسي
    // ============================================
    const dir = handleRTL();

    return (
        <Box dir={dir}>
            {/* ================= HEADER ================= */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent='space-between'
                alignItems={{ xs: 'stretch', md: 'center' }}
                gap={2}
                mb={3}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pt: 10,
                }}
            >
                <Box>
                    <Typography variant='h5' fontWeight={700}>
                        {t(
                            'pages.messageAuditLogs.title',
                            'سجل مراقبة الرسائل',
                        )}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        {t(
                            'pages.messageAuditLogs.subtitle',
                            'متابعة عمليات وصول الإدارة إلى الرسائل والمحادثات',
                        )}
                    </Typography>
                </Box>

                <Stack direction='row' spacing={1.5} alignItems='center'>
                    <Chip
                        label={`${filteredLogs.length} ${t('pages.messageAuditLogs.records')}`}
                        variant='outlined'
                    />

                    {/* ✅ زر تحديث البيانات */}
                    <Tooltip title={t('common.refresh', 'تحديث')}>
                        <IconButton
                            onClick={handleRetry}
                            size='small'
                            color='primary'
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title={t(
                            'pages.messageAuditLogs.export',
                            'تصدير البيانات',
                        )}
                    >
                        <IconButton
                            onClick={exportToCSV}
                            size='small'
                            color='primary'
                        >
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            {/* ================= FILTERS ================= */}
            <Card variant='outlined' sx={{ p: 2, mb: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                    <TextField
                        fullWidth
                        size='small'
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={t(
                            'pages.messageAuditLogs.searchPlaceholder',
                            'ابحث بالسبب، المستخدم...',
                        )}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: search && (
                                <InputAdornment position='end'>
                                    <IconButton
                                        size='small'
                                        onClick={() => setSearch('')}
                                    >
                                        <CloseIcon fontSize='small' />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControl size='small' sx={{ minWidth: 220 }}>
                        <InputLabel>
                            {t(
                                'pages.messageAuditLogs.actionType',
                                'نوع العملية',
                            )}
                        </InputLabel>
                        <Select
                            label={t(
                                'pages.messageAuditLogs.actionType',
                                'نوع العملية',
                            )}
                            value={actionFilter}
                            onChange={(event) =>
                                setActionFilter(
                                    event.target.value as
                                        | 'ALL'
                                        | 'VIEW_MESSAGE'
                                        | 'VIEW_CONVERSATION',
                                )
                            }
                        >
                            <MenuItem value='ALL'>
                                {t(
                                    'pages.messageAuditLogs.allActions',
                                    'جميع العمليات',
                                )}
                            </MenuItem>
                            <MenuItem value='VIEW_CONVERSATION'>
                                {t(
                                    'pages.messageAuditLogs.viewConversation',
                                    'فتح محادثة',
                                )}
                            </MenuItem>
                            <MenuItem value='VIEW_MESSAGE'>
                                {t(
                                    'pages.messageAuditLogs.viewMessage',
                                    'فتح رسالة',
                                )}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Card>

            {/* ================= TABLE ================= */}
            <TableContainer component={Card} variant='outlined'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {t('pages.messageAuditLogs.action', 'العملية')}
                            </TableCell>
                            <TableCell>
                                {t('pages.messageAuditLogs.admin', 'الأدمن')}
                            </TableCell>
                            <TableCell>
                                {t(
                                    'pages.messageAuditLogs.users',
                                    'المستخدمون',
                                )}
                            </TableCell>
                            <TableCell>
                                {t('pages.messageAuditLogs.reason', 'السبب')}
                            </TableCell>
                            <TableCell>
                                {t('pages.messageAuditLogs.date', 'التاريخ')}
                            </TableCell>
                            <TableCell align='center'>
                                {t(
                                    'pages.messageAuditLogs.details',
                                    'التفاصيل',
                                )}
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedLogs.map((log) => (
                            <TableRow key={log._id} hover>
                                <TableCell>
                                    <ActionChip action={log.action} t={t} />
                                </TableCell>

                                <TableCell>
                                    <UserCell user={log.admin} />
                                </TableCell>

                                <TableCell>
                                    <Stack spacing={0.5}>
                                        <UserCell user={log.user1} />
                                        <UserCell user={log.user2} />
                                    </Stack>
                                </TableCell>

                                <TableCell sx={{ maxWidth: 300 }}>
                                    <Tooltip title={log.reason}>
                                        <Typography variant='body2' noWrap>
                                            {log.reason}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>

                                <TableCell>
                                    <Typography variant='body2'>
                                        {formatDate(log.createdAt)}
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        color='text.secondary'
                                    >
                                        {new Date(
                                            log.createdAt,
                                        ).toLocaleTimeString('ar-EG', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </Typography>
                                </TableCell>

                                <TableCell align='center'>
                                    <Tooltip
                                        title={t(
                                            'pages.messageAuditLogs.viewDetails',
                                            'عرض التفاصيل',
                                        )}
                                    >
                                        <IconButton
                                            size='small'
                                            onClick={() => setSelectedLog(log)}
                                            aria-label={t(
                                                'pages.messageAuditLogs.viewDetails',
                                                'عرض التفاصيل',
                                            )}
                                        >
                                            <VisibilityIcon aria-hidden='true' />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}

                        {!filteredLogs.length && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    align='center'
                                    sx={{ py: 6 }}
                                >
                                    <Typography color='text.secondary'>
                                        {t(
                                            'pages.messageAuditLogs.noRecords',
                                            'لا توجد سجلات مطابقة',
                                        )}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={filteredLogs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage) => {
                        setPage(newPage);
                        // ✅ جلب البيانات عند تغيير الصفحة
                        fetchAuditLogs(rowsPerPage, newPage * rowsPerPage);
                    }}
                    onRowsPerPageChange={(e) => {
                        const newRowsPerPage = parseInt(e.target.value, 10);
                        setRowsPerPage(newRowsPerPage);
                        setPage(0);
                        // ✅ جلب البيانات عند تغيير عدد الصفوف
                        fetchAuditLogs(newRowsPerPage, 0);
                    }}
                />
            </TableContainer>

            {/* ================= DETAILS DIALOG ================= */}
            <Dialog
                open={Boolean(selectedLog)}
                onClose={() => setSelectedLog(null)}
                fullWidth
                maxWidth='sm'
            >
                <DialogTitle>
                    <Stack
                        direction='row'
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <Typography variant='h6' fontWeight={700}>
                            {t(
                                'pages.messageAuditLogs.detailsTitle',
                                'تفاصيل سجل الوصول',
                            )}
                        </Typography>

                        <IconButton
                            onClick={() => setSelectedLog(null)}
                            aria-label={t('common.close', 'إغلاق')}
                        >
                            <CloseIcon aria-hidden='true' />
                        </IconButton>
                    </Stack>
                </DialogTitle>

                <DialogContent dividers>
                    {selectedLog && (
                        <Stack spacing={2}>
                            {/* ====== القسم 1: معلومات العملية ====== */}
                            <Box>
                                <Typography
                                    variant='subtitle2'
                                    color='primary'
                                    gutterBottom
                                >
                                    📋{' '}
                                    {t(
                                        'pages.messageAuditLogs.processInfo',
                                        'معلومات العملية',
                                    )}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <DetailRow
                                    label={t(
                                        'pages.messageAuditLogs.actionType',
                                        'نوع العملية',
                                    )}
                                    value={
                                        selectedLog.action ===
                                        'VIEW_CONVERSATION'
                                            ? t(
                                                  'pages.messageAuditLogs.viewConversation',
                                                  'فتح محادثة',
                                              )
                                            : t(
                                                  'pages.messageAuditLogs.viewMessage',
                                                  'فتح رسالة',
                                              )
                                    }
                                />
                                <DetailRow
                                    label={t(
                                        'pages.messageAuditLogs.reason',
                                        'السبب',
                                    )}
                                    value={selectedLog.reason}
                                />
                            </Box>

                            {/* ====== القسم 2: المستخدمون ====== */}
                            <Box>
                                <Typography
                                    variant='subtitle2'
                                    color='primary'
                                    gutterBottom
                                >
                                    👤{' '}
                                    {t(
                                        'pages.messageAuditLogs.usersInfo',
                                        'معلومات المستخدمين',
                                    )}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <DetailRow
                                    label={t(
                                        'pages.messageAuditLogs.admin',
                                        'الأدمن',
                                    )}
                                    value={getUserName(selectedLog.admin)}
                                />
                                <DetailRow
                                    label={t(
                                        'pages.messageAuditLogs.userOne',
                                        'المستخدم الأول',
                                    )}
                                    value={getUserName(selectedLog.user1)}
                                />
                                <DetailRow
                                    label={t(
                                        'pages.messageAuditLogs.userTwo',
                                        'المستخدم الثاني',
                                    )}
                                    value={getUserName(selectedLog.user2)}
                                />
                            </Box>

                            {/* ====== القسم 3: معلومات تقنية ====== */}
                            <Box>
                                <Typography
                                    variant='subtitle2'
                                    color='primary'
                                    gutterBottom
                                >
                                    🛡️{' '}
                                    {t(
                                        'pages.messageAuditLogs.technicalInfo',
                                        'معلومات تقنية',
                                    )}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <DetailRow
                                    label={t(
                                        'pages.messageAuditLogs.ipAddress',
                                        'IP Address',
                                    )}
                                    value={redactIP(selectedLog.ip)}
                                    mono
                                />
                                <DetailRow
                                    label={t(
                                        'pages.messageAuditLogs.userAgent',
                                        'User Agent',
                                    )}
                                    value={redactUserAgent(
                                        selectedLog.userAgent,
                                    )}
                                />
                                {selectedLog.message && (
                                    <DetailRow
                                        label={t(
                                            'pages.messageAuditLogs.messageId',
                                            'Message ID',
                                        )}
                                        value={selectedLog.message._id}
                                        mono
                                    />
                                )}
                            </Box>

                            {/* ====== القسم 4: معلومات إضافية ====== */}
                            <Box>
                                <Typography
                                    variant='subtitle2'
                                    color='primary'
                                    gutterBottom
                                >
                                    📅{' '}
                                    {t(
                                        'pages.messageAuditLogs.additionalInfo',
                                        'معلومات إضافية',
                                    )}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <DetailRow
                                    label={t(
                                        'pages.messageAuditLogs.date',
                                        'التاريخ',
                                    )}
                                    value={formatDate(selectedLog.createdAt)}
                                />
                                <DetailRow
                                    label={t(
                                        'pages.messageAuditLogs.time',
                                        'الوقت',
                                    )}
                                    value={formatDate(selectedLog.createdAt)}
                                    mono
                                />
                                <DetailRow
                                    label={t(
                                        'pages.messageAuditLogs.auditId',
                                        'Audit Log ID',
                                    )}
                                    value={selectedLog._id}
                                    mono
                                />
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default MessageAuditLogs;

// ============================================
// Action Chip
// ============================================

const ActionChip = ({
    action,
    t,
}: {
    action: AuditLog['action'];
    t: (key: string) => string;
}) => {
    if (action === 'VIEW_CONVERSATION') {
        return (
            <Chip
                size='small'
                icon={<ChatIcon />}
                label={t('pages.messageAuditLogs.viewConversation')}
                color='warning'
                variant='outlined'
            />
        );
    }

    return (
        <Chip
            size='small'
            icon={<MessageIcon />}
            label={t('pages.messageAuditLogs.viewMessage')}
            color='info'
            variant='outlined'
        />
    );
};

// ============================================
// User Cell
// ============================================

const UserCell = ({ user }: { user?: InvestigationUser | null }) => {
    if (!user) {
        return (
            <Typography variant='body2' color='text.secondary'>
                -
            </Typography>
        );
    }

    return (
        <Stack direction='row' spacing={1} alignItems='center'>
            <Avatar
                sx={{
                    width: 28,
                    height: 28,
                    fontSize: 12,
                    fontWeight: 600,
                    bgcolor: user.image?.url ? 'transparent' : 'primary.main',
                }}
                src={user.image?.url}
            >
                {!user.image?.url && <PersonIcon fontSize='small' />}
            </Avatar>
            <Box>
                <Typography variant='body2' fontWeight={600}>
                    {getUserName(user)}
                </Typography>
                {user.email && (
                    <Typography
                        variant='caption'
                        color='text.secondary'
                        display='block'
                    >
                        {user.email}
                    </Typography>
                )}
            </Box>
        </Stack>
    );
};

// ============================================
// Detail Row
// ============================================

const DetailRow = ({
    label,
    value,
    mono = false,
}: {
    label: string;
    value?: string | null;
    mono?: boolean;
}) => {
    return (
        <Box>
            <Typography
                variant='caption'
                color='text.secondary'
                display='block'
                mb={0.5}
            >
                {label}
            </Typography>

            <Typography
                variant='body2'
                fontWeight={500}
                fontFamily={mono ? 'monospace' : undefined}
                sx={{
                    wordBreak: 'break-word',
                }}
            >
                {value || '-'}
            </Typography>
        </Box>
    );
};

// ============================================
// Helpers
// ============================================

function getUserName(user: InvestigationUser | null | undefined): string {
    if (!user) {
        return '';
    }

    if (user.name) {
        const fullName = [user.name.first, user.name.last]
            .filter(Boolean)
            .join(' ');

        if (fullName) {
            return fullName;
        }
    }

    return user.email || user._id || '';
}
