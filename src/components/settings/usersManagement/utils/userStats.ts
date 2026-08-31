import { User } from '../../../../interfaces/User';
import { UsersStatsData } from '../types/usersManagement.types';

export const calculateUserStats = (
    users: User[],
): UsersStatsData => {
    return {
        total: users.length,

        active: users.filter(
            (user) => user.status === true,
        ).length,

        inactive: users.filter(
            (user) => user.status !== true,
        ).length,

        admins: users.filter(
            (user) => user.role === 'Admin',
        ).length,

        moderators: users.filter(
            (user) => user.role === 'Moderator',
        ).length,

        clients: users.filter(
            (user) => user.role === 'Client',
        ).length,
    };
};