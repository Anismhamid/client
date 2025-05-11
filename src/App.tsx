import {showNewOrderToast} from "./atoms/bootStrapToast/SocketToast.tsx";
import {useNavigate} from "react-router-dom";
import Footer from "./components/settings/Footer.tsx";
import {path} from "./routes/routes";
import {ToastContainer} from "react-toastify";
import {fontAwesomeIcon} from "./FontAwesome/Icons.tsx";
import useToken from "./hooks/useToken.ts";
import {io} from "socket.io-client";
import {useEffect, useMemo, useState} from "react";
import {useUser} from "./context/useUSer.tsx";
import RoleType from "./interfaces/UserType.ts";
import {showInfo} from "./atoms/Toast.ts";
import {
	CssBaseline,
	RadioGroup,
	Radio,
	FormControl,
	FormControlLabel,
	ThemeProvider,
	createTheme,
	PaletteMode,
	SpeedDial,
} from "@mui/material";
import "./locales/i18n.tsx";
import LanguageSwitcher from "./locales/languageSwich.tsx";
import NavBar from "./components/settings/NavBar.tsx";
import {Order} from "./interfaces/Order.ts";
import {useTranslation} from "react-i18next";
import {getStatusText} from "./atoms/OrderStatusButtons/orderStatus.ts";
import useNotificationSound from "./hooks/useNotificationSound.tsx";
import {UserRegister} from "./interfaces/User.ts";
import AppRoutes from "./routes/AppRoutes.tsx";

function App() {
	const {decodedToken} = useToken();
	const {auth} = useUser();
	const navigate = useNavigate();
	const {t} = useTranslation();
	const {playNotificationSound} = useNotificationSound();

	useEffect(() => {
		if (!auth) return;

		const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
			auth: {
				userId: auth._id,
			},
			withCredentials: true,
		});

		socket.on("new order", (newOrder: Order) => {
			const orderNum = newOrder.orderNumber;

			if (auth.role === RoleType.Admin || auth.role == RoleType.Moderator) {
				playNotificationSound();
				showNewOrderToast({
					navigate,
					navigateTo: `/orderDetails/${orderNum}`,
					orderNum,
				});
			}
		});

		socket.on(
			"order:status:client",
			({orderNumber, status}: {orderNumber: string; status: string}) => {
				const statusText = getStatusText(status, t);
				playNotificationSound();
				showInfo(`ההזמנה שלך (${orderNumber}) ${statusText}`);
			},
		);

		socket.on("user:registered", (user: UserRegister) => {
			if (auth && auth.role === RoleType.Admin) {
				playNotificationSound();
				showInfo(`${user.email} ${user.role} משתמש חדש נרשם`);
			}
		});

		socket.on("user:newUserLoggedIn", (user: UserRegister) => {
			if (auth && auth.role === RoleType.Admin) {
				playNotificationSound();
				showInfo(
					user.role === RoleType.Client
						? `${user.email} משתמש התחבר`
						: user.role === RoleType.Admin
							? `${user.email} משתמש  אדמן התחבר`
							: `${user.email} משתמש  מנחה התחבר`,
				);
			}
		});

		return () => {
			socket.off("new order");
			socket.off("order:status:client");
			socket.off("user:registered");
			socket.off("user:newUserLoggedIn");
			socket.disconnect();
		};
	}, [auth]);

	const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newMode = event.target.value as PaletteMode;
		setMode(newMode);

		localStorage.setItem("dark", newMode);
	};

	const getInitialMode = (): PaletteMode => {
		const stored = localStorage.getItem("dark");
		return stored === "light" ? "light" : "dark";
	};
	const [mode, setMode] = useState<PaletteMode>(getInitialMode());

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode],
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<FormControl sx={{width: "100%", display: "flex"}}>
				<RadioGroup
					aria-labelledby='demo-theme-toggle'
					name='theme-toggle'
					row
					value={mode}
					onChange={handleThemeChange}
				>
					<FormControlLabel value='light' control={<Radio />} label='Light' />
					<FormControlLabel value='dark' control={<Radio />} label='Dark' />
					<LanguageSwitcher />
				</RadioGroup>
			</FormControl>

			<ToastContainer />
			<NavBar />
			{decodedToken && (
				<SpeedDial
					ariaLabel='cart'
					sx={{position: "fixed", bottom: 40, right: "45%"}}
					icon={fontAwesomeIcon.cartInoc}
					onClick={() => {
						navigate(path.Cart);
					}}
				/>
			)}
			<AppRoutes auth={auth} />
			<Footer />
		</ThemeProvider>
	);
}

export default App;
