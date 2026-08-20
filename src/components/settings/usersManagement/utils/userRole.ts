import RoleType from '../../../../interfaces/UserType';
import { UserRegister } from '../../../../interfaces/User';

export const USER_ROLES: UserRegister['role'][] = [
    RoleType.Admin,
    RoleType.Moderator,
    RoleType.Client,
];

export const isAdminRole = (role: UserRegister['role']): boolean => {
    return role === RoleType.Admin;
};

export const isModeratorRole = (role: UserRegister['role']): boolean => {
    return role === RoleType.Moderator;
};

export const isClientRole = (role: UserRegister['role']): boolean => {
    return role === RoleType.Client;
};

export const getRoleColor = (
    role: UserRegister['role'],
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
