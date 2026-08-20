export type AccountStatus = 'active' | 'disabled';

export interface UserPermissions {
    canLogin: boolean;
    canCreatePosts: boolean;
    canSendMessages: boolean;
    canSendOffers: boolean;
    canUseAccount: boolean;
    canAccessExistingData: boolean;
}

export const emptyAuthValues: AuthValues = {
    _id: '',

    status: false,

    accountStatus: 'active',

    permissions: {
        canLogin: true,
        canCreatePosts: true,
        canSendMessages: true,
        canSendOffers: true,
        canUseAccount: true,
        canAccessExistingData: true,
    },

    name: {
        first: '',
        last: '',
    },

    email: '',

    phone: {
        phone_1: '',
        phone_2: '',
    },

    image: {
        url: '',
        alt: '',
    },

    address: {
        city: '',
        street: '',
        houseNumber: '',
    },

    role: 'Client',

    iat: 0,

    exp: 0,

    slug: '',

    gender: '',

    createdAt: '',
};

export interface AuthValues {
    _id?: string;

    /**
     * Online / Offline
     */
    status: boolean;

    /**
     * Account state
     */
    accountStatus: AccountStatus;

    /**
     * Account permissions
     */
    permissions: UserPermissions;

    name: {
        first: string;
        last: string;
    };

    email?: string;

    phone: {
        phone_1: string;
        phone_2: string;
    };

    image?: {
        url: string;
        alt: string;
    };

    address: {
        city: string;
        street: string;
        houseNumber: string;
    };

    role?: 'Admin' | 'Moderator' | 'Client' | string;

    iat?: number;

    exp?: number;

    slug?: string;

    gender: string;

    createdAt: Date | string;
}
