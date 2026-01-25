import { styled } from "@mui/material";
import Switch from "@mui/material/Switch";

export // Custom Switch with gradient
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