import {Routes, Route, Navigate} from "react-router-dom";
import UsersManagement from "../atoms/userManage/UsersManagement";
import {path, productsPathes} from "./routes";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import About from "../components/pages/About";
import Cart from "../components/pages/Cart";
import Checkout from "../components/pages/orders/Checkout";
import CompleteProfile from "../atoms/userManage/CompleteProfile";
import Contact from "../components/pages/Contact";
import AllTheOrders from "../components/pages/orders/AllTheOrders";
import PageNotFound from "../components/pages/Png";
import PrivacyAdnPolicy from "../components/pages/PrivacyAndPolicy";
import Alcohol from "../components/pages/products/Alcohol";
import Baby from "../components/pages/products/Babys";
import Bakery from "../components/pages/products/Bakery";
import Beverages from "../components/pages/products/Beverages";
import Cleaning from "../components/pages/products/Cleaning";
import Dairy from "../components/pages/products/Dairy";
import Fish from "../components/pages/products/Fish";
import Frozen from "../components/pages/products/Frozen";
import Fruits from "../components/pages/products/Fruits";
import Health from "../components/pages/products/Health";
import House from "../components/pages/products/House";
import Meat from "../components/pages/products/Meat";
import PastaRice from "../components/pages/products/PastaRice";
import Snacks from "../components/pages/products/Snacks";
import Spices from "../components/pages/products/Spices";
import Vegetable from "../components/pages/products/Vegetable";
import Register from "../components/pages/Register";
import TermOfUse from "../components/pages/TermOfUse";
import AdminSettings from "../atoms/userManage/AdminSettengs";
import Profile from "../atoms/userManage/Profile";
import Receipt from "../components/pages/orders/Receipt";
import RoleType from "../interfaces/UserType";
import {FunctionComponent} from "react";
import {AuthValues} from "../interfaces/authValues";
import OrderDetails from "../components/pages/orders/OrederDetails";

interface AppRoutesProps {
	auth: AuthValues;
}

const AppRoutes: FunctionComponent<AppRoutesProps> = ({auth}) => {
	return (
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
			<Route
				path={path.OrderDetails}
				element={
					auth  ? (
						<OrderDetails />
					) : (
						<Navigate to={path.Login} />
					)
				}
			/>
			<Route path={path.AllTheOrders} element={<AllTheOrders />} />
			<Route
				path={path.Receipt}
				element={auth ? <Receipt /> : <Navigate to={path.Login} />}
			/>
			<Route
				path={path.AdminSettings}
				element={
					auth && auth.role === RoleType.Admin ? (
						<AdminSettings />
					) : (
						<Navigate to={path.Login} />
					)
				}
			/>
			<Route path={path.PrivacyAndPolicy} element={<PrivacyAdnPolicy />} />
			<Route path={path.TermOfUse} element={<TermOfUse />} />
			<Route path={path.CompleteProfile} element={<CompleteProfile />} />
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
	);
};

export default AppRoutes;
