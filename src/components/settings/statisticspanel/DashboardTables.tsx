import { useState, useMemo, JSX } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Chip, Typography, Avatar, TextField, MenuItem,
    Select, FormControl, InputLabel, TableSortLabel, Pagination,
    InputAdornment,
} from '@mui/material';
import { Search, ThumbUp, Visibility, AdminPanelSettings, SupervisorAccount, Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material';

import { MostPopularProduct, TopSeller } from './statisticsUtils';
import { MedalAvatar } from './DashboardComponents';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import { productsPathes } from '../../../routes/routes';
import { getCategoryName } from './statisticsUtils';

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductSortKey = 'name' | 'likes' | 'views' | 'price';
type Order = 'asc' | 'desc';

const ROWS_PER_PAGE = 5;

// ─── Status helpers ───────────────────────────────────────────────────────────

const statusConfig = {
    active: { label: 'متاح', color: 'success' as const },
    sold: { label: 'مباع', color: 'error' as const },
    pending: { label: 'قيد المراجعة', color: 'warning' as const },
};

const roleConfig: Record<string, { label: string; color: 'error' | 'warning' | 'success' | 'info'; icon: JSX.Element }> = {
    Admin: { label: 'مدير', color: 'error', icon: <AdminPanelSettings fontSize='small' /> },
    Moderator: { label: 'مشرف', color: 'warning', icon: <SupervisorAccount fontSize='small' /> },
    Client: { label: 'عميل', color: 'success', icon: <Person fontSize='small' /> },
};

// ─── Products table ───────────────────────────────────────────────────────────

export const ProductsTable = ({ products }: { products: MostPopularProduct[] }) => {
    const theme = useTheme();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortKey, setSortKey] = useState<ProductSortKey>('likes');
    const [order, setOrder] = useState<Order>('desc');
    const [page, setPage] = useState(1);

    const handleSort = (key: ProductSortKey) => {
        if (sortKey === key) setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
        else { setSortKey(key); setOrder('desc'); }
        setPage(1);
    };

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return [...products]
            .filter((p) =>
                (!q || p.name.toLowerCase().includes(q) || p.seller.slug.includes(q)) &&
                (!statusFilter || p.status === statusFilter),
            )
            .sort((a, b) => {
                const mul = order === 'asc' ? 1 : -1;
                if (sortKey === 'name') return a.name.localeCompare(b.name, 'ar') * mul;
                return (a[sortKey] - b[sortKey]) * mul;
            });
    }, [products, search, statusFilter, sortKey, order]);

    const pageCount = Math.ceil(filtered.length / ROWS_PER_PAGE);
    const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

    return (
        <Box>
            {/* Toolbar */}
            <Box display='flex' gap={2} mb={2} flexWrap='wrap' alignItems='center'>
                <TextField
                    size='small'
                    placeholder='بحث عن منتج...'
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    InputProps={{ startAdornment: <InputAdornment position='start'><Search fontSize='small' /></InputAdornment> }}
                    sx={{ minWidth: 200 }}
                />
                <FormControl size='small' sx={{ minWidth: 130 }}>
                    <InputLabel>الحالة</InputLabel>
                    <Select
                        value={statusFilter}
                        label='الحالة'
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    >
                        <MenuItem value=''>الكل</MenuItem>
                        <MenuItem value='active'>متاح</MenuItem>
                        <MenuItem value='sold'>مباع</MenuItem>
                    </Select>
                </FormControl>
                <Typography variant='caption' color='text.secondary' sx={{ mr: 'auto' }}>
                    {filtered.length} نتيجة
                </Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3 }}>
                <Table size='small'>
                    <TableHead sx={{ bgcolor: alpha(theme.palette.secondary.main, .05) }}>
                        <TableRow>
                            <TableCell width={50} align='center'>#</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortKey === 'name'}
                                    direction={sortKey === 'name' ? order : 'desc'}
                                    onClick={() => handleSort('name')}
                                >
                                    المنتج
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>البائع</TableCell>
                            <TableCell align='center'>الفئة</TableCell>
                            <TableCell align='center'>
                                <TableSortLabel
                                    active={sortKey === 'likes'}
                                    direction={sortKey === 'likes' ? order : 'desc'}
                                    onClick={() => handleSort('likes')}
                                >
                                    إعجابات
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel
                                    active={sortKey === 'price'}
                                    direction={sortKey === 'price' ? order : 'desc'}
                                    onClick={() => handleSort('price')}
                                >
                                    السعر
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>الحالة</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paged.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align='center' sx={{ py: 6 }}>
                                    <Typography color='text.secondary'>لا توجد نتائج</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paged.map((product, i) => {
                                const globalIndex = (page - 1) * ROWS_PER_PAGE + i;
                                const status = statusConfig[product.status as keyof typeof statusConfig];
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
                                            <Box display='flex' alignItems='center' gap={1}>
                                                <Link to={`${productsPathes.postsDetails}/${product.category}/${product.name}/${product.id}`}>
                                                    {product.image && (
                                                        <Avatar
                                                            src={product.image}
                                                            alt={product.name}
                                                            variant='rounded'
                                                            sx={{ width: 44, height: 44 }}
                                                        />
                                                    )}
                                                </Link>
                                                <Box>
                                                    <Typography variant='body2' fontWeight={600}>{product.name}</Typography>
                                                    <Box display='flex' gap={0.5} alignItems='center' mt={0.3}>
                                                        <Visibility sx={{ fontSize: 12, color: 'text.secondary' }} />
                                                        <Typography variant='caption' color='text.secondary'>{product.views}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Typography variant='caption' color='text.secondary'>
                                                @{product.seller.slug || 'غير محدد'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Chip label={getCategoryName(product.category)} size='small' variant='outlined' sx={{ borderRadius: 2 }} />
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Box display='flex' alignItems='center' justifyContent='center' gap={0.5}>
                                                <ThumbUp sx={{ fontSize: 13, color: 'primary.main' }} />
                                                <Typography variant='body2' fontWeight={600}>{product.likes}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Typography variant='body2' fontWeight={700} color='primary'>
                                                {formatPrice(product.price)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Chip
                                                label={status?.label ?? product.status}
                                                color={status?.color ?? 'default'}
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
                        page={page}
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
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return sellers.filter((s) => !q || s.name.toLowerCase().includes(q));
    }, [sellers, search]);

    return (
        <Box>
            <Box mb={2}>
                <TextField
                    size='small'
                    placeholder='بحث عن بائع...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position='start'><Search fontSize='small' /></InputAdornment> }}
                    sx={{ minWidth: 200 }}
                />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3 }}>
                <Table size='small'>
                    <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, .05) }}>
                        <TableRow>
                            <TableCell width={50} align='center'>#</TableCell>
                            <TableCell>البائع</TableCell>
                            <TableCell align='center'>المنتجات</TableCell>
                            <TableCell align='center'>التفاعل</TableCell>
                            <TableCell align='center'>القيمة الإجمالية</TableCell>
                            <TableCell align='center'>الدور</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align='center' sx={{ py: 6 }}>
                                    <Typography color='text.secondary'>لا يوجد بائعين نشطين</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((seller, index) => {
                                const role = roleConfig[seller.role] ?? roleConfig.Client;
                                return (
                                    <TableRow key={seller._id} hover sx={{ transition: 'background .2s' }}>
                                        <TableCell align='center'>
                                            <MedalAvatar index={index} />
                                        </TableCell>
                                        <TableCell>
                                            <Box display='flex' alignItems='center' gap={1.5}>
                                                <Avatar src={seller.avatar} alt={seller.name} sx={{ width: 40, height: 40 }}>
                                                    {seller.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant='body2' fontWeight={600}>{seller.name}</Typography>
                                                    <Typography variant='caption' color='text.secondary'>
                                                        {seller.productsCount} منتج
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Chip label={seller.productsCount} color='primary' size='medium' sx={{ fontWeight: 700, minWidth: 44 }} />
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Box display='flex' gap={0.5} justifyContent='center' alignItems='center' flexWrap='wrap'>
                                                <Chip size='small' icon={<ThumbUp sx={{ fontSize: 13 }} />} label={seller.totalLikes} variant='outlined' />
                                                <Chip size='small' icon={<Visibility sx={{ fontSize: 13 }} />} label={seller.totalViews.toLocaleString()} variant='outlined' />
                                            </Box>
                                            <Typography variant='caption' color='text.secondary'>
                                                متوسط:{' '}
                                                {seller.productsCount > 0
                                                    ? Math.round((seller.totalLikes + seller.totalViews) / seller.productsCount)
                                                    : 0}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Typography variant='body2' fontWeight={700} color='primary'>
                                                {formatPrice(seller.totalValue)}
                                            </Typography>
                                            <Typography variant='caption' color='text.secondary'>
                                                {seller.productsCount > 0
                                                    ? formatPrice(Math.round(seller.totalValue / seller.productsCount))
                                                    : 0}{' '}
                                                متوسط
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Chip icon={role.icon} label={role.label} color={role.color} size='small' variant='filled' />
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
