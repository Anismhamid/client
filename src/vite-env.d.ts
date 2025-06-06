/// <reference types="vite/client" />


// swiper
declare module "swiper/css";
declare module "swiper/css/scrollbar";
declare module "socket.io-client";
declare module "@radix-ui/react-alert-dialog";


declare module "*.png" {
	const value: string;
	export default value;
}


// .env
// interface ImportMetaEnv {
// 	VITE_API_URL: string;
// 	VITE_API_VIREFY_TOKEN: string;
// 	VITE_API_SOCKET_URL: string;
// }

// interface ImportMeta {
// 	readonly env: ImportMetaEnv;
// }
