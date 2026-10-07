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


// ============================================================
// Types
// ============================================================

interface StatisticCard {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    progress?: number;
}


// ============================================================
// Motion
// ============================================================

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 18,
    },

    visible: {
        opacity: 1,
        y: 0,
    },
};


// ============================================================
// Component
// ============================================================

const AdminDashboard = () => {
    const theme = useTheme();

    const { t } = useTranslation();


    // ========================================================
    // Temporary dashboard data
    // ========================================================
    //
    // لاحقًا نستبدلها بالـAPI الحقيقي الموجود عندك.
    //

    const statistics: StatisticCard[] = [
        {
            title: t(
                'admin.dashboard.users',
                'المستخدمون',
            ),
            value: 0,
            subtitle: t(
                'admin.dashboard.totalUsers',
                'إجمالي المستخدمين',
            ),
            icon: <Groups />,
            color: theme.palette.primary.main,
        },

        {
            title: t(
                'admin.dashboard.posts',
                'الإعلانات',
            ),
            value: 0,
            subtitle: t(
                'admin.dashboard.totalPosts',
                'إجمالي الإعلانات',
            ),
            icon: <Campaign />,
            color: theme.palette.info.main,
        },

        {
            title: t(
                'admin.dashboard.pendingPosts',
                'قيد المراجعة',
            ),
            value: 0,
            subtitle: t(
                'admin.dashboard.postsNeedReview',
                'إعلانات تحتاج إلى مراجعة',
            ),
            icon: <PendingActions />,
            color: theme.palette.warning.main,
            progress: 0,
        },

        {
            title: t(
                'admin.dashboard.reports',
                'التقارير',
            ),
            value: 0,
            subtitle: t(
                'admin.dashboard.openReports',
                'تقارير مفتوحة',
            ),
            icon: <Report />,
            color: theme.palette.error.main,
        },

        {
            title: t(
                'admin.dashboard.jobs',
                'الوظائف',
            ),
            value: 0,
            subtitle: t(
                'admin.dashboard.totalJobs',
                'إجمالي الوظائف',
            ),
            icon: <Work />,
            color: theme.palette.success.main,
        },

        {
            title: t(
                'admin.dashboard.views',
                'المشاهدات',
            ),
            value: 0,
            subtitle: t(
                'admin.dashboard.totalViews',
                'إجمالي مشاهدات الإعلانات',
            ),
            icon: <Visibility />,
            color: theme.palette.secondary.main,
        },
    ];


    // ========================================================
    // Quick actions
    // ========================================================

    const quickActions = [
        {
            title: t(
                'admin.dashboard.reviewPosts',
                'مراجعة الإعلانات',
            ),
            description: t(
                'admin.dashboard.reviewPostsDescription',
                'عرض الإعلانات التي تحتاج إلى مراجعة',
            ),
            icon: <PendingActions />,
            color: theme.palette.warning.main,
        },

        {
            title: t(
                'admin.dashboard.manageUsers',
                'إدارة المستخدمين',
            ),
            description: t(
                'admin.dashboard.manageUsersDescription',
                'إدارة الحسابات والصلاحيات',
            ),
            icon: <Groups />,
            color: theme.palette.primary.main,
        },

        {
            title: t(
                'admin.dashboard.reviewReports',
                'مراجعة التقارير',
            ),
            description: t(
                'admin.dashboard.reviewReportsDescription',
                'متابعة البلاغات والتقارير',
            ),
            icon: <Report />,
            color: theme.palette.error.main,
        },

        {
            title: t(
                'admin.dashboard.notifications',
                'الإشعارات',
            ),
            description: t(
                'admin.dashboard.notificationsDescription',
                'إرسال ومتابعة إشعارات المستخدمين',
            ),
            icon: <TrendingUp />,
            color: theme.palette.info.main,
        },
    ];


    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            {/* =================================================
                Page Header
            ================================================= */}

            <Stack
                spacing={0.75}
                sx={{
                    mb: 4,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={800}
                >
                    {t(
                        'admin.dashboard.title',
                        'لوحة التحكم',
                    )}
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        maxWidth: 720,
                    }}
                >
                    {t(
                        'admin.dashboard.description',
                        'نظرة عامة على نشاط منصة صفقة وإدارة المستخدمين والإعلانات والتقارير.',
                    )}
                </Typography>
            </Stack>


            {/* =================================================
                Statistics
            ================================================= */}

            <Grid
                container
                spacing={2}
                sx={{
                    mb: 4,
                }}
            >
                {statistics.map(
                    (
                        statistic,
                        index,
                    ) => (
                        <Grid
                            key={
                                statistic.title
                            }
                            size={{
                                xs: 12,
                                sm: 6,
                                lg: 4,
                                xl: 2,
                            }}
                        >
                            <motion.div
                                variants={
                                    cardVariants
                                }
                                initial="hidden"
                                animate="visible"
                                transition={{
                                    duration: 0.35,
                                    delay:
                                        index *
                                        0.06,
                                }}
                            >
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 3,
                                        overflow:
                                            'hidden',
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            p: 2.25,
                                            '&:last-child':
                                                {
                                                    pb: 2.25,
                                                },
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            alignItems="flex-start"
                                            justifyContent="space-between"
                                            spacing={2}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mb: 1,
                                                    }}
                                                >
                                                    {
                                                        statistic.title
                                                    }
                                                </Typography>

                                                <Typography
                                                    variant="h4"
                                                    fontWeight={800}
                                                >
                                                    {
                                                        statistic.value
                                                    }
                                                </Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: 2,
                                                    display:
                                                        'flex',
                                                    alignItems:
                                                        'center',
                                                    justifyContent:
                                                        'center',
                                                    color: statistic.color,
                                                    bgcolor:
                                                        `${statistic.color}14`,
                                                }}
                                            >
                                                {
                                                    statistic.icon
                                                }
                                            </Box>
                                        </Stack>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            sx={{
                                                mt: 1.5,
                                            }}
                                        >
                                            {
                                                statistic.subtitle
                                            }
                                        </Typography>

                                        {typeof statistic.progress ===
                                            'number' && (
                                            <LinearProgress
                                                variant="determinate"
                                                value={
                                                    statistic.progress
                                                }
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
                    ),
                )}
            </Grid>


            {/* =================================================
                Main Content
            ================================================= */}

            <Grid
                container
                spacing={2.5}
            >
                {/* =================================================
                    Quick Actions
                ================================================= */}

                <Grid
                    size={{
                        xs: 12,
                        lg: 7,
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            height: '100%',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 3,
                        }}
                    >
                        <CardContent
                            sx={{
                                p: 3,
                                '&:last-child': {
                                    pb: 3,
                                },
                            }}
                        >
                            <Stack
                                spacing={0.5}
                                sx={{
                                    mb: 2.5,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={800}
                                >
                                    {t(
                                        'admin.dashboard.quickActions',
                                        'إجراءات سريعة',
                                    )}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {t(
                                        'admin.dashboard.quickActionsDescription',
                                        'الوصول السريع إلى أهم أدوات الإدارة.',
                                    )}
                                </Typography>
                            </Stack>

                            <Grid
                                container
                                spacing={1.5}
                            >
                                {quickActions.map(
                                    (
                                        action,
                                    ) => (
                                        <Grid
                                            key={
                                                action.title
                                            }
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2.5,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    transition:
                                                        'all .2s ease',

                                                    '&:hover':
                                                        {
                                                            borderColor:
                                                                action.color,
                                                            transform:
                                                                'translateY(-2px)',
                                                        },
                                                }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={1.5}
                                                    alignItems="flex-start"
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            flexShrink: 0,
                                                            borderRadius: 2,
                                                            display:
                                                                'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            color: action.color,
                                                            bgcolor:
                                                                `${action.color}14`,
                                                        }}
                                                    >
                                                        {
                                                            action.icon
                                                        }
                                                    </Box>

                                                    <Box>
                                                        <Typography
                                                            fontWeight={
                                                                700
                                                            }
                                                        >
                                                            {
                                                                action.title
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mt: 0.5,
                                                            }}
                                                        >
                                                            {
                                                                action.description
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </Grid>
                                    ),
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>


                {/* =================================================
                    System Status
                ================================================= */}

                <Grid
                    size={{
                        xs: 12,
                        lg: 5,
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            height: '100%',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 3,
                        }}
                    >
                        <CardContent
                            sx={{
                                p: 3,
                                '&:last-child': {
                                    pb: 3,
                                },
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={800}
                                sx={{
                                    mb: 2.5,
                                }}
                            >
                                {t(
                                    'admin.dashboard.systemStatus',
                                    'حالة النظام',
                                )}
                            </Typography>

                            <Stack spacing={2}>
                                <SystemStatus
                                    title={t(
                                        'admin.dashboard.api',
                                        'API',
                                    )}
                                    status={t(
                                        'admin.dashboard.operational',
                                        'يعمل بشكل طبيعي',
                                    )}
                                />

                                <SystemStatus
                                    title={t(
                                        'admin.dashboard.database',
                                        'قاعدة البيانات',
                                    )}
                                    status={t(
                                        'admin.dashboard.operational',
                                        'يعمل بشكل طبيعي',
                                    )}
                                />

                                <SystemStatus
                                    title={t(
                                        'admin.dashboard.realtime',
                                        'Socket / Realtime',
                                    )}
                                    status={t(
                                        'admin.dashboard.operational',
                                        'يعمل بشكل طبيعي',
                                    )}
                                />

                                <SystemStatus
                                    title={t(
                                        'admin.dashboard.notificationsSystem',
                                        'Notifications',
                                    )}
                                    status={t(
                                        'admin.dashboard.operational',
                                        'يعمل بشكل طبيعي',
                                    )}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};


// ============================================================
// System Status Component
// ============================================================

interface SystemStatusProps {
    title: string;
    status: string;
}

const SystemStatus = ({
    title,
    status,
}: SystemStatusProps) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'action.hover',
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
            >
                <CheckCircle
                    sx={{
                        fontSize: 20,
                        color: 'success.main',
                    }}
                />

                <Typography fontWeight={600}>
                    {title}
                </Typography>
            </Stack>

            <Chip
                label={status}
                size="small"
                color="success"
                variant="outlined"
            />
        </Stack>
    );
};


export default AdminDashboard;