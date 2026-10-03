import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import {
    Avatar,
    Badge,
    Box,
    Checkbox,
    FormControl,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';

import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';

import RoleType from '../../../../interfaces/UserType';
import { User } from '../../../../interfaces/User';
import { fontAwesomeIcon } from '../../../../FontAwesome/Icons';
import { UserPermission } from '../../../../services/usersServices';
import UserStatusSwitch from './UserStatusSwitch';
import UsersEmptyState from './UsersEmptyState';

// ============================================
// Types & constants
// ============================================

interface UsersTableProps {
    users: User[];
    loading: boolean;
    filtered?: boolean;
    selectedUserIds: string[];
    onSelectionChange: (ids: string[]) => void;
    onEdit: (userId: string) => void;
    onDelete: (userId: string) => void;
    onRoleChange: (email: string, role: string) => Promise<void>;
    onAccountStatusChange: (userId: string, isActive: boolean) => Promise<boolean>;
    onPermissionChange: (
        userId: string,
        permission: UserPermission,
        enabled: boolean,
    ) => Promise<boolean>;
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

const HEAD_CELL_SX = {
    color: 'text.secondary',
    fontWeight: 600,
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
    py: 1.5,
    borderBottom: 'none',
    textAlign: 'start',
} as const;

// ============================================
// User cell
// ============================================

const UserCell: FunctionComponent<{ user: User; isActive: boolean }> = ({
    user,
    isActive,
}) => {
    const theme = useTheme();
    const online = Boolean(user.status);

    return (
        <Link
            to={`/users/customer/${user.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
        >
            <Stack
                direction='row'
                spacing={1.5}
                alignItems='center'
                sx={{ opacity: isActive ? 1 : 0.6 }}
            >
                <Badge
                    overlap='circular'
                    variant='dot'
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{
                        '& .MuiBadge-badge': {
                            width: 11,
                            height: 11,
                            minWidth: 0,
                            borderRadius: '50%',
                            bgcolor: online
                                ? theme.palette.success.main
                                : theme.palette.grey[400],
                            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                        },
                    }}
                >
                    <Avatar
                        src={user.image?.url}
                        alt={`${user.name.first} ${user.name.last}`}
                        sx={{
                            width: 42,
                            height: 42,
                            fontSize: 15,
                            fontWeight: 700,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: 'primary.main',
                        }}
                    >
                        {user.name.first?.[0]}
                    </Avatar>
                </Badge>

                <Box sx={{ minWidth: 0 }}>
                    <Stack direction='row' alignItems='center' spacing={0.5}>
                        <Typography variant='body2' fontWeight={700} noWrap>
                            {user.name.first} {user.name.last}
                        </Typography>

                        {user.role === RoleType.Admin && (
                            <AdminIcon sx={{ fontSize: 16, color: 'error.main' }} />
                        )}
                    </Stack>

                    <Typography
                        variant='caption'
                        color='text.secondary'
                        noWrap
                        sx={{ display: 'block' }}
                    >
                        {user.email}
                    </Typography>

                    {user.phone?.phone_1 && (
                        <Typography
                            variant='caption'
                            color='text.secondary'
                            noWrap
                            dir='ltr'
                            sx={{ display: 'block', textAlign: 'start' }}
                        >
                            {user.phone.phone_1}
                            {user.phone.phone_2 ? ` · ${user.phone.phone_2}` : ''}
                        </Typography>
                    )}
                </Box>
            </Stack>
        </Link>
    );
};

// ============================================
// Permissions (one compact row)
// ============================================

const PermissionRow: FunctionComponent<{
    user: User;
    onPermissionChange: UsersTableProps['onPermissionChange'];
}> = ({ user, onPermissionChange }) => {
    const theme = useTheme();

    return (
        <Stack direction='row' spacing={0.5}>
            {PERMISSION_FIELDS.map((field) => {
                const enabled = user.permissions?.[field.key] ?? true;
                const color = enabled
                    ? theme.palette.success.main
                    : theme.palette.error.main;

                return (
                    <Tooltip
                        key={field.key}
                        title={`${field.label}: ${enabled ? 'مفعّل' : 'معطّل'}`}
                        arrow
                        placement='top'
                    >
                        <IconButton
                            size='small'
                            aria-pressed={enabled}
                            aria-label={field.label}
                            onClick={() =>
                                onPermissionChange(user._id!, field.key, !enabled)
                            }
                            sx={{
                                width: 30,
                                height: 30,
                                fontSize: 12,
                                borderRadius: 1.5,
                                color,
                                bgcolor: alpha(color, enabled ? 0.1 : 0.08),
                                opacity: enabled ? 1 : 0.75,
                                '&:hover': { bgcolor: alpha(color, 0.2) },
                            }}
                        >
                            {field.icon}
                        </IconButton>
                    </Tooltip>
                );
            })}
        </Stack>
    );
};

// ============================================
// Main
// ============================================

const UsersTable: FunctionComponent<UsersTableProps> = ({
    users,
    loading,
    filtered = false,
    selectedUserIds,
    onSelectionChange,
    onEdit,
    onDelete,
    onRoleChange,
    onAccountStatusChange,
    onPermissionChange,
}) => {
    const theme = useTheme();

    // ---------- Selection logic (unchanged) ----------
    const allSelected =
        users.length > 0 &&
        users.every((user) => selectedUserIds.includes(user._id!));

    const someSelected =
        users.some((user) => selectedUserIds.includes(user._id!)) && !allSelected;

    const handleSelectAll = () => {
        if (allSelected) {
            const currentPageIds = users.map((user) => user._id!);
            onSelectionChange(
                selectedUserIds.filter((id) => !currentPageIds.includes(id)),
            );
            return;
        }

        onSelectionChange([
            ...selectedUserIds,
            ...users
                .map((user) => user._id!)
                .filter((id) => !selectedUserIds.includes(id)),
        ]);
    };

    const handleSelectUser = (userId: string) => {
        if (selectedUserIds.includes(userId)) {
            onSelectionChange(selectedUserIds.filter((id) => id !== userId));
        } else {
            onSelectionChange([...selectedUserIds, userId]);
        }
    };

    const shellSx = {
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
    } as const;

    // ---------- Loading ----------
    if (loading) {
        return (
            <Paper elevation={0} sx={{ ...shellSx, p: 2 }}>
                <Stack spacing={1.5}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Stack key={index} direction='row' spacing={2} alignItems='center'>
                            <Skeleton variant='circular' width={42} height={42} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton width='30%' />
                                <Skeleton width='20%' />
                            </Box>
                            <Skeleton variant='rounded' width={110} height={32} />
                            <Skeleton variant='rounded' width={90} height={32} />
                        </Stack>
                    ))}
                </Stack>
            </Paper>
        );
    }

    // ---------- Empty ----------
    if (users.length === 0) {
        return (
            <Paper elevation={0} sx={shellSx}>
                <UsersEmptyState filtered={filtered} />
            </Paper>
        );
    }

    // ---------- Table ----------
    return (
        <TableContainer component={Paper} elevation={0} sx={{ ...shellSx, overflowX: 'auto' }}>
            <Table sx={{ minWidth: 960 }}>
                <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.text.primary, 0.03) }}>
                        <TableCell padding='checkbox' sx={HEAD_CELL_SX}>
                            <Checkbox
                                checked={allSelected}
                                indeterminate={someSelected}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell sx={HEAD_CELL_SX}>المستخدم</TableCell>
                        <TableCell sx={HEAD_CELL_SX}>الدور</TableCell>
                        <TableCell sx={HEAD_CELL_SX}>الحساب</TableCell>
                        <TableCell sx={HEAD_CELL_SX}>الصلاحيات</TableCell>
                        <TableCell sx={{ ...HEAD_CELL_SX, textAlign: 'center' }}>
                            إجراءات
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {users.map((user) => {
                        const selected = selectedUserIds.includes(user._id!);
                        const isActive = user.accountStatus === 'active';
                        const roleColor = ROLE_COLORS[user.role];
                        const roleMain = theme.palette[roleColor].main;

                        return (
                            <TableRow
                                key={user._id}
                                hover
                                selected={selected}
                                sx={{
                                    '& td': { py: 1.5 },
                                    '&:last-child td': { borderBottom: 0 },
                                    '&.Mui-selected': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        },
                                    },
                                }}
                            >
                                <TableCell
                                    padding='checkbox'
                                    sx={{
                                        borderInlineStart: '3px solid',
                                        borderInlineStartColor: selected
                                            ? 'primary.main'
                                            : 'transparent',
                                    }}
                                >
                                    <Checkbox
                                        checked={selected}
                                        onChange={() => handleSelectUser(user._id!)}
                                    />
                                </TableCell>

                                <TableCell sx={{ textAlign: 'start' }}>
                                    <UserCell user={user} isActive={isActive} />
                                </TableCell>

                                <TableCell sx={{ textAlign: 'start' }}>
                                    <FormControl size='small' sx={{ minWidth: 120 }}>
                                        <Select
                                            value={user.role}
                                            onChange={(event) =>
                                                onRoleChange(user.email, event.target.value)
                                            }
                                            sx={{
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                fontSize: '0.8125rem',
                                                color: roleMain,
                                                bgcolor: alpha(roleMain, 0.07),
                                                '& .MuiSelect-select': { py: 0.75 },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'transparent',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: alpha(roleMain, 0.5),
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: roleMain,
                                                },
                                            }}
                                        >
                                            {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                                <MenuItem
                                                    key={value}
                                                    value={value}
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    {label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                <TableCell sx={{ textAlign: 'start' }}>
                                    <Stack direction='row' alignItems='center' spacing={0.5}>
                                        <UserStatusSwitch
                                            userId={user._id!}
                                            isActive={isActive}
                                            onChange={onAccountStatusChange}
                                        />
                                        <Typography
                                            variant='body2'
                                            fontWeight={700}
                                            color={isActive ? 'success.main' : 'error.main'}
                                        >
                                            {isActive ? 'نشط' : 'معطّل'}
                                        </Typography>
                                    </Stack>
                                </TableCell>

                                <TableCell sx={{ textAlign: 'start' }}>
                                    <PermissionRow
                                        user={user}
                                        onPermissionChange={onPermissionChange}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Stack direction='row' spacing={0.5} justifyContent='center'>
                                        <Tooltip title='تعديل' arrow>
                                            <IconButton
                                                size='small'
                                                aria-label='تعديل'
                                                onClick={() => onEdit(user._id!)}
                                                sx={{
                                                    color: 'text.secondary',
                                                    '&:hover': {
                                                        color: 'primary.main',
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    },
                                                }}
                                            >
                                                {fontAwesomeIcon.edit}
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title='حذف' arrow>
                                            <IconButton
                                                size='small'
                                                aria-label='حذف'
                                                onClick={() => onDelete(user._id!)}
                                                sx={{
                                                    color: 'text.secondary',
                                                    '&:hover': {
                                                        color: 'error.main',
                                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                                    },
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