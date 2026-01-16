import {FunctionComponent, useState} from "react";
import {
	FormControlLabel,
	PaletteMode,
	FormGroup,
	Box,
	Typography,
	Badge,
	Avatar,
	Tooltip,
} from "@mui/material";
import {alpha, styled} from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import LanguageSwitcher from "../../locales/languageSwich";
import {Link} from "react-router-dom";
import handleRTL from "../../locales/handleRTL";
import {
	LocalOffer,
	Favorite,
	Brightness4,
	Brightness7,
	FlashOn,
	Rocket,
} from "@mui/icons-material";
import {path} from "../../routes/routes";
import {motion, AnimatePresence} from "framer-motion";

interface ThemeProps {
	mode: PaletteMode;
	setMode: (mode: PaletteMode) => void;
}

const quickLinks = [
	{
		icon: <LocalOffer sx={{color: "#FFD700"}} />,
		link: path.DicountAndOfers,
		label: "عروض 🔥",
		color: "#FFD700",
		badge: true,
		badgeContent: "جديد",
	},
	{
		icon: <Favorite sx={{color: "#FF4081"}} />,
		link: "/favorites",
		label: "المفضلة ❤️",
		color: "#FF4081",
		badge: false,
	},
];

// Custom Switch with gradient
const GradientSwitch = styled(Switch)(({theme}) => ({
	width: 70,
	height: 38,
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
				boxShadow: "0 3px 10px rgba(33, 150, 243, 0.5)",
			},
			"& + .MuiSwitch-track": {
				opacity: 1,
				backgroundColor: "#2d3748",
				background: "linear-gradient(90deg, #1a202c 0%, #2d3748 100%)",
			},
		},
	},
	"& .MuiSwitch-thumb": {
		backgroundColor: "#FF8E53",
		width: 30,
		height: 30,
		boxShadow: "0 3px 10px rgba(255, 107, 53, 0.5)",
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
		backgroundColor: "#f6f8fa",
		background: "linear-gradient(90deg, #FF6B35 0%, #FF8E53 100%)",
		borderRadius: 20 / 2,
		transition: theme.transitions.create(["background-color"], {
			duration: 500,
		}),
	},
}));

// Custom Logo with animation
const LogoText = styled(Typography)(({theme}) => ({
	fontWeight: "bold",
	fontSize: "1.8rem",
	fontFamily: "'Tajawal', 'Cairo', sans-serif",
	background: "linear-gradient(45deg, #FF6B35 0%, #FF8E53 100%)",
	WebkitBackgroundClip: "text",
	WebkitTextFillColor: "transparent",
	backgroundClip: "text",
	textShadow: "0 2px 10px rgba(255, 107, 53, 0.3)",
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
		background: "linear-gradient(45deg, #FF6B35, #FF8E53)",
		WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
		WebkitMaskComposite: "xor",
		maskComposite: "exclude",
		opacity: 0.5,
	},
}));

const Theme: FunctionComponent<ThemeProps> = ({mode, setMode}) => {
	const [isHovered, setIsHovered] = useState(false);

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
			{/* Main Top Bar */}
			<Box
				dir={dir}
				sx={{
					zIndex: 1000,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					background:
						mode === "dark"
							? "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
							: "linear-gradient(135deg, #fff1ec 0%, #FF8E53 100%)",
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
								<Brightness4 sx={{color: "#FFD700", fontSize: 28}} />
							) : (
								<Brightness7 sx={{color: "#FFF", fontSize: 28}} />
							)}
						</motion.div>
					</AnimatePresence>
				</Box>

				{/* Center: Logo */}
				<motion.div
					whileHover={{scale: 1.05}}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<Link
						to='/'
						style={{
							textDecoration: "none",
						}}
					>
						<Box sx={{display: "flex", alignItems: "center", gap: 2}}>
							<motion.div
								animate={{
									rotate: isHovered ? 360 : 0,
									scale: isHovered ? 1.1 : 1,
								}}
								transition={{duration: 0.5}}
							>
								<Avatar
									sx={{
										width: 50,
										height: 50,
										background:
											"linear-gradient(45deg, #FF6B35 0%, #FF8E53 100%)",
										boxShadow: "0 4px 15px rgba(255, 107, 53, 0.4)",
									}}
								>
									<Rocket sx={{color: "white", fontSize: 30}} />
								</Avatar>
							</motion.div>
							<LogoText variant='h1'>صـفـقـه</LogoText>
						</Box>
					</Link>
					{isHovered && (
						<motion.div
							initial={{opacity: 0, y: -10}}
							animate={{opacity: 1, y: 0}}
							transition={{delay: 0.2}}
							
						>
							<Typography
								variant='caption'
								sx={{
									background:
										"linear-gradient(45deg, #FF6B35, #FF8E53)",
									color: "white",
									padding: "2px 8px",
									borderRadius: "4px",
									fontWeight: "bold",
									fontSize: "0.7rem",
								}}
							>
								تسوق بذكاء 🚀
							</Typography>
						</motion.div>
					)}
				</motion.div>

				{/* Right Side: Language Switcher */}
				<motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
					<LanguageSwitcher />
				</motion.div>
			</Box>

			{/* Quick Links Bar */}
			<Box
				sx={{
					display: "flex",
					background:
						mode === "dark"
							? "linear-gradient(135deg, #0d1117 0%, #161b22 100%)"
							: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
					padding: "8px 20px",
					borderBottom:
						mode === "dark"
							? "1px solid rgba(255,255,255,0.1)"
							: "1px solid rgba(0,0,0,0.1)",
					boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
					gap: 3,
					justifyContent: "center",
					position: "relative",
					overflow: "hidden",
				}}
			>
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						height: 2,
						background: "linear-gradient(90deg, #FF6B35, #FF8E53, #FF6B35)",
						backgroundSize: "200% 100%",
						animation: "shimmer 3s infinite linear",
					}}
				/>

				{quickLinks.map((link, idx) => (
					<motion.div
						key={idx}
						whileHover={{scale: 1.1}}
						whileTap={{scale: 0.95}}
					>
						<Link
							to={link.link}
							style={{
								textDecoration: "none",
								display: "flex",
								alignItems: "center",
								gap: "8px",
							}}
						>
							{link.badge ? (
								<Badge
									color='error'
									variant='dot'
									anchorOrigin={{
										vertical: "top",
										horizontal: "right",
									}}
								>
									<Box
										sx={{
											padding: "8px 15px",
											background:
												mode === "dark"
													? alpha(link.color, 0.1)
													: alpha(link.color, 0.08),
											borderRadius: "50px",
											border: `2px solid ${alpha(link.color, 0.3)}`,
											display: "flex",
											alignItems: "center",
											gap: 1,
											transition: "all 0.3s ease",
											"&:hover": {
												background:
													mode === "dark"
														? alpha(link.color, 0.2)
														: alpha(link.color, 0.15),
												border: `2px solid ${alpha(link.color, 0.6)}`,
												transform: "translateY(-2px)",
												boxShadow: `0 4px 12px ${alpha(link.color, 0.3)}`,
											},
										}}
									>
										<motion.div
											whileHover={{rotate: 15}}
											transition={{type: "spring", stiffness: 300}}
										>
											{link.icon}
										</motion.div>
										<Typography
											sx={{
												color: link.color,
												fontWeight: "bold",
												fontSize: "0.9rem",
												display: "flex",
												alignItems: "center",
												gap: "4px",
											}}
										>
											{link.label}
										</Typography>
									</Box>
								</Badge>
							) : (
								<Box
									sx={{
										padding: "8px 15px",
										background:
											mode === "dark"
												? alpha(link.color, 0.1)
												: alpha(link.color, 0.08),
										borderRadius: "50px",
										border: `2px solid ${alpha(link.color, 0.3)}`,
										display: "flex",
										alignItems: "center",
										gap: 1,
										transition: "all 0.3s ease",
										"&:hover": {
											background:
												mode === "dark"
													? alpha(link.color, 0.2)
													: alpha(link.color, 0.15),
											border: `2px solid ${alpha(link.color, 0.6)}`,
											transform: "translateY(-2px)",
											boxShadow: `0 4px 12px ${alpha(link.color, 0.3)}`,
										},
									}}
								>
									<motion.div
										whileHover={{rotate: 15}}
										transition={{type: "spring", stiffness: 300}}
									>
										{link.icon}
									</motion.div>
									<Typography
										sx={{
											color: link.color,
											fontWeight: "bold",
											fontSize: "0.9rem",
											display: "flex",
											alignItems: "center",
											gap: "4px",
										}}
									>
										{link.label}
									</Typography>
								</Box>
							)}
						</Link>
					</motion.div>
				))}
			</Box>

			<style>{`
				@keyframes shimmer {
					0% { background-position: -200% 0; }
					100% { background-position: 200% 0; }
				}
			`}</style>
		</>
	);
};

export default Theme;
