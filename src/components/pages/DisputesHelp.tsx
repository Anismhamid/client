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
	Button,
	Alert,
	alpha,
	useTheme,
	Fade,
} from "@mui/material";
import {
	Forum,
	ReportProblem,
	Gavel,
	SupportAgent,
	Security,
	Timeline,
	Balance,
	Handshake,
	Warning,
} from "@mui/icons-material";
import {Link as RouterLink} from "react-router-dom";
import handleRTL from "../../locales/handleRTL";

interface DisputeStep {
	icon: JSX.Element;
	title: string;
	desc: string;
	color: "primary" | "warning" | "secondary" | "success" | "info" | "error";
	duration?: string;
	tips?: string[];
}

interface ResolutionMethod {
	title: string;
	desc: string;
	icon: JSX.Element;
	time: string;
	color: "success" | "warning" | "error";
}

const DisputesHelp: FunctionComponent = () => {
	const {t} = useTranslation();
	const theme = useTheme();
	const direction = handleRTL();

	const steps: DisputeStep[] = [
		{
			icon: <Forum />,
			title: t("disputes.step1.title", "تواصل أولاً"),
			desc: t(
				"disputes.step1.desc",
				"في أغلب الحالات، يمكن حل الخلاف بالتواصل المباشر والاحترام المتبادل. حاول التفاوض بحكمة والصبر على الطرف الآخر.",
			),
			color: "primary",
			duration: t("disputes.step1.duration", "24-48 ساعة"),
			tips: [
				t("disputes.step1.tip1", "كن واضحاً ومحدداً في مطالبك"),
				t("disputes.step1.tip2", "احفظ سجلات المحادثات"),
			],
		},
		{
			icon: <ReportProblem />,
			title: t("disputes.step2.title", "الإبلاغ عن المشكلة"),
			desc: t(
				"disputes.step2.desc",
				"إذا لم يتم التوصل لحل، استخدم زر الإبلاغ داخل الصفقة. قدم أدلة واضحة مثل: صور، محادثات، تفاصيل المنتج.",
			),
			color: "warning",
			duration: t("disputes.step2.duration", "1-3 أيام عمل"),
			tips: [
				t("disputes.step2.tip1", "أرفق جميع الأدلة المطلوبة"),
				t("disputes.step2.tip2", "اكتب وصفاً مفصلاً للمشكلة"),
			],
		},
		{
			icon: <Gavel />,
			title: t("disputes.step3.title", "مراجعة النزاع"),
			desc: t(
				"disputes.step3.desc",
				"فريق صفقة يراجع التفاصيل ويقارن المعلومات المقدمة من الطرفين. نتحقق من الأدلة ونطبق سياسات المنصة.",
			),
			color: "secondary",
			duration: t("disputes.step3.duration", "3-7 أيام عمل"),
			tips: [
				t("disputes.step3.tip1", "كن مستعداً لتقديم معلومات إضافية"),
				t("disputes.step3.tip2", "تصرف بشفافية وصدق"),
			],
		},
		{
			icon: <SupportAgent />,
			title: t("disputes.step4.title", "الدعم والمساعدة"),
			desc: t(
				"disputes.step4.desc",
				"نتواصل معك لإيجاد حل عادل يحمي حقوق جميع الأطراف. نقدم التوصيات والقرارات النهائية بناءً على السياسات.",
			),
			color: "success",
			duration: t("disputes.step4.duration", "2-5 أيام عمل"),
			tips: [
				t("disputes.step4.tip1", "احترم القرار النهائي"),
				t("disputes.step4.tip2", "تأكد من فهمك للنتيجة"),
			],
		},
	];

	const resolutionMethods: ResolutionMethod[] = [
		{
			title: t("disputes.resolution1.title", "التسوية الودية"),
			desc: t(
				"disputes.resolution1.desc",
				"اتفاق بين الطرفين على حل وسط يقبله الجميع مع إشراف المنصة.",
			),
			icon: <Handshake />,
			time: t("disputes.resolution1.time", "أسبوع"),
			color: "success",
		},
		{
			title: t("disputes.resolution2.title", "التدخل المباشر"),
			desc: t(
				"disputes.resolution2.desc",
				"قرار من فريق الدعم بناءً على الأدلة والسياسات المحددة.",
			),
			icon: <Balance />,
			time: t("disputes.resolution2.time", "أسبوعين"),
			color: "warning",
		},
		{
			title: t("disputes.resolution3.title", "الحسم النهائي"),
			desc: t(
				"disputes.resolution3.desc",
				"قرار نهائي مع إجراءات تأديبية إذا لزم الأمر، مثل تعليق الحساب.",
			),
			icon: <Security />,
			time: t("disputes.resolution3.time", "3 أسابيع"),
			color: "error",
		},
	];

	const commonIssues = [
		t("disputes.issue1", "منتج لا يتطابق مع الوصف"),
		t("disputes.issue2", "تأخير في التسليم بدون سبب"),
		t("disputes.issue3", "دفع لم يتم استلام المنتج بعده"),
		t("disputes.issue4", "منتج معيب أو تالف"),
		t("disputes.issue5", "سعر مختلف عن المتفق عليه"),
		t("disputes.issue6", "سلوك غير لائق أو احتيالي"),
	];

	const getColorValue = (color: DisputeStep["color"]): string => {
		switch (color) {
			case "primary":
				return theme.palette.primary.main;
			case "secondary":
				return theme.palette.secondary.main;
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
	const currentUrl = `https://client-qqq1.vercel.app/help/disputes`;
	return (
		<>
			<link rel='canonical' href={currentUrl} />
			<title>{t("pages.contact.resolveDisputes")} | صفقة</title>
			<meta name='description' content={t("pages.contact.resolveDisputes")} />{" "}
			<Container maxWidth='lg' sx={{py: {xs: 4, md: 8}, direction}}>
				{/* Header */}
				<Box component={"main"} textAlign='center' mb={8}>
					<Box
						sx={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 2,
							mb: 3,
							p: 3,
							borderRadius: 3,
							background: alpha(theme.palette.warning.main, 0.05),
							border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
						}}
					>
						<Gavel sx={{fontSize: 48, color: theme.palette.warning.main}} />
						<Box>
							<Typography
								variant='h3'
								component='h1'
								fontWeight='bold'
								color='warning.main'
							>
								{t("disputes.title", "حل النزاعات")}
							</Typography>
							<Typography
								variant='h6'
								color='text.secondary'
								sx={{mt: 1, maxWidth: 700}}
							>
								{t(
									"disputes.subtitle",
									"لأن ثقتك مهمة، نحن هنا لدعمك عند حدوث أي خلاف. نضمن عملية شفافة وعادلة للجميع.",
								)}
							</Typography>
						</Box>
					</Box>
				</Box>

				{/* Process Timeline */}
				<Box sx={{mb: 8}}>
					<Typography
						variant='h5'
						fontWeight='bold'
						gutterBottom
						textAlign='center'
					>
						{t("disputes.processTitle", "خطوات حل النزاع")}
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
						textAlign='center'
						sx={{mb: 4, maxWidth: 600, mx: "auto"}}
					>
						{t(
							"disputes.processSubtitle",
							"اتبع هذه الخطوات لحل أي نزاع بسرعة وعدالة",
						)}
					</Typography>

					<Grid container spacing={3}>
						{steps.map((step, index) => {
							const colorValue = getColorValue(step.color);

							return (
								<Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={index}>
									<Fade in timeout={500 + index * 100}>
										<Card
											elevation={2}
											sx={{
												height: "100%",
												position: "relative",
												overflow: "visible",
												borderTop: `4px solid ${colorValue}`,
												borderRadius: 2,
												transition: "transform 0.3s",
												"&:hover": {
													transform: "translateY(-8px)",
												},
											}}
										>
											{index < steps.length - 1 && (
												<Box
													sx={{
														position: "absolute",
														top: "50%",
														left: "100%",
														transform:
															"translate(-50%, -50%)",
														width: 40,
														height: 2,
														background: alpha(
															colorValue,
															0.3,
														),
														display: {
															xs: "none",
															md: "block",
														},
														zIndex: 1,
													}}
												/>
											)}

											<CardContent sx={{p: 3}}>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 2,
														mb: 3,
													}}
												>
													<Box
														sx={{
															width: 56,
															height: 56,
															borderRadius: "50%",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															background: alpha(
																colorValue,
																0.1,
															),
															color: colorValue,
															fontSize: "1.5rem",
														}}
													>
														{step.icon}
													</Box>
													<Box sx={{flex: 1}}>
														<Typography
															variant='h6'
															fontWeight='bold'
															gutterBottom
														>
															{step.title}
														</Typography>
														{step.duration && (
															<Chip
																label={step.duration}
																size='small'
																sx={{
																	background: alpha(
																		colorValue,
																		0.1,
																	),
																	color: colorValue,
																	fontWeight: "medium",
																}}
															/>
														)}
													</Box>
												</Box>

												<Typography
													variant='body2'
													color='text.secondary'
													paragraph
													sx={{mb: 2, minHeight: 60}}
												>
													{step.desc}
												</Typography>

												{step.tips && (
													<Stack spacing={1}>
														{step.tips.map(
															(tip, tipIndex) => (
																<Typography
																	key={tipIndex}
																	variant='caption'
																	sx={{
																		display: "flex",
																		alignItems:
																			"center",
																		gap: 1,
																		color: "text.secondary",
																	}}
																>
																	<Box
																		sx={{
																			width: 4,
																			height: 4,
																			borderRadius:
																				"50%",
																			background:
																				colorValue,
																		}}
																	/>
																	{tip}
																</Typography>
															),
														)}
													</Stack>
												)}

												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														mt: 2,
														pt: 2,
														borderTop: `1px solid ${alpha(colorValue, 0.1)}`,
													}}
												>
													<Typography
														variant='caption'
														color='text.disabled'
													>
														{t("common.step", "خطوة")}{" "}
														{index + 1}
													</Typography>
													<Typography
														variant='caption'
														sx={{
															color: colorValue,
															fontWeight: "medium",
														}}
													>
														{t("disputes.required", "مطلوب")}
													</Typography>
												</Box>
											</CardContent>
										</Card>
									</Fade>
								</Grid>
							);
						})}
					</Grid>
				</Box>

				{/* Common Issues */}
				<Paper
					elevation={0}
					sx={{
						p: 4,
						mb: 6,
						borderRadius: 3,
						background: alpha(theme.palette.info.light, 0.05),
						border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
					}}
				>
					<Box sx={{display: "flex", alignItems: "center", gap: 2, mb: 3}}>
						<Warning color='info' />
						<Typography variant='h5' fontWeight='bold' color='info.main'>
							{t("disputes.issuesTitle", "النزاعات الشائعة")}
						</Typography>
					</Box>

					<Grid container spacing={2}>
						{commonIssues.map((issue, index) => (
							<Grid size={{xs: 12, sm: 6, md: 4}} key={index}>
								<Box
									sx={{
										p: 2,
										borderRadius: 2,
										background: "white",
										display: "flex",
										alignItems: "center",
										gap: 2,
										border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
									}}
								>
									<Box
										sx={{
											minWidth: 32,
											height: 32,
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											background: alpha(
												theme.palette.info.main,
												0.1,
											),
											color: theme.palette.info.main,
											fontSize: "0.875rem",
											fontWeight: "bold",
										}}
									>
										{index + 1}
									</Box>
									<Typography variant='body2' fontWeight='medium'>
										{issue}
									</Typography>
								</Box>
							</Grid>
						))}
					</Grid>
				</Paper>

				{/* Resolution Methods */}
				<Box sx={{mb: 8}}>
					<Typography
						variant='h5'
						fontWeight='bold'
						gutterBottom
						textAlign='center'
					>
						{t("disputes.resolutionTitle", "طرق الحل")}
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
						textAlign='center'
						sx={{mb: 4, maxWidth: 600, mx: "auto"}}
					>
						{t(
							"disputes.resolutionSubtitle",
							"نقدم عدة طرق لحل النزاعات حسب طبيعة المشكلة",
						)}
					</Typography>

					<Grid container spacing={3}>
						{resolutionMethods.map((method, index) => {
							const colorValue = theme.palette[method.color].main;

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
											transition: "transform 0.3s",
											"&:hover": {
												transform: "translateY(-4px)",
											},
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
											{method.icon}
										</Box>

										<Typography
											variant='h6'
											fontWeight='bold'
											gutterBottom
										>
											{method.title}
										</Typography>

										<Typography
											color='text.secondary'
											paragraph
											sx={{flex: 1, mb: 2}}
										>
											{method.desc}
										</Typography>

										<Stack
											direction='row'
											spacing={1}
											alignItems='center'
											justifyContent='center'
										>
											<Timeline
												sx={{
													fontSize: 16,
													color: "text.disabled",
												}}
											/>
											<Typography
												variant='caption'
												color='text.disabled'
											>
												{t("disputes.estimatedTime", "وقت متوقع")}
												: {method.time}
											</Typography>
										</Stack>
									</Card>
								</Grid>
							);
						})}
					</Grid>
				</Box>

				<Divider sx={{my: 6}} />

				{/* Important Information */}
				<Box sx={{mb: 6}}>
					<Alert
						severity='info'
						icon={<Security />}
						sx={{
							borderRadius: 2,
							mb: 3,
						}}
					>
						<Typography variant='body1' fontWeight='medium' gutterBottom>
							{t("disputes.importantNote", "معلومات هامة")}
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							{t(
								"disputes.finalNote",
								"هدفنا في صفقة هو بناء سوق C2C عادل، شفاف، وآمن للجميع. نحن نضمن حيادنا ونعمل بناءً على الأدلة والسياسات المعلنة.",
							)}
						</Typography>
					</Alert>

					{/* Actions */}
					<Stack
						direction={{xs: "column", sm: "row"}}
						spacing={2}
						justifyContent='center'
						alignItems='center'
						sx={{mt: 4}}
					>
						<Button
							variant='contained'
							color='warning'
							size='large'
							startIcon={<ReportProblem />}
							component={RouterLink}
							to='/report'
							sx={{
								px: 4,
								py: 1.5,
								borderRadius: 2,
								fontWeight: "bold",
							}}
						>
							{t("disputes.reportDispute", "الإبلاغ عن نزاع")}
						</Button>

						<Button
							variant='outlined'
							color='primary'
							size='large'
							startIcon={<SupportAgent />}
							component={RouterLink}
							to='/contact'
							sx={{
								px: 4,
								py: 1.5,
								borderRadius: 2,
								fontWeight: "medium",
							}}
						>
							{t("disputes.contactSupport", "تواصل مع الدعم")}
						</Button>
					</Stack>
				</Box>

				{/* Stats */}
				<Box
					sx={{
						textAlign: "center",
						p: 3,
						borderRadius: 2,
						background: alpha(theme.palette.success.light, 0.05),
						border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
					}}
				>
					<Typography variant='body2' color='text.secondary' gutterBottom>
						{t("disputes.successRate", "نسبة النجاح في حل النزاعات")}
					</Typography>
					<Typography variant='h4' color='success.main' fontWeight='bold'>
						94%
					</Typography>
					<Typography variant='caption' color='text.disabled'>
						{t("disputes.averageResolution", "متوسط وقت الحل: ٥-٧ أيام عمل")}
					</Typography>
				</Box>
			</Container>
		</>
	);
};

export default DisputesHelp;
