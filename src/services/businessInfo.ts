import axios from "axios";
import {BusinessInfoType} from "../interfaces/businessInfoType";

const api = `${import.meta.env.VITE_API_URL}/business-info`;

export const getBusinessInfo = async () => {
	try {
		const response = await axios.get(api, {
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const updateBusinessInfo = async (values: BusinessInfoType) => {
	try {
		const response = await axios.put(api, values, {
			headers: {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			},
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
