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
import {editUserProfile, getUserById} from "../../services/usersServices";
import Loader from "../loader/Loader";
import useAddressData from "../../hooks/useAddressData";
import {EditUserProfile} from "../../interfaces/User";
import {useTranslation} from "react-i18next";

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
	const [user, setUser] = useState<EditUserProfile | null>(null);

	const {t} = useTranslation();

useEffect(() => {
	const fetchUser = async () => {
		try {
			setIsLoading(true);
			const userData = await getUserById(userId);
			setUser(userData);

			// Set initial values with defaults
			formik.setValues({
				name: {
					first: userData.name?.first || "",
					last: userData.name?.last || "",
				},
				phone: {
					phone_1: userData.phone?.phone_1 || "",
					phone_2: userData.phone?.phone_2 || "",
				},
				image: {
					url: userData.image?.url || "",
					alt: userData.image?.alt || userData.name?.first || "",
				},
				address: {
					city: userData.address?.city || "",
					street: userData.address?.street || "",
					houseNumber: userData.address?.houseNumber || "",
				},
				gender: userData.gender || "",
			});
		} catch (err) {
			console.error("Error getting user:", err);
			showError("خطأ في تحميل الملف الشخصي");
		} finally {
			setIsLoading(false);
		}
	};

	fetchUser();
}, [userId]);

	const formik = useFormik({
		initialValues: {
			name: {first: "", last: ""},
			phone: {phone_1: "", phone_2: ""},
			image: {url: "", alt: ""},
			address: {city: "", street: "", houseNumber: ""},
			gender: "",
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
					.matches(/^0[2-9]\d{7,8}$/, "מספר טלפון לא תקין בפורמט ישראלי")
					.required("נדרש מספר טלפון"),
				phone_2: yup
					.string()
					.matches(/^0[2-9]\d{7,8}$/, "מספר טלפון לא תקין בפורמט ישראלי"),
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
			gender: yup.string().required("נדרש מין"), // Fixed error message
		}),
		onSubmit: (values) => {
			console.log("Form values:", values); // Add this line
			console.log("User ID:", userId); // Add this line

			if (userId) {
				const payload = {
					name: {
						first: values.name.first,
						last: values.name.last || "", // Ensure no undefined
					},
					phone: {
						phone_1: values.phone.phone_1,
						phone_2: values.phone.phone_2 || "", // Ensure no undefined
					},
					image: {
						url: values.image.url || "",
						alt: values.image.alt || values.name.first || "",
					},
					address: {
						city: values.address.city,
						street: values.address.street,
						houseNumber: values.address.houseNumber || "",
					},
					gender: values.gender,
				};

				console.log("Payload to send:", payload); // Add this line

				editUserProfile(userId, payload)
					.then(() => {
						formik.setSubmitting(false);
						showSuccess("הפרופיל עודכן בהצלחה!");
					})
					.catch((error) => {
						console.error("Update error:", error); // Add this line
						formik.setSubmitting(false);
						showError("שגיאה בעדכון הפרופיל");
					});
			}
		},
	});

	const {cities, streets, loadingStreets} = useAddressData(formik.values.address.city);

	const handleImageChange = () => setPreview(!preview);

	if (loading) return <Loader />;

	return (
		<Box
			style={{
				minHeight: "fit-content",
				backgroundColor: "white",
				borderRadius: 25,
				boxShadow: "0px 0.3px 1px 0px black",
				padding: 20,
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
						<div className='form-floating'>
							<select
								id='gender'
								name='gender'
								className='form-select'
								value={formik.values.gender}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							>
								<option value=''>
									{t("register.selectGender") || "בחר מין"}
								</option>
								<option value='male'>{t("register.male")}</option>
								<option value='female'>{t("register.female")}</option>
							</select>
							<label htmlFor='gender'>{t("register.gender")}</label>
							{formik.touched.gender && formik.errors.gender && (
								<div className='text-danger small mt-1'>
									{formik.errors.gender}
								</div>
							)}
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
												user?.image?.url
											}
											alt={`${user?.name.first} avatar`}
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
