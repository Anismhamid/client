import axios from "axios";
import {UserMessage} from "../interfaces/usersMessages";

const API_URL = import.meta.env.VITE_API_URL;
const api = `${API_URL}/messages`;

// إضافة interceptor للتعامل مع التوكن بشكل مركزي
const axiosInstance = axios.create({
	baseURL: api,
});

// Interceptor لإضافة التوكن تلقائياً
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = token;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export const postMessage = async (data: {
	toUserId: string;
	message: string;
	warning?: boolean;
	isImportant?: boolean;
	replyTo?: string;
}): Promise<UserMessage> => {
	const token = localStorage.getItem("token");
	try {
		const response = await axios.post(api, data, {headers: {Authorization: token}});
		return response.data;
	} catch (error: any) {
		// تحسين رسالة الخطأ
		const errorMessage =
			error.response?.data?.message ||
			error.response?.data?.error ||
			error.message ||
			"فشل إرسال الرسالة";

		console.error("❌ Error in postMessage service:", {
			status: error.response?.status,
			statusText: error.response?.statusText,
			data: error.response?.data,
			message: errorMessage,
		});

		throw error;
	}
};

interface MessagesResponse {
	messages: UserMessage[];
	pagination: {
		total: number;
		pages: number;
		currentPage: number;
		perPage: number;
	};
}

export const getUserMessages = async (
	userId: string,
	page: number = 1,
	limit: number = 20,
): Promise<MessagesResponse> => {
	try {
		const response = await axiosInstance.get<MessagesResponse>(
			`/${userId}`,
			{
				params: {page, limit},
			},
		);

		return response.data;
	} catch (error: any) {
		// تسجيل الخطأ بشكل منظم
		if (axios.isAxiosError(error)) {
			console.error("❌ Error fetching messages:", {
				status: error.response?.status,
				statusText: error.response?.statusText,
				data: error.response?.data,
				message: error.message,
				userId,
				page,
				limit,
			});
		} else {
			console.error("❌ Unexpected error in getUserMessages:", error);
		}

		// إعادة هيكل فارغ مع pagination صحيح
		return {
			messages: [],
			pagination: {
				total: 0,
				pages: 0,
				currentPage: page,
				perPage: limit,
			},
		};
	}
};

// دالة إضافية لجلب محادثة محددة
export const getMessageById = async (messageId: string): Promise<UserMessage | null> => {
	try {
		const response = await axiosInstance.get<UserMessage>(
			`/messages/single/${messageId}`,
		);
		return response.data;
	} catch (error: any) {
		console.error("❌ Error fetching message by ID:", {
			messageId,
			error: error.response?.data || error.message,
		});
		return null;
	}
};

// دالة لتحديث حالة الرسالة (مقروءة/غير مقروءة)
export const updateMessageStatus = async (
	messageId: string,
	status: string,
): Promise<UserMessage | null> => {
	try {
		const response = await axiosInstance.patch<UserMessage>(
			`/messages/${messageId}/status`,
			{status},
		);
		return response.data;
	} catch (error: any) {
		console.error("❌ Error updating message status:", {
			messageId,
			status,
			error: error.response?.data || error.message,
		});
		return null;
	}
};

// دالة لحذف رسالة
export const deleteMessage = async (messageId: string): Promise<boolean> => {
	try {
		await axiosInstance.delete(`/messages/${messageId}`);
		return true;
	} catch (error: any) {
		console.error("❌ Error deleting message:", {
			messageId,
			error: error.response?.data || error.message,
		});
		return false;
	}
};

// دالة لجلب المحادثات غير المقروءة
export const getUnreadMessagesCount = async (userId: string): Promise<number> => {
	try {
		const response = await axiosInstance.get<{count: number}>(
			`/messages/${userId}/unread/count`,
		);
		return response.data.count;
	} catch (error: any) {
		console.error("❌ Error fetching unread messages count:", error);
		return 0;
	}
};

// دالة لوضع علامة مقروءة على جميع رسائل مستخدم
export const markAllAsRead = async (userId: string): Promise<boolean> => {
	try {
		await axiosInstance.patch(`/messages/${userId}/read-all`);
		return true;
	} catch (error: any) {
		console.error("❌ Error marking all messages as read:", error);
		return false;
	}
};

export default {
	postMessage,
	getUserMessages,
	getMessageById,
	updateMessageStatus,
	deleteMessage,
	getUnreadMessagesCount,
	markAllAsRead,
};
