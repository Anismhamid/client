import { useMemo, useState } from 'react';

import { UserRegister } from '../../../../interfaces/User';
import { UserFilterRole, UserFilterStatus } from '../types/usersManagement.types';



export interface UsersFiltersState {
    search: string;
    status: UserFilterStatus;
    role: UserFilterRole;
}

export const useUsersFilters = (
    users: UserRegister[],
) => {
    const [filters, setFilters] =
        useState<UsersFiltersState>({
            search: '',
            status: 'all',
            role: 'all',
        });

    const setSearch = (search: string) => {
        setFilters((prev) => ({
            ...prev,
            search,
        }));
    };

    const setStatus = (
        status: UserFilterStatus,
    ) => {
        setFilters((prev) => ({
            ...prev,
            status,
        }));
    };

    const setRole = (
        role: UserFilterRole,
    ) => {
        setFilters((prev) => ({
            ...prev,
            role,
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            status: 'all',
            role: 'all',
        });
    };

    const filteredUsers = useMemo(() => {
        const search =
            filters.search
                .trim()
                .toLowerCase();

        return users.filter((user) => {
            const fullName =
                `${user.name.first} ${user.name.last}`
                    .toLowerCase();

            const matchesSearch =
                !search ||
                fullName.includes(search) ||
                user.email
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                filters.status === 'all' ||
                (filters.status === 'active' &&
                    user.status === true) ||
                (filters.status === 'inactive' &&
                    user.status === false);

            const matchesRole =
                filters.role === 'all' ||
                user.role === filters.role;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesRole
            );
        });
    }, [users, filters]);

    return {
        filters,
        filteredUsers,
        setSearch,
        setStatus,
        setRole,
        resetFilters,
    };
};