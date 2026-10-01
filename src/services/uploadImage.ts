import axios from 'axios';
import api from '../services/api';

const CLOUDINARY_API = import.meta.env.VITE_API_CLOUDINARY_UPLOADIMAGE_URL;

interface UploadSignature {
    signature: string;
    apiKey: string;
    params: Record<string, string | number | boolean>;
}

/**
 *
 * @param file
 * @param opts
 * @returns
 */
export const uploadImage = async (
    file: File,
    opts: { adId?: string; type?: 'ad' | 'profile' } = {},
) => {
    // 1. جيب التوقيع من Backend Safqa (بيحتاج Cookie المستخدم)
    const { data: sig } = await api.post<UploadSignature>('/images/sign', {
        adId: opts.adId,
        type: opts.type,
    });

    // 2. ارفع مباشرة لـ Cloudinary: كل params الموقّعة بالضبط
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sig.apiKey);
    formData.append('signature', sig.signature);
    Object.entries(sig.params).forEach(([k, v]) =>
        formData.append(k, String(v)),
    );

    const response = await axios.post(`${CLOUDINARY_API}/upload`, formData);

    return {
        url: response.data.secure_url as string,
        publicId: response.data.public_id as string,
    };
};

/**
 *
 * @param image
 * @returns
 */
export const updateUserImage = async (image: { url: string; alt: string }) => {
    const response = await api.patch('/images/me/image', image);
    return response.data;
};

/**
 *
 * @param publicId
 * @returns
 */
export const deleteImage = async (publicId: string) => {
    const response = await api.post('/images/delete', { publicId });
    return response.data;
};
