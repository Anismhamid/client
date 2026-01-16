import {FunctionComponent} from "react";
import {useTranslation} from "react-i18next";
import {
	Container,
	Typography,
	Box,
	Grid,
	Paper,
	Divider,
	Link as MuiLink,
	Button,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Stack,
	Chip,
	Card,
	CardContent,
	useTheme,
} from "@mui/material";
import {
	Email,
	Phone,
	LocationOn,
	AccessTime,
	SupportAgent,
	ArrowBack,
	Security,
	ShoppingBag,
	Category,
	LocalOffer,
} from "@mui/icons-material";
import {Link as RouterLink} from "react-router-dom";
import handleRTL from "../../locales/handleRTL";

interface ContactProps {}

/**
 * صفحة الاتصال بموقع صفقة للبيع والشراء بين المستخدمين
 * @returns معلومات الاتصال
 */
const Contact: FunctionComponent<ContactProps> = () => {
	const {t} = useTranslation();
	const theme = useTheme();
	const direction = handleRTL();

	// تصنيفات المنتجات الرئيسية للعرض
	const mainCategories = [
		{name: t("categories.electronics.label"), icon: "📱", color: "primary"},
		{name: t("categories.cars.label"), icon: "🚗", color: "secondary"},
		{name: t("categories.women-clothes.label"), icon: "👚", color: "success"},
		{name: t("categories.men-clothes.label"), icon: "👔", color: "info"},
		{name: t("categories.house.label"), icon: "🏠", color: "warning"},
		{name: t("categories.watches.label"), icon: "⌚", color: "error"},
	];

	return (
		<Container maxWidth='lg' sx={{py: 6, direction}}>
			{/* رأس الصفحة */}
			<Box textAlign='center' mb={6}>
				<Typography
					variant='h2'
					component='h1'
					gutterBottom
					color='primary.main'
					fontWeight='bold'
					sx={{
						background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
						backgroundClip: "text",
						textFillColor: "transparent",
					}}
				>
					{t("pages.contact.title", "صفقة - اتصل بنا")}
				</Typography>
				<Typography
					variant='h5'
					color='text.secondary'
					paragraph
					sx={{maxWidth: 800, mx: "auto"}}
				>
					{t(
						"pages.contact.subtitle",
						"منصة آمنة للبيع والشراء بين المستخدمين في مختلف التصنيفات",
					)}
				</Typography>

				{/* شعار التصنيفات */}
				<Box
					display='flex'
					justifyContent='center'
					flexWrap='wrap'
					gap={2}
					mt={3}
				>
					{mainCategories.map((category, index) => (
						<Chip
							key={index}
							icon={<span>{category.icon}</span>}
							label={category.name}
							color={category.color as any}
							variant='outlined'
							sx={{fontSize: "0.9rem", fontWeight: 500}}
						/>
					))}
				</Box>
			</Box>

			<Divider sx={{mb: 6}} />

			{/* محتوى الصفحة */}
			<Grid container spacing={4}>
				{/* معلومات الدعم */}
				<Grid size={{xs: 12, md: 6}}>
					<Paper elevation={3} sx={{p: 4, height: "100%", borderRadius: 3}}>
						<Box sx={{display: "flex", alignItems: "center", mb: 3}}>
							<SupportAgent color='primary' sx={{fontSize: 40, mr: 2}} />
							<Typography variant='h4' fontWeight='bold'>
								{t("pages.contact.supportTitle", "دعم صفقة")}
							</Typography>
						</Box>

						<Typography variant='body1' paragraph color='text.secondary'>
							{t(
								"pages.contact.intro",
								"نحن في منصة صفقة نؤمن بأن كل عملية بيع وشراء هي قصة نجاح. فريقنا متخصص في تقديم الدعم اللازم لضمان تجربة آمنة وسلسة لجميع المستخدمين.",
							)}
						</Typography>

						<Box mt={4}>
							<Card variant='outlined' sx={{mb: 3}}>
								<CardContent>
									<Box display='flex' alignItems='center' mb={2}>
										<Security color='success' sx={{mr: 2}} />
										<Typography variant='h6' fontWeight='bold'>
											{t(
												"pages.contact.securityTitle",
												"الأمان أولاً",
											)}
										</Typography>
									</Box>
									<Typography variant='body2' color='text.secondary'>
										{t(
											"pages.contact.securityDesc",
											"نضمن حماية بياناتك وتأمين معاملاتك من خلال أنظمة متطورة وفرق مراقبة متخصصة.",
										)}
									</Typography>
								</CardContent>
							</Card>

							<Card variant='outlined'>
								<CardContent>
									<Box display='flex' alignItems='center' mb={2}>
										<LocalOffer color='warning' sx={{mr: 2}} />
										<Typography variant='h6' fontWeight='bold'>
											{t("pages.contact.dealsTitle", "صفقات ناجحة")}
										</Typography>
									</Box>
									<Typography variant='body2' color='text.secondary'>
										{t(
											"pages.contact.dealsDesc",
											"نساعدك في إتمام صفقاتك بنجاح من خلال وساطة آمنة ومتابعة مستمرة حتى التسليم.",
										)}
									</Typography>
								</CardContent>
							</Card>
						</Box>
					</Paper>
				</Grid>

				{/* قنوات الاتصال */}
				<Grid size={{xs: 12, md: 6}}>
					<Paper elevation={3} sx={{p: 4, height: "100%", borderRadius: 3}}>
						<Typography variant='h4' gutterBottom fontWeight='bold'>
							{t("pages.contact.contactChannels", "قنوات الاتصال")}
						</Typography>

						<List sx={{mt: 3}}>
							<ListItem
								sx={{
									py: 2,
									borderBottom: `1px solid ${theme.palette.divider}`,
								}}
							>
								<ListItemIcon>
									<Email color='primary' />
								</ListItemIcon>
								<ListItemText
									primary={
										<Typography variant='h6' fontWeight='medium'>
											{t(
												"pages.contact.supportEmail",
												"دعم العملاء",
											)}
										</Typography>
									}
									secondary={
										<MuiLink
											href='mailto:support@صفقة.com'
											color='primary'
											underline='hover'
											sx={{fontWeight: 500}}
										>
											support@صفقة.com
										</MuiLink>
									}
								/>
							</ListItem>

							<ListItem
								sx={{
									py: 2,
									borderBottom: `1px solid ${theme.palette.divider}`,
								}}
							>
								<ListItemIcon>
									<Email color='secondary' />
								</ListItemIcon>
								<ListItemText
									primary={
										<Typography variant='h6' fontWeight='medium'>
											{t(
												"pages.contact.salesEmail",
												"المبيعات والتعاون",
											)}
										</Typography>
									}
									secondary={
										<MuiLink
											href='mailto:partners@صفقة.com'
											color='secondary'
											underline='hover'
											sx={{fontWeight: 500}}
										>
											partners@صفقة.com
										</MuiLink>
									}
								/>
							</ListItem>

							<ListItem
								sx={{
									py: 2,
									borderBottom: `1px solid ${theme.palette.divider}`,
								}}
							>
								<ListItemIcon>
									<Phone color='primary' />
								</ListItemIcon>
								<ListItemText
									primary={
										<Typography variant='h6' fontWeight='medium'>
											{t("pages.contact.phone", "مركز الاتصال")}
										</Typography>
									}
									secondary={
										<Box>
											<MuiLink
												href='tel:+920000000'
												color='primary'
												underline='hover'
												sx={{fontWeight: 500, display: "block"}}
											>
												920000000
											</MuiLink>
											<Typography
												variant='caption'
												color='text.secondary'
											>
												{t(
													"pages.contact.phoneHours",
													"متاح من 8 صباحاً إلى 12 منتصف الليل",
												)}
											</Typography>
										</Box>
									}
								/>
							</ListItem>

							<ListItem sx={{py: 2}}>
								<ListItemIcon>
									<LocationOn color='primary' />
								</ListItemIcon>
								<ListItemText
									primary={
										<Typography variant='h6' fontWeight='medium'>
											{t(
												"pages.contact.addressTitle",
												"المقر الرئيسي",
											)}
										</Typography>
									}
									secondary={
										<Typography sx={{fontWeight: 500}}>
											{t(
												"pages.contact.address",
												"المملكة العربية السعودية - الرياض - حي العليا",
											)}
										</Typography>
									}
								/>
							</ListItem>
						</List>

						<Box mt={4} textAlign='center'>
							<Button
								variant='contained'
								size='large'
								startIcon={<ShoppingBag />}
								component={RouterLink}
								to='/sell'
								sx={{mr: 2}}
							>
								{t("pages.contact.startSelling", "ابدأ البيع")}
							</Button>
							<Button
								variant='outlined'
								size='large'
								startIcon={<Category />}
								component={RouterLink}
								to='/categories'
							>
								{t("pages.contact.browseCategories", "تصفح التصنيفات")}
							</Button>
						</Box>
					</Paper>
				</Grid>

				{/* ساعات العمل والمعلومات */}
				<Grid size={{xs: 12, md: 6}}>
					<Paper elevation={2} sx={{p: 4, borderRadius: 3}}>
						<Box display='flex' alignItems='center' mb={3}>
							<AccessTime color='primary' sx={{fontSize: 30, mr: 2}} />
							<Typography variant='h5' fontWeight='bold'>
								{t("pages.contact.workingHours", "ساعات العمل")}
							</Typography>
						</Box>

						<Grid container spacing={2}>
							<Grid size={{xs: 12, sm: 6}}>
								<Typography
									variant='body1'
									fontWeight='bold'
									color='primary'
								>
									{t("pages.contact.customerSupport", "دعم العملاء")}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									{t(
										"pages.contact.supportHours",
										"24/7 على مدار الساعة",
									)}
								</Typography>
							</Grid>
							<Grid size={{xs: 12, sm: 6}}>
								<Typography
									variant='body1'
									fontWeight='bold'
									color='primary'
								>
									{t("pages.contact.salesTeam", "فريق المبيعات")}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									{t(
										"pages.contact.salesHours",
										"8 ص - 8 م (توقيت الرياض)",
									)}
								</Typography>
							</Grid>
							<Grid size={{xs: 12, sm: 6}}>
								<Typography
									variant='body1'
									fontWeight='bold'
									color='primary'
								>
									{t("pages.contact.disputeResolution", "حل النزاعات")}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									{t(
										"pages.contact.disputeHours",
										"9 ص - 6 م (أيام العمل)",
									)}
								</Typography>
							</Grid>
							<Grid size={{xs: 12, sm: 6}}>
								<Typography
									variant='body1'
									fontWeight='bold'
									color='primary'
								>
									{t("pages.contact.technicalSupport", "الدعم الفني")}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									{t(
										"pages.contact.techHours",
										"10 ص - 10 م (كل الأيام)",
									)}
								</Typography>
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				{/* وسائل التواصل الاجتماعي */}
				<Grid size={{xs: 12, md: 6}}>
					<Paper
						elevation={2}
						sx={{p: 4, textAlign: "center", borderRadius: 3}}
					>
						<Typography variant='h5' gutterBottom fontWeight='bold'>
							{t("pages.contact.followUs", "تابع أحدث الصفقات")}
						</Typography>
						<Typography variant='body2' color='text.secondary' paragraph>
							{t(
								"pages.contact.socialDesc",
								"كن أول من يعرف عن الصفقات الحصرية والعروض الخاصة",
							)}
						</Typography>

						<Stack
							direction='row'
							spacing={2}
							justifyContent='center'
							mt={3}
							flexWrap='wrap'
						>
							{[
								{name: "تويتر", color: "#1DA1F2", icon: "𝕏"},
								{name: "سناب شات", color: "#FFFC00", icon: "👻"},
								{name: "انستقرام", color: "#E4405F", icon: "📷"},
								{name: "تيليجرام", color: "#26A5E4", icon: "✈️"},
							].map((platform) => (
								<Button
									key={platform.name}
									variant='contained'
									sx={{
										m: 1,
										backgroundColor: platform.color,
										"&:hover": {
											backgroundColor: platform.color,
											opacity: 0.9,
										},
										minWidth: 120,
									}}
									startIcon={
										<span style={{fontSize: "1.2rem"}}>
											{platform.icon}
										</span>
									}
								>
									{platform.name}
								</Button>
							))}
						</Stack>
					</Paper>
				</Grid>

				{/* قسم المساعدة السريعة */}
				<Grid size={{xs: 12}}>
					<Paper elevation={3} sx={{p: 4, mt: 2, borderRadius: 3}}>
						<Typography
							variant='h5'
							gutterBottom
							fontWeight='bold'
							textAlign='center'
						>
							{t("pages.contact.quickHelp", "مساعدتك السريعة مع صفقة")}
						</Typography>

						<Grid container spacing={3} mt={2}>
							<Grid size={{xs: 12, md: 4}}>
								<Button
									fullWidth
									variant='outlined'
									component={RouterLink}
									to='/help/selling'
									startIcon={<span>💰</span>}
									sx={{py: 2}}
								>
									{t("pages.contact.howToSell", "كيفة البيع على صفقة")}
								</Button>
							</Grid>
							<Grid size={{xs: 12, md: 4}}>
								<Button
									fullWidth
									variant='outlined'
									component={RouterLink}
									to='/help/safety'
									startIcon={<span>🛡️</span>}
									sx={{py: 2}}
								>
									{t("pages.contact.safetyTips", "نصائح الأمان")}
								</Button>
							</Grid>
							<Grid size={{xs: 12, md: 4}}>
								<Button
									fullWidth
									variant='outlined'
									component={RouterLink}
									to='/help/disputes'
									startIcon={<span>⚖️</span>}
									sx={{py: 2}}
								>
									{t("pages.contact.resolveDisputes", "حل النزاعات")}
								</Button>
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				{/* رسالة الشكر */}
				<Grid size={{xs: 12}}>
					<Box
						textAlign='center'
						mt={6}
						p={4}
						bgcolor='primary.light'
						borderRadius={3}
					>
						<Typography variant='h6' color='white' paragraph>
							{t(
								"pages.contact.note",
								"نتعهد بالرد على جميع استفساراتك خلال 4 ساعات عمل كحد أقصى",
							)}
						</Typography>
						<Typography variant='h5' color='white' fontWeight='bold'>
							{t(
								"pages.contact.thanks",
								"شكراً لكونك جزءاً من مجتمع صفقة - حيث تتحول المنتجات المستعملة إلى فرص جديدة",
							)}
						</Typography>

						<Box mt={4}>
							<Button
								variant='contained'
								color='secondary'
								size='large'
								startIcon={<ArrowBack />}
								component={RouterLink}
								to='/'
								sx={{fontWeight: "bold"}}
							>
								{t("pages.contact.backToHome", "العودة للرئيسية")}
							</Button>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Contact;
