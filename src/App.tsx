import {showNewOrderToast} from "./atoms/bootStrapToast/SocketToast.tsx";
import {useNavigate} from "react-router-dom";
import Footer from "./components/settings/Footer.tsx";
import {ToastContainer} from "react-toastify";
import {io} from "socket.io-client";
import {useEffect, useMemo, useState} from "react";
import {useUser} from "./context/useUSer.tsx";
import RoleType from "./interfaces/UserType.ts";
import {showInfo} from "./atoms/toasts/ReactToast.ts";
import {CssBaseline, ThemeProvider, createTheme, PaletteMode} from "@mui/material";
import "./locales/i18n.tsx";
import NavBar from "./components/settings/NavBar.tsx";
import {Order} from "./interfaces/Order.ts";
import {useTranslation} from "react-i18next";
import {getStatusText} from "./atoms/OrderStatusButtons/orderStatus.ts";
import useNotificationSound from "./hooks/useNotificationSound.tsx";
import {UserRegister} from "./interfaces/User.ts";
import AppRoutes from "./routes/AppRoutes.tsx";
import Theme from "./atoms/theme/AppTheme.tsx";
import SpeedDialComponent from "./atoms/productsManage/SpeedDialComponent.tsx";

function App() {
	const {auth} = useUser();
	const navigate = useNavigate();
	const {t} = useTranslation();
	const {playNotificationSound} = useNotificationSound();

	const isAdminAndModerator =
		(auth && auth.role === RoleType.Admin) ||
		(auth && auth.role === RoleType.Moderator);

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

			if (isAdminAndModerator) {
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
			<SpeedDialComponent />
			<AppRoutes auth={auth} />
			<Footer />
		</ThemeProvider>
	);
}

export default App;
