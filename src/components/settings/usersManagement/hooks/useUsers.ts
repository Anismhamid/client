import { useCallback, useEffect, useState } from 'react';

import {
    deleteUserById,
    getAllUsers,
    patchUserRole,
} from '../../../../services/usersServices';
import { UserRegister } from '../../../../interfaces/User';
import { showError } from '../../../../atoms/toasts/ReactToast';

export const useUsers = (t: (key: string) => string) => {
    const [users, setUsers] = useState<UserRegister[]>([]);
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

    const updateUserRole = async (email: string, role: string) => {
        try {
            await patchUserRole(email, role);

            setUsers((prev) =>
                prev.map((user) =>
                    user.email === email
                        ? {
                              ...user,
                              role: role as UserRegister['role'],
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

    const deleteUser = async (userId: string) => {
        try {
            await deleteUserById(userId);

            setUsers((prev) => prev.filter((user) => user._id !== userId));

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

    const updateUserStatus = (userId: string, status: boolean) => {
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

    return {
        users,
        setUsers,
        loading,
        loadUsers,
        updateUserRole,
        deleteUser,
        updateUserStatus,
    };
};
