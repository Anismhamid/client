import {
	Table,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	TextField,
	Button,
	CircularProgress,
	Typography,
	TableBody,
} from "@mui/material";
import {useFormik} from "formik";
import {FunctionComponent, useEffect, useState} from "react";
import * as yup from "yup";
import {getBusinessInfo, updateBusinessInfo} from "../../services/businessInfo";
import {BusinessInfoType} from "../../interfaces/businessInfoType";
import {showSuccess} from "../../atoms/toasts/ReactToast";
import Loader from "../../atoms/loader/Loader";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";

interface AdminSettingsProps {}

const AdminSettings: FunctionComponent<AdminSettingsProps> = () => {
	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
	const [businessInfoState, setBusinessInfoState] = useState<BusinessInfoType>({
		deliveryFee: [{area: "", fee: 0}],
		businessName: "",
		businessSAddress: "",
		businessPhone: "",
	});
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			deliveryFee: businessInfoState.deliveryFee || [{area: "", fee: 0}],
			businessName: businessInfoState.businessName,
			businessSAddress: businessInfoState.businessSAddress,
			businessPhone: businessInfoState.businessPhone,
		},
		enableReinitialize: true,
		validationSchema: yup.object({
			deliveryFee: yup.array().of(
				yup.object({
					area: yup.string().required("حقل المنطقة مطلوب"),
					fee: yup.number().min(0, "يجب أن يكون الرقم 0 أو أكثر"),
				}),
			),
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
		return <Loader />;
	}
	const currentUrl = `https://client-qqq1.vercel.app/help/adminSettings`;

	return (
		<>
			<Helmet>
				<link rel='canonical' href={currentUrl} />
				<title>اداره | {businessInfoState.businessName}</title>
				<meta name='description' content={"تغيير اعدادات الموقع"} />
			</Helmet>
			<main style={{fontFamily: "Heebo"}}>
				<Box
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						marginRight: "auto",
						marginBlock: 50,
					}}
				>
					<Typography
						color='prymary.main'
						component={"h1"}
						variant='h4'
						gutterBottom
						textAlign={"center"}
					>
						{businessInfoState.businessName}
					</Typography>
				</Box>

				<Box
					maxWidth='md'
					sx={{
						backdropFilter: "blur(8px)",
						p: 8,
						border: 1,
						borderRadius: 5,
					}}
					component='form'
					onSubmit={formik.handleSubmit}
					className='container'
				>
					<Typography variant='h4' gutterBottom textAlign={"center"}>
						تغيير اعدادات الموقع
					</Typography>
					<TableContainer
						sx={{borderRadius: 5, p: 10, border: 1}}
						component={Paper}
					>
						<Table
							sx={{
								p: 5,
								"& .MuiTableRow-root": {
									"&:hover": {
										backgroundColor: "#5595d5ac",
									},
								},
							}}
						>
							<TableHead>
								{/* <TableRow> */}
								{/* <TableCell width={"40%"} align='center'>
									מחיר משלוח
								</TableCell> */}
								{/* <TableCell>
									<TextField
										fullWidth
										variant='outlined'
										size='small'
										name='deliveryFee'
										type='number'
										value={formik.values.deliveryFee || 0}
										onChange={formik.handleChange}
									/>
								</TableCell> */}
								{/* </TableRow> */}
								<TableRow>
									<TableCell align='center'>اسم الموقع</TableCell>
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
								</TableRow>
								<TableRow>
									<TableCell align='center'>عنوان الموقع</TableCell>
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
								</TableRow>
								<TableRow>
									<TableCell align='center'>هاتف الموقع</TableCell>
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
							</TableHead>
						</Table>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>منطقة</TableCell>
									<TableCell>رسوم التوصيل</TableCell>
									<TableCell>إجراءات</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{formik.values.deliveryFee.map((d, index) => (
									<TableRow key={index}>
										<TableCell>
											<TextField
												name={`deliveryFee[${index}].area`}
												value={d.area}
												onChange={formik.handleChange}
											/>
										</TableCell>
										<TableCell>
											<TextField
												type='number'
												name={`deliveryFee[${index}].fee`}
												value={d.fee}
												onChange={formik.handleChange}
											/>
										</TableCell>
										<TableCell>
											<Button
												onClick={() => {
													const newFees = [
														...(formik.values
															.deliveryFee as any),
													];
													newFees.splice(index, 1);
													formik.setFieldValue(
														"deliveryFee",
														newFees,
													);
												}}
											>
												حذف
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
						mt={2}
						textAlign='center'
					>
						<Button
							onClick={() => navigate(-1)}
							variant='contained'
							sx={{
								fontSize: "1rem",
								boxShadow: "0 0 5px red",
								border: "1px dashed red",
								"&:hover": {
									backgroundColor: "#be4848",
									color: "gainsboro",
								},
								margin: "auto",
							}}
						>
							חזרה
						</Button>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							size='large'
							sx={{
								fontSize: "1rem",
								border: "1px dashed green",
								boxShadow: "0 0 8px #76b84f",
								"&:hover": {
									backgroundColor: "#6cb840",
									color: "gainsboro",
								},
								margin: "auto",
							}}
							disabled={loadingSubmit || (formik.isValid && !formik.dirty)}
						>
							{loadingSubmit ? <CircularProgress size={20} /> : "עדכון"}
						</Button>
					</Box>
				</Box>
			</main>
		</>
	);
};

export default AdminSettings;
