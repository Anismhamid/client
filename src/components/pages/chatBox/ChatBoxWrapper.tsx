import ChatBox from "./ChatBox";
import {useUser} from "../../../context/useUSer";
import {FunctionComponent} from "react";
import {UserMessage} from "../../../interfaces/usersMessages";

interface ChatBoxWrapperProps {
	user: UserMessage;
}

const ChatBoxWrapper: FunctionComponent<ChatBoxWrapperProps> = ({user}) => {
	const {auth} = useUser();
	const token = localStorage.getItem("token");

	if (!auth) {
		return (
			<div style={{padding: 20, textAlign: "center"}}>
				⚠️ الرجاء تسجيل الدخول أولاً
			</div>
		);
	}

	return (
		<ChatBox
			currentUser={{
				_id: auth._id as string,
				name: auth.name.first,
				email: auth.email ?? "",
				role: auth.role ?? "Client",
			}}
			otherUser={{
				_id: user._id,
				from: {
					first: user.from?.first ?? "Unknown",
					last: user.from?.last ?? "",
					email: user.from?.email ?? "",
					role: user.from?.role ?? "Client",
				},
				to: {}, // يمكن تركها فارغة إذا لا تحتاج
				message: "",
				status: "sent",
				createdAt: new Date().toISOString(),
			}}
			token={token || ""}
		/>
	);
};

export default ChatBoxWrapper;
