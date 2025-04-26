import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import {showNewOrderToast} from "./atoms/bootStrapToast/SocketToast.tsx";
import {Routes, Route, useNavigate, Navigate} from "react-router-dom";
import UsersManagement from "./components/UsersManagement.tsx";
import OrederDetails from "./components/OrederDetails.tsx";
import AllTheOrders from "./components/AllTheOrders.tsx";
import Beverages from "./components/Beverages.tsx";
import Vegetable from "./components/Vegetable";
import Profile from "./components/Profile.tsx";
import Receipt from "./components/Receipt.tsx";
import Checkout from "./components/Checkout";
import Register from "./components/Register";
import Spices from "./components/Spices.tsx";
import Bakery from "./components/Bakery.tsx";
import Frozen from "./components/Frozen.tsx";
import Snacks from "./components/Snacks.tsx";
import PageNotFound from "./components/Png";
import Contact from "./components/Contact";
import Dairy from "./components/Dairy.tsx";
import Footer from "./components/Footer";
import Fruits from "./components/Fruits";
import Meat from "./components/Meat.tsx";
import Fish from "./components/Fish.tsx";
import Login from "./components/Login";
import About from "./components/About";
import Cart from "./components/Cart";
import Home from "./components/Home";
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
import PrivacyAdnPolicy from "./components/PrivacyAndPolicy.tsx";
import CompleteProfile from "./components/CompleteProfile.tsx";
import TermOfUse from "./components/TermOfUse.tsx";
import "./locales/i18n.tsx";
import LanguageSwitcher from "./locales/languageSwich.tsx";
import NavBar from "./components/NavBar.tsx";
import AdminSettings from "./components/AdminSettengs.tsx";
import { Order } from "./interfaces/Order.ts";
import { UserRegister } from "./interfaces/User.ts";

function App() {
	const {decodedToken} = useToken();
	const {auth} = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!auth) return;

		const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
			transports: ["websocket"],
		});

		socket.on("new order", (newOrder:Order) => {
			const orderNum = newOrder.orderNumber;
			console.log("New order received in real-time:", orderNum);

			if (auth.role === RoleType.Admin || auth.role == RoleType.Moderator) {
				showNewOrderToast({
					navigate,
					navigateTo: `/orderDetails/${orderNum}`,
					orderNum,
				});
			}
		});

		socket.on("user:registered", (user:UserRegister) => {
			if (auth && auth.role === RoleType.Admin) {
				showInfo(`${user.email} ${user.role} משתמש חדש נרשם`);
			}
		});

		socket.on("user:newUserLoggedIn", (user: UserRegister) => {
			if (auth && auth.role === RoleType.Admin) {
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
		return "light";
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
						sx={{position: "fixed", bottom: 16, right: 5}}
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
					<Route path={path.Checkout} element={<Checkout />} />
					<Route path={path.Png} element={<PageNotFound />} />
				</Routes>
				<Footer />
			</ThemeProvider>
		</>
	);
}

export default App;
