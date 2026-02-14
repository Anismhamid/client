import {useEffect, useState, FunctionComponent, useMemo, Fragment} from "react";
import axios from "axios";
import {
	Box,
	Paper,
	Typography,
	List,
	Divider,
	TextField,
	InputAdornment,
	CircularProgress,
	Tab,
	Tabs,
	ListItemButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import socket from "../../../socket/globalSocket";
import {UserMessage} from "../../../interfaces/usersMessages";

const api = import.meta.env.VITE_API_URL;

interface ChatListProps {
	currentUser: {_id: string; name: string; email: string; role: string};
	token: string;
	onSelectChat: (user: UserMessage) => void;
	selectedUserId?: string;
}

interface Conversation {
	user: UserMessage;
	lastMessage: {message: string; createdAt: string};
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

	const getUserName = (user: UserMessage) => {
		if (typeof user.name === "string") return user.name;
		return `${user.name?.first ?? ""} ${user.name?.last ?? ""}`.trim();
	};

	const loadConversations = async () => {
		try {
			setLoading(true);
			const res = await axios.get(`${api}/messages/conversations`, {
				headers: {Authorization: token},
			});

			const formatted: Conversation[] = res.data.conversations.map((conv: any) => ({
				user: conv.user,
				lastMessage: {
					message: conv.lastMessage.message,
					createdAt: conv.lastMessage.createdAt,
				},
				unreadCount: conv.unreadCount || 0,
			}));

			setConversations(formatted);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!currentUser) return;
		loadConversations();

		// Socket listener for new messages
		const handleNewMessage = (msg: any) => {
			setConversations((prev) => {
				const otherUser = msg.from._id === currentUser._id ? msg.to : msg.from;

				const existingIndex = prev.findIndex(
					(conv) => conv.user._id === otherUser._id,
				);

				const newConv: Conversation = {
					user: otherUser,
					lastMessage: {
						message: msg.message,
						createdAt: msg.createdAt,
					},
					unreadCount: msg.from._id !== currentUser._id ? 1 : 0,
				};

				if (existingIndex !== -1) {
					// Update existing conversation
					const updated = [...prev];
					const existing = updated[existingIndex];
					updated[existingIndex] = {
						...existing,
						lastMessage: newConv.lastMessage,
						unreadCount:
							msg.from._id !== currentUser._id
								? (existing.unreadCount || 0) + 1
								: existing.unreadCount,
					};
					return updated;
				} else {
					// Add new conversation
					return [newConv, ...prev];
				}
			});
		};

		socket.on("message:received", handleNewMessage);

		return () => {
			socket.off("message:received", handleNewMessage);
		};
	}, []);

	const filteredConversations = useMemo(() => {
		return conversations
			.filter((conv) => {
				const nameStr = getUserName(conv.user);
				const searchMatch = nameStr
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

	return (
		<Paper
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderRadius: 2,
      
			}}
		>
			<Box sx={{p: 2, borderBottom: 1, borderColor: "divider" }}>
				<Typography variant='h6'>Messages</Typography>
				<TextField
					fullWidth
					size='small'
					placeholder='Search...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					sx={{mt: 1}}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SearchIcon />
							</InputAdornment>
						),
					}}
				/>
				<Tabs value={filter} onChange={(_, val) => setFilter(val)} sx={{mt: 1}}>
					<Tab label='All' value='all' />
					<Tab label='Unread' value='unread' />
				</Tabs>
			</Box>

			<Box sx={{flexGrow: 1, overflowY: "auto", bgcolor: "#fafafa"}}>
				{loading ? (
					<Box sx={{display: "flex", justifyContent: "center", py: 4}}>
						<CircularProgress />
					</Box>
				) : filteredConversations.length === 0 ? (
					<Box sx={{textAlign: "center", py: 4}}>
						<Typography color='text.secondary'>
							{searchTerm
								? "No conversations found"
								: "No conversations yet"}
						</Typography>
					</Box>
				) : (
					<List sx={{p: 0, zIndex:1}}>
						{filteredConversations.map((conv) => {
							const isSelected = selectedUserId === conv.user._id;
							return (
								<Fragment key={conv.user._id}>
									<ListItemButton
										selected={isSelected}
										onClick={() => onSelectChat(conv.user)}
									>
										<Box>
											<Typography variant='subtitle1'>
												{getUserName(conv.user)}
											</Typography>
											<Typography
												variant='body2'
												color='text.secondary'
												noWrap
											>
												{conv.lastMessage.message}
											</Typography>
										</Box>
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
