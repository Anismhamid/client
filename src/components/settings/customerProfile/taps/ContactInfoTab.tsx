import {Avatar, Box, Card, Chip, Divider, Grid, Stack, Typography} from "@mui/material";
import {FunctionComponent} from "react";
import {Phone, Email, LocationOn} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {User} from "../../../../interfaces/usersMessages";
import {formatDate} from "../../../../helpers/dateAndPriceFormat";
interface ContactInfoTabProps {
	user: User;
}
/**
 * Users contact info tab
 * @param {user}
 * @returns ContactInfoTab
 */
const ContactInfoTab: FunctionComponent<ContactInfoTabProps> = ({user}) => {
	const {t} = useTranslation();

	return (
		<Grid container spacing={3}>
			<Grid size={{xs: 12, md: 6}}>
				<Card sx={{p: 3, borderRadius: 2, height: "100%"}}>
					<Typography
						variant='h6'
						gutterBottom
						color='primary'
						sx={{fontWeight: "bold"}}
					>
						{t("contact_info")}
					</Typography>
					<Divider sx={{mb: 2}} />
					<Stack spacing={2}>
						<Box display='flex' alignItems='center' gap={2}>
							<Avatar sx={{bgcolor: "primary.light"}}>
								<Email />
							</Avatar>
							<Box>
								<Typography variant='caption' color='text.secondary'>
									{t("email")}
								</Typography>
								<Typography variant='body1'>{user.email}</Typography>
							</Box>
						</Box>
						<Box display='flex' alignItems='center' gap={2}>
							<Avatar sx={{bgcolor: "success.light"}}>
								<Phone />
							</Avatar>
							<Box>
								<Typography variant='caption' color='text.secondary'>
									{t("phone")}
								</Typography>
								<Typography variant='body1' dir='ltr'>
									{user.phone?.phone_1}
								</Typography>
							</Box>
						</Box>
						<Box display='flex' alignItems='center' gap={2}>
							<Avatar sx={{bgcolor: "info.light"}}>
								<LocationOn />
							</Avatar>
							<Box>
								<Typography variant='caption' color='text.secondary'>
									{t("location")}
								</Typography>
								<Typography variant='body1'>
									{user.address?.city}, {user.address?.street}
								</Typography>
							</Box>
						</Box>
					</Stack>
				</Card>
			</Grid>

			<Grid size={{xs: 12, md: 6}}>
				<Card sx={{p: 3, borderRadius: 2, height: "100%"}}>
					<Typography
						variant='h6'
						gutterBottom
						color='primary'
						sx={{fontWeight: "bold"}}
					>
						{t("account_details")}
					</Typography>
					<Divider sx={{mb: 2}} />
					<Stack spacing={2}>
						<Box display='flex' justifyContent='space-between'>
							<Typography color='text.secondary'>
								{t("member_since")}:
							</Typography>
							<Typography fontWeight='medium'>
								{formatDate(user?.createdAt ?? "")}
							</Typography>
						</Box>
						<Box display='flex' justifyContent='space-between'>
							<Typography color='text.secondary'>
								{t("account_status")}:
							</Typography>
							<Chip label={t("verified")} size='small' color='success' />
						</Box>
					</Stack>
				</Card>
			</Grid>
		</Grid>
	);
};

export default ContactInfoTab;
