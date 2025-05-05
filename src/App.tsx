import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import {showNewOrderToast} from "./atoms/bootStrapToast/SocketToast.tsx";
import {Routes, Route, useNavigate, Navigate} from "react-router-dom";
import UsersManagement from "./components/settings/UsersManagement.tsx";
import OrederDetails from "./components/pages/OrederDetails.tsx";
import AllTheOrders from "./components/pages/AllTheOrders.tsx";
import Beverages from "./components/pages/products/Beverages.tsx";
import Vegetable from "./components/pages/products/Vegetable.tsx";
import Profile from "./components/settings/Profile.tsx";
import Receipt from "./components/settings/Receipt.tsx";
import Checkout from "./components/settings/Checkout.tsx";
import Register from "./components/pages/Register.tsx";
import Spices from "./components/pages/products/Spices.tsx";
import Bakery from "./components/pages/products/Bakery.tsx";
import Frozen from "./components/pages/products/Frozen.tsx";
import Snacks from "./components/pages/products/Snacks.tsx";
import PageNotFound from "./components/pages/Png.tsx";
import Contact from "./components/pages/Contact.tsx";
import Dairy from "./components/pages/products/Dairy.tsx";
import Footer from "./components/settings/Footer.tsx";
import Fruits from "./components/pages/products/Fruits.tsx";
import Meat from "./components/pages/products/Meat.tsx";
import Fish from "./components/pages/products/Fish.tsx";
import Login from "./components/pages/Login.tsx";
import About from "./components/pages/About.tsx";
import Cart from "./components/settings/Cart.tsx";
import Home from "./components/pages/Home.tsx";
import {path, productsPathes} from "./routes/routes";
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
import PrivacyAdnPolicy from "./components/pages/PrivacyAndPolicy.tsx";
import CompleteProfile from "./components/settings/CompleteProfile.tsx";
import TermOfUse from "./components/pages/TermOfUse.tsx";
import "./locales/i18n.tsx";
import LanguageSwitcher from "./locales/languageSwich.tsx";
import NavBar from "./components/settings/NavBar.tsx";
import AdminSettings from "./components/settings/AdminSettengs.tsx";
import {Order} from "./interfaces/Order.ts";
import {UserRegister} from "./interfaces/User.ts";
import Baby from "./components/pages/products/Babys.tsx";
import Cleaning from "./components/pages/products/Cleaning.tsx";
import PastaRice from "./components/pages/products/PastaRice.tsx";
import House from "./components/pages/products/House.tsx";
import Alcohol from "./components/pages/products/Alcohol.tsx";
import Health from "./components/pages/products/Health.tsx";
import {useTranslation} from "react-i18next";
import {getStatusText} from "./atoms/OrderStatusButtons/orderStatus.ts";
import useNotificationSound from "./hooks/useNotificationSound.tsx";

function App() {
	const {decodedToken} = useToken();
	const {auth} = useUser();
	const navigate = useNavigate();
	const {t} = useTranslation();
	const {playNotificationSound} = useNotificationSound();

	useEffect(() => {
		if (!auth) return;

		const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
			transports: ["websocket"],
			auth: {
				userId: auth?._id,
			},
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
				showInfo(`ההזמנה שלך (${orderNumber}) ${statusText}`);
				playNotificationSound()
			},
		);

		socket.on("user:registered", (user: UserRegister) => {
			if (auth && auth.role === RoleType.Admin) {
				showInfo(`${user.email} ${user.role} משתמש חדש נרשם`);
				playNotificationSound();
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
		if (stored === "dark" || stored === "light") {
			return stored;
		}
		return "dark";
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
		<>
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
						<FormControlLabel
							value='light'
							control={<Radio />}
							label='Light'
						/>
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

				<Routes>
					<Route path={path.Home} element={<Home />} />
					<Route path={path.Login} element={<Login />} />
					<Route path={path.Profile} element={<Profile />} />
					<Route path={path.Register} element={<Register />} />
					<Route
						path={path.UsersManagement}
						element={
							auth && auth.role === RoleType.Admin ? (
								<UsersManagement />
							) : (
								<Navigate to={path.Login} />
							)
						}
					/>
					<Route path={path.Contact} element={<Contact />} />
					<Route path={path.About} element={<About />} />
					<Route path={path.Cart} element={<Cart />} />
					<Route path={path.OrderDetails} element={<OrederDetails />} />
					<Route path={path.AllTheOrders} element={<AllTheOrders />} />
					<Route path={path.Receipt} element={<Receipt />} />
					<Route path={path.PrivacyAndPolicy} element={<PrivacyAdnPolicy />} />
					<Route path={path.TermOfUse} element={<TermOfUse />} />
					<Route path={path.CompleteProfile} element={<CompleteProfile />} />
					<Route path={path.AdminSettings} element={<AdminSettings />} />
					<Route path={productsPathes.fruits} element={<Fruits />} />
					<Route path={productsPathes.vegetable} element={<Vegetable />} />
					<Route path={productsPathes.fish} element={<Fish />} />
					<Route path={productsPathes.meat} element={<Meat />} />
					<Route path={productsPathes.spices} element={<Spices />} />
					<Route path={productsPathes.dairy} element={<Dairy />} />
					<Route path={productsPathes.bakery} element={<Bakery />} />
					<Route path={productsPathes.beverages} element={<Beverages />} />
					<Route path={productsPathes.frozen} element={<Frozen />} />
					<Route path={productsPathes.snacks} element={<Snacks />} />
					<Route path={productsPathes.baby} element={<Baby />} />
					<Route path={productsPathes.alcohol} element={<Alcohol />} />
					<Route path={productsPathes.cleaning} element={<Cleaning />} />
					<Route path={productsPathes.pastaRice} element={<PastaRice />} />
					<Route path={productsPathes.house} element={<House />} />
					<Route path={productsPathes.health} element={<Health />} />
					<Route path={path.Checkout} element={<Checkout />} />
					<Route path={path.Png} element={<PageNotFound />} />
				</Routes>
				<Footer />
			</ThemeProvider>
		</>
	);
}

export default App;
