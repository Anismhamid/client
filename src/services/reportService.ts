import axios from 'axios';
import {
    UserReportStatus,
    UserReportType,
    UserReportUnion,
    BlockedUserInfo,
    BlockUserPayload,
    CreateReportPayload,
    UpdateReportPayload,
    ReportStats,
    UpdateReportResponse,
} from '../interfaces/report.types';

// ===============================
// API Endpoints
// ===============================

const REPORTS_BASE = `${import.meta.env.VITE_API_URL}/reports`;
const BLOCK_BASE = `${import.meta.env.VITE_API_URL}/blocks`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    return {
        Authorization: token,
    };
};
// ========== Reports ==========

/**
 * إنشاء إبلاغ جديد
 */
export const createReport = async (
    payload: CreateReportPayload,
): Promise<UserReportUnion> => {
    const response = await axios.post<UserReportUnion>(REPORTS_BASE, payload, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

/**
 * جلب جميع الإبلاغات (للمديرين فقط)
 */
export const getAllReports = async (params?: {
    status?: UserReportStatus;
    type?: UserReportType;
    page?: number;
    limit?: number;
    sort?: 'newest' | 'oldest';
}): Promise<{
    reports: UserReportUnion[];
    total: number;
    page: number;
    totalPages: number;
}> => {
    const response = await axios.get<{
        reports: UserReportUnion[];
        total: number;
        page: number;
        totalPages: number;
    }>(REPORTS_BASE, { params, headers: getAuthHeaders() });
    return response.data;
};

/**
 * جلب إبلاغ محدد
 */
export const getReportById = async (
    reportId: string,
): Promise<UserReportUnion> => {
    const response = await axios.get<UserReportUnion>(
        `${REPORTS_BASE}/${reportId}`,
        { headers: getAuthHeaders() },
    );
    return response.data;
};

/**
 * تحديث حالة الإبلاغ (للمديرين فقط)
 */
export const updateReport = async (
    reportId: string,
    payload: UpdateReportPayload,
): Promise<UpdateReportResponse> => {
    const response = await axios.patch<UpdateReportResponse>(
        `${REPORTS_BASE}/${reportId}`,
        payload,
        { headers: getAuthHeaders() },
    );
    return response.data;
};

/**
 * حذف إبلاغ (للمديرين فقط)
 */
export const deleteReport = async (reportId: string): Promise<void> => {
    await axios.delete(`${REPORTS_BASE}/${reportId}`, {
        headers: getAuthHeaders(),
    });
};

/**
 * جلب إبلاغات المستخدم الحالي
 */
export const getMyReports = async (): Promise<UserReportUnion[]> => {
    const response = await axios.get<UserReportUnion[]>(`${REPORTS_BASE}/my`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

/**
 * جلب إحصائيات الإبلاغات
 */
export const getReportStats = async (): Promise<ReportStats> => {
    const response = await axios.get<ReportStats>(`${REPORTS_BASE}/stats`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

/**
 * التحقق مما إذا كان المستخدم قد أبلغ عن هدف معين
 */
export const hasUserReported = async (
    type: UserReportType,
    targetId: string,
): Promise<boolean> => {
    const response = await axios.get<{ reported: boolean }>(
        `${REPORTS_BASE}/check/${type}/${targetId}`,
        {
            headers: getAuthHeaders(),
        },
    );

    return response.data.reported;
};

// ========== Blocks ==========

/**
 * حظر مستخدم
 */
export const blockUser = async (
    payload: BlockUserPayload,
): Promise<BlockedUserInfo> => {
    const response = await axios.post<BlockedUserInfo>(BLOCK_BASE, payload, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

/**
 * إلغاء حظر مستخدم
 */
export const unblockUser = async (userId: string): Promise<void> => {
    await axios.delete(`${BLOCK_BASE}/${userId}`, {
        headers: getAuthHeaders(),
    });
};

/**
 * جلب قائمة المستخدمين المحظورين (للمستخدم الحالي)
 */
export const getBlockedUsers = async (): Promise<BlockedUserInfo[]> => {
    const response = await axios.get<BlockedUserInfo[]>(`${BLOCK_BASE}/my`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

/**
 * التحقق مما إذا كان المستخدم محظورًا
 */
export const isUserBlocked = async (userId: string): Promise<boolean> => {
    const response = await axios.get<{ blocked: boolean }>(
        `${BLOCK_BASE}/check/${userId}`,
        {
            headers: getAuthHeaders(),
        },
    );
    return response.data.blocked;
};

/**
 * جلب من حظرني (للمديرين فقط)
 */
export const getBlockers = async (
    userId: string,
): Promise<BlockedUserInfo[]> => {
    const response = await axios.get<BlockedUserInfo[]>(
        `${BLOCK_BASE}/blockers/${userId}`,
        {
            headers: getAuthHeaders(),
        },
    );
    return response.data;
};
