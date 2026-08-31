/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { UserMessage } from '../interfaces/chat/usersMessages';
import {
    AuditLogsResponse,
    ConversationResponse,
    InvestigationMessage,
    InvestigationUser,
} from '../interfaces/InvestigationMessage';

// ======================================================
// API
// ======================================================

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: `${API_URL}/messages`,
});

// ======================================================
// Authorization Interceptor
// ======================================================

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = token;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// ======================================================
// Error Helper
// ======================================================

const getErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            fallback
        );
    }

    return fallback;
};

// ======================================================
// SEND MESSAGE
// POST /messages
// ======================================================

export const postMessage = async (data: {
    toUserId: string;
    message: string;
    warning?: boolean;
    isImportant?: boolean;
    replyTo?: string;
}): Promise<UserMessage> => {
    try {
        const response = await axiosInstance.post<{
            success: boolean;
            message: UserMessage;
        }>('/', data);

        return response.data.message;
    } catch (error: any) {
        console.error('❌ Error in postMessage service:', {
            status: error.response?.status,
            data: error.response?.data,
            message: getErrorMessage(error, 'فشل إرسال الرسالة'),
        });

        throw error;
    }
};

// ======================================================
// GET CONVERSATION
// GET /messages/conversation/:otherUserId
// ======================================================

export interface ConversationMessagesResponse {
    messages: UserMessage[];

    hasMore: boolean;

    unreadCount: number;
}

export const getUserMessages = async (
    userId: string,
    limit = 20,
    skip = 0,
): Promise<ConversationMessagesResponse> => {
    try {
        const response = await axiosInstance.get<ConversationMessagesResponse>(
            `/conversation/${userId}`,
            {
                params: {
                    limit,
                    skip,
                },
            },
        );

        return response.data;
    } catch (error: any) {
        console.error('❌ Error fetching conversation:', {
            status: error.response?.status,
            data: error.response?.data,
            userId,
            limit,
            skip,
            message: getErrorMessage(error, 'Failed to fetch conversation'),
        });

        return {
            messages: [],
            hasMore: false,
            unreadCount: 0,
        };
    }
};

// ======================================================
// MARK MESSAGES AS SEEN
// PATCH /messages/mark-as-seen/:fromUserId
// ======================================================

export const markMessagesAsSeen = async (
    fromUserId: string,
): Promise<boolean> => {
    try {
        await axiosInstance.patch(`/mark-as-seen/${fromUserId}`);

        return true;
    } catch (error: any) {
        console.error('❌ Error marking messages as seen:', {
            fromUserId,
            status: error.response?.status,
            data: error.response?.data,
            message: getErrorMessage(error, 'Failed to mark messages as seen'),
        });

        return false;
    }
};

// ======================================================
// GET ALL CONVERSATIONS
// GET /messages/conversations
// ======================================================

export interface ConversationItem {
    user: InvestigationUser | UserMessage['from'];

    lastMessage: UserMessage;

    unreadCount: number;
}

export const getAllConversations = async (): Promise<ConversationItem[]> => {
    try {
        const response = await axiosInstance.get<{
            conversations: ConversationItem[];
        }>('/conversations');

        return response.data.conversations || [];
    } catch (error: any) {
        console.error('❌ Error fetching conversations:', {
            status: error.response?.status,
            data: error.response?.data,
            message: getErrorMessage(error, 'Failed to fetch conversations'),
        });

        return [];
    }
};

// ======================================================
// DELETE MESSAGE
// DELETE /messages/:messageId
// ======================================================

export const deleteMessage = async (messageId: string): Promise<boolean> => {
    try {
        await axiosInstance.delete(`/${messageId}`);

        return true;
    } catch (error: any) {
        console.error('❌ Error deleting message:', {
            messageId,
            status: error.response?.status,
            data: error.response?.data,
            message: getErrorMessage(error, 'Failed to delete message'),
        });

        return false;
    }
};

// ======================================================
// ADMIN - SEARCH USERS
// GET /messages/admin/users/search
// ======================================================

export const searchInvestigationUsers = async (
    search: string,
): Promise<InvestigationUser[]> => {
    try {
        if (search.trim().length < 2) {
            return [];
        }

        const response = await axiosInstance.get<{
            success: boolean;
            users: InvestigationUser[];
        }>('/admin/users/search', {
            params: {
                search: search.trim(),
            },
        });

        return response.data.users || [];
    } catch (error: any) {
        console.error('❌ Error searching investigation users:', {
            search,
            status: error.response?.status,
            data: error.response?.data,
            message: getErrorMessage(error, 'Failed to search users'),
        });

        return [];
    }
};

// ======================================================
// ADMIN - VIEW CONVERSATION
// POST /messages/admin/conversation
// ======================================================

export const viewInvestigationConversation = async (
    user1Id: string,
    user2Id: string,
    reason: string,
): Promise<ConversationResponse> => {
    try {
        const response = await axiosInstance.post<ConversationResponse>(
            '/admin/conversation',
            {
                user1Id,
                user2Id,
                reason: reason.trim(),
            },
        );

        return response.data;
    } catch (error: any) {
        console.error('❌ Error viewing investigation conversation:', {
            user1Id,
            user2Id,
            status: error.response?.status,
            data: error.response?.data,
            message: getErrorMessage(error, 'Failed to retrieve conversation'),
        });

        throw error;
    }
};

// ======================================================
// ADMIN - VIEW ONE MESSAGE
// POST /messages/admin/view/:messageId
// ======================================================

export const viewInvestigationMessage = async (
    messageId: string,
    reason: string,
): Promise<InvestigationMessage> => {
    try {
        const response = await axiosInstance.post<{
            success: boolean;
            message: InvestigationMessage;
        }>(`/admin/view/${messageId}`, {
            reason: reason.trim(),
        });

        return response.data.message;
    } catch (error: any) {
        console.error('❌ Error viewing investigation message:', {
            messageId,
            status: error.response?.status,
            data: error.response?.data,
            message: getErrorMessage(error, 'Failed to retrieve message'),
        });

        throw error;
    }
};

// ======================================================
// ADMIN - AUDIT LOGS
// GET /messages/admin/audit-logs
// ======================================================

export const getAuditLogs = async (
    limit = 50,
    skip = 0,
): Promise<AuditLogsResponse> => {
    try {
        const response = await axiosInstance.get<AuditLogsResponse>(
            '/admin/audit-logs',
            {
                params: {
                    limit,
                    skip,
                },
            },
        );

        return response.data;
    } catch (error: any) {
        console.error('❌ Error fetching audit logs:', {
            limit,
            skip,
            status: error.response?.status,
            data: error.response?.data,
            message: getErrorMessage(error, 'Failed to retrieve audit logs'),
        });

        throw error;
    }
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default {
    postMessage,

    getUserMessages,

    markMessagesAsSeen,

    getAllConversations,

    deleteMessage,

    searchInvestigationUsers,

    viewInvestigationConversation,

    viewInvestigationMessage,

    getAuditLogs,
};
