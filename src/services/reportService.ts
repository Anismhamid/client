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

import api from '../services/api';

// ===============================
// API Endpoints
// ===============================

const REPORTS_BASE = '/reports';
const BLOCK_BASE = '/blocks';

// ========== Reports ==========

/**
 * إنشاء إبلاغ جديد
 */
export const createReport = async (
    payload: CreateReportPayload,
): Promise<UserReportUnion> => {
    const response = await api.post<UserReportUnion>(
        REPORTS_BASE,
        payload,
    );

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
    const response = await api.get<{
        reports: UserReportUnion[];
        total: number;
        page: number;
        totalPages: number;
    }>(REPORTS_BASE, {
        params,
    });

    return response.data;
};

/**
 * جلب إبلاغ محدد
 */
export const getReportById = async (
    reportId: string,
): Promise<UserReportUnion> => {
    const response = await api.get<UserReportUnion>(
        `${REPORTS_BASE}/${reportId}`,
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
    const response = await api.patch<UpdateReportResponse>(
        `${REPORTS_BASE}/${reportId}`,
        payload,
    );

    return response.data;
};

/**
 * حذف إبلاغ (للمديرين فقط)
 */
export const deleteReport = async (
    reportId: string,
): Promise<void> => {
    await api.delete(`${REPORTS_BASE}/${reportId}`);
};

/**
 * جلب إبلاغات المستخدم الحالي
 */
export const getMyReports = async (): Promise<UserReportUnion[]> => {
    const response = await api.get<UserReportUnion[]>(
        `${REPORTS_BASE}/my`,
    );

    return response.data;
};

/**
 * جلب إحصائيات الإبلاغات
 */
export const getReportStats = async (): Promise<ReportStats> => {
    const response = await api.get<ReportStats>(
        `${REPORTS_BASE}/stats`,
    );

    return response.data;
};

/**
 * التحقق مما إذا كان المستخدم قد أبلغ عن هدف معين
 */
export const hasUserReported = async (
    type: UserReportType,
    targetId: string,
): Promise<boolean> => {
    const response = await api.get<{ reported: boolean }>(
        `${REPORTS_BASE}/check/${type}/${targetId}`,
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
    const response = await api.post<BlockedUserInfo>(
        BLOCK_BASE,
        payload,
    );

    return response.data;
};

/**
 * إلغاء حظر مستخدم
 */
export const unblockUser = async (
    userId: string,
): Promise<void> => {
    await api.delete(`${BLOCK_BASE}/${userId}`);
};

/**
 * جلب قائمة المستخدمين المحظورين (للمستخدم الحالي)
 */
export const getBlockedUsers = async (): Promise<BlockedUserInfo[]> => {
    const response = await api.get<BlockedUserInfo[]>(
        `${BLOCK_BASE}/my`,
    );

    return response.data;
};

/**
 * التحقق مما إذا كان المستخدم محظورًا
 */
export const isUserBlocked = async (
    userId: string,
): Promise<boolean> => {
    const response = await api.get<{ blocked: boolean }>(
        `${BLOCK_BASE}/check/${userId}`,
    );

    return response.data.blocked;
};

/**
 * جلب من حظرني (للمديرين فقط)
 */
export const getBlockers = async (
    userId: string,
): Promise<BlockedUserInfo[]> => {
    const response = await api.get<BlockedUserInfo[]>(
        `${BLOCK_BASE}/blockers/${userId}`,
    );

    return response.data;
};