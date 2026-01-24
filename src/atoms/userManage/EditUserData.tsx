import {useFormik} from "formik";
import * as yup from "yup";
import {showSuccess, showError} from "../toasts/ReactToast";
import {FunctionComponent, useEffect, useState} from "react";
import {
	Autocomplete,
	Box,
	Button,
	CircularProgress,
	TextField,
	Typography,
} from "@mui/material";
import {compleateProfileData, getUserById} from "../../services/usersServices";
import Loader from "../loader/Loader";
import useAddressData from "../../hooks/useAddressData";
import {UserRegister} from "../../interfaces/User";

interface EditUserDataProps {
	userId: string;
	mode?: "profile" | "edit";
}

/**
 * Auth complete profile
 * @returns inputs to colmplate the fileds on database
 */
const EditUserData: FunctionComponent<EditUserDataProps> = ({userId}) => {
	const [loading, setIsLoading] = useState<boolean>(true);
	const [preview, setPreview] = useState<boolean>(false);
	const [users, setUsers] = useState<UserRegister | null>(null);

	const formik = useFormik({
		initialValues: {
			name: {first: "", last: ""},
			phone: {phone_1: "", phone_2: ""},
			image: {url: "", alt: ""},
			address: {city: "", street: "", houseNumber: ""},
		},
		enableReinitialize: true,
		validationSchema: yup.object({
			name: yup.object({
				first: yup.string().required("שם פרטי חשוב"),
				last: yup.string(),
			}),
			phone: yup.object({
				phone_1: yup
					.string()
					.matches(/^0\d{1,2}-?\d{7}$/, "מספר טלפון לא תקין בפורמט ישראלי")
					.required(),
				phone_2: yup
					.string()
					.matches(/^0\d{1,2}-?\d{7}$/, "מספר טלפון לא תקין בפורמט ישראלי"),
			}),
			image: yup.object({
				url: yup.string(),
				alt: yup.string(),
			}),
			address: yup.object({
				city: yup.string().required("נדרשת עיר"),
				street: yup.string().required("נדרש רחוב"),
				houseNumber: yup.string(),
			}),
		}),
		onSubmit: (values) => {
			if (userId) {
				compleateProfileData(userId, values)
					.then(() => {
						formik.setSubmitting(false);
						showSuccess("הפרופיל עודכן בהצלחה!");
					})
					.catch(() => {
						formik.setSubmitting(false);
						showError("שגיאה בעדכון הפרופיל");
					});
			}
		},
	});

	const {cities, streets, loadingStreets} = useAddressData(formik.values.address.city);

	const handleImageChange = () => setPreview(!preview);

	useEffect(() => {
		async function getUser() {
			try {
				const user = await getUserById(userId);

				setUsers(user);
				formik.setValues({
					name: {
						first: user.name.first || "",
						last: user.name.last || "",
					},
					phone: {
						phone_1: user.phone?.phone_1 || "",
						phone_2: user.phone?.phone_2 || "",
					},
					image: {
						url: user.image?.url,
						alt: user.name?.first,
					},
					address: {
						city: user.address?.city || "בחר עיר",
						street: user.address.city
							? user.address?.street
							: "שם רחוב לא הוזן",
						houseNumber: user.address?.houseNumber || "",
					},
				});
			} catch (err) {
				console.log("Error getting user:", err);
				showError("خطأ في تحميل الملف الشخصي");
			} finally {
				setIsLoading(false);
			}
		}
		if (userId) getUser();
	}, [userId]);

	if (loading) return <Loader />;

	return (
		<Box
			style={{
				minHeight: "fit-content",
				backgroundColor: "white",
				borderRadius: 25,
				boxShadow: "0px 0.3px 1px 0px black",
				padding: 20
			}}
			className=' d-flex align-items-center justify-content-center'
			aria-label='شاشه منبثقه لتحديث الملف الشخصي'
		>
			<Box className='container '>
				<form onSubmit={formik.handleSubmit} className='mt-4'>
					<Typography
						aria-label='تحديث الملف الشخصي'
						variant='h4'
						align='center'
						gutterBottom
					>
						تحديث الملف الشخصي
					</Typography>
					<Box className=' row row-cols-md-1 row-cols-md-2  row-cols-lg-3'>
						<div>
							<TextField
								aria-label='الاسم الأول'
								label='الاسم الأول'
								name='name.first'
								type='text'
								value={formik.values.name.first}
								onChange={formik.handleChange}
								error={
									formik.touched.name?.first &&
									Boolean(formik.errors.name?.first)
								}
								helperText={
									formik.touched.name?.first &&
									formik.errors.name?.first
								}
								fullWidth
								className='my-2'
								variant='outlined'
							/>
						</div>
						<div>
							<TextField
								aria-label='اسم العائلة'
								label='اسم العائلة'
								name='name.last'
								type='text'
								value={formik.values.name.last}
								onChange={formik.handleChange}
								error={
									formik.touched.name?.last &&
									Boolean(formik.errors.name?.last)
								}
								helperText={
									formik.touched.name?.last && formik.errors.name?.last
								}
								fullWidth
								className='my-2'
								variant='outlined'
							/>
						</div>
						<div>
							<TextField
								aria-label='الهاتف الرئيسي'
								label='الهاتف الرئيسي'
								name='phone.phone_1'
								type='text'
								value={formik.values.phone.phone_1}
								onChange={formik.handleChange}
								error={
									formik.touched.phone?.phone_1 &&
									Boolean(formik.errors.phone?.phone_1)
								}
								helperText={
									formik.touched.phone?.phone_1 &&
									formik.errors.phone?.phone_1
								}
								fullWidth
								className='my-2'
								variant='outlined'
							/>
						</div>

						<div>
							<TextField
								aria-label='هاتف آخر (اختياري)'
								label='هاتف آخر (اختياري)'
								name='phone.phone_2'
								type='text'
								value={formik.values.phone.phone_2}
								onChange={formik.handleChange}
								fullWidth
								className='my-2'
								variant='outlined'
							/>
						</div>

						<div>
							<Autocomplete
								options={cities}
								value={formik.values.address.city || null}
								onChange={(_event, value) =>
									formik.setFieldValue("address.city", value)
								}
								onBlur={() =>
									formik.setFieldTouched("address.city", true)
								}
								renderInput={(params) => (
									<TextField
										{...params}
										label='اختر مدينة'
										variant='filled'
										error={
											formik.touched.address?.city &&
											Boolean(formik.errors.address?.city)
										}
										helperText={
											formik.touched.address?.city &&
											formik.errors.address?.city
										}
										className='my-2'
										fullWidth
									/>
								)}
							/>
						</div>
						<div>
							<Autocomplete
								options={streets}
								value={formik.values.address.street || null}
								onChange={(_event, value) =>
									formik.setFieldValue("address.street", value)
								}
								onBlur={() =>
									formik.setFieldTouched("address.street", true)
								}
								disabled={!formik.values.address.city || loadingStreets}
								loading={loadingStreets}
								renderInput={(params) => (
									<TextField
										{...params}
										label='اختر شارعًا'
										variant='filled'
										error={
											formik.touched.address?.street &&
											Boolean(formik.errors.address?.street)
										}
										helperText={
											formik.touched.address?.street &&
											formik.errors.address?.street
										}
										className='my-2'
										fullWidth
									/>
								)}
							/>
						</div>
						<div>
							<TextField
								aria-label='رقم المنزل'
								label='رقم المنزل'
								name='address.houseNumber'
								type='text'
								value={formik.values.address.houseNumber}
								onChange={formik.handleChange}
								fullWidth
								className='my-2'
								variant='outlined'
							/>
						</div>
						<div>
							<TextField
								aria-label='تغيير رابط الصورة'
								label='تغيير رابط الصورة'
								name='image.url'
								type='text'
								value={formik.values.image.url}
								onChange={formik.handleChange}
								fullWidth
								className='my-2'
								variant='outlined'
							/>
							<Box
								sx={{
									textAlign: "end",
									width: "100%",
								}}
							>
								<Button
									sx={{
										borderRadius: 50,
									}}
									fullWidth
									variant='outlined'
									onClick={handleImageChange}
								>
									{preview
										? "إخفاء صورة الملف الشخصي"
										: "إظهار صورة الملف الشخصي"}
								</Button>
								{preview && (
									<div className='mt-3'>
										<img
											aria-label='صورة'
											height={250}
											src={
												formik.values.image.url ||
												users?.image.url
											}
											alt={`${users?.name.first} avatar`}
											style={{
												maxWidth: "300px",
												borderRadius: "10px",
											}}
										/>
									</div>
								)}
							</Box>
						</div>
					</Box>
					<Box className='text-center mt-3 w-25 m-auto'>
						<Button
							type='submit'
							variant='outlined'
							color='primary'
							disabled={formik.isSubmitting}
							fullWidth
							sx={{
								borderRadius: 50,
							}}
						>
							{formik.isSubmitting ? (
								<CircularProgress size={24} color='inherit' />
							) : (
								"حفظ التغييرات"
							)}
						</Button>
					</Box>
				</form>
			</Box>
		</Box>
	);
};

export default EditUserData;
