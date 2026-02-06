import {FunctionComponent} from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardIos";
import {
	Box,
	IconButton,
	Typography,
	Container,
	Card,
	CardContent,
	Grid,
	Paper,
	Button,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
	Groups as GroupsIcon,
	Security as SecurityIcon,
	LocationOn as LocationIcon,
	Diversity3 as DiversityIcon,
	Sell as SellIcon,
	Storefront as StorefrontIcon,
	ThumbUp as ThumbUpIcon,
} from "@mui/icons-material";
import {motion} from "framer-motion";

const About: FunctionComponent = () => {
	const navigate = useNavigate();
	const {t} = useTranslation();

	const features = [
		{
			icon: <GroupsIcon sx={{fontSize: 40}} />,
			title: t("about.what-we-are.safqa"),
			description: t("about.what-we-are.subtitle"),
			color: "#2196F3",
		},
		{
			icon: <SellIcon sx={{fontSize: 40}} />,
			title: t("about.buy-and-sell.title"),
			description: t("about.buy-and-sell.subtitle"),
			color: "#4CAF50",
		},
		{
			icon: <StorefrontIcon sx={{fontSize: 40}} />,
			title: t("about.what-we-have.title"),
			description: t("about.what-we-have.subtitle"),
			color: "#FF9800",
		},
		{
			icon: <SecurityIcon sx={{fontSize: 40}} />,
			title: t("about.control.title"),
			description: t("about.control.subtitle"),
			color: "#9C27B0",
		},
		{
			icon: <ThumbUpIcon sx={{fontSize: 40}} />,
			title: t("about.trust.title"),
			description: t("about.trust.subtitle"),
			color: "#00BCD4",
		},
		{
			icon: <DiversityIcon sx={{fontSize: 40}} />,
			title: t("about.why-register.title"),
			description: t("about.why-register.subtitle"),
			color: "#E91E63",
		},
		{
			icon: <LocationIcon sx={{fontSize: 40}} />,
			title: t("about.locations.title"),
			description: t("about.locations.subtitle"),
			color: "#FF5722",
		},
	];
	const currentUrl = `https://client-qqq1.vercel.app/about`;

	return (
		<>
		
				<link rel='canonical' href={currentUrl} />
				<title>{t("about.title")} | صفقة</title>
				<meta name='description' content={t("about.subtitle")} />
				<meta property='og:title' content={t("about.title")} />
				<meta property='og:description' content={t("about.subtitle")} />
				<meta property='og:type' content='website' />


			<Box
				sx={{
					minHeight: "100vh",
					background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
					position: "relative",
					overflow: "hidden",
				}}
			>
				{/* Decorative Elements */}
				<Box
					sx={{
						position: "absolute",
						top: -100,
						right: -100,
						width: 300,
						height: 300,
						borderRadius: "50%",
						background: "rgba(33, 150, 243, 0.1)",
						zIndex: 0,
					}}
				/>
				<Box
					sx={{
						position: "absolute",
						bottom: -100,
						left: -100,
						width: 400,
						height: 400,
						borderRadius: "50%",
						background: "rgba(76, 175, 80, 0.1)",
						zIndex: 0,
					}}
				/>

				<Container maxWidth='lg' sx={{position: "relative", zIndex: 1, py: 8}}>
					{/* Back Button */}
					<motion.div
						initial={{x: -20, opacity: 0}}
						animate={{x: 0, opacity: 1}}
						transition={{duration: 0.5}}
					>
						<IconButton
							onClick={() => navigate(-1)}
							aria-label='back'
							sx={{
								mb: 4,
								background: "white",
								boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
								"&:hover": {
									background: "#f5f5f5",
									transform: "translateX(-5px)",
								},
								transition: "all 0.3s ease",
							}}
						>
							<ArrowForwardIcon sx={{transform: "rotate(180deg)"}} />
						</IconButton>
					</motion.div>

					{/* Hero Section */}
					<motion.div
						initial={{y: 50, opacity: 0}}
						animate={{y: 0, opacity: 1}}
						transition={{duration: 0.8}}
					>
						<Paper
							elevation={0}
							sx={{
								p: {xs: 3, md: 6},
								mb: 8,
								textAlign: "center",
								background: "rgba(255, 255, 255, 0.9)",
								backdropFilter: "blur(10px)",
								borderRadius: 4,
								border: "1px solid rgba(255, 255, 255, 0.3)",
							}}
						>
							<Typography
								variant='h1'
								sx={{
									fontWeight: 800,
									mb: 3,
									fontSize: {xs: "2.5rem", md: "3.5rem"},
									color: "#2c3e50",
									background:
										"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
								}}
							>
								{t("about.title")}
							</Typography>

							<Typography
								variant='h4'
								sx={{
									mb: 4,
									color: "#546e7a",
									fontWeight: 300,
									fontSize: {xs: "1.25rem", md: "1.75rem"},
									lineHeight: 1.6,
								}}
							>
								{t("about.subtitle")}
							</Typography>

							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									gap: 2,
									mt: 4,
									flexWrap: "wrap",
								}}
							>
								<Button
									variant='contained'
									size='large'
									onClick={() => navigate("/contact")}
									sx={{
										px: 4,
										py: 1.5,
										borderRadius: 2,
										background:
											"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
										fontSize: "1.1rem",
									}}
								>
									{t("callUs")}
								</Button>
								<Button
									variant='outlined'
									size='large'
									onClick={() => navigate("/register")}
									sx={{
										px: 4,
										py: 1.5,
										borderRadius: 2,
										borderWidth: 2,
										fontSize: "1.1rem",
									}}
								>
									{t("joinUs")}
								</Button>
							</Box>
						</Paper>
					</motion.div>

					{/* Features Grid */}
					<Grid container spacing={4}>
						{features.map((feature, index) => (
							<Grid size={{xs: 6, sm: 6, md: 4}} key={index}>
								<motion.div
									initial={{y: 50, opacity: 0}}
									animate={{y: 0, opacity: 1}}
									transition={{duration: 0.5, delay: index * 0.1}}
									whileHover={{
										y: -10,
										transition: {duration: 0.2},
									}}
								>
									<Card
										sx={{
											height: "100%",
											borderRadius: 3,
											overflow: "hidden",
											position: "relative",
											transition: "all 0.3s ease",
											"&:hover": {
												boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
												transform: "translateY(-5px)",
											},
										}}
									>
										<Box
											sx={{
												height: 8,
												background: `linear-gradient(45deg, ${feature.color}, ${feature.color}80)`,
											}}
										/>
										<CardContent sx={{p: 4, textAlign: "center"}}>
											<Box
												sx={{
													width: 80,
													height: 80,
													borderRadius: "50%",
													background: `${feature.color}15`,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													margin: "0 auto 20px",
													color: feature.color,
												}}
											>
												{feature.icon}
											</Box>
											<Typography
												variant='h5'
												sx={{
													fontWeight: 700,
													mb: 2,
													color: "#2c3e50",
												}}
											>
												{feature.title}
											</Typography>
											<Typography
												variant='body1'
												sx={{
													color: "#546e7a",
													lineHeight: 1.7,
													fontSize: "1.1rem",
												}}
											>
												{feature.description}
											</Typography>
										</CardContent>
									</Card>
								</motion.div>
							</Grid>
						))}
					</Grid>
					{/* Team Section */}
					<Box sx={{mt: 8}}>
						<Typography
							variant='h3'
							sx={{mb: 4, textAlign: "center", fontWeight: 700}}
						>
							{t("team")}
						</Typography>
						<Grid container spacing={4} justifyContent='center'>
							{[
								{name: "انيس محاميد", role: "المؤسس والرئيس التنفيذي"},
								{name: "سارة اغباريه", role: "مدير التكنولوجيا"},
								{name: "محمد خالد محاميد", role: "مدير التسويق"},
								{name: "فاطمة محاجنه", role: "مدير خدمة العملاء"},
							].map((member, index) => (
								<Grid size={{xs: 6, md: 3}} key={index}>
									<Card
										sx={{textAlign: "center", p: 3, borderRadius: 3}}
									>
										<Box
											sx={{
												width: 120,
												height: 120,
												borderRadius: "50%",
												background:
													"linear-gradient(45deg, #2196F3, #21CBF3)",
												margin: "0 auto 20px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												fontSize: "3rem",
												color: "white",
											}}
										>
											{member.name.charAt(0)}
										</Box>
										<Typography variant='h6' sx={{fontWeight: 700}}>
											{member.name}
										</Typography>
										<Typography
											variant='body2'
											color='text.secondary'
										>
											{member.role}
										</Typography>
									</Card>
								</Grid>
							))}
						</Grid>
					</Box>

					{/* FAQ Section */}
					<Box sx={{mt: 8}}>
						<Typography
							variant='h3'
							sx={{mb: 4, textAlign: "center", fontWeight: 700}}
						>
							{t("faq")}
						</Typography>
						<Grid container spacing={3}>
							{[
								{
									q: "كيف أبدأ في بيع منتجاتي؟",
									a: "سجل حساباً، أضف منتجك بصور واضحة ووصف دقيق، وابدأ البيع!",
								},
								{
									q: "هل توجد رسوم على البيع؟",
									a: "لا، الموقع مجاني تماماً للاستخدام الشخصي",
								},
								{
									q: "كيف أتأكد من أمان عملية الشراء؟",
									a: "نوفر نظام تقييم ومراجعات وتواصل آمن بين البائع والمشتري",
								},
								{
									q: "هل يمكنني إرجاع المنتج؟",
									a: "نعم، حسب سياسة الإرجاع الخاصة بكل بائع",
								},
							].map((item, index) => (
								<Grid size={{xs: 12, md: 6}} key={index}>
									<Paper sx={{p: 3, borderRadius: 2}}>
										<Typography
											variant='h6'
											sx={{mb: 2, color: "#2196F3"}}
										>
											❓ {item.q}
										</Typography>
										<Typography variant='body1'>{item.a}</Typography>
									</Paper>
								</Grid>
							))}
						</Grid>
					</Box>
					{/* Stats Section */}
					<motion.div
						initial={{y: 50, opacity: 0}}
						animate={{y: 0, opacity: 1}}
						transition={{duration: 0.8, delay: 0.8}}
					>
						<Paper
							elevation={0}
							sx={{
								mt: 8,
								p: {xs: 3, md: 6},
								background:
									"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
								borderRadius: 4,
								color: "white",
								textAlign: "center",
							}}
						>
							<Typography variant='h3' sx={{mb: 4, fontWeight: 700}}>
								أرقامنا تتحدث
							</Typography>
							<Grid container spacing={4} justifyContent='center'>
								<Grid size={{xs: 6, sm: 3}}>
									<Box>
										<Typography variant='h2' sx={{fontWeight: 800}}>
											10K+
										</Typography>
										<Typography variant='h6'>مستخدم نشط</Typography>
									</Box>
								</Grid>
								<Grid size={{xs: 6, sm: 3}}>
									<Box>
										<Typography variant='h2' sx={{fontWeight: 800}}>
											50K+
										</Typography>
										<Typography variant='h6'>منتج معروض</Typography>
									</Box>
								</Grid>
								<Grid size={{xs: 6, sm: 3}}>
									<Box>
										<Typography variant='h2' sx={{fontWeight: 800}}>
											95%
										</Typography>
										<Typography variant='h6'>رضا العملاء</Typography>
									</Box>
								</Grid>
								<Grid size={{xs: 6, sm: 3}}>
									<Box>
										<Typography variant='h2' sx={{fontWeight: 800}}>
											24/7
										</Typography>
										<Typography variant='h6'>دعم فني</Typography>
									</Box>
								</Grid>
							</Grid>
						</Paper>
					</motion.div>

					{/* CTA Section */}
					<motion.div
						initial={{y: 50, opacity: 0}}
						animate={{y: 0, opacity: 1}}
						transition={{duration: 0.8, delay: 1}}
					>
						<Box sx={{mt: 8, textAlign: "center"}}>
							<Typography variant='h3' sx={{mb: 3, fontWeight: 700}}>
								انضم إلى مجتمع صفقة اليوم
							</Typography>
							<Typography
								variant='h6'
								sx={{mb: 4, color: "#546e7a", maxWidth: 600, mx: "auto"}}
							>
								ابدأ رحلتك في عالم التجارة الإلكترونية مع منصة موثوقة تضع
								احتياجاتك أولاً
							</Typography>
							<Button
								variant='contained'
								size='large'
								onClick={() => navigate("/register")}
								sx={{
									px: 6,
									py: 2,
									borderRadius: 3,
									fontSize: "1.2rem",
									background:
										"linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
									boxShadow: "0 8px 25px rgba(255,107,107,0.3)",
								}}
							>
								{t("startFree")}
							</Button>
						</Box>
					</motion.div>
				</Container>
			</Box>
		</>
	);
};

export default About;
