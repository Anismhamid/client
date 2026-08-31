import { useCallback, useEffect, useState } from 'react';

import {
    deleteUserById,
    getAllUsers,
    patchUserRole,
    updateAccountStatus,
    updateUserPermission,
    UserPermission,
} from '../../../../services/usersServices';

import { User } from '../../../../interfaces/User';
import { showError } from '../../../../atoms/toasts/ReactToast';

export type AccountStatus = 'active' | 'disabled';

export const useUsers = (t: (key: string) => string) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = useCallback(async () => {
        setLoading(true);

        try {
            const data = await getAllUsers();

            setUsers(data);
        } catch (error) {
            showError(
                error instanceof Error
                    ? error.message
                    : t('pages.usersManagement.errors.load'),
            );
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // =========================
    // Update User Role
    // =========================

    const updateUserRole = async (
        email: string,
        role: string,
    ) => {
        try {
            await patchUserRole(email, role);

            setUsers((prev) =>
                prev.map((user) =>
                    user.email === email
                        ? {
                              ...user,
                              role: role as User['role'],
                          }
                        : user,
                ),
            );
        } catch (error) {
            showError(
                error instanceof Error
                    ? error.message
                    : t('pages.usersManagement.errors.role'),
            );
        }
    };

    // =========================
    // Delete User
    // =========================

    const deleteUser = async (userId: string) => {
        try {
            await deleteUserById(userId);

            setUsers((prev) =>
                prev.filter(
                    (user) => user._id !== userId,
                ),
            );

            return true;
        } catch (error) {
            showError(
                error instanceof Error
                    ? error.message
                    : t('pages.usersManagement.errors.delete'),
            );

            return false;
        }
    };

    // =========================
    // Online / Offline Status
    // =========================

    const updateUserStatus = (
        userId: string,
        status: boolean,
    ) => {
        setUsers((prev) =>
            prev.map((user) =>
                user._id === userId
                    ? {
                          ...user,
                          status,
                      }
                    : user,
            ),
        );
    };

    // =========================
    // Account Active / Disabled
    // =========================

    const handleAccountStatus = async (
        userId: string,
        isActive: boolean,
    ) => {
        try {
            const accountStatus: AccountStatus =
                isActive ? 'active' : 'disabled';

            const response =
                await updateAccountStatus(
                    userId,
                    accountStatus,
                );

            setUsers((prev) =>
                prev.map((user) =>
                    user._id === userId
                        ? {
                              ...user,
                              accountStatus:
                                  response.user
                                      .accountStatus,
                          }
                        : user,
                ),
            );

            return true;
        } catch (error) {
            showError(
                error instanceof Error
                    ? error.message
                    : 'Failed to update account status',
            );

            return false;
        }
    };

    // =========================
    // Update Single Permission
    // =========================

    const handleUserPermission = async (
        userId: string,
        permission: UserPermission,
        enabled: boolean,
    ) => {
        try {
            const response =
                await updateUserPermission(
                    userId,
                    permission,
                    enabled,
                );

            setUsers((prev) =>
                prev.map((user) =>
                    user._id === userId
                        ? {
                              ...user,
                              permissions:
                                  response.user
                                      .permissions,
                          }
                        : user,
                ),
            );

            return true;
        } catch (error) {
            showError(
                error instanceof Error
                    ? error.message
                    : 'Failed to update permission',
            );

            return false;
        }
    };

    return {
        users,
        setUsers,
        loading,
        loadUsers,

        updateUserRole,
        deleteUser,

        updateUserStatus,

        handleAccountStatus,
        handleUserPermission,
    };
};