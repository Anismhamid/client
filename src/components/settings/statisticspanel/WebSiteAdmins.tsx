import { FunctionComponent } from 'react';
import {
    Download,
    Refresh,
    TrendingUp,
    People,
    ShoppingCart,
    AttachMoney,
    ThumbUp,
    Category,
    Star,
    Verified,
    Percent,
    MonetizationOn,
    AccessTime,
    AdminPanelSettings,
    SupervisorAccount,
    Person,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Fade,
    FormControl,
    Grid,
    Grow,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Tooltip,
    Typography,
    alpha,
    useTheme,
    Zoom,
} from '@mui/material';

import { useUser } from '../../../hooks/useUSer';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import RoleType from '../../../interfaces/UserType';

import { useAdminDashboard } from '../../../hooks/useAdminDashboard';
import { getCategoryName, Statistics } from './statisticsUtils';
import {
    SkeletonDashboard,
    StatCard,
    CategoryBarRow,
} from './DashboardComponents';
import { ProductsTable } from './DashboardTables';
import { SellersTable } from './DashboardTables';
import { ProductsGrowthChart, CategoryDonutChart } from './DashboardCharts';

// ─── Spreadsheet-compatible CSV export ────────────────────────────────────────

const csvCell = (value: string | number) =>
    `"${String(value).replaceAll('"', '""')}"`;

const csvRow = (values: Array<string | number>) => values.map(csvCell).join(',');

const exportToExcel = (data: Statistics) => {
    const lines = [
        csvRow(['ملخص']),
        csvRow([
            'إجمالي المنتجات', 'المنتجات النشطة', 'المنتجات المباعة',
            'إجمالي المستخدمين', 'المستخدمين المتصلين', 'إجمالي الإعجابات',
            'القيمة الإجمالية', 'متوسط السعر', 'أعلى سعر', 'إجمالي الخصومات',
        ]),
        csvRow([
            data.totalProducts, data.activeProducts, data.soldPosts,
            data.totalUsers, data.onlineUsers, data.totalLikes,
            data.totalProductValue, data.averageProductPrice,
            data.highestPricedProduct, data.totalDiscountValue,
        ]),
        '',
        csvRow(['الفئات']),
        csvRow(['الفئة', 'العدد', 'النسبة %', 'القيمة الإجمالية']),
        ...data.productsByCategory.map((category) =>
            csvRow([
                getCategoryName(category.category), category.count,
                category.percentage.toFixed(1), category.totalValue,
            ]),
        ),
        '',
        csvRow(['البائعون']),
        csvRow(['البائع', 'المنتجات', 'الإعجابات', 'القيمة الإجمالية']),
        ...data.topSellers.map((seller) =>
            csvRow([
                seller.name, seller.productsCount, seller.totalLikes,
                seller.totalValue,
            ]),
        ),
    ];

    const dateStr = new Date().toISOString().split('T')[0];
    const file = new Blob([`\uFEFF${lines.join('\r\n')}`], {
        type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `تقرير_صفقة_${dateStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};

// ─── Role helpers ─────────────────────────────────────────────────────────────

const getRoleIcon = (role: string) => {
    if (role === 'Admin') return <AdminPanelSettings fontSize='small' />;
    if (role === 'Moderator') return <SupervisorAccount fontSize='small' />;
    return <Person fontSize='small' />;
};

// ─── Format last-updated time ─────────────────────────────────────────────────

const formatLastUpdated = (date: Date | null): string => {
    if (!date) return '';
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'منذ لحظات';
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    return `منذ ${Math.floor(diff / 3600)} ساعة`;
};

// ─── Component ────────────────────────────────────────────────────────────────

const WebSiteAdmins: FunctionComponent = () => {
    const { auth } = useUser();
    const theme = useTheme();

    const {
        timeFrame,
        statistics,
        loading,
        refreshing,
        error,
        lastUpdated,
        handleRefresh,
        handleTimeFrameChange,
    } = useAdminDashboard(auth.role || 'Client');

    // Access guard
    if (auth.role !== RoleType.Admin && auth.role !== RoleType.Moderator) {
        return (
            <Box component='main' textAlign='center' mt={5}>
                <Typography variant='h4' color='error'>
                    غير مصرح لك بالوصول إلى هذه الصفحة
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign='center' py={8}>
                <Typography color='error' variant='h5' gutterBottom>
                    {error}
                </Typography>
                <Button
                    variant='contained'
                    onClick={handleRefresh}
                    startIcon={<Refresh />}
                    sx={{ mt: 2 }}
                >
                    إعادة المحاولة
                </Button>
            </Box>
        );
    }

    return (
        <>
            <title>لوحة تحكم الإدارة | صفقة</title>
            <meta
                name='description'
                content='لوحة تحكم إدارة منصة بيع وشراء C2C | صفقة'
            />
            <main>
                <Container>
                    {/* ── Header ── */}
                    <Grow in timeout={400}>
                        <Box
                            display='flex'
                            justifyContent='space-between'
                            alignItems='center'
                            mb={3}
                            flexWrap='wrap'
                            gap={2}
                        >
                            <Box>
                                <Typography
                                    variant='h3'
                                    component='h1'
                                    sx={{
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontWeight: 800,
                                    }}
                                >
                                    لوحة تحكم صفقة
                                </Typography>
                                <Box
                                    display='flex'
                                    alignItems='center'
                                    gap={1}
                                    mt={0.5}
                                >
                                    <Typography
                                        variant='subtitle2'
                                        color='text.secondary'
                                    >
                                        إحصائيات المنصة ·{' '}
                                        {formatLastUpdated(lastUpdated)}
                                    </Typography>
                                    {/* Live indicator */}
                                    <Box
                                        sx={{
                                            width: 7,
                                            height: 7,
                                            borderRadius: '50%',
                                            bgcolor: 'success.main',
                                            animation: 'pulse 2s infinite',
                                            '@keyframes pulse': {
                                                '0%,100%': { opacity: 1 },
                                                '50%': { opacity: 0.3 },
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box display='flex' gap={1} flexWrap='wrap'>
                                <Button
                                    startIcon={<Download />}
                                    onClick={() => exportToExcel(statistics)}
                                    variant='outlined'
                                    size='small'
                                >
                                    تصدير Excel
                                </Button>
                                <Tooltip title='تحديث البيانات'>
                                    <IconButton
                                        onClick={handleRefresh}
                                        disabled={refreshing}
                                        sx={{
                                            bgcolor: alpha(
                                                theme.palette.primary.main,
                                                0.1,
                                            ),
                                            transition: 'transform .5s',
                                            ...(refreshing && {
                                                animation:
                                                    'spin 1s linear infinite',
                                                '@keyframes spin': {
                                                    from: {
                                                        transform:
                                                            'rotate(0deg)',
                                                    },
                                                    to: {
                                                        transform:
                                                            'rotate(360deg)',
                                                    },
                                                },
                                            }),
                                            '&:hover': {
                                                bgcolor: alpha(
                                                    theme.palette.primary.main,
                                                    0.2,
                                                ),
                                            },
                                        }}
                                    >
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Grow>

                    {/* ── Toolbar ── */}
                    <Fade in timeout={600}>
                        <Box
                            display='flex'
                            justifyContent='space-between'
                            alignItems='center'
                            mb={4}
                            flexWrap='wrap'
                            gap={2}
                            sx={{
                                p: 2,
                                bgcolor: alpha(
                                    theme.palette.background.paper,
                                    0.6,
                                ),
                                borderRadius: 3,
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <Box>
                                <Typography
                                    variant='body1'
                                    color='text.secondary'
                                >
                                    مرحباً، {auth.name?.first} {auth.name?.last}
                                </Typography>
                                <Chip
                                    icon={getRoleIcon(auth.role)}
                                    label={
                                        auth.role === RoleType.Admin
                                            ? 'مدير النظام'
                                            : 'مشرف'
                                    }
                                    size='small'
                                    color={
                                        auth.role === RoleType.Admin
                                            ? 'error'
                                            : 'warning'
                                    }
                                    variant='filled'
                                    sx={{ mt: 0.5, fontWeight: 600 }}
                                />
                            </Box>
                            <FormControl size='small' sx={{ minWidth: 150 }}>
                                <InputLabel>الفترة الزمنية</InputLabel>
                                <Select
                                    value={timeFrame}
                                    label='الفترة الزمنية'
                                    onChange={(e) =>
                                        handleTimeFrameChange(
                                            e.target.value as
                                                | 'today'
                                                | 'month'
                                                | 'all',
                                        )
                                    }
                                    sx={{ borderRadius: 3 }}
                                >
                                    <MenuItem value='today'>اليوم</MenuItem>
                                    <MenuItem value='month'>هذا الشهر</MenuItem>
                                    <MenuItem value='all'>الكل</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Fade>

                    {/* ── Loading ── */}
                    {loading ? (
                        <SkeletonDashboard />
                    ) : (
                        <>
                            {/* ── Overview heading ── */}
                            <Typography
                                variant='h5'
                                gutterBottom
                                sx={{
                                    mb: 3,
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <TrendingUp
                                    sx={{ color: theme.palette.primary.main }}
                                />
                                نظرة عامة
                            </Typography>

                            {/* ── Stat cards ── */}
                            <Box display='flex' gap={2} mb={4} flexWrap='wrap'>
                                <Zoom in timeout={300}>
                                    <Box sx={{ flex: '1 1 180px' }}>
                                        <StatCard
                                            icon={
                                                <People sx={{ fontSize: 48 }} />
                                            }
                                            label='إجمالي المستخدمين'
                                            value={statistics.totalUsers}
                                            growth={`+${statistics.newUsersToday} اليوم`}
                                            progressValue={
                                                statistics.totalUsers > 0
                                                    ? (statistics.onlineUsers /
                                                          statistics.totalUsers) *
                                                      100
                                                    : 0
                                            }
                                            subValue={`${statistics.onlineUsers} متصل الآن`}
                                            color={theme.palette.primary.main}
                                        />
                                    </Box>
                                </Zoom>
                                <Zoom in timeout={400}>
                                    <Box sx={{ flex: '1 1 180px' }}>
                                        <StatCard
                                            icon={
                                                <ShoppingCart
                                                    sx={{ fontSize: 48 }}
                                                />
                                            }
                                            label='إجمالي المنتجات'
                                            value={statistics.totalProducts}
                                            growth={`+${statistics.newProductsToday} اليوم`}
                                            color={theme.palette.success.main}
                                            chips={[
                                                {
                                                    label: `${statistics.activeProducts} نشط`,
                                                    color: 'success',
                                                },
                                                {
                                                    label: `${statistics.soldPosts} مباع`,
                                                    color: 'error',
                                                },
                                            ]}
                                        />
                                    </Box>
                                </Zoom>
                                <Zoom in timeout={500}>
                                    <Box sx={{ flex: '1 1 180px' }}>
                                        <StatCard
                                            icon={
                                                <AttachMoney
                                                    sx={{ fontSize: 48 }}
                                                />
                                            }
                                            label='القيمة الإجمالية'
                                            value={formatPrice(
                                                statistics.totalProductValue,
                                            )}
                                            subValue={`متوسط: ${formatPrice(statistics.averageProductPrice)}`}
                                            growth={`أعلى: ${formatPrice(statistics.highestPricedProduct)}`}
                                            color={theme.palette.warning.main}
                                        />
                                    </Box>
                                </Zoom>
                                <Zoom in timeout={600}>
                                    <Box sx={{ flex: '1 1 180px' }}>
                                        <StatCard
                                            icon={
                                                <ThumbUp
                                                    sx={{ fontSize: 48 }}
                                                />
                                            }
                                            label='إجمالي التفاعلات'
                                            value={statistics.totalLikes.toLocaleString()}
                                            growth={`${statistics.averageLikesPerProduct} إعجاب / منتج`}
                                            color={theme.palette.error.main}
                                            chips={[
                                                {
                                                    label: `${statistics.activeSellers} بائع`,
                                                    color: 'default',
                                                },
                                            ]}
                                        />
                                    </Box>
                                </Zoom>
                            </Box>

                            {/* ── Charts ── */}
                            {statistics.productsByDate.length > 0 && (
                                <Grow in timeout={700}>
                                    <Grid container spacing={3} sx={{ mb: 4 }}>
                                        <Grid size={{ xs: 12, md: 7 }}>
                                            <Card
                                                sx={{
                                                    borderRadius: 4,
                                                    height: '100%',
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography
                                                        variant='h6'
                                                        fontWeight={700}
                                                        mb={2}
                                                        display='flex'
                                                        alignItems='center'
                                                        gap={1}
                                                    >
                                                        <TrendingUp color='primary' />
                                                        نمو المنتجات (آخر 7
                                                        أيام)
                                                    </Typography>
                                                    <ProductsGrowthChart
                                                        data={
                                                            statistics.productsByDate
                                                        }
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 5 }}>
                                            <Card
                                                sx={{
                                                    borderRadius: 4,
                                                    height: '100%',
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography
                                                        variant='h6'
                                                        fontWeight={700}
                                                        mb={1}
                                                        display='flex'
                                                        alignItems='center'
                                                        gap={1}
                                                    >
                                                        <Category color='primary' />
                                                        توزيع الفئات
                                                    </Typography>
                                                    <CategoryDonutChart
                                                        data={
                                                            statistics.productsByCategory
                                                        }
                                                        totalProducts={
                                                            statistics.totalProducts
                                                        }
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grow>
                            )}

                            {/* ── Category breakdown ── */}
                            {statistics.productsByCategory.length > 0 && (
                                <Grow in timeout={750}>
                                    <Card sx={{ borderRadius: 4, mb: 4 }}>
                                        <CardContent>
                                            <Typography
                                                variant='h5'
                                                fontWeight={700}
                                                mb={3}
                                                display='flex'
                                                alignItems='center'
                                                gap={1}
                                            >
                                                <Category color='primary' />
                                                تفصيل الفئات
                                            </Typography>
                                            {statistics.productsByCategory
                                                .slice(0, 6)
                                                .map((cat, i) => (
                                                    <CategoryBarRow
                                                        key={cat.category}
                                                        category={cat}
                                                        index={i}
                                                    />
                                                ))}
                                        </CardContent>
                                    </Card>
                                </Grow>
                            )}

                            {/* ── Products table ── */}
                            <Grow in timeout={800}>
                                <Card sx={{ borderRadius: 4, mb: 4 }}>
                                    <CardContent>
                                        <Typography
                                            variant='h5'
                                            fontWeight={700}
                                            mb={3}
                                            display='flex'
                                            alignItems='center'
                                            gap={1}
                                        >
                                            <Star color='warning' />
                                            أكثر المنتجات تفاعلاً
                                        </Typography>
                                        <ProductsTable
                                            products={
                                                statistics.mostPopularProducts
                                            }
                                        />
                                    </CardContent>
                                </Card>
                            </Grow>

                            {/* ── Sellers table ── */}
                            <Grow in timeout={900}>
                                <Card sx={{ borderRadius: 4, mb: 4 }}>
                                    <CardContent>
                                        <Typography
                                            variant='h5'
                                            fontWeight={700}
                                            mb={3}
                                            display='flex'
                                            alignItems='center'
                                            gap={1}
                                        >
                                            <Verified color='success' />
                                            أكثر البائعين نشاطاً
                                        </Typography>
                                        <SellersTable
                                            sellers={statistics.topSellers}
                                        />
                                    </CardContent>
                                </Card>
                            </Grow>

                            {/* ── Summary cards ── */}
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Fade in timeout={1000}>
                                        <Card sx={{ borderRadius: 4 }}>
                                            <CardContent>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='space-between'
                                                    mb={2}
                                                >
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        gap={1}
                                                    >
                                                        <Percent
                                                            sx={{
                                                                fontSize: 28,
                                                            }}
                                                        />
                                                        <Typography
                                                            variant='h6'
                                                            fontWeight={600}
                                                        >
                                                            قيمة الخصومات
                                                        </Typography>
                                                    </Box>
                                                    <MonetizationOn
                                                        sx={{
                                                            fontSize: 32,
                                                            opacity: 0.7,
                                                        }}
                                                    />
                                                </Box>
                                                <Typography
                                                    variant='h3'
                                                    fontWeight='bold'
                                                >
                                                    {formatPrice(
                                                        statistics.totalDiscountValue,
                                                    )}
                                                </Typography>
                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                    mt={0.5}
                                                >
                                                    إجمالي قيمة التخفيضات
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Fade in timeout={1100}>
                                        <Card sx={{ borderRadius: 4 }}>
                                            <CardContent>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='space-between'
                                                    mb={2}
                                                >
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        gap={1}
                                                    >
                                                        <TrendingUp
                                                            sx={{
                                                                fontSize: 28,
                                                            }}
                                                        />
                                                        <Typography
                                                            variant='h6'
                                                            fontWeight={600}
                                                        >
                                                            متوسط التفاعل
                                                        </Typography>
                                                    </Box>
                                                    <ThumbUp
                                                        sx={{
                                                            fontSize: 32,
                                                            opacity: 0.7,
                                                        }}
                                                    />
                                                </Box>
                                                <Typography
                                                    variant='h3'
                                                    fontWeight='bold'
                                                >
                                                    {statistics.averageLikesPerProduct.toFixed(
                                                        1,
                                                    )}
                                                </Typography>
                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                    mt={0.5}
                                                >
                                                    متوسط الإعجابات لكل منتج
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Fade in timeout={1200}>
                                        <Card sx={{ borderRadius: 4 }}>
                                            <CardContent>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='space-between'
                                                    mb={2}
                                                >
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        gap={1}
                                                    >
                                                        <AccessTime
                                                            sx={{
                                                                fontSize: 28,
                                                            }}
                                                        />
                                                        <Typography
                                                            variant='h6'
                                                            fontWeight={600}
                                                        >
                                                            نشاط اليوم
                                                        </Typography>
                                                    </Box>
                                                    <ShoppingCart
                                                        sx={{
                                                            fontSize: 32,
                                                            opacity: 0.7,
                                                        }}
                                                    />
                                                </Box>
                                                <Typography
                                                    variant='h3'
                                                    fontWeight='bold'
                                                >
                                                    {statistics.newProductsToday +
                                                        statistics.newUsersToday}
                                                </Typography>
                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                    mt={0.5}
                                                >
                                                    {
                                                        statistics.newProductsToday
                                                    }{' '}
                                                    منتج +{' '}
                                                    {statistics.newUsersToday}{' '}
                                                    مستخدم
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                </Grid>
                            </Grid>

                            {/* ── Roles summary ── */}
                            <Fade in timeout={1300}>
                                <Card sx={{ borderRadius: 4, mt: 3 }}>
                                    <CardContent>
                                        <Typography
                                            variant='h6'
                                            fontWeight={600}
                                            mb={2}
                                        >
                                            توزيع أدوار المستخدمين
                                        </Typography>
                                        <Box
                                            display='flex'
                                            gap={2}
                                            flexWrap='wrap'
                                        >
                                            <Chip
                                                icon={
                                                    <AdminPanelSettings fontSize='small' />
                                                }
                                                label={`${statistics.totalAdmins} Admin`}
                                                color='error'
                                                variant='filled'
                                            />
                                            <Chip
                                                icon={
                                                    <SupervisorAccount fontSize='small' />
                                                }
                                                label={`${statistics.totalModerators} Moderator`}
                                                color='warning'
                                                variant='filled'
                                            />
                                            <Chip
                                                icon={
                                                    <Person fontSize='small' />
                                                }
                                                label={`${statistics.totalClients} Client`}
                                                color='success'
                                                variant='filled'
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </>
                    )}
                </Container>
            </main>
        </>
    );
};

export default WebSiteAdmins;
