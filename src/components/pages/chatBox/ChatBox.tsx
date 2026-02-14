import {useEffect, useState, useRef, FunctionComponent} from "react";
import axios from "axios";
import {
	Box,
	Typography,
	TextField,
	IconButton,
	Badge,
	Paper,
	Avatar,
	Divider,
	Tooltip,
	Zoom,
	Fade,
	CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import socket from "../../../socket/globalSocket";
import {useChat} from "../../../hooks/useChat";
import {ChatUser} from "../../../interfaces/chat/chatUser";
import {LocalMessage} from "../../../interfaces/chat/localMessage";
import Linkify from "./Linkify";
import handleRTL from "../../../locales/handleRTL";

const api = import.meta.env.VITE_API_URL;

export interface ChatMessage {
	_id: string;
	message: string;
	from: {
		_id: string;
		name: {
			first: string;
			last: string;
		};
		role: string;
		email: string;
	};
	to: {
		_id: string;
		name: {
			first: string;
			last: string;
		};
		role: string;
		email: string;
	};
	createdAt: string;
	status: string;
}

interface ChatBoxProps {
	currentUser: {_id: string; name: string; email: string; role: string};
	otherUser: ChatUser;
	token: string;
}

const ChatBox: FunctionComponent<ChatBoxProps> = ({currentUser, otherUser, token}) => {
	const {
		messages,
		addMessageForUser,
		setMessagesForUser,
		unreadCounts,
		setUnreadForUser,
	} = useChat();
	const [input, setInput] = useState("");
	const [typing, setTyping] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const chatContainerRef = useRef<HTMLDivElement | null>(null);

	const userMessages = messages[otherUser._id] || [];
	const unreadCount = unreadCounts[otherUser._id] || 0;

	const loadConversation = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get(`${api}/messages/conversation/${otherUser._id}`, {
				headers: {Authorization: token},
			});
			setMessagesForUser(otherUser._id, res.data.messages);
			setUnreadForUser(otherUser._id, res.data.unreadCount || 0);
			// setTimeout(() => scrollToBottom("auto"), 100);
		} catch (err) {
			console.error("Failed to load conversation:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const sendMessage = async (text?: string) => {
		if (!text?.trim()) return;

		const messageText = text.trim();

		const tempId = `temp-${Date.now()}`;

		const tempMessage: LocalMessage = {
			_id: tempId,
			from: currentUser,
			to: otherUser,
			message: messageText,
			status: "sent",
			warning: false,
			isImportant: false,
			replyTo: null,
			createdAt: new Date().toISOString(),
		};

		addMessageForUser(otherUser._id, tempMessage);
		setInput("");

		try {
			await axios.post(
				`${api}/messages`,
				{toUserId: otherUser._id, message: messageText},
				{headers: {Authorization: token}},
			);
		} catch (err) {
			console.error("Failed to send message:", err);
		}
	};

	// Typing indicator
	useEffect(() => {
		if (!socket) return;

		if (input.trim()) {
			socket.emit("typing", {to: otherUser._id, from: currentUser._id});
			if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
			typingTimeoutRef.current = setTimeout(() => {
				socket?.emit("stopTyping", {
					to: otherUser._id,
					from: currentUser._id,
				});
			}, 1000);
		} else {
			socket.emit("stopTyping", {
				to: otherUser._id,
				from: currentUser._id,
			});
		}
	}, [input, otherUser._id, currentUser._id]);

	useEffect(() => {
		if (!currentUser || !otherUser) return;

		loadConversation();

		const handleIncoming = (msg: LocalMessage) => {
			if (
				(msg.from._id === otherUser._id && msg.to._id === currentUser._id) ||
				(msg.from._id === currentUser._id && msg.to._id === otherUser._id)
			) {
				setMessagesForUser(otherUser._id, (prev) => {
					const withoutTemp = prev.filter(
						(m) => !m._id.startsWith("temp-") || m.message !== msg.message,
					);

					return [...withoutTemp, msg];
				});

				if (msg.to._id === currentUser._id) {
					socket.emit("message:seen", {
						to: msg.from._id,
						messageIds: [msg._id],
					});
				}

				// scrollToBottom();
			}
		};

		const handleConnect = () => loadConversation();

		const handleMessageSeen = ({
			by,
			messageIds,
		}: {
			by: string;
			messageIds: string[];
		}) => {
			if (by === otherUser._id) {
				setUnreadForUser(otherUser._id, 0);
				setMessagesForUser(otherUser._id, (prev) =>
					prev.map((msg) => {
						if (
							msg.from._id === currentUser._id &&
							messageIds.includes(msg._id)
						) {
							return {...msg, status: "seen"};
						}
						if (msg.from._id === otherUser._id) {
							return {...msg, status: "seen"};
						}
						return msg;
					}),
				);
			}
		};

		// استقبل حدث read
		socket.on("messages:read", handleMessageSeen);
		socket.on("connect", handleConnect);
		socket.on("message:received", handleIncoming);
		socket.on("message:seen", handleMessageSeen);
		socket.on("user:typing", ({from}: {from: string}) => {
			if (from === otherUser._id) setTyping(true);
		});
		socket.on("user:stopTyping", ({from}: {from: string}) => {
			if (from === otherUser._id) setTyping(false);
		});

		return () => {
			socket.off("connect", handleConnect);
			socket.off("message:received", handleIncoming);
			socket.off("message:seen", handleMessageSeen);
			socket.off("messages:read", handleMessageSeen);
			socket.off("user:typing");
			socket.off("user:stopTyping");
		};
	}, [currentUser?._id, otherUser?._id]);

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "seen":
				return (
					<span style={{color: "#4caf50"}}>
						<DoneAllIcon sx={{fontSize: 14}} />
					</span>
				);
			case "delivered":
				return (
					<span style={{color: "#2196f3"}}>
						<DoneAllIcon sx={{fontSize: 14}} />
					</span>
				);
			case "sent":
				return (
					<span style={{color: "#9e9e9e"}}>
						<CheckIcon sx={{fontSize: 14}} />
					</span>
				);
			default:
				return (
					<span style={{color: "#9e9e9e"}}>
						<CheckIcon sx={{fontSize: 14}} />
					</span>
				);
		}
	};

	const formatMessageTime = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const isToday = date.toDateString() === now.toDateString();

		if (isToday) {
			return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
		}
		return (
			date.toLocaleDateString([], {month: "short", day: "numeric"}) +
			" " +
			date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
		);
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
	}, [messages]);

	// const dir = handleRTL();

	return (
		<Paper
			elevation={3}
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderRadius: 2,
				overflow: "hidden",
			}}
		>
			{/* Header */}
			<Box
				sx={{
					p: 2,
					display: "flex",
					alignItems: "center",
					borderBottom: 1,
					borderColor: "divider",
					backgroundColor: "background.paper",
				}}
			>
				<Badge color='success' variant='dot' sx={{mr: 1.5}}>
					<Avatar
						sx={{
							width: 40,
							height: 40,
							bgcolor: "primary.main",
							fontWeight: "bold",
						}}
					>
						{otherUser.from.name.first.charAt(0).toUpperCase()}
						{otherUser.from.name.last.charAt(0).toUpperCase()}
					</Avatar>
				</Badge>
			</Box>

			{/* Messages Container */}
			<Box
				ref={chatContainerRef}
				sx={{
					flexGrow: 1,
					overflowY: "auto",
					p: 2,
					backgroundColor: "#f5f5f5",
					backgroundImage:
						"radial-gradient(circle at 25% 25%, rgba(0,0,0,0.02) 2%, transparent 2%)",
					backgroundSize: "30px 30px",
					zIndex: 100000,
				}}
			>
				{isLoading ? (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
						}}
					>
						<CircularProgress />
					</Box>
				) : (
					<>
						{userMessages.length === 0 ? (
							<Fade in={true}>
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										height: "100%",
										color: "text.secondary",
									}}
								>
									<Typography variant='body2' sx={{mb: 1}}>
										👋 No messages yet
									</Typography>
									<Typography variant='caption'>
										Send a message to start the conversation
									</Typography>
								</Box>
							</Fade>
						) : (
							userMessages.map((msg, index) => {
								const isCurrentUser = msg.from._id === currentUser._id;
								const showAvatar =
									index === 0 ||
									userMessages[index - 1]?.from._id !== msg.from._id;

								return (
									<Fade in={true} key={msg._id}>
										<Box
											sx={{
												display: "flex",
												justifyContent: isCurrentUser
													? "flex-end"
													: "flex-start",
												mb: 1.5,
											}}
										>
											{!isCurrentUser && showAvatar && (
												<Avatar
													sx={{
														width: 28,
														height: 28,
														m: 1,
														bgcolor: "secondary.main",
														fontSize: 14,
													}}
												>
													{otherUser.from.name.first?.charAt(0)}
												</Avatar>
											)}
											<Box
												sx={{
													display: "flex",
													maxWidth: "70%",
													alignItems: "flex-end",
												}}
											>
												<Box sx={{flexGrow: 1}}>
													{msg.replyTo && (
														<Paper
															elevation={1}
															sx={{
																p: 0.5,
																mb: 0.5,
																backgroundColor:
																	"grey.300",
																borderRadius: 1,
																opacity: 0.8,
															}}
														>
															<Typography
																variant='caption'
																noWrap
															>
																↪ {msg.replyTo.message}
															</Typography>
														</Paper>
													)}

													<Tooltip
														title={new Date(
															msg.createdAt,
														).toLocaleString()}
														placement={
															isCurrentUser
																? "left"
																: "right"
														}
														TransitionComponent={Zoom}
													>
														<Paper
															elevation={2}
															sx={{
																p: 1.5,
																borderRadius: 2,
																backgroundColor:
																	isCurrentUser
																		? "primary.main"
																		: "background.paper",
																color: isCurrentUser
																	? "white"
																	: "text.primary",
																position: "relative",
																wordBreak: "break-word",
															}}
														>
															<Linkify text={msg.message} />
														</Paper>
													</Tooltip>

													<Box
														sx={{
															display: "flex",
															justifyContent: isCurrentUser
																? "flex-end"
																: "flex-start",
															alignItems: "center",
															mt: 0.5,
															gap: 0.5,
														}}
													>
														<Typography
															variant='caption'
															color='text.secondary'
														>
															{formatMessageTime(
																msg.createdAt,
															)}
														</Typography>
														{isCurrentUser &&
															getStatusIcon(msg.status)}
													</Box>
												</Box>
											</Box>
										</Box>
									</Fade>
								);
							})
						)}

						{/* Typing indicator */}
						{typing && (
							<Fade in={true}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										mt: 1,
										zIndex: 100000,
									}}
								>
									<Avatar
										sx={{
											width: 24,
											height: 24,
											mr: 1,
											bgcolor: "secondary.main",
											fontSize: 12,
										}}
									>
										{otherUser.from.name.first?.charAt(0)}
									</Avatar>
									<Paper
										sx={{
											p: 1,
											borderRadius: 2,
											backgroundColor: "grey.100",
										}}
									>
										<Box sx={{display: "flex", gap: 0.5}}>
											<Box
												sx={{
													width: 6,
													height: 6,
													bgcolor: "text.secondary",
													borderRadius: "50%",
													animation: "pulse 1.5s infinite",
												}}
											/>
											<Box
												sx={{
													width: 6,
													height: 6,
													bgcolor: "text.secondary",
													borderRadius: "50%",
													animation: "pulse 1.5s infinite",
													animationDelay: "0.2s",
												}}
											/>
											<Box
												sx={{
													width: 6,
													height: 6,
													bgcolor: "text.secondary",
													borderRadius: "50%",
													animation: "pulse 1.5s infinite",
													animationDelay: "0.4s",
												}}
											/>
										</Box>
									</Paper>
								</Box>
							</Fade>
						)}
						<div ref={messagesEndRef} />
					</>
				)}
			</Box>

			{/* Input Area */}
			<Divider />
			<Box
				sx={{
					p: 2,
					backgroundColor: "background.paper",
					borderTop: 1,
					borderColor: "divider",
					zIndex: 100000,
				}}
			>
				<Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
					<IconButton size='small' sx={{color: "text.secondary"}}>
						<AttachFileIcon />
					</IconButton>

					<IconButton size='small' sx={{color: "text.secondary"}}>
						<InsertEmoticonIcon />
					</IconButton>

					<TextField
						fullWidth
						placeholder='Type a message...'
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
						size='small'
						variant='outlined'
						sx={{
							"& .MuiOutlinedInput-root": {
								borderRadius: 3,
								backgroundColor: "#f5f5f5",
							},
						}}
					/>

					<IconButton
						color='primary'
						onClick={() => sendMessage(input)}
						disabled={!input.trim()}
						sx={{
							backgroundColor: "primary.main",
							color: "white",
							"&:hover": {
								backgroundColor: "primary.dark",
							},
							"&:disabled": {
								backgroundColor: "grey.300",
								color: "grey.500",
							},
						}}
					>
						<SendIcon />
					</IconButton>
				</Box>
			</Box>

			{/* CSS Animation */}
			<style>
				{`
					@keyframes pulse {
						0%, 100% { opacity: 0.4; }
						50% { opacity: 1; }
					}
				`}
			</style>
		</Paper>
	);
};

export default ChatBox;
