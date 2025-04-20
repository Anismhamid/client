import {useFormik} from "formik";
import {FunctionComponent, useEffect, useState} from "react";
import {UserLogin} from "../interfaces/User";
import * as yup from "yup";
import {Link, useNavigate} from "react-router-dom";
import {path} from "../routes/routes";
import {handleGoogleLogin, loginUser, verifyGoogleUser} from "../services/usersServices";
import {useUser} from "../context/useUSer";
import useToken from "../hooks/useToken";
import {showError, showSuccess} from "../atoms/Toast";
import {emptyAuthValues} from "../interfaces/authValues";
import {GoogleLogin} from "@react-oauth/google";
import {TextField} from "@mui/material";
import UserInfoModal from "../atoms/UserInfoModal";
import {jwtDecode} from "jwt-decode";
import {CredentialResponse} from "@react-oauth/google";

interface DecodedGooglePayload {
	sub: string;
	email?: string;
	name?: string;
	picture?: string;
}

interface LoginProps {}
/**
 * Sets auth
 * @returns
 */
const Login: FunctionComponent<LoginProps> = () => {
	const {setAuth, setIsLoggedIn} = useUser();
	const navigate = useNavigate();
	const {decodedToken, setAfterDecode} = useToken();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [googleResponse, setGoogleResponse] = useState<any>(null);

	const formik = useFormik<UserLogin>({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: yup.object({
			email: yup.string().email("אימייל לא חוקי").required("נדרש אימייל"),
			password: yup
				.string()
				.min(8, "הסיסמה חייבת לכלול לפחות 8 תווים עד 60 תווים")
				.max(60, "הסיסמה ארוכה מדי")
				.required("נדרשת סיסמה"),
		}),
		onSubmit: async (values, {resetForm}) => {
			try {
				const token = await loginUser(values);
				if (token) {
					// Save token to localStorage
					localStorage.setItem("token", token);
					setAfterDecode(token);
					setAuth(decodedToken);
					setIsLoggedIn(true);
					showSuccess("התחברת בהצלחה!");
					navigate(path.Home);
				}
			} catch (error) {
				setAuth(emptyAuthValues);
				setIsLoggedIn(false);
				resetForm();
				showError("Login failed");
			}
		},
	});

	const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
		try {
			if (!response.credential) {
				throw new Error("Missing Google credential");
			}

			const decoded = jwtDecode<DecodedGooglePayload>(response.credential);
			const userExists = await verifyGoogleUser(decoded.sub);

			if (userExists) {
				const token = await handleGoogleLogin(response, null);
				if (token) {
					const decoded = jwtDecode(token);
					console.log(decoded);
					setAfterDecode(token);
					setAuth(decoded as any);
					setIsLoggedIn(true);
					navigate(path.Home);
				}
			} else {
				setGoogleResponse(response);
				setShowModal(true);
			}
		} catch (error: any) {
			showError("שגיאה בהתחברות עם גוגל: " + error.message);
		}
	};

	const handleUserInfoSubmit = async (userExtraData: any) => {
		try {
			const token = await handleGoogleLogin(googleResponse, userExtraData);
			if (token) {
				setAfterDecode(token);
				setAuth(decodedToken);
				setIsLoggedIn(true);
				navigate(path.Home);
			}
		} catch (error: any) {
			showError("שגיאה בהתחברות עם גוגל: " + error.message);
			setShowModal(false);
		}
	};

	useEffect(() => {
		if (localStorage.token) {
			navigate(path.Home);
		}
	}, [navigate]);

	return (
		<main className='min-vh-50'>
			<div className='container p-5'>
				<form
					style={{maxWidth: "400px", margin: "auto"}}
					autoComplete='off'
					noValidate
					onSubmit={formik.handleSubmit}
				>
					<TextField
						autoFocus
						label='דו"אל'
						type='email'
						name='email'
						value={formik.values.email}
						onChange={formik.handleChange}
						error={formik.touched.email && Boolean(formik.errors.email)}
						helperText={formik.touched.email && formik.errors.email}
						fullWidth
						className='my-2'
						variant='outlined'
					/>

					<TextField
						label='סיסמה'
						type='password'
						name='password'
						value={formik.values.password}
						onChange={formik.handleChange}
						error={formik.touched.password && Boolean(formik.errors.password)}
						helperText={formik.touched.password && formik.errors.password}
						fullWidth
						className='my-2'
						variant='outlined'
					/>

					<button type='submit' className='btn btn-success w-100 mt-2'>
						כניסה
					</button>
					<div className='mt-4'>
						<GoogleLogin
							onSuccess={handleGoogleLoginSuccess}
							onError={() => showError("Google login failed")}
						/>
					</div>
					<div className='mt-3'>
						<span className='text-light fw-bold me-1'>
							עדיין אין לך חשבון ?
						</span>
						<Link to={path.Register}>לחץ כאן להרשמה</Link>
					</div>
					<div className=' my-3 d-flex justify-content-center gap-3'>
						<Link to={path.PrivacyAndPolicy}>מדיניות הפרטיות</Link>
						<Link to={path.TermOfUse}>תנאי השימוש</Link>
					</div>
				</form>
			</div>
			<UserInfoModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				onSubmit={handleUserInfoSubmit}
			/>
		</main>
	);
};

export default Login;
