/// <reference types="vite/client" />

// swiper
declare module 'swiper/css';
declare module 'swiper/css/scrollbar';
declare module 'socket.io-client';
declare module '@radix-ui/react-alert-dialog';
declare module '*.css';

declare module '*.png' {
    const value: string;
    export default value;
}

interface ImportMetaEnv {
    readonly VITE_API_GOOGLE_API: string;
    readonly VITE_API_URL: string;
    readonly VITE_API_VIREFY_TOKEN: string;
    readonly VITE_API_SOCKET_URL: string;
    readonly VITE_API_CLOUDINARY_UPLOADIMAGE_URL: string;
    readonly VITE_API_CLOUDINARY_UPLOADIMAGE_NAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
