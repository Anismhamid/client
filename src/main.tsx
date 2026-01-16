import {createRoot} from "react-dom/client";
import {SpeedInsights} from "@vercel/speed-insights/react";
import "./index.css";
import App from "./App.tsx";
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "./context/useUSer.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {Buffer} from "buffer";
window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(
	<GoogleOAuthProvider clientId={import.meta.env.VITE_API_GOOGLE_API}>
		<UserProvider>
			<SpeedInsights/>
				<BrowserRouter>
					<App />
				</BrowserRouter>
		</UserProvider>
	</GoogleOAuthProvider>,
);
