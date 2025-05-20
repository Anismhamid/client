import {FunctionComponent, useEffect, useState} from "react";
import {UserRegister} from "../../interfaces/User";
import {
	getAllUsers,
	patchUserStatus,
	patchUserRole,
	deleteUserById,
} from "../../services/usersServices";
import {fontAwesomeIcon} from "../../FontAwesome/Icons";
import RoleType from "../../interfaces/UserType";
import {
	styled,
	Box,
	Button,
	FormControl,
	MenuItem,
	Select,
	TableContainer,
	tableCellClasses,
	Table,
	TableCell,
	TableBody,
	TableRow,
	TableHead,
	Paper,
	CircularProgress,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import {showError, showInfo} from "../toasts/ReactToast";
import SearchBox from "../SearchBox";
import EditUserData from "./EditUserData";
import socket from "../../socket/globalSocket";

interface UersManagementProps {}

const StyledTableCell = styled(TableCell)(({theme}) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

/**
 * Users uers management
 * @returns all users table for management
 */
const UersManagement: FunctionComponent<UersManagementProps> = () => {
	const [users, setUsers] = useState<UserRegister[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

	useEffect(() => {
		getAllUsers()
			.then(setUsers)
			.catch((err: string) => {
				showError(err);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		const handleUserConnected = async (data: {userId: string}) => {
			await patchUserStatus(data.userId, true);
			setUsers((prevUsers) =>
				prevUsers.map((u) => (u._id === data.userId ? {...u, status: true} : u)),
			);
		};

		socket
			.on("user:newUserLoggedIn", handleUserConnected);

		return () => {
			socket.off("user:newUserLoggedIn", handleUserConnected);
		};
	}, []);

	useEffect(() => {
		const handleUserDisconnected = async (data: {userId: string}) => {
			await patchUserStatus(data.userId, false);
			setUsers((prevUsers) =>
				prevUsers.map((u) => (u._id === data.userId ? {...u, status: false} : u)),
			);
		};

		socket.on("user:disconnected", handleUserDisconnected);

		return () => {
			socket.off("user:disconnected", handleUserDisconnected);
		};
	}, []);

	const handleStatusChange = async (userId: string) => {
		try {
			setUpdatingUserId(userId);
			const userToUpdate = users.find((user) => user._id === userId);
			if (!userToUpdate) {
				showInfo("User not found");
				return;
			}

			const newStatus = !userToUpdate.status;
			const response = await patchUserStatus(userId, newStatus);

			if (response.success) {
				setUsers(
					users.map((user) =>
						user._id === userId ? {...user, status: newStatus} : user,
					),
				);
				showInfo("Status updated successfully");
			}
		} catch (error: any) {
			console.error("Update failed:", error);
			showInfo(error.response?.data?.message || "Failed to update status");
		} finally {
			setUpdatingUserId(null);
		}
	};

	const handleEdit = (userId: string) => {
		setSelectedUserId(userId);
	};

	const handleClose = () => {
		setSelectedUserId(null);
	};

	// Change role
	const changeRole = (email: string, newRole: string) => {
		patchUserRole(email, newRole)
			.then(() => {
				setUsers(
					users.map((user) =>
						user.email === email ? {...user, role: newRole} : user,
					),
				);
			})
			.catch((err) => {
				console.error("Failed to change role", err);
			});
	};

	const handleDeleteUser = async (userId: string) => {
		try {
			await deleteUserById(userId);
			setUsers((prev) => prev.filter((u) => u._id !== userId));
		} catch (error) {
			console.log(error);
		}
	};

	const filteredUsers = (users || []).filter(
		(user) =>
			user.name.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<main className='min-vh-100'>
			<div className='container-fluid my-5'>
				<h1 className='text-center display-6 rounded p-3 mb-4'>ניהול משתמשים</h1>

				{/* Search Form */}
				<SearchBox
					text={"חפש לפי שם או אימייל"}
					setSearchQuery={setSearchQuery}
					searchQuery={searchQuery}
				/>
				<TableContainer component={Paper} sx={{display: {md: "block"}}}>
					<Table aria-label='users table'>
						<TableHead>
							<TableRow>
								<StyledTableCell align='center'>שם</StyledTableCell>
								<StyledTableCell align='center'>דו"אל</StyledTableCell>
								<StyledTableCell align='center'>תפקיד</StyledTableCell>
								<StyledTableCell align='center'>סטטוס</StyledTableCell>
								<StyledTableCell align='center'>
									עריכה | מחיקה
								</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={5} align='center'>
										<CircularProgress />
									</TableCell>
								</TableRow>
							) : filteredUsers.length > 0 ? (
								filteredUsers.map((user) => (
									<StyledTableRow key={user._id} hover>
										<StyledTableCell component='th' scope='row'>
											<div
												key={user._id}
												style={{
													display: "flex",
													alignItems: "center",
												}}
											>
												<Tooltip
													title={
														user.status ? "מחובר" : "מנותק"
													}
												>
													<span
														style={{
															width: 15,
															height: 15,
															borderRadius: "50%",
															backgroundColor: user.status
																? "green"
																: "red",
															marginLeft: 8,
															display: "inline-block",
														}}
													/>
												</Tooltip>
												<span>{user.name.first}</span>
											</div>
										</StyledTableCell>
										<StyledTableCell align='center'>
											{user.email}
										</StyledTableCell>
										<StyledTableCell align='center'>
											<Box sx={{maxWidth: 100}}>
												<FormControl fullWidth>
													<Select
														value={user.role}
														onChange={(e) =>
															changeRole(
																user.email as string,
																e.target.value,
															)
														}
													>
														<MenuItem value={RoleType.Admin}>
															מנהל
														</MenuItem>
														<MenuItem
															value={RoleType.Moderator}
														>
															מודרטור
														</MenuItem>
														<MenuItem value={RoleType.Client}>
															משתמש
														</MenuItem>
													</Select>
												</FormControl>
											</Box>
										</StyledTableCell>
										<StyledTableCell align='center'>
											<Button
												color={user.status ? "success" : "error"}
												onClick={() =>
													handleStatusChange(user._id as string)
												}
												disabled={updatingUserId === user._id}
											>
												{updatingUserId === user._id ? (
													<CircularProgress size={24} />
												) : user.status ? (
													"פעיל"
												) : (
													"לא פעיל"
												)}
											</Button>
										</StyledTableCell>
										<StyledTableCell align='center'>
											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
												}}
												className=''
											>
												<Tooltip title={"עריכת פרטי משתמש"}>
													<Button
														variant='outlined'
														color='warning'
														onClick={() =>
															handleEdit(user._id as string)
														}
													>
														{fontAwesomeIcon.edit}
													</Button>
												</Tooltip>
												<Tooltip title={"מחיקת משתמש"}>
													<Button
														onClick={() =>
															handleDeleteUser(
																user._id as string,
															)
														}
														variant='outlined'
														color='error'
													>
														{fontAwesomeIcon.trash}
													</Button>
												</Tooltip>
											</Box>
										</StyledTableCell>
									</StyledTableRow>
								))
							) : (
								<StyledTableRow hover>
									<StyledTableCell align='center'>
										לא נמצאו משתמשים תואמים
									</StyledTableCell>
								</StyledTableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<Dialog
					open={!!selectedUserId}
					onClose={handleClose}
					maxWidth='md'
					dir='rtl'
					fullWidth
				>
					<DialogTitle align='center'>עריכת פרופיל משתמש</DialogTitle>
					<DialogContent>
						{selectedUserId && (
							<EditUserData userId={selectedUserId} mode='edit' />
						)}
					</DialogContent>
					<DialogActions>
						<Button variant='contained' color='error' onClick={handleClose}>
							סגור
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</main>
	);
};

export default UersManagement;
