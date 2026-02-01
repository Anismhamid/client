import {Stack, Card, Grid, Typography, Box, Chip} from "@mui/material";
import {FunctionComponent} from "react";
import {formatDate} from "../../../../helpers/dateAndPriceFormat";
import {User} from "../../../../interfaces/usersMessages";
import {Phone, Email, LocationOn} from "@mui/icons-material";

interface UserInformationProps {
	user: User;
}

const UserInformation: FunctionComponent<UserInformationProps> = ({user}) => {
	return (
		<Grid container spacing={3}>
			<Grid size={{xs: 12, md: 6}}>
				<Card sx={{p: 3, borderRadius: 2}}>
					<Typography variant='h6' gutterBottom color='primary'>
						معلومات التواصل
					</Typography>
					<Stack spacing={2}>
						{user.email && (
							<Box display='flex' alignItems='center' gap={1}>
								<Email color='action' />
								<Typography>{user.email}</Typography>
							</Box>
						)}
						{user.phone?.phone_1 && (
							<Box display='flex' alignItems='center' gap={1}>
								<Phone color='action' />
								<Typography>{user.phone.phone_1}</Typography>
							</Box>
						)}
						{user.phone?.phone_2 && (
							<Box display='flex' alignItems='center' gap={1}>
								<Phone color='action' />
								<Typography>{user.phone.phone_2}</Typography>
							</Box>
						)}
					</Stack>
				</Card>
			</Grid>
			<Grid size={{xs: 12, md: 6}}>
				<Card sx={{p: 3, borderRadius: 2}}>
					<Typography variant='h6' gutterBottom color='primary'>
						العنوان
					</Typography>
					{user.address ? (
						<Stack spacing={1}>
							{user.address.city && (
								<Box display='flex' alignItems='center' gap={1}>
									<LocationOn color='action' />
									<Typography>
										{user.address?.street}، {user.address?.city}
										{user.address?.houseNumber &&
											`، رقم ${user.address?.houseNumber}`}
									</Typography>
								</Box>
							)}
						</Stack>
					) : (
						<Typography color='text.secondary'>لا يوجد عنوان مسجل</Typography>
					)}
				</Card>
			</Grid>
			<Grid size={{xs: 12}}>
				<Card sx={{p: 3, borderRadius: 2}}>
					<Typography variant='h6' gutterBottom color='primary'>
						معلومات الحساب
					</Typography>
					<Grid container spacing={2}>
						<Grid size={{xs: 6, md: 3}}>
							<Typography variant='body2' color='text.secondary'>
								تاريخ الانضمام
							</Typography>
							<Typography variant='body1' fontWeight='medium'>
								{user.createdAt ? formatDate(user.createdAt) : "غير محدد"}
							</Typography>
						</Grid>
						<Grid size={{xs: 6, md: 3}}>
							<Typography variant='body2' color='text.secondary'>
								الدور
							</Typography>
							<Typography variant='body1' fontWeight='medium'>
								{user.role === "Admin" ? "مدير" : "بائع"}
							</Typography>
						</Grid>
						<Grid size={{xs: 6, md: 3}}>
							<Typography variant='body2' color='text.secondary'>
								الجنس
							</Typography>
							<Typography variant='body1' fontWeight='medium'>
								{user.gender === "זכר" ? "ذكر" : "أنثى"}
							</Typography>
						</Grid>
						<Grid size={{xs: 6, md: 3}}>
							<Typography variant='body2' color='text.secondary'>
								الحالة
							</Typography>
							<Chip
								label='نشط'
								color='success'
								size='small'
								variant='outlined'
							/>
						</Grid>
					</Grid>
				</Card>
			</Grid>
		</Grid>
	);
};

export default UserInformation;
