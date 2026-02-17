import {useEffect, useState, FunctionComponent, useMemo, Fragment} from "react";
import axios from "axios";
import {
	Box,
	Typography,
	List,
	Divider,
	TextField,
	InputAdornment,
	CircularProgress,
	Tab,
	Tabs,
	ListItemButton,
	Avatar,
	Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {UserMessage} from "../../../interfaces/usersMessages";
import {useChat} from "../../../hooks/useChat";
import {useTranslation} from "react-i18next";

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
	const {unreadCounts} = useChat();
	const {t} = useTranslation();

	const getUserName = (user: UserMessage) => {
		if (typeof user.name === "string") return user.name;
		const first = user.name?.first || user.name?.first || "";
		const last = user.name?.last || user.name?.last || "";
		return `${first} ${last}`.trim() || "User";
	};

	const loadConversations = async () => {
		try {
			setLoading(true);
			const res = await axios.get(`${api}/messages/conversations`, {
				headers: {Authorization: token},
			});
			setConversations(res.data.conversations || []);
		} catch (err) {
			console.error("Failed to load conversations:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (currentUser) loadConversations();
	}, [currentUser?._id]);

	const filteredConversations = useMemo(() => {
		return conversations
			.filter((conv) => {
				const nameStr = getUserName(conv.user);
				const searchMatch = nameStr
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
				const unreadCount = unreadCounts[conv.user._id as string] || 0;
				const unreadMatch =
					filter === "all" || (filter === "unread" && unreadCount > 0);
				return searchMatch && unreadMatch;
			})
			.sort(
				(a, b) =>
					new Date(b.lastMessage.createdAt).getTime() -
					new Date(a.lastMessage.createdAt).getTime(),
			);
	}, [conversations, searchTerm, filter, unreadCounts]);

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		if (date.toDateString() === now.toDateString()) {
			return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
		}
		return date.toLocaleDateString([], {day: "2-digit", month: "2-digit"});
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
			{/* Search & Tabs */}
			<Box sx={{p: 2, borderBottom: 1, borderColor: "divider"}}>
				<TextField
					fullWidth
					size='small'
					placeholder={t("messages.search") || "Search chats..."}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SearchIcon fontSize='small' />
							</InputAdornment>
						),
						sx: {borderRadius: 2},
					}}
				/>
				<Tabs
					value={filter}
					onChange={(_, val) => setFilter(val)}
					variant='fullWidth'
					sx={{mt: 1, minHeight: 40}}
				>
					<Tab
						label={t("messages.all") || "All"}
						value='all'
						sx={{fontSize: "0.8rem"}}
					/>
					<Tab
						label={t("messages.unread") || "Unread"}
						value='unread'
						sx={{fontSize: "0.8rem"}}
					/>
				</Tabs>
			</Box>

			{/* List Area */}
			<Box sx={{flexGrow: 1, overflowY: "auto"}}>
				{loading ? (
					<Box sx={{display: "flex", justifyContent: "center", py: 4}}>
						<CircularProgress size={24} />
					</Box>
				) : filteredConversations.length === 0 ? (
					<Box sx={{textAlign: "center", py: 4, px: 2}}>
						<Typography variant='body2' color='text.secondary'>
							{searchTerm ? "No results found" : "No active conversations"}
						</Typography>
					</Box>
				) : (
					<List sx={{p: 0}}>
						{filteredConversations.map((conv) => {
							const isSelected = selectedUserId === conv.user._id;
							const unreadCount =
								unreadCounts[conv.user._id as string] || 0;
							const userName = getUserName(conv.user);

							return (
								<Fragment key={conv.user._id}>
									<ListItemButton
										selected={isSelected}
										onClick={() => onSelectChat(conv.user)}
										sx={{
											py: 1.5,
											px: 2,
											gap: 2,
											"&.Mui-selected": {
												bgcolor: "primary.lighter",
											},
										}}
									>
										<Badge
											color='primary'
											badgeContent={unreadCount}
											invisible={unreadCount === 0}
											overlap='circular'
											anchorOrigin={{
												vertical: "bottom",
												horizontal: "right",
											}}
										>
											<Avatar
												sx={{
													bgcolor: isSelected
														? "primary.main"
														: "grey.300",
													width: 48,
													height: 48,
												}}
											>
												{userName.charAt(0).toUpperCase()}
											</Avatar>
										</Badge>

										<Box sx={{flex: 1, minWidth: 0}}>
											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
													alignItems: "baseline",
													mb: 0.5,
												}}
											>
												<Typography
													variant='subtitle2'
													sx={{
														fontWeight:
															unreadCount > 0 ? 700 : 500,
														wordWrap: "break-word",
													}}
												>
													{userName}
												</Typography>
												<Typography
													variant='caption'
													color='text.secondary'
												>
													{formatTime(
														conv.lastMessage.createdAt,
													)}
												</Typography>
											</Box>
											<Typography
												variant='body2'
												color={
													unreadCount > 0
														? "text.primary"
														: "text.secondary"
												}
												sx={{
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													fontWeight:
														unreadCount > 0 ? 600 : 400,
												}}
											>
												{conv.lastMessage.message}
											</Typography>
										</Box>
									</ListItemButton>
									<Divider
										variant='inset'
										component='li'
										sx={{ml: 9}}
									/>
								</Fragment>
							);
						})}
					</List>
				)}
			</Box>
		</Box>
	);
};

export default ChatList;
