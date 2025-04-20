import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export const getUserReceiptsById = async (userId: string) => {
	try {
		const response = await axios.get(`${api}/receipt/${userId}`, {
			headers: {Authorization: localStorage.getItem("token")},
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const getUsersReceipts = async () => {
	try {
		const response = await axios.get(`${api}/receipt`, {
			headers: {Authorization: localStorage.getItem("token")},
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
