import {Card, CardContent, Typography} from "@mui/material";
import {FunctionComponent} from "react";
import UserDetailTable from "../../../../atoms/userManage/UesrDetailsTable";
import {AuthValues} from "../../../../interfaces/authValues";

interface PersonalInformationProps {
	user: AuthValues;
}

const PersonalInformation: FunctionComponent<PersonalInformationProps> = ({user}) => {
	return (
		<Card sx={{mb: 3, borderRadius: 3}}>
			<CardContent>
				<Typography variant='h5' gutterBottom fontWeight='bold' color='primary'>
					البيانات الشخصية
				</Typography>
				<UserDetailTable user={user as any} />
			</CardContent>
		</Card>
	);
};

export default PersonalInformation;
