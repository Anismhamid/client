import React, { FunctionComponent } from 'react';

import {
    Avatar,
    Box,
    Checkbox,
    Chip,
    FormControl,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Tooltip,
    Typography,
    useTheme,
    alpha,
    IconButton,
    Badge,
} from '@mui/material';

import {
    AdminPanelSettings as AdminIcon,
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    People as PeopleIcon,
} from '@mui/icons-material';

import RoleType from '../../../../interfaces/UserType';
import { User } from '../../../../interfaces/User';
import { fontAwesomeIcon } from '../../../../FontAwesome/Icons';
import UserStatusSwitch from './UserStatusSwitch';
import { UserPermission } from '../../../../services/usersServices';
import { Link } from 'react-router-dom';

// ============================================
// الأنواع والثوابت
// ============================================

interface UsersTableProps {
    users: User[];
    loading: boolean;
    selectedUserIds: string[];
    onSelectionChange: (ids: string[]) => void;
    onEdit: (userId: string) => void;
    onDelete: (userId: string) => void;
    onRoleChange: (email: string, role: string) => Promise<void>;
    onAccountStatusChange: (userId: string, isActive: boolean) => Promise<boolean>;
    onPermissionChange: (userId: string, permission: UserPermission, enabled: boolean) => Promise<boolean>;
}

const ROLE_LABELS: Record<RoleType, string> = {
    [RoleType.Admin]: 'مدير',
    [RoleType.Moderator]: 'مشرف',
    [RoleType.Client]: 'مستخدم',
};

const ROLE_COLORS: Record<RoleType, 'error' | 'warning' | 'info'> = {
    [RoleType.Admin]: 'error',
    [RoleType.Moderator]: 'warning',
    [RoleType.Client]: 'info',
};

const PERMISSION_FIELDS: {
    key: UserPermission;
    label: string;
    icon: React.ReactNode;
}[] = [
    { key: 'canLogin', label: 'تسجيل الدخول', icon: fontAwesomeIcon.loginLock },
    { key: 'canCreatePosts', label: 'إنشاء المنشورات', icon: fontAwesomeIcon.postLock },
    { key: 'canSendMessages', label: 'إرسال الرسائل', icon: fontAwesomeIcon.messageLock },
    { key: 'canSendOffers', label: 'إرسال العروض', icon: fontAwesomeIcon.offerLock },
    { key: 'canUseAccount', label: 'استخدام الحساب', icon: fontAwesomeIcon.loginLock },
    { key: 'canAccessExistingData', label: 'الوصول للبيانات', icon: fontAwesomeIcon.databaseLock },
];

// ============================================
// مكونات مساعدة (Helper Components)
// ============================================

const HEAD_CELL_SX = {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    py: 1.5,
    position: 'sticky',
    top: 0,
    zIndex: 10,
} as const;

// مكون عرض المستخدم مع الـ Link
const UserCell: FunctionComponent<{ user: User; isActive: boolean }> = ({ user, isActive }) => {
    const theme = useTheme();

    return (
        <Link to={`/users/customer/${user.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        isActive ? (
                            <CheckCircleIcon
                                sx={{
                                    fontSize: 14,
                                    color: 'success.main',
                                    bgcolor: 'white',
                                    borderRadius: '50%',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            />
                        ) : (
                            <BlockIcon
                                sx={{
                                    fontSize: 14,
                                    color: 'error.main',
                                    bgcolor: 'white',
                                    borderRadius: '50%',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            />
                        )
                    }
                >
                    <Avatar
                        src={user.image?.url}
                        alt={`${user.name.first} ${user.name.last}`}
                        sx={{
                            width: 40,
                            height: 40,
                            fontSize: 14,
                            fontWeight: 700,
                            bgcolor: user.status
                                ? alpha(theme.palette.success.main, 0.15)
                                : alpha(theme.palette.grey[400], 0.3),
                            color: user.status ? 'success.main' : 'text.secondary',
                            border: `2px solid ${user.status ? theme.palette.success.main : theme.palette.divider}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                        }}
                    >
                        {user.name.first?.[0]}
                    </Avatar>
                </Badge>

                <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography variant="body2" fontWeight={700} noWrap>
                            {user.name.first} {user.name.last}
                        </Typography>
                        {user.role === RoleType.Admin && (
                            <AdminIcon sx={{ fontSize: 16, color: 'error.main' }} />
                        )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                        {user.email}
                    </Typography>
                    {user.phone && (
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', fontSize: '0.65rem' }}>
                            📱 {user.phone.phone_1||''} {user.phone.phone_2 ? ` | ${user.phone.phone_2}` : ''}
                        </Typography>
                    )}
                </Box>
            </Stack>
        </Link>
    );
};

// مكون الصلاحيات
const PermissionGrid: FunctionComponent<{
    user: User;
    onPermissionChange: (userId: string, permission: UserPermission, enabled: boolean) => Promise<boolean>;
}> = ({ user, onPermissionChange }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 0.75,
                width: 140,
                mx: 'auto',
            }}
        >
            {PERMISSION_FIELDS.map((field) => {
                const enabled = user.permissions?.[field.key] ?? true;

                return (
                    <Tooltip key={field.key} title={field.label} arrow placement="top">
                        <Box
                            onClick={() => onPermissionChange(user._id!, field.key, !enabled)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 30,
                                borderRadius: 1.5,
                                fontSize: 13,
                                cursor: 'pointer',
                                userSelect: 'none',
                                transition: 'all 0.2s ease',
                                bgcolor: enabled
                                    ? alpha(theme.palette.success.main, 0.12)
                                    : alpha(theme.palette.error.main, 0.08),
                                color: enabled ? 'success.main' : 'error.main',
                                '&:hover': {
                                    transform: 'scale(1.15)',
                                    bgcolor: enabled
                                        ? alpha(theme.palette.success.main, 0.25)
                                        : alpha(theme.palette.error.main, 0.2),
                                },
                                '&:active': {
                                    transform: 'scale(0.95)',
                                },
                            }}
                        >
                            {field.icon}
                        </Box>
                    </Tooltip>
                );
            })}
        </Box>
    );
};

// ============================================
// المكون الرئيسي
// ============================================

const UsersTable: FunctionComponent<UsersTableProps> = ({
    users,
    loading,
    selectedUserIds,
    onSelectionChange,
    onEdit,
    onDelete,
    onRoleChange,
    onAccountStatusChange,
    onPermissionChange,
}) => {
    const theme = useTheme();

    // ============================================
    // 🔒 جميع الوظائف الأصلية محفوظة بالكامل
    // ============================================

    const allSelected =
        users.length > 0 &&
        users.every((user) => selectedUserIds.includes(user._id!));

    const someSelected =
        users.some((user) => selectedUserIds.includes(user._id!)) &&
        !allSelected;

    const handleSelectAll = () => {
        if (allSelected) {
            const currentPageIds = users.map((user) => user._id!);
            onSelectionChange(
                selectedUserIds.filter((id) => !currentPageIds.includes(id)),
            );
            return;
        }

        const newIds = [
            ...selectedUserIds,
            ...users
                .map((user) => user._id!)
                .filter((id) => !selectedUserIds.includes(id)),
        ];

        onSelectionChange(newIds);
    };

    const handleSelectUser = (userId: string) => {
        if (selectedUserIds.includes(userId)) {
            onSelectionChange(selectedUserIds.filter((id) => id !== userId));
        } else {
            onSelectionChange([...selectedUserIds, userId]);
        }
    };

    // ============================================
    // 📊 حالات التحميل والفارغة
    // ============================================

    if (loading) {
        return (
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        py: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <CircularProgress size={48} thickness={4} />
                    <Typography variant="body2" color="text.secondary">
                        جاري تحميل المستخدمين...
                    </Typography>
                </Box>
            </Paper>
        );
    }

    if (users.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    py: 10,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1.5,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: 'primary.main',
                        }}
                    >
                        <PeopleIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600}>
                        لا يوجد مستخدمين
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        لم يتم العثور على أي مستخدمين في النظام
                    </Typography>
                </Box>
            </Paper>
        );
    }

    // ============================================
    // 🎨 التصيير الرئيسي
    // ============================================

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                overflowX: 'auto',
                maxHeight: 640,
                position: 'relative',
            }}
        >
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={HEAD_CELL_SX} padding="checkbox">
                            <Checkbox
                                checked={allSelected}
                                indeterminate={someSelected}
                                onChange={handleSelectAll}
                                sx={{
                                    color: 'white',
                                    '&.Mui-checked': { color: 'white' },
                                    '&.MuiCheckbox-indeterminate': { color: 'white' },
                                }}
                            />
                        </TableCell>

                        <TableCell align="right" sx={HEAD_CELL_SX}>
                            المستخدم
                        </TableCell>

                        <TableCell align="center" sx={HEAD_CELL_SX}>
                            الدور
                        </TableCell>

                        <TableCell align="center" sx={HEAD_CELL_SX}>
                            حالة الحساب
                        </TableCell>

                        <TableCell align="center" sx={HEAD_CELL_SX}>
                            النشاط
                        </TableCell>

                        <TableCell align="center" sx={HEAD_CELL_SX}>
                            الصلاحيات
                        </TableCell>

                        <TableCell align="center" sx={HEAD_CELL_SX}>
                            الإجراءات
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {users.map((user, index) => {
                        const selected = selectedUserIds.includes(user._id!);
                        const isActive = user.accountStatus === 'active';
                        const roleColor = ROLE_COLORS[user.role];

                        return (
                            <TableRow
                                key={user._id}
                                hover
                                selected={selected}
                                sx={{
                                    bgcolor:
                                        index % 2 === 0
                                            ? 'transparent'
                                            : alpha(theme.palette.action.hover, 0.3),
                                    transition: 'background-color 0.15s ease',
                                    '&.Mui-selected': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        },
                                    },
                                }}
                            >
                                {/* ✅ Checkbox */}
                                <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                        checked={selected}
                                        onChange={() => handleSelectUser(user._id!)}
                                        sx={{
                                            '&.Mui-checked': {
                                                color: 'primary.main',
                                            },
                                        }}
                                    />
                                </TableCell>

                                {/* ✅ المستخدم */}
                                <TableCell align="right">
                                    <UserCell user={user} isActive={isActive} />
                                </TableCell>

                                {/* ✅ الدور */}
                                <TableCell align="center">
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <Select
                                            value={user.role}
                                            onChange={(event) =>
                                                onRoleChange(user.email, event.target.value)
                                            }
                                            sx={{
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                fontSize: '0.8125rem',
                                                '& .MuiSelect-select': { py: 0.75 },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: alpha(theme.palette[roleColor].main, 0.3),
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette[roleColor].main,
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette[roleColor].main,
                                                },
                                            }}
                                        >
                                            {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                                <MenuItem key={value} value={value} sx={{ fontWeight: 600 }}>
                                                    {label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                {/* ✅ حالة الحساب */}
                                <TableCell align="center">
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <UserStatusSwitch
                                            userId={user._id!}
                                            isActive={user.accountStatus === 'active'}
                                            onChange={onAccountStatusChange}
                                        />

                                        <Chip
                                            label={user.accountStatus === 'active' ? 'نشط' : 'معطل'}
                                            color={user.accountStatus === 'active' ? 'success' : 'error'}
                                            size="small"
                                            sx={{ fontWeight: 700, minWidth: 48 }}
                                        />
                                    </Stack>
                                </TableCell>

                                {/* ✅ النشاط */}
                                <TableCell align="center">
                                    <Chip
                                        icon={
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: user.status ? 'success.main' : 'error.main',
                                                    ml: '6px',
                                                    animation: user.status ? 'pulse 2s infinite' : 'none',
                                                    '@keyframes pulse': {
                                                        '0%': { opacity: 1, transform: 'scale(1)' },
                                                        '50%': { opacity: 0.5, transform: 'scale(0.8)' },
                                                        '100%': { opacity: 1, transform: 'scale(1)' },
                                                    },
                                                }}
                                            />
                                        }
                                        label={user.status ? '🟢 متصل' : '🔴 غير متصل'}
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            borderColor: user.status ? 'success.main' : 'error.main',
                                            color: user.status ? 'success.main' : 'error.main',
                                        }}
                                    />
                                </TableCell>

                                {/* ✅ الصلاحيات */}
                                <TableCell align="center">
                                    <PermissionGrid user={user} onPermissionChange={onPermissionChange} />
                                </TableCell>

                                {/* ✅ الإجراءات */}
                                <TableCell align="center">
                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                        <Tooltip title="تعديل" arrow>
                                            <IconButton
                                                onClick={() => onEdit(user._id!)}
                                                size="small"
                                                sx={{
                                                    bgcolor: alpha(theme.palette.warning.main, 0.08),
                                                    color: 'warning.main',
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.warning.main, 0.2),
                                                        transform: 'scale(1.05)',
                                                    },
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {fontAwesomeIcon.edit}
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="حذف" arrow>
                                            <IconButton
                                                onClick={() => onDelete(user._id!)}
                                                size="small"
                                                sx={{
                                                    bgcolor: alpha(theme.palette.error.main, 0.08),
                                                    color: 'error.main',
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.error.main, 0.2),
                                                        transform: 'scale(1.05)',
                                                    },
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {fontAwesomeIcon.trash}
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersTable;