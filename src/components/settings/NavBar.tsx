import {FunctionComponent, memo, useEffect, useState} from "react";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";
import {useUser} from "../../context/useUSer";
import useToken from "../../hooks/useToken";
import {fontAwesomeIcon} from "../../FontAwesome/Icons";
import AccountMenu from "../../atoms/userMenu/AccountMenu";
import {
	AppBar,
	Badge,
	Box,
	Button,
	Menu,
	MenuItem,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import RoleType from "../../interfaces/UserType";
import {navbarCategoryLinks} from "../../helpers/navCategoryies";
import {emptyAuthValues} from "../../interfaces/authValues";
import {useCartItems} from "../../context/useCart";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useTranslation} from "react-i18next";

interface NavBarProps {}
/**
 *  nav bar
 * @returns nav bar
 */
const NavBar: FunctionComponent<NavBarProps> = () => {
	const location = useLocation();
	const {decodedToken, setAfterDecode} = useToken();
	const {auth, setAuth, isLoggedIn, setIsLoggedIn} = useUser();
	const {quantity, setQuantity} = useCartItems();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const openMenu = Boolean(anchorEl);

	const navigate = useNavigate();

	const isActive = (path: string) => location.pathname === path;

	const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		const storedQuantity = Number(localStorage.getItem("cartQuantity")) || 0;
		setQuantity(storedQuantity);
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token && decodedToken) {
			setAuth(decodedToken);
			setIsLoggedIn(true);
		}
	}, [decodedToken]);

	const backOneStep = () =>
		window.history.length > 1 ? navigate(-1) : navigate(path.Home);

	const isAdmin = auth?.role === RoleType.Admin;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	const logout = () => {
		localStorage.removeItem("token");
		setAuth(emptyAuthValues);
		setIsLoggedIn(false);
		setAfterDecode(null);
		navigate(path.Home);
	};
	const {t} = useTranslation();
	return (
		<>
			<AppBar position='relative' className='navbar-glass m-auto z-2'>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
						padding: "5px 5px",
					}}
					component='nav'
				>
					<Tooltip title='בית' arrow>
						<li className='nav-item'>
							<NavLink
								className={` ${isActive(path.Home) ? "text-danger" : "text-light"}`}
								aria-current='page'
								to={path.Home}
							>
								{fontAwesomeIcon.home}
							</NavLink>
						</li>
					</Tooltip>
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
						onClick={handleMenuClick}
						sx={{
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							px: 2,
							py: 1,
							fontWeight: 800,
						}}
					>
						<Stack direction='row' alignItems='center' spacing={0.5}>
							<Typography
								sx={{
									fontSize: 16,
								}}
							>
								{t("links.products")}
							</Typography>
							<KeyboardArrowDownIcon
								sx={{
									fontSize: 22,
									transition: "transform 0.3s ease-in-out",
									transform: openMenu
										? "rotate(180deg)"
										: "rotate(0deg)",
								}}
							/>
						</Stack>

						<Menu
							anchorEl={anchorEl}
							open={openMenu}
							onClose={handleMenuClose}
							PaperProps={{
								sx: {
									backgroundColor: "rgba(40, 40, 40, 0.95)",
									borderRadius: 1,
									color: "#fff",
									mt: 2.5,
									minWidth: 200,
								},
							}}
							transformOrigin={{horizontal: "center", vertical: "top"}}
							anchorOrigin={{horizontal: "center", vertical: "bottom"}}
						>
							{/* Category Links */}
							{navbarCategoryLinks.map(({labelKey, path, icon}) => (
								<MenuItem
									key={path}
									component={NavLink}
									to={path}
									onClick={handleMenuClose}
								>
									{icon}
									<span className=' me-2'>{t(labelKey)}</span>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<li className='nav-item'>
						<NavLink
							className={` ${
								isActive(path.AllTheOrders) ? "text-danger fw-bold" : ""
							} nav-link`}
							aria-current='page'
							to={path.AllTheOrders}
						>
							{t("links.orders")}
						</NavLink>
					</li>
					<li className='nav-item'>
						<NavLink
							className={`${
								isActive(path.About) ? "text-danger fw-bold" : ""
							} nav-link`}
							aria-current='page'
							to={path.About}
						>
							{t("links.about")}
						</NavLink>
					</li>
					{isLoggedIn && (
						<li className='nav-item'>
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
					<li className='nav-item'>
						<NavLink
							className={`${
								isActive(path.Contact) ? "text-danger " : ""
							} nav-link`}
							aria-current='page'
							to={path.Contact}
						>
							{t("links.contact")}
						</NavLink>
					</li>
					{auth && isLoggedIn && (
						<Tooltip title='סל קניות' arrow>
							<li className='nav-item ms-1'>
								<Box>
									<Badge
										badgeContent={quantity}
										sx={{
											"& .MuiBadge-badge": {
												backgroundColor: "#4FC3F7",
												color: "#1A1E22",
												fontWeight: "bold",
											},
										}}
									>
										<NavLink
											className={`${
												isActive(path.Cart) ? "text-danger" : ""
											} nav-link fs-5`}
											aria-current='page'
											to={path.Cart}
										>
											{fontAwesomeIcon.cartInoc}
										</NavLink>
									</Badge>
								</Box>
							</li>
						</Tooltip>
					)}
					{!isLoggedIn ? (
						<li>
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
							>
								התחבר
							</Button>
						</li>
					) : (
						isLoggedIn && <AccountMenu logout={logout} />
					)}
				</Box>
			</AppBar>

			{location.pathname !== path.Home && (
				<Box
					onClick={() => backOneStep()}
					className='position-fixed border border-light fw-bold link-success z-3 d-flex align-items-center justify-content-center'
					sx={{
						cursor: "pointer",
						width: "36px",
						height: "35px",
						right: "16px",
						backgroundColor: "#1A1E22",
						borderRadius: "100%",
						top: "30%",
					}}
				>
					<span style={{color: "#66B2FF"}} className='fs-2'>
						{fontAwesomeIcon.backButton}
					</span>
				</Box>
			)}
		</>
	);
};

export default memo(NavBar);
