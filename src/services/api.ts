import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// مسارات الـ 401 فيها طبيعي (فحص الجلسة)
const SILENT_401 = ['/users/me'];

let loggingOut = false;

api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;
        const url: string = error.config?.url ?? '';
        const silent = SILENT_401.some((p) => url.includes(p));

        if (status === 401 && !silent && !loggingOut) {
            loggingOut = true; // مرة وحدة بس، مش لكل طلب
            window.dispatchEvent(new Event('auth:logout'));
            setTimeout(() => (loggingOut = false), 1000);
        }

        if (status === 403) {
            console.warn('Forbidden request');
        }

        return Promise.reject(error);
    },
);

export default api;