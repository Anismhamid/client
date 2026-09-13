// interfaces/authValues.ts
import { User } from './User';

/**
 * AuthValues = User + حقول JWT.
 *
 * لا نُعيد تعريف أي حقل من User.
 * أي حقل إضافي خاص بالتوكن نضيفه هنا فقط.
 */
export interface AuthValues extends User {
    /**
     * JWT issued-at
     */
    iat?: number;

    /**
     * JWT expiry
     */
    exp?: number;
}

/**
 * نسخة فارغة تُستخدم قبل تسجيل الدخول.
 * يجب أن تُوفّر كل الحقول الإلزامية في User.
 */
export const emptyAuthValues: AuthValues = {
    // ===== إلزامية في User =====
    _id: '',

    role: 'Client',

    name: {
        first: '',
        last: '',
    },

    phone: {
        phone_1: '',
        phone_2: '',
    },

    address: {
        city: '',
        street: '',
        houseNumber: '',
    },

    email: '',

    personalEmail: '',

    gender: 'other',

    slug: '',

    image: {
        url: '',
        alt: '',
    },

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

    createdAt: '',

    updatedAt: '',

    lastActivity: null,

    // ===== خاصة بالتوكن =====
    iat: 0,

    exp: 0,
};

// إعادة تصدير للاستخدام في أماكن أخرى
export type { AccountStatus, UserPermissions } from './User';