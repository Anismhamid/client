import { FunctionComponent, useMemo, useState } from 'react';

import { Box, Stack } from '@mui/material';

import { useTranslation } from 'react-i18next';

import UsersManagementHeader from './UsersManagementHeader';
import UsersStats, { StatKey } from './UsersStats';
import UsersFilters from './UsersFilters';
import BulkUserActions from './BulkUserActions';
import UsersTable from './UsersTable';
import UsersPagination from './UsersPagination';
import UserDetailsDialog from './UserDetailsDialog';
import DeleteUserDialog from './DeleteUserDialog';

import { useUsers } from '../hooks/useUsers';
import { useUsersRealtime } from '../hooks/useUsersRealtime';
import { useUsersFilters } from '../hooks/useUsersFilters';

import RoleType from '../../../../interfaces/UserType';

import {
    UserFilterRole,
    UserFilterStatus,
} from '../types/usersManagement.types';

import { calculateUserStats } from '../utils/userStats';
import handleRTL from '../../../../locales/handleRTL';

const ROWS_PER_PAGE = 10;

const UsersManagement: FunctionComponent = () => {
    const { t } = useTranslation();
    const direction = handleRTL();

    // ---------- Data ----------
    const {
        users,
        loading,
        updateUserRole,
        deleteUser,
        updateUserStatus,
        handleAccountStatus,
        handleUserPermission,
    } = useUsers(t);

    useUsersRealtime(updateUserStatus);

    const {
        filters,
        filteredUsers,
        setSearch,
        setStatus,
        setRole,
        resetFilters,
    } = useUsersFilters(users);

    // ---------- State ----------
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [selectedRole, setSelectedRole] = useState<RoleType | ''>('');
    const [page, setPage] = useState(1);

    // ---------- Derived ----------
    const stats = useMemo(() => calculateUserStats(users), [users]);

    const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);

    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * ROWS_PER_PAGE;
        return filteredUsers.slice(start, start + ROWS_PER_PAGE);
    }, [filteredUsers, page]);

    const deleteUserData = useMemo(
        () => users.find((user) => user._id === deleteTarget),
        [users, deleteTarget],
    );

    const roleFilter = filters.role as string;
    const statusFilter = filters.status as string;

    const hasActiveFilters =
        Boolean(filters.search) || roleFilter !== 'all' || statusFilter !== 'all';

    const activeStat = useMemo<StatKey | null>(() => {
        if (roleFilter === 'Admin') return 'admins';
        if (statusFilter === 'active') return 'active';
        if (statusFilter === 'inactive') return 'inactive';
        if (roleFilter === 'all') return 'total';
        return null;
    }, [roleFilter, statusFilter]);

    // ---------- Selection ----------
    const clearSelection = () => {
        setSelectedUserIds([]);
        setSelectedRole('');
    };

    // ---------- Bulk ----------
    const handleBulkActivate = async () => {
        if (selectedUserIds.length === 0) return;

        await Promise.all(
            selectedUserIds.map((userId) => updateUserStatus(userId, true)),
        );

        clearSelection();
    };

    const handleBulkDeactivate = async () => {
        if (selectedUserIds.length === 0) return;

        await Promise.all(
            selectedUserIds.map((userId) => updateUserStatus(userId, false)),
        );

        clearSelection();
    };

    const handleBulkRoleUpdate = async () => {
        if (!selectedRole || selectedUserIds.length === 0) return;

        const selectedUsers = users.filter(
            (user) => user._id && selectedUserIds.includes(user._id),
        );

        await Promise.all(
            selectedUsers.map((user) => updateUserRole(user.email, selectedRole)),
        );

        clearSelection();
    };

    const handleBulkDelete = async () => {
        if (selectedUserIds.length === 0) return;

        const confirmed = window.confirm(
            `${t('pages.usersManagement.bulk.deleteConfirm')} (${selectedUserIds.length})`,
        );

        if (!confirmed) return;

        await Promise.all(selectedUserIds.map((userId) => deleteUser(userId)));

        clearSelection();
    };

    // ---------- Single delete ----------
    const handleDelete = async () => {
        if (!deleteTarget) return;

        const success = await deleteUser(deleteTarget);

        if (success) {
            setDeleteTarget(null);
        }
    };

    // ---------- Filters ----------
    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleRole = (value: UserFilterRole) => {
        setRole(value);
        setPage(1);
    };

    const handleReset = () => {
        resetFilters();
        setPage(1);
    };

    // Stats double as quick filters
    const handleStatSelect = (key: StatKey) => {
        setStatus('all' as UserFilterStatus);
        setRole('all' as UserFilterRole);

        if (key === 'active') setStatus('active' as UserFilterStatus);
        if (key === 'inactive') setStatus('inactive' as UserFilterStatus);
        if (key === 'admins') setRole('Admin' as UserFilterRole);

        setPage(1);
    };

    // ---------- Render ----------
    return (
        <Box
            dir={direction}
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                py: { xs: 2, md: 4 },
                px: { xs: 1.5, sm: 2, md: 4 },
                // room for the floating bulk bar
                pb: selectedUserIds.length > 0 ? { xs: 22, md: 14 } : undefined,
            }}
        >
            <Stack spacing={3} sx={{ maxWidth: 1400, mx: 'auto' }}>
                <UsersManagementHeader totalUsers={stats.total} />

                <UsersStats
                    stats={stats}
                    active={activeStat}
                    onSelect={handleStatSelect}
                />

                <UsersFilters
                    search={filters.search}
                    status={filters.status}
                    role={filters.role}
                    onSearch={handleSearch}
                    onRoleChange={handleRole}
                    onReset={handleReset}
                />

                <Box>
                    <UsersTable
                        users={paginatedUsers}
                        loading={loading}
                        filtered={hasActiveFilters}
                        selectedUserIds={selectedUserIds}
                        onSelectionChange={setSelectedUserIds}
                        onEdit={setSelectedUserId}
                        onDelete={setDeleteTarget}
                        onRoleChange={updateUserRole}
                        onPermissionChange={handleUserPermission}
                        onAccountStatusChange={handleAccountStatus}
                    />

                    <UsersPagination
                        page={page}
                        totalPages={totalPages}
                        totalItems={filteredUsers.length}
                        rowsPerPage={ROWS_PER_PAGE}
                        onPageChange={setPage}
                    />
                </Box>
            </Stack>

            <BulkUserActions
                selectedCount={selectedUserIds.length}
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
                onBulkRoleUpdate={handleBulkRoleUpdate}
                onActivate={handleBulkActivate}
                onDeactivate={handleBulkDeactivate}
                onDelete={handleBulkDelete}
                onClear={clearSelection}
                t={t}
                direction={direction}
            />

            <UserDetailsDialog
                userId={selectedUserId}
                open={Boolean(selectedUserId)}
                direction={direction}
                onClose={() => setSelectedUserId(null)}
            />

            <DeleteUserDialog
                open={Boolean(deleteTarget)}
                userName={
                    deleteUserData
                        ? `${deleteUserData.name.first} ${deleteUserData.name.last}`
                        : undefined
                }
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </Box>
    );
};

export default UsersManagement;