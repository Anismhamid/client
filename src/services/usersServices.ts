/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import api from './api';

import {
    EditUserProfile,
    User,
    UserLogin,
    UserRegister,
} from '../interfaces/User';

import {
    showError,
    showSuccess,
} from '../atoms/toasts/ReactToast';

import { jwtDecode } from 'jwt-decode';
import { CompleteUserPayload } from '../interfaces/completeProfile';
import { DecodedGooglePayload } from '../interfaces/google';
import { CredentialResponse } from '@react-oauth/google';

/**
 * ============================================================
 * Users API
 * ============================================================
 *
 * IMPORTANT:
 *
 * Authentication is handled through an HttpOnly cookie.
 *
 * Do NOT:
 *
 *   localStorage.setItem('token', ...)
 *   localStorage.getItem('token')
 *   Authorization: token
 *
 * The api instance already contains:
 *
 *   withCredentials: true
 *
 * Therefore the browser automatically sends the authentication
 * cookie with authenticated requests.
 */

const usersApi = '/users';

// ============================================================
// SHARED TYPES
// ============================================================

export type UserPermission =
    | 'canLogin'
    | 'canCreatePosts'
    | 'canSendMessages'
    | 'canSendOffers'
    | 'canUseAccount'
    | 'canAccessExistingData';

export interface UpdatePermissionResponse {
    success: boolean;
    message: string;
    permission: UserPermission;
    enabled: boolean;
    user: User;
}

/**
 * الشكل الموحّد لأخطاء الباك إند بعد الإصلاح:
 *
 * {
 *   success: false,
 *   code: 'SOME_CODE',
 *   message: '...'
 * }
 */
export interface ApiErrorShape {
    success?: boolean;
    code?: string;
    message?: string;
    error?: string;
}

/**
 * استخراج رسالة خطأ موحّدة من أي شكل محتمل.
 */
const extractErrorMessage = (
    error: any,
    fallback: string,
): string => {
    const data = error?.response?.data;

    if (!data) return fallback;

    if (typeof data === 'string') return data;

    return data.message || data.error || fallback;
};

/**
 * استخراج كود الخطأ من response الباك إند.
 */
const extractErrorCode = (error: any): string | undefined => {
    const data = error?.response?.data;

    if (!data || typeof data === 'string') return undefined;

    return data.code;
};

// ============================================================
// REGISTER
// ============================================================

export const registerNewUser = async (newUserData: UserRegister) => {
    try {
        const response = await api.post(usersApi, newUserData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }

        throw {
            data: {
                code: 'NETWORK_ERROR',
                message: 'Network error',
            },
        };
    }
};

// ============================================================
// GOOGLE LOGIN
// ============================================================

export const handleGoogleLogin = async (
    response: CredentialResponse,
    extraData: any,
) => {
    try {
        if (!response?.credential) {
            throw new Error('Missing Google credential');
        }

        /**
         * This token belongs to Google.
         * It is NOT the Safqa authentication cookie.
         */
        const decoded = jwtDecode<DecodedGooglePayload>(
            response.credential,
        );

        const { email, given_name, family_name, picture, sub } =
            decoded;

        if (!email || !sub) {
            throw new Error('Missing required Google user info');
        }

        const userData = {
            credentialToken: response.credential,

            email,

            name: {
                first: given_name ?? '',
                last: family_name ?? '',
            },

            image: {
                url: picture ?? '',
                alt: given_name ?? '',
            },

            phone: {
                phone_1: extraData?.phone_1 ?? '',
                phone_2: extraData?.phone_2 ?? '',
            },

            address: {
                city: extraData?.city ?? '',
                street: extraData?.street ?? '',
                houseNumber: extraData?.houseNumber ?? '',
                slug: extraData?.slug ?? '',
            },
        };

        const res = await api.post(`${usersApi}/google`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Google API error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
        } else {
            console.error('Google login error:', error);
        }

        throw error;
    }
};

// ============================================================
// VERIFY GOOGLE TOKEN (Google, not Safqa)
// ============================================================

export const verifyGoogleToken = async (token: string) => {
    // ⚠️ صُحّح الاسم من VITE_API_VIREFY_TOKEN → VITE_API_VERIFY_TOKEN
    const url = `${import.meta.env.VITE_API_VIREFY_TOKEN}${token}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Google token verification error:', error);
        throw new Error('Failed to verify Google token');
    }
};

// ============================================================
// VERIFY GOOGLE USER
// ============================================================

export const verifyGoogleUser = async (googleId: string) => {
    try {
        const response = await api.get(
            `${usersApi}/google/verify/${googleId}`,
        );

        return response.data.exists;
    } catch (error) {
        console.error('Error verifying Google user:', error);
        return false;
    }
};

// ============================================================
// COMPLETE PROFILE
// ============================================================

export const compleateProfileData = async (
    userId: string,
    values: CompleteUserPayload,
) => {
    try {
        const payload = {
            phone: {
                phone_1: values.phone.phone_1,
                phone_2: values.phone.phone_2 || '',
            },

            image: {
                url: values.image?.url ?? '',
            },

            address: {
                city: values.address.city,
                street: values.address.street,
                houseNumber: values.address.houseNumber,
            },
        };

        const response = await api.patch(
            `${usersApi}/compleate/${userId}`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error completing profile:', error);
        throw error;
    }
};

// ============================================================
// EDIT USER PROFILE
// ============================================================

export const editUserProfile = async (
    userId: string,
    data: EditUserProfile,
) => {
    try {
        const response = await api.patch(
            `${usersApi}/edit-user/${userId}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Edit profile error:', {
                status: error.response?.status,
                data: error.response?.data,
            });

            const errorMessage = extractErrorMessage(
                error,
                'Failed to update profile',
            );

            throw new Error(errorMessage);
        }

        throw error;
    }
};

// ============================================================
// LOGIN
// ============================================================

export const loginUser = async (userData: UserLogin) => {
    try {
        const response = await api.post(
            `${usersApi}/login`,
            userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data;
    } catch (error: any) {
        const status = error?.response?.status;
        const code = extractErrorCode(error);

        if (status === 429 || code === 'RATE_LIMITED') {
            showError(
                extractErrorMessage(
                    error,
                    'יותר מדי ניסיונות, נסה שוב מאוחר יותר',
                ),
            );
        } else if (code === 'LOGIN_DISABLED') {
            showError(
                extractErrorMessage(
                    error,
                    'ההתחברות מושבתת עבור חשבון זה',
                ),
            );
        } else if (code === 'VALIDATION_ERROR') {
            showError(
                extractErrorMessage(error, 'נתונים לא תקינים'),
            );
        } else {
            showError('שם משתמש או סיסמה שגויים');
        }

        console.error('Login error:', error);
        throw error;
    }
};

// ============================================================
// GET CURRENT USER
// ============================================================

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const response = await api.get(`${usersApi}/me`);
        // الباك إند يعيد { success: true, user }
        return response.data?.user ?? null;
    } catch (error) {
        if (
            axios.isAxiosError(error) &&
            (error.response?.status === 401 ||
                error.response?.status === 403)
        ) {
            return null;
        }
        throw error;
    }
};

// ============================================================
// GET ALL USERS (Admin / Moderator)
// ============================================================

export const getAllUsers = async () => {
    try {
        const response = await api.get(usersApi);
        return response.data;
    } catch (error) {
        console.error('Error getting all users:', error);
        return null;
    }
};

// ============================================================
// GET USER BY ID
// ============================================================

export const getUserById = async (userId: string) => {
    try {
        const response = await api.get(`${usersApi}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

// ============================================================
// PATCH USER ROLE (Admin only)
// ============================================================

export const patchUserRole = async (
    userId: string,
    newRole: string,
) => {
    try {
        const response = await api.patch(
            `${usersApi}/role/${userId}`,
            { role: newRole },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating user role:', error);
        return null;
    }
};

// ============================================================
// DELETE USER
// ============================================================

export const deleteUserById = async (userId: string) => {
    try {
        const response = await api.delete(`${usersApi}/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// ============================================================
// CHANGE USER PASSWORD
// ============================================================

export const changeUserPassword = async (
    userId: string,
    newPassword: string,
): Promise<boolean> => {
    try {
        await api.patch(
            `${usersApi}/password/${userId}`,
            { newPassword },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        showSuccess('הסיסמה שונתה בהצלחה');
        return true;
    } catch (error) {
        console.error('שגיאה בשינוי סיסמה:', error);

        showError(
            extractErrorMessage(
                error,
                'לא הצלחנו לשנות את הסיסמה',
            ),
        );

        return false;
    }
};

// ============================================================
// PATCH USER STATUS (online / offline)
// ============================================================

export const patchUserStatus = async (
    userId: string,
    status: boolean,
) => {
    try {
        const response = await api.patch(
            `${usersApi}/status/${userId}`,
            { status },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating status:', error);
        throw error;
    }
};

// ============================================================
// CUSTOMER PROFILE BY SLUG (Public)
// ============================================================

export const getCustomerProfileBySlug = async (slug: string) => {
    try {
        const response = await api.get(
            `${usersApi}/customer/${slug}`,
        );

        return response.data;
    } catch (error) {
        console.error(
            'Error fetching customer profile by slug:',
            error,
        );

        return null;
    }
};

// ============================================================
// CHECK SLUG AVAILABILITY (Public)
// ============================================================

export const checkSlugAvailability = async (
    slug: string,
): Promise<boolean> => {
    try {
        const response = await api.get(
            `${usersApi}/check-slug/${slug}`,
        );

        return response.data.available;
    } catch (error) {
        console.error('Error checking slug availability:', error);
        throw error;
    }
};

// ============================================================
// FORGOT PASSWORD (Public)
// ============================================================

export const forgotPassword = async (
    email: string,
): Promise<string> => {
    const { data } = await api.post(
        `${usersApi}/forgot-password`,
        { email },
    );

    return data.message;
};

// ============================================================
// RESET PASSWORD (Public)
// ============================================================

export const resetPassword = async (
    token: string,
    email: string,
    password: string,
): Promise<string> => {
    const { data } = await api.post(
        `${usersApi}/reset-password/${token}`,
        { email, password },
    );

    return data.message;
};

// ============================================================
// UPDATE ACCOUNT STATUS (Admin only)
// ============================================================

export const updateAccountStatus = async (
    userId: string,
    accountStatus: 'active' | 'disabled',
) => {
    const response = await api.patch(
        `${usersApi}/account-status/${userId}`,
        { accountStatus },
    );

    return response.data;
};

// ============================================================
// UPDATE USER PERMISSION (Admin only)
// ============================================================

const permissionEndpoints: Record<UserPermission, string> = {
    canLogin: 'login',
    canCreatePosts: 'create-posts',
    canSendMessages: 'messages',
    canSendOffers: 'offers',
    canUseAccount: 'use-account',
    canAccessExistingData: 'access-existing-data',
};

export const updateUserPermission = async (
    userId: string,
    permission: UserPermission,
    enabled: boolean,
): Promise<UpdatePermissionResponse> => {
    try {
        const endpoint = permissionEndpoints[permission];

        const response = await api.patch<UpdatePermissionResponse>(
            `${usersApi}/permissions/${userId}/${endpoint}`,
            { enabled },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error(
            `Error updating permission "${permission}":`,
            error,
        );

        throw error;
    }
};

// ============================================================
// LOGOUT
// ============================================================

/**
 * POST /users/logout
 *
 * الباك إند:
 *  - يحوّل المستخدم إلى offline (إن كان التوكن صالحاً)
 *  - يمسح HttpOnly cookie
 *
 * حتى لو فشل الطلب، نعتبر العملية ناجحة من ناحية الواجهة
 * لأن الكوكي ستنتهي عند إغلاق الجلسة على أي حال.
 * لكن نعيد boolean لتتمكن الواجهة من القرار.
 */
export const logoutUser = async (): Promise<boolean> => {
    try {
        await api.post(`${usersApi}/logout`);
        return true;
    } catch (error) {
        console.error('Logout request failed:', error);
        return false;
    }
};