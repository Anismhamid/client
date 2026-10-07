import { useCallback, useEffect, useState } from 'react';
import { getAllUsers } from '../services/usersServices';

export interface AdminUserOption {
    _id: string;

    name?:
        | string
        | {
              first?: string;
              last?: string;
          }
        | null;

    email?: string | null;

    username?: string | null;

    slug?: string | null;

    role?: string;

    accountStatus?: string;
}

const getUserName = (user: AdminUserOption): string => {
    if (typeof user.name === 'string') {
        return user.name;
    }

    if (user.name && typeof user.name === 'object') {
        const fullName = [user.name.first, user.name.last]
            .filter(Boolean)
            .join(' ')
            .trim();

        if (fullName) {
            return fullName;
        }
    }

    return user.username || user.email || 'مستخدم';
};

export const useUsers = () => {
    const [users, setUsers] = useState<AdminUserOption[]>([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getAllUsers();

            /*
             * getAllUsers() قد يرجع:
             *
             * response.data.users
             *
             * أو:
             *
             * response.data.data
             */

            const data = response;

            setUsers(data as AdminUserOption[]);
        } catch (error) {
            console.error('[useUsers] failed:', error);

            setUsers([]);

            setError('فشل تحميل المستخدمين');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        refetch: fetchUsers,
        getUserName,
    };
};
