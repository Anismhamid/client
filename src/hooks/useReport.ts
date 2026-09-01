import { useState, useCallback } from 'react';
import { showError, showSuccess } from '../atoms/toasts/ReactToast';
import { useTranslation } from 'react-i18next';

import {
    BlockedUserInfo,
    BlockUserPayload,
    CreateReportPayload,
    UpdateReportPayload,
    UserReportUnion,
    UserReportStatus,
    UserReportType,
    ReportStats,
} from '../interfaces/report.types';

import {
    createReport as createReportApi,
    deleteReport as deleteReportApi,
    getAllReports,
    getBlockedUsers,
    getMyReports,
    getReportStats,
    hasUserReported as hasUserReportedApi,
    isUserBlocked,
    updateReport as updateReportApi,
    blockUser as blockUserApi,
    unblockUser as unblockUserApi,
} from '../services/reportService';

export const useReport = () => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);

    const [reports, setReports] = useState<UserReportUnion[]>([]);

    const [blockedUsers, setBlockedUsers] = useState<BlockedUserInfo[]>([]);

    const [totalReports, setTotalReports] = useState(0);

    const [stats, setStats] = useState<ReportStats | null>(null);

    // =====================================================
    // Reports
    // =====================================================

    const createReport = useCallback(
        async (payload: CreateReportPayload) => {
            setLoading(true);

            try {
                const report = await createReportApi(payload);

                setReports((prev) => [report, ...prev]);

                showSuccess(t('report.created'));

                return report;
            } catch (error) {
                showError(t('report.createError'));

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [t],
    );

    // =====================================================
    // My Reports
    // =====================================================

    const fetchMyReports = useCallback(async () => {
        setLoading(true);

        try {
            const data = await getMyReports();

            setReports(data);

            return data;
        } catch (error) {
            showError(t('report.fetchError'));

            throw error;
        } finally {
            setLoading(false);
        }
    }, [t]);

    // =====================================================
    // All Reports - Admin
    // =====================================================

    const fetchAllReports = useCallback(
        async (params?: {
            status?: UserReportStatus;
            type?: UserReportType;
            page?: number;
            limit?: number;
            sort?: 'newest' | 'oldest';
        }) => {
            setLoading(true);

            try {
                const data = await getAllReports(params);

                setReports(data.reports);

                setTotalReports(data.total);

                return data;
            } catch (error) {
                showError(t('report.fetchError'));

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [t],
    );

    // =====================================================
    // Update Report
    // =====================================================

    const updateReportStatus = useCallback(
        async (reportId: string, payload: UpdateReportPayload) => {
            setLoading(true);

            try {
                const response = await updateReportApi(reportId, payload);

                // إذا الـ API يرجع:
                // { success, message, report, actionResult }
                const updatedReport = response.report;

                setReports((prev) =>
                    prev.map((report) =>
                        report._id === reportId ? updatedReport : report,
                    ),
                );

                showSuccess(response.message);

                return response;
            } catch (error) {
                showError(t('report.updateError'));

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [t],
    );
    // =====================================================
    // Delete Report
    // =====================================================

    const deleteReport = useCallback(
        async (reportId: string) => {
            setLoading(true);

            try {
                await deleteReportApi(reportId);

                setReports((prev) =>
                    prev.filter((report) => report._id !== reportId),
                );

                showSuccess(t('report.deleted'));
            } catch (error) {
                showError(t('report.deleteError'));

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [t],
    );

    // =====================================================
    // Statistics
    // =====================================================

    const fetchStats = useCallback(async () => {
        try {
            const data = await getReportStats();

            setStats(data);

            return data;
        } catch {
            return null;
        }
    }, []);

    // =====================================================
    // Check Report
    // =====================================================

    const hasUserReported = useCallback(
        async (type: UserReportType, targetId: string): Promise<boolean> => {
            try {
                return await hasUserReportedApi(type, targetId);
            } catch {
                return false;
            }
        },
        [],
    );

    // =====================================================
    // Blocks
    // =====================================================

    const blockUser = useCallback(
        async (payload: BlockUserPayload) => {
            setLoading(true);

            try {
                const blocked = await blockUserApi(payload);

                setBlockedUsers((prev) => [...prev, blocked]);

                showSuccess(t('report.userBlocked'));

                return blocked;
            } catch (error) {
                showError(t('report.blockError'));

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [t],
    );

    // =====================================================
    // Unblock User
    // =====================================================

    const unblockUser = useCallback(
        async (userId: string) => {
            setLoading(true);

            try {
                await unblockUserApi(userId);

                setBlockedUsers((prev) =>
                    prev.filter((user) => user._id !== userId),
                );

                showSuccess(t('report.userUnblocked'));
            } catch (error) {
                showError(t('report.unblockError'));

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [t],
    );

    // =====================================================
    // Get Blocked Users
    // =====================================================

    const fetchBlockedUsers = useCallback(async () => {
        setLoading(true);

        try {
            const data = await getBlockedUsers();

            setBlockedUsers(data);

            return data;
        } catch (error) {
            showError(t('report.fetchBlockedError'));

            throw error;
        } finally {
            setLoading(false);
        }
    }, [t]);

    // =====================================================
    // Check Block
    // =====================================================

    const checkIfBlocked = useCallback(
        async (userId: string): Promise<boolean> => {
            try {
                return await isUserBlocked(userId);
            } catch {
                return false;
            }
        },
        [],
    );

    // =====================================================
    // Return
    // =====================================================

    return {
        loading,

        reports,

        blockedUsers,

        totalReports,

        stats,

        // Reports
        createReport,
        fetchMyReports,
        fetchAllReports,
        updateReportStatus,
        deleteReport,
        fetchStats,
        hasUserReported,

        // Blocks
        blockUser,
        unblockUser,
        fetchBlockedUsers,
        checkIfBlocked,
    };
};

export default useReport;
