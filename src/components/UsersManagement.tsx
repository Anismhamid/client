import {FunctionComponent, useEffect, useState} from "react";
import {UserRegister} from "../interfaces/User";
import {getAllUsers, patchUserRole} from "../services/usersServices";
import {fontAwesomeIcon} from "../FontAwesome/Icons";
import RoleType from "../interfaces/UserType";
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
} from "@mui/material";

interface UersManagementProps {}

const STATUS = {
	ACTIVE: "Active",
	INACTIVE: "Inactive",
};

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
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		getAllUsers()
			.then((res) => {
				setUsers(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const filteredUsers = (users || []).filter(
		(user) =>
			user.name.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Update user status
	const toggleStatus = (_id: string) => {
		setUsers(
			users.map((user) =>
				user._id === _id
					? {
							...user,
							status:
								user.status === STATUS.ACTIVE
									? STATUS.INACTIVE
									: STATUS.ACTIVE,
						}
					: user,
			),
		);
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

	return (
		<main className='min-vh-100'>
			<div className='container'>
				<h1 className='text-center display-6 rounded p-3 mb-4'>ניהול משתמשים</h1>

				{/* Search Form */}
				<div className='d-flex justify-content-center mb-4'>
					<div className='col-md-6'>
						<div className='input-group'>
							<input
								autoComplete='on'
								className='form-control border border-success'
								type='search'
								placeholder='חפש לפי שם או אימייל'
								aria-label='חפש לפי שם או אימייל'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
				</div>
				<TableContainer component={Paper}>
					<Table sx={{minWidth: 500}} aria-label='users table'>
						<TableHead>
							<TableRow>
								<StyledTableCell align='center'>שם</StyledTableCell>
								<StyledTableCell align='center'>דו"אל</StyledTableCell>
								<StyledTableCell align='center'>תפקיד</StyledTableCell>
								<StyledTableCell align='center'>סטטוס</StyledTableCell>
								<StyledTableCell align='center'>סטטוס</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredUsers.length > 0 ? (
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
												color='success'
												className={` ${
													user.status === "Active"
														? "text-success"
														: "text-danger"
												}`}
												onClick={() =>
													toggleStatus(user._id as string)
												}
											>
												{user.status === "Active"
													? "פעיל"
													: "לא פעיל"}
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
