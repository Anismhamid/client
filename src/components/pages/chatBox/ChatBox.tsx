import {useEffect, useState, useRef, FunctionComponent, useLayoutEffect} from "react";
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
	Zoom,
	Fab,
	Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import socket from "../../../socket/globalSocket";
import {useChat} from "../../../hooks/useChat";
import {ChatUser} from "../../../interfaces/chat/chatUser";
import {LocalMessage} from "../../../interfaces/chat/localMessage";
import Linkify from "./Linkify";
import handleRTL from "../../../locales/handleRTL";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {useTranslation} from "react-i18next";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
	formatMessageTime,
	getStatusIcon,
	handleScroll,
	scrollToBottom,
} from "./helpers/functions";

const api = import.meta.env.VITE_API_URL;

interface ChatBoxProps {
	currentUser: {_id: string; name: string; email: string; role: string; image?: string};
	otherUser: ChatUser;
	token: string;
}

const ChatBox: FunctionComponent<ChatBoxProps> = ({currentUser, otherUser, token}) => {
	const {messages, addMessageForUser, setMessagesForUser, setUnreadForUser} = useChat();
	const [input, setInput] = useState("");
	const [typing, setTyping] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [isFetchingMore, setIsFetchingMore] = useState(false);

	const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const chatContainerRef = useRef<HTMLDivElement | null>(null);
	const userMessages = messages[otherUser._id] || [];
	const dir = handleRTL();
	const {t} = useTranslation();

	const lastScrollHeightRef = useRef<number>(0);

	// const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
	// 	if (chatContainerRef.current) {
	// 		chatContainerRef.current.scrollTo({
	// 			top: chatContainerRef.current.scrollHeight,
	// 			behavior,
	// 		});
	// 	}
	// };

	const [showScrollBtn, setShowScrollBtn] = useState(false);
	// const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
	// 	const {scrollTop, scrollHeight, clientHeight} = e.currentTarget;

	// 	// 1. Pagination logic (Top of chat)
	// 	if (scrollTop === 0 && hasMore && !isFetchingMore) {
	// 		loadConversation(false);
	// 	}

	// 	// 2. Scroll Button logic (Bottom of chat)
	// 	// Show button if we are more than 400px away from the bottom
	// 	const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
	// 	setShowScrollBtn(distanceFromBottom > 400);
	// };

	// עדכון סטטוס הודעות כ"נקראו" בשרת וב-Socket
	const markAsSeen = () => {
		if (!otherUser?._id || !socket) return;
		socket.emit("message:seen", {
			from: otherUser._id,
			to: currentUser._id,
			roomId: [otherUser._id, currentUser._id].sort().join("_"),
		});
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

	const loadConversation = async (isInitial = true) => {
		if (isInitial) setIsLoading(true);
		else setIsFetchingMore(true);

		setIsLoading(true);
		try {
			const skip = isInitial ? 0 : userMessages.length;
			const res = await axios.get(
				`${api}/messages/conversation/${otherUser._id}?limit=20&skip=${skip}`,
				{
					headers: {Authorization: token},
				},
			);

			// if (!isInitial && chatContainerRef.current) {
			// 	lastScrollHeightRef.current = chatContainerRef.current.scrollHeight;
			// }

			const fetchedMessages = res.data.messages;

			if (isInitial) {
				setMessagesForUser(otherUser._id, fetchedMessages);
				setTimeout(() => scrollToBottom("smooth", chatContainerRef), 100);
			} else {
				if (chatContainerRef.current) {
					lastScrollHeightRef.current = chatContainerRef.current.scrollHeight;
				}

				// Prepend old messages to the top
				setMessagesForUser(otherUser._id, (prev) => [
					...fetchedMessages,
					...prev,
				]);
			}

			markAsSeen();
			setHasMore(res.data.hasMore);
		} catch (err) {
			console.error("Pagination error:", err);
		} finally {
			setIsLoading(false);
			setIsFetchingMore(false);
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
		setTimeout(() => scrollToBottom("smooth", chatContainerRef), 50);

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

	useLayoutEffect(() => {
		const container = chatContainerRef.current;

		if (container && isFetchingMore && lastScrollHeightRef.current > 0) {
			// Calculate how much the height increased
			const heightDifference = container.scrollHeight - lastScrollHeightRef.current;

			// Adjust the scroll position so the user stays on the same message
			container.scrollTop = heightDifference;

			// Reset the ref
			lastScrollHeightRef.current = 0;
		}
	}, [userMessages, isFetchingMore]); // Trigger this whenever messages change

	useEffect(() => {
		loadConversation();

		socket.on("message:received", (message: LocalMessage) => {
			if (message.from._id === otherUser._id) {
				addMessageForUser(otherUser._id, message);
				scrollToBottom("smooth", chatContainerRef);
				markAsSeen();
			}
		});

		socket.on("message:sent", (message: LocalMessage) => {
			if (message.to._id === otherUser._id) {
				setMessagesForUser(otherUser._id, (prev) =>
					prev.map((m) =>
						m._id.startsWith("temp-") ? {...message, status: "delivered"} : m,
					),
				);
			}
		});

		socket.on("user:typing", ({from}: {from: string}) => {
			if (from === otherUser._id) {
				setTyping(true);
				scrollToBottom("smooth", chatContainerRef);
			}
		});

		socket.on("user:stopTyping", ({from}: {from: string}) => {
			if (from === otherUser._id) setTyping(false);
		});

		// האזנה לעדכון סטטוס "נקרא" מהצד השני
		socket.on("message:seen", ({by}: {by: string}) => {
			if (by === otherUser._id) {
				setMessagesForUser(otherUser._id, (prev) =>
					prev.map((m) =>
						m.from._id === currentUser._id ? {...m, status: "seen"} : m,
					),
				);
			}
		});

		return () => {
			socket.off("message:received");
			socket.off("message:sent");
			socket.off("message:seen");
			socket.off("user:typing");
			socket.off("user:stopTyping");
		};
	}, [otherUser?._id, token]);

	useEffect(() => {
		if (userMessages.length > 0) {
			const lastMessage = userMessages[userMessages.length - 1];
			// If the last message is from the OTHER user and I am currently looking at the chat
			if (lastMessage.from._id === otherUser._id && lastMessage.status !== "seen") {
				markAsSeen();
				// Also call the API to persist this in the DB
				axios.patch(
					`${api}/messages/mark-as-seen/${otherUser._id}`,
					{},
					{
						headers: {Authorization: token},
					},
				);
			}
		}
	}, [userMessages.length, otherUser._id]);

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
				scrollToBottom("smooth", chatContainerRef);
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
				onScroll={(e) =>
					handleScroll(
						e,
						loadConversation,
						hasMore,
						isFetchingMore,
						setShowScrollBtn,
					)
				}
				sx={{
					flexGrow: 1,
					overflowY: "auto",
					p: 2,
					display: "flex",
					flexDirection: "column",
					gap: 1.5,
					overflowAnchor: "auto",
					bgcolor: (theme) =>
						theme.palette.mode === "dark" ? "#0b141a" : "#f0f2f5",
				}}
			>
				{/* TOP SPINNER: Shown when fetching older messages */}
				{isFetchingMore && (
					<Box sx={{display: "flex", justifyContent: "center", py: 1}}>
						<CircularProgress size={20} />
					</Box>
				)}

				{isLoading && !isFetchingMore ? (
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
									maxWidth: "100%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Box sx={{display: "flex", mb: 1}}>
									{!isMe && (
										<Avatar
											src={otherUser.from.image?.url || ""}
											sx={{
												width: 30,
												height: 30,
												fontSize: "0.9rem",
												bgcolor: "primary.main",
											}}
										>
											{`${otherUser.from.name.first[0]}.${otherUser.from.name.last[0]}`}
										</Avatar>
									)}
								</Box>
								<Paper
									elevation={1}
									sx={{
										p: "8px 12px",
										minWidth: "80px",
										borderRadius: isMe
											? "12px 0px 12px 12px"
											: "0px 12px 12px 12px",
										bgcolor: isMe
											? "primary.main"
											: "background.paper",
										color: isMe ? "white" : "success",
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
										<Typography variant='caption'>
											{formatMessageTime(msg.createdAt)}
										</Typography>
										{isMe && getStatusIcon(msg.status)}
									</Box>
									{msg.fileUrl && (
										<img
											src={msg.fileUrl}
											style={{
												minHeight: "70px",
												width: "70px",
												objectFit: "cover",
											}}
										/>
									)}
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
								{otherUser.from.name.first} {t("common.typing")}
							</Typography>
						</Box>
					</Fade>
				)}

				{/* SCROLL BUTTON */}
				<Zoom in={showScrollBtn}>
					<Fab
						color='primary'
						size='small'
						onClick={() => scrollToBottom("smooth", chatContainerRef)}
						sx={{
							position: "absolute",
							bottom: 50, // Above the text input area
							right: dir === "rtl" ? "auto" : 20,
							left: dir === "rtl" ? 20 : "auto",
							zIndex: 10,
							boxShadow: 3,
						}}
					>
						<ArrowDownwardIcon />
					</Fab>
				</Zoom>
			</Box>

			{/* Input Area */}
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
					onChange={handleFileChange}
					accept='image/*,.pdf,.doc,.docx'
				/>

				<Box sx={{display: "flex", alignItems: "center", gap: 1}}>
					<IconButton
						color='primary'
						onClick={() => fileInputRef.current?.click()}
					>
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
													dir === "rtl"
														? "rotate(180deg)"
														: "none",
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
		</Box>
	);
};

export default ChatBox;
