import { FunctionComponent, useMemo, useState } from 'react';

import { Box } from '@mui/material';

import { useTranslation } from 'react-i18next';

import UsersManagementHeader from './UsersManagementHeader';

import UsersStats from './UsersStats';

import UsersFilters from './UsersFilters';
import {
    UserFilterRole,
    UserFilterStatus,
} from '../types/usersManagement.types';

import BulkUserActions from './BulkUserActions';

import UsersTable from './UsersTable';

import UsersPagination from './UsersPagination';

import UserDetailsDialog from './UserDetailsDialog';

import DeleteUserDialog from './DeleteUserDialog';

import { useUsers } from '../hooks/useUsers';

import { useUsersFilters } from '../hooks/useUsersFilters';

import { useUsersRealtime } from '../hooks/useUsersRealtime';

import { calculateUserStats } from '../utils/userStats';

import handleRTL from '../../../../locales/handleRTL';

import RoleType from '../../../../interfaces/UserType';

const UsersManagement: FunctionComponent = () => {
    const { t } = useTranslation();

    const direction = handleRTL();

    const {
        users,
        loading,
        updateUserRole,
        deleteUser,
        updateUserStatus,
        handleAccountStatus,
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

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const [selectedRole, setSelectedRole] = useState<RoleType | ''>('');

    const [page, setPage] = useState(1);

    const rowsPerPage = 10;

    const stats = calculateUserStats(users);

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * rowsPerPage;

        return filteredUsers.slice(start, start + rowsPerPage);
    }, [filteredUsers, page]);

    const selectedUser = users.find((user) => user._id === deleteTarget);

    /*
     * =========================
     * Selection
     * =========================
     */

    const clearSelection = () => {
        setSelectedUserIds([]);
        setSelectedRole('');
    };

    /*
     * =========================
     * Bulk activate
     * =========================
     */

    const handleBulkActivate = async () => {
        await Promise.all(
            selectedUserIds.map((userId) => updateUserStatus(userId, true)),
        );

        clearSelection();
    };

    /*
     * =========================
     * Bulk deactivate
     * =========================
     */

    const handleBulkDeactivate = async () => {
        await Promise.all(
            selectedUserIds.map((userId) => updateUserStatus(userId, false)),
        );

        clearSelection();
    };

    /*
     * =========================
     * Bulk role
     * =========================
     */

    const handleBulkRoleUpdate = async () => {
        if (!selectedRole) {
            return;
        }

        const selectedUsers = users.filter(
            (user) => user._id && selectedUserIds.includes(user._id),
        );

        await Promise.all(
            selectedUsers.map((user) =>
                updateUserRole(user.email, selectedRole),
            ),
        );

        clearSelection();
    };

    /*
     * =========================
     * Bulk delete
     * =========================
     */

    const handleBulkDelete = async () => {
        if (selectedUserIds.length === 0) {
            return;
        }

        const confirmed = window.confirm(
            `${t(
                'pages.usersManagement.bulk.deleteConfirm',
            )} (${selectedUserIds.length})`,
        );

        if (!confirmed) {
            return;
        }

        await Promise.all(selectedUserIds.map((userId) => deleteUser(userId)));

        clearSelection();
    };

    /*
     * =========================
     * Single delete
     * =========================
     */

    const handleDelete = async () => {
        if (!deleteTarget) {
            return;
        }

        const success = await deleteUser(deleteTarget);

        if (success) {
            setDeleteTarget(null);
        }
    };

    /*
     * =========================
     * Filters
     * =========================
     */

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleStatus = (value: UserFilterStatus) => {
        setStatus(value);
    };

    const handleRole = (value: UserFilterRole) => {
        setRole(value);
        setPage(1);
    };

    const handleReset = () => {
        resetFilters();
        setPage(1);
    };

    return (
        <Box
            dir={direction}
            sx={{
                minHeight: '100vh',

                bgcolor: 'background.default',

                py: {
                    xs: 3,
                    md: 5,
                },

                px: {
                    xs: 2,
                    md: 4,
                },
            }}
        >
            {/* ================= HEADER ================= */}

            <UsersManagementHeader totalUsers={stats.total} />

            {/* ================= STATS ================= */}

            <UsersStats stats={stats} />

            {/* ================= FILTERS ================= */}

            <UsersFilters
                search={filters.search}
                status={filters.status}
                role={filters.role}
                onSearch={handleSearch}
                onStatusChange={handleStatus}
                onRoleChange={handleRole}
                onReset={handleReset}
            />

            {/* ================= BULK ACTIONS ================= */}

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

            {/* ================= TABLE ================= */}

            <UsersTable
                onAccountStatusChange={handleAccountStatus}
                users={paginatedUsers}
                loading={loading}
                selectedUserIds={selectedUserIds}
                onSelectionChange={setSelectedUserIds}
                onEdit={setSelectedUserId}
                onDelete={setDeleteTarget}
                onRoleChange={updateUserRole}
            />

            {/* ================= PAGINATION ================= */}

            <UsersPagination
                page={page}
                totalPages={totalPages}
                totalItems={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
            />

            {/* ================= EDIT USER ================= */}

            <UserDetailsDialog
                userId={selectedUserId}
                open={Boolean(selectedUserId)}
                direction={direction}
                onClose={() => setSelectedUserId(null)}
            />

            {/* ================= DELETE USER ================= */}

            <DeleteUserDialog
                open={Boolean(deleteTarget)}
                userName={
                    selectedUser
                        ? `${selectedUser.name.first} ${selectedUser.name.last}`
                        : undefined
                }
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </Box>
    );
};

export default UsersManagement;
