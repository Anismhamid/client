import {useEffect, useState} from "react";
import {Grid, Box, Paper, Typography} from "@mui/material";
import ChatList from "./ChatList";
import ChatBox, {ChatMessage} from "./ChatBox";
import {UserMessage} from "../../../interfaces/usersMessages";
import {useUser} from "../../../context/useUSer";
import Loader from "../../../atoms/loader/Loader";
import handleRTL from "../../../locales/handleRTL";
import {useTranslation} from "react-i18next";

export const mapUserMessageToChatBox = (msg: UserMessage): ChatMessage => {
	return {
		_id: msg._id ?? `temp-${Date.now()}`,
		from: {
			_id: msg.from?._id ?? "unknown",
			name: {
				first: msg.from?.first ?? "Unknown",
				last: msg.from?.last ?? "",
			},
			email: msg.from?.email ?? "",
			role: msg.from?.role ?? "Client",
		},
		to: {
			_id: msg.to?._id ?? "unknown",
			name: {
				first: msg.to?.first ?? "Unknown",
				last: msg.to?.last ?? "",
			},
			email: msg.to?.email ?? "",
			role: msg.to?.role ?? "Client",
		},
		message: msg.message,
		status: msg.status as "sent" | "delivered" | "seen",
		createdAt: msg.createdAt,
		warning: msg.warning ?? false,
		isImportant: msg.isImportant ?? false,
		replyTo: msg.replyTo
			? mapUserMessageToChatBox(msg.replyTo as unknown as UserMessage)
			: null,
	} as ChatMessage;
};

const MessagesPage = () => {
	const [selectedUser, setSelectedUser] = useState<UserMessage | null>(null);
	const {t} = useTranslation();

	const {auth} = useUser();

	if (!auth) return <Loader />;

	const currentUser = {
		_id: auth._id as string,
		name: auth.name.first,
		email: auth.email as string,
		role: auth.role as string,
	};

	const dir = handleRTL();

	return (
		<Box sx={{height: "80vh", p: 2, direction: dir}}>
			<Grid container spacing={0} sx={{height: "100%"}}>
				{/* قائمة المحادثات */}
				<Grid size={{xs: 12, md: 4}} sx={{height: "100%"}}>
					<Box sx={{p: 2, borderBottom: 1, borderColor: "divider"}}>
						<Typography variant='h6' fontWeight='bold'>
							Chats
						</Typography>
					</Box>
					<Box sx={{flexGrow: 1, overflowY: "auto"}}>
						<ChatList
							currentUser={currentUser}
							token={localStorage.getItem("token") as string}
							onSelectChat={setSelectedUser}
							selectedUserId={selectedUser?._id}
						/>
					</Box>
				</Grid>

				{/* صندوق الدردشة */}
				<Grid
					size={{xs: 12, md: 8}}
					sx={{
						position: "relative",
						height: "100%",
						display: "flex",
						flexDirection: "column",
						borderRadius: 2,
						boxShadow: 3,
						overflow: "hidden",
						zIndex: 10000,
					}}
				>
					{selectedUser ? (
						<ChatBox
							currentUser={currentUser}
							otherUser={mapUserMessageToChatBox(selectedUser)}
							token={localStorage.getItem("token") as string}
						/>
					) : (
						<Paper
							elevation={0}
							sx={{
								height: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "column",
								bgcolor: "grey.50",
							}}
						>
							<Typography variant='h5' color='text.secondary' gutterBottom>
								👋{" "}
								{t("messages.selectConversation") ||
									"Select a conversation"}
							</Typography>
							<Typography variant='body1' color='text.secondary'>
								{t("messages.chooseChat") ||
									"Choose a chat from the list to start messaging"}
							</Typography>
						</Paper>
					)}
				</Grid>
			</Grid>
		</Box>
	);
};

export default MessagesPage;
