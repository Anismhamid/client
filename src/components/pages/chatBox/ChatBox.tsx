import {useEffect, useState, useRef, FunctionComponent} from "react";
import axios from "axios";
import {Box, Typography, TextField, IconButton, Badge, Paper} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import socket from "../../../socket/globalSocket";
import {useChat} from "../../../hooks/useChat";
import {UserMessage} from "../../../interfaces/usersMessages";

const api = import.meta.env.VITE_API_URL;

export type LocalMessage = {
	_id: string;
	from: {_id: string; name: string; email: string; role: string};
	to: UserMessage;
	message: string;
	warning: boolean;
	isImportant: boolean;
	replyTo?: LocalMessage | null;
	status: "sent" | "delivered" | "seen";
	createdAt: string;
};

interface ChatBoxProps {
	currentUser: {_id: string; name: string; email: string; role: string};
	otherUser: UserMessage;
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

	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const userMessages = messages[otherUser._id as string] || [];
	const unreadCount = unreadCounts[otherUser._id as string] || 0;

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
	};

	const loadConversation = async () => {
		try {
			const res = await axios.get(`${api}/messages/conversation/${otherUser._id}`, {
				headers: {Authorization: token},
			});
			setMessagesForUser(otherUser._id as string, res.data.messages);
			setUnreadForUser(otherUser._id as string, res.data.unreadCount || 0);
			setTimeout(scrollToBottom, 100);
		} catch (err) {
			console.error("Failed to load conversation:", err);
		}
	};

	// const sendMessage = async (text?: string) => {
	// 	if (!socket.connected || !text?.trim()) return;

	// 	const messageText = text.trim();

	// 	const tempMessage: LocalMessage = {
	// 		_id: `temp-${Date.now()}`,
	// 		from: currentUser,
	// 		to: otherUser,
	// 		message: messageText,
	// 		status: "sent",
	// 		warning: false,
	// 		isImportant: false,
	// 		replyTo: null,
	// 		createdAt: new Date().toISOString(),
	// 	};

	// 	addMessageForUser(otherUser._id as string, tempMessage);
	// 	setInput("");
	// 	scrollToBottom();

	// 	// socket.emit("send:message", {
	// 	// 	toUserId: otherUser._id,
	// 	// 	message: messageText,
	// 	// });

	// 	try {
	// 		const res = await axios.post(
	// 			`${api}/messages`,
	// 			{toUserId: otherUser._id, message: messageText},
	// 			{headers: {Authorization: token}},
	// 		);

	// 		setMessagesForUser(otherUser._id as string, (prev) =>
	// 			prev.map((m) => (m._id === tempMessage._id ? res.data : m)),
	// 		);
	// 	} catch (err) {
	// 		console.error("Failed to send message:", err);
	// 	}
	// };

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

		addMessageForUser(otherUser._id as string, tempMessage);
		setInput("");
		scrollToBottom();

		try {
			await axios.post(
				`${api}/messages`,
				{toUserId: otherUser._id, message: messageText},
				{headers: {Authorization: token}},
			);

			// ❌ لا تعمل replace هنا
			// لأن realtime سيصل من السيرفر
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
	}, [input]);

	// Initialize socket listeners
	useEffect(() => {
		if (!currentUser || !otherUser) return;

		// socket.current = socket;
		loadConversation();

		const handleIncoming = (msg: LocalMessage) => {
			if (
				(msg.from._id === otherUser._id && msg.to._id === currentUser._id) ||
				(msg.from._id === currentUser._id && msg.to._id === otherUser._id)
			) {
				setMessagesForUser(otherUser._id as string, (prev) => {
					const withoutTemp = prev.filter(
						(m) => !m._id.startsWith("temp-") || m.message !== msg.message,
					);

					return [...withoutTemp, msg];
				});

				if (msg.to._id === currentUser._id) {
					setUnreadForUser(otherUser._id as string, (prev) => prev + 1);
				}

				scrollToBottom();
			}
		};

		const handleConnect = () => loadConversation();

		socket.on("connect", handleConnect);
		socket.on("message:received", handleIncoming);
socket.on("message:seen", ({by}: {by: string}) => {
	if (by === otherUser._id) {
		// تحديث عدد الرسائل غير المقروءة
		setUnreadForUser(otherUser._id, 0);

		// ✅ تحديث حالة كل الرسائل المرسلة إلى "seen"
		setMessagesForUser(otherUser._id, (prev) =>
			prev.map((msg) =>
				msg.from._id === currentUser._id ? {...msg, status: "seen"} : msg,
			),
		);
	}
});


		socket.on("user:typing", ({from}: {from: string}) => {
			if (from === otherUser._id) setTyping(true);
		});
		socket.on("user:stopTyping", ({from}: {from: string}) => {
			if (from === otherUser._id) setTyping(false);
		});

		return () => {
			socket.off("connect", handleConnect);
			socket.off("message:received", handleIncoming);
			socket.off("message:seen");
			socket.off("user:typing");
			socket.off("user:stopTyping");
		};
	}, [currentUser, otherUser]);

	return (
		<Paper sx={{p: 2, height: "100%", display: "flex", flexDirection: "column"}}>
			<Typography variant='h6' gutterBottom>
				Chat with {otherUser.from.first} {otherUser.from.last}
				<Badge
					color='primary'
					badgeContent={unreadCount}
					invisible={unreadCount === 0}
				/>
			</Typography>

			<Box sx={{flexGrow: 1, overflowY: "auto", mb: 2}}>
				{userMessages.map((msg) => (
					<Box
						key={msg._id}
						sx={{
							display: "flex",
							justifyContent:
								msg.from._id === currentUser._id
									? "flex-end"
									: "flex-start",
							mb: 1,
						}}
					>
						<Paper
							sx={{
								p: 1,
								maxWidth: "70%",
								backgroundColor:
									msg.from._id === currentUser._id
										? "primary.light"
										: "grey.200",
							}}
						>
							{msg.replyTo && (
								<Paper
									sx={{p: 0.5, mb: 0.5, backgroundColor: "grey.300"}}
								>
									<Typography variant='caption' noWrap>
										{msg.replyTo.message}
									</Typography>
								</Paper>
							)}
							<Typography>{msg.message}</Typography>
							<Typography
								variant='caption'
								color={msg.status === "seen" ? "green" : ""}
								sx={{display: "block", textAlign: "right"}}
							>
								{new Date(msg.createdAt).toLocaleTimeString()}{" "}
								{msg.status === "seen" && "✓✓"}
							</Typography>
						</Paper>
					</Box>
				))}
				<div ref={messagesEndRef} />
			</Box>

			{typing && (
				<Typography variant='caption'>
					{otherUser.from.first} is typing...
				</Typography>
			)}

			<Box sx={{display: "flex", mt: 1}}>
				<TextField
					fullWidth
					placeholder='Type a message...'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
				/>
				<IconButton onClick={() => sendMessage(input)}>
					<SendIcon />
				</IconButton>
			</Box>
		</Paper>
	);
};

export default ChatBox;
