import { useState } from "react";
import {
	Grid,
	Box,
	Paper,
	Typography,
	useMediaQuery,
	useTheme,
	IconButton,
	Divider,
	Fade,
	Avatar,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ForumTwoToneIcon from "@mui/icons-material/ForumTwoTone";
import ChatList from "./ChatList";
import { UserMessage } from "../../../interfaces/usersMessages";
import handleRTL from "../../../locales/handleRTL";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { path } from "../../../routes/routes";
import { ChatMessage } from "../../../interfaces/chat/chatMessage";
import ChatBox from "./ChatBox";
import { useUser } from "../../../context/useUSer";

// eslint-disable-next-line react-refresh/only-export-components
export const mapUserMessageToChatBox = (msg: UserMessage): ChatMessage => {
	return {
		_id: msg._id ?? `temp-${Date.now()}`,
		from: {
			_id: msg.from?._id ?? "unknown",
			name: { first: msg.name?.first ?? "Unknown", last: msg.name?.last ?? "" },
			email: msg.email,
			role: msg.role,
			status: msg.from?.status ?? false,
		},
		to: {
			_id: msg.to?._id ?? "unknown",
			name: { first: msg.to?.first ?? "Unknown", last: msg.to?.last ?? "" },
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
	const { t } = useTranslation();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const { auth } = useUser();
	const dir = handleRTL();

	// הגנה על הנתיב - ב-React components משתמשים ב-Navigate ולא ב-redirect

	const currentUser = {
		_id: auth._id as string,
		name: auth.name.first,
		email: auth.email as string,
		role: auth.role as string,
	};

	if (!auth?._id) return <Navigate to={path.Login} replace />;

	const isOnline =
		selectedUser?.from?._id === currentUser._id
			? selectedUser?.to?.status
			: selectedUser?.from?.status;

	return (
		<Box
			sx={{
				height: "100dvh",
				bgcolor: theme.palette.mode === "light" ? "grey.100" : "background.default",
				p: isMobile ? 0 : 3,
				transition: "all 0.3s ease",
				direction: dir,
			}}
		>
			<Paper
				elevation={isMobile ? 0 : 5}
				sx={{
					height: "100%",
					display: "flex",
					borderRadius: isMobile ? 0 : 5,
					overflow: "hidden",
					backdropFilter: "blur(20px)",
					background:
						theme.palette.mode === "light"
							? "rgba(255,255,255,0.7)"
							: "rgba(15,23,42,0.7)",
					border: "1px solid rgba(255,255,255,0.1)",
				}}
			>
				<Grid container sx={{ height: "100%" ,width:"100%",}}>
					{/* SIDEBAR: Chat List */}
					{(!isMobile || !selectedUser) && (
						<Grid
							size={{ xs: 12, md: 6, lg: 6 }}

							sx={{
								display: "flex",
								flexDirection: "column",
								bgcolor: "background.paper",
								borderRight: dir === "ltr" ? "1px solid" : "none",
								borderLeft: dir === "rtl" ? "1px solid" : "none",
								borderColor: "divider",
							}}
						>
							<Box sx={{ p: 3, pb: 2 }}>
								<Typography variant="h5" fontWeight={900} color="primary.main" gutterBottom>
									{t("messages.title") || "Chats"}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{t("messages.subtitle") || "Recent conversations"}
								</Typography>
							</Box>

							<Divider sx={{ mx: 2, mb: 1 }} />

							<Box sx={{ flex: 1, overflowY: "auto", px: 1 }}>
								<ChatList
									currentUser={currentUser}
									token={localStorage.getItem("token") as string}
									onSelectChat={(user) => setSelectedUser(user)}
									selectedUserId={selectedUser?._id}
								/>
							</Box>
						</Grid>
					)}

					{/* MAIN: Chat Window */}
					{(!isMobile || selectedUser) && (
						<Grid
							size={{ xs: 12, md: 6, lg: 6 }}

							sx={{
								height: "100%",
								bgcolor:
									theme.palette.mode === "light"
										? "linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%)"
										: "linear-gradient(135deg, #0f172a 0%, #020617 100%)", position: "relative",
							}}
						>
							{selectedUser ? (
								<Fade in={!!selectedUser} timeout={400}>
									<Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
										{/* Dynamic Header */}
										<Box
											sx={{
												p: 2,
												display: "flex",
												alignItems: "center",
												bgcolor: "background.paper",
												boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
												zIndex: 2,
											}}
										>
											{isMobile && (
												<IconButton onClick={() => setSelectedUser(null)} sx={{ mr: 1 }}>
													<ArrowBackIosNewIcon fontSize="small" />
												</IconButton>
											)}
											<Avatar
												sx={{
													width: 40,
													height: 40,
													bgcolor: "secondary.main",
													fontSize: "1rem"
												}}
											>
												{selectedUser.name?.first?.[0]}
											</Avatar>
											<Box sx={{ ml: 2 }}>
												<Typography variant="subtitle1" fontWeight={700}>
													{selectedUser.name?.first} {selectedUser.name?.last}
												</Typography>
												{isOnline ? (

													<Typography variant="caption" color="success.main">
														● Online
													</Typography>
												) : <Typography variant="caption" color="error.main">
													● Offline
												</Typography>}
											</Box>
										</Box>

										{/* Chat Area */}
										<Box sx={{ flex: 1, overflow: "hidden", position: "relative" }}>
											<ChatBox
												currentUser={currentUser}
												otherUser={mapUserMessageToChatBox(selectedUser)}
												token={localStorage.getItem("token") as string}
											/>
										</Box>
									</Box>
								</Fade>
							) : (
								/* Empty State */
								<Box
									sx={{
										height: "100%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexDirection: "column",
										textAlign: "center",
										p: 3,
									}}
								>
									<Box
										sx={{
											bgcolor: "primary.light",
											background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
											p: 4,
											borderRadius: "50%",
											mb: 3,
											color: "white",
											boxShadow: "0 10px 30px rgba(99,102,241,0.3)",
										}}
									>
										<ForumTwoToneIcon sx={{ fontSize: 60, color: "primary.main" }} />
									</Box>
									<Typography variant="h5" fontWeight={700} gutterBottom>
										{t("messages.welcome") || "Your Inbox"}
									</Typography>
									<Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
										{t("messages.chooseChat") || "Select a conversation from the list to start messaging."}
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
