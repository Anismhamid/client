// ===============================
// User Types
// ===============================

export type UserRole = 'Client' | 'Admin' | 'Moderator';

export type AccountStatus = 'active' | 'disabled';

export type Gender = 'male' | 'female' | 'other';

// ===============================
// Shared Types
// ===============================

export interface UserName {
    first: string;
    last: string;
}

export interface UserPhone {
    phone_1: string;
    phone_2: string;
}

export interface UserAddress {
    city: string;
    street: string;
    houseNumber?: string;
}

export interface UserImage {
    url?: string;
    alt?: string;
}

// ===============================
// Register Request
// ===============================

export interface UserRegister {
    name: UserName;

    phone: UserPhone;

    address: UserAddress;

    email: string;

    personalEmail: string;

    password: string;

    gender: Gender;

    slug: string;

    image?: UserImage;

    terms: boolean;
}

// ===============================
// Edit Profile
// ===============================

export interface EditUserProfile {
    name: UserName;

    phone: UserPhone;

    address: UserAddress;

    gender: Gender;

    image?: UserImage;
}

// ===============================
// Login
// ===============================

export interface UserLogin {
    email: string;
    password: string;
}

// ===============================
// User returned from Backend
// ===============================

export interface User {
    updatedAt: string | number | Date;
    createdAt: string | number | Date;
    lastActivity: any;
    _id: string;

    role: UserRole;

    name: UserName;

    phone: UserPhone;

    address: UserAddress;

    email: string;

    personalEmail: string;

    gender: Gender;

    slug: string;

    image: UserImage;

    status?: boolean;

    accountStatus: AccountStatus;

    permissions: UserPermissions;
}

// ===============================
// Permissions
// ===============================

export interface UserPermissions {
    canLogin: boolean;
    canCreatePosts: boolean;
    canSendMessages: boolean;
    canSendOffers: boolean;
    canUseAccount: boolean;
    canAccessExistingData: boolean;
}
