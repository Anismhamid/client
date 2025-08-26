import {useFormik} from "formik";
import {FunctionComponent, useState} from "react";
import * as yup from "yup";
import {UserRegister} from "../../interfaces/User";
import {Link, useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";
import {registerNewUser} from "../../services/usersServices";
import {
	Autocomplete,
	Box,
	Button,
	Card,
	CardContent,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	TextField,
	Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React from "react";
import useAddressData from "../../hooks/useAddressData";
import {Col, Form, Row} from "react-bootstrap";
import {useTranslation} from "react-i18next";

interface RegisterProps {}
/**
 * register new user
 * @returns input fileds for register user
 */
const Register: FunctionComponent<RegisterProps> = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};
	const navigate = useNavigate();
	const {t} = useTranslation();

	const formik = useFormik<UserRegister>({
		initialValues: {
			name: {
				first: "",
				last: "",
			},
			phone: {
				phone_1: "",
				phone_2: "",
			},
			address: {
				city: "",
				street: "",
				houseNumber: "",
			},
			email: "",
			password: "",
			confirmPassword: "",
			gender: "",
			image: {
				url: "",
				alt: "",
			},
			role: "Client",
			terms: false,
		},
		validationSchema: yup.object({
			name: yup.object({
				first: yup
					.string()
					.required(t("register.validation.firstNameRequired"))
					.min(2, t("register.validation.firstNameMin")),
				last: yup
					.string()
					.required(t("register.validation.lastNameRequired"))
					.min(2, t("register.validation.lastNameMin")),
			}),
			phone: yup.object({
				phone_1: yup
					.string()
					.min(9, t("register.validation.phone1Min"))
					.max(10, t("register.validation.phone1Max"))
					.required(t("register.validation.phone1Required")),
				phone_2: yup.string(),
			}),
			address: yup.object({
				city: yup
					.string()
					.required(t("register.validation.cityRequired"))
					.min(2, t("register.validation.cityMin")),
				street: yup
					.string()
					.required(t("register.validation.streetRequired"))
					.min(2, t("register.validation.streetMin")),
				houseNumber: yup.string(),
			}),
			email: yup
				.string()
				.min(5, t("register.validation.emailMin"))
				.email(t("register.validation.emailInvalid"))
				.required(t("register.validation.emailRequired")),
			password: yup
				.string()
				.required(t("register.validation.passwordRequired"))
				.min(8, t("register.validation.passwordMin"))
				.max(60, t("register.validation.passwordMax")),
			confirmPassword: yup
				.string()
				.oneOf(
					[yup.ref("password")],
					t("register.validation.confirmPasswordMatch"),
				)
				.required(t("register.validation.confirmPasswordRequired")),
			gender: yup.string().required(t("register.validation.genderRequired")),
			terms: yup.boolean().oneOf([true], t("register.validation.termsRequired")),
			image: yup.object({
				url: yup.string().url(t("register.validation.imageUrlInvalid")),
				alt: yup.string(),
			}),
		}),
		onSubmit: async (user: UserRegister) => {
			const dataToSend = {
				name: {
					first: user.name.first,
					last: user.name.last,
				},
				phone: {phone_1: user.phone.phone_1, phone_2: user.phone.phone_2},
				address: {
					city: user.address.city,
					street: user.address.street,
					houseNumber: user.address.houseNumber,
				},
				email: user.email,
				password: user.password,
				gender: user.gender,
				role: user.role,
				image: {url: user.image.url, alt: user.image.alt},
				terms: user.terms,
			};

			try {
				setIsLoading(true);
				await registerNewUser(dataToSend);
				navigate(path.Login);
				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		},
	});

	const {cities, streets, loadingStreets} = useAddressData(formik.values.address.city);

	return (
		<Box sx={{display: "flex", justifyContent: "center", mt: 4}}>
			<Card
				sx={{
					maxWidth: 800,
					p: 2,
					mb: 8,
					borderRadius: 3,
					boxShadow: 6,
				}}
			>
				<CardContent>
					<Typography variant='h4' align='center' gutterBottom>
						{t("register.title")}
					</Typography>
					<Form
						autoComplete='off'
						className='border p-3 mb-5 rounded'
						noValidate
						onSubmit={formik.handleSubmit}
					>
						{/* first - last name  */}
						<Row className='row row-cols-1 row-cols-md-2'>
							<Col>
								<TextField
									autoFocus
									label={t("register.firstName")}
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
									variant='filled'
								/>
							</Col>
							<Col>
								<TextField
									label={t("register.lastName")}
									name='name.last'
									type='text'
									value={formik.values.name.last}
									onChange={formik.handleChange}
									error={
										formik.touched.name?.last &&
										Boolean(formik.errors.name?.last)
									}
									helperText={
										formik.touched.name?.last &&
										formik.errors.name?.last
									}
									fullWidth
									className='my-2'
									variant='filled'
								/>
							</Col>
						</Row>

						{/* phone 1 - 2  */}
						<Row className='row row-cols-md-2 row-cols-1'>
							<Col>
								<TextField
									label={t("register.phone1")}
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
									variant='filled'
								/>
							</Col>
							<Col>
								<TextField
									label={t("register.phone2")}
									name='phone.phone_2'
									type='text'
									value={formik.values.phone.phone_2}
									onChange={formik.handleChange}
									fullWidth
									className='my-2'
									variant='filled'
								/>
							</Col>
						</Row>

						{/* email password gender */}
						<Row className='row row-cols-md-2 row-cols-1'>
							<Col>
								<TextField
									label={t("register.email")}
									name='email'
									type='email'
									id='email'
									autoComplete='email'
									value={formik.values.email}
									onChange={formik.handleChange}
									error={
										formik.touched.email &&
										Boolean(formik.errors.email)
									}
									helperText={
										formik.touched.email && formik.errors.email
									}
									fullWidth
									className='my-2'
									variant='filled'
								/>
							</Col>
							<Col dir='ltr'>
								<FormControl
									sx={{mt: 1}}
									variant='filled'
									error={
										formik.touched.password &&
										Boolean(formik.errors.password)
									}
									fullWidth
								>
									<InputLabel htmlFor='password'>
										{t("register.password")}
									</InputLabel>
									<OutlinedInput
										id='password'
										type={showPassword ? "text" : "password"}
										autoComplete='new-password'
										endAdornment={
											<InputAdornment position='end'>
												<IconButton
													aria-label={
														showPassword
															? "hide the password"
															: "display the password"
													}
													onClick={handleClickShowPassword}
													onMouseDown={handleMouseDownPassword}
													onMouseUp={handleMouseUpPassword}
													edge='end'
												>
													{showPassword ? (
														<VisibilityOff />
													) : (
														<Visibility />
													)}
												</IconButton>
											</InputAdornment>
										}
										label={t("register.password")}
										name='password'
										value={formik.values.password}
										onChange={formik.handleChange}
									/>
									{formik.touched.password &&
										formik.errors.password && (
											<FormHelperText>
												{formik.errors.password}
											</FormHelperText>
										)}
								</FormControl>
							</Col>
							<Col>
								<TextField
									label={t("register.confirmPassword")}
									type='password'
									autoComplete='current-password'
									name='confirmPassword'
									value={formik.values.confirmPassword}
									onChange={formik.handleChange}
									error={
										formik.touched.confirmPassword &&
										Boolean(formik.errors.confirmPassword)
									}
									helperText={
										formik.touched.confirmPassword &&
										formik.errors.confirmPassword
									}
									fullWidth
									className='my-2'
									variant='filled'
								/>
							</Col>
							{/* gender */}
							<Col>
								<TextField
									select
									label={t("register.gender")}
									id='gender'
									name='gender'
									value={formik.values.gender}
									onChange={formik.handleChange}
									error={
										formik.touched.gender &&
										Boolean(formik.errors.gender)
									}
									helperText={
										formik.touched.gender && formik.errors.gender
									}
									fullWidth
									className='my-2'
									variant='filled'
								>
									<MenuItem value=''>{t("register.gender")}</MenuItem>
									<MenuItem value='זכר'>{t("register.male")}</MenuItem>
									<MenuItem value='נקבה'>
										{t("register.female")}
									</MenuItem>
								</TextField>
							</Col>
						</Row>

						{/* image - alt */}
						<hr className=' text-primary' />
						<Typography color='primary' className='text- mb-2 text-center'>
							(אופציונלי)
						</Typography>
						<Row className='row row-cols-1'>
							<Col>
								<TextField
									id='imageUrl'
									label={t("register.imageUrl")}
									type='text'
									name='image.url'
									value={formik.values.image?.url}
									onChange={formik.handleChange}
									fullWidth
									className='my-2'
									variant='filled'
									dir='rtl'
								/>
							</Col>
						</Row>

						{/* address - city - street - house number  */}
						<hr className='text-primary' />
						<Typography color='primary' textAlign={"center"}>
							{t("register.address")}
						</Typography>
						<Row className='row row-cols-1 row-cols-md-3'>
							<Col>
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
											label={t("register.city")}
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
							</Col>
							<Col>
								<Autocomplete
									options={streets}
									value={formik.values.address.street || null}
									onChange={(_event, value) =>
										formik.setFieldValue("address.street", value)
									}
									onBlur={() =>
										formik.setFieldTouched("address.street", true)
									}
									disabled={
										!formik.values.address.city || loadingStreets
									}
									loading={loadingStreets}
									renderInput={(params) => (
										<TextField
											{...params}
											label={t("register.street")}
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
							</Col>
							<Col>
								<TextField
									label={t("register.houseNumber")}
									name='address.houseNumber'
									type='text'
									value={formik.values.address.houseNumber}
									onChange={formik.handleChange}
									fullWidth
									className='my-2'
									variant='filled'
								/>
							</Col>
						</Row>
						<FormControlLabel
							control={
								<Checkbox
									id='terms'
									name='terms'
									color='primary'
									checked={formik.values.terms}
									onChange={formik.handleChange}
								/>
							}
							label={t("register.terms")}
						/>
						<Link className=' ms-4 mt-3' to={path.TermOfUse}>
							{t("login.termsOfUse")}
						</Link>
						{formik.touched.terms && formik.errors.terms && (
							<div className='text-danger small'>{formik.errors.terms}</div>
						)}
						<Box className=' m-auto mt-5'>
							<Button
								className=' w-100'
								variant='contained'
								color='primary'
								type='submit'
								disabled={!formik.dirty}
							>
								{isLoading ? t("register.loading") : t("register.submit")}
							</Button>
						</Box>
						<Box className='mt-5'>
							<span className='fw-bold me-3'>
								{t("register.haveAccount")}
							</span>
							<Button
								variant='contained'
								onClick={() => navigate(path.Login)}
							>
								{t("register.loginHere")}
							</Button>
						</Box>
					</Form>
				</CardContent>
			</Card>
		</Box>
	);
};

export default Register;
