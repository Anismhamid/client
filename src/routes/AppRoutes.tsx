import {Routes, Route} from "react-router-dom";
import {lazy} from "react";
import {FunctionComponent} from "react";
import {path, productsPathes} from "./routes";
import RoleType from "../interfaces/UserType";
import {AuthValues} from "../interfaces/authValues";
import {UserMessage} from "../interfaces/usersMessages";

const UsersManagement = lazy(() => import("../components/settings/UsersManagement"));
const Home = lazy(() => import("../components/pages/Home"));
const Login = lazy(() => import("../components/settings/Login"));
const About = lazy(() => import("../components/pages/About"));
// import EditUserData from "../atoms/userManage/EditUserData";
const Contact = lazy(() => import("../components/pages/Contact"));
const PageNotFound = lazy(() => import("../components/pages/Png"));
const PrivacyAdnPolicy = lazy(() => import("../components/pages/PrivacyAndPolicy"));
const Register = lazy(() => import("../components/settings/register/Register"));
const TermOfUse = lazy(() => import("../components/pages/TermOfUse"));
const AdminSettings = lazy(() => import("../components/settings/AdminSettengs"));
const Profile = lazy(() => import("../components/settings/profile/Profile"));
const PostDetails = lazy(() => import("../components/pages/products/PostDetails"));
const Products = lazy(() => import("../components/pages/products/Posts"));
const Messages = lazy(() => import("../components/settings/Messages"));
const WebSiteAdmins = lazy(() => import("../components/settings/WebSiteAdmins"));
const CustomerProfile = lazy(
	() => import("../components/settings/customerProfile/CustomerProfile"),
);
const Favorite = lazy(() => import("../components/pages/products/FavoritesPosts"));
const DiscountsAndOffers = lazy(
	() => import("../components/pages/products/DiscountsAndOffers"),
);
const SellingHelp = lazy(() => import("../components/pages/SellingHelp"));
const SafetyHelp = lazy(() => import("../components/pages/SafetyHelp"));
const DisputesHelp = lazy(() => import("../components/pages/DisputesHelp"));
const ChatBoxWrapper = lazy(() => import("../components/pages/chatBox/ChatBoxWrapper"));
const MessagesPage = lazy(() => import("../components/pages/chatBox/MessagesPage"));
const FeaturedAdsDashboard = lazy(() => import("../atoms/ads/FeaturedAdsDashboard"));

interface AppRoutesProps {

	auth: AuthValues;
}

const AppRoutes: FunctionComponent<AppRoutesProps> = ({auth}) => {
	return (
		<Routes>
			<Route path={path.Home} element={<Home />} />
			<Route path={path.Login} element={<Login />} />
			<Route path={path.Profile} element={<Profile />} />
			<Route path={path.FeaturedAdsDashboard} element={<FeaturedAdsDashboard />} />
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

			<Route path='/category/:category/*' element={<Products />} />

			<Route
				path={`${productsPathes.postsDetails}/:category/:brand/:postId`}
				element={<PostDetails />}
			/>
			<Route
				path={`${productsPathes.postsDetails}/:postId`}
				element={<PostDetails />}
			/>
			<Route path={`${path.DiscountsAndOffers}`} element={<DiscountsAndOffers />} />

			<Route path={"*"} element={<PageNotFound />} />
		</Routes>
	);
};

export default AppRoutes;
