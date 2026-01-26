import {FunctionComponent} from "react";
import {Link} from "react-router-dom";
import {path} from "../../routes/routes";
import {Helmet} from "react-helmet";
import {
	Container,
	Typography,
	Box,
	Paper,
	Divider,
	Link as MuiLink,
	Card,
	CardContent,
	useTheme,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Button,
	Chip,
	Avatar,
	Grid,
} from "@mui/material";
import {
	Gavel,
	Security,
	PrivacyTip,
	ContactSupport,
	ArrowBack,
	CheckCircle,
	Warning,
	Info,
	Business,
	LocationOn,
} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import handleRTL from "../../locales/handleRTL";

interface TermOfUseProps {}

const TermOfUse: FunctionComponent<TermOfUseProps> = () => {
	const {t} = useTranslation();
	const theme = useTheme();
	const direction = handleRTL();
	const currentUrl = `https://client-qqq1.vercel.app/term-of-use`;

	const importantPoints = [
		{
			icon: <CheckCircle color='success' />,
			text: "يجب أن تكون 18+ لاستخدام المنصة",
			color: "success.light",
		},
		{
			icon: <Security color='primary' />,
			text: "التسجيل مطلوب لنشر الإعلانات",
			color: "primary.light",
		},
		{
			icon: <Warning color='warning' />,
			text: "منصة C2C - المستخدمون مسؤولون عن المعاملات",
			color: "warning.light",
		},
		{
			icon: <Info color='info' />,
			text: "المقر القانوني: السخنين/أم الفحم",
			color: "info.light",
		},
	];

	return (
		<>
			<Helmet>
				<link rel='canonical' href={currentUrl} />
				<title>{t("pages.terms.title", "شروط الاستخدام")} | صفقة</title>
				<meta
					name='description'
					content={t(
						"pages.terms.description",
						"شروط وأحكام استخدام منصة صفقة",
					)}
				/>
			</Helmet>

			<Container maxWidth='lg' sx={{py: 6, direction}}>
				{/* Header */}
				<Box textAlign='center' mb={6}>
					<Box sx={{display: "flex", justifyContent: "center", mb: 3}}>
						<Avatar
							sx={{
								width: 80,
								height: 80,
								bgcolor: "primary.main",
								mb: 2,
							}}
						>
							<Gavel sx={{fontSize: 40}} />
						</Avatar>
					</Box>

					<Typography
						variant='h2'
						component='h1'
						gutterBottom
						color='primary.main'
						fontWeight='bold'
						sx={{
							background:
								"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
							backgroundClip: "text",
							textFillColor: "transparent",
						}}
					>
						{t("pages.terms.title", "شروط الاستخدام")}
					</Typography>

					<Typography
						variant='h5'
						color='text.secondary'
						paragraph
						sx={{maxWidth: 700, mx: "auto"}}
					>
						{t(
							"pages.terms.subtitle",
							"أقرأ هذه الشروط بعناية قبل استخدام منصة صفقة",
						)}
					</Typography>

					{/* Last Update & Important Points */}
					<Box sx={{mt: 4, mb: 2}}>
						<Chip
							label={`آخر تحديث: 15/04/2025`}
							color='primary'
							variant='outlined'
							sx={{fontWeight: "bold", mb: 2}}
						/>
					</Box>

					{/* Important Points Grid */}
					<Box
						display='flex'
						justifyContent='center'
						flexWrap='wrap'
						gap={2}
						mt={3}
					>
						{importantPoints.map((point, index) => (
							<Card
								key={index}
								variant='outlined'
								sx={{
									minWidth: 250,
									borderLeft: `4px solid ${point.color}`,
									borderRadius: 2,
								}}
							>
								<CardContent sx={{py: 2, px: 3}}>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 2,
										}}
									>
										{point.icon}
										<Typography variant='body1' fontWeight={500}>
											{point.text}
										</Typography>
									</Box>
								</CardContent>
							</Card>
						))}
					</Box>
				</Box>

				<Divider sx={{mb: 6}} />

				<Grid container spacing={4}>
					{/* Main Content */}
					<Grid size={{xs: 12, md: 8}}>
						<Paper elevation={3} sx={{p: 4, borderRadius: 3}}>
							{/* Section 1 */}
							<Box mb={5}>
								<Typography
									variant='h4'
									gutterBottom
									color='primary'
									fontWeight='bold'
								>
									<span style={{color: theme.palette.primary.main}}>
										1.
									</span>{" "}
									الأهلية
								</Typography>
								<Typography
									variant='body1'
									paragraph
									color='text.secondary'
									sx={{lineHeight: 1.8}}
								>
									يجب أن تكون قد بلغت الثامنة عشرة من عمرك لاستخدام
									المنصة. باستخدامك المنصة، فإنك تُقر وتضمن امتثالك لهذه
									المتطلبات.
								</Typography>
							</Box>

							{/* Section 2 */}
							<Box mb={5}>
								<Typography
									variant='h4'
									gutterBottom
									color='primary'
									fontWeight='bold'
								>
									<span style={{color: theme.palette.primary.main}}>
										2.
									</span>{" "}
									التسجيل وإنشاء حساب
								</Typography>
								<Typography
									variant='body1'
									paragraph
									color='text.secondary'
									sx={{lineHeight: 1.8}}
								>
									يُطلب منك إنشاء حساب لتتمكن من نشر الإعلانات
									والمنشورات على المنصة. أنت مسؤول عن تزويدنا بمعلومات
									دقيقة ومحدثة، والحفاظ على سرية كلمة مرورك. نحتفظ بالحق
									في تعليق أو حذف أي حساب في حال وجود أي نشاط مشبوه أو
									انتهاك سياسة الخصوصية.
									<MuiLink
										component={Link}
										to={path.PrivacyAndPolicy}
										color='primary'
										underline='hover'
										sx={{ml: 1, fontWeight: 500}}
									>
										سياسة الخصوصية
									</MuiLink>
								</Typography>
							</Box>

							{/* Section 3 */}
							<Box mb={5}>
								<Typography
									variant='h4'
									gutterBottom
									color='primary'
									fontWeight='bold'
								>
									<span style={{color: theme.palette.primary.main}}>
										3.
									</span>{" "}
									المنتجات والإعلانات
								</Typography>
								<Typography
									variant='body1'
									paragraph
									color='text.secondary'
									sx={{lineHeight: 1.8}}
								>
									الأسعار، وتوافر المنتجات، وأوصافها قابلة للتغيير في أي
									وقت. نحن نعمل كمنصة وسيطة ولا نضمن دقة المعلومات
									المقدمة في الإعلانات.
								</Typography>
							</Box>

							{/* Section 4 */}
							<Box mb={5}>
								<Typography
									variant='h4'
									gutterBottom
									color='primary'
									fontWeight='bold'
								>
									<span style={{color: theme.palette.primary.main}}>
										4.
									</span>{" "}
									المسؤولية والضمانات
								</Typography>

								<Card variant='outlined' sx={{mb: 3, mt: 2}}>
									<CardContent>
										<Box display='flex' alignItems='center' mb={2}>
											<Business color='primary' sx={{mr: 2}} />
											<Typography variant='h6' fontWeight='bold'>
												موقع وطبيعة المنصة
											</Typography>
										</Box>
										<Typography
											variant='body2'
											color='text.secondary'
										>
											صفقة هي منصة C2C (من مستخدم إلى مستخدم) تتيح
											للمستخدمين عرض وشراء المنتجات فيما بينهم
											مباشرة. نحن لا نخزن أي منتجات ولا نقدم خدمات
											توصيل أو استلام.
										</Typography>
									</CardContent>
								</Card>

								<Card variant='outlined' sx={{mb: 3}}>
									<CardContent>
										<Box display='flex' alignItems='center' mb={2}>
											<LocationOn color='secondary' sx={{mr: 2}} />
											<Typography variant='h6' fontWeight='bold'>
												المقر القانوني
											</Typography>
										</Box>
										<Typography
											variant='body2'
											color='text.secondary'
										>
											<strong>العنوان:</strong> شارع السلام،
											السخنين/أم الفحم، المنطقة الشمالية، إسرائيل.
											<br />
											<strong>ملاحظة:</strong> يُعتبر هذا العنوان
											العنوان القانوني الرسمي لجميع الإشعارات
											والمراسلات القانونية.
										</Typography>
									</CardContent>
								</Card>
							</Box>

							{/* Section 5 */}
							<Box mb={5}>
								<Typography
									variant='h4'
									gutterBottom
									color='primary'
									fontWeight='bold'
								>
									<span style={{color: theme.palette.primary.main}}>
										5.
									</span>{" "}
									سلوك المستخدم
								</Typography>
								<Box sx={{pl: 2, mt: 2}}>
									{[
										"لا تستخدم المنصة لأغراض غير قانونية.",
										"لا تنتحل شخصية شخص آخر أو تقدم معلومات كاذبة.",
										"لا تقم بتحميل أي أكواد ضارة أو تتداخل مع تشغيل المنصة",
										"لا تحاول الوصول إلى الأنظمة التي لا تملك تصريحاً لاستخدامها",
									].map((item, index) => (
										<Box
											key={index}
											sx={{
												display: "flex",
												alignItems: "flex-start",
												mb: 1.5,
											}}
										>
											<Box
												sx={{color: "error.main", mr: 1, mt: 0.5}}
											>
												•
											</Box>
											<Typography
												variant='body1'
												color='text.secondary'
											>
												{item}
											</Typography>
										</Box>
									))}
								</Box>
								<Typography
									variant='body1'
									color='text.secondary'
									sx={{mt: 3, fontStyle: "italic"}}
								>
									قد يؤدي انتهاك هذه الشروط إلى الحظر أو اتخاذ إجراء
									قانوني
								</Typography>
							</Box>

							{/* Continue with other sections similarly... */}
						</Paper>
					</Grid>

					{/* Sidebar - Important Links */}
					<Grid size={{xs: 12, md: 4}}>
						<Paper elevation={3} sx={{p: 4, borderRadius: 3, height: "100%"}}>
							<Typography
								variant='h5'
								gutterBottom
								fontWeight='bold'
								color='primary'
							>
								روابط مهمة
							</Typography>

							<List sx={{mt: 3}}>
								<ListItem
									component={Link}
									to={path.PrivacyAndPolicy}
									sx={{
										borderRadius: 2,
										mb: 1,
										"&:hover": {
											bgcolor: "primary.light",
											color: "primary.main",
										},
									}}
								>
									<ListItemIcon>
										<PrivacyTip color='primary' />
									</ListItemIcon>
									<ListItemText
										primary={
											<Typography variant='h6' fontWeight='medium'>
												سياسة الخصوصية
											</Typography>
										}
									/>
								</ListItem>

								<ListItem
									component={Link}
									to={path.Contact}
									sx={{
										borderRadius: 2,
										mb: 1,
										"&:hover": {
											bgcolor: "primary.light",
											color: "primary.main",
										},
									}}
								>
									<ListItemIcon>
										<ContactSupport color='primary' />
									</ListItemIcon>
									<ListItemText
										primary={
											<Typography variant='h6' fontWeight='medium'>
												اتصل بنا
											</Typography>
										}
									/>
								</ListItem>

								<ListItem
									component={Link}
									to={path.SafetyHelp}
									sx={{
										borderRadius: 2,
										mb: 1,
										"&:hover": {
											bgcolor: "primary.light",
											color: "primary.main",
										},
									}}
								>
									<ListItemIcon>
										<Security color='primary' />
									</ListItemIcon>
									<ListItemText
										primary={
											<Typography variant='h6' fontWeight='medium'>
												نصائح الأمان
											</Typography>
										}
									/>
								</ListItem>
							</List>

							<Box sx={{mt: 4, p: 3, bgcolor: "grey.50", borderRadius: 2}}>
								<Typography variant='h6' gutterBottom fontWeight='bold'>
									هل لديك أسئلة؟
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
									paragraph
								>
									إذا كان لديك أي استفسارات حول شروط الاستخدام، لا تتردد
									في التواصل معنا.
								</Typography>
								<Button
									variant='contained'
									fullWidth
									component={Link}
									to={path.Contact}
									startIcon={<ContactSupport />}
								>
									تواصل معنا
								</Button>
							</Box>

							<Box sx={{mt: 3, textAlign: "center"}}>
								<Button
									variant='outlined'
									startIcon={<ArrowBack />}
									component={Link}
									to='/'
									fullWidth
								>
									العودة للرئيسية
								</Button>
							</Box>
						</Paper>
					</Grid>

					{/* Quick Actions */}
					<Grid size={{xs: 12}}>
						<Paper elevation={3} sx={{p: 4, mt: 4, borderRadius: 3}}>
							<Typography
								variant='h5'
								gutterBottom
								fontWeight='bold'
								textAlign='center'
							>
								موافق على الشروط؟
							</Typography>
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									gap: 3,
									mt: 3,
								}}
							>
								<Button
									variant='contained'
									size='large'
									component={Link}
									to={path.Register}
									sx={{minWidth: 200}}
								>
									إنشاء حساب جديد
								</Button>
								<Button
									variant='outlined'
									size='large'
									component={Link}
									to={path.Login}
									sx={{minWidth: 200}}
								>
									تسجيل الدخول
								</Button>
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default TermOfUse;
