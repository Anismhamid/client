import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {fontAwesomeIcon} from "../../FontAwesome/Icons";
import {Fragment, FunctionComponent, useState} from "react";
import {useUser} from "../../context/useUSer";
import {Link, useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";
import {Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import RoleType from "../../interfaces/UserType";

interface AccountMenuProps {
	logout: Function;
}

const AccountMenu: FunctionComponent<AccountMenuProps> = ({logout}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const {auth} = useUser();
	const navigate = useNavigate();
	const {t} = useTranslation();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<Fragment>
			<Box
				dir='rtl'
				sx={{display: "flex", alignItems: "center", textAlign: "center"}}
			>
				<Tooltip title='הגדרות חשבון'>
					<IconButton
						onClick={handleClick}
						sx={{
							width: 44,
							height: 44,
							ml: 1,
							border: "2px solid #4FC3F7",
							transition: "0.3s",
							"&:hover": {
								borderColor: "#81D4FA",
								transform: "scale(1.05)",
							},
						}}
					>
						<Avatar
							className='bg-primary'
							sx={{width: 40, height: 40}}
							children={auth && auth?.name?.last?.[0]}
							src={
								(auth && auth?.image?.url) ||
								"https://media2.giphy.com/media/l0MYO6VesS7Hc1uPm/200.webp?cid=ecf05e47hxvvpx851ogwi8s26zbj1b3lay9lke6lzvo76oyx&ep=v1_gifs_search&rid=200.webp&ct=g"
							}
						/>
					</IconButton>
				</Tooltip>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id='account-menu'
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				slotProps={{
					paper: {
						elevation: 10,
						sx: {
							overflow: "hidden",
							backgroundColor: "#1A1E22",
							color: "#fff",
							mt: 1.5,
							borderRadius: 2,
							minWidth: 180,
							boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
							"& .MuiMenuItem-root": {
								transition: "0.2s",
								"&:hover": {
									backgroundColor: "#263238",
									color: "#4FC3F7",
								},
							},
						},
					},
				}}
				transformOrigin={{horizontal: "right", vertical: "top"}}
				anchorOrigin={{horizontal: "left", vertical: "bottom"}}
			>
				<MenuItem onClick={() => navigate(path.Profile)}>
					<Avatar
						src={
							(auth && auth?.image?.url) ||
							"https://media2.giphy.com/media/l0MYO6VesS7Hc1uPm/200.webp?cid=ecf05e47hxvvpx851ogwi8s26zbj1b3lay9lke6lzvo76oyx&ep=v1_gifs_search&rid=200.webp&ct=g"
						}
					/>
					{t("accountMenu.profile")}
				</MenuItem>
				<Divider />

				{auth && auth.role === RoleType.Admin && (
					<Link className=' text-decoration-none' to={path.AdminSettings}>
						<MenuItem onClick={handleClose}>
							<ListItemIcon sx={{color: "ButtonShadow"}}>
								{fontAwesomeIcon.setting}
							</ListItemIcon>
							<Typography ml={1}>{t("accountMenu.settings")}</Typography>
						</MenuItem>
					</Link>
				)}

				<Divider sx={{borderColor: "#4FC3F7", my: 0.5}} />

				<MenuItem onClick={() => logout()}>
					<ListItemIcon sx={{color: "#FF5252"}}>
						{fontAwesomeIcon.logOut}
					</ListItemIcon>
					<Typography ml={1} color='#FF5252'>
						{t("accountMenu.logout")}
					</Typography>
				</MenuItem>
			</Menu>
		</Fragment>
	);
};

export default AccountMenu;
