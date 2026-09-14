/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserMessage } from '../interfaces/chat/usersMessages';
import {
    AuditLogsResponse,
    ConversationResponse,
    InvestigationMessage,
    InvestigationUser,
} from '../interfaces/InvestigationMessage';
import api from './api';

// ======================================================
// API
// ======================================================




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
        const response = await api.post<{
            success: boolean;
            message: UserMessage;
        }>('/messages', data);

        return response.data.message;
    } catch (error: any) {
        console.error('❌ Error in postMessage service:', {
            status: error.response?.status,
            data: error.response?.data,
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
        const response = await api.get<ConversationMessagesResponse>(
            `/messages/conversation/${userId}`,
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
        await api.patch(`/messages/mark-as-seen/${fromUserId}`);

        return true;
    } catch (error: any) {
        console.error('❌ Error marking messages as seen:', {
            fromUserId,
            status: error.response?.status,
            data: error.response?.data,
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
        const response = await api.get<{
            conversations: ConversationItem[];
        }>('/messages/conversations');

        return response.data.conversations || [];
    } catch (error: any) {
        console.error('❌ Error fetching conversations:', {
            status: error.response?.status,
            data: error.response?.data,
        });

        return [];
    }
};

// ======================================================
// EDIT MESSAGE
// PATCH /messages/:messageId
// ======================================================

export const editMessage = async (
    messageId: string,
    message: string,
): Promise<UserMessage> => {
    try {
        const response = await api.patch<{
            success: boolean;
            message: UserMessage;
        }>(`/messages/${messageId}`, {
            message: message.trim(),
        });

        return response.data.message;
    } catch (error: any) {
        console.error('❌ Error editing message:', {
            messageId,
            status: error.response?.status,
            data: error.response?.data,
        });

        throw error;
    }
};

// ======================================================
// DELETE MESSAGE
// DELETE /messages/:messageId
// ======================================================

export const deleteMessage = async (messageId: string): Promise<boolean> => {
    try {
        await api.delete(`/messages/${messageId}`);

        return true;
    } catch (error: any) {
        console.error('❌ Error deleting message:', {
            messageId,
            status: error.response?.status,
            data: error.response?.data,
        });

        return false;
    }
};

// ======================================================
// DELETE CONVERSATION
// DELETE /messages/conversation/:userId
// ======================================================

export const deleteConversation = async (
    userId: string,
): Promise<{
    success: boolean;
    deletedCount?: number;
    roomId?: string;
}> => {
    try {
        const response = await api.delete<{
            success: boolean;
            deletedCount?: number;
            roomId?: string;
        }>(`/messages/conversation/${userId}`);

        return response.data;
    } catch (error: any) {
        console.error('❌ Error deleting conversation:', {
            userId,
            status: error.response?.status,
            data: error.response?.data,
        });

        throw error;
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

        const response = await api.get<{
            success: boolean;
            users: InvestigationUser[];
        }>('/messages/admin/users/search', {
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
        const response = await api.post<ConversationResponse>(
            '/messages/admin/conversation',
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
        const response = await api.post<{
            success: boolean;
            message: InvestigationMessage;
        }>(`/messages/admin/view/${messageId}`, {
            reason: reason.trim(),
        });

        return response.data.message;
    } catch (error: any) {
        console.error('❌ Error viewing investigation message:', {
            messageId,
            status: error.response?.status,
            data: error.response?.data,
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
        const response = await api.get<AuditLogsResponse>(
            '/messages/admin/audit-logs',
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

    editMessage,

    deleteMessage,

    deleteConversation,

    searchInvestigationUsers,

    viewInvestigationConversation,

    viewInvestigationMessage,

    getAuditLogs,
};
