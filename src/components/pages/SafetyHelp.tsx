import {FunctionComponent, JSX} from "react";
import {useTranslation} from "react-i18next";
import {
	Container,
	Typography,
	Box,
	Paper,
	Grid,
	Divider,
	Chip,
	Stack,
	Card,
	CardContent,
	alpha,
	useTheme,
	Alert,
	Fade,
} from "@mui/material";
import {
	VerifiedUser,
	Payments,
	LocationOn,
	WarningAmber,
	Security,
	SafetyCheck,
	ReportProblem,
	LocalPolice,
} from "@mui/icons-material";
import handleRTL from "../../locales/handleRTL";

interface SafetyTip {
	icon: JSX.Element;
	title: string;
	desc: string;
	severity: "success" | "warning" | "info" | "error";
	tags?: string[];
}

interface SafetyLevel {
	level: string;
	desc: string;
	icon: JSX.Element;
	color: "success" | "warning" | "error";
}

const SafetyHelp: FunctionComponent = () => {
	const {t} = useTranslation();
	const theme = useTheme();
	const direction = handleRTL();

	const tips: SafetyTip[] = [
		{
			icon: <VerifiedUser />,
			title: t("safety.tip1.title", "تحقق من الطرف الآخر"),
			desc: t(
				"safety.tip1.desc",
				"راجع تقييمات المستخدم وتاريخ نشاطه قبل إتمام أي صفقة. تحقق من التعليقات السابقة وعدد المعاملات الناجحة.",
			),
			severity: "success",
			tags: [
				t("safety.tags.verification", "تأكيد الهوية"),
				t("safety.tags.reviews", "التقييمات"),
			],
		},
		{
			icon: <Payments />,
			title: t("safety.tip2.title", "تجنب الدفع المسبق"),
			desc: t(
				"safety.tip2.desc",
				"لا تقم بتحويل أموال قبل استلام المنتج أو التأكد من حالته. استخدم الدفع عند الاستلام أو الأنظمة الآمنة للمعاملات الكبيرة.",
			),
			severity: "warning",
			tags: [t("safety.tags.payment", "الدفع"), t("safety.tags.secure", "آمن")],
		},
		{
			icon: <LocationOn />,
			title: t("safety.tip3.title", "اختر مكاناً آمناً"),
			desc: t(
				"safety.tip3.desc",
				"عند التسليم المباشر، يفضل الالتقاء في مكان عام ومضاء مثل المراكز التجارية أو أماكن مخصصة للصفقات. تجنب الأماكن المنعزلة.",
			),
			severity: "info",
			tags: [
				t("safety.tags.meeting", "مكان الالتقاء"),
				t("safety.tags.public", "عام"),
			],
		},
		{
			icon: <WarningAmber />,
			title: t("safety.tip4.title", "انتبه للعروض المشبوهة"),
			desc: t(
				"safety.tip4.desc",
				"السعر المنخفض جداً أو الاستعجال غير المبرر قد يكون مؤشراً للاحتيال. تحقق من المنتج شخصياً إذا أمكن وتأكد من مطابقته للوصف.",
			),
			severity: "error",
			tags: [t("safety.tags.fraud", "احتيال"), t("safety.tags.alert", "تنبيه")],
		},
	];

	const warningSigns = [
		t("safety.warning1", "طلب الدفع خارج المنصة"),
		t("safety.warning2", "ضغط نفسي لإتمام الصفقة بسرعة"),
		t("safety.warning3", "تجنب اللقاء الشخصي بدون سبب"),
		t("safety.warning4", "منتجات مستعملة تبدو جديدة"),
		t("safety.warning5", "ارتباطات وسائل تواصل مشبوهة"),
		t("safety.warning6", "تغيير شروط الصفقة فجأة"),
	];

	const safetyLevels: SafetyLevel[] = [
		{
			level: t("safety.levels.high", "عالية"),
			desc: t("safety.levels.highDesc", "تسليم يداً بيد في مكان عام"),
			icon: <SafetyCheck />,
			color: "success",
		},
		{
			level: t("safety.levels.medium", "متوسطة"),
			desc: t("safety.levels.mediumDesc", "شحن مع تتبع وتأمين"),
			icon: <VerifiedUser />,
			color: "warning",
		},
		{
			level: t("safety.levels.low", "منخفضة"),
			desc: t("safety.levels.lowDesc", "دفع مسبق بدون ضمانات"),
			icon: <ReportProblem />,
			color: "error",
		},
	];

	const getSeverityColor = (severity: SafetyTip["severity"]): string => {
		switch (severity) {
			case "success":
				return theme.palette.success.main;
			case "warning":
				return theme.palette.warning.main;
			case "error":
				return theme.palette.error.main;
			case "info":
				return theme.palette.info.main;
			default:
				return theme.palette.primary.main;
		}
	};
	const currentUrl = `https://client-qqq1.vercel.app/help/safety`;
	return (
		<>
				<link rel='canonical' href={currentUrl} />
				<title>{t("safety.title", "الامان")} | صفقة</title>
				<meta
					name='description'
					content={t(
						"safety.title",
						"نحرص في صفقة على تجربة بيع وشراء آمنة للجميع. اتبع هذه الإرشادات لضمان معاملات آمنة ومضمونة",
					)}
				/>
			<Container maxWidth='lg' sx={{py: {xs: 4, md: 8}, direction}}>
				{/* Header */}
				<Box textAlign='center' mb={8}>
					<Box
						sx={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 2,
							mb: 3,
							p: 2,
							borderRadius: 3,
							background: alpha(theme.palette.primary.main, 0.05),
							border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
						}}
					>
						<Security
							sx={{fontSize: 40, color: theme.palette.primary.main}}
						/>
						<Typography variant='h4' fontWeight='bold' color='primary.main'>
							{t("safety.title", "الأمان أولاً")}
						</Typography>
					</Box>

					<Typography
						variant='h6'
						color='text.secondary'
						sx={{maxWidth: 800, mx: "auto", mb: 3}}
					>
						{t(
							"safety.subtitle",
							"نحرص في صفقة على تجربة بيع وشراء آمنة للجميع. اتبع هذه الإرشادات لضمان معاملات آمنة ومضمونة",
						)}
					</Typography>

					<Chip
						icon={<LocalPolice />}
						label={t("safety.guaranteed", "مضمون وآمن")}
						color='success'
						sx={{fontWeight: "bold", fontSize: "0.9rem", px: 2}}
					/>
				</Box>

				{/* Safety Tips */}
				<Grid container spacing={3} sx={{mb: 8}}>
					{tips.map((tip, index) => {
						const color = getSeverityColor(tip.severity);

						return (
							<Grid size={{xs: 12, md: 6}} key={index}>
								<Fade in timeout={600 + index * 100}>
									<Card
										elevation={2}
										sx={{
											height: "100%",
											borderLeft: `4px solid ${color}`,
											borderRadius: 2,
											transition: "transform 0.3s",
											"&:hover": {
												transform: "translateY(-4px)",
												boxShadow: theme.shadows[6],
											},
										}}
									>
										<CardContent sx={{p: 3}}>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													gap: 2,
													mb: 2,
												}}
											>
												<Box
													sx={{
														width: 48,
														height: 48,
														borderRadius: "50%",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														background: alpha(color, 0.1),
														color: color,
													}}
												>
													{tip.icon}
												</Box>
												<Box sx={{flex: 1}}>
													<Typography
														variant='h6'
														fontWeight='bold'
														gutterBottom
													>
														{tip.title}
													</Typography>
													{tip.tags && (
														<Stack
															direction='row'
															spacing={1}
															sx={{mb: 1}}
														>
															{tip.tags.map(
																(tag, tagIndex) => (
																	<Chip
																		key={tagIndex}
																		label={tag}
																		size='small'
																		sx={{
																			background:
																				alpha(
																					color,
																					0.1,
																				),
																			color: color,
																			fontWeight:
																				"medium",
																		}}
																	/>
																),
															)}
														</Stack>
													)}
												</Box>
											</Box>

											<Typography color='text.secondary' paragraph>
												{tip.desc}
											</Typography>

											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													gap: 1,
													mt: 2,
												}}
											>
												<Box
													sx={{
														width: 8,
														height: 8,
														borderRadius: "50%",
														background: color,
													}}
												/>
												<Typography
													variant='caption'
													color='text.disabled'
												>
													{t("safety.tip", "نصيحة أمان")}{" "}
													{index + 1}
												</Typography>
											</Box>
										</CardContent>
									</Card>
								</Fade>
							</Grid>
						);
					})}
				</Grid>

				{/* Warning Signs */}
				<Paper
					elevation={0}
					sx={{
						p: 4,
						mb: 6,
						borderRadius: 3,
						background: alpha(theme.palette.warning.main, 0.05),
						border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
					}}
				>
					<Box sx={{display: "flex", alignItems: "center", gap: 2, mb: 3}}>
						<WarningAmber sx={{color: theme.palette.warning.main}} />
						<Typography variant='h5' fontWeight='bold' color='warning.dark'>
							{t("safety.warningSigns", "علامات تحذيرية")}
						</Typography>
					</Box>

					<Grid container spacing={2}>
						{warningSigns.map((sign, index) => (
							<Grid size={{xs: 12, sm: 6, md: 4}} key={index}>
								<Box
									sx={{
										display: "flex",
										alignItems: "flex-start",
										gap: 2,
										p: 2,
										borderRadius: 2,
										background: alpha(
											theme.palette.warning.main,
											0.05,
										),
									}}
								>
									<Box
										sx={{
											minWidth: 24,
											height: 24,
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											background: theme.palette.warning.main,
											color: "white",
											fontSize: "0.75rem",
											fontWeight: "bold",
										}}
									>
										!
									</Box>
									<Typography variant='body2' fontWeight='medium'>
										{sign}
									</Typography>
								</Box>
							</Grid>
						))}
					</Grid>
				</Paper>

				{/* Safety Levels */}
				<Box sx={{mb: 8}}>
					<Typography
						variant='h5'
						fontWeight='bold'
						gutterBottom
						textAlign='center'
					>
						{t("safety.levels.title", "مستويات الأمان")}
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
						textAlign='center'
						sx={{mb: 4, maxWidth: 600, mx: "auto"}}
					>
						{t("safety.levels.subtitle", "اختر مستوى الأمان المناسب لصفقاتك")}
					</Typography>

					<Grid container spacing={3}>
						{safetyLevels.map((level, index) => {
							const colorValue = theme.palette[level.color].main;

							return (
								<Grid size={{xs: 12, md: 4}} key={index}>
									<Card
										sx={{
											height: "100%",
											p: 3,
											textAlign: "center",
											borderTop: `4px solid ${colorValue}`,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
										}}
									>
										<Box
											sx={{
												width: 64,
												height: 64,
												borderRadius: "50%",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												mb: 3,
												background: alpha(colorValue, 0.1),
												color: colorValue,
											}}
										>
											{level.icon}
										</Box>

										<Typography
											variant='h5'
											fontWeight='bold'
											gutterBottom
										>
											{level.level}
										</Typography>

										<Typography
											color='text.secondary'
											paragraph
											sx={{flex: 1}}
										>
											{level.desc}
										</Typography>

										<Chip
											label={`مستوى أمان ${index + 1}`}
											size='small'
											sx={{
												background: alpha(colorValue, 0.1),
												color: colorValue,
											}}
										/>
									</Card>
								</Grid>
							);
						})}
					</Grid>
				</Box>

				<Divider sx={{my: 6}} />

				{/* Final Note */}
				<Alert
					severity='info'
					icon={<Security />}
					sx={{
						mb: 4,
						borderRadius: 2,
						"& .MuiAlert-message": {width: "100%"},
					}}
				>
					<Typography variant='body1' fontWeight='medium' gutterBottom>
						{t("safety.importantNote", "ملاحظة هامة")}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{t(
							"safety.finalNote",
							"صفقة هي منصة C2C، التزامك بإرشادات الأمان يساعدنا في الحفاظ على مجتمع موثوق. تقع مسؤولية الأمان المباشر على البائع والمشتري، ونحن نعمل على توفير الأدوات التي تساعد في ذلك.",
						)}
					</Typography>
				</Alert>

				{/* Report Section */}
				<Box
					sx={{
						textAlign: "center",
						p: 3,
						borderRadius: 2,
						background: alpha(theme.palette.info.main, 0.05),
						border: `1px dashed ${alpha(theme.palette.info.main, 0.3)}`,
					}}
				>
					<Typography variant='body2' color='text.secondary' gutterBottom>
						{t("safety.reportText", "شاهدت سلوكاً مشبوهاً؟")}
					</Typography>
					<Chip
						icon={<ReportProblem />}
						label={t("safety.reportButton", "بلغنا عن مشكلة")}
						variant='outlined'
						color='error'
						clickable
						sx={{fontWeight: "medium"}}
					/>
				</Box>
			</Container>
		</>
	);
};

export default SafetyHelp;
