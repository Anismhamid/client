import {Card, Grid, Typography, Chip} from "@mui/material";
import {FunctionComponent, useEffect} from "react";
import {formatDate} from "../../../../helpers/dateAndPriceFormat";
import {AuthValues} from "../../../../interfaces/authValues";
import {useTranslation} from "react-i18next";

interface UserInformationProps {
	user: AuthValues;
}

const UserInformation: FunctionComponent<UserInformationProps> = ({user}) => {
	const {t} = useTranslation();
	useEffect(() => {
		console.log(user);
	}, [user]);
	return (
		<Grid container spacing={3}>
			<Grid size={{xs: 12}}>
				<Card sx={{p: 3}}>
					<Typography variant='h6' gutterBottom color='primary'>
						معلومات الحساب
					</Typography>
					<Grid container spacing={2}>
						<Grid size={{xs: 6, md: 3}}>
							<Typography variant='body2' color='text.secondary'>
								{t("member_since")}
							</Typography>
							<Typography variant='body1' fontWeight='medium'>
								{user?.createdAt
									? formatDate(user?.createdAt)
									: "غير محدد"}
							</Typography>
						</Grid>
						<Grid size={{xs: 6, md: 3}}>
							<Typography variant='body1' color='text.secondary'>
								{t("roles.title")}
							</Typography>
							<Typography variant='body1' fontWeight='medium'>
								{t(`roles.${user.role?.toLocaleLowerCase()}`)}
							</Typography>
						</Grid>
						<Grid size={{xs: 6, md: 3}}>
							<Typography variant='body2' color='text.secondary'>
								{t("register.gender")}
							</Typography>
							<Typography variant='body1' fontWeight='medium'>
								{user.gender === "זכר"
									? t("register.male")
									: t("register.female")}
							</Typography>
						</Grid>
						<Grid size={{xs: 6, md: 3}}>
							<Typography variant='body1' color='text.secondary'>
								{t("status.title")}
							</Typography>
							<Chip
								label={
									user.status
										? t("status.active")
										: t("suauts.Inactive")
								}
								color={user.status ? "success" : "error"}
								size='small'
								variant='filled'
							/>
						</Grid>
					</Grid>
				</Card>
			</Grid>
		</Grid>
	);
};

export default UserInformation;
