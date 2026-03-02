import {useState} from "react";
import {AlertColor} from "@mui/material";

export interface SnackbarState {
	open: boolean;
	message: string;
	severity: AlertColor;
}

export default function useSnackbar() {
	const [snackbar, setSnackbar] = useState<SnackbarState>({
		open: false,
		message: "",
		severity: "success",
	});

	const showSnackbar = (message: string, severity: AlertColor = "success") => {
		setSnackbar({open: true, message, severity});
	};

	const closeSnackbar = () => {
		setSnackbar((prev) => ({...prev, open: false}));
	};

	return {snackbar, showSnackbar, closeSnackbar};
}
