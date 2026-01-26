import {FunctionComponent, useEffect, useRef, useState} from "react";
import {deleteUserById, getUserById} from "../../services/usersServices";
import {useNavigate, useParams} from "react-router-dom";
import {
	Button,
	Typography,
	List,
	ListItem,
	ListItemText,
	Box,
	ListItemIcon,
	Stack,
	Card,
	CardContent,
	Avatar,
	Grid,
	Paper,
	Chip,
	Divider,
	LinearProgress,
	useTheme,
	useMediaQuery,
	Badge,
	Tabs,
	Tab,
	Container,
	CircularProgress,
} from "@mui/material";
import {
	Edit as EditIcon,
	History as HistoryIcon,
	Security as SecurityIcon,
	SupportAgent as SupportIcon,
	Visibility as VisibilityIcon,
	Phone,
	Email,
	LocationOn,
	VerifiedUser,
	CalendarToday,
	Share,
	QrCode,
	Download,
	Lock,
	Person,
	Settings,
	Logout,
	Favorite,
	ShoppingCart,
	Star,
} from "@mui/icons-material";
import {path} from "../../routes/routes";
import useToken from "../../hooks/useToken";
import {useUser} from "../../context/useUSer";
import {emptyAuthValues} from "../../interfaces/authValues";
import DeleteAccountBox from "../../atoms/userManage/DeleteAccountBox";
import UserDetailTable from "../../atoms/userManage/UesrDetailsTable";
import EditUserData from "../../atoms/userManage/EditUserData";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion";
import {formatDate} from "../../helpers/dateAndPriceFormat";
import {showSuccess} from "../../atoms/toasts/ReactToast";

interface ProfileProps {}

/**
 * User Profile Component
 * @returns User profile with personal data and management options
 */
const Profile: FunctionComponent<ProfileProps> = () => {
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState(0);
	const navigate = useNavigate();
	const {decodedToken, setAfterDecode} = useToken();
	const {setAuth, setIsLoggedIn} = useUser();
	const detailsRef = useRef<HTMLDivElement>(null);
	const {t} = useTranslation();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const [user, setUser] = useState<{
		name: {first: string; last: string};
		phone: {phone_1: string; phone_2: string};
		address: {
			city: string;
			street: string;
			houseNumber: string;
		};
		email: string;
		image: {url: string; alt: string};
		role: string;
		status: string;
		activity: string[];
		createdAt: string;
		slug: string;
	}>({
		name: {first: "", last: ""},
		phone: {phone_1: "", phone_2: ""},
		address: {city: "", street: "", houseNumber: ""},
		email: "",
		image: {url: "", alt: ""},
		role: "",
		status: "",
		activity: [],
		createdAt: "",
		slug: "",
	});

	const {id} = useParams();

	// Stats
	const [stats, setStats] = useState({
		totalProducts: 0,
		totalFavorites: 0,
		rating: 4.5,
		completionPercentage: 65,
	});

	const updateProfile = () => {
		detailsRef.current?.scrollIntoView({behavior: "smooth"});
	};

	// TODO:Change password
	// const changePassword = () => {
	// 	navigate(path.ChangePassword);
	// };

	const contactSupport = () => {
		navigate(path.Contact);
	};

	const handleShareProfile = () => {
		const profileUrl = `${window.location.origin}/users/customer/${user.slug}`;
		if (navigator.share) {
			navigator.share({
				title: `الملف الشخصي لـ ${user.name.first} ${user.name.last}`,
				text: `اطلع على ملفي الشخصي على موقع صفقه`,
				url: profileUrl,
			});
		} else {
			navigator.clipboard.writeText(profileUrl);
			showSuccess("تم نسخ رابط الملف الشخصي");
		}
	};

	const handleExportData = () => {
		// Logic to export user data
		showSuccess("سيتم تحميل بياناتك قريباً");
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		setAuth(emptyAuthValues);
		setIsLoggedIn(false);
		setAfterDecode(null);
		navigate(path.Home);
	};

	useEffect(() => {
		const targetId = id || decodedToken?._id;
		if (targetId) {
			getUserById(targetId)
				.then((userRes) => {
					setUser(userRes);
					// Simulate stats - in real app, fetch from API
					setStats({
						totalProducts: Math.floor(Math.random() * 50),
						totalFavorites: Math.floor(Math.random() * 100),
						rating: 4.2 + Math.random() * 0.8,
						completionPercentage: 30 + Math.floor(Math.random() * 70),
					});
				})
				.catch((err) => console.error("Error fetching user data:", err))
				.finally(() => setLoading(false));
		}
	}, [id, decodedToken]);

	const handleDeleteAccount = () => {
		deleteUserById(decodedToken._id).then(() => {
			localStorage.removeItem("token");
			setAuth(emptyAuthValues);
			setIsLoggedIn(false);
			setAfterDecode(null);
			navigate(path.Home);
		});
	};

	const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "80vh",
					gap: 3,
				}}
			>
				<motion.div
					animate={{rotate: 360}}
					transition={{duration: 2, repeat: Infinity, ease: "linear"}}
				>
					<CircularProgress size={60} />
				</motion.div>
				<Typography variant='h6' color='text.secondary'>
					جاري تحميل الملف الشخصي...
				</Typography>
			</Box>
		);
	}

	const tabs = [
		{label: "الملف الشخصي", icon: <Person />},
		{label: "الطلبات", icon: <ShoppingCart />},
		{label: "المفضلة", icon: <Favorite />},
		{label: "الإعدادات", icon: <Settings />},
	];
	const currentUrl = `https://client-qqq1.vercel.app/profile`;

	return (
		<>
			<Helmet>
				<link rel='canonical' href={currentUrl} />
				<title>
					{t("accountMenu.profile")} {user.name.first} {user.name.last} | صفقة
				</title>
				<meta
					name='description'
					content={`${t("accountMenu.profile")} ${user.name.first} ${user.name.last}`}
				/>
				<meta
					property='og:title'
					content={`${user.name.first} ${user.name.last} - ملف شخصي`}
				/>
				<meta
					property='og:description'
					content={`تعرف على ${user.name.first} على موقع صفقه`}
				/>
				<meta property='og:image' content={user.image?.url} />
			</Helmet>

			<Box
				sx={{
					minHeight: "100vh",
					background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
					py: 4,
					px: {xs: 2, sm: 3},
				}}
			>
				<motion.div
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.5}}
				>
					<Container maxWidth='lg'>
						{/* Profile Header */}
						<Card
							sx={{
								mb: 4,
								borderRadius: 4,
								background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
								position: "relative",
								overflow: "hidden",
								"&::before": {
									content: '""',
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									height: 4,
									background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
								},
							}}
						>
							<CardContent sx={{p: {xs: 2, md: 4}}}>
								<Grid container spacing={3} alignItems='center'>
									{/* Avatar Section */}
									<Grid size={{xs: 12, md: "auto"}}>
										<Box
											sx={{
												position: "relative",
												display: "flex",
												justifyContent: "center",
											}}
										>
											<Badge
												overlap='circular'
												anchorOrigin={{
													vertical: "bottom",
													horizontal: "right",
												}}
												badgeContent={
													<VerifiedUser
														sx={{
															color: "success.main",
															fontSize: 30,
															bgcolor: "white",
															borderRadius: "50%",
															p: 0.5,
														}}
													/>
												}
											>
												<Avatar
													src={
														user.image?.url ||
														"https://i.ibb.co/5GzXkwq/user.png"
													}
													alt={
														user.image?.alt ||
														`${user.name.first}'s avatar`
													}
													sx={{
														width: {xs: 120, md: 150},
														height: {xs: 120, md: 150},
														fontSize: {xs: 40, md: 50},
														border: `4px solid ${theme.palette.background.paper}`,
														boxShadow: 6,
														bgcolor:
															theme.palette.primary.main,
													}}
												>
													{user.name?.first
														?.charAt(0)
														.toUpperCase()}
												</Avatar>
											</Badge>
										</Box>
									</Grid>

									{/* User Info */}
									<Grid size={{xs: 15, md: 6}}>
										<Typography
											variant='h3'
											fontWeight='bold'
											gutterBottom
										>
											{user.name.first} {user.name.last}
										</Typography>
										<Stack
											direction='row'
											alignItems='center'
											spacing={1}
											mb={2}
										>
											<Typography
												variant='h6'
												color='text.secondary'
											>
												@{user.slug || user.email.split("@")[0]}
											</Typography>
											<Chip
												label={
													user.role === "Admin"
														? "مدير"
														: user.role === "Moderator"
															? "مشرف"
															: "مستخدم"
												}
												color={
													user.role === "Admin"
														? "error"
														: user.role === "Moderator"
															? "warning"
															: "primary"
												}
												size='small'
												variant='outlined'
											/>
											<Chip
												label={user.status || "نشط"}
												color='success'
												size='small'
											/>
										</Stack>

										{/* Contact Info */}
										<Stack direction='column' spacing={1} mb={2}>
											{user.email && (
												<Box
													display='flex'
													alignItems='center'
													gap={1}
												>
													<Email
														fontSize='small'
														color='action'
													/>
													<Typography variant='body2'>
														{user.email}
													</Typography>
												</Box>
											)}
											{user.phone?.phone_1 && (
												<Box
													display='flex'
													alignItems='center'
													gap={1}
												>
													<Phone
														fontSize='small'
														color='action'
													/>
													<Typography variant='body2'>
														{user.phone.phone_1}
													</Typography>
												</Box>
											)}
											{user.address?.city && (
												<Box
													display='flex'
													alignItems='center'
													gap={1}
												>
													<LocationOn
														fontSize='small'
														color='action'
													/>
													<Typography variant='body2'>
														{user.address.street}،{" "}
														{user.address.city}
														{user.address.houseNumber &&
															`، رقم ${user.address.houseNumber}`}
													</Typography>
												</Box>
											)}
											{user.createdAt && (
												<Box
													display='flex'
													alignItems='center'
													gap={1}
												>
													<CalendarToday
														fontSize='small'
														color='action'
													/>
													<Typography variant='body2'>
														عضو منذ:{" "}
														{formatDate(user.createdAt)}
													</Typography>
												</Box>
											)}
										</Stack>
									</Grid>

									{/* Action Buttons */}
									<Grid size={{xs: 12, md: 4}}>
										<Stack spacing={2}>
											<Button
												variant='contained'
												size='large'
												startIcon={<EditIcon />}
												fullWidth
												onClick={updateProfile}
												sx={{
													background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
													gap: 2,
												}}
											>
												تعديل الملف
											</Button>
											<Button
												variant='outlined'
												size='large'
												fullWidth
												sx={{gap: 2}}
												startIcon={<Share />}
												onClick={handleShareProfile}
											>
												مشاركة
											</Button>
											<Button
												variant='outlined'
												color='error'
												size='large'
												sx={{gap: 2}}
												fullWidth
												startIcon={<Logout />}
												onClick={handleLogout}
											>
												{t("logout")}
											</Button>
										</Stack>
									</Grid>
								</Grid>
							</CardContent>
						</Card>

						{/* Stats Section */}
						<Grid container spacing={3} sx={{mb: 4}}>
							<Grid size={{xs: 6, sm: 3}}>
								<Paper
									sx={{
										p: 2,
										textAlign: "center",
										borderRadius: 3,
										height: "100%",
									}}
								>
									<ShoppingCart
										color='primary'
										sx={{fontSize: 40, mb: 1}}
									/>
									<Typography variant='h4' fontWeight='bold'>
										{stats.totalProducts}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										المنشورات
									</Typography>
								</Paper>
							</Grid>
							<Grid size={{xs: 6, sm: 3}}>
								<Paper
									sx={{
										p: 2,
										textAlign: "center",
										borderRadius: 3,
										height: "100%",
									}}
								>
									<Favorite color='error' sx={{fontSize: 40, mb: 1}} />
									<Typography variant='h4' fontWeight='bold'>
										{stats.totalFavorites}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										{t("favorites")}
									</Typography>
								</Paper>
							</Grid>
							<Grid size={{xs: 6, sm: 3}}>
								<Paper
									sx={{
										p: 2,
										textAlign: "center",
										borderRadius: 3,
										height: "100%",
									}}
								>
									<Star color='warning' sx={{fontSize: 40, mb: 1}} />
									<Typography variant='h4' fontWeight='bold'>
										{stats.rating.toFixed(1)}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										تقييم
									</Typography>
								</Paper>
							</Grid>
							<Grid size={{xs: 6, sm: 3}}>
								<Paper
									sx={{
										p: 2,
										textAlign: "center",
										borderRadius: 3,
										height: "100%",
									}}
								>
									<VerifiedUser
										color='success'
										sx={{fontSize: 40, mb: 1}}
									/>
									<Typography variant='h4' fontWeight='bold'>
										{stats.completionPercentage}%
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										اكتمال الملف
									</Typography>
									<LinearProgress
										variant='determinate'
										value={stats.completionPercentage}
										sx={{mt: 1, height: 8, borderRadius: 4}}
									/>
								</Paper>
							</Grid>
						</Grid>

						{/* Tabs Navigation */}
						<Paper sx={{mb: 4, borderRadius: 2}}>
							<Tabs
								value={activeTab}
								onChange={handleTabChange}
								variant={isMobile ? "scrollable" : "fullWidth"}
								scrollButtons='auto'
								sx={{
									borderBottom: 1,
									borderColor: "divider",
									"& .MuiTab-root": {
										fontWeight: 600,
										minHeight: 60,
									},
								}}
							>
								{tabs.map((tab, index) => (
									<Tab
										key={index}
										label={tab.label}
										icon={tab.icon}
										iconPosition='start'
									/>
								))}
							</Tabs>
						</Paper>

						{/* Tab Content */}
						{activeTab === 0 && (
							<motion.div
								initial={{opacity: 0}}
								animate={{opacity: 1}}
								transition={{duration: 0.3}}
							>
								<Grid container spacing={3}>
									{/* Personal Information */}
									<Grid size={{xs: 12, lg: 8}}>
										<Card sx={{mb: 3, borderRadius: 3}}>
											<CardContent>
												<Typography
													variant='h5'
													gutterBottom
													fontWeight='bold'
													color='primary'
												>
													البيانات الشخصية
												</Typography>
												<UserDetailTable user={user} />
											</CardContent>
										</Card>

										{/* Quick Actions */}
										<Card sx={{borderRadius: 3}}>
											<CardContent>
												<Typography
													variant='h5'
													gutterBottom
													fontWeight='bold'
													color='primary'
												>
													إجراءات سريعة
												</Typography>
												<Grid container spacing={2}>
													<Grid size={{xs: 12, sm: 6}}>
														{/* TODO:change password */}
														<Button
															variant='outlined'
															fullWidth
															startIcon={<SecurityIcon />}
															// onClick={changePassword}
															sx={{
																py: 1.5,
																justifyContent:
																	"flex-start",
															}}
														>
															تغيير كلمة المرور
														</Button>
													</Grid>
													<Grid size={{xs: 12, sm: 6}}>
														<Button
															variant='outlined'
															fullWidth
															startIcon={<SupportIcon />}
															onClick={contactSupport}
															sx={{
																py: 1.5,
																justifyContent:
																	"flex-start",
															}}
														>
															دعم فني
														</Button>
													</Grid>
													<Grid size={{xs: 12, sm: 6}}>
														<Button
															variant='outlined'
															fullWidth
															startIcon={<Download />}
															onClick={handleExportData}
															sx={{
																py: 1.5,
																justifyContent:
																	"flex-start",
															}}
														>
															تصدير البيانات
														</Button>
													</Grid>
													<Grid size={{xs: 12, sm: 6}}>
														<Button
															variant='outlined'
															fullWidth
															startIcon={<QrCode />}
															onClick={() =>
																navigate(
																	`/users/customer/${user.slug}`,
																)
															}
															sx={{
																py: 1.5,
																justifyContent:
																	"flex-start",
															}}
														>
															معاينة الملف
														</Button>
													</Grid>
												</Grid>
											</CardContent>
										</Card>
									</Grid>

									{/* Activity History */}
									<Grid size={{xs: 12, lg: 4}}>
										<Card sx={{borderRadius: 3, height: "100%"}}>
											<CardContent>
												<Typography
													variant='h5'
													gutterBottom
													fontWeight='bold'
													color='primary'
												>
													سجل النشاط
												</Typography>
												{user.activity?.length ? (
													<List dense>
														{user.activity
															.slice(-5)
															.reverse()
															.map((timestamp, index) => {
																const date = new Date(
																	timestamp,
																);
																return (
																	<ListItem
																		key={index}
																		sx={{
																			borderRadius: 2,
																			mb: 1,
																			bgcolor:
																				"grey.50",
																		}}
																	>
																		<ListItemIcon>
																			<HistoryIcon color='primary' />
																		</ListItemIcon>
																		<ListItemText
																			primary={date.toLocaleString(
																				"ar-SA",
																			)}
																			secondary='آخر تسجيل دخول'
																		/>
																	</ListItem>
																);
															})}
													</List>
												) : (
													<Typography
														sx={{padding: 2}}
														color='text.secondary'
														textAlign='center'
													>
														لا يوجد نشاطات حديثة
													</Typography>
												)}
												<Divider sx={{my: 2}} />
												{/* <Button
													fullWidth
													variant='text'
													startIcon={<HistoryIcon />}
													onClick={() =>
														navigate(path.ActivityLog)
													}
												>
													عرض السجل الكامل
												</Button> */}
											</CardContent>
										</Card>
									</Grid>
								</Grid>
							</motion.div>
						)}

						{activeTab === 1 && (
							<Card sx={{borderRadius: 3}}>
								<CardContent>
									<Typography
										variant='h5'
										gutterBottom
										fontWeight='bold'
										color='primary'
									>
										الطلبات
									</Typography>
									<Box textAlign='center' py={8}>
										<ShoppingCart
											sx={{
												fontSize: 80,
												color: "text.secondary",
												mb: 2,
											}}
										/>
										<Typography
											variant='h6'
											color='text.secondary'
											gutterBottom
										>
											لا توجد طلبات حالياً
										</Typography>
										<Typography
											variant='body2'
											color='text.secondary'
											paragraph
										>
											يمكنك البدء بالتسوق من خلال تصفح منتجاتنا
											المميزة
										</Typography>
										<Button
											variant='contained'
											onClick={() => navigate(path.Home)}
											sx={{mt: 2}}
										>
											بدء التسوق
										</Button>
									</Box>
								</CardContent>
							</Card>
						)}

						{activeTab === 2 && (
							<Card sx={{borderRadius: 3}}>
								<CardContent>
									<Typography
										variant='h5'
										gutterBottom
										fontWeight='bold'
										color='primary'
									>
										قائمة المفضلة
									</Typography>
									<Box textAlign='center' py={8}>
										<Favorite
											sx={{
												fontSize: 80,
												color: "text.secondary",
												mb: 2,
											}}
										/>
										<Typography
											variant='h6'
											color='text.secondary'
											gutterBottom
										>
											قائمة المفضلة فارغة
										</Typography>
										<Typography
											variant='body2'
											color='text.secondary'
											paragraph
										>
											يمكنك إضافة المنتجات التي تعجبك إلى قائمة
											المفضلة
										</Typography>
										<Button
											variant='contained'
											onClick={() => navigate(path.Home)}
											sx={{mt: 2}}
										>
											تصفح المنتجات
										</Button>
									</Box>
								</CardContent>
							</Card>
						)}

						{activeTab === 3 && (
							<Card sx={{borderRadius: 3}}>
								<CardContent>
									<Typography
										variant='h5'
										gutterBottom
										fontWeight='bold'
										color='primary'
									>
										إعدادات الحساب
									</Typography>
									<Grid container spacing={3}>
										<Grid size={{xs: 12, md: 6}}>
											<Card
												variant='outlined'
												sx={{p: 2, borderRadius: 2}}
											>
												<Typography variant='h6' gutterBottom>
													خصوصية البيانات
												</Typography>
												<Stack spacing={2}>
													<Button
														variant='outlined'
														startIcon={<VisibilityIcon />}
													>
														إعدادات الظهور
													</Button>
													<Button
														variant='outlined'
														startIcon={<Lock />}
													>
														خصوصية الحساب
													</Button>
													<Button
														variant='outlined'
														startIcon={<Email />}
													>
														إشعارات البريد
													</Button>
												</Stack>
											</Card>
										</Grid>
										<Grid size={{xs: 12, md: 6}}>
											<Card
												variant='outlined'
												sx={{p: 2, borderRadius: 2}}
											>
												<Typography variant='h6' gutterBottom>
													معلومات الدفع
												</Typography>
												<Stack spacing={2}>
													<Button
														variant='outlined'
														startIcon={<ShoppingCart />}
													>
														البطاقات المصرفية
													</Button>
													<Button
														variant='outlined'
														startIcon={<HistoryIcon />}
													>
														سجل الدفع
													</Button>
													<Button
														variant='outlined'
														startIcon={<Settings />}
													>
														إعدادات الدفع
													</Button>
												</Stack>
											</Card>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						)}

						{/* Edit User Data Section */}
						<Box ref={detailsRef} sx={{mt: 4}}>
							<EditUserData userId={id || decodedToken._id} />
						</Box>

						{/* Delete Account Section */}
						<Box sx={{mt: 4}}>
							<DeleteAccountBox onDelete={handleDeleteAccount} />
						</Box>
					</Container>
				</motion.div>
			</Box>
		</>
	);
};

export default Profile;
