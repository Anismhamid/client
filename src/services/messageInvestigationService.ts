import {
    AuditLogsResponse,
    ConversationResponse,
    InvestigationUser,
} from '../interfaces/InvestigationMessage';
import api from './api';

// ======================================================
// Search users
// ======================================================

export const searchInvestigationUsers = async (
    search: string,
): Promise<InvestigationUser[]> => {
    const response = await api.get(`/messages/admin/users/search`, {
        params: {
            search,
        },
    });

    return response.data.users || [];
};

// ======================================================
// View conversation
// ======================================================

export const viewInvestigationConversation = async (
    user1Id: string,
    user2Id: string,
    reason: string,
): Promise<ConversationResponse> => {
    const response = await api.post(`/messages/admin/conversation`, {
        user1Id,
        user2Id,
        reason,
    });
    return response.data;
};

// ======================================================
// Get audit logs
// ======================================================

export const getMessageAuditLogs = async (
    limit = 50,
    skip = 0,
): Promise<AuditLogsResponse> => {
    const response = await api.get(`messages/admin/audit-logs`, {
        params: {
            limit,
            skip,
        },
    });

    return response.data;
};
