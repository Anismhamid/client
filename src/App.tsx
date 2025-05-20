// import {showNewOrderToast} from "./atoms/bootStrapToast/SocketToast.tsx";
// import {useNavigate} from "react-router-dom";
import Footer from "./components/settings/Footer.tsx";
import {ToastContainer} from "react-toastify";
// import socket from "./socket/globalSocket";
// import {useEffect, useMemo, useState} from "react";
import {useUser} from "./context/useUSer.tsx";
// import RoleType from "./interfaces/UserType.ts";
// import {showInfo} from "./atoms/toasts/ReactToast.ts";
import {CssBaseline, ThemeProvider, createTheme, PaletteMode} from "@mui/material";
import "./locales/i18n.tsx";
import NavBar from "./components/settings/NavBar.tsx";
// import {Order} from "./interfaces/Order.ts";
// import {useTranslation} from "react-i18next";
// import {getStatusText} from "./atoms/OrderStatusButtons/orderStatus.ts";
// import useNotificationSound from "./hooks/useNotificationSound.tsx";
// import {UserRegister} from "./interfaces/User.ts";
import AppRoutes from "./routes/AppRoutes.tsx";
import Theme from "./atoms/theme/AppTheme.tsx";
import SpeedDialComponent from "./atoms/productsManage/SpeedDialComponent.tsx";
import {useSocketEvents} from "./hooks/useSocketEvents.ts";
import { useMemo, useState } from "react";

function App() {
	const {auth} = useUser();
	useSocketEvents();

	
	// const navigate = useNavigate();
	// const {t} = useTranslation();
	// const {playNotificationSound} = useNotificationSound();

	// const isAdminAndModerator =
	// 	(auth && auth.role === RoleType.Admin) ||
	// 	(auth && auth.role === RoleType.Moderator);

	// useEffect(() => {
	// 	if (!auth?._id) return;

	// 	const isAdminOrModerator =
	// 		auth.role === RoleType.Admin || auth.role === RoleType.Moderator;

	// 	socket.auth = {
	// 		userId: auth?._id,
	// 		role: auth?.role,
	// 		name: auth?.name.first,
	// 		withCredentials: true,
	// 	};

	// 	if (!socket.connected) {
	// 		socket.connect();
	// 	}

	// 	socket.off("error").on("error", (error: any) => {
	// 		console.error("Socket error:", error);
	// 	});

	// 	socket.on("disconnect", (reason: any) => {
	// 		if (reason === "io server disconnect") {
	// 			// Reconnect manually
	// 			socket.connect();
	// 		}
	// 		console.log("Disconnected:", reason);
	// 	});

	// 	socket.on("connect", () => {
	// 		if (isAdminOrModerator) {
	// 			socket.emit("joinAdminRoom", {
	// 				userId: auth._id,
	// 				role: auth.role,
	// 			});
	// 		}
	// 	});

	// 	socket.off("new order").on("new order", (newOrder: Order) => {
	// 		const orderNum = newOrder.orderNumber;

	// 		if (isAdminAndModerator) {
	// 			playNotificationSound();
	// 			showNewOrderToast({
	// 				navigate,
	// 				navigateTo: `/orderDetails/${orderNum}`,
	// 				orderNum,
	// 			});
	// 		}
	// 	});

	// 	socket
	// 		.off("order:status:client")
	// 		.on(
	// 			"order:status:client",
	// 			({orderNumber, status}: {orderNumber: string; status: string}) => {
	// 				const statusText = getStatusText(status, t);
	// 				playNotificationSound();
	// 				showInfo(`ההזמנה שלך (${orderNumber}) ${statusText}`);
	// 			},
	// 		);

	// 	socket.off("user:registered").on("user:registered", (user: UserRegister) => {
	// 		if (auth?._id && auth?.role === RoleType.Admin) {
	// 			playNotificationSound();
	// 			showInfo(`${user.email} ${user.role} משתמש חדש נרשם`);
	// 		}
	// 	});

	// 	socket
	// 		.off("user:newUserLoggedIn")
	// 		.on("user:newUserLoggedIn", (user: UserRegister) => {
	// 			if (auth?._id && auth?.role === RoleType.Admin) {
	// 				playNotificationSound();
	// 				const msg =
	// 					user.role === RoleType.Admin
	// 						? `${user.email} משתמש  אדמין התחבר`
	// 						: user.role === RoleType.Moderator
	// 							? `${user.email} משתמש  מנחה התחבר`
	// 							: `${user.email} משתמש התחבר`;

	// 				showInfo(msg);
	// 			}
	// 		});

	// 	socket
	// 		.off("order:status:updated")
	// 		.on(
	// 			"order:status:updated",
	// 			(data: {
	// 				orderNumber: string;
	// 				status: string;
	// 				userId: string;
	// 				updatedBy: string;
	// 			}) => {
	// 				playNotificationSound();
	// 				if (auth?._id === data.userId) {
	// 					showInfo(
	// 						`ההזמנה שלך (${data.orderNumber}) עודכנה לסטטוס: ${getStatusText(data.status, t)} ע"י ${data.updatedBy}`,
	// 					);
	// 				} else if (isAdminAndModerator) {
	// 					showInfo(
	// 						`הזמנה מספר ${data.orderNumber} עודכנה לסטטוס: ${getStatusText(data.status, t)} ע"י ${data.updatedBy}`,
	// 					);
	// 				}
	// 			},
	// 		);

	// 	return () => {
	// 		socket.off("error");
	// 		socket.off("disconnect");
	// 		socket.off("connect");
	// 		socket.off("new order");
	// 		socket.off("order:status:client");
	// 		socket.off("order:status:updated");
	// 		socket.off("user:registered");
	// 		socket.off("user:newUserLoggedIn");
	// 	};
	// }, [auth?._id, auth?.role, auth?.name?.first]);

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
			<SpeedDialComponent />
			<AppRoutes auth={auth} />
			<Footer />
		</ThemeProvider>
	);
}

export default App;
