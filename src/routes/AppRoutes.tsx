import {Routes, Route} from "react-router-dom";
import UsersManagement from "../components/pages/UsersManagement";
import {path, productsPathes} from "./routes";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import About from "../components/pages/About";
// import EditUserData from "../atoms/userManage/EditUserData";
import Contact from "../components/pages/Contact";
import PageNotFound from "../components/pages/Png";
import PrivacyAdnPolicy from "../components/pages/PrivacyAndPolicy";
import Register from "../components/pages/Register";
import TermOfUse from "../components/pages/TermOfUse";
import AdminSettings from "../components/pages/AdminSettengs";
import Profile from "../components/pages/Profile";
import RoleType from "../interfaces/UserType";
import {FunctionComponent} from "react";
import {AuthValues} from "../interfaces/authValues";
import ProducDetails from "../components/pages/products/ProducDetails";
import Products from "../components/pages/products/Products";
import Messages from "../components/pages/Messages";
import WebSiteAdmins from "../components/settings/WebSiteAdmins";
import CustomerProfile from "../components/pages/CustomerProfile";
import Favorite from "../components/pages/products/Favorite";
import DiscountsAndOffers from "../components/pages/products/DiscountsAndOffers";

interface AppRoutesProps {
	auth: AuthValues;
}

const AppRoutes: FunctionComponent<AppRoutesProps> = ({auth}) => {
	return (
		<Routes>
			<Route path={path.Home} element={<Home />} />
			<Route path={path.Login} element={<Login />} />
			<Route path={path.Profile} element={<Profile />} />
			<Route path={path.CustomerProfile} element={<CustomerProfile />} />
			<Route path={`${path.Profile}/:id`} element={<Profile />} />
			<Route path={`${path.Favorite}`} element={<Favorite />} />

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
			<Route path={path.Contact} element={<Contact />} />
			<Route path={path.About} element={<About />} />

			<Route path={path.PrivacyAndPolicy} element={<PrivacyAdnPolicy />} />
			<Route path={path.TermOfUse} element={<TermOfUse />} />
			<Route path='/category/:category' element={<Products />} />
			<Route
				path={`${productsPathes.productDetails}/:productName`}
				element={<ProducDetails />}
			/>
			<Route
				path={`${path.DicountAndOfers}`}
				element={<DiscountsAndOffers />}
			/>

			<Route path={path.Png} element={<PageNotFound />} />
		</Routes>
	);
};

export default AppRoutes;
