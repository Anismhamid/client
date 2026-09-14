import axios from 'axios';
import api from '../services/api';

const CLOUDINARY_API =
    import.meta.env.VITE_API_CLOUDINARY_UPLOADIMAGE_URL;

const CLOUDINARY_UPLOAD_PRESET =
    import.meta.env.VITE_API_CLOUDINARY_UPLOADIMAGE_NAME;

/**
 * رفع صورة مباشرة إلى Cloudinary
 *
 * هذا الطلب لا يحتاج Auth Cookie الخاصة بـ Safqa،
 * لأنه يتم مباشرة إلى Cloudinary باستخدام upload preset.
 */
export const uploadImage = async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(
        `${CLOUDINARY_API}/upload`,
        formData,
    );

    return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
    };
};

/**
 * حذف صورة من Cloudinary عن طريق Backend Safqa
 *
 * الـ Backend يحتاج Cookie الخاصة بالمستخدم.
 */
export const deleteImage = async (publicId: string) => {
    const response = await api.post('/images/delete', {
        publicId,
    });

    return response.data;
};