import {AlertColor} from "@mui/material";
import {useState} from "react";

export default function Snackbar() {
	const [_, setSnackbar] = useState<{
		open: boolean;
		message: string;
		severity: AlertColor;
	}>({
		open: false,
		message: "",
		severity: "success",
	});

	// When updating
	setSnackbar({
		open: true,
		message: "تم الشراء بنجاح",
		severity: "success" as AlertColor, // Type assertion if needed
	});
	return <div></div>;
}
