import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            console.warn('Authentication required or session expired');

            window.dispatchEvent(new Event('auth:logout'));
        }

        if (status === 403) {
            console.warn('Forbidden request');
        }

        return Promise.reject(error);
    },
);

export default api;