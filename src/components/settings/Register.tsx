import {useFormik} from "formik";
import {FunctionComponent, useState, useEffect, useCallback} from "react";
import * as yup from "yup";
import {UserLogin, UserRegister} from "../../interfaces/User";
import {Link, useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";
import {
	registerNewUser,
	checkSlugAvailability,
	loginUser,
} from "../../services/usersServices";
import {
	Autocomplete,
	Box,
	Button,
	Card,
	CardContent,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Paper,
	TextField,
	Typography,
	useTheme,
	useMediaQuery,
	Alert,
	Stepper,
	Step,
	StepLabel,
} from "@mui/material";
import {
	Visibility,
	VisibilityOff,
	ArrowBack,
	PersonAdd,
	CheckCircle,
	Error as ErrorIcon,
	Check as CheckIcon,
	Close as CloseIcon,
	Tag,
} from "@mui/icons-material";
import useAddressData from "../../hooks/useAddressData";
import {useTranslation} from "react-i18next";
import {motion, AnimatePresence} from "framer-motion";
import {debounce} from "lodash";
import handleRTL from "../../locales/handleRTL";
import useToken from "../../hooks/useToken";
import {showSuccess} from "../../atoms/toasts/ReactToast";
import { useUser } from "../../context/useUSer";

interface RegisterProps {}

/**
 * Register new user
 * @returns Input fields for registering a user
 */
const Register: FunctionComponent<RegisterProps> = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
	const [checkingSlug, setCheckingSlug] = useState<boolean>(false);
	const {setAuth, setIsLoggedIn} = useUser();
	const {decodedToken, setAfterDecode} = useToken();
	const navigate = useNavigate();
	const {t} = useTranslation();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const dir = handleRTL();

	// دالة للتحقق من توفر slug مع debounce
	const checkSlug = useCallback(
		debounce(async (slug: string) => {
			if (slug.length < 3) {
				setSlugAvailable(null);
				return;
			}

			setCheckingSlug(true);
			try {
				const available = await checkSlugAvailability(slug);
				setSlugAvailable(available);
			} catch (error) {
				console.error("Error checking slug:", error);
				setSlugAvailable(null);
			} finally {
				setCheckingSlug(false);
			}
		}, 500),
		[],
	);

	// تنظيف debounce عند unmount
	useEffect(() => {
		return () => {
			checkSlug.cancel();
		};
	}, [checkSlug]);

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
			slug: "",
			role: "Client",
			terms: false,
		},
		validationSchema: yup.object({
			name: yup.object({
				first: yup
					.string()
					.required(t("register.validation.firstNameRequired"))
					.min(2, t("register.validation.firstNameMin"))
					.matches(/^[\p{L}\s]+$/u, t("register.validation.nameLettersOnly")),
				last: yup
					.string()
					.required(t("register.validation.lastNameRequired"))
					.min(2, t("register.validation.lastNameMin"))
					.matches(/^[\p{L}\s]+$/u, t("register.validation.nameLettersOnly")),
			}),
			phone: yup.object({
				phone_1: yup
					.string()
					.matches(/^0[0-9]{8,9}$/, t("register.validation.phone1Format"))
					.required(t("register.validation.phone1Required")),
				phone_2: yup
					.string()
					.matches(/^0[0-9]{8,9}$|^$/, t("register.validation.phone2Format")),
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
				houseNumber: yup
					.string()
					.matches(/^[0-9]*$/, t("register.validation.houseNumberDigits")),
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
				.max(60, t("register.validation.passwordMax"))
				.matches(/[a-z]/, t("register.validation.passwordLowercase"))
				.matches(/[A-Z]/, t("register.validation.passwordUppercase"))
				.matches(/[0-9]/, t("register.validation.passwordNumber"))
				.matches(
					/[!@#$%^&*(),.?":{}|<>]/,
					t("register.validation.passwordSpecial"),
				),
			confirmPassword: yup
				.string()
				.oneOf(
					[yup.ref("password")],
					t("register.validation.confirmPasswordMatch"),
				)
				.required(t("register.validation.confirmPasswordRequired")),
			gender: yup.string().required(t("register.validation.genderRequired")),
			slug: yup
				.string()
				.required(t("register.validation.slugRequired"))
				.min(3, t("register.validation.slugMin"))
				.max(30, t("register.validation.slugMax"))
				.matches(/^[a-z0-9-]+$/, t("register.validation.nameLettersOnly"))
				.test(
					"no-spaces",
					t("register.validation.slugNoSpaces"),
					(value) => !/\s/.test(value),
				)
				.test(
					"no-special-chars",
					t("register.validation.slugNoSpecial"),
					(value) => /^[a-z0-9-]+$/.test(value),
				),
			terms: yup.boolean().oneOf([true], t("register.validation.termsRequired")),
			image: yup.object({
				url: yup.string().url(t("register.validation.imageUrlInvalid")),
				alt: yup.string(),
			}),
		}),
		onSubmit: async (user: UserRegister) => {
			setIsLoading(true);
			setSubmitError(null);

			const dataToSend = {
				name: {
					first: user.name.first.trim(),
					last: user.name.last.trim(),
				},
				phone: {
					phone_1: user.phone.phone_1.trim(),
					phone_2: user.phone.phone_2.trim(),
				},
				address: {
					city: user.address.city.trim(),
					street: user.address.street.trim(),
					houseNumber: user?.address?.houseNumber?.trim(),
				},
				email: user.email.trim().toLowerCase(),
				password: user.password,
				gender: user.gender,
				slug: user.slug.trim().toLowerCase(),
				role: user.role,
				image: {
					url: user?.image?.url?.trim(),
					alt: user.image.alt || `${user.name.first} ${user.name.last}`,
				},
				terms: user.terms,
			};
			try {
				await registerNewUser(dataToSend);

				const login: UserLogin = {
					email: dataToSend.email,
					password: dataToSend.password,
				};

				const token = await loginUser(login);
				if (token) {
					localStorage.setItem("token", token);
					setAfterDecode(token);
					setAuth({...decodedToken, slug: decodedToken?.slug || ""});
					setIsLoggedIn(true);
					showSuccess("התחברת בהצלחה!");

					setSubmitSuccess(true);

					// Redirect after 3 seconds
					setTimeout(() => {
						navigate(path.Home);
					}, 3000);
				}
			} catch (error: any) {
				console.error("Registration error:", error);
				setSubmitError(
					error.response?.data?.message ||
						t("register.errors.serverError") ||
						"حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.",
				);
			} finally {
				setIsLoading(false);
			}
		},
	});

	// توليد slug تلقائياً من الاسم
	const generateSlugFromName = () => {
		const firstName = formik.values.name.first || "";
		const lastName = formik.values.name.last || "";

		if (!firstName && !lastName) {
			return;
		}

		const fullName = `${firstName} ${lastName}`.trim();
		const generatedSlug = fullName
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "")
			.replace(/-+/g, "-")
			.replace(/^-|-$/g, "");

		formik.setFieldValue("slug", generatedSlug);
		checkSlug(generatedSlug);
	};

	// استدعاء checkSlug عند تغيير slug
	useEffect(() => {
		if (formik.values.slug && formik.values.slug.length >= 3) {
			checkSlug(formik.values.slug);
		} else {
			setSlugAvailable(null);
		}
	}, [formik.values.slug, checkSlug]);

	const {cities, streets, loadingStreets} = useAddressData(formik.values.address.city);

	const steps = [
		{
			label: t("register.steps.personalInfo"),
			fields: ["name.first", "name.last", "slug", "email", "gender"],
		},
		{
			label: t("register.steps.contactInfo"),
			fields: ["phone.phone_1", "phone.phone_2", "address"],
		},
		{label: t("register.steps.security"), fields: ["password", "confirmPassword"]},
		{label: t("register.steps.agreements"), fields: ["terms"]},
	];

	const validateCurrentStep = () => {
		const currentFields = steps[currentStep].fields;
		let hasErrors = false;

		currentFields.forEach((field) => {
			if (field === "address") {
				if (formik.errors.address?.city || formik.errors.address?.street) {
					hasErrors = true;
				}
			} else if (formik.errors[field as keyof typeof formik.errors]) {
				hasErrors = true;
			}
		});

		return !hasErrors;
	};

	const handleNext = () => {
		if (validateCurrentStep()) {
			setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
		} else {
			// Touch all fields in current step
			steps[currentStep].fields.forEach((field) => {
				if (field === "address") {
					formik.setFieldTouched("address.city", true);
					formik.setFieldTouched("address.street", true);
				} else {
					formik.setFieldTouched(field, true);
				}
			});
		}
	};

	const handleBack = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const PasswordStrengthIndicator = ({password}: {password: string}) => {
		const getStrength = (pass: string) => {
			let score = 0;
			if (pass.length >= 8) score++;
			if (/[a-z]/.test(pass)) score++;
			if (/[A-Z]/.test(pass)) score++;
			if (/[0-9]/.test(pass)) score++;
			if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
			return score;
		};

		const strength = getStrength(password);
		const strengthLabels = [
			t("register.passwordStrength.veryWeak"),
			t("register.passwordStrength.weak"),
			t("register.passwordStrength.fair"),
			t("register.passwordStrength.good"),
			t("register.passwordStrength.strong"),
			t("register.passwordStrength.veryStrong"),
		];

		return (
			<Box dir={dir} sx={{mt: 1, mb: 2}}>
				<Typography variant='caption' color='text.secondary'>
					{strengthLabels[strength]}
				</Typography>
				<Box sx={{display: "flex", gap: 0.5, mt: 0.5}}>
					{[...Array(5)].map((_, i) => (
						<Box
							key={i}
							sx={{
								flex: 1,
								height: 4,
								borderRadius: 1,
								bgcolor:
									i < strength
										? [
												"error",
												"warning",
												"info",
												"success",
												"success",
											][strength - 1] || "grey.300"
										: "grey.200",
							}}
						/>
					))}
				</Box>
			</Box>
		);
	};

	const SlugAvailabilityIndicator = () => {
		if (!formik.values.slug || formik.values.slug.length < 3) {
			return null;
		}

		if (checkingSlug) {
			return (
				<Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
					<CircularProgress size={16} />
					<Typography variant='caption' color='text.secondary'>
						{t("register.checkingSlug")}
					</Typography>
				</Box>
			);
		}

		if (slugAvailable === true) {
			return (
				<Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
					<CheckIcon sx={{color: "success.main", fontSize: 16}} />
					<Typography variant='caption' color='success.main'>
						{t("register.slugAvailable")}
					</Typography>
				</Box>
			);
		}

		if (slugAvailable === false) {
			return (
				<Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
					<CloseIcon sx={{color: "error.main", fontSize: 16}} />
					<Typography variant='caption' color='error.main'>
						{t("register.slugTaken")}
					</Typography>
				</Box>
			);
		}

		return null;
	};

	if (submitSuccess) {
		return (
			<>
					<title>{t("register.success.title")} | صفقة</title>
					<meta
						name='description'
						content={t("register.success.description")}
					/>
				<Box
					dir={dir}
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "80vh",
						px: 2,
					}}
				>
					<Card
						dir={dir}
						sx={{
							maxWidth: 500,
							p: 4,
							textAlign: "center",
							borderRadius: 3,
							boxShadow: 6,
						}}
					>
						<motion.div
							initial={{scale: 0}}
							animate={{scale: 1}}
							transition={{type: "spring", stiffness: 200}}
						>
							<CheckCircle
								sx={{
									fontSize: 80,
									color: "success.main",
									mb: 3,
								}}
							/>
						</motion.div>
						<Typography variant='h4' gutterBottom sx={{fontWeight: 700}}>
							{t("register.success.title")}
						</Typography>
						<Typography variant='body1' color='text.secondary' paragraph>
							{t("register.success.message")}
						</Typography>
						<Typography variant='body2' color='text.secondary' paragraph>
							رابط ملفك الشخصي:
							<strong>safqa.com/users/customer/{formik.values.slug}</strong>
						</Typography>
						<Typography variant='body2' color='text.secondary' paragraph>
							{t("register.success.redirect")}
						</Typography>
						<CircularProgress size={24} sx={{mt: 2}} />
					</Card>
				</Box>
			</>
		);
	}
	const currentUrl = `https://client-qqq1.vercel.app/register`;

	return (
		<>
				<link rel='canonical' href={currentUrl} />
				<title>{t("register.title")} | صفقة</title>
				<meta name='description' content={`${t("register.title")} | صفقة`} />

			<Box
				dir={dir}
				sx={{
					minHeight: "100vh",
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					py: 4,
					px: 2,
				}}
			>
				<motion.div
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.5}}
				>
					<Grid container justifyContent='center'>
						<Grid size={{xs: 12, md: 10, lg: 8}}>
							<Paper
								elevation={24}
								sx={{
									borderRadius: 4,
									overflow: "hidden",
									background: "rgba(255, 255, 255, 0.95)",
									backdropFilter: "blur(10px)",
								}}
							>
								<Box
									sx={{
										background:
											"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
										color: "white",
										p: 3,
										textAlign: "center",
									}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
										}}
									>
										<IconButton
											onClick={() => navigate(-1)}
											sx={{color: "white"}}
											aria-label={t("common.back")}
										>
											<ArrowBack />
										</IconButton>
										<Typography variant='h4' sx={{fontWeight: 700}}>
											<PersonAdd
												sx={{mr: 1, verticalAlign: "middle"}}
											/>
											{t("register.title")}
										</Typography>
										<Box sx={{width: 40}} />
									</Box>
									<Typography
										variant='body1'
										sx={{mt: 1, opacity: 0.9}}
									>
										{t("register.subtitle")}
									</Typography>
								</Box>

								<CardContent sx={{p: {xs: 2, md: 4}}}>
									{/* Progress Stepper */}
									{!isMobile && (
										<Stepper
											activeStep={currentStep}
											sx={{mb: 4}}
											alternativeLabel
										>
											{steps.map((step) => (
												<Step key={step.label}>
													<StepLabel>{step.label}</StepLabel>
												</Step>
											))}
										</Stepper>
									)}

									{/* Error/Success Messages */}
									<AnimatePresence>
										{submitError && (
											<motion.div
												initial={{opacity: 0, y: -20}}
												animate={{opacity: 1, y: 0}}
												exit={{opacity: 0, y: -20}}
											>
												<Alert
													severity='error'
													sx={{mb: 3}}
													onClose={() => setSubmitError(null)}
													icon={<ErrorIcon />}
												>
													{submitError}
												</Alert>
											</motion.div>
										)}
									</AnimatePresence>

									<form
										autoComplete='off'
										noValidate
										onSubmit={formik.handleSubmit}
									>
										<AnimatePresence mode='wait'>
											<motion.div
												key={currentStep}
												initial={{opacity: 0, x: 50}}
												animate={{opacity: 1, x: 0}}
												exit={{opacity: 0, x: -50}}
												transition={{duration: 0.3}}
											>
												{/* Step 1: Personal Information */}
												{currentStep === 0 && (
													<Grid container spacing={3}>
														<Grid size={{xs: 12, md: 6}}>
															<TextField
																autoFocus
																label={t(
																	"register.firstName",
																)}
																name='name.first'
																type='text'
																value={
																	formik.values.name
																		.first
																}
																onChange={
																	formik.handleChange
																}
																onBlur={formik.handleBlur}
																error={
																	formik.touched.name
																		?.first &&
																	Boolean(
																		formik.errors.name
																			?.first,
																	)
																}
																helperText={
																	formik.touched.name
																		?.first &&
																	formik.errors.name
																		?.first
																}
																fullWidth
																variant='outlined'
																size='medium'
															/>
														</Grid>
														<Grid size={{xs: 12, md: 6}}>
															<TextField
																label={t(
																	"register.lastName",
																)}
																name='name.last'
																type='text'
																value={
																	formik.values.name
																		.last
																}
																onChange={
																	formik.handleChange
																}
																onBlur={formik.handleBlur}
																error={
																	formik.touched.name
																		?.last &&
																	Boolean(
																		formik.errors.name
																			?.last,
																	)
																}
																helperText={
																	formik.touched.name
																		?.last &&
																	formik.errors.name
																		?.last
																}
																fullWidth
																variant='outlined'
																size='medium'
															/>
														</Grid>
														<Grid size={{xs: 12}}>
															<Box
																sx={{
																	display: "flex",
																	alignItems:
																		"flex-start",
																	gap: 2,
																}}
															>
																<Box sx={{flex: 1}}>
																	<TextField
																		label={t(
																			"register.slug",
																		)}
																		name='slug'
																		type='text'
																		placeholder={t(
																			"register.slug",
																		)}
																		value={
																			formik.values
																				.slug
																		}
																		onChange={(e) => {
																			const value =
																				e.target.value
																					.toLowerCase()
																					.replace(
																						/[^a-z0-9-]/g,
																						"",
																					);
																			formik.setFieldValue(
																				"slug",
																				value,
																			);
																		}}
																		onBlur={
																			formik.handleBlur
																		}
																		error={
																			formik.touched
																				.slug &&
																			Boolean(
																				formik
																					.errors
																					.slug,
																			)
																		}
																		helperText={
																			formik.touched
																				.slug &&
																			formik.errors
																				.slug
																				? formik
																						.errors
																						.slug
																				: t(
																						"register.slugHint",
																					)
																		}
																		fullWidth
																		variant='outlined'
																		size='medium'
																		InputProps={{
																			startAdornment:
																				(
																					<InputAdornment position='start'>
																						<Tag color='action' />
																					</InputAdornment>
																				),
																		}}
																	/>
																	<SlugAvailabilityIndicator />
																</Box>
																<Button
																	variant='outlined'
																	onClick={
																		generateSlugFromName
																	}
																	disabled={
																		!formik.values
																			.name.first &&
																		!formik.values
																			.name.last
																	}
																	sx={{mt: 1}}
																>
																	{t(
																		"register.generateSlug",
																	)}
																</Button>
															</Box>
															<Typography
																variant='caption'
																color='text.secondary'
																sx={{
																	display: "block",
																	mt: 1,
																}}
															>
																{t(
																	"register.slugExample",
																)}
															</Typography>
														</Grid>
														<Grid size={{xs: 12}}>
															<TextField
																label={t(
																	"register.email",
																)}
																name='email'
																type='email'
																autoComplete='email'
																value={
																	formik.values.email
																}
																onChange={
																	formik.handleChange
																}
																onBlur={formik.handleBlur}
																error={
																	formik.touched
																		.email &&
																	Boolean(
																		formik.errors
																			.email,
																	)
																}
																helperText={
																	formik.touched
																		.email &&
																	formik.errors.email
																}
																fullWidth
																variant='outlined'
																size='medium'
															/>
														</Grid>
														<Grid size={{xs: 12}}>
															<TextField
																select
																label={t(
																	"register.gender",
																)}
																name='gender'
																value={
																	formik.values.gender
																}
																onChange={
																	formik.handleChange
																}
																onBlur={formik.handleBlur}
																error={
																	formik.touched
																		.gender &&
																	Boolean(
																		formik.errors
																			.gender,
																	)
																}
																helperText={
																	formik.touched
																		.gender &&
																	formik.errors.gender
																}
																fullWidth
																variant='outlined'
																size='medium'
															>
																<MenuItem value=''>
																	{t(
																		"register.selectGender",
																	)}
																</MenuItem>
																<MenuItem value='זכר'>
																	{t("register.male")}
																</MenuItem>
																<MenuItem value='נקבה'>
																	{t("register.female")}
																</MenuItem>
															</TextField>
														</Grid>
													</Grid>
												)}

												{/* Step 2: Contact Information */}
												{currentStep === 1 && (
													<Grid container spacing={3}>
														<Grid size={{xs: 12, md: 6}}>
															<TextField
																label={t(
																	"register.phone1",
																)}
																name='phone.phone_1'
																type='tel'
																placeholder='05x-xxxxxxx'
																value={
																	formik.values.phone
																		.phone_1
																}
																onChange={
																	formik.handleChange
																}
																onBlur={formik.handleBlur}
																error={
																	formik.touched.phone
																		?.phone_1 &&
																	Boolean(
																		formik.errors
																			.phone
																			?.phone_1,
																	)
																}
																helperText={
																	formik.touched.phone
																		?.phone_1 &&
																	formik.errors.phone
																		?.phone_1
																}
																fullWidth
																variant='outlined'
																size='medium'
															/>
														</Grid>
														<Grid size={{xs: 12, md: 6}}>
															<TextField
																label={t(
																	"register.phone2",
																)}
																name='phone.phone_2'
																type='tel'
																placeholder='05x-xxxxxxx (اختياري)'
																value={
																	formik.values.phone
																		.phone_2
																}
																onChange={
																	formik.handleChange
																}
																onBlur={formik.handleBlur}
																error={
																	formik.touched.phone
																		?.phone_2 &&
																	Boolean(
																		formik.errors
																			.phone
																			?.phone_2,
																	)
																}
																helperText={
																	formik.touched.phone
																		?.phone_2 &&
																	formik.errors.phone
																		?.phone_2
																}
																fullWidth
																variant='outlined'
																size='medium'
															/>
														</Grid>
														<Grid size={{xs: 12, md: 4}}>
															<Autocomplete
																options={cities}
																value={
																	formik.values.address
																		.city || null
																}
																onChange={(
																	_event,
																	value,
																) =>
																	formik.setFieldValue(
																		"address.city",
																		value,
																	)
																}
																onBlur={() =>
																	formik.setFieldTouched(
																		"address.city",
																		true,
																	)
																}
																renderInput={(params) => (
																	<TextField
																		{...params}
																		label={t(
																			"register.city",
																		)}
																		variant='outlined'
																		error={
																			formik.touched
																				.address
																				?.city &&
																			Boolean(
																				formik
																					.errors
																					.address
																					?.city,
																			)
																		}
																		helperText={
																			formik.touched
																				.address
																				?.city &&
																			formik.errors
																				.address
																				?.city
																		}
																		fullWidth
																		size='medium'
																	/>
																)}
															/>
														</Grid>
														<Grid size={{xs: 12, md: 6}}>
															<Autocomplete
																options={streets}
																value={
																	formik.values.address
																		.street || null
																}
																onChange={(
																	_event,
																	value,
																) =>
																	formik.setFieldValue(
																		"address.street",
																		value,
																	)
																}
																onBlur={() =>
																	formik.setFieldTouched(
																		"address.street",
																		true,
																	)
																}
																disabled={
																	!formik.values.address
																		.city ||
																	loadingStreets
																}
																loading={loadingStreets}
																renderInput={(params) => (
																	<TextField
																		{...params}
																		label={t(
																			"register.street",
																		)}
																		variant='outlined'
																		error={
																			formik.touched
																				.address
																				?.street &&
																			Boolean(
																				formik
																					.errors
																					.address
																					?.street,
																			)
																		}
																		helperText={
																			formik.touched
																				.address
																				?.street &&
																			formik.errors
																				.address
																				?.street
																		}
																		fullWidth
																		size='medium'
																	/>
																)}
															/>
														</Grid>
														<Grid size={{xs: 12, md: 6}}>
															<TextField
																label={t(
																	"register.houseNumber",
																)}
																name='address.houseNumber'
																type='text'
																placeholder='اختياري'
																value={
																	formik.values.address
																		.houseNumber
																}
																onChange={
																	formik.handleChange
																}
																onBlur={formik.handleBlur}
																error={
																	formik.touched.address
																		?.houseNumber &&
																	Boolean(
																		formik.errors
																			.address
																			?.houseNumber,
																	)
																}
																helperText={
																	formik.touched.address
																		?.houseNumber &&
																	formik.errors.address
																		?.houseNumber
																}
																fullWidth
																variant='outlined'
																size='medium'
															/>
														</Grid>
														<Grid size={{xs: 12}}>
															<TextField
																label={t(
																	"register.imageUrl",
																)}
																name='image.url'
																type='url'
																placeholder='https://example.com/image.jpg (اختياري)'
																value={
																	formik.values.image
																		.url
																}
																onChange={
																	formik.handleChange
																}
																onBlur={formik.handleBlur}
																error={
																	formik.touched.image
																		?.url &&
																	Boolean(
																		formik.errors
																			.image?.url,
																	)
																}
																helperText={
																	formik.touched.image
																		?.url &&
																	formik.errors.image
																		?.url
																}
																fullWidth
																variant='outlined'
																size='medium'
															/>
														</Grid>
													</Grid>
												)}

												{/* Step 3: Security */}
												{currentStep === 2 && (
													<Grid container spacing={3}>
														<Grid size={{xs: 12}}>
															<FormControl
																variant='outlined'
																error={
																	formik.touched
																		.password &&
																	Boolean(
																		formik.errors
																			.password,
																	)
																}
																fullWidth
															>
																<InputLabel htmlFor='password'>
																	{t(
																		"register.password",
																	)}
																</InputLabel>
																<OutlinedInput
																	id='password'
																	type={
																		showPassword
																			? "text"
																			: "password"
																	}
																	autoComplete='new-password'
																	endAdornment={
																		<InputAdornment position='end'>
																			<IconButton
																				aria-label={
																					showPassword
																						? "إخفاء كلمة المرور"
																						: "إظهار كلمة المرور"
																				}
																				onClick={
																					handleClickShowPassword
																				}
																				onMouseDown={
																					handleMouseDownPassword
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
																	}
																	label={t(
																		"register.password",
																	)}
																	name='password'
																	value={
																		formik.values
																			.password
																	}
																	onChange={
																		formik.handleChange
																	}
																	onBlur={
																		formik.handleBlur
																	}
																/>
																{formik.touched
																	.password &&
																	formik.errors
																		.password && (
																		<FormHelperText
																			error
																		>
																			{
																				formik
																					.errors
																					.password
																			}
																		</FormHelperText>
																	)}
																{formik.values
																	.password && (
																	<PasswordStrengthIndicator
																		password={
																			formik.values
																				.password
																		}
																	/>
																)}
															</FormControl>
														</Grid>
														<Grid size={{xs: 12}}>
															<FormControl
																variant='outlined'
																error={
																	formik.touched
																		.confirmPassword &&
																	Boolean(
																		formik.errors
																			.confirmPassword,
																	)
																}
																fullWidth
															>
																<InputLabel htmlFor='confirmPassword'>
																	{t(
																		"register.confirmPassword",
																	)}
																</InputLabel>
																<OutlinedInput
																	id='confirmPassword'
																	type={
																		showConfirmPassword
																			? "text"
																			: "password"
																	}
																	autoComplete='new-password'
																	endAdornment={
																		<InputAdornment position='end'>
																			<IconButton
																				aria-label={
																					showConfirmPassword
																						? "إخفاء تأكيد كلمة المرور"
																						: "إظهار تأكيد كلمة المرور"
																				}
																				onClick={
																					handleClickShowConfirmPassword
																				}
																				onMouseDown={
																					handleMouseDownPassword
																				}
																				edge='end'
																			>
																				{showConfirmPassword ? (
																					<VisibilityOff />
																				) : (
																					<Visibility />
																				)}
																			</IconButton>
																		</InputAdornment>
																	}
																	label={t(
																		"register.confirmPassword",
																	)}
																	name='confirmPassword'
																	value={
																		formik.values
																			.confirmPassword
																	}
																	onChange={
																		formik.handleChange
																	}
																	onBlur={
																		formik.handleBlur
																	}
																/>
																{formik.touched
																	.confirmPassword &&
																	formik.errors
																		.confirmPassword && (
																		<FormHelperText
																			error
																		>
																			{
																				formik
																					.errors
																					.confirmPassword
																			}
																		</FormHelperText>
																	)}
															</FormControl>
														</Grid>
													</Grid>
												)}

												{/* Step 4: Agreements */}
												{currentStep === 3 && (
													<Grid container spacing={3}>
														<Grid size={{xs: 12}}>
															<FormControlLabel
																control={
																	<Checkbox
																		id='terms'
																		name='terms'
																		color='primary'
																		checked={
																			formik.values
																				.terms
																		}
																		onChange={
																			formik.handleChange
																		}
																		onBlur={
																			formik.handleBlur
																		}
																	/>
																}
																label={
																	<>
																		{t(
																			"register.agreeTo",
																		)}{" "}
																		<Link
																			to={
																				path.TermOfUse
																			}
																			target='_blank'
																			rel='noopener noreferrer'
																			style={{
																				color: theme
																					.palette
																					.primary
																					.main,
																				fontWeight: 600,
																			}}
																		>
																			{t(
																				"register.termsOfService",
																			)}
																		</Link>{" "}
																		{t(
																			"register.and",
																		)}{" "}
																		<Link
																			to={
																				path.PrivacyAndPolicy
																			}
																			target='_blank'
																			rel='noopener noreferrer'
																			style={{
																				color: theme
																					.palette
																					.primary
																					.main,
																				fontWeight: 600,
																			}}
																		>
																			{t(
																				"register.privacyPolicy",
																			)}
																		</Link>
																	</>
																}
															/>
															{formik.touched.terms &&
																formik.errors.terms && (
																	<Typography
																		color='error'
																		variant='caption'
																		sx={{
																			display:
																				"block",
																			mt: 1,
																		}}
																	>
																		{
																			formik.errors
																				.terms
																		}
																	</Typography>
																)}
														</Grid>
														<Grid size={{xs: 12}}>
															<Typography
																variant='body2'
																color='text.secondary'
																sx={{
																	mt: 2,
																	lineHeight: 1.6,
																}}
															>
																{t(
																	"register.privacyNote",
																)}
															</Typography>
														</Grid>
														{/* Show user profile preview */}
														<Grid size={{xs: 12}}>
															<Paper
																variant='outlined'
																sx={{
																	p: 2,
																	mt: 2,
																	bgcolor: "grey.50",
																}}
															>
																<Typography
																	variant='subtitle2'
																	gutterBottom
																	color='primary'
																>
																	{t(
																		"register.profilePreview",
																	)}
																</Typography>
																<Box
																	sx={{
																		display: "flex",
																		alignItems:
																			"center",
																		gap: 2,
																	}}
																>
																	<Box
																		sx={{
																			width: 60,
																			height: 60,
																			borderRadius:
																				"50%",
																			bgcolor:
																				"grey.300",
																			display:
																				"flex",
																			alignItems:
																				"center",
																			justifyContent:
																				"center",
																		}}
																	>
																		{formik.values
																			.name.first
																			? formik.values.name.first
																					.charAt(
																						0,
																					)
																					.toUpperCase()
																			: "U"}
																	</Box>
																	<Box>
																		<Typography
																			variant='body1'
																			fontWeight='medium'
																		>
																			{
																				formik
																					.values
																					.name
																					.first
																			}{" "}
																			{
																				formik
																					.values
																					.name
																					.last
																			}
																		</Typography>
																		<Typography
																			variant='caption'
																			color='text.secondary'
																		>
																			@
																			{formik.values
																				.slug ||
																				"username"}
																		</Typography>
																		<br />
																		<Typography
																			variant='caption'
																			color='text.secondary'
																		>
																			{t(
																				"register.profileLink",
																			)}
																			:
																			safqa.com/users/customer
																			{formik.values
																				.slug ||
																				"username"}
																		</Typography>
																	</Box>
																</Box>
															</Paper>
														</Grid>
													</Grid>
												)}
											</motion.div>
										</AnimatePresence>

										{/* Navigation Buttons */}
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												mt: 4,
												pt: 3,
												borderTop: 1,
												borderColor: "divider",
											}}
										>
											<Button
												variant='outlined'
												onClick={handleBack}
												disabled={currentStep === 0 || isLoading}
												startIcon={<ArrowBack />}
												sx={{minWidth: 120}}
											>
												{t("common.back")}
											</Button>

											{currentStep < steps.length - 1 ? (
												<Button
													variant='contained'
													onClick={handleNext}
													sx={{minWidth: 120}}
												>
													{t("common.next")}
												</Button>
											) : (
												<Button
													variant='contained'
													color='success'
													type='submit'
													disabled={
														isLoading ||
														!formik.isValid ||
														slugAvailable === false
													}
													sx={{minWidth: 120}}
													startIcon={
														isLoading ? (
															<CircularProgress
																size={20}
																color='inherit'
															/>
														) : null
													}
												>
													{isLoading
														? t("register.creatingAccount")
														: t(
																"register.completeRegistration",
															)}
												</Button>
											)}
										</Box>
									</form>

									{/* Login Link */}
									<Box
										sx={{
											textAlign: "center",
											mt: 4,
											pt: 3,
											borderTop: 1,
											borderColor: "divider",
										}}
									>
										<Typography
											variant='body1'
											color='text.secondary'
											sx={{mb: 2}}
										>
											{t("register.haveAccount")}
										</Typography>
										<Button
											variant='text'
											color='primary'
											onClick={() => navigate(path.Login)}
											sx={{fontWeight: 600}}
										>
											{t("register.loginHere")}
										</Button>
									</Box>

									{/* Quick Links */}
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											gap: 3,
											mt: 3,
											flexWrap: "wrap",
										}}
									>
										{/* <Link
											to={path.FAQ}
											style={{
												textDecoration: "none",
												color: theme.palette.text.secondary,
												fontSize: "0.875rem",
											}}
										>
											{t("common.faq")}
										</Link> */}
										<Link
											to={path.Contact}
											style={{
												textDecoration: "none",
												color: theme.palette.text.secondary,
												fontSize: "0.875rem",
											}}
										>
											{t("common.contact")}
										</Link>
										<Link
											to={path.About}
											style={{
												textDecoration: "none",
												color: theme.palette.text.secondary,
												fontSize: "0.875rem",
											}}
										>
											{t("common.about")}
										</Link>
									</Box>
								</CardContent>
							</Paper>
						</Grid>
					</Grid>
				</motion.div>
			</Box>
		</>
	);
};

export default Register;
