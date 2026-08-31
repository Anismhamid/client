// MessageAuditLogs.tsx
import { FunctionComponent, useMemo, useState } from 'react';

import {
    Box,
    Card,
    Chip,
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
} from '@mui/material';

import {
    Visibility as VisibilityIcon,
    Search as SearchIcon,
    Chat as ChatIcon,
    Message as MessageIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

import { formatDate } from '../../../../../helpers/dateAndPriceFormat';
import { useTranslation } from 'react-i18next';

import {
    AuditLog,
    InvestigationUser,
} from '../../../../../interfaces/InvestigationMessage';

interface Props {
    logs: AuditLog[];
}

const MessageAuditLogs: FunctionComponent<Props> = ({ logs }) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState<
        'ALL' | 'VIEW_MESSAGE' | 'VIEW_CONVERSATION'
    >('ALL');
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

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

    // ✅ Security: Redact sensitive information
    const redactIP = (ip?: string | null) => {
        if (!ip) return '-';
        const parts = ip.split('.');
        if (parts.length === 4) {
            return `***.***.***.${parts[3]}`;
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

    return (
        <Box>
            {/* ================= HEADER ================= */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent='space-between'
                alignItems={{ xs: 'stretch', md: 'center' }}
                gap={2}
                mb={3}
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

                <Chip
                    label={`${filteredLogs.length} ${t('pages.messageAuditLogs.records', 'سجل')}`}
                    variant='outlined'
                />
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
                        {filteredLogs.map((log) => (
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
                            <DetailRow
                                label={t(
                                    'pages.messageAuditLogs.actionType',
                                    'نوع العملية',
                                )}
                                value={
                                    selectedLog.action === 'VIEW_CONVERSATION'
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

                            <Divider />

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

                            <Divider />

                            <DetailRow
                                label={t(
                                    'pages.messageAuditLogs.reason',
                                    'السبب',
                                )}
                                value={selectedLog.reason}
                            />

                            {/* ✅ Redacted IP Address */}
                            <DetailRow
                                label={t(
                                    'pages.messageAuditLogs.ipAddress',
                                    'IP Address',
                                )}
                                value={redactIP(selectedLog.ip)}
                                mono
                            />

                            {/* ✅ Redacted User Agent */}
                            <DetailRow
                                label={t(
                                    'pages.messageAuditLogs.userAgent',
                                    'User Agent',
                                )}
                                value={redactUserAgent(selectedLog.userAgent)}
                            />

                            <Divider />

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

                            <DetailRow
                                label={t(
                                    'pages.messageAuditLogs.date',
                                    'التاريخ',
                                )}
                                value={formatDate(selectedLog.createdAt)}
                            />

                            <DetailRow
                                label={t(
                                    'pages.messageAuditLogs.auditId',
                                    'Audit Log ID',
                                )}
                                value={selectedLog._id}
                                mono
                            />
                        </Stack>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default MessageAuditLogs;

/* =========================================
   Action Chip
========================================= */

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

/* =========================================
   User Cell
========================================= */

const UserCell = ({ user }: { user?: InvestigationUser | null }) => {
    if (!user) {
        return (
            <Typography variant='body2' color='text.secondary'>
                -
            </Typography>
        );
    }

    return (
        <Box>
            <Typography variant='body2' fontWeight={600}>
                {getUserName(user)}
            </Typography>
            {user.email && (
                <Typography variant='caption' color='text.secondary'>
                    {user.email}
                </Typography>
            )}
        </Box>
    );
};

/* =========================================
   Detail Row
========================================= */

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

/* =========================================
   Helpers
========================================= */

function getUserName(user: InvestigationUser | null | undefined): string {
    if (!user) {
        return '';
    }

    const fullName = [user.name.first, user.name.last]
        .filter(Boolean)
        .join(' ');

    return fullName || user.email || user._id;
}
