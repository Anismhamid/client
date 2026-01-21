import Footer from "./components/footer/Footer.tsx";
import {ToastContainer} from "react-toastify";
import {useUser} from "./context/useUSer.tsx";
import {CssBaseline, ThemeProvider, createTheme, PaletteMode} from "@mui/material";
import "./locales/i18n.tsx";
import AppRoutes from "./routes/AppRoutes.tsx";
import Theme from "./atoms/theme/AppTheme.tsx";
import SpeedDialComponent from "./atoms/productsManage/SpeedDialComponent.tsx";
import useSocketEvents from "./hooks/useSocketEvents.ts";
import {useEffect, useMemo, useState} from "react";
import handleRTL from "./locales/handleRTL.ts";

function App() {
	const {auth} = useUser();
	useSocketEvents();

	// Manage theme mode state
	const getInitialMode = (): PaletteMode => {
		const stored = localStorage.getItem("theme");
		return (stored as PaletteMode) || "light";
	};
	const [mode, setMode] = useState<PaletteMode>(getInitialMode());
	const diriction = handleRTL();

	useEffect(() => {
		localStorage.setItem("theme", mode);
	}, [mode]);

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
					...(mode === "light"
						? {
								primary: {main: "#000000c7"},
								secondary: {main: "#1976d2"},
								background: {
									default: "#f5f5f5",
									paper: "#ffffff",
								},
								text: {
									primary: "rgba(0, 0, 0, 0.87)",
									secondary: "rgba(0, 0, 0, 0.6)",
								},
							}
						: {
								primary: {main: "#90caf9"},
								secondary: {main: "#ce93d8"},
								background: {
									default: "#121212",
									paper: "#1e1e1e",
								},
								text: {
									primary: "#ffffff",
									secondary: "rgba(255, 255, 255, 0.7)",
								},
								error: {main: "#f44336"},
								warning: {main: "#ffa726"},
								info: {main: "#29b6f6"},
								success: {main: "#66bb6a"},
							}),
				},
				direction: diriction,
				typography: {
					fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
					h1: {fontWeight: 700},
					h2: {fontWeight: 600},
					h3: {fontWeight: 600},
					h4: {fontWeight: 500},
					h5: {fontWeight: 500},
					h6: {fontWeight: 500},
					button: {textTransform: "none"},
				},
				shape: {
					borderRadius: 8,
				},
				components: {
					MuiButton: {
						styleOverrides: {
							root: {
								borderRadius: 8,
								fontWeight: 600,
							},
						},
					},
					MuiCard: {
						styleOverrides: {
							root: {
								borderRadius: 12,
							},
						},
					},
				},
			}),
		[mode, diriction],
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<ToastContainer
				position='top-right'
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={diriction === "rtl"}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme={mode}
			/>
			<Theme mode={mode} setMode={setMode} />
			<SpeedDialComponent />
			<AppRoutes auth={auth} />
			<Footer isSeller={auth && true} />
		</ThemeProvider>
	);
}

export default App;
