import axios from "axios";
import {UserMessage} from "../interfaces/usersMessages";

const api = `${import.meta.env.VITE_API_URL}/messages`;

export const postMessage = async (data: {
	toUserId: string;
	message: string;
	warning?: boolean;
	isImportant?: boolean;
	replyTo?: string;
}): Promise<UserMessage> => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.post(api, data, {
			headers: {
				Authorization: token,
			},
		});
		return response.data;
	} catch (error: any) {
		console.error(
			"Error in postMessage service:",
			error.response?.data || error.message || error,
		);
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
) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.get<MessagesResponse>(
			`${api}/${userId}?page=${page}&limit=${limit}`,
			{
				headers: {Authorization: token},
			},
		);
		return response.data;
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			console.error(
				"Error fetching messages:",
				error.response?.data || error.message,
			);
		} else {
			console.error("Unexpected error:", error);
		}
		return {
			messages: [],
			pagination: {total: 0, pages: 0, currentPage: page, perPage: limit},
		};
	}
};
