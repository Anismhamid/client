import {FunctionComponent} from "react";
import {FormControlLabel, PaletteMode, FormGroup, Box, Typography} from "@mui/material";
import {alpha, styled} from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import LanguageSwitcher from "../../locales/languageSwich";
import {Link} from "react-router-dom";
import handleRTL from "../../locales/handleRTL";
import {LocalOffer, Favorite} from "@mui/icons-material";
import {path} from "../../routes/routes";

interface ThemeProps {
	mode: PaletteMode;
	setMode: (mode: PaletteMode) => void;
}

const quickLinks = [
	{
		icon: <LocalOffer color='error' />,
		link: path.DicountAndOfers,
		label: "عروض",
		color: "#F4A261",
	},
	{
		icon: <Favorite color='error' />,
		link: "/favorites",
		label: "المفضلة",
		color: "#F4A261",
	},
];

// <Box>
// 	{/* الشريط العلوي */}
// 	<AppBar
// 		position='sticky'
// 		sx={{
// 			background:
// 				mode === "dark"
// 					? "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
// 					: "linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)",
// 			boxShadow: 3,
// 		}}
// 	></AppBar>

const MaterialUISwitch = styled(Switch)(({theme}) => ({
	width: 62,
	height: 34,
	padding: 7,
	"& .MuiSwitch-switchBase": {
		margin: 1,
		padding: 0,
		transform: "translateX(6px)",
		"&.Mui-checked": {
			color: "#fff",
			transform: "translateX(22px)",
			"& .MuiSwitch-thumb:before": {
				backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
					"#fff",
				)}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
			},
			"& + .MuiSwitch-track": {
				opacity: 1,
				backgroundColor: "#aab4be",
				...theme.applyStyles("dark", {
					backgroundColor: "#8796A5",
				}),
			},
		},
	},
	"& .MuiSwitch-thumb": {
		backgroundColor: "#005db9",
		width: 32,
		height: 32,
		"&::before": {
			content: "''",
			position: "absolute",
			width: "100%",
			height: "100%",
			left: 0,
			top: 0,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
				"#fff",
			)}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
		},
		...theme.applyStyles("dark", {
			backgroundColor: "#003180",
		}),
	},
	"& .MuiSwitch-track": {
		opacity: 1,
		backgroundColor: "#aab4be",
		borderRadius: 20 / 2,
		...theme.applyStyles("dark", {
			backgroundColor: "#8796A5",
		}),
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

	return (
		<>
			<Box
				dir={dir}
				sx={{
					zIndex: 1000,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					backgroundColor: "primary.main",
				}}
			>
				<FormGroup>
					<FormControlLabel
						checked={mode === "dark"}
						onChange={handleThemeChange}
						control={<MaterialUISwitch sx={{m: 1}} />}
						label={mode}
						color={"primary.main"}
					/>
				</FormGroup>
				<LanguageSwitcher />
				{/* <img style={{width: 150, padding: 0}} src='/myLogo2.png' alt='' /> */}
				<Link
					to='/'
					style={{
						textDecoration: "none",
					}}
				>
					<Typography
						variant='h1'
						color='error'
						sx={{
							fontWeight: "bold",
							ml: 1,
							fontSize: "1.5rem",
							fontFamily: "Hebbo",
						}}
					>
						صـفـقـه
					</Typography>
				</Link>
			</Box>
			<Box
				sx={{
					display: "block",
					backgroundColor: "primary.main",
					borderTop: "2px solid #7E9810",
				}}
			>
				{/* <Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						px: 2,
						py: 0.5,
						my: 1,
						bgcolor:
							mode === "dark"
								? alpha("#FF6B35", 0.1)
								: alpha("#FF6B35", 0.08),
					}}
				>
					<DeliveryDining sx={{color: "#FF6B35", fontSize: 20}} />
					<Box>
						<Typography
							variant='caption'
							sx={{color: mode === "dark" ? "#cbd5e0" : "#ffffff"}}
						>
							التوصيل برعاية
						</Typography>
						<Typography
							variant='body2'
							sx={{
								color: "#FF6B35",
								fontWeight: "bold",
								lineHeight: 1,
							}}
						>
							One Minute Delivery
						</Typography>
					</Box>
				</Box> */}
				<Box sx={{display: "flex", gap: 2, px: 2, py: 1}}>
					{quickLinks.map((link, idx) => (
						<Link to={link.link} key={idx}>
							<Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
								{link.icon}
								<Typography sx={{color: link.color, fontWeight: "bold"}}>
									{link.label}
								</Typography>
							</Box>
						</Link>
					))}
					<Box>{}</Box>
				</Box>
			</Box>
		</>
	);
};

export default Theme;
