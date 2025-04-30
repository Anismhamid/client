import {FunctionComponent} from "react";
import RoleType from "../interfaces/UserType";

interface UserDetailTableProps {
	user: {
		name: {first: string; last: string};
		phone: {phone_1: string; phone_2: string};
		email: string;
		role: string;
	};
}

const UserDetailTable: FunctionComponent<UserDetailTableProps> = ({user}) => {
	return (
		<table className='table table-striped-columns'>
			<tbody>
				<tr>
					<th>שם מלא</th>
					<td>
						{user.name?.first} {user.name?.last}
					</td>
				</tr>
				<tr>
					<th>טלפון ראשי</th>
					<td>{user.phone?.phone_1 || "-"}</td>
				</tr>
				<tr>
					<th>טלפון נוסף</th>
					<td>{user.phone?.phone_2 || "-"}</td>
				</tr>
				<tr>
					<th>דו"אל</th>
					<td>{user.email}</td>
				</tr>
				<tr>
					<th>סוג חשבון</th>
					<td className='text-success fw-bold'>
						{user.role === RoleType.Admin
							? "מנהל ומנחה"
							: user.role === RoleType.Moderator
								? "מנחה"
								: user.role
									? "לקוח"
									: "—"}
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default UserDetailTable;
