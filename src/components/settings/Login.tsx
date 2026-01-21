import {useFormik} from "formik";
import {FunctionComponent, useEffect, useState} from "react";
import {UserLogin} from "../../interfaces/User";
import * as yup from "yup";
import {Link, useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";
import {
	handleGoogleLogin,
	loginUser,
	verifyGoogleUser,
} from "../../services/usersServices";
import {useUser} from "../../context/useUSer";
import useToken from "../../hooks/useToken";
import {showError, showSuccess} from "../../atoms/toasts/ReactToast";
import {emptyAuthValues} from "../../interfaces/authValues";
import {GoogleLogin} from "@react-oauth/google";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Divider,
	PaletteMode,
	Paper,
	TextField,
} from "@mui/material";
import UserInfoModal from "../../atoms/userManage/UserInfoModal";
import {jwtDecode} from "jwt-decode";
import {CredentialResponse} from "@react-oauth/google";
import {DecodedGooglePayload} from "../../interfaces/googleValues";
import {useTranslation} from "react-i18next";

interface LoginProps {
	mode: PaletteMode;
}
/**
 * Sets auth
 * @returns
 */
const Login: FunctionComponent<LoginProps> = ({mode}) => {
	const {setAuth, setIsLoggedIn} = useUser();
	const navigate = useNavigate();
	const {decodedToken, setAfterDecode} = useToken();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [googleResponse, setGoogleResponse] = useState<any>(null);

	const {t} = useTranslation();

	const formik = useFormik<UserLogin>({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: yup.object({
			email: yup
				.string()
				.email(t("login.validation.emailInvalid"))
				.required(t("login.validation.emailRequired")),
			password: yup
				.string()
				.min(8, t("login.validation.passwordMin"))
				.max(60, t("login.validation.passwordMax"))
				.required(t("login.validation.passwordRequired")),
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
		<Box component={"main"} className='login'>
			<Paper
				elevation={mode === "dark" ? 2 : 1}
				sx={{
					p: {xs: 3, md: 5},
					borderRadius: 3,
					background:
						mode === "dark"
							? "linear-gradient(145deg, rgba(26, 32, 44, 0.274) 0%, rgba(45, 55, 72, 0.144) 100%)"
							: "linear-gradient(145deg, rgba(255, 255, 255, 0.096) 0%, rgba(248, 250, 252, 0.13) 100%)",
					backdropFilter: "blur(10px)",
					border: `1px solid ${mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
					position: "relative",
					overflow: "hidden",
					"&::before": {
						content: '""',
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						height: "4px",
						background:
							"linear-gradient(90deg, #4FC3F7 0%, #29B6F6 50%, #0288D1 100%)",
						borderRadius: "3px 3px 0 0",
					},
				}}
			>
				<form autoComplete='off' noValidate onSubmit={formik.handleSubmit}>
					<TextField
						label={t("login.email")}
						type='email'
						name='email'
						value={formik.values.email}
						onChange={formik.handleChange}
						error={formik.touched.email && Boolean(formik.errors.email)}
						helperText={formik.touched.email && formik.errors.email}
						fullWidth
						className='my-2'
						variant='standard'
						color='primary'
						sx={{
							"& .MuiOutlinedInput-root": {
								borderRadius: 2,
								"&:hover": {
									"& fieldset": {
										borderColor: "primary.main",
									},
								},
							},
						}}
						autoComplete='email'
					/>

					<TextField
						label={t("login.password")}
						type='password'
						name='password'
						value={formik.values.password}
						onChange={formik.handleChange}
						error={formik.touched.password && Boolean(formik.errors.password)}
						helperText={formik.touched.password && formik.errors.password}
						fullWidth
						className='my-2'
						variant='standard'
						color='primary'
						sx={{
							"& .MuiOutlinedInput-root": {
								borderRadius: 2,
								"&:hover": {
									"& fieldset": {
										borderColor: "primary.main",
									},
								},
							},
						}}
						autoComplete='current-password'
					/>

					<Box>
						{formik.isSubmitting ? (
							<Box className=' text-center my-2'>
								<CircularProgress size={30} color='inherit' />
							</Box>
						) : (
							<Button
								color='primary'
								variant='contained'
								type='submit'
								className=' w-100 my-3  rounded-5 '
							>
								{t("login.loginButton")}
							</Button>
						)}
					</Box>
					<hr />
					<GoogleLogin
						ux_mode='popup'
						shape='circle'
						theme='outline'
						onSuccess={handleGoogleLoginSuccess}
						onError={() => showError(t("login.googleLoginError"))}
					/>

					<Box className='m-3 text-center my-3'>
						<span className='fw-bold me-2'> {t("login.noAccount")}</span>
						<Button
							variant='contained'
							color='primary'
							onClick={() => navigate(path.Register)}
						>
							{t("login.register")}
						</Button>
					</Box>
					<Divider color='#20AAEC' style={{height: 5}} />
					<div className=' my-3 d-flex justify-content-center gap-3'>
						<Link style={{textDecoration: "none"}} to={path.PrivacyAndPolicy}>
							{t("login.privacyPolicy")}
						</Link>
						<Link style={{textDecoration: "none"}} to={path.TermOfUse}>
							{t("login.termsOfUse")}
						</Link>
					</div>
				</form>
			</Paper>
			<UserInfoModal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setGoogleResponse(null);
				}}
				onSubmit={handleUserInfoSubmit}
			/>
			{/* Accessibility Note */}
			<Alert
				severity='info'
				sx={{
					mt: 3,
					borderRadius: 2,
					display: "none", // Hidden by default, can be shown for accessibility testing
				}}
				role='note'
			>
				{t("login.accessibilityNote")}
			</Alert>
		</Box>
	);
};

export default Login;
