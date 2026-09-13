import { useState, useMemo, type ReactElement } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Typography,
    Avatar,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    TableSortLabel,
    Pagination,
    InputAdornment,
} from '@mui/material';
import {
    Search,
    ThumbUp,
    Visibility,
    AdminPanelSettings,
    SupervisorAccount,
    Person,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import { MostPopularProduct, TopSeller } from './statisticsUtils';
import { MedalAvatar } from './DashboardComponents';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import { productsPathes } from '../../../routes/routes';
import { getCategoryName } from './statisticsUtils';

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductSortKey = 'name' | 'likes' | 'views' | 'price';
type Order = 'asc' | 'desc';

const ROWS_PER_PAGE = 5;

// ─── Status config ────────────────────────────────────────────────────────────

const getStatusConfig = (t: TFunction) => ({
    active: { label: t('admin.status.active'), color: 'success' as const },
    sold: { label: t('admin.status.sold'), color: 'error' as const },
    pending: {
        label: t('admin.status.pending'),
        color: 'warning' as const,
    },
});

// ─── Role config ──────────────────────────────────────────────────────────────

type RoleConfigEntry = {
    label: string;
    color: 'error' | 'warning' | 'success' | 'info';
    icon: ReactElement;
};

type RoleConfigMap = Record<string, RoleConfigEntry>;

const getRoleConfig = (t: TFunction): RoleConfigMap => ({
    Admin: {
        label: t('admin.roles.admin'),
        color: 'error',
        icon: <AdminPanelSettings fontSize='small' />,
    },
    Moderator: {
        label: t('admin.roles.moderator'),
        color: 'warning',
        icon: <SupervisorAccount fontSize='small' />,
    },
    Client: {
        label: t('admin.roles.client'),
        color: 'success',
        icon: <Person fontSize='small' />,
    },
});

// ─── Products table ───────────────────────────────────────────────────────────

export const ProductsTable = ({
    products,
}: {
    products: MostPopularProduct[];
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const statusConfig = useMemo(() => getStatusConfig(t), [t]);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortKey, setSortKey] = useState<ProductSortKey>('likes');
    const [order, setOrder] = useState<Order>('desc');
    const [page, setPage] = useState(1);

    const handleSort = (key: ProductSortKey) => {
        if (sortKey === key) setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
        else {
            setSortKey(key);
            setOrder('desc');
        }
        setPage(1);
    };

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return [...products]
            .filter(
                (p) =>
                    (!q ||
                        p.name.toLowerCase().includes(q) ||
                        p.seller.name.toLowerCase().includes(q)) &&
                    (!statusFilter || p.status === statusFilter),
            )
            .sort((a, b) => {
                const mul = order === 'asc' ? 1 : -1;
                if (sortKey === 'name') {
                    return a.name.localeCompare(b.name, 'ar') * mul;
                }
                return (a[sortKey] - b[sortKey]) * mul;
            });
    }, [products, search, statusFilter, sortKey, order]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
    // clamp وقت الرندر بدل تخزين state إضافي/effect — page ممكن توصل رقم أكبر من pageCount
    // مؤقتاً (بعد فلترة تقلل النتائج) لحد ما المستخدم يتفاعل مرة تانية
    const currentPage = Math.min(page, pageCount);

    const paged = filtered.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE,
    );

    return (
        <Box>
            {/* Toolbar */}
            <Box
                display='flex'
                gap={2}
                mb={2}
                flexWrap='wrap'
                alignItems='center'
            >
                <TextField
                    size='small'
                    placeholder={t('admin.products.searchPlaceholder')}
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <Search fontSize='small' />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 200 }}
                />

                <FormControl size='small' sx={{ minWidth: 130 }}>
                    <InputLabel>{t('admin.products.status')}</InputLabel>
                    <Select
                        value={statusFilter}
                        label={t('admin.products.status')}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <MenuItem value=''>{t('common.all')}</MenuItem>
                        <MenuItem value='active'>
                            {t('admin.status.active')}
                        </MenuItem>
                        <MenuItem value='sold'>
                            {t('admin.status.sold')}
                        </MenuItem>
                        <MenuItem value='pending'>
                            {t('admin.status.pending')}
                        </MenuItem>
                    </Select>
                </FormControl>

                <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ marginInlineStart: 'auto' }}
                >
                    {t('admin.products.resultsCount', {
                        count: filtered.length,
                    })}
                </Typography>
            </Box>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: 3 }}
            >
                <Table size='small'>
                    <TableHead
                        sx={{
                            bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        }}
                    >
                        <TableRow>
                            <TableCell width={50} align='center'>
                                #
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortKey === 'name'}
                                    direction={
                                        sortKey === 'name' ? order : 'desc'
                                    }
                                    onClick={() => handleSort('name')}
                                >
                                    {t('admin.products.product')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                {t('admin.products.seller')}
                            </TableCell>
                            <TableCell align='center'>
                                {t('admin.products.category')}
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel
                                    active={sortKey === 'likes'}
                                    direction={
                                        sortKey === 'likes' ? order : 'desc'
                                    }
                                    onClick={() => handleSort('likes')}
                                >
                                    {t('admin.products.likes')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel
                                    active={sortKey === 'price'}
                                    direction={
                                        sortKey === 'price' ? order : 'desc'
                                    }
                                    onClick={() => handleSort('price')}
                                >
                                    {t('admin.products.price')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                {t('admin.products.statusLabel')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paged.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    align='center'
                                    sx={{ py: 6 }}
                                >
                                    <Typography color='text.secondary'>
                                        {t('admin.products.noResults')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paged.map((product, i) => {
                                const globalIndex =
                                    (currentPage - 1) * ROWS_PER_PAGE + i;
                                const status =
                                    statusConfig[
                                        product.status as keyof typeof statusConfig
                                    ];

                                return (
                                    <TableRow
                                        key={product.id}
                                        hover
                                        sx={{ transition: 'background .2s' }}
                                    >
                                        <TableCell align='center'>
                                            <MedalAvatar index={globalIndex} />
                                        </TableCell>

                                        <TableCell>
                                            <Box
                                                display='flex'
                                                alignItems='center'
                                                gap={1}
                                            >
                                                <Link
                                                    to={`${productsPathes.postsDetails}/${product.category}/${product.name}/${product.id}`}
                                                >
                                                    <Avatar
                                                        src={
                                                            product.image ||
                                                            undefined
                                                        }
                                                        alt={product.name}
                                                        variant='rounded'
                                                        sx={{
                                                            width: 44,
                                                            height: 44,
                                                        }}
                                                    >
                                                        {product.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </Avatar>
                                                </Link>

                                                <Box>
                                                    <Typography
                                                        variant='body2'
                                                        fontWeight={600}
                                                    >
                                                        {product.name}
                                                    </Typography>
                                                    <Box
                                                        display='flex'
                                                        gap={0.5}
                                                        alignItems='center'
                                                        mt={0.3}
                                                    >
                                                        <Visibility
                                                            sx={{
                                                                fontSize: 12,
                                                                color: 'text.secondary',
                                                            }}
                                                        />
                                                        <Typography
                                                            variant='caption'
                                                            color='text.secondary'
                                                        >
                                                            {product.views}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell align='center'>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                            >
                                                {product.seller.name ||
                                                    t('common.unknown')}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align='center'>
                                            <Chip
                                                label={getCategoryName(
                                                    product.category,
                                                )}
                                                size='small'
                                                variant='outlined'
                                                sx={{ borderRadius: 2 }}
                                            />
                                        </TableCell>

                                        <TableCell align='center'>
                                            <Box
                                                display='flex'
                                                alignItems='center'
                                                justifyContent='center'
                                                gap={0.5}
                                            >
                                                <ThumbUp
                                                    sx={{
                                                        fontSize: 13,
                                                        color: 'primary.main',
                                                    }}
                                                />
                                                <Typography
                                                    variant='body2'
                                                    fontWeight={600}
                                                >
                                                    {product.likes}
                                                </Typography>
                                            </Box>
                                        </TableCell>

                                        <TableCell align='center'>
                                            <Typography
                                                variant='body2'
                                                fontWeight={700}
                                                color='primary'
                                            >
                                                {formatPrice(product.price)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align='center'>
                                            <Chip
                                                label={
                                                    status?.label ??
                                                    product.status
                                                }
                                                color={
                                                    status?.color ?? 'default'
                                                }
                                                size='small'
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {pageCount > 1 && (
                <Box display='flex' justifyContent='center' mt={2}>
                    <Pagination
                        count={pageCount}
                        page={currentPage}
                        onChange={(_, v) => setPage(v)}
                        size='small'
                        color='primary'
                    />
                </Box>
            )}
        </Box>
    );
};

// ─── Sellers table ────────────────────────────────────────────────────────────

export const SellersTable = ({ sellers }: { sellers: TopSeller[] }) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const roleConfig = useMemo(() => getRoleConfig(t), [t]);

    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return sellers.filter((s) => !q || s.name.toLowerCase().includes(q));
    }, [sellers, search]);

    return (
        <Box>
            <Box mb={2}>
                <TextField
                    size='small'
                    placeholder={t('admin.sellers.searchPlaceholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <Search fontSize='small' />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 200 }}
                />
            </Box>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: 3 }}
            >
                <Table size='small'>
                    <TableHead
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                        }}
                    >
                        <TableRow>
                            <TableCell width={50} align='center'>
                                #
                            </TableCell>
                            <TableCell>{t('admin.sellers.seller')}</TableCell>
                            <TableCell align='center'>
                                {t('admin.sellers.productsCount')}
                            </TableCell>
                            <TableCell align='center'>
                                {t('admin.sellers.engagement')}
                            </TableCell>
                            <TableCell align='center'>
                                {t('admin.sellers.totalValue')}
                            </TableCell>
                            <TableCell align='center'>
                                {t('admin.sellers.role')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    align='center'
                                    sx={{ py: 6 }}
                                >
                                    <Typography color='text.secondary'>
                                        {t('admin.sellers.noResults')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((seller, index) => {
                                const role =
                                    roleConfig[seller.role] ??
                                    roleConfig.Client;

                                const avgEngagement =
                                    seller.productsCount > 0
                                        ? Math.round(
                                              (seller.totalLikes +
                                                  seller.totalViews) /
                                                  seller.productsCount,
                                          )
                                        : 0;

                                const avgValue =
                                    seller.productsCount > 0
                                        ? Math.round(
                                              seller.totalValue /
                                                  seller.productsCount,
                                          )
                                        : 0;

                                return (
                                    <TableRow
                                        key={seller._id}
                                        hover
                                        sx={{ transition: 'background .2s' }}
                                    >
                                        <TableCell align='center'>
                                            <MedalAvatar index={index} />
                                        </TableCell>

                                        <TableCell>
                                            <Box
                                                display='flex'
                                                alignItems='center'
                                                gap={1.5}
                                            >
                                                <Avatar
                                                    src={seller.avatar}
                                                    alt={seller.name}
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                    }}
                                                >
                                                    {seller.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </Avatar>
                                                <Box>
                                                    <Typography
                                                        variant='body2'
                                                        fontWeight={600}
                                                    >
                                                        {seller.name}
                                                    </Typography>
                                                    <Typography
                                                        variant='caption'
                                                        color='text.secondary'
                                                    >
                                                        {t(
                                                            'admin.sellers.productsLabel',
                                                            {
                                                                count: seller.productsCount,
                                                            },
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell align='center'>
                                            <Chip
                                                label={seller.productsCount}
                                                color='primary'
                                                size='medium'
                                                sx={{
                                                    fontWeight: 700,
                                                    minWidth: 44,
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell align='center'>
                                            <Box
                                                display='flex'
                                                gap={0.5}
                                                justifyContent='center'
                                                alignItems='center'
                                                flexWrap='wrap'
                                            >
                                                <Chip
                                                    size='small'
                                                    icon={
                                                        <ThumbUp
                                                            sx={{
                                                                fontSize: 13,
                                                            }}
                                                        />
                                                    }
                                                    label={seller.totalLikes}
                                                    variant='outlined'
                                                />
                                                <Chip
                                                    size='small'
                                                    icon={
                                                        <Visibility
                                                            sx={{
                                                                fontSize: 13,
                                                            }}
                                                        />
                                                    }
                                                    label={seller.totalViews.toLocaleString()}
                                                    variant='outlined'
                                                />
                                            </Box>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                            >
                                                {t('admin.sellers.average')}:{' '}
                                                {avgEngagement.toLocaleString()}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align='center'>
                                            <Typography
                                                variant='body2'
                                                fontWeight={700}
                                                color='primary'
                                            >
                                                {formatPrice(seller.totalValue)}
                                            </Typography>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                            >
                                                {formatPrice(avgValue)}{' '}
                                                {t('admin.sellers.average')}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align='center'>
                                            <Chip
                                                icon={role.icon}
                                                label={role.label}
                                                color={role.color}
                                                size='small'
                                                variant='filled'
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};