import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {FunctionComponent, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";
import {Typography, alpha, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import RoleType from "../../interfaces/UserType";
import handleRTL from "../../locales/handleRTL";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailIcon from "@mui/icons-material/Email";
import {useUser} from "../../context/useUSer";

interface AccountMenuProps {
	logout: Function;
}

const AccountMenu: FunctionComponent<AccountMenuProps> = ({logout}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const {auth} = useUser();
	const navigate = useNavigate();
	const {t} = useTranslation();
	const theme = useTheme();
	const direction = handleRTL();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const isAdmin = auth && auth.role === RoleType.Admin;
	const isSiteModerator = auth && auth.role === RoleType.Moderator;

	// Get user initials for avatar
	const getUserInitials = () => {
		if (auth?.name?.first && auth?.name?.last) {
			return `${auth.name.first[0]}.${auth.name.last[0]}`.toUpperCase();
		}
		if (auth?.name?.first) {
			return auth.name.first[0].toUpperCase();
		}
		return "U";
	};

	return (
		<>
			<Box sx={{display: "flex", alignItems: "center"}}>
				<Tooltip title={t("account-management") || "Account Settings"}>
					<IconButton
						onClick={handleClick}
						sx={{
							width: 44,
							height: 44,
							border: `2px solid ${theme.palette.primary.main}`,
							transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
							"&:hover": {
								borderColor: theme.palette.secondary.main,
								transform: "scale(1.05)",
								boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
							},
						}}
					>
						<Avatar
							sx={{
								width: 32,
								height: 32,
								bgcolor: theme.palette.primary.main,
								fontWeight: 600,
								fontSize: "0.9rem",
								boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
							}}
							src={auth?.image?.url || undefined}
						>
							{!auth?.image?.url && getUserInitials()}
						</Avatar>
					</IconButton>
				</Tooltip>
			</Box>
			<Menu
				dir={direction}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				elevation={8}
				PaperProps={{
					elevation: 8,
					sx: {
						overflow: "hidden",
						mt: 1.5,
						borderRadius: 2,
						minWidth: 220,
						boxShadow:
							"0 10px 40px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.05)",
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: direction === "ltr" ? 14 : 180,
							width: 15,
							height: 15,
							bgcolor: "#22AAF4",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
							boxShadow: "-2px -2px 5px rgba(0,0,0,0.05)",
						},
					},
				}}
				transformOrigin={{horizontal: "right", vertical: "top"}}
				anchorOrigin={{horizontal: "right", vertical: "bottom"}}
			>
				{/* User Profile Section */}
				<MenuItem
					sx={{
						py: 1.5,
						gap: 2,
						px: 2,
						cursor: "default",
						"&:hover": {
							bgcolor: "transparent",
						},
					}}
				>
					<Avatar
						sx={{
							width: 40,
							height: 40,
							bgcolor: theme.palette.primary.main,
							fontWeight: 600,
							boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
						}}
						src={auth?.image?.url || undefined}
					>
						{!auth?.image?.url && getUserInitials()}
					</Avatar>
					<Box sx={{ml: 2, overflow: "hidden"}}>
						<Typography
							variant='subtitle1'
							fontWeight={600}
							sx={{
								color: "text.primary",
								lineHeight: 1.2,
							}}
						>
							{auth?.name?.first && auth?.name?.last
								? `${auth.name.first} ${auth.name.last}`
								: auth?.name?.first || "User"}
						</Typography>
						<Typography
							variant='caption'
							sx={{
								color: "text.secondary",
								display: "block",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}
						>
							{auth?.email || ""}
						</Typography>
						{isAdmin && (
							<Typography
								variant='caption'
								sx={{
									color: "primary.main",
									fontWeight: 600,
									bgcolor: alpha(theme.palette.primary.main, 0.1),
									px: 1,
									py: 0.25,
									borderRadius: 1,
									mt: 0.5,
									display: "inline-block",
								}}
							>
								{isAdmin
									? t("accountMenu.admin")
									: isSiteModerator
										? "accountMenu.siteModerator"
										: "Client"}
							</Typography>
						)}
					</Box>
				</MenuItem>

				<Divider sx={{my: 1, borderColor: "divider"}} />

				{/* Profile Link */}
				<MenuItem
					onClick={() => {
						handleClose();
						navigate(path.Profile);
					}}
					sx={{
						py: 1.25,
						px: 2,
						transition: "all 0.2s",
						"&:hover": {
							bgcolor: alpha(theme.palette.primary.main, 0.08),
							transform: "translateX(4px)",
						},
					}}
				>
					<ListItemIcon sx={{minWidth: 40}}>
						<PersonOutlineIcon sx={{fontSize: 20, color: "text.secondary"}} />
					</ListItemIcon>
					<Typography variant='body2' sx={{color: "text.primary"}}>
						{t("accountMenu.profile") || "Profile"}
					</Typography>
				</MenuItem>

				{/* Messages Link */}
				<Link
					to={path.Messages}
					style={{textDecoration: "none", color: "inherit"}}
				>
					<MenuItem
						onClick={handleClose}
						sx={{
							py: 1.25,
							px: 2,
							transition: "all 0.2s",
							"&:hover": {
								bgcolor: alpha(theme.palette.primary.main, 0.08),
								transform: "translateX(4px)",
							},
						}}
					>
						<ListItemIcon sx={{minWidth: 40}}>
							<EmailIcon sx={{fontSize: 20, color: "text.secondary"}} />
						</ListItemIcon>
						<Typography variant='body2' sx={{color: "text.primary"}}>
							{t("accountMenu.messages") || "Messages"}
						</Typography>
					</MenuItem>
				</Link>

				{/* Admin Links */}
				{isAdmin && <Divider sx={{my: 1, borderColor: "divider"}} />}
				<Typography
					variant='caption'
					sx={{
						px: 2,
						pt: 1,
						pb: 0.5,
						color: "text.secondary",
						fontWeight: 600,
						letterSpacing: 0.5,
						textTransform: "uppercase",
					}}
				>
					{isAdmin ? t("accountMenu.admin") : "Client"}
				</Typography>
				{isAdmin && (
					<MenuItem
						onClick={handleClose}
						sx={{
							py: 1.25,
							px: 2,
							transition: "all 0.2s",
							"&:hover": {
								bgcolor: alpha(theme.palette.primary.main, 0.08),
								transform: "translateX(4px)",
							},
						}}
					>
						<Link
							to={path.AdminSettings}
							style={{textDecoration: "none", color: "inherit"}}
						>
							<ListItemIcon sx={{minWidth: 40}}>
								<SettingsIcon
									sx={{fontSize: 20, color: "text.secondary"}}
								/>
							</ListItemIcon>
							<Typography variant='body2' sx={{color: "text.primary"}}>
								{t("accountMenu.settings") || "Settings"}
							</Typography>
						</Link>
					</MenuItem>
				)}
				{isAdmin && (
					<MenuItem
						onClick={handleClose}
						sx={{
							py: 1.25,
							px: 2,
							transition: "all 0.2s",
							"&:hover": {
								bgcolor: alpha(theme.palette.primary.main, 0.08),
								transform: "translateX(4px)",
							},
						}}
					>
						<Link
							to={path.WebSiteAdmins}
							style={{textDecoration: "none", color: "inherit"}}
						>
							<ListItemIcon sx={{minWidth: 40}}>
								<DashboardIcon
									sx={{fontSize: 20, color: "text.secondary"}}
								/>
							</ListItemIcon>
							<Typography variant='body2' sx={{color: "text.primary"}}>
								{t("إحصائيات المتجر") || "Store Statistics"}
							</Typography>
						</Link>
					</MenuItem>
				)}

				{/* Logout */}
				<Divider sx={{my: 1, borderColor: "divider"}} />
				<MenuItem
					onClick={() => {
						handleClose();
						logout();
					}}
					sx={{
						py: 1.25,
						px: 2,
						transition: "all 0.2s",
						"&:hover": {
							bgcolor: alpha(theme.palette.error.main, 0.08),
							transform: "translateX(4px)",
						},
					}}
				>
					<ListItemIcon sx={{minWidth: 40}}>
						<LogoutIcon sx={{fontSize: 20, color: "error.main"}} />
					</ListItemIcon>
					<Typography
						variant='body2'
						sx={{color: "error.main", fontWeight: 600}}
					>
						{t("accountMenu.logout") || "Logout"}
					</Typography>
				</MenuItem>
			</Menu>
		</>
	);
};

export default AccountMenu;
