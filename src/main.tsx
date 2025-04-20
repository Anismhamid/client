import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "./context/useUSer.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {CartProvider} from "./context/useCart.tsx";

createRoot(document.getElementById("root")!).render(
	<GoogleOAuthProvider clientId={import.meta.env.VITE_API_GOOGLE_API}>
		<UserProvider>
			<CartProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</CartProvider>
		</UserProvider>
	</GoogleOAuthProvider>,
);
