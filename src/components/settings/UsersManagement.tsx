import {FunctionComponent, useEffect, useState} from "react";
import {UserRegister} from "../../interfaces/User";
import {getAllUsers, patchUserStatus, patchUserRole} from "../../services/usersServices";
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
} from "@mui/material";
import {io} from "socket.io-client";
import {showInfo} from "../../atoms/Toast";
import {useUser} from "../../context/useUSer";
import SearchBox from "../../atoms/SearchBox";

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
	const {auth} = useUser();

	useEffect(() => {
		getAllUsers()
			.then((res) => {
				setUsers(res);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
			auth: {
				userId: auth._id,
			},
		});

		const handleUserConnected = (data: {userId: string}) => {
			setUsers((prevUsers) =>
				prevUsers.map((u) => (u._id === data.userId ? {...u, status: true} : u)),
			);
		};

		const handleUserDisconnected = (data: {userId: string}) => {
			setUsers((prevUsers) =>
				prevUsers.map((u) => (u._id === data.userId ? {...u, status: false} : u)),
			);
			patchUserStatus(data.userId, false);
		};

		socket.on("user:connected", handleUserConnected);
		socket.on("user:disconnected", handleUserDisconnected);

		return () => {
			socket.off("user:connected", handleUserConnected);
			socket.off("user:disconnected", handleUserDisconnected);
			socket.disconnect();
		};
	}, [auth._id]);

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

	const filteredUsers = (users || []).filter(
		(user) =>
			user.name.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<main className='min-vh-100'>
			<div className='container my-5'>
				<h1 className='text-center display-6 rounded p-3 mb-4'>ניהול משתמשים</h1>

				{/* Search Form */}
				<SearchBox
					text={"חפש לפי שם או אימייל"}
					setSearchQuery={setSearchQuery}
					searchQuery={searchQuery}
				/>
				{/* <div className='d-flex justify-content-center mb-4'>
					<div className='col-md-6'>
						<div className='input-group'>
							<input
								autoComplete='on'
								className='form-control border border-success'
								type='search'
								placeholder=''
								aria-label='חפש לפי שם או אימייל'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
				</div> */}
				<TableContainer component={Paper}>
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
											{user.name.first}
										</StyledTableCell>
										<StyledTableCell align='center'>
											{user.email}
										</StyledTableCell>
										<StyledTableCell align='center'>
											<Box sx={{minWidth: 120}}>
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
											<Box sx={{display: "flex"}} className=''>
												<Button color='warning'>
													{fontAwesomeIcon.edit}
												</Button>
												<Button color='error'>
													{fontAwesomeIcon.trash}
												</Button>
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
			</div>
		</main>
	);
};

export default UersManagement;
