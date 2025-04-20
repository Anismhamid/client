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
import {useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";

interface AccountMenuProps {
	logout: Function;
}

const AccountMenu: FunctionComponent<AccountMenuProps> = ({logout}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const {auth} = useUser();
	const navigate = useNavigate();

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
						size='small'
						sx={{width: "40px", position: "absolute", left: 10}}
						aria-controls={open ? "account-menu" : undefined}
						aria-haspopup='true'
						aria-expanded={open ? "true" : undefined}
					>
						<Avatar
							className='bg-primary'
							sx={{width: 40, height: 40}}
							src={
								auth?.image?.url ||
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
							filter: "drop-shadow(0px 2px 8px rgba(255, 255, 255, 0.32))",
							mt: 1.5,
							"& .MuiAvatar-root": {
								width: 32,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							"&::before": {
								content: '""',
								display: "block",
								position: "absolute",
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: "background.paper",
								transform: "translateY(-50%) rotate(45deg)",
								zIndex: 0,
							},
						},
					},
				}}
				transformOrigin={{horizontal: "right", vertical: "top"}}
				anchorOrigin={{horizontal: "right", vertical: "bottom"}}
			>
				<MenuItem onClick={() => navigate(path.Profile)}>
					<Avatar
						src={
							auth?.image?.url ||
							"https://media2.giphy.com/media/l0MYO6VesS7Hc1uPm/200.webp?cid=ecf05e47hxvvpx851ogwi8s26zbj1b3lay9lke6lzvo76oyx&ep=v1_gifs_search&rid=200.webp&ct=g"
						}
					/>
					החשבון שלי
				</MenuItem>

				<Divider />
				<MenuItem onClick={handleClose}>
					<ListItemIcon>{fontAwesomeIcon.setting}</ListItemIcon>
					הגדרות
				</MenuItem>
				<MenuItem onClick={() => logout()}>
					<ListItemIcon>{fontAwesomeIcon.LogOut}</ListItemIcon> יציאה
				</MenuItem>
			</Menu>
		</Fragment>
	);
};

export default AccountMenu;
