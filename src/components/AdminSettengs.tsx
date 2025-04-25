import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	TextField,
	Button,
	CircularProgress,
} from "@mui/material";
import {useFormik} from "formik";
import {FunctionComponent, useEffect, useState} from "react";
import * as yup from "yup";
import {getBusinessInfo, updateBusinessInfo} from "../services/businessInfo";
import {BusinessInfoType} from "../interfaces/businessInfoType";
import {showSuccess} from "../atoms/Toast";

interface AdminSettingsProps {}

const AdminSettings: FunctionComponent<AdminSettingsProps> = () => {
	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

	const [businessInfoState, setBusinessInfoState] = useState<BusinessInfoType>({
		deliveryFee: 0,
		businessName: "",
		businessSAddress: "",
		businessPhone: "",
	});

	const formik = useFormik({
		initialValues: {
			deliveryFee: businessInfoState.deliveryFee,
			businessName: businessInfoState.businessName,
			businessSAddress: businessInfoState.businessSAddress,
			businessPhone: businessInfoState.businessPhone,
		},
		enableReinitialize: true,
		validationSchema: yup.object({
			deliveryFee: yup.number(),
			businessName: yup
				.string()
				.min(3, "שם העסק חייב להכיל לפחות 3 תווים")
				.required("שדה חובה"),
			businessSAddress: yup.string().min(2, "כתובת לא תקינה").required("שדה חובה"),
			businessPhone: yup.string().min(9, "מספר טלפון לא תקין").required("שדה חובה"),
		}),

		onSubmit: (values) => {
			setLoadingSubmit(true);
			updateBusinessInfo(values as BusinessInfoType).then(() => {
				setBusinessInfoState(values);
				setLoadingSubmit(false);
				showSuccess("עודכן בהצלחה");
			});
		},
	});

	useEffect(() => {
		getBusinessInfo().then((res) => {
			setBusinessInfoState(res);
		});
	}, []);

	if (!businessInfoState) {
		return <div>Loading...</div>;
	}

	return (
		<main>
			<Box component='form' onSubmit={formik.handleSubmit} className='container'>
				<TableContainer component={Paper}>
					<Table className=''>
						<TableHead>
							<TableRow className='bg-gradient '>
								<TableCell align='center'>מחיר משלוח</TableCell>
								<TableCell align='center'>שם העסק</TableCell>
								<TableCell align='center'>כתובת העסק</TableCell>
								<TableCell align='center'>טלפון העסק</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>
									<TextField
										fullWidth
										variant='outlined'
										size='small'
										name='deliveryFee'
										type='number'
										value={formik.values.deliveryFee || 0}
										onChange={formik.handleChange}
									/>
								</TableCell>
								<TableCell>
									<TextField
										fullWidth
										variant='outlined'
										size='small'
										name='businessName'
										value={formik.values.businessName || ""}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										error={
											formik.touched.businessName &&
											Boolean(formik.errors.businessName)
										}
										helperText={
											formik.touched.businessName &&
											formik.errors.businessName
										}
									/>
								</TableCell>
								<TableCell>
									<TextField
										fullWidth
										variant='outlined'
										size='small'
										name='businessSAddress'
										value={formik.values.businessSAddress || ""}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										error={
											formik.touched.businessSAddress &&
											Boolean(formik.errors.businessSAddress)
										}
										helperText={
											formik.touched.businessSAddress &&
											formik.errors.businessSAddress
										}
									/>
								</TableCell>
								<TableCell>
									<TextField
										fullWidth
										variant='outlined'
										size='small'
										name='businessPhone'
										value={formik.values.businessPhone || ""}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										error={
											formik.touched.businessPhone &&
											Boolean(formik.errors.businessPhone)
										}
										helperText={
											formik.touched.businessPhone &&
											formik.errors.businessPhone
										}
									/>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
				<Box mt={2} textAlign='center'>
					<Button
						type='submit'
						variant='contained'
						color='primary'
						disabled={loadingSubmit}
					>
						{loadingSubmit ? <CircularProgress size={20} /> : "עדכון"}
					</Button>
				</Box>
			</Box>
		</main>
	);
};

export default AdminSettings;
