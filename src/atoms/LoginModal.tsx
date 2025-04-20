import {FunctionComponent, useState} from "react";
import {Modal} from "react-bootstrap";
import {useFormik} from "formik";
import {UserLogin} from "../interfaces/User";
import * as yup from "yup";
import {Link} from "react-router-dom";
import {path} from "../routes/routes";
import {loginUser} from "../services/usersServices";
import {useUser} from "../context/useUSer";
import useToken from "../hooks/useToken";
import {showSuccess} from "./Toast";
import {emptyAuthValues} from "../interfaces/authValues";
import {
	Button,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface ForAllModalProps {
	show: boolean;
	onHide: Function;
}

const ForAllModal: FunctionComponent<ForAllModalProps> = ({onHide, show}) => {
	const {setAuth, setIsLoggedIn} = useUser();
	const {decodedToken, setAfterDecode} = useToken();
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const formik = useFormik<UserLogin>({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: yup.object({
			email: yup.string().required("נדרש אימייל").email("אימייל לא חוקי"),
			password: yup
				.string()
				.required("נדרשת סיסמה")
				.min(8, "הסיסמה חייבת לכלול לפחות 8 תווים עד 60 תווים")
				.max(60, "הסיסמה ארוכה מדי"),
		}),
		onSubmit: async (values, {resetForm}) => {
			try {
				const token = await loginUser(values); // Assume token is returned from login
				if (token) {
					// Save token to localStorage
					localStorage.setItem("token", token);

					setAfterDecode(token);
					setAuth(decodedToken);
					setIsLoggedIn(true);
					showSuccess("התחברת בהצלחה!");
					onHide();
				}
			} catch (error) {
				setAuth(emptyAuthValues);
				setIsLoggedIn(false);
				resetForm();
			}
		},
	});

	return (
		<Modal className='' show={show} onHide={() => onHide()} centered>
			<Modal.Body className='d-flex justify-content-center align-items-center'>
				<div className='container w-75'>
					<form
						autoComplete='off'
						noValidate
						onSubmit={formik.handleSubmit}
						className=' w-100'
					>
						<h2 className='display-6 m3-5 fw-bold text-center'>התחברות</h2>
						<div className=''>
							<TextField
								autoFocus
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
										<InputAdornment position='start'>
											<IconButton
												aria-label={
													showPassword
														? "hide the password"
														: "display the password"
												}
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												onMouseUp={handleMouseUpPassword}
												edge='start'
												color='primary'
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
						<div className=' d-flex gap-3 align-items-center justify-content-between my-3'>
							<Button
								onClick={() => onHide()}
								type='submit'
								variant='contained'
								color='error'
								className=' w-50'
							>
								סגירה
							</Button>
							<Button type='submit' variant='contained' className=' w-50'>
								התחברות
							</Button>
						</div>
						<div className='mt-3 text-start'>
							<span className='text-dark fw-bold'>
								עדיין אין לך חשבון ?
							</span>
							<Link to={path.Register}>לחץ כאן להרשמה</Link>
						</div>
					</form>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default ForAllModal;
