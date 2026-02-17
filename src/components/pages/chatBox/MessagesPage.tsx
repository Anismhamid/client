import { useState} from "react";
import {
	Grid,
	Box,
	Paper,
	Typography,
	useMediaQuery,
	useTheme,
	IconButton,
	AppBar,
	Toolbar,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatList from "./ChatList";
import {UserMessage} from "../../../interfaces/usersMessages";
import {useUser} from "../../../context/useUSer";
import handleRTL from "../../../locales/handleRTL";
import {useTranslation} from "react-i18next";
import {Navigate} from "react-router-dom";
import {path} from "../../../routes/routes";
import { ChatMessage } from "../../../interfaces/chat/chatMessage";
import ChatBox from "./ChatBox";

// הלוגיקה של המיפוי נשארת זהה
export const mapUserMessageToChatBox = (msg: UserMessage): ChatMessage => {
	return {
		_id: msg._id ?? `temp-${Date.now()}`,
		from: {
			_id: msg.from?._id ?? "unknown",
			name: {first: msg.name?.first ?? "Unknown", last: msg.name?.last ?? ""},
			email: msg.email,
			role: msg.role,
		},
		to: {
			_id: msg.to?._id ?? "unknown",
			name: {first: msg.to?.first ?? "Unknown", last: msg.to?.last ?? ""},
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
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const {auth} = useUser();
	const dir = handleRTL();

	// הגנה על הנתיב - ב-React components משתמשים ב-Navigate ולא ב-redirect
	if (!auth) return <Navigate to={path.Login} replace />;

	const currentUser = {
		_id: auth._id as string,
		name: auth.name.first,
		email: auth.email as string,
		role: auth.role as string,
	};

	return (
		<Box
			sx={{
				height: "100dvh",
				bgcolor: "background.default",
				direction: dir,
				overflow: "hidden",
			}}
		>
			<Paper
				elevation={0}
				sx={{
					height: isMobile ? "100%" : "calc(100dvh - 32px)",
					m: isMobile ? 0 : 2,
					borderRadius: isMobile ? 0 : 3,
					border: isMobile ? "none" : "1px solid",
					borderColor: "divider",
					overflow: "hidden",
				}}
			>
				<Grid container sx={{height: "100%"}}>
					{/* Sidebar / Chat List */}
					{(!isMobile || !selectedUser) && (
						<Grid
							size={{xs: 12, md: 4, lg: 3}}
							sx={{
								height: "100%",
								borderRight: dir === "ltr" ? "1px solid" : "none",
								borderLeft: dir === "rtl" ? "1px solid" : "none",
								borderColor: "divider",
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Box
								sx={{
									p: 2,
									borderBottom: "1px solid",
									borderColor: "divider",
								}}
							>
								<Typography variant='h6' fontWeight='bold'>
									💬 {t("messages.main") || "Messages"}
								</Typography>
							</Box>
							<Box sx={{flex: 1, overflowY: "auto"}}>
								<ChatList
									currentUser={currentUser}
									token={localStorage.getItem("token") as string}
									onSelectChat={(user) => setSelectedUser(user)}
									selectedUserId={selectedUser?._id}
								/>
							</Box>
						</Grid>
					)}

					{/* Chat Window */}
					{(!isMobile || selectedUser) && (
						<Grid
							size={{xs: 12, md: 8, lg: 9}}
							sx={{height: "100%", bgcolor: "grey.50",zIndex:500}}
						>
							{selectedUser ? (
								<Box
									sx={{
										height: "100%",
										display: "flex",
										flexDirection: "column",
									}}
								>
									{/* Mobile Header */}
									{isMobile && (
										<AppBar
											position='static'
											color='inherit'
											elevation={1}
										>
											<Toolbar>
												<IconButton
													edge='start'
													onClick={() => setSelectedUser(null)}
												>
													<ArrowBackIcon />
												</IconButton>
												<Typography
													variant='subtitle1'
													sx={{ml: 2, fontWeight: "bold"}}
												>
													{selectedUser.name?.first}{" "}
													{selectedUser.name?.last}
												</Typography>
											</Toolbar>
										</AppBar>
									)}
									<Box sx={{flex: 1, overflow: "hidden"}}>
										<ChatBox
											currentUser={currentUser}
											otherUser={mapUserMessageToChatBox(
												selectedUser,
											)}
											token={
												localStorage.getItem("token") as string
											}
										/>
									</Box>
								</Box>
							) : (
								<Box
									sx={{
										height: "100%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexDirection: "column",
										opacity: 0.6,
									}}
								>
									<Typography variant='h5' fontWeight='bold'>
										👋 {t("messages.selectConversation")}
									</Typography>
									<Typography variant='body2'>
										{t("messages.chooseChat")}
									</Typography>
								</Box>
							)}
						</Grid>
					)}
				</Grid>
			</Paper>
		</Box>
	);
};

export default MessagesPage;
