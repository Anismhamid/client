import {useEffect, useState, FunctionComponent, useMemo, Fragment} from "react";
import axios from "axios";
import {
	Box,
	Paper,
	Typography,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Badge,
	TextField,
	InputAdornment,
	Divider,
	CircularProgress,
	Tab,
	Tabs,
  ListItemButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import socket from "../../../socket/globalSocket";
import {UserMessage} from "../../../interfaces/usersMessages";
import { LocalMessage } from "./ChatBox";

const api = import.meta.env.VITE_API_URL;

interface ChatListProps {
	currentUser: {_id: string; name: string; email: string; role: string};
	token: string;
	onSelectChat: (user: UserMessage) => void;
	selectedUserId?: LocalMessage;
}

interface Conversation {
	user: UserMessage;
	lastMessage: {
		message: string;
		createdAt: string;
		from: string;
		status?: string;
	};
	unreadCount: number;
}

const ChatList: FunctionComponent<ChatListProps> = ({
	currentUser,
	token,
	onSelectChat,
	selectedUserId,
}) => {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filter, setFilter] = useState<"all" | "unread">("all");

	const loadConversations = async () => {
		try {
			setLoading(true);
			const res = await axios.get(`${api}/messages/conversations`, {
				headers: {Authorization: token},
			});

			const formatted: Conversation[] = res.data.conversations.map((conv: any) => ({
				user: conv.user,
				lastMessage: conv.lastMessage,
				unreadCount: conv.unreadCount || 0,
			}));

			setConversations(formatted);
		} catch (err) {
			console.error("Failed to load conversations:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!currentUser) return;

		loadConversations();

		const handleNewMessage = (msg: any) => {
			setConversations((prev: Conversation[]) => {
				const existingIndex = prev.findIndex(
					(conv) =>
						conv.user._id === msg.from._id || conv.user._id === msg.to._id,
				);

				const otherUser = msg.from._id === currentUser._id ? msg.to : msg.from;

				const newConv: Conversation = {
					user: otherUser,
					lastMessage: {
						message: msg.message,
						createdAt: msg.createdAt,
						from: msg.from._id,
						status: msg.status,
					},
					unreadCount: msg.from._id !== currentUser._id ? 1 : 0,
				};

				if (existingIndex !== -1) {
					const updated = [...prev];
					const existing = updated[existingIndex];

					const newUnreadCount =
						msg.from._id !== currentUser._id
							? (existing.unreadCount || 0) + 1
							: existing.unreadCount;

					updated[existingIndex] = {
						...existing,
						lastMessage: newConv.lastMessage,
						unreadCount: newUnreadCount,
					};

					return updated.sort(
						(a, b) =>
							new Date(b.lastMessage.createdAt).getTime() -
							new Date(a.lastMessage.createdAt).getTime(),
					);
				} else {
					return [newConv, ...prev];
				}
			});
		};

		const handleMessageSeen = ({
			by,
			messageIds,
		}: {
			by: string;
			messageIds: string[];
		}) => {
			setConversations((prev: Conversation[]) =>
				prev.map((conv) =>
					conv.user._id === by ? {...conv, unreadCount: 0} : conv,
				),
			);
		};

		socket.on("message:received", handleNewMessage);
		socket.on("message:seen", handleMessageSeen);

		return () => {
			socket.off("message:received", handleNewMessage);
			socket.off("message:seen", handleMessageSeen);
		};
	}, [currentUser]);

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m`;
		if (diffHours < 24) return `${diffHours}h`;
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays}d`;
		return date.toLocaleDateString([], {month: "short", day: "numeric"});
	};

	const filteredConversations = useMemo(() => {
		return conversations
			.filter((conv) => {
				const firstName = conv.user.from?.first ?? "";
				const lastName = conv.user.from?.last ?? "";
				const searchMatch =
					firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					`${firstName} ${lastName}`
						.toLowerCase()
						.includes(searchTerm.toLowerCase());

				const unreadMatch =
					filter === "all" || (filter === "unread" && conv.unreadCount > 0);

				return searchMatch && unreadMatch;
			})
			.sort(
				(a, b) =>
					new Date(b.lastMessage.createdAt).getTime() -
					new Date(a.lastMessage.createdAt).getTime(),
			);
	}, [conversations, searchTerm, filter]);

	const getStatusIcon = (status?: string, from?: string) => {
		if (from === currentUser._id) {
			switch (status) {
				case "seen":
					return <DoneAllIcon sx={{fontSize: 14, color: "#4caf50"}} />;
				case "delivered":
					return <DoneAllIcon sx={{fontSize: 14, color: "#2196f3"}} />;
				default:
					return <CheckIcon sx={{fontSize: 14, color: "#9e9e9e"}} />;
			}
		}
		return null;
	};

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
			<Box sx={{p: 2, borderBottom: 1, borderColor: "divider"}}>
				<Typography variant='h6' sx={{fontWeight: 600}}>
					Messages
				</Typography>

				<TextField
					fullWidth
					size='small'
					placeholder='Search conversations...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					sx={{mt: 1}}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SearchIcon fontSize='small' />
							</InputAdornment>
						),
					}}
				/>

				<Tabs
					value={filter}
					onChange={(_, val) => setFilter(val)}
					sx={{mt: 1, minHeight: 40}}
				>
					<Tab label='All' value='all' sx={{minHeight: 40, py: 0}} />
					<Tab label='Unread' value='unread' sx={{minHeight: 40, py: 0}} />
				</Tabs>
			</Box>

			{/* Conversations List */}
			<Box sx={{flexGrow: 1, overflowY: "auto", bgcolor: "#fafafa"}}>
				{loading ? (
					<Box sx={{display: "flex", justifyContent: "center", py: 4}}>
						<CircularProgress />
					</Box>
				) : filteredConversations.length === 0 ? (
					<Box sx={{textAlign: "center", py: 4, px: 2}}>
						<Typography color='text.secondary' gutterBottom>
							{searchTerm
								? "No conversations found"
								: "No conversations yet"}
						</Typography>
						<Typography variant='caption' color='text.secondary'>
							{searchTerm
								? "Try a different search term"
								: "Start a conversation by messaging someone"}
						</Typography>
					</Box>
				) : (
					<List sx={{p: 0}}>
						{filteredConversations.map((conv) => {
							const isSelected = selectedUserId === conv.user._id;

							return (
								<Fragment key={conv.user._id}>
									<ListItemButton
										component='li'
										selected={isSelected}
										onClick={() => {
											onSelectChat(conv.user);

											setConversations((prev) =>
												prev.map((c) =>
													c.user._id === conv.user._id
														? {...c, unreadCount: 0}
														: c,
												),
											);
										}}
										sx={{
											py: 2,
											px: 2,
											bgcolor: isSelected
												? "action.selected"
												: "transparent",
											"&:hover": {bgcolor: "action.hover"},
											transition: "background-color 0.2s",
										}}
									>
										...
									</ListItemButton>

									<Divider component='li' />
								</Fragment>
							);
						})}
					</List>
				)}
			</Box>
		</Paper>
	);
};

export default ChatList;
