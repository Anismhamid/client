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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Chip,
} from "@mui/material";
import {showError} from "../../atoms/toasts/ReactToast";
import SearchBox from "../../atoms/productsManage/SearchBox";
import EditUserData from "../../atoms/userManage/EditUserData";
import socket from "../../socket/globalSocket";
import {useNavigate} from "react-router-dom";
import Profile from "./Profile";
import {path} from "../../routes/routes";

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
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

	const navigate = useNavigate();

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

		socket.on("user:newUserLoggedIn", handleUserConnected);

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
					text={"بحث حسب الاسم أو البريد الإلكتروني"}
					setSearchQuery={setSearchQuery}
					searchQuery={searchQuery}
				/>
				<TableContainer
					component={Paper}
					sx={{boxShadow: 3, borderRadius: 3, overflowX: "auto"}}
				>
					<Table aria-label='users table'>
						<TableHead>
							<TableRow sx={{backgroundColor: "primary.main"}}>
								<StyledTableCell align='center' sx={{color: "white"}}>
									الاسم
								</StyledTableCell>
								<StyledTableCell align='center' sx={{color: "white"}}>
									البريد إلكتروني
								</StyledTableCell>
								<StyledTableCell align='center' sx={{color: "white"}}>
									الدور
								</StyledTableCell>
								<StyledTableCell align='center' sx={{color: "white"}}>
									الحاله
								</StyledTableCell>
								<StyledTableCell align='center' sx={{color: "white"}}>
									تحرير | حذف
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
									<StyledTableRow
										key={user._id}
										hover
										sx={{
											transition: "0.3s",
											"&:hover": {boxShadow: 6},
										}}
									>
										<StyledTableCell>
											<Box
												display='flex'
												alignItems='center'
												justifyContent='center'
												onClick={() =>
													navigate(
														`${path.CustomerProfile}/${user._id}`,
													)
												}
											>
												<Box
													sx={{
														width: 15,
														height: 15,
														borderRadius: "50%",
														backgroundColor: user.status
															? "green"
															: "red",
														marginRight: 1,
														cursor: "pointer",
													}}
												/>
												{user.name.first} {user.name.last}
											</Box>
										</StyledTableCell>

										<StyledTableCell align='center'>
											{user.email}
										</StyledTableCell>
										<StyledTableCell align='center'>
											<FormControl fullWidth>
												<Select
													value={user.role}
													onChange={(e) =>
														changeRole(
															user.email,
															e.target.value,
														)
													}
													sx={{borderRadius: 2}}
												>
													<MenuItem value={RoleType.Admin}>
														مدير
													</MenuItem>
													<MenuItem value={RoleType.Moderator}>
														مشرف
													</MenuItem>
													<MenuItem value={RoleType.Delivery}>
														مرسل
													</MenuItem>
													<MenuItem value={RoleType.Client}>
														مستخدم
													</MenuItem>
												</Select>
											</FormControl>
										</StyledTableCell>
										<StyledTableCell align='center'>
											<Chip
												label={user.status ? "نشط" : "غير نشط"}
												color={user.status ? "success" : "error"}
												sx={{borderRadius: 5}}
											></Chip>
										</StyledTableCell>
										<StyledTableCell align='center'>
											<Box
												display='flex'
												justifyContent='center'
												gap={1}
											>
												<Button
													variant='outlined'
													color='warning'
													onClick={() => handleEdit(user._id!)}
													sx={{borderRadius: 2}}
												>
													{fontAwesomeIcon.edit}
												</Button>
												<Button
													variant='outlined'
													color='error'
													onClick={() =>
														handleDeleteUser(user._id!)
													}
													sx={{borderRadius: 2}}
												>
													{fontAwesomeIcon.trash}
												</Button>
											</Box>
										</StyledTableCell>
									</StyledTableRow>
								))
							) : (
								<StyledTableRow>
									<StyledTableCell colSpan={5} align='center'>
										لم يتم العثور على مستخدمين متطابقين
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
					<DialogTitle align='center'>تعديل ملف تعريف</DialogTitle>
					<DialogContent>
						{selectedUserId && (
							<EditUserData userId={selectedUserId} mode='edit' />
						)}
					</DialogContent>
					<DialogActions>
						<Button variant='contained' color='error' onClick={handleClose}>
							اغلاق
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</main>
	);
};

export default UersManagement;
