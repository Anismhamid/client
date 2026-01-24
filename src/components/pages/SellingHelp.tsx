import {FunctionComponent} from "react";
import {useTranslation} from "react-i18next";
import {
	Typography,
	Box,
	Paper,
	Grid,
	Button,
	Divider,
	useTheme,
	Chip,
	Stack,
	Card,
	CardContent,
	CardActions,
	alpha,
	Fade,
	Container,
} from "@mui/material";
import {
	ArrowBack,
	AddShoppingCart,
	PhotoCamera,
	LocalOffer,
	CheckCircle,
	SupportAgent,
	TipsAndUpdates,
} from "@mui/icons-material";
import {Link as RouterLink} from "react-router-dom";
import handleRTL from "../../locales/handleRTL";
import {Helmet} from "react-helmet";

// Type-safe theme palette access
const getPaletteColor = (theme: any, colorKey: string) => {
	const palette = theme.palette;

	// Safely access palette colors
	switch (colorKey) {
		case "primary":
			return palette.primary.main;
		case "secondary":
			return palette.secondary.main;
		case "success":
			return palette.success.main;
		case "warning":
			return palette.warning.main;
		case "info":
			return palette.info.main;
		case "error":
			return palette.error.main;
		default:
			return palette.primary.main;
	}
};

const SellingHelp: FunctionComponent = () => {
	const {t} = useTranslation();
	const theme = useTheme();
	const direction = handleRTL();
	const isRTL = direction === "rtl";

	const steps = [
		{
			title: t("help.selling.step1Title", "إنشاء إعلانك"),
			desc: t(
				"help.selling.step1Desc",
				"ابدأ بإضافة صورة واضحة وعنوان جذاب للمنتج الخاص بك.",
			),
			icon: <PhotoCamera />,
			color: "primary", // Changed to simple string
			tips: [
				t("help.selling.step1Tip1", "استخدم خلفية نظيفة"),
				t("help.selling.step1Tip2", "صور من زوايا متعددة"),
			],
		},
		{
			title: t("help.selling.step2Title", "وصف المنتج"),
			desc: t(
				"help.selling.step2Desc",
				"أضف وصفاً مختصراً ودقيقاً مع التفاصيل المهمة للمشتري.",
			),
			icon: <AddShoppingCart />,
			color: "secondary",
			tips: [
				t("help.selling.step2Tip1", "اذكر العيوب إن وجدت"),
				t("help.selling.step2Tip2", "أضف المواصفات الفنية"),
			],
		},
		{
			title: t("help.selling.step3Title", "حدد السعر"),
			desc: t(
				"help.selling.step3Desc",
				"ضع سعر مناسب، يمكنك إضافة خصومات لجذب المشترين.",
			),
			icon: <LocalOffer />,
			color: "success",
			tips: [
				t("help.selling.step3Tip1", "قارن بأسعار السوق"),
				t("help.selling.step3Tip2", "اترك مجالاً للمساومة"),
			],
		},
		{
			title: t("help.selling.step4Title", "نشر الإعلان"),
			desc: t(
				"help.selling.step4Desc",
				"راجع جميع المعلومات ثم اضغط نشر. إعلانك سيكون مرئياً للمشترين.",
			),
			icon: <CheckCircle />,
			color: "warning",
			tips: [
				t("help.selling.step4Tip1", "اختر التصنيف المناسب"),
				t("help.selling.step4Tip2", "تأكد من معلومات التواصل"),
			],
		},
	];

	const quickTips = [
		t("help.selling.quickTip1", "رد سريع = مبيعات أكثر"),
		t("help.selling.quickTip2", "صور عالية الجودة تزيد المبيعات"),
		t("help.selling.quickTip3", "وصف دقيق يقلل الأسئلة"),
		t("help.selling.quickTip4", "سعر منافس = بيع أسرع"),
	];
	const currentUrl = `https://client-qqq1.vercel.app/help/selling`;
	return (
		<>
			<Helmet>
				<link rel='canonical' href={currentUrl} />
				<title>{t("help.selling.title", "كيف تبيع على صفقة")} | صفقة</title>
				<meta
					name='description'
					content={t(
						"help.selling.description",
						"اتبع هذه الخطوات البسيطة لبيع منتجاتك بسرعة وبأمان",
					)}
				/>
			</Helmet>
			<Container maxWidth='lg' sx={{py: {xs: 4, md: 8}, direction}}>
				{/* Header with gradient */}
				<Box
					textAlign='center'
					mb={8}
					sx={{
						background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
						borderRadius: 4,
						p: 4,
						color: "white",
						position: "relative",
						overflow: "hidden",
					}}
				>
					<Box
						sx={{
							position: "absolute",
							top: -50,
							right: -50,
							width: 200,
							height: 200,
							borderRadius: "50%",
							background: alpha("#fff", 0.1),
						}}
					/>
					<Box
						sx={{
							position: "absolute",
							bottom: -30,
							left: -30,
							width: 150,
							height: 150,
							borderRadius: "50%",
							background: alpha("#fff", 0.1),
						}}
					/>

					<Typography
						variant='h2'
						component='h1'
						fontWeight='bold'
						gutterBottom
						sx={{
							fontSize: {xs: "2rem", md: "3rem"},
							position: "relative",
							zIndex: 1,
						}}
					>
						{t("help.selling.title", "كيف تبيع على صفقة")}
					</Typography>
					<Typography
						variant='h6'
						sx={{
							maxWidth: 700,
							mx: "auto",
							mb: 3,
							opacity: 0.9,
							position: "relative",
							zIndex: 1,
						}}
					>
						{t(
							"help.selling.subtitle",
							"اتبع هذه الخطوات البسيطة لبيع منتجاتك بسرعة وبأمان",
						)}
					</Typography>

					<Chip
						icon={<TipsAndUpdates />}
						label={t("help.selling.guideLabel", "دليل البيع")}
						sx={{
							background: "white",
							color: theme.palette.primary.main,
							fontWeight: "bold",
							px: 2,
							position: "relative",
							zIndex: 1,
						}}
					/>
				</Box>

				{/* Steps Section */}
				<Grid container spacing={3} sx={{mb: 8}}>
					{steps.map((step, index) => {
						const stepColor = getPaletteColor(theme, step.color);

						return (
							<Grid size={{xs: 12, md: 6, lg: 3}} key={index}>
								<Fade in timeout={800 + index * 200}>
									<Card
										elevation={2}
										sx={{
											height: "100%",
											display: "flex",
											flexDirection: "column",
											transition: "transform 0.3s, box-shadow 0.3s",
											"&:hover": {
												transform: "translateY(-8px)",
												boxShadow: theme.shadows[8],
											},
											borderRadius: 3,
											borderTop: `4px solid ${stepColor}`,
										}}
									>
										<CardContent sx={{flexGrow: 1, p: 3}}>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													mb: 2,
													gap: 2,
												}}
											>
												<Box
													sx={{
														width: 56,
														height: 56,
														borderRadius: 2,
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														background: alpha(stepColor, 0.1),
														color: stepColor,
														fontSize: "1.5rem",
													}}
												>
													{step.icon}
												</Box>
												<Typography
													variant='h6'
													fontWeight='bold'
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 1,
													}}
												>
													<Typography
														variant='h4'
														component='span'
														sx={{
															color: stepColor,
															fontWeight: "bold",
														}}
													>
														{index + 1}
													</Typography>
													{step.title}
												</Typography>
											</Box>

											<Typography
												variant='body2'
												color='text.secondary'
												paragraph
												sx={{mb: 2}}
											>
												{step.desc}
											</Typography>

											{step.tips && (
												<Stack spacing={0.5}>
													{step.tips.map((tip, tipIndex) => (
														<Typography
															key={tipIndex}
															variant='caption'
															sx={{
																display: "flex",
																alignItems: "center",
																gap: 1,
																color: "text.secondary",
															}}
														>
															<CheckCircle
																sx={{
																	fontSize: "0.8rem",
																	color: "success.main",
																}}
															/>
															{tip}
														</Typography>
													))}
												</Stack>
											)}
										</CardContent>

										<CardActions sx={{p: 2, pt: 0}}>
											<Chip
												label={`${t("common.step", "خطوة")} ${index + 1}`}
												size='small'
												sx={{
													background: alpha(stepColor, 0.1),
													color: stepColor,
													fontWeight: "medium",
												}}
											/>
										</CardActions>
									</Card>
								</Fade>
							</Grid>
						);
					})}
				</Grid>

				{/* Quick Tips Section */}
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
					<Box sx={{display: "flex", alignItems: "center", mb: 3, gap: 2}}>
						<TipsAndUpdates color='info' />
						<Typography variant='h5' fontWeight='bold' color='info.main'>
							{t("help.selling.tipsTitle", "نصائح سريعة للنجاح")}
						</Typography>
					</Box>

					<Grid container spacing={2}>
						{quickTips.map((tip, index) => (
							<Grid size={{xs: 12, sm: 6, md: 3}} key={index}>
								<Paper
									sx={{
										p: 2,
										borderRadius: 2,
										background: "white",
										display: "flex",
										alignItems: "center",
										gap: 2,
										transition: "transform 0.2s",
										"&:hover": {
											transform: "scale(1.02)",
										},
									}}
								>
									<Box
										sx={{
											width: 40,
											height: 40,
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											background: alpha(
												theme.palette.info.main,
												0.1,
											),
											color: theme.palette.info.main,
										}}
									>
										{index + 1}
									</Box>
									<Typography variant='body2' fontWeight='medium'>
										{tip}
									</Typography>
								</Paper>
							</Grid>
						))}
					</Grid>
				</Paper>

				<Divider sx={{my: 6}} />

				{/* Call to Action */}
				<Box textAlign='center'>
					<Typography variant='h5' fontWeight='bold' gutterBottom>
						{t("help.selling.needHelpTitle", "هل تحتاج إلى مساعدة؟")}
					</Typography>

					<Typography
						variant='body1'
						color='text.secondary'
						paragraph
						sx={{maxWidth: 600, mx: "auto", mb: 4}}
					>
						{t(
							"help.selling.needHelpDesc",
							"فريق الدعم لدينا مستعد لمساعدتك في أي خطوة من رحلة البيع. نحن هنا لضمان حصولك على أفضل تجربة ممكنة.",
						)}
					</Typography>

					<Stack
						direction={{xs: "column", sm: "row"}}
						spacing={2}
						justifyContent='center'
						alignItems='center'
					>
						<Button
							variant='contained'
							color='primary'
							size='large'
							startIcon={isRTL ? undefined : <SupportAgent />}
							endIcon={isRTL ? <SupportAgent /> : undefined}
							component={RouterLink}
							to='/contact'
							sx={{
								px: 4,
								py: 1.5,
								borderRadius: 2,
								fontWeight: "bold",
							}}
						>
							{t("help.selling.contactSupport", "تواصل مع الدعم")}
						</Button>

						<Button
							variant='outlined'
							color='secondary'
							size='large'
							startIcon={isRTL ? undefined : <ArrowBack />}
							endIcon={isRTL ? <ArrowBack /> : undefined}
							component={RouterLink}
							to='/help'
							sx={{
								px: 4,
								py: 1.5,
								borderRadius: 2,
								fontWeight: "medium",
							}}
						>
							{t("common.backToHelp", "عودة إلى المساعدة")}
						</Button>
					</Stack>

					<Typography
						variant='caption'
						color='text.disabled'
						sx={{display: "block", mt: 4}}
					>
						{t("help.selling.lastUpdated", "تم التحديث آخر مرة: نوفمبر 2023")}
					</Typography>
				</Box>
			</Container>
		</>
	);
};

export default SellingHelp;
