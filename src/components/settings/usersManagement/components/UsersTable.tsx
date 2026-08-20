import { FunctionComponent } from 'react';

import {
    Box,
    Button,
    Checkbox,
    Chip,
    FormControl,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    useTheme,
    alpha,
} from '@mui/material';

import RoleType from '../../../../interfaces/UserType';
import { UserRegister } from '../../../../interfaces/User';
import { fontAwesomeIcon } from '../../../../FontAwesome/Icons';
import UserStatusSwitch from './UserStatusSwitch';

interface UsersTableProps {
    users: UserRegister[];

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
}

const UsersTable: FunctionComponent<UsersTableProps> = ({
    users,
    loading,
    selectedUserIds,
    onSelectionChange,
    onEdit,
    onDelete,
    onRoleChange,
    onAccountStatusChange,
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
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell
                            align='center'
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                            }}
                        >
                            <Checkbox
                                checked={allSelected}
                                indeterminate={someSelected}
                                onChange={handleSelectAll}
                                sx={{
                                    color: 'white',
                                }}
                            />
                        </TableCell>

                        <TableCell
                            align='center'
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                fontWeight: 700,
                            }}
                        >
                            الاسم
                        </TableCell>

                        <TableCell
                            align='center'
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                fontWeight: 700,
                            }}
                        >
                            البريد الإلكتروني
                        </TableCell>

                        <TableCell
                            align='center'
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                fontWeight: 700,
                            }}
                        >
                            الدور
                        </TableCell>

                        <TableCell
                            align='center'
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                fontWeight: 700,
                            }}
                        >
                            الحالة
                        </TableCell>

                        <TableCell
                            align='center'
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                fontWeight: 700,
                            }}
                        >
                            الإجراءات
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {users.map((user) => {
                        const selected = selectedUserIds.includes(user._id!);

                        return (
                            <TableRow key={user._id} hover selected={selected}>
                                <TableCell align='center'>
                                    <Checkbox
                                        checked={selected}
                                        onChange={() =>
                                            handleSelectUser(user._id!)
                                        }
                                    />
                                </TableCell>
                                <TableCell align='center'>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                        }}
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
                                                    ? 'الحساب نشط'
                                                    : 'الحساب معطل'
                                            }
                                            color={
                                                user.accountStatus === 'active'
                                                    ? 'success'
                                                    : 'error'
                                            }
                                            size='small'
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell align='center'>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: 1,
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                bgcolor: user.status
                                                    ? 'success.main'
                                                    : 'error.main',
                                                boxShadow: user.status
                                                    ? `0 0 0 4px ${alpha(
                                                          theme.palette.success
                                                              .main,
                                                          0.12,
                                                      )}`
                                                    : `0 0 0 4px ${alpha(
                                                          theme.palette.error
                                                              .main,
                                                          0.12,
                                                      )}`,
                                            }}
                                        />
                                        {user.name.first} {user.name.last}
                                    </Box>
                                </TableCell>

                                <TableCell align='center'>
                                    {user.email}
                                </TableCell>

                                <TableCell align='center'>
                                    <FormControl
                                        size='small'
                                        sx={{
                                            minWidth: 140,
                                        }}
                                    >
                                        <Select
                                            value={user.role}
                                            onChange={(event) =>
                                                onRoleChange(
                                                    user.email,
                                                    event.target.value,
                                                )
                                            }
                                            sx={{
                                                borderRadius: 2,
                                            }}
                                        >
                                            <MenuItem value={RoleType.Admin}>
                                                مدير
                                            </MenuItem>

                                            <MenuItem
                                                value={RoleType.Moderator}
                                            >
                                                مشرف
                                            </MenuItem>

                                            <MenuItem value={RoleType.Delivery}>
                                                مرسل
                                            </MenuItem>

                                            <MenuItem value={RoleType.Client}>
                                                مستخدم
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                <TableCell align='center'>
                                    <Chip
                                        label={user.status ? 'نشط' : 'غير نشط'}
                                        color={
                                            user.status ? 'success' : 'error'
                                        }
                                        size='small'
                                        sx={{
                                            fontWeight: 700,
                                        }}
                                    />
                                </TableCell>

                                <TableCell align='center'>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Button
                                            variant='outlined'
                                            color='warning'
                                            onClick={() => onEdit(user._id!)}
                                            sx={{
                                                minWidth: 42,
                                                borderRadius: 2,
                                            }}
                                        >
                                            {fontAwesomeIcon.edit}
                                        </Button>

                                        <Button
                                            variant='outlined'
                                            color='error'
                                            onClick={() => onDelete(user._id!)}
                                            sx={{
                                                minWidth: 42,
                                                borderRadius: 2,
                                            }}
                                        >
                                            {fontAwesomeIcon.trash}
                                        </Button>
                                    </Box>
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
