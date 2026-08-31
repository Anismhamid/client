import RoleType from '../../../../interfaces/UserType';

export type UserFilterStatus = 'all' | 'active' | 'inactive';

export type UserFilterRole =
    | 'all'
    | RoleType.Admin
    | RoleType.Moderator
    | RoleType.Client;

export interface UsersStatsData {
    total: number;
    active: number;
    inactive: number;
    admins: number;
    moderators: number;
    clients: number;
}

export interface UsersFiltersState {
    search: string;
    status: UserFilterStatus;
    role: UserFilterRole;
}
