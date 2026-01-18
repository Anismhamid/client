import {FunctionComponent} from "react";
import {
	Alert,
	AlertTitle,
	Box,
	Button,
	Modal,
	TextField,
	Typography,
} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import WarningIcon from "@mui/icons-material/Warning";

export interface CreditCardValues {
	cardNumber: string;
	expiry: string;
	cvv: string;
	cardHolder: string;
}

interface PymentModalProps {
	show: boolean;
	onHide: () => void;
	onConfirm: (data: CreditCardValues) => void;
}

const PaymentModal: FunctionComponent<PymentModalProps> = ({show, onHide, onConfirm}) => {
	const formik = useFormik<CreditCardValues>({
		initialValues: {
			cardNumber: "",
			expiry: "",
			cvv: "",
			cardHolder: "",
		},
		validationSchema: yup.object({
			cardNumber: yup
				.string()
				.required("מספר כרטיס נדרש")
				.matches(/^\d{16}$/, "מספר לא תקין"),
			expiry: yup
				.string()
				.required("תוקף נדרש")
				.matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "פורמט לא תקין - לדוגמה 04/25"),
			cvv: yup
				.string()
				.required("CVV נדרש")
				.matches(/^\d{3,4}$/, "CVV לא תקין"),
			cardHolder: yup.string().required("שם בעל הכרטיס נדרש"),
		}),
		onSubmit: (values) => {
			onConfirm(values);
			onHide();
		},
	});

	return (
		<Modal sx={{direction: "rtl", textAlign: "right"}} open={show} onClose={onHide}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 400,
					bgcolor: "background.paper",
					p: 4,
					borderRadius: 2,
					boxShadow: 24,
				}}
			>
				<Alert
					// style={}
					severity='warning'
					icon={
						<WarningIcon
							style={{color: "red", fontSize: 30}}
							fontSize='inherit'
						/>
					}
				>
					<AlertTitle>אזהרה</AlertTitle>
					אין להזין פרטי אשראי אמתיים{" "}
				</Alert>
				<Typography variant='h6' mb={2}>
					הזן פרטי אשראי
				</Typography>
				<form
					style={{direction: "ltr", textAlign: "right"}}
					onSubmit={formik.handleSubmit}
				>
					<TextField
						label='מספר כרטיס'
						name='cardNumber'
						fullWidth
						margin='normal'
						value={formik.values.cardNumber}
						onChange={formik.handleChange}
						error={!!formik.errors.cardNumber}
						helperText={formik.errors.cardNumber}
					/>
					<TextField
						label='תוקף (MM/YY)'
						name='expiry'
						fullWidth
						margin='normal'
						value={formik.values.expiry}
						onChange={formik.handleChange}
						error={!!formik.errors.expiry}
						helperText={formik.errors.expiry}
					/>
					<TextField
						label='CVV'
						name='cvv'
						fullWidth
						margin='normal'
						value={formik.values.cvv}
						onChange={formik.handleChange}
						error={!!formik.errors.cvv}
						helperText={formik.errors.cvv}
					/>
					<TextField
						label='שם בעל הכרטיס'
						name='cardHolder'
						fullWidth
						margin='normal'
						value={formik.values.cardHolder}
						onChange={formik.handleChange}
						error={!!formik.errors.cardHolder}
						helperText={formik.errors.cardHolder}
					/>

					<Box mt={3} display='flex' justifyContent='space-between'>
						<Button variant='outlined' onClick={onHide}>
							ביטול
						</Button>
						<Button type='submit' variant='contained'>
							אישור
						</Button>
					</Box>
				</form>
			</Box>
		</Modal>
	);
};

export default PaymentModal;
