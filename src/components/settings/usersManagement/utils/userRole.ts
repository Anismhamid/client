import RoleType from '../../../../interfaces/UserType';
import { User } from '../../../../interfaces/User';

export const USER_ROLES: User['role'][] = [
    RoleType.Admin,
    RoleType.Moderator,
    RoleType.Client,
];

export const isAdminRole = (role: User['role']): boolean => {
    return role === RoleType.Admin;
};

export const isModeratorRole = (role: User['role']): boolean => {
    return role === RoleType.Moderator;
};

export const isClientRole = (role: User['role']): boolean => {
    return role === RoleType.Client;
};

export const getRoleColor = (
    role: User['role'],
): 'error' | 'warning' | 'info' | 'default' => {
    switch (role) {
        case RoleType.Admin:
            return 'error';

        case RoleType.Moderator:
            return 'warning';

        case RoleType.Client:
            return 'default';

        default:
            return 'default';
    }
};
