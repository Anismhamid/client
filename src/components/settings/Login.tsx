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
import {AuthValues, emptyAuthValues} from "../../interfaces/authValues";
import {GoogleLogin} from "@react-oauth/google";
import {
	Box,
	Button,
	CircularProgress,
	Divider,
	PaletteMode,
	Paper,
	TextField,
	Typography,
	IconButton,
	InputAdornment,
	Fade,
	Container,
	Grid,
} from "@mui/material";
import {
	Visibility,
	VisibilityOff,
	Login as LoginIcon,
	PersonAdd,
	Email,
	Lock,
	ArrowRight,
} from "@mui/icons-material";
import UserInfoModal from "../../atoms/userManage/UserInfoModal";
import {jwtDecode} from "jwt-decode";
import {CredentialResponse} from "@react-oauth/google";
import {DecodedGooglePayload} from "../../interfaces/googleValues";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet";
import Loader from "../../atoms/loader/Loader";

interface LoginProps {
	mode?: PaletteMode;
}
/**
 * Modes login
 * @param {mode = "light"}
 * @returns Login component
 */
const Login: FunctionComponent<LoginProps> = ({mode}) => {
	const navigate = useNavigate();
	const {decodedToken, setAfterDecode} = useToken();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [googleResponse, setGoogleResponse] = useState<any>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const {setAuth, setIsLoggedIn} = useUser();
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				// Verify token is not expired before redirecting
				const decoded = jwtDecode<AuthValues>(token);
				const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : false;

				if (!isExpired) {
					navigate(path.Home);
				} else {
					// Token expired, remove it
					localStorage.removeItem("token");
				}
			} catch (error) {
				// Invalid token, remove it
				localStorage.removeItem("token");
			}
		}
	}, [navigate]);

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
				setLoading(true);
				const token = await loginUser(values);
				if (token) {
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
			} finally {
				setLoading(false);
			}
		},
	});

	const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
		if (!response.credential) {
			throw new Error("Missing Google credential");
		}
		setLoading(true);
		try {
			const decodedGoogle = jwtDecode<DecodedGooglePayload>(response.credential);
			const userExists = await verifyGoogleUser(decodedGoogle.sub);

			if (userExists) {
				const token = await handleGoogleLogin(response, null);
				if (token) {
					const decodedToken = jwtDecode<AuthValues>(token);
					setAfterDecode(token);
					setAuth(decodedToken);
					setIsLoggedIn(true);
					navigate(path.Home);
				}
			} else {
				setGoogleResponse(response);
				setShowModal(true);
			}
		} catch (error: any) {
			showError("שגיאה בהתחברות עם גוגל: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleUserInfoSubmit = async (userExtraData: any) => {
		setLoading(true);
		try {
			const token = await handleGoogleLogin(googleResponse, userExtraData);
			const decoded = jwtDecode<AuthValues>(token);
			if (token) {
				setAfterDecode(token);
				setAuth(decoded);
				setIsLoggedIn(true);
				navigate(path.Home);
			}
		} catch (error: any) {
			showError(error.message);
			setShowModal(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (localStorage.token) {
			navigate(path.Home);
		}
	}, [navigate]);

	const currentUrl = `https://client-qqq1.vercel.app/login`;

	if (loading) return <Loader />;

	return (
		<>
			<Helmet>
				<link rel='canonical' href={currentUrl} />
				<title>{`${t("login.loginButton")} | صفقة`}</title>
				<meta name='description' content={`${t("login.metaDescription")}`} />
				<meta name='keywords' content={t("login.metaKeywords")} />
				<meta property='og:title' content={`${t("login.loginButton")} | صفقة`} />
				<meta
					property='og:description'
					content={`${t("login.metaDescription")}`}
				/>
				<meta property='og:url' content={currentUrl} />
			</Helmet>

			<Container maxWidth='md' sx={{py: 8}}>
				<Box
					// component='main'
					// className='login'
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "70vh",
					}}
				>
					<Grid container spacing={4} alignItems='center'>
						{/* Left side - Welcome message */}
						<Grid size={{xs: 12, md: 6}}>
							<Fade in={true} timeout={800}>
								<Box
									sx={{
										textAlign: {xs: "center", md: "right"},
										pr: {md: 4},
										mb: {xs: 4, md: 0},
									}}
								>
									<Typography
										variant='h2'
										component='h1'
										sx={{
											fontWeight: 800,
											background:
												mode === "dark"
													? "linear-gradient(45deg, #4FC3F7 30%, #29B6F6 90%)"
													: "linear-gradient(45deg, #0288D1 30%, #0277BD 90%)",
											WebkitBackgroundClip: "text",
											WebkitTextFillColor: "transparent",
											mb: 2,
											fontSize: {xs: "2.5rem", md: "3.5rem"},
										}}
									>
										{t("login.welcomeBack") || "مرحباً بعودتك!"}
									</Typography>
									<Typography
										variant='h6'
										sx={{
											color:
												mode === "dark"
													? "text.secondary"
													: "text.primary",
											mb: 3,
											lineHeight: 1.6,
										}}
									>
										{t(
											"login.welcomeMessage",
											"سجل دخولك للوصول إلى حسابك والاستمرار من حيث توقفت",
										)}
									</Typography>
									<Button
										variant='outlined'
										startIcon={<ArrowRight />}
										onClick={() => navigate(path.Home)}
										sx={{
											borderRadius: 3,
											px: 4,
											py: 1,
											borderWidth: 2,
											"&:hover": {
												borderWidth: 2,
											},
										}}
									>
										{t("login.backToHome", "العودة للرئيسية")}
									</Button>
								</Box>
							</Fade>
						</Grid>

						{/* Right side - Login form */}
						<Grid size={{xs: 12, md: 6}}>
							<Paper
								elevation={mode === "dark" ? 8 : 4}
								sx={{
									p: {xs: 3, sm: 4, md: 5},
									borderRadius: 4,
									background:
										mode === "dark"
											? "linear-gradient(145deg, rgba(26, 32, 44, 0.95) 0%, rgba(45, 55, 72, 0.95) 100%)"
											: "linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
									backdropFilter: "blur(20px)",
									border: `2px solid ${mode === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.08)"}`,
									position: "relative",
									overflow: "hidden",
									transform: isHovered
										? "translateY(-4px)"
										: "translateY(0)",
									transition:
										"transform 0.3s ease, box-shadow 0.3s ease",
									"&:hover": {
										boxShadow:
											mode === "dark"
												? "0 20px 60px rgba(0, 0, 0, 0.4)"
												: "0 20px 60px rgba(0, 0, 0, 0.1)",
									},
									"&::before": {
										content: '""',
										position: "absolute",
										top: 0,
										left: 0,
										right: 0,
										height: "6px",
										background:
											"linear-gradient(90deg, #4FC3F7 0%, #29B6F6 50%, #0288D1 100%)",
										borderRadius: "4px 4px 0 0",
									},
								}}
								onMouseEnter={() => setIsHovered(true)}
								onMouseLeave={() => setIsHovered(false)}
							>
								<Typography
									variant='h4'
									component='h2'
									align='center'
									sx={{
										mb: 4,
										fontWeight: 700,
										color:
											mode === "dark"
												? "primary.light"
												: "primary.main",
									}}
								>
									<LoginIcon
										sx={{
											verticalAlign: "middle",
											mr: 1,
											fontSize: 32,
										}}
									/>
									{t("login.loginButton")}
								</Typography>

								<form
									autoComplete='off'
									noValidate
									onSubmit={formik.handleSubmit}
								>
									<TextField
										label={t("login.email")}
										type='email'
										name='email'
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
										margin='normal'
										variant='outlined'
										color='primary'
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<Email color='action' />
												</InputAdornment>
											),
										}}
										sx={{
											"& .MuiOutlinedInput-root": {
												borderRadius: 3,
												"&:hover fieldset": {
													borderColor: "primary.main",
													borderWidth: 2,
												},
											},
										}}
										autoComplete='email'
									/>

									<TextField
										label={t("login.password")}
										type={showPassword ? "text" : "password"}
										name='password'
										value={formik.values.password}
										onChange={formik.handleChange}
										error={
											formik.touched.password &&
											Boolean(formik.errors.password)
										}
										helperText={
											formik.touched.password &&
											formik.errors.password
										}
										fullWidth
										margin='normal'
										variant='outlined'
										color='primary'
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<Lock color='action' />
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position='end'>
													<IconButton
														onClick={() =>
															setShowPassword(!showPassword)
														}
														edge='end'
													>
														{showPassword ? (
															<VisibilityOff />
														) : (
															<Visibility />
														)}
													</IconButton>
												</InputAdornment>
											),
										}}
										sx={{
											"& .MuiOutlinedInput-root": {
												borderRadius: 3,
												"&:hover fieldset": {
													borderColor: "primary.main",
													borderWidth: 2,
												},
											},
										}}
										autoComplete='current-password'
									/>

									<Box sx={{textAlign: "right", mt: 1, mb: 3}}>
										<Link
											// TODO
											to={path.Home}
											style={{
												textDecoration: "none",
												color:
													mode === "dark"
														? "#90caf9"
														: "#1976d2",
												fontSize: "0.9rem",
												fontWeight: 500,
											}}
										>
											{t("login.forgotPassword") ||
												"نسيت كلمة المرور؟"}
										</Link>
									</Box>

									<Box sx={{mt: 4}}>
										{formik.isSubmitting ? (
											<Box sx={{textAlign: "center", py: 2}}>
												<CircularProgress size={36} />
											</Box>
										) : (
											<Button
												color='primary'
												variant='contained'
												type='submit'
												fullWidth
												size='large'
												startIcon={<LoginIcon />}
												sx={{
													borderRadius: 3,
													py: 1.5,
													fontSize: "1.1rem",
													fontWeight: 600,
													background:
														mode === "dark"
															? "linear-gradient(45deg, #29B6F6 30%, #0288D1 90%)"
															: "linear-gradient(45deg, #0288D1 30%, #0277BD 90%)",
													boxShadow:
														mode === "dark"
															? "0 3px 15px rgba(41, 182, 246, 0.3)"
															: "0 3px 15px rgba(2, 136, 209, 0.3)",
													"&:hover": {
														background:
															mode === "dark"
																? "linear-gradient(45deg, #4FC3F7 30%, #29B6F6 90%)"
																: "linear-gradient(45deg, #0277BD 30%, #01579B 90%)",
														boxShadow:
															mode === "dark"
																? "0 6px 20px rgba(41, 182, 246, 0.4)"
																: "0 6px 20px rgba(2, 136, 209, 0.4)",
													},
												}}
											>
												{t("login.loginButton")}
											</Button>
										)}
									</Box>

									<Divider sx={{my: 4}}>
										<Typography
											variant='body2'
											sx={{
												color:
													mode === "dark"
														? "text.secondary"
														: "text.primary",
												px: 2,
											}}
										>
											{t("login.or") || "أو"}
										</Typography>
									</Divider>

									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											mb: 3,
										}}
									>
										<GoogleLogin
											ux_mode='popup'
											shape='pill'
											theme='filled_blue'
											size='large'
											width='100%'
											text='signin_with'
											logo_alignment='center'
											onSuccess={handleGoogleLoginSuccess}
											onError={() =>
												showError(t("login.googleLoginError"))
											}
										/>
									</Box>

									<Box sx={{textAlign: "center", mt: 4}}>
										<Typography
											variant='body1'
											sx={{
												mb: 2,
												color:
													mode === "dark"
														? "text.secondary"
														: "text.primary",
											}}
										>
											{t("login.noAccount")}
										</Typography>
										<Button
											variant='outlined'
											color='secondary'
											onClick={() => navigate(path.Register)}
											startIcon={<PersonAdd />}
											fullWidth
											size='large'
											sx={{
												borderRadius: 3,
												py: 1.5,
												borderWidth: 2,
												fontWeight: 600,
												"&:hover": {
													borderWidth: 2,
												},
											}}
										>
											{t("login.register")}
										</Button>
									</Box>

									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											gap: 4,
											mt: 4,
											pt: 3,
											borderTop: `1px solid ${mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
										}}
									>
										<Link
											to={path.PrivacyAndPolicy}
											style={{
												textDecoration: "none",
												color:
													mode === "dark"
														? "#90caf9"
														: "#1976d2",
												fontSize: "0.9rem",
												fontWeight: 500,
												transition: "color 0.2s",
												// "&:hover": {
												// 	color:
												// 		mode === "dark"
												// 			? "#4fc3f7"
												// 			: "#0288d1",
												// },
											}}
										>
											{t("login.privacyPolicy")}
										</Link>
										<Link
											to={path.TermOfUse}
											style={{
												textDecoration: "none",
												color:
													mode === "dark"
														? "#90caf9"
														: "#1976d2",
												fontSize: "0.9rem",
												fontWeight: 500,
												transition: "color 0.2s",
												// "&:hover": {
												// 	color:
												// 		mode === "dark"
												// 			? "#4fc3f7"
												// 			: "#0288d1",
												// },
											}}
										>
											{t("login.termsOfUse")}
										</Link>
									</Box>
								</form>
							</Paper>
						</Grid>
					</Grid>
				</Box>

				<UserInfoModal
					isOpen={showModal}
					onClose={() => {
						setShowModal(false);
						setGoogleResponse(null);
					}}
					onSubmit={handleUserInfoSubmit}
				/>
			</Container>
		</>
	);
};

export default Login;
