import axios from "axios";

const API = import.meta.env.VITE_API_CLOUDINARY_UPLOADIMAGE_URL;

export const uploadImage = async (file: File) => {
	const formData = new FormData();

	formData.append("file", file);
	formData.append("upload_preset", "react_anis_upload");

	const res = await axios.post(API, formData);

	return res.data;
};
