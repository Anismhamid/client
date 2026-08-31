import React, { FunctionComponent } from 'react';

import {
    Avatar,
    Box,
    Button,
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
} from '@mui/material';

import RoleType from '../../../../interfaces/UserType';
import { User } from '../../../../interfaces/User';
import { fontAwesomeIcon } from '../../../../FontAwesome/Icons';
import UserStatusSwitch from './UserStatusSwitch';
import { UserPermission } from '../../../../services/usersServices';

interface UsersTableProps {
    users: User[];

    loading: boolean;

    selectedUserIds: string[];

    onSelectionChange: (ids: string[]) => void;

    onEdit: (userId: string) => void;

    onDelete: (userId: string) => void;

    onRoleChange: (email: string, role: string) => Promise<void>;

    onAccountStatusChange: (
        userId: string,
        isActive: boolean,
    ) => Promise<boolean>;

    onPermissionChange: (
        userId: string,
        permission: UserPermission,
        enabled: boolean,
    ) => Promise<boolean>;
}

const ROLE_LABELS: Record<RoleType, string> = {
    [RoleType.Admin]: 'مدير',
    [RoleType.Moderator]: 'مشرف',
    [RoleType.Delivery]: 'مرسل',
    [RoleType.Client]: 'مستخدم',
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
    {
        key: 'canAccessExistingData',
        label: 'الوصول للبيانات',
        icon: fontAwesomeIcon.databaseLock,
    },
];

const HEAD_CELL_SX = {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    fontWeight: 700,
    whiteSpace: 'nowrap',
} as const;

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

    if (loading) {
        return (
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Box
                    sx={{
                        py: 8,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <CircularProgress />
                </Box>
            </TableContainer>
        );
    }

    if (users.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    py: 8,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: 'center',
                }}
            >
                <Typography color='text.secondary' fontWeight={600}>
                    لم يتم العثور على مستخدمين
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                overflowX: 'auto',
                maxHeight: 640,
            }}
        >
            <Table stickyHeader size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell align='center' sx={HEAD_CELL_SX} padding='checkbox'>
                            <Checkbox
                                checked={allSelected}
                                indeterminate={someSelected}
                                onChange={handleSelectAll}
                                sx={{ color: 'inherit' }}
                            />
                        </TableCell>

                        <TableCell align='right' sx={HEAD_CELL_SX}>
                            المستخدم
                        </TableCell>

                        <TableCell align='center' sx={HEAD_CELL_SX}>
                            الدور
                        </TableCell>

                        <TableCell align='center' sx={HEAD_CELL_SX}>
                            حالة الحساب
                        </TableCell>

                        <TableCell align='center' sx={HEAD_CELL_SX}>
                            النشاط
                        </TableCell>

                        <TableCell align='center' sx={HEAD_CELL_SX}>
                            الصلاحيات
                        </TableCell>

                        <TableCell align='center' sx={HEAD_CELL_SX}>
                            الإجراءات
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {users.map((user, index) => {
                        const selected = selectedUserIds.includes(user._id!);

                        return (
                            <TableRow
                                key={user._id}
                                hover
                                selected={selected}
                                sx={{
                                    bgcolor:
                                        index % 2 === 0
                                            ? 'transparent'
                                            : alpha(
                                                  theme.palette.action.hover,
                                                  0.4,
                                              ),
                                }}
                            >
                                <TableCell align='center' padding='checkbox'>
                                    <Checkbox
                                        checked={selected}
                                        onChange={() =>
                                            handleSelectUser(user._id!)
                                        }
                                    />
                                </TableCell>

                                {/* المستخدم: الاسم + الإيميل بخلية وحدة */}
                                <TableCell align='right'>
                                    <Stack
                                        direction='row'
                                        spacing={1.5}
                                        alignItems='center'
                                    >
                                        <Avatar
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                fontSize: 14,
                                                fontWeight: 700,
                                                bgcolor: user.status
                                                    ? 'success.light'
                                                    : 'grey.400',
                                            }}
                                        >
                                            {user.name.first?.[0]}
                                        </Avatar>

                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography
                                                variant='body2'
                                                fontWeight={700}
                                                noWrap
                                            >
                                                {user.name.first}{' '}
                                                {user.name.last}
                                            </Typography>

                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                                noWrap
                                                sx={{ display: 'block' }}
                                            >
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </TableCell>

                                {/* الدور */}
                                <TableCell align='center'>
                                    <FormControl size='small' sx={{ minWidth: 130 }}>
                                        <Select
                                            value={user.role}
                                            onChange={(event) =>
                                                onRoleChange(
                                                    user.email,
                                                    event.target.value,
                                                )
                                            }
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {Object.entries(ROLE_LABELS).map(
                                                ([value, label]) => (
                                                    <MenuItem
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {label}
                                                    </MenuItem>
                                                ),
                                            )}
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                {/* حالة الحساب */}
                                <TableCell align='center'>
                                    <Stack
                                        direction='row'
                                        spacing={0.5}
                                        alignItems='center'
                                        justifyContent='center'
                                    >
                                        <UserStatusSwitch
                                            userId={user._id!}
                                            isActive={
                                                user.accountStatus === 'active'
                                            }
                                            onChange={onAccountStatusChange}
                                        />

                                        <Chip
                                            label={
                                                user.accountStatus === 'active'
                                                    ? 'نشط'
                                                    : 'معطل'
                                            }
                                            color={
                                                user.accountStatus === 'active'
                                                    ? 'success'
                                                    : 'error'
                                            }
                                            size='small'
                                            sx={{ fontWeight: 700 }}
                                        />
                                    </Stack>
                                </TableCell>

                                {/* النشاط */}
                                <TableCell align='center'>
                                    <Chip
                                        icon={
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: user.status
                                                        ? 'success.main'
                                                        : 'error.main',
                                                    ml: '6px',
                                                }}
                                            />
                                        }
                                        label={
                                            user.status ? 'متصل' : 'غير متصل'
                                        }
                                        variant='outlined'
                                        size='small'
                                        sx={{ fontWeight: 600 }}
                                    />
                                </TableCell>

                                {/* الصلاحيات: شبكة مضغوطة بدل 6 صفوف */}
                                <TableCell align='center'>
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: 0.5,
                                            width: 140,
                                            mx: 'auto',
                                        }}
                                    >
                                        {PERMISSION_FIELDS.map((field) => {
                                            const enabled =
                                                user.permissions?.[
                                                    field.key
                                                ] ?? true;

                                            return (
                                                <Tooltip
                                                    key={field.key}
                                                    title={field.label}
                                                    arrow
                                                >
                                                    <Box
                                                        onClick={() =>
                                                            onPermissionChange(
                                                                user._id!,
                                                                field.key,
                                                                !enabled,
                                                            )
                                                        }
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            height: 28,
                                                            borderRadius: 1.5,
                                                            fontSize: 12,
                                                            cursor: 'pointer',
                                                            userSelect: 'none',
                                                            bgcolor: enabled
                                                                ? alpha(
                                                                      theme
                                                                          .palette
                                                                          .success
                                                                          .main,
                                                                      0.12,
                                                                  )
                                                                : alpha(
                                                                      theme
                                                                          .palette
                                                                          .error
                                                                          .main,
                                                                      0.1,
                                                                  ),
                                                            color: enabled
                                                                ? 'success.dark'
                                                                : 'error.dark',
                                                        }}
                                                    >
                                                        {field.icon}
                                                    </Box>
                                                </Tooltip>
                                            );
                                        })}
                                    </Box>
                                </TableCell>

                                {/* الإجراءات */}
                                <TableCell align='center'>
                                    <Stack
                                        direction='row'
                                        spacing={1}
                                        justifyContent='center'
                                    >
                                        <Tooltip title='تعديل'>
                                            <Button
                                                variant='outlined'
                                                color='warning'
                                                onClick={() =>
                                                    onEdit(user._id!)
                                                }
                                                sx={{
                                                    minWidth: 40,
                                                    borderRadius: 2,
                                                }}
                                            >
                                                {fontAwesomeIcon.edit}
                                            </Button>
                                        </Tooltip>

                                        <Tooltip title='حذف'>
                                            <Button
                                                variant='outlined'
                                                color='error'
                                                onClick={() =>
                                                    onDelete(user._id!)
                                                }
                                                sx={{
                                                    minWidth: 40,
                                                    borderRadius: 2,
                                                }}
                                            >
                                                {fontAwesomeIcon.trash}
                                            </Button>
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