import {
	Box,
	Typography,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Divider,
	FormControlLabel,
	PaletteMode,
	useTheme,
	Badge,
	Button,
} from "@mui/material";
import {
	Brightness4,
	Brightness7,
	ExpandMore,
	ExpandLess,
	Close as CloseIcon,
	Category as CategoryIcon,
	Home as HomeIcon,
	Favorite as FavoriteIcon,
	Info as InfoIcon,
	ContactMail as ContactIcon,
	List as ListIcon,
	Help as HelpIcon,
	Dashboard as DashboardIcon,
} from "@mui/icons-material";
import {FunctionComponent, SyntheticEvent} from "react";
import {Collapse, FormGroup} from "react-bootstrap";
import {NavLink, useNavigate} from "react-router-dom";
import {productsAndCategories, NavCategory} from "../navCategoryies";
import LanguageSwitcher from "../../../locales/languageSwich";
import {path} from "../../../routes/routes";
import AccountMenu from "../../../atoms/userManage/AccountMenu";
import {GradientSwitch} from "./GradientSwitch";
import {useTranslation} from "react-i18next";
import {AuthValues} from "../../../interfaces/authValues";

interface MobileDrawerProps {
	mode: PaletteMode;
	setMobileOpen: (value: boolean) => void;
	expandedMobileMenu: string | false;
	setExpandedMobileMenu: (value: string | false) => void;
	isLoggedIn: boolean;
	handleDrawerToggle: () => void;
	auth: AuthValues;
	isAdmin: boolean;
	handleThemeChange: (event: SyntheticEvent<Element, Event>, checked: boolean) => void;
	logout: () => void;
}

const MobileDrawer: FunctionComponent<MobileDrawerProps> = ({
	mode,
	isLoggedIn,
	setMobileOpen,
	expandedMobileMenu = false,
	setExpandedMobileMenu,
	handleDrawerToggle,
	isAdmin,
	auth,
	handleThemeChange,
	logout,
}) => {
	const {t} = useTranslation();
	const theme = useTheme();
	const navigate = useNavigate();
	const handleMobileMenuToggle = (menu: string) => {
		setExpandedMobileMenu(expandedMobileMenu === menu ? false : menu);
	};

	const handleNavLinkClick = () => {
		setMobileOpen(false);
		setExpandedMobileMenu(false);
	};

	return (
		<Box
			sx={{
				width: {xs: "100%", sm: 320},
				height: "100%",
				background:
					mode === "dark"
						? "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
						: theme.palette.background.paper,
				color: mode === "dark" ? "#e2e8f0" : "#4a5568",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Drawer header with close button */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					p: 2,
					borderBottom: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
				}}
			>
				<Typography variant='h6' sx={{fontWeight: 700}}>
					{t("navigation.menu") || "القائمة الرئيسية"}
				</Typography>
				<IconButton
					onClick={handleDrawerToggle}
					aria-label='إغلاق القائمة'
					sx={{color: mode === "dark" ? "#e2e8f0" : "#4a5568"}}
				>
					<CloseIcon />
				</IconButton>
			</Box>

			{/* Scrollable content */}
			<Box sx={{flexGrow: 1, overflowY: "auto", p: 2}}>
				<List component='nav' aria-label='القائمة الرئيسية' sx={{pt: 0}}>
					{/* Home */}
					<ListItem disablePadding sx={{mb: 1}}>
						<ListItemButton
							component={NavLink}
							to={path.Home}
							onClick={handleNavLinkClick}
							sx={{
								borderRadius: "8px",
								"&.active": {
									backgroundColor: "rgba(220, 53, 69, 0.1)",
									color: "#dc3545",
									fontWeight: "bold",
								},
							}}
						>
							<HomeIcon sx={{ml: 1}} />
							<ListItemText
								primary='الرئيسية'
								primaryTypographyProps={{
									sx: {fontWeight: 500},
									"aria-label": "الصفحة الرئيسية - موقع صفقة",
								}}
							/>
						</ListItemButton>
					</ListItem>

					{/* Favorites */}
					<ListItem disablePadding sx={{mb: 1}}>
						<ListItemButton
							component={NavLink}
							to={path.Favorite}
							onClick={handleNavLinkClick}
							sx={{
								borderRadius: "8px",
								"&.active": {
									backgroundColor: "rgba(220, 53, 69, 0.1)",
									color: "#dc3545",
									fontWeight: "bold",
								},
							}}
						>
							<FavoriteIcon sx={{ml: 1}} />
							<ListItemText
								primary={t("favorites") || "المفضلة"}
								primaryTypographyProps={{
									sx: {fontWeight: 500},
									"aria-label": "المفضلة - موقع صفقة",
								}}
							/>
						</ListItemButton>
					</ListItem>

					{/* Products with categories - IMPLEMENTED */}
					<ListItem disablePadding sx={{mb: 1}}>
						<ListItemButton
							onClick={() => handleMobileMenuToggle("products")}
							aria-expanded={expandedMobileMenu === "products"}
							aria-label='المنتجات والتصنيفات'
							sx={{borderRadius: "8px"}}
						>
							<CategoryIcon sx={{ml: 1}} />
							<ListItemText
								primary={t("links.products") || "المنتجات"}
								primaryTypographyProps={{sx: {fontWeight: 500}}}
							/>
							{expandedMobileMenu === "products" ? (
								<ExpandLess />
							) : (
								<ExpandMore />
							)}
						</ListItemButton>
					</ListItem>

					<Collapse
						in={expandedMobileMenu === "products"}
						// timeout='auto'
						unmountOnExit
					>
						<List component='div' disablePadding>
							{/* View all products */}
							<ListItemButton
								component={NavLink}
								to='/products'
								onClick={handleNavLinkClick}
								sx={{
									pl: 4,
									borderRadius: "8px",
									mb: 0.5,
									"&.active": {
										backgroundColor: "rgba(220, 53, 69, 0.05)",
										color: "#dc3545",
									},
								}}
							>
								<ListItemText
									primary='جميع المنتجات'
									primaryTypographyProps={{fontSize: "0.95rem"}}
								/>
							</ListItemButton>

							{/* Categories from productsAndCategories */}
							{productsAndCategories &&
								productsAndCategories.map((category: NavCategory) => (
									<ListItemButton
										key={category.value}
										component={NavLink}
										to={`/category/${category.path}`}
										onClick={handleNavLinkClick}
										sx={{
											pl: 4,
											borderRadius: "8px",
											mb: 0.5,
											"&.active": {
												backgroundColor:
													"rgba(220, 53, 69, 0.05)",
												color: "#dc3545",
											},
										}}
									>
										<Box sx={{mr: 1, fontSize: "1.2rem"}}>
											{category.labelKey}
										</Box>
										<ListItemText
											primary={category.labelKey}
											secondary={category.labelKey}
											primaryTypographyProps={{fontSize: "0.95rem"}}
											secondaryTypographyProps={{
												fontSize: "0.8rem",
												color: "text.secondary",
											}}
										/>
										{category.subCategories.length && (
											<Badge
												badgeContent={
													category.subCategories.length ?? 0
												}
												color='primary'
												sx={{ml: 1}}
											/>
										)}
									</ListItemButton>
								))}
						</List>
					</Collapse>

					{/* About */}
					<ListItem disablePadding sx={{mb: 1}}>
						<ListItemButton
							component={NavLink}
							to={path.About}
							onClick={handleNavLinkClick}
							sx={{
								borderRadius: "8px",
								"&.active": {
									backgroundColor: "rgba(220, 53, 69, 0.1)",
									color: "#dc3545",
									fontWeight: "bold",
								},
							}}
						>
							<InfoIcon sx={{ml: 1}} />
							<ListItemText
								primary={t("links.about")}
								primaryTypographyProps={{
									sx: {fontWeight: 500},
									"aria-label": "من نحن - معلومات عن موقع صفقة",
								}}
							/>
						</ListItemButton>
					</ListItem>

					{/* Contact */}
					<ListItem disablePadding sx={{mb: 1}}>
						<ListItemButton
							component={NavLink}
							to={path.Contact}
							onClick={handleNavLinkClick}
							sx={{
								borderRadius: "8px",
								"&.active": {
									backgroundColor: "rgba(220, 53, 69, 0.1)",
									color: "#dc3545",
									fontWeight: "bold",
								},
							}}
						>
							<ContactIcon sx={{ml: 1}} />
							<ListItemText
								primary={t("links.contact")}
								primaryTypographyProps={{
									sx: {fontWeight: 500},
									"aria-label": "اتصل بنا - خدمة عملاء موقع صفقة",
								}}
							/>
						</ListItemButton>
					</ListItem>

					{/* My Listings - only if logged in */}
					{isLoggedIn && (
						<ListItem disablePadding sx={{mb: 1}}>
							<ListItemButton
								component={NavLink}
								to={`${path.myCustomerProfile}/${auth.slug}`}
								onClick={handleNavLinkClick}
								sx={{
									borderRadius: "8px",
									"&.active": {
										backgroundColor: "rgba(220, 53, 69, 0.1)",
										color: "#dc3545",
										fontWeight: "bold",
									},
								}}
							>
								<ListIcon sx={{ml: 1}} />
								<ListItemText
									primary={t("footer.myListings")}
									primaryTypographyProps={{
										sx: {fontWeight: 500},
										"aria-label":
											"صفحة إعلاناتي - إعلاناتي موقع صفقة",
									}}
								/>
							</ListItemButton>
						</ListItem>
					)}

					{/* Help */}
					<ListItem disablePadding sx={{mb: 1}}>
						<ListItemButton
							component={NavLink}
							to={path.SellingHelp}
							onClick={handleNavLinkClick}
							sx={{
								borderRadius: "8px",
								"&.active": {
									backgroundColor: "rgba(220, 53, 69, 0.1)",
									color: "#dc3545",
									fontWeight: "bold",
								},
							}}
						>
							<HelpIcon sx={{ml: 1}} />
							<ListItemText
								primary={t("help")}
								primaryTypographyProps={{
									sx: {fontWeight: 500},
									"aria-label": "صفحة مساعدة - مساعدة موقع صفقة",
								}}
							/>
						</ListItemButton>
					</ListItem>

					{/* Admin Panel - only if admin */}
					{isAdmin && (
						<>
							<Divider sx={{my: 2}} />
							<ListItem disablePadding sx={{mb: 1}}>
								<ListItemButton
									component={NavLink}
									to={path.UsersManagement}
									onClick={handleNavLinkClick}
									sx={{
										borderRadius: "8px",
										backgroundColor:
											mode === "dark"
												? "rgba(144, 202, 249, 0.1)"
												: "rgba(33, 150, 243, 0.1)",
										"&.active": {
											backgroundColor: "rgba(33, 150, 243, 0.2)",
											color: "#2196f3",
											fontWeight: "bold",
										},
									}}
								>
									<DashboardIcon sx={{ml: 1, color: "#2196f3"}} />
									<ListItemText
										primary={t("users-management") || "لوحة التحكم"}
										primaryTypographyProps={{
											sx: {
												fontWeight: 600,
												color: "#2196f3",
											},
											"aria-label": "لوحة تحكم الإدارة",
										}}
									/>
								</ListItemButton>
							</ListItem>
						</>
					)}
				</List>
			</Box>

			{/* Footer with theme and language */}
			<Box
				sx={{
					p: 2,
					borderTop: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
					backgroundColor:
						mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)",
				}}
			>
				{/* Theme toggle */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						mb: 2,
					}}
				>
					<Box sx={{display: "flex", alignItems: "center", gap: 1}}>
						{mode === "dark" ? (
							<Brightness4 sx={{color: "#ffffff"}} />
						) : (
							<Brightness7 sx={{color: "#ffd000"}} />
						)}
						<Typography variant='body2'>
							{mode === "dark" ? "الوضع الليلي" : "الوضع النهاري"}
						</Typography>
					</Box>
					<FormGroup>
						<FormControlLabel
							checked={mode === "dark"}
							onChange={handleThemeChange}
							control={<GradientSwitch sx={{m: 0}} />}
							label=''
							aria-label='تبديل وضع السمة'
						/>
					</FormGroup>
				</Box>

				{/* Language switcher */}
				<Box sx={{mb: 2}}>
					<Typography variant='body2' sx={{mb: 1, fontWeight: 500}}>
						{t("language") || "اللغة"}
					</Typography>
					<LanguageSwitcher />
				</Box>

				{/* Login/Logout button */}
				<Box sx={{mt: 2}}>
					{!isLoggedIn ? (
						<Button
							fullWidth
							variant='contained'
							color='primary'
							onClick={() => {
								navigate(path.Login);
								handleNavLinkClick();
							}}
							sx={{
								borderRadius: "30px",
								fontWeight: "bold",
								backgroundColor: "#4FC3F7",
								color: "#1A1E22",
								"&:hover": {
									backgroundColor: "#81D4FA",
								},
							}}
							aria-label='تسجيل الدخول إلى حسابك في موقع صفقة'
						>
							{t("links.login")}
						</Button>
					) : (
						<AccountMenu
							logout={logout}
							// mobileView
							// handleNavClick={handleNavLinkClick}
						/>
					)}
				</Box>

				{/* Copyright */}
				<Typography
					variant='caption'
					sx={{
						display: "block",
						textAlign: "center",
						mt: 2,
						color: "text.secondary",
					}}
				>
					© {new Date().getFullYear()} صفقة. جميع الحقوق محفوظة.
				</Typography>
			</Box>
		</Box>
	);
};
export default MobileDrawer;
