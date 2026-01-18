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
} from "@mui/material";
import {styled, useTheme} from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import LanguageSwitcher from "../../locales/languageSwich";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import handleRTL from "../../locales/handleRTL";
import {Brightness4, Brightness7} from "@mui/icons-material";
import {motion, AnimatePresence} from "framer-motion";
import {path} from "../../routes/routes";
import {emptyAuthValues} from "../../interfaces/authValues";
import socket from "../../socket/globalSocket";
import {patchUserStatus} from "../../services/usersServices";
import RoleType from "../../interfaces/UserType";
import {useTranslation} from "react-i18next";
import useToken from "../../hooks/useToken";
import {fontAwesomeIcon} from "../../FontAwesome/Icons";
import MegaMenu from "../../components/navbar/NavItem";
import AccountMenu from "../userManage/AccountMenu";
import {useUser} from "../../context/useUSer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {productsAndCategories} from "../../components/navbar/navCategoryies";

interface ThemeProps {
	mode: PaletteMode;
	setMode: (mode: PaletteMode) => void;
}

// Custom Switch with gradient
const GradientSwitch = styled(Switch)(({theme}) => ({
	width: 60,
	height: 30,
	padding: 9,
	"& .MuiSwitch-switchBase": {
		margin: 4,
		padding: 0,
		transform: "translateX(8px)",
		"&.Mui-checked": {
			color: "#fff",
			transform: "translateX(32px)",
			"& .MuiSwitch-thumb": {
				background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
				boxShadow: "1px 1px 3px rgba(33, 150, 243, 0.5)",
			},
			"& + .MuiSwitch-track": {
				opacity: 1,
				backgroundColor: "#2d3748",
				background: "linear-gradient(90deg, #0c2049 0%, #2d3748 100%)",
			},
		},
	},
	"& .MuiSwitch-thumb": {
		backgroundColor: "#2e2e2e",
		width: 20,
		height: 20,
		boxShadow: "1px 3px 3px rgba(0, 0, 0, 0.137)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		"&::before": {
			content: '""',
			position: "absolute",
			width: "100%",
			height: "100%",
			left: 0,
			top: 0,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
		},
	},
	"& .MuiSwitch-track": {
		opacity: 1,
		backgroundColor: "#ffd900",
		borderRadius: 20 / 2,
		transition: theme.transitions.create(["background-color"], {
			duration: 500,
		}),
	},
}));

// Custom Logo with animation
const LogoText = styled(Typography)(() => ({
	fontWeight: "bold",
	fontSize: "1.8rem",
	fontFamily: "'Tajawal', 'Cairo', sans-serif",
	background: "linear-gradient(45deg, #000000 0%, #000000 100%)",
	WebkitBackgroundClip: "text",
	WebkitTextFillColor: "transparent",
	backgroundClip: "text",
	textShadow: "0 2px 10px rgba(53, 124, 255, 0.3)",
	position: "relative",
	padding: "2px 15px",
	borderRadius: "10px",
	"&::after": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderRadius: "10px",
		padding: "2px",
		background: "linear-gradient(45deg, #FF6B35, #537bff)",
		WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
		WebkitMaskComposite: "xor",
		maskComposite: "exclude",
		opacity: 0.5,
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

	const location = useLocation();
	const {decodedToken, setAfterDecode} = useToken();
	const {auth, setAuth, isLoggedIn, setIsLoggedIn} = useUser();
	// const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [megaAnchor, setMegaAnchor] = useState<HTMLElement | null>(null);
	const openMega = Boolean(megaAnchor);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	// const openMenu = Boolean(anchorEl);
	const {t} = useTranslation();

	const navigate = useNavigate();

	const isActive = (path: string) => location.pathname === path;

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
				console.log(error);
			});
		}
		localStorage.removeItem("token");
		setAuth(emptyAuthValues);
		setIsLoggedIn(false);
		setAfterDecode(null);
		navigate(path.Home);
	}, [auth?._id]);

	return (
		<>
			{/* Main Top Bar */}
			<Box
				component={"header"}
				dir={dir}
				sx={{
					zIndex: 1000,
					display: "flex",
					flexWrap: {xs: "wrap", md: "noWrap"},
					alignItems: "center",
					justifyContent: "space-between",
					background:
						mode === "dark"
							? "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
							: "#fcf3f3",
					padding: "10px 20px",
					boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
					position: "relative",
					overflow: "hidden",
					"&::before": {
						content: '""',
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background:
							'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")',
						opacity: 0.1,
					},
				}}
			>
				<Toolbar
					aria-label='القائمة الرئيسية'
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: {xs: "wrap", md: "nowrap"},
					}}
				>
					<Tooltip title='الصفحة الرئيسية - صفقه' arrow>
						<li className='nav-item mx-3'>
							<NavLink
								className={` ${isActive(path.Home) ? "text-danger" : "text-dark"}`}
								aria-current='page'
								to={path.Home}
								aria-label='الصفحة الرئيسية - صفقه'
							>
								{fontAwesomeIcon.home}
								<span className='visually-hidden'>الصفحة الرئيسية</span>
							</NavLink>
						</li>
					</Tooltip>
					<Tooltip title='المفضله - صفقه' arrow>
						<li className='nav-item mx-3'>
							<NavLink
								className={` ${isActive(path.Favorite) ? "text-danger" : "text-dark"}`}
								aria-current='page'
								to={path.Favorite}
								aria-label='المفضله - صفقه'
							>
								{fontAwesomeIcon.Favorite}
							</NavLink>
						</li>
					</Tooltip>

					{auth && isAdmin && (
						<Tooltip title={t("users-management")} arrow>
							<li className='nav-item'>
								<NavLink
									className={`${
										isActive(path.UsersManagement)
											? "text-danger "
											: "text-dark"
									} nav-link`}
									aria-current='page'
									aria-label={t("users-management")}
									to={path.UsersManagement}
								>
									{fontAwesomeIcon.userGear}
								</NavLink>
							</li>
						</Tooltip>
					)}
					<Box
						onMouseEnter={
							!isMobile ? (e) => setMegaAnchor(e.currentTarget) : undefined
						}
						onMouseLeave={!isMobile ? () => setMegaAnchor(null) : undefined}
						onClick={
							isMobile ? (e) => setMegaAnchor(e.currentTarget) : undefined
						}
						sx={{
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							px: 1,
						}}
						aria-haspopup='true'
						aria-expanded={openMega ? "true" : "false"}
					>
						<Typography>{t("links.products")}</Typography>
						<KeyboardArrowDownIcon
							sx={{
								transition: "transform 0.3s",
								transform: openMega ? "rotate(180deg)" : "rotate(0deg)",
							}}
						/>

						<MegaMenu
							anchorEl={megaAnchor}
							open={openMega}
							onClose={() => setMegaAnchor(null)}
							categories={productsAndCategories}
						/>
					</Box>

					<li className='nav-item' role='none'>
						<NavLink
							className={`${
								isActive(path.About) ? "text-danger fw-bold" : "text-dark"
							} nav-link`}
							aria-current={isActive(path.About) ? "page" : undefined}
							to={path.About}
							aria-label='من نحن - معلومات عن موقع صفقه'
						>
							{t("links.about")}
						</NavLink>
					</li>
					<li className='nav-item' role='none'>
						<NavLink
							className={`${
								isActive(path.Contact) ? "text-danger " : "text-dark"
							} nav-link`}
							aria-current={isActive(path.Contact) ? "page" : undefined}
							to={path.Contact}
							aria-label='اتصل بنا - خدمة عملاء موقع صفقه'
						>
							{t("links.contact")}
						</NavLink>
					</li>
					{isLoggedIn && (
						<li className='nav-item' role='none'>
							<NavLink
								className={`${
									isActive(path.Receipt) ? "text-danger" : "text-dark"
								} nav-link`}
								aria-current='page'
								to={path.Receipt}
							>
								{t("links.receipts")}
							</NavLink>
						</li>
					)}

					<li className='nav-item' role='none'>
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
									"&:hover": {
										backgroundColor: "#81D4FA",
									},
								}}
								aria-label='تسجيل الدخول إلى حسابك في موقع صفقه'
							>
								{t("links.login")}
							</Button>
						) : (
							isLoggedIn && <AccountMenu logout={logout} />
						)}
					</li>
					{/* <Link
						target='_blank'
						rel='noopener noreferrer'
						to='https://anismhamid.github.io/shok-habena-server-documentation/'
					>
						<Chip
							variant='outlined'
							sx={{
								fontWeight: "bold",
								boxShadow: 10,
								"&:hover": {
									transform: "scale(1.04)",
								},
								color: "#5B9601",
							}}
							// color='warning'
							label='docs'
						/>
					</Link> */}
				</Toolbar>
				{/* Left Side: Theme Toggle */}
				<Box sx={{display: "flex", alignItems: "center", gap: 2}}>
					<Tooltip title={mode === "dark" ? "الوضع النهاري" : "الوضع الليلي"}>
						<motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.95}}>
							<FormGroup>
								<FormControlLabel
									checked={mode === "dark"}
									onChange={handleThemeChange}
									control={<GradientSwitch sx={{m: 0}} />}
									label=''
								/>
							</FormGroup>
						</motion.div>
					</Tooltip>

					<AnimatePresence mode='wait'>
						<motion.div
							key={mode}
							initial={{opacity: 0, scale: 0.8}}
							animate={{opacity: 1, scale: 1}}
							exit={{opacity: 0, scale: 0.8}}
							transition={{duration: 0.3}}
						>
							{mode === "dark" ? (
								<Brightness4 sx={{color: "#ffffff", fontSize: 28}} />
							) : (
								<Brightness7 sx={{color: "#ffd000", fontSize: 28}} />
							)}
						</motion.div>
					</AnimatePresence>
				</Box>

				{/* Right Side: Language Switcher */}
				<motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
					<LanguageSwitcher />
				</motion.div>
				{/* Logo */}
				<motion.div whileHover={{scale: 1.05}}>
					<Link
						to={path.Home}
						style={{
							textDecoration: "none",
						}}
					>
						<LogoText variant='h1'>صـفـقـه</LogoText>
					</Link>
				</motion.div>
			</Box>
		</>
	);
};

export default Theme;
