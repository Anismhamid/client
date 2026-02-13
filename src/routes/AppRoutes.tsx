import {Routes, Route} from "react-router-dom";
import UsersManagement from "../components/settings/UsersManagement";
import {path, productsPathes} from "./routes";
import Home from "../components/pages/Home";
import Login from "../components/settings/Login";
import About from "../components/pages/About";
// import EditUserData from "../atoms/userManage/EditUserData";
import Contact from "../components/pages/Contact";
import PageNotFound from "../components/pages/Png";
import PrivacyAdnPolicy from "../components/pages/PrivacyAndPolicy";
import Register from "../components/settings/register/Register";
import TermOfUse from "../components/pages/TermOfUse";
import AdminSettings from "../components/settings/AdminSettengs";
import Profile from "../components/settings/profile/Profile";
import RoleType from "../interfaces/UserType";
import {FunctionComponent} from "react";
import {AuthValues} from "../interfaces/authValues";
import ProducDetails from "../components/pages/products/PostDetails";
import Products from "../components/pages/products/Posts";
import Messages from "../components/settings/Messages";
import WebSiteAdmins from "../components/settings/WebSiteAdmins";
import CustomerProfile from "../components/settings/customerProfile/CustomerProfile";
import Favorite from "../components/pages/products/FavoritesProducts";
import DiscountsAndOffers from "../components/pages/products/DiscountsAndOffers";
import SellingHelp from "../components/pages/SellingHelp";
import SafetyHelp from "../components/pages/SafetyHelp";
import DisputesHelp from "../components/pages/DisputesHelp";
import ChatBox from "../components/pages/chatBox/ChatBox";
import ChatBoxWrapper from "../components/pages/chatBox/ChatBoxWrapper";
import {UserMessage} from "../interfaces/usersMessages";
import MessagesPage from "../components/pages/chatBox/MessagesPage";

interface AppRoutesProps {
	auth: AuthValues;
}

const AppRoutes: FunctionComponent<AppRoutesProps> = ({auth}) => {
	return (
		<Routes>
			<Route path={path.Home} element={<Home />} />
			<Route path={path.Login} element={<Login />} />
			<Route path={path.Profile} element={<Profile />} />
			<Route path={path.SellingHelp} element={<SellingHelp />} />
			<Route path={path.SafetyHelp} element={<SafetyHelp />} />
			<Route path={path.DisputesHelp} element={<DisputesHelp />} />
			<Route path={path.CustomerProfile} element={<CustomerProfile />} />
			<Route path={`${path.Profile}/:id`} element={<Profile />} />
			<Route path={`${path.Favorite}`} element={<Favorite />} />

			<Route path={path.Register} element={<Register />} />
			<Route path={path.Messages} element={<Messages />} />
			<Route
				path={path.userTouserMessage}
				element={<ChatBoxWrapper user={auth as unknown as UserMessage} />}
			/>
			<Route path={path.MessagesPage} element={<MessagesPage />} />
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

			<Route path='/category/:category/:subcategory' element={<Products />} />

			<Route
				path={`${productsPathes.productDetails}/:category/:brand/:productId`}
				element={<ProducDetails />}
			/>
			<Route
				path={`${productsPathes.productDetails}/:productId`}
				element={<ProducDetails />}
			/>
			<Route path={`${path.DiscountsAndOffers}`} element={<DiscountsAndOffers />} />

			<Route path={path.Png} element={<PageNotFound />} />
		</Routes>
	);
};

export default AppRoutes;
