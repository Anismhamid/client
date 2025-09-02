import {FunctionComponent} from "react";
import RoleType from "../../interfaces/UserType";
import {
	styled,
	TableContainer,
	tableCellClasses,
	Table,
	TableCell,
	TableBody,
	TableRow,
	Paper,
} from "@mui/material";
interface UserDetailTableProps {
	user: {
		name: {first: string; last: string};
		phone: {phone_1: string; phone_2: string};
		email: string;
		role: string;
		address: {
			city: string;
			street: string;
			houseNumber: string;
		};
	};
}

const StyledTableCell = styled(TableCell)(({theme}) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.black,
		fontSize: "1rem",
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const UserDetailTable: FunctionComponent<UserDetailTableProps> = ({user}) => {
	return (
		<TableContainer component={Paper}>
			<Table aria-label='user details table '>
				<TableBody>
					<TableRow>
						<StyledTableCell align='center'>الاسم الكامل</StyledTableCell>
						<TableCell className=' fs-5'>
							{user.name?.first} {user.name?.last}
						</TableCell>
					</TableRow>

					<TableRow>
						<StyledTableCell align='center'>هاتف</StyledTableCell>
						<TableCell className=' fs-5'>
							{user.phone.phone_1 || "-"}
						</TableCell>
					</TableRow>

					{user.phone.phone_2 && (
						<TableRow>
							<StyledTableCell>هاتف ثانوي</StyledTableCell>
							<TableCell className=' fs-5'>{user.phone.phone_2}</TableCell>
						</TableRow>
					)}

					<TableRow>
						<StyledTableCell align='center'>العنوان</StyledTableCell>
						<TableCell className=' fs-5'>
							{`البلد: ${user.address.city} شارع: ${user.address.street} رفم البيت: ${user.address.houseNumber}` ||
								"-"}
						</TableCell>
					</TableRow>

					<TableRow>
						<StyledTableCell align='center'>
							البريد الالكتروني
						</StyledTableCell>
						<TableCell className=' fs-5'>{user.email}</TableCell>
					</TableRow>

					<TableRow>
						<StyledTableCell align='center'>نوع المستخدم</StyledTableCell>
						<TableCell
							className='fs-5'
							sx={{color: "success.main", fontWeight: "bold"}}
						>
							{user.role === RoleType.Admin
								? "مدير ومشرف"
								: user.role === RoleType.Moderator
									? "مشرف"
									: user.role === RoleType.Delivery
										? "مرسل"
										: "مستخدم"}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default UserDetailTable;
