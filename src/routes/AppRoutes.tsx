import {Routes, Route} from "react-router-dom";
import UsersManagement from "../components/pages/UsersManagement";
import {path, productsPathes} from "./routes";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import About from "../components/pages/About";
import Cart from "../components/pages/Cart";
import Checkout from "../components/pages/orders/Checkout";
// import EditUserData from "../atoms/userManage/EditUserData";
import Contact from "../components/pages/Contact";
import AllTheOrders from "../components/pages/orders/AllTheOrders";
import PageNotFound from "../components/pages/Png";
import PrivacyAdnPolicy from "../components/pages/PrivacyAndPolicy";
import Register from "../components/pages/Register";
import TermOfUse from "../components/pages/TermOfUse";
import AdminSettings from "../components/pages/AdminSettengs";
import Profile from "../components/pages/Profile";
import Receipt from "../components/pages/orders/Receipt";
import RoleType from "../interfaces/UserType";
import {FunctionComponent} from "react";
import {AuthValues} from "../interfaces/authValues";
import OrderDetails from "../components/pages/orders/OrederDetails";
import ProducDetails from "../components/pages/products/ProducDetails";
import Products from "../components/pages/products/Products";
import Messages from "../components/pages/Messages";
import DeliveryPage from "../components/pages/DeliveryPage";
import CompleteOrdersPage from "../components/pages/orders/CompleteOrdersPage";
import WebSiteAdmins from "../components/settings/WebSiteAdmins";

interface AppRoutesProps {
	auth: AuthValues;
}

const AppRoutes: FunctionComponent<AppRoutesProps> = ({auth}) => {
	return (
		<Routes>
			<Route path={path.Home} element={<Home />} />
			<Route path={path.Login} element={<Login />} />
			<Route path={path.Profile} element={<Profile />} />
			<Route path={`${path.Profile}/:id`} element={<Profile />} />

			<Route path={path.Register} element={<Register />} />
			<Route path={path.Messages} element={<Messages />} />
			<Route path={path.WebSiteAdmins} element={<WebSiteAdmins />} />
			<Route
				path={path.UsersManagement}
				element={auth && auth.role === RoleType.Admin && <UsersManagement />}
			/>
			<Route
				path={path.AdminSettings}
				element={auth && auth.role === RoleType.Admin && <AdminSettings />}
			/>
			<Route path={path.Receipt} element={auth?._id && <Receipt />} />
			<Route path={path.DeliveryPage} element={<DeliveryPage />} />
			<Route path={path.Contact} element={<Contact />} />
			<Route path={path.About} element={<About />} />
			<Route path={path.Cart} element={<Cart />} />
			<Route path={path.OrderDetails} element={auth && <OrderDetails />} />
			<Route path={path.AllTheOrders} element={<AllTheOrders />} />
			<Route path={path.CompleteOrders} element={<CompleteOrdersPage />} />

			<Route path={path.PrivacyAndPolicy} element={<PrivacyAdnPolicy />} />
			<Route path={path.TermOfUse} element={<TermOfUse />} />
			<Route path='/category/:category' element={<Products />} />
			<Route
				path={`${productsPathes.productDetails}/:productName`}
				element={<ProducDetails />}
			/>

			<Route path={path.Checkout} element={<Checkout />} />
			<Route path={path.Png} element={<PageNotFound />} />
		</Routes>
	);
};

export default AppRoutes;
