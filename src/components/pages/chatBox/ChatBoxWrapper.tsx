import ChatBox from "./ChatBox";
import {FunctionComponent} from "react";
import {UserMessage} from "../../../interfaces/usersMessages";
import { mapUserMessageToChatBox } from "./MessagesPage";
import { useUser } from "../../../context/useUSer";

interface ChatBoxWrapperProps {
	user: UserMessage;
}

const ChatBoxWrapper: FunctionComponent<ChatBoxWrapperProps> = ({user}) => {
	const {auth} = useUser();
	const token = localStorage.getItem("token");

	if (!auth || !auth._id) {
		return <div>⚠️ الرجاء تسجيل الدخول أولاً</div>;
	}

	return (
		<ChatBox
			currentUser={{
				_id: auth._id,
				name: auth.name.first,
				email: auth.email ?? "",
				role: auth.role ?? "Client",
			}}
			otherUser={mapUserMessageToChatBox(user)}
			token={token || ""}
		/>
	);
};

export default ChatBoxWrapper;
