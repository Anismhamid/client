import {FunctionComponent, useCallback, useEffect, useState} from "react";
import {
	FormControlLabel,
	PaletteMode,
	FormGroup,
	Box,
	Typography,
	Tooltip,
	useMediaQuery,
	Toolbar,
	Button,
	Container,
	IconButton,
	Drawer,
	useTheme,
	AppBar,
} from "@mui/material";
import {styled} from "@mui/material/styles";
import LanguageSwitcher from "../../../locales/languageSwich";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import handleRTL from "../../../locales/handleRTL";
import {
	Brightness4,
	Brightness7,
	Menu as MenuIcon,
	Category as CategoryIcon,
	Home as HomeIcon,
	Favorite as FavoriteIcon,
	Info as InfoIcon,
	ContactMail as ContactIcon,
	List as ListIcon,
	Help as HelpIcon,
	Dashboard as DashboardIcon,
	ChatBubble,
} from "@mui/icons-material";
import {motion, AnimatePresence} from "framer-motion";
import {path} from "../../../routes/routes";
import {emptyAuthValues} from "../../../interfaces/authValues";
import socket from "../../../socket/globalSocket";
import {patchUserStatus} from "../../../services/usersServices";
import RoleType from "../../../interfaces/UserType";
import {useTranslation} from "react-i18next";
import useToken from "../../../hooks/useToken";
import MegaMenu from "../NavItem";
import AccountMenu from "../../../atoms/userManage/AccountMenu";
import {useUser} from "../../../context/useUSer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {productsAndCategories} from "../navCategoryies";
import JsonLd from "../../../../utils/JsonLd";
import {GradientSwitch} from "./GradientSwitch";
import MobileDrawer from "./MobileDrawer";

interface ThemeProps {
	mode: PaletteMode;
	setMode: (mode: PaletteMode) => void;
}

// Custom Logo with animation
const LogoText = styled(Typography)(
	({theme}) => `
  font-weight: 800;
  font-size: ${theme.breakpoints.up("xs") ? "1.4rem" : "1.6rem"};
  font-family: 'Tajawal', 'Cairo', sans-serif;
  background: ${
		theme.palette.mode === "dark"
			? "linear-gradient(45deg, #ffffff 0%, #90caf9 100%)"
			: "linear-gradient(45deg, #1a237e 0%, #283593 100%)"
  };
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(53, 124, 255, 0.3);
  position: relative;
  padding: ${theme.breakpoints.down("sm") ? "2px 10px" : "4px 20px"};
  border-radius: 12px;
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px;
    padding: 2px;
    background: ${
		theme.palette.mode === "dark"
			? "linear-gradient(45deg, #FF6B35, #537bff)"
			: "linear-gradient(45deg, #FF6B35, #1a237e)"
	};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
  }
`,
);

// Styled NavLink for better SEO and accessibility
const StyledNavLink = styled(NavLink)(({theme}) => ({
	textDecoration: "none",
	color: theme.palette.mode === "dark" ? "#e2e8f0" : "#4a5568",
	padding: "8px 16px",
	borderRadius: "8px",
	transition: "all 0.3s ease",
	display: "flex",
	alignItems: "center",
	gap: "8px",
	"&:hover": {
		backgroundColor:
			theme.palette.mode === "dark"
				? "rgba(255, 255, 255, 0.1)"
				: "rgba(0, 0, 0, 0.04)",
		transform: "translateY(-2px)",
	},
	"&.active": {
		color: "#dc3545",
		fontWeight: "bold",
		backgroundColor:
			theme.palette.mode === "dark"
				? "rgba(220, 53, 69, 0.1)"
				: "rgba(220, 53, 69, 0.05)",
		boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)",
	},
}));

const Theme: FunctionComponent<ThemeProps> = ({mode, setMode}) => {
	const handleThemeChange = (
		_: React.SyntheticEvent<Element, Event>,
		checked: boolean,
	) => {
		const newMode: PaletteMode = checked ? "dark" : "light";
		setMode(newMode);
		localStorage.setItem("theme", newMode);
	};

	const dir = handleRTL();

	const {decodedToken, setAfterDecode} = useToken();
	const {auth, setAuth, isLoggedIn, setIsLoggedIn} = useUser();
	const [megaAnchor, setMegaAnchor] = useState<HTMLElement | null>(null);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | false>(false);

	const openMega = Boolean(megaAnchor);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const {t} = useTranslation();

	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token && decodedToken) {
			setAuth(decodedToken);
			setIsLoggedIn(true);
		}
	}, [decodedToken]);

	const isAdmin = auth?.role === RoleType.Admin;

	const {pathname} = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	const logout = useCallback(() => {
		if (socket.connected && auth._id) {
			socket.disconnect();
			patchUserStatus(auth._id, false).catch((error) => {
				console.error(error);
			});
		}
		localStorage.removeItem("token");
		setAuth(emptyAuthValues);
		setIsLoggedIn(false);
		setAfterDecode(null);
		navigate(path.Home);
		setMobileOpen(false);
	}, [auth?._id]);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<>
			{/* Structured data for SEO */}
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "WebSite",
					name: "صفقة",
					alternateName: "صفقة - موقع البيع والشراء",
					url: window.location.origin,
					description: "أكبر موقع عربي للبيع والشراء عبر الإنترنت",
					inLanguage: "ar",
					potentialAction: {
						"@type": "SearchAction",
						target: `${window.location.origin}/search?q={search_term_string}`,
						"query-input": "required name=search_term_string",
					},
					publisher: {
						"@type": "Organization",
						name: "صفقة",
						logo: `${window.location.origin}/logo.png`,
					},
				}}
			/>

			<AppBar
				component='header'
				position='relative'
				dir={dir}
				sx={{
					background:
						mode === "dark"
							? "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
							: theme.palette.background.paper,
					boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
					zIndex: 1100, // Increased for better layering
					overflow: "hidden",
					top: 0,
				}}
				aria-label='رأس الصفحة'
				title='رأس الصفحة'
			>
				<Container maxWidth='xl' sx={{px: {xs: 1, sm: 0, md: 0}}}>
					<Toolbar
						component='nav'
						aria-label='القائمة الرئيسية'
						title='القائمة الرئيسية'
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							p: 0,
							minHeight: {xs: "64px", md: "72px"},
							flexWrap: "nowrap",
						}}
					>
						{/* Left side: Mobile menu button and Logo */}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								minWidth: 0,
								flexShrink: 1,
							}}
						>
							{/* Mobile menu button */}
							<IconButton
								color='inherit'
								aria-label='فتح القائمة'
								title='فتح القائمة'
								onClick={handleDrawerToggle}
								sx={{
									display: {xs: "flex", md: "none"},
									color: mode === "dark" ? "#e2e8f0" : "#4a5568",
									flexShrink: 0,
								}}
							>
								<MenuIcon />
							</IconButton>

							{/* Logo */}
							<motion.div
								whileHover={{scale: 1.05}}
								whileTap={{scale: 0.95}}
							>
								<Link
									to={path.Home}
									style={{textDecoration: "none"}}
									aria-label='الرئيسية - موقع صفقة'
									title='الرئيسية - موقع صفقة'
									onClick={() => {
										// Close mega menu if open
										setMegaAnchor(null);
									}}
								>
									<LogoText variant='h1'>{t("webPageName")}</LogoText>
								</Link>
							</motion.div>

							{/* Desktop Navigation */}
							<Box
								component='ul'
								sx={{
									display: {xs: "none", md: "flex"},
									listStyle: "none",
									m: 0,
									p: 0,
									alignItems: "center",
									gap: 0.5,
									minWidth: 0,
									flexShrink: 1,
									flexWrap: "nowrap",
									overflowX: "auto",
									"&::-webkit-scrollbar": {display: "none"}, // إخفاء شريط التمرير
									scrollbarWidth: "none",
								}}
								aria-label='روابط التنقل الرئيسية'
								title='روابط التنقل الرئيسية'
							>
								{/* Home */}
								<Box component='li' role='listitem' sx={{flexShrink: 0}}>
									<StyledNavLink
										to={path.Home}
										aria-label={`${t("home")} - صفقة`}
										title={`${t("home")} - صفقة`}
									>
										<HomeIcon sx={{fontSize: 20}} />
									</StyledNavLink>
								</Box>

								{/* Favorites */}
								<Box component='li' role='listitem' sx={{flexShrink: 0}}>
									<StyledNavLink
										to={path.Favorite}
										aria-label={t("favorites") || "المفضلة"}
										title={t("favorites") || "المفضلة"}
									>
										<FavoriteIcon sx={{fontSize: 20}} />
									</StyledNavLink>
								</Box>

								{/* Products with mega menu */}
								<Box
									component='li'
									role='listitem'
									sx={{flexShrink: 0}}
									onMouseEnter={
										!isMobile
											? (e) => setMegaAnchor(e.currentTarget)
											: undefined
									}
									onMouseLeave={
										!isMobile ? () => setMegaAnchor(null) : undefined
									}
									onClick={
										isMobile
											? (e) => setMegaAnchor(e.currentTarget)
											: undefined
									}
									// sx={{cursor: "pointer", position: "relative"}}
									aria-haspopup='true'
									aria-expanded={openMega ? "true" : "false"}
								>
									<StyledNavLink
										to='#'
										onClick={(e) => {
											e.preventDefault();
											if (isMobile) setMegaAnchor(e.currentTarget);
										}}
										aria-label='المنتجات والتصنيفات'
										title={t("links.products")}
									>
										<CategoryIcon sx={{fontSize: 20}} />

										<KeyboardArrowDownIcon
											sx={{
												transition: "transform 0.3s",
												transform: openMega
													? "rotate(180deg)"
													: "rotate(0deg)",
											}}
										/>
									</StyledNavLink>

									<MegaMenu
										anchorEl={megaAnchor}
										open={openMega}
										onClose={() => setMegaAnchor(null)}
										categories={productsAndCategories}
									/>
								</Box>

								{/* About */}
								<Box component='li' role='listitem' sx={{flexShrink: 0}}>
									<StyledNavLink
										to={path.About}
										aria-label={`${t("links.about")} معلومات عن موقع صفقة`}
										title={`${t("links.about")} معلومات عن موقع صفقة`}
									>
										<InfoIcon sx={{fontSize: 20}} />
									</StyledNavLink>
								</Box>

								{/* Messages */}
								<Box component='li' role='listitem' sx={{flexShrink: 0}}>
									<StyledNavLink
										to={path.MessagesPage}
										aria-label={`${t("links.about")} معلومات عن موقع صفقة`}
										title={`${t("links.Messages")} معلومات عن موقع صفقة`}
									>
										<ChatBubble sx={{fontSize: 20}} />
									</StyledNavLink>
								</Box>

								{/* Contact */}
								<Box component='li' role='listitem' sx={{flexShrink: 0}}>
									<StyledNavLink
										to={path.Contact}
										aria-label={`${t("links.contact")} خدمة عملاء موقع صفقة`}
										title={`${t("links.contact")} خدمة عملاء موقع صفقة`}
									>
										<ContactIcon sx={{fontSize: 18}} />
										<Typography component='span'></Typography>
									</StyledNavLink>
								</Box>

								{/* My Listings - only if logged in */}
								{isLoggedIn && (
									<Box component='li' role='listitem'>
										<StyledNavLink
											to={`${path.CustomerProfile.replace(":slug", "")}/${auth?.slug}`}
											aria-label={`${t("footer.myListings")}`}
											title={`${t("footer.myListings")}`}
										>
											<ListIcon sx={{fontSize: 20}} />
										</StyledNavLink>
									</Box>
								)}

								{/* Help */}
								<Box component='li' role='listitem'>
									<StyledNavLink
										to={path.SellingHelp}
										// aria-label='صفحة مساعدة - '
										aria-label={`${t("help")} مساعدة موقع صفقة`}
									>
										<HelpIcon sx={{fontSize: 20}} />
									</StyledNavLink>
								</Box>

								{/* Admin Panel - only if admin */}
								{isAdmin && (
									<Box component='li' role='listitem'>
										<StyledNavLink
											to={path.UsersManagement}
											aria-label={`${t("users-management")} ادارة المستخدمين موقع صفقة`}
											title={`${t("users-management")} ادارة المستخدمين موقع صفقة`}
											sx={{
												backgroundColor:
													mode === "dark"
														? "rgba(144, 202, 249, 0.1)"
														: "rgba(33, 150, 243, 0.1)",
												"&:hover": {
													backgroundColor:
														mode === "dark"
															? "rgba(144, 202, 249, 0.2)"
															: "rgba(33, 150, 243, 0.2)",
												},
											}}
										>
											<DashboardIcon
												sx={{fontSize: 20, color: "#2196f3"}}
											/>
										</StyledNavLink>
									</Box>
								)}
							</Box>
						</Box>

						{/* Left side: Theme toggle, language switcher, and account */}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: {xs: 1, sm: 2},
								flexWrap: "nowrap",
							}}
						>
							{/* Theme Toggle */}
							<Tooltip
								title={mode === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
							>
								<motion.div
									whileHover={{scale: 1.1}}
									whileTap={{scale: 0.95}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
										}}
									>
										<FormGroup>
											<FormControlLabel
												checked={mode === "dark"}
												onChange={handleThemeChange}
												control={<GradientSwitch sx={{m: 0}} />}
												label=''
												aria-label='تبديل وضع السمة'
											/>
										</FormGroup>

										<AnimatePresence mode='wait'>
											<motion.div
												key={mode}
												initial={{opacity: 0, scale: 0.8}}
												animate={{opacity: 1, scale: 1}}
												exit={{opacity: 0, scale: 0.8}}
												transition={{duration: 0.3}}
											>
												{mode === "dark" ? (
													<Brightness4
														sx={{
															color: "#ffffff",
															fontSize: {xs: 24, md: 28},
															display: {
																xs: "none",
																sm: "block",
															},
														}}
													/>
												) : (
													<Brightness7
														sx={{
															color: "#ffd000",
															fontSize: {xs: 24, md: 28},
															display: {
																xs: "none",
																sm: "block",
															},
														}}
													/>
												)}
											</motion.div>
										</AnimatePresence>
									</Box>
								</motion.div>
							</Tooltip>

							{/* Language Switcher */}
							<motion.div
								whileHover={{scale: 1.05}}
								whileTap={{scale: 0.95}}
							>
								<LanguageSwitcher />
							</motion.div>

							{/* Account Menu / Login Button - Desktop only */}
							<Box sx={{display: {xs: "none", md: "block"}}}>
								{!isLoggedIn ? (
									<Button
										variant='contained'
										color='primary'
										onClick={() => navigate(path.Login)}
										sx={{
											borderRadius: "30px",
											fontWeight: "bold",
											backgroundColor: "#4FC3F7",
											color: "#1A1E22",
											px: 3,
											"&:hover": {
												backgroundColor: "#81D4FA",
											},
										}}
										aria-label='تسجيل الدخول إلى حسابك في موقع صفقة'
									>
										{t("links.login")}
									</Button>
								) : (
									<AccountMenu logout={logout} />
								)}
							</Box>

							{/* Mobile account icon */}
							{isLoggedIn && (
								<Box sx={{display: {xs: "block", md: "none"}}}>
									<AccountMenu
										logout={logout}
										// mobileView
										// handleNavClick={handleDrawerToggle}
									/>
								</Box>
							)}
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			{/* Mobile Drawer */}
			<Drawer
				variant='temporary'
				anchor={dir === "rtl" ? "right" : "left"}
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better mobile performance
				}}
				sx={{
					display: {xs: "block", md: "none"},
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: {xs: "100%", sm: 320},
						border: "none",
						zIndex: 1200, // Higher than header
					},
				}}
			>
				<MobileDrawer
					expandedMobileMenu={expandedMobileMenu}
					setExpandedMobileMenu={setExpandedMobileMenu}
					auth={auth}
					handleDrawerToggle={handleDrawerToggle}
					handleThemeChange={handleThemeChange}
					isAdmin={isAdmin}
					isLoggedIn={isLoggedIn}
					logout={logout}
					setMobileOpen={setMobileOpen}
					mode={mode}
				/>
			</Drawer>

			{/* Backdrop for drawer */}
			{mobileOpen && (
				<Box
					sx={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0,0,0,0.5)",
						zIndex: 1199,
						display: {xs: "block", md: "none"},
					}}
					onClick={handleDrawerToggle}
				/>
			)}
		</>
	);
};

export default Theme;
