import { FunctionComponent, useMemo, useState } from 'react';

import { Box, Grid, Stack } from '@mui/material';

import { useTranslation } from 'react-i18next';

// ======================================================
// Components
// ======================================================

import UsersManagementHeader from './UsersManagementHeader';
import UsersStats from './UsersStats';
import UsersFilters from './UsersFilters';
import BulkUserActions from './BulkUserActions';
import UsersTable from './UsersTable';
import UsersPagination from './UsersPagination';
import UserDetailsDialog from './UserDetailsDialog';
import DeleteUserDialog from './DeleteUserDialog';

import MessageInvestigation from './MessageInvestigation/MessageInvestigation';
import MessageAuditLogs from './MessageInvestigation/MessageAuditLogs';

// ======================================================
// Hooks
// ======================================================

import { useUsers } from '../hooks/useUsers';
import { useUsersRealtime } from '../hooks/useUsersRealtime';
import { useUsersFilters } from '../hooks/useUsersFilters';
import useMessageAuditLogs from '../hooks/useMessageAuditLogs';

// ======================================================
// Types
// ======================================================

import RoleType from '../../../../interfaces/UserType';

import {
    UserFilterRole,
    UserFilterStatus,
} from '../types/usersManagement.types';

// ======================================================
// Utils
// ======================================================

import { calculateUserStats } from '../utils/userStats';
import handleRTL from '../../../../locales/handleRTL';

// ======================================================
// Component
// ======================================================

const UsersManagement: FunctionComponent = () => {
    const { t } = useTranslation();

    const direction = handleRTL();

    // ==================================================
    // Users
    // ==================================================

    const {
        users,
        loading,
        updateUserRole,
        deleteUser,
        updateUserStatus,
        handleAccountStatus,
        handleUserPermission,
    } = useUsers(t);

    // ==================================================
    // Users Realtime
    // ==================================================

    useUsersRealtime(updateUserStatus);

    // ==================================================
    // Message Audit Logs
    // ==================================================

    const { logs } = useMessageAuditLogs();

    // ==================================================
    // Filters
    // ==================================================

    const {
        filters,
        filteredUsers,
        setSearch,
        setStatus,
        setRole,
        resetFilters,
    } = useUsersFilters(users);

    // ==================================================
    // State
    // ==================================================

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const [selectedRole, setSelectedRole] = useState<RoleType | ''>('');

    const [page, setPage] = useState(1);

    // ==================================================
    // Pagination
    // ==================================================

    const rowsPerPage = 10;

    // ==================================================
    // Derived Data
    // ==================================================

    const stats = useMemo(() => calculateUserStats(users), [users]);

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * rowsPerPage;

        return filteredUsers.slice(start, start + rowsPerPage);
    }, [filteredUsers, page]);

    const selectedUser = useMemo(
        () => users.find((user) => user._id === deleteTarget),
        [users, deleteTarget],
    );

    // ==================================================
    // Selection
    // ==================================================

    const clearSelection = () => {
        setSelectedUserIds([]);
        setSelectedRole('');
    };

    // ==================================================
    // Bulk Activate
    // ==================================================

    const handleBulkActivate = async () => {
        if (selectedUserIds.length === 0) {
            return;
        }

        await Promise.all(
            selectedUserIds.map((userId) => updateUserStatus(userId, true)),
        );

        clearSelection();
    };

    // ==================================================
    // Bulk Deactivate
    // ==================================================

    const handleBulkDeactivate = async () => {
        if (selectedUserIds.length === 0) {
            return;
        }

        await Promise.all(
            selectedUserIds.map((userId) => updateUserStatus(userId, false)),
        );

        clearSelection();
    };

    // ==================================================
    // Bulk Role Update
    // ==================================================

    const handleBulkRoleUpdate = async () => {
        if (!selectedRole || selectedUserIds.length === 0) {
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

    // ==================================================
    // Bulk Delete
    // ==================================================

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

    // ==================================================
    // Single Delete
    // ==================================================

    const handleDelete = async () => {
        if (!deleteTarget) {
            return;
        }

        const success = await deleteUser(deleteTarget);

        if (success) {
            setDeleteTarget(null);
        }
    };

    // ==================================================
    // Filters
    // ==================================================

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleStatus = (value: UserFilterStatus) => {
        setStatus(value);
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

    // ==================================================
    // Render
    // ==================================================

    return (
        <Box
            dir={direction}
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',

                py: {
                    xs: 2,
                    sm: 3,
                    md: 5,
                },

                px: {
                    xs: 1.5,
                    sm: 2,
                    md: 4,
                    lg: 5,
                },
            }}
        >
            <Grid
                container
                spacing={{
                    xs: 2,
                    md: 3,
                }}
            >
                {/* ==================================================
                    Header
                ================================================== */}

                <Grid size={12}>
                    <UsersManagementHeader totalUsers={stats.total} />
                </Grid>

                {/* ==================================================
                    Statistics
                ================================================== */}

                <Grid size={12}>
                    <UsersStats stats={stats} />
                </Grid>

                {/* ==================================================
                    Main Content
                ================================================== */}

                {/* ==================================================
                    Sidebar
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                       
                    }}
                    sx={{
                        alignSelf: 'flex-start',
                    }}
                >
                    <Stack
                        spacing={3}
                        sx={{
                            position: {
                                xs: 'static',
                                md: 'sticky',
                            },

                            top: {
                                md: 24,
                            },
                        }}
                    >
                        {/* ==========================================
                            Filters
                        ========================================== */}

                        <UsersFilters
                            search={filters.search}
                            status={filters.status}
                            role={filters.role}
                            onSearch={handleSearch}
                            onStatusChange={handleStatus}
                            onRoleChange={handleRole}
                            onReset={handleReset}
                        />

                        {/* ==========================================
                            Bulk Actions
                        ========================================== */}

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

                        {/* ==========================================
                            Message Investigation
                        ========================================== */}

                        <MessageInvestigation />

                        {/* ==========================================
                            Message Audit Logs
                        ========================================== */}

                        <MessageAuditLogs logs={logs} />
                    </Stack>
                </Grid>

                <Grid size={{xs:12,md:6}}>
                    <Stack spacing={3}>
                        {/* ==========================================
                            Users Table
                        ========================================== */}

                        <UsersTable
                            users={paginatedUsers}
                            loading={loading}
                            selectedUserIds={selectedUserIds}
                            onSelectionChange={setSelectedUserIds}
                            onEdit={setSelectedUserId}
                            onDelete={setDeleteTarget}
                            onRoleChange={updateUserRole}
                            onPermissionChange={handleUserPermission}
                            onAccountStatusChange={handleAccountStatus}
                        />

                        {/* ==========================================
                            Pagination
                        ========================================== */}

                        <UsersPagination
                            page={page}
                            totalPages={totalPages}
                            totalItems={filteredUsers.length}
                            rowsPerPage={rowsPerPage}
                            onPageChange={setPage}
                        />
                    </Stack>
                </Grid>
            </Grid>

            {/* ==================================================
                Dialogs
            ================================================== */}

            <UserDetailsDialog
                userId={selectedUserId}
                open={Boolean(selectedUserId)}
                direction={direction}
                onClose={() => setSelectedUserId(null)}
            />

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
