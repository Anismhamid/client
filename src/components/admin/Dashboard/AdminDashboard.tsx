import type { ReactNode } from 'react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    LinearProgress,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import {
    Campaign,
    CheckCircle,
    Groups,
    PendingActions,
    Report,
    TrendingUp,
    Visibility,
    Work,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAdminDashboard } from '../../../hooks/useAdminDashboard';
import { useUser } from '../../../hooks/useUSer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatisticCard {
    title: string;
    value: string | number;
    subtitle: string;
    icon: ReactNode;
    color: string;
    progress?: number;
}

interface QuickAction {
    title: string;
    description: string;
    icon: ReactNode;
    color: string;
}

// ─── Motion ───────────────────────────────────────────────────────────────────

const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
};

// ─── Component ────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
    const theme = useTheme();
    const { t } = useTranslation();

    const { auth } = useUser();
    const { statistics, loading } = useAdminDashboard(auth?.role || 'Client');

    // أثناء التحميل بنعرض "—" بدل 0 عشان ما يبان إنه الرقم فعلاً صفر
    const n = (v?: number) => (loading ? '—' : (v ?? 0).toLocaleString());

    const totalProducts = statistics?.totalProducts ?? 0;
    const pendingProgress =
        totalProducts > 0
            ? ((statistics?.totalPendingPosts ?? 0) / totalProducts) * 100
            : 0;

    // ─── Stat cards ───────────────────────────────────────────────────────────

    const cards: StatisticCard[] = [
        {
            title: t('admin.dashboard.users', 'المستخدمون'),
            value: n(statistics?.totalUsers),
            subtitle: t('admin.dashboard.totalUsers', 'إجمالي المستخدمين'),
            icon: <Groups />,
            color: theme.palette.primary.main,
        },
        {
            title: t('admin.dashboard.posts', 'الإعلانات'),
            value: n(statistics?.totalProducts),
            subtitle: t('admin.dashboard.totalPosts', 'إجمالي الإعلانات'),
            icon: <Campaign />,
            color: theme.palette.info.main,
        },
        {
            title: t('admin.dashboard.pendingPosts', 'قيد المراجعة'),
            value: n(statistics?.totalPendingPosts),
            subtitle: t(
                'admin.dashboard.postsNeedReview',
                'إعلانات تحتاج إلى مراجعة',
            ),
            icon: <PendingActions />,
            color: theme.palette.warning.main,
            progress: loading ? 0 : pendingProgress,
        },
        {
            title: t('admin.dashboard.reports', 'التقارير'),
            // TODO: وصّلها بالـ API لما يصير في route للتقارير
            value: 0,
            subtitle: t('admin.dashboard.openReports', 'تقارير مفتوحة'),
            icon: <Report />,
            color: theme.palette.error.main,
        },
        {
            title: t('admin.dashboard.jobs', 'الوظائف'),
            // TODO: وصّلها بالـ API تبع الوظائف
            value: 0,
            subtitle: t('admin.dashboard.totalJobs', 'إجمالي الوظائف'),
            icon: <Work />,
            color: theme.palette.success.main,
        },
        {
            title: t('admin.dashboard.views', 'المشاهدات'),
            value: n(statistics?.totalViews),
            subtitle: t(
                'admin.dashboard.totalViews',
                'إجمالي مشاهدات الإعلانات',
            ),
            icon: <Visibility />,
            color: theme.palette.secondary.main,
        },
    ];

    // ─── Quick actions ────────────────────────────────────────────────────────

    const quickActions: QuickAction[] = [
        {
            title: t('admin.dashboard.reviewPosts', 'مراجعة الإعلانات'),
            description: t(
                'admin.dashboard.reviewPostsDescription',
                'عرض الإعلانات التي تحتاج إلى مراجعة',
            ),
            icon: <PendingActions />,
            color: theme.palette.warning.main,
        },
        {
            title: t('admin.dashboard.manageUsers', 'إدارة المستخدمين'),
            description: t(
                'admin.dashboard.manageUsersDescription',
                'إدارة الحسابات والصلاحيات',
            ),
            icon: <Groups />,
            color: theme.palette.primary.main,
        },
        {
            title: t('admin.dashboard.reviewReports', 'مراجعة التقارير'),
            description: t(
                'admin.dashboard.reviewReportsDescription',
                'متابعة البلاغات والتقارير',
            ),
            icon: <Report />,
            color: theme.palette.error.main,
        },
        {
            title: t('admin.dashboard.notifications', 'الإشعارات'),
            description: t(
                'admin.dashboard.notificationsDescription',
                'إرسال ومتابعة إشعارات المستخدمين',
            ),
            icon: <TrendingUp />,
            color: theme.palette.info.main,
        },
    ];

    const operational = t('admin.dashboard.operational', 'يعمل بشكل طبيعي');

    return (
        <Box sx={{ width: '100%' }}>
            {/* Page header */}
            <Stack spacing={0.75} sx={{ mb: 4 }}>
                <Typography variant='h4' fontWeight={800}>
                    {t('admin.dashboard.title', 'لوحة التحكم')}
                </Typography>
                <Typography color='text.secondary' sx={{ maxWidth: 720 }}>
                    {t(
                        'admin.dashboard.description',
                        'نظرة عامة على نشاط منصة صفقة وإدارة المستخدمين والإعلانات والتقارير.',
                    )}
                </Typography>
            </Stack>

            {/* Statistics */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {cards.map((card, index) => (
                    <Grid
                        key={card.title}
                        size={{ xs: 12, sm: 6, lg: 4, xl: 2 }}
                    >
                        <motion.div
                            variants={cardVariants}
                            initial='hidden'
                            animate='visible'
                            transition={{ duration: 0.35, delay: index * 0.06 }}
                            style={{ height: '100%' }}
                        >
                            <Card
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                }}
                            >
                                <CardContent
                                    sx={{
                                        p: 2.25,
                                        '&:last-child': { pb: 2.25 },
                                    }}
                                >
                                    <Stack
                                        direction='row'
                                        alignItems='flex-start'
                                        justifyContent='space-between'
                                        spacing={2}
                                    >
                                        <Box>
                                            <Typography
                                                variant='body2'
                                                color='text.secondary'
                                                sx={{ mb: 1 }}
                                            >
                                                {card.title}
                                            </Typography>
                                            <Typography
                                                variant='h4'
                                                fontWeight={800}
                                            >
                                                {card.value}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: card.color,
                                                bgcolor: `${card.color}14`,
                                            }}
                                        >
                                            {card.icon}
                                        </Box>
                                    </Stack>

                                    <Typography
                                        variant='caption'
                                        color='text.secondary'
                                        display='block'
                                        sx={{ mt: 1.5 }}
                                    >
                                        {card.subtitle}
                                    </Typography>

                                    {typeof card.progress === 'number' && (
                                        <LinearProgress
                                            variant='determinate'
                                            value={card.progress}
                                            color='warning'
                                            sx={{
                                                mt: 1.5,
                                                height: 5,
                                                borderRadius: 10,
                                            }}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Main content */}
            <Grid container spacing={2.5}>
                {/* Quick actions */}
                <Grid size={{ xs: 12, lg: 7 }}>
                    <Card
                        elevation={0}
                        sx={{
                            height: '100%',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 3,
                        }}
                    >
                        <CardContent
                            sx={{ p: 3, '&:last-child': { pb: 3 } }}
                        >
                            <Stack spacing={0.5} sx={{ mb: 2.5 }}>
                                <Typography variant='h6' fontWeight={800}>
                                    {t(
                                        'admin.dashboard.quickActions',
                                        'إجراءات سريعة',
                                    )}
                                </Typography>
                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                >
                                    {t(
                                        'admin.dashboard.quickActionsDescription',
                                        'الوصول السريع إلى أهم أدوات الإدارة.',
                                    )}
                                </Typography>
                            </Stack>

                            <Grid container spacing={1.5}>
                                {quickActions.map((action) => (
                                    <Grid
                                        key={action.title}
                                        size={{ xs: 12, sm: 6 }}
                                    >
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2.5,
                                                border: `1px solid ${theme.palette.divider}`,
                                                transition: 'all .2s ease',
                                                '&:hover': {
                                                    borderColor: action.color,
                                                    transform:
                                                        'translateY(-2px)',
                                                },
                                            }}
                                        >
                                            <Stack
                                                direction='row'
                                                spacing={1.5}
                                                alignItems='flex-start'
                                            >
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        flexShrink: 0,
                                                        borderRadius: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        color: action.color,
                                                        bgcolor: `${action.color}14`,
                                                    }}
                                                >
                                                    {action.icon}
                                                </Box>
                                                <Box>
                                                    <Typography fontWeight={700}>
                                                        {action.title}
                                                    </Typography>
                                                    <Typography
                                                        variant='body2'
                                                        color='text.secondary'
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        {action.description}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* System status */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    <Card
                        elevation={0}
                        sx={{
                            height: '100%',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 3,
                        }}
                    >
                        <CardContent
                            sx={{ p: 3, '&:last-child': { pb: 3 } }}
                        >
                            <Typography
                                variant='h6'
                                fontWeight={800}
                                sx={{ mb: 2.5 }}
                            >
                                {t('admin.dashboard.systemStatus', 'حالة النظام')}
                            </Typography>

                            {/* TODO: حالة ثابتة — اربطها بـ /api/health */}
                            <Stack spacing={2}>
                                <SystemStatus
                                    title={t('admin.dashboard.api', 'API')}
                                    status={operational}
                                />
                                <SystemStatus
                                    title={t(
                                        'admin.dashboard.database',
                                        'قاعدة البيانات',
                                    )}
                                    status={operational}
                                />
                                <SystemStatus
                                    title={t(
                                        'admin.dashboard.realtime',
                                        'Socket / Realtime',
                                    )}
                                    status={operational}
                                />
                                <SystemStatus
                                    title={t(
                                        'admin.dashboard.notificationsSystem',
                                        'Notifications',
                                    )}
                                    status={operational}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

// ─── System status row ────────────────────────────────────────────────────────

interface SystemStatusProps {
    title: string;
    status: string;
}

const SystemStatus = ({ title, status }: SystemStatusProps) => (
    <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        spacing={2}
        sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}
    >
        <Stack direction='row' alignItems='center' spacing={1}>
            <CheckCircle sx={{ fontSize: 20, color: 'success.main' }} />
            <Typography fontWeight={600}>{title}</Typography>
        </Stack>
        <Chip label={status} size='small' color='success' variant='outlined' />
    </Stack>
);

export default AdminDashboard;