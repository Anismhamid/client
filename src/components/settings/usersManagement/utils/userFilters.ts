import { UserRegister } from '../../../../interfaces/User';
import {
    UsersFiltersState,
} from '../types/usersManagement.types';

export const filterUsers = (
    users: UserRegister[],
    filters: UsersFiltersState,
): UserRegister[] => {
    const search = filters.search
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
                user.status !== true);

        const matchesRole =
            filters.role === 'all' ||
            user.role === filters.role;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesRole
        );
    });
};