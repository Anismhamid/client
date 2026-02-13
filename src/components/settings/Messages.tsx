import {useState, useEffect, useCallback, useRef} from "react";
import {
	Box,
	Container,
	Typography,
	TextField,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Alert,
	List,
	Checkbox,
	FormControlLabel,
	CircularProgress,
	Pagination,
	Avatar,
	IconButton,
	Paper,
	Divider,
	Chip,
	Badge,
	Skeleton,
	Zoom,
	Fade,
	Tab,
	Tabs,
	useTheme,
	Tooltip,
	Drawer,
	useMediaQuery,
} from "@mui/material";
import {
	Send as SendIcon,
	Warning as WarningIcon,
	Reply as ReplyIcon,
	Delete as DeleteIcon,
	Star as StarIcon,
	StarBorder as StarBorderIcon,
	MoreVert as MoreVertIcon,
	ArrowBack as ArrowBackIcon,
	Markunread as MarkunreadIcon,
	CheckCircle as CheckCircleIcon,
	Info as InfoIcon,
	Person as PersonIcon,
	AdminPanelSettings as AdminIcon,
	Close as CloseIcon,
	ErrorOutline,
} from "@mui/icons-material";
import {motion, AnimatePresence} from "framer-motion";
import {getAllUsers} from "../../services/usersServices";
import {showError, showSuccess} from "../../atoms/toasts/ReactToast";
import {getUserMessages, postMessage} from "../../services/messages";
import handleRTL from "../../locales/handleRTL";
import RoleType from "../../interfaces/UserType";
import {User, UserMessage} from "../../interfaces/usersMessages";
import {useUser} from "../../context/useUSer";
import socket from "../../socket/globalSocket";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const TabPanel = (props: TabPanelProps) => {
	const {children, value, index, ...other} = props;
	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`messages-tabpanel-${index}`}
			aria-labelledby={`messages-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{py: 3}}>{children}</Box>}
		</div>
	);
};

const MessagingPage: React.FC = () => {
	const theme = useTheme();
	const {auth} = useUser();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
	const [tabValue, setTabValue] = useState(0);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(null);

	const [users, setUsers] = useState<User[]>([]);
	const [toUserId, setToUserId] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [warning, setWarning] = useState<boolean>(false);
	const [isImportant, setIsImportant] = useState<boolean>(false);
	const [replyTo, setReplyTo] = useState<string>("");
	const [userMessages, setUserMessages] = useState<UserMessage[]>([]);
	const [sentMessages, setSentMessages] = useState<UserMessage[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [sending, setSending] = useState<boolean>(false);
	const [status, setStatus] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const direction = handleRTL();

	const loadData = useCallback(async () => {
		if (!auth._id) return;
		setLoading(true);
		try {
			const usersData = await getAllUsers();
			setUsers(usersData);

			const {messages, pagination} = await getUserMessages(auth._id, page);

			// تصفية الرسائل حسب المستخدم الحالي
			const incoming = messages.filter((msg) => msg.to._id === auth._id);
			const outgoing = messages.filter((msg) => msg.from._id === auth._id);

			setUserMessages(incoming);
			setSentMessages(outgoing);
			setTotalPages(pagination.pages);
		} catch (error) {
			console.error("Error loading data:", error);
		} finally {
			setLoading(false);
		}
	}, [auth._id, page]);

	useEffect(() => {
		loadData();
	}, [loadData, page]);

	useEffect(() => {
		if (!socket || !auth._id) return;

		const handleNewMessage = (newMessage: UserMessage) => {
			if (newMessage.to._id === auth._id) {
				setUserMessages((prev) => [newMessage, ...prev]);
				showSuccess(`📩 رسالة جديدة من ${getUserDisplayName(newMessage.from)}`);
			}
		};

		socket.on("message:received", handleNewMessage);

		return () => {
			socket.off("message:received", handleNewMessage);
		};
	}, [loadData,socket]);

	const validateRecipient = useCallback(
		(recipientId: string) => {
			const recipient = users.find((u) => u._id === recipientId);
			if (!recipient) return false;
			if (auth.role === RoleType.Admin) return true;
			if (
				auth.role === RoleType.Moderator &&
				(recipient.role === RoleType.Client || recipient.role === RoleType.Admin)
			)
				return true;
			if (auth.role === RoleType.Client && recipient.role === RoleType.Moderator) {
				return true;
			}
			return false;
		},
		[auth.role, users],
	);

	const resetTheFields = () => {
		setMessage("");
		setWarning(false);
		setIsImportant(false);
		setToUserId("");
		setReplyTo("");
		setSelectedMessage(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("");
		setSending(true);

		try {
			const sentMessageFromServer: UserMessage = await postMessage({
				toUserId,
				message,
				warning,
				isImportant,
				replyTo: replyTo || undefined,
			});

			resetTheFields();
			setSentMessages((prev) => [sentMessageFromServer, ...prev]);
			setStatus("✅ تم إرسال الرسالة بنجاح");
			showSuccess("تم إرسال الرسالة بنجاح");
			setTabValue(1);
		} catch (err: any) {
			const errorMsg =
				err.response?.data?.error ||
				err.response?.data?.message ||
				"فشل إرسال الرسالة";
			setStatus(errorMsg);
			showError(errorMsg);
		} finally {
			setSending(false);
		}
	};

	const getUserDisplayName = (
		user?:
			| {_id?: string; email?: string; first?: string; last?: string; role?: string}
			| User
			| null,
	) => {
		if (!user) return "مستخدم غير معروف";
		if ("name" in user && user.name) {
			// هذا كائن User
			return (
				`${user.name.first || ""} ${user.name.last || ""}`.trim() ||
				user.email ||
				"مستخدم"
			);
		}
		// هذا كائن from/to في الرسالة
		return `${user.email}`;
	};

	const getUserEmail = (
		user?:
			| {_id?: string; email?: string; first?: string; last?: string; role?: string}
			| User
			| null,
	) => {
		if (!user) return "بريد غير معروف";
		if ("email" in user && user.email) return user.email;
		return "بريد غير متوفر";
	};

	const getUserAvatar = (
		user?:
			| {_id?: string; email?: string; first?: string; last?: string; role?: string}
			| User
			| null,
	) => {
		if (!user) return "";

		let firstName = "";
		let lastName = "";

		if ("name" in user && user.name) {
			// كائن User
			firstName = user.name.first || "";
			lastName = user.name.last || "";
		} else {
			// كائن from/to
			firstName = user._id || "";
			lastName = user.email || "";
		}

		return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&length=2`;
	};

	const getUserRole = (
		user?:
			| {_id?: string; email?: string; first?: string; last?: string; role?: string}
			| User
			| null,
	) => {
		if (!user) return "";
		if ("role" in user) return user.role || "";
		return "";
	};

	const getRoleIcon = (role: string = "") => {
		switch (role) {
			case RoleType.Admin:
				return (
					<AdminIcon fontSize='small' sx={{color: theme.palette.error.main}} />
				);
			case RoleType.Moderator:
				return (
					<ErrorOutline
						fontSize='small'
						sx={{color: theme.palette.warning.main}}
					/>
				);
			default:
				return (
					<PersonIcon fontSize='small' sx={{color: theme.palette.info.main}} />
				);
		}
	};

	const getRoleColor = (role: string = "") => {
		switch (role) {
			case RoleType.Admin:
				return theme.palette.error.main;
			case RoleType.Moderator:
				return theme.palette.warning.main;
			default:
				return theme.palette.info.main;
		}
	};

	const filteredUsers = users
		.filter((user) => validateRecipient(user._id as string))
		.filter(
			(user) =>
				user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.name?.first?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.name?.last?.toLowerCase().includes(searchTerm.toLowerCase()),
		);

	useEffect(() => {
		if (auth.role === RoleType.Client && users.length > 0 && !toUserId) {
			const firstModerator = users.find((user) => user.role === RoleType.Moderator);
			if (firstModerator) {
				setToUserId(firstModerator._id || "");
			}
		}
	}, [auth.role, users, toUserId]);

	const MessageCard = ({msg, isIncoming}: {msg: UserMessage; isIncoming: boolean}) => {
		const user = isIncoming
			? msg.from
			: users.find((u) => u._id === msg.to?._id) || msg.to || null;

		const isSelected = selectedMessage?._id === msg._id;
		const userRole = getUserRole(user);
		const displayName = getUserDisplayName(user);
		const userEmail = getUserEmail(user);
		const avatarUrl = getUserAvatar(user);

		return (
			<motion.div
				initial={{opacity: 0, y: 20}}
				animate={{opacity: 1, y: 0}}
				exit={{opacity: 0, x: -20}}
				whileHover={{scale: 1.02}}
				transition={{duration: 0.2}}
			>
				<Paper
					elevation={isSelected ? 8 : 1}
					sx={{
						p: 2,
						mb: 2,
						borderRadius: 3,
						border: "1px solid",
						borderColor: msg.warning
							? theme.palette.warning.light
							: msg.isImportant
								? theme.palette.primary.light
								: theme.palette.divider,
						backgroundColor: isSelected
							? theme.palette.action.selected
							: theme.palette.background.paper,
						cursor: "pointer",
						transition: "all 0.2s ease",
						position: "relative",
						overflow: "hidden",
						"&:hover": {
							boxShadow: theme.shadows[4],
						},
					}}
					onClick={() => {
						if (isIncoming) {
							setSelectedMessage(msg);
							setReplyTo(msg.from._id as string);
							setToUserId(msg.from._id as string);
							if (isMobile) setMobileDrawerOpen(true);
						}
					}}
				>
					{msg.warning && (
						<Box
							sx={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								height: "4px",
								background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
							}}
						/>
					)}

					<Box sx={{display: "flex", alignItems: "flex-start", gap: 2}}>
						<Badge
							overlap='circular'
							anchorOrigin={{vertical: "bottom", horizontal: "right"}}
							badgeContent={
								<Box
									sx={{
										width: 12,
										height: 12,
										borderRadius: "50%",
										bgcolor: theme.palette.success.main,
										border: `2px solid ${theme.palette.background.paper}`,
									}}
								/>
							}
						>
							<Avatar
								src={avatarUrl}
								sx={{
									width: 48,
									height: 48,
									border: `2px solid ${getRoleColor(userRole)}`,
								}}
							>
								{displayName.charAt(0)}
							</Avatar>
						</Badge>

						<Box sx={{flex: 1}}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									mb: 0.5,
								}}
							>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
										flexWrap: "wrap",
									}}
								>
									<Typography
										variant='subtitle1'
										sx={{fontWeight: 600}}
									>
										{displayName}
									</Typography>
									{userRole && (
										<Chip
											icon={getRoleIcon(userRole)}
											label={userRole}
											size='small'
											sx={{
												backgroundColor: `${getRoleColor(userRole)}20`,
												color: getRoleColor(userRole),
												borderRadius: "4px",
												"& .MuiChip-icon": {color: "inherit"},
											}}
										/>
									)}
									{msg.isImportant && (
										<StarIcon
											sx={{
												color: theme.palette.warning.main,
												fontSize: 18,
											}}
										/>
									)}
								</Box>
								<Typography variant='caption' color='text.secondary'>
									{new Date(msg.createdAt).toLocaleString("ar-SA", {
										hour: "2-digit",
										minute: "2-digit",
										day: "numeric",
										month: "short",
									})}
								</Typography>
							</Box>

							{msg.replyTo && (
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 0.5,
										mb: 1,
									}}
								>
									<ReplyIcon
										sx={{
											fontSize: 14,
											color: theme.palette.text.secondary,
										}}
									/>
									<Typography
										variant='caption'
										color='text.secondary'
										sx={{fontStyle: "italic"}}
									>
										رد على رسالة من{" "}
										{getUserDisplayName(
											users.find((u) => u._id === msg.replyTo),
										)}
									</Typography>
								</Box>
							)}

							<Typography
								variant='body1'
								sx={{
									whiteSpace: "pre-wrap",
									color: msg.warning
										? theme.palette.warning.dark
										: "text.primary",
									fontWeight: msg.warning ? 500 : 400,
								}}
							>
								{msg.message}
							</Typography>
						</Box>
					</Box>
				</Paper>
			</motion.div>
		);
	};

	const ComposeDrawer = () => (
		<Drawer
			anchor={direction === "rtl" ? "left" : "right"}
			open={mobileDrawerOpen}
			onClose={() => setMobileDrawerOpen(false)}
			PaperProps={{
				sx: {
					width: "100%",
					maxWidth: 400,
					p: 3,
				},
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 3,
				}}
			>
				<Typography variant='h6'>رد على الرسالة</Typography>
				<IconButton onClick={() => setMobileDrawerOpen(false)}>
					<CloseIcon />
				</IconButton>
			</Box>
			{renderComposeForm()}
		</Drawer>
	);

	const renderComposeForm = () => (
		<Box component='form' onSubmit={handleSubmit} sx={{width: "100%"}}>
			<FormControl fullWidth margin='normal'>
				<InputLabel id='to-user-label'>إلى</InputLabel>
				<Select
					labelId='to-user-label'
					value={toUserId}
					label='إلى'
					onChange={(e) => setToUserId(e.target.value)}
					required
					disabled={sending}
					sx={{borderRadius: 2}}
				>
					<Box sx={{p: 2, borderBottom: `1px solid ${theme.palette.divider}`}}>
						<TextField
							fullWidth
							size='small'
							placeholder='بحث عن مستخدم...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onClick={(e) => e.stopPropagation()}
						/>
					</Box>
					{filteredUsers.map((user) => {
						const displayName =
							`${user.name.first || ""} ${user.name.last || ""}`.trim();
						const avatarUrl = getUserAvatar(user);
						const userRole = getUserRole(user);

						return (
							<MenuItem key={user._id} value={user._id} sx={{py: 1.5}}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1.5,
										width: "100%",
									}}
								>
									<Avatar src={avatarUrl} sx={{width: 32, height: 32}}>
										{displayName.charAt(0)}
									</Avatar>
									<Box sx={{flex: 1}}>
										<Typography
											variant='body2'
											sx={{fontWeight: 500}}
										>
											{displayName || user.email}
										</Typography>
										<Typography
											variant='caption'
											color='text.secondary'
										>
											{user.email}
										</Typography>
									</Box>
									{userRole && (
										<Chip
											label={userRole}
											size='small'
											sx={{
												ml: "auto",
												backgroundColor: `${getRoleColor(userRole)}20`,
												color: getRoleColor(userRole),
											}}
										/>
									)}
								</Box>
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>

			{replyTo && (
				<Fade in={!!replyTo}>
					<Alert
						severity='info'
						sx={{
							mb: 2,
							borderRadius: 2,
							"& .MuiAlert-action": {alignItems: "center"},
						}}
						action={
							<Button
								color='inherit'
								size='small'
								onClick={() => setReplyTo("")}
								disabled={sending}
								startIcon={<CloseIcon />}
							>
								إلغاء
							</Button>
						}
					>
						<Box sx={{display: "flex", alignItems: "center", gap: 1}}>
							<ReplyIcon fontSize='small' />
							رد على رسالة
						</Box>
					</Alert>
				</Fade>
			)}

			<TextField
				label='الرسالة'
				multiline
				rows={4}
				fullWidth
				margin='normal'
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				required
				disabled={sending}
				placeholder='اكتب رسالتك هنا...'
				sx={{
					"& .MuiOutlinedInput-root": {
						borderRadius: 3,
					},
				}}
			/>

			{auth.role !== RoleType.Client && (
				<Box sx={{display: "flex", gap: 2, my: 2}}>
					<FormControlLabel
						control={
							<Checkbox
								checked={warning}
								onChange={() => setWarning(!warning)}
								disabled={sending}
								sx={{
									color: theme.palette.warning.main,
									"&.Mui-checked": {color: theme.palette.warning.main},
								}}
							/>
						}
						label={
							<Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
								<WarningIcon
									fontSize='small'
									sx={{color: theme.palette.warning.main}}
								/>
								تحذير
							</Box>
						}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={isImportant}
								onChange={() => setIsImportant(!isImportant)}
								disabled={sending}
								sx={{
									color: theme.palette.warning.main,
									"&.Mui-checked": {color: theme.palette.warning.main},
								}}
							/>
						}
						label={
							<Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
								<StarIcon
									fontSize='small'
									sx={{color: theme.palette.warning.main}}
								/>
								مهم
							</Box>
						}
					/>
				</Box>
			)}

			<Button
				disabled={sending || message.length < 2 || !toUserId}
				variant='contained'
				type='submit'
				fullWidth
				size='large'
				startIcon={
					sending ? (
						<CircularProgress size={20} color='inherit' />
					) : (
						<SendIcon />
					)
				}
				sx={{
					mt: 2,
					py: 1.5,
					borderRadius: 3,
					background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
					"&:hover": {
						background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
					},
				}}
			>
				{sending ? "جاري الإرسال..." : "إرسال الرسالة"}
			</Button>
		</Box>
	);

	return (
		<>
			<Box
				component='main'
				sx={{
					minHeight: "100vh",
					background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
					py: 4,
				}}
			>
				<Container maxWidth='lg' dir={direction}>
					{/* Header */}
					<motion.div
						initial={{opacity: 0, y: -20}}
						animate={{opacity: 1, y: 0}}
						transition={{duration: 0.5}}
					>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								mb: 4,
								borderRadius: 4,
								background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
								color: "white",
								position: "relative",
								overflow: "hidden",
							}}
						>
							<Box
								sx={{
									position: "absolute",
									top: -20,
									right: -20,
									width: 200,
									height: 200,
									borderRadius: "50%",
									background: "rgba(255,255,255,0.1)",
								}}
							/>
							<Box
								sx={{
									position: "absolute",
									bottom: -40,
									left: -40,
									width: 300,
									height: 300,
									borderRadius: "50%",
									background: "rgba(255,255,255,0.05)",
								}}
							/>

							<Box sx={{position: "relative", zIndex: 1}}>
								<Typography variant='h4' sx={{fontWeight: 700, mb: 1}}>
									مركز الرسائل
								</Typography>
								<Typography variant='subtitle1' sx={{opacity: 0.9}}>
									تواصل مع فريق الدعم والإدارة بسهولة
								</Typography>
							</Box>
						</Paper>
					</motion.div>

					{/* Main Content */}
					<Box sx={{display: "flex", gap: 3}}>
						{/* Compose Form - Desktop */}
						{!isMobile && (
							<motion.div
								initial={{opacity: 0, x: -20}}
								animate={{opacity: 1, x: 0}}
								transition={{duration: 0.5, delay: 0.1}}
								style={{width: "35%"}}
							>
								<Paper
									elevation={0}
									sx={{
										p: 3,
										borderRadius: 4,
										border: `1px solid ${theme.palette.divider}`,
										position: "sticky",
										top: 24,
									}}
								>
									<Typography
										variant='h6'
										sx={{
											mb: 3,
											display: "flex",
											alignItems: "center",
											gap: 1,
										}}
									>
										<SendIcon color='primary' />
										رسالة جديدة
									</Typography>
									{renderComposeForm()}
								</Paper>
							</motion.div>
						)}

						{/* Messages Section */}
						<motion.div
							initial={{opacity: 0, x: 20}}
							animate={{opacity: 1, x: 0}}
							transition={{duration: 0.5, delay: 0.2}}
							style={{width: isMobile ? "100%" : "65%"}}
						>
							<Paper
								elevation={0}
								sx={{
									borderRadius: 4,
									border: `1px solid ${theme.palette.divider}`,
									overflow: "hidden",
								}}
							>
								{/* Tabs */}
								<Box sx={{borderBottom: 1, borderColor: "divider"}}>
									<Tabs
										value={tabValue}
										onChange={(_, v) => setTabValue(v)}
										aria-label='message tabs'
										sx={{
											px: 2,
											"& .MuiTab-root": {
												minHeight: 64,
												fontWeight: 600,
											},
										}}
									>
										<Tab
											label={
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 1,
													}}
												>
													<MarkunreadIcon />
													الوارد
													{userMessages.length > 0 && (
														<Chip
															label={userMessages.length}
															size='small'
															color='primary'
															sx={{ml: 1}}
														/>
													)}
												</Box>
											}
										/>
										<Tab
											label={
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 1,
													}}
												>
													<CheckCircleIcon />
													المرسلة
												</Box>
											}
										/>
									</Tabs>
								</Box>

								{/* Incoming Messages Tab */}
								<TabPanel value={tabValue} index={0}>
									<Box sx={{px: 2}}>
										{loading ? (
											Array.from({length: 3}).map((_, i) => (
												<Box key={i} sx={{mb: 2}}>
													<Skeleton
														variant='rectangular'
														height={120}
														sx={{borderRadius: 3}}
													/>
												</Box>
											))
										) : (
											<AnimatePresence>
												{userMessages.length > 0 ? (
													userMessages.map((msg) => (
														<MessageCard
															key={msg._id}
															msg={msg}
															isIncoming={true}
														/>
													))
												) : (
													<Box
														sx={{
															textAlign: "center",
															py: 8,
															px: 2,
														}}
													>
														<InfoIcon
															sx={{
																fontSize: 48,
																color: "text.disabled",
																mb: 2,
															}}
														/>
														<Typography
															variant='h6'
															color='text.secondary'
															gutterBottom
														>
															لا توجد رسائل واردة
														</Typography>
														<Typography
															variant='body2'
															color='text.secondary'
														>
															عندما تتلقى رسائل جديدة، ستظهر
															هنا
														</Typography>
													</Box>
												)}
											</AnimatePresence>
										)}
									</Box>
								</TabPanel>

								{/* Sent Messages Tab */}
								<TabPanel value={tabValue} index={1}>
									<Box sx={{px: 2}}>
										{loading ? (
											Array.from({length: 3}).map((_, i) => (
												<Box key={i} sx={{mb: 2}}>
													<Skeleton
														variant='rectangular'
														height={120}
														sx={{borderRadius: 3}}
													/>
												</Box>
											))
										) : (
											<AnimatePresence>
												{sentMessages.length > 0 ? (
													sentMessages.map((msg) => (
														<MessageCard
															key={msg._id}
															msg={msg}
															isIncoming={false}
														/>
													))
												) : (
													<Box
														sx={{
															textAlign: "center",
															py: 8,
															px: 2,
														}}
													>
														<SendIcon
															sx={{
																fontSize: 48,
																color: "text.disabled",
																mb: 2,
															}}
														/>
														<Typography
															variant='h6'
															color='text.secondary'
															gutterBottom
														>
															لم ترسل أي رسائل بعد
														</Typography>
														<Typography
															variant='body2'
															color='text.secondary'
														>
															ابدأ بالتواصل مع فريق الدعم
														</Typography>
													</Box>
												)}
											</AnimatePresence>
										)}
									</Box>
								</TabPanel>

								{/* Pagination */}
								{totalPages > 1 && (
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											py: 3,
											borderTop: 1,
											borderColor: "divider",
										}}
									>
										<Pagination
											count={totalPages}
											page={page}
											onChange={(_e, value) => setPage(value)}
											color='primary'
											size={isMobile ? "small" : "medium"}
											sx={{
												"& .MuiPaginationItem-root": {
													borderRadius: 2,
												},
											}}
										/>
									</Box>
								)}
							</Paper>
						</motion.div>
					</Box>

					{/* Mobile Compose Button */}
					{isMobile && (
						<motion.div
							initial={{scale: 0}}
							animate={{scale: 1}}
							transition={{delay: 0.5}}
							style={{
								position: "fixed",
								bottom: 70,
								right: direction === "rtl" ? 13 : "auto",
								left: direction === "rtl" ? "auto" : 24,
								zIndex: 1000,
							}}
						>
							<Tooltip title='رسالة جديدة'>
								<IconButton
									color='primary'
									onClick={() => {
										resetTheFields();
										setMobileDrawerOpen(true);
									}}
									sx={{
										width: 56,
										height: 56,
										boxShadow: theme.shadows[8],
										background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
										color: "white",
										"&:hover": {
											background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
										},
									}}
								>
									<SendIcon />
								</IconButton>
							</Tooltip>
						</motion.div>
					)}

					{/* Mobile Compose Drawer */}
					{isMobile && <ComposeDrawer />}

					{/* Status Snackbar */}
					{status && (
						<Zoom in={!!status}>
							<Alert
								severity={status.includes("✅") ? "success" : "error"}
								sx={{
									position: "fixed",
									bottom: 24,
									left: "50%",
									transform: "translateX(-50%)",
									zIndex: 9999,
									boxShadow: theme.shadows[8],
									borderRadius: 3,
								}}
								onClose={() => setStatus("")}
							>
								{status}
							</Alert>
						</Zoom>
					)}
				</Container>
			</Box>
		</>
	);
};

export default MessagingPage;
