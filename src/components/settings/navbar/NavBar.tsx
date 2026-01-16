import {FunctionComponent, memo, useCallback, useEffect, useState} from "react";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {path} from "../../../routes/routes";
import {useUser} from "../../../context/useUSer";
import useToken from "../../../hooks/useToken";
import {fontAwesomeIcon} from "../../../FontAwesome/Icons";
import AccountMenu from "../../../atoms/userManage/AccountMenu";
import {AppBar, Box, Button, Toolbar, Tooltip, Typography} from "@mui/material";
import RoleType from "../../../interfaces/UserType";
import {navbarCategoryLinks} from "./navCategoryies";
import {emptyAuthValues} from "../../../interfaces/authValues";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useTranslation} from "react-i18next";
import socket from "../../../socket/globalSocket";
import {patchUserStatus} from "../../../services/usersServices";
import ChipNavigation from "../../../atoms/productsManage/ChepNavigation";
import {useTheme, useMediaQuery} from "@mui/material";
import MegaMenu from "./NavItem";

interface NavBarProps {}
/**
 *  nav bar
 * @returns nav bar
 */
const NavBar: FunctionComponent<NavBarProps> = () => {
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
			<ChipNavigation />
			<AppBar
				aria-label='القائمة الرئيسية'
				position='relative'
				className='navbar-glass m-auto z-2'
				role='navigation'
				sx={{
					width: "95%",
					background: "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
				}}
			>
				<Toolbar
					aria-label='القائمة الرئيسية'
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: {xs: "wrap", sm: "nowrap"},
						mx: 1,
					}}
				>
					{auth?.role != RoleType.Delivery && (
						<Tooltip title='الصفحة الرئيسية - صفقه' arrow>
							<li className='nav-item mx-3'>
								<NavLink
									className={` ${isActive(path.Home) ? "text-danger" : "text-light"}`}
									aria-current='page'
									to={path.Home}
									aria-label='الصفحة الرئيسية - صفقه'
								>
									{fontAwesomeIcon.home}
									<span className='visually-hidden'>
										الصفحة الرئيسية
									</span>
								</NavLink>
							</li>
						</Tooltip>
					)}
					{auth && isAdmin && (
						<Tooltip title='ניהול משתמשים' arrow>
							<li className='nav-item'>
								<NavLink
									className={`${
										isActive(path.UsersManagement)
											? "text-danger "
											: ""
									} nav-link`}
									aria-current='page'
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
							categories={navbarCategoryLinks}
						/>
					</Box>

					<li className='nav-item' role='none'>
						<NavLink
							className={`${
								isActive(path.About) ? "text-danger fw-bold" : ""
							} nav-link`}
							aria-current={isActive(path.About) ? "page" : undefined}
							to={path.About}
							aria-label='من نحن - معلومات عن سوق السخنيني'
						>
							{t("links.about")}
						</NavLink>
					</li>
					<li className='nav-item' role='none'>
						<NavLink
							className={`${
								isActive(path.Contact) ? "text-danger " : ""
							} nav-link`}
							aria-current={isActive(path.Contact) ? "page" : undefined}
							to={path.Contact}
							aria-label='اتصل بنا - خدمة عملاء سوق السخنيني'
						>
							{t("links.contact")}
						</NavLink>
					</li>
					{isLoggedIn && auth?.role !== "delivery" && (
						<li className='nav-item' role='none'>
							<NavLink
								className={`${
									isActive(path.Receipt) ? "text-danger" : ""
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
								aria-label='تسجيل الدخول إلى حسابك في سوق السخنيني'
							>
								تسجيل الدخول
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
			</AppBar>
		</>
	);
};

export default memo(NavBar);
