import {useEffect, useState, useRef, FunctionComponent} from "react";
import axios from "axios";
import {
	Box,
	Typography,
	TextField,
	IconButton,
	Paper,
	CircularProgress,
	InputAdornment,
	Fade,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import socket from "../../../socket/globalSocket";
import {useChat} from "../../../hooks/useChat";
import {ChatUser} from "../../../interfaces/chat/chatUser";
import {LocalMessage} from "../../../interfaces/chat/localMessage";
import Linkify from "./Linkify";
import handleRTL from "../../../locales/handleRTL";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const api = import.meta.env.VITE_API_URL;

interface ChatBoxProps {
	currentUser: {_id: string; name: string; email: string; role: string};
	otherUser: ChatUser;
	token: string;
}

const ChatBox: FunctionComponent<ChatBoxProps> = ({currentUser, otherUser, token}) => {
	const {messages, addMessageForUser, setMessagesForUser, setUnreadForUser} = useChat();
	const [input, setInput] = useState("");
	const [typing, setTyping] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const chatContainerRef = useRef<HTMLDivElement | null>(null);
	const userMessages = messages[otherUser._id] || [];
	const dir = handleRTL();

	const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTo({
				top: chatContainerRef.current.scrollHeight,
				behavior,
			});
		}
	};

	// עדכון סטטוס הודעות כ"נקראו" בשרת וב-Socket
	const markAsSeen = () => {
		if (!otherUser?._id || !socket) return;
		socket.emit("message:seen", {from: otherUser._id, to: currentUser._id});
		setUnreadForUser(otherUser._id, 0);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
		if (!socket) return;

		socket.emit("user:typing", {to: otherUser._id, from: currentUser._id});
		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

		typingTimeoutRef.current = setTimeout(() => {
			socket.emit("user:stopTyping", {to: otherUser._id, from: currentUser._id});
		}, 2000);
	};

	const loadConversation = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get(`${api}/messages/conversation/${otherUser._id}`, {
				headers: {Authorization: token},
			});
			setMessagesForUser(otherUser._id, res.data.messages);
			markAsSeen(); // סימון כנקרא עם טעינת השיחה
			setTimeout(() => scrollToBottom("auto"), 100);
		} catch (err) {
			console.error("Failed to load conversation:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const sendMessage = async (text: string) => {
		if (!text.trim()) return;
		const messageText = text.trim();
		const tempId = `temp-${Date.now()}`;

		const tempMessage: LocalMessage = {
			_id: tempId,
			from: currentUser,
			to: otherUser,
			message: messageText,
			status: "sent",
			createdAt: new Date().toISOString(),
		} as any;

		addMessageForUser(otherUser._id, tempMessage);
		setInput("");
		socket.emit("user:stopTyping", {to: otherUser._id, from: currentUser._id});
		setTimeout(() => scrollToBottom(), 50);

		try {
			await axios.post(
				`${api}/messages`,
				{toUserId: otherUser._id, message: messageText},
				{headers: {Authorization: token}},
			);
		} catch (err) {
			console.error("Failed to send:", err);
		}
	};

	useEffect(() => {
		loadConversation();

		socket.on("message:received", (message: LocalMessage) => {
			if (message.from._id === otherUser._id) {
				addMessageForUser(otherUser._id, message);
				scrollToBottom();
				markAsSeen();
			}
		});

		socket.on("message:sent", (message: LocalMessage) => {
			if (message.to._id === otherUser._id) {
				setMessagesForUser(otherUser._id, (prev) =>
					prev.map((m) => (m._id.startsWith("temp-") ? message : m)),
				);
			}
		});

		socket.on("user:typing", ({from}: {from: string}) => {
			if (from === otherUser._id) {
				setTyping(true);
				scrollToBottom();
			}
		});

		socket.on("user:stopTyping", ({from}: {from: string}) => {
			if (from === otherUser._id) setTyping(false);
		});

		// האזנה לעדכון סטטוס "נקרא" מהצד השני
		socket.on("messages:seen", ({by}: {by: string}) => {
			if (by === otherUser._id) {
				setMessagesForUser(otherUser._id, (prev) =>
					prev.map((m) =>
						m.from._id === currentUser._id ? {...m, status: "seen"} : m,
					),
				);
			}
		});

		return () => {
			socket.off("user:typing");
			socket.off("user:stopTyping");
			socket.off("user:received");
			socket.off("user:sent");
			socket.off("messages:seen");
		};
	}, [otherUser?._id,token]);

	useEffect(() => {
		if (userMessages.length > 0) {
			scrollToBottom();
			// אם קיבלנו הודעה חדשה בזמן שהצ'אט פתוח - נסמן כנקרא
			const lastMessage = userMessages[userMessages.length - 1];
			if (lastMessage.from._id === otherUser._id && document.hasFocus()) {
				markAsSeen();
			}
		}
	}, [userMessages.length]);

	const getStatusIcon = (status: string) => {
		if (status === "seen")
			return <DoneAllIcon sx={{fontSize: 14, color: "#4caf50"}} />;
		if (status === "delivered")
			return <DoneAllIcon sx={{fontSize: 14, color: "#2196f3"}} />;
		return <CheckIcon sx={{fontSize: 14, color: "#9e9e9e"}} />;
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// בדיקת גודל (למשל עד 5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert("הקובץ גדול מדי. מקסימום 5MB");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append("toUserId", otherUser._id);

		try {
			// שליחה לשרת (Endpoint ייעודי לקבצים)
			const res = await axios.post(`${api}/messages/upload`, formData, {
				headers: {
					Authorization: token,
					"Content-Type": "multipart/form-data",
				},
			});

			// הוספת הודעה זמנית או רענון צ'אט
			if (res.data.message) {
				addMessageForUser(otherUser._id, res.data.message);
				scrollToBottom();
			}
		} catch (err) {
			console.error("Failed to upload file:", err);
		}
	};

	return (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				bgcolor: "background.paper",
			}}
		>
			<Box
				ref={chatContainerRef}
				sx={{
					flexGrow: 1,
					overflowY: "auto",
					p: 2,
					display: "flex",
					flexDirection: "column",
					gap: 1.5,
					bgcolor: (theme) =>
						theme.palette.mode === "dark" ? "#0b141a" : "#f0f2f5",
				}}
			>
				{isLoading ? (
					<Box sx={{display: "flex", justifyContent: "center", mt: 4}}>
						<CircularProgress size={24} />
					</Box>
				) : (
					userMessages.map((msg) => {
						const isMe = msg.from._id === currentUser._id;
						const isFile = msg.fileUrl;
						return (
							<Box
								key={msg._id}
								sx={{
									alignSelf: isMe ? "flex-end" : "flex-start",
									maxWidth: "80%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Paper
									elevation={1}
									sx={{
										p: "8px 12px",
										borderRadius: isMe
											? "12px 0px 12px 12px"
											: "0px 12px 12px 12px",
										bgcolor: isMe
											? "primary.main"
											: "background.paper",
										color: isMe ? "white" : "text.primary",
									}}
								>
									{isFile ? (
										<Box
											sx={{
												display: "flex",
												flexDirection: "column",
												gap: 1,
											}}
										>
											{msg.fileType?.includes("image") ? (
												<img
													src={msg.fileUrl}
													alt='sent file'
													style={{
														maxWidth: "100%",
														borderRadius: 4,
														cursor: "pointer",
													}}
													onClick={() =>
														window.open(msg.fileUrl)
													}
												/>
											) : (
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 1,
														p: 1,
														bgcolor: "rgba(0,0,0,0.05)",
														borderRadius: 1,
													}}
												>
													<InsertDriveFileIcon />
													<Typography
														variant='caption'
														sx={{
															textDecoration: "underline",
															cursor: "pointer",
														}}
														onClick={() =>
															window.open(msg.fileUrl)
														}
													>
														צפה בקובץ
													</Typography>
												</Box>
											)}
										</Box>
									) : (
										<Typography
											variant='body1'
											sx={{
												wordBreak: "break-word",
												lineHeight: 1.4,
											}}
										>
											<Linkify text={msg.message} />
										</Typography>
									)}

									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "flex-end",
											gap: 0.5,
											mt: 0.3,
										}}
									>
										<Typography
											variant='caption'
											sx={{opacity: 0.7, fontSize: "0.6rem"}}
										>
											{new Date(msg.createdAt).toLocaleTimeString(
												[],
												{hour: "2-digit", minute: "2-digit"},
											)}
										</Typography>
										{isMe && getStatusIcon(msg.status)}
									</Box>
								</Paper>
							</Box>
						);
					})
				)}

				{typing && (
					<Fade in={typing}>
						<Box
							sx={{
								alignSelf: "flex-start",
								bgcolor: "action.hover",
								px: 1.5,
								py: 0.5,
								borderRadius: 2,
							}}
						>
							<Typography
								variant='caption'
								sx={{fontStyle: "italic", color: "text.secondary"}}
							>
								{otherUser.from.name.first} מקליד/ה...
							</Typography>
						</Box>
					</Fade>
				)}
			</Box>

			<Box
				sx={{
					p: 2,
					bgcolor: "background.paper",
					borderTop: "1px solid",
					borderColor: "divider",
				}}
			>
				<input
					type='file'
					hidden
					ref={fileInputRef}
					style={{display: "none"}}
					onChange={handleFileChange}
					accept='image/*,.pdf,.doc,.docx'
				/>

				<IconButton color='primary' onClick={() => fileInputRef.current?.click()}>
					<AttachFileIcon />
				</IconButton>

				<TextField
					fullWidth
					multiline
					maxRows={4}
					value={input}
					onChange={handleInputChange}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							sendMessage(input);
						}
					}}
					placeholder='הקלד הודעה...'
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton
									color='primary'
									onClick={() => sendMessage(input)}
									disabled={!input.trim()}
								>
									<SendIcon
										sx={{
											transform:
												dir === "rtl" ? "rotate(180deg)" : "none",
										}}
									/>
								</IconButton>
							</InputAdornment>
						),
						sx: {borderRadius: 4, bgcolor: "grey.50"},
					}}
				/>
			</Box>
		</Box>
	);
};

export default ChatBox;
