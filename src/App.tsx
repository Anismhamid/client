import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import {showNewOrderToast} from "./atoms/bootStrapToast/SocketToast.js";
import {Routes, Route, useNavigate, Navigate} from "react-router-dom";
import UsersManagement from "./components/UsersManagement.js";
import OrederDetails from "./components/OrederDetails.js";
import AllTheOrders from "./components/AllTheOrders.js";
import Beverages from "./components/Beverages.js";
import Vegetable from "./components/Vegetable";
import Profile from "./components/Profile.js";
import Receipt from "./components/Receipt.js";
import Checkout from "./components/Checkout";
import Register from "./components/Register";
import Spices from "./components/Spices.js";
import Orders from "./components/Orders.js";
import Bakery from "./components/Bakery.js";
import Frozen from "./components/Frozen.js";
import Snacks from "./components/Snacks.js";
import PageNotFound from "./components/Png";
import Contact from "./components/Contact";
import Dairy from "./components/Dairy.js";
import Footer from "./components/Footer";
import Fruits from "./components/Fruits";
import NavBar from "./components/NavBar";
import Meat from "./components/Meat.js";
import Fish from "./components/Fish.js";
import Login from "./components/Login";
import About from "./components/About";
import Cart from "./components/Cart";
import Home from "./components/Home";
import {path, productsPathes} from "./routes/routes";
import {ToastContainer} from "react-toastify";
import {fontAwesomeIcon} from "./FontAwesome/Icons.js";
import useToken from "./hooks/useToken.js";
import {io} from "socket.io-client";
import {useEffect, useMemo, useState} from "react";
import {useUser} from "./context/useUSer.js";
import RoleType from "./interfaces/UserType.js";
import {showInfo} from "./atoms/Toast.js";
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
import PrivacyAdnPolicy from "./components/PrivacyAndPolicy.js";
import CompleteProfile from "./components/CompleteProfile.js";
import TermOfUse from "./components/TermOfUse.js";
import "./locales/i18n.tsx";

function App() {
	const {decodedToken} = useToken();
	const {auth} = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!auth) return;

		const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
			transports: ["websocket"],
		});

		socket.on("new order", (newOrder) => {
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

		socket.on("user:registered", (user) => {
			if (auth && auth.role === RoleType.Admin) {
				showInfo(`${user.email} ${user.role} משתמש חדש נרשם`);
			}
		});

		socket.on("user:newUserLoggedIn", (user) => {
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
				<FormControl>
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
					</RadioGroup>
				</FormControl>

				<ToastContainer />
				<NavBar />
				{decodedToken && (
					<SpeedDial
						ariaLabel='cart'
						sx={{position: "fixed", bottom: 16, right: 16}}
						icon={fontAwesomeIcon.CartInoc}
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
					<Route path={path.MyOrders} element={<Orders />} />
					<Route path={path.OrderDetails} element={<OrederDetails />} />
					<Route path={path.AllTheOrders} element={<AllTheOrders />} />
					<Route path={path.Receipt} element={<Receipt />} />
					<Route path={path.PrivacyAndPolicy} element={<PrivacyAdnPolicy />} />
					<Route path={path.TermOfUse} element={<TermOfUse />} />
					<Route path={path.CompleteProfile} element={<CompleteProfile />} />
					<Route path={productsPathes.Fruits} element={<Fruits />} />
					<Route path={productsPathes.Vegetable} element={<Vegetable />} />
					<Route path={productsPathes.fish} element={<Fish />} />
					<Route path={productsPathes.meat} element={<Meat />} />
					<Route path={productsPathes.spices} element={<Spices />} />
					<Route path={productsPathes.dairy} element={<Dairy />} />
					<Route path={productsPathes.bakery} element={<Bakery />} />
					<Route path={productsPathes.beverages} element={<Beverages />} />
					<Route path={productsPathes.forzen} element={<Frozen />} />
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
