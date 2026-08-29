import axios from 'axios';
import {
    AuditLogsResponse,
    ConversationResponse,
    InvestigationUser,
} from '../interfaces/InvestigationMessage';

const API_URL = `${import.meta.env.VITE_API_URL}/messages`;

const getAuthConfig = () => ({
    headers: {
        Authorization: localStorage.getItem('token') || '',
    },
});

// ======================================================
// Search users
// ======================================================

export const searchInvestigationUsers = async (
    search: string,
): Promise<InvestigationUser[]> => {
    const response = await axios.get(`${API_URL}/admin/users/search`, {
        params: {
            search,
        },
        ...getAuthConfig(),
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
    const response = await axios.post(
        `${API_URL}/admin/conversation`,
        {
            user1Id,
            user2Id,
            reason,
        },
        getAuthConfig(),
    );
    return response.data;
};

// ======================================================
// Get audit logs
// ======================================================

export const getMessageAuditLogs = async (
    limit = 50,
    skip = 0,
): Promise<AuditLogsResponse> => {
    const response = await axios.get(`${API_URL}/admin/audit-logs`, {
        params: {
            limit,
            skip,
        },
        ...getAuthConfig(),
    });

    return response.data;
};
