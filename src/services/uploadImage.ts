import axios from "axios";

const API = import.meta.env.VITE_API_CLOUDINARY_UPLOADIMAGE_URL;
const NAME = import.meta.env.VITE_API_CLOUDINARY_UPLOADIMAGE_NAME;
const DELETE_API = import.meta.env.VITE_API_URL;

export const uploadImage = async (file: File) => {
	const formData = new FormData();

	formData.append("file", file);
	formData.append("upload_preset", NAME);

	const res = await axios.post(`${API}/upload`, formData);

	return {
		url: res.data.url,
		publicId: res.data.public_id,
	};
};

export const deleteImage = async (publicId: string) => {
	// يعتمد على سيرفرك، عادةً يكون endpoint عندك في backend
	// اللي يتعامل مع Cloudinary API
	const res = await axios.post(`${DELETE_API}/images/delete`, {publicId});
	return res.data;
};
