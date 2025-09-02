import React, {useState, useEffect, useCallback} from "react";
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
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import {getAllUsers} from "../../services/usersServices";
import {showError, showSuccess} from "../../atoms/toasts/ReactToast";
import {getUserMessages, postMessage} from "../../services/messages";
import handleRTL from "../../locales/handleRTL";
import RoleType from "../../interfaces/UserType";
import {User, UserMessage} from "../../interfaces/usersMessages";
import {useUser} from "../../context/useUSer";
import socket from "../../socket/globalSocket";

const MessagingPage: React.FC = () => {
	const {auth} = useUser();

	const [users, setUsers] = useState<User[]>([]);
	const [toUserId, setToUserId] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [warning, setWarning] = useState<boolean>(false);
	const [isImportant, setIsImportant] = useState<boolean>(false);
	const [replyTo, setReplyTo] = useState<string>("");
	const [userMessages, setUserMessages] = useState<UserMessage[]>([]);
	const [sentMessages, setSentMessages] = useState<UserMessage[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [status, setStatus] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const direction = handleRTL();

	const loadData = useCallback(async () => {
		if (!auth._id) return;
		setLoading(true);
		try {
			const usersData = await getAllUsers();
			setUsers(usersData);

			const {messages, pagination} = await getUserMessages(auth._id, page);

			const incoming = messages.filter((msg) => msg.to._id === auth._id);
			const outgoing = messages.filter((msg) => msg.from._id === auth._id);
			setUserMessages(incoming);
			setSentMessages(outgoing);

			setTotalPages(pagination.pages);
		} catch (error) {
			return null;
		} finally {
			setLoading(false);
		}
	}, [auth._id, auth.role, page]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	useEffect(() => {
		if (!socket || !auth._id) return;

		const handleNewMessage = (newMessage: UserMessage) => {
			if (newMessage.to === auth._id) {
				if (newMessage.from._id !== auth._id) {
					setUserMessages((prev) => [newMessage, ...prev]);
					const sender = users.find((u) => u._id === newMessage.from._id);
					showSuccess(`הודעה חדשה מאת ${sender?.email || "משתמש לא ידוע"}`);
				}
			}
		};

		socket.on("message:received", handleNewMessage);

		return () => {
			socket.off("message:received", handleNewMessage);
		};
	}, [auth._id, users]);

	const validateRecipient = useCallback(
		(recipientId: string) => {
			const recipient = users.find((u) => u._id === recipientId);

			if (!recipient) return false;

			// Admin can send to anyone
			if (auth.role === RoleType.Admin) return true;

			// Moderator can send to Clients and Admins
			if (
				auth.role === RoleType.Moderator &&
				(recipient.role === RoleType.Client || recipient.role === RoleType.Admin)
			)
				return true;

			// Client can send to moderator
			if (auth.role === RoleType.Client && recipient.role === RoleType.Moderator) {
				return true;
			}
			return false;
		},
		[auth.role, users],
	);

	// Reset form fields
	const resetTheFields = () => {
		setMessage("");
		setWarning(false);
		setIsImportant(false);
		setToUserId("");
		setReplyTo("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("");
		setLoading(true);

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
			setStatus("ההודעה נשלחה בהצלחה");
			showSuccess("ההודעה נשלחה בהצלחה");
		} catch (err: any) {
			const errorMsg =
				err.response?.data?.error ||
				err.response?.data?.message ||
				"שליחת ההודעה נכשלה";
			setStatus(errorMsg);
			showError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	const getUserEmail = (userId: string) => {
		const user = users.find((u) => u._id === userId);
		return user ? user.email : "";
	};

	useEffect(() => {
		if (auth.role === RoleType.Client && users.length > 0 && !toUserId) {
			const firstModerator = users.find((user) => user.role === RoleType.Moderator);
			if (firstModerator) {
				setToUserId(firstModerator._id);
			}
		}
	}, [auth.role, users, toUserId]);

	return (
		<Container dir={direction} maxWidth='md' sx={{mt: 5}}>
			<Typography textAlign='center' variant='h4' gutterBottom>
				מרכז הודעות
			</Typography>

			<Box
				noValidate
				component='form'
				onSubmit={handleSubmit}
				sx={{
					p: 5,
					mb: 3,
					backdropFilter: "blur(8px)",
					border: 1,
					borderRadius: 5,
				}}
			>
				<FormControl fullWidth margin='normal'>
					<InputLabel id='to-user-label'>מקבל</InputLabel>
					<Select
						labelId='to-user-label'
						value={toUserId}
						label='מקבל'
						onChange={(e) => {
							setToUserId(e.target.value);
						}}
						required
						disabled={loading}
					>
						{users
							.filter((user) => validateRecipient(user._id))
							.map((user) => (
								<MenuItem dir={direction} key={user._id} value={user._id}>
									{user.name.first} ({user.role})
								</MenuItem>
							))}
					</Select>
				</FormControl>

				{replyTo && (
					<Alert
						dir={direction}
						severity='info'
						action={
							<Button
								color='inherit'
								size='small'
								onClick={() => setReplyTo("")}
								disabled={loading}
							>
								ביטול תגובה
							</Button>
						}
						sx={{mb: 2}}
					>
						رد
					</Alert>
				)}

				<TextField
					dir={direction}
					label='גוף הודעה'
					multiline
					rows={6}
					fullWidth
					margin='normal'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					required
					disabled={loading}
				/>
				{auth.role !== RoleType.Client && (
					<Box dir={direction} sx={{display: "flex", gap: 2, mb: 2}}>
						<FormControlLabel
							control={
								<Checkbox
									checked={warning}
									onChange={() => setWarning(!warning)}
									disabled={loading}
								/>
							}
							label='אזהרה'
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={isImportant}
									onChange={() => setIsImportant(!isImportant)}
									disabled={loading}
								/>
							}
							label='חשוב'
						/>
					</Box>
				)}

				<Button
					disabled={loading || message.length < 5 || !toUserId}
					variant='contained'
					color='primary'
					type='submit'
					fullWidth
					sx={{mt: 2}}
				>
					{loading ? <CircularProgress size={24} /> : "שליחה"}
				</Button>
			</Box>

			{status && (
				<Alert severity={status.includes("הצלחה") ? "success" : "error"}>
					{status}
				</Alert>
			)}

			<Typography textAlign='center' variant='h6' sx={{mt: 5, mb: 2}}>
				הודעות שנשלחו
			</Typography>

			{loading ? (
				<Box display='flex' justifyContent='center' my={4}>
					<CircularProgress />
				</Box>
			) : (
				<List>
					{sentMessages.map((msg) => (
						<Box
							key={msg._id}
							sx={{
								backgroundColor: "background.paper",
								p: 3,
								mb: 2,
								borderRadius: 2,
								border: "1px solid",
								borderColor: msg.warning ? "warning.main" : "divider",
							}}
						>
							<Typography
								variant='subtitle2'
								color='textSecondary'
								gutterBottom
							>
								אל:{" "}
								{users.find((u) => u._id === msg.to)?.email || "לא ידוע"}{" "}
								- {new Date(msg.createdAt).toLocaleString()}
							</Typography>
							{msg.warning && (
								<Typography
									variant='subtitle2'
									color='warning.main'
									sx={{display: "flex", alignItems: "center", gap: 1}}
								>
									<WarningIcon fontSize='small' /> אזהרה
								</Typography>
							)}
							<Typography
								variant='body1'
								sx={{whiteSpace: "pre-wrap", mt: 1}}
							>
								{msg.message}
							</Typography>
						</Box>
					))}
				</List>
			)}

			<Typography textAlign='center' variant='h6' sx={{mt: 5, mb: 2}}>
				הודעות נכנסות
			</Typography>

			<List>
				{userMessages.map((msg) => (
					<Box
						key={msg._id}
						sx={{
							backgroundColor: "background.paper",
							p: 3,
							mb: 2,
							borderRadius: 2,
							border: "1px solid",
							borderColor: msg.warning ? "warning.main" : "divider",
							cursor: "pointer",
						}}
						onClick={() => {
							setReplyTo(msg.from._id as string);
							setToUserId(msg.from._id as string);
						}}
					>
						<Typography
							variant='subtitle2'
							color='textSecondary'
							gutterBottom
						>
							מ: {msg.from.email || ""} -{" "}
							{new Date(msg.createdAt).toLocaleString()}
						</Typography>
						{msg.replyTo && (
							<Typography
								variant='caption'
								color='textSecondary'
								sx={{fontStyle: "italic", mb: 1}}
							>
								תשובה להודעה מאת {getUserEmail(msg.replyTo)}
							</Typography>
						)}
						{msg.warning && (
							<Typography
								variant='subtitle2'
								color='warning.main'
								sx={{display: "flex", alignItems: "center", gap: 1}}
							>
								<WarningIcon fontSize='small' /> אזהרה
							</Typography>
						)}
						<Typography variant='body1' sx={{whiteSpace: "pre-wrap", mt: 1}}>
							{msg.message}
						</Typography>
					</Box>
				))}
			</List>

			<Pagination
				count={totalPages}
				page={page}
				onChange={(_e, value) => setPage(value)}
				sx={{display: "flex", justifyContent: "center", my: 4}}
			/>
		</Container>
	);
};

export default MessagingPage;
