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
	Chip,
	Card,
	CardContent,
	useTheme,
} from "@mui/material";
import {
	Email,
	Phone,
	LocationOn,
	SupportAgent,
	ArrowBack,
	Security,
	ShoppingBag,
	Category,
	LocalOffer,
} from "@mui/icons-material";
import {Link as RouterLink} from "react-router-dom";
import handleRTL from "../../locales/handleRTL";
import {path} from "../../routes/routes";


const Contact: FunctionComponent = () => {
	const {t} = useTranslation();
	const theme = useTheme();
	const direction = handleRTL();

	const mainCategories: {name: string; icon: string; color: "primary" | "secondary" | "success" | "info" | "warning" | "error"}[] = [
		{name: t("categories.electronics.label"), icon: "📱", color: "primary"},
		{name: t("categories.cars.label"), icon: "🚗", color: "secondary"},
		{name: t("categories.women-clothes.label"), icon: "👚", color: "success"},
		{name: t("categories.men-clothes.label"), icon: "👔", color: "info"},
		{name: t("categories.house.label"), icon: "🏠", color: "warning"},
		{name: t("categories.watches.label"), icon: "⌚", color: "error"},
	];
	const currentUrl = `https://client-qqq1.vercel.app/contact`;

	return (
		<>
			<link rel='canonical' href={currentUrl} />
			<title>{t("pages.contact.title")} | صفقة</title>
			<meta name='description' content={t("pages.contact.title")} />
			<link rel='canonical' href={currentUrl} />

			<Container maxWidth='lg' sx={{py: 6, direction}}>
				{/* Header */}
				<Box textAlign='center' mb={6}>
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
						{t("pages.contact.title", "صفقة | اتصل بنا")}
					</Typography>
					<Typography
						variant='h5'
						color='text.secondary'
						paragraph
						sx={{maxWidth: 700, mx: "auto"}}
					>
						{t(
							"pages.contact.subtitle",
							"بيع وشراء بثقة وسرعة — كل صفقة فرصة جديدة لك!",
						)}
					</Typography>

					{/* Categories */}
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
								color={category.color }
								variant='outlined'
								sx={{fontSize: "0.9rem", fontWeight: 500}}
							/>
						))}
					</Box>
				</Box>

				<Divider sx={{mb: 6}} />

				<Grid container spacing={4}>
					{/* Support Section */}
					<Grid size={{xs: 12, md: 6}}>
						<Paper elevation={3} sx={{p: 4, height: "100%", borderRadius: 3}}>
							<Box sx={{display: "flex", alignItems: "center", mb: 3}}>
								<SupportAgent
									color='primary'
									sx={{fontSize: 40, mr: 2}}
								/>
								<Typography variant='h4' fontWeight='bold'>
									{t("pages.contact.supportTitle", "فريق الدعم")}
								</Typography>
							</Box>

							<Typography variant='body1' paragraph color='text.secondary'>
								{t(
									"pages.contact.intro",
									"نحن هنا لجعل تجربتك سلسة، آمنة، ومربحة. كل صفقة معنا تجربة نجاح!",
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
													"أمان مضمون",
												)}
											</Typography>
										</Box>
										<Typography
											variant='body2'
											color='text.secondary'
										>
											{t(
												"pages.contact.securityDesc",
												"حماية بياناتك ومعاملاتك أولويتنا. أنظمة مراقبة حديثة وفريق متخصص دائمًا معك.",
											)}
										</Typography>
									</CardContent>
								</Card>

								<Card variant='outlined'>
									<CardContent>
										<Box display='flex' alignItems='center' mb={2}>
											<LocalOffer color='warning' sx={{mr: 2}} />
											<Typography variant='h6' fontWeight='bold'>
												{t(
													"pages.contact.dealsTitle",
													"صفقات ناجحة",
												)}
											</Typography>
										</Box>
										<Typography
											variant='body2'
											color='text.secondary'
										>
											{t(
												"pages.contact.dealsDesc",
												"نوفر أدوات واتصالات تساعدك على إتمام صفقاتك بسرعة وثقة.",
											)}
										</Typography>
									</CardContent>
								</Card>
							</Box>
						</Paper>
					</Grid>

					{/* Contact Channels */}
					<Grid size={{xs: 12, md: 6}}>
						<Paper elevation={3} sx={{p: 4, height: "100%", borderRadius: 3}}>
							<Typography variant='h4' gutterBottom fontWeight='bold'>
								{t("pages.contact.contactChannels", "تواصل معنا")}
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
												href='mailto:anesmhamed100@gmail.com'
												color='primary'
												underline='hover'
												sx={{fontWeight: 500}}
											>
												anesmhamed100@gmail.com
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
												{t("pages.contact.phone", "رقم الاتصال")}
											</Typography>
										}
										secondary={
											<Box>
												<MuiLink
													href='tel:+972538346915'
													color='primary'
													underline='hover'
													sx={{
														fontWeight: 500,
														display: "block",
													}}
												>
													0538346915
												</MuiLink>
												<Typography
													variant='caption'
													color='text.secondary'
												>
													{t(
														"pages.contact.phoneHours",
														"8ص - 12م",
													)}
												</Typography>
											</Box>
										}
									/>
								</ListItem>

								<ListItem>
									<ListItemIcon>
										<LocationOn color='primary' />
									</ListItemIcon>
									<ListItemText
										primary={
											<Typography variant='h6' fontWeight='medium'>
												{t("pages.contact.addressTitle", "مقرنا")}
											</Typography>
										}
										secondary={
											<Typography sx={{fontWeight: 500}}>
												{t(
													"pages.contact.address",
													"صفقة منصة رقمية لبيع وشراء آمن بين المستخدمين",
												)}
											</Typography>
										}
									/>
								</ListItem>
							</List>

							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-around",
									gap: 1,
								}}
								mt={4}
								textAlign='center'
							>
								<Button
									variant='contained'
									size='large'
									startIcon={<ShoppingBag />}
									component={RouterLink}
									to={path.Home}
									sx={{height: 50}}
								>
									{t("pages.contact.startSelling", "ابدأ البيع")}
								</Button>
								<Button
									variant='outlined'
									size='large'
									startIcon={<Category />}
									component={RouterLink}
									to={path.Home}
									sx={{height: 50}}
								>
									{t(
										"pages.contact.browseCategories",
										"تصفح التصنيفات",
									)}
								</Button>
							</Box>
						</Paper>
					</Grid>

					{/* Quick Help */}
					<Grid size={{xs: 12}}>
						<Paper elevation={3} sx={{p: 4, mt: 2, borderRadius: 3}}>
							<Typography
								variant='h5'
								gutterBottom
								fontWeight='bold'
								textAlign='center'
							>
								{t("pages.contact.quickHelp", "مساعدتك السريعة")}
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
										{t("pages.contact.howToSell", "كيفية البيع")}
									</Button>
								</Grid>
								<Grid size={{xs: 12, md: 4}}>
									<Button
										fullWidth
										variant='outlined'
										component={RouterLink}
										to={path.SafetyHelp}
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
										to={path.DisputesHelp}
										startIcon={<span>⚖️</span>}
										sx={{py: 2}}
									>
										{t(
											"pages.contact.resolveDisputes",
											"حل النزاعات",
										)}
									</Button>
								</Grid>
							</Grid>
						</Paper>
					</Grid>

					{/* Thank You Note */}
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
									"نرد على استفساراتك خلال 4 ساعات فقط!",
								)}
							</Typography>
							<Typography variant='h5' color='white' fontWeight='bold'>
								{t(
									"pages.contact.thanks",
									"شكراً لكونك جزءاً من مجتمع صفقة - حيث تتحول الصفقات إلى فرص!",
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
		</>
	);
};

export default Contact;
