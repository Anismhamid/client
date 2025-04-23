import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccess = (message: string) => {
	toast.success(message, {
		position: "top-center",
		autoClose: 1000,
		hideProgressBar: true,
		closeOnClick: true,
		rtl: true,
		pauseOnFocusLoss: true,
		draggable: true,
		pauseOnHover: false,
	});
};

export const showError = (message: string) => {
	toast.error(message, {
		position: "top-center",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		rtl: true,
		pauseOnFocusLoss: true,
		draggable: true,
		pauseOnHover: true,
	});
};

export const showInfo = (message: string) => {
	toast.info(message, {
		position: "top-right",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		rtl: true,
		pauseOnFocusLoss: true,
		draggable: true,
		pauseOnHover: true,
	});
};

export const showWarning = (message: string) => {
	toast.warn(message, {
		position: "top-center",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		rtl: true,
		pauseOnFocusLoss: true,
		draggable: true,
		pauseOnHover: true,
	});
};
