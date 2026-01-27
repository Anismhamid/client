import {
	Autocomplete,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";
import {useFormik} from "formik";
import {FunctionComponent} from "react";
import * as yup from "yup";
import useAddressData from "../../hooks/useAddressData";
import {useTranslation} from "react-i18next";

interface UserInfoModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: {
		phone_1: string;
		phone_2: string;
		city: string;
		street: string;
		houseNumber: string;
		gender: string;
	}) => Promise<void>;
}
/**
 * Determines whether open is
 * @param {
 * 	isOpen,
 * 	onClose,
 * 	onSubmit,
 * }
 * @returns
 */
const UserInfoModal: FunctionComponent<UserInfoModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
}) => {
	const {t} = useTranslation();

	const formik = useFormik({
		initialValues: {
			phone_1: "",
			phone_2: "",
			city: "",
			street: "",
			houseNumber: "",
			gender: "",
		},
		validationSchema: yup.object({
			phone_1: yup
				.string()
				.required("رقم الهاتف الرئيسي مطلوب")
				.matches(/^0\d{1,2}-?\d{7}$/, "رقم هاتف غير صالح"),
			phone_2: yup
				.string()
				.matches(/^$|^0\d{1,2}-?\d{7}$/, "رقم الهاتف الثانوي غير صالح"),
			city: yup.string().required("المدينة مطلوبة"),
			street: yup.string().required("الشارع مطلوب"),
			houseNumber: yup.string(),
			gender: yup.string().required(),
		}),
		onSubmit: async (values, {setSubmitting}) => {
			try {
				await onSubmit(values);
			} finally {
				setSubmitting(false);
			}
		},
	});
	const {cities, streets, loadingStreets} = useAddressData(formik.values.city);

	return (
		<Dialog open={isOpen} onClose={onClose} maxWidth='xs' fullWidth>
			<DialogTitle className='text-center'>
				يجب عليك إكمال التفاصيل لمواصلة التسجيل.
			</DialogTitle>
			<DialogContent>
				<Box component='form' onSubmit={formik.handleSubmit} noValidate>
					<TextField
						margin='dense'
						label='الهاتف الرئيسي'
						fullWidth
						name='phone_1'
						value={formik.values.phone_1}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.phone_1 && Boolean(formik.errors.phone_1)}
						helperText={formik.touched.phone_1 && formik.errors.phone_1}
					/>
					<TextField
						margin='dense'
						label='هاتف آخر اختياري'
						fullWidth
						name='phone_2'
						value={formik.values.phone_2}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.phone_2 && Boolean(formik.errors.phone_2)}
						helperText={formik.touched.phone_2 && formik.errors.phone_2}
					/>
					<Autocomplete
						options={cities}
						value={formik.values.city || null}
						onChange={(_event, value) => formik.setFieldValue("city", value)}
						onBlur={() => formik.setFieldTouched("city", true)}
						renderInput={(params) => (
							<TextField
								{...params}
								label='اختر المدينة'
								variant='outlined'
								error={formik.touched.city && Boolean(formik.errors.city)}
								helperText={formik.touched.city && formik.errors.city}
								className='my-2'
								fullWidth
								margin='dense'
							/>
						)}
					/>
					<Autocomplete
						options={streets}
						value={formik.values.street || null}
						onChange={(_event, value) =>
							formik.setFieldValue("street", value)
						}
						onBlur={() => formik.setFieldTouched("street", true)}
						disabled={!formik.values.city || loadingStreets}
						loading={loadingStreets}
						renderInput={(params) => (
							<TextField
								{...params}
								label='اختر الشارع'
								variant='outlined'
								error={
									formik.touched.street && Boolean(formik.errors.street)
								}
								helperText={formik.touched.street && formik.errors.street}
								className='my-2'
								fullWidth
								margin='dense'
							/>
						)}
					/>
					<TextField
						margin='dense'
						label='رقم البيت'
						fullWidth
						name='houseNumber'
						value={formik.values.houseNumber}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={
							formik.touched.houseNumber &&
							Boolean(formik.errors.houseNumber)
						}
						helperText={
							formik.touched.houseNumber && formik.errors.houseNumber
						}
					/>
					<div className='form-floating'>
						<select
							id='gender'
							name='gender'
							className='form-select'
							value={formik.values.gender}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						>
							<option value=''>{t("register.selectGender")}</option>
							<option value='male'>{t("register.male")}</option>
							<option value='female'>{t("register.female")}</option>
						</select>

						<label htmlFor='gender'>{t("register.gender")}</label>

						{formik.touched.gender && formik.errors.gender && (
							<div className='text-danger small mt-1'>
								{t("register.validation.genderRequired")}
							</div>
						)}
					</div>
					{/* <Grid container spacing={2} sx={{mt: 1}}>
						<Grid size={{xs: 12}}>
							<Box
								sx={{
									display: "flex",
									alignItems: "flex-start",
									gap: 2,
								}}
							>
								<Box sx={{flex: 1}}>
									<TextField
										label={t("register.slug")}
										name='slug'
										type='text'
										placeholder={t("register.slug")}
										value={formik.values.slug}
										onChange={(e) => {
											const value = e.target.value
												.toLowerCase()
												.replace(/[^a-z0-9-]/g, "");
											formik.setFieldValue("slug", value);
										}}
										onBlur={formik.handleBlur}
										error={
											formik.touched.slug &&
											Boolean(formik.errors.slug)
										}
										helperText={
											formik.touched.slug && formik.errors.slug
												? formik.errors.slug
												: t("register.slugHint")
										}
										fullWidth
										variant='outlined'
										size='medium'
										margin='dense'
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<Tag color='action' />
												</InputAdornment>
											),
										}}
									/>
									<SlugAvailabilityIndicator />
								</Box>
							</Box>
							<Typography
								variant='caption'
								color='text.secondary'
								sx={{
									display: "block",
									mt: 1,
								}}
							>
								{t("register.slugExample")}
							</Typography>
						</Grid>
					</Grid> */}
					<DialogActions className='d-flex align-items-center justify-content-between mt-3'>
						<Button variant='contained' onClick={onClose} color='error'>
							إلغاء التسجيل
						</Button>

						<Button type='submit' disabled={formik.isSubmitting}>
							{formik.isSubmitting ? (
								<CircularProgress size={20} />
							) : (
								"استمرار التسجيل"
							)}
						</Button>
					</DialogActions>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default UserInfoModal;
