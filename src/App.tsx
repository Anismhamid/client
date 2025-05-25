import Footer from "./components/settings/Footer.tsx";
import {ToastContainer} from "react-toastify";
import {useUser} from "./context/useUSer.tsx";
import {CssBaseline, ThemeProvider, createTheme, PaletteMode, IconButton} from "@mui/material";
import "./locales/i18n.tsx";
import NavBar from "./components/settings/NavBar.tsx";
import AppRoutes from "./routes/AppRoutes.tsx";
import Theme from "./atoms/theme/AppTheme.tsx";
import SpeedDialComponent from "./atoms/productsManage/SpeedDialComponent.tsx";
import useSocketEvents from "./hooks/useSocketEvents.ts";
import {useMemo, useState} from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

function App() {
	const {auth} = useUser();
	useSocketEvents();
	const navigate = useNavigate();

	// Manage theme mode state
	const getInitialMode = (): PaletteMode => {
		const stored = localStorage.getItem("theme");
		return stored === "light" ? "light" : "dark";
	};
	const [mode, setMode] = useState<PaletteMode>(getInitialMode());

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
					...(mode === "light"
						? {
								primary: {main: "#005db9"},
								background: {default: "#f5f5f5"},
							}
						: {
								primary: {main: "#90caf9"},
								background: {default: "#121212"},
							}),
				},
				direction: "rtl",
			}),
		[mode],
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<ToastContainer />
			<Theme mode={mode} setMode={setMode} />
			<NavBar />
			<IconButton
				sx={{
					position: "sticky",
					top: 60,
					right:60,
					zIndex: 5,
					backgroundColor:"primary.main"

				}}
				onClick={() => navigate(-1)}
				aria-label='back'
			>
				<ArrowForwardIcon />
			</IconButton>
			<SpeedDialComponent />
			<AppRoutes auth={auth} />
			<Footer />
		</ThemeProvider>
	);
}

export default App;
