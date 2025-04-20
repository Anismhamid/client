import {useFormik} from "formik";
import {FunctionComponent, useState} from "react";
import * as yup from "yup";
import {UserRegister} from "../interfaces/User";
import {Link, useNavigate} from "react-router-dom";
import {path} from "../routes/routes";
import {registerNewUser} from "../services/usersServices";
import {
	Button,
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
} from "@mui/material";
import {cities} from "../interfaces/cities";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React from "react";

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
					.required("נדרש שם פרטי")
					.min(2, "שם פרטי חייב לכלול לפחות 2 תווים"),
				last: yup
					.string()
					.required("נדרש שם משפחה")
					.min(2, "שם משפחה חייב לכלול לפחות 2 תווים"),
			}),
			phone: yup.object({
				phone_1: yup
					.string()
					.min(10, "מספר הטלפון חייב להיות בן 9 תווים לפחות")
					.max(11, "מספר הטלפון חייב להיות באורך 10 תווים לכל היותר")
					.required('נדרש מ"ס טלפון'),
				phone_2: yup.string(),
			}),
			address: yup.object({
				city: yup
					.string()
					.min(2, "עיר חייבת להיות באורך 2 תווים לפחות")
					.required("נדרש שם עיר"),
				street: yup.string().required("נדרש שם רחוב"),
				houseNumber: yup.string().optional(),
			}),
			email: yup
				.string()
				.min(5, 'הדוא"ל חייב להיות באורך 5 תווים לפחות')
				.email("אימייל לא חוקי")
				.required("נדרש אימייל"),
			password: yup
				.string()
				.required("נדרשת סיסמה")
				.min(8, "הסיסמה חייבת לכלול לפחות 8 תווים עד 60 תווים")
				.max(60, "הסיסמה ארוכה מדי"),
			confirmPassword: yup
				.string()
				.oneOf([yup.ref("password")], "הסיסמאות אינן תואמות")
				.required("יש לאשר את הסיסמה"),
			gender: yup.string().required("יש לבחור מגדר"),
			role: yup.string().default("Client"),
			image: yup.object({
				url: yup.string().url("פורמט כתובת אתר לא חוקי").optional(),
				alt: yup.string().optional(),
			}),
			terms: yup.boolean().oneOf([true], "יש לאשר את תנאי השימוש"),
		}),
		onSubmit: async (values) => {
			try {
				setIsLoading(true);
				await registerNewUser(values);
				navigate(path.Login);
				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		},
	});

	return (
		<main className='min-vh-100'>
			<div className='container pt-5'>
				<form
					style={{maxWidth: "800px", margin: "auto"}}
					autoComplete='off'
					noValidate
					onSubmit={formik.handleSubmit}
				>
					<h6 className='display-6 text-center'>הרשמה</h6>

					{/* first - last name  */}
					<div className='row row-cols-2'>
						<div className=''>
							<TextField
								autoFocus
								label='שם'
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
						<div className=''>
							<TextField
								label='שם משפחה'
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
					</div>

					{/* phone 1 - 2  */}
					<div className='row row-cols-2'>
						<div>
							<TextField
								label='טלופן ראשי'
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
								label='טלופן שני (לא חובה)'
								name='phone.phone_2'
								type='text'
								value={formik.values.phone.phone_2}
								onChange={formik.handleChange}
								fullWidth
								className='my-2'
								variant='outlined'
							/>
						</div>
					</div>

					{/* email password */}
					<hr className='text-light' />
					<div className='row row-cols-3'>
						<div>
							<TextField
								label='דו"אל'
								name='email'
								type='email'
								value={formik.values.email}
								onChange={formik.handleChange}
								error={
									formik.touched.email && Boolean(formik.errors.email)
								}
								helperText={formik.touched.email && formik.errors.email}
								fullWidth
								className='my-2'
								variant='outlined'
							/>
						</div>
						<div dir='ltr'>
							<FormControl
								sx={{m: 1}}
								variant='outlined'
								error={
									formik.touched.password &&
									Boolean(formik.errors.password)
								}
								fullWidth
							>
								<InputLabel htmlFor='password'>סיסמה</InputLabel>
								<OutlinedInput
									id='password'
									type={showPassword ? "text" : "password"}
									autoComplete='current-password'
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
									label='סיסמה'
									name='password'
									value={formik.values.password}
									onChange={formik.handleChange}
								/>
								{formik.touched.password && formik.errors.password && (
									<FormHelperText>
										{formik.errors.password}
									</FormHelperText>
								)}
							</FormControl>
						</div>
						<div>
							<TextField
								label='אישור סיסמה'
								type='password'
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
								variant='outlined'
							/>
						</div>
					</div>
					<TextField
						select
						label='מגדר'
						name='gender'
						value={formik.values.gender}
						onChange={formik.handleChange}
						error={formik.touched.gender && Boolean(formik.errors.gender)}
						helperText={formik.touched.gender && formik.errors.gender}
						fullWidth
						className='my-2'
						variant='outlined'
					>
						<MenuItem value=''>בחר מגדר</MenuItem>
						<MenuItem value='זכר'>זכר</MenuItem>
						<MenuItem value='נקבה'>נקבה</MenuItem>
					</TextField>
					{/* image - alt */}
					<hr className=' text-light' />

					<h6 className='text-primary mb-2 text-center'>(אופציונלי)</h6>

					<div className='row row-cols-2'>
						<div>
							<TextField
								label='קישור לתמונה'
								type='text'
								name='image.url'
								value={formik.values.image?.url}
								onChange={formik.handleChange}
								fullWidth
								className='my-2'
								variant='outlined'
							/>
						</div>
						<div>
							<TextField
								label='שם תמונה'
								type='text'
								name='image.alt'
								value={formik.values.image?.alt}
								onChange={formik.handleChange}
								fullWidth
								className='my-2'
								variant='outlined'
							/>
						</div>
					</div>

					{/* address city - street - house number  */}
					<hr className='text-light' />
					<div className='row row-cols-3'>
						<div>
							<TextField
								select
								label='עיר'
								name='address.city'
								value={formik.values.address.city}
								onChange={formik.handleChange}
								error={
									formik.touched.address?.city &&
									Boolean(formik.errors.address?.city)
								}
								helperText={
									formik.touched.address?.city &&
									formik.errors.address?.city
								}
								fullWidth
								className='my-2'
								variant='outlined'
							>
								<MenuItem value=''>
									<em>בחר עיר</em>
								</MenuItem>
								{cities.map((city, idx) => (
									<MenuItem key={idx} value={city}>
										{city}
									</MenuItem>
								))}
							</TextField>
						</div>
						<div>
							<TextField
								label='רחוב'
								name='address.street'
								type='text'
								value={formik.values.address?.street}
								onChange={formik.handleChange}
								error={
									formik.touched.address?.street &&
									Boolean(formik.errors.address?.street)
								}
								helperText={
									formik.touched.address?.street &&
									formik.errors.address?.street
								}
								fullWidth
								className='my-2'
								variant='outlined'
							/>
						</div>
						<div>
							<TextField
								label='מספר בית'
								name='address.houseNumber'
								type='text'
								value={formik.values.address?.houseNumber}
								onChange={formik.handleChange}
								fullWidth
								className='my-2'
								variant='outlined'
							/>
						</div>
					</div>
					<FormControlLabel
						control={
							<Checkbox
								name='terms'
								color='primary'
								checked={formik.values.terms}
								onChange={formik.handleChange}
							/>
						}
						label='אני מסכים לתנאי השימוש והפרטיות'
					/>
					<Link className=' ms-4 mt-3' to={path.TermOfUse}>
						תנאי השימוש
					</Link>
					{formik.touched.terms && formik.errors.terms && (
						<div className='text-danger small'>{formik.errors.terms}</div>
					)}
					<div className=' m-auto mt-5'>
						<Button
							className=' w-100'
							variant='contained'
							color='primary'
							type='submit'
							disabled={!formik.dirty}
						>
							{isLoading ? "טוען..." : "הרשמה"}
						</Button>
					</div>
					<div className='mt-5'>
						<span className='fw-bold me-3'>יש לך חשבון ?</span>
						<Link to={path.Login}>התחבר כאן</Link>
					</div>
				</form>
			</div>
		</main>
	);
};

export default Register;
